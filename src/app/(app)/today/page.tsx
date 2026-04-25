import { fetchAllLeagues } from "@/lib/espn";
import { GameSection } from "@/components/game-list";
import { TopBar } from "@/components/top-bar";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export default async function TodayPage() {
  const games = await fetchAllLeagues();

  const live = games.filter((g) => g.status === "live");
  const upcoming = games.filter((g) => g.status === "upcoming");
  const finished = games.filter((g) => g.status === "finished");

  return (
    <>
      <TopBar title="Today" />
      <main className="flex-1 space-y-8 px-4 py-6 lg:px-8">
        <Hero liveCount={live.length} upcomingCount={upcoming.length} />

        <GameSection
          title="Live now"
          count={live.length}
          games={live}
          emptyMessage="No games are live right now. Check back soon."
        />
        <GameSection
          title="Coming up"
          count={upcoming.length}
          games={upcoming}
          emptyMessage="No more games scheduled today."
        />
        {finished.length > 0 ? (
          <GameSection title="Final" count={finished.length} games={finished} />
        ) : null}
      </main>
    </>
  );
}

function Hero({ liveCount, upcomingCount }: { liveCount: number; upcomingCount: number }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border-strong bg-bg-elevated p-5 lg:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-display text-[11px] uppercase tracking-[0.4em] led-text">
            What&apos;s on
          </div>
          <div className="mt-1 font-display text-3xl tracking-wider led-text-strong lg:text-4xl">
            GAME ON.
          </div>
          <p className="mt-2 max-w-md text-sm text-text-secondary">
            Live scores, schedules, and where to watch — across MLB, NFL, NBA, NHL, EPL, UCL, and MLS.
          </p>
        </div>
        <div className="flex gap-3">
          <Stat label="Live" value={liveCount} accent />
          <Stat label="Upcoming" value={upcomingCount} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-border-base bg-bg-base px-4 py-3 text-center">
      <div
        className={
          accent
            ? "font-display text-3xl tabular-nums tracking-wider led-text-strong"
            : "font-display text-3xl tabular-nums tracking-wider led-text"
        }
      >
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-text-secondary">
        {label}
      </div>
    </div>
  );
}
