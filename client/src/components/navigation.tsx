import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { Menu, Sun, Moon, Home, Building2 } from "lucide-react";
import { VapiCallButton } from "@/components/vapi-call-button";
import vivaLogoPath from "@assets/viva-logo.png";

const navLinks = [
  { href: "/residential", label: "Residential", icon: Home },
  { href: "/commercial", label: "Commercial", icon: Building2 },
  { href: "/services", label: "Services", icon: null },
  { href: "/solar-storage", label: "Solar & Storage", icon: null },
  { href: "/insurance-compliance", label: "Insurance", icon: null },
  { href: "/about", label: "About", icon: null },
];

export function Navigation() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isResidential = location === "/residential";
  const isCommercial = location === "/commercial";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl" data-testid="header-nav">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" data-testid="link-home-logo">
          <img
            src={vivaLogoPath}
            alt="Viva Electric & Solar Inc."
            className="h-12 w-auto dark:brightness-125 dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]"
            data-testid="img-nav-logo"
          />
        </Link>

        {/* Residential / Commercial audience pills */}
        <div className="hidden items-center gap-1 md:flex">
          <Link href="/residential">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                isResidential
                  ? "bg-amber-400 text-slate-900"
                  : "border border-border text-muted-foreground hover:border-amber-400/50 hover:text-foreground"
              }`}
              data-testid="link-nav-residential"
            >
              <Home className="h-3 w-3" />
              Residential
            </span>
          </Link>
          <Link href="/commercial">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                isCommercial
                  ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900"
                  : "border border-border text-muted-foreground hover:border-slate-400/50 hover:text-foreground"
              }`}
              data-testid="link-nav-commercial"
            >
              <Building2 className="h-3 w-3" />
              Commercial
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-0.5 md:flex" data-testid="nav-desktop">
          {[
            { href: "/services", label: "Services" },
            { href: "/solar-storage", label: "Solar & Storage" },
            { href: "/insurance-compliance", label: "Insurance Compliance" },
            { href: "/quote", label: "Instant Quote" },
            { href: "/booking", label: "Book Now" },
            { href: "/about", label: "About" },
          ].map((link) => {
            const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href}>
                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-2 text-sm font-medium transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <div className="hidden items-center gap-2 sm:flex">
            <VapiCallButton variant="outline" size="sm" label="Talk to Us 24/7" />
            <Link href="/quote">
              <Button size="sm" data-testid="button-nav-quote">
                Instant Quote
              </Button>
            </Link>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="md:hidden"
                data-testid="button-mobile-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-1 pt-8">
                {/* Audience pills in mobile menu */}
                <div className="mb-2 flex gap-2 px-4">
                  <Link href="/residential" onClick={() => setMobileOpen(false)}>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${isResidential ? "bg-amber-400 text-slate-900" : "border border-border text-muted-foreground"}`} data-testid="link-mobile-residential">
                      <Home className="h-3 w-3" /> Residential
                    </span>
                  </Link>
                  <Link href="/commercial" onClick={() => setMobileOpen(false)}>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${isCommercial ? "bg-slate-800 text-white" : "border border-border text-muted-foreground"}`} data-testid="link-mobile-commercial">
                      <Building2 className="h-3 w-3" /> Commercial
                    </span>
                  </Link>
                </div>

                {navLinks.slice(2).map((link) => {
                  const isActive = location === link.href;
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                      <span
                        className={`flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                          isActive ? "bg-accent text-foreground" : "text-muted-foreground"
                        }`}
                        data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
                <div className="mt-4 space-y-2 px-4">
                  <VapiCallButton variant="outline" size="sm" label="Talk to Us 24/7" className="w-full" />
                  <Link href="/quote" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full" data-testid="button-mobile-quote">
                      Instant Quote
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
