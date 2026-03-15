import { z } from "zod";
import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const servicesList = [
  {
    slug: "solar-storage",
    title: "Solar & Storage",
    shortDescription: "Harness clean energy with premium solar panel installations and battery storage systems.",
    description: "Our union-trained solar technicians design and install high-efficiency photovoltaic systems for residential and commercial properties. We pair panels with cutting-edge battery storage solutions to maximize your energy independence and savings. From initial consultation to final inspection, we handle every detail with precision.",
    icon: "Sun",
    image: "/images/services/solar-storage.png",
  },
  {
    slug: "ev-chargers",
    title: "EV Chargers",
    shortDescription: "Level 2 and DC fast charging installations for homes and businesses.",
    description: "Stay ahead of the electric vehicle revolution with professionally installed charging stations. We install Level 2 home chargers, commercial fleet charging systems, and DC fast chargers. Our team handles permitting, electrical upgrades, and network configuration for a turnkey EV charging solution.",
    icon: "Zap",
    image: "/images/services/ev-chargers.png",
  },
  {
    slug: "panel-upgrades",
    title: "Panel Upgrades",
    shortDescription: "Modernize your electrical panel to handle today's power demands safely.",
    description: "Outdated electrical panels can be a fire hazard and limit your home's capacity for modern appliances, EV chargers, and solar systems. Our licensed electricians upgrade panels from 100A to 200A or 400A, ensuring your system meets current code requirements and supports your growing electrical needs.",
    icon: "CircuitBoard",
    image: "/images/services/panel-upgrades.png",
  },
  {
    slug: "lighting-retrofits",
    title: "Lighting Retrofits",
    shortDescription: "Upgrade to energy-efficient LED lighting and smart controls.",
    description: "Transform your space with modern LED lighting that cuts energy costs by up to 75%. We retrofit commercial offices, warehouses, parking structures, and residential properties with high-quality LED fixtures, smart controls, and daylight harvesting systems. Enjoy better light quality and significant utility savings.",
    icon: "Lightbulb",
    image: "/images/services/lighting-retrofits.jpg",
  },
  {
    slug: "general-electrical",
    title: "General Electrical",
    shortDescription: "Full-service electrical work from repairs to new construction wiring.",
    description: "From troubleshooting electrical issues to complete rewiring projects, our journeyman electricians handle it all. We provide code-compliant installations, repairs, and maintenance for residential and commercial properties. Services include outlet installation, circuit additions, surge protection, and safety inspections.",
    icon: "Wrench",
    image: "/images/services/general-electrical.jpg",
  },
  {
    slug: "commercial",
    title: "Commercial",
    shortDescription: "Large-scale electrical and solar solutions for commercial properties.",
    description: "We specialize in commercial-grade electrical and solar installations that meet the demanding requirements of business operations. Our services include tenant improvements, new construction wiring, emergency power systems, data center infrastructure, and large-scale solar arrays with monitoring systems.",
    icon: "Building2",
    image: "/images/services/commercial.jpg",
  },
  {
    slug: "battery-addon",
    title: "Battery Storage Add-On (Existing Solar)",
    shortDescription: "Add battery storage to your existing solar system for energy independence.",
    description: "Already have solar panels? Add a battery storage system to store excess energy and power your home during outages or peak rate hours. We install Enphase, Tesla Powerwall, FranklinWH, and other top brands. Maximize your existing solar investment with seamless integration.",
    icon: "Battery",
    image: "/images/services/battery-addon.png",
  },
  {
    slug: "solar-battery-new",
    title: "Solar + Battery System (New)",
    shortDescription: "Complete new solar panel and battery storage installation.",
    description: "Go solar with a fully integrated solar panel and battery storage system from day one. We design, permit, and install complete photovoltaic systems paired with premium battery solutions for maximum energy independence and savings.",
    icon: "Sun",
    image: "/images/services/solar-battery-new.jpg",
  },
  {
    slug: "reroofing-solar",
    title: "Re-Roofing + Panel Removal/Reinstall",
    shortDescription: "Need a new roof? We remove and reinstall your solar panels safely.",
    description: "When it's time for a new roof, your solar panels need professional removal and reinstallation. We carefully detach your panels, coordinate with your roofer, and reinstall everything to manufacturer specifications with updated wiring and optimized placement.",
    icon: "Home",
    image: "/images/services/reroofing-solar.jpg",
  },
  {
    slug: "electrification-assessment",
    title: "Electrification Assessment (Free)",
    shortDescription: "Free assessment to plan your home's electrification journey.",
    description: "Get a comprehensive, no-cost evaluation of your home's electrification potential. We assess your electrical panel, appliances, and energy usage to create a personalized roadmap for transitioning to all-electric. Includes rebate and incentive guidance for federal, state, and utility programs.",
    icon: "ClipboardCheck",
    image: "/images/services/electrification-assessment.jpg",
  },
  {
    slug: "warehouse-commercial",
    title: "Warehouse / Commercial Electrical",
    shortDescription: "Heavy-duty electrical solutions for warehouses and commercial facilities.",
    description: "Specialized electrical services for warehouses, distribution centers, and large commercial facilities. We handle 3-phase power installations, industrial lighting, high-amperage circuits, loading dock power, and facility-wide electrical infrastructure upgrades.",
    icon: "Warehouse",
    image: "/images/services/warehouse-commercial.jpg",
  },
  {
    slug: "battery-only",
    title: "Battery Backup Install (No Solar)",
    shortDescription: "Standalone battery backup for grid resilience and outage protection.",
    description: "Protect your home or business from power outages with a standalone battery backup system — no solar panels required. We install Tesla Powerwall, Enphase IQ Battery, FranklinWH, and other leading systems that charge from the grid during off-peak hours and provide seamless backup power when you need it most.",
    icon: "Battery",
    image: "/images/services/battery-addon.png",
  },
  {
    slug: "electrical-solar-prep",
    title: "Electrical Prep for Solar",
    shortDescription: "Get your electrical system ready for a future solar installation.",
    description: "Planning to go solar soon? We prepare your home's electrical infrastructure so your solar installer can hit the ground running. This includes panel capacity assessment, sub-panel installation, conduit routing, grounding upgrades, and any wiring needed to ensure your system is solar-ready and code-compliant.",
    icon: "Wrench",
    image: "/images/services/panel-upgrades.png",
  },
  {
    slug: "ev-panel-battery",
    title: "EV Charger + Panel Upgrade + Battery",
    shortDescription: "Complete package: EV charger, panel upgrade, and battery backup in one project.",
    description: "The ultimate home energy upgrade — bundle an EV charger installation with a panel upgrade and battery backup system. We coordinate all three in a single project to minimize disruption, reduce permit costs, and ensure your entire electrical system works together seamlessly. Ideal for homeowners going all-electric.",
    icon: "Zap",
    image: "/images/services/ev-chargers.png",
  },
] as const;

export type Service = (typeof servicesList)[number];

export const quoteRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  zip: z.string().min(5, "Please enter a valid ZIP code"),
  serviceType: z.string().min(1, "Please select a service type"),
  details: z.string().optional(),
});

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;

export const propertyTypes = ["Residential", "Commercial", "Industrial"] as const;
export const projectSizes = ["Small", "Medium", "Large"] as const;
export const urgencyLevels = ["Standard (2-4 weeks)", "Priority (1-2 weeks)", "Emergency (ASAP)"] as const;

export const chargerLevels = ["Level 1 (120V / 15A)", "Level 2 (240V / 30A)", "Level 2 (240V / 50A)", "Level 2 (240V / 60A)"] as const;
export const wiringDistances = ["Short (under 25 ft)", "Medium (25-75 ft)", "Long (75+ ft)"] as const;
export const panelUpgradeOptions = ["No panel upgrade needed", "100A to 200A upgrade", "200A to 400A upgrade"] as const;
export const batteryCountOptions = ["1 battery (5 kWh)", "2 batteries (10 kWh)", "3+ batteries (15+ kWh)"] as const;

export interface ServiceSpecificOptions {
  chargerLevel?: string;
  wiringDistance?: string;
  panelUpgrade?: string;
  batteryCount?: string;
}

export interface QuoteEstimate {
  serviceTitle: string;
  propertyType: string;
  projectSize: string;
  urgency: string;
  laborCost: number;
  materialsCost: number;
  equipmentCost: number;
  sitePrepCost: number;
  permitFees: number;
  subtotal: number;
  discount: number;
  total: number;
  estimateRange: { low: number; high: number };
  timeline: string;
  notes: string[];
}

interface ServicePricingConfig {
  labor: { base: number; perUnit: number };
  materials: { base: number; perUnit: number };
  equipment: { base: number; perUnit: number };
  sitePrep: { base: number; perUnit: number };
  permit: { base: number; inspectionFee: number };
  timeline: { small: string; medium: string; large: string };
}

const servicePricingV2: Record<string, ServicePricingConfig> = {
  "solar-storage": {
    labor: { base: 2800, perUnit: 180 },
    materials: { base: 4500, perUnit: 350 },
    equipment: { base: 6000, perUnit: 500 },
    sitePrep: { base: 800, perUnit: 200 },
    permit: { base: 350, inspectionFee: 175 },
    timeline: { small: "3-5 days", medium: "1-2 weeks", large: "2-4 weeks" },
  },
  "ev-chargers": {
    labor: { base: 450, perUnit: 350 },
    materials: { base: 250, perUnit: 180 },
    equipment: { base: 600, perUnit: 500 },
    sitePrep: { base: 150, perUnit: 200 },
    permit: { base: 125, inspectionFee: 75 },
    timeline: { small: "4-6 hours", medium: "1 day", large: "1-2 days" },
  },
  "panel-upgrades": {
    labor: { base: 1200, perUnit: 400 },
    materials: { base: 800, perUnit: 600 },
    equipment: { base: 1200, perUnit: 800 },
    sitePrep: { base: 300, perUnit: 150 },
    permit: { base: 200, inspectionFee: 150 },
    timeline: { small: "4-6 hours", medium: "1 day", large: "1-2 days" },
  },
  "lighting-retrofits": {
    labor: { base: 600, perUnit: 120 },
    materials: { base: 400, perUnit: 200 },
    equipment: { base: 300, perUnit: 150 },
    sitePrep: { base: 100, perUnit: 50 },
    permit: { base: 75, inspectionFee: 75 },
    timeline: { small: "4-6 hours", medium: "1-2 days", large: "2-5 days" },
  },
  "general-electrical": {
    labor: { base: 250, perUnit: 150 },
    materials: { base: 100, perUnit: 100 },
    equipment: { base: 50, perUnit: 50 },
    sitePrep: { base: 50, perUnit: 25 },
    permit: { base: 50, inspectionFee: 50 },
    timeline: { small: "2-4 hours", medium: "4-8 hours", large: "1-2 days" },
  },
  "commercial": {
    labor: { base: 5000, perUnit: 2500 },
    materials: { base: 6000, perUnit: 3500 },
    equipment: { base: 5500, perUnit: 3000 },
    sitePrep: { base: 1500, perUnit: 800 },
    permit: { base: 500, inspectionFee: 350 },
    timeline: { small: "1-2 weeks", medium: "3-6 weeks", large: "6-12 weeks" },
  },
  "battery-addon": {
    labor: { base: 1200, perUnit: 600 },
    materials: { base: 800, perUnit: 400 },
    equipment: { base: 5500, perUnit: 4500 },
    sitePrep: { base: 400, perUnit: 200 },
    permit: { base: 200, inspectionFee: 150 },
    timeline: { small: "1 day", medium: "1-2 days", large: "2-4 days" },
  },
  "solar-battery-new": {
    labor: { base: 3500, perUnit: 250 },
    materials: { base: 5000, perUnit: 400 },
    equipment: { base: 10000, perUnit: 800 },
    sitePrep: { base: 1000, perUnit: 300 },
    permit: { base: 400, inspectionFee: 200 },
    timeline: { small: "1-2 weeks", medium: "2-4 weeks", large: "4-6 weeks" },
  },
  "reroofing-solar": {
    labor: { base: 1500, perUnit: 100 },
    materials: { base: 400, perUnit: 80 },
    equipment: { base: 200, perUnit: 50 },
    sitePrep: { base: 600, perUnit: 150 },
    permit: { base: 150, inspectionFee: 100 },
    timeline: { small: "1 day", medium: "1-2 days", large: "2-3 days" },
  },
  "electrification-assessment": {
    labor: { base: 0, perUnit: 0 },
    materials: { base: 0, perUnit: 0 },
    equipment: { base: 0, perUnit: 0 },
    sitePrep: { base: 0, perUnit: 0 },
    permit: { base: 0, inspectionFee: 0 },
    timeline: { small: "1 hour", medium: "1-2 hours", large: "2-3 hours" },
  },
  "warehouse-commercial": {
    labor: { base: 6000, perUnit: 3000 },
    materials: { base: 7000, perUnit: 4000 },
    equipment: { base: 6500, perUnit: 3500 },
    sitePrep: { base: 2000, perUnit: 1000 },
    permit: { base: 600, inspectionFee: 400 },
    timeline: { small: "2-4 weeks", medium: "4-8 weeks", large: "8-14 weeks" },
  },
  "battery-only": {
    labor: { base: 1000, perUnit: 500 },
    materials: { base: 600, perUnit: 300 },
    equipment: { base: 5000, perUnit: 4200 },
    sitePrep: { base: 350, perUnit: 150 },
    permit: { base: 175, inspectionFee: 125 },
    timeline: { small: "1 day", medium: "1-2 days", large: "2-3 days" },
  },
  "electrical-solar-prep": {
    labor: { base: 900, perUnit: 300 },
    materials: { base: 500, perUnit: 250 },
    equipment: { base: 400, perUnit: 200 },
    sitePrep: { base: 250, perUnit: 100 },
    permit: { base: 150, inspectionFee: 100 },
    timeline: { small: "4-6 hours", medium: "1 day", large: "1-2 days" },
  },
  "ev-panel-battery": {
    labor: { base: 2800, perUnit: 900 },
    materials: { base: 1800, perUnit: 700 },
    equipment: { base: 7200, perUnit: 5000 },
    sitePrep: { base: 600, perUnit: 350 },
    permit: { base: 350, inspectionFee: 200 },
    timeline: { small: "2-3 days", medium: "3-5 days", large: "1-2 weeks" },
  },
};

export function generateQuoteEstimate(
  serviceSlug: string,
  propertyType: string,
  projectSize: string,
  urgency: string,
  serviceOptions?: ServiceSpecificOptions,
): QuoteEstimate {
  const pricing = servicePricingV2[serviceSlug] || servicePricingV2["general-electrical"];
  const service = servicesList.find(s => s.slug === serviceSlug);

  const propertyMultiplier = propertyType === "Commercial" ? 1.35 : propertyType === "Industrial" ? 1.7 : 1.0;
  const unitCount = projectSize === "Medium" ? 2.2 : projectSize === "Large" ? 4.0 : 1.0;
  const urgencyMultiplier = urgency.includes("Priority") ? 1.15 : urgency.includes("Emergency") ? 1.4 : 1.0;

  let chargerAmperageFactor = 1.0;
  if (serviceOptions?.chargerLevel) {
    if (serviceOptions.chargerLevel.includes("60A")) chargerAmperageFactor = 1.45;
    else if (serviceOptions.chargerLevel.includes("50A")) chargerAmperageFactor = 1.25;
    else if (serviceOptions.chargerLevel.includes("30A")) chargerAmperageFactor = 1.0;
    else if (serviceOptions.chargerLevel.includes("15A")) chargerAmperageFactor = 0.7;
  }

  let wiringDistanceFactor = 1.0;
  if (serviceOptions?.wiringDistance) {
    if (serviceOptions.wiringDistance.includes("Long")) wiringDistanceFactor = 1.6;
    else if (serviceOptions.wiringDistance.includes("Medium")) wiringDistanceFactor = 1.25;
  }

  let panelUpgradeCost = 0;
  if (serviceOptions?.panelUpgrade) {
    if (serviceOptions.panelUpgrade.includes("400A")) panelUpgradeCost = 5500;
    else if (serviceOptions.panelUpgrade.includes("200A")) panelUpgradeCost = 2800;
  }

  let batteryCountFactor = 1.0;
  if (serviceOptions?.batteryCount) {
    if (serviceOptions.batteryCount.includes("3+")) batteryCountFactor = 2.6;
    else if (serviceOptions.batteryCount.includes("2 batt")) batteryCountFactor = 1.8;
  }

  const isEVService = ["ev-chargers", "ev-panel-battery"].includes(serviceSlug);
  const isBatteryService = ["battery-addon", "battery-only", "solar-battery-new", "ev-panel-battery"].includes(serviceSlug);

  const evLabor = isEVService ? chargerAmperageFactor : 1.0;
  const evMaterials = isEVService ? chargerAmperageFactor * wiringDistanceFactor : 1.0;
  const evSitePrep = wiringDistanceFactor;
  const batteryEquip = isBatteryService ? batteryCountFactor : 1.0;

  const laborCost = Math.round(
    (pricing.labor.base + pricing.labor.perUnit * unitCount) * propertyMultiplier * urgencyMultiplier * evLabor
  );
  const materialsCost = Math.round(
    (pricing.materials.base + pricing.materials.perUnit * unitCount) * propertyMultiplier * evMaterials
  );
  const equipmentCost = Math.round(
    (pricing.equipment.base + pricing.equipment.perUnit * unitCount) * batteryEquip
  );
  const sitePrepCost = Math.round(
    (pricing.sitePrep.base + pricing.sitePrep.perUnit * unitCount) * propertyMultiplier * evSitePrep
  );
  const permitFees = Math.round(
    (pricing.permit.base + pricing.permit.inspectionFee) * propertyMultiplier
    + (panelUpgradeCost > 0 ? 150 : 0)
  );

  const subtotal = laborCost + materialsCost + equipmentCost + sitePrepCost + permitFees + panelUpgradeCost;
  const discount = projectSize === "Large" ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal - discount;

  const varianceLow = serviceSlug.includes("solar") || serviceSlug.includes("battery") || serviceSlug === "ev-panel-battery" ? 0.88 : 0.90;
  const varianceHigh = serviceSlug.includes("solar") || serviceSlug.includes("battery") || serviceSlug === "ev-panel-battery" ? 1.18 : 1.12;

  const timelineKey = projectSize === "Large" ? "large" : projectSize === "Medium" ? "medium" : "small";

  const notes: string[] = [
    "Free on-site consultation included",
    "All work performed by union-trained, licensed electricians",
    "Full warranty on labor and materials",
    "Final pricing subject to site verification, walkthrough, and local code conditions",
  ];
  if (discount > 0) notes.push("5% volume discount applied");
  if (urgency.includes("Emergency")) notes.push("Emergency surcharge included for expedited service");
  if (propertyType === "Commercial" || propertyType === "Industrial") notes.push("Commercial-grade equipment and materials included");
  if (isBatteryService) notes.push("Battery equipment pricing varies by brand and capacity selected");
  if (serviceSlug.includes("solar") || serviceSlug === "electrical-solar-prep") notes.push("Solar-related permits may require utility interconnection approval");
  if (serviceOptions?.chargerLevel) notes.push(`Charger spec: ${serviceOptions.chargerLevel}`);
  if (serviceOptions?.wiringDistance && serviceOptions.wiringDistance.includes("Long")) notes.push("Extended wiring run adds to materials and site prep costs");
  if (panelUpgradeCost > 0) notes.push(`Includes panel upgrade (${serviceOptions?.panelUpgrade}) — adds ~$${panelUpgradeCost.toLocaleString()} to materials + $150 permit`);
  if (serviceOptions?.batteryCount && !serviceOptions.batteryCount.includes("1 batt")) notes.push(`Multi-battery install: ${serviceOptions.batteryCount}`);

  return {
    serviceTitle: service?.title || "Electrical Service",
    propertyType,
    projectSize,
    urgency,
    laborCost,
    materialsCost: materialsCost + panelUpgradeCost,
    equipmentCost,
    sitePrepCost,
    permitFees,
    subtotal,
    discount,
    total,
    estimateRange: { low: Math.round(total * varianceLow), high: Math.round(total * varianceHigh) },
    timeline: pricing.timeline[timelineKey],
    notes,
  };
}

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactForm = z.infer<typeof contactFormSchema>;

export const bookingRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  serviceType: z.string().min(1, "Please select a service type"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  notes: z.string().optional(),
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;

export const serviceAreas = {
  "SF / Peninsula": [
    "San Francisco", "Daly City", "South San Francisco", "San Bruno",
    "Millbrae", "Burlingame", "San Mateo", "Redwood City", "Palo Alto",
  ],
  "Alameda County (510)": [
    "Oakland", "Berkeley", "Fremont", "Hayward", "San Leandro",
    "Castro Valley", "Livermore", "Pleasanton", "Newark", "Union City",
    "Alameda", "Emeryville",
  ],
  "San Joaquin Valley (209)": [
    "Stockton", "Tracy", "Modesto", "Manteca", "Lodi",
    "Turlock", "Merced", "Lathrop", "Ripon", "Escalon",
  ],
} as const;

export type ServiceAreaRegion = keyof typeof serviceAreas;

export const leadStatuses = ["new", "contacted", "quoted", "booked", "completed", "lost"] as const;
export const appointmentStatuses = ["pending", "confirmed", "completed", "cancelled"] as const;
export const leadSources = ["web-form", "vapi-phone", "vapi-chat"] as const;

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  leadId: text("lead_id").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address"),
  city: text("city"),
  zip: text("zip"),
  serviceType: text("service_type").notNull(),
  propertyType: text("property_type"),
  urgency: text("urgency"),
  projectSize: text("project_size"),
  details: text("details"),
  source: text("source").notNull().default("web-form"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  leadId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  bookingId: text("booking_id").notNull().unique(),
  leadId: text("lead_id"),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  serviceType: text("service_type").notNull(),
  preferredDate: text("preferred_date").notNull(),
  preferredTime: text("preferred_time").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  bookingId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export const callLogStatuses = ["completed", "failed", "missed", "no-answer"] as const;

export const callLogs = pgTable("call_logs", {
  id: serial("id").primaryKey(),
  callId: text("call_id").notNull().unique(),
  assistantId: text("assistant_id"),
  callerPhone: text("caller_phone"),
  duration: integer("duration"),
  summary: text("summary"),
  transcript: text("transcript"),
  status: text("status").notNull().default("completed"),
  endedReason: text("ended_reason"),
  cost: text("cost"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCallLogSchema = createInsertSchema(callLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertCallLog = z.infer<typeof insertCallLogSchema>;
export type CallLog = typeof callLogs.$inferSelect;

export const zipToRegion: Record<string, string> = {};
const sfPeninsulaZips = [
  ...Array.from({ length: 33 }, (_, i) => String(94102 + i)),
  "94014", "94015", "94016", "94017",
  "94010", "94011",
  "94401", "94402", "94403", "94404",
  "94061", "94062", "94063",
  "94301", "94302", "94303", "94304", "94305", "94306",
  "94030", "94066",
];
const alamedaZips = [
  ...Array.from({ length: 21 }, (_, i) => String(94601 + i)),
  ...Array.from({ length: 9 }, (_, i) => String(94702 + i)),
  "94536", "94537", "94538", "94539",
  "94541", "94542", "94543", "94544", "94545", "94546",
  "94550", "94551",
  "94566", "94567", "94568",
  "94560",
  "94587",
  "94501", "94502",
  "94608",
  "94577", "94578", "94579",
  "94580",
];
const sanJoaquinZips = [
  ...Array.from({ length: 15 }, (_, i) => String(95201 + i)),
  "95376", "95377", "95378",
  ...Array.from({ length: 9 }, (_, i) => String(95350 + i)),
  "95336", "95337",
  "95240", "95241", "95242",
  "95380", "95381", "95382",
  ...Array.from({ length: 9 }, (_, i) => String(95340 + i)),
  "95330", "95366", "95320",
];
sfPeninsulaZips.forEach(z => { zipToRegion[z] = "SF / Peninsula"; });
alamedaZips.forEach(z => { zipToRegion[z] = "Alameda County (510)"; });
sanJoaquinZips.forEach(z => { zipToRegion[z] = "San Joaquin Valley (209)"; });

const cityToRegionMap: Record<string, string> = {};
Object.entries(serviceAreas).forEach(([region, cities]) => {
  cities.forEach(city => {
    cityToRegionMap[city.toLowerCase()] = region;
  });
});

export function getRegionByZip(zip: string): string | null {
  return zipToRegion[zip] || null;
}

export function getRegionByCity(city: string): string | null {
  return cityToRegionMap[city.toLowerCase().trim()] || null;
}

export const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Homeowner",
    content: "Viva Electric installed our solar system and it's been amazing. Our electricity bill dropped by 80% in the first month. The team was professional, on time, and cleaned up perfectly.",
    rating: 5,
  },
  {
    id: 2,
    name: "James R.",
    role: "Business Owner",
    content: "We needed a complete lighting retrofit for our 50,000 sq ft warehouse. Viva's team completed the job ahead of schedule and our energy costs are down 60%. Highly recommend.",
    rating: 5,
  },
  {
    id: 3,
    name: "Maria L.",
    role: "Property Manager",
    content: "Viva handles all our electrical needs across 12 properties. Their 24/7 availability and union-trained technicians give us peace of mind. Best electrical contractor we've worked with.",
    rating: 5,
  },
  {
    id: 4,
    name: "David K.",
    role: "Homeowner",
    content: "Got my panel upgraded to 200A and two EV chargers installed. The crew was knowledgeable about the latest code requirements and the work passed inspection first try.",
    rating: 5,
  },
  {
    id: 5,
    name: "Linda T.",
    role: "Restaurant Owner",
    content: "After a kitchen fire damaged our electrical system, Viva Electric got us back up and running in record time. They coordinated with the inspector and made the process seamless.",
    rating: 5,
  },
] as const;
