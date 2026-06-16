import type { PartnerSlug } from "@/config/partners";

/**
 * Matchday travel: the 2026 World Cup is hosted by the US, Mexico and Canada, so
 * Colombia's group games are in Mexico City, Guadalajara and Miami, not Colombia.
 * This guide sends fans to the host cities (and to Colombia itself, via /viajes).
 * Cities are keyed to fixtures in src/data/futbol.ts by matchday, single source.
 */
export type HostCity = {
  matchday: number;
  city: string;
  country: string;
  vibe: string;
  /** Where the hinchada gathers, getting to the stadium, the lay of the land. */
  fanTips: string[];
  /** Experience types to search for on Viator / GetYourGuide. Doubles as the link text. */
  experiences: string[];
};

export const hostCities: HostCity[] = [
  {
    matchday: 1,
    city: "Mexico City",
    country: "México",
    vibe:
      "La debut in the cathedral of the sport. The Azteca is loud, high, and unforgettable. Get there early and let the altitude settle.",
    fanTips: [
      "Acclimate a day early; the city sits at 2,240 m and you will feel it",
      "Gather with the hinchada in la Condesa and Roma Norte before kickoff",
      "Use the metro and official rideshare on match day, traffic is brutal",
    ],
    experiences: [
      "Teotihuacán pyramids day trip",
      "Lucha libre night",
      "Centro Histórico food tour",
    ],
  },
  {
    matchday: 2,
    city: "Guadalajara",
    country: "México",
    vibe:
      "The home of tequila, mariachi, and birria. A warmer, easier city than the capital, and a proper Colombian party waiting to happen.",
    fanTips: [
      "Stay near Chapultepec for nightlife and pre-match meetups",
      "Estadio Akron is southwest of the city, leave early for traffic",
      "Birria and tortas ahogadas are non-negotiable before the game",
    ],
    experiences: [
      "Tequila town day trip",
      "Mariachi and cantina tour",
      "Guachimontones ruins",
    ],
  },
  {
    matchday: 3,
    city: "Miami",
    country: "USA",
    vibe:
      "Basically a home game. Hard Rock Stadium will be a sea of amarillo and the city already runs on Latin time. The decisive match against Portugal.",
    fanTips: [
      "Doral and Hialeah are the Colombian heart of the city, eat there",
      "Hard Rock is in Miami Gardens, north of downtown, plan the drive",
      "Make it a long weekend: beach mornings, fútbol night",
    ],
    experiences: [
      "Wynwood walls art tour",
      "Everglades airboat ride",
      "Biscayne Bay boat day",
    ],
  },
];

export type InsurancePick = {
  partner: PartnerSlug;
  name: string;
  line: string;
  strengths: string[];
};

export const insurancePicks: InsurancePick[] = [
  {
    partner: "safetywing",
    name: "SafetyWing",
    line: "Flexible travel medical cover you can start and stop by the week.",
    strengths: [
      "Built for travelers and nomads, easy to buy last minute",
      "Covers medical emergencies abroad, including in Mexico and the US",
      "Subscription style, cancel when you are home",
    ],
  },
  {
    partner: "genki",
    name: "Genki",
    line: "Simple, no-fuss coverage for a quick trip across the border.",
    strengths: [
      "Straightforward plans for short trips",
      "Worldwide medical cover with a clean app",
      "Good backup if your card insurance falls short",
    ],
  },
];

export const mundialIntro = {
  lede:
    "Following La Tricolor to the Mundial. Colombia's group games are in Mexico City, Guadalajara and Miami, so here is how to travel smart for every match: where the hinchada gathers, what to do between games, and the insurance you do not want to skip.",
  colombiaCrossLink:
    "Dreaming bigger than the matches? After the Cup, the motherland is right there. We plan full trips to Colombia, World Cup road trips included.",
};
