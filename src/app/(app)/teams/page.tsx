import { etDateRange, fetchAllLeagues, fetchTeams } from "@/lib/espn";
import { LEAGUES } from "@/lib/leagues";
import { getDisplayTimezone } from "@/lib/timezone";
import { TopBar } from "@/components/top-bar";
import { TeamsClient } from "./teams-client";
import type { Team } from "@/types/game";

export const dynamic = "force-dynamic";

const LOOKAHEAD_DAYS = 4;

export default async function TeamsPage() {
  // All public ESPN data — no auth needed. The favorites layer is now
  // browser-local (see useFavorites hook) and lives on the client.
  const dateStrings = etDateRange(LOOKAHEAD_DAYS);

  const [gamesByDay, teamsByLeague, tz] = await Promise.all([
    Promise.all(dateStrings.map((d) => fetchAllLeagues({ dates: d }))),
    Promise.all(LEAGUES.map(async (l) => [l.id, await fetchTeams(l.id).catch(() => [])] as const)),
    getDisplayTimezone(),
  ]);

  const upcomingGames = gamesByDay.flat();
  const teams = Object.fromEntries(teamsByLeague) as Record<string, Team[]>;

  return (
    <>
      <TopBar title="My Teams" />
      <main className="flex-1 space-y-8 px-4 py-6 lg:px-8">
        <TeamsClient teamsByLeague={teams} upcomingGames={upcomingGames} tz={tz} />
      </main>
    </>
  );
}
