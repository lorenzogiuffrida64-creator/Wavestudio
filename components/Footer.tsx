
import React from 'react';
import { ArrowUpRight, Instagram, Facebook, Mail } from 'lucide-react';

interface FooterProps {
  onCoursesClick?: () => void;
  onBookClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onCoursesClick, onBookClick }) => {
  return (
    <footer className="bg-[#e9e9e9] pt-24 pb-12 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Massive CTA Section */}
        <div className="bg-black text-white rounded-[3rem] p-12 md:p-24 relative overflow-hidden mb-24">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#496da1]/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-5xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-8 uppercase">
              Inizia il tuo <br /> <span className="important-word italic">Viaggio</span> oggi.
            </h2>
            <p className="text-lg md:text-xl opacity-60 mb-12 max-w-md">
              Il tuo corpo e la tua mente ti ringrazieranno. Prenota la tua prima sessione in Wave Studio.
            </p>
            <button
              onClick={onBookClick}
              className="bg-white text-black px-10 py-5 rounded-full font-bold text-xl flex items-center gap-4 hover:scale-105 transition-transform active:scale-95 shadow-2xl clickable-reward"
            >
              Prenota una Classe
              <ArrowUpRight />
            </button>
          </div>
          
          <div className="absolute bottom-12 right-12 hidden lg:block opacity-20">
            <svg viewBox="0 0 200 200" className="w-64 h-64 animate-spin-slow">
              <path id="circlePath" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" fill="transparent" />
              <text className="text-[14px] uppercase font-bold tracking-[0.2em] fill-white">
                <textPath href="#circlePath">Wave Studio • Pilates • Catania • Mario Catania • </textPath>
              </text>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-black/10 pb-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#496da1] fill-current">
                  <path d="M0,50 Q15,20 30,50 T60,50 T90,50" fill="none" stroke="currentColor" strokeWidth="8" />
                </svg>
              </div>
              <span className="text-2xl font-black uppercase tracking-tighter">Wave Studio</span>
            </div>
            <p className="text-black/50 max-w-sm mb-8">
              Il primo studio di Pilates Reformer a Catania dedicato alla trasformazione totale.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/wavestudio_ct?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"><Instagram size={18}/></a>
              <a href="https://www.facebook.com/profile.php?id=61566462159392&sk=about" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"><Facebook size={18}/></a>
              <a href="mailto:wavecatania@gmail.com" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"><Mail size={18}/></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-6 opacity-40">Navigazione</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="hover:text-[#496da1] transition-colors">Il Metodo</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); if(onCoursesClick) onCoursesClick(); }} className="hover:text-[#496da1] transition-colors">I Nostri Corsi</a></li>
              <li><a href="#testimonials" className="hover:text-[#496da1] transition-colors">Recensioni</a></li>
              <li><a href="#location" className="hover:text-[#496da1] transition-colors">Dove Siamo</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-6 opacity-40">Contatti & Orari</h4>
            <ul className="space-y-2 text-sm text-black/60">
              <li className="flex items-center gap-2">Tel: <a href="tel:3293597002" className="text-black font-bold hover:text-[#496da1]">3293597002</a></li>
              <li className="flex items-center gap-2">Email: <a href="mailto:wavecatania@gmail.com" className="text-black font-bold hover:text-[#496da1]">wavecatania@gmail.com</a></li>
              <li className="pt-4 text-black font-bold">Via Artale Alagona, 39, Catania, Italy</li>
              <li className="pt-4 border-t border-black/5 mt-4">Lun - Ven: 07:00 - 21:00</li>
              <li>Sabato: 09:00 - 14:00</li>
              <li>Domenica: Chiuso</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest opacity-40">
          <p>© 2024 Wave Studio Pilates Catania. All right reserved</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black">Privacy Policy</a>
            <a href="#" className="hover:text-black">Terms of Service</a>
            <a href="#" className="hover:text-black">Credits</a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </footer>
  );
};
