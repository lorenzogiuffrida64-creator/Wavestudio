
export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
}

export interface Testimonial {
  id: string;
  company: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
}

export interface Instructor {
  id: string;
  name: string;
  role: string;
  image: string;
  featured?: boolean;
}

// Database types for Supabase
export interface DBInstructor {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ScheduleSlot {
  id: string;
  instructor_id: string;
  day_of_week: number; // 0=Sunday, 1=Monday...6=Saturday
  start_time: string; // "HH:MM:SS"
  duration_minutes: number;
  class_type: string;
  max_capacity: number;
  price_cents: number;
  is_active: boolean;
  created_at: string;
  // Joined data
  instructor?: DBInstructor;
}

export interface Booking {
  id: string;
  user_id: string;
  class_id: string | null;
  slot_id: string | null;
  booking_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  amount_paid_cents: number | null;
  created_at: string;
  updated_at: string;
  // Joined data
  schedule_slots?: ScheduleSlot & { instructor?: DBInstructor };
  profiles?: { full_name: string; email: string; phone: string | null };
}

export interface WaitlistEntry {
  id: string;
  user_id: string;
  slot_id: string;
  booking_date: string;
  position: number;
  status: 'waiting' | 'notified' | 'confirmed' | 'expired' | 'cancelled';
  notified_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  schedule_slots?: ScheduleSlot & { instructor?: DBInstructor };
  profiles?: { full_name: string; email: string; phone: string | null };
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  is_admin?: boolean;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  upcoming: number;
  completed: number;
  totalSpent: number;
  instructorCount: number;
}

export interface AdminStats {
  todayAppointments: number;
  todayRevenue: number;
  newClientsThisWeek: number;
  showRate: number;
}
