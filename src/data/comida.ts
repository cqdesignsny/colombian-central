/**
 * Food content for /comida: recipes you can actually cook, and a directory of
 * real Colombian restaurants by US metro. Restaurant data researched June 2026;
 * confirm hours before relying on it. The page also offers a "find near you"
 * Google Maps search so it works wherever the visitor lives.
 */

export type Recipe = {
  name: string;
  region: string;
  time: string;
  difficulty: string;
  blurb: string;
  ingredients: string[];
  steps: string[];
};

export const recipes: Recipe[] = [
  {
    name: "Arepa de Queso",
    region: "Nacional",
    time: "20 min",
    difficulty: "Fácil",
    blurb: "The daily bread of Colombia. Crispy outside, warm and cheesy inside.",
    ingredients: [
      "2 cups masarepa (precooked white cornmeal)",
      "2 ½ cups warm water",
      "1 tsp salt",
      "1 cup grated mozzarella or queso fresco",
      "1 tbsp butter, plus more for cooking",
    ],
    steps: [
      "Mix masarepa, water and salt; let it rest 5 minutes until it forms a soft dough.",
      "Knead in the cheese and butter until smooth. If it cracks, add a splash of water.",
      "Divide into 6 balls and pat into discs about half an inch thick.",
      "Cook on a buttered skillet over medium heat, 4 to 5 minutes a side, until golden with toasted spots.",
      "Split and add more cheese or butter if you are feeling it. Eat hot.",
    ],
  },
  {
    name: "Bandeja Paisa",
    region: "Antioquia",
    time: "1 hr+ (beans overnight)",
    difficulty: "Intermedio",
    blurb: "The mountain of food that defines Antioquia. Not a meal, an event.",
    ingredients: [
      "Red beans (frijoles), cooked with a little pork",
      "White rice",
      "Ground beef (carne molida) finished in hogao",
      "Chicharrón (fried pork belly)",
      "Colombian chorizo",
      "One fried egg per plate",
      "Ripe plantain (maduro), fried",
      "An arepa and avocado slices",
    ],
    steps: [
      "Cook the red beans low and slow with a piece of pork until creamy (soak them the night before).",
      "Make white rice. Fry the chicharrón until it crackles. Grill the chorizo.",
      "Brown the ground beef and finish it in hogao (sautéed tomato and onion).",
      "Fry the ripe plantain until caramelized, and fry one egg per person.",
      "Build it: rice, beans, beef, chicharrón, chorizo, plantain, arepa, egg on top, avocado on the side.",
      "Serve with ají and a cold Colombiana. No me juzgues.",
    ],
  },
  {
    name: "Ajiaco Santafereño",
    region: "Bogotá",
    time: "1 hr",
    difficulty: "Intermedio",
    blurb: "Bogotá in a bowl. A three-potato chicken soup carried by guascas.",
    ingredients: [
      "2 bone-in chicken breasts",
      "Papa criolla plus two other potato types (Yukon gold works)",
      "2 ears of corn, halved",
      "A handful of guascas (the essential herb)",
      "Capers, heavy cream and avocado to serve",
      "Garlic, onion, cilantro, salt",
    ],
    steps: [
      "Simmer the chicken with onion, garlic and cilantro until cooked; shred it and keep the broth.",
      "Add the firmer potatoes and corn to the broth and cook 20 minutes.",
      "Add the papa criolla; it dissolves and thickens the soup, that is the point.",
      "Stir in the guascas in the last 10 minutes for that unmistakable flavor.",
      "Return the chicken. Serve hot with capers, a spoon of cream and avocado on the side.",
    ],
  },
  {
    name: "Empanadas Colombianas",
    region: "Nacional",
    time: "1 hr",
    difficulty: "Intermedio",
    blurb: "Golden, crunchy, and never just one. The national snack.",
    ingredients: [
      "2 cups yellow masarepa, 2 ¼ cups warm water, 1 tsp salt",
      "A pinch of achiote for color",
      "Filling: cooked potato mashed with seasoned ground beef and hogao",
      "Oil for frying",
      "Ají picante and lime to serve",
    ],
    steps: [
      "Make a smooth dough from masarepa, water, salt and achiote. Rest it 10 minutes.",
      "Mash the potato and mix with the beef and hogao for the filling.",
      "Roll the dough thin between plastic, cut circles, add filling, fold and seal the half-moon.",
      "Fry in hot oil until deep golden and crisp, a few minutes a side.",
      "Drain and serve immediately with ají and lime. Burn your mouth responsibly.",
    ],
  },
  {
    name: "Sancocho",
    region: "Nacional",
    time: "1.5 hr",
    difficulty: "Intermedio",
    blurb: "Sunday soup. The pot the whole family gathers around.",
    ingredients: [
      "Chicken, hen, beef or fish, depending on the region",
      "Yuca, green plantain and potato, in big chunks",
      "2 ears of corn, halved",
      "Guiso: onion, tomato, garlic, scallion, cilantro",
      "Cumin and salt; fresh cilantro to finish",
    ],
    steps: [
      "Build a guiso and brown your meat in it to start the flavor base.",
      "Cover with water and simmer until the meat is nearly tender.",
      "Add corn and plantain first (they take longest), then the yuca and potato.",
      "Cook until everything is fork-tender and the broth turns rich and cloudy.",
      "Finish with cilantro. Serve with white rice, avocado and lime on the side.",
    ],
  },
  {
    name: "Patacones",
    region: "Costa",
    time: "20 min",
    difficulty: "Fácil",
    blurb: "Twice-fried green plantain. Crunchy gold, eat it with everything.",
    ingredients: ["2 green plantains", "Oil for frying", "Salt", "Hogao or guacamole to serve"],
    steps: [
      "Peel the green plantains and cut into thick one-inch rounds.",
      "Fry in medium-hot oil until pale gold but not browned, about 3 minutes.",
      "Remove and smash each piece flat (a tostonera or the bottom of a cup works).",
      "Fry again until crisp and golden on both sides.",
      "Salt right away and serve hot with hogao, guacamole, or anything with sauce.",
    ],
  },
];

export type RestaurantMetro = {
  metro: string;
  /** Google Maps search for this area; the page also offers a generic near-you search. */
  mapsQuery: string;
  restaurants: { name: string; area: string; specialty: string }[];
};

export const restaurantsByMetro: RestaurantMetro[] = [
  {
    metro: "Miami / South Florida",
    mapsQuery: "colombian restaurant Doral Miami",
    restaurants: [
      { name: "El Cielo", area: "Brickell", specialty: "Michelin-starred Colombian tasting menu" },
      { name: "Mondongo's", area: "Doral", specialty: "Mondongo and a classic bandeja paisa" },
      { name: "Las Caleñitas", area: "Doral", specialty: "Colombian breakfasts and bakery" },
      { name: "Rincón Antioqueño", area: "Hialeah", specialty: "Paisa típico platters" },
    ],
  },
  {
    metro: "New York / Queens",
    mapsQuery: "colombian restaurant Jackson Heights Queens",
    restaurants: [
      { name: "Arepa Lady", area: "Jackson Heights", specialty: "Arepa de queso and de choclo" },
      { name: "Seba Seba", area: "Jackson Heights", specialty: "Loaded choclo arepas" },
      { name: "Pollos a la Brasa Mario", area: "Jackson Heights", specialty: "24-hour rotisserie chicken" },
      { name: "Mis Tierras Colombianas", area: "Jackson Heights", specialty: "Grilled meats and sancocho" },
    ],
  },
  {
    metro: "New Jersey",
    mapsQuery: "colombian restaurant Paterson Elizabeth NJ",
    restaurants: [
      { name: "Noches de Colombia", area: "Paterson · Elizabeth · Union City", specialty: "Bandeja paisa and chicharrón" },
      { name: "Rancho Mateo", area: "Elizabeth", specialty: "Colombian steakhouse" },
      { name: "Correita El Paisa", area: "Paterson", specialty: "Authentic bandeja paisa" },
    ],
  },
  {
    metro: "Houston",
    mapsQuery: "colombian restaurant Houston TX",
    restaurants: [
      { name: "La Fogata", area: "Houston", specialty: "Generous bandeja paisa" },
      { name: "Mi Pueblito", area: "Houston", specialty: "Broad Colombian menu" },
      { name: "La Olla", area: "Houston", specialty: "Fluffy arepas and bandeja paisa" },
    ],
  },
  {
    metro: "Los Angeles",
    mapsQuery: "colombian restaurant Los Angeles",
    restaurants: [
      { name: "La Fonda Antioqueña", area: "East LA", specialty: "Bandeja paisa and arepa de chócolo" },
      { name: "Rinconcito Colombiano", area: "Westlake", specialty: "Homestyle ajiaco and arepas" },
      { name: "Sabor Colombiano", area: "Westlake", specialty: "Sancocho and roast chicken" },
    ],
  },
  {
    metro: "Chicago",
    mapsQuery: "colombian restaurant Chicago",
    restaurants: [
      { name: "Pueblito Viejo", area: "Lincoln Square", specialty: "Churrasco, bandeja paisa, sancocho" },
      { name: "La Fonda Latino Grill", area: "Andersonville", specialty: "Arepas and grilled meats" },
      { name: "Arepa George", area: "Humboldt Park", specialty: "Arepas and empanadas" },
    ],
  },
  {
    metro: "Orlando",
    mapsQuery: "colombian restaurant Orlando",
    restaurants: [
      { name: "Bandeja Paisa Latin Restaurant", area: "S John Young Pkwy", specialty: "The namesake platter" },
      { name: "Super Rico Colombian", area: "Orlando", specialty: "Full menu and bar" },
      { name: "Aguardiente", area: "Orlando", specialty: "Colombian steakhouse" },
    ],
  },
  {
    metro: "Atlanta",
    mapsQuery: "colombian restaurant Atlanta Norcross",
    restaurants: [
      { name: "La Ruana", area: "Norcross", specialty: "Bandeja paisa, fresh arepas, sancocho" },
      { name: "Boca2", area: "Atlanta", specialty: "Empanadas, arepas, bandeja paisa" },
    ],
  },
  {
    metro: "Washington DC / NoVa",
    mapsQuery: "colombian restaurant Washington DC",
    restaurants: [
      { name: "El Cielo", area: "DC · La Cosecha", specialty: "Michelin-starred tasting menu" },
      { name: "Arepa Zone", area: "Washington DC", specialty: "Arepas, empanadas, patacones" },
      { name: "La Sazón de Julieta", area: "Annandale, VA", specialty: "Homestyle Colombian plates" },
    ],
  },
];

export type FoodWay = { title: string; desc: string; href: string; cta: string };

export const foodWays: FoodWay[] = [
  { title: "Cócinalo en casa", desc: "Real recipes, the way la abuela makes them.", href: "#recetas", cta: "Ver recetas" },
  { title: "Encuéntralo cerca", desc: "Colombian restaurants in your city, or find one near you.", href: "#restaurantes", cta: "Buscar" },
  { title: "Surte la despensa", desc: "Café de origen, bocadillo and staples, shipped from Miami.", href: "/tienda", cta: "La tienda" },
  { title: "Vívelo en Colombia", desc: "Eat your way through the country on a real trip.", href: "/viajes", cta: "Viajes" },
];

export const comidaIntro = {
  lede:
    "Food is how Colombians say te quiero. Cook it at home, find it in your city, or stock your pantry. From the arepa on every table to the bandeja that needs its own zip code, esto es comida de verdad.",
  heroImage: "/images/comida/hero.jpg",
};
