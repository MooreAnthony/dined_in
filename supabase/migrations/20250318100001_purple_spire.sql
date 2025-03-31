/*
  # Create Contacts Management Schema

  1. New Tables
    - `contacts`
      - Basic information (first name, last name, email)
      - Personal details (date of birth, mobile)
      - Business information (company)
      - Address information
      - Communication preferences
      - System fields (created, modified, status)

  2. Security
    - Enable RLS
    - Add policies for company-based access control
*/

-- Create contacts table
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  birthday_month integer CHECK (birthday_month BETWEEN 1 AND 12),
  birthday_day integer CHECK (birthday_day BETWEEN 1 AND 31),
  mobile text NOT NULL,
  company_name text,
  contact_source text CHECK (contact_source IN ('Website', 'Referral', 'Event', 'Other')),
  street_address text,
  city text,
  state text,
  postal_code text,
  country text,
  email_consent boolean DEFAULT false,
  email_consent_timestamp timestamptz,
  sms_consent boolean DEFAULT false,
  sms_consent_timestamp timestamptz,
  preferred_contact_method text CHECK (preferred_contact_method IN ('Email', 'SMS', 'Phone')),
  notes text,
  created_at timestamptz DEFAULT now(),
  modified_at timestamptz DEFAULT now(),
  last_contact_date timestamptz,
  is_active boolean DEFAULT true,
  is_test_profile boolean DEFAULT false,
  UNIQUE(company_id, email)
);

-- Create index for improved query performance
CREATE INDEX idx_contacts_company_id ON contacts(company_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_name ON contacts(last_name, first_name);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view contacts for their companies"
ON contacts FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM company_users
    WHERE company_users.company_id = contacts.company_id
    AND company_users.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create contacts for their companies"
ON contacts FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM company_users
    WHERE company_users.company_id = contacts.company_id
    AND company_users.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update contacts for their companies"
ON contacts FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM company_users
    WHERE company_users.company_id = contacts.company_id
    AND company_users.user_id = auth.uid()
  )
);

-- Create function to update modified_at timestamp
CREATE OR REPLACE FUNCTION update_modified_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update modified_at
CREATE TRIGGER update_contacts_modified_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_at();