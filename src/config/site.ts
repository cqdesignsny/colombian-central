/**
 * Country config. This is the seed of the "Central" platform idea:
 * to spin up MexicanCentral or ArgentinianCentral, you swap this file,
 * the data files in src/data, and the assets in public/.
 */
export const site = {
  brand: "Colombian Central",
  shortName: "CC",
  domain: "colombiancentral.com",
  url: "https://colombiancentral.com",
  country: "Colombia",
  demonym: "Colombian",
  tagline: "Todo lo nuestro, en un solo lugar.",
  taglineEn: "Everything Colombian, all in one place.",
  description:
    "Colombian Central is the hub for everything Colombian: La Tricolor at the 2026 World Cup, products from back home, travel to Colombia, and stories from the culture and the diaspora.",
  contactEmail: "cesar@creativequalitymarketing.com",
  publicEmail: "info@colombiancentral.com",
  flag: {
    amarillo: "#FFCD00",
    azul: "#003087",
    rojo: "#C8102E",
  },
  nav: [
    { label: "Fútbol", href: "/futbol" },
    { label: "Música", href: "/musica" },
    { label: "Comida", href: "/comida" },
    { label: "Tienda", href: "/tienda" },
    { label: "Viajes", href: "/viajes" },
    { label: "Noticias", href: "/noticias" },
    { label: "Nosotros", href: "/nosotros" },
  ],
  socials: {
    instagram: "https://instagram.com/colombiancentral",
    tiktok: "https://tiktok.com/@colombiancentral",
    x: "https://x.com/colombiancntrl",
    youtube: "https://youtube.com/@colombiancentral",
  },
} as const;
