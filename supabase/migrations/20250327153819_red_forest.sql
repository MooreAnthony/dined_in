/*
  # Add Sample Bookings Data

  1. Changes
    - Insert sample bookings for Ants Rum Shack
    - Include varied booking types, sources, and statuses
    - Add realistic customer data and payment information
    
  2. Notes
    - Uses existing contacts and locations
    - Includes past, current, and future bookings
    - Maintains referential integrity
*/

-- Insert sample booking occasions
WITH company_data AS (
  SELECT id FROM companies WHERE name = 'Ants Rum Shack' LIMIT 1
)
INSERT INTO booking_occasions (company_id, name)
SELECT 
  (SELECT id FROM company_data),
  name
FROM (
  VALUES
    ('Birthday'),
    ('Anniversary'),
    ('Business Meeting'),
    ('Date Night'),
    ('Family Gathering'),
    ('Special Occasion'),
    ('Group Dining'),
    ('Private Event')
) AS t(name)
WHERE NOT EXISTS (
  SELECT 1 FROM booking_occasions 
  WHERE company_id = (SELECT id FROM company_data)
);

-- Insert sample bookings
WITH company_data AS (
  SELECT id FROM companies WHERE name = 'Ants Rum Shack' LIMIT 1
),
location_data AS (
  SELECT id FROM locations WHERE company_id = (SELECT id FROM company_data) LIMIT 1
),
contact_data AS (
  SELECT id FROM contacts WHERE company_id = (SELECT id FROM company_data) LIMIT 10
),
occasion_data AS (
  SELECT name FROM booking_occasions WHERE company_id = (SELECT id FROM company_data)
)
INSERT INTO bookings (
  company_id,
  location_id,
  contact_id,
  external_reference,
  booking_source,
  booking_type,
  booking_occasion,
  booking_seated_date,
  booking_seated_time,
  datetime_of_slot,
  time_slot_iso,
  booking_status,
  covers_adult,
  covers_child,
  arrived_guests,
  deposit_required,
  deposit_amount_required,
  deposit_paid,
  total_payment,
  total_net_payment,
  total_gross_payment,
  duration,
  tags,
  pos_tickets,
  seated_time,
  left_time
)
SELECT
  (SELECT id FROM company_data),
  (SELECT id FROM location_data),
  -- Randomly select a contact
  (SELECT id FROM contact_data ORDER BY random() LIMIT 1),
  -- Generate external reference for some bookings
  CASE WHEN random() < 0.3 THEN 'EXT-' || lpad(i::text, 5, '0') ELSE NULL END,
  -- Booking source
  CASE mod(i, 4)
    WHEN 0 THEN 'In house'
    WHEN 1 THEN 'Online'
    WHEN 2 THEN 'Phone'
    ELSE 'Internal'
  END,
  -- Booking type
  CASE WHEN random() < 0.8 THEN 'Table' ELSE 'Function' END,
  -- Booking occasion (randomly select from occasions)
  (SELECT name FROM occasion_data ORDER BY random() LIMIT 1),
  -- Booking date (-30 to +30 days from now)
  current_date + (i - 25)::integer,
  -- Booking time (17:00 to 21:00)
  time '17:00' + (interval '30 minutes' * mod(i, 9)),
  -- datetime_of_slot
  (current_date + (i - 25)::integer + time '17:00' + (interval '30 minutes' * mod(i, 9)))::timestamptz,
  -- time_slot_iso (e.g., "2025-03-27T17:00:00")
  to_char(
    (current_date + (i - 25)::integer + time '17:00' + (interval '30 minutes' * mod(i, 9)))::timestamptz,
    'YYYY-MM-DD"T"HH24:MI:SS'
  ),
  -- Booking status
  CASE
    WHEN current_date + (i - 25)::integer < current_date THEN
      CASE mod(i, 10)
        WHEN 0 THEN 'Cancelled'
        WHEN 1 THEN 'No Show'
        ELSE 'Complete'
      END
    ELSE
      CASE mod(i, 5)
        WHEN 0 THEN 'New'
        WHEN 1 THEN 'Pending'
        WHEN 2 THEN 'Enquiry'
        ELSE 'Arrived'
      END
  END,
  -- Covers (adults and children)
  CASE 
    WHEN mod(i, 10) = 0 THEN 8
    WHEN mod(i, 5) = 0 THEN 6
    WHEN mod(i, 2) = 0 THEN 4
    ELSE 2
  END,
  CASE WHEN random() < 0.3 THEN floor(random() * 3)::integer ELSE 0 END,
  -- Arrived guests (for completed bookings)
  CASE 
    WHEN current_date + (i - 25)::integer < current_date 
    THEN floor(random() * 8 + 1)::integer
    ELSE NULL
  END,
  -- Deposit details
  CASE WHEN random() < 0.2 THEN true ELSE false END,
  CASE WHEN random() < 0.2 THEN (random() * 100)::numeric(10,2) ELSE NULL END,
  CASE WHEN random() < 0.2 THEN (random() * 100)::numeric(10,2) ELSE 0 END,
  -- Payment details (for completed bookings)
  CASE 
    WHEN current_date + (i - 25)::integer < current_date 
    THEN (random() * 500)::numeric(10,2)
    ELSE 0
  END,
  CASE 
    WHEN current_date + (i - 25)::integer < current_date 
    THEN (random() * 400)::numeric(10,2)
    ELSE 0
  END,
  CASE 
    WHEN current_date + (i - 25)::integer < current_date 
    THEN (random() * 600)::numeric(10,2)
    ELSE 0
  END,
  -- Duration (90-180 minutes)
  90 + (floor(random() * 4)::integer * 30),
  -- Tags
  CASE WHEN random() < 0.3 
    THEN ARRAY['VIP', 'Special Request', 'Dietary Requirements']
    ELSE NULL
  END,
  -- POS tickets
  CASE WHEN random() < 0.3 
    THEN '[{"id": "123", "amount": 150.00, "items": ["Food", "Drinks"]}]'::jsonb
    ELSE NULL
  END,
  -- Seated and left times (for completed bookings)
  CASE 
    WHEN current_date + (i - 25)::integer < current_date 
    THEN (current_date + (i - 25)::integer + time '17:00' + (interval '30 minutes' * mod(i, 9)))::timestamptz
    ELSE NULL
  END,
  CASE 
    WHEN current_date + (i - 25)::integer < current_date 
    THEN (current_date + (i - 25)::integer + time '19:00' + (interval '30 minutes' * mod(i, 9)))::timestamptz
    ELSE NULL
  END
FROM generate_series(1, 50) i;