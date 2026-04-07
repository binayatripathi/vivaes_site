import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageMeta } from "@/components/page-meta";
import powerwallHeroImg from "@assets/Screenshot_2026-04-07_at_01.15.12_1775549716549.png";
import powerwallProductImg from "@assets/Screenshot_2026-04-07_at_01.16.33_1775549796401.png";
import {
  Zap,
  Battery,
  Shield,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Home,
  Sun,
  Thermometer,
  DollarSign,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const powerwallMessages = [
  {
    icon: DollarSign,
    title: "Low Cost Design",
    description:
      "Designed and engineered to provide whole-home backup protection at a lower per-unit cost. With a fully integrated solar inverter, each unit is self-contained with fewer parts to install.",
  },
  {
    icon: Sun,
    title: "Electricity Bill Savings",
    description:
      "Harvest more solar energy and customizable usage settings provide greater value and lower electricity bills. The integrated solar inverter more efficiently converts solar energy into stored electricity.",
  },
  {
    icon: Thermometer,
    title: "Durable Design",
    description:
      "Designed and engineered for reliability and durability, capable of withstanding extreme weather conditions including high humidity, extreme temperatures, and up to 28 inches of water.",
  },
  {
    icon: Home,
    title: "Whole-Home Backup Protection",
    description:
      "A single unit can provide whole-home backup protection during a grid outage. Units begin powering the home as soon as an outage is detected — no delay of 2–5 seconds like similar home batteries.",
  },
  {
    icon: Zap,
    title: "One Integrated Ecosystem",
    description:
      "Designed to support EV home charging needs with the ability to optimize for sustainable charging and energy savings. Charge your EV on solar — even if the grid is down.",
  },
];

const wallConnectorBenefits = [
  "Fastest home charging speeds available for Tesla vehicles",
  "Wi-Fi connected for remote access and scheduling",
  "Certified installation with full permitting handled",
  "Works with Time-of-Use rate optimization",
  "Compatible with solar and Powerwall integration",
  "Professional mounting and panel work included",
];

export default function TeslaPage() {
  return (
    <>
      <PageMeta
        title="Tesla Certified Installer — Wall Connector & Powerwall 3 | Viva Electric & Solar"
        description="Viva Electric & Solar is a Tesla Certified Installer serving the Bay Area. We install Tesla Wall Connectors and Powerwall 3 home batteries. CA Lic #1147947."
        canonical="https://vivaes.net/tesla"
        ogTitle="Tesla Certified Installer — Viva Electric & Solar Bay Area"
        ogDescription="Certified Tesla Wall Connector and Powerwall 3 installer serving the SF Bay Area. Find us on Tesla's Installer Locator. CA Lic #1147947."
      />

      <section
        className="relative flex min-h-[60vh] items-center overflow-hidden"
        data-testid="section-tesla-hero"
      >
        <img
          src={powerwallHeroImg}
          alt="Tesla Powerwall 3 installed on exterior of Bay Area home at night"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.75) 50%, rgba(8,8,8,0.4) 100%), radial-gradient(ellipse at 20% 60%, rgba(227,25,55,0.15) 0%, transparent 50%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl space-y-6"
          >
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              <Badge
                className="border border-[#e31937]/40 bg-[#e31937]/10 text-[#e31937] px-3 py-1"
                data-testid="badge-tesla-certified"
              >
                <Shield className="mr-1.5 h-3.5 w-3.5" />
                Tesla Certified Installer
              </Badge>
              <Badge
                className="border border-white/20 bg-white/10 text-white px-3 py-1"
              >
                Listed on Tesla's Installer Locator
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
              data-testid="text-tesla-hero-title"
            >
              Power Everything
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg leading-relaxed text-white/70 sm:text-xl"
            >
              Viva Electric & Solar is a Tesla Certified Installer serving the San Francisco Bay Area.
              We install Tesla Wall Connectors and Powerwall 3 home batteries — with full permitting,
              expert installation, and lasting support.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
              <Link href="/booking">
                <Button
                  size="lg"
                  className="bg-[#e31937] hover:bg-[#c41530] text-white border-0"
                  data-testid="button-tesla-hero-book"
                >
                  Book a Consultation — $250
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a
                href="https://www.tesla.com/support/certified-installers"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                  data-testid="button-tesla-find-installer"
                >
                  Find Certified Installers
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-background py-20" data-testid="section-wall-connector">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="text-center">
              <Badge
                className="mb-4 border border-[#e31937]/30 bg-[#e31937]/10 text-[#e31937]"
              >
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                Tesla Wall Connector
              </Badge>
              <h2
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                data-testid="text-wall-connector-title"
              >
                Home EV Charging, Done Right
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                The Tesla Wall Connector is the fastest and most convenient home charging solution for
                Tesla owners. As certified installers, we handle every step from electrical panel
                assessment to permitted installation.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <motion.div variants={fadeUp} className="space-y-6">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="/images/services/ev-chargers.png"
                    alt="Tesla Wall Connector EV charger installation"
                    className="w-full h-56 object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Why Choose a Certified Installer?</h3>
                <p className="text-muted-foreground">
                  Tesla requires Wall Connectors to be installed by certified electricians to ensure
                  safety, warranty validity, and optimal performance. Viva Electric & Solar is
                  listed directly on Tesla's installer locator — you can verify our certification
                  before booking.
                </p>
                <p className="text-muted-foreground">
                  Our team handles the full process: site assessment, permit applications, panel
                  upgrades if needed, and final inspection. Most installations are completed in a
                  single day.
                </p>
                <div className="space-y-3">
                  {wallConnectorBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#e31937]" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Card className="h-full border-[#e31937]/20 bg-card">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#e31937]/10">
                      <Zap className="h-7 w-7 text-[#e31937]" />
                    </div>
                    <h3 className="text-xl font-bold">Installation Process</h3>
                    <div className="space-y-4">
                      {[
                        { step: "1", title: "Site Assessment", desc: "We evaluate your panel capacity and determine the best placement for your Wall Connector." },
                        { step: "2", title: "Permit & Design", desc: "We file permits with your local building department and create an installation plan." },
                        { step: "3", title: "Professional Install", desc: "Our union-trained electricians install the Wall Connector with all required wiring and circuit work." },
                        { step: "4", title: "Inspection & Activation", desc: "We coordinate the final inspection and walk you through your new charging setup." },
                      ].map((item) => (
                        <div key={item.step} className="flex gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e31937]/10 text-sm font-bold text-[#e31937]">
                            {item.step}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link href="/booking">
                      <Button
                        className="w-full bg-[#e31937] hover:bg-[#c41530] text-white border-0"
                        data-testid="button-wall-connector-book"
                      >
                        Book Wall Connector Install
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        className="py-20"
        data-testid="section-powerwall"
        style={{ background: "linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-14"
          >
            <motion.div variants={fadeUp} className="text-center">
              <Badge
                className="mb-4 border border-[#e31937]/40 bg-[#e31937]/10 text-[#e31937]"
              >
                <Battery className="mr-1.5 h-3.5 w-3.5" />
                Tesla Powerwall 3
              </Badge>
              <h2
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
                data-testid="text-powerwall-title"
              >
                More Power. More Backup. More Savings.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-white/60">
                Powerwall 3 is a compact home battery with an integrated solar inverter that offers
                seamless whole-home backup protection and increased electricity bill savings. One unit
                can back up your entire home.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="overflow-hidden rounded-2xl bg-black">
              <div className="relative h-64 sm:h-80 flex items-center justify-center">
                <img
                  src={powerwallProductImg}
                  alt="Tesla Powerwall 3 home battery unit"
                  className="h-full w-auto max-w-full object-contain"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to right, rgba(8,8,8,0.7) 0%, transparent 60%)" }}
                />
                <div className="absolute left-8 top-1/2 -translate-y-1/2">
                  <p className="text-sm text-white/50 uppercase tracking-widest mb-2">Tesla Powerwall 3</p>
                  <p className="text-2xl font-bold text-white sm:text-3xl">Power Everything.</p>
                  <p className="text-white/60 mt-1">Whole-home backup, starting with one unit.</p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {powerwallMessages.slice(0, 3).map((msg) => {
                const Icon = msg.icon;
                return (
                  <motion.div key={msg.title} variants={fadeUp}>
                    <Card
                      className="h-full border-white/10 bg-white/5 backdrop-blur"
                      data-testid={`card-powerwall-${msg.title.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <CardContent className="p-6 space-y-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e31937]/15">
                          <Icon className="h-5 w-5 text-[#e31937]" />
                        </div>
                        <h3 className="font-semibold text-white">{msg.title}</h3>
                        <p className="text-sm text-white/60 leading-relaxed">{msg.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {powerwallMessages.slice(3).map((msg) => {
                const Icon = msg.icon;
                return (
                  <motion.div key={msg.title} variants={fadeUp}>
                    <Card
                      className="h-full border-white/10 bg-white/5 backdrop-blur"
                      data-testid={`card-powerwall-${msg.title.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <CardContent className="p-6 space-y-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e31937]/15">
                          <Icon className="h-5 w-5 text-[#e31937]" />
                        </div>
                        <h3 className="font-semibold text-white">{msg.title}</h3>
                        <p className="text-sm text-white/60 leading-relaxed">{msg.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <motion.div variants={fadeUp} className="text-center">
              <p className="mb-6 text-white/60 text-sm">
                Stack up to 10 units for maximum energy independence. Easy system expansion as your household energy needs grow.
              </p>
              <Link href="/booking">
                <Button
                  size="lg"
                  className="bg-[#e31937] hover:bg-[#c41530] text-white border-0"
                  data-testid="button-powerwall-book"
                >
                  Get a Powerwall 3 Quote — $250 Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-card py-20" data-testid="section-tesla-find-us">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="flex flex-col items-center gap-8 text-center"
          >
            <motion.div variants={fadeUp} className="space-y-4">
              <Badge
                className="border border-[#e31937]/30 bg-[#e31937]/10 text-[#e31937] px-3 py-1"
              >
                <Shield className="mr-1.5 h-3.5 w-3.5" />
                Certified & Listed
              </Badge>
              <h2
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                data-testid="text-tesla-find-us-title"
              >
                Certified by Tesla — Listed as an Official Installer
              </h2>
              <p className="mx-auto max-w-xl text-muted-foreground">
                Viva Electric & Solar is an officially certified Tesla installer. You can learn more about
                Tesla Powerwall and Wall Connector directly on Tesla's website.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://www.tesla.com/support/certified-installers"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-tesla-locator"
              >
                <Button
                  size="lg"
                  className="bg-[#e31937] hover:bg-[#c41530] text-white border-0"
                >
                  Find Certified Installers
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <Link href="/booking">
                <Button
                  size="lg"
                  variant="outline"
                  data-testid="button-tesla-cta-book"
                >
                  Book a $250 Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-4 text-sm text-muted-foreground">
              <p>CA Contractor License #1147947 · C-10 Electrical · Union-Trained Professionals</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
