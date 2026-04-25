import { format } from "date-fns";
import type { Game } from "@/types/game";
import { LEAGUE_BY_ID } from "./leagues";

export const CHAT_SYSTEM_PROMPT = `You are the Game On! sports assistant — concise, accurate, friendly, with occasional dry humor.

You help fans answer questions like:
- "Where can I watch tonight's [team] game?"
- "What channel is X on?"
- "Did the [team] win last night?"
- "When does [event] start?"
- "What's the playoff picture?"

The user is in the United States. Today's scheduled games (across MLB, NFL, NBA, NHL, EPL, UCL, MLS) are pre-loaded as context, including broadcast networks where ESPN reports them.

Rules:
- For "where to watch": first check the pre-loaded games. If the answer is there, give it directly. If the broadcaster is missing or the game isn't listed, use web_search.
- Always cite sources for live facts you find via web_search.
- Don't pretend to know live scores or stats that aren't in the data; if unsure, say so or search.
- Don't make up TV/streaming carriage. If you say "it's on Peacock", be sure.
- Be brief: 1-3 short paragraphs unless the user asks for detail. Headings only when comparing multiple items.
- Use plain text. No LaTeX, no markdown tables unless really helpful.`;

export function formatGamesContext(games: Game[]): string {
  if (games.length === 0) {
    return "No games scheduled for today across the tracked leagues.";
  }

  // Group by status for readability
  const live = games.filter((g) => g.status === "live");
  const upcoming = games.filter((g) => g.status === "upcoming");
  const finished = games.filter((g) => g.status === "finished");

  const lines: string[] = [];
  lines.push(`# Today's games (${format(new Date(), "EEEE, MMM d, yyyy")})`);

  function describe(g: Game) {
    const cfg = LEAGUE_BY_ID[g.league];
    const time = format(new Date(g.startTime), "h:mm a");
    const matchup = `${g.awayTeam.name} @ ${g.homeTeam.name}`;
    const score =
      g.homeTeam.score !== undefined && g.awayTeam.score !== undefined && g.homeTeam.score !== ""
        ? ` (${g.awayTeam.abbreviation ?? g.awayTeam.name} ${g.awayTeam.score} - ${g.homeTeam.score} ${g.homeTeam.abbreviation ?? g.homeTeam.name})`
        : "";
    const broadcasts = g.broadcasts.length
      ? ` | TV: ${g.broadcasts.map((b) => b.name).join(", ")}`
      : " | TV: not listed";
    const status =
      g.status === "live"
        ? `LIVE${g.statusDetail ? ` (${g.statusDetail})` : ""}`
        : g.status === "finished"
          ? "FINAL"
          : `${time} ET start`;
    return `- [${cfg.short}] ${matchup} — ${status}${score}${broadcasts}`;
  }

  if (live.length) {
    lines.push("\n## Live now");
    lines.push(...live.map(describe));
  }
  if (upcoming.length) {
    lines.push("\n## Coming up");
    lines.push(...upcoming.map(describe));
  }
  if (finished.length) {
    lines.push("\n## Final");
    lines.push(...finished.map(describe));
  }

  return lines.join("\n");
}
