import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onCoursesClick?: () => void;
  onBookClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCoursesClick, onBookClick }) => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="order-2 md:order-1">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-8 h-px bg-black/20"></span>
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Studio Osteopatia Catania</span>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[0.85] mb-8 tracking-tighter">
            Giulia <span className="important-word highlight-wave">Patti.</span>
          </h1>
          <p className="text-xl md:text-2xl text-black/60 max-w-lg mb-10 leading-relaxed font-medium">
            Cura professionale per il tuo benessere. Un approccio <span className="important-word highlight-wave">clinico</span> e personalizzato all'osteopatia nel cuore di Catania.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onBookClick}
              className="bg-black text-white px-10 py-5 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-[#496da1] transition-all group shadow-2xl hover:shadow-[#496da1]/30 active:scale-95 clickable-reward"
            >
              Prenota Visita
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onCoursesClick}
              className="bg-white/50 backdrop-blur-sm border-2 border-black/5 px-10 py-5 rounded-full font-bold hover:bg-white transition-all active:scale-95 clickable-reward"
            >
              I Miei Servizi
            </button>
          </div>

          <div className="mt-16 flex items-center gap-10 opacity-40">
            <div className="text-left">
              <div className="text-3xl font-black tracking-tighter">500+</div>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em]">Pazienti Trattati</div>
            </div>
            <div className="text-left border-l border-black/10 pl-10">
              <div className="text-3xl font-black tracking-tighter">10+</div>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em]">Anni di Esperienza</div>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2 relative mb-12 md:mb-0">
          {/* Main Image Container */}
          <div className="relative rounded-tl-[8rem] rounded-br-[8rem] rounded-tr-[2rem] rounded-bl-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] aspect-[3/2] group transition-all duration-700 hover:translate-y-[-8px]">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
              alt="Studio Osteopatia Giulia Patti"
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
          </div>

          {/* Decorative shapes - Outside the clipped container */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#496da1]/10 rounded-full blur-[80px] -z-10 animate-pulse"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/50 rounded-full blur-[100px] -z-10 animate-pulse delay-1000"></div>

          {/* Decorative outline */}
          <div className="absolute -inset-4 border border-[#496da1]/10 rounded-tl-[9rem] rounded-br-[9rem] rounded-tr-[3rem] rounded-bl-[3rem] -z-10 pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};
