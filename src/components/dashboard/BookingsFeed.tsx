import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';

interface BookingFeedItem {
  id: string;
  customerName: string;
  date: string;
  time: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const mockBookings: BookingFeedItem[] = [
  {
    id: '1',
    customerName: 'John Smith',
    date: '2025-03-18',
    time: '19:00',
    guests: 4,
    status: 'confirmed',
  },
  {
    id: '2',
    customerName: 'Emma Wilson',
    date: '2025-03-18',
    time: '20:30',
    guests: 2,
    status: 'pending',
  },
  {
    id: '3',
    customerName: 'Michael Brown',
    date: '2025-03-19',
    time: '18:00',
    guests: 6,
    status: 'cancelled',
  },
];

export const BookingsFeed: React.FC = () => {
  return (
    <div className="bg-dark-secondary rounded-xl border border-dark-border p-6">
      <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Recent Bookings</h3>
      <div className="space-y-4">
        {mockBookings.map((booking) => (
          <div
            key={booking.id}
            className="flex items-center justify-between p-4 rounded-lg bg-dark-primary border border-dark-border"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-dark-accent/10 rounded-lg">
                <User className="w-5 h-5 text-dark-accent" />
              </div>
              <div>
                <p className="font-medium text-dark-text-primary">{booking.customerName}</p>
                <div className="flex items-center space-x-4 mt-1 text-sm text-dark-text-secondary">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {booking.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {booking.time}
                  </div>
                  <div>
                    {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${booking.status === 'confirmed' ? 'bg-green-400/10 text-green-400' : ''}
                ${booking.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' : ''}
                ${booking.status === 'cancelled' ? 'bg-red-400/10 text-red-400' : ''}
              `}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};