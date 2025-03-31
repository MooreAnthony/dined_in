import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
  const { session, signOut } = useAuth();

  return (
    <header className="bg-dark-secondary border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <UtensilsCrossed className="w-8 h-8 text-dark-accent" />
            <span className="text-xl font-bold text-dark-text-primary">Dined In</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-dark-text-secondary hover:text-dark-text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/bookings"
                  className="text-dark-text-secondary hover:text-dark-text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Bookings
                </Link>
                <Link
                  to="/settings"
                  className="text-dark-text-secondary hover:text-dark-text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Settings
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/features"
                  className="text-dark-text-secondary hover:text-dark-text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Features
                </Link>
                <Link
                  to="/pricing"
                  className="text-dark-text-secondary hover:text-dark-text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Pricing
                </Link>
                <Link
                  to="/contact"
                  className="text-dark-text-secondary hover:text-dark-text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  to="/profile"
                  className="p-2 text-dark-text-secondary hover:text-dark-text-primary rounded-full hover:bg-dark-primary"
                >
                  <User className="w-5 h-5" />
                </Link>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};