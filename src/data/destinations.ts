export type Destination = {
  slug: string;
  name: string;
  region: string;
  image: string;
  /** Photo credit shown on the hero when the image is a licensed real photo. */
  imageCredit?: string;
  /** Short line for cards. */
  blurb: string;
  bestFor: string[];
  idealDays: string;
  /** Landing-page hero one-liner. */
  tagline: string;
  /** Landing-page intro, 2 to 3 paragraphs. */
  intro: string[];
  /** When to go, in plain language. */
  bestTime: string;
  /** Things to see and do. */
  highlights: string[];
  /** Practical tips: getting there, staying safe, what to know. */
  knowBeforeYouGo: string[];
  /** Rough per-person starting price (USD, land only) for the quote estimate. */
  costFrom: number;
  /** What that estimate covers. */
  costNote: string;
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
    tagline: "La Heroica: four centuries of walls, color, and Caribbean heat.",
    intro: [
      "Cartagena is the postcard, and for once the postcard undersells it. A walled colonial city on the Caribbean, all bougainvillea and balconies and four-hundred-year-old stone, with a salsa bar around every corner and a sunset that turns the whole place gold. It is the easiest place in Colombia to fall in love with the country.",
      "Stay inside the Ciudad Amurallada or in Getsemaní, the old working-class barrio that has become the most charming neighborhood for travelers anywhere in Colombia. Days are for the old city before the heat and the beaches of the Rosario Islands; nights are for the plazas, the rooftops, and the champeta playing somewhere down the street.",
    ],
    bestTime:
      "December to April is the dry, breezy sweet spot (and peak season, so book early). It is warm and humid all year; September and October bring the most rain.",
    highlights: [
      "Sunset walk along the city walls, ending at Café del Mar or a rooftop",
      "Getsemaní street art, plazas, and the best nightlife in the city",
      "Rosario Islands boat day for that impossible Caribbean blue",
      "Palenque day trip to meet the first free town in the Americas",
      "A cooking class or food walk through the old city",
    ],
    knowBeforeYouGo: [
      "Fly into Rafael Núñez (CTG); it is ten minutes from the old city",
      "The heat is real. Plan outdoor time for mornings and evenings",
      "Agree on taxi fares before getting in, or use a ride app",
      "Beaches in town are mediocre; the Rosario Islands are the move",
    ],
    costFrom: 780,
    costNote:
      "Rough per-person for 3 to 4 days, mid-range hotel and the main experiences, double occupancy. International flights not included.",
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
    tagline: "La ciudad de la eterna primavera, reinventing itself in real time.",
    intro: [
      "Medellín sits in a green valley at the perfect temperature year-round, which is why they call it the city of eternal spring. It is also the city that reinvented itself harder than almost anywhere on earth, and the energy of that comeback is everywhere: in the metrocables strung over the hills, the transformed Comuna 13, the parks, the nightlife, and a food scene that keeps leveling up.",
      "Base yourself in El Poblado or the more local Laureles, ride the metro and the cable cars for the views, and give yourself a day for a pueblo trip. Paisa hospitality is a real thing; people here will adopt you by lunch.",
    ],
    bestTime:
      "Spring-like all year, so almost anytime works. December to March and July to August are driest. Early August is the Feria de las Flores, the city's biggest party.",
    highlights: [
      "Comuna 13 graffiti tour with a local guide and the famous escalators",
      "Metrocable up to Parque Arví for valley views and forest air",
      "Guatapé and El Peñol day trip (about two hours out)",
      "A night out in Provenza, then a fútbol match at the Atanasio if the calendar lines up",
      "Coffee fincas and the pueblo of Santa Fe de Antioquia within reach",
    ],
    knowBeforeYouGo: [
      "Fly into José María Córdova (MDE), about 45 minutes from the city",
      "The metro is clean, cheap, and a point of local pride; use it",
      "No dar papaya: keep phones and valuables low-key, especially at night",
      "El Poblado is the easy landing; Laureles is more local and walkable",
    ],
    costFrom: 690,
    costNote:
      "Rough per-person for 3 to 5 days, mid-range stay and the main experiences, double occupancy. International flights not included.",
  },
  {
    slug: "cali",
    name: "Cali",
    region: "Valle del Cauca",
    image: "/images/destinations/cali.jpg",
    imageCredit: "Foto: Mario Carvajal (CC BY 2.0), Wikimedia Commons",
    blurb:
      "The salsa capital of the world. Warm nights, warmer people, and a dance floor calling your name.",
    bestFor: ["Salsa", "Nightlife", "Culture"],
    idealDays: "3 to 4 days",
    tagline: "La sucursal del cielo: heaven's branch office, and it dances.",
    intro: [
      "Cali does not ease you in. The heat hits, music is already playing somewhere, and within an hour you understand why it calls itself la sucursal del cielo, heaven's branch office. It is the salsa capital of the world, full stop, and the city wears that title in its hips, not just on a sign.",
      "Start in the colonial hill of Barrio San Antonio for the views and the cafés, then come back down for the real reason you are here: the salsa. Take a class, then let a guide take you to where caleños actually dance. The food, the warmth, and the year-round sunshine do the rest.",
    ],
    bestTime:
      "Warm and bright most of the year. The Feria de Cali around Christmas (late December) is one of the great parties in the Americas, salsa orchestras and all.",
    highlights: [
      "A salsa class plus a guided night out in the real dance spots",
      "Barrio San Antonio for sunset, cafés, and local crafts",
      "Cristo Rey and the city viewpoints",
      "Street food: chontaduro, champús, lulada, and a proper cholado",
      "Day trips to haciendas in the Valle del Cauca and the road to the Pacific",
    ],
    knowBeforeYouGo: [
      "Fly into Alfonso Bonilla Aragón (CLO), about 30 to 40 minutes out",
      "Cali rewards a local guide for nightlife; it makes the salsa scene open up",
      "It runs hotter than Bogotá or Medellín; pack light and hydrate",
      "Cali is also the gateway to Colombia's Pacific coast",
    ],
    costFrom: 620,
    costNote:
      "Rough per-person for 3 to 4 days, mid-range stay, salsa nights, and day trips, double occupancy. International flights not included.",
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
    tagline: "El mar de siete colores, closer to Nicaragua than to the mainland.",
    intro: [
      "San Andrés is a Colombian island far out in the Caribbean, and it feels like its own world: English-Creole spoken alongside Spanish, Raizal culture, reggae and calypso on the breeze, and the famous mar de siete colores, a sea that genuinely shifts through seven shades of blue and green.",
      "Rent a golf cart and loop the island, snorkel the reefs, eat rondón and fresh fish, and slow all the way down. It is small, easy, and built for switching your brain off.",
    ],
    bestTime:
      "January to May is driest and calmest. It is warm all year; the rainier months later in the year still see plenty of sun between showers.",
    highlights: [
      "Loop the island by golf cart, stopping at Hoyo Soplador and West View",
      "Snorkel or dive the reefs; the visibility is unreal",
      "Johnny Cay and the Acuario sandbar by boat",
      "Rondón, the slow-cooked island stew, at a local spot",
      "Sunset and live music on the San Luis side",
    ],
    knowBeforeYouGo: [
      "Everyone pays a tourist card (tarjeta de turismo) on the way in",
      "It is a duty-free island; flights from the mainland are the main cost",
      "A golf cart for a day is the best way to see it",
      "Bring reef-safe sunscreen; the ecosystem is protected",
    ],
    costFrom: 850,
    costNote:
      "Rough per-person for 4 to 5 days, hotel, island flight, and boat trips, double occupancy. International flights not included.",
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
    tagline: "The green heart of Colombia, one finca and one cup at a time.",
    intro: [
      "The Coffee Axis, Caldas, Quindío, and Risaralda, is the Colombia of the postcards: valleys quilted in coffee rows, Willys jeeps, bahareque farmhouses, and the world's tallest palms swaying in the Cocora Valley. It is also where you taste the coffee at the source, freshly picked and roasted, and understand what the fuss is about.",
      "Base yourself on a working coffee finca near Salento or Filandia, two of the prettiest pueblos in the country, and let the days go slow: a hike, a cupping, a jeep ride, a long lunch. This is the region that recharges you.",
    ],
    bestTime:
      "December to March and July to August are the driest windows. It is green because it rains, so expect afternoon showers any time of year. Mornings are usually clear.",
    highlights: [
      "Cocora Valley hike among the towering wax palms",
      "Stay and cup coffee on a working finca",
      "The colorful pueblos of Salento and Filandia",
      "A Willys jeep tour between farms and miradores",
      "Termales near Santa Rosa or San Vicente to soak after a hike",
    ],
    knowBeforeYouGo: [
      "Fly into Pereira (PEI) or Armenia (AXM); both are close",
      "Pack layers and a rain shell; mountain weather turns fast",
      "Cocora is busiest on weekends; go early on a weekday if you can",
      "A finca stay outside the pueblos is the magic; book ahead",
    ],
    costFrom: 720,
    costNote:
      "Rough per-person for 4 to 5 days, finca stay and the main experiences, double occupancy. International flights not included.",
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
    tagline: "Where the jungle meets the Caribbean and the Sierra Nevada looms.",
    intro: [
      "Tayrona is where the Sierra Nevada, the highest coastal mountain range on earth, tumbles straight into the Caribbean. The result is jungle trails that open onto boulder-framed turquoise coves, the kind of beach you thought only existed in screensavers. Santa Marta, the oldest city in Colombia, is the gateway and the base.",
      "Hike into the park, sleep in a hammock or ecohab, and use the mountain town of Minca above Santa Marta to cool off with coffee farms and waterfalls. For the ambitious, this is also the launch point for the Ciudad Perdida trek.",
    ],
    bestTime:
      "December to April is driest. Tayrona closes for ecological rest periods a few times a year, so always check the dates before you commit.",
    highlights: [
      "Hike to Cabo San Juan inside Tayrona National Park",
      "Hammock or ecohab night under the stars",
      "Minca for waterfalls, coffee farms, and sunset hammocks",
      "Taganga fishing village and nearby snorkeling",
      "The multi-day Ciudad Perdida (Lost City) trek for the adventurous",
    ],
    knowBeforeYouGo: [
      "Fly into Santa Marta (SMR); the park is about an hour away",
      "Swim only at flagged beaches; the currents are dangerous",
      "Bring cash, good shoes, and bug spray for the park",
      "Check Tayrona closure dates before booking anything",
    ],
    costFrom: 760,
    costNote:
      "Rough per-person for 3 to 4 days, stay, park, and transfers, double occupancy. International flights not included.",
  },
  {
    slug: "bogota",
    name: "Bogotá",
    region: "Andes",
    image: "/images/news/bogota.jpg",
    blurb:
      "The high-altitude capital: gold museums, graffiti, Monserrate views, and a food scene punching way above its weight.",
    bestFor: ["Museums", "Food", "City life"],
    idealDays: "2 to 3 days",
    tagline: "2,600 meters closer to the stars, and the gateway to everything.",
    intro: [
      "Bogotá is where most trips to Colombia begin, and it deserves more than a layover. The capital sits at 2,600 meters in the Andes, cool and grey and electric, with world-class museums, one of Latin America's best street-art scenes, and a restaurant scene that surprises everyone who writes the city off.",
      "Explore La Candelaria, the historic center, ride the funicular up Monserrate for the view over the endless city, and eat your way through Chapinero and Usaquén. It is also the hub flight for nearly everywhere else in the country.",
    ],
    bestTime:
      "December to March is the driest stretch. Bogotá is cool all year, around 50 to 65 F, so pack layers and a jacket no matter the season.",
    highlights: [
      "Museo del Oro and the Botero Museum",
      "Funicular or cable car up Monserrate at sunset",
      "A graffiti tour through La Candelaria",
      "Usaquén Sunday flea market and brunch",
      "Day trip to the Zipaquirá salt cathedral",
    ],
    knowBeforeYouGo: [
      "Fly into El Dorado (BOG), the main international gateway",
      "The altitude is real; take it easy and hydrate the first day",
      "It is colder than people expect; bring a jacket",
      "Great base for connecting flights to the coast and the regions",
    ],
    costFrom: 640,
    costNote:
      "Rough per-person for 2 to 3 days, central hotel and the main sights, double occupancy. International flights not included.",
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
    tagline: "The most colorful town in Colombia, beside a lake of green fingers.",
    intro: [
      "Guatapé is the most photogenic pueblo in Colombia: every house wrapped in painted zócalos, bright relief panels telling the town's stories, set beside a sprawling green reservoir. Just outside town, El Peñol is a 200-meter granite monolith with 740 steps to a view that genuinely does not look real.",
      "It is an easy two hours from Medellín, perfect as a day trip or an overnight to catch the town once the day-trippers leave and it turns quiet and magical.",
    ],
    bestTime:
      "Year-round, with the driest skies December to March and July to August. Weekdays are far calmer than weekends.",
    highlights: [
      "Climb the 740 steps up El Peñol for the reservoir view",
      "Wander the painted streets and the Plazoleta de los Zócalos",
      "A boat ride on the embalse",
      "Stay over to see the town empty out and glow at night",
      "Easy to combine with a Medellín base",
    ],
    knowBeforeYouGo: [
      "About two hours from Medellín by car or tour",
      "Do El Peñol early to beat the crowds and the heat",
      "An overnight beats a rushed day trip if you have the time",
      "Bring water for the climb; there are vendors at the top",
    ],
    costFrom: 320,
    costNote:
      "Rough per-person as a guided day trip or overnight from Medellín, double occupancy. International flights not included.",
  },
  {
    slug: "nuqui",
    name: "Nuquí & the Pacific",
    region: "Pacific Coast",
    image: "/images/destinations/nuqui.jpg",
    imageCredit: "Foto: Reduvida3 (CC BY-SA 4.0), Wikimedia Commons",
    blurb:
      "Wild Pacific Colombia: humpback whales, black-sand beaches, jungle rivers, and eco-lodges off the grid.",
    bestFor: ["Whales", "Nature", "Off the grid"],
    idealDays: "4 to 5 days",
    tagline: "The wild side: whales, rainforest, and the ocean at full volume.",
    intro: [
      "The Chocó Pacific is the Colombia almost nobody sees: roadless, rain-soaked, gloriously wild. Nuquí and Bahía Solano are reached only by small plane, and what waits is black-sand beaches, rainforest meeting the surf, natural hot springs, and the warm Afro-Colombian culture of the coast.",
      "From July to October, humpback whales arrive to calve and the ocean fills with breaching giants you can watch from the beach. Stay in an off-grid eco-lodge, eat fish pulled in that morning, and disconnect completely. This is bucket-list travel.",
    ],
    bestTime:
      "July to October for whale season, the main reason to go. It is one of the rainiest places on earth year-round, so embrace the rain; it is part of the magic.",
    highlights: [
      "Humpback whale watching in season (July to October)",
      "Termales hot springs tucked into the jungle",
      "Empty black-sand beaches and surf at Guachalito",
      "River trips and waterfall hikes with local guides",
      "Fresh Pacific seafood at an off-grid eco-lodge",
    ],
    knowBeforeYouGo: [
      "Reached only by small plane from Medellín or Quibdó",
      "Lodges are off-grid; expect limited power and no cell signal",
      "Pack a dry bag, quick-dry clothes, and a rain jacket",
      "Book the lodge and flights well ahead; capacity is small",
    ],
    costFrom: 1190,
    costNote:
      "Rough per-person for 4 to 5 days, eco-lodge, domestic flights, and guided trips, double occupancy. International flights not included.",
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

/** Look up one destination by slug. */
export function destinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
