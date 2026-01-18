import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import {
  getAvailableSlotsForDate,
  createSlotBooking,
  subscribeToBookingChanges,
  unsubscribeFromChannel,
  type ScheduleSlot,
  DAY_NAMES
} from '../lib/booking';
import { auth } from '../lib/supabase';

interface ClassBookingProps {
  onBookingSuccess?: () => void;
  onRequireLogin?: () => void;
}

export const ClassBooking: React.FC<ClassBookingProps> = ({
  onBookingSuccess,
  onRequireLogin
}) => {
  const [slots, setSlots] = useState<(ScheduleSlot & { availability: { isAvailable: boolean; spotsLeft: number } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);

  useEffect(() => {
    loadSlots();
  }, [selectedDate]);

  // Real-time subscription to booking changes - updates slot availability when any user books
  useEffect(() => {
    const channel = subscribeToBookingChanges((payload) => {
      // When any booking changes (INSERT, UPDATE, DELETE), refresh the slots
      console.log('🔄 ClassBooking: Refreshing slots due to booking change...');
      loadSlots();
    });

    return () => {
      unsubscribeFromChannel(channel);
    };
  }, [selectedDate]);

  const loadSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAvailableSlotsForDate(selectedDate);
      setSlots(data);
    } catch (err: any) {
      console.error('Error loading slots:', err);
      setError('Errore nel caricamento degli slot. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (slotId: string) => {
    try {
      // Check if user is logged in
      const session = await auth.getSession();
      if (!session?.user) {
        onRequireLogin?.();
        return;
      }

      setBookingSlotId(slotId);
      setError(null);

      // Create booking
      const booking = await createSlotBooking(session.user.id, slotId, selectedDate);

      // Refresh availability
      await loadSlots();

      // Show success message
      alert(`Prenotazione creata con successo! ID: ${booking.id}`);

      onBookingSuccess?.();
      setBookingSlotId(null);
    } catch (err: any) {
      console.error('Error booking slot:', err);
      setError(err.message || 'Errore durante la prenotazione. Riprova.');
      setBookingSlotId(null);
    }
  };

  const formatTime = (time: string): string => {
    return time.substring(0, 5); // HH:MM format
  };

  const formatPrice = (cents: number): string => {
    return `€${(cents / 100).toFixed(2)}`;
  };

  const getEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endDate = new Date(2000, 0, 1, hours, minutes + durationMinutes);
    return endDate.toTimeString().substring(0, 5);
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#4A90E2] mb-4">Prenota una Lezione</h2>
          <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
            Scegli la Tua <span className="text-[#4A90E2]">Classe</span>
          </h3>
        </div>

        {/* Date Selector */}
        <div className="mb-12 flex flex-col items-center gap-4">
          <label className="text-sm font-bold text-black/70 uppercase tracking-wider">
            Seleziona Data
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="px-6 py-3 border-2 border-[#4A90E2]/30 rounded-xl focus:border-[#4A90E2] focus:ring-4 focus:ring-[#4A90E2]/10 outline-none font-bold text-lg"
          />
          <p className="text-sm text-black/60">
            {DAY_NAMES[new Date(selectedDate).getDay()]} {new Date(selectedDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Slots Grid */}
        {slots.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-black/20 mb-4" />
            <p className="text-black/60 text-lg">Nessuno slot disponibile per questa data.</p>
            <p className="text-sm text-black/40 mt-2">Prova a selezionare un altro giorno.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot) => {
              const isAvailable = slot.availability.isAvailable;
              const spotsLeft = slot.availability.spotsLeft;
              const isBooking = bookingSlotId === slot.id;

              return (
                <div
                  key={slot.id}
                  className="bg-white border-2 border-black/5 rounded-2xl p-6 hover:border-[#4A90E2]/30 transition-all shadow-sm hover:shadow-lg"
                >
                  <div className="mb-4">
                    <h4 className="text-2xl font-black italic uppercase mb-2">{slot.class_type}</h4>
                    {slot.instructor && (
                      <p className="text-sm text-[#4A90E2] font-bold">con {slot.instructor.name}</p>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-black/70">
                      <Clock size={16} className="text-[#4A90E2]" />
                      <span>{formatTime(slot.start_time)} - {getEndTime(slot.start_time, slot.duration_minutes)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-black/70">
                      <Users size={16} className="text-[#4A90E2]" />
                      <span>
                        {isAvailable ? (
                          <span className="text-green-600">{spotsLeft}/{slot.max_capacity} posti disponibili</span>
                        ) : (
                          <span className="text-red-600">Completo (0/{slot.max_capacity})</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6 pt-4 border-t border-black/5">
                    <span className="text-3xl font-black italic">{formatPrice(slot.price_cents)}</span>
                    <span className="text-xs font-bold text-black/40 uppercase">per lezione</span>
                  </div>

                  <button
                    onClick={() => handleBookSlot(slot.id)}
                    disabled={!isAvailable || isBooking}
                    className={`w-full h-12 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                      isAvailable
                        ? 'bg-black text-white hover:bg-[#4A90E2] hover:scale-105 active:scale-95'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    } ${isBooking ? 'opacity-50' : ''}`}
                  >
                    {isBooking ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Prenotazione...
                      </span>
                    ) : isAvailable ? (
                      'Prenota Ora'
                    ) : (
                      'Completo'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};







