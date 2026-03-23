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
  CheckCircle,
  ExternalLink,
  HardHat,
  Zap,
  CircuitBoard,
  Power,
  Home,
  ShieldAlert,
} from "lucide-react";

const powerwallRainPath = "/images/services/battery-only.jpg";
const powerwallSolarPath = "/images/services/battery-addon.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const batteryBrands = [
  { name: "Enphase IQ Battery", initials: "EN", url: "https://enphase.com/homeowners/home-solar-batteries" },
  { name: "Tesla Powerwall", initials: "TP", url: "https://www.tesla.com/powerwall" },
  { name: "FranklinWH", initials: "FW", url: "https://www.franklinwh.com" },
  { name: "SolarEdge Energy Bank", initials: "SE", url: "https://www.solaredge.com/us/products/residential/storage-and-backup" },
  { name: "Generac PWRcell", initials: "GC", url: "https://www.generac.com/pwrcell" },
];

const serviceCards = [
  {
    title: "Add Battery Storage to Your Existing Solar System",
    description:
      "Already have solar panels installed? A home battery can be added to store excess solar energy and provide backup power during outages. We evaluate your current solar equipment, inverter, and electrical system to determine the best battery solution that integrates with your setup. We install and integrate Tesla Powerwall, Enphase IQ Battery, FranklinWH, SolarEdge, and Generac PWRcell.",
    icon: Battery,
    quoteService: "battery-addon",
    image: powerwallSolarPath,
  },
  {
    title: "Re-Roofing with Solar Panel Removal & Reinstall",
    description:
      "Need solar panel removal for roof replacement? We safely remove your panels, coordinate with your roofer, and perform a complete solar panel removal and reinstall once the roof is done — fully tested and permitted. We work as a trusted solar removal and reinstall subcontractor for roofing companies across the Bay Area and Central Valley.",
    icon: Wrench,
    quoteService: "reroofing-solar",
    image: "/images/services/reroofing-solar.jpg",
  },
  {
    title: "System Health Checks & Optimization",
    description:
      "Is your solar system performing at its best? We inspect panels, wiring, inverters, and monitoring systems to diagnose issues and optimize output. Includes a detailed performance report.",
    icon: Activity,
    quoteService: "solar-storage",
    image: "/images/services/solar-battery-new.jpg",
  },
];

const panelRemovalIncludes = [
  "Safe removal and secure storage of all solar panels and racking",
  "Coordination with your roofing contractor on project timeline",
  "Complete reinstallation and reconnection after roof work is done",
  "Full system testing to verify performance and output",
  "Permit handling and utility coordination as needed",
  "Warranty on all reinstallation labor and materials",
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
          src="/images/pages/solar-installation.png"
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
                Home Battery Backup Systems We Install
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-muted-foreground">
                We install leading solar battery systems that store excess solar energy and provide backup power during grid outages. Battery storage can also be added to many existing solar systems to increase energy independence and improve energy management.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
            >
              {batteryBrands.map((brand) => (
                <a
                  key={brand.name}
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center gap-3 rounded-md border border-border bg-background p-6 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                  data-testid={`brand-${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <span className="text-lg font-bold text-primary">
                      {brand.initials}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{brand.name}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Already have solar panels? We can add battery storage to many existing solar systems.
              </p>
              <Button
                size="lg"
                onClick={() => openQuote("battery-addon")}
                data-testid="button-check-battery-compatibility"
              >
                <Battery className="mr-2 h-4 w-4" />
                Check if Your Solar System Can Add a Battery
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-background py-20" data-testid="section-existing-solar">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                <Wrench className="mr-1 h-3 w-3" /> Existing System Support
              </Badge>
              <h2
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                data-testid="text-existing-solar-title"
              >
                Add Battery Backup to Your Existing Solar System
              </h2>
            </motion.div>

            <motion.div variants={fadeUp} className="mx-auto max-w-4xl space-y-4 text-center">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Already have solar installed? Viva Electric & Solar Inc. can help you upgrade your existing system with battery storage, electrical improvements, and service support.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Many homeowners are stuck with solar systems installed by companies that are no longer in business or no longer provide support. We work with existing systems and help evaluate what's possible — whether that means troubleshooting, maintenance, electrical upgrades, or adding battery backup.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                If you want to improve reliability, add backup power, or make better use of the solar system you already have, we can help you understand your options and recommend the right next step.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <motion.div variants={fadeUp}>
                <Card className="h-full hover-elevate" data-testid="card-existing-solar-upgrade">
                  <CardContent className="p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <Sun className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">Already Have Solar? Upgrade It.</h3>
                    <p className="text-sm text-muted-foreground">
                      Add battery storage or electrical improvements to any existing solar system. Get more out of the panels you already own.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Card className="h-full hover-elevate" data-testid="card-existing-solar-service">
                  <CardContent className="p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <HardHat className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">We Service Solar Systems — Even If We Didn't Install Them.</h3>
                    <p className="text-sm text-muted-foreground">
                      No matter who installed your system, we can inspect, troubleshoot, repair, and upgrade it. You don't need to go back to the original installer.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Card className="h-full hover-elevate" data-testid="card-existing-solar-orphan">
                  <CardContent className="p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">Original Installer Gone? We Can Help.</h3>
                    <p className="text-sm text-muted-foreground">
                      If your solar company closed or stopped responding, we step in. We evaluate your system, handle repairs, and keep your panels producing.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Card className="h-full hover-elevate" data-testid="card-existing-solar-battery">
                  <CardContent className="p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <Battery className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">Add Battery Backup to Your Existing Solar System.</h3>
                    <p className="text-sm text-muted-foreground">
                      Store excess energy your panels produce and use it during outages or peak-rate hours. We integrate top battery brands with your current setup.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="mx-auto max-w-3xl space-y-6">
              <p className="text-center text-sm text-muted-foreground">
                We work on existing solar systems — including systems installed by other companies. From troubleshooting and repairs to electrical upgrades and battery storage add-ons, Viva Electric & Solar Inc. helps homeowners improve and maintain the system they already have.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  onClick={() => openQuote("battery-addon")}
                  data-testid="button-existing-solar-quote"
                >
                  Get a Battery Add-On Quote
                  <MessageCircle className="ml-2 h-4 w-4" />
                </Button>
                <Link href="/booking">
                  <Button size="lg" variant="outline" data-testid="button-existing-solar-book">
                    Schedule an Inspection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-card py-20" data-testid="section-solar-services">
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

      <section className="bg-muted py-20" data-testid="section-battery-backup">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="text-center">
              <Badge variant="secondary" className="mb-4">
                <ShieldAlert className="mr-1 h-3 w-3" /> Power Security
              </Badge>
              <h2
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                data-testid="text-battery-backup-title"
              >
                Battery Backup & Backup Power Readiness
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-muted-foreground">
                Don't wait for the next outage to think about backup power. Whether you have solar or not, a battery backup system keeps your lights on, your fridge running, and your family safe when the grid goes down.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <motion.div variants={fadeUp} className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <Battery className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Standalone Battery Backup</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      No solar panels needed. We install battery systems that charge from the grid during off-peak hours and provide seamless backup power during outages. Perfect for areas with unreliable power or homes that aren't ready for solar yet.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <Sun className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Battery Add-On to Existing Solar</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Already have solar panels? Add a battery to store excess energy you're currently sending back to the grid. Use stored power during peak rate hours or outages to maximize your solar investment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <CircuitBoard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Backup Power Readiness Assessment</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Not sure if your home is ready for a battery? We evaluate your electrical panel, load capacity, and wiring to determine the best backup solution — and tell you exactly what it will take to get set up.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col justify-center space-y-4">
                <div className="overflow-hidden rounded-lg aspect-[4/3]">
                  <img
                    src={powerwallRainPath}
                    alt="Tesla Powerwall battery backup installed on a home"
                    className="h-full w-full object-cover"
                    data-testid="img-battery-backup"
                  />
                </div>
                <div className="rounded-lg border bg-card p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Is Your Home Ready?</h3>
                  <p className="text-sm text-muted-foreground">
                    A quick assessment can tell you if your home can support a battery system today — or what upgrades you might need first. We check your panel capacity, grounding, and available space.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => openQuote("battery-only")}
                      data-testid="button-battery-backup-quote"
                    >
                      Get a Battery Backup Estimate
                      <MessageCircle className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => openQuote("electrification-assessment")}
                      data-testid="button-backup-readiness"
                    >
                      See if Your Home is Ready
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-background py-20" data-testid="section-ev-solar-coordination">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="text-center">
              <Badge variant="secondary" className="mb-4">
                <Zap className="mr-1 h-3 w-3" /> All-Electric Home
              </Badge>
              <h2
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                data-testid="text-ev-solar-title"
              >
                EV + Solar + Battery Coordination
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-muted-foreground">
                Going all-electric? Bundling your EV charger, panel upgrade, and battery backup into one project saves time, reduces costs, and ensures everything works together from day one.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <motion.div variants={fadeUp}>
                <Card className="flex h-full flex-col overflow-visible hover-elevate" data-testid="card-ev-solar-bundle">
                  <CardContent className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">EV Charger + Panel + Battery</h3>
                    <p className="mb-6 flex-1 text-sm text-muted-foreground">
                      The complete package. We install your EV charger, upgrade your panel to handle the added load, and add battery backup — all in one coordinated project with one permit and one crew.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => openQuote("ev-panel-battery")}
                      data-testid="button-quote-ev-panel-battery"
                    >
                      Get a Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Card className="flex h-full flex-col overflow-visible hover-elevate" data-testid="card-panel-energy">
                  <CardContent className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                      <CircuitBoard className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">Panel Upgrades for Energy Systems</h3>
                    <p className="mb-6 flex-1 text-sm text-muted-foreground">
                      Your electrical panel is the backbone of any energy system. We upgrade panels from 100A to 200A or 400A to support solar, batteries, EV chargers, heat pumps, and more.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => openQuote("panel-upgrades")}
                      data-testid="button-quote-panel-energy"
                    >
                      Get a Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="text-center">
              <Button
                size="lg"
                onClick={() => openQuote("ev-panel-battery")}
                data-testid="button-custom-energy-quote"
              >
                Request a Custom Electrical + Energy System Quote
                <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-card py-20" data-testid="section-panel-removal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="text-center">
              <Badge variant="secondary" className="mb-4">
                <HardHat className="mr-1 h-3 w-3" /> Add-On Services
              </Badge>
              <h2
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                data-testid="text-panel-removal-title"
              >
                Solar Panel Removal & Reinstallation
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              <motion.div variants={fadeUp} className="space-y-6">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  We provide professional <strong>solar panel removal and reinstall</strong> services for homeowners and roofing contractors. If your home needs a new roof, our team performs a complete <strong>solar detach and reset</strong> so the roofing project can proceed safely and on schedule.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Whether you need <strong>solar panel removal for roof replacement</strong> on your own home or you're a roofing company looking for a reliable <strong>solar removal and reinstall subcontractor</strong>, we handle every step — from safe panel removal to full system reinstallation and testing.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  We serve homeowners and contractors across the region, including <strong>solar panel removal Central Valley</strong> (Stockton, Tracy, Modesto, Manteca) and <strong>solar panel removal Bay Area</strong> (Oakland, Berkeley, Fremont, San Francisco, and surrounding cities).
                </p>

                <div className="space-y-3 pt-2">
                  <h3 className="text-lg font-semibold">What's Included</h3>
                  <ul className="space-y-2">
                    {panelRemovalIncludes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <Button
                    size="lg"
                    onClick={() => openQuote("reroofing-solar")}
                    data-testid="button-panel-removal-quote"
                  >
                    Get a Quote for Panel Removal
                    <MessageCircle className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="overflow-hidden rounded-md">
                <img
                  src="/images/services/reroofing-solar.jpg"
                  alt="Solar panel removal and reinstall for roof replacement"
                  className="h-full w-full object-cover"
                  data-testid="img-panel-removal"
                />
              </motion.div>
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
