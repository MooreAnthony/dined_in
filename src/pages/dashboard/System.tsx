import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Settings, Globe, DollarSign } from 'lucide-react';
import { FormField } from '../../components/common/FormField';
import { Button } from '../../components/common/Button';
import { useCompany } from '../../contexts/CompanyContext';
import { NoCompanySelected } from '../../components/dashboard/NoCompanySelected';
import { supabase } from '../../services/supabase/config';

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'British Time (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Time (JST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
];

const settingsSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  address_1: z.string().min(1, 'Address is required'),
  address_2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  country: z.string().min(2, 'Country is required'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  timezone: z.string().min(1, 'Time zone is required'),
  currency_code: z.string().min(3, 'Currency is required'),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export const System: React.FC = () => {
  const { currentCompany } = useCompany();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  React.useEffect(() => {
    const loadSettings = async () => {
      if (!currentCompany) return;

      try {
        // Load company details
        const { data: company } = await supabase
          .from('companies')
          .select('*')
          .eq('id', currentCompany.id)
          .single();

        // Load company settings
        const { data: settings } = await supabase
          .from('company_settings')
          .select('*')
          .eq('company_id', currentCompany.id)
          .single();

        if (company && settings) {
          reset({
            ...company,
            timezone: settings.timezone,
            currency_code: settings.currency_code,
          });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadSettings();
  }, [currentCompany, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    if (!currentCompany) return;

    try {
      // Start a Supabase transaction
      const { data: settings } = await supabase
        .from('company_settings')
        .select('id')
        .eq('company_id', currentCompany.id)
        .single();

      if (!settings) {
        console.error('No settings found for company:', currentCompany.id);
        return;
      }

      // Update company details
      const { error: companyError } = await supabase
        .from('companies')
        .update({
          name: data.name,
          address_1: data.address_1,
          address_2: data.address_2,
          city: data.city,
          postcode: data.postcode,
          country: data.country,
          website: data.website,
        })
        .eq('id', currentCompany.id);

      if (companyError) throw companyError;

      // Update or insert company settings
      const { error: settingsError } = await supabase
        .from('company_settings')
        .update({
          timezone: data.timezone,
          currency_code: data.currency_code,
        })
        .eq('id', settings.id);

      if (settingsError) {
        console.error('Settings update error:', settingsError);
        throw settingsError;
      }

      // Reset form state
      reset(data);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  if (!currentCompany) {
    return <NoCompanySelected />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark-text-primary">System Settings</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Company Information */}
        <div className="bg-dark-secondary rounded-lg border border-dark-border p-6 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-5 h-5 text-dark-accent" />
            <h2 className="text-xl font-semibold text-dark-text-primary">Company Information</h2>
          </div>

          <FormField
            label="Company Name"
            {...register('name')}
            error={errors.name?.message}
          />

          <FormField
            label="Address Line 1"
            {...register('address_1')}
            error={errors.address_1?.message}
          />

          <FormField
            label="Address Line 2 (Optional)"
            {...register('address_2')}
            error={errors.address_2?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="City"
              {...register('city')}
              error={errors.city?.message}
            />
            <FormField
              label="Postcode"
              {...register('postcode')}
              error={errors.postcode?.message}
            />
          </div>

          <FormField
            label="Country"
            {...register('country')}
            error={errors.country?.message}
          />

          <FormField
            label="Website (Optional)"
            {...register('website')}
            error={errors.website?.message}
          />
        </div>

        {/* Regional Settings */}
        <div className="bg-dark-secondary rounded-lg border border-dark-border p-6 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-dark-accent" />
            <h2 className="text-xl font-semibold text-dark-text-primary">Regional Settings</h2>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-text-secondary">
              Time Zone
            </label>
            <select
              {...register('timezone')}
              className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
            >
              {TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            {errors.timezone && (
              <p className="text-sm text-red-400">{errors.timezone.message}</p>
            )}
          </div>
        </div>

        {/* Currency Settings */}
        <div className="bg-dark-secondary rounded-lg border border-dark-border p-6 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-5 h-5 text-dark-accent" />
            <h2 className="text-xl font-semibold text-dark-text-primary">Currency Settings</h2>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-text-secondary">
              Primary Currency
            </label>
            <select
              {...register('currency_code')}
              className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
            >
              {CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
            {errors.currency_code && (
              <p className="text-sm text-red-400">{errors.currency_code.message}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!isDirty}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};