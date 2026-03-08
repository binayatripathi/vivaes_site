import type { Express } from "express";
import { createServer, type Server } from "http";
import { quoteRequestSchema, contactFormSchema, bookingRequestSchema, leadStatuses, appointmentStatuses } from "@shared/schema";
import { sendQuoteNotification, sendContactNotification, sendBookingNotification, sendPaymentNotification, sendCallSummaryNotification } from "./email";
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

  const VAPI_SERVER_SECRET = process.env.VAPI_SERVER_SECRET || "";

  app.post("/api/vapi/webhook", async (req, res) => {
    try {
      if (!VAPI_SERVER_SECRET) {
        console.warn("[Vapi] Webhook rejected: VAPI_SERVER_SECRET not configured");
        return res.status(503).json({ error: "Webhook not configured" });
      }

      const authHeader = req.headers["x-vapi-secret"] || req.headers["authorization"];
      const token = typeof authHeader === "string" ? authHeader.replace("Bearer ", "") : "";
      if (token !== VAPI_SERVER_SECRET) {
        console.warn("[Vapi] Unauthorized webhook attempt");
        return res.status(401).json({ error: "Unauthorized" });
      }

      const payload = req.body;
      const messageType = payload?.message?.type;

      if (messageType === "end-of-call-report") {
        const report = payload.message;

        const durationSeconds = report.durationSeconds || report.duration || null;
        const summary = report.summary || report.analysis?.summary || null;
        const endedReason = report.endedReason || null;
        const callerPhone = report.customer?.number || report.call?.customer?.number || null;
        const costStr = report.cost != null ? String(report.cost) : null;
        const callId = report.call?.id || report.callId || `vapi_${Date.now()}`;
        const assistantId = report.assistant?.id || report.assistantId || null;

        const rawStatus = report.status || endedReason || "completed";
        const statusMap: Record<string, string> = {
          "customer-ended-call": "completed",
          "assistant-ended-call": "completed",
          "silence-timed-out": "completed",
          "max-duration-reached": "completed",
          "customer-did-not-answer": "no-answer",
          "assistant-error": "failed",
          "pipeline-error-openai": "failed",
          "pipeline-error-deepgram": "failed",
          "voicemail": "missed",
        };
        const callStatus = statusMap[rawStatus] || (rawStatus === "completed" ? "completed" : "completed");

        let transcriptJson: string | null = null;
        if (report.transcript) {
          transcriptJson = typeof report.transcript === "string"
            ? report.transcript
            : JSON.stringify(report.transcript);
        } else if (report.messages && Array.isArray(report.messages)) {
          transcriptJson = JSON.stringify(
            report.messages
              .filter((m: any) => m.role && (m.message || m.content))
              .map((m: any) => ({ role: m.role, message: m.message || m.content }))
          );
        } else if (report.artifact?.messages && Array.isArray(report.artifact.messages)) {
          transcriptJson = JSON.stringify(
            report.artifact.messages
              .filter((m: any) => m.role && (m.message || m.content))
              .map((m: any) => ({ role: m.role, message: m.message || m.content }))
          );
        }

        const existingLog = await storage.getCallLogById(callId);
        if (existingLog) {
          console.log(`[Vapi] Duplicate call report ignored: ${callId}`);
          return res.json({ success: true, message: "Already processed" });
        }

        try {
          await storage.createCallLog({
            callId,
            assistantId,
            callerPhone,
            duration: durationSeconds,
            summary,
            transcript: transcriptJson,
            status: callStatus,
            endedReason,
            cost: costStr,
          });
          console.log(`[Vapi] Call log saved: ${callId}`);
        } catch (dbErr) {
          console.error("[Vapi] Failed to save call log:", dbErr);
          return res.json({ success: true, message: "Received (db error)" });
        }

        sendCallSummaryNotification({
          callId,
          callerPhone,
          duration: durationSeconds,
          summary,
          transcript: transcriptJson,
          status: callStatus,
          endedReason,
          cost: costStr,
        });

        return res.json({ success: true, message: "Call report processed" });
      }

      console.log(`[Vapi] Received event: ${messageType || "unknown"}`);
      return res.json({ success: true });
    } catch (err: any) {
      console.error("[Vapi] Webhook error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/call-logs", async (_req, res) => {
    try {
      const logs = await storage.getCallLogs(100);
      res.json(logs);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch call logs" });
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

  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(
      `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /payment/\n\nSitemap: https://vivaes.net/sitemap.xml`
    );
  });

  app.get("/sitemap.xml", (_req, res) => {
    const pages = [
      { loc: "/", priority: "1.0", changefreq: "weekly" },
      { loc: "/services", priority: "0.9", changefreq: "monthly" },
      { loc: "/services/solar-storage", priority: "0.8", changefreq: "monthly" },
      { loc: "/services/ev-chargers", priority: "0.8", changefreq: "monthly" },
      { loc: "/services/panel-upgrades", priority: "0.8", changefreq: "monthly" },
      { loc: "/services/lighting-retrofits", priority: "0.7", changefreq: "monthly" },
      { loc: "/services/general-electrical", priority: "0.8", changefreq: "monthly" },
      { loc: "/services/commercial", priority: "0.7", changefreq: "monthly" },
      { loc: "/services/battery-addon", priority: "0.8", changefreq: "monthly" },
      { loc: "/services/solar-battery-new", priority: "0.8", changefreq: "monthly" },
      { loc: "/services/reroofing-solar", priority: "0.7", changefreq: "monthly" },
      { loc: "/services/electrification-assessment", priority: "0.8", changefreq: "monthly" },
      { loc: "/services/warehouse-commercial", priority: "0.7", changefreq: "monthly" },
      { loc: "/quote", priority: "0.9", changefreq: "monthly" },
      { loc: "/booking", priority: "0.9", changefreq: "monthly" },
      { loc: "/electrification", priority: "0.7", changefreq: "monthly" },
      { loc: "/about", priority: "0.6", changefreq: "monthly" },
      { loc: "/solar-storage", priority: "0.8", changefreq: "monthly" },
    ];
    const today = new Date().toISOString().split("T")[0];
    const urls = pages
      .map(
        (p) =>
          `  <url>\n    <loc>https://vivaes.net${p.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
      )
      .join("\n");
    res.type("application/xml").send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
    );
  });

  return httpServer;
}
