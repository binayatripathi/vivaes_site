# Viva Electric & Solar Website

## Overview
Professional website for Viva Electric & Solar (vivaes.net) - a union-trained electrical and solar company serving the San Francisco Bay Area. Built as a reusable template with configurable env vars for multi-client deployment.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: Express.js API routes
- **Routing**: wouter (client-side)
- **Forms**: react-hook-form + zod validation
- **State**: @tanstack/react-query
- **Quote System**: Interactive chatbot-style quote assistant with instant pricing engine

## Pages
- `/` - Home: Hero, trust badges, services grid with images, testimonials carousel, CTA
- `/services` - Services list with images and quote buttons
- `/services/:slug` - Individual service detail pages
- `/quote` - Interactive chatbot quote assistant (instant pricing, no email wait)
- `/booking` - Booking form with date/time selection
- `/about` - About page with company info, values, stats, and contact form

## Quote Chatbot System
- Step-by-step conversational interface (service → property type → project size → urgency → details → contact info)
- Instant pricing engine based on service type, property, size, and urgency multipliers
- Detailed cost breakdown: base, labor, materials, permits
- Price range estimates with timeline
- Available as full page (/quote) and as modal overlay from any page
- Floating chat button on all pages for quick access

## API Routes
- `POST /api/quote` - Submit quote request, forwards to OpenClaw webhook
- `POST /api/contact` - Submit contact form, forwards to OpenClaw webhook
- `POST /api/booking` - Submit booking request, forwards to OpenClaw webhook
- `POST /api/stripe/create-checkout` - Stripe checkout (placeholder, needs Stripe setup)

## Contact Info
- Phone: +1 (510) 706-8246
- Email: vivaes.sf@gmail.com
- Service Area: San Francisco Bay Area

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
- `shared/schema.ts` - Services data, form schemas, testimonials, pricing engine
- `client/src/components/quote-chatbot.tsx` - Interactive chatbot quote system
- `client/src/components/quote-modal.tsx` - Quote modal wrapper for chatbot
- `client/src/components/vapi-call-button.tsx` - Vapi voice call button + provider + call panel
- `client/src/components/navigation.tsx` - Top nav with dark/light toggle
- `client/src/components/footer.tsx` - Site footer
- `client/src/components/theme-provider.tsx` - Dark/light mode context
- `server/routes.ts` - API routes with webhook forwarding

## Design
- Electric blue primary color (hsl 217 91% 60%)
- Orange accent via chart-2 (hsl 27 87% 67%)
- Inter font family
- Dark/light mode with class-based toggling
- Framer Motion animations for scroll reveals
- No AI branding - uses "24/7" and "instant" messaging

## User Preferences
- No AI mentions anywhere on the site
- Instant quotes preferred over email-based flows
- Phone: +1 (510) 706-8246
- Email: vivaes.sf@gmail.com
- Service area: San Francisco Bay Area
