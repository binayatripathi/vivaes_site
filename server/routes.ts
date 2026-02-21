import type { Express } from "express";
import { createServer, type Server } from "http";
import { quoteRequestSchema, contactFormSchema, bookingRequestSchema } from "@shared/schema";

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
      await forwardToWebhook("quote", { service: data.serviceType, details: data.details, customer: { name: data.name, email: data.email, phone: data.phone, zip: data.zip } });
      res.json({ success: true, message: "Quote request received successfully." });
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Invalid request" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const data = contactFormSchema.parse(req.body);
      await forwardToWebhook("contact", { customer: { name: data.name, email: data.email, phone: data.phone }, message: data.message });
      res.json({ success: true, message: "Message received. We'll get back to you soon." });
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Invalid request" });
    }
  });

  app.post("/api/booking", async (req, res) => {
    try {
      const data = bookingRequestSchema.parse(req.body);
      await forwardToWebhook("booking", { service: data.serviceType, preferredDate: data.preferredDate, preferredTime: data.preferredTime, notes: data.notes, customer: { name: data.name, email: data.email, phone: data.phone } });
      res.json({ success: true, message: "Booking confirmed. Check your email for details." });
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Invalid request" });
    }
  });

  app.post("/api/stripe/create-checkout", async (req, res) => {
    res.status(501).json({ error: "Stripe integration not configured yet. Connect your Stripe account to enable payments." });
  });

  return httpServer;
}
