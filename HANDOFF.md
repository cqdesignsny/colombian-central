# Colombian Central, session handoff

Last updated June 10, 2026. This is the pick-up-here doc. Read this first, then AGENTS.md for code conventions and MONETIZATION.md for the revenue plan.

## What it is

ColombianCentral.com, the hub for everything Colombian: World Cup fútbol, a shop for Colombian products and merch, a travel desk for trips to Colombia, news, and culture. Aimed at the Colombian diaspora in the US. First site in a planned multi-country "Central" network (Mexican Central, etc.), so country-specific values live in config and data files, never hardcoded.

## Live now

- Production: https://colombiancentral.com (apex + www attached and live)
- Vercel fallback URL: https://colombian-central-blue.vercel.app
- Repo: https://github.com/cqdesignsny/colombian-central (pushes to `main` auto-deploy to production)
- Pages: home, /futbol, /tienda (+ product pages), /viajes, /noticias (+ articles), /nosotros, 404

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4 (tokens in `src/app/globals.css`, no config file), Motion for animation. Fonts: Anton (display), Archivo (body), Instrument Serif (accents). Images generated with Higgsfield, stored in `public/images`.

## Infrastructure (all wired and verified)

- **Hosting**: Vercel, team `cq-marketings-projects`, project `colombian-central`. NOT the easyoeepro or tz-electric teams (other clients).
- **Database**: Neon Postgres, connected as a Vercel integration. Tables: `subscribers`, `orders`, `trip_inquiries`, `request_log`. Schema is idempotent in `scripts/db-setup.mjs` (run `node --env-file=.env.local scripts/db-setup.mjs`). The DB is the source of truth.
- **Email**: Resend on the verified domain colombiancentral.com (account colombiancentral@gmail.com). DKIM/SPF/MX/DMARC live in Vercel DNS, region us-east-1. Senders: `boletin@` (newsletter), `hola@` (transactional). Owner notifications go to cesar@creativequalitymarketing.com. The newsletter segment is "El Boletin" (id `25e0cc2a-99e2-450a-b492-8b27ac7f5a53`). The app runs on the full-access key named "colombian-central-app"; the restricted "Onboarding" key Cesar first shared is unused and can be deleted.
- **Secrets**: live in `.env.local` (gitignored) and Vercel envs. See `.env.example` for the list.

## What works end to end (tested in production)

- **Newsletter**: signup stores in Neon, syncs to Resend contacts + the El Boletin segment, sends a branded welcome email. Duplicates handled. HMAC-signed unsubscribe links flip both the DB and Resend.
- **Shop checkout**: cart drawer has a real checkout (name/email/address). Orders store in Neon and send an owner notification + customer confirmation. No online payment yet; confirmed by email.
- **Trip inquiries**: the Viajes form posts to `/api/inquiry`, stores in Neon, sends two emails.
- **Abuse protection**: per-IP rate limiting (DB-backed, fails open) + honeypot on all three public POST routes.

## What was done, in order

1. Built the whole site from scratch (design system, all pages, content, Higgsfield imagery) and pushed to GitHub.
2. Deployed to Vercel production.
3. Wired Resend (domain verification via Vercel DNS, welcome email, contact/segment sync, unsubscribe) and Neon (subscribers/orders/inquiries), plus a real checkout and the trip-inquiry pipeline. Attached the real domain.
4. Hardened the public API routes (rate limiting + honeypot) and researched + wrote the monetization plan (MONETIZATION.md).

## Next steps

### Decision pending (start of next session)
Cesar was asked where to point the next build and ended the session before answering. The four options on the table, all from MONETIZATION.md:
- **A. Affiliate money-pages** (recommended, lowest dependency): build the "send money to Colombia" comparison, Colombia tours page, and fan-gear guide, with outbound links gated behind a partners config so they activate when affiliate IDs are added. Captures World Cup traffic now.
- **B. Printful merch integration**: fulfillment-aware product model, catalog sync, order routing to Printful, shipment webhooks. Scaffold first; Cesar adds account + designs.
- **C. World Cup membership + Polla**: $19 tournament pass / $5-mo membership with a predictions game, shop discount, ad-free, on Stripe.
- **D. Authentic-goods shop**: wire coffee dropship (Roastify/Dripshipper) + owned-stock routing for crafts and food.

Re-ask or just proceed with A unless Cesar says otherwise.

### Cesar's account signups (can't be automated, gate the affiliate/merch builds)
Travelpayouts (GetYourGuide + insurance), Awin (Xe), Wise Partnerships, Remitly, Amazon Associates, Printful, Stripe, a coffee roaster (Roastify or Dripshipper), craft suppliers (Origin Colombia, Wayuu Market).

### Known gaps and caveats
- **No online payment.** Orders are confirmed by email. Stripe is the unlock for both real checkout and the membership (option C).
- **Preview env vars**: production and development have all env vars; Vercel preview is missing the four Resend/app vars (`RESEND_API_KEY`, `RESEND_SEGMENT_ID`, `SITE_URL`, `UNSUBSCRIBE_SECRET`) due to a CLI loop bug. Add them via the Vercel dashboard if PR preview deploys need to send email.
- **Newsletter is single opt-in.** Rate limiting + honeypot mitigate abuse; consider double opt-in if spam signups appear.
- **Rate limiter is DB-backed.** Fine for current scale; swap to Upstash/Vercel KV if volume grows.
- **Secrets passed through chat.** The Neon password and Resend key were shared in conversation. Rotating them someday is free (both have one-click reset); values live only in `.env.local` and Vercel envs.
- **Fulfillment-aware product model not built yet.** Deliberately deferred until the dropship/Printful stack is chosen, to avoid modeling it twice. The decided stack is in MONETIZATION.md.

## Run it locally

```bash
npm install
cp .env.example .env.local   # fill from Vercel envs or the team vault
node --env-file=.env.local scripts/db-setup.mjs
npm run dev
```

`npm run build` must pass before pushing. Pushing to `main` deploys to production.
