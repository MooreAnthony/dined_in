import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { companySchema } from '../../utils/validation';
import { FormField } from '../common/FormField';
import { Button } from '../common/Button';
import { COUNTRIES } from '../../utils/constants';
import { SignUpProgress } from './SignUpProgress';
import { useCompany } from '../../hooks/useCompany';
import type { CompanyFormData } from '../../types';

export const SignUpExtended: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { registerCompany, isLoading } = useCompany();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  const onSubmit = async (data: CompanyFormData) => {
    try {
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }
      
      await registerCompany(data, session.user.id);
      navigate('/signup/complete');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to register company';
      setError('root', { message: errorMessage });
    }
  };

  return (
    <>
      <div className="w-full">
        <SignUpProgress currentStep={2} completedSteps={[0, 1]} />
        <div className="max-w-2xl mx-auto p-8 space-y-8 bg-dark-secondary rounded-xl shadow-dark-lg border border-dark-border">
          <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-dark-accent/10 rounded-full">
            <Building2 className="w-8 h-8 text-dark-accent" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-dark-text-primary">Tell us about your restaurant</h2>
        <p className="text-dark-text-secondary">
          We'll use this information to set up your restaurant profile
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          label="Restaurant Name"
          placeholder="e.g., The Golden Spoon"
          {...register('name')}
          error={errors.name?.message}
        />

        <div className="space-y-4">
          <FormField
            label="Address Line 1"
            placeholder="Street address"
            {...register('address1')}
            error={errors.address1?.message}
          />
          <FormField
            label="Address Line 2 (Optional)"
            placeholder="Suite, unit, building, etc."
            {...register('address2')}
            error={errors.address2?.message}
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
          <div className="w-full space-y-2">
            <label className="block text-sm font-medium text-dark-text-secondary">Country</label>
            <select
              {...register('country')}
              className={`
                w-full px-4 py-2 rounded-lg border-2 
                ${errors.country ? 'border-red-400' : 'border-dark-border'}
                focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 
                focus:border-dark-accent transition-all duration-200
                bg-dark-secondary text-dark-text-primary
              `}
            >
              <option value="">Select a country</option>
              {COUNTRIES.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-400">{errors.country.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 text-dark-accent">
            <Globe className="w-5 h-5" />
            <h3 className="font-semibold">Online Presence</h3>
          </div>
          <FormField
            label="Website (Optional)"
            placeholder="https://your-restaurant.com"
            {...register('website')}
            error={errors.website?.message}
          />
        </div>

        <FormField
          label="Promo Code (Optional)"
          placeholder="Enter your promo code"
          {...register('promoCode')}
          error={errors.promoCode?.message}
        />
        
        {errors.root && (
          <div className="p-3 text-sm text-red-400 bg-red-900/20 rounded-lg">
            {errors.root.message}
          </div>
        )}

        <div className="pt-4">
          <Button type="submit" fullWidth isLoading={isSubmitting || isLoading}>
            Complete Registration
          </Button>
        </div>
      </form>
        </div>
      </div>
    </>
  );
};