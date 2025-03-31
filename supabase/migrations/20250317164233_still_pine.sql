/*
  # Fix Company Creation Policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Add policy for company creation
    - Add policy for company updates
    - Add policy for company reading
  
  2. Security
    - Allow authenticated users to create companies
    - Allow company owners to update their companies
    - Allow users to read companies they belong to
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create companies" ON companies;
DROP POLICY IF EXISTS "Company owners can update their companies" ON companies;
DROP POLICY IF EXISTS "Users can read companies they belong to" ON companies;

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Users can create companies"
ON companies
FOR INSERT
TO authenticated
WITH CHECK (true);

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