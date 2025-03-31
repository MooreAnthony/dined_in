export interface Contact {
  id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  birthday_month: number | null;
  birthday_day: number | null;
  mobile: string;
  company_name: string | null;
  contact_source: ContactSource | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  email_consent: boolean;
  email_consent_timestamp: string | null;
  sms_consent: boolean;
  sms_consent_timestamp: string | null;
  preferred_contact_method: ContactMethod | null;
  notes: string | null;
  created_at: string;
  modified_at: string;
  last_contact_date: string | null;
  is_active: boolean;
  is_test_profile: boolean;
  tags?: Array<{
    id: string;
    name: string;
    color: string;
    icon: string;
  }>;
}

export type ContactSource = 'Website' | 'Referral' | 'Event' | 'Other';
export type ContactMethod = 'Email' | 'SMS' | 'Phone';

export interface ContactFilters {
  search?: string;
  isActive?: boolean;
  source?: ContactSource;
  contactMethod?: ContactMethod;
}

export interface SortOptions {
  field: keyof Contact;
  direction: 'asc' | 'desc';
}

export interface ContactsState {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  metadata: {
    total: number;
    page: number;
    pageSize: number;
  };
}