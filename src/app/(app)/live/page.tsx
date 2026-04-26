import { fetchAllLeagues } from "@/lib/espn";
import { LEAGUES } from "@/lib/leagues";
import { GameList } from "@/components/game-list";
import { LeagueFilter } from "@/components/league-filter";
import { TopBar } from "@/components/top-bar";
import type { LeagueId } from "@/types/game";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export default async function LivePage({
  searchParams,
}: {
  searchParams: Promise<{ league?: string }>;
}) {
  const { league } = await searchParams;
  const selected = (LEAGUES.find((l) => l.id === league)?.id ?? null) as LeagueId | null;

  const games = await fetchAllLeagues();
  const live = games.filter((g) => g.status === "live");
  const filtered = selected ? live.filter((g) => g.league === selected) : live;

  return (
    <>
      <TopBar title="Live Now" />
      <main className="flex-1 space-y-5 px-4 py-6 lg:px-8">
        <LeagueFilter selected={selected} basePath="/live" />
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-sm uppercase tracking-[0.25em] led-text">Live now</h2>
          <span className="text-xs text-text-tertiary">
            {filtered.length} {filtered.length === 1 ? "game" : "games"}
          </span>
        </div>
        <GameList
          games={filtered}
          emptyMessage={
            selected
              ? "Nothing live in this league right now."
              : "No games are live right now. Check Today's Games for the full slate."
          }
        />
      </main>
    </>
  );
}
