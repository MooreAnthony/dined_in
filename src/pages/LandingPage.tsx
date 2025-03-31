import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Calendar, Users, TrendingUp } from 'lucide-react';
import { Button } from '../components/common/Button';
import { LogoBanner } from '../components/common/LogoBanner';

export const LandingPage: React.FC = () => {
  return (
    <div className="container mx-auto space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1a237e] via-purple-600 to-pink-500 animate-gradient bg-300% pb-2">
            Modern Restaurant Booking Made Simple
          </h1>
          <p className="text-xl text-gray-600">
            Streamline your restaurant's booking process and delight your customers with our
            intuitive reservation system.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/signup">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Client Logo Banner */}
        <div className="mt-16">
          <p className="text-center text-sm text-gray-500 mb-8">
            Trusted by leading restaurants worldwide
          </p>
          <LogoBanner />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Everything you need to manage bookings
          </h2>
          <p className="mt-4 text-gray-600">
            Powerful features to help you grow your restaurant business
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#1a237e]/10 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-[#1a237e]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Smart Scheduling
            </h3>
            <p className="text-gray-600">
              Intelligent booking system that optimizes your table management and prevents
              double bookings.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#1a237e]/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[#1a237e]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Customer Management
            </h3>
            <p className="text-gray-600">
              Keep track of customer preferences and history to provide personalized service.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#1a237e]/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[#1a237e]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Analytics & Insights
            </h3>
            <p className="text-gray-600">
              Make data-driven decisions with detailed reports and booking analytics.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1a237e] rounded-2xl p-12 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center">
            <div className="p-3 bg-white/10 rounded-full">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">
            Ready to transform your booking experience?
          </h2>
          <p className="text-lg text-white/80">
            Join thousands of restaurants already using Dined In to manage their bookings
            efficiently.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/signup">
              <Button variant="secondary" size="lg">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-white hover:bg-white/10"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};