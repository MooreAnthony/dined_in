/*
  # Add email column to profiles table

  1. Changes
    - Add email column to profiles table
    - Add unique constraint on email
    - Add index for email lookups
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add email column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
    ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);
    CREATE INDEX idx_profiles_email ON profiles (email);
  END IF;
END $$;