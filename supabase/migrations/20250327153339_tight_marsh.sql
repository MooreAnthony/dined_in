/*
  # Enhanced Bookings Schema

  1. New Tables
    - `booking_occasions`: Configurable occasions per company
    - Updated `bookings` table with:
      - Reference handling
      - Location tracking
      - Contact association
      - Financial tracking
      - Status management
      - Timing details
      - Guest tracking
      - Metadata
    
  2. Security
    - Enable RLS
    - Add policies for company-based access
*/

-- Create booking_occasions table
CREATE TABLE booking_occasions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(company_id, name)
);

-- Drop existing bookings table if it exists
DROP TABLE IF EXISTS bookings CASCADE;

-- Create enhanced bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference text NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  location_group_id uuid REFERENCES venue_groups(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  external_reference text,
  booking_source text NOT NULL CHECK (booking_source IN ('In house', 'Online', 'Phone', 'Internal')),
  booking_type text NOT NULL CHECK (booking_type IN ('Table', 'Function')),
  booking_occasion text,
  booking_seated_date date NOT NULL,
  booking_seated_time time NOT NULL,
  datetime_of_slot timestamptz NOT NULL,
  time_slot_iso text NOT NULL,
  booking_status text NOT NULL CHECK (
    booking_status IN ('New', 'Pending', 'Enquiry', 'No Show', 'Arrived', 'Complete', 'Cancelled')
  ),
  covers_adult integer NOT NULL DEFAULT 0,
  covers_child integer NOT NULL DEFAULT 0,
  arrived_guests integer,
  deposit_required boolean DEFAULT false,
  deposit_amount_required decimal(10,2),
  deposit_paid decimal(10,2) DEFAULT 0,
  total_payment decimal(10,2) DEFAULT 0,
  total_net_payment decimal(10,2) DEFAULT 0,
  total_gross_payment decimal(10,2) DEFAULT 0,
  duration integer, -- in minutes
  tags text[],
  pos_tickets jsonb,
  seated_time timestamptz,
  left_time timestamptz,
  updated timestamptz DEFAULT now(),
  created timestamptz DEFAULT now(),
  deleted timestamptz,
  UNIQUE(company_id, booking_reference)
);

-- Enable RLS
ALTER TABLE booking_occasions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_bookings_company ON bookings(company_id);
CREATE INDEX idx_bookings_location ON bookings(location_id);
CREATE INDEX idx_bookings_contact ON bookings(contact_id);
CREATE INDEX idx_bookings_reference ON bookings(company_id, booking_reference);
CREATE INDEX idx_bookings_date ON bookings(company_id, booking_seated_date, booking_seated_time);
CREATE INDEX idx_bookings_status ON bookings(company_id, booking_status);
CREATE INDEX idx_bookings_source ON bookings(company_id, booking_source);
CREATE INDEX idx_booking_occasions_company ON booking_occasions(company_id);

-- Create function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS text AS $$
DECLARE
  chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,U,V,W,X,Y,Z}';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || chars[1+random()*(array_length(chars, 1)-1)];
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set booking reference
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
DECLARE
  ref text;
  done boolean;
BEGIN
  done := false;
  WHILE NOT done LOOP
    ref := generate_booking_reference();
    BEGIN
      NEW.booking_reference := ref;
      done := true;
    EXCEPTION WHEN unique_violation THEN
      -- If we get a duplicate, try again
    END;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_booking_reference
  BEFORE INSERT ON bookings
  FOR EACH ROW
  WHEN (NEW.booking_reference IS NULL)
  EXECUTE FUNCTION set_booking_reference();

-- Create trigger to update the modified timestamp
CREATE OR REPLACE FUNCTION update_booking_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_booking_timestamp
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_timestamp();

-- Create policies
CREATE POLICY "Users can view bookings for their company"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = bookings.company_id
      AND company_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = bookings.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('owner', 'admin', 'staff')
    )
  );

CREATE POLICY "Staff can manage booking occasions"
  ON booking_occasions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = booking_occasions.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('owner', 'admin', 'staff')
    )
  );