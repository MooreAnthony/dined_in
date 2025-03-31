import { supabase } from './config';
import type { CompanyUser, InviteUserData } from '../../types/users';
import type { Role } from '../../types/roles';

export async function fetchCompanyUsers(companyId: string): Promise<CompanyUser[]> {
  const { data, error } = await supabase
    .from('company_users')
    .select(`
      id,
      role,
      created_at,
      profile:profiles (
        first_name,
        last_name,
        email,
        mobile
      )
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(user => ({
    id: user.id,
    first_name: user.profile.first_name,
    last_name: user.profile.last_name,
    email: user.profile.email,
    mobile: user.profile.mobile,
    role: user.role,
    created_at: user.created_at,
  }));
}

export async function fetchCompanyRoles(companyId: string): Promise<Role[]> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('company_id', companyId)
    .order('name');

  if (error) throw error;
  return data;
}

export async function inviteUser(companyId: string, data: InviteUserData) {
  // Generate a secure random token
  const token = crypto.randomUUID();

  const { data: invitation, error } = await supabase
    .from('user_invitations')
    .insert({
      company_id: companyId,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      mobile: data.mobile,
      role_id: data.role_id,
      token,
    })
    .select()
    .single();

  if (error) throw error;

  // TODO: Send invitation email with token
  console.log('TODO: Send invitation email with token:', token);

  return invitation;
}