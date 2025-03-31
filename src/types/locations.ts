export interface Location {
  id: string;
  company_id: string;
  client_reference: string;
  public_name: string;
  internal_name: string;
  venue_group_id: string | null;
  venue_type: string;
  website_url: string | null;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  currency_code: string;
  reservation_url: string | null;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
  modified_at: string;
  modified_by: string | null;
  photos?: LocationPhoto[];
}

export interface VenueGroup {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  created_at: string;
  created_by: string | null;
  modified_at: string;
  modified_by: string | null;
}

export interface LocationPhoto {
  id: string;
  location_id: string;
  url: string;
  sort_order: number;
  created_at: string;
  created_by: string | null;
}

export type CreateLocationData = Omit<
  Location,
  'id' | 'company_id' | 'created_at' | 'created_by' | 'modified_at' | 'modified_by' | 'photos'
>;

export type UpdateLocationData = Partial<CreateLocationData>;