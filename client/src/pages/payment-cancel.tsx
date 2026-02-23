import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowRight, Phone } from "lucide-react";
import { Link } from "wouter";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <Card>
          <CardContent className="flex flex-col items-center gap-5 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
              <XCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h1 className="text-2xl font-bold" data-testid="text-payment-cancelled">
              Payment Cancelled
            </h1>
            <p className="text-muted-foreground">
              No worries! Your payment was not processed. You can try again or reach out to us directly.
            </p>
            <div className="flex w-full flex-col gap-2 pt-2">
              <Link href="/quote">
                <Button className="w-full" data-testid="button-try-again">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Get a New Quote
                </Button>
              </Link>
              <a href="tel:+15107068246">
                <Button variant="outline" className="w-full" data-testid="button-call-us">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Us: +1 (510) 706-8246
                </Button>
              </a>
              <Link href="/">
                <Button variant="ghost" className="w-full" data-testid="button-home">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
