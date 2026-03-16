import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuoteModal } from "@/components/quote-modal";
import {
  Zap,
  Sun,
  Battery,
  Home,
  DollarSign,
  ArrowRight,
  CircuitBoard,
  Flame,
  Wind,
  MessageCircle,
  CheckCircle,
  Leaf,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const rebates = [
  {
    title: "SMUD Go Electric Bonus",
    description: "Active for SMUD-territory customers. Panel upgrade up to $2,000, heat pump HVAC $2,000–$3,000, heat pump water heater up to $4,000. Subject to funding availability.",
    amount: "Up to $4,000",
    icon: Zap,
  },
  {
    title: "California Property Tax Exclusion",
    description: "Solar installations are excluded from property tax reassessment through December 31, 2026.",
    amount: "Tax Exclusion",
    icon: Home,
  },
  {
    title: "PG&E Energy-Smart Homes",
    description: "Base incentive of $4,250 for qualifying whole-home electrification projects in PG&E territory, through 2027.",
    amount: "$4,250 Base",
    icon: DollarSign,
  },
  {
    title: "TECH Clean California",
    description: "State contractor incentives for heat pump and electrification projects. Must use a certified contractor. Varies by region and funding availability.",
    amount: "Varies",
    icon: Battery,
  },
];

const roadmapSteps = [
  {
    step: 1,
    title: "Panel Upgrade",
    description: "Upgrade your electrical panel to 200A (or higher) so your home can handle modern electric appliances, EV chargers, and solar systems safely.",
    icon: CircuitBoard,
  },
  {
    step: 2,
    title: "Solar + Battery",
    description: "Install rooftop solar panels and a battery storage system to generate your own clean energy and keep the lights on during outages.",
    icon: Sun,
  },
  {
    step: 3,
    title: "Switch Appliances",
    description: "Replace your gas furnace, water heater, stove, and dryer with efficient electric alternatives like heat pumps and induction cooktops.",
    icon: Flame,
  },
];

export default function ElectrificationPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <section className="relative flex min-h-[50vh] items-center overflow-hidden" data-testid="section-electrification-hero">
        <img
          src="/images/pages/craftsman-home.png"
          alt="Older home being renovated with electrical upgrades"
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
                <Leaf className="mr-1 h-3 w-3" /> Go All-Electric
              </Badge>
              <Badge variant="secondary" className="border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                <DollarSign className="mr-1 h-3 w-3" /> Incentives May Apply
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
              data-testid="text-electrification-hero-title"
            >
              Home Electrification
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg leading-relaxed text-white/80 sm:text-xl"
              data-testid="text-electrification-hero-subtitle"
            >
              Ditch gas. Cut your bills. We'll walk you through every step.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => setQuoteOpen(true)}
                data-testid="button-electrification-hero-quote"
              >
                Free Electrification Assessment
                <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/quote">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm"
                  data-testid="button-electrification-hero-instant-quote"
                >
                  Get Instant Quote
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-background py-20" data-testid="section-what-is-electrification">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="mx-auto max-w-5xl">
              <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                <div className="overflow-hidden rounded-md">
                  <img
                    src="/images/pages/electrical-panel-work.jpg"
                    alt="Electrician working on a home electrical panel"
                    className="h-full w-full object-cover"
                    data-testid="img-what-is-electrification"
                  />
                </div>
                <div className="text-left">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-what-is-electrification-title">
                    What Is Home Electrification?
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground" data-testid="text-what-is-electrification-description">
                    Home electrification means replacing the gas-powered stuff in your house — your furnace, water heater, stove, and dryer — with modern electric versions that run cleaner, safer, and cheaper. Instead of burning natural gas, you power everything with electricity, ideally from solar panels on your roof.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="mx-auto max-w-3xl">
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold" data-testid="text-why-electrify-title">Why Go Electric?</h3>
                      <ul className="space-y-3">
                        {[
                          "Lower monthly energy bills",
                          "No more gas leaks or carbon monoxide risk",
                          "Potential utility and state incentives depending on your area",
                          "Increase your home's value",
                          "Reduce your carbon footprint",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                            <span data-testid={`text-benefit-${i}`}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold" data-testid="text-what-gets-replaced-title">What Gets Replaced?</h3>
                      <ul className="space-y-3">
                        {[
                          { old: "Gas furnace", newer: "Heat pump" },
                          { old: "Gas water heater", newer: "Heat pump water heater" },
                          { old: "Gas stove", newer: "Induction cooktop" },
                          { old: "Gas dryer", newer: "Electric heat pump dryer" },
                          { old: "Gas fireplace", newer: "Electric fireplace or mini-split" },
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Wind className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                            <span data-testid={`text-replacement-${i}`}>
                              <span className="line-through">{item.old}</span>
                              <ArrowRight className="mx-1 inline h-3 w-3" />
                              <span className="font-medium text-foreground">{item.newer}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-card py-20" data-testid="section-rebates">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-rebates-title">
                Rebates & Incentives
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                There's never been a better time to electrify your home. Depending on your utility and location, state and local programs may help reduce the cost.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {rebates.map((rebate) => {
                const Icon = rebate.icon;
                return (
                  <motion.div key={rebate.title} variants={fadeUp}>
                    <Card className="h-full" data-testid={`card-rebate-${rebate.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold" data-testid={`text-rebate-title-${rebate.title.toLowerCase().replace(/\s+/g, "-")}`}>
                              {rebate.title}
                            </h3>
                          </div>
                          <Badge variant="secondary" data-testid={`badge-rebate-amount-${rebate.title.toLowerCase().replace(/\s+/g, "-")}`}>
                            {rebate.amount}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground" data-testid={`text-rebate-desc-${rebate.title.toLowerCase().replace(/\s+/g, "-")}`}>
                          {rebate.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <motion.p variants={fadeUp} className="mt-6 text-center text-sm text-muted-foreground" data-testid="text-rebates-disclaimer">
              Incentive programs change frequently and are subject to funding availability. Contact us for current programs available in your area.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="bg-background py-20" data-testid="section-roadmap">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-roadmap-title">
                Your Electrification Roadmap
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                We break it into three simple steps. You don't have to do them all at once — we'll help you prioritize based on your budget and goals.
              </p>
            </motion.div>

            <div className="relative mx-auto max-w-4xl">
              <div className="absolute left-6 top-0 hidden h-full w-px bg-border sm:left-1/2 sm:block" />
              <div className="space-y-8 sm:space-y-12">
                {roadmapSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isLeft = idx % 2 === 0;
                  return (
                    <motion.div
                      key={step.step}
                      variants={fadeUp}
                      className={`relative flex flex-col sm:flex-row ${isLeft ? "sm:flex-row" : "sm:flex-row-reverse"} items-start gap-4 sm:gap-8`}
                    >
                      <div className={`flex-1 ${isLeft ? "sm:text-right" : "sm:text-left"}`}>
                        <Card data-testid={`card-roadmap-step-${step.step}`}>
                          <CardContent className="p-6">
                            <div className={`mb-3 flex items-center gap-3 ${isLeft ? "sm:flex-row-reverse" : ""} flex-wrap`}>
                              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground" data-testid={`text-roadmap-step-label-${step.step}`}>
                                  Step {step.step}
                                </p>
                                <h3 className="text-lg font-semibold" data-testid={`text-roadmap-step-title-${step.step}`}>
                                  {step.title}
                                </h3>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground" data-testid={`text-roadmap-step-desc-${step.step}`}>
                              {step.description}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="absolute left-6 hidden h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-4 border-background bg-primary text-xs font-bold text-primary-foreground sm:left-1/2 sm:flex" data-testid={`indicator-roadmap-step-${step.step}`}>
                        {step.step}
                      </div>

                      <div className="hidden flex-1 sm:block" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-20" data-testid="section-electrification-cta">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-green-700 dark:to-green-900" />
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
              data-testid="text-electrification-cta-title"
            >
              Get a Free Electrification Assessment
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto max-w-xl text-lg text-white/80">
              Not sure where to start? We'll visit your home, evaluate your current setup, and create a personalized plan that maximizes your savings and identifies available incentives.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setQuoteOpen(true)}
                data-testid="button-electrification-cta-assessment"
              >
                Schedule Free Assessment
                <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/quote">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm"
                  data-testid="button-electrification-cta-quote"
                >
                  Get Instant Quote
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <QuoteModal open={quoteOpen} onOpenChange={setQuoteOpen} />
    </>
  );
}