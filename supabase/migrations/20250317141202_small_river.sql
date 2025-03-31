/*
  # Add profiles insert policy

  1. Changes
    - Add RLS policy to allow new users to create their own profile
  
  2. Security
    - Users can only insert their own profile with matching auth.uid()
    - Maintains existing RLS policies for select and update
*/

-- Enable RLS if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Add policy for inserting profiles
CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);