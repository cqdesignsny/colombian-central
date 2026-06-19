/**
 * Music content for /musica. Curated editorial, like the rest of the site, no CMS.
 * Concert data verified June 2026; re-check dates before they pass, tours move.
 */

export type Artist = {
  name: string;
  genre: string;
  note: string;
};

export const artists: Artist[] = [
  { name: "Karol G", genre: "Urbano", note: "La Bichota. Global superstar; Tropicoqueta topped the Latin charts and filled stadiums." },
  { name: "Shakira", genre: "Pop", note: "Barranquilla's own, the biggest Latin artist of all time. Las caderas no mienten." },
  { name: "Feid", genre: "Reggaetón", note: "Ferxxo. Medellín's perreo king, green everything, hit after hit." },
  { name: "J Balvin", genre: "Reggaetón", note: "Took reggaetón global. Mi Gente, Colores, the blueprint." },
  { name: "Maluma", genre: "Urbano", note: "Pretty boy dirty boy. Medellín reggaetón-pop crossover machine." },
  { name: "Carlos Vives", genre: "Vallenato pop", note: "Fused vallenato with pop and made it the world's. A national institution." },
  { name: "Juanes", genre: "Rock", note: "Rock en español icon. La Camisa Negra, A Dios le Pido, a shelf of Grammys." },
  { name: "Silvestre Dangond", genre: "Vallenato", note: "The modern face of vallenato. Showman, sold-out arenas, pure acordeón." },
  { name: "Bomba Estéreo", genre: "Electro-cumbia", note: "Psychedelic tropical-electronic. Soy Yo became an anthem." },
  { name: "Grupo Niche", genre: "Salsa", note: "Cali's legendary orquesta. Cali Pachanguero still moves every party." },
  { name: "Blessd", genre: "Urbano", note: "Medellín trap-reggaetón, one of the fastest-rising names in the genre." },
  { name: "Ryan Castro", genre: "Reggaetón", note: "El Cantante del Ghetto. Street-pop and Afrobeat out of Medellín." },
  { name: "Fonseca", genre: "Tropical pop", note: "Romantic vallenato-pop. Te Mando Flores on every wedding playlist." },
  { name: "Sebastián Yatra", genre: "Pop", note: "Smooth pop balladeer with a huge crossover reach." },
  { name: "Monsieur Periné", genre: "Jazz-folk", note: "Bogotá band blending gypsy-jazz with Latin folk. Pure charm." },
  { name: "ChocQuibTown", genre: "Hip-hop / Pacific", note: "Afro-Colombian crew from Chocó, fusing rap with marimba and currulao." },
];

export type MusicGenre = {
  name: string;
  region: string;
  desc: string;
};

export const genres: MusicGenre[] = [
  { name: "Vallenato", region: "Costa Caribe", desc: "Accordion, caja and guacharaca telling stories from Valledupar. UNESCO heritage." },
  { name: "Cumbia", region: "Costa Caribe", desc: "The foundational rhythm, African, Indigenous and Spanish roots, gaitas and tambores." },
  { name: "Salsa caleña", region: "Cali", desc: "The self-declared salsa capital of the world. Faster, footwork-heavy, orquestas like Niche." },
  { name: "Champeta", region: "Cartagena", desc: "Afro-Colombian dance music rooted in African soukous, electric and unmistakable." },
  { name: "Reggaetón / Urbano", region: "Medellín", desc: "Medellín is a global capital of the genre. Balvin, Karol G and Feid run the world from here." },
  { name: "Bambuco", region: "Región Andina", desc: "String-based Andean folk on tiple and bandola. The slow, waltzing soul of the interior." },
];

export type Concert = {
  artist: string;
  tour: string;
  scale: string;
  window: string;
  cities: string;
  /** confirmed = dates verified, tba = announced act but US dates pending. */
  status: "confirmed" | "partial" | "tba";
};

export const concerts: Concert[] = [
  {
    artist: "Karol G",
    tour: "Viajando Por El Mundo Tropitour",
    scale: "Stadiums",
    window: "Jul to Oct 2026",
    cities: "Chicago, Las Vegas, Los Angeles, San Francisco, Houston, Miami, Dallas, Boston",
    status: "confirmed",
  },
  {
    artist: "Shakira",
    tour: "Las Mujeres Ya No Lloran World Tour",
    scale: "Arenas",
    window: "Jun to Jul 2026",
    cities: "Los Angeles, San Jose, Dallas, Atlanta, Miami, Boston, Newark, Brooklyn",
    status: "confirmed",
  },
  {
    artist: "Feid",
    tour: "Feid vs Ferxxo: Falxo Tour",
    scale: "Theaters",
    window: "Apr to May 2026",
    cities: "Miami Beach, Brooklyn, Chicago, San Francisco, Dallas",
    status: "confirmed",
  },
  {
    artist: "J Balvin",
    tour: "Festival run",
    scale: "Festivals",
    window: "May 2026",
    cities: "Sueños (Chicago), La Onda (Napa)",
    status: "confirmed",
  },
  {
    artist: "Ryan Castro & Blessd",
    tour: "Co-headline",
    scale: "Arenas",
    window: "Apr 29, 2026",
    cities: "San Jose, plus scattered US dates",
    status: "partial",
  },
  {
    artist: "Silvestre Dangond",
    tour: "US tour 2026",
    scale: "Arenas",
    window: "2026",
    cities: "Atlanta, Orlando, more on Live Nation",
    status: "partial",
  },
  {
    artist: "Maluma",
    tour: "2026 US tour",
    scale: "Arenas",
    window: "Dates TBA",
    cities: "Check Ticketmaster",
    status: "tba",
  },
];

export const musicIntro = {
  lede:
    "Colombia is one of the most musical countries on earth. From the accordion of vallenato to Medellín running global reggaetón, this is the soundtrack of la cultura. Artists, the genres that made them, and where to catch them live.",
  updated: "Actualizado junio 2026",
  heroImage: "/images/musica/hero.jpg",
};
