
import React, { useEffect } from 'react';
import { Clock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Testimonials } from './Testimonials';
import { Location } from './Location';

interface CoursesPageProps {
  onBookClick: () => void;
}

const SERVICES_DATA = [
  {
    id: 'trattamento',
    title: 'Trattamento Osteopatico',
    desc: 'Trattamento completo che utilizza tecniche manuali per ripristinare l\'equilibrio del corpo. Ideale per dolori muscolo-scheletrici, cefalee e disturbi posturali.',
    type: 'Trattamento',
    duration: '45-60 minuti',
    frequency: 'Secondo necessit&agrave;',
    image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&q=80&w=800',
    benefits: ['Riduzione del dolore', 'Miglioramento della mobilit&agrave;', 'Riequilibrio posturale']
  },
  {
    id: 'valutazione',
    title: 'Prima Visita e Valutazione',
    desc: 'Valutazione completa della tua condizione fisica, postura e anamnesi. Include test funzionali e definizione del piano terapeutico personalizzato.',
    type: 'Valutazione',
    duration: '60-75 minuti',
    frequency: 'Prima seduta',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
    benefits: ['Diagnosi approfondita', 'Piano personalizzato', 'Obiettivi chiari']
  },
  {
    id: 'mantenimento',
    title: 'Seduta di Mantenimento',
    desc: 'Sedute periodiche per mantenere i risultati ottenuti e prevenire recidive. Trattamenti mirati per conservare il benessere raggiunto.',
    type: 'Mantenimento',
    duration: '30-45 minuti',
    frequency: 'Mensile',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
    benefits: ['Prevenzione recidive', 'Benessere continuo', 'Monitoraggio costante']
  },
  {
    id: 'posturale',
    title: 'Consulenza Posturale',
    desc: 'Analisi dettagliata della postura con consigli pratici per la vita quotidiana e il lavoro. Include esercizi specifici da fare a casa.',
    type: 'Consulenza',
    duration: '45 minuti',
    frequency: 'Su richiesta',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
    benefits: ['Correzione posturale', 'Esercizi personalizzati', 'Prevenzione dolori']
  }
];

export const CoursesPage: React.FC<CoursesPageProps> = ({ onBookClick }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-in fade-in duration-700">
      {/* HERO SECTION */}
      <section className="relative min-h-[70vh] flex flex-col justify-center px-6 md:px-12 pt-32 pb-24">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-px bg-black/20"></span>
              <span className="text-xs font-black uppercase tracking-[0.3em] opacity-40">I Miei Trattamenti</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.9] mb-8 tracking-tighter">
              I Miei <span className="important-word highlight-wave">Servizi.</span>
            </h1>
            <p className="text-xl md:text-2xl text-black/60 max-w-lg mb-10 leading-relaxed font-medium">
              Scopri i trattamenti <span className="important-word highlight-wave">osteopatici</span> che offro. Ogni percorso &egrave; studiato per rispondere alle tue esigenze specifiche.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onBookClick}
                className="bg-black text-white px-10 py-5 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-[#496da1] transition-all group shadow-2xl hover:shadow-[#496da1]/30 active:scale-95 clickable-reward"
              >
                Prenota Visita
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-tl-[6rem] rounded-br-[6rem] rounded-tr-[2rem] rounded-bl-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] aspect-[4/3] group transition-all duration-700 hover:translate-y-[-8px]">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
                alt="Studio Osteopatia Servizi"
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#496da1]/10 rounded-full blur-[80px] -z-10 animate-pulse"></div>
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/50 rounded-full blur-[100px] -z-10 animate-pulse delay-1000"></div>
            <div className="absolute -inset-4 border border-[#496da1]/10 rounded-tl-[7rem] rounded-br-[7rem] rounded-tr-[3rem] rounded-bl-[3rem] -z-10 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* INTRO SECTION */}
      <section className="py-24 px-6 md:px-12 bg-white/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-50">Il Mio Approccio</h2>
          <p className="text-xl md:text-2xl text-black/60 leading-relaxed font-medium">
            Ogni trattamento &egrave; personalizzato sulle tue esigenze. Utilizzo tecniche osteopatiche basate su solide evidenze scientifiche per aiutarti a raggiungere il <span className="important-word highlight-wave">benessere</span> che meriti.
          </p>
        </div>
      </section>

      {/* SERVICES SHOWCASE - Black section */}
      <section id="services-list" className="py-24 px-6 md:px-12 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-50">Trattamenti Disponibili</h2>
              <h3 className="text-5xl md:text-7xl font-extrabold tracking-tighter">I Miei <span className="important-word highlight-wave">Servizi</span></h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES_DATA.map((service) => (
              <div
                key={service.id}
                className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-[#496da1]/50 transition-all clickable-reward"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[#496da1] text-xs font-black uppercase tracking-[0.2em]">{service.type}</span>
                  </div>
                  <h4 className="text-3xl font-extrabold mb-4 tracking-tight group-hover:text-[#496da1] transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-white/60 mb-6 leading-relaxed">
                    {service.desc}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-white/50">
                      <Clock size={16} className="text-[#496da1]" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
                      <User size={16} className="text-[#496da1]" />
                      <span>{service.frequency}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-8">
                    {service.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle2 size={14} className="text-[#496da1]" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={onBookClick}
                    className="w-full h-14 bg-white/10 border border-white/20 rounded-xl font-bold uppercase tracking-wider hover:bg-[#496da1] hover:border-[#496da1] transition-all active:scale-95"
                  >
                    Prenota Seduta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* LOCATION MAP */}
      <Location />
    </div>
  );
};
