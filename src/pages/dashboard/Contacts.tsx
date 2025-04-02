import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { ContactsTable } from '../../components/contacts/ContactsTable';
import { ContactsSearch } from '../../components/contacts/ContactsSearch';
import { AddContactModal } from '../../components/contacts/AddContactModal';
import { useCompany } from '../../contexts/CompanyContext';
import { useCompanyContacts } from '../../hooks/useCompanyContacts';
import type { ContactSource, ContactMethod } from '../../types/contacts';

export const Contacts: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentCompany } = useCompany();

  const {
    contacts,
    isLoading,
    error,
    metadata,
    filters,
    updateFilters,
    sort,
    updateSort,
    loadContacts,
  } = useCompanyContacts(currentCompany, {
    pageSize: 25,
    initialSort: { field: 'modified_at', direction: 'desc' },
    initialFilters: { isActive: true },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateFilters({ search: query });
  };

  const handleFilter = (filters: Partial<{ isActive: boolean; source: string; contactMethod: string; }>) => {
    updateFilters({
      ...filters,
      source: filters.source as ContactSource,
      contactMethod: filters.contactMethod as ContactMethod,
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadContacts(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark-text-primary">Contacts</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <ContactsSearch
          value={searchQuery}
          onChange={handleSearch}
          filters={{
            isActive: filters.isActive ?? true,
            source: filters.source || '',
            contactMethod: filters.contactMethod || '',
          }}
          onFilterChange={handleFilter}
        />
      </div>

      {/* Contacts Table */}
      <ContactsTable
        currentPage={currentPage}
        contacts={contacts}
        isLoading={isLoading}
        error={error}
        totalCount={metadata.total}
        onPageChange={handlePageChange}
        sortField={sort?.field || 'modified_at'}
        sortDirection={sort?.direction || 'desc'}
        onSort={updateSort}
      />

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};