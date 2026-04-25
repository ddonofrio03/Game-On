import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { LeagueId } from "@/types/game";

export type Favorite = {
  id: string;
  league: LeagueId;
  team_id: string;
  team_name: string;
  team_abbreviation: string | null;
  team_logo_url: string | null;
};

export async function getFavorites(): Promise<Favorite[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("favorite_teams")
    .select("id, league, team_id, team_name, team_abbreviation, team_logo_url")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getFavorites failed", error);
    return [];
  }
  return (data ?? []) as Favorite[];
}
