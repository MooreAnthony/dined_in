/*
  # Add Venue Groups Management

  1. New Tables
    - `venue_groups`
      - Basic information (name, description)
      - Company association
      - Audit fields (created/modified)

  2. Changes
    - Add foreign key constraint to locations table
    - Update existing venue_group column
    
  3. Security
    - Enable RLS
    - Add policies for company-based access
*/

-- Create venue_groups table
CREATE TABLE venue_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  modified_at timestamptz DEFAULT now(),
  modified_by uuid REFERENCES auth.users(id),
  UNIQUE(company_id, name)
);

-- Create indexes
CREATE INDEX idx_venue_groups_company ON venue_groups(company_id);

-- Enable RLS
ALTER TABLE venue_groups ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view venue groups for their company"
  ON venue_groups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = venue_groups.company_id
      AND company_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage venue groups"
  ON venue_groups FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = venue_groups.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('owner', 'admin', 'staff')
    )
  );

-- Update locations table to use foreign key
ALTER TABLE locations ADD COLUMN venue_group_id uuid REFERENCES venue_groups(id) ON DELETE SET NULL;
CREATE INDEX idx_locations_venue_group ON locations(venue_group_id);