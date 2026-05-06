"use client";

import { AlertCircle, ArrowLeft, ArrowRight, BadgeDollarSign, CheckCircle2, ChevronDown, Home, Info, LogIn, LogOut, Mail, MapPin, Pencil, RefreshCw, Search, Shield, Trophy, UsersRound, X } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, createContext, FormEvent, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseClient } from "./lib/supabase";

type Tab = "home" | "tournament" | "profile" | "admin";
type ProfileData = {
  id?: string;
  profilePhotoUrl?: string;
  fullName: string;
  phone: string;
  dateOfBirth: string;
  dominantHand: string;
  selfEvaluation: string;
  jamaatCity: string;
  tier: string;
  rating: string;
  tournamentsPlayed: string;
  matchesPlayed: string;
  jerseySize: string;
  tennisVideo: string;
};

type TopPlayer = { id: string; name: string; rating: string; city: string; profilePhotoUrl: string };
type AvatarProps = {
  className: string;
  name: string;
  photoUrl?: string;
  ariaLabel?: string;
};
type ReturningPlayer = { id: string; name: string; city: string; rating: string; tier: string; claimStatus: string };
type Tournament = {
  id: string;
  name: string;
  seasonYear: number | null;
  status: string;
  venueName: string;
  venueAddress: string;
  venueMapsUrl: string;
  startsOn: string | null;
  endsOn: string | null;
  registrationClosesAt: string | null;
  registrationFeeCents: number;
  maxPlayers: number | null;
};
type RegisteredPlayer = { id: string; name: string; city: string; rating: string };
type PaymentState = "idle" | "pending" | "failed" | "paid";
type PaymentHistoryItem = {
  id: string;
  entryType: string;
  status: PaymentState | "refunded" | "waived";
  amountCents: number;
  currency: string;
  occurredAt: string;
  notes: string;
  tournamentName: string;
  failureMessage: string;
};
type PastTournamentSummary = {
  seasonYear: number;
  matches: number;
  singles: number;
  doubles: number;
};
const skillLevels = [
  { value: "Advanced", label: "Advanced (High-level players with strong match experience and consistency)" },
  { value: "Upper Intermediate", label: "Upper Intermediate (Solid all-around players with competitive experience)" },
  { value: "Intermediate", label: "Intermediate (Reliable players with developing skills and some match play)" },
  { value: "Developing Intermediate", label: "Developing Intermediate (Improving players with basic consistency and game sense)" },
  { value: "Recreational", label: "Recreational (Casual players with limited experience but passion to play)" }
];
const jamaatCityOptions = [
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
  "Washington, D.C."
];
const videoDescription = "Recommended for draft placement: add a Google Drive link to a short video of you playing. Include your serve, forehand, backhand, volleys, and a few rally points so captains and organizers can evaluate your level for drafts.";
type DbProfileRow = {
  id?: string;
  auth_user_id?: string | null;
  full_name?: string | null;
  phone?: string | null;
  age?: number | string | null;
  date_of_birth?: string | null;
  profile_photo_url?: string | null;
  jamaat_city?: string | null;
  self_assessment?: string | null;
  dominant_hand?: string | null;
  jersey_size?: string | null;
  tier?: number | string | null;
  rating?: number | string | null;
  tournaments_played?: number | string | null;
  matches_played?: number | string | null;
  tennis_video_url?: string | null;
  tennis_video_status?: string | null;
  claim_status?: string | null;
  claim_requested_by?: string | null;
};
type RecentClaimRow = {
  id: string;
  player_id: string;
  status: string;
  admin_note?: string | null;
  created_at: string | null;
  reviewed_at?: string | null;
  players?: { full_name: string | null } | { full_name: string | null }[] | null;
};
type DbTournamentRow = {
  id: string;
  name: string;
  season_year: number | null;
  status: string;
  venue_name: string | null;
  venue_address: string | null;
  venue_maps_url: string | null;
  starts_on: string | null;
  ends_on: string | null;
  registration_closes_at: string | null;
  registration_fee_cents: number | null;
  max_players: number | null;
};

const initialProfile: ProfileData = {
  fullName: "Mohammed Segval",
  phone: "",
  dateOfBirth: "",
  dominantHand: "Right",
  selfEvaluation: "Advanced",
  jamaatCity: "Chicago",
  tier: "1",
  rating: "4.432",
  tournamentsPlayed: "2",
  matchesPlayed: "11",
  jerseySize: "M",
  tennisVideo: ""
};

const startingTennisTier = 4;
const startingTennisRating = 3.6;
type AppSessionState = {
  ready: boolean;
  session: Session | null;
  user: User | null;
  userId: string | null;
  player: DbProfileRow | null;
  profileComplete: boolean;
  recentRejectedClaim: RecentClaimRow | null;
  isAdmin: boolean;
  refresh: () => Promise<void>;
};

const emptyAppSession: AppSessionState = {
  ready: false,
  session: null,
  user: null,
  userId: null,
  player: null,
  profileComplete: false,
  recentRejectedClaim: null,
  isAdmin: false,
  refresh: async () => {}
};
const AppSessionContext = createContext<AppSessionState>(emptyAppSession);

function Avatar({ className, name, photoUrl, ariaLabel }: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = Boolean(photoUrl && !imageFailed);

  useEffect(() => {
    setImageFailed(false);
  }, [photoUrl]);

  return (
    <span className={`${className} avatar-fallback`} aria-label={ariaLabel}>
      {showPhoto ? <NextImage src={photoUrl || ""} alt="" fill sizes="56px" onError={() => setImageFailed(true)} /> : getInitials(name)}
    </span>
  );
}

function BrandMark() {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="MRSA">
      <span className="relative h-12 w-12 shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/mrsa-logo.svg" alt="" aria-hidden="true" className="h-full w-full object-contain" />
      </span>
      <strong className="text-[27px] font-medium leading-none tracking-[-0.4px] text-brand md:text-[29px]">MRSA</strong>
    </span>
  );
}

function AppTopBar({
  avatarName,
  avatarPhotoUrl
}: {
  avatarName?: string | null;
  avatarPhotoUrl?: string | null;
}) {
  const appSession = useAppSession();
  const name = avatarName || appSession.player?.full_name || "Player";
  const photoUrl = avatarPhotoUrl || appSession.player?.profile_photo_url || undefined;

  return (
    <header className="sticky top-0 z-30 border-b-hairline border-white/70 bg-white/70 px-4 py-3 shadow-[0_10px_30px_rgba(24,24,26,0.04)] backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-shell grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] items-center">
        <Link className="tap-card inline-flex min-w-0 justify-self-start" href="/dashboard" aria-label="MRSA home">
          <BrandMark />
        </Link>
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <Link className="tap-card grid h-11 w-11 place-items-center justify-self-end" href="/profile" aria-label={`${name} profile`}>
          <Avatar className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-brand text-[15px] font-medium text-white shadow-[0_8px_22px_rgba(24,24,26,0.10)]" name={name} photoUrl={photoUrl} />
        </Link>
      </div>
    </header>
  );
}

function StatusMessage({ tone = "info", children }: { tone?: "info" | "success" | "error" | "warning"; children: ReactNode }) {
  const toneClass = {
    info: "border-line bg-card text-text-secondary",
    success: "border-[#dbe8cd] bg-brand-light text-[#3b6d11]",
    error: "border-[#f2c8c8] bg-[#fff5f5] text-[#a32d2d]",
    warning: "border-[#f2dccb] bg-[#fff8f1] text-[#8a4a22]"
  }[tone];
  const Icon = tone === "success" ? CheckCircle2 : tone === "error" ? AlertCircle : Info;

  return (
    <p className={`inline-flex items-start gap-2 rounded-card border-hairline p-4 text-[15px] leading-relaxed ${toneClass}`}>
      <Icon className="mt-0.5 shrink-0" size={16} />
      <span>{children}</span>
    </p>
  );
}

function SkeletonHero() {
  return (
    <section className="grid min-h-[220px] animate-pulse rounded-hero border-hairline border-line bg-card p-5 shadow-card md:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] md:items-center md:gap-6">
      <div className="grid gap-3">
        <span className="h-4 w-28 rounded-full bg-surface" />
        <span className="h-8 w-4/5 rounded-full bg-surface" />
        <span className="h-4 w-2/3 rounded-full bg-surface" />
      </div>
      <div className="mt-4 grid gap-3 rounded-surface bg-surface p-4 md:mt-0">
        <span className="h-5 w-32 rounded-full bg-white/80" />
        <span className="h-10 rounded-card bg-white/80" />
      </div>
    </section>
  );
}

function SkeletonCard() {
  return <div className="min-h-[92px] animate-pulse rounded-card border-hairline border-line bg-card p-4 shadow-card"><div className="h-full rounded-card bg-surface" /></div>;
}

function SkeletonRow() {
  return (
    <div className="grid min-h-[60px] animate-pulse grid-cols-[34px_minmax(0,1fr)_56px] items-center gap-3 rounded-card border-hairline border-line bg-card px-3 py-3">
      <span className="h-[34px] w-[34px] rounded-full bg-surface" />
      <span className="grid gap-2">
        <span className="h-3 w-3/4 rounded-full bg-surface" />
        <span className="h-3 w-1/2 rounded-full bg-surface" />
      </span>
      <span className="h-4 rounded-full bg-surface" />
    </div>
  );
}

function OnboardingStep({ step, total, label }: { step: number; total: number; label: string }) {
  return (
    <span className="inline-flex w-max items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-[13px] text-white/75">
      Step {step} of {total}
      <span className="h-1 w-1 rounded-full bg-white/45" />
      {label}
    </span>
  );
}

function normalizeNextPath(nextPath?: string | null) {
  if (!nextPath) return "/tournaments";
  if (nextPath.startsWith("/tournaments")) return "/tournaments";
  if (nextPath.startsWith("/dashboard")) return "/dashboard";
  return "/tournaments";
}

function buildProfileCompletionPath(playerId: string | undefined, nextPath?: string | null) {
  const params = new URLSearchParams({ next: normalizeNextPath(nextPath) });
  if (playerId) params.set("claim", playerId);
  return `/profile/new?${params.toString()}`;
}

function buildPlayerCheckPath(nextPath?: string | null, reason?: "rejected", playerName?: string | null, adminNote?: string | null) {
  const params = new URLSearchParams({ next: normalizeNextPath(nextPath) });
  if (reason) params.set("claim", reason);
  if (playerName) params.set("player", playerName);
  if (adminNote) params.set("note", adminNote);
  return `/player-check?${params.toString()}`;
}

function hasRequiredProfileFields(profile?: DbProfileRow | null) {
  return Boolean(
	    profile?.full_name?.trim() &&
	    profile.phone?.trim() &&
	    profile.date_of_birth?.trim() &&
	    profile.jamaat_city?.trim() &&
    profile.self_assessment?.trim() &&
    profile.jersey_size?.trim()
  );
}

function getMissingProfileFields(profile?: DbProfileRow | null) {
  const missing: string[] = [];
  if (!profile?.full_name?.trim()) missing.push("full name");
  if (!profile?.phone?.trim()) missing.push("phone number");
  if (!profile?.date_of_birth?.trim()) missing.push("date of birth");
  if (!profile?.jamaat_city?.trim()) missing.push("Jamaat / city");
  if (!profile?.self_assessment?.trim()) missing.push("self evaluation");
  if (!profile?.jersey_size?.trim()) missing.push("shirt size");
  return missing;
}

function formatMissingFields(fields: string[]) {
  if (!fields.length) return "";
  if (fields.length === 1) return fields[0];
  if (fields.length === 2) return `${fields[0]} and ${fields[1]}`;
  return `${fields.slice(0, -1).join(", ")}, and ${fields[fields.length - 1]}`;
}

export function AppSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppSessionState>(emptyAppSession);

  const loadState = useCallback(async (sessionOverride?: Session | null) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setState({ ...emptyAppSession, ready: true });
      return;
    }

    const session = sessionOverride === undefined
      ? (await supabase.auth.getSession()).data.session
      : sessionOverride;
    const user = session?.user || null;

    if (!user) {
      setState({ ...emptyAppSession, ready: true });
      return;
    }

    const [{ data: player }, { data: rejectedClaim }, { data: isAdmin }] = await Promise.all([
      supabase
        .from("players")
	        .select("id, auth_user_id, full_name, phone, age, date_of_birth, profile_photo_url, jamaat_city, self_assessment, dominant_hand, jersey_size, tennis_video_url, tennis_video_status, tier, rating, tournaments_played, matches_played, claim_status, claim_requested_by")
        .or(`auth_user_id.eq.${user.id},claim_requested_by.eq.${user.id}`)
        .limit(1)
        .maybeSingle(),
      supabase
        .from("player_claims")
        .select("id, player_id, status, admin_note, created_at, reviewed_at, players(full_name)")
        .eq("requested_by", user.id)
        .eq("status", "rejected")
        .order("reviewed_at", { ascending: false, nullsFirst: false })
        .limit(1)
        .maybeSingle(),
      supabase.rpc("is_admin")
    ]);

    const activePlayer = player && (player.auth_user_id === user.id || player.claim_status === "pending") ? player : null;

    setState({
      ready: true,
      session,
      user,
      userId: user.id,
      player: activePlayer,
      profileComplete: hasRequiredProfileFields(activePlayer),
      recentRejectedClaim: rejectedClaim || null,
      isAdmin: Boolean(isAdmin),
      refresh: () => loadState()
    });
  }, []);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setState({ ...emptyAppSession, ready: true });
      return;
    }

    loadState();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => {
        loadState(session);
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, [loadState]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase || !state.userId) return;

    const channel = supabase
      .channel(`app-session-${state.userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "player_claims", filter: `requested_by=eq.${state.userId}` }, () => loadState())
      .on("postgres_changes", { event: "*", schema: "public", table: "players", filter: `auth_user_id=eq.${state.userId}` }, () => loadState())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadState, state.userId]);

  return <AppSessionContext.Provider value={{ ...state, refresh: () => loadState() }}>{children}</AppSessionContext.Provider>;
}

function useAppSession() {
  return useContext(AppSessionContext);
}

function useProtectedRoute(nextPath = "/dashboard", requireCompleteProfile = false) {
  const router = useRouter();
  const appSession = useAppSession();

  useEffect(() => {
    if (!appSession.ready) return;

    if (!appSession.userId) {
      router.replace(`/?next=${encodeURIComponent(normalizeNextPath(nextPath))}`);
      return;
    }

    if (requireCompleteProfile && !appSession.profileComplete) {
      if (!appSession.player) {
        const claimedPlayer = Array.isArray(appSession.recentRejectedClaim?.players)
          ? appSession.recentRejectedClaim?.players[0]
          : appSession.recentRejectedClaim?.players;
        router.replace(buildPlayerCheckPath(nextPath, appSession.recentRejectedClaim ? "rejected" : undefined, claimedPlayer?.full_name, appSession.recentRejectedClaim?.admin_note));
        return;
      }

	      router.replace(buildProfileCompletionPath(appSession.player.auth_user_id === appSession.userId ? undefined : appSession.player.id, nextPath));
    }
  }, [appSession.player, appSession.profileComplete, appSession.ready, appSession.recentRejectedClaim, appSession.userId, nextPath, requireCompleteProfile, router]);

  return appSession;
}

function usePublicAuthRedirect(nextPath?: string | null) {
  const router = useRouter();
  const appSession = useAppSession();

  useEffect(() => {
    if (!appSession.ready || !appSession.userId) return;

    const destination = nextPath ? normalizeNextPath(nextPath) : "/dashboard";

    if (!appSession.player) {
      router.replace(`/player-check?next=${encodeURIComponent(destination)}`);
      return;
    }

    if (!appSession.profileComplete) {
      router.replace(buildProfileCompletionPath(appSession.player.auth_user_id === appSession.userId ? undefined : appSession.player.id, destination));
      return;
    }

    router.replace(destination);
  }, [appSession.player, appSession.profileComplete, appSession.ready, appSession.userId, nextPath, router]);
}

export function AppFrame({
  active,
  children,
  withNav = true
}: {
  active?: Tab;
  children: React.ReactNode;
  withNav?: boolean;
}) {
  const appSession = useAppSession();

  return (
    <main className="app-stage">
      <section className="app-frame" aria-label="MRSA tennis tournament app">
        <div className="screen-stack">{children}</div>
        {withNav && active && <BottomNav active={active} showAdmin={appSession.isAdmin} />}
      </section>
    </main>
  );
}

export function LoginScreen({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  usePublicAuthRedirect(nextPath);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.");
      return;
    }

    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true }
    });
    setLoading(false);

    if (error) {
      setMessage(getFriendlyError(error));
      return;
    }

    const destination = normalizeNextPath(nextPath);
    router.push(`/otp?email=${encodeURIComponent(email)}&next=${encodeURIComponent(destination)}`);
  };

  return (
    <AppFrame withNav={false}>
      <div className="min-h-dvh bg-[#f4f1ea] font-sans text-text-primary">
        <main className="mx-auto grid min-h-dvh w-full max-w-[440px] content-center px-4 py-4 md:max-w-[470px] md:py-5">
          <section className="overflow-hidden rounded-hero border-hairline border-line bg-white shadow-[0_24px_80px_rgba(24,24,26,0.11)]">
            <div className="relative overflow-hidden bg-brand px-6 pb-6 pt-6 text-white md:pb-7 md:pt-7">
              <div className="pointer-events-none absolute inset-0 text-white opacity-[0.07]" aria-hidden="true">
                <svg className="h-full w-full scale-125" viewBox="0 0 340 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="22" y="18" width="296" height="184" stroke="currentColor" strokeWidth="1.1" />
                  <path d="M22 110H318M170 18V202M88 18V202M252 18V202M88 65H252M88 155H252" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              </div>
              <div className="relative z-10 grid justify-items-center gap-4 text-center">
                <span className="grid h-32 w-32 place-items-center rounded-full bg-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] ring-1 ring-white/75 md:h-36 md:w-36">
                  <span className="relative h-24 w-24 shrink-0 overflow-hidden md:h-28 md:w-28">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/mrsa-logo.svg" alt="MRSA" className="h-full w-full object-contain" />
                  </span>
                </span>
                <div className="grid gap-2">
                  <h1 className="max-w-[320px] text-[32px] font-medium leading-[1.05] text-white md:text-[36px]">Sign in to your MRSA profile</h1>
                </div>
              </div>
            </div>

            <div className="relative z-10 grid gap-5 bg-white px-6 py-6 md:px-8 md:py-7">
              <div className="grid gap-1 text-center">
                <h2 className="text-h1 text-text-primary">Welcome</h2>
                <p className="text-body text-text-secondary">First time? Use an email you prefer to set up your profile. Already signed up? Sign in with the same email and stay logged in to skip authentication next time.</p>
              </div>
              <form className="grid gap-4" onSubmit={sendOtp}>
                <label className="grid gap-2 text-caption text-text-secondary" htmlFor="email">
                  Email address
                  <span className="grid min-h-12 grid-cols-[minmax(0,1fr)_auto] items-center rounded-card border-hairline border-line bg-surface px-3 transition focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-light">
                    <input className="min-h-11 bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted" id="email" name="email" type="email" placeholder="Enter email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
                    <Mail size={16} className="text-brand" />
                  </span>
                </label>
                <button className="tap-card inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-card bg-brand px-4 text-center text-sm font-medium text-white shadow-[0_14px_28px_rgba(12,59,32,0.18)] disabled:opacity-60" type="submit" disabled={loading}>
                  <LogIn size={16} />
                  {loading ? "Sending code..." : "Send one-time code"}
                </button>
                {message && <StatusMessage tone={message.includes("sent") ? "success" : "error"}>{message}</StatusMessage>}
              </form>
            </div>
	        </section>
	        </main>
	      </div>
	    </AppFrame>
  );
}

export function OtpScreen({ email = "player@mrsa.com", nextPath }: { email?: string; nextPath?: string }) {
  const router = useRouter();
  const appSession = useAppSession();
  usePublicAuthRedirect(nextPath);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  const resendOtp = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      return;
    }

    setResending(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true }
    });
    setResending(false);

    if (error) {
      setCanResend(true);
      setMessage(getFriendlyError(error));
      return;
    }

    setOtp("");
    setCanResend(false);
    setMessage("A fresh code has been sent.");
  };

  const verifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      return;
    }

    setLoading(true);
    setCanResend(false);
    setMessage("");
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email"
    });

    if (error) {
      const friendlyError = getFriendlyError(error);
      const retryableOtpError = /expired|invalid|token|otp|code/i.test(`${error.message} ${friendlyError}`);
      setLoading(false);
      setCanResend(retryableOtpError);
      setMessage(friendlyError);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setLoading(false);
      router.push("/player-check");
      return;
    }
    const { data: linkedPlayer } = await supabase
      .from("players")
      .select("id")
      .eq("auth_user_id", userId)
      .maybeSingle();

    await appSession.refresh();
    setLoading(false);
    const destination = normalizeNextPath(nextPath);
    router.push(linkedPlayer ? destination : `/player-check?next=${encodeURIComponent(destination)}`);
  };

  return (
    <AppFrame withNav={false}>
      <div className="min-h-dvh bg-[#f4f1ea] font-sans text-text-primary">
        <main className="mx-auto grid min-h-dvh w-full max-w-[440px] content-center px-4 py-6 md:max-w-[470px]">
          <section className="overflow-hidden rounded-hero border-hairline border-line bg-white shadow-[0_24px_80px_rgba(24,24,26,0.11)]">
            <div className="relative overflow-hidden bg-brand px-6 pb-8 pt-7 text-white">
              <div className="pointer-events-none absolute inset-0 text-white opacity-[0.07]" aria-hidden="true">
                <svg className="h-full w-full scale-125" viewBox="0 0 340 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="22" y="18" width="296" height="184" stroke="currentColor" strokeWidth="1.1" />
                  <path d="M22 110H318M170 18V202M88 18V202M252 18V202M88 65H252M88 155H252" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              </div>
              <div className="relative z-10 grid justify-items-center gap-4 text-center">
                <span className="grid h-40 w-40 place-items-center rounded-full bg-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] ring-1 ring-white/75 md:h-44 md:w-44">
                  <span className="relative h-32 w-32 shrink-0 overflow-hidden md:h-36 md:w-36">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/mrsa-logo.svg" alt="MRSA" className="h-full w-full object-contain" />
                  </span>
                </span>
                <div className="grid gap-2">
                  <span className="mx-auto inline-flex w-max items-center rounded-full bg-white/12 px-3 py-1 text-caption text-white/72">MRSA verification</span>
                  <h1 className="max-w-[320px] text-[30px] font-medium leading-[1.05] text-white md:text-[34px]">Enter your access code.</h1>
                  <p className="mx-auto max-w-[310px] text-[15px] leading-relaxed text-white/68">We sent a one-time code to your email. Enter it below to continue.</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 grid gap-4 bg-white px-6 py-5 md:px-8 md:py-6">
              <div className="grid gap-1 text-center">
                <h2 className="text-h1 text-text-primary">Check your inbox</h2>
                <p className="truncate text-body text-text-secondary">Enter the code sent to {email}.</p>
              </div>
              <form className="grid gap-3" onSubmit={verifyOtp}>
                <input type="hidden" name="email" value={email} />
                <label className="grid gap-2 text-caption text-text-secondary" htmlFor="otp">
                  One-time code
                  <span className="grid min-h-12 items-center rounded-card border-hairline border-line bg-surface px-3 transition focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-light">
                    <input id="otp" name="otp" className="min-h-11 w-full bg-transparent text-center font-sans text-[22px] font-medium tracking-[0.14em] text-text-primary outline-none placeholder:tracking-normal placeholder:text-text-muted md:text-[24px] md:tracking-[0.24em]" inputMode="numeric" maxLength={10} placeholder="Enter code" value={otp} onChange={(event) => setOtp(event.target.value)} required />
                  </span>
                  <em className="text-[13px] not-italic leading-relaxed text-text-secondary">Enter the one-time code from your email.</em>
                </label>
                <button className="tap-card inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-card bg-brand px-4 text-center text-sm font-medium text-white shadow-[0_14px_28px_rgba(12,59,32,0.18)] disabled:opacity-60" type="submit" disabled={loading}>
                  <CheckCircle2 size={16} />
                  {loading ? "Confirming..." : "Confirm code"}
                </button>
                {canResend && (
                  <button className="tap-card inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-card border-hairline border-line bg-card px-4 text-sm font-medium text-brand disabled:opacity-60" type="button" onClick={resendOtp} disabled={resending}>
                    <RefreshCw size={15} />
                    {resending ? "Sending new code..." : "Resend code"}
                  </button>
                )}
                <Link className="tap-card inline-flex min-h-10 w-full items-center justify-center rounded-card border-hairline border-line bg-card px-4 text-sm font-medium text-brand" href="/">Change email</Link>
                {message && <StatusMessage tone={message.includes("sent") ? "success" : "error"}>{message}</StatusMessage>}
              </form>
              <div className="grid gap-2 border-t-hairline border-line pt-4 text-center text-[14px] text-text-secondary">
                <span>Codes expire for your account safety.</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </AppFrame>
  );
}

export function PlayerCheckScreen({
  claimStatus,
  rejectedPlayerName,
  rejectionNote,
  nextPath
}: {
  claimStatus?: string;
  rejectedPlayerName?: string;
  rejectionNote?: string;
  nextPath?: string;
}) {
  const router = useRouter();
  const destinationPath = normalizeNextPath(nextPath);
  const appSession = useProtectedRoute(destinationPath);
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState<ReturningPlayer[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<ReturningPlayer | null>(null);
  const [confirmClaimId, setConfirmClaimId] = useState<string | null>(null);
  const [message, setMessage] = useState(
    claimStatus === "rejected"
      ? `Admin rejected your claim${rejectedPlayerName ? ` for ${rejectedPlayerName}` : ""}. Please search again or create a new player profile.`
      : ""
  );
  const filteredPlayers = query.trim()
    ? players.filter((player) => player.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    if (!appSession.ready || !appSession.userId) return;

    const loadPlayers = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setMessage("Supabase env vars are missing.");
        return;
      }

      const { data, error } = await supabase
        .from("players")
        .select("id, full_name, jamaat_city, tier, rating, claim_status")
        .eq("claim_status", "unclaimed")
        .order("full_name")
        .limit(80);

      if (error) {
        setMessage(getFriendlyError(error));
        return;
      }

      setPlayers((data || []).map((player) => ({
        id: player.id,
        name: player.full_name,
        city: player.jamaat_city || "MRSA",
        rating: formatRating(player.rating),
        tier: String(player.tier || 1),
        claimStatus: player.claim_status
      })));
    };

    loadPlayers();
  }, [appSession.ready, appSession.userId]);

  const openClaimConfirmation = (player: ReturningPlayer) => {
    setSelectedPlayer(player);
    setConfirmClaimId(player.id);
    setMessage("");
  };

  const claimProfile = async (player: ReturningPlayer) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const user = appSession.user;
    if (!user) {
      router.push("/");
      return;
    }

    const { data: reservedPlayer, error: playerError } = await supabase
      .from("players")
      .update({
        claim_status: "pending",
        claim_requested_by: user.id,
        auth_user_id: user.id
      })
      .eq("id", player.id)
      .eq("claim_status", "unclaimed")
      .select("id")
      .maybeSingle();

    if (playerError) {
      setMessage(getFriendlyError(playerError));
      return;
    }

    if (!reservedPlayer) {
      const { data: existingPlayer } = await supabase
        .from("players")
        .select("id, auth_user_id, claim_requested_by")
        .eq("id", player.id)
        .maybeSingle();

      const belongsToUser = existingPlayer?.auth_user_id === user.id || existingPlayer?.claim_requested_by === user.id;
      if (!belongsToUser) {
        setMessage("That profile is no longer available to claim.");
        return;
      }
    }

    const { data: existingClaim } = await supabase
      .from("player_claims")
      .select("id")
      .eq("player_id", player.id)
      .eq("requested_by", user.id)
      .eq("status", "pending")
      .maybeSingle();

    let claimInsertError = null;
    if (!existingClaim) {
      const claimInsert = await supabase.from("player_claims").insert({
        player_id: player.id,
        requested_by: user.id,
        requester_email: user.email || null,
        requester_note: "Player confirmed from onboarding profile claim modal."
      });
      claimInsertError = claimInsert.error;

      if (claimInsertError?.message?.includes("requester_email")) {
        const fallbackInsert = await supabase.from("player_claims").insert({
          player_id: player.id,
          requested_by: user.id,
          requester_note: "Player confirmed from onboarding profile claim modal."
        });
        claimInsertError = fallbackInsert.error;
      }
    }

    if (claimInsertError) {
      setMessage(getFriendlyError(claimInsertError));
      return;
    }

    await appSession.refresh();
    setMessage("Profile reserved. Complete your details before continuing.");
    router.push(buildProfileCompletionPath(player.id, destinationPath));
  };

  if (!appSession.ready || !appSession.userId) return null;

  return (
    <AppFrame withNav={false}>
      <div className="min-h-dvh bg-page font-sans text-text-primary">
        <header className="border-b-hairline border-surface bg-white/95 px-4 py-3">
          <div className="mx-auto flex w-full max-w-shell items-center justify-center">
            <Link className="inline-flex" href="/" aria-label="MRSA home">
              <BrandMark />
            </Link>
          </div>
        </header>

        <main className="mx-auto grid min-h-[calc(100dvh-59px)] w-full max-w-[980px] content-center px-4 py-5 md:px-6 md:py-8">
          <section className="grid min-w-0 overflow-hidden rounded-[24px] border-hairline border-line bg-card shadow-[0_24px_80px_rgba(24,24,26,0.10)] md:min-h-[620px] md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[260px] min-w-0 overflow-hidden bg-brand p-5 text-white md:min-h-0 md:p-10">
              <div className="pointer-events-none absolute inset-0 text-white opacity-[0.08]" aria-hidden="true">
                <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-44 bg-[radial-gradient(circle_at_66%_58%,rgba(214,242,65,0.86)_0,rgba(214,242,65,0.86)_36px,transparent_37px),linear-gradient(18deg,transparent_0_42%,rgba(255,255,255,0.35)_43%,rgba(255,255,255,0.35)_45%,transparent_46%),radial-gradient(ellipse_at_55%_70%,rgba(255,255,255,0.28)_0,rgba(255,255,255,0.13)_34%,transparent_58%)] opacity-80" aria-hidden="true" />
              <div className="relative z-10 grid h-full min-w-0 content-center gap-3 md:gap-4">
                <OnboardingStep step={2} total={3} label="Find profile" />
                <h1 className="max-w-[420px] text-[32px] font-medium leading-[1.08] tracking-[-0.4px] text-white md:text-[40px]">Returning player?</h1>
                <p className="max-w-[340px] text-sm leading-relaxed text-white/70">Search past MRSA player profiles and continue with your existing tournament history.</p>
              </div>
            </div>

            <div className="grid min-w-0 content-start gap-5 bg-white p-5 md:p-8">
              <div className="grid min-w-0 gap-2">
                <h2 className="text-[30px] font-medium leading-tight tracking-[-0.4px] text-text-primary">Find your profile</h2>
                <p className="text-sm leading-relaxed text-text-secondary">If you played before, type your name and select the matching profile to claim.</p>
              </div>

              <label className="grid min-w-0 gap-2 text-[13px] text-text-secondary" htmlFor="player-search">
                Search past player profiles
                <span className="grid min-h-11 grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-[14px] border-hairline border-line bg-white px-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand-light">
                  <Search size={16} className="text-brand" />
                  <input
                    className="min-w-0 bg-transparent text-[16px] text-text-primary outline-none placeholder:text-text-muted"
                    id="player-search"
                    name="player"
                    type="search"
                    placeholder="Type a player name"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setSelectedPlayer(null);
                      setConfirmClaimId(null);
                    }}
                  />
                </span>
              </label>

              <div className="grid max-h-[300px] gap-3 overflow-y-auto pr-1">
                {filteredPlayers.map((player, index) => (
                  <div className="grid gap-3" key={player.id}>
                    <button
                      className={selectedPlayer?.id === player.id ? "tap-card grid min-h-[64px] grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-[14px] border-hairline border-brand bg-brand-light px-3 py-3 text-left" : "tap-card grid min-h-[64px] grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-[14px] border-hairline border-line bg-card px-3 py-3 text-left"}
                      type="button"
                      onClick={() => {
                        setSelectedPlayer(player);
                        setConfirmClaimId(null);
                        setMessage("");
                      }}
                    >
                      <span className={index % 5 === 0 ? "grid h-9 w-9 place-items-center rounded-full bg-[#fde9dc] text-[13px] font-medium text-[#a94d24]" : index % 5 === 1 ? "grid h-9 w-9 place-items-center rounded-full bg-[#e5f1ff] text-[13px] font-medium text-[#185fa5]" : index % 5 === 2 ? "grid h-9 w-9 place-items-center rounded-full bg-[#eaf3de] text-[13px] font-medium text-[#3b6d11]" : index % 5 === 3 ? "grid h-9 w-9 place-items-center rounded-full bg-[#fbe7ef] text-[13px] font-medium text-[#aa3f6b]" : "grid h-9 w-9 place-items-center rounded-full bg-[#f1efe8] text-[13px] font-medium text-[#5f5e5a]"}>{getInitials(player.name)}</span>
                      <span className="grid min-w-0 gap-1">
                        <strong className="truncate text-[15px] font-medium text-text-primary">{player.name}</strong>
                        <em className="truncate text-[13px] not-italic text-text-secondary">{player.city} · Tier {player.tier}</em>
                      </span>
                      <span className="grid justify-items-end gap-1">
                        <strong className="text-[15px] font-medium leading-none text-brand">{player.rating}</strong>
                        <em className="text-[12px] not-italic leading-none text-text-secondary">{selectedPlayer?.id === player.id ? "selected" : "rating"}</em>
                      </span>
                    </button>
                  </div>
                ))}
                {query.trim() && !filteredPlayers.length && <div className="rounded-[14px] border-hairline border-line bg-card p-4 text-[15px] text-text-secondary">No unclaimed player profiles found.</div>}
              </div>

              {selectedPlayer && (
                <div className="grid gap-3 rounded-[14px] border-hairline border-[#f0c7a6] bg-[#fff8f1] p-4">
                  <span className="inline-flex w-max items-center rounded-full bg-[#fdf0e8] px-2.5 py-1 text-[13px] font-medium text-[#993c1d]">Profile ownership check</span>
                  <strong className="text-[17px] font-medium text-text-primary">Only continue if this is your player profile.</strong>
                  <em className="text-[14px] not-italic leading-relaxed text-[#8a4a22]">You are about to claim {selectedPlayer.name}. This links the historical rating, city, and tournament record to your login. If this is not you, choose a different profile or create a first-time player profile.</em>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button className="tap-card min-h-10 rounded-[14px] bg-brand px-4 text-xs font-medium text-white" type="button" onClick={() => openClaimConfirmation(selectedPlayer)}>
                      Yes, this is me
                    </button>
                    <button className="tap-card min-h-10 rounded-[14px] border-hairline border-line bg-card px-4 text-xs font-medium text-brand" type="button" onClick={() => setSelectedPlayer(null)}>Cancel</button>
                  </div>
                </div>
              )}

              <div className="grid gap-3 rounded-[18px] border-hairline border-line bg-card p-4">
                <p className="text-[15px] text-text-secondary">New or first time players can create a new MRSA profile.</p>
                <Link className="tap-card inline-flex min-h-11 w-full items-center justify-center rounded-[14px] bg-brand px-4 text-sm font-medium text-white" href={`/profile/new?next=${encodeURIComponent(destinationPath)}`}>First time player</Link>
              </div>
              {claimStatus === "rejected" && rejectionNote && (
                <StatusMessage tone="warning">Admin note: {rejectionNote}</StatusMessage>
              )}
              {message && <StatusMessage tone={claimStatus === "rejected" ? "warning" : "info"}>{message}</StatusMessage>}
            </div>
          </section>
        </main>
        {confirmClaimId && selectedPlayer && (
          <div className="fixed inset-0 z-50 grid place-items-end bg-black/35 px-3 pb-3 pt-16 backdrop-blur-sm sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="claim-confirm-title">
            <section className="grid w-full max-w-[520px] gap-4 rounded-hero border-hairline border-white/80 bg-white/95 p-5 shadow-hero backdrop-blur-xl">
              <div className="grid gap-2">
                <span className="inline-flex w-max items-center rounded-full bg-brand-light px-3 py-1 text-[13px] font-medium text-[#3b6d11]">Confirm profile claim</span>
                <h2 className="text-2xl font-medium leading-tight text-text-primary" id="claim-confirm-title">You are claiming {selectedPlayer.name}.</h2>
                <p className="text-[15px] leading-relaxed text-text-secondary">This links your sign-in to this MRSA player record permanently after admin review. Confirm only if the city, tier, and rating below match you.</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <article className="rounded-card border-hairline border-line bg-card p-3"><span className="text-[12px] text-text-secondary">City</span><strong className="block truncate text-[15px] text-text-primary">{selectedPlayer.city}</strong></article>
                <article className="rounded-card border-hairline border-line bg-card p-3"><span className="text-[12px] text-text-secondary">Tier</span><strong className="block text-[15px] text-text-primary">Tier {selectedPlayer.tier}</strong></article>
                <article className="rounded-card border-hairline border-line bg-card p-3"><span className="text-[12px] text-text-secondary">Rating</span><strong className="block text-[15px] text-text-primary">{selectedPlayer.rating}</strong></article>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <button className="tap-card inline-flex min-h-11 items-center justify-center rounded-card bg-brand px-4 text-sm font-medium text-white" type="button" onClick={() => claimProfile(selectedPlayer)}>Confirm claim</button>
                <button className="tap-card inline-flex min-h-11 items-center justify-center rounded-card border-hairline border-line bg-white px-4 text-sm font-medium text-text-secondary" type="button" onClick={() => setConfirmClaimId(null)}>Cancel</button>
              </div>
            </section>
          </div>
        )}
      </div>
    </AppFrame>
  );
}

export function NewPlayerScreen({ claimPlayerId, nextPath }: { claimPlayerId?: string; nextPath?: string }) {
  const router = useRouter();
  const appSession = useProtectedRoute(normalizeNextPath(nextPath), false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [claimedProfile, setClaimedProfile] = useState<DbProfileRow | null>(null);
  const [shirtSize, setShirtSize] = useState("M");
  const [selfAssessment, setSelfAssessment] = useState(skillLevels[2].value);
  const [jamaatCity, setJamaatCity] = useState("");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const destinationPath = normalizeNextPath(nextPath);
  const existingProfile = claimedProfile || appSession.player;
  const missingFields = getMissingProfileFields(existingProfile);
  const missingSummary = formatMissingFields(missingFields);
  const isCompletingExistingProfile = Boolean(appSession.player && !appSession.profileComplete && !claimPlayerId);

  useEffect(() => {
    if (!appSession.ready || !appSession.userId) return;

    const loadClaimedProfile = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;
      if (!claimPlayerId && !appSession.player?.id) return;

      const user = appSession.user;
      if (!user) {
        router.replace("/");
        return;
      }

      const { data } = await supabase
        .from("players")
        .select("id, auth_user_id, full_name, phone, age, date_of_birth, profile_photo_url, jamaat_city, self_assessment, jersey_size, tennis_video_url, tennis_video_status, claim_status, claim_requested_by")
        .eq("id", claimPlayerId || appSession.player?.id)
        .maybeSingle();
      if (data) {
        const belongsToUser = data.claim_requested_by === user.id || data.auth_user_id === user.id;
        if (!belongsToUser) {
          router.replace("/player-check");
          return;
        }

        setClaimedProfile(data);
        setShirtSize(data.jersey_size || "M");
        setSelfAssessment(normalizeSkillLevel(data.self_assessment) || skillLevels[2].value);
        setJamaatCity(data.jamaat_city || "");
      }
    };

    loadClaimedProfile();
  }, [appSession.player?.id, appSession.ready, appSession.user, appSession.userId, claimPlayerId, router]);

  const createPlayer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      return;
    }

    const user = appSession.user;
    if (!user) {
      router.push("/");
      return;
    }

    setLoading(true);
    setMessage("");
    const selectedJamaatCity = jamaatCity.trim();
    const profilePayload = {
      full_name: String(form.get("fullName") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      date_of_birth: String(form.get("dateOfBirth") || "").trim(),
      jamaat_city: selectedJamaatCity,
      self_assessment: String(form.get("selfAssessment") || "").trim(),
      jersey_size: String(form.get("jerseySize") || "").trim(),
      tennis_video_url: String(form.get("tennisVideo") || "").trim(),
      tennis_video_status: hasPlayerVideoLink(String(form.get("tennisVideo") || "")) ? "pending" : null
    };

    if (!hasRequiredProfileFields(profilePayload)) {
      setLoading(false);
      setMessage(`Please add ${formatMissingFields(getMissingProfileFields(profilePayload))}.`);
      return;
    }

    const file = form.get("profilePhoto") instanceof File ? form.get("profilePhoto") as File : null;
    const photoUrl = file && file.size > 0 ? await uploadCompressedProfilePhoto(user.id, file) : null;
    const savedProfilePayload = {
      ...profilePayload,
      ...(photoUrl ? { profile_photo_url: photoUrl } : {})
    };

    const existingPlayerId = claimPlayerId || appSession.player?.id;
    const error = existingPlayerId
      ? (await supabase
          .from("players")
          .update({
            ...savedProfilePayload,
            auth_user_id: user.id,
            claim_status: claimPlayerId ? "pending" : "claimed",
            ...(claimPlayerId ? { claim_requested_by: user.id } : {})
          })
          .eq("id", existingPlayerId)
          .or(`claim_requested_by.eq.${user.id},auth_user_id.eq.${user.id}`)).error
      : await createNewPlayerProfile(supabase, user.id, savedProfilePayload);

    setLoading(false);

    if (error) {
      setMessage(getFriendlyError(error));
      return;
    }

    await appSession.refresh();
    router.push(destinationPath);
  };

  if (!appSession.ready || !appSession.userId) return null;

  return (
    <AppFrame withNav={false}>
      <div className="min-h-dvh bg-page font-sans text-text-primary">
        <header className="border-b-hairline border-surface bg-white/95 px-4 py-3">
          <div className="mx-auto flex w-full max-w-shell items-center justify-center">
            <Link className="inline-flex" href="/" aria-label="MRSA home">
              <BrandMark />
            </Link>
          </div>
        </header>

        <main className="mx-auto grid w-full max-w-shell gap-5 px-4 py-5 pb-10 md:px-6 lg:px-8">
          <section className="relative grid min-h-[220px] overflow-hidden rounded-[22px] bg-brand p-5 text-white md:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] md:items-center md:gap-8 lg:p-6">
            <div className="pointer-events-none absolute inset-0 -right-16 -top-6 text-white opacity-[0.06]" aria-hidden="true">
              <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="relative grid gap-3">
              <OnboardingStep step={3} total={3} label={claimPlayerId ? "Complete claim" : "Create profile"} />
              <h1 className="max-w-[640px] text-3xl font-medium leading-[1.08] tracking-[-0.4px] text-white">{isCompletingExistingProfile ? "Complete your profile." : claimPlayerId ? "Complete your profile." : "New MRSA player."}</h1>
              <p className="max-w-[560px] text-sm leading-relaxed text-white/65">{isCompletingExistingProfile && missingSummary ? `Please add ${missingSummary} before continuing.` : claimPlayerId ? "Add the required details so admin can review your profile claim and connect your history." : `Create your profile once. New players start at Tier ${startingTennisTier} with a ${startingTennisRating.toFixed(3)} rating.`}</p>
            </div>
            <div className="relative mt-4 grid gap-2 rounded-[18px] border-hairline border-white/10 bg-white/[0.08] p-4 md:mt-0">
              <span className="text-[13px] text-white/60">{isCompletingExistingProfile ? "Missing required fields" : claimPlayerId ? "Claimed profile" : "Assigned after signup"}</span>
              <strong className="text-[20px] font-medium text-white">{isCompletingExistingProfile && missingSummary ? missingSummary : claimPlayerId ? "Existing tier and rating kept" : `Tier ${startingTennisTier} · Rating ${startingTennisRating.toFixed(3)}`}</strong>
              <em className="text-[14px] not-italic text-white/60">{isCompletingExistingProfile ? "Your profile is saved after these are added." : claimPlayerId ? "Admin can approve or reject this claim." : "0 tournaments played · 0 matches played"}</em>
            </div>
          </section>

          <form className="grid gap-4" onSubmit={createPlayer}>
            {missingFields.length > 0 && (
              <section className="grid gap-2 rounded-[18px] border-hairline border-[#f2dccb] bg-[#fff8f1] p-4">
                <strong className="text-[17px] font-medium text-[#8a4a22]">Please add {missingSummary}.</strong>
                <em className="text-[14px] not-italic leading-relaxed text-[#8a4a22]/80">We need this before you can continue to tournaments and registration.</em>
              </section>
            )}
            <section className="grid gap-3 rounded-[18px] border-hairline border-line bg-card p-4 md:grid-cols-2 md:p-5">
              <label className="grid gap-2 text-[13px] text-text-secondary">
                Full name
                <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="fullName" type="text" placeholder="Full name" defaultValue={claimedProfile?.full_name || ""} required />
              </label>
              <label className="grid gap-2 text-[13px] text-text-secondary">
                Phone number
                <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="phone" type="tel" placeholder="9999999999" defaultValue={claimedProfile?.phone || ""} required />
              </label>
              <label className="grid gap-2 text-[13px] text-text-secondary">
                Date of birth
                <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="dateOfBirth" type="date" max={getTodayDateInputValue()} defaultValue={existingProfile?.date_of_birth || ""} required />
              </label>
              <label className="grid gap-2 text-[13px] text-text-secondary">
                Jamaat / city
                <JamaatCityCombobox value={jamaatCity} onChange={setJamaatCity} />
              </label>
              <label className="grid gap-2 text-[13px] text-text-secondary">
                Self evaluation
                <select className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-light" name="selfAssessment" value={selfAssessment} onChange={(event) => setSelfAssessment(event.target.value)}>
                  {skillLevels.map((level) => (
                    <option value={level.value} key={level.value}>{level.value}</option>
                  ))}
                </select>
                <em className="text-[13px] not-italic leading-relaxed text-text-secondary">{getSkillLevelLabel(selfAssessment)}</em>
              </label>
              <label className="grid gap-2 text-[13px] text-text-secondary">
                <span className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  Shirt size
                  <button className="text-[13px] font-medium text-brand" type="button" onClick={() => setSizeGuideOpen(true)}>Size guide</button>
                </span>
                <select className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-light" name="jerseySize" value={shirtSize} onChange={(event) => setShirtSize(event.target.value)}>
                  {["YXS", "YS", "YM", "YL", "YXL", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"].map((size) => (
                    <option key={size}>{size}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-[13px] text-text-secondary">
                Profile photo optional
                <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 py-2 text-[15px] text-text-primary file:mr-3 file:rounded-full file:border-0 file:bg-brand-light file:px-3 file:py-1 file:text-[15px] file:font-medium file:text-[#3b6d11]" name="profilePhoto" type="file" accept="image/*" />
              </label>
              <label className="grid gap-2 text-[13px] text-text-secondary md:col-span-2">
                Google Drive playing video recommended for draft placement
                <em className="text-[13px] not-italic leading-relaxed text-text-secondary">{videoDescription}</em>
                <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="tennisVideo" type="text" inputMode="url" placeholder="https://drive.google.com/..." defaultValue={claimedProfile?.tennis_video_url || ""} />
              </label>
            </section>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              {message && <StatusMessage tone={message.startsWith("Please") ? "warning" : "error"}>{message}</StatusMessage>}
              <button className="tap-card inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-brand px-5 text-sm font-medium text-white disabled:opacity-60 md:w-max" type="submit" disabled={loading}>
                <CheckCircle2 size={16} />
                {loading ? "Saving..." : "Continue"}
              </button>
            </div>
          </form>
        </main>
        {sizeGuideOpen && <SizeGuideModal selectedSize={shirtSize} onSelect={setShirtSize} onClose={() => setSizeGuideOpen(false)} />}
      </div>
    </AppFrame>
  );
}

function JamaatCityCombobox({
  value,
  onChange,
  triggerRef
}: {
  value: string;
  onChange: (city: string) => void;
  triggerRef?: React.Ref<HTMLButtonElement>;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"preset" | "other">(value && !jamaatCityOptions.includes(value) ? "other" : "preset");
  const [customCity, setCustomCity] = useState(value && !jamaatCityOptions.includes(value) ? value : "");
  const filteredCities = jamaatCityOptions.filter((city) => city.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    if (value && jamaatCityOptions.includes(value)) {
      setMode("preset");
      setCustomCity("");
      return;
    }

    if (value && !jamaatCityOptions.includes(value)) {
      setMode("other");
      setCustomCity(value);
    }
  }, [value]);

  const selectCity = (city: string) => {
    setMode("preset");
    setCustomCity("");
    setQuery("");
    setOpen(false);
    onChange(city);
  };

  const selectOther = () => {
    setMode("other");
    setCustomCity("");
    setQuery("");
    setOpen(false);
    onChange("");
  };

  const updateCustomCity = (city: string) => {
    setCustomCity(city);
    onChange(city);
  };

  return (
    <div
      className="relative grid gap-2"
      onBlur={(event) => {
        const nextFocus = event.relatedTarget;
        if (!(nextFocus instanceof Node) || !event.currentTarget.contains(nextFocus)) {
          setOpen(false);
        }
      }}
    >
      <input name="jamaatCity" type="hidden" value={value} />
      <button
        ref={triggerRef}
        className={`grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-[14px] !border-hairline !border-line bg-white px-3 text-left text-[16px] outline-none transition hover:!border-line-strong focus:!border-brand focus:ring-2 focus:ring-brand-light ${value ? "!text-text-primary" : "!text-text-muted"}`}
        style={{ border: "0.5px solid var(--color-border)" }}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="truncate">{mode === "other" ? customCity || "Other" : value || "Select Jamaat / City"}</span>
        <ChevronDown className={`shrink-0 transition ${open ? "rotate-180" : ""}`} size={16} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[80] grid gap-2 rounded-[14px] border-hairline border-line bg-white p-3 shadow-[0_18px_50px_rgba(12,59,32,0.12)]">
          <input
            className="min-h-10 rounded-[12px] border-hairline border-line bg-white px-3 text-[15px] text-text-primary outline-none placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search city"
            aria-label="Search Jamaat city"
            autoComplete="off"
            autoFocus
          />
          <div className="grid max-h-44 gap-1 overflow-y-auto pr-1" role="listbox" aria-label="Jamaat city options">
            {filteredCities.map((city) => (
              <button
                className={`rounded-[10px] px-3 py-2 text-left text-[15px] transition ${value === city ? "bg-brand !text-white" : "!text-text-primary hover:bg-brand-light"}`}
                type="button"
                role="option"
                aria-selected={value === city}
                key={city}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectCity(city)}
              >
                {city}
              </button>
            ))}
	            {!filteredCities.length && <em className="px-3 py-2 text-[14px] not-italic text-text-secondary">No city matches. Choose Other to type it in.</em>}
            <button
              className={`rounded-[10px] px-3 py-2 text-left text-[15px] transition ${mode === "other" ? "bg-brand !text-white" : "!text-text-primary hover:bg-brand-light"}`}
              type="button"
              role="option"
              aria-selected={mode === "other"}
              onMouseDown={(event) => event.preventDefault()}
              onClick={selectOther}
            >
	              Other
            </button>
          </div>
        </div>
      )}

      {mode === "other" && (
        <input
          className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light"
          type="text"
          value={customCity}
          onChange={(event) => updateCustomCity(event.target.value)}
          placeholder="Enter Jamaat / City"
          required
        />
      )}
    </div>
  );
}

function SizeGuideModal({
  selectedSize,
  onSelect,
  onClose
}: {
  selectedSize: string;
  onSelect: (size: string) => void;
  onClose: () => void;
}) {
  const sizes = ["YXS", "YS", "YM", "YL", "YXL", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];

  return (
    <div className="fixed inset-0 z-[100] grid place-items-end bg-black/35 p-3 backdrop-blur-sm sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Shirt size guide" onClick={onClose}>
      <div className="w-full max-w-[520px] overflow-hidden rounded-[24px] border-hairline border-line bg-white shadow-[0_24px_80px_rgba(12,59,32,0.18)]" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 border-b-hairline border-line px-4 py-4">
          <div>
            <span className="text-[13px] text-text-secondary">Size guide</span>
            <strong className="block text-[20px] font-medium text-text-primary">Select shirt size</strong>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-full border-hairline border-line bg-white text-text-secondary" type="button" onClick={onClose} aria-label="Close size guide">
            <X size={16} />
          </button>
        </div>

        <div className="mx-4 mt-4 aspect-[16/10] rounded-[18px] border-hairline border-line bg-surface bg-[url('/images/size-guide.jpeg')] bg-contain bg-center bg-no-repeat" role="img" aria-label="MRSA shirt and short size chart" />

        <div className="grid grid-cols-4 gap-2 p-4 sm:grid-cols-7" aria-label="Select shirt size">
          {sizes.map((size) => (
            <button className={`min-h-10 rounded-[12px] border-hairline px-3 text-[15px] font-medium transition ${selectedSize === size ? "border-brand bg-brand text-white" : "border-line bg-white text-text-primary hover:border-brand"}`} type="button" key={size} onClick={() => onSelect(size)}>
              {size}
            </button>
          ))}
        </div>

        <div className="border-t-hairline border-line p-4">
          <button className="tap-card inline-flex min-h-11 w-full items-center justify-center rounded-[14px] bg-brand px-5 text-sm font-medium text-white" type="button" onClick={onClose}>Use {selectedSize}</button>
        </div>
      </div>
    </div>
  );
}

async function createNewPlayerProfile(
  supabase: NonNullable<ReturnType<typeof getSupabaseClient>>,
  userId: string,
	  profilePayload: {
	    full_name: string;
	    phone: string;
	    date_of_birth: string;
	    jamaat_city: string;
    self_assessment: string;
    jersey_size: string;
    tennis_video_url: string;
    tennis_video_status?: string | null;
    profile_photo_url?: string;
  }
) {
  const sportId = await getTennisSportId();
  if (!sportId) {
    return { message: "Tennis sport row was not found." };
  }

  const { error } = await supabase.from("players").insert({
    sport_id: sportId,
    auth_user_id: userId,
    ...profilePayload,
    tier: startingTennisTier,
    rating: startingTennisRating,
    rating_provisional: true,
    tournaments_played: 0,
    matches_played: 0,
    claim_status: "claimed",
    claimed_at: new Date().toISOString()
  });

  return error;
}

export function HomeScreen() {
  const appSession = useProtectedRoute("/dashboard", true);
  const [upcomingTournament, setUpcomingTournament] = useState<Tournament | null>(null);
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);
  const [hasRegisteredTournament, setHasRegisteredTournament] = useState(false);
  const [needsVideoLink, setNeedsVideoLink] = useState(false);
  const [dashboardVideoLink, setDashboardVideoLink] = useState("");
  const [dashboardVideoMessage, setDashboardVideoMessage] = useState("");
  const [savingDashboardVideo, setSavingDashboardVideo] = useState(false);

  useEffect(() => {
    if (!appSession.ready || !appSession.userId) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const loadDashboard = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [{ data: tournamentData }, { data: profileData }, { data: playersData }] = await Promise.all([
        supabase
          .from("tournaments")
          .select("id, name, season_year, status, venue_name, venue_address, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents, max_players")
          .gte("starts_on", today)
	          .in("status", ["registration_open", "registration_closed", "live"])
          .order("starts_on")
          .limit(1)
          .maybeSingle(),
        appSession.userId
          ? supabase
              .from("players")
              .select("id, full_name, profile_photo_url, tennis_video_url, tennis_video_status")
              .eq("auth_user_id", appSession.userId)
              .maybeSingle()
          : Promise.resolve({ data: null }),
        supabase
          .from("players")
          .select("id, full_name, jamaat_city, profile_photo_url, rating")
          .order("rating", { ascending: false, nullsFirst: false })
          .order("full_name")
          .limit(20)
      ]);

      setUpcomingTournament(tournamentData ? mapTournament(tournamentData) : null);
      setTopPlayers((playersData || [])
        .filter((row) => !/^test/i.test((row.full_name || "").trim()))
        .slice(0, 5)
        .map((row) => ({
          id: row.id,
          name: row.full_name || "Player",
          rating: formatRating(row.rating),
          city: row.jamaat_city || "City not added",
          profilePhotoUrl: row.profile_photo_url || ""
        })));
      setHasRegisteredTournament(false);
      if (profileData) {
        setNeedsVideoLink(false);
        setDashboardVideoLink(hasPlayerVideoLink(profileData.tennis_video_url) ? profileData.tennis_video_url || "" : "");
      }
      if (profileData && tournamentData) {
        const { data: registration } = await supabase
          .from("tournament_registrations")
          .select("id")
          .eq("tournament_id", tournamentData.id)
          .eq("player_id", profileData.id)
          .in("payment_status", ["paid", "waived"])
          .maybeSingle();

        setHasRegisteredTournament(Boolean(registration));
        setNeedsVideoLink(Boolean(registration) && needsPlayerVideoUpload(profileData.tennis_video_url, profileData.tennis_video_status));
      }
    };

    loadDashboard();

    const channel = supabase
      .channel("dashboard-live-data")
      .on("postgres_changes", { event: "*", schema: "public", table: "tournaments" }, loadDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_registrations" }, loadDashboard)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [appSession.ready, appSession.userId]);

  const saveDashboardVideoLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase || !appSession.player?.id) return;

    const trimmedLink = dashboardVideoLink.trim();
    if (!trimmedLink) {
      setDashboardVideoMessage("Please add your Google Drive video link.");
      return;
    }

    setSavingDashboardVideo(true);
    setDashboardVideoMessage("");
    const { error } = await supabase
      .from("players")
      .update({
        tennis_video_url: trimmedLink,
        tennis_video_status: "pending",
        tennis_video_reviewed_at: null,
        tennis_video_reviewed_by: null,
        tennis_video_rejection_note: null
      })
      .eq("id", appSession.player.id);
    setSavingDashboardVideo(false);

    if (error) {
      setDashboardVideoMessage(getFriendlyError(error));
      return;
    }

    setNeedsVideoLink(false);
    setDashboardVideoMessage("Video link saved.");
    await appSession.refresh();
  };

  if (!appSession.ready || !appSession.userId || !appSession.profileComplete) return null;

  return (
    <AppFrame active="home">
      <div className="min-h-dvh bg-[radial-gradient(circle_at_18%_0%,rgba(234,243,222,0.95)_0,transparent_32%),radial-gradient(circle_at_88%_14%,rgba(230,241,251,0.9)_0,transparent_30%),linear-gradient(180deg,#ffffff_0%,#fbfbf8_46%,#f7fbf1_100%)] pb-28 font-sans text-text-primary">
        <AppTopBar />

        <main className="mx-auto grid w-full max-w-shell gap-4 px-4 py-5 pb-32 md:px-6 lg:px-8">
          {needsVideoLink && (
            <form className="grid gap-3 rounded-[18px] border-hairline border-[#f2dccb] bg-[#fff8f1] p-4 md:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] md:items-end md:p-5" onSubmit={saveDashboardVideoLink}>
              <span className="grid gap-1">
                <strong className="text-[17px] font-medium text-[#8a4a22]">Upload your tennis video link</strong>
                <em className="text-[14px] not-italic leading-relaxed text-[#8a4a22]/80">Captains and organizers use your Google Drive video to draft teams. If it is not uploaded, you may not be drafted.</em>
                {dashboardVideoMessage && <b className="text-[13px] font-medium text-[#8a4a22]">{dashboardVideoMessage}</b>}
              </span>
              <span className="grid gap-2">
                <label className="grid gap-1 text-[12px] text-[#8a4a22]" htmlFor="dashboard-video-link">
                  Google Drive video link
                  <input className="min-h-10 rounded-[12px] border-hairline border-[#f2dccb] bg-white px-3 text-[15px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" id="dashboard-video-link" value={dashboardVideoLink} onChange={(event) => setDashboardVideoLink(event.target.value)} placeholder="https://drive.google.com/..." inputMode="url" />
                </label>
                <button className="tap-card inline-flex min-h-10 items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] px-4 text-xs font-medium text-white shadow-[0_12px_26px_rgba(12,59,32,0.18)] disabled:opacity-60" type="submit" disabled={savingDashboardVideo}>
                  {savingDashboardVideo ? "Saving..." : "Submit video link"}
                </button>
              </span>
            </form>
          )}
          <section className="relative grid min-h-[220px] overflow-hidden rounded-[24px] border-hairline border-white/20 bg-[radial-gradient(circle_at_82%_18%,rgba(76,222,140,0.22)_0,transparent_28%),linear-gradient(135deg,#0c3b20_0%,#14572f_52%,#1a6e3c_100%)] p-5 text-white shadow-[0_24px_70px_rgba(12,59,32,0.22)] md:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] md:items-center md:gap-x-8 lg:p-6">
            <div className="pointer-events-none absolute inset-0 -right-16 -top-6 text-white opacity-[0.06]" aria-hidden="true">
              <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="relative grid gap-3 md:self-center">
              <span className="text-[13px] text-white/60">Upcoming tournament</span>
              <h1 className="max-w-[680px] text-2xl font-medium leading-[1.12] tracking-[-0.4px] text-white">{upcomingTournament?.name || "Mumineen Racquet Sports Association"}</h1>
              <p className="max-w-[680px] text-[16px] font-medium text-white/75">{upcomingTournament ? formatTournamentDates(upcomingTournament) : "No upcoming tournament"}</p>
              {upcomingTournament && <p className="max-w-[680px] text-[13px] text-white/55">{upcomingTournament.venueName || "Venue TBD"}</p>}
            </div>
            <div className="relative mt-5 grid gap-4 rounded-[20px] border-hairline border-white/20 bg-white/[0.13] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl md:mt-0">
              {upcomingTournament?.status === "registration_open" && (
                <span className="inline-flex w-max items-center gap-2 rounded-full bg-white/12 px-2.5 py-1 text-[13px] text-white/85"><span className="h-[7px] w-[7px] animate-pulse rounded-full bg-accent-green" />Registration open</span>
              )}
              <HomeRegistrationCountdown closesAt={upcomingTournament?.registrationClosesAt || null} />
              <span className="text-center text-xs font-medium text-white/80">
                {upcomingTournament ? hasRegisteredTournament ? "Registered" : "Register now" : "View"}
              </span>
              <Link className="tap-card inline-flex min-h-11 w-full items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#ffffff,#d6f241)] px-4 text-sm font-medium text-[#072912] shadow-[0_16px_34px_rgba(214,242,65,0.28)] ring-1 ring-white/70" href="/tournaments">
                View details →
              </Link>
            </div>
          </section>

          <section className="grid gap-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <span className="grid gap-1">
                <strong className="text-[16px] font-medium leading-tight text-text-primary">Top performers</strong>
                <em className="text-[14px] not-italic leading-relaxed text-text-secondary">Current MRSA leaderboard.</em>
              </span>
              <Link className="tap-card inline-flex items-center justify-self-end gap-1 rounded-full bg-brand-light px-3 py-1.5 text-[13px] font-medium text-[#3b6d11]" href="/players">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid gap-2">
              {topPlayers.map((player, index) => (
                <article className="grid min-h-[62px] grid-cols-[24px_38px_minmax(0,1fr)_auto] items-center gap-3 rounded-[14px] border-hairline border-line bg-white/84 p-3 shadow-[0_8px_24px_rgba(24,24,26,0.05)] backdrop-blur" key={player.id}>
                  <span className={index < 3 ? "text-center text-[14px] font-medium text-[#b8860b]" : "text-center text-[14px] font-medium text-text-muted"}>{index + 1}</span>
                  <Avatar className={index % 5 === 0 ? "relative grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-[#fde9dc] text-[12px] font-medium text-[#a94d24]" : index % 5 === 1 ? "relative grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-[#e5f1ff] text-[12px] font-medium text-[#185fa5]" : index % 5 === 2 ? "relative grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-[#eaf3de] text-[12px] font-medium text-[#3b6d11]" : index % 5 === 3 ? "relative grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-[#fbe7ef] text-[12px] font-medium text-[#aa3f6b]" : "relative grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-[#f1efe8] text-[12px] font-medium text-[#5f5e5a]"} name={player.name} photoUrl={player.profilePhotoUrl} ariaLabel={`${player.name} profile photo`} />
                  <span className="grid min-w-0 gap-1">
                    <strong className="truncate text-[15px] font-medium leading-tight text-text-primary">{player.name}</strong>
                    <em className="truncate text-[13px] not-italic leading-tight text-text-secondary">{player.city}</em>
                  </span>
                  <strong className="rounded-full bg-brand-light px-2.5 py-1 text-[13px] font-medium text-[#3b6d11]">{player.rating}</strong>
                </article>
              ))}
              {!topPlayers.length && <div className="rounded-[14px] border-hairline border-line bg-card p-4 text-[15px] text-text-secondary">Top performers will appear here.</div>}
            </div>
            <Link className="tap-card mt-2 grid gap-3 rounded-[18px] border-hairline border-line bg-card p-4 transition hover:border-line-strong md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-5" href="/about">
              <span className="grid gap-2">
                <span className="text-[13px] text-text-secondary">What is MRSA?</span>
                <strong className="text-lg font-medium leading-tight text-brand">Mumineen Racquet Sports Association</strong>
                <em className="text-[15px] not-italic leading-relaxed text-text-secondary">A North America-wide community bringing together women through a shared passion for racquet sports — tennis, TT, badminton, and pickleball.</em>
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] text-white shadow-[0_12px_24px_rgba(12,59,32,0.18)]" aria-hidden="true">
                <ArrowRight size={18} />
              </span>
            </Link>
          </section>
        </main>
      </div>
    </AppFrame>
  );
}

export function DrawScreen() {
  const router = useRouter();
  const appSession = useProtectedRoute("/tournaments", true);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registeredPlayers, setRegisteredPlayers] = useState<RegisteredPlayer[]>([]);
  const [pastTournaments, setPastTournaments] = useState<PastTournamentSummary[]>([]);
  const [registered, setRegistered] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [paying, setPaying] = useState(false);
  const [reconcilingPayment, setReconcilingPayment] = useState(false);
  const [showVideoPrompt, setShowVideoPrompt] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [videoPromptMessage, setVideoPromptMessage] = useState("");
  const [savingVideoLink, setSavingVideoLink] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTournament = useCallback(async () => {
    if (!appSession.ready || !appSession.userId) return;

    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      setLoading(false);
      return;
    }

    const [{ data: tournamentData, error }, { data: historicalMatches, error: historicalError }] = await Promise.all([
      supabase
      .from("tournaments")
      .select("id, name, season_year, status, venue_name, venue_address, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents, max_players")
	      .in("status", ["registration_open", "registration_closed", "live"])
      .order("starts_on", { ascending: false })
      .limit(1)
        .maybeSingle(),
      supabase
        .from("matches")
        .select("season_year, format")
        .not("season_year", "is", null)
    ]);

    if (error || historicalError) {
      setMessage(getFriendlyError(error || historicalError));
      setLoading(false);
      return;
    }

    setPastTournaments(buildPastTournamentSummaries(historicalMatches || []));

    if (!tournamentData) {
      setTournament(null);
      setRegisteredPlayers([]);
      setLoading(false);
      return;
    }

    const mappedTournament = mapTournament(tournamentData);
    setTournament(mappedTournament);

    const { data: registrations } = await supabase
      .from("tournament_registrations")
      .select("player_id, players(id, full_name, jamaat_city, rating)")
      .eq("tournament_id", mappedTournament.id)
      .neq("status", "cancelled")
      .in("payment_status", ["paid", "waived"])
      .order("registered_at");

    setRegisteredPlayers((registrations || []).map((row) => {
      const player = Array.isArray(row.players) ? row.players[0] : row.players;
      return {
        id: row.player_id,
        name: player?.full_name || "Player",
        city: player?.jamaat_city || "MRSA",
        rating: formatRating(player?.rating)
      };
    }));

    if (appSession.player?.id) {
      const myPlayer = { id: appSession.player.id };
      const paidRegistration = Boolean(myPlayer && registrations?.some((row) => row.player_id === myPlayer.id));
      setRegistered(paidRegistration);
      setPaymentState(paidRegistration ? "paid" : "idle");

      if (myPlayer && !paidRegistration) {
        const { data: latestPayment } = await supabase
          .from("payment_ledger")
          .select("status, stripe_failure_message")
          .eq("tournament_id", mappedTournament.id)
          .eq("player_id", myPlayer.id)
          .eq("entry_type", "charge")
          .order("occurred_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestPayment?.status === "pending" || latestPayment?.status === "failed") {
          setPaymentState(latestPayment.status);
          if (latestPayment.status === "failed" && latestPayment.stripe_failure_message) {
            setMessage(latestPayment.stripe_failure_message);
          }
        }
      }
    }
    setLoading(false);
  }, [appSession.player?.id, appSession.ready, appSession.userId]);

  useEffect(() => {
    if (!appSession.ready || !appSession.userId) return;

    const supabase = getSupabaseClient();
    const paymentResult = new URLSearchParams(window.location.search).get("payment");
    const checkoutSessionId = new URLSearchParams(window.location.search).get("session_id");

    const reconcileReturnedPayment = async () => {
      if (!supabase || !checkoutSessionId || !paymentResult) return;
      setReconcilingPayment(true);
      setMessage(paymentResult === "success" ? "Confirming payment..." : "Checking payment status...");

      const { data: session } = await supabase.auth.getSession();
      const response = await fetch(`/api/stripe/checkout-status?session_id=${encodeURIComponent(checkoutSessionId)}&payment=${encodeURIComponent(paymentResult)}`, {
        headers: {
          Authorization: `Bearer ${session.session?.access_token || ""}`
        }
      });
      const result = await response.json();
      setReconcilingPayment(false);

      if (!response.ok) {
        setPaymentState("failed");
        setMessage(result.error || "Could not verify payment status. Please retry registration.");
        return;
      }

      if (result.registered || result.status === "paid") {
        setRegistered(true);
        setPaymentState("paid");
        setMessage("Payment received. You are registered.");
        await loadTournament();
        window.history.replaceState(null, "", "/tournaments");
        return;
      }

      if (result.status === "failed") {
        setPaymentState("failed");
        setMessage(result.error || "Payment was not completed. You can retry registration.");
        await loadTournament();
        window.history.replaceState(null, "", "/tournaments");
        return;
      }

      setPaymentState("pending");
      setMessage("Payment is still pending. Please wait while Stripe confirms it.");
    };

    reconcileReturnedPayment();
    loadTournament();
    if (!supabase) return;

    const channel = supabase
      .channel("tournaments-live-data")
      .on("postgres_changes", { event: "*", schema: "public", table: "tournaments" }, loadTournament)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_registrations" }, loadTournament)
      .on("postgres_changes", { event: "*", schema: "public", table: "matches" }, loadTournament)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [appSession.ready, appSession.userId, appSession.player?.id, loadTournament]);

  const continueRegistrationCheckout = async () => {
    const supabase = getSupabaseClient();
    if (!supabase || !tournament) return;

    if (!appSession.user) {
      router.push("/");
      return;
    }

    const player = appSession.player?.id ? { id: appSession.player.id } : null;

    if (!player) {
      router.push(buildProfileCompletionPath(undefined, "/tournaments"));
      return;
    }

    setPaying(true);
    setMessage("");

    const { data: session } = await supabase.auth.getSession();
    const response = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.session?.access_token || ""}`
      },
      body: JSON.stringify({ tournamentId: tournament.id })
    });

    const checkout = await response.json();
    setPaying(false);

    if (!response.ok) {
      setPaymentState("failed");
      setMessage(checkout.error || "Payment could not be started. Please try again.");
      return;
    }

    if (checkout.registered) {
      setRegistered(true);
      setPaymentState("paid");
      await loadTournament();
      return;
    }

    if (checkout.url) {
      window.location.href = checkout.url;
    }
  };

  const registerForTournament = async () => {
    if (needsPlayerVideoUpload(appSession.player?.tennis_video_url, appSession.player?.tennis_video_status)) {
      setVideoLink(hasPlayerVideoLink(videoLink) ? videoLink : "");
      setVideoPromptMessage("");
      setShowVideoPrompt(true);
      return;
    }

    await continueRegistrationCheckout();
  };

  const saveVideoLinkAndContinue = async () => {
    const supabase = getSupabaseClient();
    if (!supabase || !appSession.player?.id) return;

    const trimmedLink = videoLink.trim();
    if (!trimmedLink) {
      setVideoPromptMessage("Add a Google Drive video link or choose skip for now.");
      return;
    }

    setSavingVideoLink(true);
    setMessage("");
    setVideoPromptMessage("");
    const { error } = await supabase
      .from("players")
      .update({
        tennis_video_url: trimmedLink,
        tennis_video_status: "pending",
        tennis_video_reviewed_at: null,
        tennis_video_reviewed_by: null,
        tennis_video_rejection_note: null
      })
      .eq("id", appSession.player.id);
    setSavingVideoLink(false);

    if (error) {
      setVideoPromptMessage(getFriendlyError(error));
      return;
    }

    setShowVideoPrompt(false);
    await appSession.refresh();
    await continueRegistrationCheckout();
  };

  const skipVideoLinkAndContinue = async () => {
    setShowVideoPrompt(false);
    await continueRegistrationCheckout();
  };

	  if (!appSession.ready || !appSession.userId || !appSession.profileComplete) return null;
	  const paymentPending = paymentState === "pending";
	  const registrationOpen = tournament?.status === "registration_open";

  return (
    <AppFrame active="tournament">
      <div className="min-h-dvh bg-[radial-gradient(circle_at_18%_0%,rgba(234,243,222,0.95)_0,transparent_32%),radial-gradient(circle_at_88%_14%,rgba(230,241,251,0.9)_0,transparent_30%),linear-gradient(180deg,#ffffff_0%,#fbfbf8_46%,#f7fbf1_100%)] pb-28 font-sans text-text-primary">
        <AppTopBar />
        <main className="mx-auto grid w-full max-w-shell gap-4 px-4 py-5 pb-32 md:px-6 lg:px-8">
          {loading && !tournament ? (
            <SkeletonHero />
          ) : (
          <header className="relative grid min-h-[260px] overflow-hidden rounded-hero border-hairline border-white/20 bg-[radial-gradient(circle_at_80%_22%,rgba(214,242,65,0.22)_0,transparent_28%),radial-gradient(circle_at_18%_0%,rgba(76,222,140,0.18)_0,transparent_30%),linear-gradient(135deg,#0c3b20_0%,#14572f_52%,#1a6e3c_100%)] p-5 text-white shadow-hero md:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] md:items-center md:gap-x-8 lg:p-6">
            <div className="pointer-events-none absolute inset-0 -right-16 -top-6 text-white opacity-[0.06]" aria-hidden="true">
              <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="relative grid gap-3 md:self-center">
              {tournament?.status === "registration_open" && (
                <span className="inline-flex w-max items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-[13px] text-white/85"><span className="h-[7px] w-[7px] animate-pulse rounded-full bg-accent-green" />Registration live</span>
              )}
              <span className="text-[13px] text-white/60">{tournament ? "Tournament" : "Tournament"}</span>
              <h1 className="max-w-[680px] text-2xl font-medium leading-[1.12] tracking-[-0.4px] text-white">{tournament ? tournament.name : "No live tournament"}</h1>
              <p className="max-w-[680px] text-[18px] font-medium text-white/78">{tournament ? formatTournamentDates(tournament) : "No live tournament is open right now."}</p>
              {tournament && (
                <div className="grid gap-2 pt-2 sm:grid-cols-2">
                  <span className="rounded-card border-hairline border-white/10 bg-white/10 p-3 backdrop-blur"><b className="block text-[12px] font-normal text-white/55">Venue</b><strong className="block truncate text-[14px] font-medium text-white">{tournament.venueName || "Venue TBD"}</strong></span>
                  <span className="rounded-card border-hairline border-white/10 bg-white/10 p-3 backdrop-blur"><b className="block text-[12px] font-normal text-white/55">Fee</b><strong className="block text-[14px] font-medium text-white">{formatCurrency(tournament.registrationFeeCents)}</strong></span>
                  <a className="tap-card inline-flex min-h-10 items-center justify-center gap-1.5 rounded-card border-hairline border-white/15 bg-white/12 px-3 text-[14px] font-medium text-white backdrop-blur sm:col-span-2 sm:w-max" href={tournament.venueMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tournament.venueAddress || tournament.venueName || "")}`} target="_blank" rel="noreferrer">
                    <MapPin size={14} />
                    Open venue in Maps
                  </a>
                </div>
              )}
            </div>
            {tournament && (
              <div className="relative mt-5 grid gap-4 rounded-[20px] border-hairline border-white/20 bg-white/[0.13] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl md:mt-0">
                <p className="text-[14px] leading-relaxed text-white/70">
	                  {registered ? "You are registered for this tournament." : paymentPending ? "Stripe is confirming this payment. Please do not retry yet." : registrationOpen ? `Upload your video, pay ${formatCurrency(tournament.registrationFeeCents)}, and confirm your spot.` : "Registration is closed. Tournament details and registered players remain available here."}
                </p>
                {registered ? (
                  <div className="grid gap-2">
                    <article className="rounded-card border-hairline border-white/10 bg-white/10 px-3 py-2.5 text-white" aria-label="Tournament date">
                      <span className="text-[12px] text-current opacity-60">Tournament date</span>
                      <strong className="block text-[20px] font-medium leading-tight text-current">{formatTournamentDates(tournament)}</strong>
                    </article>
                    <RegistrationCountdown closesAt={tournament.registrationClosesAt} compact />
                  </div>
                ) : (
                  <RegistrationCountdown closesAt={tournament.registrationClosesAt} daysOnly />
                )}
	                <button className={registered ? "tap-card inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,#ffffff,#d6f241)] px-4 text-sm font-medium text-[#072912] shadow-[0_16px_34px_rgba(214,242,65,0.28)] ring-1 ring-white/70 disabled:opacity-100" : "tap-card inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,#ffffff,#d6f241)] px-4 text-sm font-medium text-[#072912] shadow-[0_16px_34px_rgba(214,242,65,0.28)] ring-1 ring-white/70 disabled:opacity-70"} type="button" onClick={registerForTournament} disabled={paying || registered || paymentPending || !registrationOpen}>
	                  {registered && <CheckCircle2 size={16} />}
	                  {getRegistrationButtonLabel({ registered, paying: paying || reconcilingPayment, paymentState, registrationOpen })}
	                  {!registered && !paymentPending && registrationOpen && " →"}
                </button>
                {paymentPending && <p className="text-[13px] leading-relaxed text-white/58">Checking payment. Do not start another payment until this updates.</p>}
              </div>
            )}
          </header>
          )}

        <section className="grid gap-4">
          {!tournament && (
            <StatusMessage tone="info">No live tournament found.</StatusMessage>
          )}

          <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 pt-2">
            <h2 className="text-[15px] font-medium text-text-primary">Registered players</h2>
            {registeredPlayers.length > 10 ? (
              <Link className="tap-card justify-self-end whitespace-nowrap text-[14px] font-medium text-brand" href="/tournaments/players">View all →</Link>
            ) : (
              <span className="text-[13px] text-text-secondary">{registeredPlayers.length} players</span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {registeredPlayers.slice(0, 10).map((player, index) => (
              <article className="grid min-h-[60px] grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-3 rounded-[14px] border-hairline border-line bg-card px-3 py-3" key={player.name}>
                <span className={index % 5 === 0 ? "grid h-[34px] w-[34px] place-items-center rounded-full bg-[#fde9dc] text-[13px] font-medium text-[#a94d24]" : index % 5 === 1 ? "grid h-[34px] w-[34px] place-items-center rounded-full bg-[#e5f1ff] text-[13px] font-medium text-[#185fa5]" : index % 5 === 2 ? "grid h-[34px] w-[34px] place-items-center rounded-full bg-[#eaf3de] text-[13px] font-medium text-[#3b6d11]" : index % 5 === 3 ? "grid h-[34px] w-[34px] place-items-center rounded-full bg-[#fbe7ef] text-[13px] font-medium text-[#aa3f6b]" : "grid h-[34px] w-[34px] place-items-center rounded-full bg-[#f1efe8] text-[13px] font-medium text-[#5f5e5a]"}>{getInitials(player.name)}</span>
                <div className="grid min-w-0 gap-1">
                  <strong className="truncate text-[15px] font-medium text-text-primary">{player.name}</strong>
                  <em className="truncate text-[13px] not-italic text-text-secondary">City: {player.city}</em>
                </div>
                <span className="grid justify-items-end gap-1">
                  <strong className="text-[15px] font-medium leading-none text-brand">{player.rating}</strong>
                  <em className="text-[12px] not-italic leading-none text-text-secondary">rating</em>
                </span>
              </article>
            ))}
            {loading && !registeredPlayers.length && Array.from({ length: 4 }).map((_, index) => <SkeletonRow key={index} />)}
            {!loading && !registeredPlayers.length && <StatusMessage tone="info">No players registered yet.</StatusMessage>}
          </div>

          <div className="flex items-center justify-between pt-2">
            <h2 className="text-[15px] font-medium text-text-primary">Past tournaments</h2>
            <span className="text-[13px] text-text-secondary">{pastTournaments.length} seasons</span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {pastTournaments.map((pastTournament) => (
              <article className="grid gap-2 rounded-[14px] border-hairline border-line bg-card p-4" key={pastTournament.seasonYear}>
                <span className="text-[13px] text-text-secondary">{pastTournament.seasonYear} season</span>
                <strong className="text-[17px] font-medium text-text-primary">MRSA {pastTournament.seasonYear}</strong>
                <em className="text-[13px] not-italic text-text-secondary">{pastTournament.matches} matches recorded</em>
              </article>
            ))}
            {loading && !pastTournaments.length && Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)}
            {!loading && !pastTournaments.length && <StatusMessage tone="info">No historical tournament data found.</StatusMessage>}
          </div>

          {message && <StatusMessage tone={paymentState === "failed" ? "error" : paymentState === "pending" ? "warning" : "success"}>{message}</StatusMessage>}
        </section>
        </main>
        {showVideoPrompt && (
          <div className="fixed inset-0 z-50 grid place-items-end bg-black/35 px-3 pb-3 pt-16 backdrop-blur-sm sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="tournament-video-title">
            <section className="relative grid w-full max-w-[520px] gap-4 rounded-[24px] border-hairline border-white/80 bg-white/90 p-5 shadow-[0_24px_80px_rgba(24,24,26,0.22)] backdrop-blur-xl">
              <button className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border-hairline border-line bg-white text-text-secondary shadow-[0_8px_18px_rgba(24,24,26,0.08)] transition active:scale-95 disabled:opacity-60" type="button" onClick={() => setShowVideoPrompt(false)} disabled={savingVideoLink || paying} aria-label="Back to tournament">
                <X size={16} />
              </button>
              <div className="grid gap-2">
                <span className="inline-flex w-max items-center rounded-full bg-brand-light px-3 py-1 text-[13px] font-medium text-[#3b6d11]">Tournament draft video</span>
                <h2 className="text-2xl font-medium leading-tight tracking-[-0.4px] text-text-primary" id="tournament-video-title">Add your playing video</h2>
                <p className="text-[15px] leading-relaxed text-text-secondary">Please upload a Google Drive link with video of you playing and showcasing your skills. This helps captains and organizers draft you fairly.</p>
                <p className="rounded-[14px] border-hairline border-[#f2dccb] bg-[#fff8f1] p-3 text-[14px] leading-relaxed text-[#8a4a22]">If the Google Drive link is not uploaded, you may not be drafted. You can skip this step during registration and add it later from your profile.</p>
              </div>
              <label className="grid gap-2 text-[13px] text-text-secondary">
                Google Drive video link
                <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" value={videoLink} onChange={(event) => setVideoLink(event.target.value)} placeholder="https://drive.google.com/..." inputMode="url" />
                <em className="text-[13px] not-italic leading-relaxed text-text-secondary">Show your serve, forehand, backhand, volleys, and a few rally points if possible.</em>
              </label>
              {videoPromptMessage && <p className="rounded-[14px] border-hairline border-[#f2dccb] bg-[#fff8f1] p-3 text-[14px] text-[#8a4a22]">{videoPromptMessage}</p>}
              <div className="grid gap-2 sm:grid-cols-2">
                <button className="tap-card inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] px-4 text-sm font-medium text-white shadow-[0_12px_26px_rgba(12,59,32,0.18)] disabled:opacity-60" type="button" onClick={saveVideoLinkAndContinue} disabled={savingVideoLink || paying}>
                  {savingVideoLink ? "Saving..." : "Save link and continue"}
                </button>
                <button className="tap-card inline-flex min-h-11 items-center justify-center rounded-[14px] border-hairline border-line bg-white px-4 text-sm font-medium text-text-secondary disabled:opacity-60" type="button" onClick={skipVideoLinkAndContinue} disabled={savingVideoLink || paying}>
                  Skip for now
                </button>
              </div>
              <button className="tap-card inline-flex min-h-10 items-center justify-center rounded-[14px] text-xs font-medium text-text-secondary" type="button" onClick={() => setShowVideoPrompt(false)} disabled={savingVideoLink || paying}>Back to tournament</button>
            </section>
          </div>
        )}
      </div>
    </AppFrame>
  );
}

export function RegisteredPlayersScreen() {
  const appSession = useProtectedRoute("/tournaments/players", true);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registeredPlayers, setRegisteredPlayers] = useState<RegisteredPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [playerQuery, setPlayerQuery] = useState("");
  const [playerSort, setPlayerSort] = useState<"registered" | "rating" | "name">("registered");

  const loadRegisteredPlayers = useCallback(async () => {
    if (!appSession.ready || !appSession.userId) return;

    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      setLoading(false);
      return;
    }

    const { data: tournamentData, error } = await supabase
      .from("tournaments")
      .select("id, name, season_year, status, venue_name, venue_address, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents, max_players")
	      .in("status", ["registration_open", "registration_closed", "live"])
      .order("starts_on", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      setMessage(getFriendlyError(error));
      setLoading(false);
      return;
    }

    if (!tournamentData) {
      setTournament(null);
      setRegisteredPlayers([]);
      setLoading(false);
      return;
    }

    const mappedTournament = mapTournament(tournamentData);
    setTournament(mappedTournament);

    const { data: registrations } = await supabase
      .from("tournament_registrations")
      .select("player_id, players(id, full_name, jamaat_city, rating)")
      .eq("tournament_id", mappedTournament.id)
      .neq("status", "cancelled")
      .in("payment_status", ["paid", "waived"])
      .order("registered_at");

    setRegisteredPlayers((registrations || []).map((row) => {
      const player = Array.isArray(row.players) ? row.players[0] : row.players;
      return {
        id: row.player_id,
        name: player?.full_name || "Player",
        city: player?.jamaat_city || "MRSA",
        rating: formatRating(player?.rating)
      };
    }));
    setLoading(false);
  }, [appSession.ready, appSession.userId]);

  useEffect(() => {
    if (!appSession.ready || !appSession.userId) return;

    loadRegisteredPlayers();
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const channel = supabase
      .channel("registered-players-live-data")
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_registrations" }, loadRegisteredPlayers)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [appSession.ready, appSession.userId, loadRegisteredPlayers]);

  if (!appSession.ready || !appSession.userId || !appSession.profileComplete) return null;
  const visibleRegisteredPlayers = [...registeredPlayers]
    .filter((player) => `${player.name} ${player.city}`.toLowerCase().includes(playerQuery.trim().toLowerCase()))
    .sort((a, b) => {
      if (playerSort === "name") return a.name.localeCompare(b.name);
      if (playerSort === "rating") return (Number.parseFloat(b.rating) || 0) - (Number.parseFloat(a.rating) || 0);
      return 0;
    });

  return (
    <AppFrame active="tournament">
      <div className="min-h-dvh bg-[radial-gradient(circle_at_18%_0%,rgba(234,243,222,0.95)_0,transparent_32%),radial-gradient(circle_at_88%_14%,rgba(230,241,251,0.9)_0,transparent_30%),linear-gradient(180deg,#ffffff_0%,#fbfbf8_46%,#f7fbf1_100%)] pb-28 font-sans text-text-primary">
        <header className="sticky top-0 z-30 border-b-hairline border-white/70 bg-white/70 px-4 py-3 shadow-[0_10px_30px_rgba(24,24,26,0.04)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-shell items-center justify-between">
            <BrandMark />
            <Link className="tap-card rounded-full border-hairline border-white/80 bg-white/65 px-4 py-2 text-xs font-medium text-brand shadow-[0_8px_22px_rgba(24,24,26,0.06)] backdrop-blur" href="/tournaments">Back</Link>
          </div>
        </header>

        <main className="mx-auto grid w-full max-w-shell gap-4 px-4 py-5 pb-32 md:px-6 lg:px-8">
          <section className="relative grid overflow-hidden rounded-[24px] border-hairline border-white/20 bg-[radial-gradient(circle_at_82%_18%,rgba(76,222,140,0.22)_0,transparent_28%),linear-gradient(135deg,#0c3b20_0%,#14572f_52%,#1a6e3c_100%)] p-5 text-white shadow-[0_24px_70px_rgba(12,59,32,0.22)] lg:p-6">
            <div className="pointer-events-none absolute inset-0 -right-16 -top-6 text-white opacity-[0.06]" aria-hidden="true">
              <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="relative grid gap-3">
              <span className="text-[13px] text-white/60">Registered players</span>
              <h1 className="text-2xl font-medium leading-tight tracking-[-0.4px] text-white">{tournament?.name || "Tournament"}</h1>
              <p className="text-xs text-white/55">{registeredPlayers.length} players registered</p>
            </div>
          </section>

          <section className="grid gap-3">
            <div className="grid gap-3 rounded-surface border-hairline border-line bg-card p-3 md:grid-cols-[minmax(0,1fr)_180px] md:items-end">
              <label className="grid gap-2 text-[13px] text-text-secondary">
                Search registered players
                <input className="min-h-10 rounded-card border-hairline border-line bg-white px-3 text-[15px] text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-light" type="search" value={playerQuery} onChange={(event) => setPlayerQuery(event.target.value)} placeholder="Name or city" />
              </label>
              <label className="grid gap-2 text-[13px] text-text-secondary">
                Sort by
                <select className="min-h-10 rounded-card border-hairline border-line bg-white px-3 text-[15px] text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-light" value={playerSort} onChange={(event) => setPlayerSort(event.target.value as "registered" | "rating" | "name")}>
                  <option value="registered">Registration time</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name</option>
                </select>
              </label>
            </div>
            <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 pt-2">
              <h2 className="text-[15px] font-medium text-text-primary">All registered players</h2>
              <span className="text-[13px] text-text-secondary">{visibleRegisteredPlayers.length} players</span>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {visibleRegisteredPlayers.map((player, index) => (
                <article className="grid min-h-[60px] grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-3 rounded-[14px] border-hairline border-line bg-card px-3 py-3" key={player.id}>
                  <span className={index % 5 === 0 ? "grid h-[34px] w-[34px] place-items-center rounded-full bg-[#fde9dc] text-[13px] font-medium text-[#a94d24]" : index % 5 === 1 ? "grid h-[34px] w-[34px] place-items-center rounded-full bg-[#e5f1ff] text-[13px] font-medium text-[#185fa5]" : index % 5 === 2 ? "grid h-[34px] w-[34px] place-items-center rounded-full bg-[#eaf3de] text-[13px] font-medium text-[#3b6d11]" : index % 5 === 3 ? "grid h-[34px] w-[34px] place-items-center rounded-full bg-[#fbe7ef] text-[13px] font-medium text-[#aa3f6b]" : "grid h-[34px] w-[34px] place-items-center rounded-full bg-[#f1efe8] text-[13px] font-medium text-[#5f5e5a]"}>{getInitials(player.name)}</span>
                  <div className="grid min-w-0 gap-1">
                    <strong className="truncate text-[15px] font-medium text-text-primary">{player.name}</strong>
                    <em className="truncate text-[13px] not-italic text-text-secondary">City: {player.city}</em>
                  </div>
                  <span className="grid justify-items-end gap-1">
                    <strong className="text-[15px] font-medium leading-none text-brand">{player.rating}</strong>
                    <em className="text-[12px] not-italic leading-none text-text-secondary">rating</em>
                  </span>
                </article>
              ))}
              {loading && !visibleRegisteredPlayers.length && Array.from({ length: 4 }).map((_, index) => <SkeletonRow key={index} />)}
              {!loading && !visibleRegisteredPlayers.length && <StatusMessage tone="info">{registeredPlayers.length ? "No players match that search." : "No players registered yet."}</StatusMessage>}
            </div>
            {message && <StatusMessage tone="error">{message}</StatusMessage>}
          </section>
        </main>
      </div>
    </AppFrame>
  );
}

export function PlayersScreen() {
  const appSession = useProtectedRoute("/dashboard", true);
  const [players, setPlayers] = useState<TopPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appSession.ready || !appSession.userId) return;

    const loadPlayers = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("players")
        .select("id, full_name, jamaat_city, profile_photo_url, rating")
        .order("rating", { ascending: false, nullsFirst: false })
        .order("full_name")
        .limit(120);

      setPlayers((data || [])
        .filter((row) => !/^test/i.test((row.full_name || "").trim()))
        .map((row) => ({
          id: row.id,
          name: row.full_name || "Player",
          rating: formatRating(row.rating),
          city: row.jamaat_city || "City not added",
          profilePhotoUrl: row.profile_photo_url || ""
        })));
      setLoading(false);
    };

    loadPlayers();
  }, [appSession.ready, appSession.userId]);

  if (!appSession.ready || !appSession.userId || !appSession.profileComplete) return null;

  return (
    <AppFrame active="profile">
      <div className="min-h-dvh bg-[radial-gradient(circle_at_18%_0%,rgba(234,243,222,0.95)_0,transparent_32%),radial-gradient(circle_at_88%_14%,rgba(230,241,251,0.9)_0,transparent_30%),linear-gradient(180deg,#ffffff_0%,#fbfbf8_46%,#f7fbf1_100%)] pb-28 font-sans text-text-primary">
        <AppTopBar />
        <main className="mx-auto grid w-full max-w-shell gap-4 px-4 py-5 pb-32 md:px-6 lg:px-8">
          <section className="relative grid min-h-[190px] overflow-hidden rounded-[24px] border-hairline border-white/20 bg-[radial-gradient(circle_at_82%_18%,rgba(76,222,140,0.22)_0,transparent_28%),linear-gradient(135deg,#0c3b20_0%,#14572f_52%,#1a6e3c_100%)] p-5 text-white shadow-[0_24px_70px_rgba(12,59,32,0.22)] lg:p-6">
            <div className="pointer-events-none absolute inset-0 -right-16 -top-6 text-white opacity-[0.06]" aria-hidden="true">
              <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="relative grid content-center gap-3">
              <span className="text-[13px] text-white/60">Players</span>
              <h1 className="max-w-[680px] text-3xl font-medium leading-[1.08] tracking-[-0.4px] text-white md:text-[42px]">All players</h1>
              <p className="max-w-[620px] text-[15px] leading-relaxed text-white/68">Browse MRSA players by profile, rating, and Jamaat / city.</p>
            </div>
          </section>

          <section className="grid gap-3" aria-label="All players">
            <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <h2 className="text-[15px] font-medium text-text-primary">Player directory</h2>
              <span className="text-[13px] text-text-secondary">{players.length} players</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {players.map((player) => (
                <article className="grid min-h-[76px] grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-[16px] border-hairline border-line bg-card p-3 shadow-[0_8px_20px_rgba(24,24,26,0.04)]" key={player.id}>
                  <Avatar className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-brand-light text-[13px] font-medium text-[#3b6d11]" name={player.name} photoUrl={player.profilePhotoUrl} ariaLabel={`${player.name} profile photo`} />
                  <span className="grid min-w-0 gap-1">
                    <strong className="truncate text-[15px] font-medium text-text-primary">{player.name}</strong>
                    <em className="truncate text-[13px] not-italic text-text-secondary">{player.city}</em>
                  </span>
                  <strong className="rounded-full bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] px-3 py-1 text-[13px] font-medium text-white">{player.rating}</strong>
                </article>
              ))}
            </div>
            {!players.length && <div className="rounded-[14px] border-hairline border-line bg-card p-4 text-[15px] text-text-secondary">{loading ? "Loading players..." : "No players found."}</div>}
          </section>
        </main>
      </div>
    </AppFrame>
  );
}

export function AboutScreen() {
  const appSession = useAppSession();
  const isAuthenticated = Boolean(appSession.ready && appSession.userId && appSession.profileComplete);

  return (
    <AppFrame active={isAuthenticated ? "home" : undefined} withNav={isAuthenticated}>
      <div className="min-h-dvh bg-page pb-28 font-sans text-text-primary">
        <header className="sticky top-0 z-30 border-b-hairline border-surface bg-white/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-shell items-center justify-between">
            <BrandMark />
            <Link className="grid h-9 w-9 place-items-center rounded-full border-hairline border-line bg-card text-brand" href={isAuthenticated ? "/dashboard" : "/"} aria-label={isAuthenticated ? "Back to dashboard" : "Back to sign in"}>
              <ArrowLeft size={16} />
            </Link>
          </div>
        </header>

        <main className="mx-auto grid w-full max-w-shell gap-4 px-4 py-5 pb-32 md:px-6 lg:px-8">
          <section className="relative grid min-h-[220px] overflow-hidden rounded-hero bg-brand p-5 text-white md:grid-cols-[minmax(0,1fr)_minmax(250px,320px)] md:items-center md:gap-8 lg:p-6">
            <div className="pointer-events-none absolute inset-0 -right-16 -top-6 text-white opacity-[0.06]" aria-hidden="true">
              <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="relative grid gap-3">
              <span className="inline-flex w-max items-center rounded-full bg-white/12 px-3 py-1 text-caption text-white/75">About MRSA</span>
              <h1 className="max-w-[680px] text-display text-white md:text-[40px]">Mumineen Racquet Sports Association</h1>
              <p className="max-w-[620px] text-body text-white/72">A North America-wide community bringing together women through a shared passion for racquet sports — tennis, TT, badminton, and pickleball.</p>
            </div>
            <div className="relative mt-5 grid gap-3 rounded-surface border-hairline border-white/10 bg-white/[0.08] p-4 md:mt-0">
              <span className="text-caption text-white/55">Events</span>
              <strong className="text-h1 text-white">1</strong>
            </div>
          </section>
        </main>
      </div>
    </AppFrame>
  );
}

export function PlayerScreen() {
  const router = useRouter();
  const appSession = useProtectedRoute("/profile", true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFocusField, setEditFocusField] = useState<keyof ProfileData>("fullName");
  const [profile, setProfile] = useState(initialProfile);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [showPayments, setShowPayments] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const editableFieldRefs = useRef<Partial<Record<keyof ProfileData, HTMLElement>>>({});

  const signOut = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setSigningOut(true);
    await supabase.auth.signOut();
    router.replace("/");
  };

  const updateProfile = (field: keyof ProfileData, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const startProfileEdit = (field: keyof ProfileData = "fullName") => {
    setMessage("");
    setEditFocusField(field);
    setIsEditing(true);
  };

  const cancelProfileEdit = () => {
    setIsEditing(false);
    setMessage("");
    if (appSession.player) {
      setProfile(mapProfile(appSession.player));
    }
  };

  useEffect(() => {
    if (!isEditing) return;

    window.setTimeout(() => {
      const field = editableFieldRefs.current[editFocusField] || editableFieldRefs.current.fullName;
      field?.scrollIntoView({ behavior: "smooth", block: "center" });
      field?.focus({ preventScroll: true });
    }, 80);
  }, [editFocusField, isEditing]);

  useEffect(() => {
    if (!appSession.ready || !appSession.userId) return;

    const loadProfile = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data } = await supabase
        .from("players")
        .select("id, full_name, phone, age, date_of_birth, profile_photo_url, jamaat_city, self_assessment, dominant_hand, jersey_size, tennis_video_url, tennis_video_status, tier, rating, tournaments_played, matches_played")
        .eq("auth_user_id", appSession.userId)
        .maybeSingle();

      if (data) {
        setProfile(mapProfile(data));

        const { data: payments } = await supabase
          .from("payment_ledger")
          .select("id, entry_type, status, amount_cents, currency, occurred_at, notes, stripe_failure_message, tournaments(name)")
          .eq("player_id", data.id)
          .order("occurred_at", { ascending: false })
          .limit(12);

        setPaymentHistory((payments || []).map((payment) => {
          const tournament = Array.isArray(payment.tournaments) ? payment.tournaments[0] : payment.tournaments;
          return {
            id: payment.id,
            entryType: payment.entry_type,
            status: payment.status,
            amountCents: payment.amount_cents,
            currency: payment.currency || "USD",
            occurredAt: payment.occurred_at,
            notes: payment.notes || "",
            tournamentName: tournament?.name || "MRSA",
            failureMessage: payment.stripe_failure_message || ""
          };
        }));
      }
    };

    loadProfile();
  }, [appSession.ready, appSession.userId]);

  if (!appSession.ready || !appSession.userId || !appSession.profileComplete) return null;

  const saveProfile = async () => {
    const supabase = getSupabaseClient();
    if (!supabase || !profile.id) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    setMessage("");
    const { error } = await supabase
      .from("players")
      .update({
        full_name: profile.fullName,
        phone: profile.phone,
        date_of_birth: profile.dateOfBirth || null,
        dominant_hand: profile.dominantHand,
        self_assessment: profile.selfEvaluation,
        jamaat_city: profile.jamaatCity,
        jersey_size: profile.jerseySize,
        tennis_video_url: profile.tennisVideo,
        tennis_video_status: hasPlayerVideoLink(profile.tennisVideo) ? "pending" : null,
        tennis_video_reviewed_at: null,
        tennis_video_reviewed_by: null,
        tennis_video_rejection_note: null
      })
      .eq("id", profile.id);
    setSaving(false);

    if (error) {
      setMessage(getFriendlyError(error));
      return;
    }

    setIsEditing(false);
    await appSession.refresh();
    setMessage("Profile saved.");
  };

  const updateProfilePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const supabase = getSupabaseClient();
    if (!file || !supabase || !profile.id) return;

    const user = appSession.user;
    if (!user) return;

    setMessage("Compressing and uploading photo...");
    const photoUrl = await uploadCompressedProfilePhoto(user.id, file);
    if (!photoUrl) {
      setMessage("Could not upload photo.");
      return;
    }

    const { error } = await supabase.from("players").update({ profile_photo_url: photoUrl }).eq("id", profile.id);
    if (error) {
      setMessage(getFriendlyError(error));
      return;
    }

    setProfile((current) => ({ ...current, profilePhotoUrl: photoUrl }));
    await appSession.refresh();
    setMessage("Photo updated.");
  };

  return (
    <AppFrame active="profile">
      <div className="min-h-dvh bg-[radial-gradient(circle_at_18%_0%,rgba(234,243,222,0.95)_0,transparent_32%),radial-gradient(circle_at_88%_14%,rgba(230,241,251,0.9)_0,transparent_30%),linear-gradient(180deg,#ffffff_0%,#fbfbf8_46%,#f7fbf1_100%)] pb-28 font-sans text-text-primary">
        <AppTopBar avatarName={profile.fullName} avatarPhotoUrl={profile.profilePhotoUrl} />

        <main className="mx-auto grid w-full max-w-shell gap-4 px-4 py-5 pb-32 md:px-6 lg:px-8">
        <section className="relative grid min-h-[220px] grid-cols-[minmax(0,1fr)_auto] items-start gap-4 overflow-hidden rounded-[24px] border-hairline border-white/20 bg-[radial-gradient(circle_at_82%_18%,rgba(76,222,140,0.22)_0,transparent_28%),linear-gradient(135deg,#0c3b20_0%,#14572f_52%,#1a6e3c_100%)] p-5 pb-16 text-white shadow-[0_24px_70px_rgba(12,59,32,0.22)] md:gap-6 lg:p-6 lg:pb-16">
          <div className="pointer-events-none absolute inset-0 -right-16 -top-6 text-white opacity-[0.06]" aria-hidden="true">
            <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
              <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
          <div className="relative grid gap-3">
            <span className="text-[13px] text-white/60">Player profile</span>
            <h1 className="text-3xl font-medium leading-none tracking-[-0.4px] text-white">{profile.fullName}</h1>
          </div>
          <div className="relative justify-self-end">
            <Avatar className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-full border-hairline border-white/35 bg-white/16 text-2xl font-medium text-white shadow-[0_18px_44px_rgba(0,0,0,0.14)] backdrop-blur md:h-28 md:w-28" name={profile.fullName} photoUrl={profile.profilePhotoUrl} ariaLabel={`${profile.fullName} profile photo`} />
            <label className="absolute bottom-1 right-1 grid h-6 w-6 cursor-pointer place-items-center rounded-full border-hairline border-white/80 bg-white text-brand shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition active:scale-95" aria-label="Change profile photo" title="Change profile photo">
              <Pencil size={11} />
              <input className="sr-only" type="file" accept="image/*" onChange={updateProfilePhoto} />
            </label>
          </div>
          <div className="absolute bottom-5 left-5 flex flex-wrap gap-2 lg:bottom-6 lg:left-6">
            <span className="rounded-full bg-white/12 px-3 py-1 text-[13px] text-white/85">Rating {profile.rating}</span>
            <span className="rounded-full bg-white/12 px-3 py-1 text-[13px] text-white/85">{profile.jamaatCity}</span>
          </div>
        </section>

        <section className="grid gap-4">
	          <div className="flex flex-wrap gap-2" aria-label="Profile summary">
	            <span className="rounded-full bg-brand-light px-3 py-1 text-[13px] text-[#3b6d11]">{profile.selfEvaluation}</span>
	            <span className="rounded-full bg-[#e5f1ff] px-3 py-1 text-[13px] text-[#185fa5]">{profile.jamaatCity}</span>
	            <span className="rounded-full bg-[#fde9dc] px-3 py-1 text-[13px] text-[#a94d24]">{profile.dominantHand} hand</span>
	          </div>

          <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 pt-2">
            <h2 className="text-[15px] font-medium text-text-primary">Profile details</h2>
            {isEditing ? (
              <span className="inline-flex min-h-9 items-center gap-2 justify-self-end whitespace-nowrap rounded-full bg-brand-light px-3 text-[14px] font-medium text-[#3b6d11]">
                <Pencil size={14} />
                Editing now
              </span>
            ) : (
              <button className="tap-card inline-flex min-h-9 items-center gap-2 justify-self-end whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] px-3 text-[14px] font-medium text-white shadow-[0_10px_22px_rgba(12,59,32,0.16)]" type="button" onClick={() => startProfileEdit("fullName")}>
                <Pencil size={14} />
                Edit profile
              </button>
            )}
          </div>

	          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Player performance stats">
	            <article className="grid gap-2 rounded-[14px] border-hairline border-line bg-card p-4"><span className="text-[13px] text-text-secondary">Rating</span><strong className="text-[20px] font-medium text-text-primary">{profile.rating}</strong></article>
	            <article className="grid gap-2 rounded-[14px] border-hairline border-line bg-card p-4"><span className="text-[13px] text-text-secondary">Tournaments</span><strong className="text-[20px] font-medium text-text-primary">{profile.tournamentsPlayed}</strong></article>
	            <article className="grid gap-2 rounded-[14px] border-hairline border-line bg-card p-4"><span className="text-[13px] text-text-secondary">Matches</span><strong className="text-[20px] font-medium text-text-primary">{profile.matchesPlayed}</strong></article>
	            <button className="grid gap-2 rounded-[14px] border-hairline border-white/20 bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] p-4 text-left text-white shadow-[0_14px_30px_rgba(12,59,32,0.18)] transition active:scale-[0.99]" type="button" onClick={() => setShowPayments(true)} aria-haspopup="dialog">
	              <span className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-[13px] text-white/72">
	                Payments
	                <ArrowRight size={15} className="text-white" />
	              </span>
	              <strong className="text-[20px] font-medium text-white">{paymentHistory.length}</strong>
	            </button>
	          </div>

	          <div className={isEditing ? "grid gap-3 rounded-[20px] border-hairline border-[#bdd7aa] bg-[linear-gradient(135deg,#f8fbf4,#ffffff)] p-3 shadow-[0_18px_42px_rgba(12,59,32,0.10)] ring-2 ring-brand-light md:p-4" : "grid gap-3"}>
            {isEditing && (
              <div className="grid gap-1 rounded-[16px] border-hairline border-[#dbe8cd] bg-white p-4">
                <span className="inline-flex w-max items-center gap-2 rounded-full bg-brand-light px-3 py-1 text-[13px] font-medium text-[#3b6d11]">
                  <Pencil size={13} />
                  Edit mode is on
                </span>
                <strong className="text-[19px] font-medium tracking-[-0.4px] text-text-primary">Update your profile fields below.</strong>
                <em className="text-[14px] not-italic leading-relaxed text-text-secondary">The boxes are now active. Review your details, then save or cancel at the bottom of this section.</em>
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              <ProfileField label="Full Name" value={profile.fullName} editing={isEditing} onEdit={() => startProfileEdit("fullName")} onChange={(value) => updateProfile("fullName", value)} inputRef={(node) => { if (node) editableFieldRefs.current.fullName = node; }} />
              <ProfileField label="Phone number" value={profile.phone} editing={isEditing} onEdit={() => startProfileEdit("phone")} onChange={(value) => updateProfile("phone", value)} inputRef={(node) => { if (node) editableFieldRefs.current.phone = node; }} inputType="tel" />
              <ProfileField label="Date of birth" value={profile.dateOfBirth} displayValue={profile.dateOfBirth ? `${formatDateOfBirth(profile.dateOfBirth)} · Age ${calculateAge(profile.dateOfBirth)}` : "Not set"} editing={isEditing} onEdit={() => startProfileEdit("dateOfBirth")} onChange={(value) => updateProfile("dateOfBirth", value)} inputRef={(node) => { if (node) editableFieldRefs.current.dateOfBirth = node; }} inputType="date" max={getTodayDateInputValue()} />
              <ProfileField label="Dominant Hand" value={profile.dominantHand} editing={isEditing} onEdit={() => startProfileEdit("dominantHand")} onChange={(value) => updateProfile("dominantHand", value)} inputRef={(node) => { if (node) editableFieldRefs.current.dominantHand = node; }} />
              <article className={isEditing ? "grid gap-2 rounded-[14px] border-hairline border-[#bdd7aa] bg-white p-4 shadow-[0_8px_20px_rgba(12,59,32,0.04)]" : "grid gap-2 rounded-[14px] border-hairline border-line bg-card p-4"}>
                <span className="text-[13px] text-text-secondary">Self Evaluation</span>
                {isEditing ? (
                  <>
                    <select className="min-h-11 rounded-[12px] border-hairline border-brand bg-white px-3 text-[16px] text-text-primary outline-none transition ring-2 ring-brand-light focus:border-brand focus:ring-4 focus:ring-brand-light" value={profile.selfEvaluation} onChange={(event) => updateProfile("selfEvaluation", event.target.value)} ref={(node) => { if (node) editableFieldRefs.current.selfEvaluation = node; }} aria-label="Self Evaluation">
                      {skillLevels.map((level) => (
                        <option value={level.value} key={level.value}>{level.value}</option>
                      ))}
                    </select>
                    <em className="text-[13px] not-italic leading-relaxed text-text-secondary">{getSkillLevelLabel(profile.selfEvaluation)}</em>
                  </>
                ) : (
                  <button className="tap-card grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-left" type="button" onClick={() => startProfileEdit("selfEvaluation")}>
                    <strong className="break-words text-[17px] font-medium text-text-primary">{profile.selfEvaluation || "Not set"}</strong>
                    <Pencil className="text-text-muted" size={14} aria-hidden="true" />
                  </button>
                )}
              </article>
              <article className={isEditing ? "grid gap-2 rounded-[14px] border-hairline border-[#bdd7aa] bg-white p-4" : "grid gap-2 rounded-[14px] border-hairline border-line bg-card p-4"}>
                <span className="text-[13px] text-text-secondary">Jamaat / City</span>
                {isEditing ? (
                  <JamaatCityCombobox value={profile.jamaatCity} onChange={(value) => updateProfile("jamaatCity", value)} triggerRef={(node) => { if (node) editableFieldRefs.current.jamaatCity = node; }} />
                ) : (
                  <button className="tap-card grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-left" type="button" onClick={() => startProfileEdit("jamaatCity")}>
                    <strong className="break-words text-[17px] font-medium text-text-primary">{profile.jamaatCity || "Not set"}</strong>
                    <Pencil className="text-text-muted" size={14} />
                  </button>
                )}
              </article>
              <ProfileField
                label="Jersey Size"
                value={profile.jerseySize}
                editing={isEditing}
                onEdit={() => startProfileEdit("jerseySize")}
                onChange={(value) => updateProfile("jerseySize", value)}
                inputRef={(node) => { if (node) editableFieldRefs.current.jerseySize = node; }}
                helper={<button className="font-medium text-brand" type="button" onClick={() => setSizeGuideOpen(true)}>Size guide</button>}
              />
              <ProfileField
                label="Tennis video Google Drive link recommended"
                value={profile.tennisVideo}
                editing={isEditing}
                onEdit={() => startProfileEdit("tennisVideo")}
                onChange={(value) => updateProfile("tennisVideo", value)}
                inputRef={(node) => { if (node) editableFieldRefs.current.tennisVideo = node; }}
                helper={<span>{videoDescription} Captains and organizers use this for tournament drafts.</span>}
              />
            </div>

            {isEditing && (
              <div className="grid gap-2 sm:grid-cols-[auto_auto]">
                <button className="tap-card inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] px-4 text-sm font-medium text-white shadow-[0_12px_26px_rgba(12,59,32,0.18)] disabled:opacity-60" type="button" onClick={saveProfile} disabled={saving}>
                  <CheckCircle2 size={16} />
                  {saving ? "Saving..." : "Save profile"}
                </button>
                <button className="tap-card inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] border-hairline border-line bg-white px-4 text-sm font-medium text-text-secondary" type="button" onClick={cancelProfileEdit} disabled={saving}>
                  <X size={16} />
                  Cancel changes
                </button>
              </div>
            )}
          </div>
          {message && <StatusMessage tone={message === "Profile saved." || message === "Photo updated." ? "success" : message.includes("upload") || message.includes("Compressing") ? "info" : "error"}>{message}</StatusMessage>}

          <div className="grid pt-6">
            <button
              className="tap-card inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] border-hairline border-[#f2c8c8] bg-[#fff5f5] px-4 text-sm font-medium text-[#a32d2d] shadow-[0_10px_22px_rgba(163,45,45,0.08)] disabled:opacity-60"
              type="button"
              onClick={signOut}
              disabled={signingOut}
            >
              <LogOut size={16} />
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </section>
        </main>
        {showPayments && (
	          <div className="fixed inset-0 z-50 grid place-items-end bg-black/35 px-3 pb-6 pt-16 sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="profile-payments-title">
	            <section className="relative grid max-h-[78dvh] w-full max-w-[560px] grid-rows-[auto_minmax(0,1fr)] gap-4 rounded-[24px] border-hairline border-line bg-white p-5 shadow-[0_24px_80px_rgba(24,24,26,0.22)]">
              <button className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border-hairline border-line bg-white text-text-secondary shadow-[0_8px_18px_rgba(24,24,26,0.08)] transition active:scale-95" type="button" onClick={() => setShowPayments(false)} aria-label="Close payments">
                <X size={16} />
              </button>
              <div className="grid gap-1 pr-10">
                <span className="inline-flex w-max items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-[13px] font-medium text-[#3b6d11]">
                  <BadgeDollarSign size={14} />
                  Payments
                </span>
                <h2 className="text-2xl font-medium leading-tight tracking-[-0.4px] text-text-primary" id="profile-payments-title">Payment history</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">{paymentHistory.length ? `${paymentHistory.length} payment ${paymentHistory.length === 1 ? "record" : "records"} connected to your profile.` : "Completed tournament payments will appear here."}</p>
              </div>
	              <div className="grid max-h-full gap-3 overflow-y-auto pb-8 pr-1">
                {paymentHistory.map((payment) => (
                  <article className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[14px] border-hairline border-line bg-card p-4" key={payment.id}>
                    <div className="grid min-w-0 gap-1">
                      <span className="truncate text-[13px] text-text-secondary">{payment.tournamentName}</span>
                      <strong className="text-[17px] font-medium text-text-primary">{formatCurrency(payment.amountCents, payment.currency)}</strong>
                      <em className="truncate text-[13px] not-italic text-text-secondary">{formatPaymentHistoryLine(payment)}</em>
                    </div>
                    <b className={payment.status === "failed" ? "rounded-full bg-[#fcebeb] px-2.5 py-1 text-[12px] font-medium text-[#a32d2d]" : payment.status === "pending" ? "rounded-full bg-[#fff4d8] px-2.5 py-1 text-[12px] font-medium text-[#8a5a00]" : "rounded-full bg-brand-light px-2.5 py-1 text-[12px] font-medium text-[#3b6d11]"}>{formatPaymentStatus(payment.status)}</b>
                  </article>
                ))}
                {!paymentHistory.length && <div className="rounded-[14px] border-hairline border-line bg-card p-4 text-[15px] text-text-secondary">No payment records yet.</div>}
              </div>
            </section>
          </div>
        )}
        {sizeGuideOpen && <SizeGuideModal selectedSize={profile.jerseySize} onSelect={(size) => updateProfile("jerseySize", size)} onClose={() => setSizeGuideOpen(false)} />}
      </div>
    </AppFrame>
  );
}

function mapProfile(row: DbProfileRow): ProfileData {
  return {
    id: row.id,
    profilePhotoUrl: row.profile_photo_url || "",
    fullName: row.full_name || "Player",
    phone: row.phone || "",
    dateOfBirth: row.date_of_birth || "",
    dominantHand: row.dominant_hand || initialProfile.dominantHand,
    selfEvaluation: normalizeSkillLevel(row.self_assessment) || initialProfile.selfEvaluation,
    jamaatCity: row.jamaat_city || initialProfile.jamaatCity,
    tier: String(row.tier || 1),
    rating: formatRating(row.rating),
    tournamentsPlayed: String(row.tournaments_played || 0),
    matchesPlayed: String(row.matches_played || 0),
    jerseySize: row.jersey_size || initialProfile.jerseySize,
    tennisVideo: hasPlayerVideoLink(row.tennis_video_url) ? row.tennis_video_url || "" : ""
  };
}

function mapTournament(row: DbTournamentRow): Tournament {
  return {
    id: row.id,
    name: row.name,
    seasonYear: row.season_year,
    status: getTournamentLifecycleStatus(row),
    venueName: row.venue_name || "",
    venueAddress: row.venue_address || "",
    venueMapsUrl: row.venue_maps_url || "",
    startsOn: row.starts_on,
    endsOn: row.ends_on,
    registrationClosesAt: row.registration_closes_at,
    registrationFeeCents: row.registration_fee_cents || 0,
    maxPlayers: row.max_players
  };
}

function getTournamentLifecycleStatus(row: Pick<DbTournamentRow, "status" | "starts_on" | "ends_on" | "registration_closes_at">) {
  if (row.status === "cancelled") return "cancelled";
  const now = new Date();
  const registrationClose = row.registration_closes_at ? new Date(row.registration_closes_at) : null;
  const start = row.starts_on ? new Date(`${row.starts_on}T00:00:00`) : null;
  const end = row.ends_on ? new Date(`${row.ends_on}T23:59:59.999`) : null;

  if (end && now > end) return "completed";
  if (start && now >= start) return "live";
  if (registrationClose && now > registrationClose) return "registration_closed";
  return "registration_open";
}

function formatRating(value: unknown) {
  if (value === null || value === undefined || value === "") return "Pending";
  const rating = Number(value);
  return Number.isFinite(rating) ? rating.toFixed(3) : String(value);
}

function getTodayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function calculateAge(dateOfBirth?: string | null) {
  if (!dateOfBirth) return "";
  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return "";
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (today < birthdayThisYear) age -= 1;
  return age >= 0 ? String(age) : "";
}

function formatDateOfBirth(dateOfBirth: string) {
  const date = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateOfBirth;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function normalizeSkillLevel(value?: string | null) {
  if (!value) return "";
  const skillLevel = skillLevels.find((level) => value === level.value || value === level.label || value.startsWith(level.value));
  return skillLevel?.value || value;
}

function hasPlayerVideoLink(value?: string | null) {
  const normalizedValue = (value || "").trim();
  if (!normalizedValue) return false;
  return !/^google drive link$/i.test(normalizedValue);
}

function needsPlayerVideoUpload(videoUrl?: string | null, videoStatus?: string | null) {
  return !hasPlayerVideoLink(videoUrl) || videoStatus === "rejected";
}

function getSkillLevelLabel(value?: string | null) {
  const normalizedValue = normalizeSkillLevel(value);
  return skillLevels.find((level) => level.value === normalizedValue)?.label || "";
}

function formatCurrency(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(cents / 100);
}

function formatPaymentStatus(status: PaymentHistoryItem["status"]) {
  if (status === "paid") return "Paid";
  if (status === "pending") return "Pending";
  if (status === "failed") return "Failed";
  if (status === "refunded") return "Refunded";
  if (status === "waived") return "Waived";
  return status;
}

function formatPaymentHistoryLine(payment: PaymentHistoryItem) {
  const date = new Date(payment.occurredAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  if (payment.status === "failed" && payment.failureMessage) {
    return `${date} · ${payment.failureMessage}`;
  }
  return `${date} · ${payment.entryType}`;
}

function formatTournamentDates(tournament: Tournament) {
  if (!tournament.startsOn) return "Dates TBD";
  const start = new Date(`${tournament.startsOn}T00:00:00`);
  const end = tournament.endsOn ? new Date(`${tournament.endsOn}T00:00:00`) : null;
  const month = start.toLocaleString("en-US", { month: "short" });
  if (!end || tournament.startsOn === tournament.endsOn) {
    return `${month} ${start.getDate()}`;
  }
  return `${month} ${start.getDate()}-${end.getDate()}`;
}

function formatRegistrationClose(value: string | null) {
  if (!value) return "TBD";
  return getRegistrationCloseDate(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function getRegistrationButtonLabel({
  registered,
  paying,
  paymentState,
  registrationOpen
}: {
  registered: boolean;
  paying: boolean;
  paymentState: PaymentState;
  registrationOpen: boolean | undefined;
}) {
  if (registered || paymentState === "paid") return "Registered";
  if (paying) return "Opening payment...";
  if (paymentState === "failed") return "Retry payment";
  if (paymentState === "pending") return "Checking payment...";
  if (!registrationOpen) return "Registration closed";
  return "Pay and register";
}

function HomeRegistrationCountdown({ closesAt }: { closesAt: string | null }) {
  const [remaining, setRemaining] = useState(() => getTimeRemaining(closesAt));

  useEffect(() => {
    setRemaining(getTimeRemaining(closesAt));
    if (!closesAt) return undefined;
    const timer = window.setInterval(() => setRemaining(getTimeRemaining(closesAt)), 1000);
    return () => window.clearInterval(timer);
  }, [closesAt]);

  if (!closesAt) return null;

  const units = [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Mins", value: remaining.minutes },
    { label: "Secs", value: remaining.seconds }
  ];

  return (
    <article className="grid gap-2 rounded-card border-hairline border-white/10 bg-white/10 px-3 py-3 text-white" aria-label="Registration close countdown">
      <span className="text-[13px] text-current opacity-62">{remaining.expired ? "Registration closed" : "Registration closes in"}</span>
      <div className="grid grid-cols-4 gap-2">
        {units.map((unit) => (
          <span className="grid min-h-[54px] place-items-center rounded-[12px] border-hairline border-white/10 bg-white/12 px-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" key={unit.label}>
            <strong className="font-mono text-[20px] font-medium leading-none tabular-nums">{remaining.expired ? "00" : String(unit.value).padStart(2, "0")}</strong>
            <em className="text-[11px] not-italic leading-none text-white/58">{unit.label}</em>
          </span>
        ))}
      </div>
    </article>
  );
}

function RegistrationCountdown({ closesAt, daysOnly = false, compact = false }: { closesAt: string | null; daysOnly?: boolean; compact?: boolean }) {
  if (!closesAt) return null;
  const remaining = getTimeRemaining(closesAt);
  const dayCount = Math.max(0, remaining.days);
  const dayLabel = dayCount === 1 ? "day" : "days";

  if (compact) {
    return (
      <article className="rounded-card border-hairline border-white/10 bg-white/[0.08] px-3 py-2 text-white" aria-label="Registration close date">
        <span className="text-[12px] text-current opacity-55">{remaining.expired ? "Registration closed" : "Registration closes"}</span>
        <strong className="block text-[13px] font-medium text-current opacity-78">{formatRegistrationClose(closesAt)}</strong>
      </article>
    );
  }

  if (daysOnly) {
    return (
      <article className="rounded-card border-hairline border-white/10 bg-white/10 px-3 py-2 text-white" aria-label="Registration close date">
        <span className="text-[13px] text-current opacity-60">{remaining.expired ? "Registration closed" : "Registration closes in"}</span>
        <strong className="block text-[24px] font-medium leading-tight text-current tabular-nums">{remaining.expired ? "Closed" : `${dayCount} ${dayLabel}`}</strong>
      </article>
    );
  }

  return (
    <article className="rounded-card border-hairline border-white/10 bg-white/10 px-3 py-2" aria-label="Registration close date">
      <span className="text-[13px] text-current opacity-60">{remaining.expired ? "Registration closed" : "Registration closes"}</span>
      <strong className="block text-[15px] font-medium text-current">{formatRegistrationClose(closesAt)}</strong>
      {!remaining.expired && <em className="text-[13px] not-italic text-current opacity-55">{remaining.days > 0 ? `${remaining.days} days left` : `${remaining.hours} hours left`}</em>}
    </article>
  );
}

function getTimeRemaining(value: string | null) {
  const targetTime = value ? getRegistrationCloseDate(value).getTime() : Date.now();
  const distance = Math.max(0, targetTime - Date.now());

  return {
    expired: Boolean(value) && distance <= 0,
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
    seconds: Math.floor((distance % 60000) / 1000)
  };
}

function getRegistrationCloseDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return date;

  const hasExplicitUtcOffset = /(?:z|[+-]00:?00)$/i.test(value);
  if (hasExplicitUtcOffset && date.getUTCHours() === 23 && date.getHours() !== 23) {
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
  }

  return date;
}

function buildPastTournamentSummaries(matches: { season_year: number | null; format: string | null }[]): PastTournamentSummary[] {
  const summaries = new Map<number, PastTournamentSummary>();

  matches.forEach((match) => {
    if (!match.season_year) return;
    const summary = summaries.get(match.season_year) || {
      seasonYear: match.season_year,
      matches: 0,
      singles: 0,
      doubles: 0
    };
    summary.matches += 1;
    if (match.format === "singles") summary.singles += 1;
    if (match.format === "doubles") summary.doubles += 1;
    summaries.set(match.season_year, summary);
  });

  return Array.from(summaries.values()).sort((a, b) => b.seasonYear - a.seasonYear);
}

function getFriendlyError(error: { message?: string; code?: string } | null) {
  const message = error?.message || "Something went wrong. Please try again.";

  if (message.includes("self_assessment") || message.includes("player_self_assessment_check") || message.includes("players_self_assessment_check")) {
    return "That skill level is not accepted by the database yet. Please run the latest self-assessment migration and try again.";
  }

  if (message.includes("duplicate key")) {
    return "This record already exists. If this is your profile, try searching and claiming it instead.";
  }

  if (message.includes("row-level security") || message.includes("violates row-level security")) {
    return "You do not have permission to save this yet. Please sign in again or contact an admin.";
  }

  if (message.includes("storage") || message.includes("bucket")) {
    return "Photo upload failed. Please try a smaller image or run the profile photo storage migration.";
  }

  return message;
}

async function getTennisSportId() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.from("sports").select("id").eq("slug", "tennis").single();
  return data?.id || null;
}

async function uploadCompressedProfilePhoto(userId: string, file: File) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const compressed = await compressImage(file);
  const path = `${userId}/${Date.now()}.webp`;
  const { error } = await supabase.storage.from("profile-photos").upload(path, compressed, {
    contentType: "image/webp",
    upsert: true
  });
  if (error) return null;
  const { data } = supabase.storage.from("profile-photos").getPublicUrl(path);
  return data.publicUrl;
}

function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const maxSize = 900;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Canvas is unavailable."));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Could not compress image."));
          return;
        }
        resolve(blob);
      }, "image/webp", 0.78);
    };
    image.onerror = () => reject(new Error("Could not read image."));
    image.src = URL.createObjectURL(file);
  });
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "P") + (parts[parts.length - 1]?.[0] || "");
}

function ProfileField({
  label,
  value,
  displayValue,
  helper,
  editing = false,
  onEdit,
  onChange,
  inputRef,
  inputType = "text",
  max
}: {
  label: string;
  value: string;
  displayValue?: string;
  helper?: ReactNode;
  editing?: boolean;
  onEdit?: () => void;
  onChange?: (value: string) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  inputType?: string;
  max?: string;
}) {
  return (
    <article className={editing ? "grid gap-2 rounded-[14px] border-hairline border-[#bdd7aa] bg-white p-4 shadow-[0_8px_20px_rgba(12,59,32,0.04)]" : "grid gap-2 rounded-[14px] border-hairline border-line bg-card p-4"}>
      <span className="text-[13px] text-text-secondary">{label}</span>
      {editing ? (
        <input ref={inputRef} className="min-h-11 rounded-[12px] border-hairline border-brand bg-white px-3 text-[16px] text-text-primary outline-none transition ring-2 ring-brand-light placeholder:text-text-muted focus:border-brand focus:ring-4 focus:ring-brand-light" value={value} onChange={(event) => onChange?.(event.target.value)} aria-label={label} type={inputType} max={max} />
      ) : (
        <button className="tap-card grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-left" type="button" onClick={onEdit}>
          <strong className="break-words text-[17px] font-medium text-text-primary">{displayValue || value || "Not set"}</strong>
          <Pencil className="text-text-muted" size={14} aria-hidden="true" />
        </button>
      )}
      {helper && <em className="text-[13px] not-italic text-brand">{helper}</em>}
    </article>
  );
}

function BottomNav({ active, showAdmin }: { active: Tab; showAdmin: boolean }) {
  const appSession = useAppSession();
  const tabs = [
    { id: "home" as const, href: "/dashboard", label: "Home", icon: Home },
    { id: "tournament" as const, href: "/tournaments", label: "Tournament", icon: Trophy },
    { id: "profile" as const, href: "/profile", label: "Profile", icon: UsersRound },
    ...(showAdmin ? [{ id: "admin" as const, href: "/admin", label: "Admin", icon: Shield }] : [])
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 grid border-t-hairline border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0.72))] px-4 py-3 shadow-[0_-18px_44px_rgba(24,24,26,0.08)] backdrop-blur-2xl md:inset-x-6 md:bottom-4 md:mx-auto md:max-w-shell md:rounded-[24px] md:border-hairline md:shadow-[0_18px_50px_rgba(24,24,26,0.12)] lg:left-1/2 lg:right-auto lg:w-[min(760px,calc(100vw-64px))] lg:-translate-x-1/2"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`, paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      aria-label="Primary mobile navigation"
    >
      {tabs.map(({ id, href, label, icon: Icon }) => (
        <Link className={active === id ? "grid min-h-12 place-items-center content-center gap-1 rounded-[16px] bg-white/45 text-brand" : "grid min-h-12 place-items-center content-center gap-1 rounded-[16px] text-[#b6b1a8]"} href={href} key={id}>
          {id === "profile" ? (
            <Avatar
              className="relative grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-brand text-[10px] font-medium text-white"
              name={appSession.player?.full_name || "Profile"}
              photoUrl={appSession.player?.profile_photo_url || undefined}
            />
          ) : (
            <Icon size={20} strokeWidth={active === id ? 2.2 : 1.7} />
          )}
          <span className={active === id ? "text-[12px] font-medium leading-none" : "text-[12px] font-normal leading-none"}>{label}</span>
          <span className={active === id ? "h-1 w-1 rounded-full bg-brand" : "h-1 w-1 rounded-full bg-transparent"} />
        </Link>
      ))}
    </nav>
  );
}
