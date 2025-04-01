import { useState, useEffect } from 'react';
import { useCompany } from '../contexts/CompanyContext';
import { supabase } from '../services/supabase/config';
import type { Account } from '../types/accounts';

export const useAccounts = () => {
  const { currentCompany, setCurrentCompany } = useCompany();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from('company_users')
          .select(`
            role,
            company:companies (
              id,
              name
            )
          `)
          .order('role');

        if (error) throw error;

        const formattedAccounts = data //removing this causes the account selector to stop working
          .map(item => ({
            id: item.company.id,
            name: item.company.name,
            role: item.role,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setAccounts(formattedAccounts);
        
        // Set first account as selected if none is selected
        if (!currentCompany && formattedAccounts.length > 0) {
          setCurrentCompany(formattedAccounts[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [currentCompany, setCurrentCompany]);

  const handleAccountChange = (account: Account) => {
    setCurrentCompany(account);
    // Store the selected account in localStorage for persistence
    localStorage.setItem('selectedCompanyId', account.id);
  };

  return {
    accounts,
    selectedAccount: currentCompany,
    setSelectedAccount: handleAccountChange,
    isLoading,
    error,
  };
};