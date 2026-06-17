# Colombian Central

Todo lo nuestro, en un solo lugar. The hub for everything Colombian: news, La Tricolor at the 2026 World Cup, products from back home, and trips to the motherland.

Built with Next.js 16, Tailwind CSS v4, and Motion. Images generated with Higgsfield. Live at [colombiancentral.com](https://colombiancentral.com).

Picking up the project? Start with [HANDOFF.md](HANDOFF.md) (current state + next steps), then [AGENTS.md](AGENTS.md) (conventions) and [MONETIZATION.md](MONETIZATION.md) (revenue plan).

## Sections

- **Fútbol** (`/futbol`): Colombia at the 2026 World Cup. Group K fixtures (Portugal, Uzbekistan, DR Congo) with opponent flags, live countdown to the debut, the official 26-man squad, and a watch party newsletter. `/futbol/hinchada` is the fan-gear guide.
- **Música** (`/musica`): top Colombian artists, a guide to the genres (vallenato, cumbia, salsa, champeta, urbano, bambuco), and upcoming US concerts.
- **Comida** (`/comida`): real recipes you can cook, a Colombian restaurant finder by US metro (with a "find near you" map search), and a pantry cross-sell to the tienda.
- **Tienda** (`/tienda`): Colombian products with a client-side cart and real Stripe card checkout (gated by a flag, with an order-by-email fallback).
- **Viajes** (`/viajes`): destination guides, sample trip packages (including World Cup travel at `/viajes/mundial`), and a trip inquiry form.
- **Noticias** (`/noticias`): editorial articles on fútbol, café, music, food, and travel.
- **Nosotros** (`/nosotros`): the story, plus the Central network vision.

The remittance comparison (`/enviar-dinero`) and the fan-gear and matchday-travel guides are affiliate money-pages, gated behind `src/config/partners.ts` until tracking IDs are added.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in keys
node --env-file=.env.local scripts/db-setup.mjs
npm run dev
```

Open http://localhost:3000.

## Content

All content lives in typed data files under `src/data/`: `products.ts`, `articles.ts`, `destinations.ts`, `futbol.ts`, `musica.ts`, `comida.ts`. Country-level config (brand, colors, nav, contact email) lives in `src/config/site.ts`, and affiliate partners in `src/config/partners.ts`. Swapping those files is the path to spinning up the next country in the Central network.

## Email + data

Email runs through Resend on the verified colombiancentral.com domain: El Boletín signups (welcome email + contact sync to the El Boletin segment), order notifications and confirmations, trip inquiry notifications and confirmations, and signed unsubscribe links. Subscribers, orders, and inquiries persist in Neon Postgres (`scripts/db-setup.mjs` has the schema).

## Roadmap

Stripe card checkout, the affiliate money-pages, and the abandoned-cart automation are live (see [HANDOFF.md](HANDOFF.md)). Next:

- World Cup membership + free Polla predictions game (on Stripe)
- Printful merch and an authentic-goods supply chain (see [MONETIZATION.md](MONETIZATION.md))
- First El Boletín broadcast from the Resend dashboard
- Homepage cards for Música and Comida; a live music-news feed
- CMS or markdown pipeline for articles
- Spanish/English toggle (i18n)
- Live World Cup match data
- Community features for the diaspora

Hecho con orgullo. Independent fan media, not affiliated with FIFA or the FCF.
