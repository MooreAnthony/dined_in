import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ error, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        ref={ref}
        className={`
          w-full px-4 py-2 rounded-lg border-2 
          ${error ? 'border-red-500' : 'border-gray-200'} 
          focus:outline-none focus:ring-2 focus:ring-dark-accent/20 
          focus:border-dark-accent transition-all duration-200
          bg-dark-secondary text-dark-text-primary
          placeholder-dark-text-muted
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
});