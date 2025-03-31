import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  Loader2,
  Edit2,
  Trash2,
  XCircle,
} from 'lucide-react';
import { Button } from '../common/Button';
import { formatDate } from '../../utils/date';
import type { Booking, BookingStatus, UpdateBookingData } from '../../types/bookings';

interface BookingsTableProps {
  bookings: Booking[];
  isLoading: boolean;
  currentPage: number;
  totalCount: number;
  sortBy: keyof Booking;
  sortDirection: 'asc' | 'desc';
  onPageChange: (page: number) => void;
  onSort: (field: keyof Booking) => void;
  onUpdate: (id: string, data: UpdateBookingData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSelect?: (booking: Booking) => void;
  onSelect?: (booking: Booking) => void;
}

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case 'Complete':
      return 'bg-green-400/10 text-green-400';
    case 'Pending':
      return 'bg-yellow-400/10 text-yellow-400';
    case 'Cancelled':
      return 'bg-red-400/10 text-red-400';
    case 'Arrived':
      return 'bg-blue-400/10 text-blue-400';
    case 'No Show':
      return 'bg-purple-400/10 text-purple-400';
    default:
      return 'bg-gray-400/10 text-gray-400';
  }
};

interface SortableColumnProps {
  field: keyof Booking;
  currentSort: keyof Booking;
  direction: 'asc' | 'desc';
  onSort: (field: keyof Booking) => void;
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

export const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  isLoading,
  currentPage,
  totalCount,
  sortBy,
  sortDirection,
  onPageChange,
  onSort,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const totalPages = Math.ceil(totalCount / 10);
  const navigate = useNavigate();

  const formatDateTime = (date: string, time: string) => {
    return new Date(`${date}T${time}`).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="bg-dark-secondary rounded-lg border border-dark-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                Location
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                <SortableColumn
                  field="booking_seated_date"
                  currentSort={sortBy}
                  direction={sortDirection}
                  onSort={onSort}
                >
                  Date & Time
                </SortableColumn>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                Customer Details
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                Booking Reference
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                <SortableColumn
                  field="covers_adult"
                  currentSort={sortBy}
                  direction={sortDirection}
                  onSort={onSort}
                >
                  Guests
                </SortableColumn>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                <SortableColumn
                  field="booking_source"
                  currentSort={sortBy}
                  direction={sortDirection}
                  onSort={onSort}
                >
                  Source
                </SortableColumn>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                <SortableColumn
                  field="booking_type"
                  currentSort={sortBy}
                  direction={sortDirection}
                  onSort={onSort}
                >
                  Type
                </SortableColumn>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-dark-text-secondary">
                <SortableColumn
                  field="booking_status"
                  currentSort={sortBy}
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
                <td colSpan={8} className="px-6 py-8">
                  <div className="flex items-center justify-center text-dark-text-secondary">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Loading bookings...
                  </div>
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-dark-text-secondary">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-dark-primary/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/bookings/create`, {
                    state: {
                      first_name: booking.contact?.first_name || '',
                      last_name: booking.contact?.last_name || '',
                      email: booking.contact?.email || '',
                      location_id: booking.location_id,
                      booking_source: booking.booking_source,
                      booking_type: booking.booking_type,
                      covers_adult: booking.covers_adult,
                      covers_child: booking.covers_child,
                      duration: booking.duration || 90,
                      special_requests: booking.special_requests,
                      notes: booking.notes,
                    }
                  })}
                >
                  <td className="px-6 py-4 text-dark-text-primary">
                    {booking.location?.public_name || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(`${booking.booking_seated_date}T${booking.booking_seated_time}`).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-dark-text-secondary">
                        {booking.contact?.email || '-'}
                      </div>
                      <div className="text-dark-text-primary">
                        {booking.contact 
                          ? `${booking.contact.first_name} ${booking.contact.last_name}`
                          : '-'
                        }
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-dark-text-secondary font-mono">
                    {booking.booking_reference}
                  </td>
                  <td className="px-6 py-4 text-dark-text-primary">
                    <div className="space-y-1">
                      <div className="text-dark-text-primary">
                        {booking.covers_adult + booking.covers_child} total
                      </div>
                      <div className="text-sm text-dark-text-secondary">
                        Adults: {booking.covers_adult} / Children: {booking.covers_child}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-dark-text-secondary">
                    {booking.booking_source}
                  </td>
                  <td className="px-6 py-4 text-dark-text-secondary">
                    {booking.booking_type}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${getStatusColor(booking.booking_status)}
                      `}
                    >
                      {booking.booking_status}
                    </span>
                  </td>
                </tr>
              ))
            )}
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