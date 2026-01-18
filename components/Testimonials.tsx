
import React from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Mariana Cesareo', company: 'Cliente', quote: 'Frequento Wave Studio da qualche tempo e lo consiglio a chiunque voglia prendersi cura del proprio corpo in un ambiente professionale e accogliente. Gli inseganti sono preparati, attenti e sempre disponibili a seguire ogni esigenza.', rating: 5.0},
  { name: 'Antonella Cataliotti', company: 'Cliente', quote: 'Esperienza eccellente. Annamaria è un insegnante attenta e preparata. Lo staff pronto a soddisfare le tue richieste. Ci rivediamo a Settembre!', rating: 5.0 },
  { name: 'Concetta Vasta', company: 'Cliente', quote: 'Bellissima sala, con reformer moderni e funzionali, personale pronto a venire incontro alle tue esigenze. Istruttrici eccellenti. Consigliatissimo!', rating: 4.9 },
  { name: 'Emanuele Bonaccorso', company: 'Cliente', quote: 'La mia esperienza è stata eccellente sotto qualsiasi punto di vista. consigliatissimo!', rating: 5.0 },
  { name: 'Claudia Lanzafame', company: 'Cliente', quote: 'Esperienza positivissima! Personale gentile e qualificato, lo consiglio.', rating: 5.0 },
  { name: 'Elisa Catania', company: 'Cliente', quote: 'Super consigliato, con lezioni di alto livello, e personale gentile e disponibile.', rating: 5.0 },
];

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 px-6 md:px-12 bg-[#0d0d0d] text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-16 tracking-tighter">Cosa dicono di <span className="important-word highlight-wave">Noi</span></h2>
        
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
