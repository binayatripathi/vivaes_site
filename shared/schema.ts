import { z } from "zod";

export const servicesList = [
  {
    slug: "solar-storage",
    title: "Solar & Storage",
    shortDescription: "Harness clean energy with premium solar panel installations and battery storage systems.",
    description: "Our union-trained solar technicians design and install high-efficiency photovoltaic systems for residential and commercial properties. We pair panels with cutting-edge battery storage solutions to maximize your energy independence and savings. From initial consultation to final inspection, we handle every detail with precision.",
    icon: "Sun",
    image: "/images/service-solar.png",
  },
  {
    slug: "ev-chargers",
    title: "EV Chargers",
    shortDescription: "Level 2 and DC fast charging installations for homes and businesses.",
    description: "Stay ahead of the electric vehicle revolution with professionally installed charging stations. We install Level 2 home chargers, commercial fleet charging systems, and DC fast chargers. Our team handles permitting, electrical upgrades, and network configuration for a turnkey EV charging solution.",
    icon: "Zap",
    image: "/images/service-ev.png",
  },
  {
    slug: "panel-upgrades",
    title: "Panel Upgrades",
    shortDescription: "Modernize your electrical panel to handle today's power demands safely.",
    description: "Outdated electrical panels can be a fire hazard and limit your home's capacity for modern appliances, EV chargers, and solar systems. Our licensed electricians upgrade panels from 100A to 200A or 400A, ensuring your system meets current code requirements and supports your growing electrical needs.",
    icon: "CircuitBoard",
    image: "/images/service-panel.png",
  },
  {
    slug: "lighting-retrofits",
    title: "Lighting Retrofits",
    shortDescription: "Upgrade to energy-efficient LED lighting and smart controls.",
    description: "Transform your space with modern LED lighting that cuts energy costs by up to 75%. We retrofit commercial offices, warehouses, parking structures, and residential properties with high-quality LED fixtures, smart controls, and daylight harvesting systems. Enjoy better light quality and significant utility savings.",
    icon: "Lightbulb",
    image: "/images/service-lighting.png",
  },
  {
    slug: "general-electrical",
    title: "General Electrical",
    shortDescription: "Full-service electrical work from repairs to new construction wiring.",
    description: "From troubleshooting electrical issues to complete rewiring projects, our journeyman electricians handle it all. We provide code-compliant installations, repairs, and maintenance for residential and commercial properties. Services include outlet installation, circuit additions, surge protection, and safety inspections.",
    icon: "Wrench",
    image: "/images/service-general.png",
  },
  {
    slug: "commercial",
    title: "Commercial",
    shortDescription: "Large-scale electrical and solar solutions for commercial properties.",
    description: "We specialize in commercial-grade electrical and solar installations that meet the demanding requirements of business operations. Our services include tenant improvements, new construction wiring, emergency power systems, data center infrastructure, and large-scale solar arrays with monitoring systems.",
    icon: "Building2",
    image: "/images/service-commercial.png",
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
