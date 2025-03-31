export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string
          company_id: string
          first_name: string
          last_name: string
          email: string
          birthday_month: number | null
          birthday_day: number | null
          mobile: string
          company_name: string | null
          contact_source: string | null
          street_address: string | null
          city: string | null
          state: string | null
          postal_code: string | null
          country: string | null
          email_consent: boolean
          email_consent_timestamp: string | null
          sms_consent: boolean
          sms_consent_timestamp: string | null
          preferred_contact_method: string | null
          notes: string | null
          created_at: string
          modified_at: string
          last_contact_date: string | null
          is_active: boolean
          is_test_profile: boolean
        }
        Insert: {
          id?: string
          company_id: string
          first_name: string
          last_name: string
          email: string
          birthday_month?: number | null
          birthday_day?: number | null
          mobile: string
          company_name?: string | null
          contact_source?: string | null
          street_address?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string | null
          email_consent?: boolean
          email_consent_timestamp?: string | null
          sms_consent?: boolean
          sms_consent_timestamp?: string | null
          preferred_contact_method?: string | null
          notes?: string | null
          created_at?: string
          modified_at?: string
          last_contact_date?: string | null
          is_active?: boolean
          is_test_profile?: boolean
        }
        Update: {
          id?: string
          company_id?: string
          first_name?: string
          last_name?: string
          email?: string
          birthday_month?: number | null
          birthday_day?: number | null
          mobile?: string
          company_name?: string | null
          contact_source?: string | null
          street_address?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string | null
          email_consent?: boolean
          email_consent_timestamp?: string | null
          sms_consent?: boolean
          sms_consent_timestamp?: string | null
          preferred_contact_method?: string | null
          notes?: string | null
          created_at?: string
          modified_at?: string
          last_contact_date?: string | null
          is_active?: boolean
          is_test_profile?: boolean
        }
      }
    }
    Functions: {
      get_paginated_contacts: {
        Args: {
          p_company_id: string
          p_cursor?: string | null
          p_limit?: number
          p_search?: string | null
          p_is_active?: boolean | null
          p_source?: string | null
          p_contact_method?: string | null
        }
        Returns: {
          id: string
          first_name: string
          last_name: string
          email: string
          mobile: string
          company_name: string | null
          contact_source: string
          last_contact_date: string | null
          is_active: boolean
          next_cursor: string | null
          total_count: number
        }[]
      }
    }
  }
}