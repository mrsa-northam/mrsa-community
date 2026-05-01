"use client";

import { BadgeDollarSign, ClipboardCheck, Home, Shield, Trophy, UsersRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useState } from "react";
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
  full_name: string;
  jamaat_city: string | null;
  rating: number | null;
  claim_status: string;
  tournaments_played: number;
  matches_played: number;
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
};
type AdminRegisteredPlayer = {
  id: string;
  tournamentId: string;
  fullName: string;
  jamaatCity: string;
  tier: number;
  rating: number | null;
};

type AdminPayment = {
  id: string;
  entry_type: string;
  status: string;
  amount_cents: number;
  occurred_at: string;
  players: { full_name: string } | { full_name: string }[] | null;
  tournaments: { name: string } | { name: string }[] | null;
};

type AdminClaim = {
  id: string;
  player_id: string;
  requested_by: string;
  status: string;
  requester_note: string | null;
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
  created_at: string;
  players: { full_name: string | null; jamaat_city: string | null } | { full_name: string | null; jamaat_city: string | null }[] | null;
};

export function AdminFrame({ active, children }: { active: AdminTab; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState<boolean | null>(null);

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

      setAllowed(true);
    };

    checkAdmin();
  }, [router, pathname]);

  if (allowed === null) {
    return (
      <main className="admin-stage admin-access-stage">
        <div className="admin-loading">Checking admin access...</div>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="admin-stage admin-access-stage">
        <section className="admin-denied">
          <Shield size={22} />
          <h1>Admin access required</h1>
          <p>Your account is not marked as an MRSA admin.</p>
          <Link className="primary-action tap-card" href="/dashboard">Back to app</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-stage">
      <aside className="admin-sidebar">
        <Link className="brand admin-brand" href="/admin">MRSA</Link>
        <nav className="admin-nav" aria-label="Admin navigation">
          <AdminNavItem active={active === "overview"} href="/admin" icon={<Home size={17} />} label="Overview" />
          <AdminNavItem active={active === "tournaments"} href="/admin/tournaments" icon={<Trophy size={17} />} label="Tournaments" />
          <AdminNavItem active={active === "players"} href="/admin/players" icon={<UsersRound size={17} />} label="Players" />
          <AdminNavItem active={active === "payments"} href="/admin/payments" icon={<BadgeDollarSign size={17} />} label="Payments" />
          <AdminNavItem active={active === "claims"} href="/admin/claims" icon={<ClipboardCheck size={17} />} label="Claims" />
        </nav>
        <Link className="admin-back" href="/dashboard">Player app →</Link>
      </aside>
      <section className="admin-main">{children}</section>
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
    <Link className={active ? "admin-nav-item active" : "admin-nav-item"} href={href}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function AdminOverviewScreen() {
  const [counts, setCounts] = useState<CountMap>({ players: 0, tournaments: 0, payments: 0, claims: 0 });

  useEffect(() => {
    const loadCounts = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const [players, tournaments, payments, claims] = await Promise.all([
        supabase.from("players").select("id", { count: "exact", head: true }),
        supabase.from("tournaments").select("id", { count: "exact", head: true }),
        supabase.from("payment_ledger").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("player_claims").select("id", { count: "exact", head: true }).eq("status", "pending")
      ]);

      setCounts({
        players: players.count || 0,
        tournaments: tournaments.count || 0,
        payments: payments.count || 0,
        claims: claims.count || 0
      });
    };

    loadCounts();
  }, []);

  return (
    <AdminFrame active="overview">
      <AdminHeader eyebrow="Admin" title="Control Room" copy="Manage MRSA tournaments, players, claims, and payment ledger without loading this data for regular players." />
      <div className="admin-stat-grid">
        <AdminStat label="Players" value={counts.players} />
        <AdminStat label="Tournaments" value={counts.tournaments} />
        <AdminStat label="Pending Payments" value={counts.payments} />
        <AdminStat label="Pending Claims" value={counts.claims} />
      </div>
      <div className="admin-card-grid">
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

  useEffect(() => {
    const loadPlayers = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      let request = supabase
        .from("players")
        .select("id, full_name, jamaat_city, rating, claim_status, tournaments_played, matches_played")
        .order("full_name")
        .limit(40);

      if (query.trim()) {
        request = request.ilike("full_name", `%${query.trim()}%`);
      }

      const { data } = await request;
      setPlayers((data || []) as AdminPlayer[]);
    };

    loadPlayers();
  }, [query]);

  return (
    <AdminFrame active="players">
      <AdminHeader eyebrow="Players" title="Player Management" copy="Search is server-side and limited to keep the admin panel fast." />
      <input className="admin-search" placeholder="Search player name" value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className="admin-table">
        {players.map((player) => (
          <article className="admin-row" key={player.id}>
            <div>
              <strong>{player.full_name}</strong>
              <em>{player.jamaat_city || "City missing"} · {player.claim_status}</em>
            </div>
            <span>{formatAdminRating(player.rating)}</span>
            <small>{player.tournaments_played} tournaments · {player.matches_played} matches</small>
          </article>
        ))}
      </div>
    </AdminFrame>
  );
}

export function AdminTournamentsScreen() {
  const [tournaments, setTournaments] = useState<AdminTournament[]>([]);
  const [registeredByTournament, setRegisteredByTournament] = useState<Record<string, AdminRegisteredPlayer[]>>({});
  const [editingTournament, setEditingTournament] = useState<AdminTournament | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [creating, setCreating] = useState(false);

  const loadTournaments = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const [{ data, error }, { data: registrations, error: registrationError }] = await Promise.all([
      supabase
        .from("tournaments")
        .select("id, name, status, venue_name, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents")
        .order("starts_on", { ascending: false })
        .limit(30),
      supabase
        .from("tournament_registrations")
        .select("tournament_id, players(id, full_name, jamaat_city, tier, rating)")
        .neq("status", "cancelled")
        .in("payment_status", ["paid", "waived"])
        .order("registered_at", { ascending: true })
        .limit(500)
    ]);

    if (error || registrationError) {
      setNotice({ type: "error", text: (error || registrationError)?.message || "Could not load tournaments." });
      return;
    }

    setTournaments((data || []) as AdminTournament[]);
    const grouped = (registrations || []).reduce<Record<string, AdminRegisteredPlayer[]>>((acc, row) => {
      const player = Array.isArray(row.players) ? row.players[0] : row.players;
      if (!player || !row.tournament_id) return acc;
      const tournamentPlayers = acc[row.tournament_id] || [];
      tournamentPlayers.push({
        id: player.id,
        tournamentId: row.tournament_id,
        fullName: player.full_name || "Unknown player",
        jamaatCity: player.jamaat_city || "City missing",
        tier: Number(player.tier || 4),
        rating: player.rating
      });
      acc[row.tournament_id] = tournamentPlayers;
      return acc;
    }, {});
    setRegisteredByTournament(grouped);
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
    const feeDollars = Number(form.get("fee") || 0);
    const tournamentPayload = {
      name: String(form.get("name") || ""),
      season_year: startDate ? new Date(`${startDate}T00:00:00`).getFullYear() : null,
      status: String(form.get("status") || "registration_open"),
      venue_name: String(form.get("venueName") || ""),
      venue_address: String(form.get("venueName") || ""),
      venue_maps_url: String(form.get("mapsUrl") || ""),
      starts_on: startDate || null,
      ends_on: String(form.get("endsOn") || "") || null,
      registration_closes_at: localDateTimeInputToIso(String(form.get("registrationClosesAt") || "")),
      registration_fee_cents: Math.round(feeDollars * 100),
      currency: "USD",
      max_players: 64
    };
    const { error } = editingTournament
      ? await supabase.from("tournaments").update(tournamentPayload).eq("id", editingTournament.id)
      : await supabase.from("tournaments").insert({
          sport_id: sportId,
          ...tournamentPayload
        });
    setCreating(false);

    if (error) {
      setNotice({ type: "error", text: error.message });
      return;
    }

    target.reset();
    setEditingTournament(null);
    setNotice({ type: "success", text: editingTournament ? "Tournament updated successfully." : "Tournament published successfully." });
    await loadTournaments();
  };

  const startEditingTournament = (tournament: AdminTournament) => {
    setEditingTournament(tournament);
    setNotice({ type: "success", text: `Editing ${tournament.name}. Make changes above, then save.` });
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

    if (editingTournament?.id === tournament.id) {
      setEditingTournament(null);
    }
    setNotice({ type: "success", text: `${tournament.name} deleted. Registrations were removed with it.` });
    await loadTournaments();
  };

  return (
    <AdminFrame active="tournaments">
      <AdminHeader eyebrow="Tournaments" title="Tournament Management" copy="Create, edit, publish, or delete tournaments for players." />
      <form className="admin-form" onSubmit={createTournament} key={editingTournament?.id || "new-tournament-form"}>
        <label>
          <span>Name</span>
          <input name="name" placeholder="MRSA 2026" defaultValue={editingTournament?.name || ""} required />
        </label>
        <div className="admin-form-grid">
          <label>
            <span>Start date</span>
            <input name="startsOn" type="date" defaultValue={editingTournament?.starts_on || ""} required />
          </label>
          <label>
            <span>End date</span>
            <input name="endsOn" type="date" defaultValue={editingTournament?.ends_on || ""} required />
          </label>
        </div>
        <label>
          <span>Registration ends</span>
          <input name="registrationClosesAt" type="datetime-local" defaultValue={formatAdminDateTimeInput(editingTournament?.registration_closes_at)} required />
        </label>
        <label>
          <span>Status</span>
          <select name="status" defaultValue={editingTournament?.status || "registration_open"} required>
            <option value="draft">Draft</option>
            <option value="registration_open">Registration open</option>
            <option value="registration_closed">Registration closed</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label>
          <span>Venue name</span>
          <input name="venueName" placeholder="Forest Sports Club" defaultValue={editingTournament?.venue_name || ""} required />
        </label>
        <label>
          <span>Venue Google Maps URL</span>
          <input name="mapsUrl" type="url" placeholder="https://maps.google.com/..." defaultValue={editingTournament?.venue_maps_url || ""} required />
        </label>
        <label>
          <span>Tournament fees</span>
          <input name="fee" type="number" min="0" step="1" placeholder="110" defaultValue={editingTournament ? editingTournament.registration_fee_cents / 100 : ""} required />
        </label>
        <div className="admin-form-actions">
          <button className="primary-action tap-card" type="submit" disabled={creating}>{creating ? "Saving..." : editingTournament ? "Save tournament" : "Create tournament"}</button>
          {editingTournament && (
            <button className="secondary-action tap-card" type="button" onClick={() => setEditingTournament(null)} disabled={creating}>Cancel edit</button>
          )}
        </div>
        {notice && <p className={`admin-notice ${notice.type}`}>{notice.text}</p>}
      </form>
      <div className="admin-table">
        {tournaments.map((tournament) => (
          <article className="admin-row" key={tournament.id}>
            <div>
              <strong>{tournament.name}</strong>
              <em>{tournament.venue_name || "Venue TBD"} · {tournament.status}</em>
            </div>
            <span>{formatAdminCurrency(tournament.registration_fee_cents)}</span>
            <small>{formatAdminDate(tournament.starts_on)} - {formatAdminDate(tournament.ends_on)} · closes {formatAdminDateTime(tournament.registration_closes_at)}</small>
            <div className="admin-row-actions">
              <button type="button" onClick={() => startEditingTournament(tournament)}>Edit</button>
              <button className="danger" type="button" onClick={() => deleteTournament(tournament)}>Delete</button>
            </div>
            <TieredRegisteredPlayers players={registeredByTournament[tournament.id] || []} />
          </article>
        ))}
      </div>
    </AdminFrame>
  );
}

function TieredRegisteredPlayers({ players }: { players: AdminRegisteredPlayer[] }) {
  if (!players.length) {
    return <div className="admin-tier-groups empty">No paid or waived registrations yet.</div>;
  }

  const grouped = [1, 2, 3, 4].map((tier) => ({
    tier,
    players: players.filter((player) => player.tier === tier).sort((a, b) => a.fullName.localeCompare(b.fullName))
  }));

  return (
    <div className="admin-tier-groups" aria-label="Registered players grouped by tier">
      {grouped.map((group) => (
        <section className="admin-tier-group" key={group.tier}>
          <strong>Tier {group.tier} registered list</strong>
          {group.players.length ? (
            <ul>
              {group.players.map((player) => (
                <li key={player.id}>
                  <span>{player.fullName}</span>
                  <em>{player.jamaatCity} · {formatAdminRating(player.rating)}</em>
                </li>
              ))}
            </ul>
          ) : (
            <small>No Tier {group.tier} registrations.</small>
          )}
        </section>
      ))}
    </div>
  );
}

export function AdminPaymentsScreen() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);

  const loadPayments = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const { data } = await supabase
      .from("payment_ledger")
      .select("id, entry_type, status, amount_cents, occurred_at, players(full_name), tournaments(name)")
      .order("occurred_at", { ascending: false })
      .limit(40);
    setPayments((data || []) as AdminPayment[]);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const markPaid = async (id: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.from("payment_ledger").update({ status: "paid" }).eq("id", id);
    await loadPayments();
  };

  return (
    <AdminFrame active="payments">
      <AdminHeader eyebrow="Payments" title="Payment Ledger" copy="Limited ledger view. Admins can mark pending entries as paid." />
      <div className="admin-table">
        {payments.map((payment) => {
          const player = Array.isArray(payment.players) ? payment.players[0] : payment.players;
          const tournament = Array.isArray(payment.tournaments) ? payment.tournaments[0] : payment.tournaments;
          return (
            <article className="admin-row" key={payment.id}>
              <div>
                <strong>{player?.full_name || "Unknown player"}</strong>
                <em>{tournament?.name || "General"} · {payment.entry_type} · {payment.status}</em>
              </div>
              <span>{formatAdminCurrency(payment.amount_cents)}</span>
              {payment.status === "pending" ? <button type="button" onClick={() => markPaid(payment.id)}>Mark paid</button> : <small>{formatAdminDate(payment.occurred_at)}</small>}
            </article>
          );
        })}
      </div>
    </AdminFrame>
  );
}

export function AdminClaimsScreen() {
  const [claims, setClaims] = useState<AdminClaim[]>([]);
  const [claimsNotice, setClaimsNotice] = useState("");

  const loadClaims = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const { data, error } = await supabase.rpc("admin_pending_player_claims");
    if (!error) {
      setClaims((data || []) as AdminClaim[]);
      setClaimsNotice("");
      return;
    }

    const fallback = await supabase
      .from("player_claims")
      .select("id, player_id, requested_by, status, requester_note, created_at, players(full_name, jamaat_city)")
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
        requester_email: null,
        created_at: claim.created_at,
        player_full_name: player?.full_name || null,
        player_jamaat_city: player?.jamaat_city || null
      };
    }));
    setClaimsNotice("Claim email requires the latest Supabase migration. Showing pending claims with user IDs for now.");
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const reviewClaim = async (claim: AdminClaim, approved: boolean) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();

    await supabase
      .from("player_claims")
      .update({
        status: approved ? "approved" : "rejected",
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
  };

  return (
    <AdminFrame active="claims">
      <AdminHeader eyebrow="Claims" title="Profile Claims" copy="Approve true claims or reject false profile matches." />
      {claimsNotice && <p className="admin-notice error">{claimsNotice}</p>}
      <div className="admin-table">
        {claims.map((claim) => {
          return (
            <article className="admin-row" key={claim.id}>
              <div>
                <strong>{claim.player_full_name || "Unknown player"}</strong>
                <em>
                  {claim.player_jamaat_city || "City missing"} · claimed by {claim.requester_email || claim.requested_by} · {formatAdminDateTime(claim.created_at)}
                </em>
                <small>{claim.requester_note || "No note"}</small>
              </div>
              <button type="button" onClick={() => reviewClaim(claim, true)}>Approve</button>
              <button type="button" onClick={() => reviewClaim(claim, false)}>Reject</button>
            </article>
          );
        })}
        {!claims.length && <div className="admin-empty">No pending claims.</div>}
      </div>
    </AdminFrame>
  );
}

function AdminHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <header className="admin-header">
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{copy}</p>
    </header>
  );
}

function AdminStat({ label, value }: { label: string; value: number }) {
  return (
    <article className="admin-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function AdminLinkCard({ href, title, copy }: { href: string; title: string; copy: string }) {
  return (
    <Link className="admin-link-card" href={href}>
      <strong>{title}</strong>
      <em>{copy}</em>
    </Link>
  );
}

function formatAdminRating(value: number | null) {
  return typeof value === "number" ? value.toFixed(3) : "Pending";
}

function formatAdminCurrency(cents: number | null) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format((cents || 0) / 100);
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

async function getAdminTennisSportId() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.from("sports").select("id").eq("slug", "tennis").single();
  return data?.id || null;
}
