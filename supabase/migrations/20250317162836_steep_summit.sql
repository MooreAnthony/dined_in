/*
  # Add restaurant details schema
  
  1. New Tables
    - `restaurant_details`
      - Basic information (name, cuisine type, description)
      - Contact details (phone, email, website)
      - Address information
      - Operating status
    - `restaurant_hours`
      - Operating hours for each day
    - `restaurant_categories`
      - Menu categories
    - `payment_methods`
      - Available payment methods
    
  2. Security
    - Enable RLS on all tables
    - Add policies for restaurant owners and staff
*/

-- Restaurant Details Table
CREATE TABLE restaurant_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  cuisine_type text NOT NULL,
  description text,
  phone text NOT NULL,
  email text,
  website text,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text,
  postal_code text NOT NULL,
  country text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Operating Hours Table
CREATE TABLE restaurant_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurant_details(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  opens_at time NOT NULL,
  closes_at time NOT NULL,
  is_closed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Menu Categories Table
CREATE TABLE restaurant_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurant_details(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Payment Methods Table
CREATE TABLE restaurant_payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurant_details(id) ON DELETE CASCADE,
  method text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE restaurant_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_payment_methods ENABLE ROW LEVEL SECURITY;

-- Policies for restaurant_details
CREATE POLICY "Users can create restaurant details"
  ON restaurant_details
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = restaurant_details.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can view their restaurant details"
  ON restaurant_details
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = restaurant_details.company_id
      AND company_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can update restaurant details"
  ON restaurant_details
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = restaurant_details.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('owner', 'admin')
    )
  );

-- Policies for restaurant_hours
CREATE POLICY "Users can manage restaurant hours"
  ON restaurant_hours
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurant_details rd
      JOIN company_users cu ON cu.company_id = rd.company_id
      WHERE rd.id = restaurant_hours.restaurant_id
      AND cu.user_id = auth.uid()
      AND cu.role IN ('owner', 'admin')
    )
  );

-- Policies for restaurant_categories
CREATE POLICY "Users can manage restaurant categories"
  ON restaurant_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurant_details rd
      JOIN company_users cu ON cu.company_id = rd.company_id
      WHERE rd.id = restaurant_categories.restaurant_id
      AND cu.user_id = auth.uid()
      AND cu.role IN ('owner', 'admin')
    )
  );

-- Policies for payment methods
CREATE POLICY "Users can manage payment methods"
  ON restaurant_payment_methods
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurant_details rd
      JOIN company_users cu ON cu.company_id = rd.company_id
      WHERE rd.id = restaurant_payment_methods.restaurant_id
      AND cu.user_id = auth.uid()
      AND cu.role IN ('owner', 'admin')
    )
  );