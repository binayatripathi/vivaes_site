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
  const vapiRef = useRef<Vapi | null>(null);

  const getVapi = useCallback(() => {
    if (!vapiRef.current && VAPI_PUBLIC_KEY) {
      vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);

      vapiRef.current.on("call-start", () => {
        setCallStatus("active");
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
        setCallStatus("idle");
      });
    }
    return vapiRef.current;
  }, []);

  const startCall = useCallback(async () => {
    if (callStatus !== "idle") return;
    const vapi = getVapi();
    if (!vapi) return;

    setCallStatus("connecting");
    setTranscript([]);
    setShowPanel(true);

    try {
      if (VAPI_ASSISTANT_ID) {
        await vapi.start(VAPI_ASSISTANT_ID);
      } else {
        await vapi.start();
      }
    } catch (err) {
      console.error("[Vapi] Failed to start call:", err);
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
      value={{ callStatus, isMuted, transcript, showPanel, startCall, endCall, toggleMute, setShowPanel }}
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
  const { showPanel, callStatus, isMuted, transcript, toggleMute, endCall, setShowPanel } = useVapi();
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
                {transcript.length === 0 && (
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
