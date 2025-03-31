import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    price: '29',
    description: 'Perfect for small restaurants just getting started',
    features: [
      'Up to 100 bookings per month',
      'Basic table management',
      'Email notifications',
      'Customer database',
      'Basic analytics',
    ],
  },
  {
    name: 'Professional',
    price: '79',
    description: 'Ideal for growing restaurants with multiple staff members',
    features: [
      'Unlimited bookings',
      'Advanced table management',
      'SMS & email notifications',
      'Customer insights & history',
      'Detailed analytics & reports',
      'Multiple staff accounts',
      'Special events handling',
      'API access',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '199',
    description: 'For restaurant groups and high-volume establishments',
    features: [
      'Everything in Professional',
      'Multiple location support',
      'Custom integrations',
      'Dedicated account manager',
      'Priority support',
      'Custom analytics',
      'Staff training',
      'Advanced security features',
    ],
  },
];

export const Pricing: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600">
          Choose the perfect plan for your restaurant's needs. All plans include a 14-day free trial.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`
              relative p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200
              ${plan.popular ? 'ring-2 ring-[#1a237e]' : ''}
            `}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-[#1a237e] text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center mb-2">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-600 ml-1">/month</span>
              </div>
              <p className="text-gray-600">{plan.description}</p>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="w-5 h-5 text-[#1a237e] mr-2 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <Link to="/signup" className="block">
              <Button
                fullWidth
                variant={plan.popular ? 'primary' : 'outline'}
              >
                Start Free Trial
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ Note */}
      <div className="text-center">
        <p className="text-gray-600">
          Have questions about our pricing?{' '}
          <Link to="/contact" className="text-[#1a237e] hover:text-[#1a237e]/80 font-medium">
            Contact our sales team
          </Link>
        </p>
      </div>
    </div>
  );
};