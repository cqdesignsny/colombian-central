export type Fixture = {
  matchday: number;
  opponent: string;
  opponentCode: string;
  colombiaHome: boolean;
  /** Kickoff in U.S. Eastern Time */
  kickoff: string;
  venue: string;
  city: string;
  tv: string;
};

export const worldCup = {
  tournament: "FIFA World Cup 2026",
  group: "K",
  /** Colombia's first match. Used for the countdown. */
  debutKickoff: "2026-06-17T22:00:00-04:00",
  format:
    "Twelve groups of four. The top two in each group advance to the round of 32, along with the eight best third-place teams.",
  groupTeams: [
    {
      name: "Colombia",
      code: "COL",
      flag: "/images/flags/colombia.svg",
      note: "Seventh World Cup. Unbeaten run through the end of qualifying and a squad in its prime.",
    },
    {
      name: "Portugal",
      code: "POR",
      flag: "/images/flags/portugal.svg",
      note: "The heavyweight of the group and one of the tournament favorites.",
    },
    {
      name: "Uzbekistan",
      code: "UZB",
      flag: "/images/flags/uzbekistan.svg",
      note: "First World Cup in their history. Organized, disciplined, nothing to lose.",
    },
    {
      name: "DR Congo",
      code: "COD",
      flag: "/images/flags/drcongo.svg",
      note: "Came through the playoff gauntlet. Athletic and dangerous in transition.",
    },
  ],
  fixtures: [
    {
      matchday: 1,
      opponent: "Uzbekistan",
      opponentCode: "UZB",
      colombiaHome: false,
      kickoff: "2026-06-17T22:00:00-04:00",
      venue: "Estadio Azteca",
      city: "Mexico City",
      tv: "FS1",
    },
    {
      matchday: 2,
      opponent: "DR Congo",
      opponentCode: "COD",
      colombiaHome: true,
      kickoff: "2026-06-23T22:00:00-04:00",
      venue: "Estadio Akron",
      city: "Guadalajara",
      tv: "FS1",
    },
    {
      matchday: 3,
      opponent: "Portugal",
      opponentCode: "POR",
      colombiaHome: true,
      kickoff: "2026-06-27T19:30:00-04:00",
      venue: "Hard Rock Stadium",
      city: "Miami",
      tv: "FOX",
    },
  ] satisfies Fixture[],
  kickoffNote: "All times U.S. Eastern.",
};

export type Player = {
  name: string;
  position: string;
  line: string;
  /** Headshot under /public. Creative Commons (Wikimedia). Optional; cards fall back to initials. */
  image?: string;
  captain?: boolean;
};

export const squad = {
  coach: "Néstor Lorenzo",
  note: "The core of the squad headed to the Mundial. The final 26-man list gets its own breakdown in Noticias.",
  players: [
    { name: "Camilo Vargas", position: "GK", line: "The veteran wall. Calm when it gets loud.", image: "/images/players/vargas.jpg" },
    { name: "Kevin Mier", position: "GK", line: "The next generation between the posts." },
    { name: "Daniel Muñoz", position: "RB", line: "Relentless up and down the right side.", image: "/images/players/munoz.jpg" },
    { name: "Dávinson Sánchez", position: "CB", line: "Strength and recovery speed at the back.", image: "/images/players/davinson.jpg" },
    { name: "Jhon Lucumí", position: "CB", line: "Composed on the ball, aggressive in the duel.", image: "/images/players/lucumi.jpg" },
    { name: "Johan Mojica", position: "LB", line: "Width, crosses, and big-game experience.", image: "/images/players/mojica.jpg" },
    { name: "Jefferson Lerma", position: "CDM", line: "The anchor. Wins everything in the middle.", image: "/images/players/lerma.jpg" },
    { name: "Richard Ríos", position: "CM", line: "Box-to-box engine with flair to spare.", image: "/images/players/rios.jpg" },
    {
      name: "James Rodríguez",
      position: "CAM",
      line: "El capitán. Golden Boot winner in 2014, still the brain of the team.",
      image: "/images/players/james.jpg",
      captain: true,
    },
    { name: "Juan Fernando Quintero", position: "CAM", line: "A left foot that unlocks parked buses.", image: "/images/players/quintero.jpg" },
    { name: "Luis Díaz", position: "LW", line: "Luchito. The most electric Colombian attacker of his generation.", image: "/images/players/luis-diaz.jpg" },
    { name: "Jhon Arias", position: "RW", line: "Direct, brave, and in the form of his life.", image: "/images/players/arias.jpg" },
    { name: "Luis Suárez", position: "ST", line: "Four goals in a single qualifier. Enough said.", image: "/images/players/luis-suarez.jpg" },
    { name: "Jhon Durán", position: "ST", line: "Raw power and a rocket of a left foot.", image: "/images/players/duran.jpg" },
    { name: "Rafael Santos Borré", position: "ST", line: "The worker. Presses, finishes, repeats.", image: "/images/players/borre.jpg" },
  ] satisfies Player[],
};
