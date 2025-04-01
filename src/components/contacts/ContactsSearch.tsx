import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '../common/Button';

interface ContactsSearchProps {
  value: string;
  onChange: (value: string) => void;
  filters: {
    isActive: boolean;
    source: string;
    contactMethod: string;
  };
  onFilterChange: (filters: Partial<ContactsSearchProps['filters']>) => void;
}

export const ContactsSearch: React.FC<ContactsSearchProps> = ({
  value,
  onChange,
  filters,
  onFilterChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search contacts by name, email, or company..."
          className="w-full pl-12 pr-4 py-3 bg-dark-secondary border border-dark-border rounded-lg
            text-dark-text-primary placeholder-dark-text-muted
            focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-dark-text-muted" />
          <span className="text-sm text-dark-text-secondary">Filters:</span>
        </div>

        {/* Status Filter */}
        <select
          aria-label="Filter by status"
          value={filters.isActive ? 'active' : 'all'}
          onChange={(e) => onFilterChange({ isActive: e.target.value === 'active' })}
          className="px-3 py-2 bg-dark-secondary border border-dark-border rounded-lg
            text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>

        <select
          aria-label="Filter by source"
          value={filters.source}
          onChange={(e) => onFilterChange({ source: e.target.value })}
          className="px-3 py-2 bg-dark-secondary border border-dark-border rounded-lg
            text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
        >
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Referral">Referral</option>
          <option value="Event">Event</option>
          <option value="Other">Other</option>
        </select>
        <select
          aria-label="Filter by contact method"
          value={filters.contactMethod}
          onChange={(e) => onFilterChange({ contactMethod: e.target.value })}
          className="px-3 py-2 bg-dark-secondary border border-dark-border rounded-lg
            text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
        >
          <option value="">All Contact Methods</option>
          <option value="Email">Email</option>
          <option value="SMS">SMS</option>
          <option value="Phone">Phone</option>
        </select>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={() => onFilterChange({
            isActive: true,
            source: '',
            contactMethod: '',
          })}
          className="text-sm"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};