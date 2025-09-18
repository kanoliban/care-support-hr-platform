/*
  # Seed Database with Initial Data
  
  1. Changes
    - Create demo agency
    - Create sample employees with null auth_id
    - Create sample clients
    - Create sample appointments and documents
    
  Note: This migration only adds data, no schema changes
*/

-- Create agency
INSERT INTO agencies (
  id,
  name,
  address,
  tax_id,
  license_number,
  created_at,
  updated_at,
  created_by,
  updated_by
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'CareSupport Demo Agency',
  '123 Healthcare Ave, Austin, TX 78701',
  '12-3456789',
  'HC123456',
  NOW(),
  NOW(),
  (SELECT id FROM auth.users LIMIT 1), -- Use existing user from auth table
  (SELECT id FROM auth.users LIMIT 1)  -- Use existing user from auth table
);

-- Create sample employees
INSERT INTO employees (
  id,
  auth_id,
  agency_id,
  name,
  role,
  email,
  contact_info,
  start_date,
  status,
  created_at,
  updated_at,
  created_by,
  updated_by
) VALUES
  (
    '22222222-2222-2222-2222-222222222222',
    NULL,
    '11111111-1111-1111-1111-111111111111',
    'Jane Smith, RN',
    'caregiver',
    'jane.smith@caresupport.com',
    '{"phone": "512-555-0124", "address": "124 Nurse St, Austin, TX 78701"}',
    '2024-01-15',
    'active',
    NOW(),
    NOW(),
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1)
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    NULL,
    '11111111-1111-1111-1111-111111111111',
    'Robert Wilson, CNA',
    'caregiver',
    'robert.wilson@caresupport.com',
    '{"phone": "512-555-0125", "address": "125 Aide St, Austin, TX 78701"}',
    '2024-02-01',
    'active',
    NOW(),
    NOW(),
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1)
  );

-- Create sample clients
INSERT INTO clients (
  id,
  agency_id,
  name,
  address,
  latitude,
  longitude,
  date_of_birth,
  conditions,
  billing_info,
  medicare_id,
  evv_required,
  evv_method,
  status,
  created_at,
  updated_at,
  created_by,
  updated_by
) VALUES
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'John Smith',
    '126 Client St, Austin, TX 78701',
    30.2672,
    -97.7431,
    '1945-06-15',
    '["Type 2 Diabetes", "Hypertension"]',
    '{"insurance": "Medicare", "policy_number": "1234567890"}',
    'MED123456',
    true,
    'gps',
    'active',
    NOW(),
    NOW(),
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1)
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Mary Johnson',
    '127 Client St, Austin, TX 78701',
    30.2672,
    -97.7431,
    '1950-03-20',
    '["COPD", "Arthritis"]',
    '{"insurance": "Medicaid", "policy_number": "0987654321"}',
    'MED654321',
    true,
    'telephony',
    'active',
    NOW(),
    NOW(),
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1)
  );

-- Create sample appointments
INSERT INTO appointments (
  id,
  agency_id,
  client_id,
  employee_id,
  start_time,
  end_time,
  scheduled_duration,
  services,
  status,
  evv_method,
  evv_status,
  created_at,
  updated_at,
  created_by,
  updated_by
) VALUES
  (
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '1 day' + INTERVAL '8 hours',
    INTERVAL '8 hours',
    '["Medication Administration", "Vital Signs"]',
    'scheduled',
    'gps',
    'pending',
    NOW(),
    NOW(),
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1)
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    '11111111-1111-1111-1111-111111111111',
    '55555555-5555-5555-5555-555555555555',
    '33333333-3333-3333-3333-333333333333',
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '2 days' + INTERVAL '4 hours',
    INTERVAL '4 hours',
    '["Personal Care", "Light Housekeeping"]',
    'scheduled',
    'telephony',
    'pending',
    NOW(),
    NOW(),
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1)
  );

-- Create sample documents
INSERT INTO documents (
  id,
  agency_id,
  employee_id,
  name,
  category,
  owner,
  status,
  expires_at,
  file_url,
  created_at,
  updated_at,
  created_by,
  updated_by
) VALUES
  (
    '88888888-8888-8888-8888-888888888888',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'RN License',
    'credential',
    'Jane Smith',
    'active',
    '2025-06-15',
    'https://example.com/documents/rn-license.pdf',
    NOW(),
    NOW(),
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1)
  ),
  (
    '99999999-9999-9999-9999-999999999999',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'CNA Certification',
    'credential',
    'Robert Wilson',
    'active',
    '2025-01-15',
    'https://example.com/documents/cna-cert.pdf',
    NOW(),
    NOW(),
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1)
  );

-- Create sample trainings
INSERT INTO trainings (
  id,
  employee_id,
  provider,
  training_name,
  description,
  status,
  document_id,
  created_at,
  updated_at,
  created_by,
  updated_by
) VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '22222222-2222-2222-2222-222222222222',
    'CareSupport Training',
    'Medication Administration',
    'Annual medication administration certification',
    'completed',
    '88888888-8888-8888-8888-888888888888',
    NOW(),
    NOW(),
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1)
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '33333333-3333-3333-3333-333333333333',
    'CareSupport Training',
    'Personal Care Skills',
    'Basic personal care and hygiene training',
    'completed',
    '99999999-9999-9999-9999-999999999999',
    NOW(),
    NOW(),
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1)
  );

-- Create sample invoices
INSERT INTO invoices (
  id,
  agency_id,
  client_id,
  billing_period_start,
  billing_period_end,
  amount,
  payment_method,
  payment_status,
  payer_id,
  created_at,
  updated_at,
  created_by,
  updated_by
) VALUES
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444444',
    DATE_TRUNC('month', NOW()),
    DATE_TRUNC('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 day',
    1250.00,
    'insurance',
    'pending',
    'MED123456',
    NOW(),
    NOW(),
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1)
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '11111111-1111-1111-1111-111111111111',
    '55555555-5555-5555-5555-555555555555',
    DATE_TRUNC('month', NOW()),
    DATE_TRUNC('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 day',
    850.00,
    'insurance',
    'pending',
    'MED654321',
    NOW(),
    NOW(),
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1)
  );