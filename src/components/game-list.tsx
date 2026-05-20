import type { Game } from "@/types/game";
import { GameCard } from "./game-card";

export function GameList({
  games,
  emptyMessage,
  tz,
}: {
  games: Game[];
  emptyMessage?: string;
  tz: string;
}) {
  if (games.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border-base bg-bg-panel/40 px-6 py-10 text-center text-sm text-text-tertiary">
        {emptyMessage ?? "Nothing here right now."}
      </div>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {games.map((g) => (
        <GameCard key={`${g.league}-${g.id}`} game={g} tz={tz} />
      ))}
    </div>
  );
}

export function GameSection({
  title,
  count,
  games,
  emptyMessage,
  tz,
}: {
  title: string;
  count?: number;
  games: Game[];
  emptyMessage?: string;
  tz: string;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline gap-3">
        <h2 className="font-display text-sm uppercase tracking-[0.25em] led-text">{title}</h2>
        {typeof count === "number" ? (
          <span className="text-xs text-text-tertiary">{count}</span>
        ) : null}
      </div>
      <GameList games={games} emptyMessage={emptyMessage} tz={tz} />
    </section>
  );
}
