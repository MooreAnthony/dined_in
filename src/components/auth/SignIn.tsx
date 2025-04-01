import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { FormField } from '../common/FormField';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { Terminal } from 'lucide-react';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignIn: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const [searchParams] = useSearchParams();
  const emailFromSignup = searchParams.get('email');

  useEffect(() => {
    if (emailFromSignup) {
      setValue('email', emailFromSignup);
    }
  }, [emailFromSignup, setValue]);

  const onSubmit = async (data: SignInFormData) => {
    try {
      await signIn(data.email, data.password, rememberMe);
      navigate('/dashboard');
    } catch {
      setError('root', {
        message: 'Invalid email or password',
      });
    }
  };

  const handleDevLogin = async () => {
    try {
      await signIn('anthony.j.moore@hotmail.co.uk', 'iamanth0nY!', true);
      navigate('/dashboard');
    } catch {
      setError('root', {
        message: 'Developer login failed',
      });
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-dark-secondary rounded-xl shadow-dark-lg border border-dark-border">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-dark-accent/10 rounded-full">
            <KeyRound className="w-8 h-8 text-dark-accent" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-dark-text-primary">Welcome back</h2>
        <p className="text-dark-text-secondary">Sign in to manage your restaurant</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          label="Email Address"
          type="email"
          {...register('email')}
          error={errors.email?.message}
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
          
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-dark-accent border-dark-border rounded focus:ring-dark-accent bg-dark-secondary"
              />
              <span className="ml-2 text-sm text-dark-text-secondary">Remember me</span>
            </label>
            
            <a
              href="/forgot-password"
              className="text-sm font-medium text-dark-accent hover:text-dark-accent/80"
            >
              Forgot password?
            </a>
          </div>
        </div>

        {errors.root && (
          <div className="p-3 text-sm text-red-400 bg-red-900/20 rounded-lg">
            {errors.root.message}
          </div>
        )}

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Sign In
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dark-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-dark-secondary text-dark-text-secondary">or</span>
        </div>
      </div>

      <Button
        variant="outline"
        fullWidth
        onClick={handleDevLogin}
        className="flex items-center justify-center gap-2"
      >
        <Terminal className="w-4 h-4" />
        Developer Login
      </Button>

      <p className="text-center text-sm text-dark-text-secondary">
        Don't have an account?{' '}
        <a href="/signup" className="font-medium text-dark-accent hover:text-dark-accent/80">
          Create one
        </a>
      </p>
    </div>
  );
};