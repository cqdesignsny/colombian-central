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
      note: "Seventh World Cup. Unbeaten run through the end of qualifying and a squad in its prime.",
    },
    {
      name: "Portugal",
      code: "POR",
      note: "The heavyweight of the group and one of the tournament favorites.",
    },
    {
      name: "Uzbekistan",
      code: "UZB",
      note: "First World Cup in their history. Organized, disciplined, nothing to lose.",
    },
    {
      name: "DR Congo",
      code: "COD",
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
  captain?: boolean;
};

export const squad = {
  coach: "Néstor Lorenzo",
  note: "The core of the squad headed to the Mundial. The final 26-man list gets its own breakdown in Noticias.",
  players: [
    { name: "Camilo Vargas", position: "GK", line: "The veteran wall. Calm when it gets loud." },
    { name: "Kevin Mier", position: "GK", line: "The next generation between the posts." },
    { name: "Daniel Muñoz", position: "RB", line: "Relentless up and down the right side." },
    { name: "Dávinson Sánchez", position: "CB", line: "Strength and recovery speed at the back." },
    { name: "Jhon Lucumí", position: "CB", line: "Composed on the ball, aggressive in the duel." },
    { name: "Johan Mojica", position: "LB", line: "Width, crosses, and big-game experience." },
    { name: "Jefferson Lerma", position: "CDM", line: "The anchor. Wins everything in the middle." },
    { name: "Richard Ríos", position: "CM", line: "Box-to-box engine with flair to spare." },
    {
      name: "James Rodríguez",
      position: "CAM",
      line: "El capitán. Golden Boot winner in 2014, still the brain of the team.",
      captain: true,
    },
    { name: "Juan Fernando Quintero", position: "CAM", line: "A left foot that unlocks parked buses." },
    { name: "Luis Díaz", position: "LW", line: "Luchito. The most electric Colombian attacker of his generation." },
    { name: "Jhon Arias", position: "RW", line: "Direct, brave, and in the form of his life." },
    { name: "Luis Suárez", position: "ST", line: "Four goals in a single qualifier. Enough said." },
    { name: "Jhon Durán", position: "ST", line: "Raw power and a rocket of a left foot." },
    { name: "Rafael Santos Borré", position: "ST", line: "The worker. Presses, finishes, repeats." },
  ] satisfies Player[],
};
