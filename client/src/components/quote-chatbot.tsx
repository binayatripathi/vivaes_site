import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  servicesList,
  propertyTypes,
  projectSizes,
  urgencyLevels,
  generateQuoteEstimate,
  type QuoteEstimate,
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import {
  MessageCircle, Send, CheckCircle2, Zap, Calendar,
  Phone, Download, ArrowRight, RotateCcw,
} from "lucide-react";
import { Link } from "wouter";
import { VapiCallButton } from "@/components/vapi-call-button";

interface ChatMessage {
  id: string;
  type: "bot" | "user";
  content: string;
  options?: { label: string; value: string }[];
  component?: "quote-result";
}

type ChatStep =
  | "greeting"
  | "service"
  | "property-type"
  | "project-size"
  | "urgency"
  | "details"
  | "name"
  | "phone"
  | "email"
  | "generating"
  | "result";

export function QuoteChatbot({ preselectedService }: { preselectedService?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState<ChatStep>("greeting");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [quote, setQuote] = useState<QuoteEstimate | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [answers, setAnswers] = useState({
    service: preselectedService || "",
    propertyType: "",
    projectSize: "",
    urgency: "",
    details: "",
    name: "",
    phone: "",
    email: "",
  });

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const addBotMessage = (content: string, options?: { label: string; value: string }[], component?: "quote-result") => {
    return new Promise<void>((resolve) => {
      setIsTyping(true);
      scrollToBottom();
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: `bot-${Date.now()}`, type: "bot", content, options, component },
        ]);
        scrollToBottom();
        resolve();
      }, 600);
    });
  };

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, type: "user", content },
    ]);
    scrollToBottom();
  };

  useEffect(() => {
    if (step === "greeting") {
      const startChat = async () => {
        await addBotMessage("Hi there! I'm here to help you get a free quote for your electrical or solar project. Let's get started!");
        if (preselectedService) {
          const service = servicesList.find(s => s.slug === preselectedService);
          if (service) {
            addUserMessage(service.title);
            setStep("property-type");
            await addBotMessage(
              `Great choice! ${service.title} is one of our most popular services. What type of property is this for?`,
              propertyTypes.map(p => ({ label: p, value: p }))
            );
            return;
          }
        }
        await addBotMessage(
          "What service are you interested in?",
          servicesList.map(s => ({ label: s.title, value: s.slug }))
        );
        setStep("service");
      };
      startChat();
    }
  }, []);

  const handleOptionSelect = async (value: string, label: string) => {
    addUserMessage(label);

    switch (step) {
      case "service": {
        setAnswers(prev => ({ ...prev, service: value }));
        const service = servicesList.find(s => s.slug === value);
        setStep("property-type");
        await addBotMessage(
          `${service?.title} - excellent choice! What type of property is this for?`,
          propertyTypes.map(p => ({ label: p, value: p }))
        );
        break;
      }
      case "property-type": {
        setAnswers(prev => ({ ...prev, propertyType: value }));
        setStep("project-size");
        const sizeDescriptions: Record<string, string> = {
          "solar-storage": "Small = 1-10 panels, Medium = 10-25 panels, Large = 25+ panels",
          "ev-chargers": "Small = 1 charger, Medium = 2-3 chargers, Large = 4+ chargers",
          "panel-upgrades": "Small = Sub-panel, Medium = 200A upgrade, Large = 400A upgrade",
          "lighting-retrofits": "Small = 1-5 rooms, Medium = full home/small office, Large = warehouse/large commercial",
          "general-electrical": "Small = single repair, Medium = multiple repairs, Large = full rewiring",
          "commercial": "Small = single tenant, Medium = multi-tenant, Large = full building",
        };
        const desc = sizeDescriptions[answers.service || preselectedService || ""] || "";
        await addBotMessage(
          `Got it! How would you describe the size of your project?${desc ? `\n\n${desc}` : ""}`,
          projectSizes.map(s => ({ label: s, value: s }))
        );
        break;
      }
      case "project-size": {
        setAnswers(prev => ({ ...prev, projectSize: value }));
        setStep("urgency");
        await addBotMessage(
          "When do you need this completed?",
          urgencyLevels.map(u => ({ label: u, value: u }))
        );
        break;
      }
      case "urgency": {
        setAnswers(prev => ({ ...prev, urgency: value }));
        setStep("details");
        await addBotMessage("Any specific details about your project? (Type your answer, or type 'skip' to continue)");
        break;
      }
    }
  };

  const handleTextSubmit = async () => {
    const value = inputValue.trim();
    if (!value) return;
    setInputValue("");
    addUserMessage(value);

    switch (step) {
      case "details": {
        setAnswers(prev => ({ ...prev, details: value === "skip" ? "" : value }));
        setStep("name");
        await addBotMessage("Almost there! What's your name?");
        break;
      }
      case "name": {
        setAnswers(prev => ({ ...prev, name: value }));
        setStep("phone");
        await addBotMessage(`Thanks, ${value}! What's the best phone number to reach you?`);
        break;
      }
      case "phone": {
        setAnswers(prev => ({ ...prev, phone: value }));
        setStep("email");
        await addBotMessage("And your email address?");
        break;
      }
      case "email": {
        const updatedAnswers = { ...answers, email: value };
        setAnswers(updatedAnswers);
        setStep("generating");
        await addBotMessage("Calculating your personalized quote...");

        const estimate = generateQuoteEstimate(
          updatedAnswers.service,
          updatedAnswers.propertyType,
          updatedAnswers.projectSize,
          updatedAnswers.urgency,
        );
        setQuote(estimate);

        try {
          await apiRequest("POST", "/api/quote", {
            name: updatedAnswers.name,
            email: updatedAnswers.email,
            phone: updatedAnswers.phone,
            zip: "00000",
            serviceType: updatedAnswers.service,
            details: `Property: ${updatedAnswers.propertyType}, Size: ${updatedAnswers.projectSize}, Urgency: ${updatedAnswers.urgency}. ${updatedAnswers.details}`,
          });
        } catch (e) {}

        setStep("result");
        await addBotMessage("Here's your instant quote!", undefined, "quote-result");
        break;
      }
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setStep("greeting");
    setQuote(null);
    setAnswers({ service: "", propertyType: "", projectSize: "", urgency: "", details: "", name: "", phone: "", email: "" });
    setTimeout(() => {
      const startChat = async () => {
        await addBotMessage("Hi there! I'm here to help you get a free quote for your electrical or solar project. Let's get started!");
        await addBotMessage(
          "What service are you interested in?",
          servicesList.map(s => ({ label: s.title, value: s.slug }))
        );
        setStep("service");
      };
      startChat();
    }, 100);
  };

  const showInput = ["details", "name", "phone", "email"].includes(step);

  return (
    <div className="flex flex-col rounded-lg border bg-card" data-testid="section-quote-chatbot">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold">Viva Quote Assistant</p>
          <p className="text-xs text-muted-foreground">Get your instant quote</p>
        </div>
        {step === "result" && (
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto"
            onClick={handleRestart}
            data-testid="button-restart-quote"
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            New Quote
          </Button>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4" style={{ maxHeight: "500px", minHeight: "350px" }}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] ${msg.type === "user" ? "" : ""}`}>
                {msg.component === "quote-result" && quote ? (
                  <QuoteResultCard quote={quote} name={answers.name} />
                ) : (
                  <div
                    className={`rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                      msg.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                    data-testid={msg.type === "bot" ? "text-bot-message" : "text-user-message"}
                  >
                    {msg.content}
                  </div>
                )}

                {msg.options && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.options.map((opt) => (
                      <Button
                        key={opt.value}
                        size="sm"
                        variant="outline"
                        className="h-auto whitespace-normal py-1.5 text-xs"
                        onClick={() => handleOptionSelect(opt.value, opt.label)}
                        disabled={step !== getStepForOptions(msg)}
                        data-testid={`button-option-${opt.value}`}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="rounded-lg bg-muted px-4 py-2">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: "150ms" }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {showInput && (
        <div className="border-t p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTextSubmit();
            }}
            className="flex gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={getPlaceholder(step)}
              className="flex-1"
              autoFocus
              data-testid="input-chat-message"
            />
            <Button type="submit" size="icon" disabled={!inputValue.trim()} data-testid="button-chat-send">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

function getStepForOptions(msg: ChatMessage): ChatStep {
  if (msg.options?.[0]?.value && servicesList.some(s => s.slug === msg.options![0].value)) return "service";
  if (msg.options?.some(o => propertyTypes.includes(o.value as any))) return "property-type";
  if (msg.options?.some(o => projectSizes.includes(o.value as any))) return "project-size";
  if (msg.options?.some(o => urgencyLevels.includes(o.value as any))) return "urgency";
  return "greeting";
}

function getPlaceholder(step: ChatStep): string {
  switch (step) {
    case "details": return "Describe your project or type 'skip'...";
    case "name": return "Your full name...";
    case "phone": return "(555) 123-4567";
    case "email": return "you@example.com";
    default: return "Type your message...";
  }
}

function QuoteResultCard({ quote, name }: { quote: QuoteEstimate; name: string }) {
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <Card className="w-full border-primary/30" data-testid="card-quote-result">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center gap-2 text-primary">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-semibold">Your Instant Quote</span>
        </div>

        <div>
          <h3 className="text-lg font-bold" data-testid="text-quote-service">{quote.serviceTitle}</h3>
          <p className="text-xs text-muted-foreground">
            {quote.propertyType} &middot; {quote.projectSize} project &middot; {quote.urgency}
          </p>
        </div>

        <div className="space-y-1 rounded-md bg-muted p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Base Service</span>
            <span>{fmt(quote.basePrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Labor</span>
            <span>{fmt(quote.laborCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Materials</span>
            <span>{fmt(quote.materialsCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Permits & Fees</span>
            <span>{fmt(quote.permitFees)}</span>
          </div>
          {quote.discount > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Volume Discount</span>
              <span>-{fmt(quote.discount)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t pt-2 text-base font-bold">
            <span>Estimated Total</span>
            <span className="text-primary" data-testid="text-quote-total">{fmt(quote.total)}</span>
          </div>
        </div>

        <div className="rounded-md bg-primary/5 p-3 text-center">
          <p className="text-xs text-muted-foreground">Estimate range</p>
          <p className="text-sm font-semibold" data-testid="text-quote-range">
            {fmt(quote.estimateRange.low)} &ndash; {fmt(quote.estimateRange.high)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            <Calendar className="mr-1 inline h-3 w-3" />
            Estimated timeline: {quote.timeline}
          </p>
        </div>

        <div className="space-y-1">
          {quote.notes.map((note, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-green-600 dark:text-green-400" />
              <span>{note}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <Link href="/booking">
            <Button className="w-full" data-testid="button-quote-book">
              <Calendar className="mr-2 h-4 w-4" />
              Book Your Appointment
            </Button>
          </Link>
          <VapiCallButton
            variant="outline"
            className="w-full"
            label="Talk to Our Team 24/7"
          />
        </div>

        <p className="text-center text-[10px] text-muted-foreground">
          *This is an estimate. Final pricing confirmed after on-site consultation.
        </p>
      </CardContent>
    </Card>
  );
}

export function FloatingChatButton() {
  return (
    <Link href="/quote">
      <Button
        size="lg"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        data-testid="button-floating-chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </Link>
  );
}
