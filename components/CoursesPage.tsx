
import React, { useEffect } from 'react';
import { Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Testimonials } from './Testimonials';
import { Location } from './Location';

interface CoursesPageProps {
  onBookClick: () => void;
}

const COURSES_DATA = [
  {
    id: 'matwork',
    title: 'Pilates Matwork',
    desc: 'Il corso base perfetto per chi inizia. Esercizi sul tappetino per rafforzare il core, migliorare la flessibilità e perfezionare la postura attraverso il metodo originale.',
    level: 'Principiante',
    duration: '50 minuti',
    frequency: '2-3x/settimana',
    image: 'https://images.unsplash.com/photo-1518611012118-29a8d63ee0c2?auto=format&fit=crop&q=80&w=800',
    benefits: ['Migliora la postura', 'Rafforza il core', 'Aumenta la flessibilità']
  },
  {
    id: 'reformer',
    title: 'Pilates Reformer',
    desc: 'Allenamento completo ed efficace utilizzando l\'attrezzo Reformer. La resistenza delle molle permette di tonificare i muscoli lunghi e profondi con precisione millimetrica.',
    level: 'Intermedio',
    duration: '55 minuti',
    frequency: '2-4x/settimana',
    image: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&q=80&w=800',
    benefits: ['Tonificazione completa', 'Resistenza progressiva', 'Precisione del movimento']
  },
  {
    id: 'advanced',
    title: 'Pilates Advanced',
    desc: 'Per chi ha già una solida base tecnica. Sequenze complesse che sfidano la forza, l\'equilibrio e il controllo totale del corpo in dinamismo.',
    level: 'Avanzato',
    duration: '60 minuti',
    frequency: '2-3x/settimana',
    image: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&q=80&w=800',
    benefits: ['Sfida il tuo limite', 'Controllo avanzato', 'Performance atletica']
  },
  {
    id: 'personal',
    title: 'Personal Training',
    desc: 'Sessioni individuali 1:1 progettate esclusivamente sui tuoi obiettivi. Ideale per riabilitazione, atleti o chi cerca la massima attenzione al dettaglio.',
    level: 'Tutti i livelli',
    duration: '60 minuti',
    frequency: 'Su appuntamento',
    image: 'https://images.unsplash.com/photo-1522845015757-50bce044e5da?auto=format&fit=crop&q=80&w=800',
    benefits: ['Attenzione dedicata', 'Programma su misura', 'Risultati accelerati']
  }
];

export const CoursesPage: React.FC<CoursesPageProps> = ({ onBookClick }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-in fade-in duration-700">
      {/* HERO SECTION - Matching main page style */}
      <section className="relative min-h-[70vh] flex flex-col justify-center px-6 md:px-12 pt-32 pb-24">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-px bg-black/20"></span>
              <span className="text-xs font-black uppercase tracking-[0.3em] opacity-40">I Nostri Programmi</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.9] mb-8 tracking-tighter">
              I Nostri <span className="important-word highlight-wave">Corsi.</span>
            </h1>
            <p className="text-xl md:text-2xl text-black/60 max-w-lg mb-10 leading-relaxed font-medium">
              Scopri i programmi di <span className="important-word highlight-wave">Pilates</span> perfetti per te. Dal principiante all'avanzato, ogni percorso è studiato per trasformare il tuo corpo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onBookClick}
                className="bg-black text-white px-10 py-5 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-[#496da1] transition-all group shadow-2xl hover:shadow-[#496da1]/30 active:scale-95 clickable-reward"
              >
                Prenota Ora
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-tl-[6rem] rounded-br-[6rem] rounded-tr-[2rem] rounded-bl-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] aspect-[4/3] group transition-all duration-700 hover:translate-y-[-8px]">
              <img
                src="https://i.im.ge/2026/01/16/Gwdv9Y.Generated-Image-January-15-2026-10-26PM.jpeg"
                alt="Wave Studio Corsi"
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
          <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-50">Il Metodo Wave</h2>
          <p className="text-xl md:text-2xl text-black/60 leading-relaxed font-medium">
            Wave Studio offre una varietà di corsi di Pilates progettati per ogni livello. I nostri istruttori certificati ti guideranno in un percorso di <span className="important-word highlight-wave">benessere</span> che unisce tecnica, controllo e risultati duraturi.
          </p>
        </div>
      </section>

      {/* COURSES SHOWCASE - Black section like Services */}
      <section id="courses-list" className="py-24 px-6 md:px-12 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-50">Programmi Disponibili</h2>
              <h3 className="text-5xl md:text-7xl font-extrabold tracking-tighter">I Nostri <span className="important-word highlight-wave">Corsi</span></h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {COURSES_DATA.map((course, index) => (
              <div
                key={course.id}
                className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-[#496da1]/50 transition-all clickable-reward"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[#496da1] text-xs font-black uppercase tracking-[0.2em]">{course.level}</span>
                  </div>
                  <h4 className="text-3xl font-extrabold mb-4 tracking-tight group-hover:text-[#496da1] transition-colors">
                    {course.title}
                  </h4>
                  <p className="text-white/60 mb-6 leading-relaxed">
                    {course.desc}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-white/50">
                      <Clock size={16} className="text-[#496da1]" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
                      <Users size={16} className="text-[#496da1]" />
                      <span>{course.frequency}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-8">
                    {course.benefits.map((benefit, i) => (
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
                    Prenota Lezione
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Using the same component as main page */}
      <Testimonials />

      {/* LOCATION MAP */}
      <Location />
    </div>
  );
};
