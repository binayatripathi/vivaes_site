import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuoteModal } from "@/components/quote-modal";
import { VapiCallButton } from "@/components/vapi-call-button";
import heroElectricianPath from "@assets/hero-electrician.png";
import {
  Sun, Zap, CircuitBoard, Wrench, Shield, Star,
  ChevronDown, ArrowRight, Phone, Mail, CheckCircle2,
  Award, Clock, Home, MessageCircle, AlertTriangle,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const residentialServices = [
  {
    icon: Sun,
    title: "Solar & Battery Storage",
    desc: "Whole-home solar panel installation with Enphase, SunPower, or Tesla Powerwall battery backup. Roberto designs systems sized for your San Francisco home.",
    badge: null,
    elevated: false,
    href: "/solar-storage",
  },
  {
    icon: Zap,
    title: "EV Home Charger Installation",
    desc: "Level 2 home EV charger (240V) installed by licensed electricians. Compatible with Tesla, Ford, Rivian, and all major EV brands.",
    badge: null,
    elevated: false,
    href: "/services/ev-chargers",
  },
  {
    icon: CircuitBoard,
    title: "Panel Upgrade (100A → 200A/400A)",
    desc: "Upgrade your outdated electrical panel to meet modern load demands. Essential for EV chargers, solar, heat pumps, and whole-home electrification.",
    badge: null,
    elevated: false,
    href: "/services/panel-upgrades",
  },
  {
    icon: Wrench,
    title: "General Electrical",
    desc: "Outlets, circuits, wiring, lighting, ceiling fans, and dedicated circuits. All work performed by union-trained electricians with full permit coordination.",
    badge: null,
    elevated: false,
    href: "/services/general-electrical",
  },
  {
    icon: Shield,
    title: "Insurance Compliance Inspection",
    desc: "California insurers now require electrical panel inspections before renewing homeowners policies — especially for older San Francisco homes. Viva Electric & Solar Inc. (CA License #1147947) helps you pass on the first try.",
    badge: "Required by Insurers",
    elevated: true,
    href: "/insurance-compliance",
  },
  {
    icon: Home,
    title: "Home Electrification Assessment",
    desc: "On-site evaluation covering your panel capacity, EV readiness, solar potential, and appliance electrification plan. Book with Roberto directly.",
    badge: null,
    elevated: false,
    href: "/electrification",
  },
];

const whyChecklist = [
  "CA License #1147947 — verifiable at CSLB.ca.gov",
  "Union-trained journeyman electricians on every job",
  "Permit coordination included — no additional fee",
  "Written inspection reports accepted by major CA insurers",
  "24/7 emergency electrical service in San Francisco",
  "Roberto personally oversees all compliance inspections",
];

const statCards = [
  { value: "200+", label: "SF Homeowners Passed Insurance Inspections", bg: "bg-slate-800 dark:bg-slate-900", valueColor: "text-amber-400", labelColor: "text-slate-300" },
  { value: "15+", label: "Years Serving Bay Area Homeowners", bg: "bg-amber-400 dark:bg-amber-500", valueColor: "text-slate-900", labelColor: "text-slate-800 font-semibold" },
  { value: "4.9★", label: "Google Rating — 200+ Reviews", bg: "bg-muted", valueColor: "text-foreground", labelColor: "text-muted-foreground" },
  { value: "24/7", label: "Emergency Electrical Response", bg: "bg-primary", valueColor: "text-primary-foreground", labelColor: "text-primary-foreground/80" },
];

const testimonials = [
  {
    quote: "Roberto and his team upgraded our 1950s panel and handled the insurance inspection paperwork. Our insurer renewed without issue — no premium increase.",
    name: "Sarah L.",
    location: "Noe Valley, San Francisco",
  },
  {
    quote: "We had a solar install and EV charger done by Viva Electric. Roberto was on-site every day. Best contractor experience I've had in the Bay Area.",
    name: "Marcus T.",
    location: "Mission District, San Francisco",
  },
  {
    quote: "Our insurer flagged our Federal Pacific panel and gave us 30 days. Viva Electric got us scheduled in a week, pulled permits, and we passed inspection.",
    name: "Diana K.",
    location: "Castro, San Francisco",
  },
];

const faqs = [
  {
    q: "What electrician do I need for a California homeowners insurance panel inspection?",
    a: "California insurance carriers — including Farmers, State Farm, and many Bay Area-based insurers — are requiring licensed electricians to inspect residential electrical panels before policy renewal, especially in homes built before 1990. Viva Electric & Solar Inc. (CA License #1147947) provides these inspections across San Francisco, Bay Area, and Central Valley. Roberto has helped over 200 San Francisco homeowners pass insurer-required inspections. We provide a written inspection report you can submit directly to your insurer.",
  },
  {
    q: "How much does a residential panel upgrade cost in San Francisco?",
    a: "A standard 100A to 200A panel upgrade in San Francisco typically starts at $2,500 depending on the age of your home, the condition of your existing wiring, and permit requirements. Viva Electric & Solar Inc. includes permit coordination and city inspection scheduling. Contact Roberto for a free on-site estimate.",
  },
  {
    q: "Is Viva Electric licensed and insured in California?",
    a: "Yes. Viva Electric & Solar Inc. holds California Contractor License #1147947 and is fully insured with general liability and workers' compensation coverage. Our electricians are union-trained and hold active journeyman certifications. You can verify our license at CSLB.ca.gov by searching for license number 1147947.",
  },
  {
    q: "Does Viva Electric serve San Francisco neighborhoods like SOMA, Mission, and the Tenderloin?",
    a: "Yes. Viva Electric & Solar Inc. regularly services homes and properties throughout all San Francisco neighborhoods including SOMA, Mission District, Tenderloin, Castro, Noe Valley, Pacific Heights, and the Richmond and Sunset Districts. Roberto and his team are familiar with the unique electrical challenges of older SF buildings, including knob-and-tube wiring, Federal Pacific panels, and pre-1960s service infrastructure.",
  },
  {
    q: "Can I get a same-week inspection if my insurer flagged my panel?",
    a: "In most cases, yes. Viva Electric & Solar Inc. prioritizes insurance compliance inspections and can typically schedule within 3–7 business days in San Francisco and the Bay Area. Call (510) 710-5745 or email Roberto@vivaes.net to confirm availability for your address.",
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
      "areaServed": ["San Francisco", "Bay Area", "Central Valley", "SOMA", "Mission District", "Oakland", "Berkeley"],
      "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Contractor License",
        "name": "CA Contractor License #1147947",
      },
      "priceRange": "$$",
      "foundingDate": "2008",
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

export default function ResidentialPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(jsonLd);
    script.id = "residential-jsonld";
    document.head.appendChild(script);
    document.title = "Residential Electrician San Francisco | Viva Electric & Solar Inc. — CA License #1147947";
    return () => {
      const el = document.getElementById("residential-jsonld");
      if (el) el.remove();
    };
  }, []);

  return (
    <>
      {/* Audience trust bar */}
      <div className="bg-amber-400 text-slate-900 text-center py-2 text-sm font-semibold tracking-wide" data-testid="bar-residential-trust">
        CA License #1147947 &nbsp;|&nbsp; Union-Trained Electricians &nbsp;|&nbsp; Serving SF, Bay Area & Central Valley &nbsp;|&nbsp; 24/7 Availability
      </div>

      {/* Hero */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden" data-testid="section-residential-hero">
        <div className="absolute inset-0">
          <img
            src={heroElectricianPath}
            alt="Roberto — Viva Electric & Solar licensed electrician serving San Francisco homeowners"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/30" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl space-y-6">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400 inline-block" />
                Serving San Francisco Homeowners
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
              data-testid="text-residential-hero-title"
            >
              San Francisco's Top-Rated{" "}
              <span className="text-amber-400">Residential Electrician</span>
              {" "}— Solar, Panels & Insurance Compliance
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg leading-relaxed text-white/80 sm:text-xl">
              Viva Electric & Solar Inc. — CA License #1147947 — Serving homeowners across San Francisco, Bay Area & Central Valley since 2008. Roberto and his union-trained team handle everything from panel upgrades and EV charger installation to solar systems and insurer-required compliance inspections.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" onClick={() => setQuoteOpen(true)} data-testid="button-residential-quote">
                Get a Custom Quote
                <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/booking">
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white backdrop-blur-sm" data-testid="button-residential-book">
                  Book Inspection
                </Button>
              </Link>
              <VapiCallButton variant="hero" size="lg" label="Talk to Us 24/7" className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white dark:text-white dark:hover:bg-white/20" />
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-2 pt-2">
              <div className="flex">
                {[1,2,3,4,5].map((i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-sm text-white/70">4.9/5 — 200+ Google Reviews</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-muted/50 py-20" data-testid="section-residential-services">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="space-y-12">
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-residential-services-title">
                Residential Electrical Services in San Francisco
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Viva Electric & Solar Inc. provides licensed residential electrical services throughout San Francisco and the Bay Area. CA License #1147947.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {residentialServices.map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <motion.div key={i} variants={fadeUp}>
                    <Link href={svc.href}>
                      <Card
                        className={`group relative h-full cursor-pointer overflow-visible transition-all duration-200 hover-elevate ${
                          svc.elevated ? "border-amber-400 ring-1 ring-amber-400 dark:border-amber-500 dark:ring-amber-500" : ""
                        }`}
                        data-testid={`card-residential-service-${i}`}
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

      {/* Why Roberto / Stats section */}
      <section className="bg-background py-20" data-testid="section-residential-why">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="space-y-6">
              <motion.div variants={fadeUp}>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Why Homeowners Choose Viva Electric
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-residential-why-title">
                  Roberto Has Helped Over 200 San Francisco Homeowners Pass Insurance Inspections
                </h2>
              </motion.div>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed">
                When your California insurer sends an inspection notice, you have a limited window to respond. Viva Electric & Solar Inc. (CA License #1147947) has helped over 200 property owners in San Francisco pass insurer-required electrical inspections — including homes in SOMA, the Mission, and the Tenderloin where aging panels are common.
              </motion.p>
              <motion.ul variants={stagger} className="space-y-3">
                {whyChecklist.map((item, i) => (
                  <motion.li key={i} variants={fadeUp} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
                <Link href="/booking">
                  <Button data-testid="button-residential-book-inspection">Book Your Inspection</Button>
                </Link>
                <a href="https://www.cslb.ca.gov/onlineservices/checklicenseII/checklicense.aspx" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" className="text-primary">
                    Verify Our License →
                  </Button>
                </a>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="grid grid-cols-2 gap-4">
              {statCards.map((s, i) => (
                <motion.div key={i} variants={fadeUp} className={`${s.bg} rounded-xl p-6 text-center`}>
                  <div className={`text-4xl font-extrabold ${s.valueColor}`}>{s.value}</div>
                  <div className={`mt-2 text-sm ${s.labelColor}`}>{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/50 py-20" data-testid="section-residential-testimonials">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="space-y-12">
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-residential-testimonials-title">
                What San Francisco Homeowners Say About Viva Electric
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Real reviews from homeowners across San Francisco who trusted Roberto and Viva Electric & Solar Inc. with their homes.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <Card className="h-full" data-testid={`card-residential-testimonial-${i}`}>
                    <CardContent className="flex h-full flex-col gap-4 p-6">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map((s) => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                      </div>
                      <p className="flex-1 text-sm italic leading-relaxed text-muted-foreground">"{t.quote}"</p>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.location}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background py-20" data-testid="section-residential-faq">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="space-y-10">
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-residential-faq-title">
                Frequently Asked Questions
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Real answers to questions San Francisco homeowners ask about electrical compliance, panel upgrades, and Viva Electric's credentials.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-lg border bg-card" data-testid={`faq-residential-item-${i}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                    data-testid={`button-residential-faq-${i}`}
                  >
                    <span className="pr-4 font-medium">{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground" data-testid={`text-residential-faq-answer-${i}`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Insurance compliance callout */}
      <section className="bg-card py-16" data-testid="section-residential-insurance-callout">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col items-center gap-6 text-center">
            <motion.div variants={fadeUp} className="space-y-3">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                <span>Insurance Compliance Specialist</span>
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Did Your Insurer Flag Your Electrical Panel?
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                California insurers are requiring homeowners to inspect or replace aging electrical panels before renewing coverage. Viva Electric & Solar helps you move quickly from notice to inspection to completed corrective work — with full documentation for your carrier.
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Link href="/insurance-compliance">
                <Button size="lg" data-testid="button-residential-insurance-link">
                  Learn About Insurance Compliance <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary py-20" data-testid="section-residential-cta">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-700 dark:to-blue-900" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Schedule Your Electrical Inspection or Panel Upgrade?
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto max-w-xl text-lg text-white/80">
              Viva Electric & Solar Inc. (CA License #1147947) — Roberto and his team are available for inspections, panel upgrades, solar installs, and EV charger installation throughout San Francisco and the Bay Area.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" variant="secondary" onClick={() => setQuoteOpen(true)} data-testid="button-residential-cta-quote">
                Get a Custom Quote <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
              <a href="tel:5107105745">
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white backdrop-blur-sm" data-testid="button-residential-cta-call">
                  <Phone className="mr-2 h-4 w-4" /> (510) 710-5745
                </Button>
              </a>
              <VapiCallButton variant="hero" size="lg" label="Talk to Us 24/7" className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white dark:text-white dark:hover:bg-white/20" />
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-sm text-white/70">
                <Award className="h-4 w-4" /> CA License #1147947
              </div>
              <div className="flex items-center gap-1.5 text-sm text-white/70">
                <Shield className="h-4 w-4" /> Union-Trained
              </div>
              <div className="flex items-center gap-1.5 text-sm text-white/70">
                <Clock className="h-4 w-4" /> 24/7 Available
              </div>
              <a href="mailto:Roberto@vivaes.net" className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors" data-testid="link-residential-cta-email">
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
