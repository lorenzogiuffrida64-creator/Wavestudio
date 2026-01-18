-- Waitlist Feature for Wave Studio Pilates
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. CREATE WAITLIST TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slot_id UUID NOT NULL REFERENCES schedule_slots(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  position INTEGER NOT NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'confirmed', 'expired', 'cancelled')),
  notified_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure unique position per slot/date
  UNIQUE(slot_id, booking_date, position),
  -- Ensure user can only be on waitlist once per slot/date
  UNIQUE(user_id, slot_id, booking_date)
);

-- =============================================
-- 2. INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_waitlist_user ON waitlist(user_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_slot_date ON waitlist(slot_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);

-- =============================================
-- 3. RLS POLICIES
-- =============================================
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Everyone can view waitlist (needed for admin and checking position)
DROP POLICY IF EXISTS "Waitlist viewable by everyone" ON waitlist;
CREATE POLICY "Waitlist viewable by everyone" ON waitlist
  FOR SELECT USING (true);

-- Authenticated users can insert their own waitlist entries
DROP POLICY IF EXISTS "Users can join waitlist" ON waitlist;
CREATE POLICY "Users can join waitlist" ON waitlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Everyone can update waitlist (for admin and status changes)
DROP POLICY IF EXISTS "Everyone can update waitlist" ON waitlist;
CREATE POLICY "Everyone can update waitlist" ON waitlist
  FOR UPDATE USING (true);

-- Everyone can delete from waitlist
DROP POLICY IF EXISTS "Everyone can delete from waitlist" ON waitlist;
CREATE POLICY "Everyone can delete from waitlist" ON waitlist
  FOR DELETE USING (true);

-- =============================================
-- 4. ENABLE REALTIME FOR WAITLIST
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE waitlist;

-- =============================================
-- 5. FUNCTION TO GET NEXT POSITION IN WAITLIST
-- =============================================
CREATE OR REPLACE FUNCTION get_next_waitlist_position(p_slot_id UUID, p_booking_date DATE)
RETURNS INTEGER AS $$
DECLARE
  next_pos INTEGER;
BEGIN
  SELECT COALESCE(MAX(position), 0) + 1 INTO next_pos
  FROM waitlist
  WHERE slot_id = p_slot_id
    AND booking_date = p_booking_date
    AND status IN ('waiting', 'notified');
  RETURN next_pos;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- DONE! Verify with:
-- =============================================
-- SELECT * FROM waitlist;
