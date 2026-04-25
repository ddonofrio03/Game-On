import type { LeagueId } from "@/types/game";

const ESPN_LEAGUE_PATH: Record<LeagueId, string> = {
  mlb: "mlb",
  nfl: "nfl",
  nba: "nba",
  nhl: "nhl",
  epl: "soccer",
  ucl: "soccer",
  mls: "soccer",
};

/** Best-effort "where to watch this network/service" URL.
 *  ESPN-family chips deep-link to the actual game page. Streaming-only services
 *  go to their sports landing. National TV networks go to their watch page.
 *  Regional sports networks (NESN, MSG, MASN, etc.) generally require a cable
 *  login so we skip them — let the chip stay non-clickable rather than send
 *  the user to a useless homepage. */
export function watchUrlFor(broadcastName: string, league: LeagueId, gameId: string): string | undefined {
  const name = broadcastName.toLowerCase().trim();

  // ESPN family → specific game page
  if (
    name === "espn" ||
    name === "espn2" ||
    name === "espnu" ||
    name === "espn+" ||
    name === "espn news" ||
    name === "espn deportes"
  ) {
    return `https://www.espn.com/${ESPN_LEAGUE_PATH[league]}/game/_/gameId/${gameId}`;
  }

  // Streaming-first services
  if (name.includes("peacock")) return "https://www.peacocktv.com/sports";
  if (name.includes("paramount")) return "https://www.paramountplus.com/sports/";
  if (name.includes("apple tv") || name === "mls season pass") return "https://tv.apple.com/sports";
  if (name === "mlb.tv" || name === "mlb tv") return "https://www.mlb.com/tv";
  if (name === "nfl+" || name === "nfl plus") return "https://www.nfl.com/plus/";
  if (name === "nba league pass" || name === "nba tv" || name === "nba.tv") return "https://www.nba.com/watch";
  if (name === "nhl network" || name === "nhl.tv") return "https://www.nhl.com";
  if (name === "nfl network" || name === "nfl net") return "https://www.nfl.com/network/";

  // Major national TV networks (over-the-air or cable)
  if (name === "fox" || name === "fs1" || name === "fs2" || name.includes("fox sports")) {
    return "https://www.foxsports.com/watch";
  }
  if (name === "cbs" || name === "cbs sports" || name === "cbs sports network" || name === "cbssn") {
    return "https://www.cbssports.com/watch/";
  }
  if (name === "nbc" || name.includes("nbc sports")) {
    return "https://www.nbcsports.com/live/";
  }
  if (name === "tnt" || name === "tbs" || name === "trutv") return "https://play.max.com/sports";
  if (name === "abc") return "https://abc.com/watch-live/abc";
  if (name === "usa" || name === "usa network") return "https://www.usanetwork.com/live";
  if (name === "hbo max" || name === "max") return "https://play.max.com/sports";
  if (name === "univision" || name === "tudn" || name === "univision deportes") return "https://www.tudn.com/en-vivo";
  if (name === "telemundo") return "https://www.telemundodeportes.com/en-vivo";
  if (name === "golf channel") return "https://www.nbcsports.com/live/golf";

  // Conferences
  if (name === "big ten network" || name === "btn") return "https://www.bigtennetwork.com";
  if (name === "sec network") return "https://www.espn.com/watch/sec";
  if (name === "acc network") return "https://www.espn.com/watch/acc";

  // YouTube TV — generic landing
  if (name.includes("youtube")) return "https://tv.youtube.com";

  // Regional sports networks: not deep-linkable without login → leave non-clickable
  return undefined;
}
