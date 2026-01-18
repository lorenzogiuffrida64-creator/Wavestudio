-- Wave Studio Pilates - ADD NEW TABLES ONLY
-- Run this SQL in your Supabase SQL Editor
-- This only adds the NEW tables, doesn't touch existing ones

-- =============================================
-- 1. CREATE INSTRUCTORS TABLE (NEW)
-- =============================================
CREATE TABLE IF NOT EXISTS instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  bio TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert instructors
INSERT INTO instructors (name) VALUES
  ('Fernanda'),
  ('Simone'),
  ('Annamaria'),
  ('Ylenia')
ON CONFLICT DO NOTHING;

-- =============================================
-- 2. CREATE SCHEDULE_SLOTS TABLE (NEW)
-- =============================================
CREATE TABLE IF NOT EXISTS schedule_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES instructors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 50,
  class_type TEXT DEFAULT 'Pilates',
  max_capacity INTEGER DEFAULT 8,
  price_cents INTEGER DEFAULT 2500,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. ADD slot_id TO BOOKINGS (if not exists)
-- =============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'slot_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN slot_id UUID REFERENCES schedule_slots(id);
  END IF;
END $$;

-- =============================================
-- 4. SEED SCHEDULE DATA (from schedule.md)
-- =============================================

-- Clear existing slots first (in case you run this multiple times)
DELETE FROM schedule_slots;

-- MONDAY (day_of_week = 1)
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 1, '06:30', 'Pilates' FROM instructors WHERE name = 'Fernanda';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 1, '08:00', 'Pilates' FROM instructors WHERE name = 'Simone';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 1, '16:30', 'Pilates' FROM instructors WHERE name = 'Fernanda';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 1, '18:00', 'Pilates' FROM instructors WHERE name = 'Annamaria';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 1, '19:00', 'Pilates' FROM instructors WHERE name = 'Annamaria';

-- TUESDAY (day_of_week = 2)
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 2, '09:00', 'Pilates' FROM instructors WHERE name = 'Simone';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 2, '13:30', 'Pilates' FROM instructors WHERE name = 'Ylenia';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 2, '15:00', 'PT' FROM instructors WHERE name = 'Fernanda';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 2, '16:00', 'Pilates' FROM instructors WHERE name = 'Fernanda';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 2, '17:00', 'Pilates' FROM instructors WHERE name = 'Annamaria';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 2, '18:00', 'Pilates' FROM instructors WHERE name = 'Annamaria';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 2, '19:00', 'Pilates' FROM instructors WHERE name = 'Ylenia';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 2, '20:00', 'Pilates' FROM instructors WHERE name = 'Ylenia';

-- WEDNESDAY (day_of_week = 3)
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 3, '09:00', 'Pilates' FROM instructors WHERE name = 'Annamaria';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 3, '10:00', 'Pilates' FROM instructors WHERE name = 'Annamaria';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 3, '13:30', 'Pilates' FROM instructors WHERE name = 'Ylenia';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 3, '14:30', 'PT' FROM instructors WHERE name = 'Fernanda';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 3, '15:30', 'Pilates' FROM instructors WHERE name = 'Fernanda';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 3, '16:30', 'Pilates' FROM instructors WHERE name = 'Fernanda';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 3, '18:00', 'Pilates' FROM instructors WHERE name = 'Annamaria';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 3, '19:00', 'Pilates' FROM instructors WHERE name = 'Annamaria';

-- THURSDAY (day_of_week = 4)
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 4, '09:00', 'Pilates' FROM instructors WHERE name = 'Simone';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 4, '16:00', 'Pilates' FROM instructors WHERE name = 'Fernanda';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 4, '17:00', 'Pilates' FROM instructors WHERE name = 'Annamaria';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 4, '18:00', 'Pilates' FROM instructors WHERE name = 'Annamaria';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 4, '19:00', 'Pilates' FROM instructors WHERE name = 'Ylenia';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 4, '20:00', 'Pilates' FROM instructors WHERE name = 'Ylenia';

-- FRIDAY (day_of_week = 5)
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 5, '06:30', 'Pilates' FROM instructors WHERE name = 'Fernanda';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 5, '08:00', 'Pilates' FROM instructors WHERE name = 'Simone';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 5, '09:00', 'Pilates' FROM instructors WHERE name = 'Annamaria';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 5, '10:00', 'Pilates' FROM instructors WHERE name = 'Annamaria';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 5, '13:30', 'Pilates' FROM instructors WHERE name = 'Ylenia';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 5, '16:00', 'Pilates' FROM instructors WHERE name = 'Fernanda';

-- SATURDAY (day_of_week = 6)
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 6, '08:00', 'Pilates' FROM instructors WHERE name = 'Simone';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 6, '10:00', 'Pilates' FROM instructors WHERE name = 'Ylenia';
INSERT INTO schedule_slots (instructor_id, day_of_week, start_time, class_type)
SELECT id, 6, '11:00', 'Pilates' FROM instructors WHERE name = 'Ylenia';

-- =============================================
-- 5. RLS FOR NEW TABLES ONLY
-- =============================================

-- Enable RLS on instructors
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;

-- Everyone can view instructors
DROP POLICY IF EXISTS "Instructors viewable by everyone" ON instructors;
CREATE POLICY "Instructors viewable by everyone" ON instructors
  FOR SELECT USING (true);

-- Enable RLS on schedule_slots
ALTER TABLE schedule_slots ENABLE ROW LEVEL SECURITY;

-- Everyone can view schedule slots
DROP POLICY IF EXISTS "Schedule slots viewable by everyone" ON schedule_slots;
CREATE POLICY "Schedule slots viewable by everyone" ON schedule_slots
  FOR SELECT USING (true);

-- =============================================
-- 6. INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_schedule_slots_day ON schedule_slots(day_of_week);
CREATE INDEX IF NOT EXISTS idx_schedule_slots_instructor ON schedule_slots(instructor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_slot ON bookings(slot_id);

-- =============================================
-- 7. EMAIL NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('booking_confirmation', 'booking_cancellation', 'spot_available')),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  metadata JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on email_notifications
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

-- Only service role can access email notifications (for security)
DROP POLICY IF EXISTS "Service role can manage email notifications" ON email_notifications;
CREATE POLICY "Service role can manage email notifications" ON email_notifications
  FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to insert email notifications
DROP POLICY IF EXISTS "Users can insert email notifications" ON email_notifications;
CREATE POLICY "Users can insert email notifications" ON email_notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Index for processing pending emails
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON email_notifications(status);
CREATE INDEX IF NOT EXISTS idx_email_notifications_created ON email_notifications(created_at);

-- =============================================
-- 8. ENABLE REALTIME FOR BOOKINGS
-- =============================================
-- This enables real-time updates so users see slot availability changes immediately
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- =============================================
-- 9. PG_NET EXTENSION FOR HTTP REQUESTS (Edge Functions)
-- =============================================
-- Enable pg_net extension for calling Edge Functions from database triggers
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to call the send-emails Edge Function
CREATE OR REPLACE FUNCTION trigger_send_emails()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url TEXT;
  service_role_key TEXT;
BEGIN
  -- Get the Edge Function URL from your Supabase project
  -- Replace YOUR_PROJECT_REF with your actual Supabase project reference
  edge_function_url := 'https://qvyzsoztfosngszufght.supabase.co/functions/v1/send-emails';

  -- Get service role key from vault or use environment variable
  -- Note: In production, store this securely in Supabase Vault
  service_role_key := current_setting('app.settings.service_role_key', true);

  -- Only trigger if service role key is available
  IF service_role_key IS NOT NULL AND service_role_key != '' THEN
    PERFORM net.http_post(
      url := edge_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := '{}'::jsonb
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call send-emails when new notification is inserted
DROP TRIGGER IF EXISTS on_email_notification_insert ON email_notifications;
CREATE TRIGGER on_email_notification_insert
  AFTER INSERT ON email_notifications
  FOR EACH ROW
  EXECUTE FUNCTION trigger_send_emails();

-- =============================================
-- DONE! Verify with:
-- =============================================
-- SELECT i.name, s.day_of_week, s.start_time, s.class_type
-- FROM schedule_slots s
-- JOIN instructors i ON s.instructor_id = i.id
-- ORDER BY s.day_of_week, s.start_time;

-- =============================================
-- SETUP INSTRUCTIONS FOR EMAIL NOTIFICATIONS:
-- =============================================
-- 1. Sign up for Resend at https://resend.com
-- 2. Create an API key in Resend dashboard
-- 3. Add secrets to your Supabase project:
--    - Go to Project Settings > Edge Functions > Secrets
--    - Add: RESEND_API_KEY = your_resend_api_key
-- 4. Deploy the Edge Function:
--    npx supabase functions deploy send-emails
-- 5. Configure the service role key in app settings:
--    ALTER DATABASE postgres SET app.settings.service_role_key = 'your_service_role_key';
--    (Or use Supabase Vault for production)
