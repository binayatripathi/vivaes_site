import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageMeta } from "@/components/page-meta";
import {
  Shield, CheckCircle2, ChevronDown, Phone, Mail, ArrowRight,
  Building2, Clock, Star, Zap, ClipboardCheck, Wrench, Users,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const stats = [
  { value: "150+", label: "Commercial Jobs Completed" },
  { value: "Tier 1–4", label: "Service Tiers Available" },
  { value: "24/7", label: "Emergency Response" },
  { value: "CA #1147947", label: "Licensed & Insured" },
];

const pricingTiers = [
  {
    icon: ClipboardCheck,
    tier: "Starter",
    name: "Inspection & Assessment",
    description:
      "Comprehensive inspection, photos, code findings, and written report. Ideal for property managers and new acquisitions.",
    price: "$550",
    unit: "starting rate / property",
    highlight: false,
  },
  {
    icon: Wrench,
    tier: "Professional",
    name: "Corrective & Upgrade Work",
    description:
      "Panel upgrades, tenant improvement wiring, lighting retrofits, EV fleet chargers, and 3-phase power installations.",
    price: "$1,100",
    unit: "starting rate / scope",
    highlight: true,
  },
  {
    icon: Building2,
    tier: "Enterprise",
    name: "Portfolio & Multi-Site",
    description:
      "Custom proposals for property portfolios, hotel chains, warehouses, and commercial real estate investors with phased scheduling.",
    price: "$1,800+",
    unit: "custom proposal",
    highlight: false,
  },
];

const services = [
  {
    icon: Zap,
    title: "3-Phase Power & High-Amperage Circuits",
    description: "Industrial and commercial power distribution for manufacturing, data centers, and heavy equipment.",
  },
  {
    icon: Building2,
    title: "Tenant Improvement Wiring",
    description: "New office build-outs, retail fit-outs, and restaurant kitchen electrical from plan to permit.",
  },
  {
    icon: ClipboardCheck,
    title: "Insurance Compliance (Commercial)",
    description: "Panel inspections, corrections, and documentation for commercial property carriers and lenders.",
  },
  {
    icon: Shield,
    title: "Emergency Power & Backup",
    description: "Generators, UPS systems, and automatic transfer switches for mission-critical uptime.",
  },
  {
    icon: Wrench,
    title: "LED Lighting Retrofits",
    description: "Warehouse, office, and outdoor lighting upgrades that cut energy costs 40–60%.",
  },
  {
    icon: Zap,
    title: "EV Fleet Charging",
    description: "Level 2 and DC fast charging for commercial fleets, hotels, apartment buildings, and parking structures.",
  },
];

const innOnFolsomTestimonial = {
  name: "Inn On Folsom",
  location: "San Francisco, CA",
  role: "Hotel Management",
  content:
    "Viva Electric handled our complete electrical upgrade — from panel replacements to EV charger installation across all floors. They coordinated around guest occupancy, kept disruption minimal, and delivered on schedule. We now have a modern electrical system and four EV charging stations for our guests. We trust Roberto and his team completely.",
  rating: 5,
};

const additionalTestimonials = [
  {
    name: "James R.",
    location: "Oakland, CA",
    role: "Warehouse Operations Manager",
    content:
      "We needed a complete lighting retrofit for our 50,000 sq ft warehouse. Viva's team completed the job ahead of schedule and our energy costs are down 60%. Highly recommend.",
    rating: 5,
  },
  {
    name: "Maria L.",
    location: "Bay Area",
    role: "Property Manager — 12 Properties",
    content:
      "Viva handles all our electrical needs across 12 properties. Their 24/7 availability and union-trained technicians give us peace of mind. Best electrical contractor we've worked with.",
    rating: 5,
  },
];

const faqData = [
  {
    question: "Do you work with hotels and hospitality properties?",
    answer:
      "Yes. We have extensive experience with hotels, motels, and hospitality venues — including panel replacements, guest room EV charger installations, LED retrofits, and emergency power systems. We coordinate around occupancy schedules to minimize guest disruption.",
  },
  {
    question: "Can you handle multi-site or portfolio projects?",
    answer:
      "Absolutely. We work with property managers, REITs, and commercial real estate investors who need a reliable partner for portfolio-scale electrical work. We offer phased scheduling, volume pricing, and centralized reporting for multi-site projects.",
  },
  {
    question: "What commercial services does Viva Electric provide for warehouses?",
    answer:
      "We provide 3-phase power distribution, high-amperage circuits, LED lighting retrofits, dock power, EV fleet charging infrastructure, emergency backup power, and full panel upgrades for warehouse and industrial facilities.",
  },
  {
    question: "Do you handle commercial insurance compliance?",
    answer:
      "Yes. Many commercial property owners face the same insurance-driven panel inspection requirements as residential owners. We inspect, document, correct, and provide carrier-ready reports for commercial properties, apartment buildings, and mixed-use buildings.",
  },
  {
    question: "What is included in the Enterprise pricing tier?",
    answer:
      "The Enterprise tier covers portfolio and multi-site work with custom proposals based on scope. We include phased scheduling, volume-based pricing, dedicated project coordination, and comprehensive documentation. Contact us to discuss your portfolio.",
  },
  {
    question: "Are you available for after-hours or emergency commercial work?",
    answer:
      "Yes. We provide 24/7 emergency response for commercial clients. Electrical failures don't follow business hours — neither do we. Call (510) 710-5745 for immediate assistance.",
  },
  {
    question: "What areas do you serve for commercial electrical work?",
    answer:
      "We serve the entire San Francisco Bay Area (San Francisco, Oakland, Berkeley, Fremont, Hayward, Concord, Livermore, and surrounding cities) and the Central Valley (Stockton, Tracy, Modesto). Contact us to confirm coverage for your property location.",
  },
  {
    question: "Who installs EV fleet charging for businesses in the Bay Area?",
    answer:
      "Viva Electric & Solar Inc. designs and installs Level 2 and DC fast-charging infrastructure for commercial fleets, hotels, apartment buildings, and parking structures throughout the Bay Area and Central Valley. We hold California C-10 Electrical Contractor License #1147947 and handle all permitting, utility coordination, and load management.",
  },
  {
    question: "How does a commercial electrical inspection work?",
    answer:
      "A commercial electrical inspection from Viva Electric starts at $550 and includes a visual assessment of all panels, wiring, grounding, labeling, and code compliance. You receive a written report with findings, photos, and recommended corrective actions. For insurance carriers or lenders, we include the documentation they need to verify compliance.",
  },
  {
    question: "Is Viva Electric licensed for commercial electrical work in California?",
    answer:
      "Yes. Viva Electric & Solar Inc. holds California Contractors State License Board (CSLB) License #1147947, a C-10 Electrical Contractor license that covers both residential and commercial electrical work throughout the state of California. Our electricians are union-trained and carry full liability insurance.",
  },
];

export default function CommercialPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <PageMeta
        title="Commercial Electrician Bay Area | Hotels, Warehouses & Retail"
        description="Commercial electrical contractor for the SF Bay Area — tenant improvements, 3-phase power, EV fleet chargers, lighting retrofits, panel upgrades. CA Lic #1147947."
        canonical="https://vivaes.net/commercial"
        ogTitle="Commercial Electrical Services | Viva Electric & Solar Bay Area"
        ogDescription="Bay Area commercial electrician for hotels, warehouses, retail & multifamily. Tenant improvements, panel upgrades, EV fleet chargers. Licensed & insured."
        ogImage="https://vivaes.net/images/services/commercial.jpg"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "LocalBusiness",
                name: "Viva Electric & Solar Inc.",
                description:
                  "Licensed commercial electrician serving hotels, warehouses, and property managers in the San Francisco Bay Area. 3-phase power, tenant improvements, EV fleet charging. CA License #1147947.",
                url: "https://vivaes.net/commercial",
                telephone: "+15107105745",
                email: "Roberto@vivaes.net",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Oakland",
                  addressRegion: "CA",
                  addressCountry: "US",
                },
                areaServed: [
                  "San Francisco", "Oakland", "Berkeley", "Fremont", "Hayward",
                  "Concord", "Livermore", "Stockton", "Tracy", "Modesto",
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
              {
                "@type": "Review",
                author: { "@type": "Organization", name: "Inn On Folsom" },
                reviewBody:
                  "Viva Electric handled our complete electrical upgrade — from panel replacements to EV charger installation across all floors. They coordinated around guest occupancy, kept disruption minimal, and delivered on schedule.",
                reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                itemReviewed: { "@type": "LocalBusiness", name: "Viva Electric & Solar Inc." },
              },
            ],
          }),
        }}
      />

      <section
        className="relative flex min-h-[75vh] items-center overflow-hidden bg-slate-900"
        data-testid="section-commercial-hero"
      >
        <div className="absolute inset-0">
          <img
            src="/images/services/commercial.jpg"
            alt="Commercial electrical work for hotels and warehouses in the Bay Area"
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
              <Badge className="border border-slate-400/30 bg-slate-700/50 text-slate-200">
                <Building2 className="mr-1 h-3 w-3" /> Hotels · Warehouses · Property Managers
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
              data-testid="text-commercial-hero-title"
            >
              Commercial Electrical Services for Bay Area Businesses
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg leading-relaxed text-white/80 sm:text-xl"
              data-testid="text-commercial-hero-sub"
            >
              Trusted by hotels, warehouses, and property managers across the Bay Area. 3-phase power, tenant improvements, EV fleet charging, and 24/7 emergency response.
            </motion.p>

            <motion.p variants={fadeUp} className="text-base text-white/70">
              CA License #1147947 · Union Trained · Fully Insured · Permit & Utility Coordination Included
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
              <Link href="/quote">
                <Button size="lg" data-testid="button-commercial-quote">
                  Request a Commercial Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/booking">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                  data-testid="button-commercial-book"
                >
                  Schedule a Site Visit
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col gap-1 pt-2 text-sm text-white/60">
              <a href="mailto:Roberto@vivaes.net" className="flex items-center gap-2 transition-colors hover:text-white/90">
                <Mail className="h-4 w-4" /> Roberto@vivaes.net
              </a>
              <a href="tel:5107105745" className="flex items-center gap-2 transition-colors hover:text-white/90">
                <Phone className="h-4 w-4" /> (510) 710-5745 — 24/7
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-card py-10" data-testid="section-commercial-stats">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 rounded-lg border bg-background p-5 text-center"
                data-testid={`stat-commercial-${stat.label.toLowerCase().replace(/[\s#–+]+/g, "-")}`}
              >
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20" data-testid="section-commercial-services">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-commercial-services-title">
                Commercial Electrical Solutions
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                From tenant improvements to large-scale industrial power — licensed, permitted, and built to code.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <motion.div key={service.title} variants={fadeUp}>
                    <Card
                      className="h-full"
                      data-testid={`card-commercial-service-${service.title.toLowerCase().replace(/[\s&()]+/g, "-")}`}
                    >
                      <CardContent className="flex h-full flex-col p-6">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold">{service.title}</h3>
                        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-muted py-20" data-testid="section-commercial-testimonial-featured">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-10 lg:grid-cols-2"
          >
            <motion.div variants={fadeUp} className="space-y-4">
              <Badge variant="secondary" className="mb-1">Featured Client</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-commercial-testimonial-title">
                Trusted by Hotels & Commercial Properties
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                The Inn On Folsom in San Francisco is one of many commercial clients who rely on Viva Electric for large-scale projects that require precision, minimal disruption, and full code compliance.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "Complete panel replacement across multiple floors",
                  "EV charging stations installed for hotel guests",
                  "Work coordinated around guest occupancy",
                  "On-time delivery with full permit documentation",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="h-full border-primary ring-1 ring-primary" data-testid="card-commercial-inn-testimonial">
                <CardContent className="flex h-full flex-col p-8">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: innOnFolsomTestimonial.rating }).map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="flex-1 text-base leading-relaxed text-foreground" data-testid="text-commercial-inn-testimonial-content">
                    "{innOnFolsomTestimonial.content}"
                  </blockquote>
                  <div className="mt-6 border-t pt-5">
                    <p className="font-semibold" data-testid="text-commercial-inn-testimonial-name">
                      {innOnFolsomTestimonial.name}
                    </p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> {innOnFolsomTestimonial.role} · {innOnFolsomTestimonial.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-background py-20" data-testid="section-commercial-pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-commercial-pricing-title">
                Commercial Pricing Tiers
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Transparent starting rates for commercial electrical projects. Final pricing confirmed after site assessment.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {pricingTiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <motion.div key={tier.tier} variants={fadeUp}>
                    <Card
                      className={`h-full ${tier.highlight ? "border-primary ring-1 ring-primary" : ""}`}
                      data-testid={`card-commercial-pricing-${tier.tier.toLowerCase()}`}
                    >
                      <CardContent className="flex h-full flex-col p-6">
                        {tier.highlight && (
                          <Badge className="mb-3 w-fit">Most Popular</Badge>
                        )}
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {tier.tier}
                        </p>
                        <h3 className="mt-1 text-lg font-bold">{tier.name}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {tier.description}
                        </p>
                        <div className="mt-4 border-t pt-4">
                          <p className="text-2xl font-bold text-primary">{tier.price}</p>
                          <p className="text-xs text-muted-foreground">{tier.unit}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <motion.p variants={fadeUp} className="text-center text-sm text-muted-foreground">
              All prices are starting rates. Final pricing is confirmed after on-site assessment.
              Permit and utility coordination included where required. Multi-site volume pricing available.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="bg-card py-20" data-testid="section-commercial-additional-testimonials">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-commercial-more-testimonials-title">
                More from Our Commercial Clients
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {additionalTestimonials.map((t, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <Card className="h-full" data-testid={`card-commercial-testimonial-${i}`}>
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="mb-3 flex gap-1">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                        "{t.content}"
                      </blockquote>
                      <div className="mt-4 border-t pt-4">
                        <p className="font-semibold">{t.name}</p>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" /> {t.role} · {t.location}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="faq" className="bg-muted py-20" data-testid="section-commercial-faq">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-commercial-faq-title">
                Commercial FAQs
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Common questions from hotels, property managers, and warehouse operators.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-3">
              {faqData.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-card"
                  data-testid={`faq-commercial-item-${i}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                    data-testid={`button-commercial-faq-${i}`}
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
                      data-testid={`text-commercial-faq-answer-${i}`}
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

      <section className="relative overflow-hidden bg-slate-900 py-20" data-testid="section-commercial-cta">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
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
              Ready to Talk About Your Commercial Project?
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto max-w-xl text-lg text-white/80">
              Get a custom quote for your hotel, warehouse, or property portfolio. We respond within one business day.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/quote">
                <Button size="lg" data-testid="button-commercial-cta-quote">
                  Request a Commercial Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="tel:5107105745">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                  data-testid="button-commercial-cta-call"
                >
                  <Phone className="mr-2 h-4 w-4" /> (510) 710-5745
                </Button>
              </a>
            </motion.div>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 pt-2 text-sm text-white/60">
              <Clock className="h-4 w-4" />
              <span>24/7 emergency response available</span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
