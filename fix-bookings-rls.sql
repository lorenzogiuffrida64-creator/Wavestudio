-- Fix RLS policies for bookings table
-- Run this in your Supabase SQL Editor

-- First, let's check if RLS is enabled and add proper policies

-- Enable RLS on bookings (if not already)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can insert own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Everyone can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Bookings viewable by everyone" ON bookings;
DROP POLICY IF EXISTS "Everyone can update bookings" ON bookings;
DROP POLICY IF EXISTS "Everyone can delete bookings" ON bookings;

-- IMPORTANT: Allow EVERYONE to view all bookings (needed for admin panel)
CREATE POLICY "Bookings viewable by everyone" ON bookings
  FOR SELECT USING (true);

-- Allow authenticated users to insert their own bookings
CREATE POLICY "Users can insert own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow everyone to update bookings (needed for admin panel to cancel)
CREATE POLICY "Everyone can update bookings" ON bookings
  FOR UPDATE USING (true);

-- Allow everyone to delete bookings (needed for admin panel)
CREATE POLICY "Everyone can delete bookings" ON bookings
  FOR DELETE USING (true);

-- Verify the policies were created:
-- SELECT * FROM pg_policies WHERE tablename = 'bookings';
