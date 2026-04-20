import { Game } from "../types";

const ESPN_ENDPOINTS: Record<string, string> = {
  MLB: "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",
  NBA: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
  NHL: "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard",
  NFL: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
  Soccer: "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard",
  UCL: "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard",
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
      const home = comp.competitors?.find((c: any) => c.homeAway === "home");
      const away = comp.competitors?.find((c: any) => c.homeAway === "away");
      const broadcasts: string[] = comp.broadcasts?.flatMap((b: any) => b.names ?? []) ?? [];

      return {
        id: event.id,
        league,
        homeTeam: home?.team?.displayName ?? "TBD",
        awayTeam: away?.team?.displayName ?? "TBD",
        startTime: comp.date ?? event.date,
        status: mapStatus(comp.status?.type?.name ?? ""),
        competition: event.name,
        streamingServices: broadcasts.length > 0
          ? broadcasts.map((name: string) => ({ name }))
          : [{ name: "Check local listings" }],
      } as Game;
    });
  } catch (error) {
    console.error("ESPN API error:", error);
    return [];
  }
}

export async function askAI(query: string, zip: string, date: string): Promise<string> {
  try {
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
          content: `Question about sports streaming: ${query}
Current date: ${date}. User ZIP: ${zip}.
Answer concisely — which streaming services or TV channels carry this game/league?
Mention RSNs (YES Network, NESN, Bally Sports, etc.) if relevant to the market.`,
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
