export interface ApiUser {
  id: string;
  email: string;
  provider_id: string;
  token: string;
  is_active: boolean;
  created_at: string;
}

export interface Provider {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
}

export interface CreateApiUserData {
  email: string;
  provider_id: string;
}