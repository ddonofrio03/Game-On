"use client";

import Link from "next/link";
import { parseDate } from "@/lib/espn";
import { cn } from "@/lib/cn";

// UTC because each YYYYMMDD is a calendar day, not an instant —
// formatting in a viewer's local TZ would shift the label across the
// date line for far-east timezones.
const DOW = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "short" });
const DAY = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", day: "numeric" });
const MONTH = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short" });

export function DateTabs({
  dates,
  selected,
  today,
}: {
  dates: string[];
  selected: string;
  today: string;
}) {
  return (
    <div className="scrollbar-thin -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
      {dates.map((d) => {
        const dt = parseDate(d);
        const isSelected = d === selected;
        const isToday = d === today;
        return (
          <Link
            key={d}
            href={`/schedule?d=${d}`}
            className={cn(
              "flex shrink-0 flex-col items-center rounded-lg border px-4 py-2 transition-colors",
              isSelected
                ? "border-led-amber/50 bg-led-amber-deep text-led-amber-soft"
                : "border-border-base bg-bg-panel text-text-secondary hover:border-border-strong hover:text-text-primary",
            )}
          >
            <span className="text-[10px] uppercase tracking-[0.2em]">
              {isToday ? "Today" : DOW.format(dt)}
            </span>
            <span className="font-display text-lg">{DAY.format(dt)}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
              {MONTH.format(dt)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
