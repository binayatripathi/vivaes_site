import { motion } from "framer-motion";
import { QuoteChatbot } from "@/components/quote-chatbot";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, Award, Phone } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function QuotePage() {
  return (
    <>
      <section className="bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.h1
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              data-testid="text-quote-heading"
            >
              Get Your Instant Quote
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-3 max-w-2xl text-muted-foreground">
              Chat with our quote assistant to get a personalized estimate for your project in minutes. No waiting, no callbacks.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="lg:col-span-2"
            >
              <QuoteChatbot />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } }}
              className="space-y-4"
            >
              <Card>
                <CardContent className="space-y-4 p-6">
                  <h3 className="font-semibold">Why Get a Quote?</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Clock, title: "Instant Results", desc: "Get your estimate in minutes, not days" },
                      { icon: Shield, title: "No Obligation", desc: "Free estimate with no commitment" },
                      { icon: Award, title: "Transparent Pricing", desc: "Detailed breakdown of all costs" },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                          <item.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Prefer to Talk?</p>
                      <p className="text-xs text-muted-foreground">
                        Call us at <a href="tel:+15107105745" className="font-medium text-foreground">+1 (510) 710-5745</a> for immediate assistance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
