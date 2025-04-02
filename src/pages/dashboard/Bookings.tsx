import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, AlertCircle } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';
import { useLocations } from '../../hooks/useLocations';
import { useBookings } from '../../hooks/useBookings';
import { Button } from '../../components/common/Button';
import { BookingForm } from '../../components/bookings/BookingForm';
import { BookingsTable } from '../../components/bookings/BookingsTable';
import { BookingsFilters } from '../../components/bookings/BookingsFilters';
import type { BookingFilters, Booking } from '../../types/bookings';

export const Bookings: React.FC = () => {
  const { currentCompany } = useCompany();
  const [showForm, setShowForm] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { locations } = useLocations();

  const {
    bookings,
    tables,
    totalCount,
    currentPage,
    filters,
    isLoading,
    error,
    createBooking,
    updateBooking,
    deleteBooking,
    onPageChange,
    onFilterChange,
    onSort,
    sortBy,
    sortDirection,
  } = useBookings({
    companyId: currentCompany?.id || '',
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onFilterChange({ search: query });
  };

  const handleFilter = (filters: Partial<BookingFilters>) => {
    onFilterChange(filters);
  };

  const handleBookingSelect = (booking: Booking) => {
    navigate(`/dashboard/bookings/${booking.id}`);
  };

  if (!currentCompany) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-semibold text-dark-text-primary">
            No Company Selected
          </h2>
          <p className="text-dark-text-secondary">
            Please select a company to manage bookings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark-text-primary">Bookings</h1>
        <Button
          onClick={() => navigate('/dashboard/bookings/create')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </Button>
      </div>

      {/* Booking Form */}
      {showForm && (
        <div className="bg-dark-secondary rounded-lg border border-dark-border p-6">
          <BookingForm
            tables={tables}
            onSubmit={async (data) => {
              await createBooking(data);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search bookings..."
              className="w-full pl-12 pr-4 py-3 bg-dark-secondary border border-dark-border rounded-lg
                text-dark-text-primary placeholder-dark-text-muted
                focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className="flex items-center gap-2 relative"
          >
            <Filter className="w-4 h-4" />
            Filters
            {Object.keys(filters).length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-dark-accent rounded-full" />
            )}
          </Button>
        </div>

        <BookingsFilters
          onFilterChange={handleFilter}
          locations={locations}
          isExpanded={isFiltersExpanded}
          onToggle={() => setIsFiltersExpanded(!isFiltersExpanded)}
        />
      </div>

      {/* Bookings Table */}
      {error ? (
        <div className="p-4 bg-red-400/10 text-red-400 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      ) : (
        <BookingsTable
          bookings={bookings}
          isLoading={isLoading}
          currentPage={currentPage}
          totalCount={totalCount}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onPageChange={onPageChange}
          onSort={onSort}
          onSelect={handleBookingSelect}
          onUpdate={updateBooking}
          onDelete={deleteBooking}
        />
      )}
    </div>
  );
};