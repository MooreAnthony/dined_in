/*
  # Add Locations Management Schema

  1. New Tables
    - `locations`
      - Basic information (name, reference, type)
      - Contact details (phone, website)
      - Address information
      - Coordinates
      - Settings and configuration
    
  2. Security
    - Enable RLS
    - Add policies for company-based access control
*/

-- Create locations table
CREATE TABLE locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  client_reference text NOT NULL,
  public_name text NOT NULL,
  internal_name text NOT NULL,
  venue_group text,
  venue_type text NOT NULL,
  website_url text,
  phone text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL,
  latitude numeric,
  longitude numeric,
  currency_code text NOT NULL,
  reservation_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  modified_at timestamptz DEFAULT now(),
  modified_by uuid REFERENCES auth.users(id),
  UNIQUE(company_id, client_reference)
);

-- Create location_photos table for managing photos
CREATE TABLE location_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  url text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for locations
CREATE POLICY "Users can view locations for their company"
  ON locations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = locations.company_id
      AND company_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage locations"
  ON locations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = locations.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('owner', 'admin', 'staff')
    )
  );

-- Create policies for location photos
CREATE POLICY "Users can view location photos"
  ON location_photos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM locations l
      JOIN company_users cu ON cu.company_id = l.company_id
      WHERE l.id = location_photos.location_id
      AND cu.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage location photos"
  ON location_photos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM locations l
      JOIN company_users cu ON cu.company_id = l.company_id
      WHERE l.id = location_photos.location_id
      AND cu.user_id = auth.uid()
      AND cu.role IN ('owner', 'admin', 'staff')
    )
  );

-- Create indexes
CREATE INDEX idx_locations_company ON locations(company_id);
CREATE INDEX idx_locations_reference ON locations(company_id, client_reference);
CREATE INDEX idx_location_photos_location ON location_photos(location_id);