import { etDateRange, fetchAllLeagues, parseDate } from "@/lib/espn";
import { getDisplayTimezone } from "@/lib/timezone";
import { GameList } from "@/components/game-list";
import { TopBar } from "@/components/top-bar";
import { DateTabs } from "./date-tabs";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const RANGE = 7; // today + next 6 days

const HEADING_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "long",
  month: "short",
  day: "numeric",
});

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const { d } = await searchParams;
  const dates = etDateRange(RANGE);
  const selected = dates.includes(d ?? "") ? d! : dates[0];
  const [games, tz] = await Promise.all([
    fetchAllLeagues({ dates: selected }),
    getDisplayTimezone(),
  ]);

  return (
    <>
      <TopBar title="Schedule" />
      <main className="flex-1 space-y-5 px-4 py-6 lg:px-8">
        <DateTabs dates={dates} selected={selected} today={dates[0]} />
        <h2 className="font-display text-sm uppercase tracking-[0.25em] led-text">
          {HEADING_FMT.format(parseDate(selected))}
        </h2>
        <GameList games={games} emptyMessage="No games scheduled on this date." tz={tz} />
      </main>
    </>
  );
}
