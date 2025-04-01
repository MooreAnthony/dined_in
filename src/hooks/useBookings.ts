import { useState, useEffect, useCallback } from 'react';
import { 
  fetchBookings, 
  fetchTables,
  createBooking,
  updateBooking,
  deleteBooking,
  subscribeToBookings
} from '../services/supabase/bookings';
import type { 
  Booking, 
  BookingFilters, 
  CreateBookingData,
  UpdateBookingData,
  Table 
} from '../types/bookings';

interface UseBookingsOptions {
  companyId: string;
  initialFilters?: BookingFilters;
}

export function useBookings({ companyId, initialFilters = {} }: UseBookingsOptions) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<BookingFilters>(initialFilters);
  const [sortBy, setSortBy] = useState<keyof Booking>('booking_seated_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    if (!companyId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, count } = await fetchBookings(
        companyId,
        currentPage,
        filters,
        sortBy,
        sortDirection
      );
      setBookings(data);
      setTotalCount(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  }, [companyId, currentPage, filters, sortBy, sortDirection]);

  const loadTables = useCallback(async () => {
    if (!companyId) return;

    try {
      const data = await fetchTables(companyId);
      setTables(data);
    } catch (err) {
      console.error('Failed to fetch tables:', err);
    }
  }, [companyId]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  useEffect(() => {
    if (!companyId) return;

    const unsubscribe = subscribeToBookings(companyId, () => {
      loadBookings();
    });

    return () => {
      unsubscribe();
    };
  }, [companyId, loadBookings]);

  const handleCreateBooking = async (data: CreateBookingData) => {
      await createBooking(companyId, data);
      loadBookings();
  };

  const handleUpdateBooking = async (bookingId: string, updates: UpdateBookingData) => {

      await updateBooking(bookingId, updates);
      loadBookings();
  };

  const handleDeleteBooking = async (bookingId: string) => {
      await deleteBooking(bookingId);
      loadBookings();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: Partial<BookingFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSort = (field: keyof Booking) => {
    setSortDirection(prev => 
      sortBy === field && prev === 'asc' ? 'desc' : 'asc'
    );
    setSortBy(field);
  };

  return {
    bookings,
    tables,
    totalCount,
    currentPage,
    filters,
    sortBy,
    sortDirection,
    isLoading,
    error,
    createBooking: handleCreateBooking,
    updateBooking: handleUpdateBooking,
    deleteBooking: handleDeleteBooking,
    onPageChange: handlePageChange,
    onFilterChange: handleFilterChange,
    onSort: handleSort,
  };
}