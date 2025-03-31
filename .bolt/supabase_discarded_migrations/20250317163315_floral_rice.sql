/*
  # Fix restaurant policies
  
  1. Changes
    - Drop existing policies to avoid conflicts
    - Recreate policies for restaurant_details table
    - Recreate policies for restaurant_hours table
    - Recreate policies for restaurant_categories table
    - Recreate policies for restaurant_payment_methods table
  
  2. Security Details
    - Owners and admins can create and update restaurant details
    - All authenticated users can view restaurant details they have access to
    - Owners and admins can manage hours, categories, and payment methods
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create restaurant details" ON restaurant_details;
DROP POLICY IF EXISTS "Users can view their restaurant details" ON restaurant_details;
DROP POLICY IF EXISTS "Owners can update restaurant details" ON restaurant_details;
DROP POLICY IF EXISTS "Users can manage restaurant hours" ON restaurant_hours;
DROP POLICY IF EXISTS "Users can manage restaurant categories" ON restaurant_categories;
DROP POLICY IF EXISTS "Users can manage payment methods" ON restaurant_payment_methods;

-- Recreate policies for restaurant_details
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

-- Recreate policies for restaurant_hours
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

-- Recreate policies for restaurant_categories
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

-- Recreate policies for payment methods
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