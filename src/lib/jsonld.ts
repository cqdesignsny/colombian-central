/**
 * Structured data (JSON-LD) builders for SEO/AEO/GEO. Search engines and answer
 * engines (Google, Perplexity, ChatGPT, etc.) read these to understand the site
 * and its entities. Rendered via the <JsonLd> component.
 */
import { site } from "@/config/site";
import type { Product } from "@/data/products";
import type { Article } from "@/data/articles";
import type { Fixture } from "@/data/futbol";

const LOGO = `${site.url}/brand/Col-Central_logo-New.png`;
const abs = (path: string) => (path.startsWith("http") ? path : `${site.url}${path}`);

type Ld = Record<string, unknown>;

export function organizationLd(): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.brand,
    url: site.url,
    logo: LOGO,
    description: site.description,
    email: site.publicEmail,
    sameAs: Object.values(site.socials),
  };
}

export function websiteLd(): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.brand,
    url: site.url,
    description: site.description,
    inLanguage: ["en-US", "es"],
    publisher: { "@type": "Organization", name: site.brand, url: site.url },
  };
}

export function productLd(product: Product): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.blurb,
    ...(product.image ? { image: abs(product.image) } : {}),
    category: product.category,
    brand: { "@type": "Brand", name: site.brand },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${site.url}/tienda/${product.slug}`,
    },
  };
}

export function articleLd(article: Article): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: abs(article.image),
    datePublished: article.date,
    dateModified: article.date,
    articleSection: article.category,
    inLanguage: "en-US",
    author: { "@type": "Organization", name: site.brand, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.brand,
      logo: { "@type": "ImageObject", url: LOGO },
    },
    mainEntityOfPage: `${site.url}/noticias/${article.slug}`,
  };
}

export function sportsEventLd(fixture: Fixture): Ld {
  const colombia = { "@type": "SportsTeam", name: "Colombia" };
  const opponent = { "@type": "SportsTeam", name: fixture.opponent };
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `Colombia vs ${fixture.opponent}, FIFA World Cup 2026`,
    startDate: fixture.kickoff,
    eventStatus: "https://schema.org/EventScheduled",
    sport: "Soccer",
    location: { "@type": "Place", name: fixture.venue, address: fixture.city },
    competitor: fixture.colombiaHome
      ? [colombia, opponent]
      : [opponent, colombia],
    organizer: { "@type": "Organization", name: "FIFA", url: "https://www.fifa.com" },
    superEvent: { "@type": "SportsEvent", name: "FIFA World Cup 2026" },
  };
}
