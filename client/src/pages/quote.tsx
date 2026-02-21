import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { quoteRequestSchema, type QuoteRequest, servicesList } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, CheckCircle2, Upload, Zap, Clock, Shield, FileText,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function QuotePage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<QuoteRequest>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      zip: "",
      serviceType: "",
      details: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: QuoteRequest) => {
      const res = await apiRequest("POST", "/api/quote", data);
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full text-center"
        >
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold" data-testid="text-quote-success">Quote Generated!</h1>
              <p className="text-muted-foreground">
                Your AI-powered quote has been generated. Check your email for the full estimate and a link to view your PDF quote.
              </p>
              <div className="mt-2 flex items-center gap-2 rounded-md bg-muted p-3 text-sm">
                <FileText className="h-4 w-4 text-primary" />
                <span>A detailed PDF has been sent to your email</span>
              </div>
              <Button
                className="mt-4"
                onClick={() => {
                  setSubmitted(false);
                  form.reset();
                }}
                data-testid="button-new-quote"
              >
                Request Another Quote
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

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
              Get Your Free Quote
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-3 max-w-2xl text-muted-foreground">
              Fill out the form and our AI will generate a detailed estimate for your project in minutes.
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
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} data-testid="input-quote-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} data-testid="input-quote-email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="(555) 123-4567" {...field} data-testid="input-quote-phone" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="90001" {...field} data-testid="input-quote-zip" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="serviceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-quote-service">
                                  <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {servicesList.map((svc) => (
                                  <SelectItem key={svc.slug} value={svc.slug}>
                                    {svc.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Details (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your project, square footage, any specific requirements..."
                                className="min-h-[120px] resize-none"
                                {...field}
                                data-testid="input-quote-details"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="rounded-md border border-dashed p-6 text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Photo upload coming soon - describe your project above for now
                        </p>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={mutation.isPending}
                        data-testid="button-submit-quote"
                      >
                        {mutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Your Quote...
                          </>
                        ) : (
                          "Get My Free Quote"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } }}
              className="space-y-4"
            >
              <Card>
                <CardContent className="space-y-4 p-6">
                  <h3 className="font-semibold">How It Works</h3>
                  <div className="space-y-4">
                    {[
                      { icon: FileText, title: "1. Submit Details", desc: "Tell us about your project" },
                      { icon: Zap, title: "2. AI Analysis", desc: "Our AI generates your estimate" },
                      { icon: Clock, title: "3. Get Quote", desc: "Receive PDF quote via email" },
                    ].map((step) => (
                      <div key={step.title} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                          <step.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{step.title}</p>
                          <p className="text-xs text-muted-foreground">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-medium">No Obligation</p>
                      <p className="text-xs text-muted-foreground">
                        Your quote is completely free with no commitment required.
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
