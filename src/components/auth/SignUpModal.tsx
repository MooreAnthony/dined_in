import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signUpSchema } from '../../utils/validation';
import { Modal } from '../common/Modal';
import { FormField } from '../common/FormField';
import { Button } from '../common/Button';
import { PasswordStrength } from './PasswordStrength';
import type { SignUpFormData } from '../../types';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const password = watch('password', '');

  const onSubmit = async (data: SignUpFormData) => {
    try {
      // Handle sign up logic here
      await new Promise((resolve) => {
        console.log('Submitting user data:', data);
        setTimeout(resolve, 1000);
      }); // Simulated API call
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      setError('root', { message: errorMessage });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create your account"
      className="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        <FormField
          label="Mobile Number"
          type="tel"
          placeholder="+1234567890"
          {...register('mobile')}
          error={errors.mobile?.message}
        />

        <div className="space-y-2">
          <div className="relative">
            <FormField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-dark-text-muted hover:text-dark-text-secondary"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <PasswordStrength password={password} />
        </div>

        {errors.root && (
          <div className="p-3 text-sm text-red-400 bg-red-900/20 rounded-lg">
            {errors.root.message}
          </div>
        )}

        <div className="pt-4">
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </div>

        <p className="text-center text-sm text-dark-text-secondary">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onClose}
            className="font-medium text-dark-accent hover:text-dark-accent/80"
          >
            Sign in instead
          </button>
        </p>
      </form>
    </Modal>
  );
};