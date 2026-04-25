/* eslint-disable @typescript-eslint/no-explicit-any -- ESPN's public scoreboard API isn't typed. */
import type { Broadcast, Game, GameStatus, LeagueId, Team, TeamRef } from "@/types/game";
import { LEAGUE_BY_ID, LEAGUES } from "./leagues";

const TEAM_ENDPOINTS: Record<LeagueId, string> = {
  mlb: "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams?limit=40",
  nfl: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams?limit=40",
  nba: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams?limit=40",
  nhl: "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams?limit=40",
  epl: "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams?limit=40",
  ucl: "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/teams?limit=40",
  mls: "https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/teams?limit=40",
};

const YOUTUBE_TV_NETWORKS = [
  "abc",
  "cbs",
  "espn",
  "espn2",
  "espnu",
  "fox",
  "fs1",
  "fs2",
  "nbc",
  "nfl network",
  "nba tv",
  "tnt",
  "tbs",
  "truetv",
  "golf channel",
  "mlb network",
  "nhl network",
  "nbc sports",
  "big ten network",
  "sec network",
  "usa",
  "fox deportes",
];

function mapStatus(name: string): GameStatus {
  if (name === "STATUS_IN_PROGRESS" || name === "STATUS_HALFTIME" || name === "STATUS_END_PERIOD") {
    return "live";
  }
  if (name === "STATUS_FINAL" || name === "STATUS_FULL_TIME") return "finished";
  if (name === "STATUS_POSTPONED" || name === "STATUS_CANCELED" || name === "STATUS_DELAYED") {
    return "postponed";
  }
  return "upcoming";
}

function teamFrom(competitor: any): TeamRef {
  const team = competitor?.team ?? {};
  return {
    id: team.id ?? competitor?.id ?? "",
    name: team.displayName ?? team.shortDisplayName ?? "TBD",
    abbreviation: team.abbreviation,
    logoUrl: team.logo,
    score: competitor?.score,
    record: competitor?.records?.[0]?.summary,
  };
}

function broadcastsFrom(comp: any): Broadcast[] {
  const fromBroadcasts: Array<{ name: string; type?: string }> =
    comp?.broadcasts?.flatMap((b: any) =>
      (b.names ?? []).map((name: string) => ({ name, type: b.type })),
    ) ?? [];

  const fromGeo: Array<{ name: string; type?: string }> =
    comp?.geoBroadcasts?.flatMap((b: any) => {
      const name = b?.media?.shortName ?? b?.media?.name;
      if (!name) return [];
      return [{ name, type: b?.type?.shortName ?? b?.type?.id }];
    }) ?? [];

  const seen = new Set<string>();
  const merged: Broadcast[] = [];
  for (const b of [...fromBroadcasts, ...fromGeo]) {
    const trimmed = b.name?.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push({
      name: trimmed,
      type: b.type,
      onYouTubeTV: YOUTUBE_TV_NETWORKS.some((n) => key.includes(n)),
    });
  }
  return merged;
}

/**
 * Fetch one league's scoreboard for a given date (YYYYMMDD). When `dates` is
 * omitted ESPN returns "today" in US Eastern, which is what we want for the
 * default scores/today views.
 */
export async function fetchLeague(
  league: LeagueId,
  opts: { dates?: string; signal?: AbortSignal } = {},
): Promise<Game[]> {
  const cfg = LEAGUE_BY_ID[league];
  const url = new URL(cfg.endpoint);
  if (opts.dates) url.searchParams.set("dates", opts.dates);

  const res = await fetch(url, {
    signal: opts.signal,
    next: { revalidate: 30 },
  });
  if (!res.ok) {
    throw new Error(`ESPN ${league} ${res.status}`);
  }
  const data = await res.json();

  return (data.events ?? []).map((event: any): Game => {
    const comp = event.competitions?.[0] ?? {};
    const home = comp.competitors?.find((c: any) => c.homeAway === "home") ?? {};
    const away = comp.competitors?.find((c: any) => c.homeAway === "away") ?? {};
    return {
      id: event.id,
      league,
      startTime: comp.date ?? event.date ?? new Date().toISOString(),
      status: mapStatus(comp.status?.type?.name ?? ""),
      statusDetail: comp.status?.type?.shortDetail ?? comp.status?.type?.detail,
      competition: event.shortName ?? event.name,
      homeTeam: teamFrom(home),
      awayTeam: teamFrom(away),
      broadcasts: broadcastsFrom(comp),
      venue: comp.venue?.fullName,
    };
  });
}

/** Fetch every configured league in parallel. Failures yield an empty list for that league only. */
export async function fetchAllLeagues(opts: { dates?: string } = {}): Promise<Game[]> {
  const lists = await Promise.all(
    LEAGUES.map(async (cfg) => {
      try {
        return await fetchLeague(cfg.id, opts);
      } catch (err) {
        console.error(`fetchLeague(${cfg.id}) failed`, err);
        return [];
      }
    }),
  );
  return lists.flat().sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export async function fetchTeams(league: LeagueId): Promise<Team[]> {
  const url = TEAM_ENDPOINTS[league];
  const res = await fetch(url, { next: { revalidate: 86_400 } });
  if (!res.ok) throw new Error(`ESPN ${league} teams ${res.status}`);
  const data = await res.json();
  const items = data?.sports?.[0]?.leagues?.[0]?.teams ?? [];
  return items
    .map((t: any): Team => {
      const team = t.team ?? {};
      return {
        id: team.id ?? "",
        league,
        name: team.displayName ?? team.shortDisplayName ?? "",
        abbreviation: team.abbreviation,
        location: team.location,
        shortName: team.shortDisplayName,
        logoUrl: team.logos?.[0]?.href,
      };
    })
    .filter((t: Team) => t.id && t.name)
    .sort((a: Team, b: Team) => a.name.localeCompare(b.name));
}

/** YYYYMMDD in user's local time. */
export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}
