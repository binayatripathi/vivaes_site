import { Resend } from 'resend';

const BUSINESS_NAME = process.env.VIVA_BUSINESS_NAME || "Viva Electric & Solar Inc.";
const BUSINESS_PHONE = process.env.VIVA_PHONE || "+1 (510) 710-5745";
const BUSINESS_EMAIL = process.env.VIVA_EMAIL || "roberto@vivaes.net";
const NOTIFY_EMAILS = process.env.VIVA_NOTIFY_EMAILS
  ? process.env.VIVA_NOTIFY_EMAILS.split(",").map(e => e.trim())
  : ["roberto@vivaes.net"];
const FROM_EMAIL = process.env.VIVA_FROM_EMAIL || "hello@vivaes.net";
const REPLY_TO_EMAIL = process.env.VIVA_EMAIL || "roberto@vivaes.net";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is required');
}

const resendClient = new Resend(RESEND_API_KEY);

async function getResendClient() {
  return resendClient;
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
}) {
  try {
    const resend = await getResendClient();

    await resend.emails.send({
      from: `${BUSINESS_NAME} <${FROM_EMAIL}>`,
      replyTo: REPLY_TO_EMAIL,
      to: NOTIFY_EMAILS,
      subject: `New Quote Request - ${data.serviceType} from ${data.name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          ${headerHtml('New Quote Request')}
          <div style="padding: 24px;">
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
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">A member of our team will reach out within 24 hours to discuss your project in detail and provide a custom quote.</p>
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

export async function sendInvoiceEmail(data: {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  reference: string;
  description: string;
  amount: number;
  stripePaymentUrl?: string;
}) {
  const resend = await getResendClient();
  const fmtAmount = data.amount.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
  const invoiceDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const stripePayButton = data.stripePaymentUrl ? `
    <div style="text-align: center; margin: 20px 0;">
      <a href="${data.stripePaymentUrl}" style="display: inline-block; background: #635bff; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; letter-spacing: 0.01em;">Pay Online Now</a>
      <p style="color: #64748b; font-size: 12px; margin: 8px 0 0;">Secure card payment powered by Stripe</p>
    </div>
  ` : '';

  const zelleSection = `
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 12px; color: #1e40af; font-size: 16px; font-weight: 700;">Pay via Zelle</h3>
      <p style="color: #475569; font-size: 14px; margin: 0 0 12px;">Send your deposit to any of the following Zelle contacts:</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px; font-weight: 600; width: 80px;">Phone:</td>
          <td style="padding: 6px 0; color: #1e293b; font-size: 14px;"><a href="tel:+15107068246" style="color: #2563eb; text-decoration: none; font-weight: 600;">+1 (510) 706-8246</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px; font-weight: 600;">Phone:</td>
          <td style="padding: 6px 0; color: #1e293b; font-size: 14px;"><a href="tel:+15107105745" style="color: #2563eb; text-decoration: none; font-weight: 600;">+1 (510) 710-5745</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px; font-weight: 600;">Email:</td>
          <td style="padding: 6px 0; color: #1e293b; font-size: 14px;"><a href="mailto:roberto@vivaes.net" style="color: #2563eb; text-decoration: none; font-weight: 600;">roberto@vivaes.net</a></td>
        </tr>
      </table>
      <p style="color: #475569; font-size: 13px; margin: 12px 0 0; font-style: italic;">Please include your name and invoice reference in the Zelle memo: <strong>${data.reference}</strong></p>
    </div>
  `;

  const servicesSection = `
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 4px; color: #1e293b; font-size: 16px; font-weight: 700;">Our Services</h3>
      <p style="color: #64748b; font-size: 13px; margin: 0 0 16px;">We're your full-service electrical and solar partner throughout the Bay Area &amp; Central Valley. Visit us at <a href="https://vivaes.net" style="color: #2563eb; text-decoration: none; font-weight: 600;">vivaes.net</a>.</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 5px 0; color: #1e293b; font-size: 14px;">&#9654; Solar &amp; Storage</td>
          <td style="padding: 5px 0; color: #1e293b; font-size: 14px;">&#9654; EV Chargers</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #1e293b; font-size: 14px;">&#9654; Panel Upgrades</td>
          <td style="padding: 5px 0; color: #1e293b; font-size: 14px;">&#9654; Battery Backup</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #1e293b; font-size: 14px;">&#9654; General Electrical</td>
          <td style="padding: 5px 0; color: #1e293b; font-size: 14px;">&#9654; Commercial Work</td>
        </tr>
      </table>
      <div style="text-align: center; margin: 16px 0 0;">
        <a href="https://vivaes.net" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Explore Our Services at vivaes.net</a>
      </div>
    </div>
  `;

  const clientHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      ${headerHtml('Deposit Invoice')}
      <div style="padding: 24px;">
        <p style="color: #1e293b; font-size: 16px; margin: 0 0 12px;">Hi ${data.clientName},</p>
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">Thank you for trusting Viva Electrical Solutions with your project — we're excited to work with you! Please find your deposit invoice details below. Submitting your deposit secures your spot on our schedule.</p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 0 0 20px; text-align: center;">
          <p style="color: #166534; font-size: 28px; font-weight: 700; margin: 0 0 4px;">${fmtAmount}</p>
          <p style="color: #15803d; font-size: 14px; margin: 0;">Deposit Due</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
          ${rowHtml('Invoice Date', invoiceDate)}
          ${rowHtml('Client', data.clientName)}
          ${rowHtml('Address', data.clientAddress)}
          ${rowHtml('Reference', data.reference)}
          ${data.description ? rowHtml('Description', data.description) : ''}
        </table>

        ${stripePayButton}
        ${zelleSection}
        ${servicesSection}

        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">We truly appreciate your business and look forward to delivering outstanding results. If you have any questions at all, please don't hesitate to reach out — we're always happy to help.</p>
        <p style="color: #1e293b; font-size: 14px; font-weight: 600; margin: 12px 0 0;">Warm regards,<br>The ${BUSINESS_NAME} Team</p>
      </div>
      ${footerHtml()}
    </div>
  `;

  const internalHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      ${headerHtml('Invoice Sent — Internal Copy')}
      <div style="padding: 24px;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 0 0 16px; text-align: center;">
          <p style="color: #166534; font-size: 24px; font-weight: 700; margin: 0 0 4px;">${fmtAmount}</p>
          <p style="color: #15803d; font-size: 14px; margin: 0;">Deposit Invoice Sent to ${data.clientName}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          ${rowHtml('Invoice Date', invoiceDate)}
          ${rowHtml('Client', data.clientName)}
          ${rowHtml('Email', data.clientEmail)}
          ${rowHtml('Phone', data.clientPhone, true)}
          ${rowHtml('Address', data.clientAddress)}
          ${rowHtml('Reference', data.reference)}
          ${data.description ? rowHtml('Description', data.description) : ''}
          ${data.stripePaymentUrl ? rowHtml('Stripe Payment Link', `<a href="${data.stripePaymentUrl}" style="color: #2563eb;">${data.stripePaymentUrl}</a>`) : ''}
        </table>
      </div>
      ${footerHtml()}
    </div>
  `;

  await resend.emails.send({
    from: `${BUSINESS_NAME} <${FROM_EMAIL}>`,
    replyTo: REPLY_TO_EMAIL,
    to: data.clientEmail,
    subject: `Deposit Invoice — ${fmtAmount} — ${data.reference}`,
    html: clientHtml,
  });

  await resend.emails.send({
    from: `${BUSINESS_NAME} <${FROM_EMAIL}>`,
    replyTo: REPLY_TO_EMAIL,
    to: NOTIFY_EMAILS,
    subject: `[Invoice Sent] ${fmtAmount} — ${data.clientName} — ${data.reference}`,
    html: internalHtml,
  });

  console.log(`[Email] Invoice sent to ${data.clientEmail} for ${fmtAmount}`);
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

export async function sendReviewVerificationEmail(data: {
  name: string;
  email: string;
  verificationUrl: string;
}) {
  try {
    const resend = await getResendClient();
    await resend.emails.send({
      from: `${BUSINESS_NAME} <${FROM_EMAIL}>`,
      replyTo: REPLY_TO_EMAIL,
      to: data.email,
      subject: `Please verify your review — ${BUSINESS_NAME}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          ${headerHtml('Verify Your Review')}
          <div style="padding: 24px;">
            <p style="color: #1e293b; font-size: 16px; margin: 0 0 16px;">Hi ${data.name},</p>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">Thank you for sharing your experience with ${BUSINESS_NAME}! Please click the button below to verify your review. Once verified, our team will review it and publish it shortly.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${data.verificationUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 16px;">Verify My Review</a>
            </div>
            <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0;">If you didn't submit a review, you can safely ignore this email. This link expires in 48 hours.</p>
          </div>
          ${footerHtml()}
        </div>
      `,
    });
    console.log(`[Email] Review verification sent to ${data.email}`);
  } catch (err) {
    console.error('[Email] Failed to send review verification:', err);
  }
}
