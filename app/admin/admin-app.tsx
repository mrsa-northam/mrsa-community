"use client";

import { ArrowRight, BadgeDollarSign, CheckCircle2, ChevronDown, ClipboardCheck, Crown, Download, Home, Pencil, Plus, Shield, Trash2, Trophy, UsersRound, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabase";

type AdminTab = "overview" | "tournaments" | "players" | "payments" | "claims";
type CountMap = {
  players: number;
  tournaments: number;
  payments: number;
  claims: number;
};

type AdminPlayer = {
  id: string;
  auth_user_id: string | null;
  full_name: string;
  email?: string | null;
  phone: string | null;
  age: number | null;
  date_of_birth: string | null;
  profile_photo_url: string | null;
  jamaat_city: string | null;
  self_assessment: string | null;
  dominant_hand?: string | null;
  jersey_size?: string | null;
  tennis_video_url?: string | null;
  tennis_video_status?: string | null;
  tier: number;
  rating: number | null;
  claim_status: string;
  tournaments_played: number;
  matches_played: number;
  is_admin?: boolean;
};

type AdminTournament = {
  id: string;
  name: string;
  status: string;
  venue_name: string | null;
  venue_maps_url: string | null;
  starts_on: string | null;
  ends_on: string | null;
  registration_closes_at: string | null;
  registration_fee_cents: number;
  max_players: number | null;
  notes: string | null;
  faqs?: unknown;
};
type AdminRegisteredPlayer = {
  id: string;
  registrationId: string;
  tournamentId: string;
  fullName: string;
  jamaatCity: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  dominantHand: string;
  jerseySize: string;
  shirtName: string;
  profilePhotoUrl: string;
  tennisVideoUrl: string;
  tennisVideoStatus: string | null;
  selfEvaluation: string;
  age: string;
  tier: number;
  rating: number | null;
  paymentId: string | null;
  paymentStatus: string | null;
  paymentAmountCents: number;
  paymentCurrency: string;
};
type AdminTeamMember = {
  id: string;
  teamId: string;
  tournamentId: string;
  registrationId: string;
  playerId: string;
  isCaptain: boolean;
  draftOrder: number | null;
  tierAtDraft: number | null;
  shirtName: string;
};
type AdminTeam = {
  id: string;
  tournamentId: string;
  name: string;
  sortOrder: number;
  isPublished: boolean;
  members: AdminTeamMember[];
};
type AdminInterestedPlayer = {
  id: string;
  playerId: string;
  fullName: string;
  jamaatCity: string;
  phone: string;
  email: string;
  checkoutPhone: string;
  checkoutEmail: string;
  profilePhotoUrl: string;
  status: string;
  amountCents: number;
  currency: string;
  occurredAt: string;
  failureMessage: string;
  checkoutCount: number;
};
type AdminWaitlistedPlayer = {
  registrationId: string;
  playerId: string;
  fullName: string;
  jamaatCity: string;
  profilePhotoUrl: string;
  selfEvaluation: string;
  waitlistStatus: string;
  joinedAt: string;
};

type AdminPayment = {
  id: string;
  player_id: string;
  tournament_id: string | null;
  registration_id: string | null;
  entry_type: string;
  status: string;
  amount_cents: number;
  currency: string;
  notes: string | null;
  occurred_at: string;
  players: { full_name: string; jamaat_city: string | null } | { full_name: string; jamaat_city: string | null }[] | null;
  tournaments: { name: string } | { name: string }[] | null;
};

type AdminClaim = {
  id: string;
  player_id: string;
  requested_by: string;
  status: string;
  requester_note: string | null;
  admin_note?: string | null;
  requester_email: string | null;
  created_at: string;
  player_full_name: string | null;
  player_jamaat_city: string | null;
};
type LegacyAdminClaim = {
  id: string;
  player_id: string;
  requested_by: string;
  status: string;
  requester_note: string | null;
  admin_note?: string | null;
  created_at: string;
  players: { full_name: string | null; jamaat_city: string | null } | { full_name: string | null; jamaat_city: string | null }[] | null;
};

const adminSkillLevels = ["Advanced", "Upper Intermediate", "Intermediate", "Developing Intermediate", "Recreational"];
const adminJamaatCityOptions = [
  "Atlanta",
  "Austin",
  "Bakersfield",
  "Boston",
  "Calgary",
  "Chicago",
  "Columbus",
  "Dallas",
  "Detroit",
  "Edmonton",
  "Houston",
  "Los Angeles",
  "Miami",
  "Minneapolis",
  "Mississauga",
  "Montreal",
  "New Jersey",
  "New York",
  "North Carolina",
  "Orange County",
  "Ottawa",
  "Philadelphia",
  "Plano",
  "Portland",
  "San Antonio",
  "San Diego",
  "San Francisco",
  "San Jose",
  "Seattle",
  "South Carolina",
  "South Jersey",
  "Tampa",
  "The Woodlands",
  "Toronto",
  "Vancouver",
  "Virginia",
  "Washington, D.C.",
  "Other"
];
const adminJerseySizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const adminDominantHands = ["Right", "Left", "Both"];

function AdminBrandMark({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative h-10 w-10 shrink-0 overflow-hidden" aria-hidden="true">
        <Image src="/brand/logo-v3.png" alt="" aria-hidden="true" fill sizes="40px" className="object-contain" priority />
      </span>
      <strong className={light ? "text-[24px] font-medium leading-none tracking-[-0.4px] text-white" : "text-[24px] font-medium leading-none tracking-[-0.4px] text-brand"}>MRSA</strong>
    </span>
  );
}

function AdminPageGreeting({ firstName, subtitle }: { firstName: string; subtitle: string }) {
  return (
    <div className="mb-1">
      <div className="text-[17px] font-medium text-text-primary">Hi {firstName}</div>
      <div className="text-[13px] text-text-secondary">{subtitle}</div>
    </div>
  );
}

export function AdminFrame({ active, children }: { active: AdminTab; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [adminFirstName, setAdminFirstName] = useState("there");

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setAllowed(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }

      const { data, error } = await supabase.rpc("is_admin");
      if (error || !data) {
        setAllowed(false);
        return;
      }

      const { data: player } = await supabase
        .from("players")
        .select("full_name")
        .eq("auth_user_id", user.id)
        .maybeSingle();
      setAdminFirstName(player?.full_name?.split(" ")[0] || "there");
      setAllowed(true);
    };

    checkAdmin();
  }, [router, pathname]);

  if (allowed === null) {
    return (
      <main className="grid min-h-dvh place-items-center bg-page px-4 py-8 font-sans text-text-primary">
        <section className="grid w-full max-w-[520px] gap-4 rounded-[24px] border-hairline border-line bg-white p-5 shadow-[0_24px_80px_rgba(12,59,32,0.10)]">
          <div className="relative overflow-hidden rounded-[20px] bg-brand p-5 text-white">
            <div className="pointer-events-none absolute inset-0 -right-12 -top-8 text-white opacity-[0.06]" aria-hidden="true">
              <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="relative grid gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/12 text-white">
                <Shield size={18} />
              </span>
              <h1 className="text-[26px] font-medium leading-tight tracking-[-0.4px] text-white">Checking admin access.</h1>
              <p className="text-[15px] leading-relaxed text-white/65">Verifying whether this MRSA account has permission to open the admin console.</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="grid min-h-dvh place-items-center bg-page px-4 py-8 font-sans text-text-primary">
        <section className="grid w-full max-w-[760px] overflow-hidden rounded-[24px] border-hairline border-line bg-white shadow-[0_24px_80px_rgba(12,59,32,0.10)] md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="relative min-h-[220px] overflow-hidden bg-brand p-5 text-white md:min-h-[420px] md:p-6">
            <div className="pointer-events-none absolute inset-0 -right-16 -top-8 text-white opacity-[0.07]" aria-hidden="true">
              <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="relative grid h-full content-between gap-8">
              <AdminBrandMark light />
              <div className="grid gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-white">
                  <Shield size={20} />
                </span>
                <h1 className="text-[32px] font-medium leading-[1.05] tracking-[-0.4px] text-white">Admin access required.</h1>
                <p className="max-w-[320px] text-[15px] leading-relaxed text-white/65">The admin console is limited to approved MRSA administrators.</p>
              </div>
            </div>
          </div>

          <div className="grid content-center gap-5 p-5 md:p-8">
            <div className="grid gap-2">
              <span className="inline-flex w-max rounded-full bg-brand-light px-3 py-1 text-[13px] font-medium text-[#3b6d11]">Protected area</span>
              <h2 className="text-[26px] font-medium leading-tight tracking-[-0.4px] text-text-primary">You do not have admin permission.</h2>
              <p className="text-[15px] leading-relaxed text-text-secondary">Your account is signed in, but it is not marked as an MRSA admin. If this seems wrong, ask an existing admin to update your role.</p>
            </div>

            <div className="grid gap-2 rounded-[16px] border-hairline border-line bg-surface/60 p-4">
              <span className="text-[13px] text-text-secondary">What you can do</span>
              <p className="text-[15px] leading-relaxed text-text-primary">Return to the player app and continue viewing tournaments, profile details, and registered players.</p>
            </div>

            <Link className="tap-card inline-flex min-h-11 w-full items-center justify-center rounded-[14px] bg-brand px-5 text-sm font-medium text-white md:w-max" href="/dashboard">Back to app →</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-page font-sans text-text-primary lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="sticky top-0 z-40 grid gap-4 border-b-hairline border-line bg-brand px-4 py-4 text-white lg:h-dvh lg:content-start lg:border-b-0 lg:border-r-hairline lg:px-5 lg:py-5">
        <Link className="tap-card w-max" href="/admin"><AdminBrandMark light /></Link>
        <nav className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-1" aria-label="Admin navigation">
          <AdminNavItem active={active === "overview"} href="/admin" icon={<Home size={17} />} label="Overview" />
          <AdminNavItem active={active === "tournaments"} href="/admin/tournaments" icon={<Trophy size={17} />} label="Tournaments" />
          <AdminNavItem active={active === "players"} href="/admin/players" icon={<UsersRound size={17} />} label="Players" />
          <AdminNavItem active={active === "payments"} href="/admin/payments" icon={<BadgeDollarSign size={17} />} label="Payments" />
          <AdminNavItem active={active === "claims"} href="/admin/claims" icon={<ClipboardCheck size={17} />} label="Claims" />
        </nav>
        <Link className="tap-card inline-flex min-h-10 items-center justify-center rounded-[14px] border-hairline border-white/12 bg-white/10 px-4 text-xs font-medium text-white/85 lg:hidden" href="/dashboard">Player app →</Link>
        <Link className="tap-card hidden min-h-10 items-center justify-center rounded-[14px] border-hairline border-white/12 bg-white/10 px-4 text-xs font-medium text-white/85 lg:mt-auto lg:inline-flex" href="/dashboard">Player app →</Link>
      </aside>
      <section className="mx-auto grid w-full max-w-shell content-start gap-4 px-4 py-5 pb-10 md:px-6 lg:px-8">
        <AdminPageGreeting firstName={adminFirstName} subtitle="Admin tools" />
        {children}
      </section>
    </main>
  );
}

function AdminNavItem({
  active,
  href,
  icon,
  label
}: {
  active: boolean;
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link className={active ? "tap-card grid min-h-11 place-items-center gap-1 rounded-[14px] bg-white px-3 py-2 text-center text-[13px] font-medium text-brand lg:grid-cols-[18px_minmax(0,1fr)] lg:justify-items-start lg:text-left" : "tap-card grid min-h-11 place-items-center gap-1 rounded-[14px] px-3 py-2 text-center text-[13px] font-medium text-white/68 hover:bg-white/10 hover:text-white lg:grid-cols-[18px_minmax(0,1fr)] lg:justify-items-start lg:text-left"} href={href}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function AdminOverviewScreen() {
  const [counts, setCounts] = useState<CountMap>({ players: 0, tournaments: 0, payments: 0, claims: 0 });
  const [currentTournament, setCurrentTournament] = useState<Pick<AdminTournament, "id" | "name"> | null>(null);

  const loadCounts = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const [players, tournaments, payments, claims, currentTournamentResult] = await Promise.all([
      supabase.from("players").select("id", { count: "exact", head: true }),
      supabase.from("tournaments").select("id", { count: "exact", head: true }),
      supabase.from("payment_ledger").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("player_claims").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase
        .from("tournaments")
        .select("id, name")
        .in("status", ["registration_open", "registration_closed", "live", "draft"])
        .order("starts_on", { ascending: true, nullsFirst: false })
        .limit(1)
        .maybeSingle()
    ]);

    setCounts({
      players: players.count || 0,
      tournaments: tournaments.count || 0,
      payments: payments.count || 0,
      claims: claims.count || 0
    });
    setCurrentTournament((currentTournamentResult.data as Pick<AdminTournament, "id" | "name"> | null) || null);
  }, []);

  useEffect(() => {
    loadCounts();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadCounts();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [loadCounts]);

  return (
    <AdminFrame active="overview">
      {currentTournament && (
        <Link
          className="tap-card inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-brand px-5 text-sm font-medium text-white shadow-[0_14px_28px_rgba(12,59,32,0.14)] md:w-max"
          href={`/admin/tournaments/${currentTournament.id}`}
        >
          Manage active tournament
          <ArrowRight size={15} />
        </Link>
      )}
      <section className="relative grid min-h-[230px] overflow-hidden rounded-[22px] bg-brand p-5 text-white md:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] md:items-center md:gap-8 lg:p-6">
        <div className="pointer-events-none absolute inset-0 -right-16 -top-6 text-white opacity-[0.06]" aria-hidden="true">
          <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
            <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>
        <div className="relative grid gap-3">
          <span className="inline-flex w-max items-center rounded-full bg-white/12 px-3 py-1 text-[13px] text-white/75">Admin</span>
          <h1 className="max-w-[680px] text-3xl font-medium leading-[1.08] tracking-[-0.4px] text-white md:text-[42px]">Control room</h1>
          <p className="max-w-[620px] text-sm leading-relaxed text-white/68">Manage MRSA tournaments, players, claims, and payment ledger without loading this data for regular players.</p>
        </div>
        <div className="relative mt-5 grid gap-2 rounded-[18px] border-hairline border-white/10 bg-white/[0.08] p-4 md:mt-0">
          <span className="text-[13px] text-white/55">Admin status</span>
          <strong className="text-[24px] font-medium text-white">Live dashboard</strong>
          <em className="text-[14px] not-italic leading-relaxed text-white/62">Counts refresh when this tab becomes active.</em>
        </div>
      </section>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AdminStat label="Players" value={counts.players} />
        <AdminStat label="Tournaments" value={counts.tournaments} />
        <AdminStat label="Pending payments" value={counts.payments} />
        <AdminStat label="Pending claims" value={counts.claims} />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <AdminLinkCard href="/admin/tournaments" title="Manage tournaments" copy="Review live, upcoming, and past tournament setup." />
        <AdminLinkCard href="/admin/players" title="Manage players" copy="Search player records, claimed status, city, and ratings." />
        <AdminLinkCard href="/admin/payments" title="Manage payments" copy="Track charges, payments, refunds, and adjustments." />
        <AdminLinkCard href="/admin/claims" title="Review claims" copy="Approve or reject profile claim requests." />
      </div>
    </AdminFrame>
  );
}

export function AdminPlayersScreen() {
  const [players, setPlayers] = useState<AdminPlayer[]>([]);
  const [query, setQuery] = useState("");
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);
  const [savingPlayerId, setSavingPlayerId] = useState<string | null>(null);
  const [playerNotice, setPlayerNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadPlayers = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    let request = supabase
      .from("players")
      .select("id, auth_user_id, full_name, email, phone, age, date_of_birth, profile_photo_url, jamaat_city, self_assessment, dominant_hand, jersey_size, tennis_video_url, tennis_video_status, tier, rating, claim_status, tournaments_played, matches_played")
      .order("full_name")
      .limit(80);

    if (query.trim()) {
      request = request.ilike("full_name", `%${query.trim()}%`);
    }

    const [{ data, error }, { data: roles, error: rolesError }] = await Promise.all([
      request,
      supabase.from("member_roles").select("auth_user_id, role").eq("role", "admin")
    ]);
    if (error) {
      setPlayerNotice({ type: "error", text: error.message });
      return;
    }
    if (rolesError) {
      setPlayerNotice({ type: "error", text: rolesError.message });
      return;
    }
    const adminUserIds = new Set((roles || []).map((role) => role.auth_user_id));
    setPlayers(((data || []) as AdminPlayer[]).map((player) => ({
      ...player,
      is_admin: Boolean(player.auth_user_id && adminUserIds.has(player.auth_user_id))
    })));
  }, [query]);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  const updatePlayerDetails = async (event: FormEvent<HTMLFormElement>, player: AdminPlayer) => {
    event.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase) {
      setPlayerNotice({ type: "error", text: "Supabase is not configured. Check your environment variables." });
      return;
    }

    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") || "").trim();
    const dateOfBirth = String(form.get("dateOfBirth") || "").trim();
    const tierValue = Number(form.get("tier") || player.tier || 4);
    if (!fullName) {
      setPlayerNotice({ type: "error", text: "Player name is required." });
      return;
    }
    setSavingPlayerId(player.id);
    setPlayerNotice(null);

    const { error } = await supabase
      .from("players")
      .update({
        full_name: fullName,
        phone: String(form.get("phone") || "").trim() || null,
        date_of_birth: dateOfBirth || null,
        jamaat_city: String(form.get("jamaatCity") || "").trim() || null,
        self_assessment: String(form.get("selfAssessment") || "").trim() || null,
        dominant_hand: String(form.get("dominantHand") || "").trim() || null,
        jersey_size: String(form.get("jerseySize") || "").trim() || null,
        tier: tierValue
      })
      .eq("id", player.id);

    setSavingPlayerId(null);
    if (error) {
      setPlayerNotice({ type: "error", text: error.message });
      return;
    }

    setPlayerNotice({ type: "success", text: `${fullName} updated.` });
    await loadPlayers();
  };

  const updatePlayerAdminRole = async (player: AdminPlayer, makeAdmin: boolean) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setPlayerNotice({ type: "error", text: "Supabase is not configured. Check your environment variables." });
      return;
    }

    if (!player.auth_user_id) {
      setPlayerNotice({ type: "error", text: `${player.full_name} does not have a linked login yet.` });
      return;
    }

    setSavingPlayerId(player.id);
    setPlayerNotice(null);
    const result = makeAdmin
      ? await supabase.from("member_roles").upsert({ auth_user_id: player.auth_user_id, role: "admin" }, { onConflict: "auth_user_id" })
      : await supabase.from("member_roles").update({ role: "player" }).eq("auth_user_id", player.auth_user_id);
    setSavingPlayerId(null);

    if (result.error) {
      setPlayerNotice({ type: "error", text: result.error.message });
      return;
    }

    setPlayerNotice({ type: "success", text: makeAdmin ? `${player.full_name} is now an admin.` : `${player.full_name} is no longer an admin.` });
    await loadPlayers();
  };

  return (
    <AdminFrame active="players">
      <div className="grid gap-3 rounded-[22px] border-hairline border-line bg-card p-5 md:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] md:items-center md:p-6">
        <div className="grid gap-2">
          <span className="text-[13px] text-text-secondary">Players</span>
          <h1 className="text-3xl font-medium leading-tight tracking-[-0.4px] text-text-primary">Player management</h1>
          <p className="max-w-[720px] text-[15px] leading-relaxed text-text-secondary">Search player records and review city, phone, age, tier, rating, claim status, and tournament history. Details can only be changed after opening a player for update.</p>
        </div>
        <label className="grid gap-2 text-[13px] text-text-secondary">
          Search player name
          <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" placeholder="Search player name" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
      </div>
      {playerNotice && <p className={playerNotice.type === "error" ? "rounded-[14px] border-hairline border-[#f2c8c8] bg-[#fff5f5] p-4 text-[15px] text-[#a32d2d]" : "inline-flex items-center gap-2 rounded-[14px] border-hairline border-line bg-brand-light p-4 text-[15px] text-[#3b6d11]"}>{playerNotice.type === "success" && <CheckCircle2 size={16} />}{playerNotice.text}</p>}
      <div className="grid gap-3">
        {players.map((player) => (
          <article className="grid gap-4 rounded-[18px] border-hairline border-line bg-card p-4 md:p-5" key={player.id}>
            <div className="grid gap-3 sm:grid-cols-[48px_minmax(0,1fr)] lg:grid-cols-[48px_minmax(0,1fr)_auto] lg:items-center">
              <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-[#eaf3de] text-[14px] font-medium text-[#3b6d11]" style={player.profile_photo_url ? { backgroundImage: `url(${player.profile_photo_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
                {!player.profile_photo_url && getAdminInitials(player.full_name)}
              </span>
              <div className="grid min-w-0 gap-3">
                <div className="grid gap-1">
                  <strong className="truncate text-[18px] font-medium text-text-primary">{player.full_name}</strong>
                  <em className="truncate text-[14px] not-italic text-text-secondary">{player.jamaat_city || "City missing"} · {formatAdminClaimStatus(player.claim_status)} · {player.email || "Email not saved"}</em>
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  <AdminPlayerMeta label="Rating" value={formatAdminRating(player.rating)} />
                  <AdminPlayerMeta label="Age" value={calculateAdminAge(player.date_of_birth) || (player.age ? String(player.age) : "Not set")} />
                  <AdminPlayerMeta label="Tier" value={`Tier ${player.tier || 4}`} />
                  <AdminPlayerMeta label="Record" value={`${player.tournaments_played}T · ${player.matches_played}M`} />
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[260px] lg:grid-cols-1">
                <button className={expandedPlayerId === player.id ? "tap-card inline-flex min-h-10 items-center justify-center gap-2 rounded-[14px] border-hairline border-line bg-white px-4 text-xs font-medium text-text-secondary" : "tap-card inline-flex min-h-10 items-center justify-center gap-2 rounded-[14px] bg-brand px-4 text-xs font-medium text-white"} type="button" onClick={() => setExpandedPlayerId(expandedPlayerId === player.id ? null : player.id)}>
                  {expandedPlayerId === player.id ? <X size={15} /> : <ChevronDown size={15} />}
                  {expandedPlayerId === player.id ? "Close details" : "View details"}
                </button>
                <button
                  className={player.is_admin ? "tap-card inline-flex min-h-10 items-center justify-center rounded-[14px] border-hairline border-[#f2c8c8] bg-[#fff5f5] px-4 text-xs font-medium text-[#a32d2d] disabled:opacity-50" : "tap-card inline-flex min-h-10 items-center justify-center rounded-[14px] border-hairline border-line bg-white px-4 text-xs font-medium text-brand disabled:opacity-50"}
                  type="button"
                  onClick={() => updatePlayerAdminRole(player, !player.is_admin)}
                  disabled={savingPlayerId === player.id || !player.auth_user_id}
                  title={player.auth_user_id ? undefined : "Player must have a linked login before they can be made admin."}
                >
                  {player.is_admin ? "Remove admin" : "Make admin"}
                </button>
              </div>
            </div>

            {expandedPlayerId === player.id && (
              <form className="grid gap-4 rounded-[18px] border-hairline border-line bg-surface/45 p-3 md:p-4" onSubmit={(event) => updatePlayerDetails(event, player)}>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <AdminEditableField label="Full name" name="fullName" defaultValue={player.full_name} required />
                  <AdminReadonlyField label="Email" value={player.email || "Email not saved"} />
                  <AdminEditableField label="Phone number" name="phone" defaultValue={player.phone || ""} inputMode="tel" placeholder="9999999999" />
                  <AdminEditableField label="Date of birth" name="dateOfBirth" defaultValue={player.date_of_birth || ""} type="date" max={getAdminTodayDateInputValue()} />
                  <label className="grid gap-2 text-[13px] text-text-secondary">
                    <span className="inline-flex items-center gap-1.5"><Pencil size={12} /> Jamaat / city</span>
                    <select className="min-h-10 rounded-[12px] border-hairline border-line bg-white px-3 text-[15px] text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-light" name="jamaatCity" defaultValue={player.jamaat_city || ""}>
                      <option value="">Select city</option>
                      {adminJamaatCityOptions.map((city) => (
                        <option value={city} key={city}>{city}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-[13px] text-text-secondary">
                    <span className="inline-flex items-center gap-1.5"><Pencil size={12} /> Self evaluation</span>
                    <select className="min-h-10 rounded-[12px] border-hairline border-line bg-white px-3 text-[15px] text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-light" name="selfAssessment" defaultValue={player.self_assessment || ""}>
                      <option value="">Not set</option>
                      {adminSkillLevels.map((level) => (
                        <option value={level} key={level}>{level}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-[13px] text-text-secondary">
                    <span className="inline-flex items-center gap-1.5"><Pencil size={12} /> Dominant hand</span>
                    <select className="min-h-10 rounded-[12px] border-hairline border-line bg-white px-3 text-[15px] text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-light" name="dominantHand" defaultValue={player.dominant_hand || ""}>
                      <option value="">Not set</option>
                      {adminDominantHands.map((hand) => (
                        <option value={hand} key={hand}>{hand}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-[13px] text-text-secondary">
                    <span className="inline-flex items-center gap-1.5"><Pencil size={12} /> Shirt size</span>
                    <select className="min-h-10 rounded-[12px] border-hairline border-line bg-white px-3 text-[15px] text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-light" name="jerseySize" defaultValue={player.jersey_size || ""}>
                      <option value="">Not set</option>
                      {adminJerseySizes.map((size) => (
                        <option value={size} key={size}>{size}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-[13px] text-text-secondary">
                    <span className="inline-flex items-center gap-1.5"><Pencil size={12} /> Tier</span>
                    <select className="min-h-10 rounded-[12px] border-hairline border-line bg-white px-3 text-[15px] text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-light" name="tier" defaultValue={player.tier || 4}>
                      {[1, 2, 3, 4].map((tier) => (
                        <option value={tier} key={tier}>Tier {tier}</option>
                      ))}
                    </select>
                  </label>
                  <AdminReadonlyField label="Rating" value={formatAdminRating(player.rating)} />
                  <AdminReadonlyField label="Record" value={`${player.tournaments_played} tournaments · ${player.matches_played} matches`} />
                  <AdminReadonlyField label="Role" value={player.is_admin ? "Admin" : "Player"} />
                  <AdminReadonlyField label="Claim status" value={formatAdminClaimStatus(player.claim_status)} />
                  <AdminReadonlyField label="Video status" value={player.tennis_video_url ? formatAdminVideoStatus(player.tennis_video_status || null) : "No video"} />
                </div>
                {player.tennis_video_url && (
                  <a className="inline-flex min-h-9 w-max items-center justify-center gap-2 rounded-full bg-[#e5f1ff] px-3 text-[13px] font-medium text-[#185fa5]" href={player.tennis_video_url} target="_blank" rel="noreferrer">
                    View playing video
                    <ArrowRight size={13} />
                  </a>
                )}
                <div className="grid gap-2 border-t-hairline border-line pt-3 sm:flex sm:items-center sm:justify-end">
                  <button className="tap-card inline-flex min-h-11 items-center justify-center gap-2 rounded-[12px] bg-brand px-5 text-sm font-medium text-white disabled:opacity-60" type="submit" disabled={savingPlayerId === player.id}>
                    <CheckCircle2 size={16} />
                    {savingPlayerId === player.id ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            )}
          </article>
        ))}
        {!players.length && <div className="rounded-[14px] border-hairline border-line bg-card p-4 text-[15px] text-text-secondary">No players found.</div>}
      </div>
    </AdminFrame>
  );
}

export function AdminTournamentsScreen() {
  const [tournaments, setTournaments] = useState<AdminTournament[]>([]);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [creating, setCreating] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const loadTournaments = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const { data, error } = await supabase
      .from("tournaments")
      .select("id, name, status, venue_name, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents, max_players, notes, faqs")
      .order("starts_on", { ascending: false })
      .limit(30);

    if (error) {
      setNotice({ type: "error", text: error.message || "Could not load tournaments." });
      return;
    }

    setTournaments((data || []) as AdminTournament[]);
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  const createTournament = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.currentTarget;
    const form = new FormData(target);
    const supabase = getSupabaseClient();
    if (!supabase) {
      setNotice({ type: "error", text: "Supabase is not configured. Check your environment variables." });
      return;
    }

    setCreating(true);
    setNotice(null);
    const sportId = await getAdminTennisSportId();
    if (!sportId) {
      setCreating(false);
      setNotice({ type: "error", text: "Tennis sport was not found. Run the database migrations first." });
      return;
    }

    const startDate = String(form.get("startsOn") || "");
    const endDate = String(form.get("endsOn") || "");
    const registrationClosesAt = localDateTimeInputToIso(String(form.get("registrationClosesAt") || ""));
    const feeDollars = Number(form.get("fee") || 0);
    const tournamentPayload = {
      name: String(form.get("name") || ""),
      season_year: startDate ? new Date(`${startDate}T00:00:00`).getFullYear() : null,
      status: deriveAdminTournamentStatus({ startsOn: startDate, endsOn: endDate, registrationClosesAt }),
      venue_name: String(form.get("venueName") || ""),
      venue_address: String(form.get("venueName") || ""),
      venue_maps_url: String(form.get("mapsUrl") || ""),
      starts_on: startDate || null,
      ends_on: endDate || null,
      registration_closes_at: registrationClosesAt,
      registration_fee_cents: Math.round(feeDollars * 100),
      currency: "USD",
      max_players: form.get("maxPlayers") ? Number(form.get("maxPlayers")) : null,
      notes: String(form.get("notes") || "").trim() || null,
      faqs: getAdminTournamentFaqs(form)
    };
    const { error } = await supabase.from("tournaments").insert({
      sport_id: sportId,
      ...tournamentPayload
    });
    setCreating(false);

    if (error) {
      setNotice({ type: "error", text: error.message });
      return;
    }

    target.reset();
    setFormOpen(false);
    setNotice({ type: "success", text: "Tournament published successfully." });
    await loadTournaments();
  };

  const startCreatingTournament = () => {
    setFormOpen(true);
    setNotice(null);
  };

  const cancelTournamentForm = () => {
    setFormOpen(false);
    setNotice(null);
  };

  const deleteTournament = async (tournament: AdminTournament) => {
    const firstConfirm = window.confirm(`Delete ${tournament.name}? This will also delete its registrations.`);
    if (!firstConfirm) return;

    const secondConfirm = window.confirm(`Final confirmation: permanently delete ${tournament.name} and all related registrations?`);
    if (!secondConfirm) return;

    const supabase = getSupabaseClient();
    if (!supabase) {
      setNotice({ type: "error", text: "Supabase is not configured. Check your environment variables." });
      return;
    }

    setCreating(true);
    setNotice(null);

    const paymentDelete = await supabase.from("payment_ledger").delete().eq("tournament_id", tournament.id);
    if (paymentDelete.error) {
      setCreating(false);
      setNotice({ type: "error", text: paymentDelete.error.message });
      return;
    }

    const registrationDelete = await supabase.from("tournament_registrations").delete().eq("tournament_id", tournament.id);
    if (registrationDelete.error) {
      setCreating(false);
      setNotice({ type: "error", text: registrationDelete.error.message });
      return;
    }

    const tournamentDelete = await supabase.from("tournaments").delete().eq("id", tournament.id);
    setCreating(false);

    if (tournamentDelete.error) {
      setNotice({ type: "error", text: tournamentDelete.error.message });
      return;
    }

    setNotice({ type: "success", text: `${tournament.name} deleted. Registrations were removed with it.` });
    await loadTournaments();
  };

  return (
    <AdminFrame active="tournaments">
      <div className="grid gap-3 rounded-[22px] border-hairline border-line bg-card p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-6">
        <div className="grid gap-2">
          <span className="text-[13px] text-text-secondary">Tournaments</span>
          <h1 className="text-3xl font-medium leading-tight tracking-[-0.4px] text-text-primary">Tournament management</h1>
          <p className="max-w-[720px] text-[15px] leading-relaxed text-text-secondary">Create tournaments here, then open a tournament workspace to manage details, registrations, tiers, matches, drafts, and captains.</p>
        </div>
        <button className="tap-card inline-flex min-h-11 items-center justify-center rounded-[14px] bg-brand px-5 text-sm font-medium text-white" type="button" onClick={startCreatingTournament}>Create new tournament</button>
      </div>

      {notice && <p className={notice.type === "error" ? "rounded-[14px] border-hairline border-[#f2c8c8] bg-[#fff5f5] p-4 text-[15px] text-[#a32d2d]" : "rounded-[14px] border-hairline border-line bg-brand-light p-4 text-[15px] text-[#3b6d11]"}>{notice.text}</p>}

      {formOpen && (
        <form className="grid gap-4 rounded-[22px] border-hairline border-line bg-card p-4 md:p-5" onSubmit={createTournament} key="new-tournament-form">
          <div className="grid gap-1">
            <span className="text-[13px] text-text-secondary">Create tournament</span>
            <strong className="text-xl font-medium tracking-[-0.4px] text-text-primary">New tournament</strong>
          </div>
          <label className="grid gap-2 text-[13px] text-text-secondary">
            Name
            <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="name" placeholder="MRSA 2026" required />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-2 text-[13px] text-text-secondary">
              Start date
              <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-light" name="startsOn" type="date" required />
            </label>
            <label className="grid gap-2 text-[13px] text-text-secondary">
              End date
              <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-light" name="endsOn" type="date" required />
            </label>
          </div>
          <label className="grid gap-2 text-[13px] text-text-secondary">
            Registration ends
            <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-light" name="registrationClosesAt" type="datetime-local" required />
          </label>
          <label className="grid gap-2 text-[13px] text-text-secondary">
            Venue name
            <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="venueName" placeholder="Forest Sports Club" required />
          </label>
          <label className="grid gap-2 text-[13px] text-text-secondary">
            Venue Google Maps URL
            <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="mapsUrl" type="url" placeholder="https://maps.google.com/..." required />
          </label>
          <label className="grid gap-2 text-[13px] text-text-secondary">
            Tournament fees
            <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="fee" type="number" min="0" step="0.01" placeholder="121.00" required />
          </label>
          <AdminFaqFields />
          <label className="grid gap-1 text-[12px] text-text-secondary">
            Maximum players (slots)
            <input
              className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light"
              name="maxPlayers"
              type="number"
              min="1"
              step="1"
              placeholder="64"
            />
          </label>
          <div className="grid gap-2 sm:grid-cols-[auto_auto]">
            <button className="tap-card inline-flex min-h-11 items-center justify-center rounded-[14px] bg-brand px-5 text-sm font-medium text-white disabled:opacity-60" type="submit" disabled={creating}>{creating ? "Saving..." : "Create tournament"}</button>
            <button className="tap-card inline-flex min-h-11 items-center justify-center rounded-[14px] border-hairline border-line bg-white px-5 text-sm font-medium text-brand" type="button" onClick={cancelTournamentForm} disabled={creating}>Cancel</button>
          </div>
        </form>
      )}

      <div className="grid gap-3">
        {tournaments.map((tournament) => (
          <article className="grid gap-4 rounded-[18px] border-hairline border-line bg-card p-4 md:p-5" key={tournament.id}>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
              <div className="grid gap-2">
                <span className="inline-flex w-max rounded-full bg-brand-light px-2.5 py-1 text-[12px] font-medium text-[#3b6d11]">{formatAdminTournamentStatus(getAdminTournamentLifecycleStatus(tournament))}</span>
                <strong className="text-xl font-medium leading-tight tracking-[-0.4px] text-text-primary">{tournament.name}</strong>
                <em className="text-[14px] not-italic leading-relaxed text-text-secondary">{tournament.venue_name || "Venue TBD"} · {formatAdminDate(tournament.starts_on)} - {formatAdminDate(tournament.ends_on)} · closes {formatAdminDateTime(tournament.registration_closes_at)}</em>
              </div>
              <div className="grid gap-2 md:justify-items-end">
                <strong className="text-[20px] font-medium text-brand">{formatAdminCurrency(tournament.registration_fee_cents)}</strong>
                <em className="text-[13px] not-italic text-text-secondary">No player cap</em>
                <div className="flex flex-wrap gap-2">
                  <Link className="tap-card inline-flex min-h-9 items-center justify-center rounded-[12px] bg-brand px-4 text-xs font-medium text-white" href={`/admin/tournaments/${tournament.id}`}>Manage</Link>
                  <button className="tap-card min-h-9 rounded-[12px] border-hairline border-[#f2c8c8] bg-[#fff5f5] px-4 text-xs font-medium text-[#a32d2d]" type="button" onClick={() => deleteTournament(tournament)}>Delete</button>
                </div>
              </div>
            </div>
          </article>
        ))}
        {!tournaments.length && <div className="rounded-[14px] border-hairline border-line bg-card p-4 text-[15px] text-text-secondary">No tournaments found.</div>}
      </div>
    </AdminFrame>
  );
}

export function AdminTournamentDetailScreen({ tournamentId }: { tournamentId: string }) {
  const [tournament, setTournament] = useState<AdminTournament | null>(null);
  const [registeredPlayers, setRegisteredPlayers] = useState<AdminRegisteredPlayer[]>([]);
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [waitlistedPlayers, setWaitlistedPlayers] = useState<AdminWaitlistedPlayer[]>([]);
  const [interestedPlayers, setInterestedPlayers] = useState<AdminInterestedPlayer[]>([]);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [teamActionKey, setTeamActionKey] = useState<string | null>(null);
  const [reviewingVideoPlayerId, setReviewingVideoPlayerId] = useState<string | null>(null);
  const [removingPlayerKey, setRemovingPlayerKey] = useState<string | null>(null);
  const [confirmRemoveKey, setConfirmRemoveKey] = useState<string | null>(null);

  const loadTournamentWorkspace = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const [{ data, error }, { data: registrations, error: registrationError }, { data: waitlistRows, error: waitlistError }, { data: checkoutPayments, error: checkoutPaymentError }, { data: paidPayments, error: paidPaymentError }] = await Promise.all([
      supabase
        .from("tournaments")
        .select("id, name, status, venue_name, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents, max_players, notes, faqs")
        .eq("id", tournamentId)
        .maybeSingle(),
      supabase
        .from("tournament_registrations")
        .select("id, tournament_id, payment_status, players(id, full_name, email, phone, jamaat_city, age, date_of_birth, dominant_hand, jersey_size, profile_photo_url, tennis_video_url, tennis_video_status, self_assessment, tier, rating)")
        .eq("tournament_id", tournamentId)
        .neq("status", "cancelled")
        .in("payment_status", ["paid", "waived"])
        .order("registered_at", { ascending: true })
        .limit(500),
      supabase
        .from("tournament_registrations")
        .select("id, player_id, waitlist_status, registered_at, players(id, full_name, jamaat_city, profile_photo_url, self_assessment)")
        .eq("tournament_id", tournamentId)
        .eq("status", "waitlisted")
        .order("registered_at", { ascending: true })
        .limit(500),
      supabase
        .from("payment_ledger")
        .select("id, player_id, status, amount_cents, currency, occurred_at, stripe_failure_message, checkout_email, checkout_phone, players(id, full_name, jamaat_city, phone, email, profile_photo_url)")
        .eq("tournament_id", tournamentId)
        .eq("entry_type", "charge")
        .in("status", ["pending", "failed"])
        .order("occurred_at", { ascending: false })
        .limit(120),
      supabase
        .from("payment_ledger")
        .select("id, player_id, registration_id, status, amount_cents, currency, occurred_at")
        .eq("tournament_id", tournamentId)
        .eq("entry_type", "charge")
        .eq("status", "paid")
        .order("occurred_at", { ascending: false })
        .limit(120)
    ]);

    if (error || registrationError || waitlistError || checkoutPaymentError || paidPaymentError) {
      setNotice({ type: "error", text: (error || registrationError || waitlistError || checkoutPaymentError || paidPaymentError)?.message || "Could not load tournament workspace." });
      return;
    }

    const [{ data: shirtRows, error: shirtNameError }, { data: teamRows, error: teamError }] = await Promise.all([
      supabase
        .from("tournament_registrations")
        .select("id, shirt_name")
        .eq("tournament_id", tournamentId)
        .limit(500),
      supabase
        .from("tournament_teams")
        .select("id, tournament_id, name, sort_order, is_published, tournament_team_members(id, team_id, tournament_id, registration_id, player_id, is_captain, draft_order, tier_at_draft, shirt_name_snapshot)")
        .eq("tournament_id", tournamentId)
        .order("sort_order", { ascending: true })
        .order("draft_order", { referencedTable: "tournament_team_members", ascending: true })
        .limit(80)
    ]);
    if (shirtNameError || teamError) {
      setTeams([]);
      if (isAdminDraftSchemaMissing(shirtNameError?.message || teamError?.message || "")) {
        setNotice({ type: "error", text: "Team draft database tables are not applied yet. Apply the new Supabase migration before using team assignments." });
      } else {
        setNotice({ type: "error", text: shirtNameError?.message || teamError?.message || "Could not load team draft data." });
      }
    }

    setTournament((data || null) as AdminTournament | null);
    const shirtNamesByRegistration = new Map((shirtRows || []).map((row) => [row.id, row.shirt_name || ""]));
    const paymentsByRegistration = new Map<string, { id: string; player_id: string; registration_id: string | null; status: string; amount_cents: number; currency: string }>();
    const paymentsByPlayer = new Map<string, { id: string; player_id: string; registration_id: string | null; status: string; amount_cents: number; currency: string }>();
    (paidPayments || []).forEach((payment) => {
      if (payment.registration_id && !paymentsByRegistration.has(payment.registration_id)) {
        paymentsByRegistration.set(payment.registration_id, payment);
      }
      if (payment.player_id && !paymentsByPlayer.has(payment.player_id)) {
        paymentsByPlayer.set(payment.player_id, payment);
      }
    });
    const registeredPlayerIds = new Set((registrations || []).flatMap((row) => {
      const player = Array.isArray(row.players) ? row.players[0] : row.players;
      return player?.id ? [player.id] : [];
    }));
    setRegisteredPlayers((registrations || []).flatMap((row) => {
      const player = Array.isArray(row.players) ? row.players[0] : row.players;
      if (!player || !row.id || !row.tournament_id) return [];
      const payment = paymentsByRegistration.get(row.id) || paymentsByPlayer.get(player.id) || null;
      return [{
        id: player.id,
        registrationId: row.id,
        tournamentId: row.tournament_id,
        fullName: player.full_name || "Unknown player",
        jamaatCity: player.jamaat_city || "City missing",
        phone: player.phone || "",
        email: player.email || "",
        dateOfBirth: player.date_of_birth || "",
        dominantHand: player.dominant_hand || "",
        jerseySize: player.jersey_size || "",
        shirtName: shirtNamesByRegistration.get(row.id) || player.full_name || "",
        profilePhotoUrl: player.profile_photo_url || "",
        tennisVideoUrl: player.tennis_video_url || "",
        tennisVideoStatus: player.tennis_video_status || null,
        selfEvaluation: player.self_assessment || "Not set",
        age: calculateAdminAge(player.date_of_birth) ? `Age ${calculateAdminAge(player.date_of_birth)}` : player.age ? `Age ${player.age}` : "Age not set",
        tier: Number(player.tier || 4),
        rating: player.rating,
        paymentId: payment?.id || null,
        paymentStatus: row.payment_status || payment?.status || null,
        paymentAmountCents: payment?.amount_cents || 0,
        paymentCurrency: payment?.currency || "USD"
      }];
    }));
    if (!teamError) {
      setTeams((teamRows || []).map((team) => {
        const members = Array.isArray(team.tournament_team_members) ? team.tournament_team_members : team.tournament_team_members ? [team.tournament_team_members] : [];
        return {
          id: team.id,
          tournamentId: team.tournament_id,
          name: team.name,
          sortOrder: team.sort_order || 0,
          isPublished: Boolean(team.is_published),
          members: members.map((member) => ({
            id: member.id,
            teamId: member.team_id,
            tournamentId: member.tournament_id,
            registrationId: member.registration_id,
            playerId: member.player_id,
            isCaptain: Boolean(member.is_captain),
            draftOrder: member.draft_order ?? null,
            tierAtDraft: member.tier_at_draft ?? null,
            shirtName: member.shirt_name_snapshot || ""
          }))
        };
      }) as AdminTeam[]);
    }
    setWaitlistedPlayers((waitlistRows || []).flatMap((row) => {
      const player = Array.isArray(row.players) ? row.players[0] : row.players;
      if (!player || !row.id) return [];
      return [{
        registrationId: row.id,
        playerId: row.player_id,
        fullName: player.full_name || "Unknown player",
        jamaatCity: player.jamaat_city || "City missing",
        profilePhotoUrl: player.profile_photo_url || "",
        selfEvaluation: player.self_assessment || "Not set",
        waitlistStatus: row.waitlist_status || "pending",
        joinedAt: row.registered_at
      }];
    }));
    const interestedByPlayer = new Map<string, AdminInterestedPlayer>();
    (checkoutPayments || []).forEach((payment) => {
      const player = Array.isArray(payment.players) ? payment.players[0] : payment.players;
      if (!player || registeredPlayerIds.has(player.id)) return;
      const existing = interestedByPlayer.get(player.id);
      if (existing) {
        interestedByPlayer.set(player.id, {
          ...existing,
          checkoutCount: existing.checkoutCount + 1
        });
        return;
      }
      interestedByPlayer.set(player.id, {
        id: payment.id,
        playerId: player.id,
        fullName: player.full_name || "Unknown player",
        jamaatCity: player.jamaat_city || "City missing",
        phone: player.phone || "No phone",
        email: player.email || "No email",
        checkoutPhone: payment.checkout_phone || player.phone || "No phone",
        checkoutEmail: payment.checkout_email || player.email || "No email",
        profilePhotoUrl: player.profile_photo_url || "",
        status: payment.status,
        amountCents: payment.amount_cents || 0,
        currency: payment.currency || "USD",
        occurredAt: payment.occurred_at,
        failureMessage: payment.stripe_failure_message || "",
        checkoutCount: 1
      });
    });
    setInterestedPlayers(Array.from(interestedByPlayer.values()));
  }, [tournamentId]);

  useEffect(() => {
    loadTournamentWorkspace();
  }, [loadTournamentWorkspace]);

  const saveTournamentDetails = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase || !tournament) return;

    const form = new FormData(event.currentTarget);
    const startDate = String(form.get("startsOn") || "");
    const endDate = String(form.get("endsOn") || "");
    const registrationClosesAt = localDateTimeInputToIso(String(form.get("registrationClosesAt") || ""));
    const feeDollars = Number(form.get("fee") || 0);
    setSaving(true);
    setNotice(null);
    const { error } = await supabase.from("tournaments").update({
      name: String(form.get("name") || ""),
      status: tournament.status,
      venue_name: String(form.get("venueName") || ""),
      venue_address: String(form.get("venueName") || ""),
      venue_maps_url: String(form.get("mapsUrl") || ""),
      starts_on: startDate || null,
      ends_on: endDate || null,
      registration_closes_at: registrationClosesAt,
      registration_fee_cents: Math.round(feeDollars * 100),
      max_players: form.get("maxPlayers") ? Number(form.get("maxPlayers")) : null,
      notes: String(form.get("notes") || "").trim() || null,
      faqs: getAdminTournamentFaqs(form)
    }).eq("id", tournament.id);
    setSaving(false);

    if (error) {
      setNotice({ type: "error", text: error.message });
      return;
    }

    setNotice({ type: "success", text: "Tournament details saved." });
    await loadTournamentWorkspace();
  };

  const updateTournamentRegistrationStatus = async (status: "registration_open" | "registration_closed") => {
    const supabase = getSupabaseClient();
    if (!supabase || !tournament) return;

    setSaving(true);
    setNotice(null);
    const nextRegistrationClosesAt = status === "registration_open"
      ? new Date(Date.now() + 30 * 60 * 1000).toISOString()
      : tournament.registration_closes_at;
    const payload = status === "registration_open"
      ? { status, registration_closes_at: nextRegistrationClosesAt }
      : { status };
    const { error } = await supabase
      .from("tournaments")
      .update(payload)
      .eq("id", tournament.id);
    setSaving(false);

    if (error) {
      setNotice({ type: "error", text: error.message });
      return;
    }

    setTournament({ ...tournament, status, registration_closes_at: nextRegistrationClosesAt });
    setNotice({ type: "success", text: status === "registration_open" ? `Registration restarted${nextRegistrationClosesAt ? ` until ${formatAdminDateTime(nextRegistrationClosesAt)}` : ""}.` : "Registration stopped." });
    await loadTournamentWorkspace();
  };

  const updateRegisteredPlayerTier = async (playerId: string, selectedTournamentId: string, tier: number) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setNotice({ type: "error", text: "Supabase is not configured. Check your environment variables." });
      return false;
    }

    const seasonYear = tournament?.starts_on ? new Date(`${tournament.starts_on}T00:00:00`).getFullYear() : new Date().getFullYear();
    const [playerUpdate, seasonTierUpdate] = await Promise.all([
      supabase.from("players").update({ tier }).eq("id", playerId),
      supabase
        .from("player_season_tiers")
        .upsert({ player_id: playerId, season_year: seasonYear, tier }, { onConflict: "player_id,season_year" })
    ]);

    if (playerUpdate.error || seasonTierUpdate.error) {
      setNotice({ type: "error", text: playerUpdate.error?.message || seasonTierUpdate.error?.message || "Could not update player tier." });
      return false;
    }

    setRegisteredPlayers((current) => current.map((player) => player.id === playerId && player.tournamentId === selectedTournamentId ? { ...player, tier } : player));
    setNotice({ type: "success", text: `Player tier saved for ${seasonYear}.` });
    return true;
  };

  const reviewWaitlistPlayer = async (player: AdminWaitlistedPlayer, waitlistStatus: "accepted" | "rejected") => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setNotice({ type: "error", text: "Supabase is not configured. Check your environment variables." });
      return;
    }

    setSaving(true);
    setNotice(null);
    const { error } = await supabase
      .from("tournament_registrations")
      .update({
        waitlist_status: waitlistStatus,
        notes: waitlistStatus === "accepted" ? "Waitlist accepted by admin. Player may complete payment." : "Waitlist rejected by admin."
      })
      .eq("id", player.registrationId);
    setSaving(false);

    if (error) {
      setNotice({ type: "error", text: error.message });
      return;
    }

    setNotice({ type: "success", text: `${player.fullName} ${waitlistStatus === "accepted" ? "accepted from" : "rejected from"} the waitlist.` });
    await loadTournamentWorkspace();
  };

  const reviewRegisteredPlayerVideo = async (player: AdminRegisteredPlayer, status: "approved" | "rejected") => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setNotice({ type: "error", text: "Supabase is not configured. Check your environment variables." });
      return;
    }

    setReviewingVideoPlayerId(player.id);
    setNotice(null);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("players")
      .update({
        tennis_video_status: status,
        tennis_video_reviewed_at: new Date().toISOString(),
        tennis_video_reviewed_by: userData.user?.id || null,
        tennis_video_rejection_note: status === "rejected" ? "Please upload a clearer Google Drive playing video for draft review and set sharing to anyone with the link can view." : null
      })
      .eq("id", player.id);
    setReviewingVideoPlayerId(null);

    if (error) {
      setNotice({ type: "error", text: error.message });
      return;
    }

    setRegisteredPlayers((current) => current.map((registeredPlayer) => registeredPlayer.id === player.id ? { ...registeredPlayer, tennisVideoStatus: status } : registeredPlayer));
    setNotice({ type: "success", text: `${player.fullName}'s video ${status}.` });
  };

  const removeAndRefundRegisteredPlayer = async (player: AdminRegisteredPlayer) => {
    const playerKey = `${player.tournamentId}:${player.id}`;
    if (confirmRemoveKey !== playerKey) {
      setConfirmRemoveKey(playerKey);
      setNotice(null);
      return;
    }

    if (!player.paymentId) {
      setNotice({ type: "error", text: `No paid Stripe payment was found for ${player.fullName}.` });
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { data: sessionData } = await supabase.auth.getSession();
    setRemovingPlayerKey(playerKey);
    setNotice(null);
    const response = await fetch("/api/admin/refund-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.session?.access_token || ""}`
      },
      body: JSON.stringify({ paymentId: player.paymentId, removeRegistration: true })
    });
    const result = await response.json().catch(() => ({}));
    setRemovingPlayerKey(null);

    if (!response.ok) {
      setNotice({ type: "error", text: result.error || "Could not remove and refund this player." });
      return;
    }

    setConfirmRemoveKey(null);
    setNotice({ type: "success", text: `${player.fullName} was removed and refunded.` });
    await loadTournamentWorkspace();
  };

  const createTeam = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase || !tournament) return;

    const form = new FormData(event.currentTarget);
    const name = String(form.get("teamName") || "").trim();
    if (!name) {
      setNotice({ type: "error", text: "Team name is required." });
      return;
    }

    setTeamActionKey("create-team");
    setNotice(null);
    const nextSortOrder = teams.length ? Math.max(...teams.map((team) => team.sortOrder)) + 1 : 1;
    const { error: teamError } = await supabase.from("tournament_teams").insert({
      tournament_id: tournament.id,
      name,
      sort_order: nextSortOrder
    });
    setTeamActionKey(null);

    if (teamError) {
      setNotice({ type: "error", text: teamError.message });
      return;
    }

    event.currentTarget.reset();
    setNotice({ type: "success", text: `${name} created.` });
    await loadTournamentWorkspace();
  };

  const renameTeam = async (team: AdminTeam, name: string) => {
    const supabase = getSupabaseClient();
    const nextName = name.trim();
    if (!supabase || !tournament || !nextName) return;

    setTeamActionKey(`rename:${team.id}`);
    setNotice(null);
    const { error: teamError } = await supabase
      .from("tournament_teams")
      .update({ name: nextName })
      .eq("id", team.id)
      .eq("tournament_id", tournament.id);
    setTeamActionKey(null);

    if (teamError) {
      setNotice({ type: "error", text: teamError.message });
      return;
    }

    setTeams((current) => current.map((item) => item.id === team.id ? { ...item, name: nextName } : item));
    setNotice({ type: "success", text: "Team renamed." });
  };

  const deleteTeam = async (team: AdminTeam) => {
    const supabase = getSupabaseClient();
    if (!supabase || !tournament) return;
    if (team.members.length && !window.confirm(`Delete ${team.name} and remove ${team.members.length} team assignment${team.members.length === 1 ? "" : "s"}?`)) return;

    setTeamActionKey(`delete:${team.id}`);
    setNotice(null);
    const { error: teamError } = await supabase
      .from("tournament_teams")
      .delete()
      .eq("id", team.id)
      .eq("tournament_id", tournament.id);
    setTeamActionKey(null);

    if (teamError) {
      setNotice({ type: "error", text: teamError.message });
      return;
    }

    setNotice({ type: "success", text: `${team.name} deleted.` });
    await loadTournamentWorkspace();
  };

  const toggleTeamPublished = async (team: AdminTeam) => {
    const supabase = getSupabaseClient();
    if (!supabase || !tournament) return;

    setTeamActionKey(`publish:${team.id}`);
    setNotice(null);
    const { error: teamError } = await supabase
      .from("tournament_teams")
      .update({ is_published: !team.isPublished })
      .eq("id", team.id)
      .eq("tournament_id", tournament.id);
    setTeamActionKey(null);

    if (teamError) {
      setNotice({ type: "error", text: teamError.message });
      return;
    }

    setTeams((current) => current.map((item) => item.id === team.id ? { ...item, isPublished: !team.isPublished } : item));
    setNotice({ type: "success", text: `${team.name} is now ${team.isPublished ? "hidden from players" : "published for players"}.` });
  };

  const assignPlayerToTeam = async (player: AdminRegisteredPlayer, teamId: string) => {
    const supabase = getSupabaseClient();
    const team = teams.find((item) => item.id === teamId);
    if (!supabase || !tournament || !team) return;

    const existingMember = teams.flatMap((item) => item.members).find((member) => member.registrationId === player.registrationId);
    const nextDraftOrder = existingMember?.draftOrder || (team.members.length ? Math.max(...team.members.map((member) => member.draftOrder || 0)) + 1 : 1);
    setTeamActionKey(`assign:${player.registrationId}`);
    setNotice(null);
    const { error: memberError } = await supabase
      .from("tournament_team_members")
      .upsert({
        tournament_id: tournament.id,
        team_id: team.id,
        registration_id: player.registrationId,
        player_id: player.id,
        is_captain: false,
        draft_order: nextDraftOrder,
        tier_at_draft: player.tier,
        shirt_name_snapshot: player.shirtName || player.fullName
      }, { onConflict: "tournament_id,registration_id" });
    setTeamActionKey(null);

    if (memberError) {
      setNotice({ type: "error", text: memberError.message });
      return;
    }

    setNotice({ type: "success", text: `${player.fullName} assigned to ${team.name}.` });
    await loadTournamentWorkspace();
  };

  const removePlayerFromTeam = async (member: AdminTeamMember) => {
    const supabase = getSupabaseClient();
    if (!supabase || !tournament) return;

    setTeamActionKey(`remove:${member.id}`);
    setNotice(null);
    const { error: memberError } = await supabase
      .from("tournament_team_members")
      .delete()
      .eq("id", member.id)
      .eq("tournament_id", tournament.id);
    setTeamActionKey(null);

    if (memberError) {
      setNotice({ type: "error", text: memberError.message });
      return;
    }

    setNotice({ type: "success", text: "Player removed from team." });
    await loadTournamentWorkspace();
  };

  const setTeamCaptain = async (team: AdminTeam, member: AdminTeamMember) => {
    const supabase = getSupabaseClient();
    if (!supabase || !tournament) return;

    setTeamActionKey(`captain:${member.id}`);
    setNotice(null);
    const currentCaptain = team.members.find((item) => item.isCaptain && item.id !== member.id);
    if (currentCaptain) {
      const { error: unsetError } = await supabase
        .from("tournament_team_members")
        .update({ is_captain: false })
        .eq("id", currentCaptain.id)
        .eq("tournament_id", tournament.id);
      if (unsetError) {
        setTeamActionKey(null);
        setNotice({ type: "error", text: unsetError.message });
        return;
      }
    }

    const { error: captainError } = await supabase
      .from("tournament_team_members")
      .update({ is_captain: true })
      .eq("id", member.id)
      .eq("team_id", team.id)
      .eq("tournament_id", tournament.id);
    setTeamActionKey(null);

    if (captainError) {
      setNotice({ type: "error", text: captainError.message });
      return;
    }

    setNotice({ type: "success", text: "Captain saved." });
    await loadTournamentWorkspace();
  };

  const updateTeamMemberShirtName = async (player: AdminRegisteredPlayer, shirtName: string) => {
    const supabase = getSupabaseClient();
    if (!supabase || !tournament) return;

    const nextShirtName = shirtName.trim();
    setTeamActionKey(`shirt:${player.registrationId}`);
    setNotice(null);
    const registrationUpdate = await supabase
      .from("tournament_registrations")
      .update({ shirt_name: nextShirtName || null })
      .eq("id", player.registrationId)
      .eq("tournament_id", tournament.id);

    const memberUpdate = await supabase
      .from("tournament_team_members")
      .update({ shirt_name_snapshot: nextShirtName || player.fullName })
      .eq("registration_id", player.registrationId)
      .eq("tournament_id", tournament.id);
    setTeamActionKey(null);

    if (registrationUpdate.error || memberUpdate.error) {
      setNotice({ type: "error", text: registrationUpdate.error?.message || memberUpdate.error?.message || "Could not save shirt name." });
      return;
    }

    setRegisteredPlayers((current) => current.map((item) => item.registrationId === player.registrationId ? { ...item, shirtName: nextShirtName || item.fullName } : item));
    setTeams((current) => current.map((team) => ({
      ...team,
      members: team.members.map((member) => member.registrationId === player.registrationId ? { ...member, shirtName: nextShirtName || player.fullName } : member)
    })));
    setNotice({ type: "success", text: "Shirt name saved." });
  };

  const downloadRegisteredPlayersCsv = () => {
    if (!tournament) return;
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Jamaat / city",
      "Age",
      "Date of birth",
      "Self evaluation",
      "Dominant hand",
      "Shirt name",
      "Shirt size",
      "Tier",
      "Rating",
      "Payment status",
      "Payment amount",
      "Video status",
      "Video link"
    ];
    const rows = registeredPlayers.map((player) => [
      player.fullName,
      player.email,
      player.phone,
      player.jamaatCity,
      player.age.replace(/^Age\s*/i, ""),
      player.dateOfBirth,
      player.selfEvaluation,
      player.dominantHand,
      player.shirtName,
      player.jerseySize,
      `Tier ${player.tier}`,
      formatAdminRating(player.rating),
      player.paymentStatus || "",
      player.paymentAmountCents ? formatAdminCurrency(player.paymentAmountCents, player.paymentCurrency) : "",
      player.tennisVideoUrl ? formatAdminVideoStatus(player.tennisVideoStatus) : "No video",
      player.tennisVideoUrl
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escapeAdminCsvValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugifyAdminFileName(tournament.name)}-registered-players.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const downloadTeamsCsv = () => {
    if (!tournament) return;
    const playerByRegistration = new Map(registeredPlayers.map((player) => [player.registrationId, player]));
    const headers = [
      "Team",
      "Captain",
      "Player name",
      "City",
      "Tier",
      "Rating",
      "Shirt name",
      "Shirt size",
      "Email",
      "Phone"
    ];
    const rows = teams
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
      .flatMap((team) => team.members
        .slice()
        .sort((a, b) => Number(b.isCaptain) - Number(a.isCaptain) || (a.draftOrder || 9999) - (b.draftOrder || 9999))
        .map((member) => {
          const player = playerByRegistration.get(member.registrationId);
          return [
            team.name,
            member.isCaptain ? "Captain" : "",
            player?.fullName || "Unknown player",
            player?.jamaatCity || "",
            `Tier ${member.tierAtDraft || player?.tier || ""}`.trim(),
            player ? formatAdminRating(player.rating) : "",
            member.shirtName || player?.shirtName || player?.fullName || "",
            player?.jerseySize || "",
            player?.email || "",
            player?.phone || ""
          ];
        }));
    const csv = [headers, ...rows].map((row) => row.map(escapeAdminCsvValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugifyAdminFileName(tournament.name)}-teams.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminFrame active="tournaments">
      <div className="grid gap-3 rounded-[22px] border-hairline border-line bg-card p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-6">
        <div className="grid gap-2">
          <Link className="tap-card w-max text-[14px] font-medium text-brand" href="/admin/tournaments">← Tournaments</Link>
          <span className="text-[13px] text-text-secondary">Tournament workspace</span>
          <h1 className="text-3xl font-medium leading-tight tracking-[-0.4px] text-text-primary">{tournament?.name || "Tournament"}</h1>
          <p className="max-w-[720px] text-[15px] leading-relaxed text-text-secondary">Manage this tournament’s setup, registrations, tiers, and future operational workflows.</p>
        </div>
        <div className="grid gap-2 md:justify-items-end">
          <span className="rounded-full bg-brand-light px-3 py-1 text-[13px] font-medium text-[#3b6d11]">{registeredPlayers.length} registered</span>
          {tournament && <span className="rounded-full bg-surface px-3 py-1 text-[13px] font-medium text-text-secondary">{formatAdminTournamentStatus(tournament.status)}</span>}
          {tournament && (
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                className="tap-card inline-flex min-h-10 items-center justify-center gap-2 rounded-[14px] border-hairline border-line bg-white px-4 text-xs font-medium text-brand disabled:opacity-50 sm:col-span-2"
                type="button"
                onClick={downloadRegisteredPlayersCsv}
                disabled={!registeredPlayers.length}
              >
                <Download size={15} />
                Download registered CSV
              </button>
              <button
                className="tap-card inline-flex min-h-10 items-center justify-center gap-2 rounded-[14px] border-hairline border-line bg-white px-4 text-xs font-medium text-brand disabled:opacity-50 sm:col-span-2"
                type="button"
                onClick={downloadTeamsCsv}
                disabled={!teams.some((team) => team.members.length)}
              >
                <Download size={15} />
                Download teams CSV
              </button>
              <button
                className="tap-card inline-flex min-h-10 items-center justify-center rounded-[14px] border-hairline border-[#f2dccb] bg-[#fff8f1] px-4 text-xs font-medium text-[#8a4a22] disabled:opacity-50"
                type="button"
                onClick={() => updateTournamentRegistrationStatus("registration_closed")}
                disabled={saving || tournament.status === "registration_closed"}
              >
                Stop registration
              </button>
              <button
                className="tap-card inline-flex min-h-10 items-center justify-center rounded-[14px] bg-brand px-4 text-xs font-medium text-white disabled:opacity-50"
                type="button"
                onClick={() => updateTournamentRegistrationStatus("registration_open")}
                disabled={saving || tournament.status === "registration_open"}
              >
                Restart registration
              </button>
            </div>
          )}
        </div>
      </div>

      {notice && <p className={notice.type === "error" ? "rounded-[14px] border-hairline border-[#f2c8c8] bg-[#fff5f5] p-4 text-[15px] text-[#a32d2d]" : "rounded-[14px] border-hairline border-line bg-brand-light p-4 text-[15px] text-[#3b6d11]"}>{notice.text}</p>}

      {tournament ? (
        <>
          <section className="grid gap-4 rounded-[18px] border-hairline border-line bg-card p-4 md:p-5">
            <div className="grid gap-1">
              <span className="text-[13px] text-text-secondary">Details</span>
              <strong className="text-xl font-medium tracking-[-0.4px] text-text-primary">Tournament setup</strong>
            </div>
            <form className="grid gap-3" onSubmit={saveTournamentDetails}>
              <label className="grid gap-2 text-[13px] text-text-secondary">
                Name
                <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="name" defaultValue={tournament.name} required />
              </label>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2 text-[13px] text-text-secondary">
                  Start date
                  <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-light" name="startsOn" type="date" defaultValue={tournament.starts_on || ""} required />
                </label>
                <label className="grid gap-2 text-[13px] text-text-secondary">
                  End date
                  <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-light" name="endsOn" type="date" defaultValue={tournament.ends_on || ""} required />
                </label>
              </div>
              <label className="grid gap-2 text-[13px] text-text-secondary">
                Registration ends
                <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-light" name="registrationClosesAt" type="datetime-local" defaultValue={formatAdminDateTimeInput(tournament.registration_closes_at)} required />
              </label>
              <label className="grid gap-2 text-[13px] text-text-secondary">
                Venue name
                <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="venueName" defaultValue={tournament.venue_name || ""} required />
              </label>
              <label className="grid gap-2 text-[13px] text-text-secondary">
                Venue Google Maps URL
                <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="mapsUrl" type="url" defaultValue={tournament.venue_maps_url || ""} required />
              </label>
              <label className="grid gap-2 text-[13px] text-text-secondary">
                Tournament fees
                <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="fee" type="number" min="0" step="0.01" defaultValue={tournament.registration_fee_cents / 100} required />
              </label>
              <label className="grid gap-2 text-[13px] text-text-secondary">
                Maximum players (slots)
                <input
                  className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light"
                  name="maxPlayers"
                  type="number"
                  min="1"
                  step="1"
                  defaultValue={tournament.max_players ?? ""}
                />
              </label>
              <AdminFaqFields faqs={normalizeAdminTournamentFaqs(tournament.faqs)} />
              <button className="tap-card inline-flex min-h-11 w-full items-center justify-center rounded-[14px] bg-brand px-5 text-sm font-medium text-white disabled:opacity-60 md:w-max" type="submit" disabled={saving}>{saving ? "Saving..." : "Save details"}</button>
            </form>
          </section>

          <section className="grid gap-3 md:grid-cols-1">
            <AdminFutureCard title="Match creation" copy="Build singles, doubles, and scheduled match flows here." />
          </section>

          <section className="grid gap-3 rounded-[18px] border-hairline border-line bg-card p-4 md:p-5">
            <AdminTeamBuilder
              teams={teams}
              players={registeredPlayers}
              actionKey={teamActionKey}
              onCreateTeam={createTeam}
              onRenameTeam={renameTeam}
              onDeleteTeam={deleteTeam}
              onTogglePublished={toggleTeamPublished}
              onAssignPlayer={assignPlayerToTeam}
              onRemovePlayer={removePlayerFromTeam}
              onSetCaptain={setTeamCaptain}
              onUpdateShirtName={updateTeamMemberShirtName}
            />
          </section>

          <section className="grid gap-3 rounded-[18px] border-hairline border-line bg-card p-4 md:p-5">
            <TieredRegisteredPlayers
              players={registeredPlayers}
              onTierChange={updateRegisteredPlayerTier}
              onVideoReview={reviewRegisteredPlayerVideo}
              reviewingVideoPlayerId={reviewingVideoPlayerId}
              onRemoveAndRefund={removeAndRefundRegisteredPlayer}
              removingPlayerKey={removingPlayerKey}
              confirmRemoveKey={confirmRemoveKey}
              onCancelRemove={() => setConfirmRemoveKey(null)}
            />
          </section>

          <section className="grid gap-3 rounded-[18px] border-hairline border-line bg-card p-4 md:p-5">
            <InterestedPlayersList players={interestedPlayers} />
          </section>

          <section className="grid gap-3 rounded-[18px] border-hairline border-line bg-card p-4 md:p-5">
            <WaitlistedPlayersList players={waitlistedPlayers} onReview={reviewWaitlistPlayer} saving={saving} />
          </section>
        </>
      ) : (
        <div className="rounded-[14px] border-hairline border-line bg-card p-4 text-[15px] text-text-secondary">Loading tournament workspace...</div>
      )}
    </AdminFrame>
  );
}

function AdminFutureCard({ title, copy }: { title: string; copy: string }) {
  return (
    <article className="grid gap-2 rounded-[18px] border-hairline border-line bg-card p-4">
      <span className="inline-flex w-max rounded-full bg-surface px-2.5 py-1 text-[12px] font-medium text-text-secondary">Coming soon</span>
      <strong className="text-lg font-medium leading-tight text-text-primary">{title}</strong>
      <em className="text-[15px] not-italic leading-relaxed text-text-secondary">{copy}</em>
    </article>
  );
}

function AdminTeamBuilder({
  teams,
  players,
  actionKey,
  onCreateTeam,
  onRenameTeam,
  onDeleteTeam,
  onTogglePublished,
  onAssignPlayer,
  onRemovePlayer,
  onSetCaptain,
  onUpdateShirtName
}: {
  teams: AdminTeam[];
  players: AdminRegisteredPlayer[];
  actionKey: string | null;
  onCreateTeam: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onRenameTeam: (team: AdminTeam, name: string) => Promise<void>;
  onDeleteTeam: (team: AdminTeam) => Promise<void>;
  onTogglePublished: (team: AdminTeam) => Promise<void>;
  onAssignPlayer: (player: AdminRegisteredPlayer, teamId: string) => Promise<void>;
  onRemovePlayer: (member: AdminTeamMember) => Promise<void>;
  onSetCaptain: (team: AdminTeam, member: AdminTeamMember) => Promise<void>;
  onUpdateShirtName: (player: AdminRegisteredPlayer, shirtName: string) => Promise<void>;
}) {
  const [renameValues, setRenameValues] = useState<Record<string, string>>({});
  const [selectedTeams, setSelectedTeams] = useState<Record<string, string>>({});
  const [shirtNames, setShirtNames] = useState<Record<string, string>>({});
  const assignedRegistrationIds = new Set(teams.flatMap((team) => team.members.map((member) => member.registrationId)));
  const playerByRegistration = new Map(players.map((player) => [player.registrationId, player]));
  const orderedTeams = teams.slice().sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  const unassignedPlayers = players
    .filter((player) => !assignedRegistrationIds.has(player.registrationId))
    .sort((a, b) => a.tier - b.tier || a.fullName.localeCompare(b.fullName));
  const assignedCount = assignedRegistrationIds.size;

  return (
    <div className="grid gap-4" aria-label="Team draft builder">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <span className="grid gap-1">
          <span className="text-[13px] text-text-secondary">Draft workspace</span>
          <h3 className="text-xl font-medium tracking-[-0.3px] text-text-primary">Teams and captains</h3>
          <p className="max-w-[720px] text-[13px] leading-relaxed text-text-secondary">Create tournament teams, assign registered players, mark captains, and keep shirt names ready for export.</p>
        </span>
        <span className="grid grid-cols-2 gap-2 text-center md:min-w-[220px]">
          <b className="rounded-[14px] bg-brand-light px-3 py-2 text-[13px] font-medium text-[#3b6d11]">{assignedCount} assigned</b>
          <b className="rounded-[14px] bg-surface px-3 py-2 text-[13px] font-medium text-text-secondary">{unassignedPlayers.length} unassigned</b>
        </span>
      </div>

      <form className="grid gap-2 rounded-[14px] border-hairline border-line bg-surface/50 p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end" onSubmit={onCreateTeam}>
        <label className="grid gap-2 text-[13px] text-text-secondary">
          Team name
          <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="teamName" placeholder="Team Green" required />
        </label>
        <button className="tap-card inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-brand px-4 text-sm font-medium text-white disabled:opacity-60" type="submit" disabled={actionKey === "create-team"}>
          <Plus size={16} />
          {actionKey === "create-team" ? "Creating..." : "Create team"}
        </button>
      </form>

      <div className="grid gap-3">
        {orderedTeams.map((team) => {
          const captain = team.members.find((member) => member.isCaptain);
          const captainPlayer = captain ? playerByRegistration.get(captain.registrationId) : null;
          const renameValue = renameValues[team.id] ?? team.name;

          return (
            <article className="grid gap-3 rounded-[16px] border-hairline border-line bg-white p-3" key={team.id}>
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                <div className="grid gap-2">
                  <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <label className="grid gap-1 text-[12px] text-text-secondary">
                      Team
                      <input
                        className="min-h-10 rounded-[12px] border-hairline border-line bg-white px-3 text-[15px] font-medium text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-light"
                        value={renameValue}
                        onChange={(event) => setRenameValues((current) => ({ ...current, [team.id]: event.target.value }))}
                      />
                    </label>
                    <span className="flex flex-wrap gap-2 sm:justify-end">
                      <button className="tap-card inline-flex min-h-9 items-center justify-center rounded-[12px] border-hairline border-line bg-white px-3 text-xs font-medium text-brand disabled:opacity-50" type="button" onClick={() => onRenameTeam(team, renameValue)} disabled={actionKey === `rename:${team.id}` || !renameValue.trim() || renameValue.trim() === team.name}>
                        {actionKey === `rename:${team.id}` ? "Saving..." : "Save name"}
                      </button>
                      <button className={team.isPublished ? "tap-card inline-flex min-h-9 items-center justify-center rounded-[12px] border-hairline border-[#f2dccb] bg-[#fff8f1] px-3 text-xs font-medium text-[#8a4a22] disabled:opacity-50" : "tap-card inline-flex min-h-9 items-center justify-center rounded-[12px] bg-brand px-3 text-xs font-medium text-white disabled:opacity-50"} type="button" onClick={() => onTogglePublished(team)} disabled={actionKey === `publish:${team.id}`}>
                        {team.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <button className="tap-card inline-flex min-h-9 items-center justify-center gap-1 rounded-[12px] border-hairline border-[#f2c8c8] bg-[#fff5f5] px-3 text-xs font-medium text-[#a32d2d] disabled:opacity-50" type="button" onClick={() => onDeleteTeam(team)} disabled={actionKey === `delete:${team.id}`}>
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={team.isPublished ? "inline-flex w-max rounded-full bg-brand-light px-2.5 py-1 text-[12px] font-medium text-[#3b6d11]" : "inline-flex w-max rounded-full bg-[#fff4d8] px-2.5 py-1 text-[12px] font-medium text-[#8a5a00]"}>
                      {team.isPublished ? "Published" : "Draft"}
                    </span>
                    <span className="inline-flex w-max rounded-full bg-surface px-2.5 py-1 text-[12px] font-medium text-text-secondary">{team.members.length} players</span>
                    <span className={captainPlayer ? "inline-flex w-max rounded-full bg-[#e5f1ff] px-2.5 py-1 text-[12px] font-medium text-[#185fa5]" : "inline-flex w-max rounded-full bg-[#f1efe8] px-2.5 py-1 text-[12px] font-medium text-text-secondary"}>
                      Captain: {captainPlayer?.fullName || "Not assigned"}
                    </span>
                  </div>
                </div>
              </div>

              {team.members.length ? (
                <ul className="grid gap-2">
                  {team.members
                    .slice()
                    .sort((a, b) => Number(b.isCaptain) - Number(a.isCaptain) || (a.draftOrder || 9999) - (b.draftOrder || 9999))
                    .map((member) => {
                      const player = playerByRegistration.get(member.registrationId);
                      const shirtNameValue = shirtNames[member.registrationId] ?? (member.shirtName || player?.shirtName || player?.fullName || "");
                      if (!player) return null;

                      return (
                        <li className="grid gap-3 rounded-[14px] border-hairline border-line bg-card p-3 xl:grid-cols-[minmax(180px,1fr)_minmax(140px,0.8fr)_minmax(180px,0.9fr)_auto] xl:items-center" key={member.id}>
                          <div className="grid grid-cols-[38px_minmax(0,1fr)] items-center gap-3">
                            <span className="relative grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-[#eaf3de] text-[13px] font-medium text-[#3b6d11]" style={player.profilePhotoUrl ? { backgroundImage: `url(${player.profilePhotoUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
                              {!player.profilePhotoUrl && getAdminInitials(player.fullName)}
                            </span>
                            <span className="grid min-w-0 gap-1">
                              <strong className="truncate text-[15px] font-medium text-text-primary">{player.fullName}</strong>
                              <em className="truncate text-[12px] not-italic text-text-secondary">{player.jamaatCity}</em>
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className={`inline-flex w-max rounded-full px-2.5 py-1 text-[12px] font-medium ${getAdminTierBadgeClass(member.tierAtDraft || player.tier)}`}>Tier {member.tierAtDraft || player.tier}</span>
                            <span className="inline-flex w-max rounded-full bg-surface px-2.5 py-1 text-[12px] font-medium text-text-secondary">{player.jerseySize || "No shirt size"}</span>
                            {member.isCaptain && <span className="inline-flex w-max items-center gap-1 rounded-full bg-[#e5f1ff] px-2.5 py-1 text-[12px] font-medium text-[#185fa5]"><Crown size={13} /> Captain</span>}
                          </div>
                          <div className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                            <label className="grid gap-1 text-[12px] text-text-secondary">
                              Shirt name
                              <input
                                className="min-h-9 rounded-[10px] border-hairline border-line bg-white px-2.5 text-[14px] text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
                                value={shirtNameValue}
                                onChange={(event) => setShirtNames((current) => ({ ...current, [member.registrationId]: event.target.value }))}
                              />
                            </label>
                            <button className="tap-card inline-flex min-h-9 items-center justify-center rounded-[10px] border-hairline border-line bg-white px-3 text-[12px] font-medium text-brand disabled:opacity-50" type="button" onClick={() => onUpdateShirtName(player, shirtNameValue)} disabled={actionKey === `shirt:${member.registrationId}`}>
                              {actionKey === `shirt:${member.registrationId}` ? "Saving..." : "Save"}
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2 xl:justify-end">
                            <button className={member.isCaptain ? "tap-card inline-flex min-h-9 items-center justify-center gap-1 rounded-[12px] bg-[#e5f1ff] px-3 text-xs font-medium text-[#185fa5] disabled:opacity-50" : "tap-card inline-flex min-h-9 items-center justify-center gap-1 rounded-[12px] border-hairline border-line bg-white px-3 text-xs font-medium text-brand disabled:opacity-50"} type="button" onClick={() => onSetCaptain(team, member)} disabled={member.isCaptain || actionKey === `captain:${member.id}`}>
                              <Crown size={14} />
                              {member.isCaptain ? "Captain" : "Make captain"}
                            </button>
                            <button className="tap-card inline-flex min-h-9 items-center justify-center rounded-[12px] border-hairline border-[#f2c8c8] bg-white px-3 text-xs font-medium text-[#a32d2d] disabled:opacity-50" type="button" onClick={() => onRemovePlayer(member)} disabled={actionKey === `remove:${member.id}`}>
                              Remove
                            </button>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              ) : (
                <div className="rounded-[14px] border-hairline border-line bg-surface/60 p-4 text-[15px] text-text-secondary">No players assigned yet.</div>
              )}
            </article>
          );
        })}
        {!orderedTeams.length && <div className="rounded-[14px] border-hairline border-line bg-surface/60 p-4 text-[15px] text-text-secondary">Create a team to start assigning drafted players.</div>}
      </div>

      <div className="grid gap-3 rounded-[16px] border-hairline border-line bg-surface/50 p-3">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-[15px] font-medium text-text-primary">Unassigned draft pool</h4>
          <span className="rounded-full bg-white px-2.5 py-1 text-[12px] font-medium text-text-secondary">{unassignedPlayers.length} players</span>
        </div>
        {unassignedPlayers.length ? (
          <ul className="grid gap-2">
            {unassignedPlayers.map((player) => {
              const selectedTeamId = selectedTeams[player.registrationId] || orderedTeams[0]?.id || "";
              return (
                <li className="grid gap-3 rounded-[14px] border-hairline border-line bg-white p-3 lg:grid-cols-[minmax(180px,1fr)_minmax(130px,0.55fr)_minmax(220px,0.8fr)] lg:items-center" key={player.registrationId}>
                  <span className="grid min-w-0 gap-1">
                    <strong className="truncate text-[15px] font-medium text-text-primary">{player.fullName}</strong>
                    <em className="truncate text-[13px] not-italic text-text-secondary">{player.jamaatCity} · {player.jerseySize || "No shirt size"}</em>
                  </span>
                  <span className={`inline-flex w-max rounded-full px-2.5 py-1 text-[12px] font-medium ${getAdminTierBadgeClass(player.tier)}`}>Tier {player.tier}</span>
                  <span className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <select
                      className="min-h-10 rounded-[12px] border-hairline border-line bg-white px-3 text-[14px] text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
                      value={selectedTeamId}
                      onChange={(event) => setSelectedTeams((current) => ({ ...current, [player.registrationId]: event.target.value }))}
                      disabled={!orderedTeams.length}
                      aria-label={`Select team for ${player.fullName}`}
                    >
                      {!orderedTeams.length && <option value="">Create a team first</option>}
                      {orderedTeams.map((team) => (
                        <option value={team.id} key={team.id}>{team.name}</option>
                      ))}
                    </select>
                    <button className="tap-card inline-flex min-h-10 items-center justify-center rounded-[12px] bg-brand px-3 text-xs font-medium text-white disabled:opacity-50" type="button" onClick={() => onAssignPlayer(player, selectedTeamId)} disabled={!selectedTeamId || actionKey === `assign:${player.registrationId}`}>
                      {actionKey === `assign:${player.registrationId}` ? "Assigning..." : "Assign"}
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-[14px] border-hairline border-line bg-white p-4 text-[15px] text-text-secondary">All registered players are assigned.</div>
        )}
      </div>
    </div>
  );
}

type AdminFaq = { question: string; answer: string };

function normalizeAdminTournamentFaqs(value: unknown): AdminFaq[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as { question?: unknown; answer?: unknown };
    const question = typeof record.question === "string" ? record.question.trim() : "";
    const answer = typeof record.answer === "string" ? record.answer.trim() : "";
    return question && answer ? [{ question, answer }] : [];
  });
}

function getAdminTournamentFaqs(form: FormData): AdminFaq[] {
  const questions = form.getAll("faqQuestion").map((value) => String(value || "").trim());
  const answers = form.getAll("faqAnswer").map((value) => String(value || "").trim());
  return questions.flatMap((question, index) => {
    const answer = answers[index] || "";
    return question && answer ? [{ question, answer }] : [];
  });
}

function AdminFaqFields({ faqs = [] }: { faqs?: AdminFaq[] }) {
  const [rows, setRows] = useState<AdminFaq[]>(() => faqs.length ? faqs : [{ question: "", answer: "" }]);

  const updateRow = (index: number, field: keyof AdminFaq, value: string) => {
    setRows((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, [field]: value } : row));
  };

  const addRow = () => {
    setRows((current) => [...current, { question: "", answer: "" }]);
  };

  const removeRow = (index: number) => {
    setRows((current) => current.length === 1 ? [{ question: "", answer: "" }] : current.filter((_, rowIndex) => rowIndex !== index));
  };

  return (
    <fieldset className="grid gap-3 rounded-[16px] border-hairline border-line bg-surface/50 p-3">
      <legend className="px-1 text-[13px] font-medium text-text-primary">FAQs</legend>
      <p className="text-[13px] leading-relaxed text-text-secondary">Add question and answer pairs for players. Empty rows are ignored.</p>
      {rows.map((faq, index) => (
        <div className="grid gap-2 rounded-[14px] border-hairline border-line bg-white p-3" key={`faq-${index}`}>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <span className="text-[13px] font-medium text-text-primary">FAQ {index + 1}</span>
            <button className="tap-card rounded-full bg-[#fcebeb] px-3 py-1 text-[12px] font-medium text-[#a32d2d]" type="button" onClick={() => removeRow(index)}>Remove</button>
          </div>
          <input className="min-h-10 rounded-[12px] border-hairline border-line bg-white px-3 text-[15px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="faqQuestion" placeholder={`Question ${index + 1}`} value={faq.question} onChange={(event) => updateRow(index, "question", event.target.value)} />
          <textarea className="min-h-20 rounded-[12px] border-hairline border-line bg-white px-3 py-2 text-[15px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="faqAnswer" placeholder="Answer" value={faq.answer} onChange={(event) => updateRow(index, "answer", event.target.value)} />
        </div>
      ))}
      <button className="tap-card inline-flex min-h-10 w-full items-center justify-center rounded-[12px] border-hairline border-line bg-white px-4 text-[13px] font-medium text-brand md:w-max" type="button" onClick={addRow}>
        Add FAQ
      </button>
    </fieldset>
  );
}

function InterestedPlayersList({ players }: { players: AdminInterestedPlayer[] }) {
  return (
    <div className="grid gap-3" aria-label="Interested players">
      <div className="grid gap-1 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <span className="grid gap-1">
          <h3 className="text-[15px] font-medium text-text-primary">Interested players</h3>
          <p className="max-w-[680px] text-[13px] leading-relaxed text-text-secondary">Went until checkout page but did not register. These players may have closed checkout, left before paying, or had a card declined.</p>
        </span>
        <span className="rounded-full bg-[#fff4d8] px-3 py-1 text-[13px] font-medium text-[#8a5a00]">{players.length} players</span>
      </div>

      {players.length ? (
        <ul className="grid gap-2">
          {players.map((player) => (
            <li className="grid gap-3 rounded-[14px] border-hairline border-[#f0e2bd] bg-[#fffdf7] p-3 md:grid-cols-[42px_minmax(0,1fr)_auto] md:items-center" key={player.id}>
              <span className="relative grid h-[42px] w-[42px] place-items-center overflow-hidden rounded-full bg-[#fff4d8] text-[13px] font-medium text-[#8a5a00]" style={player.profilePhotoUrl ? { backgroundImage: `url(${player.profilePhotoUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
                {!player.profilePhotoUrl && getAdminInitials(player.fullName)}
              </span>
              <span className="grid min-w-0 gap-2">
                <span className="grid min-w-0 gap-1">
                  <strong className="truncate text-[15px] font-medium text-text-primary">{player.fullName}</strong>
                  <em className="truncate text-[13px] not-italic text-text-secondary">{player.jamaatCity} · {formatAdminCurrency(player.amountCents, player.currency)} checkout · {player.checkoutCount} {player.checkoutCount === 1 ? "occurrence" : "occurrences"}</em>
                </span>
                <span className="grid gap-1 text-[13px] text-text-secondary sm:grid-cols-2">
                  <a className="truncate font-medium text-brand" href={`tel:${player.checkoutPhone}`}>{player.checkoutPhone}</a>
                  <a className="truncate font-medium text-brand" href={`mailto:${player.checkoutEmail}`}>{player.checkoutEmail}</a>
                </span>
                {player.failureMessage && <em className="text-[12px] not-italic leading-relaxed text-[#a32d2d]">{player.failureMessage}</em>}
              </span>
              <span className="grid gap-1 md:justify-items-end">
                <b className={player.status === "failed" ? "rounded-full bg-[#fcebeb] px-2.5 py-1 text-[12px] font-medium text-[#a32d2d]" : "rounded-full bg-[#fff4d8] px-2.5 py-1 text-[12px] font-medium text-[#8a5a00]"}>{formatAdminPaymentStatus(player.status)}</b>
                <em className="text-[12px] not-italic text-text-secondary">Latest: {formatAdminDateTime(player.occurredAt)}</em>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-[14px] border-hairline border-line bg-surface/60 p-4 text-[15px] text-text-secondary">No checkout-only players yet.</div>
      )}
    </div>
  );
}

function WaitlistedPlayersList({ players, onReview, saving }: { players: AdminWaitlistedPlayer[]; onReview: (player: AdminWaitlistedPlayer, status: "accepted" | "rejected") => Promise<void>; saving: boolean }) {
  return (
    <div className="grid gap-3" aria-label="Waitlisted players">
      <div className="grid gap-1 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <span className="grid gap-1">
          <h3 className="text-[15px] font-medium text-text-primary">Waitlist</h3>
          <p className="max-w-[680px] text-[13px] leading-relaxed text-text-secondary">Accept a player to unlock their payment button. Reject keeps registration closed for them.</p>
        </span>
        <span className="rounded-full bg-brand-light px-3 py-1 text-[13px] font-medium text-[#3b6d11]">{players.length} players</span>
      </div>

      {players.length ? (
        <ul className="grid gap-2">
          {players.map((player) => (
            <li className="grid gap-3 rounded-[14px] border-hairline border-line bg-card p-3 md:grid-cols-[42px_minmax(0,1fr)_auto] md:items-center" key={player.registrationId}>
              <span className="relative grid h-[42px] w-[42px] place-items-center overflow-hidden rounded-full bg-brand-light text-[13px] font-medium text-[#3b6d11]" style={player.profilePhotoUrl ? { backgroundImage: `url(${player.profilePhotoUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
                {!player.profilePhotoUrl && getAdminInitials(player.fullName)}
              </span>
              <span className="grid min-w-0 gap-1">
                <strong className="truncate text-[15px] font-medium text-text-primary">{player.fullName}</strong>
                <em className="truncate text-[13px] not-italic text-text-secondary">{player.jamaatCity} · Self: {player.selfEvaluation}</em>
                <em className="text-[12px] not-italic text-text-secondary">Joined {formatAdminDateTime(player.joinedAt)}</em>
              </span>
              <span className="grid gap-2 md:justify-items-end">
                <b className={player.waitlistStatus === "accepted" ? "rounded-full bg-brand-light px-2.5 py-1 text-[12px] font-medium text-[#3b6d11]" : player.waitlistStatus === "rejected" ? "rounded-full bg-[#fcebeb] px-2.5 py-1 text-[12px] font-medium text-[#a32d2d]" : "rounded-full bg-[#fff4d8] px-2.5 py-1 text-[12px] font-medium text-[#8a5a00]"}>{player.waitlistStatus}</b>
                <span className="flex flex-wrap gap-2">
                  <button className="tap-card inline-flex min-h-9 items-center justify-center rounded-[12px] bg-brand px-3 text-xs font-medium text-white disabled:opacity-50" type="button" onClick={() => onReview(player, "accepted")} disabled={saving || player.waitlistStatus === "accepted"}>Accept</button>
                  <button className="tap-card inline-flex min-h-9 items-center justify-center rounded-[12px] border-hairline border-[#f2c8c8] bg-[#fff5f5] px-3 text-xs font-medium text-[#a32d2d] disabled:opacity-50" type="button" onClick={() => onReview(player, "rejected")} disabled={saving || player.waitlistStatus === "rejected"}>Reject</button>
                </span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-[14px] border-hairline border-line bg-surface/60 p-4 text-[15px] text-text-secondary">No waitlist requests yet.</div>
      )}
    </div>
  );
}

function TieredRegisteredPlayers({
  players,
  onTierChange,
  onVideoReview,
  reviewingVideoPlayerId,
  onRemoveAndRefund,
  removingPlayerKey,
  confirmRemoveKey,
  onCancelRemove
}: {
  players: AdminRegisteredPlayer[];
  onTierChange: (playerId: string, tournamentId: string, tier: number) => Promise<boolean>;
  onVideoReview: (player: AdminRegisteredPlayer, status: "approved" | "rejected") => Promise<void>;
  reviewingVideoPlayerId: string | null;
  onRemoveAndRefund: (player: AdminRegisteredPlayer) => Promise<void>;
  removingPlayerKey: string | null;
  confirmRemoveKey: string | null;
  onCancelRemove: () => void;
}) {
  const [pendingTiers, setPendingTiers] = useState<Record<string, number>>({});
  const [savingTierKey, setSavingTierKey] = useState<string | null>(null);
  const [collapsedTiers, setCollapsedTiers] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true, 4: true });

  if (!players.length) {
    return <div className="rounded-[14px] border-hairline border-line bg-surface/60 p-4 text-[15px] text-text-secondary">No paid or waived registrations yet.</div>;
  }

  const grouped = [1, 2, 3, 4].map((tier) => ({
    tier,
    players: players.filter((player) => player.tier === tier).sort((a, b) => a.fullName.localeCompare(b.fullName))
  }));

  return (
    <div className="grid gap-3" aria-label="Registered players grouped by tier">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[15px] font-medium text-text-primary">Registered players</h3>
        <span className="text-[13px] text-text-secondary">{players.length} players</span>
      </div>
      {grouped.map((group) => {
        const collapsed = Boolean(collapsedTiers[group.tier]);

        return (
        <section className={`grid gap-2 rounded-[14px] border-hairline p-3 ${getAdminTierSectionClass(group.tier)}`} key={group.tier}>
	          <button
	            className="grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 rounded-[12px] px-2 text-left transition hover:bg-white/45"
	            type="button"
	            onClick={() => setCollapsedTiers((current) => ({ ...current, [group.tier]: !current[group.tier] }))}
	            aria-expanded={!collapsed}
	            aria-controls={`tier-${group.tier}-registered-players`}
	          >
	            <strong className={`text-[15px] font-medium ${getAdminTierTextClass(group.tier)}`}>Tier {group.tier}</strong>
	            <span className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${getAdminTierBadgeClass(group.tier)}`}>{group.players.length} players</span>
	            <ChevronDown className={`transition ${collapsed ? "" : "rotate-180"} ${getAdminTierTextClass(group.tier)}`} size={18} />
	          </button>
	          {!collapsed && group.players.length ? (
		            <ul className="grid gap-2" id={`tier-${group.tier}-registered-players`}>
		              <li className="hidden rounded-[12px] border-hairline border-line/60 bg-white/55 px-3 py-2 text-[12px] font-medium text-text-secondary xl:grid xl:grid-cols-[minmax(180px,1.2fr)_minmax(130px,0.85fr)_minmax(150px,0.9fr)_90px_minmax(210px,1fr)_minmax(150px,0.75fr)] xl:items-center xl:gap-3">
	                <span>Name</span>
	                <span>City</span>
	                <span>Tier</span>
	                <span>Rating</span>
	                <span>Video</span>
	                <span>Action</span>
	              </li>
	              {group.players.map((player) => (
	                <TieredRegisteredPlayerRow
                  key={player.id}
                  player={player}
                  pendingTier={pendingTiers[`${player.tournamentId}:${player.id}`] ?? player.tier}
                  saving={savingTierKey === `${player.tournamentId}:${player.id}`}
                  reviewingVideo={reviewingVideoPlayerId === player.id}
                  removing={removingPlayerKey === `${player.tournamentId}:${player.id}`}
                  confirmingRemove={confirmRemoveKey === `${player.tournamentId}:${player.id}`}
                  onVideoReview={onVideoReview}
                  onRemoveAndRefund={() => onRemoveAndRefund(player)}
                  onCancelRemove={onCancelRemove}
                  onPendingTierChange={(tier) => setPendingTiers((current) => ({ ...current, [`${player.tournamentId}:${player.id}`]: tier }))}
                  onSaveTier={async () => {
                    const playerKey = `${player.tournamentId}:${player.id}`;
                    const nextTier = pendingTiers[playerKey] ?? player.tier;
                    setSavingTierKey(playerKey);
                    const saved = await onTierChange(player.id, player.tournamentId, nextTier);
                    setSavingTierKey(null);
                    if (saved) {
                      setPendingTiers((current) => {
                        const next = { ...current };
                        delete next[playerKey];
                        return next;
                      });
                    }
                  }}
                />
              ))}
	            </ul>
	          ) : !collapsed ? (
	            <small className="text-[14px] text-text-secondary">No Tier {group.tier} registrations.</small>
	          ) : null}
	        </section>
        );
      })}
    </div>
  );
}

function TieredRegisteredPlayerRow({
  player,
  pendingTier,
  saving,
  reviewingVideo,
  removing,
  confirmingRemove,
  onVideoReview,
  onRemoveAndRefund,
  onCancelRemove,
  onPendingTierChange,
  onSaveTier
}: {
  player: AdminRegisteredPlayer;
  pendingTier: number;
  saving: boolean;
  reviewingVideo: boolean;
  removing: boolean;
  confirmingRemove: boolean;
  onVideoReview: (player: AdminRegisteredPlayer, status: "approved" | "rejected") => Promise<void>;
  onRemoveAndRefund: () => Promise<void>;
  onCancelRemove: () => void;
  onPendingTierChange: (tier: number) => void;
  onSaveTier: () => Promise<void>;
}) {
  const hasTierChange = pendingTier !== player.tier;

  return (
    <li className="grid min-h-[64px] gap-3 rounded-[14px] border-hairline border-line bg-card px-3 py-3 xl:grid-cols-[minmax(180px,1.2fr)_minmax(130px,0.85fr)_minmax(150px,0.9fr)_90px_minmax(210px,1fr)_minmax(150px,0.75fr)] xl:items-center" key={player.id}>
      <div className="grid grid-cols-[38px_minmax(0,1fr)] items-center gap-3">
        <span className="relative grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-[#eaf3de] text-[13px] font-medium text-[#3b6d11]" style={player.profilePhotoUrl ? { backgroundImage: `url(${player.profilePhotoUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
          {!player.profilePhotoUrl && getAdminInitials(player.fullName)}
        </span>
        <span className="grid min-w-0 gap-1">
          <strong className="truncate text-[15px] font-medium text-text-primary">{player.fullName}</strong>
          <em className="text-[12px] not-italic text-text-secondary">{player.age}</em>
        </span>
      </div>
      <div className="grid gap-1">
        <span className="text-[12px] font-medium text-text-secondary xl:hidden">City</span>
        <strong className="truncate text-[14px] font-medium text-text-primary">{player.jamaatCity}</strong>
        <em className="text-[13px] not-italic text-text-secondary">Self: {player.selfEvaluation}</em>
      </div>
      <div className="grid grid-cols-[minmax(120px,1fr)_auto] items-end gap-2 xl:grid-cols-[96px_auto]">
        <label className="grid gap-1 text-[12px] text-text-secondary">
          Tier
          <select
            className="h-9 rounded-[10px] border-hairline border-line bg-white px-2 text-[14px] text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
            value={pendingTier}
            onChange={(event) => onPendingTierChange(Number(event.target.value))}
            aria-label={`Select tier for ${player.fullName}`}
            disabled={saving}
          >
            {[1, 2, 3, 4].map((tier) => (
              <option value={tier} key={tier}>Tier {tier}</option>
            ))}
          </select>
        </label>
        <button
          className={hasTierChange ? "inline-flex h-9 w-auto items-center justify-center rounded-[10px] bg-brand px-3 text-[13px] font-medium text-white disabled:opacity-60" : "inline-flex h-9 w-auto items-center justify-center rounded-[10px] border-hairline border-line bg-white px-3 text-[13px] font-medium text-text-muted disabled:opacity-50"}
          type="button"
          onClick={onSaveTier}
          disabled={!hasTierChange || saving}
        >
          {saving ? "Saving" : "Save"}
        </button>
      </div>
      <div className="grid gap-1 xl:justify-items-start">
        <span className="text-[12px] font-medium text-text-secondary xl:hidden">Rating</span>
        <strong className="text-[15px] font-medium leading-none text-brand">{formatAdminRating(player.rating)}</strong>
      </div>
      <div className="grid gap-1 xl:justify-items-start">
        <span className="text-[12px] font-medium text-text-secondary xl:hidden">Video</span>
        {player.tennisVideoUrl ? (
          <span className="grid gap-1">
            <span className="flex flex-wrap items-center gap-1.5">
              <a className="inline-flex h-7 w-auto items-center justify-center rounded-full bg-[#e5f1ff] px-2.5 text-[12px] font-medium text-[#185fa5]" href={player.tennisVideoUrl} target="_blank" rel="noreferrer">
                View video
              </a>
              <span className={getAdminVideoStatusClass(player.tennisVideoStatus)}>{formatAdminVideoStatus(player.tennisVideoStatus)}</span>
            </span>
            {player.tennisVideoStatus !== "approved" && (
              <span className="flex flex-wrap items-center gap-1.5">
                <button className="inline-flex h-7 w-auto items-center rounded-full bg-brand-light px-2.5 text-[12px] font-medium text-[#3b6d11] disabled:opacity-60" type="button" onClick={() => onVideoReview(player, "approved")} disabled={reviewingVideo}>
                  Approve
                </button>
                <button className="inline-flex h-7 w-auto items-center rounded-full bg-[#fcebeb] px-2.5 text-[12px] font-medium text-[#a32d2d] disabled:opacity-60" type="button" onClick={() => onVideoReview(player, "rejected")} disabled={reviewingVideo}>
                  Reject
                </button>
              </span>
            )}
          </span>
        ) : (
          <span className="inline-flex h-7 w-max items-center justify-center rounded-full bg-[#f1efe8] px-2.5 text-[12px] font-medium text-text-secondary">No video</span>
        )}
      </div>
      <div className="grid gap-2 xl:justify-items-start">
        <span className="text-[12px] font-medium text-text-secondary xl:hidden">Action</span>
        {confirmingRemove && <em className="max-w-[170px] text-[12px] not-italic leading-snug text-[#a32d2d]">Do you wanna remove them and refund them?</em>}
        <div className="flex flex-wrap gap-2">
          <button
            className={confirmingRemove ? "tap-card inline-flex h-9 w-max items-center justify-center rounded-[12px] bg-[#a32d2d] px-3 text-[12px] font-medium text-white disabled:opacity-60" : "tap-card inline-flex h-9 w-max items-center justify-center rounded-[12px] border-hairline border-[#f2c8c8] bg-white px-3 text-[12px] font-medium text-[#a32d2d] disabled:opacity-60"}
            type="button"
            onClick={onRemoveAndRefund}
            disabled={removing || !player.paymentId}
          >
            {removing ? "Removing..." : confirmingRemove ? "Remove and Refund" : "Remove"}
          </button>
          {confirmingRemove && (
            <button className="tap-card inline-flex h-9 w-max items-center justify-center rounded-[12px] bg-surface px-3 text-[12px] font-medium text-text-secondary" type="button" onClick={onCancelRemove}>
              Cancel
            </button>
          )}
        </div>
        {!player.paymentId && <small className="text-[12px] leading-snug text-text-muted">No Stripe payment found.</small>}
      </div>
    </li>
  );
}

function getAdminTierSectionClass(tier: number) {
  if (tier === 1) return "border-[#f0dcaa] bg-[#fffaf0]";
  if (tier === 2) return "border-[#d6e6f5] bg-[#f4f9fd]";
  if (tier === 3) return "border-[#dbe8cd] bg-[#f6fbf1]";
  return "border-[#ead6e1] bg-[#fff6fa]";
}

function getAdminTierTextClass(tier: number) {
  if (tier === 1) return "text-[#8a5a00]";
  if (tier === 2) return "text-[#185fa5]";
  if (tier === 3) return "text-[#3b6d11]";
  return "text-[#aa3f6b]";
}

function getAdminTierBadgeClass(tier: number) {
  if (tier === 1) return "bg-[#f6e7bf] text-[#8a5a00]";
  if (tier === 2) return "bg-[#e5f1ff] text-[#185fa5]";
  if (tier === 3) return "bg-brand-light text-[#3b6d11]";
  return "bg-[#fbe7ef] text-[#aa3f6b]";
}

function formatAdminVideoStatus(status: string | null) {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

function getAdminVideoStatusClass(status: string | null) {
  if (status === "approved") return "inline-flex h-7 w-max items-center rounded-full bg-brand-light px-2.5 text-[12px] font-medium text-[#3b6d11]";
  if (status === "rejected") return "inline-flex h-7 w-max items-center rounded-full bg-[#fcebeb] px-2.5 text-[12px] font-medium text-[#a32d2d]";
  return "inline-flex h-7 w-max items-center rounded-full bg-[#fff4d8] px-2.5 text-[12px] font-medium text-[#8a5a00]";
}

function isAdminDraftSchemaMissing(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("shirt_name")
    || normalized.includes("tournament_teams")
    || normalized.includes("tournament_team_members")
    || normalized.includes("could not find")
    || normalized.includes("does not exist");
}

export function AdminPaymentsScreen() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [paymentNotice, setPaymentNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [updatingPaymentId, setUpdatingPaymentId] = useState<string | null>(null);
  const [confirmRefundId, setConfirmRefundId] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<"all" | "pending" | "paid" | "refunded" | "failed">("paid");

  const loadPayments = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const { data, error } = await supabase
      .from("payment_ledger")
      .select("id, player_id, tournament_id, registration_id, entry_type, status, amount_cents, currency, notes, occurred_at, players(full_name, jamaat_city), tournaments(name)")
      .order("occurred_at", { ascending: false })
      .limit(80);
    if (error) {
      setPaymentNotice({ type: "error", text: error.message });
      return;
    }
    setPayments((data || []) as AdminPayment[]);
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const markPaid = async (payment: AdminPayment) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setUpdatingPaymentId(payment.id);
    setPaymentNotice(null);
    const paidAt = new Date().toISOString();
    const { error } = await supabase.from("payment_ledger").update({ status: "paid", occurred_at: paidAt }).eq("id", payment.id);
    if (!error && payment.registration_id) {
      await supabase.from("tournament_registrations").update({ payment_status: "paid", status: "registered" }).eq("id", payment.registration_id);
    }
    setUpdatingPaymentId(null);
    if (error) {
      setPaymentNotice({ type: "error", text: error.message });
      return;
    }
    setPaymentNotice({ type: "success", text: "Payment marked paid." });
    await loadPayments();
  };

  const refundPayment = async (payment: AdminPayment) => {
    if (confirmRefundId !== payment.id) {
      setConfirmRefundId(payment.id);
      setPaymentNotice(null);
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;
    setUpdatingPaymentId(payment.id);
    setPaymentNotice(null);
    const { data: sessionData } = await supabase.auth.getSession();
    const response = await fetch("/api/admin/refund-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.session?.access_token || ""}`
      },
      body: JSON.stringify({ paymentId: payment.id })
    });
    const result = await response.json().catch(() => ({}));
    setUpdatingPaymentId(null);
    if (!response.ok) {
      setPaymentNotice({ type: "error", text: result.error || "Could not refund this payment." });
      return;
    }
    setPaymentNotice({ type: "success", text: "Stripe refund created and payment marked refunded." });
    setConfirmRefundId(null);
    await loadPayments();
  };

  const visiblePayments = paymentFilter === "all" ? payments : payments.filter((payment) => payment.status === paymentFilter);
  const paymentFilters = [
    { id: "all" as const, label: "All" },
    { id: "pending" as const, label: "Pending" },
    { id: "paid" as const, label: "Paid" },
    { id: "refunded" as const, label: "Refunded" },
    { id: "failed" as const, label: "Failed" }
  ];

  return (
    <AdminFrame active="payments">
      <div className="grid gap-3 rounded-[18px] border-hairline border-line bg-card p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-5">
        <div className="grid gap-1">
          <span className="text-[13px] text-text-secondary">Payments</span>
          <h1 className="text-2xl font-medium leading-tight tracking-[-0.4px] text-text-primary">Payment ledger</h1>
          <p className="max-w-[720px] text-[15px] leading-relaxed text-text-secondary">Who paid, why, Jamaat / city, amount, status, and paid date.</p>
        </div>
        <span className="rounded-full bg-brand-light px-3 py-1 text-[13px] font-medium text-[#3b6d11]">{visiblePayments.length} entries</span>
      </div>
      {paymentNotice && <p className={paymentNotice.type === "error" ? "rounded-[14px] border-hairline border-[#f2c8c8] bg-[#fff5f5] p-4 text-[15px] text-[#a32d2d]" : "inline-flex items-center gap-2 rounded-[14px] border-hairline border-line bg-brand-light p-4 text-[15px] text-[#3b6d11]"}>{paymentNotice.type === "success" && <CheckCircle2 size={16} />}{paymentNotice.text}</p>}
      <div className="flex gap-2 overflow-x-auto rounded-[14px] border-hairline border-line bg-card p-2" aria-label="Payment filters">
        {paymentFilters.map((filter) => (
          <button className={paymentFilter === filter.id ? "tap-card inline-flex min-h-9 !w-auto shrink-0 items-center justify-center rounded-[12px] bg-brand px-4 text-xs font-medium text-white" : "tap-card inline-flex min-h-9 !w-auto shrink-0 items-center justify-center rounded-[12px] bg-surface px-4 text-xs font-medium text-text-secondary"} type="button" key={filter.id} onClick={() => setPaymentFilter(filter.id)}>
            {filter.label}
          </button>
        ))}
      </div>
      <div className="grid gap-2">
        {visiblePayments.map((payment) => {
          const player = Array.isArray(payment.players) ? payment.players[0] : payment.players;
          const tournament = Array.isArray(payment.tournaments) ? payment.tournaments[0] : payment.tournaments;
          return (
            <article className="grid gap-3 rounded-[14px] border-hairline border-line bg-card p-3 md:grid-cols-[42px_minmax(0,1fr)_auto] md:items-center md:p-4" key={payment.id}>
              <span className={payment.status === "paid" ? "grid h-[42px] w-[42px] place-items-center rounded-full bg-[#eaf3de] text-[13px] font-medium text-[#3b6d11]" : payment.status === "refunded" ? "grid h-[42px] w-[42px] place-items-center rounded-full bg-[#fcebeb] text-[13px] font-medium text-[#a32d2d]" : payment.status === "pending" ? "grid h-[42px] w-[42px] place-items-center rounded-full bg-[#fff4d8] text-[13px] font-medium text-[#8a5a00]" : "grid h-[42px] w-[42px] place-items-center rounded-full bg-[#f1efe8] text-[13px] font-medium text-[#5f5e5a]"}>
                {getAdminInitials(player?.full_name || "Player")}
              </span>

              <div className="grid min-w-0 gap-2">
                <div className="grid gap-1 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                  <span className="grid min-w-0 gap-1">
                    <strong className="truncate text-[17px] font-medium leading-tight text-text-primary">{player?.full_name || "Unknown player"}</strong>
                    <em className="truncate text-[13px] not-italic leading-tight text-text-secondary">{player?.jamaat_city || "City missing"} · {tournament?.name || payment.notes || "General payment"}</em>
                  </span>
                  <span className={payment.status === "paid" ? "inline-flex w-max rounded-full bg-brand-light px-2.5 py-1 text-[12px] font-medium text-[#3b6d11]" : payment.status === "refunded" ? "inline-flex w-max rounded-full bg-[#fcebeb] px-2.5 py-1 text-[12px] font-medium text-[#a32d2d]" : payment.status === "pending" ? "inline-flex w-max rounded-full bg-[#fff4d8] px-2.5 py-1 text-[12px] font-medium text-[#8a5a00]" : "inline-flex w-max rounded-full bg-[#f1efe8] px-2.5 py-1 text-[12px] font-medium text-[#5f5e5a]"}>
                    {formatAdminPaymentStatus(payment.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                  <PaymentMeta label="Reason" value={tournament?.name || payment.notes || "General"} tone="green" />
                  <PaymentMeta label="Type" value={formatAdminPaymentType(payment.entry_type)} tone="blue" />
                  <PaymentMeta label={payment.status === "paid" ? "Paid" : payment.status === "refunded" ? "Refunded" : "Recorded"} value={formatAdminDateTime(payment.occurred_at)} tone="neutral" />
                  <PaymentMeta label="Amount" value={formatAdminCurrency(payment.amount_cents, payment.currency)} tone="clay" />
                </div>
                {payment.notes && <p className="truncate text-[13px] font-medium text-text-secondary">{payment.notes}</p>}
              </div>

              <div className={payment.status === "refunded" ? "grid gap-2 rounded-[14px] border-hairline border-[#f2c8c8] bg-[#fff7f7] p-3 md:min-w-[150px] md:justify-items-end" : "grid gap-2 rounded-[14px] border-hairline border-[#dbe8cd] bg-[#f8fbf4] p-3 md:min-w-[150px] md:justify-items-end"}>
                <span className="grid gap-1 md:justify-items-end">
                  <em className="text-[12px] not-italic leading-none text-text-secondary">{payment.status === "refunded" ? "Refunded amount" : "Payment amount"}</em>
                  <strong className={payment.status === "refunded" ? "text-[22px] font-medium leading-none text-[#a32d2d]" : "text-[22px] font-medium leading-none text-brand"}>{formatAdminCurrency(payment.amount_cents, payment.currency)}</strong>
                </span>
                <div className="grid gap-2 md:justify-items-end">
                  {payment.status === "pending" && (
                    <button className="tap-card min-h-9 rounded-[12px] bg-brand px-4 text-xs font-medium text-white disabled:opacity-60" type="button" onClick={() => markPaid(payment)} disabled={updatingPaymentId === payment.id}>
                      {updatingPaymentId === payment.id ? "Saving..." : "Mark paid"}
                    </button>
                  )}
                  {payment.status === "paid" && (
                    <>
                      <button className={confirmRefundId === payment.id ? "tap-card min-h-9 rounded-[12px] bg-[#a32d2d] px-4 text-xs font-medium text-white disabled:opacity-60" : "tap-card min-h-9 rounded-[12px] border-hairline border-[#f2c8c8] bg-white px-4 text-xs font-medium text-[#a32d2d] disabled:opacity-60"} type="button" onClick={() => refundPayment(payment)} disabled={updatingPaymentId === payment.id}>
                        {updatingPaymentId === payment.id ? "Saving..." : confirmRefundId === payment.id ? "Confirm refund" : "Refund"}
                      </button>
                      {confirmRefundId === payment.id && (
                        <button className="tap-card text-[13px] font-medium text-text-secondary" type="button" onClick={() => setConfirmRefundId(null)}>Cancel</button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
        {!visiblePayments.length && <div className="rounded-[14px] border-hairline border-line bg-card p-4 text-[15px] text-text-secondary">No {paymentFilter === "all" ? "" : `${paymentFilter} `}payment entries found.</div>}
      </div>
    </AdminFrame>
  );
}

export function AdminClaimsScreen() {
  const [claims, setClaims] = useState<AdminClaim[]>([]);
  const [claimsNotice, setClaimsNotice] = useState("");
  const [rejectConfirmId, setRejectConfirmId] = useState<string | null>(null);
  const [reviewingClaimId, setReviewingClaimId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({});

  const loadClaims = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const { data, error } = await supabase.rpc("admin_pending_player_claims");
    if (!error) {
      setClaims((data || []) as AdminClaim[]);
      setClaimsNotice("");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const response = await fetch("/api/admin/pending-claims", {
      headers: {
        Authorization: `Bearer ${sessionData.session?.access_token || ""}`
      }
    });

    if (response.ok) {
      const result = await response.json();
      setClaims((result.claims || []) as AdminClaim[]);
      setClaimsNotice("");
      return;
    }

    const fallback = await supabase
      .from("player_claims")
      .select("id, player_id, requested_by, status, requester_note, admin_note, created_at, players(full_name, jamaat_city)")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(40);

    if (fallback.error) {
      setClaims([]);
      setClaimsNotice(fallback.error.message || error.message);
      return;
    }

    setClaims(((fallback.data || []) as LegacyAdminClaim[]).map((claim) => {
      const player = Array.isArray(claim.players) ? claim.players[0] : claim.players;
      return {
        id: claim.id,
        player_id: claim.player_id,
        requested_by: claim.requested_by,
        status: claim.status,
        requester_note: claim.requester_note,
        admin_note: claim.admin_note || null,
        requester_email: null,
        created_at: claim.created_at,
        player_full_name: player?.full_name || null,
        player_jamaat_city: player?.jamaat_city || null
      };
    }));
    setClaimsNotice("Claim email requires either the latest Supabase migration or SUPABASE_SERVICE_ROLE_KEY on the server. Showing pending claims with user IDs for now.");
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const reviewClaim = async (claim: AdminClaim, approved: boolean, adminNote = "") => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setReviewingClaimId(claim.id);
    const { data: { user } } = await supabase.auth.getUser();

    try {
      await supabase
        .from("player_claims")
        .update({
          status: approved ? "approved" : "rejected",
          admin_note: approved ? null : adminNote.trim() || "This profile claim could not be verified. Please search again or create a new profile.",
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq("id", claim.id);

      await supabase
        .from("players")
        .update({
          auth_user_id: approved ? claim.requested_by : null,
          claim_status: approved ? "claimed" : "unclaimed",
          claim_requested_by: null,
          claimed_at: approved ? new Date().toISOString() : null,
          claim_reviewed_by: user?.id
        })
        .eq("id", claim.player_id);

      await loadClaims();
    } finally {
      setReviewingClaimId(null);
      setRejectConfirmId(null);
    }
  };

  const rejectClaim = async (claim: AdminClaim) => {
    if (rejectConfirmId !== claim.id) {
      setRejectConfirmId(claim.id);
      setRejectNotes((current) => ({ ...current, [claim.id]: current[claim.id] || "" }));
      return;
    }

    await reviewClaim(claim, false, rejectNotes[claim.id]);
  };

  return (
    <AdminFrame active="claims">
      <div className="grid gap-3 rounded-[18px] border-hairline border-line bg-card p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-5">
        <div className="grid gap-1">
          <span className="text-[13px] text-text-secondary">Claims</span>
          <h1 className="text-2xl font-medium leading-tight tracking-[-0.4px] text-text-primary">Profile claims</h1>
          <p className="max-w-[720px] text-[15px] leading-relaxed text-text-secondary">Approve true profile matches or reject incorrect claims before they link to a player record.</p>
        </div>
        <span className="rounded-full bg-brand-light px-3 py-1 text-[13px] font-medium text-[#3b6d11]">{claims.length} pending</span>
      </div>
      {claimsNotice && <p className="rounded-[14px] border-hairline border-[#f2c8c8] bg-[#fff5f5] p-4 text-[15px] text-[#a32d2d]">{claimsNotice}</p>}
      <div className="grid gap-2">
        {claims.map((claim) => {
          const isConfirmingReject = rejectConfirmId === claim.id;
          const isReviewing = reviewingClaimId === claim.id;
          return (
            <article className="grid gap-3 rounded-[14px] border-hairline border-line bg-card p-3 md:grid-cols-[42px_minmax(0,1fr)_auto] md:items-center md:p-4" key={claim.id}>
              <span className={isConfirmingReject ? "grid h-[42px] w-[42px] place-items-center rounded-full bg-[#fcebeb] text-[13px] font-medium text-[#a32d2d]" : "grid h-[42px] w-[42px] place-items-center rounded-full bg-[#eaf3de] text-[13px] font-medium text-[#3b6d11]"}>
                {getAdminInitials(claim.player_full_name || "Player")}
              </span>

              <div className="grid min-w-0 gap-2">
                <div className="grid gap-1 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                  <span className="grid min-w-0 gap-1">
                    <strong className="truncate text-[17px] font-medium leading-tight text-text-primary">{claim.player_full_name || "Unknown player"}</strong>
                    <em className="truncate text-[13px] not-italic leading-tight text-text-secondary">{claim.player_jamaat_city || "City missing"} · {formatAdminDateTime(claim.created_at)}</em>
                  </span>
                  <span className={isConfirmingReject ? "inline-flex w-max rounded-full bg-[#fcebeb] px-2.5 py-1 text-[12px] font-medium text-[#a32d2d]" : "inline-flex w-max rounded-full bg-[#fff4d8] px-2.5 py-1 text-[12px] font-medium text-[#8a5a00]"}>
                    {isConfirmingReject ? "Confirm rejection" : "Pending review"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
                  <PaymentMeta label="Claimed by" value={claim.requester_email || claim.requested_by} tone="blue" />
                  <PaymentMeta label="City" value={claim.player_jamaat_city || "City missing"} tone="green" />
                  <PaymentMeta label="Requested" value={formatAdminDateTime(claim.created_at)} tone="neutral" />
                </div>
                <p className="truncate text-[13px] font-medium text-text-secondary">{claim.requester_note || "No note provided."}</p>
                {isConfirmingReject && (
                  <label className="grid gap-2 text-[13px] text-text-secondary">
                    Rejection note to player
                    <textarea className="min-h-20 rounded-[12px] border-hairline border-line bg-white px-3 py-2 text-[15px] text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-light" value={rejectNotes[claim.id] || ""} onChange={(event) => setRejectNotes((current) => ({ ...current, [claim.id]: event.target.value }))} placeholder="Example: This profile appears to belong to another player. Please search again or create a new profile." />
                  </label>
                )}
              </div>

              <div className="grid gap-2 md:min-w-[150px]">
                <button className="tap-card inline-flex min-h-9 items-center justify-center rounded-[12px] bg-brand px-4 text-xs font-medium text-white disabled:opacity-60" type="button" onClick={() => reviewClaim(claim, true)} disabled={isReviewing}>
                  {isReviewing ? "Working..." : "Approve"}
                </button>
                <button className={isConfirmingReject ? "tap-card inline-flex min-h-9 items-center justify-center rounded-[12px] bg-[#a32d2d] px-4 text-xs font-medium text-white disabled:opacity-60" : "tap-card inline-flex min-h-9 items-center justify-center rounded-[12px] border-hairline border-[#f2c8c8] bg-[#fff5f5] px-4 text-xs font-medium text-[#a32d2d] disabled:opacity-60"} type="button" onClick={() => rejectClaim(claim)} disabled={isReviewing}>
                  {isReviewing ? "Working..." : isConfirmingReject ? "Confirm reject" : "Reject"}
                </button>
                {isConfirmingReject && (
                  <button className="tap-card text-[13px] font-medium text-text-secondary" type="button" onClick={() => setRejectConfirmId(null)} disabled={isReviewing}>
                    Cancel
                  </button>
                )}
              </div>
            </article>
          );
        })}
        {!claims.length && <div className="rounded-[14px] border-hairline border-line bg-card p-4 text-[15px] text-text-secondary">No pending claims.</div>}
      </div>
    </AdminFrame>
  );
}

function AdminStat({ label, value }: { label: string; value: number }) {
  return (
    <article className="grid gap-2 rounded-[14px] border-hairline border-line bg-card p-4">
      <span className="text-[13px] text-text-secondary">{label}</span>
      <strong className="text-[28px] font-medium leading-none tracking-[-0.4px] text-text-primary">{value}</strong>
    </article>
  );
}

function AdminLinkCard({ href, title, copy }: { href: string; title: string; copy: string }) {
  return (
    <Link className="tap-card grid min-h-[136px] gap-3 rounded-[18px] border-hairline border-line bg-card p-4 transition hover:border-line-strong md:p-5" href={href}>
      <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-light text-brand">
        <ArrowRight size={17} />
      </span>
      <span className="grid gap-1">
        <strong className="text-lg font-medium leading-tight text-text-primary">{title}</strong>
        <em className="text-[15px] not-italic leading-relaxed text-text-secondary">{copy}</em>
      </span>
    </Link>
  );
}

function AdminPlayerMeta({ label, value }: { label: string; value: string }) {
  return (
    <span className="grid gap-1 rounded-[12px] border-hairline border-line bg-white px-3 py-2">
      <em className="text-[12px] not-italic text-text-secondary">{label}</em>
      <strong className="truncate text-[14px] font-medium text-text-primary">{value}</strong>
    </span>
  );
}

function AdminReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <span className="grid gap-2 rounded-[12px] border-hairline border-line bg-white px-3 py-2">
      <em className="text-[13px] not-italic text-text-secondary">{label}</em>
      <strong className="min-h-[24px] break-words text-[15px] font-medium text-text-primary">{value || "Not set"}</strong>
    </span>
  );
}

function AdminEditableField({
  label,
  name,
  defaultValue,
  type = "text",
  inputMode,
  placeholder,
  required = false,
  max
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  inputMode?: "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  placeholder?: string;
  required?: boolean;
  max?: string;
}) {
  return (
    <label className="grid gap-2 text-[13px] text-text-secondary">
      <span className="inline-flex items-center gap-1.5"><Pencil size={12} /> {label}</span>
      <input
        className="min-h-10 rounded-[12px] border-hairline border-line bg-white px-3 text-[15px] text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
        name={name}
        type={type}
        inputMode={inputMode}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        max={max}
      />
    </label>
  );
}

function escapeAdminCsvValue(value: string | number | null | undefined) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function slugifyAdminFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "tournament";
}

function PaymentMeta({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "green" | "blue" | "clay" | "neutral" }) {
  const toneClass = tone === "green"
    ? "border-[#dbe8cd] bg-[#f5faef]"
    : tone === "blue"
      ? "border-[#d6e6f5] bg-[#f4f9fd]"
      : tone === "clay"
        ? "border-[#f2dccb] bg-[#fff8f1]"
        : "border-line bg-white";

  return (
    <span className={`min-w-0 rounded-[10px] border-hairline px-2.5 py-2 ${toneClass}`}>
      <em className="block text-[12px] not-italic leading-tight text-text-secondary">{label}</em>
      <strong className="block truncate text-[14px] font-medium leading-tight text-text-primary">{value}</strong>
    </span>
  );
}

function formatAdminRating(value: number | null) {
  return typeof value === "number" ? value.toFixed(3) : "Pending";
}

function getAdminTodayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function calculateAdminAge(dateOfBirth?: string | null) {
  if (!dateOfBirth) return "";
  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return "";
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (today < birthdayThisYear) age -= 1;
  return age >= 0 ? String(age) : "";
}

function formatAdminClaimStatus(status: string) {
  return status.replace(/_/g, " ");
}

function getAdminInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "P") + (parts[parts.length - 1]?.[0] || "");
}

function formatAdminTournamentStatus(status: string) {
  return status.replace(/_/g, " ");
}

function formatAdminPaymentStatus(status: string) {
  return status.replace(/_/g, " ");
}

function formatAdminPaymentType(entryType: string) {
  return entryType.replace(/_/g, " ");
}

function formatAdminCurrency(cents: number | null, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD", maximumFractionDigits: 0 }).format((cents || 0) / 100);
}

function formatAdminDate(value: string | null) {
  if (!value) return "TBD";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatAdminDateTime(value: string | null) {
  if (!value) return "TBD";
  return new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function formatAdminDateTimeInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

function localDateTimeInputToIso(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function deriveAdminTournamentStatus({
  startsOn,
  endsOn,
  registrationClosesAt
}: {
  startsOn?: string | null;
  endsOn?: string | null;
  registrationClosesAt?: string | null;
}) {
  const now = new Date();
  const registrationClose = registrationClosesAt ? new Date(registrationClosesAt) : null;
  const start = startsOn ? new Date(`${startsOn}T00:00:00`) : null;
  const end = endsOn ? new Date(`${endsOn}T23:59:59.999`) : null;

  if (end && now > end) return "completed";
  if (start && now >= start) return "live";
  if (registrationClose && now > registrationClose) return "registration_closed";
  return "registration_open";
}

function getAdminTournamentLifecycleStatus(tournament: Pick<AdminTournament, "status" | "starts_on" | "ends_on" | "registration_closes_at">) {
  if (tournament.status === "cancelled") return "cancelled";
  if (tournament.status === "registration_closed") return "registration_closed";
  if (tournament.status === "registration_open") return "registration_open";
  return deriveAdminTournamentStatus({
    startsOn: tournament.starts_on,
    endsOn: tournament.ends_on,
    registrationClosesAt: tournament.registration_closes_at
  });
}

async function getAdminTennisSportId() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.from("sports").select("id").eq("slug", "tennis").single();
  return data?.id || null;
}
