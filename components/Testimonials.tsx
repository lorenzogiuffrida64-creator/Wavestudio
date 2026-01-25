
import React from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Mariana Cesareo', company: 'Paziente', quote: 'Giulia ha un approccio professionale e attento. Dopo anni di mal di schiena, finalmente ho trovato sollievo grazie ai suoi trattamenti osteopatici. La consiglio a chiunque cerchi una cura vera.', rating: 5.0},
  { name: 'Antonella Cataliotti', company: 'Paziente', quote: 'Esperienza eccellente. Giulia è preparata e sempre disponibile a spiegare ogni passaggio del trattamento. Mi ha aiutato a risolvere problemi posturali che avevo da tempo.', rating: 5.0 },
  { name: 'Concetta Vasta', company: 'Paziente', quote: 'Studio accogliente e professionale. Giulia ha mani esperte e un approccio olistico che fa la differenza. Dopo poche sedute ho notato miglioramenti significativi.', rating: 4.9 },
  { name: 'Emanuele Bonaccorso', company: 'Paziente', quote: 'Avevo dolori cervicali persistenti. Giulia ha individuato subito il problema e con pochi trattamenti mi ha rimesso in sesto. Consigliatissimo!', rating: 5.0 },
  { name: 'Claudia Lanzafame', company: 'Paziente', quote: 'Finalmente un\'osteopata che ascolta e capisce le tue esigenze. Giulia è gentile, competente e i risultati parlano da soli.', rating: 5.0 },
  { name: 'Elisa Catania', company: 'Paziente', quote: 'Trattamenti di alto livello in un ambiente sereno e professionale. Giulia spiega tutto con chiarezza e ti fa sentire in buone mani.', rating: 5.0 },
];

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 px-6 md:px-12 bg-[#0d0d0d] text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-16 tracking-tighter">Cosa dicono di <span className="important-word highlight-wave">Me</span></h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-[#496da1]/50 transition-all group clickable-reward">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[#496da1] font-bold text-lg">{t.company}</span>
                <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
                  <span className="text-xs font-bold">{t.rating}</span>
                  <Star size={12} className="fill-[#496da1] text-[#496da1]" />
                </div>
              </div>

              <p className="text-xl italic mb-10 leading-relaxed text-white/80 group-hover:text-white transition-colors">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
