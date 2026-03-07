import { db } from "./db";
import { leads, appointments, type Lead, type Appointment, type InsertLead, type InsertAppointment } from "@shared/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
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
  getStats(): Promise<{ totalLeads: number; newLeadsToday: number; pendingAppointments: number; completedJobs: number }>;
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

  async getStats(): Promise<{ totalLeads: number; newLeadsToday: number; pendingAppointments: number; completedJobs: number }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalResult] = await db.select({ count: sql<number>`count(*)` }).from(leads);
    const [newTodayResult] = await db.select({ count: sql<number>`count(*)` }).from(leads)
      .where(and(eq(leads.status, "new"), gte(leads.createdAt, today)));
    const [pendingResult] = await db.select({ count: sql<number>`count(*)` }).from(appointments)
      .where(eq(appointments.status, "pending"));
    const [completedResult] = await db.select({ count: sql<number>`count(*)` }).from(appointments)
      .where(eq(appointments.status, "completed"));

    return {
      totalLeads: Number(totalResult.count),
      newLeadsToday: Number(newTodayResult.count),
      pendingAppointments: Number(pendingResult.count),
      completedJobs: Number(completedResult.count),
    };
  }
}

export const storage = new DatabaseStorage();
