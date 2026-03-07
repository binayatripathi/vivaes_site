import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuoteModal } from "@/components/quote-modal";
import {
  Sun,
  Battery,
  Wrench,
  Activity,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const batteryBrands = [
  { name: "Enphase", initials: "EN" },
  { name: "Tesla Powerwall", initials: "TP" },
  { name: "FranklinWH", initials: "FW" },
  { name: "SolarEdge", initials: "SE" },
  { name: "Generac PWRcell", initials: "GC" },
];

const serviceCards = [
  {
    title: "Battery Add-On to Existing Solar",
    description:
      "Already have solar panels? Add a battery storage system to store excess energy, reduce your reliance on the grid, and keep the lights on during outages. We work with all major inverter brands for seamless integration.",
    icon: Battery,
    quoteService: "battery-addon",
    image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800&q=80",
  },
  {
    title: "Re-Roofing with Panel Removal & Reinstall",
    description:
      "Need a new roof but have solar panels in the way? We safely remove your panels, coordinate with your roofer, and reinstall everything once the roof is done — fully tested and permitted.",
    icon: Wrench,
    quoteService: "reroofing-solar",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80",
  },
  {
    title: "System Health Checks & Optimization",
    description:
      "Is your solar system performing at its best? We inspect panels, wiring, inverters, and monitoring systems to diagnose issues and optimize output. Includes a detailed performance report.",
    icon: Activity,
    quoteService: "solar-storage",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
  },
];

export default function SolarStoragePage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>();

  const openQuote = (service?: string) => {
    setPreselectedService(service);
    setQuoteOpen(true);
  };

  return (
    <>
      <section
        className="relative flex min-h-[50vh] items-center overflow-hidden"
        data-testid="section-solar-hero"
      >
        <img
          src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1600&q=80"
          alt="Solar panels on a residential roof"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-2xl space-y-6"
          >
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                <Sun className="mr-1 h-3 w-3" /> Solar Experts
              </Badge>
              <Badge variant="secondary" className="border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                <ShieldCheck className="mr-1 h-3 w-3" /> Licensed & Insured
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl"
              data-testid="text-solar-hero-title"
            >
              Solar & Battery Storage
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg leading-relaxed text-white/80 sm:text-xl"
            >
              Store your solar energy, keep the lights on during outages, and
              take control of your electricity costs with premium battery
              storage solutions.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => openQuote("solar-storage")}
                data-testid="button-solar-hero-quote"
              >
                Get a Free Quote
                <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/services/solar-storage">
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white backdrop-blur-sm" data-testid="button-solar-hero-services">
                  View Solar Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-card py-20" data-testid="section-battery-brands">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                data-testid="text-brands-title"
              >
                Battery Storage Brands We Install
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                We partner with the industry's leading battery manufacturers to
                deliver reliable, high-performance energy storage for your home
                or business.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
            >
              {batteryBrands.map((brand) => (
                <div
                  key={brand.name}
                  className="flex flex-col items-center justify-center gap-3 rounded-md border border-border bg-background p-6 text-center"
                  data-testid={`brand-${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                    <span className="text-lg font-bold text-primary">
                      {brand.initials}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{brand.name}</span>
                </div>
              ))}
              <div
                className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-background p-6 text-center"
                data-testid="brand-more"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                  <span className="text-lg font-bold text-muted-foreground">+</span>
                </div>
                <Badge variant="outline">+ More</Badge>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-background py-20" data-testid="section-solar-services">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                data-testid="text-solar-services-title"
              >
                Our Solar & Storage Services
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Whether you're adding batteries to an existing system, need
                panels removed for a re-roof, or want a full health check —
                we've got you covered.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {serviceCards.map((card) => {
                const Icon = card.icon;
                return (
                  <motion.div key={card.title} variants={fadeUp}>
                    <Card
                      className="flex h-full flex-col overflow-visible hover-elevate"
                      data-testid={`card-solar-${card.title.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <div className="relative h-48 w-full overflow-hidden rounded-t-md">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="flex flex-1 flex-col p-6">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
                        <p className="mb-6 flex-1 text-sm text-muted-foreground">
                          {card.description}
                        </p>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => openQuote(card.quoteService)}
                          data-testid={`button-quote-${card.title.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          Get a Quote
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-20" data-testid="section-solar-cta">
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
              Ready to Go Solar or Add Battery Storage?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto max-w-xl text-lg text-white/80"
            >
              Get a free, no-obligation quote in minutes. Our team will help you
              find the right solution for your home or business.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <Button
                size="lg"
                variant="secondary"
                onClick={() => openQuote("solar-storage")}
                data-testid="button-solar-cta-quote"
              >
                Get Instant Quote
                <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/booking">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm"
                  data-testid="button-solar-cta-book"
                >
                  Book a Consultation
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <QuoteModal
        open={quoteOpen}
        onOpenChange={setQuoteOpen}
        preselectedService={preselectedService}
      />
    </>
  );
}
