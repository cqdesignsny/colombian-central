/**
 * Fan gear guide. Strategy from MONETIZATION.md: our own-margin shop products
 * lead, Amazon Associates is the filler for the long tail we do not stock.
 * Never cross-sell Amazon on a category we sell ourselves (jerseys, bracelets).
 */

export const fanGearIntro = {
  lede:
    "Everything you need to represent on match day. Empieza con lo nuestro, hecho con corazón, then fill the bag with flags, paint and noise. Vístete de amarillo y que se note la hinchada.",
};

/** Our shop. Referenced by product slug and joined with src/data/products.ts. */
export type OurPick = { slug: string; pitch: string };

export const ourPicks: OurPick[] = [
  {
    slug: "tricolor-26-jersey",
    pitch: "The shirt. Our own fan-made Tricolor for the Mundial. Wear it to every game.",
  },
  {
    slug: "tricolor-pulseras",
    pitch: "Stack them up the wrist. One for you, two for the parceros who forgot theirs.",
  },
  {
    slug: "sombrero-vueltiao",
    pitch: "The flex move. Show up in the national symbol and own the section.",
  },
];

/** Amazon long tail. Things we do not sell. query feeds amazonSearch(). */
export type AmazonPick = { name: string; desc: string; query: string };

export const amazonPicks: AmazonPick[] = [
  {
    name: "Bandera de Colombia",
    desc: "A big flag to wave at the screen or drape over the seats. Get the large size.",
    query: "Colombia flag large 3x5",
  },
  {
    name: "Bufanda tricolor",
    desc: "The football scarf. Hold it up for the anthem, classic terraces energy.",
    query: "Colombia soccer scarf",
  },
  {
    name: "Pintura facial",
    desc: "Amarillo, azul y rojo on the cheeks. Skin-safe face paint, easy to wash off.",
    query: "face paint yellow blue red washable",
  },
  {
    name: "Bucket hat tricolor",
    desc: "Sun protection at the Azteca, style everywhere else.",
    query: "Colombia bucket hat",
  },
  {
    name: "Corneta",
    desc: "Make noise. An air horn or vuvuzela so the section hears you coming.",
    query: "fan air horn handheld",
  },
  {
    name: "Tatuajes temporales",
    desc: "Flag tattoos for the kids and the kids at heart. Cheap, fun, everywhere.",
    query: "Colombia flag temporary tattoos",
  },
];
