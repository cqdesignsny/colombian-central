<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Colombian Central

The hub for everything Colombian: news, La Tricolor at the 2026 World Cup, a tienda for Colombian products, and a travel desk for trips to Colombia. Live at colombiancentral.com.

**Picking up the project?** Read `HANDOFF.md` first (current state, infra, next steps), then this file for conventions and `MONETIZATION.md` for the revenue plan and commerce stack.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4 (tokens defined in `src/app/globals.css` via `@theme`, no tailwind.config)
- Motion (`motion/react`) for animation
- Fonts via next/font: Anton (display/headlines), Archivo (UI/sans), Fraunces (editorial reading serif for prose, applied via the `font-reading` class), Instrument Serif (italic accents)

## Design system ("el kiosco editorial")

- Paper `#F7F1E3` background, ink `#17130E` text. Flag colors as accents: amarillo `#FFCD00`, azul `#003087`, rojo `#C8102E`.
- Tricolor elements always use real flag proportions: yellow 2 parts, blue 1, red 1 (see `TricolorBar`).
- Display type is Anton, uppercase, tight leading (`.display-tight`). Body is Archivo. Instrument Serif italic for flavor lines only.
- Square corners everywhere. Hover states translate up with a hard ink shadow.
- The fútbol page is dark (ink background); the rest of the site is paper.
- No em-dashes in copy. Spanish phrases are used for warmth, English for information.

## Structure

- `src/config/site.ts` is the country config. The long-term vision is a multi-country "Central" network (Mexican Central, etc.): keep country-specific values here, not hardcoded in components.
- `src/data/*.ts` holds all content (products, articles, destinations, World Cup fixtures, música, comida). No CMS yet; these files are the source of truth. Affiliate partners live in `src/config/partners.ts`.
- Cart is client state (localStorage). Checkout posts to `/api/checkout`, which creates a live Stripe Checkout Session when `NEXT_PUBLIC_STRIPE_ENABLED` is `"true"`, otherwise it falls back to an order-by-email flow. Orders store in Neon and send Resend emails (owner + customer); `/api/stripe/webhook` marks them paid and the hourly `/api/cron/abandoned` recovers unpaid carts.
- Owner notifications (orders, trip inquiries) go to `site.contactEmail`; the public contact shown on the site is `site.publicEmail` (info@colombiancentral.com).
- **El Paisa** is the AI mascot, now fully awake. `src/lib/paisa.ts` holds the persona, sayings (`PAISA_SAYINGS`), `SITE_KNOWLEDGE`, and `PAISA_MODEL` (`anthropic/claude-sonnet-4.6`). Runs on the Vercel AI Gateway **paid tier** with live web search via Perplexity (`src/lib/websearch.ts`, `paisaWebSearch`). **Chat** = `/api/paisa/chat` + `ElPaisaChat` (site-wide, streaming, a cost-capped `web_search` tool, renders Markdown links + bold, NO emojis). **News engine** = `/api/paisa/refresh` (daily 6am ET cron) web-searches and writes 1-3 news stories to `paisa_stories`, rendered by `NewsFeed` on `/noticias` with story pages at `/noticias/[slug]` (ISR); helpers in `src/lib/paisa-stories.ts`. The old `paisa_posts` + `PaisaDesk` short-post desk is SUPERSEDED. **Auto scores** = `/api/cron/scores` + `src/lib/match-results.ts` + the `match_results` table: two web sources must agree before a Colombia score is written, then it's overlaid on the static fixtures. Open the chat via the `paisa:open` window event (`PaisaButton`). Mascot art `public/brand/El-Paisa.png` (full figure, site-wide; do not regenerate). Budget is Lean: per-IP + global caps on web search.

## Email + database (wired June 2026)

- **Resend**: domain colombiancentral.com is verified (DKIM/SPF/MX/DMARC live in Vercel DNS, us-east-1). Senders: `boletin@` for El Boletín, `hola@` for transactional. The app key is full-access (named "colombian-central-app"); newsletter signups sync to Resend contacts and the "El Boletin" segment (`RESEND_SEGMENT_ID`) for dashboard broadcasts.
- **Neon Postgres**: tables `subscribers`, `orders`, `trip_inquiries`, `request_log`, `paisa_posts` (legacy), `paisa_stories` (El Paisa news engine), `match_results` (auto-updated scores) (schema in `scripts/db-setup.mjs`, idempotent, run with `node --env-file=.env.local scripts/db-setup.mjs`). The DB is the source of truth; Resend contact sync is best-effort.
- **API routes**: `/api/newsletter` (signup + welcome email, idempotency key `welcome-email/<email>`), `/api/unsubscribe` (HMAC-signed links, flips both DB and Resend), `/api/order`, `/api/inquiry` (both store + send two emails with idempotency keys), `/api/checkout` (Stripe Checkout Session or email fallback), `/api/stripe/webhook` (verifies signature, marks paid; `runtime = "nodejs"`, raw body), `/api/cron/abandoned` (hourly cart-recovery emails), `/api/paisa/refresh` (6am ET daily news), `/api/cron/scores` (post-match score updates, two-source agreement), `/api/inbound` (Resend Inbound webhook forwarding mail to the business inbox). All crons are `CRON_SECRET`-guarded and fail closed without it.
- **Stripe** (live): dedicated Colombian Central account, hosted Checkout, idempotent on `stripe_session_id`, charges labeled via `payment_intent_data.description`, card statement reads `COLOMBIANCENTRAL.COM`. Orders gained `payment_status`, `stripe_session_id`, `amount_total_cents`, `paid_at`, `phone`, `marketing_opt_in`, `reminder_stage`, `reminder_last_at`.
- **Emails** are hand-built table-layout HTML in `src/lib/emails.ts` (inline styles, text alternatives, tricolor shell). The Resend SDK returns `{data, error}`, never throws: check `error`.
- Env vars (see `.env.example`): set in Vercel for production + development; preview lacks the four Resend/app vars (CLI bug, add via dashboard when needed).
- **Abuse / spam / security**: per-IP rate limiting (`src/lib/rate-limit.ts`, DB-backed, fails open) + a global cap (`globalRateLimit`) on paid web search; a honeypot (`Honeypot.tsx`, field `website`); and spam heuristics (`src/lib/antispam.ts`: disposable-email + link + solicitor-keyword) that silently log/drop spam on the inquiry, newsletter, and inbound-mail paths. Security headers (CSP/HSTS/X-Frame-Options/etc.) live in `next.config.ts` (prod-gated). `ImageProtect.tsx` + globals.css block right-click/drag/select on images. JSON-LD is escaped (`JsonLd.tsx`). Swap the limiter for Upstash/KV at scale.
- **SEO/AEO/GEO**: `app/robots.ts`, `app/sitemap.ts`, `public/llms.txt`, and structured data via `src/lib/jsonld.ts` + `JsonLd.tsx` (Organization, WebSite, Product, Article, SportsEvent, NewsArticle). Site-wide canonical + per-product OG in metadata.
- **Inbound email**: mail to any `*@colombiancentral.com` forwards to the business inbox via Resend Inbound (root MX + `/api/inbound` + `RESEND_WEBHOOK_SECRET`), spam-filtered.

## Facts that must stay correct

- World Cup data in `src/data/futbol.ts` is real (Group K: Portugal, Uzbekistan, DR Congo; fixtures Jun 17/23/27, 2026). Verify against current sources before editing.
- The squad in `src/data/futbol.ts` is the official 26 from FIFA, each with a real cutout in `public/images/players`. If the roster changes, match it to the official FIFA squad exactly: add or remove players so the data and the photo set agree.
- The site is independent fan media: keep the "not affiliated with FIFA or the FCF" footer note, and keep the jersey described as unofficial fanwear. NEVER sell official/licensed jerseys or FIFA/adidas-marked goods (counterfeit seizures + frozen payment gateways).
- Fútbol results auto-update via `/api/cron/scores` (two-source agreement) into `match_results`; don't hand-edit Colombia's scores. The Group K standings table is computed from Colombia's live results plus `otherGroupMatches` in `src/data/futbol.ts` (the three non-Colombia matches, maintained by hand: verify against a real source before editing). The coffee product is now a Juan Valdez resale (not our own single-origin), keep its copy honest.
- Each section (fútbol, música, comida, viajes) renders its own news via `articlesForSection()` from `src/data/articles.ts` (articles carry a `section`); `/noticias` aggregates all of it plus El Paisa's AI desk. Destinations are full landing pages at `/viajes/[slug]` driven by `src/data/destinations.ts`. Body/paragraph copy uses Fraunces (`font-reading`); keep UI chrome (labels, buttons, prices) in Archivo.
- Artesanía copy makes sourcing claims (artisan-direct, artisan-set prices). Do not extend those claims to new products without Cesar's confirmation.
- Concerts in `src/data/musica.ts` and restaurants in `src/data/comida.ts` are researched, not invented. Keep the status badges honest and verify dates/hours before adding new entries.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (must pass before pushing)
