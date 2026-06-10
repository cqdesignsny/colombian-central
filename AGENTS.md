<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Colombian Central

The hub for everything Colombian: news, La Tricolor at the 2026 World Cup, a tienda for Colombian products, and a travel desk for trips to Colombia. Live domain target: colombiancentral.com.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4 (tokens defined in `src/app/globals.css` via `@theme`, no tailwind.config)
- Motion (`motion/react`) for animation
- Fonts via next/font: Anton (display), Archivo (body), Instrument Serif (accents)

## Design system ("el kiosco editorial")

- Paper `#F7F1E3` background, ink `#17130E` text. Flag colors as accents: amarillo `#FFCD00`, azul `#003087`, rojo `#C8102E`.
- Tricolor elements always use real flag proportions: yellow 2 parts, blue 1, red 1 (see `TricolorBar`).
- Display type is Anton, uppercase, tight leading (`.display-tight`). Body is Archivo. Instrument Serif italic for flavor lines only.
- Square corners everywhere. Hover states translate up with a hard ink shadow.
- The fútbol page is dark (ink background); the rest of the site is paper.
- No em-dashes in copy. Spanish phrases are used for warmth, English for information.

## Structure

- `src/config/site.ts` is the country config. The long-term vision is a multi-country "Central" network (Mexican Central, etc.): keep country-specific values here, not hardcoded in components.
- `src/data/*.ts` holds all content (products, articles, destinations, World Cup fixtures). No CMS yet; these files are the source of truth.
- Cart is client state (localStorage) with a real checkout: POST `/api/order` stores the order in Neon and sends Resend emails (owner notification + customer confirmation). No online payment yet; Stripe is the next step.
- Owner notifications (orders, trip inquiries) go to `site.contactEmail`.

## Email + database (wired June 2026)

- **Resend**: domain colombiancentral.com is verified (DKIM/SPF/MX/DMARC live in Vercel DNS, us-east-1). Senders: `boletin@` for El Boletín, `hola@` for transactional. The app key is full-access (named "colombian-central-app"); newsletter signups sync to Resend contacts and the "El Boletin" segment (`RESEND_SEGMENT_ID`) for dashboard broadcasts.
- **Neon Postgres**: tables `subscribers`, `orders`, `trip_inquiries` (schema in `scripts/db-setup.mjs`, idempotent, run with `node --env-file=.env.local scripts/db-setup.mjs`). The DB is the source of truth for the list; Resend contact sync is best-effort.
- **API routes**: `/api/newsletter` (signup + welcome email, idempotency key `welcome-email/<email>`), `/api/unsubscribe` (HMAC-signed links, flips both DB and Resend), `/api/order`, `/api/inquiry` (both store + send two emails with idempotency keys).
- **Emails** are hand-built table-layout HTML in `src/lib/emails.ts` (inline styles, text alternatives, tricolor shell). The Resend SDK returns `{data, error}`, never throws: check `error`.
- Env vars (see `.env.example`): set in Vercel for production + development; preview lacks the four Resend/app vars (CLI bug, add via dashboard when needed).
- No rate limiting on the API routes yet. Add before driving heavy traffic.

## Facts that must stay correct

- World Cup data in `src/data/futbol.ts` is real (Group K: Portugal, Uzbekistan, DR Congo; fixtures Jun 17/23/27, 2026). Verify against current sources before editing.
- The site is independent fan media: keep the "not affiliated with FIFA or the FCF" footer note, and keep the jersey described as unofficial fanwear.
- Artesanía copy makes sourcing claims (artisan-direct, artisan-set prices). Do not extend those claims to new products without Cesar's confirmation.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (must pass before pushing)
