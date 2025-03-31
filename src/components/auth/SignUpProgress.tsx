import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    title: 'Create Account',
    description: 'Personal details',
  },
  {
    title: 'Email Verification',
    description: 'Verify your email address',
  },
  {
    title: 'Restaurant Details',
    description: 'Business information',
  },
  {
    title: 'Complete',
    description: 'Start using Dined In',
  },
];

interface SignUpProgressProps {
  currentStep: number;
  completedSteps: number[];
}

export const SignUpProgress: React.FC<SignUpProgressProps> = ({ currentStep, completedSteps }) => {
  return (
    <div className="w-full max-w-5xl mx-auto mb-16 px-4">
      <div className="relative">
        <div className="absolute top-6 w-full h-0.5 bg-dark-border">
          <div
            className="h-full bg-dark-accent transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center flex flex-col items-center w-48">
              <div
                className={`
                  w-14 h-14 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${
                    completedSteps.includes(index)
                      ? 'bg-dark-accent text-dark-text-primary'
                      : index === currentStep
                      ? 'bg-dark-secondary border-2 border-dark-accent text-dark-accent'
                      : 'bg-dark-secondary border-2 border-dark-border text-dark-text-muted'
                  }
                `}
                aria-current={index === currentStep ? 'step' : undefined}
              >
                {completedSteps.includes(index) ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="text-lg">{index + 1}</span>
                )}
              </div>
              <div className="absolute top-20 w-48">
                <div className="text-sm font-medium text-dark-text-primary mb-2">{step.title}</div>
                <div className="text-xs text-dark-text-secondary">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-32" /> {/* Increased spacer for better separation */}
    </div>
  );
};