import type { LeagueId } from "@/types/game";

export type LeagueConfig = {
  id: LeagueId;
  label: string;
  short: string;
  /** ESPN scoreboard endpoint. */
  endpoint: string;
  /** Tailwind color class for the league chip border/accent. */
  accentClass: string;
  /** Hex color for inline SVGs / charts. */
  accent: string;
};

export const LEAGUES: LeagueConfig[] = [
  {
    id: "mlb",
    label: "MLB",
    short: "MLB",
    endpoint: "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",
    accentClass: "border-blue-500",
    accent: "#3b82f6",
  },
  {
    id: "nfl",
    label: "NFL",
    short: "NFL",
    endpoint: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
    accentClass: "border-amber-500",
    accent: "#f59e0b",
  },
  {
    id: "nba",
    label: "NBA",
    short: "NBA",
    endpoint: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
    accentClass: "border-orange-500",
    accent: "#f97316",
  },
  {
    id: "nhl",
    label: "NHL",
    short: "NHL",
    endpoint: "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard",
    accentClass: "border-cyan-400",
    accent: "#22d3ee",
  },
  {
    id: "epl",
    label: "Premier League",
    short: "EPL",
    endpoint: "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard",
    accentClass: "border-purple-500",
    accent: "#a855f7",
  },
  {
    id: "ucl",
    label: "Champions League",
    short: "UCL",
    endpoint: "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard",
    accentClass: "border-indigo-500",
    accent: "#6366f1",
  },
  {
    id: "mls",
    label: "MLS",
    short: "MLS",
    endpoint: "https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard",
    accentClass: "border-emerald-500",
    accent: "#10b981",
  },
];

export const LEAGUE_BY_ID = Object.fromEntries(
  LEAGUES.map((l) => [l.id, l]),
) as Record<LeagueId, LeagueConfig>;
