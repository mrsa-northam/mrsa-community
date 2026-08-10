import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../../lib/supabase-server";

export const runtime = "nodejs";

const celebrationCountNoteTitle = "__MRSA_CHAMPION_CELEBRATION_COUNT_V1__";
const initialCelebrationCount = 500;

type CelebrationNoteRow = {
  id: string;
  body: string | null;
  updated_at: string | null;
};

function parseCelebrationCount(body: string | null | undefined) {
  if (!body) return initialCelebrationCount;
  try {
    const parsed = JSON.parse(body) as { count?: unknown };
    const count = Number(parsed.count);
    return Number.isFinite(count) ? Math.max(initialCelebrationCount, Math.round(count)) : initialCelebrationCount;
  } catch {
    return initialCelebrationCount;
  }
}

function celebrationNoteId(tournamentId: string) {
  const hash = createHash("sha256").update(`${tournamentId}:champion-celebrations`).digest("hex");
  const variant = ((Number.parseInt(hash[16], 16) & 0x3) | 0x8).toString(16);
  const uuid = `${hash.slice(0, 12)}5${hash.slice(13, 16)}${variant}${hash.slice(17, 32)}`;
  return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
}

async function resolveTournamentId(admin: NonNullable<ReturnType<typeof getSupabaseAdminClient>>, requestedId: string) {
  let query = admin.from("tournaments").select("id");
  query = requestedId
    ? query.eq("id", requestedId)
    : query.in("status", ["registration_open", "registration_closed", "live", "completed"]).order("starts_on", { ascending: false, nullsFirst: false }).limit(1);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data?.id || "";
}

async function loadCelebrationNote(admin: NonNullable<ReturnType<typeof getSupabaseAdminClient>>, tournamentId: string) {
  const { data, error } = await admin
    .from("tournament_schedule_notes")
    .select("id,body,updated_at")
    .eq("tournament_id", tournamentId)
    .eq("title", celebrationCountNoteTitle)
    .maybeSingle();
  if (error) throw error;
  return data as CelebrationNoteRow | null;
}

export async function GET(request: NextRequest) {
  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Supabase server configuration is missing." }, { status: 500 });
  try {
    const tournamentId = await resolveTournamentId(admin, request.nextUrl.searchParams.get("tournamentId")?.trim() || "");
    if (!tournamentId) return NextResponse.json({ error: "Tournament not found." }, { status: 404 });
    const note = await loadCelebrationNote(admin, tournamentId);
    return NextResponse.json({ tournamentId, count: parseCelebrationCount(note?.body) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load the celebration count." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Supabase server configuration is missing." }, { status: 500 });
  try {
    const body = await request.json().catch(() => ({})) as { tournamentId?: unknown };
    const requestedId = typeof body.tournamentId === "string" ? body.tournamentId.trim() : "";
    const tournamentId = await resolveTournamentId(admin, requestedId);
    if (!tournamentId) return NextResponse.json({ error: "Tournament not found." }, { status: 404 });

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const note = await loadCelebrationNote(admin, tournamentId);
      const nextCount = parseCelebrationCount(note?.body) + 1;
      const nextBody = JSON.stringify({ count: nextCount });

      if (!note) {
        const { error: insertError } = await admin.from("tournament_schedule_notes").insert({
          id: celebrationNoteId(tournamentId),
          tournament_id: tournamentId,
          title: celebrationCountNoteTitle,
          body: nextBody,
          sort_order: 100010,
          is_published: false
        });
        if (!insertError) return NextResponse.json({ tournamentId, count: nextCount });
        if (insertError.code === "23505") continue;
        throw insertError;
      }

      let updateQuery = admin
        .from("tournament_schedule_notes")
        .update({ body: nextBody })
        .eq("id", note.id);
      updateQuery = note.updated_at ? updateQuery.eq("updated_at", note.updated_at) : updateQuery.is("updated_at", null);
      const { data: updated, error: updateError } = await updateQuery.select("id").maybeSingle();
      if (updateError) throw updateError;
      if (updated) return NextResponse.json({ tournamentId, count: nextCount });
    }

    return NextResponse.json({ error: "The celebration total is busy. Please tap again." }, { status: 409 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save the celebration." }, { status: 500 });
  }
}
