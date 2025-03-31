import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { SignUpProgress } from './SignUpProgress';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { verifyEmail } = useAuth();

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        await verifyEmail(token);
        setStatus('success');
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
      }
    };

    verify();
  }, [token, verifyEmail]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <div className="p-3 bg-dark-accent/10 rounded-full">
              <Loader2 className="w-8 h-8 text-dark-accent animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-dark-text-primary">Verifying your email</h2>
            <p className="text-dark-text-secondary">Please wait while we verify your email address...</p>
          </>
        );

      case 'success':
        return (
          <>
            <div className="p-3 bg-green-900/20 rounded-full">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-dark-text-primary">Email verified!</h2>
            <p className="text-dark-text-secondary">
              Your email has been successfully verified. You can now sign in to your account.
            </p>
            <Link to="/signin" className="block">
              <Button fullWidth>Sign In</Button>
            </Link>
          </>
        );

      case 'error':
        return (
          <>
            <div className="p-3 bg-red-900/20 rounded-full">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-dark-text-primary">Verification failed</h2>
            <p className="text-dark-text-secondary">
              We couldn't verify your email address. The link may have expired or is invalid.
            </p>
            <Link to="/signup" className="block">
              <Button fullWidth variant="outline">Back to Sign Up</Button>
            </Link>
          </>
        );
    }
  };

  return (
    <>
      <div className="w-full">
        <SignUpProgress currentStep={1} completedSteps={[0]} />
        <div className="max-w-md mx-auto p-8 space-y-8 bg-dark-secondary rounded-xl shadow-dark-lg border border-dark-border">
          <div className="text-center space-y-4">{renderContent()}</div>
        </div>
      </div>
    </>
  );
};