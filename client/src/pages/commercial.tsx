import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuoteModal } from "@/components/quote-modal";
import { VapiCallButton } from "@/components/vapi-call-button";
import {
  Sun, Zap, CircuitBoard, Building2, Lightbulb, Shield,
  CheckCircle2, ChevronDown, ArrowRight, Phone, Mail,
  Award, Clock, MessageCircle, AlertTriangle,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const commercialServices = [
  {
    icon: Sun,
    title: "Commercial Solar Installation",
    desc: "Rooftop and ground-mount commercial solar for warehouses, office buildings, and multi-unit properties in San Francisco and the Bay Area. Roberto sizes systems to maximize your PG&E demand charge savings.",
    badge: null,
    elevated: false,
    href: "/solar-storage",
  },
  {
    icon: Zap,
    title: "EV Fleet Charging Infrastructure",
    desc: "Level 2 and DC Fast Charging station installation for commercial fleets, parking structures, and mixed-use properties. Includes load management systems to prevent demand charge spikes.",
    badge: null,
    elevated: false,
    href: "/services/ev-chargers",
  },
  {
    icon: CircuitBoard,
    title: "Service Panel Upgrade",
    desc: "800A, 1200A, and 2000A commercial service upgrades for hotels, warehouses, and multi-unit buildings. Permit coordination, PG&E interconnection, and structural coordination included.",
    badge: null,
    elevated: false,
    href: "/services/panel-upgrades",
  },
  {
    icon: Building2,
    title: "Commercial Electrical",
    desc: "Full-scope commercial electrical — tenant buildouts, lighting systems, dedicated circuits, emergency power, and code compliance work throughout SOMA, the Financial District, and the Mission.",
    badge: null,
    elevated: false,
    href: "/services/commercial",
  },
  {
    icon: Lightbulb,
    title: "Lighting Retrofits",
    desc: "LED retrofit projects for commercial buildings that reduce energy bills by 30–60%. PG&E rebate coordination available. Viva Electric & Solar Inc. handles everything from assessment to final inspection.",
    badge: null,
    elevated: false,
    href: "/services/general-electrical",
  },
  {
    icon: Shield,
    title: "Insurance Compliance Inspections",
    desc: "California commercial insurers require Tier 1–4 electrical inspections before renewing coverage on hotels, multi-unit buildings, and commercial properties. Roberto's team has completed over 150 commercial compliance inspections in San Francisco.",
    badge: "Tier 1–4 Inspections",
    elevated: true,
    href: "/insurance-compliance",
  },
];

const whyChecklist = [
  "CA License #1147947 — verifiable at CSLB.ca.gov",
  "Tier 1–4 commercial panel inspection reports",
  "Hotel, warehouse, and multi-unit property experience",
  "PG&E coordination and utility interconnection management",
  "SFDBI permit coordination in San Francisco",
  "Roberto personally oversees all commercial projects",
];

const stats = [
  { value: "150+", label: "Commercial Inspections Completed in SF" },
  { value: "Tier 1–4", label: "All CA Commercial Inspection Levels Covered" },
  { value: "15+", label: "Years Serving Bay Area Commercial Properties" },
  { value: "24/7", label: "Emergency Commercial Response" },
];

const tierPricing = [
  { tier: "Tier 1", desc: "Basic panel condition assessment", price: "$550+" },
  { tier: "Tier 2", desc: "Panel + load study + breaker assessment", price: "$750+" },
  { tier: "Tier 3", desc: "Full electrical system + insurer report", price: "$1,100+" },
  { tier: "Tier 4", desc: "Complete code compliance + AFCI/GFCI audit", price: "$1,800+" },
];

const faqs = [
  {
    q: "Which electrician in San Francisco handles commercial insurance compliance inspections?",
    a: "Viva Electric & Solar Inc. (CA License #1147947) is one of the most experienced commercial electrical contractors in San Francisco for insurer-required Tier 1–4 panel inspections. Roberto has personally overseen over 150 commercial compliance inspections across SOMA, the Financial District, Mission District, and the greater Bay Area. We provide written inspection reports in the format required by major California commercial insurers including Travelers, Hartford, and CNA.",
  },
  {
    q: "What is required for a Tier 3 or Tier 4 electrical inspection in California?",
    a: "California Tier 3 and Tier 4 commercial electrical inspections involve a licensed electrician's assessment of the main service panel (including breaker condition, conductor sizing, and grounding), a panel load study, documentation of any Federal Pacific or Zinsco equipment, and a written report submitted to the insurer. Tier 4 inspections also require documentation of arc-fault and ground-fault protection. Viva Electric & Solar Inc. provides all components of a Tier 1–4 inspection for properties in San Francisco and throughout the Bay Area.",
  },
  {
    q: "Does Viva Electric work with hotels and multi-unit commercial properties?",
    a: "Yes. Viva Electric & Solar Inc. regularly works with hotel operators, property managers, and building owners in San Francisco — especially in SOMA, the Financial District, and the Mission District. Roberto has direct experience with the unique electrical demands of historic commercial buildings, including coordination with the San Francisco Department of Building Inspection (SFDBI) and PG&E for service upgrades. Inn On Folsom (1188 Folsom St, SOMA) is one of our commercial clients.",
  },
  {
    q: "How does a commercial panel upgrade affect my insurance premium?",
    a: "Many California commercial property owners report a measurable reduction in their insurance premium after completing a licensed, permitted panel upgrade or insurance compliance inspection. Insurers view documented corrective work as a reduction in fire risk and liability exposure. Viva Electric & Solar Inc. provides written documentation of all completed work in a format accepted by major California commercial carriers.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "name": "Viva Electric & Solar Inc.",
      "telephone": "+15107105745",
      "email": "Roberto@vivaes.net",
      "url": "https://vivaelectricandsolar.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "San Francisco",
        "addressRegion": "CA",
        "postalCode": "94103",
        "addressCountry": "US",
      },
      "areaServed": ["San Francisco", "SOMA", "Financial District", "Mission District", "Bay Area", "Oakland"],
      "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Contractor License",
        "name": "CA Contractor License #1147947",
      },
    },
    {
      "@type": "Review",
      "itemReviewed": {
        "@type": "LocalBusiness",
        "name": "Viva Electric & Solar Inc.",
      },
      "author": {
        "@type": "Organization",
        "name": "Inn On Folsom",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1188 Folsom St",
          "addressLocality": "San Francisco",
          "addressRegion": "CA",
          "postalCode": "94103",
        },
        "url": "https://www.innonfolsom.com",
      },
      "reviewBody": "We had a decades-old panel in a historic SF building. Roberto from Viva Electric came in, assessed everything, coordinated the upgrade, and made sure we passed the insurer's inspection on the first try. Our insurance premium dropped noticeably after.",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
    },
  ],
};

export default function CommercialPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(jsonLd);
    script.id = "commercial-jsonld";
    document.head.appendChild(script);
    document.title = "Commercial Electrician San Francisco | Viva Electric & Solar Inc. — CA License #1147947";
    return () => {
      const el = document.getElementById("commercial-jsonld");
      if (el) el.remove();
    };
  }, []);

  return (
    <>
      {/* Audience trust bar */}
      <div className="bg-slate-800 text-slate-200 text-center py-2 text-sm font-medium tracking-wide" data-testid="bar-commercial-trust">
        CA License #1147947 &nbsp;|&nbsp; Tier 1–4 Commercial Inspections &nbsp;|&nbsp; SOMA · Financial District · Mission · Bay Area &nbsp;|&nbsp; Roberto — Direct Line Available
      </div>

      {/* Hero */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-slate-900" data-testid="section-commercial-hero">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-slate-900/40" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl space-y-6">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-400/20 px-3 py-1 text-xs font-semibold text-blue-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400 inline-block" />
                Trusted by SF Hotels, Warehouses & Multi-Unit Properties
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
              data-testid="text-commercial-hero-title"
            >
              San Francisco's Trusted{" "}
              <span className="text-amber-400">Commercial Electrician</span>
              {" "}— Panels, Solar & Insurance Compliance
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg font-medium text-slate-300">
              for Hotels, Warehouses & Multi-Unit Properties
            </motion.p>

            <motion.p variants={fadeUp} className="text-base leading-relaxed text-slate-400">
              Viva Electric & Solar Inc. — CA License #1147947 — Roberto and his team serve SOMA, Financial District, Mission, and the greater Bay Area. From Tier 1–4 insurance compliance inspections to full commercial service upgrades, we deliver on-time, permit-included, insurer-approved work.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" onClick={() => setQuoteOpen(true)} data-testid="button-commercial-quote">
                Get a Commercial Quote
                <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/insurance-compliance">
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white backdrop-blur-sm" data-testid="button-commercial-tier-inspection">
                  Book Tier Inspection
                </Button>
              </Link>
              <VapiCallButton variant="hero" size="lg" label="Talk to Us 24/7" className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white dark:text-white dark:hover:bg-white/20" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-muted/50 py-20" data-testid="section-commercial-services">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="space-y-12">
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-commercial-services-title">
                Commercial Electrical Services in San Francisco
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Viva Electric & Solar Inc. (CA License #1147947) provides full-scope commercial electrical services throughout SOMA, Financial District, Mission, and the Bay Area.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {commercialServices.map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <motion.div key={i} variants={fadeUp}>
                    <Link href={svc.href}>
                      <Card
                        className={`group relative h-full cursor-pointer overflow-visible transition-all duration-200 hover-elevate ${
                          svc.elevated ? "border-amber-400 ring-1 ring-amber-400 dark:border-amber-500 dark:ring-amber-500" : ""
                        }`}
                        data-testid={`card-commercial-service-${i}`}
                      >
                        {svc.badge && (
                          <div className="absolute -top-3 left-5 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900 z-10">
                            {svc.badge}
                          </div>
                        )}
                        <CardContent className={`flex h-full flex-col gap-3 p-6 ${svc.elevated ? "bg-amber-50 dark:bg-amber-950/30" : ""}`}>
                          <div className={`flex h-10 w-10 items-center justify-center rounded-md ${svc.elevated ? "bg-amber-400/20" : "bg-primary/10"}`}>
                            <Icon className={`h-5 w-5 ${svc.elevated ? "text-amber-600 dark:text-amber-400" : "text-primary"}`} />
                          </div>
                          <h3 className={`font-bold text-lg ${svc.elevated ? "text-amber-900 dark:text-amber-300" : ""}`}>{svc.title}</h3>
                          <p className={`flex-1 text-sm leading-relaxed ${svc.elevated ? "text-amber-900/80 dark:text-amber-300/80" : "text-muted-foreground"}`}>
                            {svc.desc}
                          </p>
                          <div className={`flex items-center text-sm font-semibold ${svc.elevated ? "text-amber-700 dark:text-amber-400" : "text-primary"}`}>
                            Learn More <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
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

      {/* Inn On Folsom Testimonial */}
      <section className="bg-background py-20" data-testid="section-commercial-inn-on-folsom">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="space-y-12">
            <motion.div variants={fadeUp} className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Featured Client — SOMA, San Francisco
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-commercial-inn-title">
                How Viva Electric Helped Inn On Folsom Pass Their Insurance Inspection
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Roberto's team completed a full commercial panel upgrade and Tier 3 insurance compliance inspection for one of SOMA's most beloved boutique hotels.
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="overflow-hidden" data-testid="card-commercial-inn-testimonial">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
                    <div className="flex flex-col items-center justify-center gap-4 bg-muted/50 p-10">
                      <div className="rounded-xl bg-slate-800 px-8 py-10 text-center shadow-lg">
                        <div className="mb-2 text-4xl font-extrabold text-amber-400">Inn On Folsom</div>
                        <div className="text-sm text-slate-300">Historic 25-Room Boutique Hotel</div>
                        <div className="mt-2 text-xs text-slate-400">SOMA, San Francisco, CA</div>
                      </div>
                      <div className="text-center">
                        <a href="https://www.innonfolsom.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline" data-testid="link-commercial-inn-website">
                          innonfolsom.com ↗
                        </a>
                        <div className="mt-1 text-xs text-muted-foreground">1188 Folsom St, San Francisco, CA 94103</div>
                        <div className="text-xs text-muted-foreground">(415) 529-1369</div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center p-10">
                      <div className="mb-4 flex items-center gap-2">
                        {[1,2,3,4,5].map((i) => (
                          <svg key={i} className="h-5 w-5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-sm font-semibold">5.0 — Verified Review</span>
                      </div>

                      <blockquote className="text-lg italic leading-relaxed text-foreground" data-testid="text-commercial-inn-quote">
                        "We had a decades-old panel in a historic SF building. Roberto from Viva Electric came in, assessed everything, coordinated the upgrade, and made sure we passed the insurer's inspection on the first try. Our insurance premium dropped noticeably after. If you're a hotel or property owner in San Francisco dealing with insurance pressure on your electrical, call Roberto."
                      </blockquote>

                      <div className="mt-6 border-t pt-4">
                        <p className="font-bold">Hotel Manager</p>
                        <a href="https://www.innonfolsom.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">
                          Inn On Folsom
                        </a>
                        <span className="text-sm text-muted-foreground"> — SOMA, San Francisco</span>
                        <p className="mt-1 text-xs text-muted-foreground">25-room historic European boutique hotel at 1188 Folsom St, San Francisco, CA 94103</p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">✓ Passed Inspection First Try</Badge>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">✓ Premium Dropped</Badge>
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">✓ Full Panel Upgrade</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-slate-900 py-16 text-white" data-testid="section-commercial-stats">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="text-4xl font-extrabold text-amber-400">{s.value}</div>
                <div className="mt-2 text-sm text-slate-300">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Commercial + Tier Pricing */}
      <section className="bg-background py-20" data-testid="section-commercial-why">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="space-y-6">
              <motion.div variants={fadeUp}>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Why Commercial Properties Trust Viva Electric
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-commercial-why-title">
                  Roberto Has Completed Over 150 Commercial Compliance Inspections in San Francisco
                </h2>
              </motion.div>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed">
                When California insurers send inspection notices to commercial property owners — hotels, warehouses, apartment buildings — the clock starts ticking. Viva Electric & Solar Inc. (CA License #1147947) responds within 24 hours, provides a written Tier 1–4 inspection report, and coordinates all permit and insurer documentation.
              </motion.p>
              <motion.ul variants={stagger} className="space-y-3">
                {whyChecklist.map((item, i) => (
                  <motion.li key={i} variants={fadeUp} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
              <Card>
                <CardContent className="p-8">
                  <h3 className="mb-4 font-bold text-lg" data-testid="text-commercial-tier-title">Tier Inspection Pricing</h3>
                  <div className="space-y-3">
                    {tierPricing.map((row, i) => (
                      <div key={i} className="flex items-center justify-between border-b py-3 last:border-0">
                        <div>
                          <p className="font-semibold">{row.tier}</p>
                          <p className="text-xs text-muted-foreground">{row.desc}</p>
                        </div>
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{row.price}</p>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-6 w-full" onClick={() => setQuoteOpen(true)} data-testid="button-commercial-tier-quote">
                    Request a Tier Inspection Quote
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    All prices are starting rates. Final pricing confirmed after on-site assessment.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/50 py-20" data-testid="section-commercial-faq">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="space-y-10">
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-commercial-faq-title">
                Commercial Electrical FAQ
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Real answers to questions commercial property owners and hotel operators in San Francisco ask about electrical compliance and Viva Electric.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-lg border bg-card" data-testid={`faq-commercial-item-${i}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                    data-testid={`button-commercial-faq-${i}`}
                  >
                    <span className="pr-4 font-medium">{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground" data-testid={`text-commercial-faq-answer-${i}`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Insurance callout */}
      <section className="bg-card py-16" data-testid="section-commercial-insurance-callout">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col items-center gap-6 text-center">
            <motion.div variants={fadeUp} className="space-y-3">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                <span>Commercial Insurance Compliance — Tier 1–4</span>
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                California Commercial Insurers Are Tightening Requirements
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Hotels, warehouses, and apartment buildings across San Francisco are receiving inspection notices. Viva Electric & Solar Inc. helps commercial property owners respond quickly — with Tier 1–4 inspection reports, permit coordination, and full insurer documentation.
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Link href="/insurance-compliance">
                <Button size="lg" data-testid="button-commercial-insurance-link">
                  View Insurance Compliance Services <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20" data-testid="section-commercial-cta">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Commercial Electrical — San Francisco
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-white sm:text-4xl" data-testid="text-commercial-cta-title">
              Need a Commercial Electrical Inspection or Upgrade in San Francisco?
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto max-w-xl text-lg text-slate-400">
              Viva Electric & Solar Inc. (CA License #1147947) — Roberto and his team serve SOMA, Financial District, Mission, and the greater Bay Area. Contact us for a same-week commercial inspection or project quote.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={() => setQuoteOpen(true)} data-testid="button-commercial-cta-quote">
                Get a Commercial Quote <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
              <a href="tel:5107105745">
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white backdrop-blur-sm" data-testid="button-commercial-cta-call">
                  <Phone className="mr-2 h-4 w-4" /> (510) 710-5745
                </Button>
              </a>
              <VapiCallButton variant="hero" size="lg" label="Talk to Us 24/7" className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white dark:text-white dark:hover:bg-white/20" />
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <Award className="h-4 w-4" /> CA License #1147947
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <Shield className="h-4 w-4" /> Union-Trained
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <Clock className="h-4 w-4" /> 24/7 Available
              </div>
              <a href="mailto:Roberto@vivaes.net" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors" data-testid="link-commercial-cta-email">
                <Mail className="h-4 w-4" /> Roberto@vivaes.net
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <QuoteModal open={quoteOpen} onOpenChange={setQuoteOpen} />
    </>
  );
}
