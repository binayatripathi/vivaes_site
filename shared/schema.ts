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

export interface QuoteEstimate {
  serviceTitle: string;
  propertyType: string;
  projectSize: string;
  urgency: string;
  basePrice: number;
  laborCost: number;
  materialsCost: number;
  permitFees: number;
  subtotal: number;
  discount: number;
  total: number;
  estimateRange: { low: number; high: number };
  timeline: string;
  notes: string[];
}

export const servicePricing: Record<string, { base: number; labor: number; materials: number; permit: number; timeline: string }> = {
  "solar-storage": { base: 8000, labor: 4000, materials: 12000, permit: 800, timeline: "2-4 weeks" },
  "ev-chargers": { base: 1200, labor: 800, materials: 1500, permit: 200, timeline: "1-2 days" },
  "panel-upgrades": { base: 2000, labor: 1500, materials: 2500, permit: 400, timeline: "1-2 days" },
  "lighting-retrofits": { base: 1500, labor: 1000, materials: 2000, permit: 150, timeline: "1-3 days" },
  "general-electrical": { base: 500, labor: 400, materials: 300, permit: 100, timeline: "1 day" },
  "commercial": { base: 10000, labor: 6000, materials: 15000, permit: 1200, timeline: "4-8 weeks" },
  "battery-addon": { base: 4000, labor: 2000, materials: 8000, permit: 500, timeline: "1-2 weeks" },
  "solar-battery-new": { base: 10000, labor: 5000, materials: 16000, permit: 1000, timeline: "3-6 weeks" },
  "reroofing-solar": { base: 2500, labor: 2000, materials: 1500, permit: 400, timeline: "2-3 days" },
  "electrification-assessment": { base: 0, labor: 0, materials: 0, permit: 0, timeline: "1-2 hours" },
  "warehouse-commercial": { base: 12000, labor: 8000, materials: 18000, permit: 1500, timeline: "6-12 weeks" },
};

export function generateQuoteEstimate(
  serviceSlug: string,
  propertyType: string,
  projectSize: string,
  urgency: string,
): QuoteEstimate {
  const pricing = servicePricing[serviceSlug] || servicePricing["general-electrical"];
  const service = servicesList.find(s => s.slug === serviceSlug);

  const propertyMultiplier = propertyType === "Commercial" ? 1.4 : propertyType === "Industrial" ? 1.8 : 1.0;
  const sizeMultiplier = projectSize === "Medium" ? 1.5 : projectSize === "Large" ? 2.5 : 1.0;
  const urgencyMultiplier = urgency.includes("Priority") ? 1.2 : urgency.includes("Emergency") ? 1.5 : 1.0;

  const basePrice = Math.round(pricing.base * propertyMultiplier * sizeMultiplier);
  const laborCost = Math.round(pricing.labor * propertyMultiplier * sizeMultiplier * urgencyMultiplier);
  const materialsCost = Math.round(pricing.materials * sizeMultiplier);
  const permitFees = Math.round(pricing.permit * propertyMultiplier);

  const subtotal = basePrice + laborCost + materialsCost + permitFees;
  const discount = projectSize === "Large" ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal - discount;

  const notes: string[] = [
    "Free on-site consultation included",
    "All work performed by union-trained, licensed electricians",
    "Full warranty on labor and materials",
  ];
  if (discount > 0) notes.push("5% volume discount applied");
  if (urgency.includes("Emergency")) notes.push("Emergency surcharge included for expedited service");
  if (propertyType === "Commercial") notes.push("Commercial-grade equipment and materials");

  return {
    serviceTitle: service?.title || "Electrical Service",
    propertyType,
    projectSize,
    urgency,
    basePrice,
    laborCost,
    materialsCost,
    permitFees,
    subtotal,
    discount,
    total,
    estimateRange: { low: Math.round(total * 0.85), high: Math.round(total * 1.15) },
    timeline: pricing.timeline,
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
