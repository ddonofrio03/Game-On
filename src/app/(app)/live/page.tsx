import { fetchAllLeagues } from "@/lib/espn";
import { GameList } from "@/components/game-list";
import { TopBar } from "@/components/top-bar";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export default async function LivePage() {
  const games = await fetchAllLeagues();
  const live = games.filter((g) => g.status === "live");

  return (
    <>
      <TopBar title="Live Now" />
      <main className="flex-1 space-y-5 px-4 py-6 lg:px-8">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-sm uppercase tracking-[0.25em] led-text">Live now</h2>
          <span className="text-xs text-text-tertiary">
            {live.length} {live.length === 1 ? "game" : "games"}
          </span>
        </div>
        <GameList
          games={live}
          emptyMessage="No games are live right now. Check Scores for today's full slate."
        />
      </main>
    </>
  );
}
