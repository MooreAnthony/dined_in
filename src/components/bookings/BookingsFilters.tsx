import React, { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '../common/Button';
import type { BookingStatus, BookingFilters } from '../../types/bookings';
import type { Location } from '../../types/locations';

interface BookingsFiltersProps {
  onFilterChange: (filters: Partial<BookingFilters>) => void;
  locations: Location[];
  isExpanded: boolean;
  onToggle: () => void;
}

const BOOKING_STATUSES: BookingStatus[] = [
  'New',
  'Pending',
  'Enquiry',
  'No Show',
  'Arrived',
  'Complete',
  'Cancelled',
];

export const BookingsFilters: React.FC<BookingsFiltersProps> = ({
  onFilterChange,
  locations,
  isExpanded,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<BookingStatus | ''>('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleDateChange = () => {
    if (startDate && endDate) {
      onFilterChange({
        dateRange: {
          start: new Date(startDate),
          end: new Date(endDate),
        },
      });
    }
  };

  const handleStatusChange = (newStatus: BookingStatus | '') => {
    setStatus(newStatus);
    if (newStatus) {
      onFilterChange({ status: newStatus });
    }
  };

  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
    onFilterChange({ locationId });
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setStatus('');
    setSelectedLocation('');
    onFilterChange({});
  };

  return (
    <div className="space-y-4">

      {/* Filter Panel */}
      <div className={`
        bg-dark-secondary rounded-lg border border-dark-border p-4 space-y-6
        transition-all duration-200 ease-in-out overflow-hidden
        ${isExpanded ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 p-0 border-0'}
      `}>
        {/* Location Filter */}
        <div className="space-y-2">
          <label htmlFor="location-select" className="flex items-center gap-2 text-sm font-medium text-dark-text-secondary">
            <MapPin className="w-4 h-4" />
            Location
          </label>
          <select
            id="location-select"
            aria-label="Select location"
            value={selectedLocation}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="w-full px-4 py-2 bg-dark-secondary border border-dark-border rounded-lg
              text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.public_name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-dark-text-secondary">
            <Calendar className="w-4 h-4" />
            Date Range
          </label>
          <div className="flex gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 px-4 py-2 bg-dark-secondary border border-dark-border rounded-lg
                text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
              title="Start date"
              aria-label="Start date"
              placeholder="Start date"
            />
            <span className="text-dark-text-muted self-center">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 px-4 py-2 bg-dark-secondary border border-dark-border rounded-lg
                text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
              title="End date"
              aria-label="End date"
              placeholder="End date"
            />
            <Button
              variant="outline"
              onClick={handleDateChange}
              disabled={!startDate || !endDate}
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-text-secondary">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {BOOKING_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s === status ? '' : s)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${status === s
                    ? 'bg-dark-accent text-dark-text-primary'
                    : 'bg-dark-primary text-dark-text-secondary hover:bg-dark-accent/10'
                  }
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <div className="flex justify-end pt-2">
          <Button
            variant="outline"
            onClick={clearFilters}
          >
            Clear All Filters
          </Button>
        </div>
      </div>
    </div>
  );
};