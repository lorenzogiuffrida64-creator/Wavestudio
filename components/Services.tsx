
import React from 'react';
import { Plus } from 'lucide-react';

interface ServicesProps {
  onCoursesClick?: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onCoursesClick }) => {
  const services = [
    { id: '01', name: 'Reformer Pilates', desc: 'Costruisci forza e migliora la postura con l\'attrezzo iconico.', image: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&q=80&w=400', active: true },
    { id: '02', name: 'Mat Pilates', desc: 'Migliora flessibilità e allineamento sul tappetino.', image: 'https://images.unsplash.com/photo-1518611012118-29a8d63ee0c2?auto=format&fit=crop&q=80&w=400' },
    { id: '03', name: 'Sessioni Private', desc: 'Lezioni individuali su misura per i tuoi obiettivi personali.', image: 'https://images.unsplash.com/photo-1522845015757-50bce044e5da?auto=format&fit=crop&q=80&w=400', active: true },
    { id: '04', name: 'Esercizi Guidati', desc: 'Esercizi per lui e per lei.', image: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&q=80&w=400'},
  ];

  return (
    <section id="services" className="py-24 px-6 md:px-12 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-50">Cosa Offriamo</h2>
            <h3 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase">Trova il tuo <span className="important-word highlight-wave">Flow</span></h3>
          </div>
          <button
            onClick={onCoursesClick}
            className="text-sm font-bold border-b-2 border-white pb-2 hover:text-[#496da1] hover:border-[#496da1] transition-all"
          >
            Tutte le Classi →
          </button>
        </div>

        <div className="border-t border-white/20">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="group relative flex items-center justify-between py-12 border-b border-white/10 cursor-pointer hover:bg-white/5 px-4 transition-all"
            >
              <div className="flex items-center gap-12 md:gap-24 relative z-10">
                <span className="text-xl font-bold opacity-30">{service.id}</span>
                <h4 className={`text-3xl md:text-5xl font-bold transition-all ${service.active ? 'text-[#496da1]' : 'group-hover:translate-x-4'}`}>
                  {service.name}
                </h4>
              </div>
              
              <div className="flex items-center gap-8 relative z-10">
                <p className="hidden md:block text-sm opacity-50 max-w-[200px] text-right">
                  {service.desc}
                </p>
                <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <Plus />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
