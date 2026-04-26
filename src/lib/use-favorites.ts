"use client";

import { useEffect, useState } from "react";
import type { LeagueId } from "@/types/game";

const STORAGE_KEY = "game-on:favorites:v1";

export type StoredFavorite = {
  league: LeagueId;
  team_id: string;
  team_name: string;
  team_abbreviation?: string | null;
  team_logo_url?: string | null;
  added_at: string;
};

function readStorage(): StoredFavorite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredFavorite[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(favs: StoredFavorite[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

/** Browser-local favorites — no auth, no backend. Survives across visits in
 *  the same browser; clearing site data wipes them. Multiple tabs stay in
 *  sync via the `storage` event. */
export function useFavorites() {
  const [favorites, setFavorites] = useState<StoredFavorite[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(readStorage());
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFavorites(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function add(fav: Omit<StoredFavorite, "added_at">) {
    setFavorites((prev) => {
      if (prev.some((f) => f.league === fav.league && f.team_id === fav.team_id)) return prev;
      const next = [...prev, { ...fav, added_at: new Date().toISOString() }];
      writeStorage(next);
      return next;
    });
  }

  function remove(league: LeagueId, team_id: string) {
    setFavorites((prev) => {
      const next = prev.filter((f) => !(f.league === league && f.team_id === team_id));
      writeStorage(next);
      return next;
    });
  }

  function has(league: LeagueId, team_id: string) {
    return favorites.some((f) => f.league === league && f.team_id === team_id);
  }

  function toggle(fav: Omit<StoredFavorite, "added_at">) {
    if (has(fav.league, fav.team_id)) {
      remove(fav.league, fav.team_id);
    } else {
      add(fav);
    }
  }

  return { favorites, hydrated, add, remove, has, toggle };
}
