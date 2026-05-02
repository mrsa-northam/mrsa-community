import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient, getSupabaseServerClient } from "../../../lib/supabase-server";

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "Missing authorization token." }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  const admin = getSupabaseAdminClient();
  if (!supabase || !admin) {
    return NextResponse.json({ error: "Supabase server configuration is missing." }, { status: 500 });
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Invalid session." }, { status: 401 });
  }

  const { data: adminRole } = await admin
    .from("member_roles")
    .select("auth_user_id")
    .eq("auth_user_id", userData.user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!adminRole) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { data: claims, error: claimsError } = await admin
    .from("player_claims")
    .select("id, player_id, requested_by, status, requester_note, created_at, players(full_name, jamaat_city)")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(40);

  if (claimsError) {
    return NextResponse.json({ error: claimsError.message }, { status: 500 });
  }

  const requesterIds = Array.from(new Set((claims || []).map((claim) => claim.requested_by).filter(Boolean)));
  const requesterEmails = new Map<string, string>();
  await Promise.all(requesterIds.map(async (requesterId) => {
    const { data } = await admin.auth.admin.getUserById(requesterId);
    if (data.user?.email) requesterEmails.set(requesterId, data.user.email);
  }));

  const normalizedClaims = (claims || []).map((claim) => {
    const player = Array.isArray(claim.players) ? claim.players[0] : claim.players;
    return {
      id: claim.id,
      player_id: claim.player_id,
      requested_by: claim.requested_by,
      status: claim.status,
      requester_note: claim.requester_note,
      requester_email: requesterEmails.get(claim.requested_by) || null,
      created_at: claim.created_at,
      player_full_name: player?.full_name || null,
      player_jamaat_city: player?.jamaat_city || null
    };
  });

  return NextResponse.json({ claims: normalizedClaims });
}
