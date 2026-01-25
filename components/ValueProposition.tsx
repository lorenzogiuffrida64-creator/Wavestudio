
import React from 'react';

export const ValueProposition: React.FC = () => {
  return (
    <section className="pt-32 pb-24 md:pt-52 md:pb-32 px-6 md:px-12 bg-white/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-50">Perch&eacute; scegliermi</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold leading-tight mb-8">
              Un approccio <span className="important-word highlight-wave">Clinico</span> al Benessere
            </h3>
            <p className="text-lg text-black/60 mb-8 leading-relaxed">
              Nel mio studio, ogni trattamento nasce dalla comprensione profonda del tuo corpo. La mia formazione in osteopatia mi permette di offrirti un percorso terapeutico basato sulla <span className="important-word">scienza</span> e sulla cura personalizzata.
            </p>
            <div className="space-y-6">
              {[
                { title: 'Approccio Olistico', desc: 'Valuto il corpo nella sua totalit&agrave;, non solo il sintomo.' },
                { title: 'Cura Personalizzata', desc: 'Ogni trattamento &egrave; calibrato sulle tue esigenze specifiche.' },
                { title: 'Competenza Clinica', desc: 'Formazione universitaria e aggiornamento continuo.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-bold transition-colors group-hover:bg-[#496da1]">0{i+1}</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-sm text-black/50">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <img src="https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&q=80&w=600" alt="Trattamento Osteopatico" className="rounded-3xl shadow-lg w-full h-64 object-cover transition-all duration-500" />
              <div className="bg-[#496da1] text-white p-8 rounded-3xl clickable-reward">
                <p className="text-3xl font-bold mb-2">98%</p>
                <p className="text-xs uppercase font-bold opacity-80">Soddisfazione Pazienti</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-black text-white p-8 rounded-3xl clickable-reward">
                <p className="text-sm italic opacity-80">"Giulia ha cambiato il modo in cui percepisco il mio corpo. Non &egrave; solo trattamento, &egrave; cura vera."</p>
              </div>
              <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600" alt="Studio Osteopatia" className="rounded-3xl shadow-lg w-full h-80 object-cover transition-all duration-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
