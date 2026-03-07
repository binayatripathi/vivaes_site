import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { contactFormSchema, type ContactForm } from "@shared/schema";
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
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, CheckCircle2, Shield, Users, Award, Zap,
  Phone, Mail, MapPin, Clock,
} from "lucide-react";
import { VapiCallButton } from "@/components/vapi-call-button";
import { serviceAreas } from "@shared/schema";

const aboutHeroImg = "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1600&q=80";
const aboutTeamImg = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80";
const valueSafetyImg = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80";
const valueUnionImg = "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80";
const valueLicensedImg = "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80";
const valueCuttingEdgeImg = "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=800&q=80";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description: "Every job meets or exceeds NEC code standards. Our union-trained electricians prioritize safety above all else.",
    image: valueSafetyImg,
  },
  {
    icon: Users,
    title: "Union Trained",
    description: "Our electricians complete rigorous apprenticeship programs, ensuring the highest skill level in the industry.",
    image: valueUnionImg,
  },
  {
    icon: Award,
    title: "Licensed & Insured",
    description: "Fully licensed, bonded, and insured for your protection. We stand behind every project we complete.",
    image: valueLicensedImg,
  },
  {
    icon: Zap,
    title: "Cutting Edge",
    description: "We stay current with the latest electrical and solar technologies to deliver the best solutions for our customers.",
    image: valueCuttingEdgeImg,
  },
];

export default function AboutPage() {
  const { toast } = useToast();
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return res.json();
    },
    onSuccess: () => {
      setContactSubmitted(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <section className="relative overflow-hidden bg-card">
        <div className="absolute inset-0">
          <img
            src={aboutHeroImg}
            alt="Solar panel installation"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40 dark:from-background/95 dark:via-background/85 dark:to-background/50" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
            <motion.h1
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight sm:text-5xl"
              data-testid="text-about-heading"
            >
              About Viva Electric & Solar Inc.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-4 text-lg text-muted-foreground">
              We're a team of union-trained electrical and solar professionals dedicated to delivering
              exceptional service to residential and commercial customers throughout the Bay Area and Central Valley.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Meet Roberto</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    I'm Roberto. I've been doing electrical work for years — started as an apprentice, worked my way
                    up through the union, and eventually decided to start my own company so I could do things
                    the right way. No cutting corners, no surprise bills, no runaround.
                  </p>
                  <p>
                    I grew up in the kind of neighborhood where people look out for each other. That's how I run
                    Viva Electric & Solar Inc. When you call us, you're not getting a call center — you're getting
                    a real person who's going to show up on time, explain what needs to happen, and charge you
                    a fair price. Simple as that.
                  </p>
                  <p>
                    Whether it's a panel upgrade, solar install, EV charger, or your lights flickering at 10pm —
                    we handle it. We serve the Bay Area and the Central Valley because good, honest electrical
                    work shouldn't be hard to find, no matter where you live.
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-md shadow-xl" data-testid="img-about-team">
                <img
                  src={aboutTeamImg}
                  alt="Our team of electricians at work"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <h2 className="mb-6 text-center text-2xl font-bold">Our Values</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {values.map((v) => (
                  <Card key={v.title} className="overflow-hidden hover-elevate">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={v.image}
                        alt={v.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                      <div className="absolute bottom-3 left-4 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/90">
                          <v.icon className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold text-foreground">{v.title}</h3>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">{v.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Years Experience", value: "15+" },
                { label: "Projects Completed", value: "5,000+" },
                { label: "5-Star Reviews", value: "500+" },
                { label: "Team Members", value: "50+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp}>
              <h2 className="mb-6 text-center text-2xl font-bold">Where We Work</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {(Object.entries(serviceAreas) as [string, readonly string[]][]).map(([region, cities]) => (
                  <Card key={region} data-testid={`card-region-${region.replace(/[^a-zA-Z]/g, "").toLowerCase()}`}>
                    <CardContent className="p-5">
                      <div className="mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold">{region}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{[...cities].join(", ")}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="contact" className="bg-card py-16" data-testid="section-contact">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact Us</h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Have a question or need help? Send us a message and we'll get back to you quickly.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <motion.div variants={fadeUp} className="lg:col-span-2">
                {contactSubmitted ? (
                  <Card>
                    <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold" data-testid="text-contact-success">Message Sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. We'll get back to you as soon as possible.
                      </p>
                      <Button
                        className="mt-2"
                        onClick={() => {
                          setContactSubmitted(false);
                          form.reset();
                        }}
                        data-testid="button-new-message"
                      >
                        Send Another Message
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 sm:p-8">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} data-testid="input-contact-name" />
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
                                    <Input type="email" placeholder="john@example.com" {...field} data-testid="input-contact-email" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="(555) 123-4567" {...field} data-testid="input-contact-phone" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="How can we help you?"
                                    className="min-h-[120px] resize-none"
                                    {...field}
                                    data-testid="input-contact-message"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={mutation.isPending}
                            data-testid="button-submit-contact"
                          >
                            {mutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              "Send Message"
                            )}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                )}
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-4">
                <Card>
                  <CardContent className="space-y-4 p-6">
                    <h3 className="font-semibold">Get in Touch</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-sm">
                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <p className="font-medium">+1 (510) 710-5745</p>
                          <p className="text-muted-foreground">Mon-Sat, 8am-5pm</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <p className="font-medium">roberto@vivaes.net</p>
                          <p className="text-muted-foreground">We reply within 24 hours</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <p className="font-medium">Bay Area & Central Valley</p>
                          <p className="text-muted-foreground">Serving SF, Alameda County & San Joaquin Valley</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <p className="font-medium">24/7 Emergency</p>
                          <p className="text-muted-foreground">Always available</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <VapiCallButton
                        variant="default"
                        className="w-full"
                        label="Talk to Us 24/7"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
