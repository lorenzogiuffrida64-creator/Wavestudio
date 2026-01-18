-- Add notes column to profiles table for admin notes
-- Run this in your Supabase SQL Editor

-- Add notes column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Update RLS policies to allow admin operations on profiles
DROP POLICY IF EXISTS "Everyone can view profiles" ON profiles;
CREATE POLICY "Everyone can view profiles" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Everyone can update profiles" ON profiles;
CREATE POLICY "Everyone can update profiles" ON profiles
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Everyone can delete profiles" ON profiles;
CREATE POLICY "Everyone can delete profiles" ON profiles
  FOR DELETE USING (true);
