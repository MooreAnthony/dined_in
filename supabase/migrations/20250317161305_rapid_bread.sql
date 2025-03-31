/*
  # Add company_users RLS policies

  1. Security Changes
    - Enable RLS on company_users table
    - Add policies for:
      - Inserting new company_user records (authenticated users)
      - Reading company_user records (own records only)

  2. Notes
    - Allows users to create company_user associations
    - Users can only read their own company_user records
*/

-- Enable RLS
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert company_user records
CREATE POLICY "Users can create company user records"
  ON company_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own company_user records
CREATE POLICY "Users can read their own company user records"
  ON company_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);