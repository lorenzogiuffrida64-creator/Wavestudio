
import React from 'react';
import { Plus } from 'lucide-react';

interface ServicesProps {
  onCoursesClick?: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onCoursesClick }) => {
  const services = [
    { id: '01', name: 'Trattamento Osteopatico', desc: 'Manipolazioni gentle per ripristinare l\'equilibrio del corpo.', image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&q=80&w=400', active: true },
    { id: '02', name: 'Valutazione Posturale', desc: 'Analisi completa della postura e piano terapeutico personalizzato.', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400' },
    { id: '03', name: 'Terapia Manuale', desc: 'Tecniche manuali per alleviare dolori e tensioni muscolari.', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400', active: true },
    { id: '04', name: 'Sedute di Follow-up', desc: 'Monitoraggio e mantenimento dei risultati raggiunti.', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400'},
  ];

  return (
    <section id="services" className="py-24 px-6 md:px-12 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-50">Cosa Offro</h2>
            <h3 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase">I Miei <span className="important-word highlight-wave">Servizi</span></h3>
          </div>
          <button
            onClick={onCoursesClick}
            className="text-sm font-bold border-b-2 border-white pb-2 hover:text-[#496da1] hover:border-[#496da1] transition-all"
          >
            Tutti i Servizi →
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
