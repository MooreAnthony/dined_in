/*
  # Add Company Settings Schema

  1. New Tables
    - `company_settings`
      - Time zone configuration
      - Currency settings
      - System-wide defaults
    
  2. Security
    - Enable RLS
    - Add policies for company owners and admins
*/

-- Create company_settings table
CREATE TABLE company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE UNIQUE,
  timezone text NOT NULL DEFAULT 'UTC',
  currency_code text NOT NULL DEFAULT 'USD',
  created_at timestamptz DEFAULT now(),
  modified_at timestamptz DEFAULT now(),
  modified_by uuid REFERENCES auth.users(id)
);

-- Create function to update modified_at timestamp
CREATE OR REPLACE FUNCTION update_company_settings_modified_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = now();
  NEW.modified_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for modified_at
CREATE TRIGGER update_company_settings_modified_at
  BEFORE UPDATE ON company_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_company_settings_modified_at();

-- Enable RLS
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Company owners and admins can manage settings"
  ON company_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = company_settings.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('owner', 'admin')
    )
  );

-- Insert default settings for existing companies
INSERT INTO company_settings (company_id)
SELECT id FROM companies
WHERE NOT EXISTS (
  SELECT 1 FROM company_settings WHERE company_settings.company_id = companies.id
);