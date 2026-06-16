/**
 * Affiliate partner config: the gating layer for the money pages.
 *
 * How gating works: every partner ships with an empty `affiliateUrl` and a real
 * `publicUrl`. Pages always render working links (pointing at `publicUrl`), so
 * the guides are useful and convert traffic *now*, during the World Cup window.
 * The moment Cesar's affiliate account is approved, drop the tracking link into
 * `affiliateUrl` here and every CTA across the site starts earning. No page edits.
 *
 * One file to flip the whole site live. Country-specific, like everything else,
 * so a future Mexican Central swaps this with its own programs.
 */

export type PartnerSlug =
  | "wise"
  | "remitly"
  | "xe"
  | "viator"
  | "getyourguide"
  | "safetywing"
  | "genki";

export type Partner = {
  name: string;
  category: "remittance" | "tours" | "insurance";
  /**
   * Affiliate / referral tracking link. Empty until the program is approved.
   * When empty, the site falls back to `publicUrl` (works, but earns nothing yet).
   */
  affiliateUrl: string;
  /** Public destination used until the affiliate link is live. Always set. */
  publicUrl: string;
  /** Program terms, for our own reference. Not rendered. See MONETIZATION.md. */
  program: string;
};

export const partners: Record<PartnerSlug, Partner> = {
  wise: {
    name: "Wise",
    category: "remittance",
    affiliateUrl: "",
    publicUrl: "https://wise.com/us/send-money/send-money-to-colombia",
    program: "Wise Partnerships. ~$13 to $65 CPA on first transfer, 365-day cookie.",
  },
  remitly: {
    name: "Remitly",
    category: "remittance",
    affiliateUrl: "",
    publicUrl: "https://www.remitly.com/us/en/colombia",
    program: "Remitly affiliate. ~$5 to $20 per first transfer on the US to Colombia corridor.",
  },
  xe: {
    name: "Xe",
    category: "remittance",
    affiliateUrl: "",
    publicUrl: "https://www.xe.com/send-money/",
    program: "Xe via Awin. ~$20 to $30 per completed registration.",
  },
  viator: {
    name: "Viator",
    category: "tours",
    affiliateUrl: "",
    publicUrl: "https://www.viator.com/",
    program: "Viator (Tripadvisor login). 8% scaling to 12%, 30-day cookie.",
  },
  getyourguide: {
    name: "GetYourGuide",
    category: "tours",
    affiliateUrl: "",
    publicUrl: "https://www.getyourguide.com/",
    program: "GetYourGuide via Travelpayouts. 8%, 31-day cookie.",
  },
  safetywing: {
    name: "SafetyWing",
    category: "insurance",
    affiliateUrl: "",
    publicUrl: "https://safetywing.com/nomad-insurance",
    program: "SafetyWing Ambassador. 10% recurring for 364 days.",
  },
  genki: {
    name: "Genki",
    category: "insurance",
    affiliateUrl: "",
    publicUrl: "https://genki.world/",
    program: "Genki affiliate. 5% recurring.",
  },
};

/**
 * Amazon Associates store tag, e.g. "colombiancentral-20". Empty until enrolled.
 * Appended to Amazon URLs by `amazonSearch`; when empty, links still work, untagged.
 */
export const amazonAssociateTag = "";

/** The live destination for a partner: the affiliate link if set, else the public URL. */
export function partnerHref(slug: PartnerSlug): string {
  const partner = partners[slug];
  return partner.affiliateUrl || partner.publicUrl;
}

/** True once a real affiliate link exists (i.e. the CTA is actually earning). */
export function isPartnerActive(slug: PartnerSlug): boolean {
  return Boolean(partners[slug].affiliateUrl);
}

/** Amazon search URL for a query, tagged with the Associate ID when present. */
export function amazonSearch(query: string): string {
  const params = new URLSearchParams({ k: query });
  if (amazonAssociateTag) params.set("tag", amazonAssociateTag);
  return `https://www.amazon.com/s?${params.toString()}`;
}
