import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, PhoneOff, Mic, MicOff, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY || "";
const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID || "";

type CallStatus = "idle" | "connecting" | "active" | "ending";

interface VapiContextType {
  callStatus: CallStatus;
  isMuted: boolean;
  transcript: { role: string; text: string }[];
  errorMsg: string | null;
  showPanel: boolean;
  startCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  setShowPanel: (v: boolean) => void;
}

const VapiContext = createContext<VapiContextType | null>(null);

export function VapiProvider({ children }: { children: React.ReactNode }) {
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [transcript, setTranscript] = useState<{ role: string; text: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const vapiRef = useRef<Vapi | null>(null);

  const getVapi = useCallback(() => {
    if (!vapiRef.current && VAPI_PUBLIC_KEY) {
      vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);

      vapiRef.current.on("call-start", () => {
        setCallStatus("active");
        setErrorMsg(null);
      });

      vapiRef.current.on("call-end", () => {
        setCallStatus("idle");
        setIsMuted(false);
      });

      vapiRef.current.on("message", (msg: any) => {
        if (msg.type === "transcript" && msg.transcriptType === "final") {
          setTranscript((prev) => [
            ...prev,
            { role: msg.role, text: msg.transcript },
          ]);
        }
      });

      vapiRef.current.on("error", (err: any) => {
        console.error("[Vapi] Error:", err);
        let msg = "Call failed. Please try again.";
        try {
          const raw = err?.error?.message || err?.message;
          msg = typeof raw === "string" ? raw : typeof raw === "object" ? JSON.stringify(raw) : msg;
        } catch {}
        setErrorMsg(msg);
        setCallStatus("idle");
      });
    }
    return vapiRef.current;
  }, []);

  const startCall = useCallback(async () => {
    if (callStatus !== "idle") return;

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setErrorMsg("Microphone access is required for voice calls. Please allow microphone access and try again.");
      setShowPanel(true);
      return;
    }

    const vapi = getVapi();
    if (!vapi) return;

    setCallStatus("connecting");
    setTranscript([]);
    setErrorMsg(null);
    setShowPanel(true);

    try {
      await vapi.start(VAPI_ASSISTANT_ID, {
        variableValues: {
          businessName: "Viva Electric & Solar Inc.",
          website: "vivaes.net",
          phone: "+1 (510) 710-5745",
          email: "roberto@vivaes.net",
          serviceArea: "Bay Area and Central Valley, California",
          services: "Solar & Storage, Battery Storage Add-On, EV Chargers, Panel Upgrades, Lighting Retrofits, General Electrical, Commercial Electrical, Electrification Assessment, Re-Roofing + Panel Removal/Reinstall, Warehouse/Commercial",
          businessContext: [
            "Viva Electric & Solar Inc. is a licensed electrical and solar company serving the Bay Area and Central Valley. CA License #1147947.",
            "We are fully licensed, bonded, and insured.",
            "Service areas: Alameda County (Oakland, Berkeley, Fremont, Hayward, San Leandro, Castro Valley, Livermore, Pleasanton), SF/Peninsula (San Francisco, Daly City, San Mateo, Palo Alto), San Joaquin Valley (Stockton, Tracy, Modesto, Manteca, Lodi, Turlock, Merced).",
            "Services: Solar panel installation and battery storage, Battery add-on to existing solar systems, EV charger installation (Level 2 and DC fast charging), Electrical panel upgrades (100A to 200A/400A), LED lighting retrofits, General electrical (repairs, rewiring, outlets, surge protection), Commercial electrical and solar, Home electrification assessments (free), Re-roofing with panel removal and reinstall, Warehouse/commercial electrical.",
            "We serve residential, commercial, and industrial customers.",
            "Battery brands we install: Enphase, Tesla Powerwall, FranklinWH, SolarEdge, Generac PWRcell.",
            "Pricing: EV chargers start around $3,500, panel upgrades around $6,000, solar installations from $25,000+, lighting retrofits from $4,500, general electrical from $1,300, battery add-on from $14,500.",
            "We offer free on-site consultations, free electrification assessments, and instant online quotes at vivaes.net/quote.",
            "All work is performed by licensed electricians.",
            "Full warranty on labor and materials.",
            "Available 24/7 for emergency service.",
            "You can help callers with: general questions about our services, scheduling appointments, providing rough cost estimates, taking down their information for a callback, and answering questions about solar energy, battery storage, electrification rebates, EV charging, electrical safety, and permits.",
          ].join(" "),
        },
      });
    } catch (err: any) {
      console.error("[Vapi] Failed to start call:", err);
      const raw = err?.message;
      setErrorMsg(typeof raw === "string" ? raw : "Could not connect. Please try again.");
      setCallStatus("idle");
    }
  }, [callStatus, getVapi]);

  const endCall = useCallback(() => {
    const vapi = vapiRef.current;
    if (vapi) {
      setCallStatus("ending");
      vapi.stop();
    }
    setShowPanel(false);
    setErrorMsg(null);
  }, []);

  const toggleMute = useCallback(() => {
    const vapi = vapiRef.current;
    if (vapi) {
      const newMuted = !isMuted;
      vapi.setMuted(newMuted);
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  return (
    <VapiContext.Provider
      value={{ callStatus, isMuted, transcript, errorMsg, showPanel, startCall, endCall, toggleMute, setShowPanel }}
    >
      {children}
      <CallPanel />
    </VapiContext.Provider>
  );
}

function useVapi() {
  const ctx = useContext(VapiContext);
  if (!ctx) throw new Error("useVapi must be used within VapiProvider");
  return ctx;
}

export function VapiCallButton({
  variant = "default",
  size = "default",
  className,
  label,
}: {
  variant?: "default" | "outline" | "ghost" | "hero";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
}) {
  const { callStatus, startCall, endCall } = useVapi();

  const isInCall = callStatus === "active" || callStatus === "connecting";
  const buttonLabel =
    label ||
    (callStatus === "connecting"
      ? "Connecting..."
      : callStatus === "active"
        ? "On Call"
        : "Talk to Us 24/7");

  const btnVariant = isInCall ? "destructive" : variant === "hero" ? "outline" : (variant as any);

  return (
    <Button
      size={size}
      variant={btnVariant}
      className={cn(
        "gap-2",
        !isInCall && variant === "hero" && "border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950",
        className
      )}
      onClick={isInCall ? endCall : startCall}
      disabled={callStatus === "connecting" || callStatus === "ending" || !VAPI_PUBLIC_KEY}
      data-testid={variant === "hero" ? "button-vapi-call-hero" : "button-vapi-call"}
    >
      {isInCall ? (
        <>
          <PhoneOff className="h-4 w-4" />
          End Call
        </>
      ) : (
        <>
          <Phone className="h-4 w-4" />
          {buttonLabel}
        </>
      )}
    </Button>
  );
}

function CallPanel() {
  const { showPanel, callStatus, isMuted, transcript, errorMsg, toggleMute, endCall, setShowPanel } = useVapi();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <AnimatePresence>
      {showPanel && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-6 z-[60] w-80"
          data-testid="panel-vapi-call"
        >
          <Card className="border-primary/30 shadow-xl">
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    callStatus === "active" ? "bg-green-500 animate-pulse" : "bg-yellow-500 animate-pulse"
                  )} />
                  <span className="text-sm font-semibold">
                    {callStatus === "connecting" ? "Connecting..." : callStatus === "active" ? "Live Call" : "Call Ended"}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPanel(false)}
                  data-testid="button-vapi-panel-close"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div
                ref={scrollRef}
                className="max-h-48 min-h-[80px] overflow-y-auto p-3 space-y-2"
              >
                {errorMsg && (
                  <p className="text-center text-xs text-red-500 dark:text-red-400 py-4">
                    {errorMsg}
                  </p>
                )}
                {!errorMsg && transcript.length === 0 && (
                  <p className="text-center text-xs text-muted-foreground py-4">
                    {callStatus === "connecting"
                      ? "Setting up your call..."
                      : "Speak to our 24/7 assistant"}
                  </p>
                )}
                {transcript.map((t, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-md px-2.5 py-1.5 text-xs",
                      t.role === "user"
                        ? "ml-6 bg-primary text-primary-foreground"
                        : "mr-6 bg-muted"
                    )}
                  >
                    {t.text}
                  </div>
                ))}
              </div>

              {(callStatus === "active" || callStatus === "connecting") && (
                <div className="flex items-center justify-center gap-3 border-t px-4 py-3">
                  <Button
                    size="sm"
                    variant={isMuted ? "destructive" : "outline"}
                    onClick={toggleMute}
                    disabled={callStatus !== "active"}
                    data-testid="button-vapi-mute"
                  >
                    {isMuted ? <MicOff className="mr-1 h-3 w-3" /> : <Mic className="mr-1 h-3 w-3" />}
                    {isMuted ? "Unmute" : "Mute"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={endCall}
                    data-testid="button-vapi-end"
                  >
                    <PhoneOff className="mr-1 h-3 w-3" />
                    End Call
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
