/*
  # Auth and Agency Schema Setup

  1. New Tables
    - `agencies`
      - Core agency information
      - RLS enabled with policies
    - `employees` 
      - Employee profiles linked to auth.users
      - RLS enabled with policies
    - `roles`
      - Employee role assignments
      - RLS enabled with policies
    - `trainings`
      - Employee training records
      - RLS enabled with policies
    - `documents`
      - Document storage and management
      - RLS enabled with policies

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
    - Link employees to auth.users

  3. Changes
    - Add auth.uid foreign key to employees
    - Add proper constraints and indexes
*/

-- Create Agencies Table
CREATE TABLE agencies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    tax_id TEXT NOT NULL,
    license_number TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by uuid NOT NULL REFERENCES auth.users(id),
    updated_by uuid NOT NULL REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

-- Create Employees Table with Auth Link
CREATE TABLE employees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id uuid NOT NULL REFERENCES auth.users(id),
    agency_id uuid NOT NULL REFERENCES agencies(id),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    contact_info TEXT NOT NULL,
    start_date DATE NOT NULL,
    special_designation TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'pending', 'terminated')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by uuid NOT NULL REFERENCES auth.users(id),
    updated_by uuid NOT NULL REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create Roles Table
CREATE TABLE roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id uuid NOT NULL REFERENCES employees(id),
    name TEXT NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by uuid NOT NULL REFERENCES auth.users(id),
    updated_by uuid NOT NULL REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Create Documents Table First (since trainings reference it)
CREATE TABLE documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id uuid NOT NULL REFERENCES agencies(id),
    employee_id uuid NOT NULL REFERENCES employees(id),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    owner TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'archived', 'expired')),
    expires_at DATE,
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by uuid NOT NULL REFERENCES auth.users(id),
    updated_by uuid NOT NULL REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create Trainings Table
CREATE TABLE trainings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id uuid NOT NULL REFERENCES employees(id),
    provider TEXT NOT NULL,
    training_name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'expired')),
    document_id uuid REFERENCES documents(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by uuid NOT NULL REFERENCES auth.users(id),
    updated_by uuid NOT NULL REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

-- Create indexes for foreign keys and frequently queried fields
CREATE INDEX idx_employees_auth_id ON employees(auth_id);
CREATE INDEX idx_employees_agency_id ON employees(agency_id);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_roles_employee_id ON roles(employee_id);
CREATE INDEX idx_trainings_employee_id ON trainings(employee_id);
CREATE INDEX idx_documents_agency_id ON documents(agency_id);
CREATE INDEX idx_documents_employee_id ON documents(employee_id);

-- RLS Policies

-- Agencies policies
CREATE POLICY "Users can view their agency"
    ON agencies FOR SELECT
    TO authenticated
    USING (
        id IN (
            SELECT agency_id 
            FROM employees 
            WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Admin users can update their agency"
    ON agencies FOR UPDATE
    TO authenticated
    USING (
        id IN (
            SELECT agency_id 
            FROM employees 
            WHERE auth_id = auth.uid() 
            AND role = 'admin'
        )
    )
    WITH CHECK (
        id IN (
            SELECT agency_id 
            FROM employees 
            WHERE auth_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Employees policies
CREATE POLICY "Users can view employees in their agency"
    ON employees FOR SELECT
    TO authenticated
    USING (
        agency_id IN (
            SELECT agency_id 
            FROM employees 
            WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Admin users can manage employees in their agency"
    ON employees FOR ALL
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

-- Roles policies
CREATE POLICY "Users can view roles in their agency"
    ON roles FOR SELECT
    TO authenticated
    USING (
        employee_id IN (
            SELECT id 
            FROM employees 
            WHERE agency_id IN (
                SELECT agency_id 
                FROM employees 
                WHERE auth_id = auth.uid()
            )
        )
    );

CREATE POLICY "Admin users can manage roles in their agency"
    ON roles FOR ALL
    TO authenticated
    USING (
        employee_id IN (
            SELECT id 
            FROM employees 
            WHERE agency_id IN (
                SELECT agency_id 
                FROM employees 
                WHERE auth_id = auth.uid() 
                AND role = 'admin'
            )
        )
    )
    WITH CHECK (
        employee_id IN (
            SELECT id 
            FROM employees 
            WHERE agency_id IN (
                SELECT agency_id 
                FROM employees 
                WHERE auth_id = auth.uid() 
                AND role = 'admin'
            )
        )
    );

-- Documents policies
CREATE POLICY "Users can view documents in their agency"
    ON documents FOR SELECT
    TO authenticated
    USING (
        agency_id IN (
            SELECT agency_id 
            FROM employees 
            WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own documents"
    ON documents FOR ALL
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

-- Trainings policies
CREATE POLICY "Users can view trainings in their agency"
    ON trainings FOR SELECT
    TO authenticated
    USING (
        employee_id IN (
            SELECT id 
            FROM employees 
            WHERE agency_id IN (
                SELECT agency_id 
                FROM employees 
                WHERE auth_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage their own trainings"
    ON trainings FOR ALL
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

-- Functions

-- Function to handle employee creation after auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO employees (
        auth_id,
        agency_id,
        name,
        role,
        email,
        contact_info,
        start_date,
        status,
        created_by,
        updated_by
    )
    VALUES (
        NEW.id,
        NULL, -- Will be updated when user is assigned to agency
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'pending', -- Default role
        NEW.email,
        '{}', -- Empty contact info
        CURRENT_DATE,
        'pending',
        NEW.id,
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create employee record on auth signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_agencies_updated_at
    BEFORE UPDATE ON agencies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainings_updated_at
    BEFORE UPDATE ON trainings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();