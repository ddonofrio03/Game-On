"use client";

import Link from "next/link";
import { LEAGUES } from "@/lib/leagues";
import type { LeagueId } from "@/types/game";
import { cn } from "@/lib/cn";

export function LeagueFilter({ selected }: { selected: LeagueId | null }) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterPill href="/scores" active={selected === null} label="All" />
      {LEAGUES.map((l) => (
        <FilterPill
          key={l.id}
          href={`/scores?league=${l.id}`}
          active={selected === l.id}
          label={l.short}
          accent={l.accent}
        />
      ))}
    </div>
  );
}

function FilterPill({
  href,
  active,
  label,
  accent,
}: {
  href: string;
  active: boolean;
  label: string;
  accent?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors",
        active
          ? "border-led-amber/50 bg-led-amber-deep text-led-amber-soft"
          : "border-border-base bg-bg-panel text-text-secondary hover:border-border-strong hover:text-text-primary",
      )}
    >
      {accent ? (
        <span
          className="size-1.5 rounded-full"
          style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }}
        />
      ) : null}
      {label}
    </Link>
  );
}
