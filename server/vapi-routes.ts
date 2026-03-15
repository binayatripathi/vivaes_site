import type { Express, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { storage } from "./storage";
import { generateQuoteEstimate, servicesList, getRegionByZip, getRegionByCity } from "@shared/schema";
import { sendQuoteNotification, sendBookingNotification } from "./email";

const VAPI_SERVER_SECRET = process.env.VAPI_SERVER_SECRET || "";

function vapiAuth(req: Request, res: Response, next: NextFunction) {
  const secret = req.headers["x-vapi-secret"] as string;
  if (!VAPI_SERVER_SECRET) {
    console.warn("[Vapi] VAPI_SERVER_SECRET not set, rejecting request");
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!secret || secret !== VAPI_SERVER_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

const validServiceSlugs: string[] = servicesList.map(s => s.slug);

const CLAW_WEBHOOK_URL = process.env.VIVA_CLAW_WEBHOOK_URL || "";
const CLAW_TOKEN = process.env.VIVA_CLAW_TOKEN || "";

async function forwardToWebhook(type: string, payload: unknown) {
  if (!CLAW_WEBHOOK_URL || CLAW_WEBHOOK_URL.includes("example.com")) {
    console.log(`[Vapi Webhook] Would forward ${type}:`, JSON.stringify(payload).slice(0, 200));
    return;
  }
  try {
    await fetch(CLAW_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Claw-Token": CLAW_TOKEN,
        "X-Claw-Type": type,
      },
      body: JSON.stringify({ type, ...(payload as Record<string, unknown>) }),
    });
  } catch (err) {
    console.error("[Vapi Webhook] Forward error:", err);
  }
}

const createLeadSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  serviceType: z.string().min(1),
  propertyType: z.string().optional(),
  urgency: z.string().optional(),
  projectSize: z.string().optional(),
  details: z.string().optional(),
});

const getQuoteSchema = z.object({
  serviceType: z.string().min(1),
  propertyType: z.string().default("Residential"),
  projectSize: z.string().default("Small"),
  urgency: z.string().default("Standard (2-4 weeks)"),
});

const bookAppointmentSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional(),
  serviceType: z.string().min(1),
  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1),
  notes: z.string().optional(),
  leadId: z.string().optional(),
});

const checkServiceAreaSchema = z.object({
  city: z.string().optional(),
  zip: z.string().optional(),
});

const transferSchema = z.object({
  reason: z.string().optional(),
  callerName: z.string().optional(),
  callerPhone: z.string().optional(),
  summary: z.string().optional(),
});

export function registerVapiRoutes(app: Express) {
  app.post("/api/vapi/create-lead", vapiAuth, async (req: Request, res: Response) => {
    try {
      const data = createLeadSchema.parse(req.body);

      const serviceSlug = validServiceSlugs.includes(data.serviceType)
        ? data.serviceType
        : "general-electrical";

      const lead = await storage.createLead({
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        address: data.address || null,
        city: data.city || null,
        zip: data.zip || null,
        serviceType: serviceSlug,
        propertyType: data.propertyType || null,
        urgency: data.urgency || null,
        projectSize: data.projectSize || null,
        details: data.details || null,
        source: "vapi-phone",
        status: "new",
      });

      sendQuoteNotification({
        name: data.name,
        email: data.email || "",
        phone: data.phone,
        zip: data.zip || "",
        serviceType: serviceSlug,
        details: data.details,
      });

      forwardToWebhook("vapi-lead", {
        leadId: lead.leadId,
        service: serviceSlug,
        customer: { name: data.name, phone: data.phone, email: data.email },
      });

      res.json({ success: true, leadId: lead.leadId, message: "Lead created successfully" });
    } catch (err: any) {
      console.error("[Vapi] create-lead error:", err);
      res.status(400).json({ error: err.message || "Invalid request" });
    }
  });

  app.post("/api/vapi/get-quote", vapiAuth, async (req: Request, res: Response) => {
    try {
      const data = getQuoteSchema.parse(req.body);

      const serviceSlug = validServiceSlugs.includes(data.serviceType)
        ? data.serviceType
        : "general-electrical";

      const estimate = generateQuoteEstimate(
        serviceSlug,
        data.propertyType,
        data.projectSize,
        data.urgency,
      );

      res.json({
        success: true,
        estimate: {
          serviceTitle: estimate.serviceTitle,
          total: estimate.total,
          estimateRange: estimate.estimateRange,
          timeline: estimate.timeline,
          breakdown: {
            laborCost: estimate.laborCost,
            materialsCost: estimate.materialsCost,
            equipmentCost: estimate.equipmentCost,
            sitePrepCost: estimate.sitePrepCost,
            permitFees: estimate.permitFees,
            discount: estimate.discount,
          },
          notes: estimate.notes,
        },
        disclaimer: "This is an automated estimate. Final pricing may vary based on site conditions and specific requirements. A free on-site consultation is included.",
      });
    } catch (err: any) {
      console.error("[Vapi] get-quote error:", err);
      res.status(400).json({ error: err.message || "Invalid request" });
    }
  });

  app.post("/api/vapi/book-appointment", vapiAuth, async (req: Request, res: Response) => {
    try {
      const data = bookAppointmentSchema.parse(req.body);

      const appointment = await storage.createAppointment({
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        serviceType: data.serviceType,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        notes: data.notes || null,
        leadId: data.leadId || null,
        status: "pending",
      });

      if (data.leadId) {
        await storage.updateLeadStatus(data.leadId, "booked");
      }

      sendBookingNotification({
        name: data.name,
        email: data.email || "",
        phone: data.phone,
        serviceType: data.serviceType,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        notes: data.notes,
      });

      forwardToWebhook("vapi-booking", {
        bookingId: appointment.bookingId,
        service: data.serviceType,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        customer: { name: data.name, phone: data.phone, email: data.email },
      });

      res.json({ success: true, bookingId: appointment.bookingId, message: "Appointment booked successfully" });
    } catch (err: any) {
      console.error("[Vapi] book-appointment error:", err);
      res.status(400).json({ error: err.message || "Invalid request" });
    }
  });

  app.post("/api/vapi/check-service-area", vapiAuth, async (req: Request, res: Response) => {
    try {
      const data = checkServiceAreaSchema.parse(req.body);

      let region: string | null = null;

      if (data.zip) {
        region = getRegionByZip(data.zip.trim());
      }

      if (!region && data.city) {
        region = getRegionByCity(data.city.trim());
      }

      if (region) {
        res.json({
          inServiceArea: true,
          region,
          message: `Great news! We serve the ${region} area. We can schedule a consultation at your convenience.`,
        });
      } else {
        res.json({
          inServiceArea: false,
          region: null,
          message: "We currently serve the San Francisco/Peninsula, Alameda County (510), and San Joaquin Valley (209) areas. Your location may be outside our standard service area, but please contact us to discuss your project.",
        });
      }
    } catch (err: any) {
      console.error("[Vapi] check-service-area error:", err);
      res.status(400).json({ error: err.message || "Invalid request" });
    }
  });

  app.post("/api/vapi/transfer", vapiAuth, async (req: Request, res: Response) => {
    try {
      const data = transferSchema.parse(req.body);

      try {
        await storage.createLead({
          name: data.callerName || "Transfer Caller",
          phone: data.callerPhone || "unknown",
          email: null,
          address: null,
          city: null,
          zip: null,
          serviceType: "general-electrical",
          propertyType: null,
          urgency: null,
          projectSize: null,
          details: `Transfer request - Reason: ${data.reason || "Not specified"}. Summary: ${data.summary || "No summary provided."}`,
          source: "vapi-phone",
          status: "new",
        });
      } catch (logErr) {
        console.error("[Vapi] Failed to log transfer:", logErr);
      }

      res.json({
        transferTo: "+15107105745",
        transferType: "warm",
        message: "Transferring you to Roberto now. Please hold.",
      });
    } catch (err: any) {
      console.error("[Vapi] transfer error:", err);
      res.status(400).json({ error: err.message || "Invalid request" });
    }
  });
}
