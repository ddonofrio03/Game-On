import { format } from "date-fns";
import { Tv } from "lucide-react";
import type { Game, TeamRef } from "@/types/game";
import { cn } from "@/lib/cn";
import { LeaguePill } from "./league-pill";

function TeamRow({ team, isWinner, isLive }: { team: TeamRef; isWinner?: boolean; isLive?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="size-7 shrink-0 overflow-hidden rounded-sm bg-bg-elevated">
        {team.logoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={team.logoUrl} alt="" className="size-full object-contain p-0.5" />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className={cn("truncate text-sm font-semibold", isWinner ? "text-text-primary" : "text-text-secondary")}>
          {team.name}
        </div>
        {team.record ? <div className="text-[10px] text-text-tertiary">{team.record}</div> : null}
      </div>
      {team.score !== undefined && team.score !== "" ? (
        <div
          className={cn(
            "font-display text-2xl tabular-nums tracking-wider",
            isLive ? "led-text-strong" : isWinner ? "led-text" : "text-text-secondary",
          )}
        >
          {team.score}
        </div>
      ) : null}
    </div>
  );
}

function StatusBadge({ game }: { game: Game }) {
  if (game.status === "live") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="led-pulse size-1.5 rounded-full bg-led-green shadow-[0_0_8px_var(--led-green)]" />
        <span className="led-text-green font-display text-[11px] tracking-wider">LIVE</span>
        {game.statusDetail ? (
          <span className="text-[11px] text-text-secondary">{game.statusDetail}</span>
        ) : null}
      </div>
    );
  }
  if (game.status === "finished") {
    return <span className="font-display text-[11px] tracking-wider text-text-tertiary">FINAL</span>;
  }
  if (game.status === "postponed") {
    return <span className="font-display text-[11px] tracking-wider led-text-red">PPD</span>;
  }
  // upcoming
  const time = format(new Date(game.startTime), "h:mm a");
  return (
    <div className="text-right">
      <div className="font-display text-[11px] tracking-wider led-text">{time}</div>
      {game.statusDetail && game.statusDetail !== time ? (
        <div className="text-[10px] text-text-tertiary">{game.statusDetail}</div>
      ) : null}
    </div>
  );
}

export function GameCard({ game }: { game: Game }) {
  const homeNum = Number(game.homeTeam.score ?? "");
  const awayNum = Number(game.awayTeam.score ?? "");
  const showWinners = game.status === "finished" && Number.isFinite(homeNum) && Number.isFinite(awayNum);
  const homeWinner = showWinners && homeNum > awayNum;
  const awayWinner = showWinners && awayNum > homeNum;
  const isLive = game.status === "live";

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border-base bg-bg-panel transition-colors hover:border-border-strong">
      <div className="flex items-center justify-between gap-3 border-b border-border-base/60 px-3.5 py-2">
        <div className="flex items-center gap-2">
          <LeaguePill league={game.league} size="sm" />
          {game.competition ? (
            <span className="truncate text-[11px] text-text-tertiary">{game.competition}</span>
          ) : null}
        </div>
        <StatusBadge game={game} />
      </div>

      <div className="px-3.5 pt-1.5 pb-2">
        <TeamRow team={game.awayTeam} isWinner={awayWinner} isLive={isLive} />
        <TeamRow team={game.homeTeam} isWinner={homeWinner} isLive={isLive} />
      </div>

      {game.broadcasts.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-border-base/60 bg-bg-base/40 px-3.5 py-2">
          <Tv className="size-3 text-text-tertiary" />
          {game.broadcasts.map((b) => (
            <span
              key={b.name}
              className={cn(
                "rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider",
                b.onYouTubeTV
                  ? "border-led-amber/40 bg-led-amber-deep text-led-amber-soft"
                  : "border-border-base bg-bg-elevated text-text-secondary",
              )}
            >
              {b.name}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
