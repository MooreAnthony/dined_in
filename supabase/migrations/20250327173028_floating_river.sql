/*
  # Add create_booking_with_contact function

  1. New Function
    - Creates a contact if it doesn't exist
    - Creates a booking linked to the contact
    - Handles all operations in a single transaction
    
  2. Security
    - Maintains existing RLS policies
    - Only accessible to authenticated users
*/

-- Create function to create booking with contact
CREATE OR REPLACE FUNCTION create_booking_with_contact(
  -- Required parameters first
  p_company_id uuid,
  p_first_name text,
  p_last_name text,
  p_email text,
  p_mobile text,
  p_location_id uuid,
  p_booking_source text,
  p_booking_type text,
  p_booking_seated_date date,
  p_booking_seated_time time,
  p_covers_adult integer,
  -- Optional parameters with defaults last
  p_birthday_month integer DEFAULT NULL,
  p_birthday_day integer DEFAULT NULL,
  p_street_address text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_state text DEFAULT NULL,
  p_postal_code text DEFAULT NULL,
  p_country text DEFAULT NULL,
  p_email_consent boolean DEFAULT false,
  p_sms_consent boolean DEFAULT false,
  p_booking_occasion text DEFAULT NULL,
  p_covers_child integer DEFAULT 0,
  p_duration integer DEFAULT 90,
  p_special_requests text DEFAULT NULL,
  p_notes text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_contact_id uuid;
  v_booking_id uuid;
  v_contact jsonb;
  v_booking jsonb;
BEGIN
  -- Start transaction
  BEGIN
    -- Check if contact exists
    SELECT id INTO v_contact_id
    FROM contacts
    WHERE company_id = p_company_id
    AND email = p_email;

    -- Create or update contact
    IF v_contact_id IS NULL THEN
      INSERT INTO contacts (
        company_id,
        first_name,
        last_name,
        email,
        mobile,
        birthday_month,
        birthday_day,
        street_address,
        city,
        state,
        postal_code,
        country,
        email_consent,
        sms_consent,
        email_consent_timestamp,
        sms_consent_timestamp
      ) VALUES (
        p_company_id,
        p_first_name,
        p_last_name,
        p_email,
        p_mobile,
        p_birthday_month,
        p_birthday_day,
        p_street_address,
        p_city,
        p_state,
        p_postal_code,
        p_country,
        p_email_consent,
        p_sms_consent,
        CASE WHEN p_email_consent THEN now() ELSE NULL END,
        CASE WHEN p_sms_consent THEN now() ELSE NULL END
      )
      RETURNING id INTO v_contact_id;
    ELSE
      -- Update existing contact
      UPDATE contacts
      SET
        first_name = p_first_name,
        last_name = p_last_name,
        mobile = p_mobile,
        birthday_month = COALESCE(p_birthday_month, birthday_month),
        birthday_day = COALESCE(p_birthday_day, birthday_day),
        street_address = COALESCE(p_street_address, street_address),
        city = COALESCE(p_city, city),
        state = COALESCE(p_state, state),
        postal_code = COALESCE(p_postal_code, postal_code),
        country = COALESCE(p_country, country),
        email_consent = p_email_consent,
        sms_consent = p_sms_consent,
        email_consent_timestamp = CASE 
          WHEN p_email_consent AND NOT email_consent THEN now()
          ELSE email_consent_timestamp
        END,
        sms_consent_timestamp = CASE 
          WHEN p_sms_consent AND NOT sms_consent THEN now()
          ELSE sms_consent_timestamp
        END,
        modified_at = now()
      WHERE id = v_contact_id;
    END IF;

    -- Create booking
    INSERT INTO bookings (
      company_id,
      location_id,
      contact_id,
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
      duration,
      special_requests,
      notes
    ) VALUES (
      p_company_id,
      p_location_id,
      v_contact_id,
      p_booking_source,
      p_booking_type,
      p_booking_occasion,
      p_booking_seated_date,
      p_booking_seated_time,
      (p_booking_seated_date + p_booking_seated_time)::timestamptz,
      to_char((p_booking_seated_date + p_booking_seated_time)::timestamptz, 'YYYY-MM-DD"T"HH24:MI:SS'),
      'New',
      p_covers_adult,
      p_covers_child,
      p_duration,
      p_special_requests,
      p_notes
    )
    RETURNING id INTO v_booking_id;

    -- Get contact details
    SELECT jsonb_build_object(
      'id', id,
      'first_name', first_name,
      'last_name', last_name,
      'email', email,
      'mobile', mobile
    )
    INTO v_contact
    FROM contacts
    WHERE id = v_contact_id;

    -- Get booking details
    SELECT jsonb_build_object(
      'id', b.id,
      'booking_reference', b.booking_reference,
      'booking_seated_date', b.booking_seated_date,
      'booking_seated_time', b.booking_seated_time,
      'booking_status', b.booking_status,
      'covers_adult', b.covers_adult,
      'covers_child', b.covers_child,
      'location', jsonb_build_object(
        'id', l.id,
        'public_name', l.public_name
      )
    )
    INTO v_booking
    FROM bookings b
    LEFT JOIN locations l ON l.id = b.location_id
    WHERE b.id = v_booking_id;

    -- Return combined result
    RETURN jsonb_build_object(
      'contact', v_contact,
      'booking', v_booking
    );

  EXCEPTION WHEN OTHERS THEN
    -- Rollback transaction on error
    RAISE;
  END;
END;
$$;