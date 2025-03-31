/*
  # Add Default Tags

  1. Changes
    - Add default tags for contacts and bookings
    - Skip tag creation if they already exist
    
  2. Notes
    - Safe to run multiple times
    - Maintains existing tags
    - Only adds default tags if missing
*/

-- Insert default tags if they don't exist
WITH company_data AS (
  SELECT id FROM companies LIMIT 1
)
INSERT INTO tags (company_id, name, color, icon, category, sort_order)
SELECT 
  (SELECT id FROM company_data),
  name,
  color,
  icon,
  category,
  sort_order
FROM (
  VALUES
    -- Contact Tags
    ('VIP', '#9333EA', 'Star', 'contact', 1),
    ('Regular', '#2563EB', 'Heart', 'contact', 2),
    ('Corporate', '#0891B2', 'Briefcase', 'contact', 3),
    ('Birthday', '#D946EF', 'Cake', 'contact', 4),
    ('Allergies', '#DC2626', 'AlertTriangle', 'contact', 5),
    -- Booking Tags
    ('Special Occasion', '#F59E0B', 'Gift', 'booking', 1),
    ('Window Seat', '#10B981', 'Sun', 'booking', 2),
    ('High Chair', '#6366F1', 'Baby', 'booking', 3),
    ('Dietary Requirements', '#EF4444', 'Utensils', 'booking', 4),
    ('Late Arrival', '#8B5CF6', 'Clock', 'booking', 5)
) AS t(name, color, icon, category, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM tags 
  WHERE company_id = (SELECT id FROM company_data)
  AND name = t.name
  AND category = t.category
);