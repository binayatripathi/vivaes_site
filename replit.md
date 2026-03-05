# Viva Electric & Solar Inc. Website

## Overview
Professional website for Viva Electric & Solar Inc. (vivaes.net) - licensed electrical and solar contractor serving the Bay Area and Central Valley. CA License #1147947. Built as a reusable template with configurable env vars for multi-client deployment.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: Express.js API routes
- **Routing**: wouter (client-side)
- **Forms**: react-hook-form + zod validation
- **State**: @tanstack/react-query
- **Quote System**: Interactive chatbot-style quote assistant with instant pricing engine

## Pages
- `/` - Home: Hero ("We Show Up. We Fix It. You Pay a Fair Price."), services grid (top 6), testimonials, CTA
- `/services` - All services list with images and quote buttons
- `/services/:slug` - Individual service detail pages
- `/solar-storage` - Solar & Battery Storage: brand logo grid (Enphase, Tesla Powerwall, FranklinWH, SolarEdge, Generac PWRcell), 3 service cards (battery add-on, re-roofing, health checks)
- `/electrification` - Home Electrification: education section, rebates (IRA, HEEHRA, SGIP, PG&E/SMUD), 3-step roadmap, free assessment CTA
- `/quote` - Interactive chatbot quote assistant (instant pricing, no email wait)
- `/booking` - Booking form with date/time selection + consultation fee payment
- `/about` - About page with Roberto's bio, values, stats, service areas, contact form
- `/payment/success` - Payment success page with session details
- `/payment/cancel` - Payment cancelled page

## Services (11 total)
1. Solar & Storage
2. EV Chargers
3. Panel Upgrades
4. Lighting Retrofits
5. General Electrical
6. Commercial
7. Battery Storage Add-On (Existing Solar)
8. Solar + Battery System (New)
9. Re-Roofing + Panel Removal/Reinstall
10. Electrification Assessment (Free)
11. Warehouse / Commercial Electrical

## Service Areas (3 regions)
- **SF / Peninsula**: San Francisco, Daly City, South San Francisco, San Bruno, Millbrae, Burlingame, San Mateo, Redwood City, Palo Alto
- **Alameda County (510)**: Oakland, Berkeley, Fremont, Hayward, San Leandro, Castro Valley, Livermore, Pleasanton, Newark, Union City, Alameda, Emeryville
- **San Joaquin Valley (209)**: Stockton, Tracy, Modesto, Manteca, Lodi, Turlock, Merced, Lathrop, Ripon, Escalon

## Quote Chatbot System
- Step-by-step conversational interface (service → property type → project size → urgency → details → contact info)
- Instant pricing engine based on service type, property, size, and urgency multipliers
- Detailed cost breakdown: base, labor, materials, permits
- Price range estimates with timeline
- Available as full page (/quote) and as modal overlay from any page
- Floating chat button on all pages for quick access

## API Routes
- `POST /api/quote` - Submit quote request, forwards to OpenClaw webhook + email notification
- `POST /api/contact` - Submit contact form, forwards to OpenClaw webhook + email notification
- `POST /api/booking` - Submit booking request, forwards to OpenClaw webhook + email notification
- `POST /api/stripe/create-checkout` - Stripe checkout for deposits and consultation fees
- `GET /api/stripe/session/:sessionId` - Retrieve checkout session details + trigger payment email
- `GET /api/stripe/publishable-key` - Get Stripe publishable key for frontend
- `POST /api/stripe/webhook` - Stripe webhook handler (registered before express.json())

## Stripe Payment Integration
- Stripe connected via Replit connector (handles API keys securely)
- stripe-replit-sync for webhook processing and data sync
- Two payment flows: 20% deposit from quote results, $75 consultation fee from booking
- Checkout sessions use price_data for dynamic one-time amounts
- Payment success/cancel pages with session retrieval
- Email notifications sent on successful payment (to business + customer)

## Email Notifications (Resend)
- From: hello@storywonderbook.com
- To: roberto@vivaes.net (business notifications)
- Customer confirmations sent to their email
- Templates: Quote, Contact, Booking, Payment confirmation

## Contact Info
- Phone: (510) 710-5745
- Email: roberto@vivaes.net
- Service Area: Bay Area & Central Valley
- CA License: #1147947

## Vapi Voice Agent (24/7 Phone)
- Uses @vapi-ai/web SDK for browser-based voice calls
- VapiProvider context wraps entire app for shared call state
- Single Vapi instance across all buttons (no duplicate sessions)
- Call panel with real-time transcript, mute/unmute, end call
- Integrated on: Home hero, Home CTA, Quote results, Services detail, About contact, Footer

## Environment Variables (Template)
- `VITE_VAPI_PUBLIC_KEY` - Vapi public API key (frontend, required)
- `VITE_VAPI_ASSISTANT_ID` - Vapi assistant ID (frontend, optional - uses default if not set)
- `VIVA_BUSINESS_NAME` - Business name
- `VIVA_PHONE` - Business phone
- `VIVA_EMAIL` - Business email
- `VIVA_ADDRESS` - Business address
- `VIVA_CLAW_WEBHOOK_URL` - OpenClaw webhook endpoint
- `VIVA_CLAW_TOKEN` - OpenClaw auth token

## Key Files
- `shared/schema.ts` - Services data, service areas, form schemas, testimonials, pricing engine
- `client/src/pages/solar-storage.tsx` - Solar & Storage page with brand grid and service cards
- `client/src/pages/electrification.tsx` - Electrification page with education, rebates, roadmap
- `client/src/components/quote-chatbot.tsx` - Interactive chatbot quote system with deposit payment
- `client/src/components/quote-modal.tsx` - Quote modal wrapper for chatbot
- `client/src/components/vapi-call-button.tsx` - Vapi voice call button + provider + call panel
- `client/src/components/navigation.tsx` - Top nav with Solar & Storage + Electrification tabs
- `client/src/components/footer.tsx` - Site footer with service areas
- `client/src/components/theme-provider.tsx` - Dark/light mode context
- `client/src/pages/payment-success.tsx` - Payment success page
- `client/src/pages/payment-cancel.tsx` - Payment cancel page
- `server/routes.ts` - API routes with webhook forwarding, Stripe checkout, email
- `server/email.ts` - Resend email notification service
- `server/stripeClient.ts` - Stripe client via Replit connector
- `server/webhookHandlers.ts` - Stripe webhook processing
- `client/index.html` - Schema.org JSON-LD structured data

## Design
- Electric blue primary color (hsl 217 91% 60%)
- Orange accent via chart-2 (hsl 27 87% 67%)
- Inter font family
- Dark/light mode with class-based toggling
- Framer Motion animations for scroll reveals
- Real Unsplash photography (working-class Bay Area neighborhoods, real electricians)
- No AI branding - uses "24/7" and "instant" messaging

## User Preferences
- No AI mentions anywhere on the site
- Instant quotes preferred over email-based flows
- Warm, working-class tone (not corporate)
- Hero tagline: "We Show Up. We Fix It. You Pay a Fair Price."
- Phone: (510) 710-5745
- Email: roberto@vivaes.net
- Service area: Bay Area & Central Valley
