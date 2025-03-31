export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}

export interface CompanyFormData {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  postcode: string;
  country: string;
  website?: string;
  promoCode?: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  mobile: string;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  address_1: string;
  address_2?: string;
  city: string;
  postcode: string;
  country: string;
  website?: string;
  promo_code?: string;
  created_at: string;
}