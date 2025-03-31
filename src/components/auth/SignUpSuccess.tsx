import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { SignUpProgress } from './SignUpProgress';

export const SignUpSuccess: React.FC = () => {
  return (
    <>
      <div className="w-full">
        <SignUpProgress currentStep={1} completedSteps={[0]} />
        <div className="max-w-md mx-auto p-8 space-y-8 bg-dark-secondary rounded-xl shadow-dark-lg border border-dark-border text-center">
          <div className="space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-green-900/20 rounded-full">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-dark-text-primary">Welcome to Dined In!</h2>
        <p className="text-dark-text-secondary">
          Your account has been created successfully. We've sent you a verification email to confirm your email address.
        </p>
      </div>

      <div className="space-y-6 pt-6">
        <div className="p-4 bg-dark-accent/10 rounded-lg text-left">
          <h3 className="font-medium text-dark-text-primary mb-2">Next steps:</h3>
          <ul className="space-y-2 text-sm text-dark-text-secondary">
            <li className="flex items-start">
              <span className="w-4 h-4 mr-2 rounded-full bg-dark-accent/20 flex-shrink-0 mt-0.5" />
              Check your email and click the verification link
            </li>
            <li className="flex items-start">
              <span className="w-4 h-4 mr-2 rounded-full bg-dark-accent/20 flex-shrink-0 mt-0.5" />
              Complete your restaurant profile
            </li>
            <li className="flex items-start">
              <span className="w-4 h-4 mr-2 rounded-full bg-dark-accent/20 flex-shrink-0 mt-0.5" />
              Set up your booking preferences
            </li>
          </ul>
        </div>

        <div className="pt-2">
          <Link to="/signup/extended">
          <Button
            fullWidth
            className="flex items-center justify-center gap-2"
          >
            Continue to Restaurant Setup
            <ArrowRight className="w-4 h-4" />
          </Button>
          </Link>
        </div>
      </div>
        </div>
      </div>
    </>
  );
};