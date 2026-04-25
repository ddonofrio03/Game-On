import { Star } from "lucide-react";
import type { Favorite } from "@/lib/favorites";
import type { Game } from "@/types/game";
import { LEAGUE_BY_ID } from "@/lib/leagues";
import { GameCard } from "@/components/game-card";

export function FavoritesFeed({ favorites, games }: { favorites: Favorite[]; games: Game[] }) {
  if (favorites.length === 0) {
    return (
      <section className="scoreboard-screen relative overflow-hidden rounded-xl border border-border-strong p-6 text-center">
        <Star className="mx-auto size-7 text-led-amber" />
        <h2 className="mt-2 font-display text-base uppercase tracking-[0.25em] led-text">No favorites yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
          Star any team below to track their next game and where to watch it.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="font-display text-sm uppercase tracking-[0.25em] led-text">My teams</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {favorites.map((fav) => {
          const cfg = LEAGUE_BY_ID[fav.league];
          const next = games
            .filter((g) => g.league === fav.league && (g.homeTeam.id === fav.team_id || g.awayTeam.id === fav.team_id))
            .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];

          if (!next) {
            return (
              <div
                key={fav.id}
                className="rounded-lg border border-border-base bg-bg-panel/50 px-4 py-5"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 shrink-0 overflow-hidden rounded bg-bg-elevated">
                    {fav.team_logo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={fav.team_logo_url} alt="" className="size-full object-contain p-0.5" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-text-primary">{fav.team_name}</div>
                    <div className="text-[11px] uppercase tracking-wider text-text-tertiary">{cfg.short}</div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-text-tertiary">No game in the next few days.</p>
              </div>
            );
          }
          return <GameCard key={fav.id} game={next} />;
        })}
      </div>
    </section>
  );
}
