
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ValueProposition } from './components/ValueProposition';
import { AboutGiulia } from './components/AboutGiulia';
import { Services } from './components/Services';
import { Instructors } from './components/Instructors';
import { Testimonials } from './components/Testimonials';
import { Location } from './components/Location';
import { Footer } from './components/Footer';
import { BackgroundEffects } from './components/BackgroundEffects';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { Auth } from './components/Auth';
import { UserDashboard } from './components/UserDashboard';
import { CoursesPage } from './components/CoursesPage';
import { auth } from './lib/supabase';

type ViewState = 'public' | 'login' | 'signup' | 'user-dashboard' | 'admin-dashboard' | 'admin-login' | 'courses';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState<ViewState>('public');
  const [user, setUser] = useState<{ name: string; email: string; id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Check for existing Supabase session
    const checkSession = async () => {
      try {
        const session = await auth.getSession();

        if (session?.user) {
          // Check if user is admin from database
          const isAdmin = await auth.isAdmin();

          if (isAdmin) {
            setView('admin-dashboard');
          } else {
            const fullName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Utente';
            setUser({
              id: session.user.id,
              name: fullName,
              email: session.user.email || ''
            });
            setView('user-dashboard');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen to auth state changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const fullName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Utente';
        setUser({
          id: session.user.id,
          name: fullName,
          email: session.user.email || ''
        });
        setView('user-dashboard');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setView('public');
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setView('admin-dashboard');
    }
  };

  const handleUserLogin = async (email: string, name: string) => {
    try {
      // Get current user from Supabase to get the ID
      const currentUser = await auth.getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.id,
          name,
          email
        });
        setView('user-dashboard');
      }
    } catch (error) {
      console.error('Error getting user:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Sign out from Supabase (works for both admin and regular users)
      await auth.signOut();
      setUser(null);
      setView('public');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error logging out:', error);
      // Still clear local state even if Supabase logout fails
      setUser(null);
      setView('public');
    }
  };

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="w-12 h-12 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (view === 'admin-dashboard') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (view === 'user-dashboard' && user) {
    return <UserDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="relative min-h-screen gradient-bg">
      <BackgroundEffects />
      <Header 
        scrolled={scrolled} 
        onAdminClick={() => setView('admin-login')} 
        onLoginClick={() => setView('login')}
        onSignupClick={() => setView('signup')}
        onCoursesClick={() => setView('courses')}
        onHomeClick={() => setView('public')}
      />
      
      <main className="relative z-10">
        {view === 'public' && (
          <>
            <Hero
              onCoursesClick={() => setView('courses')}
              onBookClick={() => setView('signup')}
            />
            <ValueProposition />
            <Services onCoursesClick={() => setView('courses')} />
            <AboutGiulia />
            <Instructors onBookClick={() => setView('signup')} />
            <Testimonials />
            <Location />
          </>
        )}
        {view === 'courses' && <CoursesPage onBookClick={() => setView('signup')} />}
      </main>

      <Footer onCoursesClick={() => setView('courses')} onBookClick={() => setView('signup')} />

      {/* Auth Modals/Views */}
      {(view === 'login' || view === 'signup') && (
        <div className="fixed inset-0 z-[100] animate-in fade-in duration-300">
          <Auth 
            type={view} 
            onSwitch={() => setView(view === 'login' ? 'signup' : 'login')} 
            onBack={() => setView('public')}
            onSuccess={handleUserLogin}
          />
        </div>
      )}

      {view === 'admin-login' && (
        <AdminLogin
          onLogin={handleAdminLogin}
          onClose={() => setView('public')}
        />
      )}
    </div>
  );
};

export default App;
