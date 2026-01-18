
import React from 'react';

export const Location: React.FC = () => {
  return (
    <section id="location" className="py-24 px-6 md:px-12 bg-[#e9e9e9]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-50">La nostra sede</h2>
          <h3 className="text-4xl md:text-6xl font-extrabold tracking-tighter uppercase">
            Ci trovi <span className="important-word highlight-wave">Qui</span>
          </h3>
        </div>

        <div className="relative group max-w-5xl mx-auto">
          {/* Map Container */}
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-black/5 bg-white p-3 md:p-4 h-[450px] md:h-[600px] relative z-10">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4078.9162895861386!2d15.113236676683668!3d37.52559867204917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1313fca29326a559%3A0x1783ba215ed2258f!2sVle%20Artale%20Alagona%2C%2039%2C%2095126%20Catania%20CT!5e1!3m2!1sit!2sit!4v1768219864279!5m2!1sit!2sit" 
              className="w-full h-full rounded-[2.5rem]"
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
          
          {/* Decorative background shapes for aesthetic appeal */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#496da1]/10 rounded-full blur-3xl -z-0"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#496da1]/10 rounded-full blur-3xl -z-0"></div>
        </div>
      </div>
    </section>
  );
};
