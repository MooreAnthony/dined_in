/*
  # Create Bookings Management Schema

  1. New Tables
    - `bookings`
      - Core booking information
      - Customer details
      - Status tracking
      - Company association
    - `tables`
      - Restaurant table management
      - Capacity tracking
    
  2. Security
    - Enable RLS
    - Add policies for company-based access control
*/

-- Create tables table
CREATE TABLE tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  location text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(company_id, name)
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  table_id uuid REFERENCES tables(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  guests integer NOT NULL CHECK (guests > 0),
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  special_requests text,
  notes text,
  created_at timestamptz DEFAULT now(),
  modified_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  modified_by uuid REFERENCES auth.users(id)
);

-- Create indexes
CREATE INDEX idx_bookings_company_date ON bookings(company_id, booking_date, booking_time);
CREATE INDEX idx_bookings_status ON bookings(company_id, status);
CREATE INDEX idx_bookings_customer ON bookings(company_id, customer_name, customer_email);
CREATE INDEX idx_tables_company ON tables(company_id);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

-- Create policies for tables
CREATE POLICY "Users can view tables for their company"
  ON tables FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = tables.company_id
      AND company_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage tables"
  ON tables FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = tables.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('owner', 'admin', 'staff')
    )
  );

-- Create policies for bookings
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

-- Create function to update modified_at timestamp
CREATE OR REPLACE FUNCTION update_booking_modified_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = now();
  NEW.modified_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for modified_at
CREATE TRIGGER update_booking_modified_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_modified_at();