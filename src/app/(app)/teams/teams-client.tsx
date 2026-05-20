"use client";

import { useFavorites } from "@/lib/use-favorites";
import type { Game, Team } from "@/types/game";
import { FavoritesFeed } from "./favorites-feed";
import { TeamPicker } from "./team-picker";

export function TeamsClient({
  teamsByLeague,
  upcomingGames,
  tz,
}: {
  teamsByLeague: Record<string, Team[]>;
  upcomingGames: Game[];
  tz: string;
}) {
  const { favorites, hydrated, has, toggle } = useFavorites();

  return (
    <>
      <FavoritesFeed favorites={favorites} games={upcomingGames} hydrated={hydrated} tz={tz} />
      <TeamPicker teamsByLeague={teamsByLeague} has={has} toggle={toggle} hydrated={hydrated} />
    </>
  );
}
