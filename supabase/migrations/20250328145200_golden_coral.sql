/*
  # Fix Tags RLS Policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Add new policies for:
      - Viewing tags (all authenticated users in company)
      - Managing tags (staff, admin, owner roles)
    
  2. Security
    - Maintains company-based access control
    - Allows proper read access for all company users
    - Restricts write access to appropriate roles
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view tags for their company" ON tags;
DROP POLICY IF EXISTS "Staff can manage tags" ON tags;

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view tags for their company"
  ON tags FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = tags.company_id
      AND company_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage tags"
  ON tags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = tags.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('owner', 'admin', 'staff')
    )
  );