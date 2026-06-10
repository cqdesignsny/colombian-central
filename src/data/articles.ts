export type Article = {
  slug: string;
  title: string;
  category: "Fútbol" | "Viajes" | "Gastronomía" | "Música" | "Café";
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
    slug: "grupo-k-breakdown",
    title: "Group K, Broken Down: Colombia's Road Through the 2026 World Cup",
    category: "Fútbol",
    excerpt:
      "Portugal, Uzbekistan, DR Congo. Three matches, three cities, and a real shot at topping the group. Here is the honest read on each one.",
    date: "2026-06-08",
    readTime: "6 min",
    image: "/images/futbol-stadium.jpg",
    featured: true,
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
    excerpt:
      "From Jackson Heights to Kendall, the neighborhoods where Colombia takes over the sidewalk every match day. Plan accordingly, arrive early.",
    date: "2026-06-05",
    readTime: "5 min",
    image: "/images/vallenato.jpg",
    body: [
      "Watching Colombia play in a quiet living room is technically possible, the same way eating bandeja paisa with a fork and knife and no arepa is technically possible. You can do better. Every Colombian match this World Cup kicks off in U.S. prime time, which means the diaspora neighborhoods are going to be scenes.",
      "In New York, everything starts in Jackson Heights, Queens. Northern Boulevard and Roosevelt Avenue around 80th Street turn into an open-air stadium on match days: bakeries selling pandebono by the bag, bars dragging TVs onto the sidewalk, and at least one guy with a caja drum who never stops. Get there two hours before kickoff or accept standing room.",
      "Miami does not need instructions. Kendall, Doral, and Weston all claim to be the capital of Colombian Miami and on June 27 it will not matter, because everyone is driving to Hard Rock Stadium whether they have tickets or not. If you are watching on a screen, the lechonerías and panaderías along SW 8th Street and in Kendall start filling up before noon.",
      "Houston's Gessner corridor, the Paterson and Elizabeth areas in New Jersey, Chicago's northwest side, and LA's Pico-Union all have their own pockets of amarillo. The pattern is the same everywhere: find the Colombian bakery, and within two blocks there is a bar showing the game with the sound on.",
      "We are building a city-by-city watch party list for every Colombia match, updated through the tournament. It lands in El Boletín, our newsletter, the week of each game. Sign up at the bottom of this page and bring your jersey.",
    ],
  },
  {
    slug: "eje-cafetero-explicado",
    title: "The Coffee Axis, Explained: Why Region Changes Everything in Your Cup",
    category: "Café",
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
      "Our shop carries a rotating single origin so you can taste the argument yourself. Right now it is a washed Huila from family fincas, roasted weekly. Drink it black at least once. The finca worked hard for that cup.",
    ],
  },
  {
    slug: "vallenato-101",
    title: "Vallenato 101: Four Rhythms, One Accordion, Infinite Heartbreak",
    category: "Música",
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
    slug: "primer-viaje-10-dias",
    title: "Your First Colombia Trip: Cartagena to Tayrona in 10 Days",
    category: "Viajes",
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
    slug: "arepas-field-guide",
    title: "A Field Guide to Arepas: Know Your Regions, Respect the Corn",
    category: "Gastronomía",
    excerpt:
      "Paisa, de huevo, de choclo, boyacense, santandereana. A loving taxonomy of Colombia's daily bread and where each style rules.",
    date: "2026-05-08",
    readTime: "5 min",
    image: "/images/bandeja-paisa.jpg",
    body: [
      "Few foods carry as much regional pride per gram as the arepa. It predates the country by a few thousand years, it appears at every meal without apology, and every region is certain theirs is correct. They are all correct. This is a guide, not a ranking, although we do have opinions.",
      "The arepa paisa is the minimalist of the family: thin, white corn, grilled, no filling, often crowned with butter and salty quesito. It is Antioquia's daily bread and the supporting actor on every bandeja paisa. Outsiders call it plain. Paisas call it perfect, and after the third one with hot chocolate you will agree.",
      "The arepa de huevo is the Caribbean coast showing off. Yellow corn dough, deep fried until it puffs, cracked open, a whole egg poured inside, then fried again. It is breakfast, street food, and an engineering achievement at once. Luruaco, a town between Barranquilla and Cartagena, holds an entire festival in its honor every year.",
      "Arepa de choclo is the sweet one: young corn, almost a pancake, folded around a slab of melting cheese, sold from roadside grills on every mountain highway in the country. Boyacá's arepa boyacense bakes sweetness into the dough itself. And the arepa santandereana goes the other way entirely: yellow corn ground with yuca and chicharrón, sturdy and smoky, built to survive a workday in the Santander heat.",
      "The shop carries budares and the patience required to get the char right is sold separately. Whichever region you claim, the rule is the same: an arepa is not a side. It is the point.",
    ],
  },
];
