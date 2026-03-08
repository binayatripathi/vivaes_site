# Viva Electric & Solar Inc. Website

## Overview
Professional website for Viva Electric & Solar Inc. (vivaes.net) - licensed electrical and solar contractor serving the Bay Area and Central Valley. CA License #1147947. Built as a reusable template with configurable env vars for multi-client deployment.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: Express.js API routes
- **Database**: PostgreSQL (Replit built-in) with Drizzle ORM
- **Routing**: wouter (client-side)
- **Forms**: react-hook-form + zod validation
- **State**: @tanstack/react-query
- **Quote System**: Interactive chatbot-style quote assistant with instant pricing engine

## Database Tables
- **leads**: id, leadId (ld_xxx), name, phone, email, address, city, zip, serviceType, propertyType, urgency, projectSize, details, source (web-form|vapi-phone|vapi-chat), status (new|contacted|quoted|booked|completed|lost), createdAt, updatedAt
- **appointments**: id, bookingId (bk_xxx), leadId (FK), name, phone, email, serviceType, preferredDate, preferredTime, notes, status (pending|confirmed|completed|cancelled), createdAt, updatedAt

## Pages
- `/` - Home: Hero with background photo, "Why Viva" section (4 dark cards), services grid (top 6), testimonials, CTA
- `/services` - All services list with images and quote buttons
- `/services/:slug` - Individual service detail pages
- `/solar-storage` - Solar & Battery Storage: brand logo grid (Enphase, Tesla Powerwall, FranklinWH, SolarEdge, Generac PWRcell), 3 service cards (battery add-on, re-roofing, health checks)
- `/electrification` - Home Electrification: education section, rebates (IRA, HEEHRA, SGIP, PG&E/SMUD), 3-step roadmap, free assessment CTA
- `/quote` - Interactive chatbot quote assistant (instant pricing, no email wait)
- `/booking` - Booking form with date/time selection + consultation fee payment
- `/about` - About page with Roberto's bio, values, stats, service areas, contact form
- `/payment/success` - Payment success page with session details
- `/payment/cancel` - Payment cancelled page
- `/admin` - Admin dashboard (not linked in nav): leads table, appointments table, stats, status management

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

### Customer-Facing
- `POST /api/quote` - Submit quote request → saves lead to DB + webhook + email
- `POST /api/contact` - Submit contact form → saves lead to DB + webhook + email
- `POST /api/booking` - Submit booking → saves lead + appointment to DB + webhook + email
- `POST /api/stripe/create-checkout` - Stripe checkout for deposits and consultation fees
- `GET /api/stripe/session/:sessionId` - Retrieve checkout session details + trigger payment email
- `GET /api/stripe/publishable-key` - Get Stripe publishable key for frontend
- `POST /api/stripe/webhook` - Stripe webhook handler

### Vapi Voice Agent Endpoints (authenticated via X-Vapi-Secret header)
- `POST /api/vapi/create-lead` - Save qualified lead from voice call
- `POST /api/vapi/get-quote` - Calculate ballpark estimate for caller
- `POST /api/vapi/book-appointment` - Create appointment from voice call
- `POST /api/vapi/check-service-area` - Validate city/ZIP against service areas
- `POST /api/vapi/transfer` - Transfer call to Roberto (+15107105745)

### Admin Endpoints (no auth, admin by obscurity)
- `GET /api/admin/leads` - List all leads (optional ?status= filter)
- `GET /api/admin/leads/:id` - Get single lead by leadId
- `PATCH /api/admin/leads/:id/status` - Update lead status
- `GET /api/admin/appointments` - List all appointments (optional ?status= filter)
- `PATCH /api/admin/appointments/:id/status` - Update appointment status
- `GET /api/admin/stats` - Dashboard stats (totalLeads, newLeadsToday, pendingAppointments, completedJobs)

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
- Backend tool endpoints authenticated via VAPI_SERVER_SECRET

## Environment Variables (Template)
- `VITE_VAPI_PUBLIC_KEY` - Vapi public API key (frontend, required)
- `VITE_VAPI_ASSISTANT_ID` - Vapi assistant ID (frontend, optional)
- `VAPI_SERVER_SECRET` - Secret key for authenticating Vapi tool calls (backend)
- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned)
- `VIVA_BUSINESS_NAME` - Business name
- `VIVA_PHONE` - Business phone
- `VIVA_EMAIL` - Business email
- `VIVA_ADDRESS` - Business address
- `VIVA_CLAW_WEBHOOK_URL` - OpenClaw webhook endpoint
- `VIVA_CLAW_TOKEN` - OpenClaw auth token

## Key Files
- `shared/schema.ts` - Services data, service areas, ZIP code mapping, form schemas, DB table definitions, pricing engine
- `server/db.ts` - Drizzle ORM database connection
- `server/storage.ts` - DatabaseStorage class with full CRUD for leads + appointments
- `server/vapi-routes.ts` - 5 Vapi tool endpoints with API key auth
- `server/routes.ts` - Customer + admin API routes with webhook forwarding, Stripe, email
- `server/email.ts` - Resend email notification service
- `server/stripeClient.ts` - Stripe client via Replit connector
- `server/webhookHandlers.ts` - Stripe webhook processing
- `client/src/pages/admin.tsx` - Admin dashboard (leads, appointments, stats, status updates)
- `client/src/pages/solar-storage.tsx` - Solar & Storage page
- `client/src/pages/electrification.tsx` - Electrification page
- `client/src/components/quote-chatbot.tsx` - Interactive chatbot quote system
- `client/src/components/vapi-call-button.tsx` - Vapi voice call button + provider
- `client/src/components/navigation.tsx` - Top nav
- `client/src/components/footer.tsx` - Site footer
- `client/index.html` - Schema.org JSON-LD structured data (ElectricalContractor, WebSite, FAQPage), OG/Twitter meta, canonical URL
- Hero image: generated Hispanic electrician at `attached_assets/hero-electrician.png` (imported via `@assets/hero-electrician.png`)

## Design
- Electric blue primary color (hsl 217 91% 60%)
- Orange accent via chart-2 (hsl 27 87% 67%)
- Inter font family
- Dark/light mode with class-based toggling
- Framer Motion animations for scroll reveals
- Real Viva logo (green/blue gradient lightning bolt) in nav and footer
- Real Unsplash photography (working-class Bay Area neighborhoods, craftsman bungalows, diverse tradespeople, older homes, warehouses)
- "Why Viva" section with 4 dark slate cards
- No AI branding - uses "24/7" and "instant" messaging
- Roberto is Hispanic — imagery reflects diverse/Hispanic tradespeople and Bay Area working-class neighborhoods

## SEO & Discoverability
- **robots.txt**: Served at `/robots.txt` — allows all crawlers, blocks /admin, /api/, /payment/
- **sitemap.xml**: Served at `/sitemap.xml` — 15 pages, auto-generated with current date
- **Schema.org JSON-LD**: @graph with ElectricalContractor (business info, reviews, services, geo), WebSite, FAQPage (6 questions)
- **Meta tags**: canonical URL, OG tags, Twitter cards, geo meta, keywords
- **FAQ schema**: Optimized for LLM/AI search engines (Google SGE, Bing Copilot, ChatGPT) with natural-language Q&A about services, areas, licensing, pricing

## User Preferences
- No AI mentions anywhere on the site
- Instant quotes preferred over email-based flows
- Warm, working-class tone (not corporate)
- Hero tagline: "We Show Up. We Fix It. You Pay a Fair Price."
- Phone: (510) 710-5745
- Email: roberto@vivaes.net
- Service area: Bay Area & Central Valley
