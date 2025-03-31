/*
  # Add API Users Management Schema

  1. New Tables
    - `providers`: Available API providers
    - `api_users`: API user accounts with tokens
    
  2. Security
    - Enable RLS
    - Add policies for company owners and admins
*/

-- Create providers table
CREATE TABLE providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create api_users table
CREATE TABLE api_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES providers(id) ON DELETE RESTRICT,
  email text NOT NULL,
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(company_id, email)
);

-- Create indexes
CREATE INDEX idx_api_users_company ON api_users(company_id);
CREATE INDEX idx_api_users_provider ON api_users(provider_id);
CREATE INDEX idx_api_users_token ON api_users(token);

-- Enable RLS
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "All users can view active providers"
  ON providers FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can view API users for their company"
  ON api_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = api_users.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Owners and admins can manage API users"
  ON api_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = api_users.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('owner', 'admin')
    )
  );

-- Insert default providers
INSERT INTO providers (name, code) VALUES
  ('Point of Sale', 'pos'),
  ('Booking Widget', 'booking'),
  ('Analytics', 'analytics'),
  ('Marketing', 'marketing');