import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../../lib/supabase-server";

export const runtime = "nodejs";

const saveTheDateNoteTitle = "__MRSA_2027_INTEREST_RSVPS_V1__";
const event = {
  year: 2027,
  startsOn: "2027-08-07",
  endsOn: "2027-08-08"
} as const;

type InterestRsvp = {
  id: string;
  fullName: string;
  email: string;
  jamaatCity: string;
  submittedAt: string;
};

type StoredInterestRsvps = {
  eventYear: number;
  startsOn: string;
  endsOn: string;
  responses: InterestRsvp[];
};

type ScheduleNoteRow = {
  id: string;
  tournament_id: string;
  body: string | null;
  updated_at: string | null;
};

function parseStoredRsvps(body: string | null | undefined): StoredInterestRsvps {
  if (!body) return { eventYear: event.year, startsOn: event.startsOn, endsOn: event.endsOn, responses: [] };
  try {
    const parsed = JSON.parse(body) as Partial<StoredInterestRsvps>;
    const responses = Array.isArray(parsed.responses) ? parsed.responses.flatMap((response) => {
      if (!response || typeof response !== "object") return [];
      const item = response as Partial<InterestRsvp>;
      if (!item.id || !item.fullName || !item.email || !item.submittedAt) return [];
      return [{
        id: item.id,
        fullName: item.fullName,
        email: item.email,
        jamaatCity: item.jamaatCity || "",
        submittedAt: item.submittedAt
      }];
    }) : [];
    return {
      eventYear: event.year,
      startsOn: event.startsOn,
      endsOn: event.endsOn,
      responses
    };
  } catch {
    return { eventYear: event.year, startsOn: event.startsOn, endsOn: event.endsOn, responses: [] };
  }
}

function metadataNoteId(tournamentId: string) {
  const hash = createHash("sha256").update(`${tournamentId}:save-the-date-2027`).digest("hex");
  const variant = ((Number.parseInt(hash[16], 16) & 0x3) | 0x8).toString(16);
  const uuid = `${hash.slice(0, 12)}5${hash.slice(13, 16)}${variant}${hash.slice(17, 32)}`;
  return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
}

function rsvpId(email: string) {
  return createHash("sha256").update(`${event.year}:${email}`).digest("hex").slice(0, 20);
}

async function loadLatestTournamentId(admin: NonNullable<ReturnType<typeof getSupabaseAdminClient>>) {
  const { data, error } = await admin
    .from("tournaments")
    .select("id")
    .in("status", ["registration_open", "registration_closed", "live", "completed"])
    .order("starts_on", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.id || "";
}

async function loadRsvpNote(admin: NonNullable<ReturnType<typeof getSupabaseAdminClient>>, tournamentId: string) {
  const { data, error } = await admin
    .from("tournament_schedule_notes")
    .select("id,tournament_id,body,updated_at")
    .eq("tournament_id", tournamentId)
    .eq("title", saveTheDateNoteTitle)
    .maybeSingle();
  if (error) throw error;
  return data as ScheduleNoteRow | null;
}

export async function GET() {
  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Supabase server configuration is missing." }, { status: 500 });
  try {
    const tournamentId = await loadLatestTournamentId(admin);
    if (!tournamentId) return NextResponse.json({ ...event, count: 0 });
    const note = await loadRsvpNote(admin, tournamentId);
    return NextResponse.json({ ...event, count: parseStoredRsvps(note?.body).responses.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load save-the-date interest." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Supabase server configuration is missing." }, { status: 500 });
  try {
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const fullName = typeof body.fullName === "string" ? body.fullName.trim().replace(/\s+/g, " ").slice(0, 120) : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 180) : "";
    const jamaatCity = typeof body.jamaatCity === "string" ? body.jamaatCity.trim().replace(/\s+/g, " ").slice(0, 100) : "";
    const website = typeof body.website === "string" ? body.website.trim() : "";
    if (website) return NextResponse.json({ ...event, saved: true });
    if (fullName.length < 2) return NextResponse.json({ error: "Please add your full name." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Please add a valid email address." }, { status: 400 });

    const tournamentId = await loadLatestTournamentId(admin);
    if (!tournamentId) return NextResponse.json({ error: "No tournament record is available for the RSVP list." }, { status: 404 });

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const note = await loadRsvpNote(admin, tournamentId);
      const stored = parseStoredRsvps(note?.body);
      const submittedAt = new Date().toISOString();
      const nextRsvp: InterestRsvp = { id: rsvpId(email), fullName, email, jamaatCity, submittedAt };
      const existingIndex = stored.responses.findIndex((response) => response.email.toLowerCase() === email);
      const responses = existingIndex >= 0
        ? stored.responses.map((response, index) => index === existingIndex ? nextRsvp : response)
        : [...stored.responses, nextRsvp];
      const nextBody = JSON.stringify({ ...stored, responses });

      if (!note) {
        const { error: insertError } = await admin.from("tournament_schedule_notes").insert({
          id: metadataNoteId(tournamentId),
          tournament_id: tournamentId,
          title: saveTheDateNoteTitle,
          body: nextBody,
          sort_order: 100020,
          is_published: false
        });
        if (!insertError) return NextResponse.json({ ...event, saved: true, count: responses.length });
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
      if (updated) return NextResponse.json({ ...event, saved: true, count: responses.length });
    }

    return NextResponse.json({ error: "The RSVP list is busy. Please try once more." }, { status: 409 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save your interest." }, { status: 500 });
  }
}
