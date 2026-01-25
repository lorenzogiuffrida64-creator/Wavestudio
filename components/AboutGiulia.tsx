
import React from 'react';

export const AboutGiulia: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 md:px-12 bg-black text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#496da1]/10 skew-x-12 transform translate-x-20"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative z-10">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-[#496da1]">La Mente dietro lo Studio</h2>
          <h3 className="text-5xl md:text-7xl font-extrabold mb-2 tracking-tighter">
            Giulia <span className="important-word highlight-wave">Patti</span>
          </h3>
          <p className="text-lg md:text-xl text-[#496da1] font-semibold mb-8 tracking-wide">Bsc. Ost. Hons.</p>
          <div className="space-y-6 text-lg text-white/70 leading-relaxed max-w-xl">
            <p>
              Con una laurea in Osteopatia conseguita con Honours, Giulia porta a Wave Studio un approccio fondato sulla <span className="text-white font-bold">scienza clinica</span> e sulla <span className="text-white font-bold">ricerca accademica</span>. Ogni movimento è calibrato, ogni esercizio ha un fondamento anatomico preciso.
            </p>
            <p>
              La sua formazione sanitaria garantisce che ogni sessione sia progettata con la massima attenzione alla <span className="text-white font-bold">sicurezza</span> e al rispetto dei limiti del corpo. Qui non si improvvisa: si applica metodo.
            </p>
            <p className="important-word highlight-wave text-3xl md:text-4xl mt-6 leading-tight">
              "Il mio compito è guidarti con competenza e cura, perché il tuo corpo merita un approccio clinico, non approssimativo."
            </p>
          </div>

          <div className="mt-12 flex gap-8">
            <div className="border-l-2 border-[#496da1] pl-4">
              <p className="text-sm uppercase font-bold opacity-50 mb-1">Formazione</p>
              <p className="font-bold">Bsc. Ost. Hons.</p>
            </div>
            <div className="border-l-2 border-[#496da1] pl-4">
              <p className="text-sm uppercase font-bold opacity-50 mb-1">Specializzazione</p>
              <p className="font-bold">Pilates Clinico</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl relative z-10">
            <img
              src="https://images.unsplash.com/photo-1548690312-e3b507d17a12?auto=format&fit=crop&q=80&w=800"
              alt="Giulia Patti"
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
