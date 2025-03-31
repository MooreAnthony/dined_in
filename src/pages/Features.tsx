import React from 'react';
import { Calendar, Users, TrendingUp, Bell, Clock, Smartphone, Shield, Gift, Zap } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Intelligent booking system that optimizes your table management and prevents double bookings.',
  },
  {
    icon: Users,
    title: 'Customer Management',
    description: 'Keep track of customer preferences and history to provide personalized service.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics & Insights',
    description: 'Make data-driven decisions with detailed reports and booking analytics.',
  },
  {
    icon: Bell,
    title: 'Instant Notifications',
    description: 'Automated SMS and email notifications for bookings, confirmations, and reminders.',
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Live updates on table status and waiting lists to maximize efficiency.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Manage your bookings on the go with our powerful mobile application.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Process deposits and payments securely with integrated payment processing.',
  },
  {
    icon: Gift,
    title: 'Special Events',
    description: 'Handle special events, private dining, and group bookings with ease.',
  },
  {
    icon: Zap,
    title: 'Quick Setup',
    description: 'Get started in minutes with our easy-to-use setup wizard and onboarding process.',
  },
];

export const Features: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Powerful Features for Modern Restaurants
        </h1>
        <p className="text-xl text-gray-600">
          Everything you need to streamline your restaurant's booking process and enhance your
          customer experience.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 bg-[#1a237e]/10 rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-[#1a237e]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};