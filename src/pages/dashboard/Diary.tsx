import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { BookingTimeline } from '../../components/bookings/BookingTimeline';
import { useBookings } from '../../hooks/useBookings';
import { useCompany } from '../../contexts/CompanyContext';
import { NoCompanySelected } from '../../components/dashboard/NoCompanySelected';

export const Diary: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { currentCompany } = useCompany();

  const {
    bookings,
    isLoading,
    error,
  } = useBookings({
    companyId: currentCompany?.id || '',
    initialFilters: {
      dateRange: {
        start: selectedDate,
        end: selectedDate,
      },
    },
  });

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  if (!currentCompany) {
    return <NoCompanySelected />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark-text-primary">Service Diary</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleDateChange(-1)}
              className="p-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedDate(new Date())}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Today
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDateChange(1)}
              className="p-2"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <div className="text-lg font-medium text-dark-text-primary">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Timeline */}
      {error ? (
        <div className="p-4 bg-red-400/10 text-red-400 rounded-lg">
          Failed to load bookings: {error}
        </div>
      ) : isLoading ? (
        <div className="p-4 text-dark-text-secondary">Loading bookings...</div>
      ) : (
        <BookingTimeline
          bookings={bookings}
          date={selectedDate}
          onBookingClick={(booking) => {
            console.log('Booking clicked:', booking);
          }}
        />
      )}
    </div>
  );
};