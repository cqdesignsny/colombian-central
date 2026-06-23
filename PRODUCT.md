# Product

## Register

brand

## Users

The US Colombian diaspora: Colombian-Americans (US-born or US-raised), the largest South American group in the US (~1.8M), concentrated in Miami, Queens/Jackson Heights, and the New Jersey "Colombian Corridor." Second-generation identity, bilingual, proud of the culture and hungry for a place that reflects it. Adjacent: Colombians who send money home monthly, plan trips back, and follow La Tricolor.

Context of use: mostly mobile, casual browsing between other things, with sharp spikes on World Cup match days. They arrive from social (Instagram first), search, and word of mouth. The job to be done shifts by visit: catch up on Colombia news, follow the World Cup, buy something authentic (coffee, a sombrero vueltiao, a snack box), plan a trip, send money home, or just feel a little closer to home.

This is the "Colombian-American" audience, not the "expat living in Colombia" audience that existing English outlets (ColombiaOne, City Paper Bogotá) serve.

## Product Purpose

Colombian Central is the all-in-one diaspora hub: news, La Tricolor at the 2026 World Cup, a tienda for authentic Colombian products and merch, a travel desk, money-transfer guidance, música, and comida, under one roof. No competitor runs this model. Editorial players have content but no commerce or travel; commerce players have product but no audience engine. The content to tienda to travel to affiliate journey is the wedge, and the 2026 World Cup is the once-a-decade acquisition window.

It is the first site in a planned multi-country "Central" network (Mexican Central, Argentinian Central, etc.), so country-specific values live in config and data files, never hardcoded. The network plan is private and stays off the public site.

Monetized through (1) owned-margin commerce, (2) affiliate and referral revenue on high-intent diaspora behaviors (remittances, tours, fan gear, concert tickets), and (3) membership and sponsorship as the audience grows. Success is the hub the diaspora returns to, that converts those high-intent moments without ever feeling like a generic content farm.

## Brand Personality

Warm, proud, and editorial. The voice code-switches on purpose: Spanish for warmth and belonging, English for information. It feels like a well-made cultural periódico or neighborhood kiosk run by people who are genuinely Colombian, not a templated blog. Confident and celebratory without being corny or leaning on "Latin fiesta" cliché.

Three words: **orgulloso, editorial, vibrant.**

El Paisa, the AI mascot, carries the voice in chat and the news byline: warm Spanglish, helpful, never spammy, no emojis.

## Anti-references

The site and brand must be the antithesis of the templated, single-threaded outlets it competes with. Avoid:

- **Generic WordPress news themes** (ColombiaOne runs the stock tagDiv "Newspaper" theme). No template look. The kiosco editorial system is the moat.
- **SaaS landing-page clichés:** hero-metric layouts, identical-card feature grids, sparkline decoration, "boost your" copy.
- **AI tells:** dark mode with purple gradients, neon/glassmorphism, gradient text, side-stripe accent borders, an uppercase tracked eyebrow above every section, cream-and-slate timidity.
- **Stock "Latin fiesta" cliché imagery** and fabricated authenticity. Real licensed photos, honest sourcing claims, real cited sources.
- **Em-dashes and decorative emojis in copy.** Spanish phrases for warmth, English for information.
- **Anything that reads "which AI made this?"** The bar is distinctiveness.

## Design Principles

1. **Commerce-as-content is the moat.** Read about a region, buy its coffee or craft, book the trip. Cross-link the journey hard; never silo content from the tienda and travel desk.
2. **Bilingual warmth.** Spanish carries warmth and identity, English carries information. Visible in copy, captions, and the newsletter, not just decoration.
3. **Distinctive over template.** The kiosco editorial system (Anton display, tricolor flag accents in real 2:1:1 proportion, square corners, hard ink shadows) is cheap leverage and the thing competitors cannot copy. Protect it.
4. **Honest by default.** No fabricated sourcing or provenance, no invented sources or dates, real licensed photos with credit. Trust is the diaspora relationship.
5. **Independent fan media.** Not affiliated with FIFA or the FCF; keep that footer note, keep fan gear framed as unofficial fanwear, and never sell official or licensed goods.

## Accessibility & Inclusion

Baseline: WCAG 2.1 AA across all pages. Key commitments:

- Spanish is the primary language (`lang="es"`); copy stays readable and warm, not jargon-heavy.
- Color contrast verified against the real tokens, not eyeballed. The paper/ink palette is high-contrast by design; watch `ink-soft` and any `/opacity` text on tinted backgrounds.
- All interactive elements keyboard-navigable with visible focus states. Icon-only controls carry accessible labels.
- `prefers-reduced-motion` respected for every animation (the marquee ticker and slow-spin stamps already opt out).
- The site-wide image-protection deterrent (no right-click/drag/select) must never block keyboard use or screen readers.
- Mobile-first: layouts and touch targets hold up on phones, where most of the audience is.
