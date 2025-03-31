import { useState, useEffect, useCallback } from 'react';
import type { Account } from './useAccounts';
import type { Contact, ContactFilters, SortOptions, ContactsState } from '../types/contacts';
import { fetchContacts } from '../services/supabase/contacts';

interface UseCompanyContactsOptions {
  pageSize?: number;
  initialFilters?: ContactFilters;
  initialSort?: SortOptions;
}

export function useCompanyContacts(
  selectedCompany: Account | null,
  options: UseCompanyContactsOptions = {}
) {
  const {
    pageSize = 25,
    initialFilters,
    initialSort,
  } = options;

  const [state, setState] = useState<ContactsState>({
    contacts: [],
    isLoading: false,
    error: null,
    metadata: {
      total: 0,
      page: 1,
      pageSize,
    },
  });

  const [filters, setFilters] = useState<ContactFilters>(initialFilters || {});
  const [sort, setSort] = useState<SortOptions | undefined>(initialSort);

  const loadContacts = useCallback(async (page: number = 1) => {
    if (!selectedCompany) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetchContacts({
        companyId: selectedCompany.id,
        page,
        pageSize,
        filters,
        sort,
      });

      setState({
        contacts: response.data,
        isLoading: false,
        error: null,
        metadata: response.metadata,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch contacts',
      }));
    }
  }, [selectedCompany, pageSize, filters, sort]);

  // Load contacts when dependencies change
  useEffect(() => {
    loadContacts(1);
  }, [loadContacts]);

  const updateFilters = useCallback((newFilters: Partial<ContactFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const updateSort = useCallback((field: keyof Contact) => {
    setSort(prev => ({
      field,
      direction: prev?.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return {
    ...state,
    filters,
    updateFilters,
    sort,
    updateSort,
    loadContacts,
  };
}