import { addDays, format, startOfDay } from "date-fns";
import { fetchAllLeagues, formatDate } from "@/lib/espn";
import { GameList } from "@/components/game-list";
import { TopBar } from "@/components/top-bar";
import { DateTabs } from "./date-tabs";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const RANGE = 7; // today + next 6 days

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const { d } = await searchParams;
  const today = startOfDay(new Date());
  const dates = Array.from({ length: RANGE }, (_, i) => addDays(today, i));

  const selected = dates.find((dt) => formatDate(dt) === d) ?? today;
  const games = await fetchAllLeagues({ dates: formatDate(selected) });

  return (
    <>
      <TopBar title="Schedule" />
      <main className="flex-1 space-y-5 px-4 py-6 lg:px-8">
        <DateTabs dates={dates.map(formatDate)} selected={formatDate(selected)} />
        <h2 className="font-display text-sm uppercase tracking-[0.25em] led-text">
          {format(selected, "EEEE, MMM d")}
        </h2>
        <GameList games={games} emptyMessage="No games scheduled on this date." />
      </main>
    </>
  );
}
