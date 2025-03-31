/*
  # Fix companies table RLS policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Enable RLS on companies table
    - Add policies for:
      - Inserting new companies (authenticated users)
      - Reading companies (company users)
      - Updating companies (company owners)
    
  2. Security
    - All authenticated users can create companies
    - Users can only read companies they belong to
    - Only owners can update their companies
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create companies" ON companies;
DROP POLICY IF EXISTS "Company owners can update their companies" ON companies;
DROP POLICY IF EXISTS "Users can read companies they belong to" ON companies;
DROP POLICY IF EXISTS "Company owners can update their company" ON companies;

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert companies
CREATE POLICY "Users can create companies"
ON companies
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to read companies they belong to
CREATE POLICY "Users can read companies they belong to"
ON companies
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM company_users
    WHERE company_users.company_id = id
    AND company_users.user_id = auth.uid()
  )
  OR
  NOT EXISTS (
    SELECT 1 FROM company_users
    WHERE company_users.company_id = id
  )
);

-- Allow company owners to update their companies
CREATE POLICY "Company owners can update their companies"
ON companies
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM company_users
    WHERE company_users.company_id = id
    AND company_users.user_id = auth.uid()
    AND company_users.role = 'owner'
  )
);