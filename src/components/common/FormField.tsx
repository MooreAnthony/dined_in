import React, { forwardRef } from 'react';
import { Input } from './Input';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({ label, error, ...props }, ref) => {
  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-dark-text-secondary">{label}</label>
      <Input ref={ref} error={error} {...props} />
    </div>
  );
});