import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../common/Modal';
import { FormField } from '../common/FormField';
import { Button } from '../common/Button';
import { COUNTRIES } from '../../utils/constants';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  birthdayMonth: z.number().min(1).max(12).optional(),
  birthdayDay: z.number().min(1).max(31).optional(),
  mobile: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format'),
  companyName: z.string().optional(),
  contactSource: z.enum(['Website', 'Referral', 'Event', 'Other']),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  emailConsent: z.boolean(),
  smsConsent: z.boolean(),
  preferredContactMethod: z.enum(['Email', 'SMS', 'Phone']),
  notes: z.string().optional(),
  isTestProfile: z.boolean(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      emailConsent: false,
      smsConsent: false,
      isTestProfile: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Handle contact creation
      console.log('Contact data:', data);
      onClose();
    } catch (error) {
      console.error('Failed to create contact:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Contact"
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-dark-text-primary">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="First Name"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <FormField
              label="Last Name"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>
          <FormField
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Birthday Month (1-12)"
              type="number"
              min={1}
              max={12}
              {...register('birthdayMonth', { valueAsNumber: true })}
              error={errors.birthdayMonth?.message}
            />
            <FormField
              label="Birthday Day (1-31)"
              type="number"
              min={1}
              max={31}
              {...register('birthdayDay', { valueAsNumber: true })}
              error={errors.birthdayDay?.message}
            />
          </div>
          <FormField
            label="Mobile Number"
            placeholder="+1234567890"
            {...register('mobile')}
            error={errors.mobile?.message}
          />
        </div>

        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-dark-text-primary">Business Information</h3>
          <FormField
            label="Company Name"
            {...register('companyName')}
            error={errors.companyName?.message}
          />
          <div className="w-full space-y-2">
            <label className="block text-sm font-medium text-dark-text-secondary">
              Contact Source
            </label>
            <select
              {...register('contactSource')}
              className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
            >
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Event">Event</option>
              <option value="Other">Other</option>
            </select>
            {errors.contactSource && (
              <p className="text-sm text-red-400">{errors.contactSource.message}</p>
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-dark-text-primary">Address Information</h3>
          <FormField
            label="Street Address"
            {...register('streetAddress')}
            error={errors.streetAddress?.message}
          />
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Postal Code"
              {...register('postalCode')}
              error={errors.postalCode?.message}
            />
            <div className="w-full space-y-2">
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
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-dark-text-primary">Communication Preferences</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('emailConsent')}
                className="w-4 h-4 text-dark-accent border-dark-border rounded
                  focus:ring-dark-accent bg-dark-secondary"
              />
              <span className="text-sm text-dark-text-secondary">
                Email consent
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('smsConsent')}
                className="w-4 h-4 text-dark-accent border-dark-border rounded
                  focus:ring-dark-accent bg-dark-secondary"
              />
              <span className="text-sm text-dark-text-secondary">
                SMS/Mobile consent
              </span>
            </label>
          </div>
          <div className="w-full space-y-2">
            <label className="block text-sm font-medium text-dark-text-secondary">
              Preferred Contact Method
            </label>
            <select
              {...register('preferredContactMethod')}
              className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
                text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50"
            >
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="Phone">Phone</option>
            </select>
            {errors.preferredContactMethod && (
              <p className="text-sm text-red-400">{errors.preferredContactMethod.message}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-dark-text-secondary">
            Notes/Comments
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            className="w-full px-4 py-2 bg-dark-secondary border-2 border-dark-border rounded-lg
              text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/50
              resize-none"
          />
          {errors.notes && (
            <p className="text-sm text-red-400">{errors.notes.message}</p>
          )}
        </div>

        {/* Test Profile */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('isTestProfile')}
            className="w-4 h-4 text-dark-accent border-dark-border rounded
              focus:ring-dark-accent bg-dark-secondary"
          />
          <span className="text-sm text-dark-text-secondary">
            This is a test profile
          </span>
        </label>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
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
    </Modal>
  );
};