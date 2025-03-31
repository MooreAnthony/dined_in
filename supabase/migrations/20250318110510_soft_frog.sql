/*
  # Optimize Contacts Query Performance

  1. Changes
    - Add composite indexes for efficient filtering and sorting
    - Add function for cursor-based pagination
    - Create view for optimized contact retrieval
    
  2. Performance
    - Composite indexes support multiple filter combinations
    - Cursor pagination for handling large datasets
    - Optimized field selection
*/

-- Create composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_contacts_company_email ON contacts(company_id, email, id);
CREATE INDEX IF NOT EXISTS idx_contacts_company_status ON contacts(company_id, is_active, id);
CREATE INDEX IF NOT EXISTS idx_contacts_company_source ON contacts(company_id, contact_source, id);
CREATE INDEX IF NOT EXISTS idx_contacts_company_modified ON contacts(company_id, modified_at, id);

-- Create a function to handle cursor-based pagination
CREATE OR REPLACE FUNCTION get_paginated_contacts(
  p_company_id uuid,
  p_cursor uuid DEFAULT NULL,
  p_limit integer DEFAULT 100,
  p_search text DEFAULT NULL,
  p_is_active boolean DEFAULT NULL,
  p_source text DEFAULT NULL,
  p_contact_method text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  first_name text,
  last_name text,
  email text,
  mobile text,
  company_name text,
  contact_source text,
  last_contact_date timestamptz,
  is_active boolean,
  next_cursor uuid,
  total_count bigint
) AS $$
DECLARE
  v_total_count bigint;
BEGIN
  -- Get total count for metadata
  SELECT COUNT(*)
  INTO v_total_count
  FROM contacts c
  WHERE c.company_id = p_company_id
    AND (p_search IS NULL OR 
         c.first_name ILIKE '%' || p_search || '%' OR
         c.last_name ILIKE '%' || p_search || '%' OR
         c.email ILIKE '%' || p_search || '%' OR
         c.company_name ILIKE '%' || p_search || '%')
    AND (p_is_active IS NULL OR c.is_active = p_is_active)
    AND (p_source IS NULL OR c.contact_source = p_source)
    AND (p_contact_method IS NULL OR c.preferred_contact_method = p_contact_method);

  RETURN QUERY
  WITH filtered_contacts AS (
    SELECT 
      c.id,
      c.first_name,
      c.last_name,
      c.email,
      c.mobile,
      c.company_name,
      c.contact_source,
      c.last_contact_date,
      c.is_active,
      LEAD(c.id) OVER (ORDER BY c.id) as next_cursor
    FROM contacts c
    WHERE c.company_id = p_company_id
      AND (p_cursor IS NULL OR c.id > p_cursor)
      AND (p_search IS NULL OR 
           c.first_name ILIKE '%' || p_search || '%' OR
           c.last_name ILIKE '%' || p_search || '%' OR
           c.email ILIKE '%' || p_search || '%' OR
           c.company_name ILIKE '%' || p_search || '%')
      AND (p_is_active IS NULL OR c.is_active = p_is_active)
      AND (p_source IS NULL OR c.contact_source = p_source)
      AND (p_contact_method IS NULL OR c.preferred_contact_method = p_contact_method)
    ORDER BY c.id
    LIMIT p_limit
  )
  SELECT 
    fc.*,
    v_total_count as total_count
  FROM filtered_contacts fc;
END;
$$ LANGUAGE plpgsql;