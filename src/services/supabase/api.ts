import { supabase } from './config';
import type { ApiUser, Provider, CreateApiUserData } from '../../types/api';

export async function fetchApiUsers(companyId: string): Promise<ApiUser[]> {
  const { data, error } = await supabase
    .from('api_users')
    .select(`
      *,
      provider:providers (
        id,
        name,
        code
      )
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchProviders(): Promise<Provider[]> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data;
}

export async function createApiUser(companyId: string, data: CreateApiUserData): Promise<ApiUser> {
  const { data: apiUser, error } = await supabase
    .from('api_users')
    .insert({
      company_id: companyId,
      email: data.email,
      provider_id: data.provider_id,
    })
    .select()
    .single();

  if (error) throw error;
  return apiUser;
}

export async function removeApiUser(id: string): Promise<void> {
  const { error } = await supabase
    .from('api_users')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
}