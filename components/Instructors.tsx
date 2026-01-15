
import React from 'react';

const TEAM = [
  { name: 'Fernanda', role: 'Istruttrice Pilates', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400', featured: true },
  { name: 'Annamaria', role: 'Istruttrice Pilates', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400' },
  { name: 'Ylenia', role: 'Istruttrice Pilates', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' },
  { name: 'Simone', role: 'Istruttore Pilates', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
];

interface InstructorsProps {
  onBookClick?: () => void;
}

export const Instructors: React.FC<InstructorsProps> = ({ onBookClick }) => {
  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-50">Team Eccellenza</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold tracking-tighter uppercase">Incontra i nostri <span className="accent-text">Istruttori</span></h3>
          </div>
          <button
            onClick={onBookClick}
            className="text-sm font-bold border-b-2 border-black pb-2 hover:opacity-50 transition-all"
          >
            Prenota →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {TEAM.map((member, i) => (
            <div key={i} className={`relative group cursor-pointer ${member.featured ? 'z-10' : ''}`}>
              <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-4 relative">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-all duration-700" />
                {member.featured && (
                  <div className="absolute inset-0 bg-[#496da1]/80 p-8 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <h4 className="text-2xl font-bold mb-2 uppercase leading-tight">{member.name}</h4>
                    <p className="text-xs opacity-80 mb-6">{member.role}</p>
                    <button onClick={onBookClick} className="text-xs font-bold uppercase border-b border-white self-start pb-1">Prenota →</button>
                  </div>
                )}
              </div>
              <div className={`${member.featured ? 'group-hover:opacity-0' : ''} transition-opacity`}>
                <h4 className="font-bold text-lg uppercase leading-none mb-1">{member.name}</h4>
                <p className="text-xs opacity-50 uppercase tracking-widest">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
