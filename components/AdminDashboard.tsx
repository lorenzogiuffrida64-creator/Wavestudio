
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
  MoreVertical,
  Filter,
  Phone,
  Mail,
  UserPlus,
  AlertCircle,
  CalendarDays,
  Trash2,
  Edit2,
  RefreshCcw,
  Loader2,
  ListOrdered,
  UserCheck,
  XCircle
} from 'lucide-react';
import {
  getAdminBookings,
  getAdminStats,
  getAllClients,
  adminCancelBooking,
  adminDeleteBooking,
  updateClientNotes,
  deleteClient,
  getInstructors,
  getAvailableSlotsForDate,
  subscribeToBookingChanges,
  unsubscribeFromChannel,
  getAdminWaitlist,
  leaveWaitlist,
  type Booking,
  type AdminStats,
  type DBInstructor,
  type ScheduleSlot,
  type WaitlistEntry
} from '../lib/booking';

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminView = 'home' | 'appointments' | 'clients' | 'calendar' | 'waitlist' | 'settings' | 'add-appointment';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminView>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const menuItems: { id: AdminView; label: string; icon: any }[] = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appuntamenti', icon: Clock },
    { id: 'clients', label: 'Clienti', icon: Users },
    { id: 'calendar', label: 'Calendario', icon: CalendarDays },
    { id: 'waitlist', label: 'Liste Attesa', icon: ListOrdered },
    { id: 'settings', label: 'Impostazioni', icon: Settings },
  ];

  const handleNavClick = (id: AdminView) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden relative">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col bg-black w-64 xl:w-72 transition-all duration-300">
        <div className="p-8 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 bg-[#4A90E2] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#4A90E2]/30">
            <Shield size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-black uppercase tracking-tighter text-white text-lg leading-none">Giulia Patti</span>
            <span className="text-[10px] font-bold text-[#4A90E2] uppercase tracking-[0.2em] mt-1">Osteopatia</span>
          </div>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-[#4A90E2] text-white shadow-lg shadow-[#4A90E2]/20' 
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-white/40 group-hover:text-white transition-colors'} />
                <span className="font-bold text-sm tracking-tight uppercase">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5">
          <div className="bg-white/5 p-4 rounded-2xl mb-4">
            <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2">Account Admin</p>
            <p className="text-sm font-bold text-white">Giulia Patti</p>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[#EF4444] hover:bg-red-500/10 transition-all font-bold text-sm uppercase"
          >
            <LogOut size={20} />
            <span>Disconnetti</span>
          </button>
        </div>
      </aside>

      {/* MOBILE MENU PANEL (SOP Optimized) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-[340px] bg-white shadow-2xl animate-in slide-in-from-left duration-500 flex flex-col">
            <div className="p-8 pt-12 flex flex-col items-center bg-black text-white relative">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white"
              >
                <X size={24} />
              </button>
              <div className="w-16 h-16 bg-[#4A90E2] rounded-2xl flex items-center justify-center text-white shadow-2xl mb-4">
                <Shield size={32} />
              </div>
              <h2 className="font-black uppercase tracking-tighter text-2xl italic leading-none">Giulia Patti</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4A90E2] mt-2">Gestione Studio</p>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl text-left transition-all ${
                      isActive 
                        ? 'bg-[#4A90E2]/10 text-[#4A90E2] border-l-4 border-[#4A90E2]' 
                        : 'text-slate-500 active:bg-slate-50'
                    }`}
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    <Icon size={22} className={isActive ? 'text-[#4A90E2]' : 'text-slate-400'} />
                    <span className="font-black text-sm uppercase tracking-widest">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-6 border-t border-slate-100">
              <button onClick={onLogout} className="w-full h-14 flex items-center justify-center gap-3 text-white font-black text-xs uppercase tracking-widest bg-[#DC2626] rounded-2xl shadow-xl active:scale-95 transition-all">
                <LogOut size={20} /> Logout Amministratore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* HEADER (SOP Optimized) */}
        <header className="h-16 lg:h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-900 active:bg-slate-100 rounded-xl"
            >
              <Menu size={28} />
            </button>
            <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <button className="p-2.5 text-slate-400 hover:text-[#4A90E2] relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="hidden sm:flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-none">Giulia Patti</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Amministratore</p>
              </div>
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-sm">G</div>
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT VIEW */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto pb-24">
            {activeTab === 'home' && <AdminHome onNavigate={handleNavClick} />}
            {activeTab === 'appointments' && <AdminAppointments />}
            {activeTab === 'clients' && <AdminClients />}
            {activeTab === 'calendar' && <AdminCalendar />}
            {activeTab === 'waitlist' && <AdminWaitlist />}
            {activeTab === 'settings' && <AdminSettings />}
            {activeTab === 'add-appointment' && <AddAppointmentWizard onCancel={() => setActiveTab('appointments')} />}
          </div>
        </main>

        {/* FLOATING ACTION BUTTON (SOP Required) */}
        {activeTab !== 'add-appointment' && (
          <button 
            onClick={() => setActiveTab('add-appointment')}
            className="fixed bottom-6 right-6 w-14 h-14 bg-[#4A90E2] text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all z-[60]"
            aria-label="Aggiungi Appuntamento"
          >
            <Plus size={28} />
          </button>
        )}
      </div>
    </div>
  );
};

/* --- ADMIN SUB-VIEWS (MODULAR) --- */

const colorClasses: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
};

const AdminHome: React.FC<{ onNavigate: (id: AdminView) => void }> = ({ onNavigate }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [pendingPayments, setPendingPayments] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyStats, setWeeklyStats] = useState({ revenue: 0, appointments: 0 });

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Real-time subscription to booking changes
  useEffect(() => {
    const channel = subscribeToBookingChanges(() => {
      console.log('🔄 AdminHome: Refreshing due to booking change...');
      loadDashboardData();
    });

    return () => {
      unsubscribeFromChannel(channel);
    };
  }, []);

  // Polling fallback - refresh every 10 seconds to ensure sync
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 AdminHome: Polling refresh...');
      loadDashboardData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // Load all data in parallel
      const [statsData, allBookings] = await Promise.all([
        getAdminStats(),
        getAdminBookings({ limit: 50 })
      ]);

      setStats(statsData);

      // Filter today's bookings
      const todayData = allBookings.filter(b =>
        b.booking_date === today && b.status !== 'cancelled'
      ).sort((a, b) => {
        const timeA = a.schedule_slots?.start_time || '';
        const timeB = b.schedule_slots?.start_time || '';
        return timeA.localeCompare(timeB);
      });
      setTodayBookings(todayData.slice(0, 5));

      // Get recent activity (last 10 bookings of any status)
      setRecentBookings(allBookings.slice(0, 6));

      // Get pending payments
      const pending = allBookings.filter(b => b.status === 'pending');
      setPendingPayments(pending.slice(0, 3));

      // Calculate weekly stats
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];
      const weeklyBookings = allBookings.filter(b =>
        b.booking_date >= weekAgoStr && b.status === 'confirmed'
      );
      const weeklyRevenue = weeklyBookings.reduce((sum, b) => sum + (b.amount_paid_cents || 0), 0);
      setWeeklyStats({ revenue: weeklyRevenue, appointments: weeklyBookings.length });

    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (): string => {
    const now = new Date();
    const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    return `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  const formatActivityTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m fa`;
    if (diffHours < 24) return `${diffHours}h fa`;
    if (diffDays === 1) return '1 giorno fa';
    return `${diffDays} giorni fa`;
  };

  const getActivityInfo = (booking: Booking) => {
    const clientName = (booking.profiles as any)?.full_name || 'Cliente';
    if (booking.status === 'cancelled') {
      return { type: 'cancel', text: `Cancellazione: ${clientName}` };
    }
    if (booking.status === 'confirmed') {
      return { type: 'payment', text: `Prenotazione confermata: ${clientName}` };
    }
    return { type: 'booking', text: `Nuova prenotazione: ${clientName}` };
  };

  const statsDisplay = [
    { label: 'Appuntamenti Oggi', value: loading ? '-' : String(stats?.todayAppointments || 0), icon: Clock, color: 'blue' },
    { label: 'In Attesa', value: loading ? '-' : String(pendingPayments.length), icon: AlertCircle, color: 'amber' },
    { label: 'Nuovi Clienti', value: loading ? '-' : String(stats?.newClientsThisWeek || 0), icon: UserPlus, color: 'indigo' },
    { label: 'Tasso Show', value: loading ? '-' : `${stats?.showRate || 0}%`, icon: TrendingUp, color: 'green' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Oggi in Studio</h1>
          <p className="text-slate-500 text-sm mt-1">{formatDate()}</p>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="hidden sm:flex h-12 px-6 bg-slate-900 text-white rounded-xl items-center gap-2 font-bold text-sm disabled:opacity-50"
        >
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> Aggiorna Dati
        </button>
      </div>

      {/* STATS - 2x2 Grid on Mobile, 4 across on Tablet */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsDisplay.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2.5 rounded-xl ${colorClasses[stat.color]?.bg || 'bg-slate-50'} ${colorClasses[stat.color]?.text || 'text-slate-600'}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-lg uppercase tracking-tight flex items-center gap-2">
                <Clock size={20} className="text-[#4A90E2]" /> Appuntamenti di Oggi
              </h3>
              <button onClick={() => onNavigate('appointments')} className="text-xs font-black uppercase text-[#4A90E2] hover:underline">Vedi Tutti</button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-[#4A90E2] animate-spin" />
              </div>
            ) : todayBookings.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Clock size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nessun appuntamento per oggi</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {todayBookings.map((booking) => {
                  const profile = booking.profiles as any;
                  const slot = booking.schedule_slots as any;
                  const time = slot?.start_time?.substring(0, 5) || '';
                  return (
                    <div key={booking.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-5">
                        <div className="text-center min-w-[50px]">
                          <p className="text-sm font-black text-slate-900">{time}</p>
                          <p className="text-[10px] text-slate-400 font-bold">Inizio</p>
                        </div>
                        <div>
                          <h4 className="font-black text-base text-slate-900 leading-none mb-1">{profile?.full_name || 'Cliente'}</h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-slate-500">{slot?.class_type || 'Trattamento Osteopatico'}</span>
                            {profile?.phone && (
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Phone size={12} /> {profile.phone}
                              </span>
                            )}
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                              {booking.status === 'confirmed' ? 'CONFERMATO' : 'IN ATTESA'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-6">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-amber-600 uppercase italic">
                <AlertCircle size={20} /> Prenotazioni in Attesa
              </h3>
              {pendingPayments.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <CheckCircle2 size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nessuna prenotazione in attesa</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPayments.map((booking) => {
                    const profile = booking.profiles as any;
                    return (
                      <div key={booking.id} className="flex justify-between items-center p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <div>
                          <p className="font-bold text-slate-900">{profile?.full_name || 'Cliente'}</p>
                          <p className="text-xs text-slate-500">{new Date(booking.booking_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</p>
                        </div>
                        <span className="text-[10px] font-black px-2 py-1 rounded-full bg-amber-100 text-amber-600">IN ATTESA</span>
                      </div>
                    );
                  })}
                  <button onClick={() => onNavigate('appointments')} className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest mt-2">Vedi Tutti</button>
                </div>
              )}
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4A90E2]/20 blur-3xl group-hover:bg-[#4A90E2]/40 transition-all"></div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Statistiche Settimanali</h3>
              <p className="text-sm font-medium text-white/80 leading-relaxed mb-6">Riepilogo degli ultimi 7 giorni di attività dello studio.</p>
              <div className="text-center">
                <p className="text-4xl font-black">{weeklyStats.appointments}</p>
                <p className="text-[10px] uppercase font-bold text-white/40 mt-2">Appuntamenti Completati</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
            <h3 className="font-black text-lg mb-6 uppercase italic">Attività Recente</h3>
            {recentBookings.length === 0 ? (
              <div className="text-center py-6 text-slate-400">
                <p className="text-sm">Nessuna attività recente</p>
              </div>
            ) : (
              <div className="space-y-6">
                {recentBookings.map((booking) => {
                  const activity = getActivityInfo(booking);
                  return (
                    <div key={booking.id} className="flex gap-4">
                      <div className={`w-1 h-8 rounded-full ${
                        activity.type === 'booking' ? 'bg-[#4A90E2]' :
                        activity.type === 'payment' ? 'bg-green-500' :
                        'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-tight">{activity.text}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{formatActivityTime(booking.created_at)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
            <h3 className="font-black text-lg mb-6 uppercase italic">Stato Studio</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <span className="text-sm font-bold text-slate-700">Appuntamenti Oggi</span>
                <span className="text-lg font-black text-[#4A90E2]">{stats?.todayAppointments || 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <span className="text-sm font-bold text-slate-700">Nuovi Clienti (7gg)</span>
                <span className="text-lg font-black text-indigo-600">{stats?.newClientsThisWeek || 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <span className="text-sm font-bold text-slate-700">Tasso Presenza</span>
                <span className="text-lg font-black text-green-600">{stats?.showRate || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminAppointments: React.FC = () => {
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');

  useEffect(() => {
    loadBookings();
  }, [filterDate]);

  // Real-time subscription to booking changes
  useEffect(() => {
    const channel = subscribeToBookingChanges(() => {
      console.log('🔄 AdminAppointments: Refreshing due to booking change...');
      loadBookings();
    });

    return () => {
      unsubscribeFromChannel(channel);
    };
  }, [filterDate]);

  // Polling fallback - refresh every 10 seconds to ensure sync
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 AdminAppointments: Polling refresh...');
      loadBookings();
    }, 10000);

    return () => clearInterval(interval);
  }, [filterDate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getAdminBookings({
        date: filterDate || undefined,
        search: search || undefined
      });
      setBookings(data);
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Sei sicuro di voler cancellare questa prenotazione? Il cliente riceverà una notifica via email.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await adminCancelBooking(bookingId);
      await loadBookings();
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      alert(err.message || 'Errore durante la cancellazione');
    } finally {
      setCancellingId(null);
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Sei sicuro di voler ELIMINARE DEFINITIVAMENTE questa prenotazione? Questa azione non può essere annullata.')) {
      return;
    }

    try {
      setDeletingId(bookingId);
      await adminDeleteBooking(bookingId);
      await loadBookings();
    } catch (err: any) {
      console.error('Error deleting booking:', err);
      alert(err.message || 'Errore durante l\'eliminazione');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { bg: 'bg-green-50', text: 'text-green-600', label: 'CONFERMATO' };
      case 'pending':
        return { bg: 'bg-amber-50', text: 'text-amber-600', label: 'IN ATTESA' };
      case 'cancelled':
        return { bg: 'bg-red-50', text: 'text-red-600', label: 'CANCELLATO' };
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-600', label: status.toUpperCase() };
    }
  };

  // Filter bookings by search
  const filteredBookings = bookings.filter(booking => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      booking.profiles?.full_name?.toLowerCase().includes(searchLower) ||
      booking.profiles?.email?.toLowerCase().includes(searchLower) ||
      booking.schedule_slots?.class_type?.toLowerCase().includes(searchLower)
    );
  });

  const setTodayFilter = () => {
    const today = new Date().toISOString().split('T')[0];
    setFilterDate(today);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Gestione Appuntamenti</h1>
          <p className="text-sm text-slate-500">Gestisci e monitora tutti i trattamenti dello studio.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadBookings}
            className="h-12 px-4 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            <RefreshCcw size={18} />
          </button>
          <button className="flex-1 md:flex-none h-12 px-6 bg-[#4A90E2] text-white rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-[#4A90E2]/20 active:scale-95 transition-all">
            <Plus size={20} /> Nuovo
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cerca per cliente o servizio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4A90E2]/10 focus:border-[#4A90E2] transition-all outline-none"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="h-12 px-4 border border-slate-200 rounded-xl text-sm font-bold text-slate-600"
            />
            <button
              onClick={setTodayFilter}
              className={`flex-1 md:flex-none h-12 px-4 border rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors ${
                filterDate === new Date().toISOString().split('T')[0]
                  ? 'bg-[#4A90E2] text-white border-[#4A90E2]'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CalendarDays size={18} /> Oggi
            </button>
            {filterDate && (
              <button
                onClick={() => setFilterDate('')}
                className="h-12 px-4 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Tutti
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Nessun appuntamento trovato</p>
          </div>
        ) : (
          <>
            {/* Card list for mobile */}
            <div className="lg:hidden">
              {filteredBookings.map((booking) => {
                const status = getStatusBadge(booking.status);
                const profile = booking.profiles as any;
                const slot = booking.schedule_slots as any;
                return (
                  <div key={booking.id} className="p-4 border-b border-slate-100">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 text-sm">
                          {profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 leading-tight">{profile?.full_name || 'Cliente'}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{slot?.class_type || 'Trattamento'}</p>
                          {profile?.phone && (
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <Phone size={12} /> {profile.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${status.bg} ${status.text} px-3 py-1 rounded-full`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-bold">
                          <Clock size={14} /> {slot?.start_time?.substring(0, 5) || ''}
                        </span>
                        <span className="font-bold">{formatDate(booking.booking_date)}</span>
                      </div>
                      <div className="flex gap-2">
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="w-10 h-10 flex items-center justify-center bg-amber-50 text-amber-500 rounded-lg disabled:opacity-50"
                            title="Annulla prenotazione"
                          >
                            {cancellingId === booking.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <X size={16} />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(booking.id)}
                          disabled={deletingId === booking.id}
                          className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-lg disabled:opacity-50"
                          title="Elimina definitivamente"
                        >
                          {deletingId === booking.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Data table for larger screens */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <th className="px-8 py-4">Data/Ora</th>
                    <th className="px-8 py-4">Cliente</th>
                    <th className="px-8 py-4">Servizio</th>
                    <th className="px-8 py-4">Stato</th>
                    <th className="px-8 py-4 text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((booking) => {
                    const status = getStatusBadge(booking.status);
                    const profile = booking.profiles as any;
                    const slot = booking.schedule_slots as any;
                    return (
                      <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-slate-900">{formatDate(booking.booking_date)}</p>
                          <p className="text-xs text-slate-400">{slot?.start_time?.substring(0, 5) || ''}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-black text-slate-900">{profile?.full_name || 'Cliente'}</p>
                          {profile?.phone && (
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Phone size={12} /> {profile.phone}
                            </p>
                          )}
                          <p className="text-[10px] text-slate-400">{profile?.email || ''}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-[#4A90E2]">{slot?.class_type || 'Trattamento Osteopatico'}</p>
                          <p className="text-xs text-slate-400">Con {slot?.instructor?.name || 'Dott.ssa Patti'}</p>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${status.bg} ${status.text} px-3 py-1 rounded-full`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {booking.status !== 'cancelled' && (
                              <button
                                onClick={() => handleCancel(booking.id)}
                                disabled={cancellingId === booking.id}
                                className="p-2 text-slate-400 hover:text-amber-500 disabled:opacity-50"
                                title="Annulla prenotazione"
                              >
                                {cancellingId === booking.id ? (
                                  <Loader2 size={18} className="animate-spin" />
                                ) : (
                                  <X size={18} />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(booking.id)}
                              disabled={deletingId === booking.id}
                              className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-50"
                              title="Elimina definitivamente"
                            >
                              {deletingId === booking.id ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface ClientWithStats {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  bookingCount: number;
  totalSpent: number;
  admin_notes?: string;
}

const AdminClients: React.FC = () => {
  const [clients, setClients] = useState<ClientWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientWithStats | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await getAllClients();
      setClients(data as ClientWithStats[]);
    } catch (err) {
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenClient = (client: ClientWithStats) => {
    setSelectedClient(client);
    setEditingNotes(client.admin_notes || '');
  };

  const handleCloseClient = () => {
    setSelectedClient(null);
    setEditingNotes('');
  };

  const handleSaveNotes = async () => {
    if (!selectedClient) return;
    try {
      setSavingNotes(true);
      await updateClientNotes(selectedClient.id, editingNotes);
      // Update local state
      setClients(prev => prev.map(c =>
        c.id === selectedClient.id ? { ...c, admin_notes: editingNotes } : c
      ));
      setSelectedClient(prev => prev ? { ...prev, admin_notes: editingNotes } : null);
      alert('Note salvate con successo!');
    } catch (err) {
      console.error('Error saving notes:', err);
      alert('Errore durante il salvataggio delle note');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Sei sicuro di voler ELIMINARE questo cliente? Verranno eliminate anche tutte le sue prenotazioni. Questa azione non può essere annullata.')) {
      return;
    }
    try {
      setDeletingId(clientId);
      await deleteClient(clientId);
      setClients(prev => prev.filter(c => c.id !== clientId));
      if (selectedClient?.id === clientId) {
        handleCloseClient();
      }
    } catch (err) {
      console.error('Error deleting client:', err);
      alert('Errore durante l\'eliminazione del cliente');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredClients = clients.filter(client => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      client.full_name?.toLowerCase().includes(searchLower) ||
      client.email?.toLowerCase().includes(searchLower) ||
      client.phone?.includes(search)
    );
  });

  const getInitials = (name: string | null): string => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* CLIENT DETAIL MODAL */}
      {selectedClient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white relative">
              <button
                onClick={handleCloseClient}
                className="absolute top-4 right-4 p-2 text-white/60 hover:text-white"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#4A90E2] rounded-2xl flex items-center justify-center text-white font-black text-2xl">
                  {getInitials(selectedClient.full_name)}
                </div>
                <div>
                  <h2 className="text-xl font-black">{selectedClient.full_name || 'Cliente'}</h2>
                  <p className="text-white/60 text-sm">
                    Cliente dal {new Date(selectedClient.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Informazioni Contatto</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <Mail size={18} className="text-[#4A90E2]" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Email</p>
                      <p className="text-sm font-bold text-slate-900">{selectedClient.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <Phone size={18} className="text-[#4A90E2]" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Telefono</p>
                      <p className="text-sm font-bold text-slate-900">{selectedClient.phone || 'Non specificato'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-[#4A90E2]/10 rounded-xl text-center">
                  <p className="text-2xl font-black text-[#4A90E2]">{selectedClient.bookingCount}</p>
                  <p className="text-[10px] font-bold uppercase text-slate-500">Prenotazioni</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-2xl font-black text-green-600">€{(selectedClient.totalSpent / 100).toFixed(0)}</p>
                  <p className="text-[10px] font-bold uppercase text-slate-500">Totale Speso</p>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Note Admin</h3>
                <textarea
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Aggiungi note su questo cliente..."
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none outline-none focus:border-[#4A90E2]"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="w-full h-12 bg-[#4A90E2] text-white rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {savingNotes ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                  Salva Note
                </button>
              </div>

              {/* Delete */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleDeleteClient(selectedClient.id)}
                  disabled={deletingId === selectedClient.id}
                  className="w-full h-12 bg-red-50 text-red-600 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-100 disabled:opacity-50"
                >
                  {deletingId === selectedClient.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  Elimina Cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Pazienti</h1>
          <p className="text-sm text-slate-500">Gestisci i profili e lo storico di tutti i pazienti.</p>
        </div>
        <button
          onClick={loadClients}
          disabled={loading}
          className="h-12 px-6 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} /> Aggiorna
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca cliente per nome, email o telefono..."
              className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#4A90E2]"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">{search ? 'Nessun cliente trovato' : 'Nessun cliente registrato'}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => handleOpenClient(client)}
                className="p-5 hover:bg-slate-50 transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl shadow-inner group-hover:bg-[#4A90E2] group-hover:text-white transition-colors">
                    {getInitials(client.full_name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-lg text-slate-900 group-hover:text-[#4A90E2] transition-colors">
                        {client.full_name || 'Nome non disponibile'}
                      </h4>
                      {client.admin_notes && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full">NOTE</span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                      {client.phone && (
                        <span className="flex items-center gap-1 text-xs text-slate-400 font-bold">
                          <Phone size={12} /> {client.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-slate-400 font-bold">
                        <Mail size={12} /> {client.email}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {client.bookingCount} app • €{(client.totalSpent / 100).toFixed(0)}
                    </p>
                    <p className="text-[10px] text-slate-300">
                      Dal {new Date(client.created_at).toLocaleDateString('it-IT', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClient(client.id);
                    }}
                    disabled={deletingId === client.id}
                    className="p-2 text-slate-300 hover:text-red-500 disabled:opacity-50"
                    title="Elimina cliente"
                  >
                    {deletingId === client.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-[#4A90E2]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {!loading && filteredClients.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              <span className="font-bold text-slate-900">{filteredClients.length}</span> clienti totali
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<(ScheduleSlot & { availability: { isAvailable: boolean; spotsLeft: number; currentBookings: number } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSlotView, setShowSlotView] = useState(false);

  useEffect(() => {
    loadBookingsForDate();
  }, [selectedDate]);

  // Real-time subscription to booking changes
  useEffect(() => {
    const channel = subscribeToBookingChanges(() => {
      console.log('🔄 AdminCalendar: Refreshing due to booking change...');
      loadBookingsForDate();
    });

    return () => {
      unsubscribeFromChannel(channel);
    };
  }, [selectedDate]);

  const loadBookingsForDate = async () => {
    try {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      const [bookingsData, slotsData] = await Promise.all([
        getAdminBookings({ date: dateStr }),
        getAvailableSlotsForDate(dateStr)
      ]);
      setBookings(bookingsData.filter(b => b.status !== 'cancelled'));
      setSlots(slotsData);
    } catch (err) {
      console.error('Error loading calendar bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const goToNextDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const formatSelectedDate = (): string => {
    const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    return `${days[selectedDate.getDay()]} ${selectedDate.getDate()} ${months[selectedDate.getMonth()]}`;
  };

  const formatMonthYear = (): string => {
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    return `${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  };

  // Create time slots from 6:00 to 21:00
  const timeSlots = Array.from({ length: 16 }, (_, i) => i + 6);

  // Group bookings by hour
  const getBookingsForHour = (hour: number): Booking[] => {
    return bookings.filter(b => {
      const time = b.schedule_slots?.start_time;
      if (!time) return false;
      const bookingHour = parseInt(time.split(':')[0]);
      return bookingHour === hour;
    });
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden h-[700px] flex flex-col">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={goToPreviousDay} className="p-2 hover:bg-slate-50 rounded-full"><ArrowLeft size={20} /></button>
          <h3 className="text-lg font-black uppercase tracking-tighter italic">{formatMonthYear()}</h3>
          <button onClick={goToNextDay} className="p-2 hover:bg-slate-50 rounded-full"><ArrowRight size={20} /></button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSlotView(!showSlotView)}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg ${showSlotView ? 'bg-[#4A90E2] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            {showSlotView ? 'Prenotazioni' : 'Disponibilità'}
          </button>
          <button
            onClick={goToToday}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg ${isToday ? 'bg-[#4A90E2] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            Oggi
          </button>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="font-black text-sm text-[#4A90E2] mb-4 uppercase">{formatSelectedDate()}</p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-[#4A90E2] animate-spin" />
          </div>
        ) : showSlotView ? (
          /* SLOT AVAILABILITY VIEW */
          <div className="space-y-3">
            {slots.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm">Nessuno slot disponibile per questa data</p>
              </div>
            ) : (
              slots.map(slot => {
                const percentFull = ((slot.max_capacity - slot.availability.spotsLeft) / slot.max_capacity) * 100;
                const isFull = slot.availability.spotsLeft === 0;
                const endTime = new Date(`2000-01-01T${slot.start_time}`);
                endTime.setMinutes(endTime.getMinutes() + slot.duration_minutes);
                const endTimeStr = endTime.toTimeString().substring(0, 5);

                return (
                  <div key={slot.id} className={`p-4 rounded-2xl border ${isFull ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-black text-slate-900">{slot.class_type}</p>
                        <p className="text-xs text-slate-500">
                          {slot.start_time.substring(0, 5)} - {endTimeStr} • {slot.instructor?.name || 'Istruttore'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-black ${isFull ? 'text-red-600' : 'text-green-600'}`}>
                          {slot.availability.spotsLeft}/{slot.max_capacity}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">posti liberi</p>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${isFull ? 'bg-red-500' : percentFull > 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{ width: `${percentFull}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                      {slot.max_capacity - slot.availability.spotsLeft} prenotazioni su {slot.max_capacity} posti
                    </p>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* BOOKINGS TIMELINE VIEW */
          <div className="space-y-2">
            {timeSlots.map(hour => {
              const hourBookings = getBookingsForHour(hour);
              return (
                <div key={hour} className="flex gap-4 min-h-[60px] group">
                  <span className="text-xs font-bold text-slate-400 w-12 pt-1 flex-shrink-0">{hour}:00</span>
                  <div className="flex-1 border-t border-slate-100 relative group-hover:border-slate-200 py-1">
                    {hourBookings.length > 0 ? (
                      <div className="space-y-2">
                        {hourBookings.map((booking, idx) => {
                          const profile = booking.profiles as any;
                          const slot = booking.schedule_slots as any;
                          const colors = ['bg-[#4A90E2]', 'bg-slate-900', 'bg-indigo-600', 'bg-emerald-600'];
                          return (
                            <div
                              key={booking.id}
                              className={`${colors[idx % colors.length]} text-white p-3 rounded-xl shadow-lg cursor-pointer active:scale-[0.99] transition-all`}
                            >
                              <p className="text-xs font-black uppercase tracking-widest">{profile?.full_name || 'Paziente'}</p>
                              <p className="text-[10px] opacity-80">
                                {slot?.class_type || 'Trattamento'} • {slot?.start_time?.substring(0, 5)}
                                {slot?.instructor?.name && ` • ${slot.instructor.name}`}
                              </p>
                              {profile?.phone && (
                                <p className="text-[10px] opacity-70 flex items-center gap-1 mt-1">
                                  <Phone size={10} /> {profile.phone}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-full opacity-0 group-hover:opacity-100 flex items-center text-[10px] font-bold text-slate-300 uppercase tracking-widest transition-opacity">
                        Nessun appuntamento
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !showSlotView && bookings.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-sm">Nessun appuntamento per questa data</p>
          </div>
        )}
      </div>

      {/* Summary footer */}
      {!loading && (showSlotView ? slots.length > 0 : bookings.length > 0) && (
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          {showSlotView ? (
            <p className="text-xs text-slate-500">
              <span className="font-bold text-slate-900">{slots.length}</span> slot disponibili •
              <span className="font-bold text-green-600 ml-1">{slots.reduce((sum, s) => sum + s.availability.spotsLeft, 0)}</span> posti liberi su
              <span className="font-bold text-slate-900 ml-1">{slots.reduce((sum, s) => sum + s.max_capacity, 0)}</span> totali
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              <span className="font-bold text-slate-900">{bookings.length}</span> appuntamenti per {formatSelectedDate().toLowerCase()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const AdminWaitlist: React.FC = () => {
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'waiting' | 'notified'>('all');

  useEffect(() => {
    loadWaitlist();
  }, [filterDate]);

  const loadWaitlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const entries = await getAdminWaitlist(filterDate || undefined);
      setWaitlistEntries(entries);
    } catch (err: any) {
      console.error('Error loading waitlist:', err);
      setError('Errore nel caricamento delle liste d\'attesa');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWaitlist = async (entryId: string) => {
    if (!confirm('Sei sicuro di voler rimuovere questo utente dalla lista d\'attesa?')) {
      return;
    }

    try {
      setRemovingId(entryId);
      setError(null);
      await leaveWaitlist(entryId);
      await loadWaitlist();
    } catch (err: any) {
      console.error('Error removing from waitlist:', err);
      setError(err.message || 'Errore nella rimozione dalla lista d\'attesa');
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
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
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const isExpired = (expiresAt: string | null): boolean => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const filteredEntries = waitlistEntries.filter(entry => {
    if (filterStatus === 'all') return true;
    return entry.status === filterStatus;
  });

  // Group entries by slot and date
  const groupedEntries = filteredEntries.reduce((acc, entry) => {
    const key = `${entry.slot_id}-${entry.booking_date}`;
    if (!acc[key]) {
      acc[key] = {
        slot: entry.schedule_slots,
        date: entry.booking_date,
        entries: []
      };
    }
    acc[key].entries.push(entry);
    return acc;
  }, {} as Record<string, { slot: WaitlistEntry['schedule_slots']; date: string; entries: WaitlistEntry[] }>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#4A90E2] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter italic">Liste d'Attesa</h1>
          <p className="text-sm text-slate-500">Gestisci le liste d'attesa per tutti i trattamenti</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadWaitlist}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <RefreshCcw size={18} className="text-slate-500" />
          </button>
          <div className="flex items-center gap-2 text-sm bg-white border border-slate-200 rounded-xl px-4 py-2.5">
            <ListOrdered size={18} className="text-slate-400" />
            <span className="font-bold text-slate-700">{waitlistEntries.length} totali</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Filtra per data</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-[#4A90E2] text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Stato</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'waiting' | 'notified')}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-[#4A90E2] text-sm bg-white"
          >
            <option value="all">Tutti gli stati</option>
            <option value="waiting">In attesa</option>
            <option value="notified">Notificati</option>
          </select>
        </div>
        {filterDate && (
          <div className="flex items-end">
            <button
              onClick={() => setFilterDate('')}
              className="h-12 px-4 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancella filtri
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Waitlist Content */}
      {Object.keys(groupedEntries).length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <ListOrdered size={56} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">Nessuna lista d'attesa attiva</h3>
          <p className="text-slate-500 text-sm">
            {filterDate ? 'Nessuna lista d\'attesa per la data selezionata.' : 'Non ci sono utenti in lista d\'attesa al momento.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedEntries).map(([key, group]: [string, { slot: WaitlistEntry['schedule_slots']; date: string; entries: WaitlistEntry[] }]) => (
            <div key={key} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Slot Header */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#4A90E2]/10 rounded-xl flex items-center justify-center">
                    <Calendar size={20} className="text-[#4A90E2]" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">{group.slot?.class_type || 'Trattamento Osteopatico'}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="capitalize">{formatDate(group.date)}</span>
                      {group.slot?.start_time && (
                        <>
                          <span>•</span>
                          <span>{formatTime(group.slot.start_time)}</span>
                        </>
                      )}
                      {group.slot?.instructor?.name && (
                        <>
                          <span>•</span>
                          <span>{group.slot.instructor.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest">
                    {group.entries.length} in coda
                  </span>
                </div>
              </div>

              {/* Waitlist Entries */}
              <div className="divide-y divide-slate-100">
                {group.entries.sort((a, b) => a.position - b.position).map((entry) => {
                  const isNotified = entry.status === 'notified';
                  const expired = isExpired(entry.expires_at);
                  const timeRemaining = getTimeRemaining(entry.expires_at);

                  return (
                    <div
                      key={entry.id}
                      className={`p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        expired ? 'bg-red-50/50' : isNotified ? 'bg-green-50/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Position */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                          isNotified && !expired
                            ? 'bg-green-100 text-green-700'
                            : expired
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          #{entry.position}
                        </div>

                        {/* User Info */}
                        <div>
                          <p className="font-bold text-slate-900">{entry.profiles?.full_name || 'Utente'}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            {entry.profiles?.email && (
                              <span className="flex items-center gap-1">
                                <Mail size={12} />
                                {entry.profiles.email}
                              </span>
                            )}
                            {entry.profiles?.phone && (
                              <span className="flex items-center gap-1">
                                <Phone size={12} />
                                {entry.profiles.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-14 md:ml-0">
                        {/* Status Badge */}
                        {isNotified && !expired ? (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                            <UserCheck size={14} />
                            Notificato ({timeRemaining})
                          </span>
                        ) : expired ? (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                            <XCircle size={14} />
                            Scaduto
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                            <Clock size={14} />
                            In attesa
                          </span>
                        )}

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveFromWaitlist(entry.id)}
                          disabled={removingId === entry.id}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Rimuovi dalla lista"
                        >
                          {removingId === entry.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
          <p className="text-2xl font-black text-slate-900">{waitlistEntries.filter(e => e.status === 'waiting').length}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">In Attesa</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
          <p className="text-2xl font-black text-green-600">{waitlistEntries.filter(e => e.status === 'notified' && !isExpired(e.expires_at)).length}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Notificati</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
          <p className="text-2xl font-black text-red-500">{waitlistEntries.filter(e => isExpired(e.expires_at)).length}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Scaduti</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
          <p className="text-2xl font-black text-[#4A90E2]">{Object.keys(groupedEntries).length}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Sedute con Lista</p>
        </div>
      </div>
    </div>
  );
};

const AdminSettings: React.FC = () => {
  const [instructors, setInstructors] = useState<DBInstructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    try {
      setLoading(true);
      const data = await getInstructors();
      setInstructors(data);
    } catch (err) {
      console.error('Error loading instructors:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-8">
        <h3 className="text-xl font-black italic uppercase flex items-center gap-3">
          <Shield size={24} className="text-[#4A90E2]" /> Configurazione Studio
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nome Studio</label>
            <input type="text" defaultValue="Studio Osteopatia Giulia Patti" className="w-full h-14 px-5 rounded-2xl border border-slate-200 outline-none focus:border-[#4A90E2]" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Email</label>
            <input type="text" defaultValue="info@giuliapatti.it" className="w-full h-14 px-5 rounded-2xl border border-slate-200 outline-none focus:border-[#4A90E2]" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Valuta</label>
            <select className="w-full h-14 px-5 rounded-2xl border border-slate-200 outline-none">
              <option>Euro (€)</option>
              <option>Dollar ($)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timezone</label>
            <select className="w-full h-14 px-5 rounded-2xl border border-slate-200 outline-none">
              <option>Rome (GMT+1)</option>
              <option>London (GMT)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black italic uppercase">Osteopati</h3>
          <button
            onClick={loadInstructors}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-[#4A90E2] disabled:opacity-50"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#4A90E2] animate-spin" />
          </div>
        ) : instructors.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-sm">Nessun istruttore trovato</p>
          </div>
        ) : (
          <div className="space-y-4">
            {instructors.map(instructor => (
              <div key={instructor.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  {instructor.image_url ? (
                    <img src={instructor.image_url} alt={instructor.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-[#4A90E2] text-white rounded-full flex items-center justify-center font-black">
                      {getInitials(instructor.name)}
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-slate-900 block">{instructor.name}</span>
                    {instructor.email && (
                      <span className="text-xs text-slate-400">{instructor.email}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-full ${instructor.is_active ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    {instructor.is_active ? 'ATTIVO' : 'INATTIVO'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
        <h3 className="text-xl font-black italic uppercase mb-6">Statistiche Database</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-2xl">
            <p className="text-2xl font-black text-[#4A90E2]">{instructors.length}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Osteopati</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-2xl">
            <p className="text-2xl font-black text-green-600">{instructors.filter(i => i.is_active).length}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Attivi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddAppointmentWizard: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState<ClientWithStats[]>([]);
  const [instructorsList, setInstructorsList] = useState<DBInstructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    service: 'Trattamento Osteopatico',
    instructorId: '',
    instructorName: '',
    date: '',
    time: '',
    price: '60.00',
    paid: false,
    sendEmail: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clientsData, instructorsData] = await Promise.all([
        getAllClients(),
        getInstructors()
      ]);
      setClients(clientsData as ClientWithStats[]);
      setInstructorsList(instructorsData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      client.full_name?.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.phone?.includes(query)
    );
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const formatDateDisplay = (dateStr: string): string => {
    if (!dateStr) return 'Non selezionata';
    const date = new Date(dateStr);
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  const getInitials = (name: string | null): string => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20 animate-in fade-in zoom-in duration-300">
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-900"><X size={24} /></button>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`w-3 h-3 rounded-full transition-all ${step === s ? 'bg-[#4A90E2] w-8' : 'bg-slate-200'}`}></div>
          ))}
        </div>
        <div className="w-8"></div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm min-h-[500px] flex flex-col">
        {step === 1 && (
          <div className="space-y-8 flex-1">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-slate-900 italic uppercase">Seleziona Cliente</h3>
              <p className="text-slate-500 text-sm mt-1">Cerca un cliente esistente.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cerca cliente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm"
              />
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-[#4A90E2] animate-spin" />
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Users size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nessun cliente trovato</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {filteredClients.slice(0, 10).map(client => (
                  <label
                    key={client.id}
                    className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-colors ${
                      formData.clientId === client.id ? 'border-[#4A90E2] bg-blue-50' : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="client"
                        checked={formData.clientId === client.id}
                        onChange={() => setFormData({...formData, clientId: client.id, clientName: client.full_name || 'Cliente'})}
                        className="w-5 h-5 text-[#4A90E2]"
                      />
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-sm">
                        {getInitials(client.full_name)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{client.full_name || 'Nome non disponibile'}</span>
                        <span className="text-xs text-slate-400">{client.email}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 flex-1">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-slate-900 italic uppercase">Dettagli Trattamento</h3>
              <p className="text-slate-500 text-sm mt-1">Scegli il tipo di trattamento e l'osteopata.</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo Trattamento</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                  className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none"
                >
                  <option value="Trattamento Osteopatico">Trattamento Osteopatico</option>
                  <option value="Prima Visita">Prima Visita Osteopatica</option>
                  <option value="Controllo">Visita di Controllo</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Osteopata</label>
                <select
                  value={formData.instructorId}
                  onChange={(e) => {
                    const instructor = instructorsList.find(i => i.id === e.target.value);
                    setFormData({
                      ...formData,
                      instructorId: e.target.value,
                      instructorName: instructor?.name || ''
                    });
                  }}
                  className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none"
                >
                  <option value="">Seleziona istruttore</option>
                  {instructorsList.filter(i => i.is_active).map(instructor => (
                    <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prezzo (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Durata</label>
                  <select className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none">
                    <option>50 min</option>
                    <option>1 Ora</option>
                    <option>1.5 Ore</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 flex-1">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-slate-900 italic uppercase">Data e Ora</h3>
              <p className="text-slate-500 text-sm mt-1">Seleziona il momento della visita.</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ora Inizio</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none"
                />
              </div>
              {formData.instructorName && (
                <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-bold text-green-700">Osteopata selezionato: {formData.instructorName}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 flex-1">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-slate-900 italic uppercase">Riepilogo e Conferma</h3>
              <p className="text-slate-500 text-sm mt-1">Verifica i dati prima del salvataggio.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Paziente</p>
                  <p className="font-bold text-slate-900">{formData.clientName || 'Non selezionato'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trattamento</p>
                  <p className="font-bold text-slate-900">{formData.service}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Osteopata</p>
                  <p className="font-bold text-slate-900">{formData.instructorName || 'Non selezionato'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data e Ora</p>
                  <p className="font-bold text-slate-900">{formatDateDisplay(formData.date)}, {formData.time || '--:--'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prezzo</p>
                  <p className="font-black text-[#4A90E2]">€{parseFloat(formData.price).toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.paid}
                  onChange={(e) => setFormData({...formData, paid: e.target.checked})}
                  className="w-5 h-5 text-[#4A90E2]"
                />
                <span className="text-sm font-bold text-slate-700">Contrassegna come già pagato</span>
              </label>
              <label className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sendEmail}
                  onChange={(e) => setFormData({...formData, sendEmail: e.target.checked})}
                  className="w-5 h-5 text-[#4A90E2]"
                />
                <span className="text-sm font-bold text-slate-700">Invia mail di conferma al cliente</span>
              </label>
            </div>
          </div>
        )}

        <div className="pt-10 flex gap-4">
          {step > 1 && (
            <button onClick={prevStep} className="h-14 px-8 border border-slate-200 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-50">Indietro</button>
          )}
          <button
            onClick={step === 4 ? onCancel : nextStep}
            disabled={
              (step === 1 && !formData.clientId) ||
              (step === 2 && !formData.instructorId) ||
              (step === 3 && (!formData.date || !formData.time))
            }
            className="flex-1 h-14 bg-[#4A90E2] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-[#4A90E2]/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 4 ? 'Salva Appuntamento' : 'Continua'}
          </button>
        </div>
      </div>
    </div>
  );
};
