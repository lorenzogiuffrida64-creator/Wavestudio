
import React from 'react';

export const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Light beam texture */}
      <div className="absolute top-0 left-1/4 w-px h-screen bg-gradient-to-b from-transparent via-[#496da1]/10 to-transparent opacity-50"></div>
      <div className="absolute top-0 right-1/4 w-px h-screen bg-gradient-to-b from-transparent via-[#496da1]/10 to-transparent opacity-50"></div>
      
      {/* Abstract Parallax Shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#496da1]/5 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-white/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      
      {/* Particle Drift */}
      {[...Array(15)].map((_, i) => (
        <div 
          key={i}
          className="particle absolute w-1 h-1 bg-black/10 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 20}s`
          }}
        ></div>
      ))}
      
      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};
