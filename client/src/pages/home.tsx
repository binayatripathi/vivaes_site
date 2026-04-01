import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuoteModal } from "@/components/quote-modal";
import { VapiCallButton } from "@/components/vapi-call-button";
import { servicesList, testimonials } from "@shared/schema";
import vivaLogoPath from "@assets/viva-logo.png";
import heroElectricianPath from "@assets/hero-electrician.png";
import {
  Sun, Zap, CircuitBoard, Lightbulb, Wrench, Building2,
  Shield, Award, Clock, Star, ChevronLeft, ChevronRight,
  ArrowRight, Phone, MessageCircle, ChevronDown, AlertTriangle,
} from "lucide-react";

const whyVivaCards = [
  {
    title: "Union Trained Professionals",
    description:
      "Our electricians receive continuous training and follow strict safety standards, this translates to better workmanship, safer installations, and dependable results.",
  },
  {
    title: "Focused Expertise",
    description:
      "We specialize in high-value electrical solutions that improve efficiency, reliability, and long-term performance.",
  },
  {
    title: "Community Driven",
    description:
      "We believe strong infrastructure strengthens communities. That's why we educate, support, and reinvest locally whenever possible.",
  },
  {
    title: "Straightforward Communication",
    description:
      "No jargon. No upselling. Just clear explanations and honest recommendations so you can make informed decisions.",
  },
];

const faqData = [
  {
    question: "What areas does Viva Electric & Solar serve?",
    answer:
      "We serve the entire San Francisco Bay Area including Oakland, Berkeley, Fremont, Hayward, San Francisco, San Leandro, Richmond, Concord, Livermore, Pleasanton, and Dublin. We also serve the Central Valley including Stockton, Tracy, and Modesto.",
  },
  {
    question: "Is Viva Electric & Solar licensed and insured?",
    answer:
      "Yes. Viva Electric & Solar Inc. holds California Contractor License #1147947. We are fully licensed, bonded, and insured. Our electricians are union-trained professionals.",
  },
  {
    question: "How much does solar panel installation cost in the Bay Area?",
    answer:
      "Solar panel installation costs vary based on system size, roof type, and your energy needs. We offer free instant quotes through our website or by calling (510) 710-5745. Most residential systems qualify for federal and state tax credits and incentives.",
  },
  {
    question: "Do you install EV chargers?",
    answer:
      "Yes, we install Level 2 EV chargers for all electric vehicle makes including Tesla, Ford, Rivian, Chevrolet, and more. Installation includes the charger, dedicated circuit, and any necessary panel upgrades.",
  },
  {
    question: "Can I get a quote without scheduling an appointment?",
    answer:
      "Absolutely. You can get an instant estimate through our website 24/7, or call us at (510) 710-5745 to speak with someone directly. No obligation, no pressure.",
  },
  {
    question: "What is an electrical panel upgrade and do I need one?",
    answer:
      "An electrical panel upgrade replaces your home's breaker box to support higher amperage — typically from 100A to 200A. You may need one if you're adding solar, an EV charger, a heat pump, or if your panel is outdated. We can assess your needs for free.",
  },
];

const iconMap: Record<string, typeof Sun> = {
  Sun, Zap, CircuitBoard, Lightbulb, Wrench, Building2, Shield,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>();
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const openQuote = (service?: string) => {
    setPreselectedService(service);
    setQuoteOpen(true);
  };

  const prevTestimonial = () =>
    setTestimonialIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const nextTestimonial = () =>
    setTestimonialIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  return (
    <>
      <section className="relative flex min-h-[85vh] items-center overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0">
          <img
            src={heroElectricianPath}
            alt="Hispanic electrician working on a residential electrical panel in a Bay Area home"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-2xl space-y-6"
          >
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                <Shield className="mr-1 h-3 w-3" /> Union Trained
              </Badge>
              <Badge variant="secondary" className="border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                <Award className="mr-1 h-3 w-3" /> Licensed & Insured
              </Badge>
              <Badge variant="secondary" className="border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                <Clock className="mr-1 h-3 w-3" /> 24/7 Available
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
              data-testid="text-hero-title"
            >
              We Show Up. We Fix It. You Pay a Fair Price.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg leading-relaxed text-white/80 sm:text-xl"
            >
              24/7 quotes and booking for residential and commercial
              electrical, solar installations, EV chargers, and more.
              Serving the Bay Area and Central Valley.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => openQuote()}
                data-testid="button-hero-quote"
              >
                Get Instant Quote
                <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/booking">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm"
                  data-testid="button-hero-book"
                >
                  Book Now
                </Button>
              </Link>
              <VapiCallButton
                variant="hero"
                size="lg"
                label="Talk to Us 24/7"
                className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white dark:text-white dark:hover:bg-white/20"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-background py-20" data-testid="section-services">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-services-title">
                Our Services
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                From solar installations to emergency repairs, our union-trained electricians deliver quality work every time.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {servicesList.filter((s) => !('hideFromGrid' in s && s.hideFromGrid)).slice(0, 6).map((service) => {
                const Icon = iconMap[service.icon] || Zap;
                const serviceHref = service.slug === "solar-storage" ? "/solar-storage" : `/services/${service.slug}`;
                return (
                  <motion.div key={service.slug} variants={fadeUp}>
                    <Link href={serviceHref}>
                      <Card className="group cursor-pointer overflow-hidden transition-all duration-200 hover-elevate" data-testid={`card-service-${service.slug}`}>
                        <CardContent className="p-0">
                          <div className="aspect-video w-full overflow-hidden">
                            <img
                              src={service.image}
                              alt={service.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="p-5">
                            <div className="mb-2 flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                                <Icon className="h-4 w-4 text-primary" />
                              </div>
                              <h3 className="text-lg font-semibold">{service.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {service.shortDescription}
                            </p>
                            <div className="mt-3 flex items-center text-sm font-medium text-primary">
                              Learn more
                              <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </div>
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

      <section className="bg-card py-16" data-testid="section-insurance-callout">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="flex flex-col items-center gap-6 text-center"
          >
            <motion.div variants={fadeUp} className="space-y-3">
              <div className="flex justify-center">
                <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  <span>Insurance Compliance Specialist</span>
                </Badge>
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-insurance-callout-title">
                Did Your Insurer Flag Your Electrical Panel?
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                California insurers are requiring homeowners and landlords to inspect or replace aging electrical
                panels before renewing coverage. Viva Electric & Solar helps you move quickly from notice to
                inspection to completed corrective work — with full documentation for your carrier.
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Link href="/insurance-compliance">
                <Button size="lg" data-testid="button-home-insurance-learn-more">
                  Learn About Insurance Compliance
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-background py-16" data-testid="section-energy-solutions">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="flex flex-col items-center gap-6 text-center"
          >
            <motion.div variants={fadeUp} className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-energy-solutions-title">
                Solar, Battery & Clean Energy Solutions
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                New solar systems, battery storage, add-ons to existing solar, and re-roofing panel removal — all in one place. Union-trained, permitted, and ready to maximize your energy independence.
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Link href="/solar-storage">
                <Button size="lg" data-testid="button-home-solar-learn-more">
                  Explore All Solar & Battery Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-muted py-20" data-testid="section-why-viva">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-why-viva-title">
                Why Viva
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                What Sets Us Apart
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {whyVivaCards.map((card) => (
                <motion.div key={card.title} variants={fadeUp}>
                  <div
                    className="flex h-full flex-col items-center rounded-md border border-slate-700 bg-slate-800 p-6 text-center dark:border-slate-600 dark:bg-slate-900"
                    data-testid={`card-why-viva-${card.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <img
                      src={vivaLogoPath}
                      alt="Viva Electric & Solar"
                      className="mb-4 h-14 w-auto brightness-125 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]"
                    />
                    <h3 className="mb-3 text-lg font-semibold text-white">
                      {card.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-300">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-card py-20" data-testid="section-testimonials">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                What Our Customers Say
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Real reviews from homeowners and businesses we've served.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="relative mx-auto max-w-3xl">
              <div className="overflow-hidden rounded-lg">
                <div className="flex flex-col items-center px-4 py-8 text-center sm:px-12">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: testimonials[testimonialIdx].rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-lg leading-relaxed text-foreground" data-testid="text-testimonial-content">
                    "{testimonials[testimonialIdx].content}"
                  </blockquote>
                  <div className="mt-6">
                    <p className="font-semibold" data-testid="text-testimonial-name">
                      {testimonials[testimonialIdx].name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[testimonialIdx].role}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-4">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={prevTestimonial}
                  data-testid="button-testimonial-prev"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex gap-1.5">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIdx(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === testimonialIdx ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                      }`}
                      data-testid={`button-testimonial-dot-${i}`}
                    />
                  ))}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={nextTestimonial}
                  data-testid="button-testimonial-next"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-muted py-20" data-testid="section-faq">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-faq-title">
                Frequently Asked Questions
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Quick answers about our services, coverage, and process.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-3">
              {faqData.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-card"
                  data-testid={`faq-item-${i}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                    data-testid={`button-faq-${i}`}
                  >
                    <span className="pr-4 font-medium">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground" data-testid={`text-faq-answer-${i}`}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-20" data-testid="section-cta">
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
              Get your free quote in minutes or book an appointment with our team.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => openQuote()}
                data-testid="button-cta-quote"
              >
                Get Instant Quote
                <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/booking">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm"
                  data-testid="button-cta-book"
                >
                  Book Now
                </Button>
              </Link>
              <VapiCallButton
                variant="hero"
                size="lg"
                label="Talk to Us 24/7"
                className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white dark:text-white dark:hover:bg-white/20"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <QuoteModal open={quoteOpen} onOpenChange={setQuoteOpen} preselectedService={preselectedService} />
    </>
  );
}
