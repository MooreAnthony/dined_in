/*
  # Add Tag Relationships Schema

  1. New Tables
    - `contact_tags`: Links contacts with their tags
    - `booking_tags`: Links bookings with their tags
    
  2. Security
    - Enable RLS
    - Add policies for company-based access control
    - Maintain referential integrity
*/

-- Create contact_tags table
CREATE TABLE contact_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(contact_id, tag_id)
);

-- Create booking_tags table
CREATE TABLE booking_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(booking_id, tag_id)
);

-- Create indexes
CREATE INDEX idx_contact_tags_contact ON contact_tags(contact_id);
CREATE INDEX idx_contact_tags_tag ON contact_tags(tag_id);
CREATE INDEX idx_booking_tags_booking ON booking_tags(booking_id);
CREATE INDEX idx_booking_tags_tag ON booking_tags(tag_id);

-- Enable RLS
ALTER TABLE contact_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for contact_tags
CREATE POLICY "Users can view contact tags for their company"
  ON contact_tags FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM contacts c
      JOIN company_users cu ON cu.company_id = c.company_id
      WHERE c.id = contact_tags.contact_id
      AND cu.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage contact tags"
  ON contact_tags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM contacts c
      JOIN company_users cu ON cu.company_id = c.company_id
      WHERE c.id = contact_tags.contact_id
      AND cu.user_id = auth.uid()
      AND cu.role IN ('owner', 'admin', 'staff')
    )
  );

-- Create policies for booking_tags
CREATE POLICY "Users can view booking tags for their company"
  ON booking_tags FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      JOIN company_users cu ON cu.company_id = b.company_id
      WHERE b.id = booking_tags.booking_id
      AND cu.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage booking tags"
  ON booking_tags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      JOIN company_users cu ON cu.company_id = b.company_id
      WHERE b.id = booking_tags.booking_id
      AND cu.user_id = auth.uid()
      AND cu.role IN ('owner', 'admin', 'staff')
    )
  );

-- Update bookings view to include tags
CREATE OR REPLACE FUNCTION get_booking_with_tags(booking_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT 
    jsonb_build_object(
      'booking', jsonb_build_object(
        'id', b.id,
        'booking_reference', b.booking_reference,
        'booking_status', b.booking_status,
        'booking_seated_date', b.booking_seated_date,
        'booking_seated_time', b.booking_seated_time,
        'covers_adult', b.covers_adult,
        'covers_child', b.covers_child,
        'special_requests', b.special_requests,
        'notes', b.notes,
        'tags', COALESCE(
          (
            SELECT jsonb_agg(
              jsonb_build_object(
                'id', t.id,
                'name', t.name,
                'color', t.color,
                'icon', t.icon
              )
            )
            FROM booking_tags bt
            JOIN tags t ON t.id = bt.tag_id
            WHERE bt.booking_id = b.id
            AND t.category = 'booking'
          ),
          '[]'::jsonb
        )
      ),
      'contact', CASE 
        WHEN c.id IS NOT NULL THEN
          jsonb_build_object(
            'id', c.id,
            'first_name', c.first_name,
            'last_name', c.last_name,
            'email', c.email,
            'mobile', c.mobile,
            'tags', COALESCE(
              (
                SELECT jsonb_agg(
                  jsonb_build_object(
                    'id', t.id,
                    'name', t.name,
                    'color', t.color,
                    'icon', t.icon
                  )
                )
                FROM contact_tags ct
                JOIN tags t ON t.id = ct.tag_id
                WHERE ct.contact_id = c.id
                AND t.category = 'contact'
              ),
              '[]'::jsonb
            )
          )
        ELSE NULL
      END
    ) INTO v_result
  FROM bookings b
  LEFT JOIN contacts c ON c.id = b.contact_id
  WHERE b.id = booking_id;

  RETURN v_result;
END;
$$;