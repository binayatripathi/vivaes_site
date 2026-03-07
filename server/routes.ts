import type { Express } from "express";
import { createServer, type Server } from "http";
import { quoteRequestSchema, contactFormSchema, bookingRequestSchema, leadStatuses, appointmentStatuses } from "@shared/schema";
import { sendQuoteNotification, sendContactNotification, sendBookingNotification, sendPaymentNotification } from "./email";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { storage } from "./storage";
import { z } from "zod";

const CONSULTATION_FEE = 75;

const checkoutSchema = z.object({
  type: z.enum(["deposit", "consultation"]),
  amount: z.number().min(1),
  serviceName: z.string().min(1),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  description: z.string().optional(),
});

const notifiedSessions = new Set<string>();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const CLAW_WEBHOOK_URL = process.env.VIVA_CLAW_WEBHOOK_URL || "";
  const CLAW_TOKEN = process.env.VIVA_CLAW_TOKEN || "";

  async function forwardToWebhook(type: string, payload: unknown) {
    if (!CLAW_WEBHOOK_URL || CLAW_WEBHOOK_URL.includes("example.com")) {
      console.log(`[Webhook] Would forward ${type} to webhook:`, JSON.stringify(payload).slice(0, 200));
      return { success: true, message: "Received (webhook not configured)" };
    }

    try {
      const res = await fetch(CLAW_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Claw-Token": CLAW_TOKEN,
          "X-Claw-Type": type,
        },
        body: JSON.stringify({ type, ...(payload as Record<string, unknown>) }),
      });

      if (!res.ok) {
        console.error(`[Webhook] Error: ${res.status} ${res.statusText}`);
      }

      return { success: true };
    } catch (err) {
      console.error("[Webhook] Forward error:", err);
      return { success: true };
    }
  }

  app.post("/api/quote", async (req, res) => {
    try {
      const data = quoteRequestSchema.parse(req.body);
      const estimate = req.body.estimate;

      try {
        await storage.createLead({
          name: data.name,
          phone: data.phone,
          email: data.email,
          zip: data.zip,
          serviceType: data.serviceType,
          details: data.details,
          source: "web-form",
          status: "new",
        });
      } catch (dbErr) {
        console.error("[DB] Failed to save quote lead:", dbErr);
      }

      await forwardToWebhook("quote", { service: data.serviceType, details: data.details, customer: { name: data.name, email: data.email, phone: data.phone, zip: data.zip } });
      sendQuoteNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        zip: data.zip,
        serviceType: data.serviceType,
        details: data.details,
        estimate,
      });
      res.json({ success: true, message: "Quote request received successfully." });
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Invalid request" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const data = contactFormSchema.parse(req.body);

      try {
        await storage.createLead({
          name: data.name,
          phone: data.phone || "",
          email: data.email,
          serviceType: "general-inquiry",
          details: data.message,
          source: "web-form",
          status: "new",
        });
      } catch (dbErr) {
        console.error("[DB] Failed to save contact lead:", dbErr);
      }

      await forwardToWebhook("contact", { customer: { name: data.name, email: data.email, phone: data.phone }, message: data.message });
      sendContactNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      });
      res.json({ success: true, message: "Message received. We'll get back to you soon." });
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Invalid request" });
    }
  });

  app.post("/api/booking", async (req, res) => {
    try {
      const data = bookingRequestSchema.parse(req.body);

      let leadId: string | undefined;
      try {
        const lead = await storage.createLead({
          name: data.name,
          phone: data.phone,
          email: data.email,
          serviceType: data.serviceType,
          source: "web-form",
          status: "booked",
        });
        leadId = lead.leadId;
      } catch (dbErr) {
        console.error("[DB] Failed to save booking lead:", dbErr);
      }

      try {
        await storage.createAppointment({
          leadId: leadId || null,
          name: data.name,
          phone: data.phone,
          email: data.email,
          serviceType: data.serviceType,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          notes: data.notes,
          status: "pending",
        });
      } catch (dbErr) {
        console.error("[DB] Failed to save booking appointment:", dbErr);
      }

      await forwardToWebhook("booking", { service: data.serviceType, preferredDate: data.preferredDate, preferredTime: data.preferredTime, notes: data.notes, customer: { name: data.name, email: data.email, phone: data.phone } });
      sendBookingNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        serviceType: data.serviceType,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        notes: data.notes,
      });
      res.json({ success: true, message: "Booking confirmed. Check your email for details." });
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Invalid request" });
    }
  });

  app.get("/api/stripe/publishable-key", async (_req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (err: any) {
      res.status(500).json({ error: "Stripe not configured" });
    }
  });

  app.post("/api/stripe/create-checkout", async (req, res) => {
    try {
      const data = checkoutSchema.parse(req.body);
      const stripe = await getUncachableStripeClient();

      const BUSINESS_NAME = process.env.VIVA_BUSINESS_NAME || "Viva Electric & Solar Inc.";
      const finalAmount = data.type === "consultation" ? CONSULTATION_FEE : data.amount;
      const amountInCents = Math.round(finalAmount * 100);

      const depositPercent = data.type === "deposit" ? "20%" : "";
      const description = data.type === "deposit"
        ? `${depositPercent} deposit for ${data.serviceName} - ${BUSINESS_NAME}`
        : `Consultation fee for ${data.serviceName} - ${BUSINESS_NAME}`;

      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: data.customerEmail,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: amountInCents,
              product_data: {
                name: data.type === "deposit"
                  ? `Service Deposit - ${data.serviceName}`
                  : `Consultation Fee - ${data.serviceName}`,
                description,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          type: data.type,
          serviceName: data.serviceName,
          customerName: data.customerName,
          customerPhone: data.customerPhone || '',
        },
        success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/payment/cancel`,
      });

      res.json({ url: session.url });
    } catch (err: any) {
      console.error('[Stripe] Checkout error:', err);
      res.status(500).json({ error: err.message || "Failed to create checkout session" });
    }
  });

  app.get("/api/stripe/session/:sessionId", async (req, res) => {
    try {
      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
      const responseData = {
        status: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total ? session.amount_total / 100 : 0,
        serviceName: session.metadata?.serviceName || '',
        type: session.metadata?.type || '',
        customerName: session.metadata?.customerName || '',
      };

      if (session.payment_status === 'paid' && session.customer_email && !notifiedSessions.has(req.params.sessionId)) {
        notifiedSessions.add(req.params.sessionId);
        sendPaymentNotification({
          customerName: session.metadata?.customerName || 'Customer',
          customerEmail: session.customer_email,
          amount: responseData.amountTotal,
          serviceName: responseData.serviceName,
          type: responseData.type,
        });
      }

      res.json(responseData);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to retrieve session" });
    }
  });

  app.get("/api/admin/leads", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const leads = await storage.getLeads(status ? { status } : undefined);
      res.json(leads);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch leads" });
    }
  });

  app.get("/api/admin/leads/:id", async (req, res) => {
    try {
      const lead = await storage.getLeadById(req.params.id);
      if (!lead) return res.status(404).json({ error: "Lead not found" });
      res.json(lead);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch lead" });
    }
  });

  app.patch("/api/admin/leads/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || !leadStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${leadStatuses.join(", ")}` });
      }
      const lead = await storage.updateLeadStatus(req.params.id, status);
      if (!lead) return res.status(404).json({ error: "Lead not found" });
      res.json(lead);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to update lead" });
    }
  });

  app.get("/api/admin/appointments", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const appointments = await storage.getAppointments(status ? { status } : undefined);
      res.json(appointments);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch appointments" });
    }
  });

  app.patch("/api/admin/appointments/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || !appointmentStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${appointmentStatuses.join(", ")}` });
      }
      const appointment = await storage.updateAppointmentStatus(req.params.id, status);
      if (!appointment) return res.status(404).json({ error: "Appointment not found" });
      res.json(appointment);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to update appointment" });
    }
  });

  app.get("/api/admin/stats", async (_req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch stats" });
    }
  });

  return httpServer;
}
