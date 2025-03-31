import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center';
  const widthStyles = fullWidth ? 'w-full' : '';
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  const variants = {
    primary: 'bg-dark-accent text-dark-text-primary hover:bg-dark-accent/90 disabled:bg-dark-accent/50',
    secondary: 'bg-dark-secondary text-dark-text-primary hover:bg-dark-secondary/90 disabled:bg-dark-secondary/50',
    outline: 'border-2 border-dark-border text-dark-text-primary hover:bg-dark-secondary',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};