import { randomInt } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient, getSupabaseServerClient } from "../../../lib/supabase-server";

export const runtime = "nodejs";

type RaffleParticipant = {
  entryId: string;
  name: string;
  photoUrl: string;
  kind: "drafted_player" | "volunteer";
  playerId: string | null;
};

type TeamMemberRow = {
  id?: string | null;
  player_id?: string | null;
  draft_order?: number | null;
  players?: { id?: string | null; full_name?: string | null; profile_photo_url?: string | null } | { id?: string | null; full_name?: string | null; profile_photo_url?: string | null }[] | null;
};

const volunteerNames = ["Hasan Yameni", "Mohammed Segval", "Mufaddal Husain", "Zoeb Salehbhai"] as const;

function one<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function volunteerEntryId(name: string) {
  return `volunteer:${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

async function authorizeAdmin(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { error: NextResponse.json({ error: "Sign in is required." }, { status: 401 }) };
  const supabase = getSupabaseServerClient();
  const admin = getSupabaseAdminClient();
  if (!supabase || !admin) return { error: NextResponse.json({ error: "Supabase server configuration is missing." }, { status: 500 }) };

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) return { error: NextResponse.json({ error: "Invalid session." }, { status: 401 }) };

  const [{ data: adminRole }, { data: adminPlayer }] = await Promise.all([
    admin.from("member_roles").select("auth_user_id").eq("auth_user_id", userData.user.id).eq("role", "admin").maybeSingle(),
    admin.from("players").select("id,is_admin").eq("auth_user_id", userData.user.id).maybeSingle()
  ]);
  if (!adminRole && !adminPlayer?.is_admin) return { error: NextResponse.json({ error: "Admin access required." }, { status: 403 }) };
  return { admin, adminPlayerId: adminPlayer?.id || null };
}

async function loadRaffle(admin: NonNullable<ReturnType<typeof getSupabaseAdminClient>>) {
  const { data: tournament, error: tournamentError } = await admin
    .from("tournaments")
    .select("id,name,season_year,status,starts_on")
    .in("status", ["registration_open", "registration_closed", "live", "completed"])
    .order("starts_on", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();
  if (tournamentError) throw tournamentError;
  if (!tournament) return { tournament: null, participants: [] as RaffleParticipant[], result: null };

  const [teamsResult, volunteerProfilesResult, raffleResult] = await Promise.all([
    admin
      .from("tournament_teams")
      .select("id,name,sort_order,tournament_team_members(id,player_id,draft_order,players(id,full_name,profile_photo_url))")
      .eq("tournament_id", tournament.id)
      .eq("is_published", true)
      .order("sort_order", { ascending: true }),
    admin.from("players").select("id,full_name,profile_photo_url").in("full_name", [...volunteerNames]),
    admin
      .from("tournament_raffles")
      .select("id,tournament_id,winner_entry_id,winner_name,winner_photo_url,winner_kind,winner_player_id,participant_count,drawn_at")
      .eq("tournament_id", tournament.id)
      .maybeSingle()
  ]);
  const firstError = teamsResult.error || volunteerProfilesResult.error || raffleResult.error;
  if (firstError) throw firstError;

  const draftedPlayers: RaffleParticipant[] = (teamsResult.data || [])
    .flatMap((team) => (Array.isArray(team.tournament_team_members) ? team.tournament_team_members : team.tournament_team_members ? [team.tournament_team_members] : [])
      .map((member: TeamMemberRow) => ({ member, teamSortOrder: Number(team.sort_order || 0) })))
    .sort((left, right) => left.teamSortOrder - right.teamSortOrder
      || Number(left.member.draft_order ?? 999) - Number(right.member.draft_order ?? 999))
    .flatMap(({ member }) => {
      const player = one(member.players);
      const playerId = member.player_id || player?.id || null;
      const name = player?.full_name?.trim() || "";
      return playerId && name ? [{ entryId: `player:${playerId}`, name, photoUrl: player?.profile_photo_url || "", kind: "drafted_player" as const, playerId }] : [];
    });
  const uniqueDraftedPlayers = Array.from(new Map(draftedPlayers.map((participant) => [participant.entryId, participant])).values());
  const volunteerProfiles = new Map((volunteerProfilesResult.data || []).map((player) => [player.full_name?.trim().toLowerCase(), player]));
  const volunteers: RaffleParticipant[] = volunteerNames.map((name) => {
    const profile = volunteerProfiles.get(name.toLowerCase());
    return {
      entryId: volunteerEntryId(name),
      name,
      photoUrl: profile?.profile_photo_url || "",
      kind: "volunteer",
      playerId: profile?.id || null
    };
  });
  const participants = [...uniqueDraftedPlayers, ...volunteers];
  return { tournament, participants, result: raffleResult.data || null };
}

function rafflePayload(data: Awaited<ReturnType<typeof loadRaffle>>) {
  const draftedCount = data.participants.filter((participant) => participant.kind === "drafted_player").length;
  const volunteerCount = data.participants.filter((participant) => participant.kind === "volunteer").length;
  const savedResult = data.result;
  const resultIndex = savedResult ? data.participants.findIndex((participant) => participant.entryId === savedResult.winner_entry_id) : -1;
  return {
    tournament: data.tournament,
    participants: data.participants,
    counts: { drafted: draftedCount, volunteers: volunteerCount, total: data.participants.length },
    ready: draftedCount === 32 && volunteerCount === 4 && data.participants.length === 36,
    result: savedResult ? {
      id: savedResult.id,
      tournamentId: savedResult.tournament_id,
      winnerEntryId: savedResult.winner_entry_id,
      winnerName: savedResult.winner_name,
      winnerPhotoUrl: savedResult.winner_photo_url || "",
      winnerKind: savedResult.winner_kind,
      winnerPlayerId: savedResult.winner_player_id || null,
      participantCount: savedResult.participant_count,
      drawnAt: savedResult.drawn_at,
      winnerIndex: resultIndex
    } : null
  };
}

export async function GET(request: NextRequest) {
  const auth = await authorizeAdmin(request);
  if ("error" in auth) return auth.error;
  try {
    return NextResponse.json(rafflePayload(await loadRaffle(auth.admin)));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load the raffle." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await authorizeAdmin(request);
  if ("error" in auth) return auth.error;
  try {
    let data = await loadRaffle(auth.admin);
    if (!data.tournament) return NextResponse.json({ error: "No current tournament was found." }, { status: 404 });
    if (data.result) return NextResponse.json({ ...rafflePayload(data), alreadyDrawn: true });

    const draftedCount = data.participants.filter((participant) => participant.kind === "drafted_player").length;
    if (draftedCount !== 32 || data.participants.length !== 36) {
      return NextResponse.json({ error: `The raffle needs 32 drafted players and 4 volunteers. Found ${draftedCount} drafted players and ${data.participants.length - draftedCount} volunteers.` }, { status: 409 });
    }

    const winnerIndex = randomInt(data.participants.length);
    const winner = data.participants[winnerIndex];
    const { error: insertError } = await auth.admin.from("tournament_raffles").insert({
      tournament_id: data.tournament.id,
      winner_entry_id: winner.entryId,
      winner_name: winner.name,
      winner_photo_url: winner.photoUrl || null,
      winner_kind: winner.kind,
      winner_player_id: winner.playerId,
      participant_count: data.participants.length,
      participant_snapshot: data.participants,
      drawn_by: auth.adminPlayerId,
      drawn_at: new Date().toISOString()
    });
    if (insertError) {
      if (insertError.code !== "23505") throw insertError;
    }
    data = await loadRaffle(auth.admin);
    return NextResponse.json({ ...rafflePayload(data), alreadyDrawn: Boolean(insertError) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to draw the raffle winner." }, { status: 500 });
  }
}
