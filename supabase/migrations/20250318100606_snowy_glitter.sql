/*
  # Add example contacts data

  1. Changes
    - Insert sample contacts data with realistic information
    - Includes various contact sources, consent states, and contact methods
    - Adds contacts for the test company
  
  2. Notes
    - All contacts are associated with existing companies
    - Includes a mix of active and inactive contacts
    - Contains test profiles for development
*/

-- Insert example contacts
INSERT INTO contacts (
  company_id,
  first_name,
  last_name,
  email,
  birthday_month,
  birthday_day,
  mobile,
  company_name,
  contact_source,
  street_address,
  city,
  state,
  postal_code,
  country,
  email_consent,
  email_consent_timestamp,
  sms_consent,
  sms_consent_timestamp,
  preferred_contact_method,
  notes,
  last_contact_date,
  is_active,
  is_test_profile
) 
SELECT
  -- Get the company ID for the test restaurant
  (SELECT id FROM companies LIMIT 1),
  -- Generate different names
  CASE mod(i, 5)
    WHEN 0 THEN 'John'
    WHEN 1 THEN 'Sarah'
    WHEN 2 THEN 'Michael'
    WHEN 3 THEN 'Emma'
    ELSE 'David'
  END,
  CASE mod(i, 5)
    WHEN 0 THEN 'Smith'
    WHEN 1 THEN 'Johnson'
    WHEN 2 THEN 'Williams'
    WHEN 3 THEN 'Brown'
    ELSE 'Jones'
  END,
  -- Generate unique emails
  format('contact%s@example.com', i),
  -- Random birthday month (1-12)
  mod(i, 12) + 1,
  -- Random birthday day (1-28 to be safe)
  mod(i, 28) + 1,
  -- Generate phone numbers
  format('+1%s', lpad(cast((9000000000 + i) as text), 10, '0')),
  -- Company names
  CASE mod(i, 4)
    WHEN 0 THEN 'Tech Corp'
    WHEN 1 THEN 'Global Industries'
    WHEN 2 THEN 'Local Business'
    ELSE 'Startup Inc'
  END,
  -- Contact sources
  CASE mod(i, 4)
    WHEN 0 THEN 'Website'
    WHEN 1 THEN 'Referral'
    WHEN 2 THEN 'Event'
    ELSE 'Other'
  END,
  -- Address information
  format('%s Main St', (i + 100)),
  CASE mod(i, 3)
    WHEN 0 THEN 'New York'
    WHEN 1 THEN 'Los Angeles'
    ELSE 'Chicago'
  END,
  CASE mod(i, 3)
    WHEN 0 THEN 'NY'
    WHEN 1 THEN 'CA'
    ELSE 'IL'
  END,
  -- Generate ZIP codes
  lpad(cast((10000 + i) as text), 5, '0'),
  'US',
  -- Consent flags
  mod(i, 2) = 0,
  CASE WHEN mod(i, 2) = 0 THEN now() - interval '1 day' * mod(i, 30) ELSE NULL END,
  mod(i, 3) = 0,
  CASE WHEN mod(i, 3) = 0 THEN now() - interval '1 day' * mod(i, 30) ELSE NULL END,
  -- Preferred contact method
  CASE mod(i, 3)
    WHEN 0 THEN 'Email'
    WHEN 1 THEN 'SMS'
    ELSE 'Phone'
  END,
  -- Notes
  format('Example contact %s with custom notes', i),
  -- Last contact date (random within last 30 days)
  now() - interval '1 day' * mod(i, 30),
  -- Active status (80% active)
  mod(i, 5) != 0,
  -- Test profiles (every 10th contact)
  mod(i, 10) = 0
FROM generate_series(1, 50) i;