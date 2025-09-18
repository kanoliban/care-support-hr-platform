/*
  # EVV and Client Management Schema

  1. New Tables
    - `clients`: Client information and EVV requirements
    - `appointments`: EVV visit verification and scheduling
    - `invoices`: Billing for verified services
    - `appointment_documents`: Junction table for appointment documentation

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
    - Link to existing agency and employee tables

  3. Changes
    - Add proper foreign key relationships
    - Add EVV-specific fields
    - Add indexes for performance
*/

-- Create Clients Table
CREATE TABLE clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id uuid NOT NULL REFERENCES agencies(id),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    description TEXT,
    date_of_birth DATE NOT NULL,
    conditions JSONB DEFAULT '[]'::jsonb,
    billing_info JSONB NOT NULL,
    ssn TEXT, -- Should be encrypted in application layer
    medicare_id TEXT,
    medicaid_id TEXT,
    evv_required BOOLEAN NOT NULL DEFAULT true,
    evv_method TEXT CHECK (evv_method IN ('gps', 'telephony', 'fixed_device')),
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by uuid NOT NULL REFERENCES auth.users(id),
    updated_by uuid NOT NULL REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create Appointments Table
CREATE TABLE appointments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id uuid NOT NULL REFERENCES agencies(id),
    client_id uuid NOT NULL REFERENCES clients(id),
    employee_id uuid NOT NULL REFERENCES employees(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    scheduled_duration INTERVAL NOT NULL,
    actual_duration INTERVAL,
    check_in_time TIMESTAMPTZ,
    check_out_time TIMESTAMPTZ,
    check_in_location JSONB,
    check_out_location JSONB,
    evv_method TEXT CHECK (evv_method IN ('gps', 'telephony', 'fixed_device')),
    evv_status TEXT CHECK (evv_status IN ('pending', 'verified', 'flagged', 'manual_override')),
    services JSONB NOT NULL DEFAULT '[]'::jsonb,
    notes TEXT,
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by uuid NOT NULL REFERENCES auth.users(id),
    updated_by uuid NOT NULL REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create Invoices Table
CREATE TABLE invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id uuid NOT NULL REFERENCES agencies(id),
    client_id uuid NOT NULL REFERENCES clients(id),
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT,
    payment_status TEXT NOT NULL CHECK (payment_status IN ('draft', 'pending', 'paid', 'denied', 'void')),
    denial_reason TEXT,
    payer_id TEXT,
    claim_number TEXT,
    submission_date TIMESTAMPTZ,
    paid_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by uuid NOT NULL REFERENCES auth.users(id),
    updated_by uuid NOT NULL REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create Appointment Documents Junction Table
CREATE TABLE appointment_documents (
    appointment_id uuid NOT NULL REFERENCES appointments(id),
    document_id uuid NOT NULL REFERENCES documents(id),
    document_type TEXT NOT NULL CHECK (document_type IN ('care_notes', 'evv_verification', 'incident_report', 'signature')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by uuid NOT NULL REFERENCES auth.users(id),
    PRIMARY KEY (appointment_id, document_id)
);

-- Enable RLS
ALTER TABLE appointment_documents ENABLE ROW LEVEL SECURITY;

-- Add new columns to documents table for EVV relationships
ALTER TABLE documents ADD COLUMN client_id uuid REFERENCES clients(id);
ALTER TABLE documents ADD COLUMN appointment_id uuid REFERENCES appointments(id);
ALTER TABLE documents ADD COLUMN invoice_id uuid REFERENCES invoices(id);

-- Create Indexes
CREATE INDEX idx_clients_agency_id ON clients(agency_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_appointments_agency_id ON appointments(agency_id);
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_employee_id ON appointments(employee_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_evv_status ON appointments(evv_status);
CREATE INDEX idx_invoices_agency_id ON invoices(agency_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_billing_period ON invoices(billing_period_start, billing_period_end);
CREATE INDEX idx_invoices_status ON invoices(payment_status);

-- RLS Policies

-- Clients policies
CREATE POLICY "Users can view clients in their agency"
    ON clients FOR SELECT
    TO authenticated
    USING (
        agency_id IN (
            SELECT agency_id 
            FROM employees 
            WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Admin users can manage clients in their agency"
    ON clients FOR ALL
    TO authenticated
    USING (
        agency_id IN (
            SELECT agency_id 
            FROM employees 
            WHERE auth_id = auth.uid() 
            AND role = 'admin'
        )
    )
    WITH CHECK (
        agency_id IN (
            SELECT agency_id 
            FROM employees 
            WHERE auth_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Appointments policies
CREATE POLICY "Users can view appointments in their agency"
    ON appointments FOR SELECT
    TO authenticated
    USING (
        agency_id IN (
            SELECT agency_id 
            FROM employees 
            WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Caregivers can manage their own appointments"
    ON appointments FOR ALL
    TO authenticated
    USING (
        employee_id IN (
            SELECT id 
            FROM employees 
            WHERE auth_id = auth.uid()
        )
    )
    WITH CHECK (
        employee_id IN (
            SELECT id 
            FROM employees 
            WHERE auth_id = auth.uid()
        )
    );

-- Invoices policies
CREATE POLICY "Users can view invoices in their agency"
    ON invoices FOR SELECT
    TO authenticated
    USING (
        agency_id IN (
            SELECT agency_id 
            FROM employees 
            WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Admin users can manage invoices in their agency"
    ON invoices FOR ALL
    TO authenticated
    USING (
        agency_id IN (
            SELECT agency_id 
            FROM employees 
            WHERE auth_id = auth.uid() 
            AND role = 'admin'
        )
    )
    WITH CHECK (
        agency_id IN (
            SELECT agency_id 
            FROM employees 
            WHERE auth_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Appointment Documents policies
CREATE POLICY "Users can view appointment documents in their agency"
    ON appointment_documents FOR SELECT
    TO authenticated
    USING (
        appointment_id IN (
            SELECT id 
            FROM appointments 
            WHERE agency_id IN (
                SELECT agency_id 
                FROM employees 
                WHERE auth_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage their appointment documents"
    ON appointment_documents FOR ALL
    TO authenticated
    USING (
        appointment_id IN (
            SELECT id 
            FROM appointments 
            WHERE employee_id IN (
                SELECT id 
                FROM employees 
                WHERE auth_id = auth.uid()
            )
        )
    )
    WITH CHECK (
        appointment_id IN (
            SELECT id 
            FROM appointments 
            WHERE employee_id IN (
                SELECT id 
                FROM employees 
                WHERE auth_id = auth.uid()
            )
        )
    );

-- Add updated_at triggers
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();