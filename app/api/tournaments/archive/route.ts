import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../../lib/supabase-server";

export const runtime = "nodejs";

const archiveNoteTitle = "__MRSA_TOURNAMENT_ARCHIVE_V1__";

function parsePhotoAlbumUrl(body: string | null | undefined) {
  if (!body) return "";
  try {
    const parsed = JSON.parse(body) as { photoAlbumUrl?: unknown };
    return typeof parsed.photoAlbumUrl === "string" && /^https:\/\//i.test(parsed.photoAlbumUrl.trim()) ? parsed.photoAlbumUrl.trim() : "";
  } catch {
    return "";
  }
}

export async function GET() {
  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Supabase server configuration is missing." }, { status: 500 });
  try {
    const { data: tournaments, error } = await admin
      .from("tournaments")
      .select("id,name,season_year,status,venue_name,starts_on,ends_on")
      .eq("status", "completed")
      .order("starts_on", { ascending: false, nullsFirst: false })
      .limit(2);
    if (error) throw error;
    const tournamentIds = (tournaments || []).map((tournament) => tournament.id);
    const { data: notes, error: noteError } = tournamentIds.length
      ? await admin
          .from("tournament_schedule_notes")
          .select("tournament_id,body")
          .eq("title", archiveNoteTitle)
          .in("tournament_id", tournamentIds)
      : { data: [], error: null };
    if (noteError) throw noteError;
    const photoUrlByTournament = new Map((notes || []).map((note) => [note.tournament_id, parsePhotoAlbumUrl(note.body)]));
    return NextResponse.json({
      tournaments: (tournaments || []).map((tournament) => ({
        id: tournament.id,
        name: tournament.name,
        seasonYear: tournament.season_year,
        status: tournament.status,
        venueName: tournament.venue_name || "",
        startsOn: tournament.starts_on,
        endsOn: tournament.ends_on,
        photoAlbumUrl: photoUrlByTournament.get(tournament.id) || ""
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load the tournament archive." }, { status: 500 });
  }
}
