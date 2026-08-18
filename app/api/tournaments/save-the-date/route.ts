import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../../lib/supabase-server";

export const runtime = "nodejs";

const saveTheDateNoteTitle = "__MRSA_2027_INTEREST_RSVPS_V1__";

type InterestRsvp = {
  id: string;
  fullName: string;
  email: string;
  jamaatCity: string;
  submittedAt: string;
};

type StoredInterestEvent = {
  name: string;
  startsOn: string;
  endsOn: string;
  timezone: string;
  locationName: string;
  description: string;
  isAllDay: boolean;
  responses: InterestRsvp[];
};

type ScheduleNoteRow = {
  id: string;
  tournament_id: string;
  body: string | null;
  updated_at: string | null;
};

function parseStoredEvent(body: string | null | undefined): StoredInterestEvent | null {
  if (!body) return null;
  try {
    const parsed = JSON.parse(body) as Partial<StoredInterestEvent> & { eventYear?: number };
    const name = typeof parsed.name === "string" ? parsed.name.trim() : "";
    const startsOn = typeof parsed.startsOn === "string" ? parsed.startsOn.trim() : "";
    const endsOn = typeof parsed.endsOn === "string" ? parsed.endsOn.trim() : "";
    if (!name || !/^\d{4}-\d{2}-\d{2}$/.test(startsOn) || !/^\d{4}-\d{2}-\d{2}$/.test(endsOn)) return null;
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
      name,
      startsOn,
      endsOn,
      timezone: typeof parsed.timezone === "string" && parsed.timezone.trim() ? parsed.timezone.trim() : "America/Chicago",
      locationName: typeof parsed.locationName === "string" ? parsed.locationName.trim() : "",
      description: typeof parsed.description === "string" ? parsed.description.trim() : "",
      isAllDay: parsed.isAllDay !== false,
      responses
    };
  } catch {
    return null;
  }
}

async function loadRsvpNote(admin: NonNullable<ReturnType<typeof getSupabaseAdminClient>>, eventId?: string) {
  let query = admin
    .from("tournament_schedule_notes")
    .select("id,tournament_id,body,updated_at")
    .eq("title", saveTheDateNoteTitle);
  query = eventId ? query.eq("id", eventId) : query.order("updated_at", { ascending: false }).limit(1);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data as ScheduleNoteRow | null;
}

function publicEvent(note: ScheduleNoteRow, event: StoredInterestEvent) {
  return {
    id: note.id,
    name: event.name,
    startsOn: event.startsOn,
    endsOn: event.endsOn,
    timezone: event.timezone,
    locationName: event.locationName,
    description: event.description,
    isAllDay: event.isAllDay,
    count: event.responses.length
  };
}

function addUtcDays(dateText: string, days: number) {
  const date = new Date(`${dateText}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function escapeIcsText(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll("\n", "\\n");
}

function buildIcs(note: ScheduleNoteRow, event: StoredInterestEvent) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MRSA//Tennis Tournament//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${note.id}@mrsa-community`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}`,
    `DTSTART;VALUE=DATE:${event.startsOn.replaceAll("-", "")}`,
    `DTEND;VALUE=DATE:${addUtcDays(event.endsOn, 1).replaceAll("-", "")}`,
    `SUMMARY:${escapeIcsText(event.name)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(event.locationName)}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
    ""
  ].join("\r\n");
}

export async function GET(request: NextRequest) {
  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Supabase server configuration is missing." }, { status: 500 });
  try {
    const note = await loadRsvpNote(admin, request.nextUrl.searchParams.get("eventId") || undefined);
    const event = parseStoredEvent(note?.body);
    if (!note || !event) return NextResponse.json({ event: null, attendees: [] });
    if (request.nextUrl.searchParams.get("format") === "ics") {
      return new NextResponse(buildIcs(note, event), {
        headers: {
          "Content-Type": "text/calendar; charset=utf-8",
          "Content-Disposition": `attachment; filename="mrsa-tennis-${event.startsOn}.ics"`,
          "Cache-Control": "no-store"
        }
      });
    }
    const attendees = request.nextUrl.searchParams.get("includeAttendees") === "1"
      ? event.responses
          .map((response) => ({ id: response.id, fullName: response.fullName, jamaatCity: response.jamaatCity, submittedAt: response.submittedAt }))
          .sort((left, right) => left.fullName.localeCompare(right.fullName))
      : undefined;
    return NextResponse.json({ event: publicEvent(note, event), ...(attendees ? { attendees } : {}) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load save-the-date interest." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Supabase server configuration is missing." }, { status: 500 });
  try {
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const eventId = typeof body.eventId === "string" ? body.eventId.trim() : "";
    const fullName = typeof body.fullName === "string" ? body.fullName.trim().replace(/\s+/g, " ").slice(0, 120) : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 180) : "";
    const jamaatCity = typeof body.jamaatCity === "string" ? body.jamaatCity.trim().replace(/\s+/g, " ").slice(0, 100) : "";
    const website = typeof body.website === "string" ? body.website.trim() : "";
    if (website) return NextResponse.json({ saved: true });
    if (!eventId) return NextResponse.json({ error: "The save-the-date event is unavailable." }, { status: 400 });
    if (fullName.length < 2) return NextResponse.json({ error: "Please add your full name." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Please add a valid email address." }, { status: 400 });

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const note = await loadRsvpNote(admin, eventId);
      const stored = parseStoredEvent(note?.body);
      if (!note || !stored) return NextResponse.json({ error: "This save-the-date event is not available." }, { status: 404 });
      const nextRsvp: InterestRsvp = {
        id: createHash("sha256").update(`${note.id}:${email}`).digest("hex").slice(0, 20),
        fullName,
        email,
        jamaatCity,
        submittedAt: new Date().toISOString()
      };
      const existingIndex = stored.responses.findIndex((response) => response.email.toLowerCase() === email);
      const responses = existingIndex >= 0
        ? stored.responses.map((response, index) => index === existingIndex ? nextRsvp : response)
        : [...stored.responses, nextRsvp];
      const nextBody = JSON.stringify({ ...stored, responses });
      let updateQuery = admin.from("tournament_schedule_notes").update({ body: nextBody }).eq("id", note.id);
      updateQuery = note.updated_at ? updateQuery.eq("updated_at", note.updated_at) : updateQuery.is("updated_at", null);
      const { data: updated, error } = await updateQuery.select("id").maybeSingle();
      if (error) throw error;
      if (updated) return NextResponse.json({ saved: true, event: publicEvent(note, { ...stored, responses }) });
    }
    return NextResponse.json({ error: "The RSVP list is busy. Please try once more." }, { status: 409 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save your interest." }, { status: 500 });
  }
}
