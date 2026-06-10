export type Product = {
  slug: string;
  name: string;
  price: number;
  category: "Fútbol" | "Café & Cocina" | "Artesanías" | "Lifestyle";
  /** Path under /public. Products without a photo render a packaging-style card. */
  image?: string;
  placeholder?: { bg: string; fg: string };
  blurb: string;
  details: string[];
  badge?: string;
};

export const products: Product[] = [
  {
    slug: "tricolor-26-jersey",
    name: "La Tricolor '26 Fan Jersey",
    price: 49,
    category: "Fútbol",
    image: "/images/products/jersey.jpg",
    badge: "World Cup drop",
    blurb:
      "Our own fan-made jersey for the Mundial. Amarillo with blue and red trim, breathable knit, no fuss. Unofficial fanwear, 100% corazón.",
    details: [
      "Lightweight breathable knit, athletic cut",
      "Unisex sizing S to 3XL",
      "Independent fan apparel, not an official federation product",
      "Ships from Miami in 2 to 4 business days",
    ],
  },
  {
    slug: "cafe-de-origen-huila",
    name: "Café de Origen: Huila",
    price: 18,
    category: "Café & Cocina",
    image: "/images/products/cafe.jpg",
    badge: "Best seller",
    blurb:
      "Single-origin from smallholder farms in Huila. Caramel, red fruit, and a clean finish. Roasted the week it ships.",
    details: [
      "12 oz / 340 g, whole bean or ground",
      "Single origin, washed process, 1,500 to 1,900 m",
      "Direct trade with family fincas in Pitalito and Garzón",
      "Roasted weekly in small batches",
    ],
  },
  {
    slug: "sombrero-vueltiao",
    name: "Sombrero Vueltiao",
    price: 65,
    category: "Artesanías",
    image: "/images/products/sombrero.jpg",
    blurb:
      "The national symbol, woven from caña flecha by artisans in Córdoba and Sucre. The real thing, not the souvenir-stand version.",
    details: [
      "Handwoven caña flecha fiber, 19 vueltas",
      "Made by Zenú artisan families in Tuchín, Córdoba",
      "Flexible weave: it bends without breaking",
      "Each hat varies slightly. That is the point.",
    ],
  },
  {
    slug: "mochila-wayuu",
    name: "Mochila Wayúu",
    price: 79,
    category: "Artesanías",
    image: "/images/products/mochila.jpg",
    blurb:
      "Hand-crocheted by Wayúu weavers in La Guajira. One artisan, one bag, about two weeks of work. No two patterns repeat.",
    details: [
      "100% hand-crocheted cotton, single-thread weave",
      "Sourced directly from Wayúu weaving cooperatives",
      "Roomy main pocket, woven strap",
      "Pattern and colors are unique to each bag",
    ],
  },
  {
    slug: "bocadillo-veleno-box",
    name: "Bocadillo Veleño 12-Pack",
    price: 14,
    category: "Café & Cocina",
    placeholder: { bg: "#C8102E", fg: "#F7F1E3" },
    blurb:
      "Guava and panela pressed into the snack of every Colombian childhood. Wrapped in bijao leaf, just like in Vélez.",
    details: [
      "12 individually wrapped bocadillos",
      "Guava, panela, nothing else",
      "Made in Santander, the home of bocadillo",
      "Pairs dangerously well with queso campesino",
    ],
  },
  {
    slug: "chocolatera-molinillo-set",
    name: "Chocolatera & Molinillo Set",
    price: 34,
    category: "Café & Cocina",
    placeholder: { bg: "#003087", fg: "#F7F1E3" },
    blurb:
      "The aluminum pitcher and wooden whisk that made every abuela's hot chocolate taste better. Santafereño breakfast, unlocked.",
    details: [
      "Classic aluminum chocolatera, 1 liter",
      "Hand-turned wooden molinillo",
      "Works on gas and electric stovetops",
      "Cheese cube optional but strongly encouraged",
    ],
  },
  {
    slug: "pueblos-print",
    name: "Pueblos de Colombia Print",
    price: 24,
    category: "Lifestyle",
    placeholder: { bg: "#FFCD00", fg: "#17130E" },
    blurb:
      "A travel-poster style print celebrating the pueblos: Guatapé, Salento, Barichara, Jardín, Mompox. Printed on heavy matte stock.",
    details: [
      "18 x 24 in, museum-grade matte paper",
      "Designed in-house by Colombian Central",
      "Ships rolled in a protective tube",
      "Frame not included",
    ],
  },
  {
    slug: "tricolor-pulseras",
    name: "Tricolor Pulseras 3-Pack",
    price: 9,
    category: "Lifestyle",
    placeholder: { bg: "#EFE5CD", fg: "#17130E" },
    blurb:
      "Woven tricolor bracelets, the unofficial uniform of game day. Three per pack: one for you, two for the parceros.",
    details: [
      "Three handwoven adjustable bracelets",
      "Amarillo, azul y rojo thread",
      "One size fits all",
      "Stack them. You know you want to.",
    ],
  },
];

export const shopNotes = {
  shipping: "Free U.S. shipping on orders over $75. Ships from Miami.",
  authenticity:
    "Artesanías are sourced directly from artisan cooperatives in Colombia and we pay artisan-set prices.",
};
