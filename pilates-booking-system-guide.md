# Pilates Studio Booking System - Complete Build Guide

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites & Setup](#prerequisites--setup)
4. [Database Schema (Supabase)](#database-schema-supabase)
5. [Authentication System](#authentication-system)
6. [Booking System Logic](#booking-system-logic)
7. [Stripe Payment Integration](#stripe-payment-integration)
8. [Email Notification System](#email-notification-system)
9. [Frontend Structure](#frontend-structure)
10. [Deployment](#deployment)
11. [Testing Checklist](#testing-checklist)

---

## System Overview

### What We're Building
A custom booking platform for a Pilates studio where clients can:
- Create an account and log in
- View available class schedules
- Book classes
- Pay via Stripe
- Receive email confirmation when payment succeeds

### User Journey
```
1. User visits website
2. Creates account / Logs in (Supabase Auth)
3. Browses available Pilates classes
4. Selects a class and time slot
5. Clicks "Book & Pay"
6. Redirects to Stripe checkout
7. Completes payment
8. Receives confirmation email
9. Booking appears in their dashboard
```

---

## Tech Stack

| Component | Technology | Cost | Why |
|-----------|------------|------|-----|
| **Database** | Supabase | Free tier | PostgreSQL + Auth built-in |
| **Frontend** | React + Tailwind CSS | Free | Modern, responsive |
| **Payments** | Stripe | 2.9% + $0.30/transaction | Industry standard |
| **Email** | Resend or SendGrid | Free tier | Reliable delivery |
| **Hosting** | Vercel/Netlify | Free | Easy deployment |

---

## Prerequisites & Setup

### Accounts You Need to Create

#### 1. Supabase (Database + Auth)
- Go to: https://supabase.com
- Sign up with GitHub or email
- Create a new project
- Save these credentials (found in Project Settings → API):
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`

#### 2. Stripe (Payments)
- Go to: https://stripe.com
- Create business account
- Complete business verification
- Get API keys from Dashboard → Developers → API keys:
  - `STRIPE_PUBLISHABLE_KEY` (starts with pk_)
  - `STRIPE_SECRET_KEY` (starts with sk_)
- Set up webhook endpoint (we'll do this later)

#### 3. Resend (Emails)
- Go to: https://resend.com
- Sign up
- Verify your domain (or use their test domain initially)
- Get API key from API Keys section:
  - `RESEND_API_KEY`

#### 4. Vercel (Hosting)
- Go to: https://vercel.com
- Sign up with GitHub
- We'll deploy later

---

## Database Schema (Supabase)

### Table 1: `profiles`
Extends Supabase's built-in auth.users table

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);
```

### Table 2: `classes`
Stores the Pilates studio class schedule

```sql
CREATE TABLE classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_name TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  max_capacity INTEGER DEFAULT 15,
  price_cents INTEGER NOT NULL, -- Store in cents (e.g., $20 = 2000)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active classes
CREATE POLICY "Anyone can view active classes" 
ON classes FOR SELECT 
USING (is_active = true);
```

### Table 3: `bookings`
Stores user bookings

```sql
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL, -- The specific date they're booking for
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  amount_paid_cents INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent double booking same class on same day
  UNIQUE(user_id, class_id, booking_date)
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own bookings
CREATE POLICY "Users can view own bookings" 
ON bookings FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own bookings
CREATE POLICY "Users can create own bookings" 
ON bookings FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

### Create These Tables in Supabase
1. Go to your Supabase project
2. Click "SQL Editor" in the left sidebar
3. Create a "New Query"
4. Copy and paste each table creation script above
5. Run them one by one

---

## Authentication System

### How Supabase Auth Works
- Supabase handles password hashing, sessions, JWT tokens
- We just call their client library functions
- Built-in email verification (optional)

### Key Auth Functions

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Sign Up
async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  })
  
  if (error) throw error
  
  // Create profile entry
  await supabase.from('profiles').insert({
    id: data.user.id,
    email: email,
    full_name: fullName
  })
  
  return data
}

// Sign In
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

// Sign Out
async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get Current User
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Check if user is logged in
async function isAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}
```

---

## Booking System Logic

### Availability Check Function
Before allowing a booking, check:
1. Is the user already booked for this class on this date?
2. Is the class at max capacity?

```javascript
async function checkAvailability(classId, bookingDate) {
  // Get class details
  const { data: classData } = await supabase
    .from('classes')
    .select('max_capacity')
    .eq('id', classId)
    .single()
  
  // Count existing bookings for this class on this date
  const { count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('class_id', classId)
    .eq('booking_date', bookingDate)
    .eq('status', 'confirmed')
  
  return {
    isAvailable: count < classData.max_capacity,
    spotsLeft: classData.max_capacity - count
  }
}
```

### Create Booking Flow

```javascript
async function createBooking(userId, classId, bookingDate) {
  // 1. Check availability
  const availability = await checkAvailability(classId, bookingDate)
  if (!availability.isAvailable) {
    throw new Error('Class is full')
  }
  
  // 2. Get class price
  const { data: classData } = await supabase
    .from('classes')
    .select('price_cents, class_name')
    .eq('id', classId)
    .single()
  
  // 3. Create pending booking
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      user_id: userId,
      class_id: classId,
      booking_date: bookingDate,
      status: 'pending',
      amount_paid_cents: classData.price_cents
    })
    .select()
    .single()
  
  if (error) throw error
  
  return booking
}
```

---

## Stripe Payment Integration

### Overview
1. User clicks "Book & Pay"
2. Backend creates Stripe Checkout Session
3. User redirects to Stripe's hosted payment page
4. User pays
5. Stripe webhook notifies our backend
6. We confirm the booking and send email

### Setup Stripe Checkout

#### Frontend: Redirect to Stripe

```javascript
async function initiatePayment(bookingId) {
  // Call your backend API
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId })
  })
  
  const { url } = await response.json()
  
  // Redirect to Stripe
  window.location.href = url
}
```

#### Backend: Create Checkout Session (API Route)

```javascript
// api/create-checkout-session.js
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const { bookingId } = req.body
  
  // Get booking details from Supabase
  const { data: booking } = await supabase
    .from('bookings')
    .select(`
      *,
      classes (class_name, price_cents),
      profiles (email, full_name)
    `)
    .eq('id', bookingId)
    .single()
  
  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: booking.classes.class_name,
          description: `Class on ${booking.booking_date}`
        },
        unit_amount: booking.classes.price_cents
      },
      quantity: 1
    }],
    mode: 'payment',
    success_url: `${process.env.DOMAIN}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.DOMAIN}/booking-cancelled`,
    customer_email: booking.profiles.email,
    metadata: {
      bookingId: bookingId
    }
  })
  
  // Save session ID to booking
  await supabase
    .from('bookings')
    .update({ stripe_checkout_session_id: session.id })
    .eq('id', bookingId)
  
  res.json({ url: session.url })
}
```

### Stripe Webhook Handler

This confirms the booking when payment succeeds.

```javascript
// api/stripe-webhook.js
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature']
  
  let event
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  
  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const bookingId = session.metadata.bookingId
    
    // Update booking status
    await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        stripe_payment_intent_id: session.payment_intent,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
    
    // Send confirmation email (see next section)
    await sendBookingConfirmationEmail(bookingId)
  }
  
  res.json({ received: true })
}
```

### Set Up Webhook in Stripe Dashboard
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your URL: `https://yourdomain.com/api/stripe-webhook`
4. Select events: `checkout.session.completed`
5. Copy the webhook signing secret → save as `STRIPE_WEBHOOK_SECRET`

---

## Email Notification System

### Using Resend

```javascript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

async function sendBookingConfirmationEmail(bookingId) {
  // Get booking details
  const { data: booking } = await supabase
    .from('bookings')
    .select(`
      *,
      classes (class_name, instructor, start_time, duration_minutes),
      profiles (email, full_name)
    `)
    .eq('id', bookingId)
    .single()
  
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Booking Confirmed! 🎉</h1>
      
      <p>Hi ${booking.profiles.full_name},</p>
      
      <p>Your booking has been confirmed. We're excited to see you!</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0;">${booking.classes.class_name}</h2>
        <p><strong>Date:</strong> ${new Date(booking.booking_date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.classes.start_time}</p>
        <p><strong>Duration:</strong> ${booking.classes.duration_minutes} minutes</p>
        <p><strong>Instructor:</strong> ${booking.classes.instructor}</p>
      </div>
      
      <p><strong>Amount Paid:</strong> $${(booking.amount_paid_cents / 100).toFixed(2)}</p>
      
      <p>If you need to cancel, please contact us at least 24 hours in advance.</p>
      
      <p>See you soon!<br>The Pilates Studio Team</p>
    </div>
  `
  
  await resend.emails.send({
    from: 'Studio Name <bookings@yourdomain.com>',
    to: booking.profiles.email,
    subject: `Booking Confirmed: ${booking.classes.class_name}`,
    html: emailHtml
  })
}
```

---

## Frontend Structure

### Recommended File Structure

```
project/
├── pages/
│   ├── index.jsx              # Homepage
│   ├── signup.jsx             # Sign up page
│   ├── login.jsx              # Login page
│   ├── dashboard.jsx          # User dashboard (view bookings)
│   ├── classes.jsx            # Browse classes
│   ├── booking-success.jsx   # After payment success
│   └── api/
│       ├── create-checkout-session.js
│       └── stripe-webhook.js
├── components/
│   ├── ClassCard.jsx          # Display a class
│   ├── BookingButton.jsx      # Book & Pay button
│   ├── AuthForm.jsx           # Login/Signup form
│   └── BookingList.jsx        # User's bookings list
├── lib/
│   ├── supabase.js            # Supabase client
│   ├── stripe.js              # Stripe helpers
│   └── email.js               # Email functions
└── .env.local                 # Environment variables
```

### Environment Variables (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...

# App
DOMAIN=https://yourdomain.com
```

### Example: Classes Page

```jsx
// pages/classes.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function ClassesPage() {
  const [classes, setClasses] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  useEffect(() => {
    loadClasses()
  }, [])
  
  async function loadClasses() {
    const { data } = await supabase
      .from('classes')
      .select('*')
      .eq('is_active', true)
      .order('day_of_week', { ascending: true })
    
    setClasses(data)
  }
  
  async function handleBooking(classId) {
    const user = await supabase.auth.getUser()
    
    if (!user) {
      alert('Please log in to book a class')
      return
    }
    
    // Create booking
    const { data: booking } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        class_id: classId,
        booking_date: selectedDate.toISOString().split('T')[0],
        status: 'pending'
      })
      .select()
      .single()
    
    // Redirect to payment
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: booking.id })
    })
    
    const { url } = await response.json()
    window.location.href = url
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Available Classes</h1>
      
      <div className="mb-6">
        <label>Select Date:</label>
        <input 
          type="date" 
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="ml-2 px-4 py-2 border rounded"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(cls => (
          <div key={cls.id} className="border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">{cls.class_name}</h3>
            <p className="text-gray-600 mb-4">{cls.description}</p>
            <p className="mb-2"><strong>Instructor:</strong> {cls.instructor}</p>
            <p className="mb-2"><strong>Time:</strong> {cls.start_time}</p>
            <p className="mb-4"><strong>Duration:</strong> {cls.duration_minutes} min</p>
            <p className="text-2xl font-bold mb-4">${(cls.price_cents / 100).toFixed(2)}</p>
            
            <button
              onClick={() => handleBooking(cls.id)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Book & Pay
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Deployment

### Deploy to Vercel

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com
   - Click "New Project"
   - Import your GitHub repo
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Update Stripe webhook URL**
   - Once deployed, update your Stripe webhook endpoint to:
   - `https://your-vercel-domain.vercel.app/api/stripe-webhook`

4. **Update Supabase callback URLs**
   - In Supabase project settings → Authentication → URL Configuration
   - Add: `https://your-vercel-domain.vercel.app/auth/callback`

---

## Testing Checklist

### Before Launch

- [ ] Sign up creates user account
- [ ] Login works correctly
- [ ] Users can view available classes
- [ ] Booking creation works
- [ ] Cannot book same class twice on same day
- [ ] Classes show "FULL" when at capacity
- [ ] Stripe checkout redirects correctly
- [ ] Test payment with Stripe test card: `4242 4242 4242 4242`
- [ ] Booking status updates to "confirmed" after payment
- [ ] Email is sent after successful payment
- [ ] User can view their bookings in dashboard
- [ ] Logout works
- [ ] Mobile responsive design works

### Stripe Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`

---

## Next Steps & Enhancements

Once the basic system is working, you can add:

1. **Class cancellation** - Allow users to cancel bookings
2. **Admin dashboard** - Let studio owner manage classes and view all bookings
3. **Waitlist** - When class is full, add users to waitlist
4. **Class packages** - Sell 5-class or 10-class bundles
5. **Recurring bookings** - Book the same class every week
6. **Email reminders** - Send reminder 24 hours before class
7. **Instructor profiles** - Pages for each instructor
8. **Class reviews** - Let users leave reviews after attending

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Resend Docs**: https://resend.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## When You Need Help in Cursor

Copy this entire document into your Cursor chat and tell Claude:
- What you're trying to build
- What error you're getting
- Which section of this guide you're working on

Good luck! You've got this. 🚀
