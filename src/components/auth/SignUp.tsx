import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { signUpSchema } from '../../utils/validation';
import { FormField } from '../common/FormField';
import { Button } from '../common/Button';
import { PasswordStrength } from './PasswordStrength';
import { SignUpProgress } from './SignUpProgress';
import { SignUpSuccess } from './SignUpSuccess';
import type { SignUpFormData } from '../../types';

export const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { signUp } = useAuth();
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
      await signUp(data);
      setIsSuccess(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      const isUserExists = errorMessage === 'user_already_exists';
      
      setError('root', {
        message: isUserExists 
          ? 'This email is already registered. Redirecting you to sign in...'
          : errorMessage,
      });
      
      if (isUserExists) {
        setTimeout(() => {
          window.location.href = `/signin?email=${encodeURIComponent(data.email)}`;
        }, 2000);
      }
    }
  };

  if (isSuccess) {
    return <SignUpSuccess />;
  }


  return (
    <>
      <div className="w-full">
        <SignUpProgress currentStep={0} completedSteps={[]} />
        
        <div className="max-w-md mx-auto p-8 space-y-8 bg-dark-secondary rounded-xl shadow-dark-lg border border-dark-border">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-dark-accent/10 rounded-full">
                <UserPlus className="w-8 h-8 text-dark-accent" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-dark-text-primary">Create your account</h2>
            <p className="text-dark-text-secondary">Start managing your restaurant bookings</p>
      </div>

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
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
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

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Create Account
        </Button>
        
        {errors.root && (
          <div className="p-3 text-sm text-red-400 bg-red-900/20 rounded-lg">
            {errors.root.message}
            {errors.root.message.includes('Please sign in') && (
              <div className="mt-1 text-sm text-dark-text-secondary">
                Redirecting to sign in page...
              </div>
            )}
          </div>
        )}
      </form>

      <p className="text-center text-sm text-dark-text-secondary">
        Already have an account?{' '}
        <a href="/signin" className="font-medium text-dark-accent hover:text-dark-accent/80">
          Sign in
        </a>
      </p>
        </div>
      </div>
    </>
  );
};