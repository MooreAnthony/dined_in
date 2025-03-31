/*
  # Update RLS policies for companies table

  1. Security Changes
    - Drop existing policies to avoid conflicts
    - Enable RLS on companies table
    - Add policies for:
      - Inserting new companies (authenticated users)
      - Updating companies (company owners)
      - Reading companies (company users)

  2. Notes
    - Authenticated users can create companies
    - Only company owners can update company details
    - Company users can read company details
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create companies" ON companies;
DROP POLICY IF EXISTS "Company owners can update their companies" ON companies;
DROP POLICY IF EXISTS "Users can read companies they belong to" ON companies;

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert companies
CREATE POLICY "Users can create companies"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow company owners to update their companies
CREATE POLICY "Company owners can update their companies"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = companies.id
      AND company_users.user_id = auth.uid()
      AND company_users.role = 'owner'
    )
  );

-- Allow company users to read their companies
CREATE POLICY "Users can read companies they belong to"
  ON companies
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = companies.id
      AND company_users.user_id = auth.uid()
    )
  );