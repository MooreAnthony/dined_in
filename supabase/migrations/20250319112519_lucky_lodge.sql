/*
  # Add Sample Bookings Data

  1. Changes
    - Insert sample tables for "Ants Rum Shack"
    - Generate 100 realistic bookings
    - Include varied statuses and guest counts
    
  2. Notes
    - Uses realistic customer data
    - Includes past and future bookings
    - Maintains referential integrity
*/

-- Insert sample tables
WITH company_data AS (
  SELECT id FROM companies WHERE name = 'Ants Rum Shack' LIMIT 1
)
INSERT INTO tables (company_id, name, capacity, location)
SELECT 
  (SELECT id FROM company_data),
  name,
  capacity,
  location
FROM (
  VALUES
    ('Table 1', 2, 'Window'),
    ('Table 2', 2, 'Window'),
    ('Table 3', 4, 'Main Floor'),
    ('Table 4', 4, 'Main Floor'),
    ('Table 5', 6, 'Main Floor'),
    ('Table 6', 6, 'Main Floor'),
    ('Table 7', 8, 'Private Area'),
    ('Table 8', 8, 'Private Area'),
    ('Bar 1', 2, 'Bar'),
    ('Bar 2', 2, 'Bar')
) AS t(name, capacity, location);

-- Insert sample bookings
WITH company_data AS (
  SELECT id FROM companies WHERE name = 'Ants Rum Shack' LIMIT 1
),
table_data AS (
  SELECT id, capacity 
  FROM tables 
  WHERE company_id = (SELECT id FROM company_data)
)
INSERT INTO bookings (
  company_id,
  table_id,
  customer_name,
  customer_email,
  customer_phone,
  booking_date,
  booking_time,
  guests,
  status,
  special_requests,
  notes,
  created_at
)
SELECT
  (SELECT id FROM company_data),
  -- Randomly assign tables based on capacity
  (
    SELECT id FROM table_data 
    WHERE capacity >= 
      CASE 
        WHEN mod(i, 10) = 0 THEN 8
        WHEN mod(i, 5) = 0 THEN 6
        WHEN mod(i, 2) = 0 THEN 4
        ELSE 2
      END
    ORDER BY random() 
    LIMIT 1
  ),
  -- Generate customer names
  CASE mod(i, 10)
    WHEN 0 THEN 'John Smith'
    WHEN 1 THEN 'Emma Wilson'
    WHEN 2 THEN 'Michael Brown'
    WHEN 3 THEN 'Sarah Davis'
    WHEN 4 THEN 'James Johnson'
    WHEN 5 THEN 'Lisa Anderson'
    WHEN 6 THEN 'David Miller'
    WHEN 7 THEN 'Jennifer Taylor'
    WHEN 8 THEN 'Robert Martin'
    ELSE 'Emily White'
  END,
  -- Generate emails
  format(
    '%s.%s@example.com',
    LOWER(CASE mod(i, 10)
      WHEN 0 THEN 'john.smith'
      WHEN 1 THEN 'emma.wilson'
      WHEN 2 THEN 'michael.brown'
      WHEN 3 THEN 'sarah.davis'
      WHEN 4 THEN 'james.johnson'
      WHEN 5 THEN 'lisa.anderson'
      WHEN 6 THEN 'david.miller'
      WHEN 7 THEN 'jennifer.taylor'
      WHEN 8 THEN 'robert.martin'
      ELSE 'emily.white'
    END),
    mod(i, 100)
  ),
  -- Generate phone numbers
  format('+1%s', lpad(cast((9000000000 + i) as text), 10, '0')),
  -- Generate dates (-30 to +30 days from now)
  current_date + (i - 50)::integer,
  -- Generate times (17:00 to 21:00)
  time '17:00' + (interval '30 minutes' * mod(i, 9)),
  -- Generate guest count
  CASE 
    WHEN mod(i, 10) = 0 THEN 8
    WHEN mod(i, 5) = 0 THEN 6
    WHEN mod(i, 2) = 0 THEN 4
    ELSE 2
  END,
  -- Generate status
  CASE
    WHEN current_date + (i - 50)::integer < current_date THEN
      CASE mod(i, 10)
        WHEN 0 THEN 'cancelled'
        WHEN 1 THEN 'no_show'
        ELSE 'completed'
      END
    ELSE
      CASE mod(i, 5)
        WHEN 0 THEN 'pending'
        ELSE 'confirmed'
      END
  END,
  -- Generate special requests
  CASE mod(i, 5)
    WHEN 0 THEN 'Birthday celebration'
    WHEN 1 THEN 'Window seat preferred'
    WHEN 2 THEN 'Allergic to nuts'
    WHEN 3 THEN 'Anniversary dinner'
    ELSE null
  END,
  -- Generate notes
  CASE mod(i, 4)
    WHEN 0 THEN 'Regular customer'
    WHEN 1 THEN 'First time visitor'
    WHEN 2 THEN 'VIP guest'
    ELSE null
  END,
  -- Generate created_at timestamps
  now() - interval '1 hour' * mod(i, 24)
FROM generate_series(1, 100) i;