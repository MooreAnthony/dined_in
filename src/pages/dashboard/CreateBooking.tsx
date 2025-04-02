import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Calendar, User, Building2, Tag as TagIcon } from 'lucide-react';
import { z } from 'zod';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { useCompany } from '../../contexts/CompanyContext';
import { useTags } from '../../hooks/useTags';
import { TagSelector } from '../../components/tags/TagSelector';
import { findContactByEmailOrMobile } from '../../services/supabase/contacts';
import { createTag } from '../../services/supabase/tags';
import { createBookingWithContact, updateBooking } from '../../services/supabase/bookings';
import { useLocations } from '../../hooks/useLocations';
import { COUNTRIES } from '../../utils/constants';
import { Tag } from '../../types/tags';

interface ContactFields {
  first_name: boolean;
  last_name: boolean;
  birthday_month: boolean;
  birthday_day: boolean;
  street_address: boolean;
  city: boolean;
  state: boolean;
  postal_code: boolean;
  country: boolean;
  communication: boolean;
  tags: boolean;
}

const createBookingSchema = z.object({
  // Contact Details
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format'),
  birthday_month: z.number().min(1).max(12).optional().nullable(),
  birthday_day: z.number().min(1).max(31).optional().nullable(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  email_consent: z.boolean().default(false),
  sms_consent: z.boolean().default(false),
  
  // Booking Details
  venue_group_id: z.string().optional(),
  location_id: z.string().min(1, 'Location is required'),
  booking_source: z.enum(['In house', 'Online', 'Phone', 'Internal']),
  booking_type: z.enum(['Table', 'Function']),
  booking_occasion: z.string().optional(),
  booking_seated_date: z.string().min(1, 'Date is required'),
  booking_seated_time: z.string().min(1, 'Time is required'),
  covers_adult: z.number().min(1, 'At least 1 adult guest is required'),
  covers_child: z.number().default(0),
  duration: z.number().min(30, 'Duration must be at least 30 minutes'),
  special_requests: z.string().optional(),
  notes: z.string().optional(),
});

type CreateBookingFormData = z.infer<typeof createBookingSchema>;

export const CreateBooking: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentCompany } = useCompany();
  const bookingData = location.state || {};
  const [selectedContactTags, setSelectedContactTags] = useState<string[]>([]);
  const { locations, isLoading } = useLocations();
  const { tags: contactTags } = useTags(currentCompany?.id, 'contact');
  const [venueGroups] = useState<{ id: string; name: string }[]>([]);// Add this line to define venueGroups
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showFields, setShowFields] = useState<ContactFields>({
    first_name: false,
    last_name: false,
    birthday_month: false,
    birthday_day: false,
    street_address: false,
    city: false,
    state: false,
    postal_code: false,
    country: false,
    communication: false,
    tags: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateBookingFormData>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      ...location.state,
      booking_source: 'In house',
      booking_type: 'Table',
      covers_child: 0,
      duration: 90,
      email_consent: false,
      sms_consent: false,
    },
  });

  const selectedVenueGroup = watch('venue_group_id');

  // Filter locations based on selected venue group
  const filteredLocations = selectedVenueGroup
    ? locations.filter(loc => loc.venue_group_id === selectedVenueGroup)
    : locations || [];

  const handleContactSearch = async (field: 'email' | 'mobile') => {
    if (!currentCompany?.id) return;
    
    setIsSearching(true);
    try {
      const email = field === 'email' ? getValues('email') : undefined;
      const mobile = field === 'mobile' ? getValues('mobile') : undefined;
      
      if (!email && !mobile) return;
      
      const contact = await findContactByEmailOrMobile(currentCompany.id, email, mobile);
      
      if (contact) {
        // Populate form with contact details
        setValue('first_name', contact.first_name);
        setValue('last_name', contact.last_name);
        setValue('email', contact.email);
        setValue('mobile', contact.mobile);
        setValue('birthday_month', contact.birthday_month || undefined);
        setValue('birthday_day', contact.birthday_day || undefined);
        setValue('street_address', contact.street_address || '');
        setValue('city', contact.city || '');
        setValue('state', contact.state || '');
        setValue('postal_code', contact.postal_code || '');
        setValue('country', contact.country || '');
        setValue('email_consent', contact.email_consent);
        setValue('sms_consent', contact.sms_consent);
        
        // Set selected tags
        if (contact.tags) {
          setSelectedContactTags(contact.tags.map(t => t.id));
        }
      } else {
        // Clear form if no contact found
        setValue('first_name', '');
        setValue('last_name', '');
        setValue('birthday_month', undefined);
        setValue('birthday_day', undefined);
        setValue('street_address', '');
        setValue('city', '');
        setValue('state', '');
        setValue('postal_code', '');
        setValue('country', '');
        setValue('email_consent', false);
        setValue('sms_consent', false);
        setSelectedContactTags([]);
      }
      
      // Show all fields after search
      setShowFields({
        first_name: true,
        last_name: true,
        birthday_month: true,
        birthday_day: true,
        street_address: true,
        city: true,
        state: true,
        postal_code: true,
        country: true,
        communication: true,
        tags: true,
      });
    } catch (error) {
      console.error('Error searching for contact:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateContactTag = async (tag: Tag) => {
    if (!currentCompany?.id) return;
    const newTag = await createTag(currentCompany.id, tag);
    setSelectedContactTags(prev => [...prev, newTag.id]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="p-4 bg-dark-accent/10 rounded-full">
            <Calendar className="w-12 h-12 text-dark-accent animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-dark-text-primary">
            Loading...
          </h2>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CreateBookingFormData) => {
    if (!currentCompany) return;

    setIsSubmitting(true);
    try {
      const bookingData = {
        ...data,
        birthday_month: data.birthday_month === null ? undefined : data.birthday_month,
        birthday_day: data.birthday_day === null ? undefined : data.birthday_day,
      };

      if (location.state?.id) {
        // Update existing booking
        await updateBooking(location.state.id, {
          location_id: data.location_id,
          booking_source: data.booking_source,
          booking_type: data.booking_type,
          booking_occasion: data.booking_occasion,
          booking_seated_date: data.booking_seated_date,
          booking_seated_time: data.booking_seated_time,
          covers_adult: data.covers_adult,
          covers_child: data.covers_child,
          duration: data.duration,
          special_requests: data.special_requests,
          notes: data.notes,
          arrived_guests: 0, // Default value
          deposit_required: false, // Default value
          deposit_amount_required: 0, // Default value
          deposit_paid: false, // Default value
          outstanding_balance: 0, // Default value
          table_ids: [], // Default value
          booking_status: 'Confirmed', // Default value
          total_payment: 0,
          total_net_payment: 0,
          total_gross_payment: 0,
          pos_tickets: [],
          seated_time: data.booking_seated_time,
          left_time: data.booking_seated_time,
          tags: selectedContactTags,
        });
      } else {
        // Create new booking
        await createBookingWithContact(currentCompany.id, bookingData);
      }
      navigate('/dashboard/bookings');
    } catch (error) {
      console.error('Failed to create booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentCompany) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="p-4 bg-red-400/10 rounded-full">
            <Calendar className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-dark-text-primary">
            No Company Selected
          </h2>
          <p className="text-dark-text-secondary">
            Please select a company to create bookings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/bookings')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-dark-text-primary">
            {location.state?.id 
              ? `Booking Details - ${bookingData.booking_reference || ''}`
              : 'New Booking'
            }
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Contact Details */}
        <div className="bg-dark-secondary rounded-lg border border-dark-border p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-dark-border">
            <div className="p-2 bg-dark-accent/10 rounded-lg">
              <User className="w-5 h-5 text-dark-accent" />
            </div>
            <div>
              <h3 className="font-medium text-dark-text-primary">Basic Information</h3>
              <p className="text-sm text-dark-text-secondary">Enter the customer's contact information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <FormField
                  label="Email Address"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleContactSearch('email')}
                  className="w-full"
                  isLoading={isSearching}
                >
                  Search by Email
                </Button>
              </div>
              <div className="space-y-2">
                <FormField
                  label="Mobile Number"
                  placeholder="+1234567890"
                  {...register('mobile')}
                  error={errors.mobile?.message}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleContactSearch('mobile')}
                  className="w-full"
                  isLoading={isSearching}
                >
                  Search by Mobile
                </Button>
              </div>
            </div>
          </div>
          
          {isSearching && (
            <div className="text-sm text-dark-text-secondary animate-pulse">
              Searching for existing contact...
            </div>
          )}
          
          {showFields.first_name && (
            <div className="grid grid-cols-2 gap-6">
              <FormField
                label="First Name"
                {...register('first_name')}
                error={errors.first_name?.message}
              />
              <FormField
                label="Last Name"
                {...register('last_name')}
                error={errors.last_name?.message}
              />
            </div>
          )}

          {showFields.birthday_month && <div className="grid grid-cols-2 gap-6">
            <FormField
              label="Birthday Month (1-12)"
              type="number"
              min={1}
              max={12}
              {...register('birthday_month', { valueAsNumber: true })}
              error={errors.birthday_month?.message}
            />
            <FormField
              label="Birthday Day (1-31)"
              type="number"
              min={1}
              max={31}
              {...register('birthday_day', { valueAsNumber: true })}
              error={errors.birthday_day?.message}
            />
          </div>}

          {showFields.street_address && <FormField
            label="Street Address"
            {...register('street_address')}
            error={errors.street_address?.message}
          />}

          {showFields.city && <div className="grid grid-cols-2 gap-6">
            <FormField
              label="City"
              {...register('city')}
              error={errors.city?.message}
            />
            <FormField
              label="State/Province"
              {...register('state')}
              error={errors.state?.message}
            />
          </div>}

          {showFields.postal_code && <div className="grid grid-cols-2 gap-6">
            <FormField
              label="Postal Code"
              {...register('postal_code')}
              error={errors.postal_code?.message}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-text-secondary">
                Country
              </label>
              <select
                {...register('country')}
                className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                  text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
              >
                <option value="">Select a country</option>
                {COUNTRIES.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-sm text-red-400">{errors.country.message}</p>
              )}
            </div>
          </div>}

          {showFields.communication && <div className="space-y-4">
            <h4 className="font-medium text-dark-text-primary">Communication Preferences</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('email_consent')}
                  className="w-4 h-4 text-dark-accent border-dark-border rounded
                    focus:ring-dark-accent bg-dark-secondary"
                />
                <span className="text-dark-text-secondary">
                  Email consent
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('sms_consent')}
                  className="w-4 h-4 text-dark-accent border-dark-border rounded
                    focus:ring-dark-accent bg-dark-secondary"
                />
                <span className="text-dark-text-secondary">
                  SMS consent
                </span>
              </label>
            </div>
          </div>}
          
          {showFields.tags && <div className="pt-4 border-t border-dark-border space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-dark-text-secondary">
              <TagIcon className="w-4 h-4" />
              Contact Tags
            </label>
            <TagSelector
              tags={contactTags}
              selectedTags={selectedContactTags}
              onTagSelect={setSelectedContactTags}
              category="contact"
              onCreateTag={handleCreateContactTag}
            />
          </div>}
        </div>

        {/* Booking Details */}
        <div className="bg-dark-secondary rounded-lg border border-dark-border p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-dark-border">
            <div className="p-2 bg-dark-accent/10 rounded-lg">
              <Building2 className="w-5 h-5 text-dark-accent" />
            </div>
            <div>
              <h3 className="font-medium text-dark-text-primary">Booking Details</h3>
              <p className="text-sm text-dark-text-secondary">
                Enter the booking information
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-text-secondary">
                Venue Group
              </label>
              <select
                {...register('venue_group_id')}
                className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                  text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
              >
                <option value="">All Venues</option>
                {(venueGroups || []).map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-text-secondary">
                Location
              </label>
              <select
                {...register('location_id')}
                className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                  text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
              >
                <option value="">Select a location</option>
                {filteredLocations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.public_name}
                  </option>
                ))}
              </select>
              {errors.location_id && (
                <p className="text-sm text-red-400">{errors.location_id.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-text-secondary">
                Booking Source
              </label>
              <select
                {...register('booking_source')}
                className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                  text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
              >
                <option value="In house">In House</option>
                <option value="Online">Online</option>
                <option value="Phone">Phone</option>
                <option value="Internal">Internal</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-text-secondary">
                Booking Type
              </label>
              <select
                {...register('booking_type')}
                className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                  text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
              >
                <option value="Table">Table</option>
                <option value="Function">Function</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              label="Date"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              {...register('booking_seated_date')}
              error={errors.booking_seated_date?.message}
            />
            <FormField
              label="Time"
              type="time"
              {...register('booking_seated_time')}
              error={errors.booking_seated_time?.message}
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <FormField
              label="Adult Guests"
              type="number"
              min={1}
              {...register('covers_adult', { valueAsNumber: true })}
              error={errors.covers_adult?.message}
            />
            <FormField
              label="Child Guests"
              type="number"
              min={0}
              {...register('covers_child', { valueAsNumber: true })}
              error={errors.covers_child?.message}
            />
            <FormField
              label="Duration (minutes)"
              type="number"
              min={30}
              step={15}
              {...register('duration', { valueAsNumber: true })}
              error={errors.duration?.message}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-text-secondary">
              Special Requests
            </label>
            <textarea
              {...register('special_requests')}
              rows={3}
              className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50
                resize-none"
              placeholder="Enter any special requests..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-text-secondary">
              Internal Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50
                resize-none"
              placeholder="Add internal notes..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/bookings')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="flex items-center gap-2"
          >
            {location.state?.id ? 'Update Booking' : 'Create Booking'}
          </Button>
        </div>
      </form>
    </div>
  );
};