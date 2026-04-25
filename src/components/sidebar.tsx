"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, MessageSquare, Star, Trophy } from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/today", label: "Today", icon: Home },
  { href: "/scores", label: "Scores", icon: Trophy },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/teams", label: "My Teams", icon: Star },
];

export function Sidebar({ onAskClaude }: { onAskClaude?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r border-border-base bg-bg-panel/60 lg:flex">
      <div className="px-5 pt-5 pb-3">
        <Link href="/today" aria-label="Game On home" className="block">
          <Logo className="h-12 w-auto" />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-led-amber-deep text-led-amber-soft"
                  : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-base p-3">
        <button
          type="button"
          onClick={onAskClaude}
          className="flex w-full items-center gap-3 rounded-md border border-led-amber/30 bg-led-amber-deep/40 px-3 py-2 text-sm font-medium text-led-amber-soft transition-colors hover:bg-led-amber-deep"
        >
          <MessageSquare className="size-4" />
          Ask Claude
        </button>
      </div>
    </aside>
  );
}

export function MobileNav({ onAskClaude }: { onAskClaude?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border-base bg-bg-panel/95 backdrop-blur lg:hidden">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium uppercase tracking-wider",
                active ? "text-led-amber-soft" : "text-text-tertiary",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {onAskClaude ? (
        <button
          type="button"
          onClick={onAskClaude}
          aria-label="Ask Claude"
          className="fixed right-4 bottom-20 z-30 flex size-12 items-center justify-center rounded-full border border-led-amber/60 bg-bg-scoreboard text-led-amber shadow-[0_0_24px_rgba(255,177,0,0.45)] transition-transform hover:scale-105 lg:hidden"
        >
          <MessageSquare className="size-5" />
        </button>
      ) : null}
    </>
  );
}
