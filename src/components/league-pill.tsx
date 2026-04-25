import type { LeagueId } from "@/types/game";
import { LEAGUE_BY_ID } from "@/lib/leagues";
import { cn } from "@/lib/cn";

export function LeaguePill({
  league,
  className,
  size = "md",
}: {
  league: LeagueId;
  className?: string;
  size?: "sm" | "md";
}) {
  const cfg = LEAGUE_BY_ID[league];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-bg-elevated/70 font-medium uppercase tracking-wider text-text-secondary",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[11px]",
        cfg.accentClass,
        className,
      )}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: cfg.accent, boxShadow: `0 0 6px ${cfg.accent}` }}
      />
      {cfg.short}
    </span>
  );
}
