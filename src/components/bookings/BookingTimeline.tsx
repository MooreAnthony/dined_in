import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '../common/Button';
import type { Booking } from '../../types/bookings';

interface BookingTimelineProps {
  bookings: Booking[];
  date: Date;
  onBookingClick?: (booking: Booking) => void;
}

const HOURS = Array.from({ length: 11 }, (_, i) => i + 9); // 9 AM to 7 PM
const SEGMENTS_PER_HOUR = 4; // 15-minute segments
const SEGMENT_WIDTH = 60; // pixels
const TIMELINE_HEIGHT = 120; // pixels

const formatTime = (hour: number, segment: number) => {
  const minutes = segment * 15;
  return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const getBookingPosition = (booking: Booking) => {
  const [hours, minutes] = booking.booking_time.split(':').map(Number);
  const totalMinutes = (hours - 9) * 60 + minutes;
  return Math.floor(totalMinutes / 15) * SEGMENT_WIDTH;
};

const getBookingWidth = (guests: number) => {
  // Scale width based on guest count (minimum 2 segments, maximum 8 segments)
  return Math.min(Math.max(guests * 30, SEGMENT_WIDTH * 2), SEGMENT_WIDTH * 8);
};

const getBookingColor = (index: number) => {
  const colors = [
    'bg-blue-400/85',
    'bg-green-400/85',
    'bg-purple-400/85',
    'bg-yellow-400/85',
    'bg-pink-400/85',
  ];
  return colors[index % colors.length];
};

export const BookingTimeline: React.FC<BookingTimelineProps> = ({
  bookings,
  date,
  onBookingClick,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [touchStart, setTouchStart] = useState(0);

  // Calculate current time indicator position
  const getCurrentTimePosition = () => {
    const now = new Date();
    if (
      now.toDateString() === date.toDateString() &&
      now.getHours() >= 9 &&
      now.getHours() < 19
    ) {
      const totalMinutes = (now.getHours() - 9) * 60 + now.getMinutes();
      return Math.floor(totalMinutes / 15) * SEGMENT_WIDTH;
    }
    return -1;
  };

  const [currentTimePosition, setCurrentTimePosition] = useState(getCurrentTimePosition());

  // Update current time position every minute
  useEffect(() => {
    if (date.toDateString() !== new Date().toDateString()) return;

    const interval = setInterval(() => {
      setCurrentTimePosition(getCurrentTimePosition());
    }, 60000);

    return () => clearInterval(interval);
  }, [date]);

  // Scroll handling
  const handleScroll = () => {
    if (!timelineRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = timelineRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
  };

  // Touch handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!timelineRef.current) return;
    const diff = touchStart - e.touches[0].clientX;
    timelineRef.current.scrollLeft += diff;
    setTouchStart(e.touches[0].clientX);
  };

  // Scroll to current time on mount and when date changes
  useEffect(() => {
    if (!timelineRef.current || currentTimePosition < 0) return;
    timelineRef.current.scrollLeft = currentTimePosition - timelineRef.current.clientWidth / 2;
  }, [currentTimePosition, date]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!timelineRef.current) return;
      const SCROLL_AMOUNT = SEGMENT_WIDTH * 4; // Scroll by 1 hour

      if (e.key === 'ArrowLeft') {
        timelineRef.current.scrollLeft -= SCROLL_AMOUNT;
      } else if (e.key === 'ArrowRight') {
        timelineRef.current.scrollLeft += SCROLL_AMOUNT;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative bg-dark-secondary rounded-lg border border-dark-border p-4">
      {/* Timeline Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dark-text-primary">Daily Schedule</h3>
        {currentTimePosition >= 0 && (
          <Button
            variant="outline"
            onClick={() => {
              if (!timelineRef.current) return;
              timelineRef.current.scrollLeft = currentTimePosition - timelineRef.current.clientWidth / 2;
            }}
            className="flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Jump to Current Time
          </Button>
        )}
      </div>

      {/* Timeline Navigation */}
      {showLeftArrow && (
        <button
          onClick={() => {
            if (!timelineRef.current) return;
            timelineRef.current.scrollLeft -= SEGMENT_WIDTH * 4;
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-dark-secondary/90 
            rounded-r-lg border border-l-0 border-dark-border hover:bg-dark-accent/10"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-dark-text-primary" />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => {
            if (!timelineRef.current) return;
            timelineRef.current.scrollLeft += SEGMENT_WIDTH * 4;
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-dark-secondary/90 
            rounded-l-lg border border-r-0 border-dark-border hover:bg-dark-accent/10"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-dark-text-primary" />
        </button>
      )}

      {/* Timeline Container */}
      <div
        ref={timelineRef}
        className="overflow-x-auto relative"
        style={{ height: TIMELINE_HEIGHT }}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Timeline Grid */}
        <div
          className="relative"
          style={{
            width: HOURS.length * SEGMENT_WIDTH * SEGMENTS_PER_HOUR,
            height: '100%',
          }}
        >
          {/* Hour Markers */}
          <div className="absolute top-0 left-0 right-0 flex">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex-none border-l border-dark-border"
                style={{ width: SEGMENT_WIDTH * SEGMENTS_PER_HOUR }}
              >
                <div className="px-2 py-1 text-sm font-medium text-dark-text-secondary bg-dark-secondary sticky left-0">
                  {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>
              </div>
            ))}
          </div>

          {/* 15-minute Segment Lines */}
          <div className="absolute top-8 bottom-0 left-0 right-0 flex">
            {HOURS.map((hour) =>
              Array.from({ length: SEGMENTS_PER_HOUR }).map((_, segment) => (
                <div
                  key={`${hour}-${segment}`}
                  className="flex-none border-l border-dark-border/15"
                  style={{ width: SEGMENT_WIDTH }}
                />
              ))
            )}
          </div>

          {/* Current Time Indicator */}
          {currentTimePosition >= 0 && (
            <div
              className="absolute top-8 bottom-0 w-0.5 bg-red-400 z-20"
              style={{ left: currentTimePosition }}
            >
              <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-red-400" />
            </div>
          )}

          {/* Bookings */}
          <div className="absolute top-8 left-0 right-0 bottom-0">
            {bookings.map((booking, index) => {
              const left = getBookingPosition(booking);
              const width = getBookingWidth(booking.guests);
              const color = getBookingColor(index);

              return (
                <button
                  key={booking.id}
                  onClick={() => onBookingClick?.(booking)}
                  className={`absolute p-2 rounded-lg ${color} hover:brightness-110 
                    transition-all duration-300 cursor-pointer`}
                  style={{
                    left,
                    width,
                    top: `${(index % 3) * 33}%`,
                    height: '30%',
                  }}
                  aria-label={`Booking for ${booking.customer_name} at ${booking.booking_time}`}
                >
                  <div className="text-sm font-medium text-white truncate">
                    {booking.customer_name}
                  </div>
                  <div className="text-xs text-white/80 truncate">
                    {booking.guests} guests
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};