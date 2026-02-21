# Viva Electric & Solar Website

## Overview
Professional website for Viva Electric & Solar (vivaes.net) - a union-trained electrical and solar company. Built as a reusable template with configurable env vars for multi-client deployment.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: Express.js API routes
- **Routing**: wouter (client-side)
- **Forms**: react-hook-form + zod validation
- **State**: @tanstack/react-query

## Pages
- `/` - Home: Hero, trust badges, services grid, testimonials carousel, CTA
- `/services` - Services list with images and quote buttons
- `/services/:slug` - Individual service detail pages
- `/quote` - Quote estimator form (posts to webhook)
- `/booking` - Booking form with date/time selection
- `/about` - About page with company info, values, stats, and contact form

## API Routes
- `POST /api/quote` - Submit quote request, forwards to OpenClaw webhook
- `POST /api/contact` - Submit contact form, forwards to OpenClaw webhook
- `POST /api/booking` - Submit booking request, forwards to OpenClaw webhook
- `POST /api/stripe/create-checkout` - Stripe checkout (placeholder, needs Stripe setup)

## Environment Variables (Template)
- `VIVA_BUSINESS_NAME` - Business name
- `VIVA_PHONE` - Business phone
- `VIVA_EMAIL` - Business email
- `VIVA_ADDRESS` - Business address
- `VIVA_CLAW_WEBHOOK_URL` - OpenClaw webhook endpoint
- `VIVA_CLAW_TOKEN` - OpenClaw auth token

## Key Files
- `shared/schema.ts` - Services data, form schemas, testimonials
- `client/src/components/navigation.tsx` - Top nav with dark/light toggle
- `client/src/components/footer.tsx` - Site footer
- `client/src/components/quote-modal.tsx` - Reusable quote modal
- `client/src/components/theme-provider.tsx` - Dark/light mode context
- `server/routes.ts` - API routes with webhook forwarding

## Design
- Electric blue primary color (hsl 217 91% 60%)
- Orange accent via chart-2 (hsl 27 87% 67%)
- Inter font family
- Dark/light mode with class-based toggling
- Framer Motion animations for scroll reveals
