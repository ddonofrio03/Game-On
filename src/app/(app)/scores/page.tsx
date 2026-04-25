import { fetchAllLeagues } from "@/lib/espn";
import { LEAGUES } from "@/lib/leagues";
import { GameList } from "@/components/game-list";
import { LeagueFilter } from "./league-filter";
import { TopBar } from "@/components/top-bar";
import type { LeagueId } from "@/types/game";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export default async function ScoresPage({
  searchParams,
}: {
  searchParams: Promise<{ league?: string }>;
}) {
  const { league } = await searchParams;
  const selected = (LEAGUES.find((l) => l.id === league)?.id ?? null) as LeagueId | null;

  const all = await fetchAllLeagues();
  const filtered = selected ? all.filter((g) => g.league === selected) : all;

  return (
    <>
      <TopBar title="Scores" />
      <main className="flex-1 space-y-5 px-4 py-6 lg:px-8">
        <LeagueFilter selected={selected} />
        <GameList games={filtered} emptyMessage="No games for this league today." />
      </main>
    </>
  );
}
