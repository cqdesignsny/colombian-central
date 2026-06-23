# Design

The visual system is **"el kiosco editorial"**: a paper-and-ink Colombian periódico, flag colors as accents, square corners, hard ink shadows. Source of truth for the tokens is `src/app/globals.css` (Tailwind v4 `@theme`, no config file). This file documents the committed system so variants stay on-brand. When code and this file disagree, the code wins; update this file to match.

## Theme & mood

Warm, printed, proud. The feel is a well-set cultural newspaper or neighborhood kiosk, not a web app. Light by default (paper background) site-wide. The one deliberate exception is the **fútbol page, which is dark** (ink background) for stadium-at-night drama. Physical scene: a Colombian-American flipping through a beautifully printed paper on their phone between other things, with a jolt of flag color on match day.

Color strategy: **Committed.** The paper/ink base carries the editorial calm; the tricolor (amarillo, azul, rojo) is the voice, used in real flag proportion, never as decoration for its own sake.

## Color palette

Tokens (hex as defined; the build is migrating toward OKLCH but these committed brand values are identity and must be preserved):

| Token | Hex | Role |
|---|---|---|
| `paper` | `#F7F1E3` | Primary background, the "newsprint" |
| `crema` | `#EFE5CD` | Secondary surface / tinted panels |
| `ink` | `#17130E` | Primary text; background of the fútbol page |
| `ink-soft` | `#4A4034` | Secondary text (a dark warm brown, not a light gray, so it holds AA on paper) |
| `amarillo` | `#FFCD00` | Flag yellow, primary accent / CTAs |
| `azul` | `#003087` | Flag blue, secondary accent |
| `rojo` | `#C8102E` | Flag red, alerts / emphasis |
| `linea` | `#DED2B6` | Hairline dividers / borders |

Rules:
- **Tricolor proportion is always 2:1:1** (yellow 2 parts, blue 1, red 1). See `TricolorBar`.
- On the dark fútbol page, text is `paper` on `ink`. Watch low-opacity text (`text-paper/50`, `/60`) for AA on fine print; prefer `/70`+ for anything readable.
- Never gray text on a colored background. Use a darker shade of that hue or a transparency of the text color.
- `ink-soft` is the muted text color and is intentionally dark enough for AA body text on `paper`/`crema`.

## Typography

Four committed families (loaded via `next/font`):

- **Anton** (`--font-display`): display and headlines. Uppercase, tight leading via `.display-tight` (letter-spacing -0.01em, line-height 0.92).
- **Archivo** (`--font-sans`): all UI chrome, labels, buttons, prices, nav. The workhorse.
- **Fraunces** (`--font-reading`, `.font-reading` class): long-form reading and paragraph copy. Warm literary serif, letter-spacing 0.005em, optical sizing on.
- **Instrument Serif** (`--font-serif`): italic accent / flavor lines only.

Reading sizes are bumped ~20% over Tailwind defaults for legibility (see the `--text-*` overrides in `globals.css`); tiny labels (`text-xs`, explicit px) stay put.

> **Identity-preservation note for impeccable:** Fraunces and Instrument Serif appear on the skill's reflex-reject font list, but they are deliberate, shipped brand identity here. Per the brand register's identity-preservation rule, do **not** swap them. Anton + Archivo + Fraunces + Instrument Serif is the committed type system.

## Spacing & layout

- Square corners everywhere. No rounded cards. (This is a brand rule; do not "soften" it.)
- Editorial rhythm: generous section separation, tight groupings within a unit. Vary spacing for rhythm rather than one uniform gap.
- Responsive grids favor `repeat(auto-fit, minmax(...))` where cards are the right affordance.
- Mobile-first; the audience is mostly on phones.

## Shape & elevation

- **Hard ink shadow** is the signature elevation: on hover, interactive cards translate up and cast a solid (not blurred) ink shadow. This replaces soft drop shadows. Keep it crisp and square.
- Borders are full and intentional (`border-2 border-ink` on hero cards, `border-linea` hairlines for dividers). **No side-stripe accent borders** (`border-l-4` etc.), which read as an AI tell.

## Motion

- `motion/react` (Motion) for component animation; CSS keyframes for the marquee `Ticker` and slow-spin `Stamp`.
- `prefers-reduced-motion: reduce` disables the marquee and spin (in `globals.css`); any new animation must ship a reduced-motion alternative.
- Ease out, no bounce/elastic. Motion is intentional, not a uniform fade on every section.

## Imagery

- Real, freely-licensed photos first (Wikimedia Commons CC, Unsplash, Pexels), each carrying an `imageCredit` line. Generate with Higgsfield only when no free real photo exists.
- **Never** lift photos from news sites, press releases, Getty, or FIFA (copyright + frozen-payment-gateway risk, same family as the licensed-jersey rule).
- No repeated photo within a feed: `assignDistinctImages()` in `src/lib/paisa-stories.ts` enforces this; per-slug real photos can be pinned in `src/data/story-images.ts`.
- Site-wide image-protection deterrent (no right-click/drag/select) via `ImageProtect.tsx` + `globals.css`. It is a deterrent, not DRM, and must not block a11y.

## Voice & copy

- Spanish for warmth, English for information. No em-dashes. No decorative emojis. Checkmarks/arrows only when structural.
- Honest claims only: no fabricated sourcing, dates, or sources. Articles cite 2+ real "Fuentes."
- Keep the "independent fan media, not affiliated with FIFA/FCF" line; fan gear is unofficial fanwear; never sell licensed goods.

## Accessibility

WCAG 2.1 AA. Visible focus states, accessible names on icon-only controls, semantic landmarks and heading order, labeled form inputs, reduced-motion honored. `lang="es"`. See PRODUCT.md for the full commitment.

## Per-surface notes

- **Home, tienda, música, comida, viajes, noticias, money pages:** paper theme, editorial layout.
- **Fútbol (`/futbol`, `/futbol/hinchada`):** dark ink theme. Components rendered here need explicit `text-ink`/`text-paper` handling so titles don't inherit the wrong color (a past bug).
- **El Paisa chat:** site-wide floating button + panel, Spanglish, renders Markdown links + bold, no emojis.
