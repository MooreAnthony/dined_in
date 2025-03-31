/*
  # Add User Invitations Schema

  1. New Tables
    - `user_invitations`
      - Invitation details (email, role, status)
      - Expiration tracking
      - Company association
    
  2. Security
    - Enable RLS
    - Add policies for company owners and admins
*/

-- Create user_invitations table
CREATE TABLE user_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  mobile text NOT NULL,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(company_id, email)
);

-- Enable RLS
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_user_invitations_company ON user_invitations(company_id);
CREATE INDEX idx_user_invitations_email ON user_invitations(email);
CREATE INDEX idx_user_invitations_token ON user_invitations(token);
CREATE INDEX idx_user_invitations_status ON user_invitations(company_id, status);

-- Create policies
CREATE POLICY "Owners and admins can manage invitations"
  ON user_invitations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = user_invitations.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('owner', 'admin')
    )
  );

-- Create function to clean up expired invitations
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS void AS $$
BEGIN
  UPDATE user_invitations
  SET status = 'expired'
  WHERE status = 'pending'
  AND expires_at < now();
END;
$$ LANGUAGE plpgsql;