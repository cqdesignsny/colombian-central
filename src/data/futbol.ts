/** A goal in a played match. `team` is from Colombia's point of view. */
export type Goal = { team: "COL" | "OPP"; name: string; minute: string };

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
  /** Set once the match is played. `status` is "FT" (final) or "HT". */
  result?: { colombia: number; opponent: number; status: "FT" | "HT" };
  /** Optional scorer list, in order. Verify against a real source before editing. */
  goals?: Goal[];
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
      result: { colombia: 3, opponent: 1, status: "FT" },
      goals: [
        { team: "COL", name: "Daniel Muñoz", minute: "40'" },
        { team: "OPP", name: "Fayzullaev", minute: "60'" },
        { team: "COL", name: "Luis Díaz", minute: "65'" },
        { team: "COL", name: "Jaminton Campaz", minute: "90'+9'" },
      ],
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

/**
 * The next match still to be played: the first fixture without a result.
 * Returns null once all group games are done. Drives the countdown so it
 * never sticks on a match that already kicked off.
 */
export function nextFixture(): Fixture | null {
  return worldCup.fixtures.find((f) => !f.result) ?? null;
}

/** The most recent played match (last fixture that has a result), or null. */
export function lastPlayed(): Fixture | null {
  const played = worldCup.fixtures.filter((f) => f.result);
  return played.length ? played[played.length - 1]! : null;
}

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
  coachImage: "/images/players/lorenzo.avif",
  coachLine:
    "El arquitecto. Calm, clear, and the man who turned a golden generation into a real team. The unbeaten qualifying run carries his fingerprint.",
  note: "Los 26 que van al Mundial. La Tricolor de Néstor Lorenzo, nombre por nombre.",
  players: [
    { name: "David Ospina", position: "GK", line: "El histórico. A thousand games of calm between the posts.", image: "/images/players/ospina.avif" },
    { name: "Camilo Vargas", position: "GK", line: "The veteran wall. Calm when it gets loud.", image: "/images/players/vargas.avif" },
    { name: "Álvaro Montero", position: "GK", line: "Grew into a wall in Liga MX. Ready if called.", image: "/images/players/montero.avif" },
    { name: "Daniel Muñoz", position: "RB", line: "Relentless up and down the right side.", image: "/images/players/munoz.avif" },
    { name: "Santiago Arias", position: "RB", line: "Veteran legs and know-how on the flank.", image: "/images/players/santiago-arias.avif" },
    { name: "Johan Mojica", position: "LB", line: "Width, crosses, and big-game experience.", image: "/images/players/mojica.avif" },
    { name: "Deiver Machado", position: "LB", line: "A left foot and an engine down the wing.", image: "/images/players/machado.avif" },
    { name: "Dávinson Sánchez", position: "CB", line: "Strength and recovery speed at the back.", image: "/images/players/davinson.avif" },
    { name: "Jhon Lucumí", position: "CB", line: "Composed on the ball, aggressive in the duel.", image: "/images/players/lucumi.avif" },
    { name: "Yerry Mina", position: "CB", line: "Presence, aerial threat, and a set-piece weapon.", image: "/images/players/mina.avif" },
    { name: "Willer Ditta", position: "CB", line: "Hard-nosed marking, no fear.", image: "/images/players/ditta.avif" },
    { name: "Gustavo Puerta", position: "CDM", line: "Balance and legs from deep.", image: "/images/players/puerta.avif" },
    { name: "Jefferson Lerma", position: "CDM", line: "The anchor. Wins everything in the middle.", image: "/images/players/lerma.avif" },
    { name: "Juan Portilla", position: "CDM", line: "Recovers the ball and keeps it moving.", image: "/images/players/portilla.avif" },
    { name: "Richard Ríos", position: "CM", line: "Box-to-box engine with flair to spare.", image: "/images/players/rios.avif" },
    { name: "Kevin Castaño", position: "CM", line: "Young, dynamic, here to stay.", image: "/images/players/castano.avif" },
    { name: "Jorge Carrascal", position: "CAM", line: "Dribbles and the final pass, pura fantasía.", image: "/images/players/carrascal.avif" },
    {
      name: "James Rodríguez",
      position: "CAM",
      line: "El capitán. Golden Boot winner in 2014, still the brain of the team.",
      image: "/images/players/james.avif",
      captain: true,
    },
    { name: "Juan Fernando Quintero", position: "CAM", line: "A left foot that unlocks parked buses.", image: "/images/players/quintero.avif" },
    { name: "Jhon Arias", position: "RW", line: "Direct, brave, and in the form of his life.", image: "/images/players/jhon-arias.avif" },
    { name: "Luis Díaz", position: "LW", line: "Luchito. The most electric Colombian attacker of his generation.", image: "/images/players/luis-diaz.avif" },
    { name: "Jaminton Campaz", position: "LW", line: "Trickery and drive off the wing.", image: "/images/players/campaz.avif" },
    { name: "Andrés Gómez", position: "RW", line: "Pace and daring, the new blood.", image: "/images/players/gomez.avif" },
    { name: "Luis Suárez", position: "ST", line: "Four goals in a single qualifier. Enough said.", image: "/images/players/luis-suarez.avif" },
    { name: "Cucho Hernández", position: "ST", line: "Movement, goals, and a lethal left foot.", image: "/images/players/cucho.avif" },
    { name: "Jhon Córdoba", position: "ST", line: "Raw power and a striker's instinct.", image: "/images/players/cordoba.avif" },
  ] satisfies Player[],
};
