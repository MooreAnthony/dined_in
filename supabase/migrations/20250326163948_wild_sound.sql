/*
  # Add Sample Venue Groups Data

  1. Changes
    - Insert sample venue groups for existing companies
    - Add varied descriptions and types
    - Link existing locations to venue groups
    
  2. Notes
    - Uses realistic venue group names
    - Maintains referential integrity
    - Preserves existing data
*/

-- Insert sample venue groups
WITH company_data AS (
  SELECT id FROM companies LIMIT 1
)
INSERT INTO venue_groups (
  company_id,
  name,
  description
)
SELECT 
  (SELECT id FROM company_data),
  name,
  description
FROM (
  VALUES
    ('Downtown Venues', 'Prime locations in the heart of the city center'),
    ('Waterfront Collection', 'Stunning venues with waterfront views and outdoor spaces'),
    ('Historic District', 'Charming venues in historic buildings and landmarks'),
    ('Modern Urban', 'Contemporary spaces in trendy urban neighborhoods'),
    ('Resort Properties', 'Luxury venues in resort and hotel settings')
) AS t(name, description)
WHERE NOT EXISTS (
  SELECT 1 FROM venue_groups 
  WHERE company_id = (SELECT id FROM company_data)
);

-- Update some existing locations to use venue groups
WITH company_data AS (
  SELECT id FROM companies LIMIT 1
),
venue_data AS (
  SELECT id, name 
  FROM venue_groups 
  WHERE company_id = (SELECT id FROM company_data)
)
UPDATE locations
SET venue_group_id = (
  CASE 
    WHEN city ILIKE '%downtown%' OR address_line1 ILIKE '%main%'
      THEN (SELECT id FROM venue_data WHERE name = 'Downtown Venues')
    WHEN address_line1 ILIKE '%water%' OR address_line1 ILIKE '%beach%'
      THEN (SELECT id FROM venue_data WHERE name = 'Waterfront Collection')
    WHEN address_line1 ILIKE '%historic%' OR address_line1 ILIKE '%old%'
      THEN (SELECT id FROM venue_data WHERE name = 'Historic District')
    WHEN address_line1 ILIKE '%new%' OR address_line1 ILIKE '%modern%'
      THEN (SELECT id FROM venue_data WHERE name = 'Modern Urban')
    ELSE (SELECT id FROM venue_data WHERE name = 'Resort Properties')
  END
)
WHERE company_id = (SELECT id FROM company_data)
AND venue_group_id IS NULL
AND random() < 0.7; -- Only update 70% of locations to leave some unassigned