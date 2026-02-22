import { Link } from "wouter";
import { Zap, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card" data-testid="section-footer">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-base font-bold" data-testid="text-footer-brand">Viva Electric & Solar</span>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-footer-tagline">
              Union-trained electrical and solar professionals serving residential and commercial customers 24/7.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Services</h4>
            <div className="flex flex-col gap-2">
              <Link href="/services/solar-storage" className="text-sm text-muted-foreground transition-colors" data-testid="link-footer-solar">Solar & Storage</Link>
              <Link href="/services/ev-chargers" className="text-sm text-muted-foreground transition-colors" data-testid="link-footer-ev">EV Chargers</Link>
              <Link href="/services/panel-upgrades" className="text-sm text-muted-foreground transition-colors" data-testid="link-footer-panel">Panel Upgrades</Link>
              <Link href="/services/lighting-retrofits" className="text-sm text-muted-foreground transition-colors" data-testid="link-footer-lighting">Lighting Retrofits</Link>
              <Link href="/services/general-electrical" className="text-sm text-muted-foreground transition-colors" data-testid="link-footer-general">General Electrical</Link>
              <Link href="/services/commercial" className="text-sm text-muted-foreground transition-colors" data-testid="link-footer-commercial">Commercial</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/quote" className="text-sm text-muted-foreground transition-colors" data-testid="link-footer-quote">Get a Quote</Link>
              <Link href="/booking" className="text-sm text-muted-foreground transition-colors" data-testid="link-footer-booking">Book Appointment</Link>
              <Link href="/about" className="text-sm text-muted-foreground transition-colors" data-testid="link-footer-about">About Us</Link>
              <Link href="/about#contact" className="text-sm text-muted-foreground transition-colors" data-testid="link-footer-contact">Contact</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Contact</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="text-footer-phone">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+1 (510) 706-8246</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="text-footer-email">
                <Mail className="h-4 w-4 shrink-0" />
                <span>vivaes.sf@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="text-footer-address">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>San Francisco Bay Area</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground" data-testid="text-footer-copyright">
            &copy; {new Date().getFullYear()} Viva Electric & Solar. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground" data-testid="text-footer-powered">
            Powered by <span className="font-medium">VivaClaw</span> &mdash; 24/7 Service
          </p>
        </div>
      </div>
    </footer>
  );
}
