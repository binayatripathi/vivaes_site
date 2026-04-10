# Viva Electric & Solar Inc. Website

## Overview
Professional website for Viva Electric & Solar Inc. (vivaes.net) — licensed electrical and solar contractor serving the Bay Area and Central Valley. CA License #1147947. Built as a full-stack lead-generation and customer-service platform with AI voice integration, online invoicing, and a reviews system.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: Express.js API routes
- **Database**: PostgreSQL (Replit built-in) with Drizzle ORM
- **Routing**: wouter (client-side)
- **Forms**: react-hook-form + zod validation
- **State**: @tanstack/react-query
- **Payments**: Stripe (via Replit connector — test in dev, live in production)
- **Email**: Resend (via Replit connector)
- **Voice AI**: Vapi (@vapi-ai/web)

## Database Tables
- **leads**: id, leadId (ld_xxx), name, phone, email, address, city, zip, serviceType, propertyType, urgency, projectSize, details, source (web-form|vapi-phone|vapi-chat), status (new|contacted|quoted|booked|completed|lost), createdAt, updatedAt
- **appointments**: id, bookingId (bk_xxx), leadId (FK), name, phone, email, serviceType, preferredDate, preferredTime, notes, status (pending|confirmed|completed|cancelled), createdAt, updatedAt
- **call_logs**: id, callId (unique), assistantId, callerPhone, duration (seconds), summary, transcript (JSON), status (completed|failed|missed|no-answer), endedReason, cost, createdAt
- **reviews**: id, name, email, phone, rating (1-5), comment, photos (text[]), source (native|google|angie|homedepot), verified, verificationToken, verificationExpiresAt, approved, externalLink, screenshotUrl, createdAt, updatedAt

## Pages
- `/` — Home: Hero, "Why Viva" section, services grid, testimonials carousel (live from DB), CTA
- `/residential` — Residential services landing page
- `/commercial` — Commercial services landing page
- `/services` — All services list
- `/services/:slug` — Individual service detail pages
- `/solar-storage` — Solar & Battery Storage (Enphase, Tesla Powerwall, FranklinWH, etc.)
- `/electrification` — Home Electrification: rebates, roadmap, assessment CTA
- `/tesla` — Tesla Certified Installer page (Wall Connector + Powerwall 3)
- `/insurance-compliance` — Insurance compliance panel upgrades
- `/quote` — Interactive chatbot quote assistant
- `/booking` — Booking form + consultation fee payment ($250 via Stripe)
- `/reviews` — Public reviews page with filter tabs (All/Google/Angie/Home Depot/Our Site) + "Leave a Review" form
- `/about` — About page with Roberto's bio, contact form
- `/payment/success` — Stripe payment success
- `/payment/cancel` — Stripe payment cancelled
- `/admin/login` — Admin login (username + password)
- `/admin` — Admin dashboard (auth required): leads, appointments, stats, call logs, reviews moderation, invoice sender

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
10. Electrification Assessment
11. Warehouse / Commercial Electrical

## Service Areas (3 regions)
- **SF / Peninsula**: San Francisco, Daly City, South San Francisco, San Bruno, Millbrae, Burlingame, San Mateo, Redwood City, Palo Alto
- **Alameda County (510)**: Oakland, Berkeley, Fremont, Hayward, San Leandro, Castro Valley, Livermore, Pleasanton, Newark, Union City, Alameda, Emeryville
- **San Joaquin Valley (209)**: Stockton, Tracy, Modesto, Manteca, Lodi, Turlock, Merced, Lathrop, Ripon, Escalon

## API Routes

### Customer-Facing
- `POST /api/quote` — Submit quote request → saves lead to DB + webhook + email
- `POST /api/contact` — Submit contact form → saves lead to DB + webhook + email
- `POST /api/booking` — Submit booking → saves lead + appointment to DB + webhook + email
- `POST /api/reviews` — Submit review → saves to DB, sends verification email to reviewer
- `GET /api/reviews` — List approved reviews (public; email/phone stripped from response)
- `GET /api/reviews/verify/:token` — Verify review via email link (renders HTML page)
- `POST /api/uploads` — Upload review photos (multer, saved to public/uploads/, served at /uploads/)
- `POST /api/stripe/create-checkout` — Stripe checkout for deposits and consultation fees
- `GET /api/stripe/session/:sessionId` — Retrieve checkout session details + trigger payment email
- `GET /api/stripe/publishable-key` — Get Stripe publishable key for frontend
- `POST /api/stripe/webhook` — Stripe webhook handler

### Vapi Voice Agent Endpoints (authenticated via X-Vapi-Secret header)
- `POST /api/vapi/create-lead` — Save qualified lead from voice call
- `POST /api/vapi/get-quote` — Calculate ballpark estimate for caller
- `POST /api/vapi/book-appointment` — Create appointment from voice call
- `POST /api/vapi/check-service-area` — Validate city/ZIP against service areas
- `POST /api/vapi/transfer` — Transfer call to Roberto (+15107105745)
- `POST /api/vapi/webhook` — Vapi end-of-call webhook (saves call log, sends email summary)

### Admin Endpoints (Bearer token auth via VIVA_ADMIN_TOKEN)
- `POST /api/admin/login` — Authenticate with ADMIN_USERNAME + ADMIN_PASSWORD, returns bearer token
- `GET /api/admin/leads` — List all leads (optional ?status= filter)
- `GET /api/admin/leads/:id` — Get single lead
- `PATCH /api/admin/leads/:id/status` — Update lead status
- `GET /api/admin/appointments` — List all appointments
- `PATCH /api/admin/appointments/:id/status` — Update appointment status
- `GET /api/admin/call-logs` — List recent call logs (up to 100)
- `GET /api/admin/stats` — Dashboard stats
- `POST /api/admin/send-invoice` — Send deposit invoice email (Zelle + optional Stripe link) to client + team
- `POST /api/admin/generate-payment-link` — Create a live Stripe Payment Link for given amount/reference, returns { url }
- `GET /api/admin/reviews` — List all reviews (full data including email/phone)
- `GET /api/admin/reviews/pending` — List reviews pending approval
- `POST /api/admin/reviews/approve/:id` — Approve a review
- `POST /api/admin/reviews/reject/:id` — Reject a review
- `DELETE /api/admin/reviews/:id` — Delete a review
- `POST /api/admin/reviews/curate` — Add a curated/external review

## Stripe Payment Integration
- Stripe connected via Replit connector (handles API keys securely)
- **Dev**: test mode keys → test payment links (`buy.stripe.com/test_...`)
- **Production**: live mode keys → real payment links (`buy.stripe.com/...`)
- stripe-replit-sync for webhook processing and data sync
- Two Stripe checkout flows: 20% deposit (from quote), $250 consultation fee (from booking)
- Admin can generate Stripe Payment Links on-the-fly from the Invoices tab
- Payment success/cancel pages with session retrieval

## Invoice System (Admin)
- Admin fills in client name, email, phone, address, reference, description, amount
- Click **Generate** → creates a real Stripe Payment Link for that amount
- Click **Send Invoice** → emails client (warm greeting, Pay Online Now button, Zelle info, services showcase) and sends internal copy to team
- Zelle: +1 (510) 706-8246, +1 (510) 710-5745, roberto@vivaes.net

## Reviews System
- Customers submit reviews at `/reviews` (name, email, rating, comment, optional photos)
- Verification email sent via Resend; customer clicks link to verify
- Admin approves verified reviews from the admin panel Reviews tab
- Approved reviews appear on the `/reviews` page and in the homepage testimonials carousel
- 5 seed testimonials loaded on first startup if no reviews exist
- Admin can also add curated/external reviews (Google, Angie's List, etc.)

## Email Notifications (Resend)
- **From**: configured via `VIVA_FROM_EMAIL` env var (defaults to `hello@storywonderbook.com` — update to verified domain)
- **Notifications to**: configured via `VIVA_NOTIFY_EMAILS` (comma-separated, defaults to `roberto@vivaes.net`)
- **Reply-to**: `VIVA_EMAIL` (defaults to `roberto@vivaes.net`)
- Templates: Quote, Contact, Booking, Payment confirmation, Invoice (client + internal), Call summary, Review verification

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
- Backend tool endpoints authenticated via VAPI_SERVER_SECRET

## Environment Variables
- `VITE_VAPI_PUBLIC_KEY` — Vapi public API key (frontend)
- `VITE_VAPI_ASSISTANT_ID` — Vapi assistant ID (frontend)
- `VAPI_SERVER_SECRET` — Secret for authenticating Vapi tool calls (backend)
- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned)
- `VIVA_ADMIN_TOKEN` — Bearer token for admin API auth (required in production)
- `ADMIN_USERNAME` — Admin login username
- `ADMIN_PASSWORD` — Admin login password
- `VIVA_BUSINESS_NAME` — Business name override
- `VIVA_PHONE` — Business phone override
- `VIVA_EMAIL` — Business email / reply-to address
- `VIVA_FROM_EMAIL` — Sender address for all outgoing emails (must be verified in Resend)
- `VIVA_NOTIFY_EMAILS` — Comma-separated list of emails to receive internal notifications
- `VIVA_CLAW_WEBHOOK_URL` — OpenClaw webhook endpoint
- `VIVA_CLAW_TOKEN` — OpenClaw auth token

## Key Files
- `shared/schema.ts` — Services data, service areas, ZIP mapping, form schemas, DB table definitions, pricing engine
- `server/db.ts` — Drizzle ORM database connection
- `server/storage.ts` — DatabaseStorage CRUD: leads, appointments, call logs, reviews
- `server/routes.ts` — All customer + admin API routes
- `server/vapi-routes.ts` — Vapi tool endpoints
- `server/email.ts` — Resend email templates and sending logic
- `server/stripeClient.ts` — Stripe client via Replit connector (auto-switches dev/prod)
- `server/webhookHandlers.ts` — Stripe webhook processing
- `client/src/App.tsx` — Route definitions
- `client/src/pages/admin.tsx` — Admin dashboard (leads, appointments, stats, call logs, reviews, invoices)
- `client/src/pages/admin-login.tsx` — Admin login page
- `client/src/pages/reviews.tsx` — Public reviews page + Leave a Review form
- `client/src/pages/home.tsx` — Homepage with live testimonials from DB
- `client/src/pages/tesla.tsx` — Tesla Certified Installer page
- `client/src/components/quote-chatbot.tsx` — Interactive chatbot quote system
- `client/src/components/vapi-call-button.tsx` — Vapi voice call button + provider
- `client/src/components/navigation.tsx` — Top nav
- `client/src/components/footer.tsx` — Site footer
- `client/index.html` — Schema.org JSON-LD, OG/Twitter meta, canonical URL

## Design
- Electric blue primary color (hsl 217 91% 60%)
- Orange accent via chart-2 (hsl 27 87% 67%)
- Inter font family
- Dark/light mode with class-based toggling
- Framer Motion animations for scroll reveals
- Real Viva logo (green/blue gradient lightning bolt) in nav and footer

## SEO & Discoverability
- **robots.txt**: Allows all crawlers, blocks /admin, /api/, /payment/
- **sitemap.xml**: 15 pages, auto-generated with current date
- **Schema.org JSON-LD**: ElectricalContractor, WebSite, FAQPage
- **Meta tags**: canonical URL, OG tags, Twitter cards, geo meta, keywords

## User Preferences
- No AI mentions anywhere on the site
- Warm, working-class tone (not corporate)
- Hero tagline: "We Show Up. We Fix It. You Pay a Fair Price."
- Roberto is Hispanic — imagery reflects diverse/Hispanic tradespeople and Bay Area neighborhoods
