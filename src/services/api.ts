import { Game } from "../types";

const ESPN_ENDPOINTS: Record<string, string> = {
  MLB:    "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",
  NBA:    "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
  NHL:    "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard",
  NFL:    "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
  Soccer: "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard",
  UCL:    "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard",
  Golf:   "https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard",
};

function mapStatus(espnStatus: string): "live" | "upcoming" | "finished" {
  if (espnStatus === "STATUS_IN_PROGRESS") return "live";
  if (espnStatus === "STATUS_FINAL") return "finished";
  return "upcoming";
}

export async function getSportsSchedule(league: string): Promise<Game[]> {
  try {
    const url = ESPN_ENDPOINTS[league];
    if (!url) return [];
    const res = await fetch(url);
    if (!res.ok) throw new Error(`ESPN API error: ${res.status}`);
    const data = await res.json();

    return (data.events ?? []).map((event: any) => {
      const comp = event.competitions?.[0] ?? {};
      const broadcasts: string[] = comp.broadcasts?.flatMap((b: any) => b.names ?? []) ?? [];
      const services = broadcasts.length > 0
        ? broadcasts.map((name: string) => ({ name }))
        : [{ name: "Check local listings" }];

      if (league === "Golf") {
        const leaders = (comp.competitors ?? [])
          .slice(0, 2)
          .map((c: any) => c.athlete?.displayName ?? c.team?.displayName ?? "")
          .filter(Boolean)
          .join(" & ");
        return {
          id: event.id,
          league,
          homeTeam: event.name ?? "PGA Tournament",
          awayTeam: leaders || "See Leaderboard",
          startTime: comp.date ?? event.date ?? new Date().toISOString(),
          status: mapStatus(comp.status?.type?.name ?? ""),
          competition: event.shortName ?? event.name,
          streamingServices: services,
          isEvent: true,
        } as Game;
      }

      const home = comp.competitors?.find((c: any) => c.homeAway === "home");
      const away = comp.competitors?.find((c: any) => c.homeAway === "away");
      return {
        id: event.id,
        league,
        homeTeam: home?.team?.displayName ?? "TBD",
        awayTeam: away?.team?.displayName ?? "TBD",
        startTime: comp.date ?? event.date,
        status: mapStatus(comp.status?.type?.name ?? ""),
        competition: event.name,
        streamingServices: services,
      } as Game;
    });
  } catch (error) {
    console.error("ESPN API error:", error);
    return [];
  }
}

export async function askAI(query: string, zip: string, date: string, games: Game[]): Promise<string> {
  try {
    const gameContext = games.length > 0
      ? games.map(g => `${g.awayTeam} vs ${g.homeTeam} (${g.league}) at ${new Date(g.startTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} — Watch on: ${g.streamingServices.map(s => s.name).join(', ')}`).join('\n')
      : "No games currently loaded.";

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [{
          role: "user",
          content: `You are a sports streaming assistant. Answer based on the real game data below.
User ZIP: ${zip}. Date: ${date}.

TODAY'S GAMES (from ESPN):
${gameContext}

User question: ${query}

Answer concisely using the game data above. If the team they asked about is listed, tell them exactly when and where to watch. Also mention RSNs (YES Network, NESN, Bally Sports, MSG, etc.) relevant to their ZIP if applicable.`,
        }],
      }),
    });
    if (!res.ok) throw new Error(`Claude API error: ${res.status}`);
    const data = await res.json();
    return data.content?.[0]?.text ?? "No answer available.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I couldn't find that info right now.";
  }
}
