import { supabase } from './config';
import type { 
  Booking, 
  CreateBookingData, 
  UpdateBookingData,
  BookingFilters,
  Table 
} from '../../types/bookings';



interface CreateBookingContactData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  birthday_month?: number;
  birthday_day?: number;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  email_consent: boolean;
  sms_consent: boolean;
  location_id: string;
  booking_source: string;
  booking_type: string;
  booking_occasion?: string;
  booking_seated_date: string;
  booking_seated_time: string;
  covers_adult: number;
  covers_child?: number;
  duration: number;
  special_requests?: string;
  notes?: string;
}

async function createBookingWithContact(
  companyId: string,
  data: CreateBookingContactData
): Promise<{ contact: CreateBookingContactData; booking: Booking }> {
  const { data: result, error } = await supabase.rpc('create_booking_with_contact', {
    p_company_id: companyId,
    p_first_name: data.first_name,
    p_last_name: data.last_name,
    p_email: data.email,
    p_mobile: data.mobile,
    p_birthday_month: data.birthday_month,
    p_birthday_day: data.birthday_day,
    p_street_address: data.street_address,
    p_city: data.city,
    p_state: data.state,
    p_postal_code: data.postal_code,
    p_country: data.country,
    p_email_consent: data.email_consent,
    p_sms_consent: data.sms_consent,
    p_location_id: data.location_id,
    p_booking_source: data.booking_source,
    p_booking_type: data.booking_type,
    p_booking_occasion: data.booking_occasion,
    p_booking_seated_date: data.booking_seated_date,
    p_booking_seated_time: data.booking_seated_time,
    p_covers_adult: data.covers_adult,
    p_covers_child: data.covers_child,
    p_duration: data.duration,
    p_special_requests: data.special_requests,
    p_notes: data.notes
  });

  if (error) throw error;
  return result;
}

async function fetchTables(companyId: string): Promise<Table[]> {
  const { data, error } = await supabase
    .from('tables')
    .select('*')
    .eq('company_id', companyId)
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data;
}

async function fetchBookings(
  companyId: string,
  page: number = 1,
  filters: BookingFilters = {},
  sortBy: keyof Booking = 'booking_seated_date',
  sortDirection: 'asc' | 'desc' = 'asc'
): Promise<{ data: Booking[]; count: number }> {
  try {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        location:locations (
          id,
          public_name
        ),
        contact:contacts (
          id,
          first_name,
          last_name,
          email
        )
      `, { count: 'exact' })
      .eq('company_id', companyId);

    // Apply filters
    if (filters.search) {
      query = query.or(`
        contact.first_name.ilike.%${filters.search}%,
        contact.last_name.ilike.%${filters.search}%,
        contact.email.ilike.%${filters.search}%,
        booking_reference.ilike.%${filters.search}%
      `.split(',').map(condition => condition.trim()).filter(Boolean).join(','));
    }

    if (filters.locationId) {
      query = query.eq('location_id', filters.locationId);
    }

    if (filters.dateRange) {
      query = query
        .gte('booking_seated_date', filters.dateRange.start.toISOString().split('T')[0])
        .lte('booking_seated_date', filters.dateRange.end.toISOString().split('T')[0]);
    }

    if (filters.status) {
      query = query.eq('booking_status', filters.status);
    }

    if (filters.minGuests) {
      query = query.gte('guests', filters.minGuests);
    }

    if (filters.maxGuests) {
      query = query.lte('guests', filters.maxGuests);
    }

    // Apply sorting and pagination
    const { data, error, count } = await query
      .order(sortBy, { ascending: sortDirection === 'asc' })
      .range((page - 1) * 10, page * 10 - 1);

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
    };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}

async function updateBooking(
  bookingId: string,
  updates: UpdateBookingData
): Promise<Booking> {
  const { data: booking, error } = await supabase
    .from('bookings')
    .update({
      ...updates,
      datetime_of_slot: updates.booking_seated_date && updates.booking_seated_time ? 
        `${updates.booking_seated_date}T${updates.booking_seated_time}` : undefined,
      time_slot_iso: updates.booking_seated_date && updates.booking_seated_time ?
        `${updates.booking_seated_date}T${updates.booking_seated_time}` : undefined
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;
  return booking;
}

async function createBooking(
  companyId: string,
  bookingData: CreateBookingData
): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      company_id: companyId,
      ...bookingData,
      booking_status: 'Pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function deleteBooking(bookingId: string): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) throw error;
}

function subscribeToBookings(
  companyId: string,
  callback: (booking: Booking) => void
): () => void {
  const subscription = supabase
    .channel('bookings_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `company_id=eq.${companyId}`,
      },
      (payload) => {
        callback(payload.new as Booking);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

export {
  createBooking,
  createBookingWithContact,
  fetchTables,
  fetchBookings,
  updateBooking,
  deleteBooking,
  subscribeToBookings
}