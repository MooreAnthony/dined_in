import { useState } from 'react';
import { createCompany } from '../services/supabase/company';
import type { CompanyFormData } from '../types';

export const useCompany = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerCompany = async (data: CompanyFormData, userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const company = await createCompany(data, userId);
      return company;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register company');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerCompany,
    isLoading,
    error,
  };
};