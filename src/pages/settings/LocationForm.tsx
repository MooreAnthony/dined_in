import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Upload, Plus } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { useCompany } from '../../contexts/CompanyContext';
import { useLocation, useLocations, useVenueGroups } from '../../hooks/useLocations';
import { COUNTRIES } from '../../utils/constants';

interface NewVenueGroupData {
  name: string;
  description?: string;
}

const locationSchema = z.object({
  client_reference: z.string().min(1, 'Client reference is required'),
  public_name: z.string().min(2, 'Public name must be at least 2 characters'),
  internal_name: z.string().min(2, 'Internal name must be at least 2 characters'),
  venue_group_id: z.string().optional(),
  venue_type: z.string().min(1, 'Venue type is required'),
  website_url: z.string().url('Invalid website URL').optional().or(z.literal('')),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format'),
  address_line1: z.string().min(1, 'Address is required'),
  address_line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  currency_code: z.string().min(3, 'Currency code is required'),
  reservation_url: z.string().url('Invalid reservation URL').optional().or(z.literal('')),
});

type LocationFormData = z.infer<typeof locationSchema>;

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
];

export const LocationForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentCompany } = useCompany();
  const { location, isLoading: isLoadingLocation } = useLocation(id);
  const { createLocation, updateLocation } = useLocations();
  const { venueGroups, isLoading: isLoadingVenueGroups, createVenueGroup } = useVenueGroups(currentCompany?.id);
  const [isAddingVenueGroup, setIsAddingVenueGroup] = useState(false);
  const [newVenueGroup, setNewVenueGroup] = useState<NewVenueGroupData>({ name: '' });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
  });

  useEffect(() => {
    if (location) {
      reset({
        client_reference: location.client_reference,
        public_name: location.public_name,
        internal_name: location.internal_name,
        venue_type: location.venue_type,
        website_url: location.website_url || undefined,
        phone: location.phone,
        address_line1: location.address_line1,
        address_line2: location.address_line2 || undefined,
        city: location.city,
        state: location.state,
        postal_code: location.postal_code,
        country: location.country,
        latitude: location.latitude || undefined,
        longitude: location.longitude || undefined,
        currency_code: location.currency_code,
        reservation_url: location.reservation_url || undefined,
        venue_group_id: location.venue_group_id === null ? undefined : location.venue_group_id,
      });
    }
  }, [location, reset]);

  const onSubmit = async (data: LocationFormData) => {
    if (!currentCompany?.id) return;

    try {
      // Ensure venue_group_id is null if empty string
      const locationData = {
        ...data,
        venue_group_id: data.venue_group_id || null,
        website_url: data.website_url || null,
        reservation_url: data.reservation_url || null,
        address_line2: data.address_line2 || null,
        latitude: data.latitude === undefined ? null : data.latitude,
        longitude: data.longitude === undefined ? null : data.longitude,
        is_active: true, // Or false, depending on the desired default value
      };

      if (id) {
        await updateLocation(id, locationData);
      } else {
        await createLocation(locationData);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save location';
      console.error(errorMessage);
      return;
    }

    navigate('/dashboard/settings/locations');
  };

  const handleCreateVenueGroup = async () => {
    if (!currentCompany?.id || !newVenueGroup.name) return;

    try {
      const group = await createVenueGroup(
        newVenueGroup.name
      );
      // Clear the form
      setNewVenueGroup({ name: '' });
      setIsAddingVenueGroup(false);
      
      // Optional: Select the newly created group
      setValue('venue_group_id', group.id);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create venue group');
    }
  };

  if (isLoadingLocation) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="p-4 bg-dark-accent/10 rounded-full">
            <MapPin className="w-12 h-12 text-dark-accent animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-dark-text-primary">
            Loading location...
          </h2>
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
            onClick={() => navigate('/dashboard/settings/locations')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-dark-text-primary">
            {id ? 'Edit Location' : 'Add Location'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-dark-secondary rounded-lg border border-dark-border p-6 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5 text-dark-accent" />
            <h2 className="text-xl font-semibold text-dark-text-primary">Basic Information</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              label="Client Reference"
              {...register('client_reference')}
              error={errors.client_reference?.message}
            />
            <FormField
              label="Public Name"
              {...register('public_name')}
              error={errors.public_name?.message}
            />
          </div>

          <FormField
            label="Internal Name"
            {...register('internal_name')}
            error={errors.internal_name?.message}
          />

          <div className="grid grid-cols-2 gap-6">
            {isAddingVenueGroup ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark-text-secondary">
                    New Venue Group Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newVenueGroup.name}
                      onChange={(e) => setNewVenueGroup({ ...newVenueGroup, name: e.target.value })}
                      className="flex-1 px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                        text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
                      placeholder="Enter venue group name"
                    />
                    <Button
                      onClick={handleCreateVenueGroup}
                      disabled={!newVenueGroup.name}
                      type="button"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingVenueGroup(false)}
                      type="button"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-dark-text-secondary">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newVenueGroup.description || ''}
                    onChange={(e) => setNewVenueGroup({ ...newVenueGroup, description: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                      text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50
                      resize-none"
                    rows={3}
                    placeholder="Enter venue group description"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-dark-text-secondary">
                  Venue Group
                </label>
                <div className="flex gap-2">
                  <select
                    {...register('venue_group_id')}
                    className="flex-1 px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                      text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
                    disabled={isLoadingVenueGroups}
                  >
                    <option value="">Select a venue group</option>
                    {venueGroups?.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingVenueGroup(true)}
                    className="whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Group
                  </Button>
                </div>
              </div>
            )}
            <FormField
              label="Venue Type"
              {...register('venue_type')}
              error={errors.venue_type?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              label="Website URL"
              {...register('website_url')}
              error={errors.website_url?.message}
            />
            <FormField
              label="Phone Number"
              placeholder="+1234567890"
              {...register('phone')}
              error={errors.phone?.message}
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-dark-secondary rounded-lg border border-dark-border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-dark-text-primary">Address Information</h2>

          <FormField
            label="Street Address"
            {...register('address_line1')}
            error={errors.address_line1?.message}
          />

          <FormField
            label="Address Line 2 (Optional)"
            {...register('address_line2')}
            error={errors.address_line2?.message}
          />

          <div className="grid grid-cols-2 gap-6">
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
          </div>

          <div className="grid grid-cols-2 gap-6">
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
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-dark-secondary rounded-lg border border-dark-border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-dark-text-primary">Additional Details</h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-text-secondary">
                Currency
              </label>
              <select
                {...register('currency_code')}
                className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                  text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
              >
                {CURRENCIES.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
              {errors.currency_code && (
                <p className="text-sm text-red-400">{errors.currency_code.message}</p>
              )}
            </div>
            <FormField
              label="Reservation Widget URL"
              {...register('reservation_url')}
              error={errors.reservation_url?.message}
            />
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-dark-text-secondary">
              Location Photos
            </label>
            <div className="border-2 border-dashed border-dark-border rounded-lg p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <Upload className="w-12 h-12 text-dark-text-muted mb-4" />
                <p className="text-dark-text-primary font-medium">
                  Drag and drop photos here
                </p>
                <p className="text-sm text-dark-text-secondary mt-1">
                  or click to select files
                </p>
                <p className="text-xs text-dark-text-muted mt-2">
                  Maximum file size: 5MB. Supported formats: JPG, PNG
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  title="Upload location photos"
                  onChange={(e) => {
                    // Handle file upload
                    console.log('Files:', e.target.files);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/settings/locations')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            {id ? 'Update Location' : 'Create Location'}
          </Button>
        </div>
      </form>
    </div>
  );
};