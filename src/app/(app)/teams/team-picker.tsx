"use client";

import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import { LEAGUES } from "@/lib/leagues";
import type { LeagueId, Team } from "@/types/game";
import type { StoredFavorite } from "@/lib/use-favorites";
import { cn } from "@/lib/cn";

type Props = {
  teamsByLeague: Record<string, Team[]>;
  has: (league: LeagueId, teamId: string) => boolean;
  toggle: (fav: Omit<StoredFavorite, "added_at">) => void;
  hydrated: boolean;
};

export function TeamPicker({ teamsByLeague, has, toggle, hydrated }: Props) {
  const [activeLeague, setActiveLeague] = useState<LeagueId>(LEAGUES[0].id);
  const [query, setQuery] = useState("");

  const teams = useMemo(() => {
    const list = teamsByLeague[activeLeague] ?? [];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.location?.toLowerCase().includes(q) ||
        t.abbreviation?.toLowerCase().includes(q),
    );
  }, [teamsByLeague, activeLeague, query]);

  return (
    <section className="space-y-4">
      <h2 className="font-display text-sm uppercase tracking-[0.25em] led-text">Add a team</h2>

      <div className="flex flex-wrap gap-2">
        {LEAGUES.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setActiveLeague(l.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors",
              activeLeague === l.id
                ? "border-led-amber/50 bg-led-amber-deep text-led-amber-soft"
                : "border-border-base bg-bg-panel text-text-secondary hover:border-border-strong hover:text-text-primary",
            )}
          >
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: l.accent, boxShadow: `0 0 6px ${l.accent}` }}
            />
            {l.short}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-md border border-border-base bg-bg-base/60 px-3 py-2 focus-within:border-led-amber/60">
        <Search className="size-4 text-text-tertiary" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search teams"
          className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
        />
      </div>

      {teams.length === 0 ? (
        <p className="text-sm text-text-tertiary">No teams match.</p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((t) => {
            const isFav = hydrated && has(t.league, t.id);
            return (
              <li key={`${t.league}:${t.id}`}>
                <button
                  type="button"
                  onClick={() =>
                    toggle({
                      league: t.league,
                      team_id: t.id,
                      team_name: t.name,
                      team_abbreviation: t.abbreviation ?? null,
                      team_logo_url: t.logoUrl ?? null,
                    })
                  }
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md border bg-bg-panel px-3 py-2 text-left transition-colors",
                    isFav ? "border-led-amber/50" : "border-border-base hover:border-border-strong",
                  )}
                >
                  <div className="size-8 shrink-0 overflow-hidden rounded bg-bg-elevated">
                    {t.logoUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={t.logoUrl} alt="" className="size-full object-contain p-0.5" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-text-primary">{t.name}</div>
                    {t.abbreviation ? (
                      <div className="text-[10px] uppercase tracking-wider text-text-tertiary">{t.abbreviation}</div>
                    ) : null}
                  </div>
                  <Star
                    className={cn(
                      "size-4 transition-colors",
                      isFav ? "fill-led-amber text-led-amber" : "text-text-tertiary",
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
