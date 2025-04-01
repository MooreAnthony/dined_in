import React from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, Loader2, AlertCircle, Tag } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Button } from '../common/Button';
import { formatDate } from '../../utils/date';
import type { Contact } from '../../types/contacts';

interface ContactsTableProps {
  currentPage: number;
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  onPageChange: (page: number) => void;
  sortField: keyof Contact;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Contact) => void;
}

interface SortableColumnProps {
  field: keyof Contact;
  currentSort: keyof Contact;
  direction: 'asc' | 'desc';
  onSort: (field: keyof Contact) => void;
  children: React.ReactNode;
}

const SortableColumn: React.FC<SortableColumnProps> = ({
  field,
  currentSort,
  direction,
  onSort,
  children,
}) => (
  <button
    onClick={() => onSort(field)}
    className="flex items-center gap-2 hover:text-dark-accent"
  >
    {children}
    <ArrowUpDown
      className={`w-4 h-4 transition-transform ${
        currentSort === field
          ? 'text-dark-accent ' +
            (direction === 'desc' ? 'rotate-180' : '')
          : 'text-dark-text-muted'
      }`}
    />
  </button>
);

export const ContactsTable: React.FC<ContactsTableProps> = ({
  currentPage,
  contacts,
  isLoading,
  error,
  totalCount,
  onPageChange,
  sortField,
  sortDirection,
  onSort,
}) => {
  const totalPages = Math.ceil(totalCount / 25);

  return (
    <div className="bg-dark-secondary rounded-lg border border-dark-border">
      {error && (
        <div className="p-4 text-red-400 bg-red-400/10 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                <SortableColumn
                  field="last_name"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={onSort}
                >
                  Name
                </SortableColumn>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                <SortableColumn
                  field="email"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={onSort}
                >
                  Email
                </SortableColumn>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                <SortableColumn
                  field="mobile"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={onSort}
                >
                  Mobile
                </SortableColumn>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                <SortableColumn
                  field="company_name"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={onSort}
                >
                  Company
                </SortableColumn>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                <SortableColumn
                  field="contact_source"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={onSort}
                >
                  Source
                </SortableColumn>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                <SortableColumn
                  field="last_contact_date"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={onSort}
                >
                  Last Contact
                </SortableColumn>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                <SortableColumn
                  field="is_active"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={onSort}
                >
                  Status
                </SortableColumn>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8">
                  <div className="flex items-center justify-center text-dark-text-secondary">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Loading contacts...
                  </div>
                </td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-dark-text-secondary">
                  No contacts found
                </td>
              </tr>
            ) : contacts.map((contact) => (
              <tr
                key={contact.id}
                className="hover:bg-dark-primary/50 transition-colors"
              >
                <td className="px-6 py-4 text-dark-text-primary">
                  <div className="space-y-2">
                    <div>{contact.first_name} {contact.last_name}</div>
                    {contact.tags && contact.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {contact.tags.map(tag => {
                          type IconType = keyof typeof Icons;
                          const IconComponent = (tag.icon && tag.icon in Icons ? Icons[tag.icon as IconType] : Tag) as React.ElementType;

                          return (
                          <span
                            key={tag.name}
                            className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: tag.color + '15',
                              color: tag.color,
                            }}
                          >
                            <IconComponent className="w-4 h-4" />
                            {tag.name}
                          </span>
                        );
                        })}
                      </div>
                    )}
                    {/* {(() => {
                      const IconComponent = Icons[tag.icon as keyof typeof Icons] || Tag;
                      return React.createElement(IconComponent, { className: "w-4 h-4" });
                    })()} */}
                  </div>
                </td>
                <td className="px-6 py-4 text-dark-text-secondary">
                  {contact.email}
                </td>
                <td className="px-6 py-4 text-dark-text-secondary">
                  {contact.mobile}
                </td>
                <td className="px-6 py-4 text-dark-text-secondary">
                  {contact.company_name || '-'}
                </td>
                <td className="px-6 py-4 text-dark-text-secondary">
                  {contact.contact_source}
                </td>
                <td className="px-6 py-4 text-dark-text-secondary">
                  {contact.last_contact_date ? formatDate(contact.last_contact_date) : '-'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      contact.is_active
                        ? 'bg-green-400/10 text-green-400'
                        : 'bg-red-400/10 text-red-400'
                    }`}
                  >
                    {contact.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-dark-border">
        <div className="text-sm text-dark-text-secondary">
          Showing page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};