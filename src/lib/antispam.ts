/**
 * Lightweight, dependency-free spam heuristics for public forms and inbound
 * mail. Catches the common bot + solicitor patterns (link-stuffed messages,
 * SEO/marketing/crypto pitches, disposable emails) without a CAPTCHA, and stays
 * conservative so real inquiries get through. Escalate to Turnstile/BotID if
 * spam slips past this.
 */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.info", "grr.la",
  "sharklasers.com", "10minutemail.com", "temp-mail.org", "tempmail.com",
  "tempmail.net", "throwawaymail.com", "yopmail.com", "getnada.com",
  "nada.email", "maildrop.cc", "fakeinbox.com", "dispostable.com",
  "trashmail.com", "mailnesia.com", "mintemail.com", "spam4.me", "mohmal.com",
  "emailondeck.com", "tempr.email", "discard.email", "mailcatch.com",
  "spamgourmet.com", "moakt.com", "tmpmail.org", "tmpmail.net",
]);

const SPAM_PATTERNS: RegExp[] = [
  /\bseo\b/i,
  /back ?links?/i,
  /guest post/i,
  /\bcrypto(currency)?\b/i,
  /\bforex\b/i,
  /\bnfts?\b/i,
  /\bcasino\b/i,
  /\bviagra\b/i,
  /loan offer/i,
  /rank(ing)? your (site|website|business)/i,
  /increase (your )?(traffic|sales|leads|ranking|revenue)/i,
  /(web|app|mobile|software) (design|development) (services|company|agency|team)/i,
  /digital marketing (services|agency|company)/i,
  /lead generation (services|agency)/i,
  /\bbuy (now|cheap|followers)\b/i,
  /work from home/i,
  /make \$?\d+ ?(k|,?000)?\/? ?(a |per )?(day|week|month)/i,
  /business proposal/i,
];

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim() ?? "";
  return DISPOSABLE_DOMAINS.has(domain);
}

/** Count links, including bare domains (e.g. "example.com") that solicitors use. */
export function countLinks(text: string): number {
  const explicit = (text.match(/(https?:\/\/|www\.)/gi) ?? []).length;
  const bare = (
    text.match(
      /\b[a-z0-9][a-z0-9-]*\.(com|net|org|io|co|info|biz|xyz|ru|cn|top|online|shop|site|link|click|store)\b/gi,
    ) ?? []
  ).length;
  return Math.max(explicit, bare);
}

function matchesSpamKeyword(text: string): boolean {
  return SPAM_PATTERNS.some((re) => re.test(text));
}

/**
 * For message-bearing public forms (trip inquiries, contact). maxLinks defaults
 * to 0: a genuine trip inquiry has no need for a URL.
 */
export function messageLooksLikeSpam({
  name = "",
  message = "",
  email = "",
  maxLinks = 0,
}: {
  name?: string;
  message?: string;
  email?: string;
  maxLinks?: number;
}): boolean {
  if (email && isDisposableEmail(email)) return true;
  if (countLinks(message) > maxLinks) return true;
  return matchesSpamKeyword(`${name}\n${message}`);
}

/**
 * For inbound email being forwarded. Conservative: keyword-only (real emails
 * legitimately contain links), so we only drop obvious solicitation/spam.
 */
export function inboundEmailLooksLikeSpam(subject: string, text: string): boolean {
  return matchesSpamKeyword(`${subject}\n${text}`.slice(0, 5000));
}
