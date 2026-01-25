# Booking System Setup Guide

## ✅ What's Already Done

You've already created the Supabase tables! Great work. Now let's connect everything.

## 🔧 Setup Steps

### 1. Install Dependencies

The Supabase client has already been installed. If you need to reinstall:

```bash
npm install
```

### 2. Create Environment Variables

Create a `.env` file in the root of your project with your Supabase credentials:

```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these:**
1. Go to your Supabase project: https://app.supabase.com
2. Click on your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 3. Verify Your Supabase Tables

Make sure you have these tables created in Supabase:

#### `profiles` table
- `id` (UUID, references auth.users)
- `email` (TEXT)
- `full_name` (TEXT)
- `phone` (TEXT, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `classes` table
- `id` (UUID)
- `class_name` (TEXT)
- `description` (TEXT, nullable)
- `instructor` (TEXT, nullable)
- `day_of_week` (INTEGER, 0-6)
- `start_time` (TIME)
- `duration_minutes` (INTEGER)
- `max_capacity` (INTEGER)
- `price_cents` (INTEGER)
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMP)

#### `bookings` table
- `id` (UUID)
- `user_id` (UUID, references profiles)
- `class_id` (UUID, references classes)
- `booking_date` (DATE)
- `status` (TEXT: 'pending', 'confirmed', 'cancelled')
- `stripe_payment_intent_id` (TEXT, nullable)
- `stripe_checkout_session_id` (TEXT, nullable)
- `amount_paid_cents` (INTEGER, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 4. Set Up Row Level Security (RLS)

Make sure RLS is enabled and policies are set up:

**For `profiles`:**
- Users can view/update their own profile

**For `classes`:**
- Anyone can view active classes

**For `bookings`:**
- Users can view/create their own bookings

### 5. Add Some Test Classes

Insert some test classes into your `classes` table:

```sql
INSERT INTO classes (class_name, description, instructor, day_of_week, start_time, duration_minutes, max_capacity, price_cents, is_active)
VALUES 
  ('Pilates Matwork', 'Il corso base perfetto per chi inizia', 'Giulia Patti', 1, '10:00:00', 50, 15, 4500, true),
  ('Pilates Reformer', 'Allenamento completo con Reformer', 'Laura Rossi', 3, '18:00:00', 55, 12, 5000, true),
  ('Pilates Advanced', 'Per chi ha già una solida base', 'Giulia Patti', 5, '19:00:00', 60, 10, 5500, true);
```

### 6. Run the Application

```bash
npm run dev
```

## 🎯 What's Working Now

✅ **Authentication**
- Sign up with email/password
- Login/Logout
- Session management

✅ **Booking System**
- View available classes from Supabase
- Check availability for specific dates
- Create bookings
- View user bookings in dashboard
- Cancel bookings

✅ **User Dashboard**
- Real-time booking list
- Filter by status (Tutti, Prossimi, Passati)
- Booking management

## 🚀 Next Steps (Optional)

1. **Add Stripe Integration** - For payment processing
2. **Add Email Notifications** - Using Resend or SendGrid
3. **Add Admin Features** - Manage classes and bookings
4. **Add Calendar View** - Visual calendar for bookings

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Make sure your `.env` file exists in the root directory
- Check that variable names start with `VITE_`
- Restart your dev server after adding `.env` file

### "Error loading classes"
- Verify your Supabase tables are created
- Check RLS policies allow reading from `classes` table
- Make sure `is_active = true` for classes you want to show

### "Authentication not working"
- Check Supabase Auth is enabled in your project
- Verify email confirmation settings (if enabled)
- Check browser console for detailed error messages

## 📝 Notes

- The booking system creates bookings with `status = 'pending'` by default
- To confirm bookings after payment, you'll need to integrate Stripe webhooks
- All prices are stored in cents (e.g., €45.00 = 4500 cents)









