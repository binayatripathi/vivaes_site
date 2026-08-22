import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight } from "lucide-react";

export function PgeRebateBanner() {
  return (
    <section
      className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900"
      data-testid="section-pge-rebate-banner"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-between gap-6 sm:flex-row"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 sm:flex">
              <Zap className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white sm:text-xl" data-testid="text-pge-banner-title">
                PG&E EV Rebates: Up to $5,000 Back
              </p>
              <p className="mt-1 text-sm text-white/70" data-testid="text-pge-banner-subtitle">
                EV charger and panel upgrade rebates — apply directly through PG&E's official portal.
              </p>
            </div>
          </div>
          <Link href="/pge-ev-rebates">
            <Button
              size="lg"
              className="shrink-0 bg-emerald-500 text-white hover:bg-emerald-600"
              data-testid="button-pge-banner-learn"
            >
              Learn About PG&E EV Rebates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
