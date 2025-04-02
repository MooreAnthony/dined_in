import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { z } from 'zod';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { useCompany } from '../../contexts/CompanyContext';
import { COUNTRIES } from '../../utils/constants';
import { createContact } from '../../services/supabase/contacts';

const contactSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  birthday_month: z.number().min(1).max(12).optional().nullable(),
  birthday_day: z.number().min(1).max(31).optional().nullable(),
  mobile: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format'),
  company_name: z.string().optional(),
  contact_source: z.enum(['Website', 'Referral', 'Event', 'Other'] as const).optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  email_consent: z.boolean().default(false),
  sms_consent: z.boolean().default(false),
  preferred_contact_method: z.enum(['Email', 'SMS', 'Phone'] as const),
  notes: z.string().optional(),
  is_test_profile: z.boolean().default(false),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const CreateContact: React.FC = () => {
  const navigate = useNavigate();
  const { currentCompany } = useCompany();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email_consent: false,
      sms_consent: false,
      is_test_profile: false,
      preferred_contact_method: 'Email',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    if (!currentCompany) return;

    try {
      await createContact(currentCompany.id, data);
      navigate('/dashboard/contacts');
    } catch (error) {
      console.error('Failed to create contact:', error);
    }
  };

  if (!currentCompany) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="p-4 bg-red-400/10 rounded-full">
            <UserPlus className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-dark-text-primary">
            No Company Selected
          </h2>
          <p className="text-dark-text-secondary">
            Please select a company to create contacts
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
            onClick={() => navigate('/dashboard/contacts')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-dark-text-primary">Create Contact</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-dark-secondary rounded-lg border border-dark-border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-dark-text-primary">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <FormField
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <FormField
            label="Mobile Number"
            placeholder="+1234567890"
            {...register('mobile')}
            error={errors.mobile?.message}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-dark-secondary rounded-lg border border-dark-border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-dark-text-primary">Business Information</h2>
          <FormField
            label="Company Name"
            {...register('company_name')}
            error={errors.company_name?.message}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-text-secondary">
              Contact Source
            </label>
            <select
              {...register('contact_source')}
              className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
            >
              <option value="">Select a source</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Event">Event</option>
              <option value="Other">Other</option>
            </select>
            {errors.contact_source && (
              <p className="text-sm text-red-400">{errors.contact_source.message}</p>
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-dark-secondary rounded-lg border border-dark-border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-dark-text-primary">Address Information</h2>
          <FormField
            label="Street Address"
            {...register('street_address')}
            error={errors.street_address?.message}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Communication Preferences */}
        <div className="bg-dark-secondary rounded-lg border border-dark-border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-dark-text-primary">Communication Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('email_consent')}
                className="w-4 h-4 text-dark-accent border-dark-border rounded
                  focus:ring-dark-accent bg-dark-secondary"
              />
              <span className="text-dark-text-secondary">Email consent</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('sms_consent')}
                className="w-4 h-4 text-dark-accent border-dark-border rounded
                  focus:ring-dark-accent bg-dark-secondary"
              />
              <span className="text-dark-text-secondary">SMS consent</span>
            </label>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-text-secondary">
              Preferred Contact Method
            </label>
            <select
              {...register('preferred_contact_method')}
              className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
            >
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="Phone">Phone</option>
            </select>
            {errors.preferred_contact_method && (
              <p className="text-sm text-red-400">{errors.preferred_contact_method.message}</p>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-dark-secondary rounded-lg border border-dark-border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-dark-text-primary">Additional Information</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-text-secondary">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={4}
              className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50
                resize-none"
              placeholder="Add any additional notes about this contact..."
            />
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('is_test_profile')}
              className="w-4 h-4 text-dark-accent border-dark-border rounded
                focus:ring-dark-accent bg-dark-secondary"
            />
            <span className="text-dark-text-secondary">This is a test profile</span>
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/contacts')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Create Contact
          </Button>
        </div>
      </form>
    </div>
  );
};