import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageMeta } from "@/components/page-meta";
import { PgeRebateBanner } from "@/components/pge-rebate-banner";
import { EVITP_LABEL } from "@/lib/certifications";
import {
  Shield, Award, CheckCircle2, ChevronDown, Phone, Mail, ArrowRight,
  AlertTriangle, Star, Zap, CircuitBoard, Sun, Home, Clock, Users,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const trustBar = [
  { icon: Shield, label: "CA License #1147947" },
  { icon: Award, label: "Union Trained Electricians" },
  { icon: CheckCircle2, label: "Licensed & Insured" },
  { icon: Zap, label: EVITP_LABEL },
  { icon: Clock, label: "24/7 Available" },
];

const services = [
  {
    icon: CircuitBoard,
    title: "Panel Upgrades",
    description:
      "Upgrade your home's electrical panel from 100A to 200A or 400A to safely support EV chargers, solar, and modern appliances.",
    href: "/services/panel-upgrades",
    badge: null,
  },
  {
    icon: Sun,
    title: "Solar & Battery",
    description:
      "Cut your electricity bill with a rooftop solar system and battery backup — union-installed, permitted, and utility-coordinated.",
    href: "/solar-storage",
    badge: null,
  },
  {
    icon: Zap,
    title: "EV Chargers",
    description:
      "Level 2 home charging for all EV makes. We handle the permit, dedicated circuit, and any necessary panel work.",
    href: "/services/ev-chargers",
    badge: null,
  },
  {
    icon: Shield,
    title: "Insurance Compliance",
    description:
      "Has your insurer flagged your electrical panel? We inspect, correct, and document — so your coverage stays intact.",
    href: "/insurance-compliance",
    badge: { label: "High Priority", color: "amber" },
  },
  {
    icon: Home,
    title: "General Electrical",
    description:
      "Outlets, circuits, rewiring, safety inspections, and more. One call for all your home electrical needs.",
    href: "/services/general-electrical",
    badge: null,
  },
  {
    icon: Sun,
    title: "Electrification",
    description:
      "Replace gas with clean electric alternatives — heat pumps, induction ranges, and smart home upgrades.",
    href: "/electrification",
    badge: null,
  },
];

const stats = [
  { value: "15+", label: "Years of Experience" },
  { value: "500+", label: "Homes Served" },
  { value: "200+", label: "Solar Systems Installed" },
  { value: "100%", label: "Permitted & Inspected" },
];

const testimonials = [
  {
    name: "Sarah M.",
    initials: "SM",
    location: "Oakland, CA",
    jobPhoto: "/images/services/solar-storage.png",
    jobPhotoAlt: "Solar installation completed at Oakland home by Viva Electric",
    content:
      "Viva Electric installed our solar system and it's been amazing. Our electricity bill dropped by 80% in the first month. The team was professional, on time, and cleaned up perfectly.",
    rating: 5,
  },
  {
    name: "David K.",
    initials: "DK",
    location: "Fremont, CA",
    jobPhoto: "/images/services/ev-chargers.png",
    jobPhotoAlt: "EV charger and panel upgrade completed at Fremont home by Viva Electric",
    content:
      "Got my panel upgraded to 200A and two EV chargers installed. The crew was knowledgeable about the latest code requirements and the work passed inspection first try.",
    rating: 5,
  },
  {
    name: "Jennifer L.",
    initials: "JL",
    location: "San Leandro, CA",
    jobPhoto: "/images/services/panel-upgrades.png",
    jobPhotoAlt: "Electrical panel inspection completed for insurance compliance in San Leandro",
    content:
      "Roberto and his team handled our insurance panel inspection quickly and gave us all the documentation we needed for our carrier. Stress-free process from start to finish.",
    rating: 5,
  },
];

const faqData = [
  {
    question: "Do I need a permit for a panel upgrade in the Bay Area?",
    answer:
      "Yes. Panel upgrades require a permit from your local municipality. Viva Electric handles the permit application, scheduling inspections, and utility coordination so you don't have to. All work is signed off before we consider the job done.",
  },
  {
    question: "How long does a residential panel upgrade take?",
    answer:
      "Most panel upgrades are completed in one day — typically 4–8 hours. We schedule the utility shut-off window in advance and coordinate inspections to minimize downtime. More complex service upgrades may require a second visit for final inspection.",
  },
  {
    question: "What does solar installation cost for a San Francisco Bay Area home?",
    answer:
      "Residential solar system costs vary by home size, roof type, and energy usage. Most Bay Area systems range from $15,000–$35,000 before incentives. After the federal tax credit (30%) and California incentives, out-of-pocket cost drops significantly. We provide free estimates — no obligation.",
  },
  {
    question: "My insurer flagged my electrical panel. What do I do?",
    answer:
      "Contact us. We specialize in insurance-compliance electrical work. We inspect, document, correct, and provide a written report your carrier will accept. Don't wait — non-renewal notices have deadlines. Visit our Insurance Compliance page for full details.",
  },
  {
    question: "Can you install an EV charger in an older home?",
    answer:
      "Yes, in most cases. We assess your existing panel capacity and wiring. If a panel upgrade is needed, we can bundle both jobs for efficiency. Level 2 chargers require a dedicated 240V circuit — something we install every day.",
  },
  {
    question: "What areas do you serve for residential electrical work?",
    answer:
      "We serve the entire San Francisco Bay Area: Oakland, Berkeley, Fremont, Hayward, San Francisco, San Leandro, Richmond, Concord, Livermore, Pleasanton, Dublin, and surrounding communities. We also serve the Central Valley including Stockton, Tracy, and Modesto.",
  },
  {
    question: "Are your electricians union trained?",
    answer:
      "Yes. Our team is union-trained and holds California Contractor License #1147947. Union training means continuous education, strict safety standards, and a higher standard of workmanship on every job.",
  },
  {
    question: "Who installs EV chargers in Oakland and the East Bay?",
    answer:
      "Viva Electric & Solar Inc. installs Level 2 EV chargers throughout Oakland and the East Bay, including Berkeley, Fremont, Hayward, San Leandro, Concord, and Livermore. We hold California C-10 Electrical Contractor License #1147947 and handle the dedicated circuit, permit, and any required panel upgrade as part of the installation.",
  },
  {
    question: "How do I know if my home's electrical panel needs upgrading?",
    answer:
      "Your panel likely needs upgrading if it's rated at 100 amps or less, you're adding high-draw equipment (solar, EV charger, heat pump), breakers trip frequently, your home has a Zinsco or Federal Pacific panel, or your insurer has flagged it. We offer free assessments — a licensed electrician visits your home, evaluates the panel, and gives you a written recommendation with no obligation.",
  },
  {
    question: "What is a whole-home electrification assessment?",
    answer:
      "A whole-home electrification assessment is a comprehensive review of your home's current energy systems with the goal of replacing gas appliances and equipment with clean electric alternatives — including heat pumps, induction ranges, electric water heaters, and EV chargers. We evaluate your panel capacity, wiring, and utility connection to create a phased plan that maximizes efficiency and qualifies for available incentives.",
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How an Electrical Panel Upgrade Works — Bay Area Home",
  "description": "Step-by-step overview of a residential electrical panel upgrade (100A to 200A or 400A) by Viva Electric & Solar Inc., a licensed California C-10 electrical contractor (CSLB #1147947) serving the San Francisco Bay Area.",
  "totalTime": "P1D",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "minValue": "2000",
    "maxValue": "6000",
    "description": "Typical range for 200A panel upgrade in the Bay Area"
  },
  "supply": [
    { "@type": "HowToSupply", "name": "New main electrical panel (200A or 400A)" },
    { "@type": "HowToSupply", "name": "Circuit breakers" },
    { "@type": "HowToSupply", "name": "Conduit, wire, and grounding hardware" },
    { "@type": "HowToSupply", "name": "Main breaker and disconnect" }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Free Assessment & Proposal",
      "text": "A licensed electrician visits your home to assess your current panel's amperage, condition, and capacity for new loads (solar, EV charger, heat pump). We check the meter base, service entry wiring, and grounding. You receive a written proposal with itemized scope and pricing.",
      "url": "https://vivaes.net/residential"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Permit Application",
      "text": "We submit a permit application to your local building department. Panel upgrades require a permit in all Bay Area jurisdictions. We coordinate with PG&E (or your local utility) to schedule a service shut-off window — typically a 4-hour window on the day of installation.",
      "url": "https://vivaes.net/residential"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Installation Day",
      "text": "On the scheduled day, we disconnect power through the utility, remove the old panel, and install the new panel with updated wiring, breakers, and grounding. Most 200A panel upgrades are completed in 4–8 hours. Power is restored the same day once work is complete.",
      "url": "https://vivaes.net/residential"
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Inspection",
      "text": "A city or county building inspector visits to verify the installation meets NEC code and local requirements. We attend the inspection and address any corrections on the spot. Most of our panel upgrades pass inspection on the first visit.",
      "url": "https://vivaes.net/residential"
    },
    {
      "@type": "HowToStep",
      "position": 5,
      "name": "Documentation & Sign-Off",
      "text": "After the inspection is finaled, we provide you with permit documentation and a written summary of work completed. This paperwork is accepted by insurance carriers, solar installers, and real estate transactions as proof of compliant, permitted electrical work.",
      "url": "https://vivaes.net/residential"
    }
  ]
};

export default function ResidentialPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <PageMeta
        title="Residential Electrician Bay Area | Solar, EV Chargers & Panel Upgrades"
        description="Bay Area residential electrician — panel upgrades, solar installation, EV chargers, and insurance compliance. Licensed, union-trained. CA Lic #1147947. Free estimates."
        canonical="https://vivaes.net/residential"
        ogTitle="Residential Electrical Services | Viva Electric & Solar Bay Area"
        ogDescription="Union-trained residential electricians serving Oakland, Berkeley, Fremont & the entire SF Bay Area. Solar, EV chargers, panel upgrades, insurance compliance."
        ogImage="https://vivaes.net/images/services/panel-upgrades.png"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Viva Electric & Solar Inc.",
              description:
                "Licensed residential electrician serving San Francisco Bay Area homeowners. Panel upgrades, solar, EV chargers, insurance compliance. CA License #1147947.",
              url: "https://vivaes.net/residential",
              telephone: "+15107105745",
              email: "Roberto@vivaes.net",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Oakland",
                addressRegion: "CA",
                addressCountry: "US",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 37.8044,
                longitude: -122.2712,
              },
              areaServed: [
                "Oakland", "Berkeley", "Fremont", "Hayward", "San Francisco",
                "San Leandro", "Richmond", "Concord", "Livermore", "Pleasanton",
                "Stockton", "Tracy", "Modesto",
              ],
              hasCredential: "CA Electrical Contractor License #1147947",
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
              },
            },
            howToJsonLd,
          ]),
        }}
      />

      <section
        className="relative flex min-h-[75vh] items-center overflow-hidden bg-slate-900"
        data-testid="section-residential-hero"
      >
        <div className="absolute inset-0">
          <img
            src="/images/services/panel-upgrades.png"
            alt="Electrician performing residential panel upgrade in Bay Area home"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/50" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-2xl space-y-6"
          >
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              <Badge className="border border-amber-400/30 bg-amber-400/10 text-amber-300">
                <Home className="mr-1 h-3 w-3" /> For SF Bay Area Homeowners
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
              data-testid="text-residential-hero-title"
            >
              Residential Electrical Services — Bay Area's Trusted Electricians
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg leading-relaxed text-white/80 sm:text-xl"
              data-testid="text-residential-hero-sub"
            >
              Panel upgrades, solar, EV chargers, and insurance compliance — done right, permitted, and backed by CA License #1147947.
            </motion.p>

            <motion.p variants={fadeUp} className="text-base text-white/70">
              From a simple circuit repair to a full solar + battery system, Viva Electric & Solar handles every job for SF Bay Area homeowners with union-trained electricians, transparent pricing, and zero hassle on permits.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
              <Link href="/quote">
                <Button size="lg" data-testid="button-residential-quote">
                  Get Instant Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/booking">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                  data-testid="button-residential-book"
                >
                  Book an Appointment
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col gap-1 pt-2 text-sm text-white/60">
              <a href="mailto:Roberto@vivaes.net" className="flex items-center gap-2 transition-colors hover:text-white/90">
                <Mail className="h-4 w-4" /> Roberto@vivaes.net
              </a>
              <a href="tel:5107105745" className="flex items-center gap-2 transition-colors hover:text-white/90">
                <Phone className="h-4 w-4" /> (510) 710-5745
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-card py-10" data-testid="section-residential-trust">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {trustBar.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 text-center"
                  data-testid={`badge-residential-trust-${badge.label.toLowerCase().replace(/[\s#]+/g, "-")}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium leading-snug">{badge.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PgeRebateBanner />

      <section className="bg-background py-20" data-testid="section-residential-services">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-residential-services-title">
                Services for Bay Area Homeowners
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Everything your home needs — from routine repairs to full electrification — by union-trained, licensed electricians.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <motion.div key={service.title} variants={fadeUp}>
                    <Link href={service.href}>
                      <Card
                        className="group h-full cursor-pointer transition-all duration-200 hover-elevate"
                        data-testid={`card-residential-service-${service.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <CardContent className="flex h-full flex-col p-6">
                          {service.badge && (
                            <Badge className="mb-3 w-fit border border-amber-400/30 bg-amber-400/10 text-amber-600 dark:text-amber-400">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              {service.badge.label}
                            </Badge>
                          )}
                          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="mb-2 text-lg font-semibold">{service.title}</h3>
                          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                            {service.description}
                          </p>
                          <div className="mt-4 flex items-center text-sm font-medium text-primary">
                            Learn more
                            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-muted py-20" data-testid="section-residential-credentials">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-12 lg:grid-cols-2"
          >
            <motion.div variants={fadeUp} className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-3">About Roberto & the Team</Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-residential-credentials-title">
                  Bay Area's Electrician You Can Trust
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Roberto founded Viva Electric & Solar with one goal: do the work right the first time. Every job is permitted, every installation is inspected, and every homeowner gets a clear explanation of what was done and why.
                </p>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Our team is union-trained — meaning continuous education, strict safety practices, and a commitment to quality that comes from within the trade. CA License #1147947.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  "C-10 Licensed Electrical Contractor — CA License #1147947",
                  "Union-trained journeyman electricians",
                  "Fully licensed, bonded, and insured",
                  "Permit & utility coordination on every job",
                  "Serving Bay Area homeowners for 15+ years",
                  "Written documentation provided after every job",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a href="tel:5107105745">
                  <Button data-testid="button-residential-call">
                    <Phone className="mr-2 h-4 w-4" /> (510) 710-5745
                  </Button>
                </a>
                <a href="mailto:Roberto@vivaes.net">
                  <Button variant="outline" data-testid="button-residential-email">
                    <Mail className="mr-2 h-4 w-4" /> Roberto@vivaes.net
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border bg-background p-6 text-center"
                    data-testid={`stat-residential-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <p className="text-4xl font-bold text-primary">{stat.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-card py-20" data-testid="section-residential-testimonials">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-residential-testimonials-title">
                What Bay Area Homeowners Say
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Real reviews from homeowners across Oakland, Fremont, San Leandro, and surrounding communities.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <Card
                    className="h-full overflow-hidden"
                    data-testid={`card-residential-testimonial-${i}`}
                  >
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={t.jobPhoto}
                        alt={t.jobPhotoAlt}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        data-testid={`img-residential-testimonial-photo-${i}`}
                      />
                    </div>
                    <CardContent className="flex flex-col p-6">
                      <div className="mb-3 flex gap-1">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                        "{t.content}"
                      </blockquote>
                      <div className="mt-4 flex items-center gap-3 border-t pt-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {t.initials}
                        </div>
                        <div>
                          <p className="font-semibold">{t.name}</p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" /> {t.location}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="faq" className="bg-muted py-20" data-testid="section-residential-faq">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-residential-faq-title">
                Homeowner FAQs
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Common questions Bay Area homeowners ask about residential electrical work.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-3">
              {faqData.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-card"
                  data-testid={`faq-residential-item-${i}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                    data-testid={`button-residential-faq-${i}`}
                  >
                    <span className="pr-4 font-medium">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div
                      className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground"
                      data-testid={`text-residential-faq-answer-${i}`}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-20" data-testid="section-residential-cta">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-700 dark:to-blue-900" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-6"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto max-w-xl text-lg text-white/80">
              Get a free estimate for your home electrical project. No obligation, no pressure.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/quote">
                <Button size="lg" variant="secondary" data-testid="button-residential-cta-quote">
                  Get Instant Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/booking">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                  data-testid="button-residential-cta-book"
                >
                  Book an Appointment
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
