
import React from 'react';

export const AboutMario: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 md:px-12 bg-black text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#496da1]/10 skew-x-12 transform translate-x-20"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative z-10">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-[#496da1]">La Mente dietro lo Studio</h2>
          <h3 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter">
            Mario <span className="important-word highlight-wave">Catania</span>
          </h3>
          <div className="space-y-6 text-lg text-white/70 leading-relaxed max-w-xl">
            <p>
              Formatosi nelle migliori accademie internazionali, Mario porta a Catania un approccio al Pilates che fonde <span className="text-white font-bold">scienza del movimento</span> e <span className="text-white font-bold">benessere olistico</span>.
            </p>
            <p>
              Con oltre 15 anni di esperienza nel settore del fitness d'elite, ha fondato Wave Studio con l'obiettivo di creare un ambiente dove l'eccellenza tecnica incontra il comfort di casa.
            </p>
            <p className="important-word highlight-wave text-3xl md:text-4xl mt-6 leading-tight">
              "Il mio obiettivo non è solo farti sudare, ma farti scoprire quanto il tuo corpo sia capace di prodezze quando guidato con cura."
            </p>
          </div>
          
          <div className="mt-12 flex gap-8">
            <div className="border-l-2 border-[#496da1] pl-4">
              <p className="text-sm uppercase font-bold opacity-50 mb-1">Certificazioni</p>
              <p className="font-bold">Master Trainer Reformer</p>
            </div>
            <div className="border-l-2 border-[#496da1] pl-4">
              <p className="text-sm uppercase font-bold opacity-50 mb-1">Formazione</p>
              <p className="font-bold">Osteopatia & Posturologia</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl relative z-10">
            <img 
              src="https://images.unsplash.com/photo-1548690312-e3b507d17a12?auto=format&fit=crop&q=80&w=800" 
              alt="Mario Catania" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Floating design elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#496da1] rounded-2xl z-20 flex items-center justify-center p-4 shadow-xl">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
              <path d="M50,10 L50,90 M10,50 L90,50" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
