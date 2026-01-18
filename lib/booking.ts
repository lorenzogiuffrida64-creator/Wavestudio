import { supabase } from './supabase';
import type { DBInstructor, ScheduleSlot, Booking, UserStats, AdminStats, UserProfile } from '../types';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Re-export types for convenience
export type { DBInstructor, ScheduleSlot, Booking, UserStats, AdminStats };

// =============================================
// REALTIME SUBSCRIPTIONS
// =============================================

export function subscribeToBookingChanges(
  callback: (payload: { eventType: string; new?: any; old?: any }) => void
): RealtimeChannel {
  // Use unique channel name to avoid conflicts between components
  const channelName = `bookings-changes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  console.log('📡 Creating realtime channel:', channelName);

  return supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings'
      },
      (payload) => {
        console.log('📡 Realtime booking change received:', payload);
        callback({
          eventType: payload.eventType,
          new: payload.new,
          old: payload.old
        });
      }
    )
    .subscribe((status) => {
      console.log('📡 Realtime subscription status:', status);
    });
}

export function unsubscribeFromChannel(channel: RealtimeChannel): void {
  supabase.removeChannel(channel);
}

export interface AvailabilityResult {
  isAvailable: boolean;
  spotsLeft: number;
  currentBookings: number;
}

// Day names in Italian
export const DAY_NAMES = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

// =============================================
// DEBUG LOGGING
// =============================================
const DEBUG = true; // Set to false in production

function logQuery(name: string, data: any, error: any) {
  if (!DEBUG) return;
  console.group(`[Supabase] ${name}`);
  if (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Code:', error.code);
    console.error('Details:', error.details);
    console.error('Hint:', error.hint);
  } else {
    console.log('✅ Success');
    console.log('Data:', data);
    console.log('Count:', Array.isArray(data) ? data.length : (data ? 1 : 0));
  }
  console.groupEnd();
}

// =============================================
// INSTRUCTORS
// =============================================

export async function getInstructors(): Promise<DBInstructor[]> {
  console.log('📡 Supabase client check:', {
    hasClient: !!supabase,
    // @ts-ignore - accessing internal for debug
    url: supabase?.supabaseUrl || 'unknown'
  });

  console.log('📡 Making request to instructors table...');
  const { data, error } = await supabase
    .from('instructors')
    .select('*')
    .eq('is_active', true)
    .order('name');

  console.log('📡 Request completed!', { data, error });
  logQuery('getInstructors', data, error);
  if (error) throw error;
  return data || [];
}

export async function getInstructorById(instructorId: string): Promise<DBInstructor | null> {
  const { data, error } = await supabase
    .from('instructors')
    .select('*')
    .eq('id', instructorId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

// =============================================
// SCHEDULE SLOTS
// =============================================

export async function getScheduleSlots(dayOfWeek?: number): Promise<ScheduleSlot[]> {
  let query = supabase
    .from('schedule_slots')
    .select(`
      *,
      instructor:instructors (*)
    `)
    .eq('is_active', true)
    .order('day_of_week')
    .order('start_time');

  if (dayOfWeek !== undefined) {
    query = query.eq('day_of_week', dayOfWeek);
  }

  const { data, error } = await query;
  logQuery(`getScheduleSlots(dayOfWeek=${dayOfWeek})`, data, error);
  if (error) throw error;
  return data || [];
}

export async function getSlotsByInstructor(instructorId: string): Promise<ScheduleSlot[]> {
  const { data, error } = await supabase
    .from('schedule_slots')
    .select(`
      *,
      instructor:instructors (*)
    `)
    .eq('instructor_id', instructorId)
    .eq('is_active', true)
    .order('day_of_week')
    .order('start_time');

  if (error) throw error;
  return data || [];
}

export async function getSlotById(slotId: string): Promise<ScheduleSlot | null> {
  const { data, error } = await supabase
    .from('schedule_slots')
    .select(`
      *,
      instructor:instructors (*)
    `)
    .eq('id', slotId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

// Get available slots for a specific date with availability info
export async function getAvailableSlotsForDate(date: string): Promise<(ScheduleSlot & { availability: AvailabilityResult })[]> {
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay(); // 0=Sunday, 1=Monday, etc.

  console.log('🗓️ getAvailableSlotsForDate:', { date, dayOfWeek });

  // Get all slots for this day of week
  const slots = await getScheduleSlots(dayOfWeek);
  console.log('🗓️ Slots found for day', dayOfWeek, ':', slots.length);

  // Check availability for each slot
  const slotsWithAvailability = await Promise.all(
    slots.map(async (slot) => {
      const availability = await checkSlotAvailability(slot.id, date);
      return { ...slot, availability };
    })
  );

  return slotsWithAvailability;
}

// Get availability status for multiple dates (for calendar highlighting)
export async function getDatesAvailability(
  dates: string[],
  instructorId?: string | null
): Promise<Record<string, { hasSlots: boolean; availableCount: number }>> {
  const result: Record<string, { hasSlots: boolean; availableCount: number }> = {};

  // Get all schedule slots (optionally filtered by instructor)
  let query = supabase
    .from('schedule_slots')
    .select('id, day_of_week, max_capacity, instructor_id')
    .eq('is_active', true);

  if (instructorId) {
    query = query.eq('instructor_id', instructorId);
  }

  const { data: allSlots, error: slotsError } = await query;
  if (slotsError) throw slotsError;

  // Group slots by day of week
  const slotsByDay: Record<number, typeof allSlots> = {};
  for (const slot of allSlots || []) {
    if (!slotsByDay[slot.day_of_week]) {
      slotsByDay[slot.day_of_week] = [];
    }
    slotsByDay[slot.day_of_week].push(slot);
  }

  // Get all bookings for the date range
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('slot_id, booking_date')
    .in('booking_date', dates)
    .in('status', ['pending', 'confirmed']);

  if (bookingsError) throw bookingsError;

  // Count bookings per slot per date
  const bookingCounts: Record<string, number> = {};
  for (const booking of bookings || []) {
    const key = `${booking.slot_id}_${booking.booking_date}`;
    bookingCounts[key] = (bookingCounts[key] || 0) + 1;
  }

  // Check each date
  for (const date of dates) {
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    const daySlots = slotsByDay[dayOfWeek] || [];

    let availableCount = 0;
    for (const slot of daySlots) {
      const key = `${slot.id}_${date}`;
      const booked = bookingCounts[key] || 0;
      if (booked < slot.max_capacity) {
        availableCount++;
      }
    }

    result[date] = {
      hasSlots: daySlots.length > 0,
      availableCount
    };
  }

  return result;
}

// =============================================
// AVAILABILITY
// =============================================

export async function checkSlotAvailability(
  slotId: string,
  bookingDate: string
): Promise<AvailabilityResult> {
  // Get slot details
  const { data: slotData, error: slotError } = await supabase
    .from('schedule_slots')
    .select('max_capacity')
    .eq('id', slotId)
    .single();

  if (slotError) throw slotError;
  if (!slotData) throw new Error('Slot not found');

  // Count existing bookings for this slot on this date
  const { count, error: countError } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('slot_id', slotId)
    .eq('booking_date', bookingDate)
    .in('status', ['pending', 'confirmed']);

  if (countError) throw countError;

  const currentBookings = count || 0;
  const spotsLeft = slotData.max_capacity - currentBookings;

  return {
    isAvailable: spotsLeft > 0,
    spotsLeft: Math.max(0, spotsLeft),
    currentBookings
  };
}

export async function checkUserSlotBooking(
  userId: string,
  slotId: string,
  bookingDate: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('user_id', userId)
    .eq('slot_id', slotId)
    .eq('booking_date', bookingDate)
    .in('status', ['pending', 'confirmed'])
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

// =============================================
// BOOKINGS
// =============================================

export async function createSlotBooking(
  userId: string,
  slotId: string,
  bookingDate: string
): Promise<Booking> {
  // 1. Check availability
  const availability = await checkSlotAvailability(slotId, bookingDate);
  if (!availability.isAvailable) {
    throw new Error('Questo slot è pieno');
  }

  // 2. Check if user already booked
  const alreadyBooked = await checkUserSlotBooking(userId, slotId, bookingDate);
  if (alreadyBooked) {
    throw new Error('Hai già una prenotazione per questo orario');
  }

  // 3. Get slot details including price and instructor
  const { data: slotData, error: slotError } = await supabase
    .from('schedule_slots')
    .select(`
      price_cents,
      start_time,
      class_type,
      instructor:instructors (name)
    `)
    .eq('id', slotId)
    .single();

  if (slotError) throw slotError;
  if (!slotData) throw new Error('Slot non trovato');

  // 4. Get user profile for email
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('full_name, email, phone')
    .eq('id', userId)
    .single();

  // 5. Create booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id: userId,
      slot_id: slotId,
      booking_date: bookingDate,
      status: 'confirmed', // Auto-confirm for now (no payment)
      amount_paid_cents: slotData.price_cents
    })
    .select()
    .single();

  if (bookingError) throw bookingError;
  if (!booking) throw new Error('Errore nella creazione della prenotazione');

  // 6. Send confirmation emails (async - don't wait)
  if (userProfile) {
    import('./email').then(({ sendBookingConfirmationEmails }) => {
      sendBookingConfirmationEmails(
        booking.id,
        {
          name: userProfile.full_name || 'Cliente',
          email: userProfile.email,
          phone: userProfile.phone || undefined
        },
        {
          date: bookingDate,
          time: slotData.start_time?.substring(0, 5) || '',
          classType: slotData.class_type || 'Pilates',
          instructorName: (slotData.instructor as any)?.name || 'Istruttore'
        }
      ).catch(err => console.error('Error sending booking confirmation emails:', err));
    });
  }

  return booking;
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      schedule_slots (
        *,
        instructor:instructors (*)
      )
    `)
    .eq('user_id', userId)
    .order('booking_date', { ascending: false })
    .order('created_at', { ascending: false });

  logQuery(`getUserBookings(userId=${userId.slice(0,8)}...)`, data, error);
  if (error) throw error;
  return data || [];
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      schedule_slots (
        *,
        instructor:instructors (*)
      ),
      profiles (
        full_name,
        email,
        phone
      )
    `)
    .eq('id', bookingId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function cancelBooking(bookingId: string, userId: string): Promise<void> {
  // 1. Get booking details before cancelling (for email and notifications)
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select(`
      *,
      schedule_slots (
        id,
        start_time,
        class_type,
        max_capacity,
        instructor:instructors (name)
      ),
      profiles (
        full_name,
        email,
        phone
      )
    `)
    .eq('id', bookingId)
    .eq('user_id', userId)
    .single();

  if (fetchError) throw fetchError;
  if (!booking) throw new Error('Prenotazione non trovata');

  // 2. Cancel the booking
  const { error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', bookingId)
    .eq('user_id', userId);

  if (error) throw error;

  // 3. Send cancellation emails (async - don't wait)
  if (booking.profiles) {
    import('./email').then(({ sendCancellationEmails, sendSpotAvailableNotifications }) => {
      const profile = booking.profiles as any;
      const slot = booking.schedule_slots as any;

      // Send cancellation emails to client and owner
      sendCancellationEmails(
        bookingId,
        {
          name: profile.full_name || 'Cliente',
          email: profile.email,
          phone: profile.phone || undefined
        },
        {
          date: booking.booking_date,
          time: slot?.start_time?.substring(0, 5) || '',
          classType: slot?.class_type || 'Pilates',
          instructorName: slot?.instructor?.name || 'Istruttore'
        },
        'client'
      ).catch(err => console.error('Error sending cancellation emails:', err));

      // Send spot available notification to all users
      if (slot) {
        sendSpotAvailableNotifications(
          slot.id,
          booking.booking_date,
          {
            classType: slot.class_type || 'Pilates',
            time: slot.start_time?.substring(0, 5) || '',
            instructorName: slot.instructor?.name || 'Istruttore'
          },
          1 // At least one spot is now available
        ).catch(err => console.error('Error sending spot available notifications:', err));
      }
    });
  }

  // 4. Promote first person from waitlist (async)
  const slot = booking.schedule_slots as any;
  if (slot?.id) {
    promoteFromWaitlist(slot.id, booking.booking_date)
      .then(promoted => {
        if (promoted) {
          console.log('📋 Auto-promoted user from waitlist after cancellation');
        }
      })
      .catch(err => console.error('Error promoting from waitlist:', err));
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'cancelled'
): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Booking not found');
  return data;
}

// Admin function to cancel any booking (with email notifications to client)
export async function adminCancelBooking(bookingId: string): Promise<void> {
  // 1. Get booking details before cancelling (for email and notifications)
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select(`
      *,
      schedule_slots (
        id,
        start_time,
        class_type,
        max_capacity,
        instructor:instructors (name)
      ),
      profiles (
        full_name,
        email,
        phone
      )
    `)
    .eq('id', bookingId)
    .single();

  if (fetchError) throw fetchError;
  if (!booking) throw new Error('Prenotazione non trovata');

  // 2. Cancel the booking (admin can cancel any booking)
  const { error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', bookingId);

  if (error) throw error;

  // 3. Send cancellation emails (async - don't wait)
  if (booking.profiles) {
    import('./email').then(({ sendCancellationEmails, sendSpotAvailableNotifications }) => {
      const profile = booking.profiles as any;
      const slot = booking.schedule_slots as any;

      // Send cancellation emails - cancelled by owner
      sendCancellationEmails(
        bookingId,
        {
          name: profile.full_name || 'Cliente',
          email: profile.email,
          phone: profile.phone || undefined
        },
        {
          date: booking.booking_date,
          time: slot?.start_time?.substring(0, 5) || '',
          classType: slot?.class_type || 'Pilates',
          instructorName: slot?.instructor?.name || 'Istruttore'
        },
        'owner' // Cancelled by owner/admin
      ).catch(err => console.error('Error sending cancellation emails:', err));

      // Send spot available notification to all users
      if (slot) {
        sendSpotAvailableNotifications(
          slot.id,
          booking.booking_date,
          {
            classType: slot.class_type || 'Pilates',
            time: slot.start_time?.substring(0, 5) || '',
            instructorName: slot.instructor?.name || 'Istruttore'
          },
          1 // At least one spot is now available
        ).catch(err => console.error('Error sending spot available notifications:', err));
      }
    });
  }

  // 4. Promote first person from waitlist (async)
  const slot = booking.schedule_slots as any;
  if (slot?.id) {
    promoteFromWaitlist(slot.id, booking.booking_date)
      .then(promoted => {
        if (promoted) {
          console.log('📋 Auto-promoted user from waitlist after admin cancellation');
        }
      })
      .catch(err => console.error('Error promoting from waitlist:', err));
  }
}

// =============================================
// ADMIN DELETE BOOKING (PERMANENT)
// =============================================

export async function adminDeleteBooking(bookingId: string): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) throw error;
  console.log('🗑️ Booking permanently deleted:', bookingId);
}

// =============================================
// USER STATS
// =============================================

export async function getUserStats(userId: string): Promise<UserStats> {
  const bookings = await getUserBookings(userId);
  const today = new Date().toISOString().split('T')[0];

  const upcoming = bookings.filter(
    b => b.booking_date >= today && b.status !== 'cancelled'
  ).length;

  const completed = bookings.filter(
    b => b.booking_date < today && b.status === 'confirmed'
  ).length;

  const totalSpent = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.amount_paid_cents || 0), 0);

  const instructors = new Set(
    bookings
      .filter(b => b.schedule_slots?.instructor?.name)
      .map(b => b.schedule_slots!.instructor!.name)
  );

  return {
    upcoming,
    completed,
    totalSpent,
    instructorCount: instructors.size
  };
}

export async function getNextUserBooking(userId: string): Promise<Booking | null> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      schedule_slots (
        *,
        instructor:instructors (*)
      )
    `)
    .eq('user_id', userId)
    .gte('booking_date', today)
    .in('status', ['pending', 'confirmed'])
    .order('booking_date', { ascending: true })
    .limit(1)
    .maybeSingle();

  logQuery(`getNextUserBooking(userId=${userId.slice(0,8)}...)`, data, error);
  if (error) throw error;
  return data;
}

// =============================================
// ADMIN FUNCTIONS
// =============================================

export async function getAdminBookings(options?: {
  date?: string;
  status?: string;
  search?: string;
  limit?: number;
}): Promise<Booking[]> {
  let query = supabase
    .from('bookings')
    .select(`
      *,
      schedule_slots (
        *,
        instructor:instructors (*)
      ),
      profiles (
        full_name,
        email,
        phone
      )
    `)
    .order('booking_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (options?.date) {
    query = query.eq('booking_date', options.date);
  }

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Client-side search filter
  let results = data || [];
  if (options?.search) {
    const searchLower = options.search.toLowerCase();
    results = results.filter(b =>
      b.profiles?.full_name?.toLowerCase().includes(searchLower) ||
      b.profiles?.email?.toLowerCase().includes(searchLower)
    );
  }

  return results;
}

export async function getAdminStats(): Promise<AdminStats> {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Today's appointments
  const { count: todayCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('booking_date', today)
    .in('status', ['pending', 'confirmed']);

  // Today's revenue
  const { data: todayBookings } = await supabase
    .from('bookings')
    .select('amount_paid_cents')
    .eq('booking_date', today)
    .eq('status', 'confirmed');

  const todayRevenue = (todayBookings || []).reduce(
    (sum, b) => sum + (b.amount_paid_cents || 0), 0
  );

  // New clients this week
  const { count: newClients } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', weekAgo);

  // Show rate (confirmed vs total)
  const { count: totalBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .lte('booking_date', today);

  const { count: confirmedBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .lte('booking_date', today)
    .eq('status', 'confirmed');

  const showRate = totalBookings ? Math.round((confirmedBookings || 0) / totalBookings * 100) : 100;

  return {
    todayAppointments: todayCount || 0,
    todayRevenue,
    newClientsThisWeek: newClients || 0,
    showRate
  };
}

export async function getAllClients(): Promise<(UserProfile & { bookingCount: number; totalSpent: number; admin_notes?: string })[]> {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Get booking stats for each client
  const clientsWithStats = await Promise.all(
    (profiles || []).map(async (profile) => {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('amount_paid_cents, status')
        .eq('user_id', profile.id);

      const confirmedBookings = (bookings || []).filter(b => b.status === 'confirmed');

      return {
        ...profile,
        bookingCount: confirmedBookings.length,
        totalSpent: confirmedBookings.reduce((sum, b) => sum + (b.amount_paid_cents || 0), 0)
      };
    })
  );

  return clientsWithStats;
}

// =============================================
// CLIENT MANAGEMENT (ADMIN)
// =============================================

export async function updateClientNotes(clientId: string, notes: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ admin_notes: notes })
    .eq('id', clientId);

  if (error) throw error;
  console.log('📝 Client notes updated:', clientId);
}

export async function deleteClient(clientId: string): Promise<void> {
  // First delete all bookings for this client
  const { error: bookingsError } = await supabase
    .from('bookings')
    .delete()
    .eq('user_id', clientId);

  if (bookingsError) {
    console.error('Error deleting client bookings:', bookingsError);
  }

  // Then delete the profile
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', clientId);

  if (error) throw error;
  console.log('🗑️ Client deleted:', clientId);
}

export async function getPaymentStats(month?: number, year?: number): Promise<{
  total: number;
  paid: number;
  pending: number;
}> {
  const now = new Date();
  const targetMonth = month ?? now.getMonth();
  const targetYear = year ?? now.getFullYear();

  const startDate = new Date(targetYear, targetMonth, 1).toISOString().split('T')[0];
  const endDate = new Date(targetYear, targetMonth + 1, 0).toISOString().split('T')[0];

  const { data: bookings } = await supabase
    .from('bookings')
    .select('amount_paid_cents, status')
    .gte('booking_date', startDate)
    .lte('booking_date', endDate);

  const allBookings = bookings || [];

  const paid = allBookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.amount_paid_cents || 0), 0);

  const pending = allBookings
    .filter(b => b.status === 'pending')
    .reduce((sum, b) => sum + (b.amount_paid_cents || 0), 0);

  return {
    total: paid + pending,
    paid,
    pending
  };
}

export async function markBookingAsPaid(bookingId: string): Promise<Booking> {
  return updateBookingStatus(bookingId, 'confirmed');
}

// =============================================
// PROFILE FUNCTIONS
// =============================================

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  logQuery(`getUserProfile(userId=${userId.slice(0,8)}...)`, data, error);
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<UserProfile, 'full_name' | 'phone'>>
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Profile not found');
  return data;
}

// =============================================
// WAITLIST FEATURE
// =============================================

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

// Join the waitlist for a full class
export async function joinWaitlist(
  userId: string,
  slotId: string,
  bookingDate: string
): Promise<WaitlistEntry> {
  // Check if user is already on waitlist
  const { data: existing } = await supabase
    .from('waitlist')
    .select('id')
    .eq('user_id', userId)
    .eq('slot_id', slotId)
    .eq('booking_date', bookingDate)
    .in('status', ['waiting', 'notified'])
    .single();

  if (existing) {
    throw new Error('Sei già in lista d\'attesa per questa lezione');
  }

  // Check if user already has a booking
  const { data: existingBooking } = await supabase
    .from('bookings')
    .select('id')
    .eq('user_id', userId)
    .eq('slot_id', slotId)
    .eq('booking_date', bookingDate)
    .in('status', ['pending', 'confirmed'])
    .single();

  if (existingBooking) {
    throw new Error('Hai già una prenotazione per questa lezione');
  }

  // Get next position using the database function
  const { data: posData, error: posError } = await supabase
    .rpc('get_next_waitlist_position', {
      p_slot_id: slotId,
      p_booking_date: bookingDate
    });

  if (posError) throw posError;
  const position = posData || 1;

  // Insert waitlist entry
  const { data, error } = await supabase
    .from('waitlist')
    .insert({
      user_id: userId,
      slot_id: slotId,
      booking_date: bookingDate,
      position,
      status: 'waiting'
    })
    .select(`
      *,
      schedule_slots (
        *,
        instructor:instructors (*)
      )
    `)
    .single();

  if (error) throw error;
  console.log('📋 User joined waitlist at position:', position);
  return data;
}

// Leave the waitlist
export async function leaveWaitlist(waitlistId: string, userId?: string): Promise<void> {
  let query = supabase
    .from('waitlist')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', waitlistId);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { error } = await query;
  if (error) throw error;
  console.log('📋 User left waitlist');
}

// Get user's waitlist entries
export async function getUserWaitlist(userId: string): Promise<WaitlistEntry[]> {
  const { data, error } = await supabase
    .from('waitlist')
    .select(`
      *,
      schedule_slots (
        *,
        instructor:instructors (*)
      )
    `)
    .eq('user_id', userId)
    .in('status', ['waiting', 'notified'])
    .order('booking_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Get waitlist for a specific slot/date (admin)
export async function getWaitlistForSlot(
  slotId: string,
  bookingDate: string
): Promise<WaitlistEntry[]> {
  const { data, error } = await supabase
    .from('waitlist')
    .select(`
      *,
      profiles (
        full_name,
        email,
        phone
      )
    `)
    .eq('slot_id', slotId)
    .eq('booking_date', bookingDate)
    .in('status', ['waiting', 'notified'])
    .order('position', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Get waitlist count for a slot/date
export async function getWaitlistCount(
  slotId: string,
  bookingDate: string
): Promise<number> {
  const { count, error } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
    .eq('slot_id', slotId)
    .eq('booking_date', bookingDate)
    .in('status', ['waiting', 'notified']);

  if (error) throw error;
  return count || 0;
}

// Check if user is on waitlist for a slot
export async function checkUserWaitlist(
  userId: string,
  slotId: string,
  bookingDate: string
): Promise<WaitlistEntry | null> {
  const { data, error } = await supabase
    .from('waitlist')
    .select('*')
    .eq('user_id', userId)
    .eq('slot_id', slotId)
    .eq('booking_date', bookingDate)
    .in('status', ['waiting', 'notified'])
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

// Promote first person from waitlist when a spot opens
export async function promoteFromWaitlist(
  slotId: string,
  bookingDate: string
): Promise<WaitlistEntry | null> {
  // Get first person in waitlist
  const { data: entries, error: fetchError } = await supabase
    .from('waitlist')
    .select(`
      *,
      profiles (
        full_name,
        email,
        phone
      ),
      schedule_slots (
        *,
        instructor:instructors (*)
      )
    `)
    .eq('slot_id', slotId)
    .eq('booking_date', bookingDate)
    .eq('status', 'waiting')
    .order('position', { ascending: true })
    .limit(1);

  if (fetchError) throw fetchError;
  if (!entries || entries.length === 0) return null;

  const entry = entries[0];

  // Update their status to notified with 2 hour expiry
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 2);

  const { data, error } = await supabase
    .from('waitlist')
    .update({
      status: 'notified',
      notified_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', entry.id)
    .select()
    .single();

  if (error) throw error;

  console.log('📋 Promoted user from waitlist:', entry.profiles?.full_name);

  // Queue notification email
  if (entry.profiles?.email) {
    try {
      const slot = entry.schedule_slots;
      await supabase.from('email_notifications').insert({
        type: 'spot_available',
        recipient_email: entry.profiles.email,
        recipient_name: entry.profiles.full_name || 'Cliente',
        subject: '🎉 Posto disponibile! - Wave Studio Pilates',
        html_content: `
          <h2>Un posto si è liberato!</h2>
          <p>Ciao ${entry.profiles.full_name || ''},</p>
          <p>Un posto si è liberato per la lezione che stavi aspettando:</p>
          <ul>
            <li><strong>Data:</strong> ${new Date(bookingDate).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}</li>
            <li><strong>Ora:</strong> ${slot?.start_time?.substring(0, 5) || ''}</li>
            <li><strong>Tipo:</strong> ${slot?.class_type || 'Pilates'}</li>
            <li><strong>Istruttore:</strong> ${slot?.instructor?.name || ''}</li>
          </ul>
          <p><strong>Hai 2 ore per confermare il tuo posto!</strong></p>
          <p>Accedi al tuo account per confermare la prenotazione.</p>
        `,
        text_content: `Un posto si è liberato per la lezione del ${bookingDate}. Hai 2 ore per confermare!`,
        metadata: { waitlist_id: entry.id, slot_id: slotId, booking_date: bookingDate }
      });
    } catch (emailErr) {
      console.error('Error queueing waitlist notification:', emailErr);
    }
  }

  return data;
}

// Confirm waitlist spot (convert to booking)
export async function confirmWaitlistSpot(
  waitlistId: string,
  userId: string
): Promise<Booking> {
  // Get waitlist entry
  const { data: entry, error: fetchError } = await supabase
    .from('waitlist')
    .select('*')
    .eq('id', waitlistId)
    .eq('user_id', userId)
    .eq('status', 'notified')
    .single();

  if (fetchError) throw fetchError;
  if (!entry) throw new Error('Voce lista d\'attesa non trovata o già scaduta');

  // Check if expired
  if (entry.expires_at && new Date(entry.expires_at) < new Date()) {
    // Mark as expired and promote next person
    await supabase
      .from('waitlist')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('id', waitlistId);

    await promoteFromWaitlist(entry.slot_id, entry.booking_date);
    throw new Error('Il tempo per confermare è scaduto. Il posto è stato assegnato alla prossima persona in lista.');
  }

  // Check availability one more time
  const availability = await checkSlotAvailability(entry.slot_id, entry.booking_date);
  if (!availability.isAvailable) {
    throw new Error('Il posto non è più disponibile');
  }

  // Create the booking
  const booking = await createSlotBooking(userId, entry.slot_id, entry.booking_date);

  // Mark waitlist entry as confirmed
  await supabase
    .from('waitlist')
    .update({ status: 'confirmed', updated_at: new Date().toISOString() })
    .eq('id', waitlistId);

  console.log('📋 Waitlist spot confirmed, booking created');
  return booking;
}

// Admin: Get all waitlist entries for a date
export async function getAdminWaitlist(date?: string): Promise<WaitlistEntry[]> {
  let query = supabase
    .from('waitlist')
    .select(`
      *,
      profiles (
        full_name,
        email,
        phone
      ),
      schedule_slots (
        *,
        instructor:instructors (*)
      )
    `)
    .in('status', ['waiting', 'notified'])
    .order('booking_date', { ascending: true })
    .order('position', { ascending: true });

  if (date) {
    query = query.eq('booking_date', date);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}



