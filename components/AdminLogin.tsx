import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Mail, AlertCircle } from 'lucide-react';
import { auth } from '../lib/supabase';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
  onClose: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Sign in with Supabase Auth
      await auth.signIn(email, password);

      // Check if user is admin
      const isAdmin = await auth.isAdmin();

      if (isAdmin) {
        onLogin(true);
      } else {
        // Not an admin - sign them out and show error
        await auth.signOut();
        setError('Accesso negato. Non sei autorizzato come amministratore.');
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      if (err.message?.includes('Invalid login credentials')) {
        setError('Email o password non validi.');
      } else {
        setError('Errore durante il login. Riprova.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
      <div className="bg-[#1a1a1a] w-full max-w-md rounded-[2.5rem] border border-white/10 p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
          disabled={isLoading}
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-[#496da1]/20 rounded-2xl flex items-center justify-center text-[#496da1] mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Area Riservata</h2>
          <p className="text-white/40 text-sm mt-2">Accedi con le tue credenziali amministratore.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#496da1] transition-all"
              autoFocus
              disabled={isLoading}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#496da1] transition-all"
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-xl">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#496da1] text-white font-bold py-4 rounded-2xl hover:bg-[#496da1]/80 transition-all active:scale-[0.98] shadow-lg shadow-[#496da1]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Verifica in corso...
              </span>
            ) : (
              'Accedi al Dashboard'
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Wave Studio CRM v1.0 • Protetto</p>
        </div>
      </div>
    </div>
  );
};
