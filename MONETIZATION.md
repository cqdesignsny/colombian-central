# Monetization plan

Researched June 10, 2026, the day before the World Cup. The tournament is a 5-week, non-repeating intent spike (June 11 to mid-July). The plays that capture it with near-zero setup are affiliate links and a time-boxed membership. Sponsorship, display, and lead-gen are the durable second wave we build while tournament traffic proves the audience to advertisers.

The model in one line: a diaspora hub monetized through (1) owned-margin commerce, (2) affiliate and referral revenue on high-intent things the audience already does, and (3) sponsorship and membership as the list and traffic grow.

**Update (June 18, 2026):** the verified supplier playbook is now in [SOURCING.md](SOURCING.md), real, named sources for coffee (Cordialsa), private-label coffee (Roastify), snacks (Colombina/JETa/Fedenico), crafts (Lombia+Co., One Thread Collective), the B2B cash cushion (Faire net-60), Amazon Associates mechanics (food only pays 1%, so it's the filler; use OneLink), POD merch (Printful), and the snack-box plan, plus the fan-gear licensing warning (never sell official jerseys). Pricing set this session: sombrero $139, Juan Valdez coffee $39, and a new "La Caja Mecato" monthly subscription box ($45/mo, Stripe subscription mode).

## Revenue streams, prioritized

### DO NOW (revenue this month, near-zero setup)

**Travel affiliates.** A Colombia travel desk during a World Cup is the textbook use case. Tours convert best for a destination site.
- Viator: 8% (scales to 12%), 30-day cookie. Join via Tripadvisor login.
- GetYourGuide: 8% via Travelpayouts, 31-day cookie.
- Travel insurance: SafetyWing Ambassador pays 10% recurring for 364 days. Genki 5% recurring. The recurring tail makes these better than one-off tour commissions.
- Action: Cesar opens Travelpayouts (covers GetYourGuide + insurance under one login/payout) and approves Viator. Claude builds the tour/insurance link components and a "visiting Colombia for the World Cup" guide.

**Remittance referral.** The most diaspora-native stream and the one competitors ignore. Colombians in the US send money home monthly, all year, not just for a trip.
- Wise: roughly $13 to $65 CPA per new user's first transfer, 365-day cookie (the longest in finance).
- Xe: $20 to $30 per completed registration, on Awin.
- Remitly: $5 to $20 per first transfer, heavily used on the US to Colombia corridor.
- The single highest-ROI page on the site: "Sending money to Colombia 2026: Wise vs Remitly vs Western Union." Evergreen, high-intent, each signup pays $13 to $65. Ten conversions a month from one page is $130 to $650.
- Action: Cesar applies to Awin (Xe), Wise Partnerships, Remitly. Claude builds the comparison page, gated behind a partners config so links go live the moment IDs exist.

**Amazon Associates.** For the long tail we do not stock. Sports/Outdoors is 6% (Colombia jerseys, flags, scarves during the Cup), Gourmet Food is 5% (Colombian coffee brands). Keep our own-margin shop products front and center; Amazon is the filler.
- Action: Cesar enrolls. Claude builds a "Colombia fan gear" guide that cross-sells our shop.

### BUILD NEXT (30 to 90 days)

**Own commerce (the core margin).** See the fulfillment stack below. This beats every affiliate rate because we keep the full margin.

**World Cup membership / pass.** The tournament is the once-a-decade reason to convert fans now. A $5/mo tier or a $19 tournament season pass bundling: a predictions game (Polla Mundialista), a member shop discount, ad-free reading, and an exclusive merch drop. We run it on Stripe and keep the full cut (no Patreon 10%). Needs Stripe connected.

**Direct brand sponsorship.** The best non-affiliate revenue, and the timing is ideal: US Hispanic buying power is projected at $2.8T in 2026 and Telemundo sold out its Spanish-language World Cup sponsorships. Warm targets: the money-transfer brands we already affiliate (Wise, Remitly), Avianca, Juan Valdez (has a partnership/wholesale program), Claro/Tigo. Needs a one-page media kit and an audience number to pitch.

**Newsletter sponsorship.** El Boletín on Resend. Sell slots manually or list on Paved once we clear roughly 2,000 engaged subscribers. Niche cultural newsletters command $35 to $50 CPM. Under ~2k subs the job is growth, not selling, so we push World Cup signups hard now.

**Diaspora lead-gen.** Immigration-attorney referrals ($35 to $120/form lead, $75 to $200/call). Colombia real estate for US expats (referral roughly 20 to 35% of the agent's commission, about $1,100 on a $150k Medellín apartment). Ticketed watch parties are the cash-now version and on-brand for the Cup.

### LATER (needs scale first)

**Display ads.** Skip AdSense (RPM too low, clutters the brand). Add Mediavine Journey at ~1,000 sessions/mo, graduate to Raptive/Mediavine Official at 25k pageviews ($25 to $50 RPM). Affiliate out-earns display per visitor at our stage, so this is a supplement, not a priority.

## Commerce fulfillment stack

A two-supplier split. No generic AI dropship tool (Zendrop, AutoDS, CJdropshipping) fits, because they are China/AliExpress-centric, mostly Shopify-locked, and carry zero authentic Colombian product. Authenticity is the moat, so authentic goods go direct to source.

**Custom merch → Printful.** Owns its print facilities (best quality), real US fulfillment, and a 2026 all-over-print recycled soccer jersey (true edge-to-edge sublimation, not a flat logo). Full REST API built for custom stores: Private Token auth, reference Variant IDs not Product IDs, `POST /store/products` to attach our art to blanks, `POST /orders` to fulfill, signed webhooks for `package_shipped` tracking. Margins: tee ~$13.50, hoodie ~$19, mug ~$9, AOP jersey ~$24 to $29 (price the jersey premium at $55+). Roughly a week of focused build.

**Authentic Colombian goods → direct to source (three buckets):**
- Coffee: Roastify or Dripshipper. US roasters, Colombian single-origin, true white-label dropship, no minimums, roasted-to-order under our brand.
- Food (bocadillo, arequipe, Yupi): buy stock wholesale from Fedenico (and Amigo Foods when they reopen applications), self-fulfill. Shelf-stable, cheap, low inventory risk. Not a dropship category.
- Crafts (mochilas, sombrero vueltiao): Origin Colombia and Wayuu Market, fair-trade direct from La Guajira artisans, as pre-order dropship plus Cesar's own curated stock for fast-ship hero pieces. Long lead times, set buyer expectations.
- Scale later: ProColombia's free supplier directory and matchmaking to lock in private-label coffee and direct craft supply.

Two integration patterns total: one real API (Printful) plus one lightweight order-forwarding/inventory flow (everything else).

## First 30 days

1. Today: Cesar opens Travelpayouts + Awin, approves Viator, applies to Wise/Remitly. Claude builds the affiliate link layer and the three money pages.
2. This week: publish the three money pages while traffic peaks. Remittance comparison (highest ROI), Colombia tours + insurance, fan gear guide.
3. This week: Cesar enrolls in Amazon Associates.
4. Next 2 weeks: Printful account + first designs; Claude builds the integration. Order samples before selling.
5. Next 2 weeks: launch the World Cup pass/membership on Stripe.
6. Parallel: build the media kit, pitch money-transfer brands and Juan Valdez.
7. Ongoing: aggressive newsletter capture on every match page.

## Who does what

- Cesar (account signups, can't be automated): Travelpayouts, Awin, Wise, Remitly, Amazon Associates, Printful, Stripe, coffee roaster, craft suppliers.
- Claude (build): affiliate config + link/disclosure components, the money pages, Printful integration, membership + predictions game, media kit page, newsletter capture, fulfillment-aware product model.

## Notes

- Direct-sponsorship rates (Avianca, Juan Valdez, Claro) are negotiated per deal, not public.
- Confirm the Printful AOP jersey blank cost in-dashboard before locking retail; only the ~$30.55 list price is published.
- FTC: affiliate links need a visible disclosure. The link components will include it.
