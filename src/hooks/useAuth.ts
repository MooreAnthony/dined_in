import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase/config';
import { signUp, verifyEmail as verifyEmailRequest } from '../services/supabase/auth';
import type { SignUpFormData, Profile } from '../types';

export const useAuth = () => {
  const [session, setSession] = useState(supabase.auth.getSession());
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from localStorage if available
  useEffect(() => {
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        setSession(parsedSession);
      } catch (error) {
        console.error('Failed to parse saved session:', error);
        localStorage.removeItem('session');
      }
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      const result = await signUp(data);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string, remember = false) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          persistSession: remember
        }
      });
      if (error) throw error;
      
      if (remember && data.session) {
        localStorage.setItem('session', JSON.stringify(data.session));
      }
      
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('session');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (token: string) => {
    setLoading(true);
    try {
      const result = await verifyEmailRequest(token);
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    profile,
    loading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    verifyEmail: handleVerifyEmail,
  };
};