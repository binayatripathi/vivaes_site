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
import {
  Sun, Zap, CircuitBoard, Lightbulb, Wrench, Building2,
  Shield, Award, Clock, Star, ChevronLeft, ChevronRight,
  ArrowRight, Phone, MessageCircle,
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

const iconMap: Record<string, typeof Sun> = {
  Sun, Zap, CircuitBoard, Lightbulb, Wrench, Building2,
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
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const prevTestimonial = () =>
    setTestimonialIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const nextTestimonial = () =>
    setTestimonialIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  return (
    <>
      <section className="relative flex min-h-[85vh] items-center overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1600&q=80"
            alt="Electrician working on a residential electrical panel in an older home"
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
                onClick={() => setQuoteOpen(true)}
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
              {servicesList.slice(0, 6).map((service) => {
                const Icon = iconMap[service.icon] || Zap;
                return (
                  <motion.div key={service.slug} variants={fadeUp}>
                    <Link href={`/services/${service.slug}`}>
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
                      className="mb-4 h-12 w-auto"
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
                onClick={() => setQuoteOpen(true)}
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

      <QuoteModal open={quoteOpen} onOpenChange={setQuoteOpen} />
    </>
  );
}
