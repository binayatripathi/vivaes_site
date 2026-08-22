import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageMeta } from "@/components/page-meta";
import {
  Zap, CircuitBoard, CheckCircle2, ExternalLink, Phone, Heart,
  FileText, Car, Camera, Receipt, ArrowRight, Shield,
} from "lucide-react";

const PGE_APPLY_URL = "https://energyinsight.pge.com/Residential-EV-Charging/";
const PGE_INFO_URL =
  "https://www.pge.com/en/clean-energy/electric-vehicles/getting-started-with-electric-vehicles/residential-electric-vehicle-charging-rebate.html";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const rebateTiers = [
  {
    icon: Zap,
    title: "EV Charger Rebate",
    amount: "Up to $2,000",
    description:
      "For the purchase and installation of an eligible PG&E-approved Level 2 home EV charger.",
  },
  {
    icon: CircuitBoard,
    title: "Panel Upgrade + EV Charger Rebate",
    amount: "Up to $5,000",
    description:
      "Income-eligible customers may qualify for a rebate covering EV charging equipment, circuit extension, and a panel upgrade if needed.",
  },
];

const checklist = [
  {
    icon: FileText,
    text: "Your PG&E residential electric bill with account number and Service Agreement ID (SAID)",
  },
  {
    icon: Car,
    text: "Current California DMV registration card for your BEV/PHEV",
  },
  {
    icon: Receipt,
    text: "Proof of purchase of your EV charging equipment",
  },
  {
    icon: Camera,
    text: "Photos of the installed equipment with serial numbers, and the electrician's invoice for hard-wired equipment",
  },
];

export default function PgeEvRebatesPage() {
  return (
    <>
      <PageMeta
        title="PG&E EV Rebates — Up to $5,000 Back | Viva Electric & Solar"
        description="Thank you for your interest in PG&E EV rebates. Qualify for up to $2,000 for an EV charger or up to $5,000 with a panel upgrade. Apply directly through PG&E's official portal."
        canonical="https://vivaes.net/pge-ev-rebates"
        ogTitle="PG&E EV Rebates — Power Your Drive. Save Thousands."
        ogDescription="See if you qualify for PG&E EV charger and panel upgrade rebates. Apply directly through PG&E's official prequalification portal."
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 py-20" data-testid="section-pge-hero">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-6"
          >
            <motion.div variants={fadeUp} className="flex justify-center">
              <Badge className="border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                <Heart className="mr-1 h-3 w-3" /> Thank You for Your Interest
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl"
              data-testid="text-pge-title"
            >
              PG&E EV Rebates: Power Your Drive. Save Thousands.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto max-w-2xl text-lg leading-relaxed text-white/80"
            >
              Thank you for your interest in PG&E's EV rebate programs. To make
              sure you get the latest information and the fastest decision,
              applications are handled directly through PG&E's official
              prequalification portal — we'll point you there in one click.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="bg-background py-16" data-testid="section-pge-tiers">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-pge-tiers-title">
                Two Ways to Save
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                PG&E offers two residential rebate options for EV charging.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {rebateTiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <motion.div key={tier.title} variants={fadeUp}>
                    <Card className="h-full" data-testid={`card-pge-tier-${tier.title.toLowerCase().replace(/[\s+]+/g, "-")}`}>
                      <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10">
                          <Icon className="h-8 w-8 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{tier.amount}</p>
                          <h3 className="mt-1 text-xl font-bold">{tier.title}</h3>
                          <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-card py-16" data-testid="section-pge-checklist">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-8"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-pge-checklist-title">
                Before You Apply
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Gather these items to make your PG&E application fast and smooth.
              </p>
            </motion.div>

            <div className="space-y-4">
              {checklist.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.text}
                    variants={fadeUp}
                    className="flex items-start gap-4 rounded-md border bg-background p-4"
                    data-testid="row-pge-checklist-item"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/10">
                      <Icon className="h-5 w-5 text-emerald-500" />
                    </div>
                    <p className="pt-2 text-sm leading-relaxed">{item.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-background py-16" data-testid="section-pge-apply">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-6"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-pge-apply-title">
              Apply Directly Through PG&E
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto max-w-xl text-muted-foreground">
              You'll be taken to PG&E's official Residential EV Charging rebate
              portal to check your eligibility and complete your application
              directly with them.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 pt-2">
              <a href={PGE_APPLY_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" data-testid="button-pge-apply">
                  Continue to PG&E's Official Portal
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href={PGE_INFO_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" data-testid="button-pge-info">
                  Read PG&E's Rebate Details
                </Button>
              </a>
            </motion.div>
            <motion.p variants={fadeUp} className="text-xs text-muted-foreground">
              You are leaving vivaes.net. Rebate eligibility and applications are
              determined solely by PG&E.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 py-16" data-testid="section-pge-install">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-6"
          >
            <motion.div variants={fadeUp} className="flex justify-center">
              <Shield className="h-10 w-10 text-emerald-400" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-white sm:text-4xl" data-testid="text-pge-install-title">
              Need the Charger or Panel Installed?
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-white/80">
              Viva Electric & Solar is a PG&E Trade Ally and Tesla Certified
              Installer. We handle the charger, the dedicated circuit, the
              permit, and any panel upgrade — and give you the invoice and
              documentation PG&E asks for.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 pt-2">
              <Link href="/quote">
                <Button size="lg" data-testid="button-pge-quote">
                  Get an Instant Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="tel:+15107105745">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm"
                  data-testid="button-pge-call"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  (510) 710-5745
                </Button>
              </a>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs text-white/60">
              <CheckCircle2 className="h-3 w-3" /> CA C-10 License #1147947
              <span>·</span>
              <span>Licensed, Bonded & Insured</span>
              <span>·</span>
              <span>PG&E Trade Ally</span>
              <span>·</span>
              <span>Tesla Certified Installer</span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
