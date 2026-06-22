# Colombian Central, session handoff

Last updated June 22, 2026. This is the pick-up-here doc. Read this first, then AGENTS.md for code conventions, MONETIZATION.md + SOURCING.md for the revenue and supplier plan, and COMPETITIVE-RESEARCH.md for the market scan.

## What it is

ColombianCentral.com, the hub for everything Colombian: World Cup fútbol, música, comida, a shop for Colombian products and merch, a travel desk, news, and culture. Aimed at the Colombian diaspora in the US. First site in a planned multi-country "Central" network, so country-specific values live in config/data files, never hardcoded. The network plan is kept private (off the public site).

## Live now

- Production: https://colombiancentral.com (apex + www live). Pushes to `main` auto-deploy.
- Repo: https://github.com/cqdesignsny/colombian-central
- Pages: home, `/futbol` (+ `/futbol/hinchada`), `/musica`, `/comida`, `/tienda` (+ product pages), `/viajes` (+ per-destination guide pages `/viajes/[slug]` + `/viajes/mundial`), `/enviar-dinero`, `/noticias` (aggregates every section's news + El Paisa's AI stories + articles, story pages `/noticias/[slug]`), `/nosotros`, `/privacidad`, `/terminos`, `/envios-devoluciones`, `/gracias`, 404. Nav now leads with Noticias.

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind v4 (tokens in `src/app/globals.css`, no config). Motion for animation. Fonts: **Anton** (display/headlines), **Archivo** (UI/sans), **Fraunces** (editorial reading serif for prose, the `font-reading` class), **Instrument Serif** (italic accents). Imagery generated/composited with Higgsfield in `public/images`; squad cutouts in `public/images/players`.

## Infrastructure

- **Hosting**: Vercel, team `cq-marketings-projects`, project `colombian-central`. The Vercel CLI default scope is now permanently set to this team (EasyOEEpro / TZ Electric are other clients, never deploy there). Crons in `vercel.json`.
- **AI**: Vercel AI Gateway, now on the **PAID tier** (key rotated June 18). El Paisa runs on **`anthropic/claude-sonnet-4.6`** with **live web search** (Perplexity `sonar` / `sonar-pro`). Budget target is **Lean (~$15-25/mo)**: per-IP (12/day) + global (250/day) caps on paid search. **Cesar TODO: set a hard monthly spend cap in the AI Gateway dashboard.** `vercel env add` needs the value piped with a trailing newline.
- **Database**: Neon Postgres (Vercel integration). Tables: `subscribers`, `orders`, `trip_inquiries`, `request_log`, `paisa_posts` (legacy, superseded), `paisa_stories` (news engine), `match_results` (auto scores). Schema idempotent in `scripts/db-setup.mjs` (`node --env-file=.env.local scripts/db-setup.mjs`).
- **Payments**: Stripe, **live**, dedicated account `acct_1Tj3kbQny3EkJJVW`. Hosted Checkout, `COLOMBIANCENTRAL.COM` descriptor. Now also supports **subscription mode** (the monthly box). See Payments below.
- **Email**: Resend on colombiancentral.com (DKIM/SPF/MX/DMARC in Vercel DNS, us-east-1, via the `send` subdomain). Senders `boletin@` + `hola@`; owner notifications to cesar@creativequalitymarketing.com; segment "El Boletin" (`25e0cc2a-99e2-450a-b492-8b27ac7f5a53`). **Inbound forwarding** is wired: root MX `inbound-smtp.us-east-1.amazonaws.com` + `/api/inbound` webhook forwards any mail to `*@colombiancentral.com` to the business inbox (reply-to = original sender), spam-filtered. **Pending: Cesar's real-world test email.**
- **Secrets**: `.env.local` (gitignored) + Vercel envs. `AI_GATEWAY_API_KEY` (paid), `RESEND_WEBHOOK_SECRET`. Optional: `UPSTASH_REDIS_REST_URL` / `_TOKEN` (rate limiting at scale).
- **Rate limiting / analytics**: `src/lib/rate-limit.ts` uses **Upstash Redis** when the `UPSTASH_*` vars are set, else falls back to Neon (always fails open). **Cesar TODO: add Upstash via the Vercel Marketplace** (auto-injects both vars). **Vercel Web Analytics** is wired (`@vercel/analytics` in `layout.tsx`); **Cesar TODO: enable Web Analytics in the dashboard** to see per-page traffic.

## Crons (`vercel.json`)

- `/api/cron/abandoned` — hourly, up to 3 abandoned-cart emails (email only, no AI; re-checks payment before each send).
- `/api/paisa/refresh` — **06:00 ET daily**: El Paisa web-searches and writes up to 5 section-tagged stories (fútbol, música, comida, viajes + general/política), each with 2+ sources, feeding every section page and `/noticias`. The only scheduled AI news run.
- `/api/cron/scores` — every 3h, but only spends AI in the window after a Colombia match ends (~2h15m post-kickoff to ~26h), and only until two sources confirm. Zero AI otherwise.

All crons are `CRON_SECRET`-guarded and **fail closed** if the secret is missing.

## El Paisa (the AI mascot) — fully awake

Persona, sayings, `SITE_KNOWLEDGE`, and `PAISA_MODEL` live once in `src/lib/paisa.ts`. `src/lib/websearch.ts` (`paisaWebSearch`) routes live web search through Perplexity.

- **Chat** (`/api/paisa/chat` + `ElPaisaChat.tsx`): streaming Spanglish, site-wide, on Sonnet 4.6. Has a **cost-capped `web_search` tool** for live scores/news. Renders real clickable Markdown links + bold, **no emojis**. Per-IP rate limited; fails soft. Opens via the `paisa:open` window event.
- **News engine** (`/api/paisa/refresh` → `paisa_stories` → `NewsFeed.tsx` on `/noticias` + story pages `/noticias/[slug]`, ISR): daily 6am, web-searches across topics (fútbol, política handled NEUTRALLY, economy, culture, música, comida, viajes) and writes up to 5 factual **section-tagged** stories, each with **2+ sources**, a `NewsArticle` JSON-LD, and an El Paisa byline. `sectionForCategory` routes each story to its section and `getSectionNews()` (`src/lib/section-news.ts`) merges the live DB feed with the evergreen `articles.ts` seeds onto every section page. This is the content-scale answer: the articles write themselves. Helpers in `src/lib/paisa-stories.ts`. The old short-post desk (`paisa_posts` + `PaisaDesk.tsx`) is SUPERSEDED.
- **Auto-updating scores** (`/api/cron/scores` + `src/lib/match-results.ts` + `match_results` table): after a Colombia match ends, two web sources (sonar + sonar-pro) must AGREE before a score is written; `/futbol` + homepage overlay DB results onto the static fixtures. Self-updating, no hand-editing, holds the last value on disagreement.
- **Art**: `public/brand/El-Paisa.png` (full figure) now appears site-wide (footer on every page, news desk header, story bylines) plus the head-crop chat avatar. Do not regenerate.

## Payments (Stripe, live)

- `/api/checkout` builds a hosted Checkout Session, gated by `NEXT_PUBLIC_STRIPE_ENABLED`. Mixed subscription + one-time carts are rejected up front. `/api/stripe/webhook` verifies + marks paid (idempotent on `stripe_session_id`).
- **Subscription mode**: products with `recurring: "month"` (La Caja Mecato) check out as a Stripe subscription. NOTE: recurring renewals (`invoice.paid`) are not yet handled, only the first charge. Build that before pushing the box hard.
- **Cesar TODO**: accept Stripe ToS (re-enable consent/promos), confirm branding + wallets.

## Commerce / tienda

`src/data/products.ts`. Pricing this session: **Sombrero Vueltiao $139**, **Juan Valdez coffee $39** (rewritten honestly as a Juan Valdez resale, not the old single-origin Huila claim), and a new **La Caja Mecato** monthly subscription mystery snack box ($45/mo). Product images composited via Higgsfield. **Product pages have a quantity stepper** (`AddToCartButton`; the cart's `add(product, qty)` supports it), excluded for the subscription box. See **SOURCING.md** for the verified supplier plan (Cordialsa, Roastify private-label, Faire net-60, fan-gear licensing warning: never sell official jerseys).

## Legal / trust / SEO

- **Legal pages**: `/privacidad`, `/terminos`, `/envios-devoluciones` (linked in footer + sitemap). **Cesar: review the 30-day return window and the New York governing-law line.**
- Site-wide affiliate + FTC disclosure (incl. the Amazon Associates wording) in the footer; newsletter consent microcopy.
- **SEO/AEO/GEO**: `app/robots.ts`, `app/sitemap.ts`, `public/llms.txt`, JSON-LD via `src/lib/jsonld.ts` + `JsonLd.tsx` (Organization, WebSite, Product, Article, SportsEvent, NewsArticle), site-wide canonical, per-product OG images, dedicated 1200x630 `og.jpg`.

## Security / abuse

- **Headers** in `next.config.ts` (prod-gated): CSP, HSTS, `X-Frame-Options: DENY`, nosniff, Referrer-Policy, Permissions-Policy.
- **Spam protection** (`src/lib/antispam.ts`): disposable-email + link + solicitor-keyword heuristics. Inquiry spam is logged (`status='spam'`) but never emailed; disposable newsletter signups are dropped; inbound spam is not forwarded. Stacks on the honeypot + per-IP rate limiting + global caps. JSON-LD output is escaped; AI-generated source URLs are https-only.
- **Image protection** (`ImageProtect.tsx` + `globals.css`): blocks right-click, drag, and selection on all images (the squad cutouts especially). A deterrent, not DRM.
- **Codex** is used as a read-only review gate on substantial build-outs.

## What was done this session (June 22, 2026)

A polish + correctness pass on Noticias and the orphan sections (build green, browser-verified):

1. **Never the same photo twice.** The auto-stories used a single category fallback image, so two fútbol stories (and política vs economía) showed the identical photo. New system in `src/lib/paisa-stories.ts`: per-category image **pools** + `assignDistinctImages()`, a no-repeat picker that walks a feed and guarantees every card a distinct photo (pinned real photos win, auto-stories draw the next free pool image by slug hash). Applied in `getSectionNews` (section strips) and across the whole `/noticias` page (desk + evergreen deduped together via a `reserved` set). Padded the thin fútbol pool with two new fan-scene images so the 5 fútbol items on `/noticias` are all unique.
2. **Loop-Cesar-in image hook.** `src/data/story-images.ts` is a slug→photo override map. When the right photo for a piece exists, drop the file in `/public/images` and add one line; it wins over the auto picker and never gets swapped. This is the workflow for Cesar to hand over the correct/accurate photo per article.
3. **Fútbol card titles were invisible.** `ArticleCard`/`NewsFeed` titles inherited `text-paper` on the dark fútbol page, so you only saw them on hover. Added explicit `text-ink`.
4. **`/noticias` white space.** The desk's lead + two-stacked-side layout left a tall gap when the side stack outran the lead. Rebuilt as lead + one side card that stretches to the lead's height (verified equal), the rest in a uniform grid. `NewsFeed` is now presentational (takes `stories`); the page fetches + dedupes.
5. **60-day window + Hemeroteca.** Front-facing feeds show the last two months (`src/lib/recency.ts`, `RECENT_DAYS = 60`), with a never-empty backfill. Everything older lives in the full archive at **`/noticias/archivo`** (a month-grouped headline index of every story + crónica), linked from the footer (Explorar → Hemeroteca) and the bottom of `/noticias`.
6. **Viajes news moved up top**, right under the World Cup banner (was buried below destinations).
7. **Orphan rows filled.** Música artists 16 → 18 (Diomedes Díaz, Morat); tienda 9 → 12 products (Bandera de Colombia, Camiseta "Tan Colombiano", Café Sello Rojo). The three new products use the built-in branded **placeholder cards** (honest copy, no fabricated sourcing claims); they need real photos (Cesar to supply, or generate).
8. **Image drops done.** `Coffee.png`/`Sombrero.webp` were already converted + wired (`cafe-juan-valdez.jpg`, `sombrero.jpg`); the raw originals in `public/images/products/` are redundant leftovers, ignore them.

Affiliate links stay gated/unearning on purpose: Cesar is still creating the programs. The fallback `publicUrl`s work now; he pastes tracking IDs into `src/config/partners.ts` later.

## What was done June 19, 2026

A full "Laura pass" of fixes and build-outs (build green, browser-verified desktop + mobile):

1. **Per-section news.** Every section has its own curated, clickable article strip: fútbol (Noticias de la Tricolor), música, comida (real food news now, not the recipes), viajes. `/noticias` is the aggregator (El Paisa's AI desk + every section's articles). Articles gained a `section` field + `articlesForSection()` in `src/data/articles.ts`; 7 new articles written. Nav leads with Noticias.
2. **Clickability sweep.** Every hover/card lands somewhere real. Concerts link to Ticketmaster ("Buscar entradas") via a gated `ticketmaster` slot in `partners.ts` + `ticketmasterSearch()` (flip on when the affiliate is approved). Subscribe button is now solid amarillo (was ink-on-ink, invisible on dark panels).
3. **Group K standings.** Real, web-verified table under the group cards on `/futbol` (`StandingsTable.tsx` + `computeStandings()`/`getGroupStandings()`). Colombia's results auto-update from the cron; the three non-Colombia matches are hand-maintained in `otherGroupMatches` (`src/data/futbol.ts`). Matchday 1 seeded: Portugal 1-1 DR Congo, COL 3-1 UZB.
4. **Viajes landing pages.** Every destination is a real page (`/viajes/[slug]`) with best time, the basics, a cost estimate, and a quote form pre-tagged with the destination (lead lands in the business inbox). Added **Cali, Bogotá, Nuquí** (nine total), bolder card edges, and a travel news strip. Content lives in `src/data/destinations.ts` (expanded type).
5. **Noticias redesign.** Big El Paisa beside "Lo último de Colombia" (big on mobile too); "Noticias al día" pulled flush and enlarged.
6. **Font consistency.** Fraunces (`font-reading`) now on all paragraph/reading copy site-wide; Archivo stays for UI chrome (labels, buttons, prices).
7. **Honest store copy.** "Lo auténtico se nota" rewritten around hand-curation; dropped the false single-origin/finca coffee claims (coffee is a Juan Valdez resale).
8. **Recipe accordion** opens independently (was a grid-stretch artifact; fixed with `items-start`).
9. **9 new images** generated (Higgsfield `nano_banana_pro`), compressed to ~200-480KB, in `public/images/news/` + `public/images/destinations/`. No repeated article images. Workflow saved to memory.

10. **Rate limiting moved to Upstash Redis** (`src/lib/rate-limit.ts`) with a Neon fallback, so the per-request Postgres writes that would buckle under a World Cup traffic spike disappear once Upstash is on. Cesar TODO: add the Upstash database via the Vercel Marketplace (it injects `UPSTASH_REDIS_REST_URL`/`_TOKEN`); until then it falls back to the DB limiter. (Vercel KV is retired, Upstash is the path.)
11. **Automated content at scale.** El Paisa's daily engine (`/api/paisa/refresh`) now writes section-tagged stories spanning fútbol, música, comida and viajes (not just general news), and the section pages render that live DB feed merged with the evergreen seeds via `getSectionNews()` (`src/lib/section-news.ts`). Articles write themselves; the hand-written `src/data/articles.ts` is now the fallback/seed. Cron unchanged (6am ET daily), still ~2 AI calls per run (broader prompt, up to 5 stories). Section is derived from the story `category`, no DB migration needed.

12. **Product quantity selector.** Product pages have a -/+ stepper; `add(product, qty)` in the cart honors it. The subscription box is excluded (bought once). Verified: set 3 → cart receives 3.
13. **Clickable artist cards.** Música artist cards lifted on hover but linked nowhere; they now open a YouTube search for the artist.
14. **Page analytics.** `@vercel/analytics` in `layout.tsx` for per-page traffic (the trip pages especially). Cesar TODO: enable Web Analytics in the Vercel dashboard.
15. **Article sources.** Every article carries a required `sources` field (2-3 verified links: Wikipedia, ESPN, FIFA, Billboard, MICHELIN, UNESCO, official tourism, news), rendered as "Fuentes." The auto engine now requires 2+ sources per story.
16. **Real licensed photos.** Article + destination images are now real Creative Commons photos from Wikimedia Commons (license-verified), each credited via `imageCredit` ("Foto: author, license, Wikimedia Commons"); `imagePosition` handles portrait crops. Only El Cielo's dish stays AI. **Policy: NEVER lift news/press/Getty/FIFA photos** (copyright + frozen-payment risk); use Wikimedia Commons / Unsplash / Pexels, or generate.

## What was done June 18, 2026

1. Wired the live Jun 17 result (COL 3-1 UZB) and made `/futbol` + homepage track the next unplayed match (countdown, ticker, copy).
2. Turned El Paisa **fully awake**: paid Gateway, Sonnet 4.6, live web search in chat (cost-capped tool) and the desk.
3. Rebuilt the desk into a **news engine**: daily 6am, 1-3 web-sourced stories, story pages, `paisa_stories` table.
4. Built **auto-updating scores** (`/api/cron/scores`, two-source agreement, post-match window only).
5. Security pass (Codex-reviewed): JSON-LD XSS escaping, https-only source links, fail-closed cron auth, abandoned-cart race fix, checkout orphan-order fix, cart hardening, security headers.
6. SEO/AEO/GEO foundation (robots, sitemap, llms.txt, structured data, canonicals, OG).
7. Editorial font upgrade (Fraunces for prose) + UI fixes (scroll-to-top, bold card borders, contained news grid, one-at-a-time FAQ, removed AI disclaimer on stories).
8. Copy fixes (stamp "CON MUCHO ORGULLO", "Hecho con orgullo por colombianos", `lang="es"`, "Añadir al carrito").
9. Commerce: pricing ($139 / $39), the **La Caja Mecato** subscription box + Stripe subscription mode, composited product images.
10. **Legal/trust pages** + footer disclosure + image compression (hero 1.6MB → 487KB, etc.).
11. **Email forwarding** info@ → cesar@ via Resend Inbound.
12. **Spam protection** + **image protection** across the site.
13. Bought 5 network domains + set the Vercel CLI default scope to CQ Marketing.
14. Wrote **SOURCING.md** (verified suppliers, private-label coffee, Amazon mechanics, snack-box plan, fan-gear legal warning); vetted Zernio.

## Domain network

Strategy: nail Colombian Central first, prove the unit economics, then expand deliberately. Do NOT broadcast the network publicly (removed from the site) or spin up thin auto-generated country sites (Google penalizes scaled content). IrishCentral.com is the proof the model works.
- **Owned (CQ Marketing Vercel team)**: colombiancentral.com (flagship), colombiacentral.com (308 → flagship), argentiniancentral, ecuadoriancentral, peruviancentral, puertoricancentral.
- **Watch-list (available)**: salvadorancentral, guatemalancentral, hondurancentral, venezuelancentral, + others. **Taken**: mexican, brazilian, dominican, cuban, usa.

## Marketing

- **Zernio** (zernio.com): legit, API-first social poster; the intended future layer to auto-post El Paisa's daily stories. Vet on its free tier first.
- Metricool / ManyChat are still Cesar's signups. Workflow: Claude drafts + schedules, Cesar approves.

## Cesar's TODOs (cannot be automated)

1. Set a hard monthly **spend cap in the AI Gateway dashboard**.
2. Send a **test email to info@colombiancentral.com** (plain wording) to confirm forwarding lands at the business inbox.
3. **Review the legal pages** (return window, governing law).
4. **Supplier signups** from SOURCING.md (Faire, Cordialsa, JETa, Roastify, Flags Importer, Amazon Associates) and paste affiliate IDs into `src/config/partners.ts`.
5. **Rotate secrets** pasted in chat: Stripe `sk_live`, the `vck_` Gateway key, `RESEND_WEBHOOK_SECRET`.
6. Stripe: accept ToS, branding, wallets.
7. **Provision Upstash** (Vercel Marketplace) so rate limiting leaves Postgres before the traffic spike.
8. **Enable Vercel Web Analytics** in the dashboard to see page traffic.

## Build backlog (next sessions)

- Subscription **renewal handling** (`invoice.paid`) for La Caja Mecato.
- A **review-queue/admin** to approve/hide El Paisa news stories (now that they auto-publish to every section).
- **Real photos for the daily auto-stories.** They now draw from per-category pools with a no-repeat picker (no more duplicate photos), but the pools are still generic stock/scenes. The path to accurate, specific photos is `src/data/story-images.ts` (pin a real photo per slug) fed by a Cesar-supplies-the-photo workflow (Slack channel idea), and growing the thin pools (fútbol, the city bucket) with more real licensed images.
- **Zernio auto-posting** of El Paisa stories.
- World Cup membership + free **Polla** predictions game (Stripe is live).
- Printful merch integration; more recipes; expand the restaurant finder.

## Known gaps / caveats

- **Email forwarding is unverified** until Cesar's test email.
- **Auto-scores need two-source agreement**; an odd/disputed result may not auto-confirm (the page holds the last known value; a manual cron trigger with `CRON_SECRET` can force a re-check).
- **Image protection is a deterrent**, not DRM (screenshots/devtools always work).
- Newsletter is single opt-in. Rate limiter uses Upstash when configured, else Neon (provision Upstash for scale).
- Section news is auto-fed by El Paisa's engine (DB) merged with the hand-written `articles.ts` seeds. Front-facing feeds show the last 60 days; older content lives in the Hemeroteca (`/noticias/archivo`). The no-repeat image picker guarantees no duplicate photo within a feed, but the auto-story pools are still generic; real Wikimedia photos are on the hand-written articles + destinations, and per-slug real photos can be pinned in `src/data/story-images.ts`.
- World Cup data must stay real (Group K, the official 26-man squad). Keep the "independent fan media, not affiliated with FIFA/FCF" line and the unofficial-fanwear framing; never sell official/licensed jerseys.

## Run it locally

```bash
npm install
cp .env.example .env.local   # fill from Vercel envs
node --env-file=.env.local scripts/db-setup.mjs
npm run dev
```

`npm run build` must pass before pushing. Pushing to `main` deploys to production. Verify on the live site, not a local dev server.
