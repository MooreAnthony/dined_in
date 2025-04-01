import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { FormField } from '../common/FormField';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await resetPassword(data.email);
      setSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-green-100 rounded-full">
              <KeyRound className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
          <p className="text-gray-600">
            We've sent password reset instructions to your email address.
          </p>
        </div>
        
        <Link to="/signin">
          <Button variant="outline" fullWidth className="flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-[#1a237e]/10 rounded-full">
            <KeyRound className="w-8 h-8 text-[#1a237e]" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Reset your password</h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          label="Email Address"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Send Reset Instructions
        </Button>
      </form>

      <Link to="/signin" className="block">
        <Button
          variant="outline"
          fullWidth
          className="flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Button>
      </Link>
    </div>
  );
};
