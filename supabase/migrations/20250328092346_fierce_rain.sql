/*
  # Add Tags Management Schema

  1. New Tables
    - `tags`
      - Basic information (name, color, icon)
      - Category (contact/booking)
      - Company association
      - Sort order for drag-and-drop
    
  2. Security
    - Enable RLS
    - Add policies for company-based access control
*/

-- Create tags table
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL CHECK (category IN ('contact', 'booking')),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  modified_at timestamptz DEFAULT now(),
  modified_by uuid REFERENCES auth.users(id),
  UNIQUE(company_id, category, name)
);

-- Create indexes
CREATE INDEX idx_tags_company ON tags(company_id);
CREATE INDEX idx_tags_category ON tags(company_id, category);
CREATE INDEX idx_tags_sort_order ON tags(company_id, category, sort_order);

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view tags for their company"
  ON tags FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = tags.company_id
      AND company_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage tags"
  ON tags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.company_id = tags.company_id
      AND company_users.user_id = auth.uid()
      AND company_users.role IN ('owner', 'admin', 'staff')
    )
  );

-- Create function to update modified_at timestamp
CREATE OR REPLACE FUNCTION update_tag_modified_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = now();
  NEW.modified_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for modified_at
CREATE TRIGGER trg_tag_modified_at
  BEFORE UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION update_tag_modified_at();

-- Insert default tags
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
) AS t(name, color, icon, category, sort_order);