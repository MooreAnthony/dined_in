export interface CompanyUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  role: string;
  created_at: string;
}

export interface InviteUserData {
  email: string;
  first_name: string;
  last_name: string;
  mobile: string;
  role_id: string;
}

export interface UserInvitation {
  id: string;
  company_id: string;
  email: string;
  first_name: string;
  last_name: string;
  mobile: string;
  role_id: string;
  status: 'pending' | 'accepted' | 'expired';
  token: string;
  expires_at: string;
  created_at: string;
  created_by: string | null;
}