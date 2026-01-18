import { supabase } from './supabase';

// =============================================
// EMAIL NOTIFICATION SERVICE
// =============================================

// Owner email - you should configure this in your environment
const OWNER_EMAIL = 'info@wavestudiopilates.it';
const STUDIO_NAME = 'Wave Studio Pilates';

export interface BookingEmailData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  bookingDate: string;
  bookingTime: string;
  instructorName: string;
  classType: string;
  bookingId: string;
}

export interface CancellationEmailData extends BookingEmailData {
  cancelledBy: 'client' | 'owner';
}

// =============================================
// EMAIL TEMPLATES (Italian)
// =============================================

function formatDateItalian(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  return date.toLocaleDateString('it-IT', options);
}

export function getBookingConfirmationEmailForClient(data: BookingEmailData): { subject: string; html: string; text: string } {
  const formattedDate = formatDateItalian(data.bookingDate);

  return {
    subject: `Prenotazione Confermata - ${STUDIO_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #4A90E2 0%, #2E5C8A 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Prenotazione Confermata!</h1>
        </div>

        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 16px 16px;">
          <p style="font-size: 16px; color: #333;">Ciao <strong>${data.clientName}</strong>,</p>

          <p style="font-size: 16px; color: #333;">La tua prenotazione è stata confermata con successo!</p>

          <div style="background: white; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #4A90E2;">
            <h3 style="margin: 0 0 15px 0; color: #2E5C8A;">Dettagli Appuntamento</h3>
            <p style="margin: 8px 0;"><strong>Classe:</strong> ${data.classType}</p>
            <p style="margin: 8px 0;"><strong>Data:</strong> ${formattedDate}</p>
            <p style="margin: 8px 0;"><strong>Ora:</strong> ${data.bookingTime}</p>
            <p style="margin: 8px 0;"><strong>Istruttore:</strong> ${data.instructorName}</p>
          </div>

          <div style="background: #FFF8E1; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #795548;">
              <strong>Ricorda:</strong> Le cancellazioni devono essere effettuate almeno 24 ore prima dell'appuntamento.
            </p>
          </div>

          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            Ti aspettiamo!<br>
            <strong>Il Team di ${STUDIO_NAME}</strong>
          </p>
        </div>

        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>${STUDIO_NAME} - Via Example 123, Catania</p>
        </div>
      </div>
    `,
    text: `
Prenotazione Confermata - ${STUDIO_NAME}

Ciao ${data.clientName},

La tua prenotazione è stata confermata con successo!

Dettagli Appuntamento:
- Classe: ${data.classType}
- Data: ${formattedDate}
- Ora: ${data.bookingTime}
- Istruttore: ${data.instructorName}

Ricorda: Le cancellazioni devono essere effettuate almeno 24 ore prima dell'appuntamento.

Ti aspettiamo!
Il Team di ${STUDIO_NAME}
    `
  };
}

export function getBookingConfirmationEmailForOwner(data: BookingEmailData): { subject: string; html: string; text: string } {
  const formattedDate = formatDateItalian(data.bookingDate);

  return {
    subject: `Nuova Prenotazione - ${data.clientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #10B981; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Nuova Prenotazione!</h1>
        </div>

        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 16px 16px;">
          <p style="font-size: 16px; color: #333;">Hai ricevuto una nuova prenotazione!</p>

          <div style="background: white; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #10B981;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Dettagli Cliente</h3>
            <p style="margin: 8px 0;"><strong>Nome:</strong> ${data.clientName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${data.clientEmail}</p>
            ${data.clientPhone ? `<p style="margin: 8px 0;"><strong>Telefono:</strong> ${data.clientPhone}</p>` : ''}
          </div>

          <div style="background: white; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #4A90E2;">
            <h3 style="margin: 0 0 15px 0; color: #2E5C8A;">Dettagli Appuntamento</h3>
            <p style="margin: 8px 0;"><strong>Classe:</strong> ${data.classType}</p>
            <p style="margin: 8px 0;"><strong>Data:</strong> ${formattedDate}</p>
            <p style="margin: 8px 0;"><strong>Ora:</strong> ${data.bookingTime}</p>
            <p style="margin: 8px 0;"><strong>Istruttore:</strong> ${data.instructorName}</p>
            <p style="margin: 8px 0;"><strong>ID Prenotazione:</strong> ${data.bookingId}</p>
          </div>
        </div>
      </div>
    `,
    text: `
Nuova Prenotazione - ${STUDIO_NAME}

Hai ricevuto una nuova prenotazione!

Dettagli Cliente:
- Nome: ${data.clientName}
- Email: ${data.clientEmail}
${data.clientPhone ? `- Telefono: ${data.clientPhone}` : ''}

Dettagli Appuntamento:
- Classe: ${data.classType}
- Data: ${formattedDate}
- Ora: ${data.bookingTime}
- Istruttore: ${data.instructorName}
- ID Prenotazione: ${data.bookingId}
    `
  };
}

export function getCancellationEmailForClient(data: CancellationEmailData): { subject: string; html: string; text: string } {
  const formattedDate = formatDateItalian(data.bookingDate);
  const cancelledByText = data.cancelledBy === 'owner'
    ? 'Lo studio ha cancellato la tua prenotazione.'
    : 'La tua prenotazione è stata cancellata con successo.';

  return {
    subject: `Prenotazione Cancellata - ${STUDIO_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #DC2626; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Prenotazione Cancellata</h1>
        </div>

        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 16px 16px;">
          <p style="font-size: 16px; color: #333;">Ciao <strong>${data.clientName}</strong>,</p>

          <p style="font-size: 16px; color: #333;">${cancelledByText}</p>

          <div style="background: white; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #DC2626;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Dettagli Prenotazione Cancellata</h3>
            <p style="margin: 8px 0;"><strong>Classe:</strong> ${data.classType}</p>
            <p style="margin: 8px 0;"><strong>Data:</strong> ${formattedDate}</p>
            <p style="margin: 8px 0;"><strong>Ora:</strong> ${data.bookingTime}</p>
            <p style="margin: 8px 0;"><strong>Istruttore:</strong> ${data.instructorName}</p>
          </div>

          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            Puoi prenotare una nuova lezione quando vuoi dalla tua dashboard.<br><br>
            <strong>Il Team di ${STUDIO_NAME}</strong>
          </p>
        </div>
      </div>
    `,
    text: `
Prenotazione Cancellata - ${STUDIO_NAME}

Ciao ${data.clientName},

${cancelledByText}

Dettagli Prenotazione Cancellata:
- Classe: ${data.classType}
- Data: ${formattedDate}
- Ora: ${data.bookingTime}
- Istruttore: ${data.instructorName}

Puoi prenotare una nuova lezione quando vuoi dalla tua dashboard.

Il Team di ${STUDIO_NAME}
    `
  };
}

export function getCancellationEmailForOwner(data: CancellationEmailData): { subject: string; html: string; text: string } {
  const formattedDate = formatDateItalian(data.bookingDate);

  return {
    subject: `Prenotazione Cancellata - ${data.clientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #F59E0B; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Prenotazione Cancellata</h1>
        </div>

        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 16px 16px;">
          <p style="font-size: 16px; color: #333;">Una prenotazione è stata cancellata.</p>

          <div style="background: white; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #F59E0B;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Dettagli Cliente</h3>
            <p style="margin: 8px 0;"><strong>Nome:</strong> ${data.clientName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${data.clientEmail}</p>
            ${data.clientPhone ? `<p style="margin: 8px 0;"><strong>Telefono:</strong> ${data.clientPhone}</p>` : ''}
          </div>

          <div style="background: white; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #DC2626;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Dettagli Prenotazione</h3>
            <p style="margin: 8px 0;"><strong>Classe:</strong> ${data.classType}</p>
            <p style="margin: 8px 0;"><strong>Data:</strong> ${formattedDate}</p>
            <p style="margin: 8px 0;"><strong>Ora:</strong> ${data.bookingTime}</p>
            <p style="margin: 8px 0;"><strong>Istruttore:</strong> ${data.instructorName}</p>
          </div>

          <div style="background: #E8F4FF; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #2E5C8A;">
              <strong>Nota:</strong> Un posto è ora disponibile per questa lezione. Gli utenti interessati riceveranno una notifica.
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
Prenotazione Cancellata - ${STUDIO_NAME}

Una prenotazione è stata cancellata.

Dettagli Cliente:
- Nome: ${data.clientName}
- Email: ${data.clientEmail}
${data.clientPhone ? `- Telefono: ${data.clientPhone}` : ''}

Dettagli Prenotazione:
- Classe: ${data.classType}
- Data: ${formattedDate}
- Ora: ${data.bookingTime}
- Istruttore: ${data.instructorName}

Nota: Un posto è ora disponibile per questa lezione.
    `
  };
}

export function getNewSpotAvailableEmail(data: {
  clientName: string;
  classType: string;
  bookingDate: string;
  bookingTime: string;
  instructorName: string;
  spotsAvailable: number;
}): { subject: string; html: string; text: string } {
  const formattedDate = formatDateItalian(data.bookingDate);

  return {
    subject: `Posto Disponibile! - ${data.classType} del ${formattedDate}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Posto Disponibile!</h1>
        </div>

        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 16px 16px;">
          <p style="font-size: 16px; color: #333;">Ciao <strong>${data.clientName}</strong>,</p>

          <p style="font-size: 16px; color: #333;">Buone notizie! Si è liberato un posto per una lezione!</p>

          <div style="background: white; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #10B981;">
            <h3 style="margin: 0 0 15px 0; color: #059669;">Dettagli Lezione</h3>
            <p style="margin: 8px 0;"><strong>Classe:</strong> ${data.classType}</p>
            <p style="margin: 8px 0;"><strong>Data:</strong> ${formattedDate}</p>
            <p style="margin: 8px 0;"><strong>Ora:</strong> ${data.bookingTime}</p>
            <p style="margin: 8px 0;"><strong>Istruttore:</strong> ${data.instructorName}</p>
            <p style="margin: 8px 0; color: #10B981;"><strong>Posti disponibili:</strong> ${data.spotsAvailable}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="display: inline-block; background: #4A90E2; color: white; padding: 15px 40px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Prenota Ora
            </a>
          </div>

          <p style="font-size: 14px; color: #666; text-align: center;">
            Affrettati! I posti si esauriscono velocemente.<br><br>
            <strong>Il Team di ${STUDIO_NAME}</strong>
          </p>
        </div>
      </div>
    `,
    text: `
Posto Disponibile! - ${STUDIO_NAME}

Ciao ${data.clientName},

Buone notizie! Si è liberato un posto per una lezione!

Dettagli Lezione:
- Classe: ${data.classType}
- Data: ${formattedDate}
- Ora: ${data.bookingTime}
- Istruttore: ${data.instructorName}
- Posti disponibili: ${data.spotsAvailable}

Affrettati! I posti si esauriscono velocemente.

Il Team di ${STUDIO_NAME}
    `
  };
}

// =============================================
// EMAIL SENDING FUNCTIONS
// =============================================

// Store email notifications in database for sending via Edge Functions
export async function queueEmailNotification(
  type: 'booking_confirmation' | 'booking_cancellation' | 'spot_available',
  recipientEmail: string,
  recipientName: string,
  emailContent: { subject: string; html: string; text: string },
  metadata?: Record<string, any>
): Promise<void> {
  const { error } = await supabase
    .from('email_notifications')
    .insert({
      type,
      recipient_email: recipientEmail,
      recipient_name: recipientName,
      subject: emailContent.subject,
      html_content: emailContent.html,
      text_content: emailContent.text,
      metadata,
      status: 'pending',
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error queuing email notification:', error);
    // Don't throw - email queuing failure shouldn't break the booking flow
  }
}

// Send booking confirmation emails (called after successful booking)
export async function sendBookingConfirmationEmails(
  bookingId: string,
  clientData: { name: string; email: string; phone?: string },
  bookingDetails: { date: string; time: string; classType: string; instructorName: string }
): Promise<void> {
  const emailData: BookingEmailData = {
    clientName: clientData.name,
    clientEmail: clientData.email,
    clientPhone: clientData.phone,
    bookingDate: bookingDetails.date,
    bookingTime: bookingDetails.time,
    instructorName: bookingDetails.instructorName,
    classType: bookingDetails.classType,
    bookingId
  };

  // Queue email for client
  const clientEmail = getBookingConfirmationEmailForClient(emailData);
  await queueEmailNotification(
    'booking_confirmation',
    clientData.email,
    clientData.name,
    clientEmail,
    { bookingId, role: 'client' }
  );

  // Queue email for owner
  const ownerEmail = getBookingConfirmationEmailForOwner(emailData);
  await queueEmailNotification(
    'booking_confirmation',
    OWNER_EMAIL,
    'Wave Studio Owner',
    ownerEmail,
    { bookingId, role: 'owner' }
  );
}

// Send cancellation emails (called after booking cancellation)
export async function sendCancellationEmails(
  bookingId: string,
  clientData: { name: string; email: string; phone?: string },
  bookingDetails: { date: string; time: string; classType: string; instructorName: string },
  cancelledBy: 'client' | 'owner'
): Promise<void> {
  const emailData: CancellationEmailData = {
    clientName: clientData.name,
    clientEmail: clientData.email,
    clientPhone: clientData.phone,
    bookingDate: bookingDetails.date,
    bookingTime: bookingDetails.time,
    instructorName: bookingDetails.instructorName,
    classType: bookingDetails.classType,
    bookingId,
    cancelledBy
  };

  // Queue email for client
  const clientEmail = getCancellationEmailForClient(emailData);
  await queueEmailNotification(
    'booking_cancellation',
    clientData.email,
    clientData.name,
    clientEmail,
    { bookingId, role: 'client', cancelledBy }
  );

  // Queue email for owner
  const ownerEmail = getCancellationEmailForOwner(emailData);
  await queueEmailNotification(
    'booking_cancellation',
    OWNER_EMAIL,
    'Wave Studio Owner',
    ownerEmail,
    { bookingId, role: 'owner', cancelledBy }
  );
}

// Send notification to all interested users when a spot becomes available
export async function sendSpotAvailableNotifications(
  slotId: string,
  bookingDate: string,
  slotDetails: { classType: string; time: string; instructorName: string },
  spotsAvailable: number
): Promise<void> {
  // Get all users who have notification preferences enabled
  // In a real implementation, you might have a waitlist table
  // For now, we'll notify all users who have email notifications enabled

  const { data: users, error } = await supabase
    .from('profiles')
    .select('email, full_name')
    .not('email', 'is', null);

  if (error || !users) {
    console.error('Error fetching users for spot notification:', error);
    return;
  }

  // Queue notification for each user
  for (const user of users) {
    const emailContent = getNewSpotAvailableEmail({
      clientName: user.full_name || 'Utente Wave',
      classType: slotDetails.classType,
      bookingDate,
      bookingTime: slotDetails.time,
      instructorName: slotDetails.instructorName,
      spotsAvailable
    });

    await queueEmailNotification(
      'spot_available',
      user.email,
      user.full_name || 'Utente Wave',
      emailContent,
      { slotId, bookingDate, spotsAvailable }
    );
  }
}
