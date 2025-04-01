import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
import { Button } from '../common/Button';

export const Header: React.FC = () => {


  return (
    <header className="bg-dark-secondary border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <UtensilsCrossed className="w-8 h-8 text-dark-accent" />
            <span className="text-xl font-bold text-dark-text-primary">Dined In</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {(
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
            {(
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