import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Phone, Loader2 } from "lucide-react";
import { Link } from "wouter";

interface SessionData {
  status: string;
  customerEmail: string;
  amountTotal: number;
  serviceName: string;
  type: string;
  customerName: string;
}

export default function PaymentSuccessPage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (sessionId) {
      fetch(`/api/stripe/session/${sessionId}`)
        .then((r) => r.json())
        .then((data) => {
          setSession(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <Card>
          <CardContent className="flex flex-col items-center gap-5 p-8 text-center">
            {loading ? (
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold" data-testid="text-payment-success">
                  Payment Successful!
                </h1>
                {session && (
                  <div className="w-full space-y-3 rounded-lg bg-muted p-4 text-left text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service</span>
                      <span className="font-medium" data-testid="text-payment-service">{session.serviceName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {session.type === "deposit" ? "Deposit Paid" : "Fee Paid"}
                      </span>
                      <span className="font-bold text-primary" data-testid="text-payment-amount">{fmt(session.amountTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confirmation sent to</span>
                      <span className="font-medium">{session.customerEmail}</span>
                    </div>
                  </div>
                )}
                <p className="text-muted-foreground">
                  {session?.type === "deposit"
                    ? "Your deposit has been received. Our team will contact you within 24 hours to schedule your service."
                    : "Your payment has been received. Our team will reach out to confirm your appointment details."}
                </p>
                <div className="flex w-full flex-col gap-2 pt-2">
                  <Link href="/booking">
                    <Button className="w-full" data-testid="button-book-appointment">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Book an Appointment
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full" data-testid="button-back-home">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
