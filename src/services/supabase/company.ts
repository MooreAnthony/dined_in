import { supabase } from './config';
import type { CompanyFormData } from '../../types';

export const createCompany = async (data: CompanyFormData, userId: string) => {
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .insert({
      name: data.name,
      address_1: data.address1,
      address_2: data.address2,
      city: data.city,
      postcode: data.postcode,
      country: data.country,
      website: data.website,
      promo_code: data.promoCode,
    })
    .select()
    .single();

  if (companyError) {
    throw companyError;
  }

  const { error: roleError } = await supabase
    .from('company_users')
    .insert({
      company_id: company.id,
      user_id: userId,
      role: 'owner',
    });

  if (roleError) {
    // Rollback company creation
    await supabase.from('companies').delete().eq('id', company.id);
    throw roleError;
  }

  return company;
};