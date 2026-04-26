import { addDays, startOfDay } from "date-fns";
import { fetchAllLeagues, fetchTeams, formatDate } from "@/lib/espn";
import { LEAGUES } from "@/lib/leagues";
import { TopBar } from "@/components/top-bar";
import { TeamsClient } from "./teams-client";
import type { Team } from "@/types/game";

export const dynamic = "force-dynamic";

const LOOKAHEAD_DAYS = 4;

export default async function TeamsPage() {
  // All public ESPN data — no auth needed. The favorites layer is now
  // browser-local (see useFavorites hook) and lives on the client.
  const today = startOfDay(new Date());
  const dateStrings = Array.from({ length: LOOKAHEAD_DAYS }, (_, i) => formatDate(addDays(today, i)));

  const [gamesByDay, teamsByLeague] = await Promise.all([
    Promise.all(dateStrings.map((d) => fetchAllLeagues({ dates: d }))),
    Promise.all(LEAGUES.map(async (l) => [l.id, await fetchTeams(l.id).catch(() => [])] as const)),
  ]);

  const upcomingGames = gamesByDay.flat();
  const teams = Object.fromEntries(teamsByLeague) as Record<string, Team[]>;

  return (
    <>
      <TopBar title="My Teams" />
      <main className="flex-1 space-y-8 px-4 py-6 lg:px-8">
        <TeamsClient teamsByLeague={teams} upcomingGames={upcomingGames} />
      </main>
    </>
  );
}
