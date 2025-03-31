import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Account } from '../types/accounts';
import { supabase } from '../services/supabase/config';

interface CompanyContextType {
  currentCompany: Account | null;
  setCurrentCompany: (company: Account | null) => void;
  isLoading: boolean;
  error: string | null;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCompany, setCurrentCompany] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load initial company data
  useEffect(() => {
    const loadInitialCompany = async () => {
      try {
        const { data: companies, error: companiesError } = await supabase
          .from('company_users')
          .select(`
            role,
            company:companies (
              id,
              name
            )
          `)
          .order('role')
          .limit(1)
          .single();

        if (companiesError) throw companiesError;

        if (companies) {
          setCurrentCompany({
            id: companies.company.id,
            name: companies.company.name,
            role: companies.role,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load company data');
        console.error('Error loading company:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialCompany();
  }, []);

  // Subscribe to company changes
  useEffect(() => {
    if (!currentCompany) return;

    const subscription = supabase
      .channel('company_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'companies',
          filter: `id=eq.${currentCompany.id}`,
        },
        async (payload) => {
          if (payload.eventType === 'DELETE') {
            setCurrentCompany(null);
            navigate('/dashboard');
          } else {
            // Refresh company data
            const { data } = await supabase
              .from('company_users')
              .select(`
                role,
                company:companies (
                  id,
                  name
                )
              `)
              .eq('company_id', currentCompany.id)
              .single();

            if (data) {
              setCurrentCompany({
                id: data.company.id,
                name: data.company.name,
                role: data.role,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentCompany, navigate]);

  return (
    <CompanyContext.Provider 
      value={{ 
        currentCompany, 
        setCurrentCompany, 
        isLoading, 
        error 
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};