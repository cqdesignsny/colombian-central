# Colombian Central

Todo lo nuestro, en un solo lugar. The hub for everything Colombian: news, La Tricolor at the 2026 World Cup, products from back home, and trips to the motherland.

Built with Next.js 16, Tailwind CSS v4, and Motion. Images generated with Higgsfield.

## Sections

- **Fútbol** (`/futbol`): Colombia at the 2026 World Cup. Group K fixtures (Portugal, Uzbekistan, DR Congo), live countdown to the debut, squad, and watch party newsletter.
- **Tienda** (`/tienda`): Colombian products with a client-side cart. Checkout is order-by-email while payments are in beta.
- **Viajes** (`/viajes`): destination guides, sample trip packages (including World Cup travel), and a trip inquiry form.
- **Noticias** (`/noticias`): editorial articles on fútbol, café, music, food, and travel.
- **Nosotros** (`/nosotros`): the story, plus the Central network vision.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Content

All content lives in typed data files under `src/data/`: `products.ts`, `articles.ts`, `destinations.ts`, `futbol.ts`. Country-level config (brand, colors, nav, contact email) lives in `src/config/site.ts`. Swapping those files is the path to spinning up the next country in the Central network.

## Roadmap

- Stripe checkout for the tienda
- Resend wiring for El Boletín (newsletter) and order confirmations
- CMS or markdown pipeline for articles
- Spanish/English toggle (i18n)
- Live World Cup match data
- Community features for the diaspora

Hecho con orgullo. Independent fan media, not affiliated with FIFA or the FCF.
