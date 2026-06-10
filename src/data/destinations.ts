export type Destination = {
  slug: string;
  name: string;
  region: string;
  image: string;
  blurb: string;
  bestFor: string[];
  idealDays: string;
};

export const destinations: Destination[] = [
  {
    slug: "cartagena",
    name: "Cartagena",
    region: "Caribbean Coast",
    image: "/images/hero-cartagena.jpg",
    blurb:
      "Walled-city sunsets, palenquera fruit stands, rooftop salsa. The classic first taste of Colombia for a reason.",
    bestFor: ["First trip", "History", "Nightlife"],
    idealDays: "3 to 4 days",
  },
  {
    slug: "eje-cafetero",
    name: "Eje Cafetero",
    region: "Coffee Axis",
    image: "/images/cocora.jpg",
    blurb:
      "Wax palms in the Cocora Valley, jeep rides between fincas, and the best cup of coffee you will ever drink at the source.",
    bestFor: ["Coffee", "Hiking", "Slow travel"],
    idealDays: "4 to 5 days",
  },
  {
    slug: "tayrona",
    name: "Tayrona & Santa Marta",
    region: "Caribbean Coast",
    image: "/images/tayrona.jpg",
    blurb:
      "Jungle trails that end in turquoise coves. Hammock nights, Sierra Nevada views, and the doorway to the Lost City trek.",
    bestFor: ["Beaches", "Adventure", "Nature"],
    idealDays: "3 to 4 days",
  },
  {
    slug: "medellin",
    name: "Medellín",
    region: "Antioquia",
    image: "/images/medellin.jpg",
    blurb:
      "The city of eternal spring. Metrocable views, Comuna 13 street art, fútbol nights, and a food scene moving at full speed.",
    bestFor: ["City life", "Digital nomads", "Fútbol"],
    idealDays: "3 to 5 days",
  },
  {
    slug: "guatape",
    name: "Guatapé",
    region: "Antioquia",
    image: "/images/guatape.jpg",
    blurb:
      "The most colorful pueblo in Colombia and the 740-step climb up El Peñol for a view that does not look real.",
    bestFor: ["Day trips", "Photography", "Pueblos"],
    idealDays: "1 to 2 days",
  },
  {
    slug: "san-andres",
    name: "San Andrés",
    region: "Caribbean Islands",
    image: "/images/san-andres.jpg",
    blurb:
      "The sea of seven colors. Raizal culture, reggae on the malecón, and water so clear it shows up in your dreams.",
    bestFor: ["Islands", "Diving", "Couples"],
    idealDays: "4 to 5 days",
  },
];

export type TripPackage = {
  slug: string;
  name: string;
  duration: string;
  route: string;
  priceFrom: number;
  tag?: string;
  highlights: string[];
};

export const packages: TripPackage[] = [
  {
    slug: "mundial-miami",
    name: "Mundial in Miami: Colombia vs Portugal",
    duration: "3 days · Jun 26 to 28",
    route: "Miami",
    priceFrom: 1490,
    tag: "World Cup",
    highlights: [
      "Hotel near Hard Rock Stadium, 2 nights",
      "Pre-match watch party with the barra",
      "Match-day transport so nobody parks",
      "Match tickets quoted separately on request",
    ],
  },
  {
    slug: "ruta-del-cafe",
    name: "Ruta del Café",
    duration: "5 days",
    route: "Pereira · Salento · Filandia",
    priceFrom: 890,
    highlights: [
      "Stay on a working coffee finca",
      "Cocora Valley hike among the wax palms",
      "Cupping session with a head roaster",
      "Willys jeep pueblo-hopping day",
    ],
  },
  {
    slug: "caribe-clasico",
    name: "Caribe Clásico",
    duration: "8 days",
    route: "Cartagena · Tayrona · Santa Marta",
    priceFrom: 1290,
    tag: "Most booked",
    highlights: [
      "Walled city food and history walk",
      "Rosario Islands boat day",
      "Tayrona beach trek with local guide",
      "Sunset sail off Santa Marta",
    ],
  },
  {
    slug: "medellin-flores",
    name: "Medellín en Flores",
    duration: "5 days · early August",
    route: "Medellín · Guatapé",
    priceFrom: 990,
    tag: "Feria de las Flores",
    highlights: [
      "Feria de las Flores events and silleteros parade",
      "Comuna 13 graffiti tour with local artists",
      "Guatapé and El Peñol day trip",
      "Atanasio Girardot match night if the calendar allows",
    ],
  },
];

export const travelNotes = {
  pricing:
    "Sample itineraries with starting prices per traveler, double occupancy, flights not included. Every trip is quoted and customized before you pay anything.",
  promise:
    "We plan with people, not algorithms. Tell us the trip you want and a Colombian who has actually been there builds it with you.",
};
