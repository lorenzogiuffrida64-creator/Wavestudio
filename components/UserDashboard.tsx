
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Users,
  Bell,
  Settings,
  LogOut,
  Search,
  ChevronRight,
  ChevronLeft,
  Plus,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Menu,
  X,
  Shield,
  ArrowRight,
  ArrowLeft,
  Navigation,
  FileText,
  Star,
  Loader2,
  ListOrdered,
  AlertCircle,
  Trash2
} from 'lucide-react';
import {
  getUserBookings,
  cancelBooking,
  getUserStats,
  getNextUserBooking,
  getInstructors,
  getAvailableSlotsForDate,
  getDatesAvailability,
  createSlotBooking,
  getUserProfile,
  updateUserProfile,
  subscribeToBookingChanges,
  unsubscribeFromChannel,
  DAY_NAMES,
  joinWaitlist,
  leaveWaitlist,
  getUserWaitlist,
  checkUserWaitlist,
  confirmWaitlistSpot,
  getWaitlistCount,
  type Booking,
  type DBInstructor,
  type ScheduleSlot,
  type UserStats,
  type WaitlistEntry
} from '../lib/booking';

// Mini Calendar Component for Dashboard
const MiniCalendar: React.FC<{ bookedDates: string[]; onBook: () => void }> = ({ bookedDates, onBook }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month (0 = Sunday, adjust for Monday start)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Convert to Monday = 0

  // Get number of days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Get month name
  const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const isToday = (day: number): boolean => {
    return day === today.getDate() &&
           currentMonth === today.getMonth() &&
           currentYear === today.getFullYear();
  };

  const isPast = (day: number): boolean => {
    const checkDate = new Date(currentYear, currentMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return checkDate < todayStart;
  };

  const hasBooking = (day: number): boolean => {
    // Format the date to match booking_date format (YYYY-MM-DD)
    const month = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${month}-${dayStr}`;
    return bookedDates.includes(dateStr);
  };

  // Create calendar grid
  const calendarDays: (number | null)[] = [];
  // Add empty cells for days before first of month
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-lg flex items-center gap-2">
          CALENDARIO
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={18} className="text-slate-400" />
          </button>
          <span className="text-sm font-bold text-slate-600 min-w-[120px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-4">
        {['L','M','M','G','V','S','D'].map((d, i) => (
          <span key={i} className="text-[10px] font-black text-[#9CA3AF] py-2">{d}</span>
        ))}
        {calendarDays.map((day, i) => (
          <div key={i} className="flex flex-col items-center p-1">
            {day !== null ? (
              <>
                <span className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer
                  ${isToday(day)
                    ? 'bg-[#4A90E2] text-white shadow-lg ring-2 ring-[#4A90E2]/30'
                    : isPast(day)
                      ? 'text-slate-300'
                      : 'text-[#4B5563] hover:bg-slate-100'
                  }`}
                >
                  {day}
                </span>
                {hasBooking(day) && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isToday(day) ? 'bg-white' : 'bg-[#4A90E2]'}`} />
                )}
              </>
            ) : (
              <span className="w-9 h-9" />
            )}
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={onBook}
          className="w-full h-12 bg-[#4A90E2] hover:bg-[#3A7BC8] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#4A90E2]/20"
        >
          <Plus size={18} /> Prenota Lezione
        </button>
      </div>
    </div>
  );
};

interface UserDashboardProps {
  user: { name: string; email: string; id: string };
  onLogout: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout }) => {
  console.log('🏠 UserDashboard MOUNTED - user:', user);
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [preSelectedInstructor, setPreSelectedInstructor] = useState<DBInstructor | null>(null);

  console.log('🏠 UserDashboard - activeTab:', activeTab);

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'booking', label: 'Prenota', icon: Calendar },
    { id: 'appointments', label: 'I Miei Appuntamenti', icon: Clock },
    { id: 'waitlist', label: 'Lista d\'Attesa', icon: ListOrdered },
    { id: 'instructors', label: 'Istruttori', icon: Users },
    { id: 'notifications', label: 'Notifiche', icon: Bell },
    { id: 'settings', label: 'Impostazioni', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-sans overflow-hidden relative">
      {/* DESKTOP/TABLET SIDEBAR (Hidden on mobile) */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-[#E5E5E5] w-64 xl:w-72 transition-all duration-300`}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4A90E2] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#4A90E2]/20">
            <Shield size={24} />
          </div>
          <span className="font-black uppercase tracking-tighter text-black text-xl">Wave Studio</span>
        </div>

        <nav className="flex-1 mt-4 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-[#E8F4FF] text-[#4A90E2] border-l-4 border-[#4A90E2]' 
                    : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#4A90E2]'
                }`}
              >
                <Icon size={22} className={`${isActive ? 'text-[#4A90E2]' : 'group-hover:text-[#4A90E2] transition-colors'}`} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-[#E5E5E5]">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[#DC2626] hover:bg-red-50 transition-all font-bold text-sm"
          >
            <LogOut size={22} />
            <span>Esci</span>
          </button>
        </div>
      </aside>

      {/* MOBILE MENU OVERLAY (Refined "Beautiful Panel") */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-[360px] bg-white shadow-2xl animate-in slide-in-from-left duration-500 flex flex-col">
            {/* Mobile Sidebar Header */}
            <div className="p-6 pt-10 flex flex-col items-center border-b border-[#F5F5F5] bg-gradient-to-b from-[#E8F4FF] to-white">
              <div className="w-16 h-16 bg-[#4A90E2] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#4A90E2]/20 mb-4 animate-bounce-slow">
                <Shield size={32} />
              </div>
              <h2 className="font-black uppercase tracking-tighter text-black text-xl italic leading-none">Wave Studio</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4A90E2] mt-2">Pannello Socio</p>
            </div>

            {/* Mobile Sidebar Nav */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-5 px-5 py-4 rounded-2xl text-left transition-all ${
                      isActive 
                        ? 'bg-[#4A90E2] text-white shadow-lg shadow-[#4A90E2]/20 scale-[1.02]' 
                        : 'text-[#4B5563] active:bg-[#F5F5F5]'
                    }`}
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    <Icon size={24} className={isActive ? 'text-white' : 'text-[#9CA3AF]'} />
                    <span className="font-black text-sm uppercase tracking-widest">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Sidebar Footer */}
            <div className="p-6 border-t border-[#F5F5F5]">
              <div className="flex items-center gap-4 mb-6 p-4 bg-[#F9FAFB] rounded-2xl">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#4A90E2] font-black shadow-sm">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-black text-sm text-black truncate max-w-[150px]">{user.name}</p>
                  <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest truncate">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={onLogout} 
                className="w-full h-14 flex items-center justify-center gap-3 text-white font-black text-xs uppercase tracking-widest bg-[#DC2626] rounded-2xl shadow-xl active:scale-95 transition-all"
              >
                <LogOut size={20} /> Disconnetti
              </button>
            </div>
          </div>
          
          {/* Close button for mobile menu */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20 active:scale-90 transition-all"
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-14 lg:h-20 bg-white/90 backdrop-blur-xl lg:bg-white lg:backdrop-blur-none border-b border-black/10 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-black active:bg-black/5 rounded-full transition-transform active:scale-90"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-sm md:text-lg font-semibold text-black tracking-tight truncate max-w-[180px] md:max-w-none">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <button className="relative p-2 text-black/60 hover:text-[#4A90E2] transition-colors active:scale-90">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#DC2626] border-2 border-white rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-black/10">
              <div className="text-right hidden sm:flex sm:items-center sm:gap-2">
                <p className="text-sm font-medium text-black leading-none">{user.name}</p>
                <span className="text-black/30">·</span>
                <p className="text-xs text-black/50 font-medium">Premium</p>
              </div>
              <div className="w-9 h-9 bg-black/10 rounded-full flex items-center justify-center text-black font-semibold text-xs cursor-pointer active:scale-95 transition-transform">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'home' && <DashboardHome user={user} onBook={() => setActiveTab('booking')} />}
            {activeTab === 'booking' && <BookingFlow userId={user.id} preSelectedInstructor={preSelectedInstructor} onClearPreselection={() => setPreSelectedInstructor(null)} />}
            {activeTab === 'appointments' && <MyAppointments userId={user.id} />}
            {activeTab === 'waitlist' && <WaitlistView userId={user.id} />}
            {activeTab === 'instructors' && <InstructorsView onBookInstructor={(inst) => { setPreSelectedInstructor(inst); setActiveTab('booking'); }} />}
            {activeTab === 'notifications' && <NotificationsView userId={user.id} />}
            {activeTab === 'settings' && <SettingsView user={{ name: user.name, email: user.email, id: user.id }} />}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const DashboardHome: React.FC<{ user: { name: string; id: string }; onBook: () => void }> = ({ user, onBook }) => {
  console.log('🏠 DashboardHome MOUNTED - userId:', user.id);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [nextBooking, setNextBooking] = useState<Booking | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  useEffect(() => {
    console.log('🏠 DashboardHome: useEffect triggered, loading data...');
    loadDashboardData();
  }, [user.id]);

  const loadDashboardData = async () => {
    console.log('🏠 DashboardHome: loadDashboardData starting...');
    try {
      setLoading(true);
      const [statsData, nextData, bookingsData] = await Promise.all([
        getUserStats(user.id),
        getNextUserBooking(user.id),
        getUserBookings(user.id)
      ]);
      console.log('🏠 DashboardHome: Data loaded:', { statsData, nextData, bookingsCount: bookingsData.length });
      setStats(statsData);
      setNextBooking(nextData);
      setRecentBookings(bookingsData.slice(0, 5)); // Keep last 5 for activity

      // Get all booked dates (as strings) for calendar
      const dates = bookingsData
        .filter(b => b.status !== 'cancelled')
        .map(b => b.booking_date); // Store full date strings like "2026-01-15"
      setBookedDates(dates);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatActivityDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Poco fa';
    if (diffHours < 24) return `${diffHours} ore fa`;
    if (diffDays === 1) return '1 giorno fa';
    if (diffDays < 7) return `${diffDays} giorni fa`;
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
  };

  const getActivityText = (booking: Booking): string => {
    const date = new Date(booking.booking_date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
    const classType = booking.schedule_slots?.class_type || 'Pilates';

    if (booking.status === 'cancelled') {
      return `Hai cancellato: ${classType} del ${date}`;
    }
    if (booking.status === 'confirmed') {
      return `Prenotazione confermata: ${classType} - ${date}`;
    }
    return `Nuova prenotazione: ${classType} - ${date}`;
  };

  const getActivityType = (booking: Booking): string => {
    if (booking.status === 'cancelled') return 'cancel';
    if (booking.status === 'confirmed') return 'pay';
    return 'book';
  };

  const formatNextBookingDate = (booking: Booking): string => {
    const date = new Date(booking.booking_date);
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    const time = booking.schedule_slots?.start_time?.substring(0, 5) || '';
    return `${date.getDate()} ${months[date.getMonth()]}, ${time}`;
  };

  const statsDisplay = [
    { label: 'Prossimi', value: loading ? '-' : String(stats?.upcoming || 0), icon: Calendar, color: '#4A90E2' },
    { label: 'Completati', value: loading ? '-' : String(stats?.completed || 0), icon: CheckCircle2, color: '#10B981' },
    { label: 'Istruttori', value: loading ? '-' : String(stats?.instructorCount || 0), icon: Users, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl md:text-4xl font-black text-black tracking-tighter mb-1 italic">Benvenuto, {user.name.split(' ')[0]}!</h1>
        <p className="text-[#4B5563] text-sm md:text-base">Ecco cosa sta succedendo oggi nel tuo percorso Wave.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {statsDisplay.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-[#E5E5E5] group active:scale-95 transition-transform">
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className="p-2 md:p-3 rounded-xl bg-[#F9FAFB] text-[#9CA3AF] group-hover:bg-[#E8F4FF] group-hover:text-[#4A90E2] transition-colors">
                  <Icon size={20} />
                </div>
                <TrendingUp size={14} className="text-green-500" />
              </div>
              <p className="text-xl md:text-3xl font-black text-black mb-0.5">{stat.value}</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF]">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">
        <div className="xl:col-span-2 space-y-6 md:space-y-8">
          {nextBooking ? (
            <div className="bg-[#4A90E2] rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-[#4A90E2]/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-[10px] md:text-xs uppercase font-black tracking-[0.2em] mb-4 md:mb-8 opacity-80">Prossimo Appuntamento</h3>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10">
                <div className="space-y-4">
                  <p className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">{formatNextBookingDate(nextBooking)}</p>
                  <div className="space-y-2.5 opacity-90 text-sm md:text-base">
                    <div className="flex items-center gap-3">
                      <Users size={20} className="flex-shrink-0" />
                      <span className="font-bold">Con: {nextBooking.schedule_slots?.instructor?.name || 'Istruttore'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={20} className="flex-shrink-0" />
                      <span className="font-medium">{nextBooking.schedule_slots?.class_type || 'Pilates'} - Wave Studio</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#F9FAFB] to-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-[#E5E5E5] text-center">
              <Calendar size={48} className="mx-auto text-[#9CA3AF] mb-4" />
              <h3 className="text-xl font-black text-black mb-2">Nessun appuntamento</h3>
              <p className="text-[#4B5563] text-sm mb-6">Prenota la tua prossima sessione di Pilates!</p>
              <button
                onClick={onBook}
                className="h-14 bg-[#4A90E2] text-white px-8 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all text-sm shadow-xl"
              >
                Prenota Ora
              </button>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={onBook}
              className="h-16 px-12 flex items-center justify-center gap-3 bg-black text-white rounded-2xl font-bold text-base active:scale-95 transition-transform shadow-xl"
            >
              <Plus size={20} /> Prenota Nuovo
            </button>
          </div>

          <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-[#E5E5E5] shadow-sm">
            <h3 className="font-black text-lg md:text-xl mb-8 flex items-center gap-3 text-black">
              <Clock size={24} className="text-[#4A90E2]" />
              ATTIVITÀ RECENTE
            </h3>
            <div className="space-y-8">
              {recentBookings.length === 0 ? (
                <p className="text-[#9CA3AF] text-sm text-center py-4">Nessuna attività recente</p>
              ) : (
                recentBookings.map((booking, i) => {
                  const actType = getActivityType(booking);
                  return (
                    <div key={booking.id} className="flex gap-5 group">
                      <div className="flex flex-col items-center">
                        <div className={`w-3.5 h-3.5 rounded-full mt-1.5 ring-4 ring-offset-2 ${
                          actType === 'book' ? 'bg-[#4A90E2] ring-[#E8F4FF]' :
                          actType === 'pay' ? 'bg-[#10B981] ring-green-50' :
                          'bg-[#DC2626] ring-red-50'
                        }`}></div>
                        {i < recentBookings.length - 1 && <div className="w-px flex-1 bg-[#E5E5E5] my-2"></div>}
                      </div>
                      <div className="pb-2">
                        <p className="text-sm md:text-base font-bold text-black group-hover:text-[#4A90E2] transition-colors leading-snug">
                          {getActivityText(booking)}
                        </p>
                        <p className="text-[10px] md:text-xs uppercase font-black text-[#9CA3AF] tracking-widest mt-2">
                          {formatActivityDate(booking.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-10">
          <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-[#E5E5E5] shadow-sm">
            <MiniCalendar bookedDates={bookedDates} onBook={onBook} />
          </div>

          <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-[#E5E5E5] shadow-sm">
            <h3 className="font-black text-lg mb-6">NOVITÀ STUDIO</h3>
            <div className="aspect-[16/9] rounded-2xl bg-[#F9FAFB] mb-6 overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover transition-all duration-700" alt="News" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                <p className="text-white text-sm font-black uppercase tracking-tight leading-tight">Lancio Nuovi Corsi Reformer Avanzato</p>
                <p className="text-white/60 text-[10px] font-bold mt-1">12 GEN 2026</p>
              </div>
            </div>
            <button className="w-full h-12 bg-[#F9FAFB] hover:bg-[#E8F4FF] rounded-xl text-sm font-bold text-[#4A90E2] flex items-center justify-center gap-2 transition-colors">
              Leggi Tutti <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingFlow: React.FC<{ userId: string; preSelectedInstructor?: DBInstructor | null; onClearPreselection?: () => void }> = ({ userId, preSelectedInstructor, onClearPreselection }) => {
  console.log('📅 BookingFlow MOUNTED - userId:', userId);
  const [step, setStep] = useState(preSelectedInstructor ? 2 : 1);
  const [instructors, setInstructors] = useState<DBInstructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<DBInstructor | null>(preSelectedInstructor || null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<(ScheduleSlot & { availability: { isAvailable: boolean; spotsLeft: number }; waitlistCount?: number })[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showWaitlistConfirmation, setShowWaitlistConfirmation] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingDatesAvailability, setLoadingDatesAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [joiningWaitlist, setJoiningWaitlist] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [datesAvailability, setDatesAvailability] = useState<Record<string, { hasSlots: boolean; availableCount: number }>>({});

  useEffect(() => {
    loadInstructors();
  }, []);

  // Load dates availability when entering step 2
  useEffect(() => {
    if (step === 2) {
      loadDatesAvailability();
    }
  }, [step, selectedInstructor]);

  // Real-time subscription to booking changes - updates slot availability when any user books
  useEffect(() => {
    const channel = subscribeToBookingChanges((payload) => {
      // When any booking changes (INSERT, UPDATE, DELETE), refresh the slots for current date
      if (selectedDate) {
        console.log('🔄 Refreshing slots due to booking change...');
        loadSlotsForDate(selectedDate);
      }
      // Also refresh dates availability
      if (step === 2) {
        loadDatesAvailability();
      }
    });

    return () => {
      unsubscribeFromChannel(channel);
    };
  }, [selectedDate, selectedInstructor, step]);

  const loadDatesAvailability = async () => {
    try {
      setLoadingDatesAvailability(true);
      const dates = generateDates().map(d => formatDateISO(d));
      const availability = await getDatesAvailability(dates, selectedInstructor?.id || null);
      setDatesAvailability(availability);
    } catch (err) {
      console.error('Error loading dates availability:', err);
    } finally {
      setLoadingDatesAvailability(false);
    }
  };

  const loadInstructors = async () => {
    console.log('🔵 BookingFlow: Loading instructors...');
    try {
      setLoading(true);
      const data = await getInstructors();
      console.log('🟢 BookingFlow: Got instructors:', data);
      setInstructors(data);
    } catch (err) {
      console.error('🔴 BookingFlow: Error loading instructors:', err);
      setError('Errore nel caricamento degli istruttori');
    } finally {
      setLoading(false);
    }
  };

  const loadSlotsForDate = async (date: string) => {
    console.log('📅 loadSlotsForDate called with:', date);
    console.log('📅 Day of week:', new Date(date).getDay());
    try {
      setLoadingSlots(true);
      let slots = await getAvailableSlotsForDate(date);
      console.log('📅 Raw slots returned:', slots);
      // Filter by selected instructor if any
      if (selectedInstructor) {
        console.log('📅 Filtering by instructor:', selectedInstructor.id);
        slots = slots.filter(s => s.instructor_id === selectedInstructor.id);
      }

      // Get waitlist counts for full slots
      const slotsWithWaitlist = await Promise.all(
        slots.map(async (slot) => {
          if (!slot.availability.isAvailable) {
            const waitlistCount = await getWaitlistCount(slot.id, date);
            return { ...slot, waitlistCount };
          }
          return slot;
        })
      );

      console.log('📅 Final slots with waitlist:', slotsWithWaitlist);
      setAvailableSlots(slotsWithWaitlist);
    } catch (err) {
      console.error('🔴 Error loading slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleJoinWaitlist = async (slot: ScheduleSlot) => {
    if (!selectedDate) return;

    try {
      setJoiningWaitlist(slot.id);
      setError(null);
      const entry = await joinWaitlist(userId, slot.id, selectedDate);
      setWaitlistPosition(entry.position);
      setSelectedSlot(slot);
      setShowWaitlistConfirmation(true);
      // Refresh slots to update waitlist count
      loadSlotsForDate(selectedDate);
    } catch (err: any) {
      console.error('Error joining waitlist:', err);
      setError(err.message || 'Errore nell\'iscrizione alla lista d\'attesa');
    } finally {
      setJoiningWaitlist(null);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    loadSlotsForDate(date);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !selectedDate) return;

    try {
      setSubmitting(true);
      setError(null);
      await createSlotBooking(userId, selectedSlot.id, selectedDate);
      setShowConfirmation(true);
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setError(err.message || 'Errore nella prenotazione');
    } finally {
      setSubmitting(false);
    }
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedInstructor(null);
    setSelectedDate('');
    setSelectedSlot(null);
    setShowConfirmation(false);
    setError(null);
    onClearPreselection?.();
  };

  // Generate next 30 days for date picker
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const formatDateDisplay = (date: Date): string => {
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  const formatDateISO = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 pb-20">
      <div className="flex items-center justify-between relative px-2 md:px-6 h-12">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#E5E5E5] -translate-y-1/2 z-0"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-[#4A90E2] -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
        {[1, 2, 3].map(s => (
          <div key={s} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all shadow-md ${step >= s ? 'bg-[#4A90E2] text-white scale-110' : 'bg-white text-[#9CA3AF] border-2 border-[#E5E5E5]'}`}>
            {s}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl md:rounded-[3rem] p-6 md:p-12 border border-[#E5E5E5] shadow-sm animate-in fade-in zoom-in duration-300">
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">Seleziona l'Istruttore</h2>
              <p className="text-[#4B5563] text-sm mt-1">Scegli il tuo coach dedicato.</p>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Option for any instructor */}
                <div
                  onClick={() => { setSelectedInstructor(null); setStep(2); }}
                  className="flex items-center justify-between p-6 md:p-8 border border-[#E5E5E5] rounded-3xl hover:border-[#4A90E2] cursor-pointer transition-all bg-[#F9FAFB] group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-[#E8F4FF] rounded-2xl flex items-center justify-center font-black text-[#4A90E2] text-xl">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="font-black text-lg text-black">Qualsiasi Istruttore</p>
                      <p className="text-xs text-[#9CA3AF] uppercase font-bold tracking-[0.2em]">Il primo disponibile</p>
                    </div>
                  </div>
                </div>
                {instructors.map(inst => (
                  <div
                    key={inst.id}
                    onClick={() => { setSelectedInstructor(inst); setStep(2); }}
                    className="flex items-center justify-between p-6 md:p-8 border border-[#E5E5E5] rounded-3xl hover:border-[#4A90E2] cursor-pointer transition-all bg-[#F9FAFB] group active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-[#E8F4FF] rounded-2xl flex items-center justify-center font-black text-[#4A90E2] text-xl overflow-hidden">
                        {inst.image_url ? (
                          <img src={inst.image_url} alt={inst.name} className="w-full h-full object-cover" />
                        ) : (
                          inst.name[0]
                        )}
                      </div>
                      <div>
                        <p className="font-black text-lg text-black">{inst.name}</p>
                        <p className="text-xs text-[#9CA3AF] uppercase font-bold tracking-[0.2em]">Istruttore Pilates</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">Data e Ora</h2>
              <p className="text-[#4B5563] text-sm mt-1">
                {selectedInstructor ? `Con ${selectedInstructor.name}` : 'Qualsiasi istruttore disponibile'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-[#F9FAFB] p-6 rounded-3xl border border-[#E5E5E5]">
                <div className="flex items-center justify-between mb-6">
                  <p className="font-black text-sm uppercase tracking-widest text-[#2E5C8A]">Seleziona Data</p>
                  {loadingDatesAvailability && (
                    <Loader2 className="w-4 h-4 text-[#4A90E2] animate-spin" />
                  )}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {generateDates().map((date) => {
                    const dateStr = formatDateISO(date);
                    const isSelected = selectedDate === dateStr;
                    const dayName = DAY_NAMES[date.getDay()].substring(0, 3);
                    const availability = datesAvailability[dateStr];
                    const hasAvailableSlots = availability?.hasSlots && availability?.availableCount > 0;
                    const hasNoSlots = !availability?.hasSlots;
                    const isFull = availability?.hasSlots && availability?.availableCount === 0;

                    return (
                      <button
                        key={dateStr}
                        onClick={() => hasAvailableSlots ? handleDateSelect(dateStr) : null}
                        disabled={!hasAvailableSlots}
                        className={`p-3 rounded-xl flex flex-col items-center transition-all relative ${
                          isSelected
                            ? 'bg-[#4A90E2] text-white shadow-lg scale-105'
                            : hasAvailableSlots
                              ? 'bg-green-50 border-2 border-green-200 text-black hover:border-green-400 hover:bg-green-100 active:scale-95'
                              : hasNoSlots
                                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                : 'bg-red-50 text-red-300 cursor-not-allowed border border-red-100'
                        }`}
                      >
                        <span className={`text-[10px] font-bold uppercase ${isSelected ? 'opacity-80' : hasAvailableSlots ? 'text-green-600' : 'opacity-40'}`}>
                          {dayName}
                        </span>
                        <span className="text-lg font-black">{date.getDate()}</span>
                        {hasAvailableSlots && !isSelected && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                        {isFull && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="w-3 h-3 bg-green-100 border-2 border-green-300 rounded"></span>
                    <span>Disponibile</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="w-3 h-3 bg-red-50 border border-red-200 rounded"></span>
                    <span>Pieno</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="w-3 h-3 bg-slate-100 rounded"></span>
                    <span>No lezioni</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="font-black text-sm uppercase tracking-widest text-[#2E5C8A]">Slot Disponibili</p>
                {!selectedDate ? (
                  <div className="text-center py-8 text-[#9CA3AF]">
                    <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Seleziona una data</p>
                  </div>
                ) : loadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#4A90E2] animate-spin" />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-8 text-[#9CA3AF]">
                    <p className="text-sm">Nessuno slot disponibile per questa data</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-2">
                    {availableSlots.map(slot => {
                      const isSelected = selectedSlot?.id === slot.id;
                      const time = slot.start_time.substring(0, 5);
                      const endTime = new Date(`2000-01-01T${slot.start_time}`);
                      endTime.setMinutes(endTime.getMinutes() + slot.duration_minutes);
                      const endTimeStr = endTime.toTimeString().substring(0, 5);
                      const isFull = !slot.availability.isAvailable;

                      return (
                        <div key={slot.id} className="flex gap-2">
                          <button
                            disabled={isFull}
                            onClick={() => setSelectedSlot(slot)}
                            className={`flex-1 h-16 flex items-center justify-between px-6 border rounded-2xl transition-all ${
                              isSelected
                                ? 'bg-[#4A90E2] border-[#4A90E2] text-white shadow-xl'
                                : slot.availability.isAvailable
                                ? 'border-[#E5E5E5] bg-[#F9FAFB] hover:border-[#4A90E2] active:scale-95'
                                : 'border-[#E5E5E5] bg-[#F9FAFB] opacity-60'
                            }`}
                          >
                            <div className="text-left">
                              <span className="font-black text-sm block">{time} - {endTimeStr}</span>
                              <span className={`text-[10px] font-bold ${isSelected ? 'text-white/80' : 'text-[#9CA3AF]'}`}>
                                {slot.instructor?.name || 'Istruttore'}
                              </span>
                            </div>
                            <div className="text-right">
                              {isSelected ? (
                                <CheckCircle2 size={20} />
                              ) : slot.availability.isAvailable ? (
                                <span className="text-[10px] font-black uppercase tracking-widest text-green-500">
                                  {slot.availability.spotsLeft}/{slot.max_capacity} posti
                                </span>
                              ) : (
                                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">
                                  PIENO {slot.waitlistCount ? `(${slot.waitlistCount} in attesa)` : ''}
                                </span>
                              )}
                            </div>
                          </button>
                          {isFull && (
                            <button
                              onClick={() => handleJoinWaitlist(slot)}
                              disabled={joiningWaitlist === slot.id}
                              className="h-16 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-xs uppercase tracking-wide transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                            >
                              {joiningWaitlist === slot.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Clock size={14} />
                                  Lista Attesa
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                <button
                  disabled={!selectedSlot}
                  onClick={() => setStep(3)}
                  className="w-full h-16 bg-black text-white rounded-2xl font-black text-lg mt-6 disabled:opacity-30 disabled:grayscale transition-all"
                >
                  Continua
                </button>
              </div>
            </div>
            <button onClick={() => setStep(1)} className="w-full md:w-auto flex items-center justify-center gap-2 h-14 text-[#9CA3AF] hover:text-black font-bold text-sm">
              <ArrowLeft size={18} /> Torna a Istruttori
            </button>
          </div>
        )}

        {step === 3 && selectedSlot && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight leading-none uppercase italic">Quasi <span className="text-[#4A90E2]">Fatto</span>!</h2>
              <p className="text-[#4B5563] text-sm mt-2">Verifica i dettagli e conferma la tua prenotazione.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="bg-[#F9FAFB] p-8 md:p-12 rounded-[2.5rem] border border-[#E5E5E5] space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4A90E2]/5 rounded-full blur-3xl"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9CA3AF]">Tipo</label>
                  <p className="text-xl font-black text-black mt-1">{selectedSlot.class_type}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9CA3AF]">Istruttore</label>
                  <p className="text-xl font-black text-black mt-1">{selectedSlot.instructor?.name || 'Istruttore'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9CA3AF]">Data e Ora</label>
                  <p className="text-xl font-black text-black mt-1">
                    {new Date(selectedDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })} alle {selectedSlot.start_time.substring(0, 5)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#FFF8E1] p-5 rounded-2xl border border-[#FFE082] flex gap-4">
                <Navigation size={24} className="text-[#F59E0B] flex-shrink-0" />
                <p className="text-sm text-[#795548] leading-relaxed">
                  <strong>Policy:</strong> Le cancellazioni devono essere effettuate almeno 24 ore prima dell'appuntamento.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button
                  onClick={handleConfirmBooking}
                  disabled={submitting}
                  className="flex-1 h-16 bg-[#4A90E2] text-white rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-[#4A90E2]/30 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Prenotando...
                    </>
                  ) : (
                    'Conferma e Prenota'
                  )}
                </button>
                <button onClick={() => setStep(2)} className="h-16 px-8 bg-white border-2 border-black/5 rounded-2xl font-black text-sm hover:bg-[#F9FAFB] transition-colors">← Modifica</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Confirmation Modal */}
      {showConfirmation && selectedSlot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetBooking}></div>
          <div className="relative bg-white rounded-[2.5rem] p-8 md:p-12 max-w-md w-full shadow-2xl animate-in zoom-in fade-in duration-300 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-black text-black mb-3">Prenotazione Confermata!</h3>
            <p className="text-[#4B5563] mb-8">Riceverai una mail di conferma a breve con tutti i dettagli del tuo appuntamento.</p>
            <div className="bg-[#F9FAFB] p-4 rounded-2xl mb-8 text-left">
              <p className="text-sm"><strong>{selectedSlot.class_type}</strong> con {selectedSlot.instructor?.name || 'Istruttore'}</p>
              <p className="text-xs text-[#9CA3AF] mt-1">
                {new Date(selectedDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })} alle {selectedSlot.start_time.substring(0, 5)}
              </p>
            </div>
            <button
              onClick={resetBooking}
              className="w-full h-14 bg-[#4A90E2] text-white rounded-xl font-black text-sm hover:bg-[#3A80D2] transition-all"
            >
              Torna alla Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Waitlist Confirmation Modal */}
      {showWaitlistConfirmation && selectedSlot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetBooking}></div>
          <div className="relative bg-white rounded-[2.5rem] p-8 md:p-12 max-w-md w-full shadow-2xl animate-in zoom-in fade-in duration-300 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={40} className="text-amber-600" />
            </div>
            <h3 className="text-2xl font-black text-black mb-3">Sei in Lista d'Attesa!</h3>
            <p className="text-[#4B5563] mb-4">Ti contatteremo appena si libera un posto.</p>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-6">
              <p className="text-amber-800 font-black text-3xl"># {waitlistPosition}</p>
              <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mt-1">La tua posizione</p>
            </div>
            <div className="bg-[#F9FAFB] p-4 rounded-2xl mb-8 text-left">
              <p className="text-sm"><strong>{selectedSlot.class_type}</strong> con {selectedSlot.instructor?.name || 'Istruttore'}</p>
              <p className="text-xs text-[#9CA3AF] mt-1">
                {new Date(selectedDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })} alle {selectedSlot.start_time.substring(0, 5)}
              </p>
            </div>
            <p className="text-xs text-[#9CA3AF] mb-6">
              Quando un posto si libera, riceverai una notifica e avrai 2 ore per confermare.
            </p>
            <button
              onClick={resetBooking}
              className="w-full h-14 bg-amber-500 text-white rounded-xl font-black text-sm hover:bg-amber-600 transition-all"
            >
              Ho Capito
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MyAppointments: React.FC<{ userId: string }> = ({ userId }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'Tutti' | 'Prossimi' | 'Passati'>('Tutti');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, [userId]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserBookings(userId);
      setBookings(data);
    } catch (err: any) {
      console.error('Error loading bookings:', err);
      setError('Errore nel caricamento delle prenotazioni. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Sei sicuro di voler cancellare questa prenotazione?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId, userId);
      await loadBookings(); // Refresh list
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      alert(err.message || 'Errore durante la cancellazione. Riprova.');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (timeString: string): string => {
    return timeString.substring(0, 5); // HH:MM
  };

  const getStatusInfo = (booking: Booking) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(booking.booking_date);
    bookingDate.setHours(0, 0, 0, 0);

    if (booking.status === 'cancelled') {
      return { label: 'CANCELLATO', color: '#DC2626' };
    }
    if (booking.status === 'confirmed') {
      if (bookingDate >= today) {
        return { label: 'CONFERMATO', color: '#4A90E2' };
      } else {
        return { label: 'COMPLETATO', color: '#10B981' };
      }
    }
    return { label: 'IN ATTESA', color: '#F59E0B' };
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'Tutti') return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(booking.booking_date);
    bookingDate.setHours(0, 0, 0, 0);
    
    if (filter === 'Prossimi') {
      return bookingDate >= today && booking.status !== 'cancelled';
    }
    if (filter === 'Passati') {
      return bookingDate < today || booking.status === 'cancelled';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto pb-20 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tighter italic">I Miei Appuntamenti</h1>
          <p className="text-sm text-[#4B5563]">Gestisci il tuo calendario attività.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scroll-hide">
          {(['Tutti', 'Prossimi', 'Passati'] as const).map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
                filter === f 
                  ? 'bg-black border-black text-white shadow-lg' 
                  : 'bg-white border-[#E5E5E5] text-[#4B5563] active:bg-[#F9FAFB]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#E5E5E5]">
          <p className="text-black/60 text-lg">Nessuna prenotazione trovata.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => {
            const statusInfo = getStatusInfo(booking);
            const slotData = booking.schedule_slots;
            const bookingDate = new Date(booking.booking_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            bookingDate.setHours(0, 0, 0, 0);
            const isUpcoming = bookingDate >= today && booking.status !== 'cancelled';

            // Calculate end time
            let timeDisplay = '';
            if (slotData?.start_time) {
              const startTime = slotData.start_time.substring(0, 5);
              const endTime = new Date(`2000-01-01T${slotData.start_time}`);
              endTime.setMinutes(endTime.getMinutes() + (slotData.duration_minutes || 50));
              timeDisplay = `${startTime} - ${endTime.toTimeString().substring(0, 5)}`;
            }

            return (
              <div
                key={booking.id}
                className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-[#E5E5E5] shadow-sm flex flex-col xl:flex-row justify-between xl:items-center gap-8 group hover:border-[#4A90E2]/50 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full text-white"
                      style={{ backgroundColor: statusInfo.color }}
                    >
                      {statusInfo.label}
                    </span>
                    <span className="text-sm font-black text-black">
                      {formatDate(booking.booking_date)} {timeDisplay && `• ${timeDisplay}`}
                    </span>
                  </div>
                  <h4 className="text-2xl md:text-3xl font-black tracking-tight text-black">
                    {slotData?.class_type || 'Pilates'}
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    {slotData?.instructor?.name && (
                      <div className="flex items-center gap-2 text-sm text-[#4B5563] font-medium">
                        <Users size={18} className="text-[#4A90E2]" />
                        <span>Istruttore: <strong>{slotData.instructor.name}</strong></span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-[#4B5563] font-medium">
                      <MapPin size={18} className="text-[#4A90E2]" />
                      <span>Wave Studio</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4 xl:pt-0">
                  {isUpcoming && booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="h-12 md:h-14 px-8 border border-[#E5E5E5] text-[#DC2626] rounded-xl font-black text-sm hover:bg-red-50 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {cancellingId === booking.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Annulla'
                      )}
                    </button>
                  )}
                  {booking.status === 'confirmed' && bookingDate < today && (
                    <button className="h-12 md:h-14 px-8 border-2 border-black/5 rounded-xl font-black text-sm hover:bg-black hover:text-white active:scale-95 transition-all flex items-center justify-center gap-2">
                      <FileText size={18} /> Ricevuta
                    </button>
                  )}
                  {booking.status === 'pending' && (
                    <span className="text-sm text-[#F59E0B] font-bold">In attesa di pagamento</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const InstructorsView: React.FC<{ onBookInstructor: (instructor: DBInstructor) => void }> = ({ onBookInstructor }) => {
  const [instructors, setInstructors] = useState<DBInstructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    try {
      const data = await getInstructors();
      setInstructors(data);
    } catch (err) {
      console.error('Error loading instructors:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto pb-20">
      {instructors.map(inst => (
        <div key={inst.id} className="bg-white rounded-[3rem] overflow-hidden border border-[#E5E5E5] shadow-sm group hover:border-[#4A90E2]/30 transition-all">
          <div className="aspect-[4/3] overflow-hidden bg-[#E8F4FF] flex items-center justify-center">
            {inst.image_url ? (
              <img src={inst.image_url} className="w-full h-full object-cover transition-all duration-1000" alt={inst.name} />
            ) : (
              <span className="text-6xl font-black text-[#4A90E2]">{inst.name[0]}</span>
            )}
          </div>
          <div className="p-8 md:p-12">
            <h3 className="text-3xl font-black mb-1 text-black italic leading-none">{inst.name}</h3>
            <p className="text-xs font-black text-[#4A90E2] uppercase tracking-[0.2em] mb-6">Istruttore Pilates</p>
            <p className="text-base text-[#4B5563] leading-relaxed mb-10">
              {inst.bio || 'Istruttore certificato presso Wave Studio Pilates.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onBookInstructor(inst)}
                className="h-14 flex-1 bg-black text-white rounded-xl font-bold hover:bg-[#4A90E2] transition-all shadow-xl active:scale-95"
              >
                Prenota Sessione
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const NotificationsView: React.FC<{ userId: string }> = ({ userId }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [waitlistNotifications, setWaitlistNotifications] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const [bookingsData, waitlistData] = await Promise.all([
        getUserBookings(userId),
        getUserWaitlist(userId)
      ]);

      // Get upcoming confirmed bookings for reminders
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcoming = bookingsData.filter(b => {
        const bookingDate = new Date(b.booking_date);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate >= today && b.status === 'confirmed';
      });
      setBookings(upcoming);

      // Get waitlist entries with 'notified' status (spot available!)
      const notifiedWaitlist = waitlistData.filter(w => w.status === 'notified');
      setWaitlistNotifications(notifiedWaitlist);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmWaitlistSpot = async (entry: WaitlistEntry) => {
    try {
      setConfirmingId(entry.id);
      await confirmWaitlistSpot(entry.id, userId);
      await loadNotifications();
    } catch (err: any) {
      console.error('Error confirming spot:', err);
      alert(err.message || 'Errore nella conferma del posto');
    } finally {
      setConfirmingId(null);
    }
  };

  const formatNotificationDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'OGGI';
    if (diffDays === 1) return 'DOMANI';
    if (diffDays <= 7) return `TRA ${diffDays} GIORNI`;
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
  };

  const isUrgent = (dateString: string): boolean => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  };

  const getTimeRemaining = (expiresAt: string | null): string | null => {
    if (!expiresAt) return null;
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffMs = expires.getTime() - now.getTime();

    if (diffMs <= 0) return 'Scaduto';

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} minuti`;
  };

  const isExpired = (expiresAt: string | null): boolean => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const totalNotifications = bookings.length + waitlistNotifications.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl md:text-3xl font-black italic">NOTIFICHE</h1>
        <span className="text-xs font-black uppercase tracking-widest text-[#9CA3AF]">{totalNotifications} notifiche</span>
      </div>

      {/* Waitlist Notifications - Always shown first as they're urgent */}
      {waitlistNotifications.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-green-600 flex items-center gap-2">
            <ListOrdered size={16} />
            Posti Disponibili - Azione Richiesta
          </h2>
          {waitlistNotifications.map((entry) => {
            const slot = entry.schedule_slots;
            const expired = isExpired(entry.expires_at);
            const timeRemaining = getTimeRemaining(entry.expires_at);
            const time = slot?.start_time?.substring(0, 5) || '';

            return (
              <div
                key={entry.id}
                className={`p-6 md:p-8 rounded-[2rem] border transition-all ${
                  expired
                    ? 'bg-red-50 border-red-200'
                    : 'bg-green-50 border-green-300 shadow-xl shadow-green-500/10'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ring-4 ${expired ? 'bg-red-500 ring-red-100' : 'bg-green-500 ring-green-100 animate-pulse'}`}></div>
                    <h4 className="font-black text-black text-base md:text-lg leading-snug">
                      {expired ? 'Tempo scaduto' : 'Posto disponibile!'} {slot?.class_type || 'Pilates'} alle {time}
                    </h4>
                  </div>
                  {!expired && timeRemaining && (
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 whitespace-nowrap">
                      {timeRemaining} rimasti
                    </span>
                  )}
                </div>
                <p className="text-sm md:text-base text-[#4B5563] ml-7 font-medium leading-relaxed mb-4">
                  {new Date(entry.booking_date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                  {slot?.instructor?.name && ` - Con ${slot.instructor.name}`}
                </p>
                {!expired ? (
                  <button
                    onClick={() => handleConfirmWaitlistSpot(entry)}
                    disabled={confirmingId === entry.id}
                    className="ml-7 h-12 px-6 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black text-sm uppercase tracking-wide transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {confirmingId === entry.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Conferma Posto
                      </>
                    )}
                  </button>
                ) : (
                  <p className="ml-7 text-sm text-red-600 font-medium">
                    Il tempo per confermare è scaduto. Il posto è stato offerto al prossimo in lista.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Regular booking reminders */}
      {bookings.length > 0 && (
        <>
          {waitlistNotifications.length > 0 && (
            <h2 className="text-sm font-black uppercase tracking-widest text-[#9CA3AF] flex items-center gap-2 mt-8">
              <Bell size={16} />
              Promemoria Appuntamenti
            </h2>
          )}
          <div className="space-y-4">
            {bookings.map((booking) => {
              const urgent = isUrgent(booking.booking_date);
              const time = booking.schedule_slots?.start_time?.substring(0, 5) || '';
              return (
                <div key={booking.id} className={`p-6 md:p-8 rounded-[2rem] border transition-all cursor-pointer group active:scale-[0.98] ${urgent ? 'bg-white border-[#4A90E2]/40 shadow-xl shadow-[#4A90E2]/5' : 'bg-white border-[#E5E5E5]'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-4">
                      {urgent && <div className="w-2.5 h-2.5 bg-[#4A90E2] rounded-full ring-4 ring-[#E8F4FF]"></div>}
                      <h4 className="font-black text-black text-base md:text-lg leading-snug">
                        Promemoria: {booking.schedule_slots?.class_type || 'Pilates'} alle {time}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${urgent ? 'text-[#4A90E2]' : 'text-[#9CA3AF]'}`}>
                      {formatNotificationDate(booking.booking_date)}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-[#4B5563] ml-0 md:ml-6.5 font-medium leading-relaxed">
                    Con: {booking.schedule_slots?.instructor?.name || 'Istruttore'} - Wave Studio Pilates
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Empty state */}
      {totalNotifications === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#E5E5E5]">
          <Bell size={48} className="mx-auto text-[#9CA3AF] mb-4" />
          <p className="text-[#4B5563]">Nessuna notifica</p>
          <p className="text-sm text-[#9CA3AF] mt-1">I tuoi prossimi appuntamenti e avvisi appariranno qui</p>
        </div>
      )}
    </div>
  );
};

const WaitlistView: React.FC<{ userId: string }> = ({ userId }) => {
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadWaitlist();
  }, [userId]);

  const loadWaitlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const entries = await getUserWaitlist(userId);
      setWaitlistEntries(entries);
    } catch (err: any) {
      console.error('Error loading waitlist:', err);
      setError('Errore nel caricamento della lista d\'attesa');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSpot = async (entry: WaitlistEntry) => {
    try {
      setConfirmingId(entry.id);
      setError(null);
      setSuccessMessage(null);
      await confirmWaitlistSpot(entry.id, userId);
      setSuccessMessage('Posto confermato! La prenotazione è stata creata.');
      await loadWaitlist();
    } catch (err: any) {
      console.error('Error confirming spot:', err);
      setError(err.message || 'Errore nella conferma del posto');
    } finally {
      setConfirmingId(null);
    }
  };

  const handleLeaveWaitlist = async (entryId: string) => {
    if (!confirm('Sei sicuro di voler uscire dalla lista d\'attesa?')) {
      return;
    }

    try {
      setLeavingId(entryId);
      setError(null);
      await leaveWaitlist(entryId, userId);
      await loadWaitlist();
    } catch (err: any) {
      console.error('Error leaving waitlist:', err);
      setError(err.message || 'Errore nell\'uscita dalla lista d\'attesa');
    } finally {
      setLeavingId(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const formatTime = (timeString: string): string => {
    return timeString.substring(0, 5);
  };

  const getTimeRemaining = (expiresAt: string | null): string | null => {
    if (!expiresAt) return null;
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffMs = expires.getTime() - now.getTime();

    if (diffMs <= 0) return 'Scaduto';

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m rimanenti`;
    }
    return `${mins} minuti rimanenti`;
  };

  const isExpired = (expiresAt: string | null): boolean => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-black tracking-tighter italic">Lista d'Attesa</h1>
          <p className="text-sm text-[#4B5563]">Gestisci le tue iscrizioni alle liste d'attesa</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
          <ListOrdered size={18} />
          <span className="font-bold">{waitlistEntries.length} in attesa</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle2 size={18} />
          {successMessage}
        </div>
      )}

      {waitlistEntries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E5E5E5]">
          <ListOrdered size={56} className="mx-auto text-[#9CA3AF] mb-4" />
          <h3 className="text-xl font-black text-black mb-2">Nessuna lista d'attesa attiva</h3>
          <p className="text-[#4B5563] text-sm max-w-md mx-auto">
            Quando ti iscrivi a una lista d'attesa per una lezione piena, apparirà qui.
            Ti notificheremo quando un posto si libera!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {waitlistEntries.map((entry) => {
            const slot = entry.schedule_slots;
            const isNotified = entry.status === 'notified';
            const expired = isExpired(entry.expires_at);
            const timeRemaining = getTimeRemaining(entry.expires_at);

            return (
              <div
                key={entry.id}
                className={`bg-white p-6 md:p-8 rounded-3xl border shadow-sm transition-all ${
                  isNotified && !expired
                    ? 'border-green-300 ring-2 ring-green-100'
                    : expired
                    ? 'border-red-200 opacity-60'
                    : 'border-[#E5E5E5]'
                }`}
              >
                {/* Notification Banner for available spots */}
                {isNotified && !expired && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bell size={20} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-green-800">Un posto si è liberato!</p>
                      <p className="text-sm text-green-600 mt-1">
                        Hai <strong>{timeRemaining}</strong> per confermare la tua prenotazione.
                      </p>
                    </div>
                  </div>
                )}

                {/* Expired Banner */}
                {expired && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
                    <AlertCircle size={20} className="text-red-500" />
                    <p className="text-sm text-red-700 font-medium">
                      Il tempo per confermare è scaduto. Questa richiesta verrà rimossa automaticamente.
                    </p>
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3">
                    {/* Position Badge */}
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                        isNotified && !expired
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {isNotified && !expired ? (
                          <>
                            <CheckCircle2 size={14} />
                            Posto Disponibile
                          </>
                        ) : (
                          <>
                            # {entry.position} in coda
                          </>
                        )}
                      </span>
                    </div>

                    {/* Class Info */}
                    <h3 className="text-xl md:text-2xl font-black text-black">
                      {slot?.class_type || 'Pilates'}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-sm text-[#4B5563]">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#4A90E2]" />
                        <span className="font-medium capitalize">{formatDate(entry.booking_date)}</span>
                      </div>
                      {slot?.start_time && (
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-[#4A90E2]" />
                          <span className="font-medium">{formatTime(slot.start_time)}</span>
                        </div>
                      )}
                      {slot?.instructor?.name && (
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-[#4A90E2]" />
                          <span className="font-medium">{slot.instructor.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {isNotified && !expired ? (
                      <button
                        onClick={() => handleConfirmSpot(entry)}
                        disabled={confirmingId === entry.id}
                        className="h-14 px-8 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black text-sm uppercase tracking-wide transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                      >
                        {confirmingId === entry.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 size={18} />
                            Conferma Posto
                          </>
                        )}
                      </button>
                    ) : null}

                    {!expired && (
                      <button
                        onClick={() => handleLeaveWaitlist(entry.id)}
                        disabled={leavingId === entry.id}
                        className="h-14 px-6 bg-white border border-[#E5E5E5] text-[#DC2626] hover:bg-red-50 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {leavingId === entry.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 size={16} />
                            Esci dalla Lista
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Waiting info */}
                {entry.status === 'waiting' && (
                  <div className="mt-6 pt-6 border-t border-[#E5E5E5]">
                    <p className="text-xs text-[#9CA3AF] font-medium">
                      Ti notificheremo via email quando un posto si libera. Avrai 2 ore per confermare la prenotazione.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      <div className="bg-[#F9FAFB] border border-[#E5E5E5] rounded-3xl p-6 md:p-8">
        <h3 className="font-black text-base mb-4 flex items-center gap-2">
          <AlertCircle size={20} className="text-[#4A90E2]" />
          Come funziona la lista d'attesa?
        </h3>
        <div className="space-y-3 text-sm text-[#4B5563]">
          <p><strong>1.</strong> Quando una lezione è piena, puoi iscriverti alla lista d'attesa.</p>
          <p><strong>2.</strong> Se qualcuno cancella, riceverai una notifica email.</p>
          <p><strong>3.</strong> Hai <strong>2 ore</strong> per confermare il posto, altrimenti passa al prossimo in lista.</p>
          <p><strong>4.</strong> Puoi uscire dalla lista d'attesa in qualsiasi momento.</p>
        </div>
      </div>
    </div>
  );
};

const SettingsView: React.FC<{ user: { name: string; email: string; id: string } }> = ({ user }) => {
  const [profile, setProfile] = useState({ full_name: user.name, phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadProfile();
  }, [user.id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile(user.id);
      if (data) {
        setProfile({ full_name: data.full_name, phone: data.phone || '' });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      await updateUserProfile(user.id, {
        full_name: profile.full_name,
        phone: profile.phone || null
      });
      setMessage({ type: 'success', text: 'Profilo aggiornato con successo!' });
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setMessage({ type: 'error', text: err.message || 'Errore nel salvataggio' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="bg-white p-6 md:p-12 rounded-[2.5rem] border border-[#E5E5E5] shadow-sm space-y-10">
        <h2 className="text-xl md:text-2xl font-black italic flex items-center gap-3">
          <Users size={24} className="text-[#4A90E2]" />
          PROFILO PERSONALE
        </h2>

        {message && (
          <div className={`p-4 rounded-xl text-sm font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-[#F5F5F5]">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-[#E8F4FF] rounded-[2rem] flex items-center justify-center text-4xl font-black text-[#4A90E2] shadow-inner">
            {profile.full_name[0]}
          </div>
          <div className="text-center sm:text-left space-y-4">
            <h4 className="font-black text-xl leading-none">{profile.full_name}</h4>
            <p className="text-sm text-[#9CA3AF]">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Nome Completo</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full h-14 px-5 rounded-2xl border border-[#E5E5E5] text-base font-bold focus:border-[#4A90E2] outline-none shadow-sm transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full h-14 px-5 rounded-2xl border border-[#E5E5E5] text-base font-bold bg-[#F9FAFB] text-[#9CA3AF] cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Telefono</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="Es: 333 123 4567"
              className="w-full h-14 px-5 rounded-2xl border border-[#E5E5E5] text-base font-bold focus:border-[#4A90E2] outline-none shadow-sm transition-all"
            />
          </div>
        </div>
        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="h-16 w-full md:w-auto px-12 bg-black text-white rounded-2xl font-black text-base shadow-xl hover:bg-[#4A90E2] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Salvando...
              </>
            ) : (
              'SALVA MODIFICHE'
            )}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 md:p-12 rounded-[2.5rem] border border-[#E5E5E5] shadow-sm space-y-10">
        <h2 className="text-xl md:text-2xl font-black italic flex items-center gap-3">
          <Settings size={24} className="text-[#4A90E2]" />
          PREFERENZE & PRIVACY
        </h2>
        <div className="space-y-4">
          {[
            { label: 'Notifiche Email', desc: 'Ricevi aggiornamenti e conferme via email', active: true },
            { label: 'Promemoria Appuntamenti', desc: 'Ricevi alert 24 ore prima delle sessioni', active: true },
            { label: 'Newsletter Wave', desc: 'Sconti esclusivi e novità mensili', active: false }
          ].map((pref, i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-[#F9FAFB] rounded-[1.5rem] border border-black/5 active:scale-[0.99] transition-transform cursor-pointer">
              <div className="pr-4">
                <p className="font-black text-base text-black leading-none">{pref.label}</p>
                <p className="text-xs text-[#9CA3AF] mt-2 font-medium">{pref.desc}</p>
              </div>
              <div className={`w-14 h-7 rounded-full relative transition-colors ${pref.active ? 'bg-[#4A90E2]' : 'bg-[#E5E5E5]'}`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${pref.active ? 'left-8' : 'left-1'}`}></div>
              </div>
            </div>
          ))}
          <div className="pt-10 flex flex-col sm:flex-row gap-6 border-t border-[#F5F5F5] mt-6">
            <button className="text-sm font-black text-[#4A90E2] hover:underline uppercase tracking-widest">SCARICA I MIEI DATI</button>
            <button className="text-sm font-black text-[#DC2626] hover:underline uppercase tracking-widest">DISATTIVA ACCOUNT</button>
          </div>
        </div>
      </div>
    </div>
  );
};
