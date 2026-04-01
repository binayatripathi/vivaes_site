import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { Menu, X, Sun, Moon } from "lucide-react";
import { VapiCallButton } from "@/components/vapi-call-button";
import vivaLogoPath from "@assets/viva-logo.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/solar-storage", label: "Solar & Storage" },
  { href: "/electrification", label: "Electrification" },
  { href: "/insurance-compliance", label: "Insurance Compliance" },
  { href: "/quote", label: "Instant Quote" },
  { href: "/booking", label: "Book Now" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" data-testid="link-home-logo">
          <img
            src={vivaLogoPath}
            alt="Viva Electric & Solar Inc."
            className="h-12 w-auto dark:brightness-125 dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]"
            data-testid="img-nav-logo"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" data-testid="nav-desktop">
          {navLinks.map((link) => {
            const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href}>
                <span
                  className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground"
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
                {navLinks.map((link) => {
                  const isActive = location === link.href;
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                      <span
                        className={`flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground"
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
