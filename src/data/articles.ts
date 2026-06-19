export type ArticleSection = "futbol" | "musica" | "comida" | "viajes" | "colombia";

export type Article = {
  slug: string;
  title: string;
  category: "Fútbol" | "Viajes" | "Gastronomía" | "Música" | "Café";
  /** Which section this article belongs to. Drives the per-section news strips. */
  section: ArticleSection;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  body: string[];
};

export const categoryColors: Record<Article["category"], string> = {
  Fútbol: "bg-amarillo text-ink",
  Viajes: "bg-azul text-paper",
  Gastronomía: "bg-rojo text-paper",
  Música: "bg-ink text-paper",
  Café: "bg-crema text-ink",
};

export const articles: Article[] = [
  {
    slug: "col-3-1-uzbekistan-debut",
    title: "Colombia 3-1 Uzbekistán: Un Debut de Mundial con Sello Propio",
    category: "Fútbol",
    section: "futbol",
    excerpt:
      "La Tricolor abrió su Mundial en el Azteca con goles de Daniel Muñoz, Luis Díaz y un cierre de Campaz en el descuento. Así fue el estreno.",
    date: "2026-06-17",
    readTime: "4 min",
    image: "/images/news/futbol-debut.jpg",
    featured: true,
    body: [
      "Colombia opened its 2026 World Cup the way the diaspora dreamed it: 3-1 over Uzbekistan at a roaring Estadio Azteca, with a very loud share of the 87,000 dressed in amarillo. Three points, a controlled performance, and the kind of start that settles the nerves for everything that comes next.",
      "Daniel Muñoz broke the deadlock in the 40th minute, rewarding the relentless running he gives down the right all game long. Uzbekistan, playing the first World Cup match in their history, refused to fold and leveled through Fayzullaev just after the hour. For about five minutes the Azteca held its breath.",
      "Then Luis Díaz did what Luis Díaz does. Luchito restored the lead in the 65th, the most electric Colombian attacker of his generation reminding everyone why defenders lose sleep over him. From there Colombia managed the tempo, and Jaminton Campaz put a bow on it deep into stoppage time, 90+9, for the 3-1 final.",
      "It is one game, and Néstor Lorenzo will be the first to say so. DR Congo on June 23 in Guadalajara is the classic trap match, and Portugal looms in Miami after that. But a winning debut with goals spread across the team and James pulling the strings is exactly the platform this group wanted. Vamos, mi selección.",
    ],
  },
  {
    slug: "grupo-k-breakdown",
    title: "Group K, Broken Down: Colombia's Road Through the 2026 World Cup",
    category: "Fútbol",
    section: "futbol",
    excerpt:
      "Portugal, Uzbekistan, DR Congo. Three matches, three cities, and a real shot at topping the group. Here is the honest read on each one.",
    date: "2026-06-08",
    readTime: "6 min",
    image: "/images/futbol-stadium.jpg",
    body: [
      "The draw gave Colombia Group K, and it could have been a lot worse. Portugal brings the star power, Uzbekistan brings the mystery, and DR Congo brings the athleticism. Three matches across two countries: two in Mexico, one in Miami that is going to feel like a home game.",
      "Match one is Uzbekistan at the Estadio Azteca on June 17. First World Cup in their history, and teams making their debut tend to play one of two ways: terrified or completely unburdened. Uzbekistan qualified out of Asia playing disciplined, compact football, and they will sit deep and make Colombia break them down. This is exactly the kind of game where Quintero or James between the lines decides everything. The Azteca holds 87,000 and on that night a very loud share of it will be wearing amarillo.",
      "Match two, June 23 against DR Congo at Estadio Akron in Guadalajara, is the trap game. The Leopards came through the playoff route, which means they have already survived more pressure than most teams in this tournament. They are fast, physical, and dangerous on the counter. If Colombia takes three points from the opener, the temptation to rotate will be real. Lorenzo does not strike anyone as a man who falls for temptation.",
      "Then the big one: Portugal at Hard Rock Stadium in Miami on June 27. On paper it decides first place. Off paper, Miami is the second-largest Colombian city in the United States, so the neutral venue is not going to be neutral. Portugal arrives as one of the tournament favorites with a golden generation in full bloom. Colombia arrives with the best squad it has had since 2014 and zero fear of anybody.",
      "The format helps: twelve groups of four, top two advance, plus the eight best third-place teams. Anything less than the knockout rounds would be a failure for this group of players, and they know it. Six points from the first two games makes the Portugal match a celebration with seeding implications. Vamos.",
    ],
  },
  {
    slug: "donde-ver-la-tricolor",
    title: "Where to Watch La Tricolor: The U.S. Watch Party Guide",
    category: "Fútbol",
    section: "futbol",
    excerpt:
      "From Jackson Heights to Kendall, the neighborhoods where Colombia takes over the sidewalk every match day. Plan accordingly, arrive early.",
    date: "2026-06-05",
    readTime: "5 min",
    image: "/images/news/futbol-watch-party.jpg",
    body: [
      "Watching Colombia play in a quiet living room is technically possible, the same way eating bandeja paisa with a fork and knife and no arepa is technically possible. You can do better. Every Colombian match this World Cup kicks off in U.S. prime time, which means the diaspora neighborhoods are going to be scenes.",
      "In New York, everything starts in Jackson Heights, Queens. Northern Boulevard and Roosevelt Avenue around 80th Street turn into an open-air stadium on match days: bakeries selling pandebono by the bag, bars dragging TVs onto the sidewalk, and at least one guy with a caja drum who never stops. Get there two hours before kickoff or accept standing room.",
      "Miami does not need instructions. Kendall, Doral, and Weston all claim to be the capital of Colombian Miami and on June 27 it will not matter, because everyone is driving to Hard Rock Stadium whether they have tickets or not. If you are watching on a screen, the lechonerías and panaderías along SW 8th Street and in Kendall start filling up before noon.",
      "Houston's Gessner corridor, the Paterson and Elizabeth areas in New Jersey, Chicago's northwest side, and LA's Pico-Union all have their own pockets of amarillo. The pattern is the same everywhere: find the Colombian bakery, and within two blocks there is a bar showing the game with the sound on.",
      "We are building a city-by-city watch party list for every Colombia match, updated through the tournament. It lands in El Boletín, our newsletter, the week of each game. Sign up at the bottom of this page and bring your jersey.",
    ],
  },
  {
    slug: "karol-g-tropitour",
    title: "Karol G Lleva su Tropitour a los Estadios de Estados Unidos",
    category: "Música",
    section: "musica",
    excerpt:
      "La Bichota convierte Tropicoqueta en una gira de estadios de costa a costa entre julio y octubre. Si vives cerca de uno, las entradas vuelan.",
    date: "2026-06-12",
    readTime: "4 min",
    image: "/images/news/karol-g.jpg",
    body: [
      "Karol G is doing the thing almost no Latina artist had done before her: headlining U.S. stadiums, not arenas, on her own name. The Tropitour brings Tropicoqueta to Chicago, Las Vegas, Los Angeles, San Francisco, Houston, Miami, Dallas and Boston between July and October 2026, and the cities with the biggest Colombian populations are exactly the ones selling out first.",
      "The rise is not an accident. La Bichota spent a decade turning Medellín perreo into something stadiums could hold, and Tropicoqueta leans harder into the tropical roots, cumbia, vallenato and salsa colors stitched into the reggaetón. It is the most Colombian record she has made, and live it plays like a block party that happens to have pyro.",
      "If you are going, the move is the same one abuela taught you: get there early. The pre-show parking-lot scene at these dates has become its own event, all amarillo and aguardiente and somebody's speaker playing the deep cuts. Bring the flag.",
      "We track every Colombian artist routing through the U.S. and flag when tickets drop in your city. The concerts list on this page stays current, and El Boletín carries the on-sale alerts the week they go live.",
    ],
  },
  {
    slug: "silvestre-dangond-arenas",
    title: "Silvestre Dangond Devuelve el Vallenato a las Arenas Gringas",
    category: "Música",
    section: "musica",
    excerpt:
      "El showman del acordeón suma fechas en Atlanta, Orlando y más. El vallenato moderno, en pleno apogeo en Estados Unidos.",
    date: "2026-06-10",
    readTime: "4 min",
    image: "/images/news/silvestre-dangond.jpg",
    body: [
      "For years the conventional wisdom was that vallenato filled clubs in the U.S., not arenas. Silvestre Dangond keeps proving the conventional wisdom wrong. His 2026 dates in Atlanta, Orlando and beyond are the kind of rooms reggaetón stars play, and he fills them with an accordion and a story.",
      "Dangond is the modern face of the genre, the one who took the music of Valledupar and gave it stadium showmanship without sanding off what makes it vallenato. A paseo about heartbreak still hits the same; he just delivers it to ten thousand people who know every word.",
      "It matters beyond one tour. When the costa's music sells out U.S. arenas, it tells promoters that the diaspora will show up for folclor, not only for urbano. That opens doors for the next generation of acordeoneros, and it keeps a UNESCO-recognized tradition loud and alive far from home.",
      "Tours move and dates get added, so confirm the latest before you buy. Our concerts list tracks the Colombian acts coming through the States, and we update it as new shows land.",
    ],
  },
  {
    slug: "vallenato-101",
    title: "Vallenato 101: Four Rhythms, One Accordion, Infinite Heartbreak",
    category: "Música",
    section: "musica",
    excerpt:
      "UNESCO calls it cultural heritage. Your tío calls it the only music worth playing after midnight. A beginner's guide to vallenato.",
    date: "2026-05-22",
    readTime: "6 min",
    image: "/images/vallenato.jpg",
    body: [
      "Vallenato is the sound of Colombia's Caribbean valleys: an accordion, a caja drum, a guacharaca scraper, and somebody's heart breaking in real time. It was farm-worker news delivery before it was music. Singers carried stories from town to town, and the stories happened to rhyme.",
      "There are four traditional airs, and once you can tell them apart you will never hear the genre the same way. Paseo is the storyteller, mid-tempo and melodic, the one you already know from a thousand family parties. Merengue vallenato runs faster and brighter. Puya is the showoff: blistering tempo, accordion players proving a point. Son is the slow burn, melancholy in 2/4, the one that comes out when the bottle is half empty.",
      "Every April, Valledupar hosts the Festival de la Leyenda Vallenata, where accordionists compete for the title of Rey Vallenato in front of crowds that treat a paseo the way Wembley treats a free kick. In 2015 UNESCO added vallenato to its list of Intangible Cultural Heritage in need of safeguarding, which is the formal way of saying: this matters, protect it.",
      "Start your education with the classics: Alejo Durán, the first Rey Vallenato. Diomedes Díaz, the most beloved and most complicated voice in the genre. Jorge Oñate, Los Hermanos Zuleta, Binomio de Oro for the romantic era. Then notice how much vallenato DNA lives inside modern Colombian pop. Carlos Vives built a career electrifying it, and half of Shakira's early catalog winks at it.",
      "Heard at the right hour, in the right company, with the accordion close enough to feel, vallenato stops being a genre and becomes a place. We will keep writing about the artists keeping it alive, from Valledupar to the Queens basement parties.",
    ],
  },
  {
    slug: "el-cielo-michelin",
    title: "El Cielo y la Estrella Michelin que Puso a Colombia en el Mapa",
    category: "Gastronomía",
    section: "comida",
    excerpt:
      "El restaurante del chef Juan Manuel Barrientos lleva la cocina colombiana a la mesa más alta, de Medellín a Miami y Washington DC.",
    date: "2026-06-09",
    readTime: "5 min",
    image: "/images/news/el-cielo.jpg",
    body: [
      "For a long time the world filed Colombian food under comfort, not fine dining. El Cielo argued otherwise, plate by plate, until the Michelin inspectors agreed. Chef Juan Manuel Barrientos built a tasting-menu experience that is unmistakably Colombian and unmistakably ambitious, and the recognition put a flag in the ground for an entire cuisine.",
      "The El Cielo experience is part dinner, part theater: the chocolate hand-wash, courses that play with memory and texture, and a through-line that keeps returning to Colombian ingredients and Colombian stories. It is molecular technique in service of sancocho-deep nostalgia, not the other way around.",
      "What makes it matter for the diaspora is the geography. With rooms in Miami and Washington DC, Barrientos put a Michelin-level Colombian table inside the United States, where most of us actually live. You no longer have to fly to Medellín to taste the high end of your own food.",
      "You do not need a tasting menu to eat well, of course. Our recipes cover the dishes every Colombian grew up on, and the restaurant finder maps the spots doing it right in your city. But it is worth knowing that the ceiling for Colombian cooking just got a lot higher, and a paisa chef is the one who raised it.",
    ],
  },
  {
    slug: "arepa-food-halls-eeuu",
    title: "La Arepa Conquista los Food Halls de Estados Unidos",
    category: "Gastronomía",
    section: "comida",
    excerpt:
      "De Jackson Heights a Doral, los puestos de arepas y empanadas se multiplican donde vive la diáspora. El antojo no perdona.",
    date: "2026-06-06",
    readTime: "4 min",
    image: "/images/news/arepa-food-halls.jpg",
    body: [
      "The arepa is having an American moment, and it earned it. What used to be a thing you made at home or hunted down in one specific neighborhood is now a fixture in food halls and weekend markets across the country, from Queens to Texas to the Carolinas.",
      "The blueprint goes back to vendors like the legendary Arepa Lady in Jackson Heights, who turned a corner griddle into an institution. A new generation took that energy into stalls with menus and merch: arepa de queso, arepa de huevo, choclo arepas loaded like nachos, all of it fast, cheap, and naturally gluten-free, which the American market happens to love.",
      "It is more than a trend line. Every new arepa counter is a small piece of Colombia planted where the diaspora can reach it on a Tuesday, and a doorway for everyone else to discover that corn can do this. The antojo, as we say, does not forgive.",
      "Want it the way la abuela makes it? Our arepa de queso recipe is a few ingredients and twenty minutes. Want someone else to do the work? The restaurant finder has the standout spots by city.",
    ],
  },
  {
    slug: "eje-cafetero-explicado",
    title: "The Coffee Axis, Explained: Why Region Changes Everything in Your Cup",
    category: "Café",
    section: "comida",
    excerpt:
      "Huila tastes nothing like Nariño, and neither tastes like Quindío. A field guide to Colombian coffee regions for people who drink it every day.",
    date: "2026-05-30",
    readTime: "7 min",
    image: "/images/cafe-finca.jpg",
    body: [
      "Colombia is the only major coffee origin where essentially all production is arabica, grown on smallholder farms, and picked by hand. That part you may know. What surprises people is how different the regions taste from each other. Colombian coffee is not one flavor. It is a country of microclimates arguing with each other, deliciously.",
      "The classic Eje Cafetero, the axis of Caldas, Quindío, and Risaralda, is where the postcard image comes from: Willys jeeps, bahareque farmhouses, valleys quilted with coffee rows. Cup profile: balanced, sweet, caramel and chocolate, medium body. This is the coffee that built Colombia's reputation, and pueblos like Salento and Filandia are the easiest places on earth to fall in love with the harvest.",
      "Huila, in the south, is the quality engine of modern Colombian specialty coffee. More awarded lots come out of Huila than anywhere else. Altitude runs high, the soil is volcanic, and the cup gets brighter: red fruit, panela sweetness, a juicy acidity that wakes up the back of your tongue. If a roaster lists a finca in Pitalito or Garzón, buy it.",
      "Nariño, pressed against the Ecuadorian border, grows coffee at altitudes that should not work, some lots above 2,200 meters. The cherries mature slowly in the thin air and the result is intensity: floral aromatics, citrus, a sparkling cup that tastes more like a fancy tea than a diner coffee. Sierra Nevada coffee from the north, much of it grown by Arhuaco and Kogui families, rounds out the map with earthy, cacao-heavy profiles.",
      "Once you taste the regions side by side, you stop drinking coffee on autopilot. Pick a bag that names where it is from, brew it black at least once, and pay attention. The finca worked hard for that cup, and the geography is right there in the flavor.",
    ],
  },
  {
    slug: "arepas-field-guide",
    title: "A Field Guide to Arepas: Know Your Regions, Respect the Corn",
    category: "Gastronomía",
    section: "comida",
    excerpt:
      "Paisa, de huevo, de choclo, boyacense, santandereana. A loving taxonomy of Colombia's daily bread and where each style rules.",
    date: "2026-05-08",
    readTime: "5 min",
    image: "/images/comida/empanadas.jpg",
    body: [
      "Few foods carry as much regional pride per gram as the arepa. It predates the country by a few thousand years, it appears at every meal without apology, and every region is certain theirs is correct. They are all correct. This is a guide, not a ranking, although we do have opinions.",
      "The arepa paisa is the minimalist of the family: thin, white corn, grilled, no filling, often crowned with butter and salty quesito. It is Antioquia's daily bread and the supporting actor on every bandeja paisa. Outsiders call it plain. Paisas call it perfect, and after the third one with hot chocolate you will agree.",
      "The arepa de huevo is the Caribbean coast showing off. Yellow corn dough, deep fried until it puffs, cracked open, a whole egg poured inside, then fried again. It is breakfast, street food, and an engineering achievement at once. Luruaco, a town between Barranquilla and Cartagena, holds an entire festival in its honor every year.",
      "Arepa de choclo is the sweet one: young corn, almost a pancake, folded around a slab of melting cheese, sold from roadside grills on every mountain highway in the country. Boyacá's arepa boyacense bakes sweetness into the dough itself. And the arepa santandereana goes the other way entirely: yellow corn ground with yuca and chicharrón, sturdy and smoky, built to survive a workday in the Santander heat.",
      "Whichever region you claim, the rule is the same: an arepa is not a side. It is the point. Start with our arepa de queso recipe, then work your way across the map.",
    ],
  },
  {
    slug: "cali-sucursal-del-cielo",
    title: "Cali, la Sucursal del Cielo: Guía de la Capital de la Salsa",
    category: "Viajes",
    section: "viajes",
    excerpt:
      "Salsa hasta el amanecer, el mejor clima de Colombia y una calidez que no se finge. Por qué Cali tiene que estar en tu próximo viaje.",
    date: "2026-06-03",
    readTime: "6 min",
    image: "/images/destinations/cali.jpg",
    body: [
      "Cali does not ease you in. The heat hits, the music is already playing somewhere, and within an hour you understand why it calls itself la sucursal del cielo, heaven's branch office. It is the salsa capital of the world, full stop, and the city wears that title in its hips, not just on a sign.",
      "Start in Barrio San Antonio, the colonial hill with the views, the cafés, and the artisans, then come back down for the real reason you are here: the salsa. Juanchito is the legendary nightlife strip, but the move for a first-timer is a class plus a guided salsa night, because caleños dance at a level that will humble you and welcome you in the same song.",
      "The food is its own argument for the trip: chontaduro with salt and honey from a street cart, champús and lulada to cool down, sancocho de gallina on a Sunday, and the cholado, a riot of fruit and shaved ice. The climate stays warm and bright most of the year, which is part of why the city never really stops.",
      "If your timing lines up, the Feria de Cali around Christmas is one of the great parties in the Americas: salsódromo parades, orchestras, and a whole city in the street. Cali also opens doors to the Pacific and to haciendas in the Valle del Cauca, so it slots neatly into a bigger southern-Colombia trip.",
      "Ready to add it to a route? Tell us what you want out of the trip and we build it around you, salsa lessons and all. Start a quote and a Colombian who has danced in Juanchito will plan it with you.",
    ],
  },
  {
    slug: "primer-viaje-10-dias",
    title: "Your First Colombia Trip: Cartagena to Tayrona in 10 Days",
    category: "Viajes",
    section: "viajes",
    excerpt:
      "The Caribbean starter route: walled-city nights, island days, jungle beaches. The itinerary we recommend to every first-timer who asks.",
    date: "2026-05-15",
    readTime: "8 min",
    image: "/images/tayrona.jpg",
    body: [
      "Everyone's first Colombia question is the same: where do I even start? The country is the size of Texas and France combined and the regions feel like different planets. Our default answer for a first trip is the Caribbean run: Cartagena, the Rosario Islands, Santa Marta, and Tayrona. Ten days, one coastline, zero regrets.",
      "Days one through four belong to Cartagena. Stay inside the walled city or in Getsemaní, which has gone from rough to the best neighborhood for travelers in the entire country. Mornings are for the old city before the heat, afternoons for pool or siesta, evenings for the plazas when the light goes gold and the palenqueras balance fruit bowls past four-hundred-year-old balconies. Take the Rosario Islands boat day from the marina: an hour out, the water turns the kind of blue that ruins other beaches for you.",
      "Day five, move along the coast to Santa Marta, four hours by private transfer or a quick flight. Santa Marta itself is a working port city with a charming historic core, but its real job is being the gateway. Base yourself there or in the fishing village of Taganga, and if your dates line up, catch a sunset at the Marina with juice from a stand named after somebody's mother.",
      "Days six through eight are Tayrona National Park. Enter at El Zaino, walk the jungle trail an hour through monkeys and absurd birdsong until the trees open onto Arrecifes and then Cabo San Juan: boulders the size of houses, palms leaning into turquoise water. Sleep in a hammock or an ecohab if you booked early. Swim only where flagged, the currents are serious. It is the single most beautiful place most visitors see in Colombia, and it is not close.",
      "Days nine and ten, decompress. Minca, a mountain town forty minutes above Santa Marta, does coffee farms, waterfalls, and the best sunset hammocks in the Sierra Nevada. Then fly home out of Santa Marta or Cartagena. You will spend the flight planning the second trip, because now you know: Medellín, the Eje Cafetero, and the Pacific are all still out there. That is how Colombia gets you.",
    ],
  },
  {
    slug: "mejor-epoca-viajar-colombia",
    title: "La Mejor Época para Viajar a Colombia, Región por Región",
    category: "Viajes",
    section: "viajes",
    excerpt:
      "Colombia no tiene estaciones, tiene microclimas. Una guía honesta de cuándo ir a cada zona para encontrar el mejor clima.",
    date: "2026-06-01",
    readTime: "5 min",
    image: "/images/news/mejor-epoca.jpg",
    body: [
      "Here is the thing nobody tells first-time visitors: Colombia has no summer or winter. Sitting on the equator, it has dry seasons and wet seasons, and which one you hit depends entirely on the region and the altitude, not the month on your ticket. Pack for the place, not the date.",
      "For the Caribbean coast, Cartagena, Santa Marta and Tayrona, the sweet spot is roughly December through April, when the skies are clearest and the sea is calm. It is also peak season and peak prices, so book early. Tayrona sometimes closes for ecological rest periods during the year, so check before you commit to it.",
      "The Andean cities, Bogotá, Medellín and the coffee region, run on two drier windows, around December to March and again in July and August. Bogotá is cool year-round, Medellín earns its eternal-spring nickname, and the Eje Cafetero is green because it rains often, so expect afternoon showers no matter when you go. Cali stays warm and bright most of the year.",
      "The Pacific is its own calendar. The whale-watching season off Nuquí and Bahía Solano runs roughly July through October, when humpbacks come to calve, and that is the reason to go. The Amazon is humid all year with a high-water season early in the year and a low-water season mid-year, each offering different ways to explore.",
      "The honest summary: there is no bad time to visit Colombia, only better times for specific regions and experiences. Tell us what you want to do and when you can travel, and we will steer you to the part of the country that is at its best that week.",
    ],
  },
];

/** Articles for a given section, newest first. Powers the per-section news strips. */
export function articlesForSection(
  section: ArticleSection,
  limit?: number,
): Article[] {
  const list = articles
    .filter((a) => a.section === section)
    .sort((a, b) => b.date.localeCompare(a.date));
  return typeof limit === "number" ? list.slice(0, limit) : list;
}
