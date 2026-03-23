import { useState } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuoteModal } from "@/components/quote-modal";
import { VapiCallButton } from "@/components/vapi-call-button";
import { servicesList } from "@shared/schema";
import {
  Sun, Zap, CircuitBoard, Lightbulb, Wrench, Building2,
  Battery, Home, ClipboardCheck, Warehouse,
  ArrowRight, ArrowLeft, CheckCircle2,
} from "lucide-react";

const iconMap: Record<string, typeof Sun> = {
  Sun, Zap, CircuitBoard, Lightbulb, Wrench, Building2,
  Battery, Home, ClipboardCheck, Warehouse,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export function ServicesListPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const openQuote = (slug: string) => {
    setSelectedService(slug);
    setQuoteOpen(true);
  };

  return (
    <>
      <section className="bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.h1
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              data-testid="text-services-heading"
            >
              Our Services
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-3 max-w-2xl text-muted-foreground">
              Comprehensive electrical and solar solutions for residential and commercial properties.
              All work performed by union-trained, licensed professionals.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {servicesList.filter((s) => !('hideFromGrid' in s && s.hideFromGrid)).map((service) => {
              const Icon = iconMap[service.icon] || Zap;
              return (
                <motion.div key={service.slug} variants={fadeUp}>
                  <Card className="overflow-visible hover-elevate" data-testid={`card-service-${service.slug}`}>
                    <CardContent className="p-0">
                      <div className="aspect-video w-full overflow-hidden rounded-t-md">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-3 p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <h2 className="text-xl font-semibold">{service.title}</h2>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {service.shortDescription}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Link href={`/services/${service.slug}`}>
                            <Button variant="outline" size="sm" data-testid={`button-details-${service.slug}`}>
                              View Details
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            onClick={() => openQuote(service.slug)}
                            data-testid={`button-quote-${service.slug}`}
                          >
                            Get Quote
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <QuoteModal open={quoteOpen} onOpenChange={setQuoteOpen} preselectedService={selectedService} />
    </>
  );
}

export function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const [quoteOpen, setQuoteOpen] = useState(false);

  const service = servicesList.find((s) => s.slug === params.slug);

  if (!service) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Service Not Found</h1>
          <p className="mt-2 text-muted-foreground">The service you're looking for doesn't exist.</p>
          <Link href="/services">
            <Button className="mt-4" data-testid="button-back-services">Back to Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = iconMap[service.icon] || Zap;
  const benefits = [
    "Union-trained, licensed electricians",
    "Full permitting and inspection support",
    "Industry-leading warranty coverage",
    "24/7 emergency service available",
    "On-site consultation: $250 (final quote included)",
    "Financing options available",
  ];

  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 h-72">
          <img
            src={service.image}
            alt={service.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:px-8">
          <Link href="/services" className="inline-flex items-center text-sm text-white/70 transition-colors">
            <ArrowLeft className="mr-1 h-3 w-3" />
            All Services
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white/20 backdrop-blur-sm">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl" data-testid="text-service-title">
              {service.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16 pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-6 lg:col-span-2"
            >
              <motion.div variants={fadeUp}>
                <h2 className="text-2xl font-bold">About This Service</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-3">
                <h3 className="text-lg font-semibold">What's Included</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {benefits.map((b) => (
                    <div key={b} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } }}
            >
              <Card data-testid="card-service-cta">
                <CardContent className="space-y-4 p-6">
                  <h3 className="text-lg font-semibold">Get an Instant Quote</h3>
                  <p className="text-sm text-muted-foreground">
                    Get your personalized quote in minutes. Available 24/7.
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => setQuoteOpen(true)}
                    data-testid="button-service-quote"
                  >
                    Get Quote for {service.title}
                  </Button>
                  <Link href="/booking">
                    <Button variant="outline" className="w-full" data-testid="button-service-book">
                      Book Appointment
                    </Button>
                  </Link>
                  <VapiCallButton
                    variant="outline"
                    className="w-full"
                    label="Talk to Our Team 24/7"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <QuoteModal open={quoteOpen} onOpenChange={setQuoteOpen} preselectedService={service.slug} />
    </>
  );
}
