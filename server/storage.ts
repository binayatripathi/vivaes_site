import { db } from "./db";
import { leads, appointments, callLogs, reviews, type Lead, type Appointment, type CallLog, type InsertLead, type InsertAppointment, type InsertCallLog, type InsertReview, type Review } from "@shared/schema";
import { eq, desc, and, gte, sql, isNull, isNotNull } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface IStorage {
  createLead(data: InsertLead): Promise<Lead>;
  getLeads(filters?: { status?: string }): Promise<Lead[]>;
  getLeadById(leadId: string): Promise<Lead | null>;
  updateLeadStatus(leadId: string, status: string): Promise<Lead | null>;
  createAppointment(data: InsertAppointment): Promise<Appointment>;
  getAppointments(filters?: { status?: string }): Promise<Appointment[]>;
  getAppointmentById(bookingId: string): Promise<Appointment | null>;
  updateAppointmentStatus(bookingId: string, status: string): Promise<Appointment | null>;
  createCallLog(data: InsertCallLog): Promise<CallLog>;
  getCallLogs(limit?: number): Promise<CallLog[]>;
  getCallLogById(callId: string): Promise<CallLog | null>;
  getStats(): Promise<{ totalLeads: number; newLeadsToday: number; pendingAppointments: number; completedJobs: number; totalCalls: number }>;
  createReview(data: InsertReview): Promise<Review>;
  getReviews(filters?: { source?: string; approved?: boolean; verified?: boolean }): Promise<Review[]>;
  getReviewById(id: number): Promise<Review | null>;
  getReviewByToken(token: string): Promise<Review | null>;
  verifyReview(token: string): Promise<Review | null>;
  approveReview(id: number): Promise<Review | null>;
  rejectReview(id: number): Promise<boolean>;
  deleteReview(id: number): Promise<boolean>;
  getPendingReviews(): Promise<Review[]>;
  seedTestimonials(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createLead(data: InsertLead): Promise<Lead> {
    const leadId = `ld_${nanoid(12)}`;
    const [lead] = await db.insert(leads).values({ ...data, leadId }).returning();
    return lead;
  }

  async getLeads(filters?: { status?: string }): Promise<Lead[]> {
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(leads.status, filters.status));
    }
    return db.select().from(leads)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(leads.createdAt));
  }

  async getLeadById(leadId: string): Promise<Lead | null> {
    const [lead] = await db.select().from(leads).where(eq(leads.leadId, leadId));
    return lead || null;
  }

  async updateLeadStatus(leadId: string, status: string): Promise<Lead | null> {
    const [lead] = await db.update(leads)
      .set({ status, updatedAt: new Date() })
      .where(eq(leads.leadId, leadId))
      .returning();
    return lead || null;
  }

  async createAppointment(data: InsertAppointment): Promise<Appointment> {
    const bookingId = `bk_${nanoid(12)}`;
    const [appointment] = await db.insert(appointments).values({ ...data, bookingId }).returning();
    return appointment;
  }

  async getAppointments(filters?: { status?: string }): Promise<Appointment[]> {
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(appointments.status, filters.status));
    }
    return db.select().from(appointments)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(appointments.createdAt));
  }

  async getAppointmentById(bookingId: string): Promise<Appointment | null> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.bookingId, bookingId));
    return appointment || null;
  }

  async updateAppointmentStatus(bookingId: string, status: string): Promise<Appointment | null> {
    const [appointment] = await db.update(appointments)
      .set({ status, updatedAt: new Date() })
      .where(eq(appointments.bookingId, bookingId))
      .returning();
    return appointment || null;
  }

  async createCallLog(data: InsertCallLog): Promise<CallLog> {
    const [log] = await db.insert(callLogs).values(data).returning();
    return log;
  }

  async getCallLogs(limit: number = 50): Promise<CallLog[]> {
    return db.select().from(callLogs)
      .orderBy(desc(callLogs.createdAt))
      .limit(limit);
  }

  async getCallLogById(callId: string): Promise<CallLog | null> {
    const [log] = await db.select().from(callLogs).where(eq(callLogs.callId, callId));
    return log || null;
  }

  async getStats(): Promise<{ totalLeads: number; newLeadsToday: number; pendingAppointments: number; completedJobs: number; totalCalls: number }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalResult] = await db.select({ count: sql<number>`count(*)` }).from(leads);
    const [newTodayResult] = await db.select({ count: sql<number>`count(*)` }).from(leads)
      .where(and(eq(leads.status, "new"), gte(leads.createdAt, today)));
    const [pendingResult] = await db.select({ count: sql<number>`count(*)` }).from(appointments)
      .where(eq(appointments.status, "pending"));
    const [completedResult] = await db.select({ count: sql<number>`count(*)` }).from(appointments)
      .where(eq(appointments.status, "completed"));

    const [callsResult] = await db.select({ count: sql<number>`count(*)` }).from(callLogs);

    return {
      totalLeads: Number(totalResult.count),
      newLeadsToday: Number(newTodayResult.count),
      pendingAppointments: Number(pendingResult.count),
      completedJobs: Number(completedResult.count),
      totalCalls: Number(callsResult.count),
    };
  }

  async createReview(data: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(data).returning();
    return review;
  }

  async getReviews(filters?: { source?: string; approved?: boolean; verified?: boolean }): Promise<Review[]> {
    const conditions = [];
    if (filters?.source) conditions.push(eq(reviews.source, filters.source));
    if (filters?.approved !== undefined) conditions.push(eq(reviews.approved, filters.approved));
    if (filters?.verified !== undefined) conditions.push(eq(reviews.verified, filters.verified));
    return db.select().from(reviews)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewById(id: number): Promise<Review | null> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review || null;
  }

  async getReviewByToken(token: string): Promise<Review | null> {
    const [review] = await db.select().from(reviews).where(eq(reviews.verificationToken, token));
    return review || null;
  }

  async verifyReview(token: string): Promise<Review | null> {
    const [existing] = await db.select().from(reviews)
      .where(eq(reviews.verificationToken, token))
      .limit(1);
    if (!existing || existing.verified) return null;
    if (existing.verificationExpiresAt && existing.verificationExpiresAt < new Date()) return null;
    const [review] = await db.update(reviews)
      .set({ verified: true, verificationToken: null, verificationExpiresAt: null, updatedAt: new Date() })
      .where(eq(reviews.verificationToken, token))
      .returning();
    return review || null;
  }

  async approveReview(id: number): Promise<Review | null> {
    const [review] = await db.update(reviews)
      .set({ approved: true, updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning();
    return review || null;
  }

  async rejectReview(id: number): Promise<boolean> {
    const result = await db.delete(reviews).where(eq(reviews.id, id));
    return true;
  }

  async deleteReview(id: number): Promise<boolean> {
    await db.delete(reviews).where(eq(reviews.id, id));
    return true;
  }

  async getPendingReviews(): Promise<Review[]> {
    return db.select().from(reviews)
      .where(and(eq(reviews.verified, true), eq(reviews.approved, false), eq(reviews.source, "native")))
      .orderBy(desc(reviews.createdAt));
  }

  async seedTestimonials(): Promise<void> {
    const existing = await db.select({ count: sql<number>`count(*)` }).from(reviews)
      .where(and(eq(reviews.source, "native"), eq(reviews.approved, true)));
    if (Number(existing[0].count) > 0) return;

    const seeds = [
      { name: "Sarah M.", comment: "Viva Electric installed our solar system and it's been amazing. Our electricity bill dropped by 80% in the first month. The team was professional, on time, and cleaned up perfectly.", rating: 5 },
      { name: "James R.", comment: "We needed a complete lighting retrofit for our 50,000 sq ft warehouse. Viva's team completed the job ahead of schedule and our energy costs are down 60%. Highly recommend.", rating: 5 },
      { name: "Maria L.", comment: "Viva handles all our electrical needs across 12 properties. Their 24/7 availability and union-trained technicians give us peace of mind. Best electrical contractor we've worked with.", rating: 5 },
      { name: "David K.", comment: "Got my panel upgraded to 200A and two EV chargers installed. The crew was knowledgeable about the latest code requirements and the work passed inspection first try.", rating: 5 },
      { name: "Linda T.", comment: "After a kitchen fire damaged our electrical system, Viva Electric got us back up and running in record time. They coordinated with the inspector and made the process seamless.", rating: 5 },
    ];

    for (const seed of seeds) {
      await db.insert(reviews).values({
        name: seed.name,
        comment: seed.comment,
        rating: seed.rating,
        source: "native",
        verified: true,
        approved: true,
      });
    }
  }
}

export const storage = new DatabaseStorage();
