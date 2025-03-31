import React from 'react';
import { Check, X } from 'lucide-react';

interface Requirement {
  label: string;
  test: (value: string) => boolean;
}

const requirements: Requirement[] = [
  {
    label: 'At least 8 characters',
    test: (value) => value.length >= 8,
  },
  {
    label: 'Contains uppercase letter',
    test: (value) => /[A-Z]/.test(value),
  },
  {
    label: 'Contains number',
    test: (value) => /[0-9]/.test(value),
  },
];

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const strength = requirements.filter((req) => req.test(password)).length;
  const percentage = (strength / requirements.length) * 100;

  return (
    <div className="mt-2 space-y-2">
      <div className="h-2 w-full bg-dark-border rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            percentage === 100
              ? 'bg-green-400'
              : percentage > 50
              ? 'bg-yellow-400'
              : 'bg-red-400'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <ul className="space-y-1 text-sm text-dark-text-secondary">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center">
            {req.test(password) ? (
              <Check className="w-4 h-4 text-green-400 mr-2" />
            ) : (
              <X className="w-4 h-4 text-red-400 mr-2" />
            )}
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
};