import type { PartnerSlug } from "@/config/partners";

export type RemitProvider = {
  slug: string;
  name: string;
  /** Affiliate partner key, or null for an incumbent we compare against but do not earn on. */
  partner: PartnerSlug | null;
  badge?: string;
  tagline: string;
  bestFor: string;
  strengths: string[];
  watchOut: string;
  /** How the money lands in Colombia. */
  delivery: string[];
  highlight?: boolean;
};

/**
 * Honest, qualitative positioning. We do not publish exact fees or rates here on
 * purpose: they move daily and a wrong number is worse than no number. We point
 * people to the live quote and tell them which provider tends to win, and when.
 */
export const remitProviders: RemitProvider[] = [
  {
    slug: "wise",
    name: "Wise",
    partner: "wise",
    badge: "Mejor tasa",
    tagline: "The most pesos per dollar, with nothing hidden.",
    bestFor: "Getting the best exchange rate on a bank deposit.",
    strengths: [
      "Uses the real mid-market rate, the one you see on Google",
      "One transparent fee shown up front, no markup baked into the rate",
      "Lands straight in a Colombian bank, Nequi or Daviplata",
      "Reliable for recurring monthly support to la familia",
    ],
    watchOut: "Built for bank and wallet deposits, not cash pickup in person.",
    delivery: ["Bancolombia y bancos", "Nequi", "Daviplata"],
    highlight: true,
  },
  {
    slug: "remitly",
    name: "Remitly",
    partner: "remitly",
    badge: "Efectivo rápido",
    tagline: "Cash in minutes, built around the US to Colombia corridor.",
    bestFor: "Cash pickup, speed, and first-time senders.",
    strengths: [
      "Cash pickup across Colombia at Efecty and partner agents",
      "Express option delivers in minutes when it cannot wait",
      "Strong promo rate on your first transfer",
      "Send from the app to a phone number, no bank needed on their end",
    ],
    watchOut: "The cheapest Economy rate is slower; Express costs a bit more.",
    delivery: ["Efectivo (Efecty)", "Bancolombia", "Nequi"],
  },
  {
    slug: "xe",
    name: "Xe",
    partner: "xe",
    badge: "Envíos grandes",
    tagline: "Made for the bigger one-time transfer.",
    bestFor: "Larger amounts and high or no send limits.",
    strengths: [
      "Comfortable with large transfers, high limits",
      "Decades in the currency business, deep bank network",
      "Good rates as the amount climbs",
      "Rate alerts so you can time a big send",
    ],
    watchOut: "Mostly bank deposit; fewer cash-pickup options than Remitly.",
    delivery: ["Bancolombia y bancos", "Transferencia directa"],
  },
  {
    slug: "western-union",
    name: "Western Union",
    partner: null,
    badge: "La que ya conocen",
    tagline: "The name every Colombian family already trusts.",
    bestFor: "Cash pickup in any town, even the small ones.",
    strengths: [
      "Cash pickup almost everywhere in Colombia",
      "Send in minutes to someone with no bank account",
      "Familiar to the whole family, easy to explain to los papás",
    ],
    watchOut: "You usually pay for that reach: the rate and fees tend to run higher.",
    delivery: ["Efectivo en agencia", "Bancos"],
  },
];

/** Scenario-first picks for the top of the page. */
export const remitQuickPicks: {
  scenario: string;
  pick: string;
  partner: PartnerSlug;
  why: string;
}[] = [
  {
    scenario: "La mejor tasa",
    pick: "Wise",
    partner: "wise",
    why: "Most pesos per dollar on a deposit to Bancolombia, Nequi or Daviplata.",
  },
  {
    scenario: "Efectivo en minutos",
    pick: "Remitly",
    partner: "remitly",
    why: "Cash pickup at Efecty and agents, fast, no bank account needed.",
  },
  {
    scenario: "Un envío grande",
    pick: "Xe",
    partner: "xe",
    why: "High limits and rates that improve as the amount goes up.",
  },
];

export const remitFaqs: { q: string; a: string }[] = [
  {
    q: "What is the cheapest way to send money to Colombia?",
    a: "Look at the rate and the fee together, not just one. Wise usually gives the best exchange rate because it uses the real mid-market rate with one clear fee. Remitly often wins on a first transfer thanks to a promo rate, and it is the move when you need cash pickup. Always check the live quote before you send; the numbers change daily.",
  },
  {
    q: "How does the money arrive? Nequi, Bancolombia, or cash?",
    a: "Your choice. All three of our picks deposit straight into a Colombian bank account, Nequi or Daviplata. For cash, Remitly and Western Union offer pickup at Efecty and partner agents across the country.",
  },
  {
    q: "How long does a transfer take?",
    a: "Anywhere from a few minutes to a couple of business days, depending on the provider and the option you pick. Express and cash-pickup options are the fastest; the cheapest economy options take longer.",
  },
  {
    q: "Does my family need a bank account to receive it?",
    a: "No. Cash-pickup options through Remitly and Western Union let them collect at an agent with an ID. Bank or wallet deposit to Nequi or Daviplata is cheaper if they have it.",
  },
  {
    q: "Are these services safe?",
    a: "Yes. Wise, Remitly, Xe and Western Union are all licensed, regulated money transmitters in the US. Your transfer is protected and tracked end to end.",
  },
  {
    q: "Why does Colombian Central recommend these?",
    a: "We use these services ourselves to send money home, and we earn a small referral commission when you sign up through our links, at no extra cost to you. That helps keep this guide free. We only list options we would actually use.",
  },
];

export const remitIntro = {
  updated: "Actualizado junio 2026",
  lede:
    "The honest comparison of the best ways to send money home. Mejor tasa, menos comisión, y plata que llega cuando tiene que llegar. We track Wise, Remitly, Xe and Western Union so you send smarter, not just faster.",
};
