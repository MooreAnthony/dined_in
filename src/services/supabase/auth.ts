import { supabase } from './config';
import type { SignUpFormData } from '../../types';

export const signUp = async ({ email, password, firstName, lastName, mobile }: SignUpFormData) => {  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/verify-email`,
    },
  });

  if (error) {
    if (error.message === 'User already registered') {
      throw new Error('user_already_exists');
    }
    throw error;
  }

  if (!data.user) {
    throw new Error('Sign up failed');
  }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    first_name: firstName,
    last_name: lastName,
    email,
    mobile,
  });

  if (profileError) {
    // Clean up auth user if profile creation fails
    await supabase.auth.signOut();
    throw profileError;
  }

  return data;
};

export const verifyEmail = async (token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'email',
  });

  if (error) {
    throw error;
  }

  return data;
};