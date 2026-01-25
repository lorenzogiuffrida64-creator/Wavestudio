
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, ArrowLeft, Shield, CheckCircle, PartyPopper, Mail, ChevronDown, ChevronUp, FileText, Lock } from 'lucide-react';
import { auth } from '../lib/supabase';

// Terms and Privacy Section Component
interface TermsAndPrivacySectionProps {
  accetto: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TermsAndPrivacySection: React.FC<TermsAndPrivacySectionProps> = ({ accetto, onChange }) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="space-y-3 py-2">
      {/* Terms and Conditions Accordion */}
      <div className="border border-[#E5E5E5] rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTerms(!showTerms)}
          className="w-full flex items-center justify-between p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#4A90E2]/10 rounded-lg flex items-center justify-center">
              <FileText size={16} className="text-[#4A90E2]" />
            </div>
            <span className="text-sm font-semibold text-[#374151]">Termini e Condizioni</span>
          </div>
          {showTerms ? (
            <ChevronUp size={20} className="text-[#9CA3AF]" />
          ) : (
            <ChevronDown size={20} className="text-[#9CA3AF]" />
          )}
        </button>
        {showTerms && (
          <div className="p-4 bg-white border-t border-[#E5E5E5] max-h-64 overflow-y-auto">
            <div className="text-xs text-[#4B5563] space-y-4 leading-relaxed">
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">1. Accettazione dei Termini</h4>
                <p>Registrandoti su Studio Osteopatia Giulia Patti, accetti integralmente i presenti Termini e Condizioni. L'utilizzo dei nostri servizi implica la piena conoscenza e accettazione delle regole qui descritte. Studio Osteopatia si riserva il diritto di modificare questi termini in qualsiasi momento, con notifica agli utenti registrati.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">2. Requisiti di Idoneità</h4>
                <p>Il servizio è riservato esclusivamente a persone maggiorenni (18+ anni). Registrandoti, dichiari di avere l'età legale per stipulare contratti. Ti consigliamo di consultare un medico prima di iniziare qualsiasi programma di esercizi. Studio Osteopatia non è responsabile per eventuali condizioni mediche preesistenti non comunicate.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">3. Prenotazioni e Cancellazioni</h4>
                <p>Le prenotazioni delle sedute possono essere effettuate tramite l'app o il sito web. Le cancellazioni devono essere comunicate almeno 24 ore prima dell'inizio della seduta per ottenere il rimborso completo o il credito. Le cancellazioni tardive (meno di 24 ore) comportano la perdita del credito della seduta. La mancata presentazione senza preavviso comporta l'addebito dell'intero costo della seduta.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">4. Pagamenti e Rimborsi</h4>
                <p>I pagamenti vengono elaborati in modo sicuro tramite i nostri partner di pagamento certificati. Gli abbonamenti si rinnovano automaticamente salvo disdetta. I pacchetti di sedute hanno una validità di 3 mesi dalla data di acquisto. Non sono previsti rimborsi per sedute già usufruite. In caso di problemi tecnici imputabili a Studio Osteopatia, verrà riconosciuto un credito equivalente.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">5. Comportamento in Studio</h4>
                <p>Gli utenti si impegnano a mantenere un comportamento rispettoso verso gli personale dello studio e gli altri partecipanti. È richiesto l'utilizzo di abbigliamento sportivo adeguato e calzini antiscivolo. È vietato l'uso di telefoni cellulari durante le sedute. Studio Osteopatia si riserva il diritto di allontanare utenti che non rispettino queste regole.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">6. Responsabilità e Limitazioni</h4>
                <p>Studio Osteopatia non è responsabile per oggetti personali lasciati incustoditi nello studio. La partecipazione alle sedute avviene sotto la propria responsabilità. Si consiglia di informare l'osteopata di eventuali infortuni o limitazioni fisiche prima dell'inizio della seduta. Studio Osteopatia è assicurato per responsabilità civile verso terzi.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">7. Proprietà Intellettuale</h4>
                <p>Tutti i contenuti presenti sul sito e sull'app (loghi, testi, immagini, video) sono di proprietà esclusiva di Studio Osteopatia Giulia Patti. È vietata la riproduzione, distribuzione o utilizzo non autorizzato di tali contenuti. Le registrazioni video o audio delle sedute non sono consentite senza esplicita autorizzazione scritta.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">8. Modifiche al Servizio</h4>
                <p>Studio Osteopatia si riserva il diritto di modificare orari, personale dello studio e tipologie di sedute. In caso di cancellazione di una seduta da parte dello studio, gli utenti prenotati riceveranno notifica immediata e credito per una seduta sostitutiva. Gli orari di apertura possono variare durante le festività.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">9. Foro Competente</h4>
                <p>Per qualsiasi controversia derivante dall'applicazione dei presenti Termini, sarà competente in via esclusiva il Foro di Catania. I presenti Termini sono regolati dalla legge italiana.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Policy Accordion */}
      <div className="border border-[#E5E5E5] rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowPrivacy(!showPrivacy)}
          className="w-full flex items-center justify-between p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#4A90E2]/10 rounded-lg flex items-center justify-center">
              <Lock size={16} className="text-[#4A90E2]" />
            </div>
            <span className="text-sm font-semibold text-[#374151]">Informativa sulla Privacy</span>
          </div>
          {showPrivacy ? (
            <ChevronUp size={20} className="text-[#9CA3AF]" />
          ) : (
            <ChevronDown size={20} className="text-[#9CA3AF]" />
          )}
        </button>
        {showPrivacy && (
          <div className="p-4 bg-white border-t border-[#E5E5E5] max-h-64 overflow-y-auto">
            <div className="text-xs text-[#4B5563] space-y-4 leading-relaxed">
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">1. Titolare del Trattamento</h4>
                <p>Il Titolare del trattamento dei dati personali è Studio Osteopatia Giulia Patti, con sede in Via Etnea 123, 95125 Catania (CT), Italia. Per qualsiasi richiesta relativa al trattamento dei dati personali, puoi contattarci all'indirizzo email: privacy@osteopatiagiuliapatti.it</p>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">2. Dati Personali Raccolti</h4>
                <p>Raccogliamo le seguenti categorie di dati personali:</p>
                <ul className="list-disc ml-4 mt-2 space-y-1">
                  <li><strong>Dati identificativi:</strong> nome, cognome, indirizzo email, numero di telefono</li>
                  <li><strong>Dati di accesso:</strong> credenziali di autenticazione (email e password criptata)</li>
                  <li><strong>Dati di utilizzo:</strong> storico prenotazioni, preferenze di seduta, frequenza di partecipazione</li>
                  <li><strong>Dati tecnici:</strong> indirizzo IP, tipo di dispositivo, browser utilizzato, dati di navigazione</li>
                  <li><strong>Dati di pagamento:</strong> gestiti in modo sicuro tramite provider certificati PCI-DSS (non conserviamo dati delle carte di credito)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">3. Finalità del Trattamento</h4>
                <p>I tuoi dati personali sono trattati per le seguenti finalità:</p>
                <ul className="list-disc ml-4 mt-2 space-y-1">
                  <li>Gestione dell'account utente e autenticazione</li>
                  <li>Elaborazione delle prenotazioni e gestione delle sedute</li>
                  <li>Comunicazioni di servizio (conferme prenotazione, modifiche orari, cancellazioni)</li>
                  <li>Invio di newsletter e comunicazioni promozionali (solo con consenso esplicito)</li>
                  <li>Miglioramento dei nostri servizi e dell'esperienza utente</li>
                  <li>Adempimento di obblighi legali e fiscali</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">4. Base Giuridica del Trattamento</h4>
                <p>Il trattamento dei dati si basa su: esecuzione del contratto di servizio, consenso dell'interessato per comunicazioni marketing, legittimo interesse per miglioramento servizi e sicurezza, adempimento di obblighi legali per la conservazione documentale fiscale.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">5. Condivisione dei Dati</h4>
                <p>I tuoi dati personali non vengono venduti a terze parti. Possono essere condivisi con:</p>
                <ul className="list-disc ml-4 mt-2 space-y-1">
                  <li><strong>Provider di servizi:</strong> hosting, email, pagamenti (operano come responsabili del trattamento)</li>
                  <li><strong>Autorità competenti:</strong> quando richiesto dalla legge</li>
                  <li><strong>Consulenti professionali:</strong> commercialisti, avvocati (vincolati da obblighi di riservatezza)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">6. Conservazione dei Dati</h4>
                <p>I dati personali sono conservati per il tempo necessario alle finalità per cui sono stati raccolti: dati account attivo per tutta la durata del rapporto contrattuale, dati fiscali per 10 anni come richiesto dalla legge, dati marketing fino alla revoca del consenso. Alla cessazione del rapporto, i dati vengono cancellati o anonimizzati.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">7. I Tuoi Diritti (GDPR)</h4>
                <p>In conformità al Regolamento UE 2016/679 (GDPR), hai diritto a:</p>
                <ul className="list-disc ml-4 mt-2 space-y-1">
                  <li><strong>Accesso:</strong> ottenere conferma del trattamento e copia dei dati</li>
                  <li><strong>Rettifica:</strong> correggere dati inesatti o incompleti</li>
                  <li><strong>Cancellazione:</strong> richiedere la cancellazione dei dati ("diritto all'oblio")</li>
                  <li><strong>Limitazione:</strong> limitare il trattamento in determinati casi</li>
                  <li><strong>Portabilità:</strong> ricevere i dati in formato strutturato</li>
                  <li><strong>Opposizione:</strong> opporti al trattamento per marketing diretto</li>
                  <li><strong>Revoca del consenso:</strong> revocare in qualsiasi momento il consenso prestato</li>
                </ul>
                <p className="mt-2">Per esercitare questi diritti, contatta: privacy@osteopatiagiuliapatti.it</p>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">8. Sicurezza dei Dati</h4>
                <p>Adottiamo misure tecniche e organizzative appropriate per proteggere i tuoi dati, tra cui: crittografia SSL/TLS per tutte le comunicazioni, password hashate con algoritmi sicuri, accesso ai dati limitato al personale autorizzato, backup regolari e sistemi di disaster recovery, monitoraggio continuo della sicurezza.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">9. Cookie e Tecnologie Simili</h4>
                <p>Utilizziamo cookie tecnici necessari per il funzionamento del sito e cookie analitici (con il tuo consenso) per migliorare l'esperienza utente. Puoi gestire le preferenze cookie dalle impostazioni del browser.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#2E5C8A] mb-2">10. Reclami</h4>
                <p>Se ritieni che il trattamento dei tuoi dati violi il GDPR, hai diritto di proporre reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).</p>
              </div>
              <div className="pt-2 border-t border-[#E5E5E5]">
                <p className="text-[10px] text-[#9CA3AF]">Ultimo aggiornamento: Gennaio 2026</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkbox for acceptance */}
      <div className="flex items-start gap-3 pt-2">
        <input
          type="checkbox"
          name="accetto"
          id="accetto"
          checked={accetto}
          required
          onChange={onChange}
          className="mt-0.5 w-5 h-5 rounded border-[#E5E5E5] text-[#4A90E2] focus:ring-[#4A90E2] cursor-pointer"
        />
        <label htmlFor="accetto" className="text-xs text-[#4B5563] leading-relaxed cursor-pointer">
          Ho letto e accetto i <span className="text-[#4A90E2] font-bold">Termini e Condizioni</span> e l'<span className="text-[#4A90E2] font-bold">Informativa sulla Privacy</span> di Studio Osteopatia Giulia Patti. Dichiaro di essere maggiorenne e di aver compreso le modalità di trattamento dei miei dati personali.
        </label>
      </div>
    </div>
  );
};

interface AuthProps {
  type: 'login' | 'signup';
  onSwitch: () => void;
  onBack: () => void;
  onSuccess: (email: string, name: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ type, onSwitch, onBack, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ email: string; name: string; needsConfirmation: boolean } | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    password: '',
    confermaPassword: '',
    accetto: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (type === 'signup') {
        // Validate password confirmation
        if (formData.password !== formData.confermaPassword) {
          throw new Error('Le password non corrispondono');
        }

        // Validate password strength
        if (formData.password.length < 6) {
          throw new Error('La password deve essere di almeno 6 caratteri');
        }

        // Validate terms acceptance
        if (!formData.accetto) {
          throw new Error('Devi accettare i termini e condizioni');
        }

        // Sign up with Supabase
        const { user, session } = await auth.signUp(
          formData.email,
          formData.password,
          formData.nome,
          formData.telefono
        );

        if (user) {
          // Get user profile to get full name
          const fullName = user.user_metadata?.full_name || formData.nome || 'Utente Wave';
          // Check if email confirmation is required (no session means confirmation needed)
          const needsConfirmation = !session;
          setSuccessData({ email: formData.email, name: fullName, needsConfirmation });
        }
      } else {
        // Sign in with Supabase
        const { user } = await auth.signIn(formData.email, formData.password);

        if (user) {
          // Get user profile
          const fullName = user.user_metadata?.full_name || formData.email.split('@')[0];
          // Login doesn't need confirmation
          setSuccessData({ email: formData.email, name: fullName, needsConfirmation: false });
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Si è verificato un errore. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetLoading(true);

    try {
      await auth.resetPassword(resetEmail);
      setResetSuccess(true);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setResetError(err.message || 'Si è verificato un errore. Riprova.');
    } finally {
      setResetLoading(false);
    }
  };

  // Redirect to dashboard after showing success screen (only if no email confirmation needed)
  useEffect(() => {
    if (successData && !successData.needsConfirmation) {
      const timer = setTimeout(() => {
        onSuccess(successData.email, successData.name);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [successData, onSuccess]);

  // Success Screen
  if (successData) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F4FF] to-white font-sans">
        <div className="text-center p-8 max-w-md">
          <div className="mb-6 flex justify-center">
            <div className={`w-20 h-20 ${successData.needsConfirmation ? 'bg-blue-100' : 'bg-green-100'} rounded-full flex items-center justify-center ${successData.needsConfirmation ? '' : 'animate-bounce'}`}>
              {successData.needsConfirmation ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              ) : (
                <CheckCircle size={48} className="text-green-500" />
              )}
            </div>
          </div>

          {successData.needsConfirmation ? (
            <>
              <h1 className="text-3xl font-bold text-[#2E5C8A] mb-3">
                Controlla la Tua Email!
              </h1>
              <p className="text-lg text-[#4B5563] mb-2">
                Ciao, <span className="font-semibold text-[#4A90E2]">{successData.name}</span>!
              </p>
              <p className="text-sm text-[#9CA3AF] mb-6">
                Ti abbiamo inviato un'email a <span className="font-semibold">{successData.email}</span>.
                <br />Clicca sul link per confermare il tuo account.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSuccessData(null);
                    onSwitch();
                  }}
                  className="w-full h-12 bg-[#4A90E2] text-white rounded-xl font-bold hover:bg-[#3A7BC8] transition-colors"
                >
                  Vai al Login
                </button>
                <button
                  onClick={onBack}
                  className="w-full h-12 border border-[#E5E5E5] text-[#4B5563] rounded-xl font-bold hover:bg-[#F9FAFB] transition-colors"
                >
                  Torna alla Home
                </button>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-4">
                Non hai ricevuto l'email? Controlla la cartella spam.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-[#2E5C8A] mb-3">
                {type === 'signup' ? 'Registrazione Completata!' : 'Accesso Effettuato!'}
              </h1>
              <p className="text-lg text-[#4B5563] mb-2">
                Benvenuto, <span className="font-semibold text-[#4A90E2]">{successData.name}</span>!
              </p>
              <p className="text-sm text-[#9CA3AF] mb-6">
                Stai per essere reindirizzato alla tua dashboard...
              </p>
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-[#4A90E2] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-[#4A90E2] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-[#4A90E2] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Forgot Password Screen
  if (showForgotPassword) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F4FF] to-white font-sans">
        <div className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#4A90E2]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-[#4A90E2]" />
            </div>
            <h1 className="text-2xl font-bold text-[#2E5C8A] mb-2">
              {resetSuccess ? 'Email Inviata!' : 'Password Dimenticata?'}
            </h1>
            <p className="text-sm text-[#9CA3AF]">
              {resetSuccess
                ? 'Controlla la tua email per il link di reset.'
                : 'Inserisci la tua email per ricevere il link di reset.'}
            </p>
          </div>

          {resetSuccess ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm text-center">
                Ti abbiamo inviato un'email a <span className="font-bold">{resetEmail}</span> con le istruzioni per reimpostare la password.
              </div>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetSuccess(false);
                  setResetEmail('');
                  setResetError(null);
                }}
                className="w-full h-12 bg-[#4A90E2] text-white rounded-xl font-bold hover:bg-[#3A7BC8] transition-colors"
              >
                Torna al Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {resetError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {resetError}
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#374151]">Email</label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="mario.rossi@example.com"
                  className="w-full h-12 px-4 rounded-xl border border-[#E5E5E5] text-base focus:border-[#4A90E2] focus:ring-4 focus:ring-[#4A90E2]/10 transition-all outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={resetLoading}
                className="w-full h-12 bg-black text-white rounded-xl font-bold hover:bg-black/90 transition-colors disabled:opacity-70"
              >
                {resetLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
                ) : (
                  'Invia Link di Reset'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetError(null);
                  setResetEmail('');
                }}
                className="w-full h-12 border border-[#E5E5E5] text-[#4B5563] rounded-xl font-bold hover:bg-[#F9FAFB] transition-colors"
              >
                Torna al Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white font-sans relative">
      {/* LEFT PANEL (40%) - BRAND SECTION (Hidden on mobile, visible on desktop/tablet) */}
      <div className="hidden lg:flex w-[35%] xl:w-[40%] bg-[#E8F4FF] relative flex-col justify-between p-12 xl:p-16 overflow-hidden">
        {/* Decorative Wave Background */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#4A90E2] fill-current">
            <path d="M0,50 Q25,20 50,50 T100,50 L100,100 L0,100 Z" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12 cursor-pointer group" onClick={onBack}>
            <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-[#4A90E2] group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-[#2E5C8A]">Studio Osteopatia</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold text-[#2E5C8A] leading-tight mb-6 tracking-tighter">
            {type === 'signup' ? 'Inizia la Tua Trasformazione' : 'Bentornato in Studio'}
          </h2>
          <p className="text-lg text-[#4B5563] max-w-sm leading-relaxed">
            Unisciti alla nostra community e scopri l'equilibrio perfetto tra forza e consapevolezza.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm">
            <div className="w-10 h-10 bg-[#4A90E2] rounded-full flex-shrink-0 flex items-center justify-center text-white">
              <Check size={20} />
            </div>
            <div>
              <p className="font-bold text-[#2E5C8A] text-sm">500+ Clienti Felici</p>
              <p className="text-[10px] text-[#4B5563] uppercase font-bold tracking-widest">In tutta Catania</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm">
            <div className="w-10 h-10 bg-[#4A90E2] rounded-full flex-shrink-0 flex items-center justify-center text-white">
              <Check size={20} />
            </div>
            <div>
              <p className="font-bold text-[#2E5C8A] text-sm">15+ Anni di Esperienza</p>
              <p className="text-[10px] text-[#4B5563] uppercase font-bold tracking-widest">Eccellenza tecnica</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - FORM SECTION */}
      <div className="w-full lg:w-[65%] xl:w-[60%] flex flex-col bg-white overflow-y-auto h-full">
        {/* Mobile Header Branding */}
        <div className="lg:hidden p-6 flex items-center justify-between border-b border-[#F5F5F5]">
          <div className="flex items-center gap-2" onClick={onBack}>
            <Shield size={24} className="text-[#4A90E2]" />
            <span className="text-lg font-black tracking-tighter uppercase">Studio Osteopatia</span>
          </div>
          <button onClick={onBack} className="p-2 text-[#9CA3AF] hover:text-[#4A90E2]">
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center p-6 md:p-12 min-h-0">
          <div className="w-full max-w-[450px]">
            {/* Desktop Back Arrow */}
            <button 
              onClick={onBack}
              className="hidden lg:flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#4A90E2] transition-colors mb-8 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Torna alla Home
            </button>

            <div className="mb-8 md:mb-10 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 tracking-tight">
                {type === 'signup' ? 'Crea il Tuo Account' : 'Bentornato!'}
              </h1>
              <p className="text-[#9CA3AF] text-sm md:text-base">
                {type === 'signup' ? 'Unisciti a Studio Osteopatia e inizia il tuo percorso' : 'Accedi al tuo account Studio Osteopatia'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}
              {type === 'signup' && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">Nome Completo *</label>
                  <input 
                    type="text" 
                    name="nome"
                    required
                    autoFocus
                    placeholder="Mario Rossi"
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-xl border border-[#E5E5E5] text-base focus:border-[#4A90E2] focus:ring-4 focus:ring-[#4A90E2]/10 transition-all outline-none"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#374151]">Email *</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="mario.rossi@example.com"
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl border border-[#E5E5E5] text-base focus:border-[#4A90E2] focus:ring-4 focus:ring-[#4A90E2]/10 transition-all outline-none"
                />
              </div>

              {type === 'signup' && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">Numero di Telefono *</label>
                  <input 
                    type="tel" 
                    name="telefono"
                    required
                    placeholder="+39 333 123 4567"
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-xl border border-[#E5E5E5] text-base focus:border-[#4A90E2] focus:ring-4 focus:ring-[#4A90E2]/10 transition-all outline-none"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-[#374151]">Password *</label>
                  {type === 'login' && (
                    <button type="button" onClick={() => setShowForgotPassword(true)} className="text-xs text-[#4A90E2] hover:underline font-bold">Dimenticata?</button>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    required
                    placeholder="••••••••"
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-xl border border-[#E5E5E5] text-base focus:border-[#4A90E2] focus:ring-4 focus:ring-[#4A90E2]/10 transition-all outline-none pr-12"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#9CA3AF] hover:text-[#4B5563]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {type === 'signup' && (
                  <div className="flex gap-1 mt-1">
                    <div className="h-1 flex-1 bg-green-500 rounded-full"></div>
                    <div className="h-1 flex-1 bg-green-500 rounded-full"></div>
                    <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
                    <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
                  </div>
                )}
              </div>

              {type === 'signup' && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#374151]">Conferma Password *</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confermaPassword"
                    required
                    placeholder="••••••••"
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-xl border border-[#E5E5E5] text-base focus:border-[#4A90E2] focus:ring-4 focus:ring-[#4A90E2]/10 transition-all outline-none"
                  />
                </div>
              )}

              {type === 'signup' && (
                <TermsAndPrivacySection
                  accetto={formData.accetto}
                  onChange={handleInputChange}
                />
              )}

              {type === 'login' && (
                <div className="flex items-center justify-between py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-[#E5E5E5] text-[#4A90E2] focus:ring-[#4A90E2]" />
                    <span className="text-sm text-[#4B5563] font-medium">Ricordami</span>
                  </label>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-black text-white rounded-xl font-black text-base md:text-lg hover:scale-[1.01] active:scale-[0.98] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  type === 'signup' ? 'Crea Account' : 'Accedi'
                )}
              </button>

              <p className="text-center text-sm text-[#4B5563] pt-6">
                {type === 'signup' ? 'Hai già un account?' : 'Non hai un account?'}
                <button 
                  type="button"
                  onClick={onSwitch}
                  className="ml-2 text-[#4A90E2] font-black hover:underline"
                >
                  {type === 'signup' ? 'Accedi' : 'Registrati'}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
