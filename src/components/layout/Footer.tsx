import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Facebook, Twitter, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-secondary border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <UtensilsCrossed className="w-8 h-8 text-dark-accent" />
              <span className="text-xl font-bold text-dark-text-primary">Dined In</span>
            </Link>
            <p className="text-dark-text-secondary text-sm">
              Streamline your restaurant bookings with our modern reservation system.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-text-muted hover:text-dark-accent"
                title="Visit our Facebook page"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-text-muted hover:text-dark-accent"
                title="Visit our Twitter page"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-text-muted hover:text-dark-accent"
                title="Visit our Instagram page"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-dark-text-primary mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-dark-text-secondary hover:text-dark-text-primary">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-dark-text-secondary hover:text-dark-text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/integrations" className="text-dark-text-secondary hover:text-dark-text-primary">
                  Integrations
                </Link>
              </li>
              <li>
                <Link to="/updates" className="text-dark-text-secondary hover:text-dark-text-primary">
                  Updates
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-dark-text-primary mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-dark-text-secondary hover:text-dark-text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-dark-text-secondary hover:text-dark-text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-dark-text-secondary hover:text-dark-text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-dark-text-secondary hover:text-dark-text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-dark-text-primary mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-dark-text-secondary hover:text-dark-text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-dark-text-secondary hover:text-dark-text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-dark-text-secondary hover:text-dark-text-primary">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-dark-border">
          <p className="text-dark-text-muted text-sm text-center">
            © {new Date().getFullYear()} Dined In. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};