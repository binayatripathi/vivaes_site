import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { PageMeta } from "@/components/page-meta";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insuranceLeadSchema, type InsuranceLead } from "@shared/schema";
import {
  Shield, Award, CheckCircle2, ChevronDown, Phone, Mail, ArrowRight,
  AlertTriangle, ClipboardCheck, Wrench, Building2, Zap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const trustBadges = [
  { icon: Shield, label: "Licensed C-10 Electrical Contractor" },
  { icon: Award, label: "CA License #1147947" },
  { icon: ClipboardCheck, label: "Permit & Utility Coordination" },
  { icon: Building2, label: "Homeowner & Multi-Unit Support" },
];

const faqData = [
  {
    question: "Why are insurance companies requiring panel replacements?",
    answer:
      "Insurance carriers are reducing risk associated with aging or unsafe electrical equipment. Older or defective panels may not trip properly, may show signs of overheating, or may no longer have reliable replacement parts. When a property presents a higher fire risk, insurers may require inspection, corrective work, or full replacement before issuing or renewing coverage.",
  },
  {
    question: "Which panel brands are most often flagged?",
    answer:
      "Commonly flagged equipment can include Zinsco, Federal Pacific / Stab-Lok, Challenger, Pushmatic, and certain older Sylvania equipment. Final determination depends on the carrier, the condition of the equipment, and the overall installation. Viva can inspect the system and identify whether correction or full replacement is the better path.",
  },
  {
    question: "How does this affect multi-unit apartment buildings?",
    answer:
      "Multi-unit properties are often evaluated more aggressively because a single electrical failure can affect multiple tenants and create greater liability. Carriers may require upgrades for multiple unit panels, main service equipment, meter banks, grounding and bonding, labeling, and other safety-related corrections.",
  },
  {
    question: "What happens if I do not replace or correct the flagged equipment?",
    answer:
      "If you do not address the flagged equipment, your insurer may non-renew your policy, increase your premium significantly, or issue a cancellation notice. In some cases, coverage may be voided for claims related to electrical issues. Acting quickly with a licensed contractor gives you documented evidence of corrective action.",
  },
  {
    question: "How long does an inspection or panel upgrade take?",
    answer:
      "A standard inspection typically takes 1–2 hours. Corrective work varies by scope — minor corrections may be completed the same visit, while a full panel or service upgrade generally takes 4–8 hours. Multi-unit projects are scheduled in phases to minimize disruption to tenants.",
  },
  {
    question: "Will I receive documentation I can give to my insurance company?",
    answer:
      "Yes. After inspection and any corrective work, Viva provides a written summary of findings and completed work. For panel upgrades and permitted work, we provide permit documentation and final inspection sign-off that your carrier can use to verify compliance.",
  },
  {
    question: "Does the work require a permit?",
    answer:
      "Panel replacements and service upgrades typically require a permit from your local municipality. Viva handles permit applications and coordinates all required inspections. Minor corrective work may not require a permit, depending on the jurisdiction and scope of work.",
  },
  {
    question: "Do you work with insurance brokers or property managers directly?",
    answer:
      "Yes. Viva works with property managers, real estate investors, and insurance brokers who need a reliable licensed contractor to move clients from notice to corrective action quickly. We can accommodate portfolio work with phased scheduling and volume pricing.",
  },
  {
    question: "What areas do you serve for insurance compliance work?",
    answer:
      "We serve the San Francisco Bay Area (Oakland, Berkeley, Fremont, Hayward, San Leandro, Richmond, Concord, Livermore, Pleasanton, and more) and the Central Valley (Stockton, Tracy, Modesto, and surrounding areas). Contact us to confirm coverage for your property address.",
  },
  {
    question: "My insurer sent a notice about my electrical panel — what should I do first?",
    answer:
      "Read the notice carefully to identify the deadline and the specific requirement (inspection only, corrective work, or full replacement). Then call a licensed electrical contractor immediately — do not wait. Viva Electric & Solar Inc. (CSLB #1147947) specializes in insurance-compliance electrical work. We can typically schedule an inspection within days and provide written documentation your carrier will accept.",
  },
  {
    question: "Can a licensed electrician's report satisfy my insurance company?",
    answer:
      "In most cases, yes. A written inspection report from a licensed California C-10 electrical contractor (CSLB #1147947), including permit documentation for any corrective work, is accepted by most California insurance carriers as proof of compliance. We provide all necessary documentation after each inspection and job completion.",
  },
];

const pricingTiers = [
  {
    icon: ClipboardCheck,
    tier: "Tier 1",
    name: "Inspection",
    description: "Visual inspection, photos, summary findings, next-step recommendation",
    price: "$550+",
    unit: "per panel / property",
    highlight: false,
  },
  {
    icon: Wrench,
    tier: "Tier 2",
    name: "Corrective Work",
    description: "Breaker corrections, grounding / bonding corrections, labeling, other minor code-related fixes where appropriate",
    price: "$550+",
    unit: "based on findings",
    highlight: false,
  },
  {
    icon: Zap,
    tier: "Tier 3",
    name: "Panel / Service Upgrade",
    description: "Full replacement of panel or service equipment, permit and utility coordination, final inspection",
    price: "$550+",
    unit: "per unit / scope",
    highlight: true,
  },
  {
    icon: Building2,
    tier: "Tier 4",
    name: "Multi-Unit Program",
    description: "Portfolio or apartment pricing with phased scheduling and volume structure",
    price: "$550+",
    unit: "custom proposal",
    highlight: false,
  },
];

export default function InsuranceCompliancePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<InsuranceLead>({
    resolver: zodResolver(insuranceLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsuranceLead) => {
      const res = await apiRequest("POST", "/api/leads/insurance", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Request received",
        description: "We'll contact you shortly to schedule your inspection.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again or call us directly at (510) 710-5745.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: InsuranceLead) {
    mutation.mutate(data);
  }

  return (
    <>
      <PageMeta
        title="Insurance Electrical Panel Compliance | Bay Area | Viva Electric"
        description="Insurance requiring your electrical panel replaced in California? We inspect, correct & document for homeowners and property managers. Licensed C-10 contractor. CA Lic #1147947."
        canonical="https://vivaes.net/insurance-compliance"
        ogTitle="Insurance Panel Compliance Electrician | Viva Electric & Solar Bay Area"
        ogDescription="Your insurer flagged your electrical panel? Viva Electric inspects, corrects, and documents compliance for Bay Area homeowners and property managers. Fast, permitted work."
        ogImage="https://vivaes.net/images/services/panel-upgrades.png"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "LocalBusiness",
                "@id": "https://vivaes.net/insurance-compliance#business",
                "name": "Viva Electric & Solar Inc.",
                "description": "Licensed C-10 electrical contractor specializing in insurance compliance panel inspections, corrections, and upgrades for homeowners and property managers in the San Francisco Bay Area and Central Valley. CA License #1147947.",
                "url": "https://vivaes.net/insurance-compliance",
                "telephone": "+15107105745",
                "email": "Roberto@vivaes.net",
                "priceRange": "$$",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Oakland",
                  "addressRegion": "CA",
                  "addressCountry": "US",
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "37.8044",
                  "longitude": "-122.2712",
                },
                "areaServed": [
                  "Oakland", "Berkeley", "Fremont", "Hayward", "San Francisco",
                  "San Leandro", "Richmond", "Concord", "Livermore", "Pleasanton",
                  "Dublin", "Stockton", "Tracy", "Modesto",
                ],
                "hasCredential": "California Contractor License #1147947",
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "Insurance Compliance Electrical Services",
                  "itemListElement": [
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Electrical Panel Inspection", "description": "Visual inspection, photos, summary findings, and next-step recommendation for insurance compliance." } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Corrective Electrical Work", "description": "Breaker corrections, grounding/bonding corrections, labeling, and code-related fixes." } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Panel Replacement & Service Upgrade", "description": "Full panel or service equipment replacement with permit and utility coordination." } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Multi-Unit Portfolio Program", "description": "Portfolio and apartment pricing with phased scheduling and volume structure." } },
                  ],
                },
              },
              {
                "@type": "FAQPage",
                "@id": "https://vivaes.net/insurance-compliance#faq",
                "mainEntity": faqData.map((faq) => ({
                  "@type": "Question",
                  "name": faq.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer,
                  },
                })),
              },
            ],
          }),
        }}
      />
      <section
        className="relative flex min-h-[75vh] items-center overflow-hidden bg-slate-900"
        data-testid="section-insurance-hero"
      >
        <div className="absolute inset-0">
          <img
            src="/images/services/panel-upgrades.png"
            alt="Electrical panel inspection for insurance compliance"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />
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
                <AlertTriangle className="mr-1 h-3 w-3" /> Insurance Compliance Specialist
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
              data-testid="text-insurance-hero-title"
            >
              Insurance Electrical Panel Compliance
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg leading-relaxed text-white/80 sm:text-xl"
              data-testid="text-insurance-hero-sub"
            >
              Everything California property owners need to know about insurance-driven electrical
              panel inspections, corrections, and upgrades.
            </motion.p>

            <motion.p variants={fadeUp} className="text-base text-white/70">
              If you own a home or multi-unit property in California, your insurance carrier may require
              verification or replacement of your electrical panel before renewing coverage. Viva Electric &
              Solar Inc. helps homeowners, property managers, and investors move quickly from notice to
              inspection to completed corrective work.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
              <a href="#lead-form">
                <Button size="lg" data-testid="button-insurance-schedule">
                  Schedule an Inspection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="#faq">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                  data-testid="button-insurance-faq"
                >
                  Ask a Question
                </Button>
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col gap-1 pt-2 text-sm text-white/60">
              <a href="mailto:Roberto@vivaes.net" className="flex items-center gap-2 hover:text-white/90 transition-colors">
                <Mail className="h-4 w-4" /> Roberto@vivaes.net
              </a>
              <a href="tel:2093976714" className="flex items-center gap-2 hover:text-white/90 transition-colors">
                <Phone className="h-4 w-4" /> 209-397-6714 | 510-710-5745
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-card py-10" data-testid="section-insurance-trust">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 text-center"
                  data-testid={`badge-trust-${badge.label.toLowerCase().replace(/\s+/g, "-")}`}
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

      <section className="py-20" data-testid="section-insurance-pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-insurance-pricing-title">
                Services & Pricing
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Four tiers of insurance compliance service — from initial inspection to full panel replacement and multi-unit programs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pricingTiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <motion.div key={tier.tier} variants={fadeUp}>
                    <Card
                      className={`h-full ${tier.highlight ? "border-primary ring-1 ring-primary" : ""}`}
                      data-testid={`card-pricing-${tier.tier.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <CardContent className="flex h-full flex-col p-6">
                        {tier.highlight && (
                          <Badge className="mb-3 w-fit">Most Common</Badge>
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
              All prices are starting rates. Final pricing is confirmed after on-site inspection.
              Union-trained, licensed electricians. Permit and utility coordination included where required.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section id="faq" className="bg-muted py-20" data-testid="section-insurance-faq">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-insurance-faq-title">
                Frequently Asked Questions
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Common questions about insurance-driven electrical inspections and panel upgrades in California.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-3">
              {faqData.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-card"
                  data-testid={`faq-insurance-item-${i}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                    data-testid={`button-insurance-faq-${i}`}
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
                      data-testid={`text-insurance-faq-answer-${i}`}
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

      <section id="lead-form" className="bg-background py-20" data-testid="section-insurance-form">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="space-y-6"
            >
              <motion.div variants={fadeUp}>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-insurance-form-title">
                  Get Your Inspection Scheduled
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Fill out the form and Roberto will follow up within one business day to confirm
                  availability and gather any additional details about your property.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium">Fast response</p>
                    <p className="text-sm text-muted-foreground">We follow up within one business day to confirm scheduling.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium">Written documentation</p>
                    <p className="text-sm text-muted-foreground">Receive a written report of findings suitable for your insurance carrier.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium">Permit & utility coordination</p>
                    <p className="text-sm text-muted-foreground">We handle the paperwork — permits, inspections, and utility coordination.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium">Multi-unit & portfolio work welcome</p>
                    <p className="text-sm text-muted-foreground">We accommodate apartment buildings, multi-unit properties, and portfolios.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-2 pt-2">
                <p className="text-sm font-medium">Prefer to reach us directly?</p>
                <a
                  href="mailto:Roberto@vivaes.net"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                  data-testid="link-insurance-email"
                >
                  <Mail className="h-4 w-4" /> Roberto@vivaes.net
                </a>
                <a
                  href="tel:5107105745"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                  data-testid="link-insurance-phone"
                >
                  <Phone className="h-4 w-4" /> (510) 710-5745
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
              viewport={{ once: true }}
            >
              <Card data-testid="card-insurance-lead-form">
                <CardContent className="p-6">
                  <h3 className="mb-1 text-lg font-semibold">Request an Inspection</h3>
                  <p className="mb-5 text-sm text-muted-foreground">
                    Share your property details and we'll get back to you quickly.
                  </p>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your name"
                                data-testid="input-insurance-name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                data-testid="input-insurance-email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="(510) 555-0100"
                                data-testid="input-insurance-phone"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Main St, Oakland, CA 94601"
                                data-testid="input-insurance-address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Details (optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your panel, the insurance notice you received, number of units, or any other relevant details..."
                                className="min-h-[100px]"
                                data-testid="input-insurance-message"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={mutation.isPending}
                        data-testid="button-insurance-submit"
                      >
                        {mutation.isPending ? "Submitting..." : "Request Inspection"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-16" data-testid="section-insurance-cta">
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
              Got a Notice from Your Insurer?
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto max-w-xl text-lg text-white/80">
              Don't wait — contact Viva directly and we'll help you move from notice to inspection to
              documented corrective action as quickly as possible.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
              <a href="tel:5107105745">
                <Button size="lg" variant="secondary" data-testid="button-insurance-cta-call">
                  <Phone className="mr-2 h-4 w-4" /> (510) 710-5745
                </Button>
              </a>
              <a href="#lead-form">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                  data-testid="button-insurance-cta-form"
                >
                  Request Inspection Online
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
