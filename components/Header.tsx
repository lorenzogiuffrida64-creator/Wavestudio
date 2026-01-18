
import React, { useState, useEffect } from 'react';
import { Menu, User, Calendar, Shield, UserPlus, X, ChevronRight } from 'lucide-react';

interface HeaderProps {
  scrolled: boolean;
  onAdminClick?: () => void;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onCoursesClick?: () => void;
  onHomeClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  scrolled, 
  onAdminClick, 
  onLoginClick, 
  onSignupClick,
  onCoursesClick,
  onHomeClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { label: 'i nostri corsi', href: '#courses', action: onCoursesClick, isHomePage: false },
    { label: 'mario catania', href: '#about', action: onHomeClick, isHomePage: true },
    { label: 'recensioni', href: '#testimonials', action: onHomeClick, isHomePage: true },
    { label: 'dove siamo', href: '#location', action: onHomeClick, isHomePage: true },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.isHomePage) {
      // Go to home first, then scroll to section
      if (link.action) link.action();
      setTimeout(() => {
        const element = document.querySelector(link.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Just call the action (e.g., go to courses page)
      if (link.action) link.action();
    }
  };

  const handleMobileNavClick = (link: typeof navLinks[0]) => {
    setIsMenuOpen(false);
    handleNavClick(link);
  };

  const handleMobileActionClick = (callback?: () => void) => {
    setIsMenuOpen(false);
    if (callback) callback();
  };

  const handleLogoClick = () => {
    if (onHomeClick) onHomeClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 py-4 px-6 md:px-12 flex items-center justify-between ${
        scrolled || isMenuOpen 
          ? 'bg-[#e9e9e9]/80 backdrop-blur-xl shadow-sm py-3' 
          : 'xl:bg-transparent xl:backdrop-blur-none bg-[#e9e9e9]/40 backdrop-blur-lg border-b border-black/5 xl:border-none py-3 xl:py-4'
      }`}
    >
      <div className="flex items-center gap-4 cursor-pointer z-[70]" onClick={handleLogoClick}>
        <div className="w-10 h-10 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#496da1] fill-current">
            <path d="M10,50 Q25,20 40,50 T70,50 T100,50 L100,100 L0,100 Z opacity-20" />
            <path d="M0,50 Q15,20 30,50 T60,50 T90,50" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-xl font-black tracking-tighter uppercase">Wave Studio</span>
      </div>

      <nav className="hidden xl:flex items-center gap-8">
        {navLinks.map((link) => (
          <button
            key={link.label}
            onClick={() => handleNavClick(link)}
            className="text-sm font-black uppercase tracking-widest hover:text-[#496da1] transition-all relative group whitespace-nowrap"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#496da1] transition-all group-hover:w-full"></span>
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2 md:gap-4 z-[70]">
        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <button 
            onClick={onAdminClick}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#496da1] border border-[#496da1]/40 px-3 py-1.5 rounded-lg hover:bg-[#496da1] hover:text-white transition-all clickable-reward"
          >
            <Shield size={14} />
            <span>Area Soci</span>
          </button>

          <div className="flex items-center gap-4 ml-2">
            <button 
              onClick={onLoginClick}
              className="text-sm font-black uppercase tracking-widest hover:text-[#496da1] transition-colors flex items-center gap-1.5"
            >
              <User size={16} />
              <span>Accedi</span>
            </button>
            <button 
              onClick={onSignupClick}
              className="text-sm font-black uppercase tracking-widest hover:text-[#496da1] transition-colors flex items-center gap-1.5"
            >
              <UserPlus size={16} />
              <span>Registrati</span>
            </button>
          </div>
        </div>

        <button 
          onClick={onSignupClick}
          className="bg-black text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-xl ml-2 clickable-reward"
        >
          <Calendar size={18} />
          <span className="hidden xs:inline">Prenota Ora</span>
          <span className="xs:hidden">Prenota ora </span>
        </button>
        
        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-3 bg-white/10 backdrop-blur-md border border-black/5 rounded-full transition-all active:scale-90"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE PANEL (Beautiful Overlay) */}
      <div 
        className={`fixed inset-0 bg-[#e9e9e9]/40 backdrop-blur-[50px] z-[55] lg:hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="flex flex-col h-full pt-32 px-8 pb-12">
          {/* Decorative background logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none scale-150">
            <svg viewBox="0 0 100 100" className="w-96 h-96 text-black fill-current">
              <path d="M0,50 Q15,20 30,50 T60,50 T90,50" fill="none" stroke="currentColor" strokeWidth="8" />
            </svg>
          </div>

          {/* Main Navigation Links */}
          <nav className="flex-1 flex flex-col justify-start space-y-6">
            {navLinks.map((link, i) => (
              <button
                key={link.label}
                onClick={() => handleMobileNavClick(link)}
                className={`text-5xl md:text-7xl font-black lowercase tracking-tight italic flex items-center justify-between group transition-all duration-500 relative text-left ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Specific localized blur behind each text item for maximum visibility */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm -inset-x-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <span className="relative z-10 group-hover:text-[#496da1] group-hover:translate-x-2 transition-all duration-500 py-2">
                  {link.label}
                </span>
                <ChevronRight size={40} className="relative z-10 text-[#496da1] opacity-0 group-hover:opacity-100 -translate-x-8 group-hover:translate-x-0 transition-all duration-500" />
              </button>
            ))}
          </nav>

          {/* Bottom Auth Section */}
          <div className={`space-y-6 pt-10 border-t border-black/5 transition-all duration-700 delay-[400ms] ${
            isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleMobileActionClick(onLoginClick)}
                className="h-16 bg-white/40 backdrop-blur-md border border-black/5 rounded-2xl flex items-center justify-center gap-3 font-bold lowercase tracking-normal text-lg shadow-sm active:scale-95 transition-transform"
              >
                <User size={20} className="text-[#496da1]" />
                login
              </button>
              <button
                onClick={() => handleMobileActionClick(onSignupClick)}
                className="h-16 bg-white/40 backdrop-blur-md border border-black/5 rounded-2xl flex items-center justify-center gap-3 font-bold lowercase tracking-normal text-lg shadow-sm active:scale-95 transition-transform"
              >
                <UserPlus size={20} className="text-[#496da1]" />
                sign up
              </button>
            </div>

            <button
              onClick={() => handleMobileActionClick(onAdminClick)}
              className="w-full h-16 bg-black text-white rounded-2xl flex items-center justify-center gap-3 font-bold lowercase tracking-normal text-lg shadow-xl active:scale-[0.98] transition-all group overflow-hidden relative"
            >
              <span className="absolute inset-0 bg-[#496da1] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
              <Shield size={20} className="relative z-10 text-[#496da1] group-hover:text-white transition-colors" />
              <span className="relative z-10">area riservata soci</span>
            </button>
            
            <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-black/10 pt-4">
              Wave Studio • Catania
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
