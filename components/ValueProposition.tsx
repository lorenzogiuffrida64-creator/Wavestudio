
import React from 'react';

export const ValueProposition: React.FC = () => {
  return (
    <section className="pt-32 pb-24 md:pt-52 md:pb-32 px-6 md:px-12 bg-white/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-50">Cosa ci rende diversi</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold leading-tight mb-8">
              Trova la tua <span className="important-word highlight-wave">Forza</span> nell'Equilibrio
            </h3>
            <p className="text-lg text-black/60 mb-8 leading-relaxed">
              In Wave Studio, crediamo che il vero benessere derivi dall'armonia tra energia e calma, sforzo e facilità. La nostra missione è aiutarti a connetterti con il tuo corpo attraverso il movimento <span className="important-word">consapevole.</span>
            </p>
            <div className="space-y-6">
              {[
                { title: 'Armonia Totale', desc: 'Sincronizziamo respiro e movimento per una mente più chiara.' },
                { title: 'Forza Bilanciata', desc: 'Sviluppiamo muscoli lunghi e forti senza stress articolare.' },
                { title: 'Flusso Gioioso', desc: 'Ogni sessione è progettata per lasciarti rigenerato e vibrante.' }
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
              <img src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=600" alt="Pilates Detail" className="rounded-3xl shadow-lg w-full h-64 object-cover transition-all duration-500" />
              <div className="bg-[#496da1] text-white p-8 rounded-3xl clickable-reward">
                <p className="text-3xl font-bold mb-2">98%</p>
                <p className="text-xs uppercase font-bold opacity-80">Soddisfazione Clienti</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-black text-white p-8 rounded-3xl clickable-reward">
                <p className="text-sm italic opacity-80">"Wave Studio ha cambiato il modo in cui percepisco il mio corpo. Non è solo esercizio, è terapia."</p>
              </div>
              <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600" alt="Pilates Session" className="rounded-3xl shadow-lg w-full h-80 object-cover transition-all duration-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
