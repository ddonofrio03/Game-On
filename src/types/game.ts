export type LeagueId = "mlb" | "nfl" | "nba" | "nhl" | "epl" | "ucl" | "mls";

export type GameStatus = "live" | "upcoming" | "finished" | "postponed";

export type Broadcast = {
  /** Network or service name as ESPN reports it (e.g. "ESPN", "Peacock", "FOX"). */
  name: string;
  /** Type ESPN assigns: "tv" | "web" | "radio" | etc. */
  type?: string;
  /** True when carried on YouTube TV's standard package. */
  onYouTubeTV?: boolean;
};

export type TeamRef = {
  id: string;
  name: string;
  abbreviation?: string;
  logoUrl?: string;
  score?: string;
  record?: string;
};

export type Game = {
  id: string;
  league: LeagueId;
  /** ISO start time. */
  startTime: string;
  status: GameStatus;
  /** Short status detail like "Bot 7th", "Final/OT", "7:30 PM ET". */
  statusDetail?: string;
  /** Headline for non-team events (e.g. golf tournaments). */
  competition?: string;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  broadcasts: Broadcast[];
  venue?: string;
};

export type Team = {
  id: string;
  league: LeagueId;
  name: string;
  abbreviation?: string;
  location?: string;
  shortName?: string;
  logoUrl?: string;
};
