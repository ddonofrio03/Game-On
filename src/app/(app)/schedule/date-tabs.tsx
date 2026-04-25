"use client";

import Link from "next/link";
import { format, parse } from "date-fns";
import { cn } from "@/lib/cn";

export function DateTabs({ dates, selected }: { dates: string[]; selected: string }) {
  return (
    <div className="scrollbar-thin -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
      {dates.map((d) => {
        const dt = parse(d, "yyyyMMdd", new Date());
        const isSelected = d === selected;
        const isToday = format(new Date(), "yyyyMMdd") === d;
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
              {isToday ? "Today" : format(dt, "EEE")}
            </span>
            <span className="font-display text-lg">{format(dt, "d")}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
              {format(dt, "MMM")}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
