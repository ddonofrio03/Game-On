import { NextResponse, type NextRequest } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { LEAGUES } from "@/lib/leagues";

export const runtime = "nodejs";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ favorites: [] });
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ favorites: [] });

  const { data, error } = await supabase
    .from("favorite_teams")
    .select("id, league, team_id, team_name, team_abbreviation, team_logo_url")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ favorites: data ?? [] });
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { league, team_id, team_name, team_abbreviation, team_logo_url } = body;
  if (!LEAGUES.find((l) => l.id === league) || !team_id || !team_name) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("favorite_teams")
    .insert({
      user_id: user.id,
      league,
      team_id: String(team_id),
      team_name: String(team_name),
      team_abbreviation: team_abbreviation ? String(team_abbreviation) : null,
      team_logo_url: team_logo_url ? String(team_logo_url) : null,
    })
    .select("id, league, team_id, team_name, team_abbreviation, team_logo_url")
    .single();

  if (error) {
    if (error.code === "23505") {
      // Unique violation — already favorited; treat as idempotent success.
      return NextResponse.json({ ok: true, alreadyExists: true });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ favorite: data });
}
