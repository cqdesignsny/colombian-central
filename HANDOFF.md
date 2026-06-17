# Colombian Central, session handoff

Last updated June 17, 2026. This is the pick-up-here doc. Read this first, then AGENTS.md for code conventions, MONETIZATION.md for the revenue plan, and COMPETITIVE-RESEARCH.md for the market scan.

## What it is

ColombianCentral.com, the hub for everything Colombian: World Cup fútbol, música, comida, a shop for Colombian products and merch, a travel desk for trips to Colombia, news, and culture. Aimed at the Colombian diaspora in the US. First site in a planned multi-country "Central" network (Mexican Central, etc.), so country-specific values live in config and data files, never hardcoded.

## Live now

- Production: https://colombiancentral.com (apex + www attached and live)
- Vercel fallback URL: https://colombian-central-blue.vercel.app
- Repo: https://github.com/cqdesignsny/colombian-central (pushes to `main` auto-deploy to production)
- Pages: home, `/futbol` (+ `/futbol/hinchada`), `/musica`, `/comida`, `/tienda` (+ product pages), `/viajes` (+ `/viajes/mundial`), `/enviar-dinero`, `/noticias` (+ articles), `/nosotros`, `/gracias`, 404

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4 (tokens in `src/app/globals.css`, no config file), Motion for animation. Fonts: Anton (display), Archivo (body), Instrument Serif (accents). Product/imagery generated with Higgsfield, stored in `public/images`; squad photos are official FIFA cutouts in `public/images/players`.

## Infrastructure (all wired and verified)

- **Hosting**: Vercel, team `cq-marketings-projects`, project `colombian-central`. NOT the easyoeepro or tz-electric teams (other clients). Hourly cron defined in `vercel.json`.
- **AI**: Vercel AI Gateway powers El Paisa (`AI_GATEWAY_API_KEY` in env, free tier, model `anthropic/claude-haiku-4.5`). See the El Paisa section.
- **Database**: Neon Postgres, connected as a Vercel integration. Tables: `subscribers`, `orders`, `trip_inquiries`, `request_log`, `paisa_posts`. Schema is idempotent in `scripts/db-setup.mjs` (run `node --env-file=.env.local scripts/db-setup.mjs`). The DB is the source of truth.
- **Payments**: Stripe, **live**, on a dedicated Colombian Central account (`acct_1Tj3kbQny3EkJJVW`), not the CQM account. Real hosted Checkout. See the Payments section below.
- **Email**: Resend on the verified domain colombiancentral.com (account colombiancentral@gmail.com). DKIM/SPF/MX/DMARC live in Vercel DNS, region us-east-1. Senders: `boletin@` (newsletter), `hola@` (transactional). Owner notifications go to cesar@creativequalitymarketing.com. Newsletter segment "El Boletin" (id `25e0cc2a-99e2-450a-b492-8b27ac7f5a53`). App runs on the full-access key "colombian-central-app".
- **Secrets**: live in `.env.local` (gitignored) and Vercel envs. See `.env.example` for the list. Env changes in Vercel require a redeploy to take effect.

## Payments (Stripe, live)

- **Account**: a dedicated Stripe account for Colombian Central (`acct_1Tj3kbQny3EkJJVW`), under Cesar's login alongside CQM. The clean multi-brand model is one account per brand, not DBA sub-accounts. Each future "Central" site gets its own account.
- **Checkout**: `/api/checkout` creates a hosted Stripe Checkout Session from the cart and redirects. It is gated by `NEXT_PUBLIC_STRIPE_ENABLED`: when `"true"` the cart shows card-checkout copy and routes to Stripe; otherwise it falls back to the order-by-email flow. Stripe collects the shipping address, so the cart only needs an email up front.
- **Webhook**: `/api/stripe/webhook` verifies the signature (raw body via `req.text()`, `runtime = "nodejs"`), marks the order paid, and sends the confirmation email. Idempotent on `stripe_session_id` (unique index).
- **Labeling**: each payment carries `payment_intent_data.description` with the order number and items, so the Stripe dashboard line is readable. The customer's card statement reads `COLOMBIANCENTRAL.COM` (account-level statement descriptor).
- **Orders schema additions**: `payment_status` (default `unpaid`), `stripe_session_id`, `amount_total_cents`, `paid_at`, plus `phone`, `marketing_opt_in`, `reminder_stage`, `reminder_last_at` for the abandoned-cart flow.
- **To finish in the Stripe dashboard (Cesar)**: confirm Branding (logo + colors on the Checkout page), accept the Terms of Service so consent collection / promotions can be re-enabled (it was removed from `/api/checkout` because the account had not accepted ToS), and confirm wallets (Apple/Google Pay) are on.

## Conversion (CRO) on the cart and checkout

- Cart drawer (`src/components/cart.tsx`): free-shipping progress bar, quantity controls, a cross-sell row, trust line, and email capture before the Stripe redirect (the email is the lead even if they bounce).
- **Abandoned-cart automation**: an unpaid order is a recoverable cart. The hourly cron hits `/api/cron/abandoned`, which sends up to three reminder emails at roughly 1h / 24h / 72h, no discounts, then stops. `reminder_stage` tracks progress and each send uses idempotency key `cart-reminder/<id>/<stage>`; carts older than 7 days are left alone. The route is guarded by `CRON_SECRET` (Vercel sends it as a bearer token; add it to Vercel envs).
- `/gracias` is the post-checkout success page; `ClearCart` empties the cart on arrival.

## What works end to end (tested in production)

- **Newsletter**: signup stores in Neon, syncs to Resend contacts + the El Boletin segment, sends a branded welcome email. Duplicates handled. HMAC-signed unsubscribe links flip both the DB and Resend.
- **Shop checkout**: real card payment via Stripe when enabled, order-by-email fallback otherwise. Orders store in Neon and send owner + customer emails.
- **Trip inquiries**: the Viajes form posts to `/api/inquiry`, stores in Neon, sends two emails.
- **Abuse protection**: per-IP rate limiting (DB-backed, fails open) + honeypot on all public POST routes.

## Content pillars

- **Fútbol** (`/futbol`): real Group K data (Portugal, Uzbekistan, DR Congo; fixtures Jun 17/23/27, 2026), countdown, and "Los 26", the official FIFA squad with transparent player cutouts on dark cards. Group K opponent cards show country flags (`public/images/flags`). Squad photo sources live in `public/Col-Team` (gitignored). `/futbol/hinchada` is the fan-gear affiliate guide.
- **Música** (`/musica`): top artists, a genre guide (vallenato, cumbia, salsa, champeta, urbano, bambuco), and verified 2026 US concert listings with status badges. Data in `src/data/musica.ts`. Curated, not a live feed.
- **Comida** (`/comida`): authentic recipes with full ingredients and steps, a Colombian restaurant finder across 9 US metros plus a "find near you" Google Maps search, and a pantry cross-sell to the tienda. Data in `src/data/comida.ts`.
- Nav now carries seven items (Fútbol, Música, Comida, Tienda, Viajes, Noticias, Nosotros); the inline nav shows at the `lg` breakpoint, hamburger below.

## El Paisa (the AI mascot)

El Paisa is the site's Colombian AI: a visitor chat plus an autonomous "desk" that writes its own content. Persona, site knowledge, model, and a library of paisa sayings live once in `src/lib/paisa.ts`, reused by both.

- **Brain = Vercel AI Gateway.** `AI_GATEWAY_API_KEY` is set in the project env (created via `vercel ai-gateway api-keys create`; I have Vercel CLI access as cqdesignsny). The Gateway is on the **FREE TIER**, which only allows cheaper models: El Paisa runs on **`anthropic/claude-haiku-4.5`** (great for the persona). Sonnet/Opus return a 403 `RestrictedModelsError` until paid credits are added (top up in the Vercel dashboard). Web search is also paid, so the desk has no live web access yet. Note: `vercel env add` needs the value piped with a trailing newline or it stores empty.
- **Chat** (`/api/paisa/chat` + `src/components/ElPaisaChat.tsx`): a floating, streaming chat in Cesar's mascot art, site-wide. Full Spanglish with real sayings, grounded in `SITE_KNOWLEDGE`, per-IP rate limited, friendly fallback if the Gateway is down. Any element opens it by firing a `paisa:open` window event (`PaisaButton`): used by the homepage "Conoce a El Paisa" section and the footer.
- **Autonomous desk** (`/api/paisa/refresh` + `src/components/PaisaDesk.tsx` + `paisa_posts` table): a daily cron (`vercel.json`, CRON_SECRET-guarded GET) where El Paisa writes ~3 short posts grounded ONLY in `SITE_KNOWLEDGE` (a match preview + spotlights), stores them, and revalidates `/noticias`, where they render as "El Escritorio de El Paisa." Throttled to ~daily; renders nothing until he has posted; no fabrication by design.
- **Art**: Cesar's own El Paisa cartoon at `public/brand/El-Paisa.png` (transparent PNG), optimized to `public/images/paisa/el-paisa.png`. Used as the chat avatar (CSS head crop) and the homepage/footer mascot. Do not regenerate.
- **Upgrade path (Cesar)**: add paid AI Gateway credits, then (1) bump `PAISA_MODEL` to sonnet/opus for richer answers, and (2) give the desk + chat live web search, turning the desk into the true autonomous reporter (real news + final scores).

## Affiliate money-pages (Option A, built, gated)

Three pages plus a gating layer, live the moment Cesar pastes his tracking IDs.
- **Pages**: `/enviar-dinero` (remittance comparison: Wise vs Remitly vs Xe vs Western Union, highest-ROI page), `/viajes/mundial` (matchday travel to the 2026 host cities, plus travel insurance, cross-linked to the travel desk), `/futbol/hinchada` (fan-gear guide: our shop first, Amazon Associates for the long tail).
- **Gating**: `src/config/partners.ts` holds each partner with an empty `affiliateUrl` and a real `publicUrl` fallback, plus `amazonAssociateTag`. Links use the public URL until a tracking link exists. Helpers: `partnerHref`, `isPartnerActive`, `amazonSearch`. Components: `AffiliateLink` (rel="sponsored nofollow noopener") and `AffiliateDisclosure` (FTC, on every money page).
- **To activate (Cesar)**: paste each approved program's tracking link into its `affiliateUrl`, set `amazonAssociateTag`. One file, no page edits.

## Marketing / social

- **Scheduler**: Metricool (chosen over Buffer) for scheduling; ManyChat for Instagram DM automation. Cesar sets up the accounts and connects the profiles; the workflow is "I draft and schedule, Cesar approves."
- **Post templates**: a design direction for social posts was drafted (matchday, product, culture). From Cesar: no solid-color backgrounds, use imagery (landscapes, products, match graphics) or full color with differentiated text. These are mockups, not yet a built generator.

## What was done this session (June 16 to 17, 2026)

1. Built the affiliate layer and three money pages (`/enviar-dinero`, `/viajes/mundial`, `/futbol/hinchada`), gated behind `partners.ts`.
2. Stood up **live Stripe payments** on the dedicated Colombian Central account: `/api/checkout`, `/api/stripe/webhook`, branded checkout, labeled and idempotent charges, `COLOMBIANCENTRAL.COM` descriptor.
3. CRO pass on the cart and checkout: progress bar, lead capture, cross-sell, and the 3-email abandoned-cart cron.
4. Fixed product copy and replaced placeholder product images with real photos.
5. Wrote COMPETITIVE-RESEARCH.md (colombiaone.com and other Colombian media/socials).
6. Added real fútbol imagery: opponent flags and the official FIFA 26-man squad as transparent cutouts on dark cards, matched exactly to the FIFA roster.
7. Built the **Música** and **Comida** pillar pages and added them to the nav.
8. New logo across the site, ~20% larger reading type, real imagery + "news" sections on `/musica` and `/comida`, and homepage features for both pillars.
9. Replaced the empanada photo with an authentic Colombian one (researched: golden-orange fried cornmeal).
10. Public contact is now `info@colombiancentral.com` (owner notifications still route to the business inbox).
11. Built **El Paisa**: the live AI chat and the autonomous desk on `/noticias`, plus coach Néstor Lorenzo on `/futbol`.

## Next steps

### Cesar's account signups (gate the affiliate/merch builds, cannot be automated)
Travelpayouts (GetYourGuide + insurance), Awin (Xe), Wise Partnerships, Remitly, Amazon Associates, Printful, a coffee roaster (Roastify or Dripshipper), craft suppliers (Origin Colombia, Wayuu Market). Paste affiliate IDs into `src/config/partners.ts` as each is approved.

### Remaining monetization options (from MONETIZATION.md)
- **B. Printful merch**: fulfillment-aware product model, catalog sync, order routing, shipment webhooks. Scaffold first; Cesar adds account + designs.
- **C. World Cup membership + Polla**: tournament pass / monthly membership with a predictions game, on Stripe (now that Stripe is live). The free Polla is the most time-sensitive piece since the group stage is now.
- **D. Authentic-goods shop**: coffee dropship + owned-stock routing for crafts and food.

### El Paisa upgrade (Cesar)
Add paid AI Gateway credits (Vercel dashboard top-up). Then bump `PAISA_MODEL` to sonnet/opus for richer chat, and turn on web search so the desk + chat get live Colombian news and final match scores (the true autonomous reporter). A review-queue/admin for the desk is the next build after that.

### Product / content
- More recipes; expand the restaurant finder.
- The desk currently posts to `/noticias`; consider surfacing the latest El Paisa post on the homepage too.

## Known gaps, caveats, and security

- **Rotate the live Stripe secret key.** The dedicated account's `sk_live_...` (and the older CQM key) were pasted in chat. Reset the key in the Stripe dashboard and update `.env.local` + Vercel. Keys belong only in `.env.local` (gitignored) and Vercel envs, never in git.
- **Stripe ToS not yet accepted** in the dashboard, so consent collection / promotions are disabled in `/api/checkout`. Accept ToS, then re-enable if wanted.
- **Preview env vars**: production and development have all env vars; Vercel preview is missing the Resend/app vars due to a CLI loop bug. Add via the dashboard if PR preview deploys need to send email.
- **Newsletter is single opt-in.** Rate limiting + honeypot mitigate abuse; consider double opt-in if spam appears.
- **Rate limiter is DB-backed.** Fine for now; swap to Upstash/Vercel KV at scale.
- **Other secrets passed through chat** (Neon password, Resend key): rotating them is a free one-click reset.
- **`/musica` and `/comida` are curated**, not CMS-driven. Concert and restaurant data is researched and flagged where uncertain; confirm before relying on specific dates/hours.
- **El Paisa runs on the AI Gateway FREE TIER** (`claude-haiku-4.5`). Premium models and web search need paid credits, so the desk writes from site facts only (no live news/scores) until then. See the El Paisa section.
- **Fulfillment-aware product model not built yet**, deliberately deferred until the dropship/Printful stack is wired (see MONETIZATION.md).

## Run it locally

```bash
npm install
cp .env.example .env.local   # fill from Vercel envs or the team vault
node --env-file=.env.local scripts/db-setup.mjs
npm run dev
```

`npm run build` must pass before pushing. Pushing to `main` deploys to production.
