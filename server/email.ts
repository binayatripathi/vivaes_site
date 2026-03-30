import { Resend } from 'resend';

const BUSINESS_NAME = process.env.VIVA_BUSINESS_NAME || "Viva Electric & Solar Inc.";
const BUSINESS_PHONE = process.env.VIVA_PHONE || "+1 (510) 710-5745";
const BUSINESS_EMAIL = process.env.VIVA_EMAIL || "roberto@vivaes.net";
const NOTIFY_EMAILS = ["roberto@vivaes.net", "binayatripathi@gmail.com"];
const FROM_EMAIL = "hello@storywonderbook.com";
const REPLY_TO_EMAIL = "roberto@vivaes.net";

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('Resend credentials not available');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || !connectionSettings.settings.api_key) {
    throw new Error('Resend not connected');
  }
  return { apiKey: connectionSettings.settings.api_key };
}

async function getResendClient() {
  const { apiKey } = await getCredentials();
  return new Resend(apiKey);
}

function headerHtml(title: string): string {
  return `
    <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">${BUSINESS_NAME}</h1>
      <p style="color: #bfdbfe; margin: 8px 0 0; font-size: 14px;">${title}</p>
    </div>
  `;
}

function footerHtml(): string {
  return `
    <div style="background: #f1f5f9; padding: 20px 24px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 4px; color: #64748b; font-size: 13px;">${BUSINESS_NAME}</p>
      <p style="margin: 0 0 4px; color: #64748b; font-size: 13px;">Bay Area & Central Valley</p>
      <p style="margin: 0; color: #64748b; font-size: 13px;">${BUSINESS_PHONE} | ${BUSINESS_EMAIL}</p>
    </div>
  `;
}

function rowHtml(label: string, value: string, isPhone = false): string {
  const displayValue = isPhone
    ? `<a href="tel:${value.replace(/[^+\d]/g, '')}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${value}</a>`
    : value;
  return `
    <tr>
      <td style="padding: 8px 12px; color: #64748b; font-size: 14px; border-bottom: 1px solid #f1f5f9; width: 140px; font-weight: 600;">${label}</td>
      <td style="padding: 8px 12px; color: #1e293b; font-size: 14px; border-bottom: 1px solid #f1f5f9;">${displayValue}</td>
    </tr>
  `;
}

export async function sendQuoteNotification(data: {
  name: string;
  email: string;
  phone: string;
  zip: string;
  serviceType: string;
  details?: string;
  estimate?: {
    estimateRange: { low: number; high: number };
    timeline: string;
    total: number;
  };
}) {
  try {
    const resend = await getResendClient();

    const estimateSection = data.estimate ? `
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <h3 style="margin: 0 0 8px; color: #1e40af; font-size: 16px;">Instant Quote Estimate</h3>
        <p style="margin: 0 0 4px; color: #1e293b; font-size: 18px; font-weight: 700;">$${data.estimate.estimateRange.low.toLocaleString()} - $${data.estimate.estimateRange.high.toLocaleString()}</p>
        <p style="margin: 0; color: #64748b; font-size: 13px;">Timeline: ${data.estimate.timeline}</p>
      </div>
    ` : '';

    await resend.emails.send({
      from: `${BUSINESS_NAME} <${FROM_EMAIL}>`,
      replyTo: REPLY_TO_EMAIL,
      to: NOTIFY_EMAILS,
      subject: `New Quote Request - ${data.serviceType} from ${data.name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          ${headerHtml('New Quote Request')}
          <div style="padding: 24px;">
            ${estimateSection}
            <table style="width: 100%; border-collapse: collapse;">
              ${rowHtml('Name', data.name)}
              ${rowHtml('Email', data.email)}
              ${rowHtml('Phone', data.phone, true)}
              ${rowHtml('ZIP Code', data.zip)}
              ${rowHtml('Service', data.serviceType)}
              ${data.details ? rowHtml('Details', data.details) : ''}
            </table>
          </div>
          ${footerHtml()}
        </div>
      `,
    });

    await resend.emails.send({
      from: `${BUSINESS_NAME} <${FROM_EMAIL}>`,
      replyTo: REPLY_TO_EMAIL,
      to: data.email,
      subject: `Your Quote Request - ${BUSINESS_NAME}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          ${headerHtml('Quote Confirmation')}
          <div style="padding: 24px;">
            <p style="color: #1e293b; font-size: 16px; margin: 0 0 16px;">Hi ${data.name},</p>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">Thank you for requesting a quote for <strong>${data.serviceType}</strong>. We've received your request and our team will review it shortly.</p>
            ${estimateSection}
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">A member of our team will reach out within 24 hours to discuss your project in detail and provide a final estimate.</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="tel:${BUSINESS_PHONE.replace(/[^+\d]/g, '')}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Call Us: ${BUSINESS_PHONE}</a>
            </div>
            <p style="color: #475569; font-size: 14px; margin: 0;">Best regards,<br><strong>The ${BUSINESS_NAME} Team</strong></p>
          </div>
          ${footerHtml()}
        </div>
      `,
    });

    console.log(`[Email] Quote notification sent for ${data.name}`);
  } catch (err) {
    console.error('[Email] Failed to send quote notification:', err);
  }
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  try {
    const resend = await getResendClient();

    await resend.emails.send({
      from: `${BUSINESS_NAME} <${FROM_EMAIL}>`,
      replyTo: REPLY_TO_EMAIL,
      to: NOTIFY_EMAILS,
      subject: `New Contact Message from ${data.name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          ${headerHtml('New Contact Message')}
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              ${rowHtml('Name', data.name)}
              ${rowHtml('Email', data.email)}
              ${data.phone ? rowHtml('Phone', data.phone, true) : ''}
            </table>
            <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; margin: 16px 0; border-radius: 0 6px 6px 0;">
              <p style="color: #64748b; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; font-weight: 600;">Message</p>
              <p style="color: #1e293b; font-size: 14px; line-height: 1.6; margin: 0;">${data.message}</p>
            </div>
            <div style="text-align: center; margin: 16px 0;">
              <a href="mailto:${data.email}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Reply to ${data.name}</a>
            </div>
          </div>
          ${footerHtml()}
        </div>
      `,
    });

    await resend.emails.send({
      from: `${BUSINESS_NAME} <${FROM_EMAIL}>`,
      replyTo: REPLY_TO_EMAIL,
      to: data.email,
      subject: `We received your message - ${BUSINESS_NAME}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          ${headerHtml('Message Received')}
          <div style="padding: 24px;">
            <p style="color: #1e293b; font-size: 16px; margin: 0 0 16px;">Hi ${data.name},</p>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">Thank you for reaching out! We've received your message and will get back to you within 24 hours.</p>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">For urgent matters, don't hesitate to call us directly:</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="tel:${BUSINESS_PHONE.replace(/[^+\d]/g, '')}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Call Us: ${BUSINESS_PHONE}</a>
            </div>
            <p style="color: #475569; font-size: 14px; margin: 0;">Best regards,<br><strong>The ${BUSINESS_NAME} Team</strong></p>
          </div>
          ${footerHtml()}
        </div>
      `,
    });

    console.log(`[Email] Contact notification sent for ${data.name}`);
  } catch (err) {
    console.error('[Email] Failed to send contact notification:', err);
  }
}

export async function sendBookingNotification(data: {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}) {
  try {
    const resend = await getResendClient();

    await resend.emails.send({
      from: `${BUSINESS_NAME} <${FROM_EMAIL}>`,
      replyTo: REPLY_TO_EMAIL,
      to: NOTIFY_EMAILS,
      subject: `New Booking - ${data.serviceType} on ${data.preferredDate}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          ${headerHtml('New Booking Request')}
          <div style="padding: 24px;">
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 0 0 16px; text-align: center;">
              <p style="color: #166534; font-size: 16px; font-weight: 700; margin: 0 0 4px;">${data.preferredDate}</p>
              <p style="color: #15803d; font-size: 14px; margin: 0;">${data.preferredTime}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              ${rowHtml('Name', data.name)}
              ${rowHtml('Email', data.email)}
              ${rowHtml('Phone', data.phone, true)}
              ${rowHtml('Service', data.serviceType)}
              ${data.notes ? rowHtml('Notes', data.notes) : ''}
            </table>
          </div>
          ${footerHtml()}
        </div>
      `,
    });

    await resend.emails.send({
      from: `${BUSINESS_NAME} <${FROM_EMAIL}>`,
      replyTo: REPLY_TO_EMAIL,
      to: data.email,
      subject: `Booking Confirmation - ${BUSINESS_NAME}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          ${headerHtml('Booking Confirmed')}
          <div style="padding: 24px;">
            <p style="color: #1e293b; font-size: 16px; margin: 0 0 16px;">Hi ${data.name},</p>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">Your booking has been confirmed! Here are your appointment details:</p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 0 0 16px; text-align: center;">
              <p style="color: #166534; font-size: 18px; font-weight: 700; margin: 0 0 4px;">${data.preferredDate}</p>
              <p style="color: #15803d; font-size: 14px; margin: 0 0 8px;">${data.preferredTime}</p>
              <p style="color: #166534; font-size: 14px; font-weight: 600; margin: 0;">${data.serviceType}</p>
            </div>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">Our team will reach out to confirm the final details. If you need to reschedule, please call us:</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="tel:${BUSINESS_PHONE.replace(/[^+\d]/g, '')}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Call Us: ${BUSINESS_PHONE}</a>
            </div>
            <p style="color: #475569; font-size: 14px; margin: 0;">We look forward to serving you!<br><strong>The ${BUSINESS_NAME} Team</strong></p>
          </div>
          ${footerHtml()}
        </div>
      `,
    });

    console.log(`[Email] Booking notification sent for ${data.name}`);
  } catch (err) {
    console.error('[Email] Failed to send booking notification:', err);
  }
}

export async function sendPaymentNotification(data: {
  customerName: string;
  customerEmail: string;
  amount: number;
  serviceName: string;
  type: string;
}) {
  try {
    const resend = await getResendClient();
    const fmtAmount = data.amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
    const paymentLabel = data.type === "deposit" ? "Service Deposit" : "Consultation Fee";

    await resend.emails.send({
      from: `${BUSINESS_NAME} <${FROM_EMAIL}>`,
      replyTo: REPLY_TO_EMAIL,
      to: NOTIFY_EMAILS,
      subject: `Payment Received - ${fmtAmount} from ${data.customerName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          ${headerHtml('Payment Received')}
          <div style="padding: 24px;">
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 0 0 16px; text-align: center;">
              <p style="color: #166534; font-size: 24px; font-weight: 700; margin: 0 0 4px;">${fmtAmount}</p>
              <p style="color: #15803d; font-size: 14px; margin: 0;">${paymentLabel}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              ${rowHtml('Customer', data.customerName)}
              ${rowHtml('Email', data.customerEmail)}
              ${rowHtml('Service', data.serviceName)}
              ${rowHtml('Payment Type', paymentLabel)}
            </table>
          </div>
          ${footerHtml()}
        </div>
      `,
    });

    await resend.emails.send({
      from: `${BUSINESS_NAME} <${FROM_EMAIL}>`,
      replyTo: REPLY_TO_EMAIL,
      to: data.customerEmail,
      subject: `Payment Confirmation - ${BUSINESS_NAME}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          ${headerHtml('Payment Confirmed')}
          <div style="padding: 24px;">
            <p style="color: #1e293b; font-size: 16px; margin: 0 0 16px;">Hi ${data.customerName},</p>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">Your payment has been successfully processed. Here are your details:</p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 0 0 16px; text-align: center;">
              <p style="color: #166534; font-size: 24px; font-weight: 700; margin: 0 0 4px;">${fmtAmount}</p>
              <p style="color: #15803d; font-size: 14px; margin: 0 0 8px;">${paymentLabel} - ${data.serviceName}</p>
            </div>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">${data.type === "deposit" ? "Your deposit secures your service and locks in your pricing. Our team will reach out within 24 hours to schedule your project." : "Your consultation fee has been received. Our team will reach out to confirm your appointment details."}</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="tel:${BUSINESS_PHONE.replace(/[^+\d]/g, '')}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Call Us: ${BUSINESS_PHONE}</a>
            </div>
            <p style="color: #475569; font-size: 14px; margin: 0;">Thank you for choosing ${BUSINESS_NAME}!<br><strong>The ${BUSINESS_NAME} Team</strong></p>
          </div>
          ${footerHtml()}
        </div>
      `,
    });

    console.log(`[Email] Payment notification sent for ${data.customerName}`);
  } catch (err) {
    console.error('[Email] Failed to send payment notification:', err);
  }
}

export async function sendCallSummaryNotification(data: {
  callId: string;
  callerPhone?: string | null;
  duration?: number | null;
  summary?: string | null;
  transcript?: string | null;
  status: string;
  endedReason?: string | null;
  cost?: string | null;
}) {
  try {
    const resend = await getResendClient();

    const durationStr = data.duration
      ? `${Math.floor(data.duration / 60)}m ${data.duration % 60}s`
      : "N/A";

    let transcriptPreview = "";
    if (data.transcript) {
      try {
        const messages = JSON.parse(data.transcript);
        if (Array.isArray(messages)) {
          transcriptPreview = messages
            .filter((m: any) => m.role && m.message)
            .slice(0, 20)
            .map((m: any) => `<strong>${m.role === "assistant" ? "Viva Agent" : "Caller"}:</strong> ${m.message}`)
            .join("<br/><br/>");
        }
      } catch {
        transcriptPreview = data.transcript.slice(0, 1000);
      }
    }

    const transcriptSection = transcriptPreview ? `
      <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; margin: 16px 0; border-radius: 0 6px 6px 0;">
        <p style="color: #64748b; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; font-weight: 600;">Conversation Transcript</p>
        <div style="color: #1e293b; font-size: 13px; line-height: 1.8;">${transcriptPreview}</div>
      </div>
    ` : "";

    const summarySection = data.summary ? `
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <h3 style="margin: 0 0 8px; color: #1e40af; font-size: 16px;">Call Summary</h3>
        <p style="color: #1e293b; font-size: 14px; line-height: 1.6; margin: 0;">${data.summary}</p>
      </div>
    ` : "";

    await resend.emails.send({
      from: `${BUSINESS_NAME} <${FROM_EMAIL}>`,
      replyTo: REPLY_TO_EMAIL,
      to: NOTIFY_EMAILS,
      subject: `Voice Call ${data.status === "completed" ? "Completed" : data.status} - ${durationStr}${data.callerPhone ? ` from ${data.callerPhone}` : ""}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          ${headerHtml('24/7 Voice Agent Call Report')}
          <div style="padding: 24px;">
            <div style="background: ${data.status === "completed" ? "#f0fdf4" : "#fef2f2"}; border: 1px solid ${data.status === "completed" ? "#bbf7d0" : "#fecaca"}; border-radius: 8px; padding: 16px; margin: 0 0 16px; text-align: center;">
              <p style="color: ${data.status === "completed" ? "#166534" : "#991b1b"}; font-size: 18px; font-weight: 700; margin: 0 0 4px;">Call ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}</p>
              <p style="color: ${data.status === "completed" ? "#15803d" : "#b91c1c"}; font-size: 14px; margin: 0;">Duration: ${durationStr}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              ${rowHtml('Call ID', data.callId.slice(0, 20) + '...')}
              ${data.callerPhone ? rowHtml('Caller Phone', data.callerPhone) : ''}
              ${rowHtml('Duration', durationStr)}
              ${rowHtml('Status', data.status)}
              ${data.endedReason ? rowHtml('Ended Reason', data.endedReason) : ''}
              ${data.cost ? rowHtml('Cost', '$' + data.cost) : ''}
            </table>
            ${summarySection}
            ${transcriptSection}
          </div>
          ${footerHtml()}
        </div>
      `,
    });

    console.log(`[Email] Call summary sent for call ${data.callId}`);
  } catch (err) {
    console.error('[Email] Failed to send call summary:', err);
  }
}
