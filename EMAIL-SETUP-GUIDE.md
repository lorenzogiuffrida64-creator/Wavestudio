# Email Notification System - Setup Guide

## DA FARE (Owner)

### Step 1: Crea Account Resend
1. Vai su https://resend.com/signup
2. Registrati con `wavecatania@gmail.com`
3. Conferma l'email

### Step 2: Crea API Key
1. Resend Dashboard → API Keys
2. Clicca "Create API Key"
3. Nome: `wave-studio-production`
4. Permission: `Full access`
5. **COPIA LA CHIAVE** (mostrata solo una volta!)

### Step 3: Aggiungi API Key a Supabase
1. Vai su https://supabase.com → Il tuo progetto
2. Project Settings → Edge Functions → Secrets
3. Clicca "Add new secret"
4. Name: `RESEND_API_KEY`
5. Value: (incolla la chiave di Resend)

### Step 4: Torna da Claude e scrivi "fatto"

---

## CONFIGURAZIONE (da confermare)

- **Email proprietario:** wavecatania@gmail.com
- **Nome studio:** Wave Studio Pilates
- **Città:** Catania

---

## NOTIFICHE DA IMPLEMENTARE

### Per l'UTENTE:
- [ ] Conferma prenotazione (con dettagli lezione)
- [ ] Reminder 24h prima della lezione
- [ ] Conferma cancellazione
- [ ] Notifica posto disponibile (se in lista d'attesa)

### Per il PROPRIETARIO (wavecatania@gmail.com):
- [ ] Nuova prenotazione ricevuta
- [ ] Prenotazione cancellata
- [ ] Alert "ultimi 2 posti" per una lezione
- [ ] Alert "ultimo posto" per una lezione

---

## DOMINIO PERSONALIZZATO (Opzionale - Futuro)

Se vuoi email da `noreply@wavestudiopilates.it` invece di `onboarding@resend.dev`:

1. Compra dominio (~€10/anno) da Cloudflare, Namecheap o Aruba
2. Resend Dashboard → Domains → Add Domain
3. Aggiungi i record DNS forniti da Resend
4. Verifica il dominio
5. Aggiorna il codice con il nuovo indirizzo "from"

---

## NOTE TECNICHE (per Claude)

### Provider: Resend
- Docs: https://resend.com/docs
- 3.000 email/mese gratis
- SDK: `npm install resend`

### Sender (senza dominio):
```
from: "Wave Studio Pilates <onboarding@resend.dev>"
reply-to: "wavecatania@gmail.com"
```

### File da creare/modificare:
- `lib/email.ts` - funzioni invio email
- `app/api/send-email/route.ts` - API endpoint
- Modificare `lib/booking.ts` - trigger dopo prenotazione/cancellazione

### Tabella utenti deve avere:
- `email` (già presente in profiles)
- `phone` (opzionale per futuro SMS)
- `email_notifications` boolean (opt-in/opt-out)
