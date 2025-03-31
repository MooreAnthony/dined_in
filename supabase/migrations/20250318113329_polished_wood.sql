/*
  # Add Paginated Contacts Function

  1. New Function
    - get_paginated_contacts_v2: Returns contacts with pagination metadata
    - Supports sorting, filtering, and cursor-based pagination
    - Returns standardized response format with metadata

  2. Changes
    - Implements requested response structure
    - Includes proper data sanitization
    - Optimizes query performance with existing indexes
*/

CREATE OR REPLACE FUNCTION get_paginated_contacts_v2(
  p_company_id uuid,
  p_limit integer DEFAULT 25,
  p_cursor uuid DEFAULT NULL,
  p_sort_by text DEFAULT 'modified_at',
  p_sort_direction text DEFAULT 'desc',
  p_search text DEFAULT NULL,
  p_is_active boolean DEFAULT NULL,
  p_source text DEFAULT NULL,
  p_contact_method text DEFAULT NULL
) RETURNS json AS $$
DECLARE
  v_total_count integer;
  v_results json;
  v_next_cursor uuid;
  v_sort_direction text;
BEGIN
  -- Validate sort direction
  IF p_sort_direction NOT IN ('asc', 'desc') THEN
    RAISE EXCEPTION 'Invalid sort direction: %', p_sort_direction;
  END IF;

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

  -- Get results with cursor-based pagination
  WITH filtered_contacts AS (
    SELECT 
      c.id,
      c.first_name,
      c.last_name,
      c.email,
      c.mobile,
      COALESCE(c.street_address, '') || 
      CASE 
        WHEN c.city IS NOT NULL THEN ', ' || c.city
        ELSE ''
      END ||
      CASE 
        WHEN c.state IS NOT NULL THEN ', ' || c.state
        ELSE ''
      END ||
      CASE 
        WHEN c.postal_code IS NOT NULL THEN ' ' || c.postal_code
        ELSE ''
      END ||
      CASE 
        WHEN c.country IS NOT NULL THEN ', ' || c.country
        ELSE ''
      END as address,
      c.created_at,
      c.modified_at
    FROM contacts c
    WHERE c.company_id = p_company_id
      AND (p_cursor IS NULL OR 
        CASE WHEN p_sort_direction = 'desc' THEN
          CASE 
            WHEN p_sort_by = 'modified_at' THEN c.modified_at < (SELECT modified_at FROM contacts WHERE id = p_cursor)
            WHEN p_sort_by = 'created_at' THEN c.created_at < (SELECT created_at FROM contacts WHERE id = p_cursor)
            ELSE c.id < p_cursor
          END
        ELSE
          CASE 
            WHEN p_sort_by = 'modified_at' THEN c.modified_at > (SELECT modified_at FROM contacts WHERE id = p_cursor)
            WHEN p_sort_by = 'created_at' THEN c.created_at > (SELECT created_at FROM contacts WHERE id = p_cursor)
            ELSE c.id > p_cursor
          END
        END)
      AND (p_search IS NULL OR 
           c.first_name ILIKE '%' || p_search || '%' OR
           c.last_name ILIKE '%' || p_search || '%' OR
           c.email ILIKE '%' || p_search || '%' OR
           c.company_name ILIKE '%' || p_search || '%')
      AND (p_is_active IS NULL OR c.is_active = p_is_active)
      AND (p_source IS NULL OR c.contact_source = p_source)
      AND (p_contact_method IS NULL OR c.preferred_contact_method = p_contact_method)
    ORDER BY 
      CASE 
        WHEN p_sort_by = 'modified_at' AND p_sort_direction = 'desc' THEN c.modified_at END DESC,
      CASE 
        WHEN p_sort_by = 'modified_at' AND p_sort_direction = 'asc' THEN c.modified_at END ASC,
      CASE 
        WHEN p_sort_by = 'created_at' AND p_sort_direction = 'desc' THEN c.created_at END DESC,
      CASE 
        WHEN p_sort_by = 'created_at' AND p_sort_direction = 'asc' THEN c.created_at END ASC,
      CASE 
        WHEN p_sort_direction = 'desc' THEN c.id END DESC,
      CASE 
        WHEN p_sort_direction = 'asc' THEN c.id END ASC
    LIMIT p_limit + 1
  )
  SELECT 
    json_agg(
      json_build_object(
        'id', fc.id,
        'firstName', fc.first_name,
        'lastName', fc.last_name,
        'email', fc.email,
        'phone', fc.mobile,
        'address', fc.address,
        'createdAt', fc.created_at,
        'updatedAt', fc.modified_at
      )
    ),
    array_agg(fc.id) INTO v_results, v_next_cursor
  FROM (
    SELECT * FROM filtered_contacts
    LIMIT p_limit
  ) fc;

  -- Build response
  RETURN json_build_object(
    'data', json_build_object(
      'total', v_total_count,
      'cursor', CASE 
        WHEN array_length(v_next_cursor, 1) = p_limit THEN 
          v_next_cursor[array_length(v_next_cursor, 1)]
        ELSE 
          NULL 
      END,
      'limit', p_limit
    ),
    'results', COALESCE(v_results, '[]'::json)
  );
END;
$$ LANGUAGE plpgsql;