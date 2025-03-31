/*
  # Add Special Requests to Bookings

  1. Changes
    - Add special_requests column to bookings table
    - Add notes column to bookings table
    
  2. Purpose
    - Store customer special requests (dietary requirements, seating preferences, etc.)
    - Store internal notes about the booking
*/

-- Add special_requests and notes columns to bookings table
ALTER TABLE bookings 
ADD COLUMN special_requests text,
ADD COLUMN notes text;