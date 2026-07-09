import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient, getSupabaseServerClient } from "../../../lib/supabase-server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServerClient();
  const admin = getSupabaseAdminClient();
  if (!supabase || !admin) {
    return NextResponse.json({ error: "Supabase server keys are not configured." }, { status: 500 });
  }

  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Please sign in before updating your tournament profile." }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Your session expired. Please sign in again." }, { status: 401 });
  }

  const { jerseyName, tournamentId } = await request.json();
  const nextJerseyName = typeof jerseyName === "string" ? jerseyName.trim() : "";

  const { data: player, error: playerError } = await admin
    .from("players")
    .select("id, full_name, auth_user_id")
    .eq("auth_user_id", userData.user.id)
    .maybeSingle();

  if (playerError) {
    return NextResponse.json({ error: playerError.message }, { status: 500 });
  }

  if (!player) {
    return NextResponse.json({ error: "Player profile was not found." }, { status: 404 });
  }

  const savedShirtName = nextJerseyName || null;
  const { error: updatePlayerError } = await admin
    .from("players")
    .update({ jersey_name: nextJerseyName || null })
    .eq("id", player.id)
    .eq("auth_user_id", userData.user.id);

  if (updatePlayerError) {
    return NextResponse.json({ error: updatePlayerError.message }, { status: 500 });
  }

  if (typeof tournamentId === "string" && tournamentId.trim()) {
    const tournament = tournamentId.trim();
    const registrationUpdate = await admin
      .from("tournament_registrations")
      .update({ shirt_name: savedShirtName })
      .eq("tournament_id", tournament)
      .eq("player_id", player.id)
      .neq("status", "cancelled");

    if (registrationUpdate.error) {
      return NextResponse.json({ error: registrationUpdate.error.message }, { status: 500 });
    }

    const memberUpdate = await admin
      .from("tournament_team_members")
      .update({ shirt_name_snapshot: savedShirtName || player.full_name })
      .eq("tournament_id", tournament)
      .eq("player_id", player.id);

    if (memberUpdate.error) {
      return NextResponse.json({ error: memberUpdate.error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, jerseyName: nextJerseyName });
}
