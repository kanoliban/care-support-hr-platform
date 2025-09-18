/*
  # Remove Database Triggers
  
  1. Changes
    - Remove all triggers from tables
    - Remove trigger functions
    
  Note: This migration only removes triggers, preserving table structure and data
*/

-- Drop triggers from tables
DROP TRIGGER IF EXISTS update_agencies_updated_at ON agencies;
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
DROP TRIGGER IF EXISTS update_trainings_updated_at ON trainings;
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop trigger functions
DROP FUNCTION IF EXISTS update_updated_at_column;
DROP FUNCTION IF EXISTS handle_new_user;