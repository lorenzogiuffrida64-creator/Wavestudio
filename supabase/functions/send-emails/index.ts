// Supabase Edge Function to send email notifications
// This function processes pending emails from the email_notifications table
// and sends them using Resend

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// Owner email for notifications
const FROM_EMAIL = 'Wave Studio Pilates <noreply@wavestudiopilates.it>'

interface EmailNotification {
  id: string
  type: string
  recipient_email: string
  recipient_name: string | null
  subject: string
  html_content: string
  text_content: string | null
  metadata: Record<string, any> | null
  status: string
}

async function sendEmailWithResend(notification: EmailNotification): Promise<{ success: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [notification.recipient_email],
        subject: notification.subject,
        html: notification.html_content,
        text: notification.text_content || undefined,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: JSON.stringify(errorData) }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  try {
    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // Get pending email notifications
    const { data: pendingEmails, error: fetchError } = await supabase
      .from('email_notifications')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(50) // Process in batches

    if (fetchError) {
      throw new Error(`Error fetching emails: ${fetchError.message}`)
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      return new Response(JSON.stringify({ message: 'No pending emails to send', sent: 0 }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Process each email
    for (const email of pendingEmails) {
      const sendResult = await sendEmailWithResend(email)

      if (sendResult.success) {
        // Mark as sent
        await supabase
          .from('email_notifications')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', email.id)

        results.sent++
      } else {
        // Mark as failed
        await supabase
          .from('email_notifications')
          .update({
            status: 'failed',
            error_message: sendResult.error,
          })
          .eq('id', email.id)

        results.failed++
        results.errors.push(`Email ${email.id}: ${sendResult.error}`)
      }
    }

    return new Response(JSON.stringify({
      message: `Processed ${pendingEmails.length} emails`,
      ...results,
    }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing emails:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
