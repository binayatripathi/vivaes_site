import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Shield, Battery, Zap, Home, Sun, DollarSign, ExternalLink, ChevronRight } from "lucide-react";
import powerwallHeroImg from "@assets/Screenshot_2026-04-07_at_01.15.12_1775549716549.png";
import powerwallCardImg from "@assets/Screenshot_2026-04-07_at_01.16.21_1775549783667.png";

const SESSION_KEY = "tesla_modal_dismissed";

interface TeslaModalProps {
  onClose: () => void;
}

function TeslaModal({ onClose }: TeslaModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto"
      data-testid="modal-tesla"
      role="dialog"
      aria-modal="true"
      aria-label="Tesla Certified Installer announcement"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        data-testid="overlay-tesla-modal"
      />

      <div
        className="relative z-10 mx-auto my-4 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl sm:my-8"
        style={{ background: "linear-gradient(160deg, #080808 0%, #111111 60%, #080808 100%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          data-testid="button-close-tesla-modal"
          aria-label="Close Tesla announcement"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          className="relative min-h-[280px] sm:min-h-[340px] flex flex-col items-center justify-center px-8 py-12 text-center overflow-hidden"
        >
          <img
            src={powerwallHeroImg}
            alt="Tesla Powerwall 3 installed on exterior of Bay Area home"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(8,8,8,0.5) 0%, rgba(8,8,8,0.85) 100%), radial-gradient(ellipse at 50% 0%, rgba(227,25,55,0.25) 0%, transparent 60%)",
            }}
          />
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <Badge
                className="border border-[#e31937]/60 bg-[#e31937]/15 text-[#e31937] px-4 py-1.5 text-sm"
                data-testid="badge-tesla-certified-modal"
              >
                <Shield className="mr-2 h-3.5 w-3.5" />
                Tesla Certified Installer
              </Badge>
            </div>

            <h2
              className="text-4xl font-bold text-white sm:text-5xl tracking-tight"
              data-testid="text-tesla-modal-title"
            >
              Power Everything
            </h2>
            <p className="mt-4 text-lg text-white/60 max-w-lg mx-auto leading-relaxed">
              Viva Electric & Solar is a Tesla Certified Installer — officially listed on Tesla's
              Installer Locator for the San Francisco Bay Area.
            </p>
          </div>
        </div>

        <div className="px-6 pb-8 sm:px-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
            <div
              className="rounded-xl overflow-hidden border border-white/10"
              data-testid="card-tesla-wall-connector"
            >
              <div className="relative h-44">
                <img
                  src="/images/services/ev-chargers.png"
                  alt="Tesla Wall Connector home EV charging"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e31937]/80 mb-2">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg">Tesla Wall Connector</h3>
                </div>
              </div>
              <div className="bg-white/5 p-4">
                <p className="text-sm text-white/60">
                  The fastest home charging solution for Tesla owners. Certified installation with full permitting, panel assessment, and professional setup.
                </p>
              </div>
            </div>

            <div
              className="rounded-xl overflow-hidden border border-white/10"
              data-testid="card-tesla-powerwall"
            >
              <div className="relative h-44 bg-zinc-900 flex items-center justify-center overflow-hidden">
                <img
                  src={powerwallCardImg}
                  alt="Tesla Powerwall 3 home battery unit"
                  className="h-full w-auto max-w-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e31937]/80 mb-2">
                    <Battery className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg">Tesla Powerwall 3</h3>
                </div>
              </div>
              <div className="bg-white/5 p-4">
                <p className="text-sm text-white/60">
                  A compact home battery with an integrated solar inverter. One unit provides whole-home backup protection during grid outages.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs text-white/40 uppercase tracking-wider font-medium mb-4 text-center">
              Key Benefits
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                { icon: DollarSign, label: "Low Cost Design" },
                { icon: Sun, label: "Bill Savings" },
                { icon: Shield, label: "Durable Design" },
                { icon: Home, label: "Whole-Home Backup" },
                { icon: Zap, label: "Integrated Ecosystem" },
                { icon: Battery, label: "On Tesla's Locator" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-[#e31937]" />
                    <span className="text-sm text-white/70">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/tesla" onClick={onClose} className="flex-1">
              <Button
                size="lg"
                className="w-full bg-[#e31937] hover:bg-[#c41530] text-white border-0"
                data-testid="button-tesla-modal-learn-more"
              >
                Learn More
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/booking" onClick={onClose} className="flex-1">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                data-testid="button-tesla-modal-book"
              >
                Book a Consultation
              </Button>
            </Link>
            <a
              href="https://www.tesla.com/powerwall"
              target="_blank"
              rel="noopener noreferrer"
              className="sm:flex-none"
            >
              <Button
                size="lg"
                variant="ghost"
                className="w-full sm:w-auto text-white/50 hover:text-white hover:bg-white/5"
                data-testid="button-tesla-modal-locator"
              >
                <ExternalLink className="mr-1.5 h-4 w-4" />
                Tesla.com
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TeslaBannerProps {
  visible: boolean;
}

export function TeslaBanner({ visible }: TeslaBannerProps) {
  if (!visible) return null;

  return (
    <Link href="/tesla">
      <div
        className="w-full cursor-pointer py-2.5 px-4 flex items-center justify-center gap-3 sticky top-16 z-40 transition-opacity"
        style={{
          background: "linear-gradient(90deg, #12080a 0%, #1c0c0e 50%, #12080a 100%)",
          borderBottom: "1px solid rgba(227,25,55,0.25)",
          boxShadow: "0 2px 12px rgba(227,25,55,0.08)",
        }}
        data-testid="banner-tesla"
        role="banner"
      >
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#e31937] shrink-0" />
          <span className="text-sm font-medium text-white">
            Tesla Certified Installer
          </span>
          <span className="hidden text-white/40 sm:inline">·</span>
          <span className="hidden text-sm text-white/60 sm:inline">
            Listed on Tesla's Installer Locator
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#e31937] text-sm font-medium">
          Learn More
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}

export function useTeslaModal() {
  const [showModal, setShowModal] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(SESSION_KEY);
    if (dismissed) {
      setShowBanner(true);
    } else {
      const timer = setTimeout(() => setShowModal(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setShowModal(false);
    setShowBanner(true);
  };

  return { showModal, showBanner, handleClose, TeslaModal };
}
