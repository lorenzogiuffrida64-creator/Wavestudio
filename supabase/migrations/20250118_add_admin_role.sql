-- Migration: Add admin role to profiles table
-- Run this in your Supabase SQL Editor

-- Step 1: Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Step 2: Add admin_notes column if not exists (for admin internal notes about users)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Step 3: Create index for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = TRUE;

-- Step 4: Set your admin user(s)
-- IMPORTANT: Replace 'your-admin-email@example.com' with YOUR actual admin email
-- You can run this multiple times for multiple admins
-- UPDATE profiles SET is_admin = TRUE WHERE email = 'your-admin-email@example.com';

-- Step 5: Create RLS policy so only admins can see the is_admin field of other users
-- (Regular users can only see their own is_admin status)

-- First, drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- Users can update their own profile (but not is_admin)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND (
      -- Prevent non-admins from changing is_admin
      is_admin IS NOT DISTINCT FROM (SELECT is_admin FROM profiles WHERE id = auth.uid())
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    )
  );

-- Only admins can update other users or change is_admin
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- Verify the migration worked
-- SELECT id, email, is_admin FROM profiles LIMIT 10;
