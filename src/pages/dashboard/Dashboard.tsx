import React from 'react';
import {
  Calendar,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  Clock,
  Activity,
  XCircle,
} from 'lucide-react';
import { KpiCard } from '../../components/dashboard/KpiCard';
import { BookingsFeed } from '../../components/dashboard/BookingsFeed';

export const Dashboard: React.FC = () => {
  // Mock data - replace with real data from your backend
  const kpis = [
    {
      title: 'Total Bookings Today',
      value: '24',
      trend: { value: 12, isPositive: true },
      icon: Calendar,
      description: '8 pending confirmations',
    },
    {
      title: 'Revenue Today',
      value: '$1,248',
      trend: { value: 8, isPositive: true },
      icon: DollarSign,
      description: 'Avg. $52 per booking',
    },
    {
      title: 'Occupancy Rate',
      value: '78%',
      trend: { value: 5, isPositive: true },
      icon: Users,
      description: '12 tables available',
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8',
      icon: Star,
      description: 'Based on 156 reviews',
    },
    {
      title: 'Conversion Rate',
      value: '64%',
      trend: { value: 3, isPositive: false },
      icon: TrendingUp,
      description: '256 visits, 164 bookings',
    },
    {
      title: 'Peak Hours',
      value: '19:00 - 21:00',
      icon: Clock,
      description: '85% occupancy during peak',
    },
    {
      title: 'Active Bookings',
      value: '18',
      icon: Activity,
      description: '6 arriving in next hour',
    },
    {
      title: 'Cancellation Rate',
      value: '4.2%',
      trend: { value: 1.5, isPositive: true },
      icon: XCircle,
      description: '3 cancellations today',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark-text-primary">Dashboard</h1>
        <div className="text-dark-text-secondary">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            trend={kpi.trend}
            icon={kpi.icon}
            description={kpi.description}
          />
        ))}
      </div>

      {/* Recent Bookings Feed */}
      <BookingsFeed />
    </div>
  );
};