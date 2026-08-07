"use client";

import { AlertCircle, ArrowLeft, ArrowRight, BadgeDollarSign, Calendar, CheckCircle2, ChevronDown, ChevronRight, Clock, Dumbbell, ExternalLink, House, Info, LogIn, LogOut, Mail, MapPin, MonitorUp, Pencil, RefreshCw, Search, Shield, Shirt, Trash2, Trophy, UsersRound, X } from "lucide-react";
import dynamic from "next/dynamic";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, createContext, CSSProperties, FormEvent, Fragment, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseClient } from "./lib/supabase";
import { MRSA_COLORS } from "./design-tokens";

const TournamentHeroAmbience = dynamic(() => import("./tournament-hero-ambience").then((mod) => mod.TournamentHeroAmbience), { ssr: false });

type Tab = "home" | "schedule" | "leaderboard" | "rosters" | "tournament" | "profile" | "admin";
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
  jerseyName: string;
  tennisVideo: string;
  ustaNumber: string;
};

type TopPlayer = { id: string; name: string; rating: string; city: string; profilePhotoUrl: string };
type ChicagoWeather = { city: string; date: string; condition: string; temperatureF: number; highF: number | null; lowF: number | null; isCurrent: boolean };
type AvatarProps = {
  className: string;
  name: string;
  photoUrl?: string;
  ariaLabel?: string;
  sizes?: string;
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
  notes: string | null;
  faqs: TournamentFaq[];
};
type TournamentFaq = { question: string; answer: string };
type RegisteredPlayer = { id: string; name: string; age: string; city: string; rating: string; tennisVideoUrl: string };
type TournamentProfileReminder = { missingPhoto: boolean; missingJerseyName: boolean; missingJerseySize: boolean };
type PublishedTeamMember = { id: string; playerId: string; name: string; age: string; city: string; tier: string; rating: string; profilePhotoUrl: string; isCaptain: boolean; draftOrder: number | null };
type TeamSponsor = { name: string; logoUrl: string; websiteUrl: string };
type PublishedTeam = { id: string; name: string; sortOrder: number; logoUrl: string; jerseyColor: string; sponsorName: string; sponsorLogoUrl: string; sponsors: TeamSponsor[]; members: PublishedTeamMember[] };
type PublishedTeamPlayerRow = { id?: string | null; full_name?: string | null; jamaat_city?: string | null; age?: number | null; date_of_birth?: string | null; rating?: number | string | null; profile_photo_url?: string | null };
type PublishedTeamMemberRow = { id?: string | null; is_captain?: boolean | null; draft_order?: number | null; tier_at_draft?: number | null; players?: PublishedTeamPlayerRow | PublishedTeamPlayerRow[] | null };
type PublishedTeamRow = { id?: string | null; name?: string | null; sort_order?: number | null; logo_url?: string | null; jersey_color?: string | null; sponsor_name?: string | null; sponsor_logo_url?: string | null; sponsors?: unknown; tournament_team_members?: PublishedTeamMemberRow | PublishedTeamMemberRow[] | null };
type ScheduleNote = { id: string; title: string; body: string; sortOrder: number };
type ScheduleItem = {
  id: string;
  itemType: "match" | "event";
  dayNumber: number;
  dayLabel: string;
  timeLabel: string;
  podLabel: string;
  courtLabel: string;
  phase: string;
  matchLabel: string;
  teamASortOrder: number | null;
  teamBSortOrder: number | null;
  teamALabel: string;
  teamBLabel: string;
  detail: string;
  sortOrder: number;
};
type ScheduleTimelineEntry =
  | { kind: "matches"; key: string; label: string; item?: never }
  | { kind: "event"; key: string; label: string; item: ScheduleItem };
type PlayerScheduleMatch = {
  id: string;
  tournamentId: string;
  dayNumber: number;
  dayLabel: string;
  timeLabel: string;
  courtLabel: string;
  podLabel: string;
  format: "Singles" | "Doubles";
  matchType: string;
  matchColor: "Green" | "Red" | "";
  tierRule: string;
  teamSide: "A" | "B";
  teamId: string;
  opposingTeamId: string;
  teamName: string;
  opposingTeamName: string;
  teamColor: string;
  opposingTeamColor: string;
  teamLogoUrl: string;
  opposingTeamLogoUrl: string;
  ballTeamName: string;
  playerSideNames: string[];
  playerSideProfiles: MatchPlayerProfile[];
  partnerNames: string[];
  opponentNames: string[];
  opponentProfiles: MatchPlayerProfile[];
  score: MatchScore | null;
  matchId: string;
  sortOrder: number;
};
type MatchScore = {
  id: string;
  scheduleMatchId: string;
  sideASet1: number | null;
  sideBSet1: number | null;
  sideASet2: number | null;
  sideBSet2: number | null;
  sideASet3: number | null;
  sideBSet3: number | null;
  winnerSide: "A" | "B" | "";
  submittedById: string;
  submittedByName: string;
  submittedAt: string;
};
type MatchPlayerProfile = {
  id: string;
  name: string;
  profilePhotoUrl: string;
};
type TeamCourtScheduleMatch = {
  id: string;
  matchId: string;
  tournamentId: string;
  dayNumber: number;
  dayLabel: string;
  timeLabel: string;
  courtLabel: string;
  podLabel: string;
  teamAId: string;
  teamBId: string;
  teamAName: string;
  teamBName: string;
  teamAColor: string;
  teamBColor: string;
  format: "Singles" | "Doubles";
  matchType: string;
  tierRule: string;
  playersA: string[];
  playersB: string[];
  playerProfilesA: MatchPlayerProfile[];
  playerProfilesB: MatchPlayerProfile[];
  score: MatchScore | null;
  sortOrder: number;
};
type TeamCourtScheduleBlock = {
  id: string;
  primaryTeamId: string;
  opponentTeamId: string;
  primaryTeam: string;
  opponentTeam: string;
  matches: TeamCourtScheduleMatch[];
};
type TeamStanding = {
  team: PublishedTeam;
  seed: number;
  completedMatches: number;
  scheduledMatches: number;
  matchWins: number;
  matchLosses: number;
  setsWon: number;
  setsLost: number;
  gamesWon: number;
  gamesLost: number;
  tieBreakWins: number;
  setWinPercentage: number;
  gameWinPercentage: number;
  requiresReview: boolean;
};
type PlayerStanding = {
  player: PublishedTeamMember;
  team: PublishedTeam;
  tier: string;
  tierNumber: number;
  tierRank: number;
  completedMatches: number;
  matchWins: number;
  matchLosses: number;
  setsWon: number;
  setsLost: number;
  gamesWon: number;
  gamesLost: number;
  tieBreakWins: number;
  setWinPercentage: number;
  gameWinPercentage: number;
};
type BracketStageKey = "quarterfinals" | "second-chance" | "re-entry" | "semifinals" | "final";
type BracketSlot = {
  team: PublishedTeam | null;
  seed: number | null;
  fallbackLabel: string;
};
type TeamTieResult = {
  matches: TeamCourtScheduleMatch[];
  scheduledMatches: number;
  completedMatches: number;
  matchWinsA: number;
  matchWinsB: number;
  setsWonA: number;
  setsWonB: number;
  gamesWonA: number;
  gamesWonB: number;
  winnerTeamId: string;
  loserTeamId: string;
  decidedBy: "match wins" | "set percentage" | "game percentage" | "pending" | "organizer review";
  isClinched: boolean;
  hasTieBreaker: boolean;
};
type LiveBracketNode = {
  id: string;
  label: string;
  phase: string;
  timeLabel: string;
  timeMinutes: number[];
  sideA: BracketSlot;
  sideB: BracketSlot;
  result: TeamTieResult;
};
type DayTwoFormatChoice = "tiers_1_2_singles" | "tiers_3_4_singles";
type DayTwoCoinTossNodeKey = "reentry1" | "reentry2" | "semifinal1" | "semifinal2";
type DayTwoCoinTossDecision = {
  nodeKey: DayTwoCoinTossNodeKey;
  winningTeamId: string;
  formatChoice: DayTwoFormatChoice;
  decidedAt: string;
};
type LiveBracketStage = {
  key: BracketStageKey;
  label: string;
  helper: string;
  nodes: LiveBracketNode[];
};
type PlayerScheduleMatchRow = {
  id: string;
  tournament_id: string | null;
  day_number: number | null;
  day_label: string | null;
  time_label: string | null;
  court_label: string | null;
  pod_label: string | null;
  team_a_id: string | null;
  team_b_id: string | null;
  format: string | null;
  match_type: string | null;
  match_color: string | null;
  tier_rule: string | null;
  team_a_label: string | null;
  team_b_label: string | null;
  external_match_id: string | null;
  sort_order: number | null;
};
type PlayerScheduleParticipantRow = {
  id: string;
  schedule_match_id: string | null;
  team_id: string | null;
  player_id: string | null;
  side: string | null;
  slot: number | null;
  source_player_name: string | null;
};
type MatchScoreRow = {
  id: string;
  schedule_match_id: string;
  side_a_set1: number | null;
  side_b_set1: number | null;
  side_a_set2: number | null;
  side_b_set2: number | null;
  side_a_set3: number | null;
  side_b_set3: number | null;
  winner_side: string | null;
  submitted_by?: string | null;
  submitted_at: string | null;
};
type ScoreDraft = {
  sideASet1: string;
  sideBSet1: string;
  sideASet2: string;
  sideBSet2: string;
  sideASet3: string;
  sideBSet3: string;
};
type ScoreEntryWindow = { canEdit: boolean; label: string };
type TournamentCountdown = {
  state: "countdown" | "today" | "started" | "date_tbd";
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  label: string;
};
type PaymentState = "idle" | "pending" | "failed" | "paid" | "waitlist_pending" | "waitlist_accepted" | "waitlist_rejected";
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
const DEFAULT_TEAM_COLOR = MRSA_COLORS.brandMid;
const videoDescription = "Recommended for draft placement: add a Google Drive link to a short video of you playing. Please set sharing to anyone with the link can view. Include your serve, forehand, backhand, volleys, and a few rally points so captains and organizers can evaluate your level for drafts.";
const memberPageClass = "mrsa-member-page min-h-dvh bg-surface pb-28 font-sans text-text-primary";
const memberMainClass = "mx-auto grid w-full max-w-shell gap-4 px-4 py-5 pb-32 md:px-6 lg:px-8";
const memberHeroClass = "relative grid overflow-hidden rounded-[18px] border-hairline border-white/20 bg-brand-deep p-4 text-white md:p-5";
const tournamentLiveBannerClass = "relative overflow-hidden rounded-[26px] border-hairline border-white/20 bg-[var(--brand-deep)] text-white shadow-[0_22px_52px_rgba(var(--brand-deep-rgb),0.20)]";
const memberHeroEyebrowClass = "text-[12px] font-medium text-white/72";
const memberHeroTitleClass = "max-w-[680px] text-[20px] font-medium leading-[1.12] tracking-[-0.2px] text-white md:text-[24px]";
const memberHeroBodyClass = "max-w-[620px] text-[13px] not-italic leading-relaxed text-white/72 md:text-[14px]";
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
  jersey_name?: string | null;
  tier?: number | string | null;
  rating?: number | string | null;
  tournaments_played?: number | string | null;
  matches_played?: number | string | null;
  tennis_video_url?: string | null;
  tennis_video_status?: string | null;
  usta_number?: string | null;
  usta_prompt_skipped_at?: string | null;
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
  notes?: string | null;
  faqs?: unknown;
};

const initialProfile: ProfileData = {
  fullName: "Player",
  phone: "",
  dateOfBirth: "",
  dominantHand: "",
  selfEvaluation: "",
  jamaatCity: "",
  tier: "",
  rating: "0.000",
  tournamentsPlayed: "0",
  matchesPlayed: "0",
  jerseySize: "",
  jerseyName: "",
  tennisVideo: "",
  ustaNumber: ""
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

function Avatar({ className, name, photoUrl, ariaLabel, sizes = "56px" }: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = Boolean(photoUrl && !imageFailed);

  useEffect(() => {
    setImageFailed(false);
  }, [photoUrl]);

  return (
    <span className={`${className} avatar-fallback`} aria-label={ariaLabel}>
      {showPhoto ? <NextImage src={photoUrl || ""} alt="" fill sizes={sizes} className="object-cover" onError={() => setImageFailed(true)} /> : getInitials(name)}
    </span>
  );
}

function BrandMark() {
  return (
    <span className="mrsa-brand inline-flex items-center gap-3" aria-label="MRSA">
      <span className="mrsa-brand-mark relative h-11 w-11 shrink-0 overflow-hidden md:h-12 md:w-12" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/mrsa-logo.svg" alt="" className="h-full w-full object-contain" />
      </span>
      <strong className="text-[22px] font-extrabold leading-none tracking-[-0.4px] text-brand-deep md:text-[24px]">MRSA</strong>
    </span>
  );
}

function AppTopBar({
  avatarName,
  avatarPhotoUrl,
  publicNextPath = "/dashboard"
}: {
  avatarName?: string | null;
  avatarPhotoUrl?: string | null;
  publicNextPath?: string;
}) {
  const appSession = useAppSession();
  const name = avatarName || appSession.player?.full_name || "Player";
  const photoUrl = avatarPhotoUrl || appSession.player?.profile_photo_url || undefined;
  const isSignedIn = Boolean(appSession.userId);

  return (
    <header className="mrsa-topbar sticky top-0 z-30 border-b-hairline border-line bg-surface/95 px-5 py-4 backdrop-blur-xl sm:px-8 sm:py-5" style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}>
      <div className="mx-auto grid w-full max-w-shell grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <Link className="tap-card inline-flex min-w-0 justify-self-start" href={isSignedIn ? "/dashboard" : "/"} aria-label="MRSA home">
          <BrandMark />
        </Link>
        {isSignedIn ? (
          <Link className="tap-card inline-flex justify-self-end" href="/profile" aria-label={`${name} profile`}>
            <Avatar className="mrsa-topbar-avatar relative grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-brand-deep text-[14px] font-semibold text-white md:h-12 md:w-12" name={name} photoUrl={photoUrl} />
          </Link>
        ) : (
          <Link className="tap-card inline-flex min-h-10 items-center justify-center gap-2 justify-self-end rounded-full border-hairline border-line bg-white px-3.5 text-[13px] font-medium text-brand shadow-[0_8px_20px_rgba(var(--brand-deep-rgb),0.06)]" href={`/?next=${encodeURIComponent(normalizeNextPath(publicNextPath))}`}>
            <LogIn size={15} />
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}

function PageGreeting({ subtitle }: { subtitle: string }) {
  const appSession = useAppSession();
  const firstName = appSession.player?.full_name?.split(" ")[0] || "there";
  return (
    <div className="mb-1">
      <div className="text-[17px] font-medium text-text-primary">Hi {firstName}</div>
      <div className="text-[13px] text-text-secondary">{subtitle}</div>
    </div>
  );
}

function HomeGreeting({ weather, loading, message }: { weather: ChicagoWeather | null; loading: boolean; message: string }) {
  const appSession = useAppSession();
  const firstName = appSession.player?.full_name?.trim().split(/\s+/)[0] || "there";
  const weatherDate = weather?.date
    ? new Date(`${weather.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Chicago" })
    : "";
  const venueWeatherSummary = weather
    ? weather.isCurrent
      ? `${weather.temperatureF}° at the venue · ${weather.condition.toLowerCase()}`
      : `${weather.highF ?? weather.temperatureF}° at the venue · ${weather.condition.toLowerCase()} on ${weatherDate}`
    : loading ? "Checking the temperature at the venue…" : message || "Venue temperature is unavailable.";
  return (
    <section className="home-dashboard-greeting mx-auto grid w-full max-w-[600px] gap-1.5 lg:max-w-none" aria-labelledby="home-greeting-title">
      <h1 className="break-words font-extrabold leading-[1.1] tracking-[-0.5px] text-text-primary" id="home-greeting-title">Hey {firstName}</h1>
      <p className="inline-flex w-fit max-w-full items-center gap-1.5 rounded-full border-hairline border-[var(--brand-primary-line)] bg-brand-light px-2.5 py-1.5 font-medium leading-snug tracking-[-0.1px] text-text-secondary" aria-live="polite">
        <MapPin className="shrink-0 text-brand" size={13} strokeWidth={2.2} />
        <span>{venueWeatherSummary}</span>
      </p>
    </section>
  );
}

const winnerConfettiColors = ["var(--accent)", "var(--celebration-pink)", "var(--celebration-cyan)", "var(--celebration-gold)", "var(--celebration-purple)", "var(--accent)", "var(--celebration-orange)", "var(--celebration-red)", "var(--brand-primary)", "var(--celebration-yellow)", "var(--card)"];
const winnerConfettiPieces = Array.from({ length: 132 }, (_, index) => {
  const angle = (18 + ((index * 53) % 145)) * (Math.PI / 180);
  const travel = 68 + ((index * 19) % 56);
  const midTravel = travel * (0.48 + (index % 5) * 0.035);
  const xDirection = Math.cos(angle);
  const yDirection = Math.sin(angle);
  return {
    color: winnerConfettiColors[index % winnerConfettiColors.length],
    delay: `${(index % 16) * 22}ms`,
    duration: `${2350 + ((index * 41) % 1150)}ms`,
    x: `${(xDirection * midTravel).toFixed(1)}vw`,
    y: `${(-yDirection * midTravel).toFixed(1)}vh`,
    endY: `${(-yDirection * travel).toFixed(1)}vh`,
    drift: `${(xDirection * travel).toFixed(1)}vw`,
    rotation: `${(xDirection >= 0 ? 1 : -1) * (420 + ((index * 47) % 700))}deg`,
    width: `${6 + (index % 5)}px`,
    height: `${9 + ((index * 3) % 10)}px`,
    rounded: index % 4 === 0 ? "999px" : index % 4 === 1 ? "1px" : "3px",
    clipPath: index % 9 === 0 ? "polygon(50% 0, 100% 100%, 0 100%)" : "none"
  };
});

const winnerPillPaths = [
  { delay: "180ms", midX: "-30vw", midY: "-28vh", endX: "-43vw", endY: "-48vh", rotation: "-9deg" },
  { delay: "360ms", midX: "2vw", midY: "-36vh", endX: "-8vw", endY: "-64vh", rotation: "5deg" },
  { delay: "540ms", midX: "31vw", midY: "-25vh", endX: "43vw", endY: "-49vh", rotation: "9deg" }
];

const winnerFireworkBursts = [
  { x: "18vw", y: "24vh", delay: "180ms", color: "var(--celebration-cyan)", size: "84px" },
  { x: "78vw", y: "20vh", delay: "520ms", color: "var(--celebration-pink)", size: "104px" },
  { x: "52vw", y: "38vh", delay: "880ms", color: "var(--accent)", size: "92px" },
  { x: "84vw", y: "48vh", delay: "1220ms", color: "var(--celebration-gold)", size: "76px" }
];

function TournamentWinnerBanner({ tournament, team, source }: { tournament: Tournament; team: PublishedTeam; source: "dashboard" | "bracket" }) {
  return (
    <section className="relative mx-auto w-full overflow-hidden rounded-[22px] border border-white/20 bg-brand-deep p-4 text-white sm:p-5" aria-labelledby={`tournament-winner-${source}`}>
      <span className="pointer-events-none absolute inset-0 opacity-35 court-lines" aria-hidden="true" />
      <span className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[var(--accent)]/20 blur-3xl" aria-hidden="true" />
      <div className="relative grid gap-4">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
          <span className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-[17px] border border-white/30 bg-white/95 p-1.5 text-[13px] font-bold text-brand shadow-[0_12px_28px_rgba(var(--brand-deep-rgb),0.20)] sm:h-16 sm:w-16">
            {team.logoUrl ? <NextImage src={team.logoUrl} alt={`${team.name} logo`} fill sizes="64px" className="object-contain p-1.5" /> : getInitials(team.name)}
          </span>
          <span className="grid min-w-0 gap-1">
            <em className="inline-flex w-max items-center gap-1.5 rounded-full bg-[var(--accent)]/15 px-2.5 py-1 text-[9px] font-semibold not-italic uppercase tracking-[0.12em] text-[var(--accent)]"><Trophy size={12} fill="currentColor" /> Tournament champions</em>
            <h2 className="truncate text-[23px] font-semibold leading-tight tracking-[-0.4px] text-white sm:text-[30px]" id={`tournament-winner-${source}`}>{team.name}</h2>
            <p className="truncate text-[11px] text-white/72 sm:text-[12px]">{tournament.name}</p>
          </span>
          <Link className="col-span-2 inline-flex min-h-11 w-full items-center justify-center gap-1 rounded-full border border-white/15 bg-white/10 px-4 text-[12px] font-semibold text-white backdrop-blur transition hover:bg-white/15 active:scale-[0.98] sm:col-span-1 sm:w-max" href="/tournaments/bracket?day=2">
            Championship bracket <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid gap-2 border-t border-white/12 pt-3">
          <span className="text-[9px] font-semibold uppercase tracking-[0.13em] text-white/72">Winning roster · {team.members.length} players</span>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" aria-label={`${team.name} winning players`}>
            {team.members.map((player) => (
              <Link className="inline-flex min-h-10 min-w-0 items-center gap-2 rounded-full border border-white/12 bg-white/10 py-1.5 pl-1.5 pr-2 text-[11px] font-medium text-white backdrop-blur transition hover:bg-white/16 active:scale-[0.98] sm:w-max sm:shrink-0 sm:pr-3" href={`/tournaments/players/${player.playerId}?from=${source}`} key={player.id}>
                <Avatar className="relative grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full bg-white/90 text-[9px] font-semibold text-brand" name={player.name} photoUrl={player.profilePhotoUrl} sizes="28px" />
                <span className="min-w-0 truncate sm:max-w-[150px]">{player.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TournamentWinnerCelebration({ tournamentId, team, autoPlay = false }: { tournamentId: string; team: PublishedTeam; autoPlay?: boolean }) {
  const [burstId, setBurstId] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const stopTimerRef = useRef<number | null>(null);
  const winnerPillTone = getTeamBrandTone(team.jerseyColor);
  const celebrate = useCallback(() => {
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    setBurstId((current) => current + 1);
    setCelebrating(true);
    stopTimerRef.current = window.setTimeout(() => setCelebrating(false), 5600);
  }, []);

  useEffect(() => () => {
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
  }, []);

  useEffect(() => {
    if (!autoPlay || !tournamentId || !team.id) return;
    celebrate();
  }, [autoPlay, celebrate, team.id, tournamentId]);

  return (
    <>
      {celebrating && (
        <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" key={burstId} aria-hidden="true">
          {winnerConfettiPieces.map((piece, index) => (
            <span
              className="winner-confetti-piece"
              key={index}
              style={{
                "--confetti-delay": piece.delay,
                "--confetti-duration": piece.duration,
                "--confetti-x": piece.x,
                "--confetti-y": piece.y,
                "--confetti-end-y": piece.endY,
                "--confetti-drift": piece.drift,
                "--confetti-rotation": piece.rotation,
                backgroundColor: piece.color,
                borderRadius: piece.rounded,
                clipPath: piece.clipPath,
                height: piece.height,
                width: piece.width
              } as CSSProperties}
            />
          ))}
          {winnerFireworkBursts.map((burst) => (
            <span
              className="winner-firework"
              key={`${burst.x}:${burst.y}`}
              style={{
                "--firework-x": burst.x,
                "--firework-y": burst.y,
                "--firework-delay": burst.delay,
                "--firework-color": burst.color,
                "--firework-size": burst.size
              } as CSSProperties}
            >
              {Array.from({ length: 16 }).map((_, sparkIndex) => (
                <span className="winner-firework-spark" style={{ "--firework-angle": `${sparkIndex * 22.5}deg` } as CSSProperties} key={sparkIndex} />
              ))}
            </span>
          ))}
          {winnerPillPaths.map((path) => (
            <span
              className="winner-team-pill"
              key={path.midX}
              style={{
                "--winner-pill-delay": path.delay,
                "--winner-pill-mid-x": path.midX,
                "--winner-pill-mid-y": path.midY,
                "--winner-pill-end-x": path.endX,
                "--winner-pill-end-y": path.endY,
                "--winner-pill-rotation": path.rotation,
                "--winner-pill-bg": winnerPillTone.background,
                "--winner-pill-border": winnerPillTone.borderColor,
                "--winner-pill-color": winnerPillTone.textColor
              } as CSSProperties}
            >
              <Trophy size={15} fill="currentColor" aria-hidden="true" />
              <strong>{team.name}</strong>
            </span>
          ))}
        </div>
      )}
      <span className="sr-only" role="status" aria-live="polite">{celebrating ? `Celebrating tournament champions ${team.name}` : ""}</span>
      <button
        className="winner-celebration-button fixed bottom-[calc(88px+env(safe-area-inset-bottom))] left-1/2 z-[61] inline-flex min-h-11 max-w-[calc(100vw-32px)] -translate-x-1/2 items-center justify-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold opacity-100 shadow-[0_14px_38px_rgba(var(--brand-deep-rgb), 0.24)] transition hover:brightness-95 active:scale-[0.98] md:bottom-[116px]"
        style={{ background: winnerPillTone.background, borderColor: winnerPillTone.borderColor, color: winnerPillTone.textColor }}
        type="button"
        onClick={celebrate}
        aria-label={`Celebrate tournament champions ${team.name}`}
      >
        <Trophy size={16} fill="currentColor" />
        <span className="truncate">Celebrate {team.name}</span>
      </button>
    </>
  );
}

function getChicagoDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function getChicagoMinutes(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value || 0);
  return value("hour") * 60 + value("minute");
}

function getHomeTournamentWeatherDate(tournament: Tournament | null) {
  const today = getChicagoDateKey();
  if (!tournament?.startsOn) return today;
  const endDate = tournament.endsOn || tournament.startsOn;
  if (today >= tournament.startsOn && today <= endDate) return today;
  if (today < tournament.startsOn) return tournament.startsOn;
  return endDate;
}

function StatusMessage({ tone = "info", children }: { tone?: "info" | "success" | "error" | "warning"; children: ReactNode }) {
  const toneClass = {
    info: "border-line bg-card text-text-secondary",
    success: "border-[var(--accent-line)] bg-accent-tint text-[var(--accent-ink)]",
    error: "border-[var(--error-line)] bg-[var(--error-surface)] text-[var(--error)]",
    warning: "border-[var(--warning-line)] bg-[var(--warning-tint)] text-[var(--warning-ink)]"
  }[tone];
  const Icon = tone === "success" ? CheckCircle2 : tone === "error" ? AlertCircle : Info;

  return (
    <p className={`inline-flex items-start gap-2 rounded-card border-hairline p-4 text-[15px] leading-relaxed ${toneClass}`}>
      <Icon className="mt-0.5 shrink-0" size={16} />
      <span>{children}</span>
    </p>
  );
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden="true" fill="currentColor" height={size} viewBox="0 0 24 24" width={size}>
      <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.15 1.6 5.95L0 24l6.28-1.65a11.9 11.9 0 0 0 5.8 1.48h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.18-3.5-8.42Zm-8.43 18.33h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.73.98 1-3.64-.24-.37a9.87 9.87 0 0 1-1.51-5.26c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.13 1.03 7 2.9a9.84 9.84 0 0 1 2.9 7c0 5.46-4.44 9.88-9.9 9.88Zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
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
  if (!nextPath) return "/dashboard";
  if (nextPath === "/dashboard" || nextPath.startsWith("/dashboard?")) return nextPath;
  if (nextPath === "/tournaments" || nextPath.startsWith("/tournaments/") || nextPath.startsWith("/tournaments?")) return nextPath;
  return "/dashboard";
}

function buildProfileCompletionPath(playerId: string | undefined, nextPath?: string | null) {
  const params = new URLSearchParams({ next: normalizeNextPath(nextPath) });
  if (playerId) params.set("claim", playerId);
  return `/profile/new?${params.toString()}`;
}

function buildTournamentProfileEditPath(tournamentId: string) {
  const params = new URLSearchParams({
    edit: "tournamentProfile",
    next: "/tournaments",
    tournament: tournamentId
  });
  return `/profile?${params.toString()}`;
}

function getTournamentProfileReminder(profile: DbProfileRow | null | undefined, shirtName: string): TournamentProfileReminder | null {
  const missingPhoto = !profile?.profile_photo_url?.trim();
  const missingJerseyName = !profile?.jersey_name?.trim() && !shirtName.trim();
  const missingJerseySize = !profile?.jersey_size?.trim();
  return missingPhoto || missingJerseyName || missingJerseySize ? { missingPhoto, missingJerseyName, missingJerseySize } : null;
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
        .select("id, auth_user_id, full_name, phone, age, date_of_birth, profile_photo_url, jamaat_city, self_assessment, dominant_hand, jersey_size, jersey_name, tennis_video_url, tennis_video_status, usta_number, usta_prompt_skipped_at, tier, rating, tournaments_played, matches_played, claim_status, claim_requested_by")
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
      <div className={memberPageClass}>
        <main className="mx-auto grid min-h-dvh w-full max-w-[420px] content-center px-4 py-4 md:max-w-[440px] md:py-5">
          <section className="overflow-hidden rounded-[18px] border-hairline border-line bg-white shadow-[0_18px_46px_rgba(var(--brand-deep-rgb), 0.10)]">
            <div className="relative overflow-hidden bg-brand-deep px-5 pb-5 pt-5 text-white">
              <div className="pointer-events-none absolute inset-0 text-white opacity-[0.07]" aria-hidden="true">
                <svg className="h-full w-full scale-125" viewBox="0 0 340 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="22" y="18" width="296" height="184" stroke="currentColor" strokeWidth="1.1" />
                  <path d="M22 110H318M170 18V202M88 18V202M252 18V202M88 65H252M88 155H252" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              </div>
              <div className="relative z-10 grid justify-items-center gap-4 text-center">
                <span className="grid h-24 w-24 place-items-center rounded-full bg-white shadow-[0_12px_30px_rgba(var(--brand-deep-rgb),0.14)] ring-1 ring-white/75 md:h-28 md:w-28">
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden md:h-20 md:w-20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/mrsa-logo.svg" alt="MRSA" className="h-full w-full object-contain" />
                  </span>
                </span>
                <div className="grid gap-2">
                  <h1 className="max-w-[300px] text-[24px] font-medium leading-[1.08] text-white md:text-[28px]">Sign in to your MRSA profile</h1>
                </div>
              </div>
            </div>

            <div className="relative z-10 grid gap-4 bg-white px-5 py-5 md:px-6">
              <div className="grid gap-1 text-center">
                <h2 className="text-[18px] font-medium text-text-primary">Welcome</h2>
                <p className="text-[14px] leading-relaxed text-text-secondary">First time? Use an email you prefer to set up your profile. Already signed up? Sign in with the same email.</p>
              </div>
              <form className="grid gap-4" onSubmit={sendOtp}>
                <label className="grid gap-2 text-caption text-text-secondary" htmlFor="email">
                  Email address
                  <span className="grid min-h-12 grid-cols-[minmax(0,1fr)_auto] items-center rounded-card border-hairline border-line bg-surface px-3 transition focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-light">
                    <input className="min-h-11 bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted" id="email" name="email" type="email" placeholder="Enter email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
                    <Mail size={16} className="text-brand" />
                  </span>
                </label>
                <button className="tap-card inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-card bg-brand-deep px-4 text-center text-sm font-medium text-white shadow-[0_14px_28px_rgba(var(--brand-deep-rgb), 0.18)] disabled:opacity-60" type="submit" disabled={loading}>
                  <LogIn size={16} />
                  {loading ? "Sending code..." : "Send one-time code"}
                </button>
                {message && <StatusMessage tone={message.includes("sent") ? "success" : "error"}>{message}</StatusMessage>}
              </form>
              <div className="border-t-hairline border-line pt-4">
                <Link className="tap-card inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-card border-hairline border-brand/20 bg-[var(--surface)] px-4 text-sm font-medium text-brand shadow-[0_10px_24px_rgba(var(--brand-deep-rgb), 0.06)]" href="/">
                  Skip sign in
                  <ArrowRight size={15} />
                </Link>
              </div>
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
      <div className={memberPageClass}>
        <main className="mx-auto grid min-h-dvh w-full max-w-[420px] content-center px-4 py-6 md:max-w-[440px]">
          <section className="overflow-hidden rounded-[18px] border-hairline border-line bg-white shadow-[0_18px_46px_rgba(var(--brand-deep-rgb), 0.10)]">
            <div className="relative overflow-hidden bg-brand-deep px-5 pb-5 pt-5 text-white">
              <div className="pointer-events-none absolute inset-0 text-white opacity-[0.07]" aria-hidden="true">
                <svg className="h-full w-full scale-125" viewBox="0 0 340 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="22" y="18" width="296" height="184" stroke="currentColor" strokeWidth="1.1" />
                  <path d="M22 110H318M170 18V202M88 18V202M252 18V202M88 65H252M88 155H252" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              </div>
              <div className="relative z-10 grid justify-items-center gap-4 text-center">
                <span className="grid h-24 w-24 place-items-center rounded-full bg-white shadow-[0_12px_30px_rgba(var(--brand-deep-rgb),0.14)] ring-1 ring-white/75 md:h-28 md:w-28">
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden md:h-20 md:w-20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/mrsa-logo.svg" alt="MRSA" className="h-full w-full object-contain" />
                  </span>
                </span>
                <div className="grid gap-2">
                  <h1 className="max-w-[300px] text-[24px] font-medium leading-[1.08] text-white md:text-[28px]">Enter your one-time code</h1>
                </div>
              </div>
            </div>

            <div className="relative z-10 grid gap-4 bg-white px-5 py-5 md:px-6">
              <div className="grid gap-1 text-center">
                <p className="truncate text-[14px] leading-relaxed text-text-secondary">Code has been sent to {email}</p>
              </div>
              <form className="grid gap-3" onSubmit={verifyOtp}>
                <input type="hidden" name="email" value={email} />
                <label className="grid gap-2 text-caption text-text-secondary" htmlFor="otp">
                  <span className="grid min-h-12 items-center rounded-card border-hairline border-line bg-surface px-3 transition focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-light">
                    <input id="otp" name="otp" className="min-h-11 w-full bg-transparent text-center font-sans text-[22px] font-medium tracking-[0.14em] text-text-primary outline-none placeholder:tracking-normal placeholder:text-text-muted md:text-[24px] md:tracking-[0.24em]" inputMode="numeric" maxLength={10} placeholder="Enter code" value={otp} onChange={(event) => setOtp(event.target.value)} required />
                  </span>
                </label>
                <button className="tap-card inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-card bg-brand-deep px-4 text-center text-sm font-medium text-white shadow-[0_14px_28px_rgba(var(--brand-deep-rgb), 0.18)] disabled:opacity-60" type="submit" disabled={loading}>
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
  }, [appSession.player, appSession.ready, appSession.userId]);

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
      <div className={memberPageClass}>
        <header className="sticky top-0 z-30 border-b-hairline border-white/70 bg-white/75 px-4 py-2.5 shadow-[0_10px_30px_rgba(var(--brand-deep-rgb),0.04)] backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-shell items-center justify-center">
            <Link className="inline-flex" href="/" aria-label="MRSA home">
              <BrandMark />
            </Link>
          </div>
        </header>

        <main className="mx-auto grid w-full max-w-[980px] gap-4 px-4 py-5 pb-24 md:px-6 md:py-6">
          <section className="grid min-w-0 overflow-hidden rounded-[18px] border-hairline border-line bg-card shadow-[0_18px_46px_rgba(var(--brand-deep-rgb), 0.10)] md:grid-cols-[0.85fr_1.15fr]">
            <div className="relative min-h-[210px] min-w-0 overflow-hidden bg-brand-deep p-4 text-white md:min-h-0 md:p-6">
              <div className="pointer-events-none absolute inset-0 text-white opacity-[0.08]" aria-hidden="true">
                <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>
              <div className="relative z-10 grid h-full min-w-0 content-center gap-3 md:gap-4">
                <OnboardingStep step={2} total={3} label="Find profile" />
                <h1 className="max-w-[420px] text-[24px] font-medium leading-[1.08] tracking-[-0.2px] text-white md:text-[28px]">Returning player?</h1>
                <p className={memberHeroBodyClass}>Search past MRSA player profiles and continue with your existing tournament history.</p>
              </div>
            </div>

            <div className="grid min-w-0 content-start gap-4 bg-white p-4 md:p-5">
              <div className="grid min-w-0 gap-2">
                <h2 className="text-[20px] font-medium leading-tight tracking-[-0.2px] text-text-primary">Find your profile</h2>
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
                      <span className={index % 5 === 0 ? "grid h-9 w-9 place-items-center rounded-full bg-[var(--avatar-peach)] text-[13px] font-medium text-[var(--avatar-peach-ink)]" : index % 5 === 1 ? "grid h-9 w-9 place-items-center rounded-full bg-[var(--brand-primary-tint)] text-[13px] font-medium text-[var(--brand-primary-text)]" : index % 5 === 2 ? "grid h-9 w-9 place-items-center rounded-full bg-[var(--brand-primary-tint)] text-[13px] font-medium text-[var(--accent-ink)]" : index % 5 === 3 ? "grid h-9 w-9 place-items-center rounded-full bg-[var(--avatar-pink)] text-[13px] font-medium text-[var(--avatar-pink-ink)]" : "grid h-9 w-9 place-items-center rounded-full bg-[var(--surface)] text-[13px] font-medium text-[var(--mist)]"}>{getInitials(player.name)}</span>
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
                <div className="grid gap-3 rounded-[14px] border-hairline border-[var(--warning-line)] bg-[var(--warning-tint)] p-4">
                  <span className="inline-flex w-max items-center rounded-full bg-[var(--urgent-tint)] px-2.5 py-1 text-[13px] font-medium text-[var(--urgent-ink)]">Profile ownership check</span>
                  <strong className="text-[17px] font-medium text-text-primary">Only continue if this is your player profile.</strong>
                  <em className="text-[14px] not-italic leading-relaxed text-[var(--warning-ink)]">You are about to claim {selectedPlayer.name}. This links the historical rating, city, and tournament record to your login. If this is not you, choose a different profile or create a first-time player profile.</em>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button className="tap-card min-h-10 rounded-[14px] bg-brand-deep px-4 text-xs font-medium text-white" type="button" onClick={() => openClaimConfirmation(selectedPlayer)}>
                      Yes, this is me
                    </button>
                    <button className="tap-card min-h-10 rounded-[14px] border-hairline border-line bg-card px-4 text-xs font-medium text-brand" type="button" onClick={() => setSelectedPlayer(null)}>Cancel</button>
                  </div>
                </div>
              )}

              <div className="grid gap-3 rounded-[14px] border-hairline border-line bg-card p-3">
                <p className="text-[15px] text-text-secondary">New or first time players can create a new MRSA profile.</p>
                <Link className="tap-card inline-flex min-h-11 w-full items-center justify-center rounded-[14px] bg-brand-deep px-4 text-sm font-medium text-white" href={`/profile/new?next=${encodeURIComponent(destinationPath)}`}>First time player</Link>
              </div>
              {claimStatus === "rejected" && rejectionNote && (
                <StatusMessage tone="warning">Admin note: {rejectionNote}</StatusMessage>
              )}
              {message && <StatusMessage tone={claimStatus === "rejected" ? "warning" : "info"}>{message}</StatusMessage>}
            </div>
          </section>
        </main>
        {confirmClaimId && selectedPlayer && (
          <div className="fixed inset-0 z-50 grid place-items-end bg-[rgba(var(--brand-deep-rgb),0.35)] px-3 pb-3 pt-16 backdrop-blur-sm sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="claim-confirm-title">
            <section className="grid w-full max-w-[520px] gap-4 rounded-hero border-hairline border-white/80 bg-white/95 p-5 shadow-hero backdrop-blur-xl">
              <div className="grid gap-2">
                <span className="inline-flex w-max items-center rounded-full bg-accent-tint px-3 py-1 text-[13px] font-medium text-[var(--accent-ink)]">Confirm profile claim</span>
                <h2 className="text-2xl font-medium leading-tight text-text-primary" id="claim-confirm-title">You are claiming {selectedPlayer.name}.</h2>
                <p className="text-[15px] leading-relaxed text-text-secondary">This links your sign-in to this MRSA player record permanently after admin review. Confirm only if the city, tier, and rating below match you.</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <article className="rounded-card border-hairline border-line bg-card p-3"><span className="text-[12px] text-text-secondary">City</span><strong className="block truncate text-[15px] text-text-primary">{selectedPlayer.city}</strong></article>
                <article className="rounded-card border-hairline border-line bg-card p-3"><span className="text-[12px] text-text-secondary">Tier</span><strong className="block text-[15px] text-text-primary">Tier {selectedPlayer.tier}</strong></article>
                <article className="rounded-card border-hairline border-line bg-card p-3"><span className="text-[12px] text-text-secondary">Rating</span><strong className="block text-[15px] text-text-primary">{selectedPlayer.rating}</strong></article>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <button className="tap-card inline-flex min-h-11 items-center justify-center rounded-card bg-brand-deep px-4 text-sm font-medium text-white" type="button" onClick={() => claimProfile(selectedPlayer)}>Confirm claim</button>
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
        .select("id, auth_user_id, full_name, phone, age, date_of_birth, profile_photo_url, jamaat_city, self_assessment, jersey_size, jersey_name, tennis_video_url, tennis_video_status, usta_number, usta_prompt_skipped_at, claim_status, claim_requested_by")
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
      jersey_name: String(form.get("jerseyName") || "").trim() || undefined,
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
      <div className={memberPageClass}>
        <header className="sticky top-0 z-30 border-b-hairline border-white/70 bg-white/75 px-4 py-2.5 shadow-[0_10px_30px_rgba(var(--brand-deep-rgb),0.04)] backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-shell items-center justify-center">
            <Link className="inline-flex" href="/" aria-label="MRSA home">
              <BrandMark />
            </Link>
          </div>
        </header>

        <main className="mx-auto grid w-full max-w-shell gap-4 px-4 py-5 pb-24 md:px-6 lg:px-8">
          <section className={`${memberHeroClass} md:grid-cols-[minmax(0,1fr)_minmax(240px,320px)] md:items-center md:gap-5`}>
            <div className="pointer-events-none absolute inset-0 -right-16 -top-6 text-white opacity-[0.06]" aria-hidden="true">
              <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="relative grid gap-3">
              <OnboardingStep step={3} total={3} label={claimPlayerId ? "Complete claim" : "Create profile"} />
              <h1 className={memberHeroTitleClass}>{isCompletingExistingProfile ? "Complete your profile." : claimPlayerId ? "Complete your profile." : "New MRSA player."}</h1>
              <p className={memberHeroBodyClass}>{isCompletingExistingProfile && missingSummary ? `Please add ${missingSummary} before continuing.` : claimPlayerId ? "Add the required details so admin can review your profile claim and connect your history." : `Create your profile once. New players start at Tier ${startingTennisTier} with a ${startingTennisRating.toFixed(3)} rating.`}</p>
            </div>
            <div className="relative mt-3 grid gap-1.5 rounded-[14px] border-hairline border-white/10 bg-white/[0.08] p-3 md:mt-0">
              <span className={memberHeroEyebrowClass}>{isCompletingExistingProfile ? "Missing required fields" : claimPlayerId ? "Claimed profile" : "Assigned after signup"}</span>
              <strong className="text-[16px] font-medium text-white">{isCompletingExistingProfile && missingSummary ? missingSummary : claimPlayerId ? "Existing tier and rating kept" : `Tier ${startingTennisTier} · Rating ${startingTennisRating.toFixed(3)}`}</strong>
              <em className="text-[13px] not-italic text-white/72">{isCompletingExistingProfile ? "Your profile is saved after these are added." : claimPlayerId ? "Admin can approve or reject this claim." : "0 tournaments played · 0 matches played"}</em>
            </div>
          </section>

          <form className="grid gap-4" onSubmit={createPlayer}>
            {missingFields.length > 0 && (
              <section className="grid gap-2 rounded-[18px] border-hairline border-[var(--warning-line)] bg-[var(--warning-tint)] p-4">
                <strong className="text-[17px] font-medium text-[var(--warning-ink)]">Please add {missingSummary}.</strong>
                <em className="text-[14px] not-italic leading-relaxed text-[var(--warning-ink)]/80">We need this before you can continue to tournaments and registration.</em>
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
                Jersey name optional
                <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="jerseyName" type="text" placeholder="Name for shirt roster" defaultValue={claimedProfile?.jersey_name || ""} />
              </label>
              <label className="grid gap-2 text-[13px] text-text-secondary">
                Profile photo optional
                <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 py-2 text-[15px] text-text-primary file:mr-3 file:rounded-full file:border-0 file:bg-accent-tint file:px-3 file:py-1 file:text-[15px] file:font-medium file:text-[var(--accent-ink)]" name="profilePhoto" type="file" accept="image/*" />
              </label>
              <label className="grid gap-2 text-[13px] text-text-secondary md:col-span-2">
                Google Drive playing video recommended for draft placement
                <em className="text-[13px] not-italic leading-relaxed text-text-secondary">{videoDescription}</em>
                <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="tennisVideo" type="text" inputMode="url" placeholder="https://drive.google.com/..." defaultValue={claimedProfile?.tennis_video_url || ""} />
              </label>
            </section>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              {message && <StatusMessage tone={message.startsWith("Please") ? "warning" : "error"}>{message}</StatusMessage>}
              <button className="tap-card inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-brand-deep px-5 text-sm font-medium text-white disabled:opacity-60 md:w-max" type="submit" disabled={loading}>
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
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[80] grid gap-2 rounded-[14px] border-hairline border-line bg-white p-3 shadow-[0_18px_50px_rgba(var(--brand-deep-rgb), 0.12)]">
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
                className={`rounded-[10px] px-3 py-2 text-left text-[15px] transition ${value === city ? "bg-brand-deep !text-white" : "!text-text-primary hover:bg-brand-light"}`}
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
              className={`rounded-[10px] px-3 py-2 text-left text-[15px] transition ${mode === "other" ? "bg-brand-deep !text-white" : "!text-text-primary hover:bg-brand-light"}`}
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
    <div className="fixed inset-0 z-[100] grid place-items-end bg-[rgba(var(--brand-deep-rgb),0.35)] p-3 backdrop-blur-sm sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Shirt size guide" onClick={onClose}>
      <div className="w-full max-w-[520px] overflow-hidden rounded-[24px] border-hairline border-line bg-white shadow-[0_24px_80px_rgba(var(--brand-deep-rgb), 0.18)]" onClick={(event) => event.stopPropagation()}>
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
            <button className={`min-h-10 rounded-[12px] border-hairline px-3 text-[15px] font-medium transition ${selectedSize === size ? "border-brand bg-brand-deep text-white" : "border-line bg-white text-text-primary hover:border-brand"}`} type="button" key={size} onClick={() => onSelect(size)}>
              {size}
            </button>
          ))}
        </div>

        <div className="border-t-hairline border-line p-4">
          <button className="tap-card inline-flex min-h-11 w-full items-center justify-center rounded-[14px] bg-brand-deep px-5 text-sm font-medium text-white" type="button" onClick={onClose}>Use {selectedSize}</button>
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
    jersey_name?: string;
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
  const [homeWeather, setHomeWeather] = useState<ChicagoWeather | null>(null);
  const [homeWeatherLoading, setHomeWeatherLoading] = useState(true);
  const [homeWeatherMessage, setHomeWeatherMessage] = useState("");
  const [dashboardUstaNumber, setDashboardUstaNumber] = useState("");
  const [dashboardUstaMessage, setDashboardUstaMessage] = useState("");
  const [savingDashboardUsta, setSavingDashboardUsta] = useState(false);
  const [showDashboardUstaPrompt, setShowDashboardUstaPrompt] = useState(false);
  const [dashboardUstaDismissed, setDashboardUstaDismissed] = useState(false);
  const [homeCanViewSchedule, setHomeCanViewSchedule] = useState(false);
  const [homeRegistrationResolutionKey, setHomeRegistrationResolutionKey] = useState("");
  const [homeUpcomingMatches, setHomeUpcomingMatches] = useState<PlayerScheduleMatch[]>([]);
  const [homeTournamentChampion, setHomeTournamentChampion] = useState<PublishedTeam | null>(null);
  const homeWeatherDate = getHomeTournamentWeatherDate(upcomingTournament);

  useEffect(() => {
    if (!homeWeatherDate) return;
    const controller = new AbortController();
    setHomeWeatherLoading(true);
    setHomeWeatherMessage("");
    fetch(`/api/weather/chicago?date=${encodeURIComponent(homeWeatherDate)}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as ChicagoWeather & { error?: string };
        if (!response.ok) throw new Error(payload.error || "Chicago weather is unavailable.");
        setHomeWeather(payload);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setHomeWeather(null);
        setHomeWeatherMessage(error instanceof Error ? error.message : "Chicago weather is unavailable.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setHomeWeatherLoading(false);
      });
    return () => controller.abort();
  }, [homeWeatherDate]);

  useEffect(() => {
    if (!appSession.ready || !appSession.userId) return;

    const supabase = getSupabaseClient();
    if (!supabase) {
      setHomeRegistrationResolutionKey(`${appSession.userId}:none`);
      return;
    }

    const loadDashboard = async () => {
      const [{ data: tournamentData }, { data: profileData }, { data: playersData }] = await Promise.all([
        supabase
          .from("tournaments")
          .select("id, name, season_year, status, venue_name, venue_address, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents, max_players, notes, faqs")
	          .in("status", ["registration_open", "registration_closed", "live"])
          .order("starts_on", { ascending: false })
          .limit(1)
          .maybeSingle(),
        appSession.userId
          ? supabase
              .from("players")
              .select("id, full_name, profile_photo_url, usta_number")
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
      setHomeTournamentChampion(null);
      if (tournamentData) {
        const [championTeamsResult, championMatchesResult, championPlayersResult, championScoresResult] = await Promise.all([
          supabase
            .from("tournament_teams")
            .select("id, name, sort_order, logo_url, jersey_color, sponsor_name, sponsor_logo_url, sponsors, tournament_team_members(id, is_captain, draft_order, tier_at_draft, players(id, full_name, jamaat_city, age, date_of_birth, rating, profile_photo_url))")
            .eq("tournament_id", tournamentData.id)
            .eq("is_published", true)
            .order("sort_order", { ascending: true })
            .order("draft_order", { referencedTable: "tournament_team_members", ascending: true })
            .limit(40),
          supabase
            .from("tournament_schedule_matches")
            .select("id, tournament_id, day_number, day_label, time_label, court_label, pod_label, format, match_type, match_color, tier_rule, team_a_id, team_b_id, team_a_label, team_b_label, external_match_id, sort_order")
            .eq("tournament_id", tournamentData.id)
            .eq("is_published", true)
            .order("day_number", { ascending: true })
            .order("sort_order", { ascending: true })
            .limit(300),
          supabase
            .from("tournament_schedule_match_players")
            .select("id, schedule_match_id, team_id, player_id, side, slot, source_player_name")
            .eq("tournament_id", tournamentData.id)
            .limit(1200),
          supabase
            .from("tournament_match_scores")
            .select("id, schedule_match_id, side_a_set1, side_b_set1, side_a_set2, side_b_set2, side_a_set3, side_b_set3, winner_side, submitted_at")
            .eq("tournament_id", tournamentData.id)
            .limit(400)
        ]);
        const championScheduleMissing = isScheduleSchemaMissing(championMatchesResult.error?.message || championPlayersResult.error?.message || "");
        const championScoresMissing = isScoreSchemaMissing(championScoresResult.error?.message || "");
        if (!championTeamsResult.error && !championScheduleMissing && !championMatchesResult.error && !championPlayersResult.error) {
          const championTeams = mapPublishedTeamsFromRows(championTeamsResult.data || []);
          const championScores = championScoresMissing || championScoresResult.error ? [] : mapMatchScores(championScoresResult.data || []);
          const championMatches = mapTeamCourtScheduleMatches(championMatchesResult.data || [], championPlayersResult.data || [], championTeams, championScores);
          setHomeTournamentChampion(getTournamentChampion(championTeams, championMatches));
        }
      }
      if (profileData) {
        setDashboardUstaNumber(profileData.usta_number || "");
      }
      if (profileData && tournamentData) {
        const { data: registration } = await supabase
          .from("tournament_registrations")
          .select("id, status, payment_status, waitlist_status")
          .eq("tournament_id", tournamentData.id)
          .eq("player_id", profileData.id)
          .neq("status", "cancelled")
          .maybeSingle();

        const paidRegistration = Boolean(registration && ["paid", "waived"].includes(registration.payment_status));
        const usesMoizPreview = isMoizSchedulePreviewPlayer(profileData);
        const { data: moizPreviewPlayer } = usesMoizPreview
          ? await supabase
              .from("players")
              .select("id")
              .ilike("full_name", "Moiz Broachwala")
              .limit(1)
              .maybeSingle()
          : { data: null };
        const schedulePlayerId = moizPreviewPlayer?.id || profileData.id;
        const canViewPlayerSchedule = paidRegistration || usesMoizPreview;
        setHomeCanViewSchedule(canViewPlayerSchedule);
        setHomeRegistrationResolutionKey(`${appSession.userId}:${tournamentData.id}`);
        setShowDashboardUstaPrompt(Boolean(paidRegistration && !profileData.usta_number?.trim() && !dashboardUstaDismissed));
        if (canViewPlayerSchedule) {
          const { data: playerMatchRows, error: playerMatchError } = await supabase
            .from("tournament_schedule_match_players")
            .select("schedule_match_id")
            .eq("tournament_id", tournamentData.id)
            .eq("player_id", schedulePlayerId);
          const scheduleMatchIds = [...new Set((playerMatchRows || []).map((row) => row.schedule_match_id).filter(Boolean))] as string[];

          if (!playerMatchError && scheduleMatchIds.length) {
            const [matchesResult, participantsResult, teamsResult, scoresResult] = await Promise.all([
              supabase
                .from("tournament_schedule_matches")
                .select("id, tournament_id, day_number, day_label, time_label, court_label, pod_label, format, match_type, match_color, tier_rule, team_a_id, team_b_id, team_a_label, team_b_label, external_match_id, sort_order")
                .eq("tournament_id", tournamentData.id)
                .eq("is_published", true)
                .in("id", scheduleMatchIds),
              supabase
                .from("tournament_schedule_match_players")
                .select("id, schedule_match_id, team_id, player_id, side, slot, source_player_name")
                .eq("tournament_id", tournamentData.id)
                .in("schedule_match_id", scheduleMatchIds),
              supabase
                .from("tournament_teams")
                .select("id, name, sort_order, logo_url, jersey_color, sponsor_name, sponsor_logo_url, sponsors, tournament_team_members(id, is_captain, draft_order, tier_at_draft, players(id, full_name, jamaat_city, age, date_of_birth, rating, profile_photo_url))")
                .eq("tournament_id", tournamentData.id)
                .eq("is_published", true)
                .order("sort_order", { ascending: true })
                .order("draft_order", { referencedTable: "tournament_team_members", ascending: true })
                .limit(40),
              supabase
                .from("tournament_match_scores")
                .select("id, schedule_match_id, side_a_set1, side_b_set1, side_a_set2, side_b_set2, side_a_set3, side_b_set3, winner_side, submitted_at")
                .eq("tournament_id", tournamentData.id)
                .in("schedule_match_id", scheduleMatchIds)
            ]);

            const scheduleSchemaMissing = isScheduleSchemaMissing(matchesResult.error?.message || participantsResult.error?.message || "");
            const scoreSchemaMissing = isScoreSchemaMissing(scoresResult.error?.message || "");
            if (!scheduleSchemaMissing && !matchesResult.error && !participantsResult.error && !teamsResult.error) {
              const mappedTeams = mapPublishedTeamsFromRows(teamsResult.data || []);
              const mappedScores = scoreSchemaMissing || scoresResult.error ? [] : mapMatchScores(scoresResult.data || []);
              setHomeUpcomingMatches(mapPlayerScheduleMatches(matchesResult.data || [], participantsResult.data || [], mappedTeams, mappedScores, schedulePlayerId));
            } else {
              setHomeUpcomingMatches([]);
            }
          } else {
            setHomeUpcomingMatches([]);
          }
        } else {
          setHomeUpcomingMatches([]);
        }
      } else {
        setHomeCanViewSchedule(false);
        setHomeUpcomingMatches([]);
        setShowDashboardUstaPrompt(false);
        setHomeRegistrationResolutionKey(`${appSession.userId}:${tournamentData?.id || "none"}`);
      }
    };

    loadDashboard();

    const channel = supabase
      .channel("dashboard-live-data")
      .on("postgres_changes", { event: "*", schema: "public", table: "tournaments" }, loadDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_registrations" }, loadDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_schedule_matches" }, loadDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_schedule_match_players" }, loadDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_match_scores" }, loadDashboard)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [appSession.player, appSession.ready, appSession.userId, dashboardUstaDismissed]);

  const saveDashboardUstaNumber = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase || !appSession.player?.id) return;

    const trimmedNumber = dashboardUstaNumber.trim();
    if (!trimmedNumber) {
      setDashboardUstaMessage("Add your USTA number or skip this for now.");
      return;
    }
    setSavingDashboardUsta(true);
    setDashboardUstaMessage("");
    const { error } = await supabase
      .from("players")
      .update({
        usta_number: trimmedNumber,
        usta_prompt_skipped_at: null
      })
      .eq("id", appSession.player.id);
    setSavingDashboardUsta(false);

    if (error) {
      setDashboardUstaMessage(getFriendlyError(error));
      return;
    }

    setShowDashboardUstaPrompt(false);
    setDashboardUstaMessage("USTA number saved.");
    await appSession.refresh();
  };

  const skipDashboardUstaPrompt = () => {
    setDashboardUstaDismissed(true);
    setShowDashboardUstaPrompt(false);
    setDashboardUstaMessage("");
  };

  const homeTournamentCountdown = useTournamentCountdown(upcomingTournament?.startsOn || null);
  const homeIncompleteMatches = homeUpcomingMatches.filter((match) => !match.score?.winnerSide);
  const homePrimaryMatch = homeIncompleteMatches[0] || null;
  const homeSecondMatch = homeIncompleteMatches[1] || null;
  const homeQueuedMatch = homePrimaryMatch
    ? homeIncompleteMatches.slice(1).find((match) => match.dayNumber === homePrimaryMatch.dayNumber) || null
    : null;
  const expectedHomeRegistrationResolutionKey = `${appSession.userId}:${upcomingTournament?.id || "none"}`;
  const homeRegistrationResolved = homeRegistrationResolutionKey === expectedHomeRegistrationResolutionKey;

  if (!appSession.ready || !appSession.userId || !appSession.profileComplete) return null;
  if (homeRegistrationResolved && upcomingTournament && !homeCanViewSchedule) return <GuestHomeScreen allowSignedIn />;

  return (
    <AppFrame active="home">
      <div className={memberPageClass}>
        <AppTopBar />

        <main className="home-dashboard-main mx-auto grid w-full max-w-shell gap-7 px-5 py-6 pb-32 sm:px-8 sm:py-7 lg:px-10">
          <HomeGreeting
            loading={homeWeatherLoading}
            message={homeWeatherMessage}
            weather={homeWeather}
          />

          {upcomingTournament && homeTournamentChampion && (
            <TournamentWinnerBanner source="dashboard" team={homeTournamentChampion} tournament={upcomingTournament} />
          )}

          <div className="home-dashboard-focus grid gap-6 lg:gap-7">
            {upcomingTournament && homeCanViewSchedule && homePrimaryMatch && (
              <section className="home-dashboard-upcoming mx-auto grid w-full max-w-[600px] gap-3 lg:max-w-none" aria-labelledby="home-upcoming-matches-title">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-0.5">
                  <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-text-secondary sm:text-[15px]" id="home-upcoming-matches-title">Up next</h2>
                  <Link className="tap-card inline-flex min-h-8 items-center gap-1 text-[12px] font-semibold text-brand" href="/tournaments/schedule">
                    View full schedule <ArrowRight size={13} />
                  </Link>
                </div>
                <div className={`grid gap-2 ${homeSecondMatch ? "lg:grid-cols-2" : ""}`}>
                  <HomePrimaryMatchCard match={homePrimaryMatch} tournament={upcomingTournament} />
                  {homeSecondMatch && <div className="hidden lg:block lg:h-full [&>.home-dashboard-match-card]:h-full"><HomePrimaryMatchCard match={homeSecondMatch} tournament={upcomingTournament} /></div>}
                </div>
                {homeQueuedMatch && <div className="lg:hidden"><HomeQueuedMatchLine match={homeQueuedMatch} /></div>}
              </section>
            )}

            {upcomingTournament ? homeRegistrationResolved ? (
              <HomeTournamentOverviewCard countdown={homeTournamentCountdown} registered={homeCanViewSchedule} tournament={upcomingTournament} />
            ) : (
              <HomeTournamentOverviewSkeleton />
            ) : homeRegistrationResolved ? (
              <div className="mx-auto w-full max-w-[600px]"><StatusMessage tone="info">No live tournament found.</StatusMessage></div>
            ) : (
              <HomeTournamentOverviewSkeleton />
            )}
          </div>

          <section className="home-dashboard-performers mx-auto grid w-full max-w-[960px] gap-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <strong className="text-[22px] font-extrabold leading-tight tracking-[-0.5px] text-text-primary sm:text-[25px]">Top performers</strong>
              <Link className="home-dashboard-view-all tap-card inline-flex min-h-10 items-center justify-self-end gap-1 rounded-full bg-[var(--surface-subtle)] px-4 py-2 text-[13px] font-bold text-brand-deep" href="/players">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {topPlayers.map((player, index) => (
                <article className="home-dashboard-performer-card grid min-h-[72px] grid-cols-[24px_42px_minmax(0,1fr)_auto] items-center gap-3 rounded-[20px] border-hairline border-line bg-card p-3.5" key={player.id}>
                  <span className={index < 3 ? "text-center text-[14px] font-medium text-[var(--rank-gold)]" : "text-center text-[14px] font-medium text-text-muted"}>{index + 1}</span>
                  <Avatar className={index % 5 === 0 ? "relative grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-[var(--avatar-peach)] text-[12px] font-medium text-[var(--avatar-peach-ink)]" : index % 5 === 1 ? "relative grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-[var(--brand-primary-tint)] text-[12px] font-medium text-[var(--brand-primary-text)]" : index % 5 === 2 ? "relative grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-[var(--brand-primary-tint)] text-[12px] font-medium text-[var(--accent-ink)]" : index % 5 === 3 ? "relative grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-[var(--avatar-pink)] text-[12px] font-medium text-[var(--avatar-pink-ink)]" : "relative grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-[var(--surface)] text-[12px] font-medium text-[var(--mist)]"} name={player.name} photoUrl={player.profilePhotoUrl} ariaLabel={`${player.name} profile photo`} />
                  <span className="grid min-w-0 gap-1">
                    <Link className="tap-card truncate text-[15px] font-medium leading-tight text-text-primary underline decoration-current/20 underline-offset-2 transition hover:decoration-current" href={`/tournaments/players/${player.id}?from=dashboard`}>{player.name}</Link>
                    <em className="truncate text-[13px] not-italic leading-tight text-text-secondary">{player.city}</em>
                  </span>
                  <strong className="rounded-full bg-accent-tint px-2.5 py-1 text-[13px] font-medium text-[var(--accent-ink)]">{player.rating}</strong>
                </article>
              ))}
              {!topPlayers.length && <div className="rounded-[14px] border-hairline border-line bg-card p-4 text-[15px] text-text-secondary">Top performers will appear here.</div>}
            </div>
            <div className="mt-2 grid gap-3 md:grid-cols-2">
              <Link className="tap-card grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-[18px] border-hairline border-line bg-card p-4 transition hover:border-line-strong md:items-center md:p-5" href="/about">
                <span className="grid gap-2">
                  <span className="text-[13px] text-text-secondary">What is MRSA?</span>
                  <strong className="text-lg font-medium leading-tight text-brand">Mumineen Racquet Sports Association</strong>
                  <em className="text-[15px] not-italic leading-relaxed text-text-secondary">A North America-wide community bringing together women through a shared passion for racquet sports — tennis, TT, badminton, and pickleball.</em>
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-full bg-brand-primary text-white" aria-hidden="true">
                  <ArrowRight size={18} />
                </span>
              </Link>
              <Link className="tap-card grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-[18px] border-hairline border-line bg-card p-4 transition hover:border-line-strong md:items-center md:p-5" href="/fitness?from=dashboard">
                <span className="grid gap-2">
                  <span className="text-[13px] text-text-secondary">Fitness</span>
                  <strong className="text-lg font-medium leading-tight text-brand">Tennis fitness regimen</strong>
                  <em className="text-[15px] not-italic leading-relaxed text-text-secondary">Follow the 30-day tournament prep plan shared with players.</em>
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-full bg-[var(--brand-primary-tint)] text-[var(--brand-primary-text)]" aria-hidden="true">
                  <Dumbbell size={18} />
                </span>
              </Link>
            </div>
          </section>
        </main>
        {showDashboardUstaPrompt && (
          <div className="fixed inset-0 z-50 grid place-items-end overflow-y-auto bg-[rgba(var(--brand-deep-rgb),0.35)] px-3 pb-[112px] pt-16 backdrop-blur-sm sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="usta-profile-title">
            <section className="relative grid max-h-[calc(100dvh-150px)] w-full max-w-[520px] gap-4 overflow-y-auto rounded-[24px] border-hairline border-white/80 bg-white p-5 shadow-[0_24px_80px_rgba(var(--brand-deep-rgb),0.22)] sm:max-h-[calc(100dvh-48px)]">
              <button className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border-hairline border-line bg-white text-text-secondary shadow-[0_8px_18px_rgba(var(--brand-deep-rgb),0.08)] transition active:scale-95 disabled:opacity-60" type="button" onClick={skipDashboardUstaPrompt} disabled={savingDashboardUsta} aria-label="Skip USTA number for now">
                <X size={16} />
              </button>
              <div className="grid gap-2 pr-9">
                <span className="inline-flex w-max items-center rounded-full bg-accent-tint px-3 py-1 text-[13px] font-medium text-[var(--accent-ink)]">USTA affiliation</span>
                <h2 className="text-2xl font-medium leading-tight tracking-[-0.4px] text-text-primary" id="usta-profile-title">Add your USTA number</h2>
                <p className="text-[15px] leading-relaxed text-text-secondary">
                  MRSA is now affiliated with USTA. Scores from the upcoming MRSA tournament may count toward your ITF / WTN ranking.
                </p>
                <p className="rounded-[14px] border-hairline border-[var(--accent-line)] bg-accent-tint p-3 text-[14px] leading-relaxed text-[var(--accent-ink)]">
                  If you do not have a USTA profile, create one with the same email you used for MRSA. Please also download the USTA Serve app and log in using that account.
                </p>
                <a className="inline-flex w-max items-center gap-1.5 text-[13px] font-medium text-brand" href="https://www.usta.com/" target="_blank" rel="noreferrer">
                  Create or view USTA profile
                  <ExternalLink size={13} />
                </a>
              </div>
              <form className="grid gap-3" onSubmit={saveDashboardUstaNumber}>
                <label className="grid gap-1.5 text-[13px] text-text-secondary">
                  USTA number
                  <input
                    className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light"
                    value={dashboardUstaNumber}
                    onChange={(event) => setDashboardUstaNumber(event.target.value)}
                    placeholder="Enter USTA number"
                    inputMode="text"
                    autoFocus
                  />
                </label>
                {dashboardUstaMessage && <StatusMessage tone={dashboardUstaMessage === "USTA number saved." ? "success" : "warning"}>{dashboardUstaMessage}</StatusMessage>}
                <div className="grid gap-2 sm:grid-cols-2">
                  <button className="tap-card inline-flex min-h-11 items-center justify-center rounded-[14px] bg-brand-primary px-4 text-sm font-medium text-white transition hover:bg-brand-mid disabled:opacity-60" type="submit" disabled={savingDashboardUsta}>
                    {savingDashboardUsta ? "Saving..." : "Save USTA number"}
                  </button>
                  <button className="tap-card inline-flex min-h-11 items-center justify-center rounded-[14px] border-hairline border-line bg-white px-4 text-sm font-medium text-text-secondary disabled:opacity-60" type="button" onClick={skipDashboardUstaPrompt} disabled={savingDashboardUsta}>
                    Skip for now
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
        {upcomingTournament && homeTournamentChampion && (
          <TournamentWinnerCelebration autoPlay team={homeTournamentChampion} tournamentId={upcomingTournament.id} />
        )}
      </div>
    </AppFrame>
  );
}

export function GuestHomeScreen({ allowSignedIn = false }: { allowSignedIn?: boolean } = {}) {
  const appSession = useAppSession();
  const router = useRouter();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<PublishedTeam[]>([]);
  const [matches, setMatches] = useState<TeamCourtScheduleMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadGuestHome = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage("");
    const { data: tournamentData, error: tournamentError } = await supabase
      .from("tournaments")
      .select("id, name, season_year, status, venue_name, venue_address, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents, max_players, notes, faqs")
      .in("status", ["registration_open", "registration_closed", "live"])
      .order("starts_on", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (tournamentError) {
      setTournament(null);
      setTeams([]);
      setMatches([]);
      setMessage(getFriendlyError(tournamentError));
      setLoading(false);
      return;
    }

    if (!tournamentData) {
      setTournament(null);
      setTeams([]);
      setMatches([]);
      setLoading(false);
      return;
    }

    const mappedTournament = mapTournament(tournamentData);
    setTournament(mappedTournament);
    const [teamsResult, matchesResult, participantsResult, scoresResult] = await Promise.all([
      supabase
        .from("tournament_teams")
        .select("id, name, sort_order, logo_url, jersey_color, sponsor_name, sponsor_logo_url, sponsors, tournament_team_members(id, is_captain, draft_order, tier_at_draft, players(id, full_name, jamaat_city, age, date_of_birth, rating, profile_photo_url))")
        .eq("tournament_id", mappedTournament.id)
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("draft_order", { referencedTable: "tournament_team_members", ascending: true })
        .limit(40),
      supabase
        .from("tournament_schedule_matches")
        .select("id, tournament_id, day_number, day_label, time_label, court_label, pod_label, format, match_type, match_color, tier_rule, team_a_id, team_b_id, team_a_label, team_b_label, external_match_id, sort_order")
        .eq("tournament_id", mappedTournament.id)
        .eq("is_published", true)
        .order("day_number", { ascending: true })
        .order("sort_order", { ascending: true })
        .limit(300),
      supabase
        .from("tournament_schedule_match_players")
        .select("id, schedule_match_id, team_id, player_id, side, slot, source_player_name")
        .eq("tournament_id", mappedTournament.id)
        .limit(1200),
      supabase
        .from("tournament_match_scores")
        .select("id, schedule_match_id, side_a_set1, side_b_set1, side_a_set2, side_b_set2, side_a_set3, side_b_set3, winner_side, submitted_by, submitted_at")
        .eq("tournament_id", mappedTournament.id)
        .limit(400)
    ]);

    const scheduleSchemaMissing = isScheduleSchemaMissing(matchesResult.error?.message || participantsResult.error?.message || "");
    const scoreSchemaMissing = isScoreSchemaMissing(scoresResult.error?.message || "");
    if (teamsResult.error || matchesResult.error || participantsResult.error || scheduleSchemaMissing) {
      setTeams([]);
      setMatches([]);
      setMessage(scheduleSchemaMissing ? "The live tournament schedule is not available yet." : getFriendlyError(teamsResult.error || matchesResult.error || participantsResult.error));
      setLoading(false);
      return;
    }

    const mappedTeams = mapPublishedTeamsFromRows(teamsResult.data || []);
    const mappedScores = scoreSchemaMissing || scoresResult.error ? [] : mapMatchScores(scoresResult.data || []);
    setTeams(mappedTeams);
    setMatches(mapTeamCourtScheduleMatches(matchesResult.data || [], participantsResult.data || [], mappedTeams, mappedScores));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!allowSignedIn && appSession.ready && appSession.userId) router.replace("/dashboard");
  }, [allowSignedIn, appSession.ready, appSession.userId, router]);

  useEffect(() => {
    if (!appSession.ready || (!allowSignedIn && appSession.userId)) return;
    void loadGuestHome();
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const channel = supabase
      .channel(allowSignedIn ? "member-spectator-home-live-data" : "guest-home-live-data")
      .on("postgres_changes", { event: "*", schema: "public", table: "tournaments" }, loadGuestHome)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_teams" }, loadGuestHome)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_team_members" }, loadGuestHome)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_schedule_matches" }, loadGuestHome)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_schedule_match_players" }, loadGuestHome)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_match_scores" }, loadGuestHome)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [allowSignedIn, appSession.ready, appSession.userId, loadGuestHome]);

  if (!appSession.ready || (!allowSignedIn && appSession.userId)) return null;

  const completedMatches = matches.filter((match) => Boolean(match.score?.winnerSide));
  const teamStandings = getLiveTeamStandings(teams, matches);
  const playerStandings = getLivePlayerStandings(teams, matches).slice().sort((left, right) => right.matchWins - left.matchWins
    || right.setWinPercentage - left.setWinPercentage
    || right.gameWinPercentage - left.gameWinPercentage
    || right.completedMatches - left.completedMatches
    || left.player.name.localeCompare(right.player.name));
  const recentMatches = completedMatches.slice().sort((left, right) => {
    const submittedDifference = (Date.parse(right.score?.submittedAt || "") || 0) - (Date.parse(left.score?.submittedAt || "") || 0);
    if (submittedDifference) return submittedDifference;
    return right.dayNumber - left.dayNumber
      || getScheduleTimeSortValue(right.timeLabel) - getScheduleTimeSortValue(left.timeLabel)
      || right.sortOrder - left.sortOrder;
  }).slice(0, 5);
  const showMemberNav = Boolean(appSession.userId);

  return (
    <AppFrame active={showMemberNav ? "home" : undefined} withNav={showMemberNav}>
      <div className={memberPageClass}>
        <AppTopBar />
        <main className="mx-auto grid w-full max-w-shell gap-7 px-5 py-6 pb-12 sm:px-8 sm:py-7 lg:px-10">
          {loading && (
            <section className="grid gap-3" aria-label="Loading live tournament" role="status">
              <span className="h-[230px] animate-pulse rounded-[26px] bg-brand-deep/90" />
              {Array.from({ length: 3 }).map((_, index) => <SkeletonRow key={index} />)}
              <span className="sr-only">Loading live tournament…</span>
            </section>
          )}

          {!loading && message && <StatusMessage tone="warning">{message}</StatusMessage>}
          {!loading && !tournament && !message && <StatusMessage tone="info">No live tournament found.</StatusMessage>}

          {!loading && tournament && (
            <>
              <GuestTournamentBanner tournament={tournament} />

              <section className="grid gap-3" aria-labelledby="guest-leaders-title">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-0.5">
                  <span className="grid gap-1">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-text-secondary">Live standings</span>
                    <h2 className="text-[22px] font-extrabold leading-tight tracking-[-0.5px] text-text-primary sm:text-[25px]" id="guest-leaders-title">Tournament leaders</h2>
                  </span>
                  <Link className="tap-card inline-flex min-h-8 items-center gap-1 justify-self-end whitespace-nowrap text-[12px] font-semibold text-brand" href="/tournaments/leaderboard">
                    Leaderboard <ArrowRight size={13} />
                  </Link>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <GuestTeamLeadersCard standings={teamStandings.slice(0, 3)} />
                  <GuestPlayerLeadersCard standings={playerStandings.slice(0, 3)} />
                </div>
              </section>

              <section className="grid gap-3" aria-labelledby="guest-recent-matches-title">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-0.5">
                  <h2 className="text-[22px] font-extrabold leading-tight tracking-[-0.5px] text-text-primary sm:text-[25px]" id="guest-recent-matches-title">Recent matches</h2>
                  <Link className="tap-card inline-flex min-h-8 items-center gap-1 text-[12px] font-semibold text-brand" href="/tournaments/bracket">
                    View full bracket <ArrowRight size={13} />
                  </Link>
                </div>
                <div className="grid gap-2.5">
                  {recentMatches.map((match) => <ScheduleBracketMatchLink match={match} key={match.id} />)}
                  {!recentMatches.length && <StatusMessage tone="info">Completed matches will appear here as scores are submitted.</StatusMessage>}
                </div>
              </section>

              <section className="grid gap-3" aria-labelledby="guest-about-title">
                <h2 className="text-[22px] font-extrabold leading-tight tracking-[-0.5px] text-text-primary sm:text-[25px]" id="guest-about-title">About MRSA</h2>
                <Link className="tap-card grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-[18px] border-hairline border-line bg-card p-4 transition hover:border-line-strong md:items-center md:p-5" href="/about">
                  <span className="grid gap-2">
                    <span className="text-[13px] text-text-secondary">What is MRSA?</span>
                    <strong className="text-lg font-medium leading-tight text-brand">Mumineen Racquet Sports Association</strong>
                    <em className="text-[15px] not-italic leading-relaxed text-text-secondary">A North America-wide community bringing together women through a shared passion for racquet sports — tennis, TT, badminton, and pickleball.</em>
                  </span>
                  <span className="inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-full bg-brand-primary text-white" aria-hidden="true">
                    <ArrowRight size={18} />
                  </span>
                </Link>
              </section>
            </>
          )}
        </main>
      </div>
    </AppFrame>
  );
}

function GuestTournamentBanner({ tournament }: { tournament: Tournament }) {
  const venueText = `${tournament.venueName} ${tournament.venueAddress}`;
  const venueLabel = /chicago/i.test(venueText) ? "Chicago" : tournament.venueName || "Venue TBD";
  const titleHasYear = tournament.seasonYear && tournament.name.includes(String(tournament.seasonYear));
  const title = tournament.seasonYear && !titleHasYear ? `${tournament.name} - ${tournament.seasonYear}` : tournament.name;

  return (
    <section className={`${tournamentLiveBannerClass} p-5 sm:p-7`} aria-labelledby="guest-tournament-title">
      <TournamentHeroAmbience />
      <div className="relative z-10 grid gap-5">
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/72">MRSA tournament</span>
            <span className="inline-flex min-h-8 items-center gap-2 rounded-full border-hairline border-[var(--accent)]/35 bg-[var(--accent)]/10 px-3 text-[11px] font-semibold text-[var(--accent)] backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" aria-hidden="true" />
              {getGuestTournamentStatus(tournament)}
            </span>
          </div>
          <span className="grid gap-2">
            <h1 className="max-w-[760px] text-[27px] font-semibold leading-[1.05] tracking-[-0.55px] text-white sm:text-[36px]" id="guest-tournament-title">{title}</h1>
            <span className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-white/72 sm:text-[14px]">
              <span className="inline-flex items-center gap-1.5"><Calendar size={15} />{formatTournamentDates(tournament)}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin size={15} />{venueLabel}</span>
            </span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <a className="tap-card inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-primary px-3 text-center text-[13px] font-medium leading-tight text-white transition hover:bg-brand-mid sm:text-[14px]" href="https://www.youtube.com/live/7JOkZ_ZFZQk" target="_blank" rel="noreferrer">
            <span className="relative grid h-4 w-[23px] shrink-0 place-items-center rounded-[5px] bg-[#FF0000]" aria-hidden="true">
              <span className="ml-0.5 h-0 w-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white" />
            </span>
            <span>View live feed</span>
          </a>
          <Link className="tap-card inline-flex min-h-12 items-center justify-center rounded-full border-hairline border-white/20 bg-white/10 px-3 text-center text-[13px] font-semibold text-white backdrop-blur transition hover:bg-white/15 sm:text-[14px]" href="/tournaments/bracket">
            View bracket
          </Link>
        </div>
      </div>
    </section>
  );
}

function GuestTeamLeadersCard({ standings }: { standings: TeamStanding[] }) {
  return (
    <article className="grid gap-3 rounded-[20px] border-hairline border-line bg-card p-4">
      <div className="flex items-center justify-between gap-3 border-b-hairline border-line pb-3">
        <strong className="text-[16px] font-semibold text-text-primary">Top teams</strong>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">W–L</span>
      </div>
      <div className="grid gap-2">
        {standings.map((standing, index) => (
          <div className="grid min-h-[52px] grid-cols-[24px_40px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[14px] bg-[var(--surface)] px-3 py-2" key={standing.team.id}>
            <strong className={index < 3 ? "text-center text-[13px] font-semibold text-brand" : "text-center text-[13px] font-semibold text-text-muted"}>{index + 1}</strong>
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-[10px] bg-white text-[10px] font-semibold text-brand shadow-[inset_0_0_0_1px_rgba(var(--brand-deep-rgb),0.05)]">
              {standing.team.logoUrl ? <NextImage src={standing.team.logoUrl} alt="" fill sizes="40px" className="object-contain p-1" /> : getInitials(standing.team.name)}
            </span>
            <strong className="truncate text-[14px] font-semibold text-text-primary">{standing.team.name}</strong>
            <strong className="min-w-10 text-right text-[14px] font-semibold tabular-nums text-brand" aria-label={`${standing.matchWins} wins and ${standing.matchLosses} losses`}>{standing.matchWins}–{standing.matchLosses}</strong>
          </div>
        ))}
        {!standings.length && <p className="rounded-[14px] bg-[var(--surface)] p-3 text-[13px] text-text-secondary">Team standings will appear when rosters are published.</p>}
      </div>
    </article>
  );
}

function GuestPlayerLeadersCard({ standings }: { standings: PlayerStanding[] }) {
  return (
    <article className="grid gap-3 rounded-[20px] border-hairline border-line bg-card p-4">
      <div className="flex items-center justify-between gap-3 border-b-hairline border-line pb-3">
        <strong className="text-[16px] font-semibold text-text-primary">Top players</strong>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">W–L</span>
      </div>
      <div className="grid gap-2">
        {standings.map((standing, index) => (
          <div className="grid min-h-[52px] grid-cols-[24px_40px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[14px] bg-[var(--surface)] px-3 py-2" key={`${standing.team.id}:${standing.player.playerId || standing.player.id}`}>
            <strong className={index < 3 ? "text-center text-[13px] font-semibold text-brand" : "text-center text-[13px] font-semibold text-text-muted"}>{index + 1}</strong>
            <Avatar className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[var(--brand-primary-tint)] text-[10px] font-semibold text-[var(--brand-primary-text)]" name={standing.player.name} photoUrl={standing.player.profilePhotoUrl} ariaLabel={`${standing.player.name} profile photo`} sizes="40px" />
            <span className="grid min-w-0 gap-0.5">
              <strong className="truncate text-[14px] font-semibold text-text-primary">{standing.player.name}</strong>
              <em className="truncate text-[11px] not-italic text-text-secondary">{standing.team.name}</em>
            </span>
            <strong className="min-w-10 text-right text-[14px] font-semibold tabular-nums text-brand" aria-label={`${standing.matchWins} wins and ${standing.matchLosses} losses`}>{standing.matchWins}–{standing.matchLosses}</strong>
          </div>
        ))}
        {!standings.length && <p className="rounded-[14px] bg-[var(--surface)] p-3 text-[13px] text-text-secondary">Player standings will appear when rosters are published.</p>}
      </div>
    </article>
  );
}

function getGuestTournamentStatus(tournament: Tournament) {
  if (tournament.status !== "live") return formatTournamentStatus(tournament.status);
  const today = getChicagoDateKey();
  const day = today === getTournamentDayDateKey(tournament, 2) ? 2 : 1;
  return `Day ${day} · Live`;
}

export function DrawScreen() {
  const appSession = useProtectedRoute("/tournaments", true);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registeredPlayers, setRegisteredPlayers] = useState<RegisteredPlayer[]>([]);
  const [publishedTeams, setPublishedTeams] = useState<PublishedTeam[]>([]);
  const [tournamentChampion, setTournamentChampion] = useState<PublishedTeam | null>(null);
  const [registeredPlayersOpen, setRegisteredPlayersOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [registered, setRegistered] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [registrationShirtName, setRegistrationShirtName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [completedFitnessDays, setCompletedFitnessDays] = useState<number[]>([]);

  const loadTournament = useCallback(async () => {
    if (!appSession.ready || !appSession.userId) return;

    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      setLoading(false);
      return;
    }

    const { data: tournamentData, error } = await supabase
      .from("tournaments")
      .select("id, name, season_year, status, venue_name, venue_address, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents, max_players, notes, faqs")
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
      setPublishedTeams([]);
      setTournamentChampion(null);
      setRegistrationShirtName("");
      setLoading(false);
      return;
    }

    const mappedTournament = mapTournament(tournamentData);
    setTournament(mappedTournament);

    const [registrationsResult, myRegistrationResult, latestPaymentResult, teamsResult, fitnessProgressResult, matchesResult, participantsResult, scoresResult] = await Promise.all([
      supabase
        .from("tournament_registrations")
        .select("player_id, players(id, full_name, jamaat_city, age, date_of_birth, rating, tennis_video_url)")
        .eq("tournament_id", mappedTournament.id)
        .neq("status", "cancelled")
        .in("payment_status", ["paid", "waived"])
        .order("registered_at"),
      appSession.player?.id
        ? supabase
            .from("tournament_registrations")
            .select("id, status, payment_status, waitlist_status, shirt_name")
            .eq("tournament_id", mappedTournament.id)
            .eq("player_id", appSession.player.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      appSession.player?.id
        ? supabase
            .from("payment_ledger")
            .select("status, stripe_failure_message")
            .eq("tournament_id", mappedTournament.id)
            .eq("player_id", appSession.player.id)
            .eq("entry_type", "charge")
            .order("occurred_at", { ascending: false })
            .limit(1)
            .maybeSingle()
        : Promise.resolve({ data: null })
      ,
      supabase
        .from("tournament_teams")
        .select("id, name, sort_order, logo_url, jersey_color, sponsor_name, sponsor_logo_url, sponsors, tournament_team_members(id, is_captain, draft_order, tier_at_draft, players(id, full_name, jamaat_city, age, date_of_birth, rating, profile_photo_url))")
        .eq("tournament_id", mappedTournament.id)
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("draft_order", { referencedTable: "tournament_team_members", ascending: true })
        .limit(40)
      ,
      appSession.player?.id
        ? supabase
            .from("player_fitness_progress")
            .select("day_number")
            .eq("player_id", appSession.player.id)
            .order("day_number", { ascending: true })
        : Promise.resolve({ data: [] })
      ,
      supabase
        .from("tournament_schedule_matches")
        .select("id, tournament_id, day_number, day_label, time_label, court_label, pod_label, format, match_type, match_color, tier_rule, team_a_id, team_b_id, team_a_label, team_b_label, external_match_id, sort_order")
        .eq("tournament_id", mappedTournament.id)
        .eq("is_published", true)
        .order("day_number", { ascending: true })
        .order("sort_order", { ascending: true })
        .limit(300)
      ,
      supabase
        .from("tournament_schedule_match_players")
        .select("id, schedule_match_id, team_id, player_id, side, slot, source_player_name")
        .eq("tournament_id", mappedTournament.id)
        .limit(1200)
      ,
      supabase
        .from("tournament_match_scores")
        .select("id, schedule_match_id, side_a_set1, side_b_set1, side_a_set2, side_b_set2, side_a_set3, side_b_set3, winner_side, submitted_at")
        .eq("tournament_id", mappedTournament.id)
        .limit(400)
    ]);
    const registrations = registrationsResult.data || [];
    const myRegistration = myRegistrationResult.data;
    const latestPayment = latestPaymentResult.data;

    setRegisteredPlayers(registrations.map((row) => {
      const player = Array.isArray(row.players) ? row.players[0] : row.players;
      return {
        id: row.player_id,
        name: player?.full_name || "Player",
        age: formatRegisteredPlayerAge(player?.date_of_birth, player?.age),
        city: player?.jamaat_city || "MRSA",
        rating: formatRegisteredPlayerRating(player?.rating),
        tennisVideoUrl: hasPlayerVideoLink(player?.tennis_video_url) ? player?.tennis_video_url || "" : ""
      };
    }));
    const nextPublishedTeams = (teamsResult.data || []).map((team) => {
      const members = Array.isArray(team.tournament_team_members) ? team.tournament_team_members : team.tournament_team_members ? [team.tournament_team_members] : [];
      return {
        id: team.id,
        name: team.name || "Team",
        sortOrder: team.sort_order || 0,
        logoUrl: team.logo_url || "",
        jerseyColor: getSourceTeamColor(team.jersey_color),
        sponsorName: team.sponsor_name || "",
        sponsorLogoUrl: team.sponsor_logo_url || "",
        sponsors: mapTeamSponsors(team.sponsors, team.sponsor_name || "", team.sponsor_logo_url || ""),
        members: members
          .map((member) => {
            const player = Array.isArray(member.players) ? member.players[0] : member.players;
            return {
              id: member.id,
              playerId: player?.id || "",
              name: player?.full_name || "Player",
              age: formatRegisteredPlayerAge(player?.date_of_birth, player?.age),
              city: player?.jamaat_city || "MRSA",
              tier: member.tier_at_draft ? `Tier ${member.tier_at_draft}` : "Tier TBD",
              rating: formatRegisteredPlayerRating(player?.rating),
              profilePhotoUrl: player?.profile_photo_url || "",
              isCaptain: Boolean(member.is_captain),
              draftOrder: member.draft_order ?? null
            };
          })
          .sort((a, b) => Number(b.isCaptain) - Number(a.isCaptain) || (a.draftOrder || 9999) - (b.draftOrder || 9999) || a.name.localeCompare(b.name))
      };
    });
    setPublishedTeams(nextPublishedTeams);
    const scheduleSchemaMissing = isScheduleSchemaMissing(matchesResult.error?.message || participantsResult.error?.message || "");
    const scoreSchemaMissing = isScoreSchemaMissing(scoresResult.error?.message || "");
    if (!teamsResult.error && !scheduleSchemaMissing && !matchesResult.error && !participantsResult.error) {
      const mappedScores = scoreSchemaMissing || scoresResult.error ? [] : mapMatchScores(scoresResult.data || []);
      const mappedMatches = mapTeamCourtScheduleMatches(matchesResult.data || [], participantsResult.data || [], nextPublishedTeams, mappedScores);
      setTournamentChampion(getTournamentChampion(nextPublishedTeams, mappedMatches));
    } else {
      setTournamentChampion(null);
    }
    setCompletedFitnessDays((fitnessProgressResult.data || []).map((row) => Number(row.day_number)).filter(Boolean));

    if (appSession.player?.id) {
      const myPlayer = { id: appSession.player.id };
      const paidRegistration = Boolean(myPlayer && registrations.some((row) => row.player_id === myPlayer.id));
      setRegistered(paidRegistration);
      setRegistrationShirtName(myRegistration?.shirt_name || "");
      const waitlistStatus = myRegistration?.status === "waitlisted" ? myRegistration.waitlist_status : null;
      setPaymentState(
        paidRegistration ? "paid"
          : waitlistStatus === "accepted" ? "waitlist_accepted"
            : waitlistStatus === "rejected" ? "waitlist_rejected"
              : waitlistStatus === "pending" ? "waitlist_pending"
                : "idle"
      );

      if (!paidRegistration && !waitlistStatus && mappedTournament.status === "registration_open") {
        if (latestPayment?.status === "pending" || latestPayment?.status === "failed") {
          setPaymentState(latestPayment.status);
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

    const clearCheckoutParams = () => {
      window.history.replaceState(null, "", "/tournaments");
    };

    const reconcileReturnedPayment = async () => {
      if (!supabase || !checkoutSessionId || !paymentResult) {
        await loadTournament();
        return;
      }
      setMessage(paymentResult === "success" ? "Confirming payment..." : "Checking payment status...");

      const { data: session } = await supabase.auth.getSession();
      const response = await fetch(`/api/stripe/checkout-status?session_id=${encodeURIComponent(checkoutSessionId)}&payment=${encodeURIComponent(paymentResult)}`, {
        headers: {
          Authorization: `Bearer ${session.session?.access_token || ""}`
        }
      });
      const result = await response.json();

      if (!response.ok) {
        setPaymentState("failed");
        setMessage(result.error || "Could not verify payment status. Please retry registration.");
        clearCheckoutParams();
        await loadTournament();
        return;
      }

      if (result.registered || result.status === "paid") {
        setRegistered(true);
        setPaymentState("paid");
        setMessage("Payment received. You are registered.");
        clearCheckoutParams();
        await loadTournament();
        return;
      }

      if (result.status === "failed") {
        setPaymentState("failed");
        setMessage(result.error || "Payment was not completed. You can retry registration.");
        clearCheckoutParams();
        await loadTournament();
        return;
      }

      setPaymentState("pending");
      setMessage("Payment is still pending. Please wait while Stripe confirms it.");
      clearCheckoutParams();
      await loadTournament();
    };

    reconcileReturnedPayment();
    if (!supabase) return;

    const channel = supabase
      .channel("tournaments-live-data")
      .on("postgres_changes", { event: "*", schema: "public", table: "tournaments" }, loadTournament)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_registrations" }, loadTournament)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_teams" }, loadTournament)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_team_members" }, loadTournament)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_schedule_matches" }, loadTournament)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_schedule_match_players" }, loadTournament)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_match_scores" }, loadTournament)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [appSession.ready, appSession.userId, appSession.player?.id, loadTournament]);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 22000);
    return () => window.clearTimeout(timeout);
  }, [message]);

	  if (!appSession.ready || !appSession.userId || !appSession.profileComplete) return null;
    const tournamentProfileReminder = tournament && registered ? getTournamentProfileReminder(appSession.player, registrationShirtName) : null;
    const previewFitnessDays = tennisFitnessRegimen.slice(0, 7);
    const completedPreviewDays = previewFitnessDays.filter((day) => completedFitnessDays.includes(day.day)).length;
    const fitnessProgressPercent = Math.round((completedFitnessDays.length / tennisFitnessRegimen.length) * 100);

  return (
    <AppFrame active="tournament">
      <div className="min-h-dvh bg-surface pb-28 font-sans text-text-primary">
        <AppTopBar />
        <main className="mx-auto grid w-full max-w-shell gap-4 px-4 py-5 pb-32 md:px-6 lg:px-8">
          {message && (
            <StatusMessage tone={paymentState === "failed" ? "error" : paymentState === "pending" ? "warning" : "success"}>
              {message}
            </StatusMessage>
          )}

          {tournament && tournamentProfileReminder && (
            <section className="grid gap-3 rounded-[16px] border-hairline border-[var(--warning-line)] bg-[var(--warning-tint)] p-3.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <span className="grid min-w-0 gap-1">
                <strong className="text-[15px] font-medium text-[var(--warning-ink)]">Your tournament profile is incomplete</strong>
                <em className="text-[13px] not-italic leading-relaxed text-[var(--warning-ink)]/85">
                  {tournamentProfileReminder.missingPhoto && tournamentProfileReminder.missingJerseyName
                    ? "Add your profile photo, jersey name, and jersey size now so your team card, shirt name, and roster details are ready before the tournament."
                    : tournamentProfileReminder.missingPhoto
                      ? "Add your profile photo now so your team card and roster details are ready before the tournament."
                      : tournamentProfileReminder.missingJerseyName
                        ? "Add your jersey name now so your shirt name and roster details are ready before the tournament."
                        : "Add your jersey size now so your shirt order and roster details are ready before the tournament."}
                </em>
              </span>
              <Link className="tap-card inline-flex min-h-10 items-center justify-center rounded-[12px] bg-brand-primary px-4 text-[13px] font-medium text-white transition hover:bg-brand-mid" href={buildTournamentProfileEditPath(tournament.id)}>
                Update now
              </Link>
            </section>
          )}

        <section className="grid gap-4">
          {!tournament && (
            <StatusMessage tone="info">No live tournament found.</StatusMessage>
          )}

          {tournament && (
            <section className={registered ? "grid grid-cols-2 gap-2 md:gap-3 xl:grid-cols-4" : "grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3"}>
              {registered && (
                <Link className="tournament-hub-card tap-card group relative grid min-h-[118px] overflow-hidden rounded-[18px] border-hairline border-transparent bg-brand-deep p-3 text-white sm:min-h-[136px] sm:rounded-[22px] sm:p-4" href="/tournaments/schedule">
                  <span className="pointer-events-none absolute inset-0 opacity-25 court-lines" aria-hidden="true" />
                  <span className="relative grid h-full content-between gap-3 sm:gap-4">
                    <span className="grid gap-1">
                      <span className="inline-grid h-8 w-8 place-items-center rounded-[11px] bg-white/10 text-white sm:h-10 sm:w-10 sm:rounded-[14px]">
                        <Calendar className="h-4 w-4 sm:h-[19px] sm:w-[19px]" />
                      </span>
                      <strong className="text-[15px] font-medium leading-tight tracking-[-0.1px] sm:text-[21px] sm:tracking-[-0.2px]">Schedule</strong>
                      <em className="line-clamp-2 pr-9 text-[9px] not-italic leading-[1.25] text-white/72 sm:block sm:pr-0 sm:text-[13px] sm:leading-relaxed">See when and where you and your team play.</em>
                    </span>
                    <span className="absolute bottom-0 right-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white sm:static sm:h-auto sm:w-max sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[13px] sm:font-medium">
                      <span className="hidden sm:inline">View schedule</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </Link>
              )}

              <Link className="tournament-hub-card tap-card group relative grid min-h-[118px] overflow-hidden rounded-[18px] border-hairline border-transparent bg-brand-deep p-3 text-white sm:min-h-[136px] sm:rounded-[22px] sm:p-4" href="/tournaments/bracket">
                <span className="pointer-events-none absolute inset-0 opacity-20 court-lines" aria-hidden="true" />
                <span className="relative grid h-full content-between gap-3 sm:gap-4">
                  <span className="grid gap-1">
                    <span className="inline-flex items-center gap-1.5 sm:gap-2">
                      <span className="inline-grid h-8 w-8 place-items-center rounded-[11px] bg-white/10 text-white sm:h-10 sm:w-10 sm:rounded-[14px]">
                        <RefreshCw className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                      </span>
                      <em className="inline-flex items-center gap-1.5 rounded-full border-hairline border-brand-primary bg-brand-primary px-2 py-1 text-[9px] font-semibold not-italic uppercase tracking-[0.08em] text-white">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                        Live
                      </em>
                    </span>
                    <strong className="text-[15px] font-medium leading-tight tracking-[-0.1px] sm:text-[21px] sm:tracking-[-0.2px]">Live Bracket</strong>
                    <em className="line-clamp-2 pr-9 text-[9px] not-italic leading-[1.25] text-white/72 sm:block sm:pr-0 sm:text-[13px] sm:leading-relaxed">Follow matchups and live scores by day.</em>
                  </span>
                  <span className="absolute bottom-0 right-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white sm:static sm:h-auto sm:w-max sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[13px] sm:font-medium">
                    <span className="hidden sm:inline">Follow live</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </Link>

              <Link className="tournament-hub-card tap-card group relative grid min-h-[118px] overflow-hidden rounded-[18px] border-hairline border-transparent bg-brand-deep p-3 text-white sm:min-h-[136px] sm:rounded-[22px] sm:p-4" href="/tournaments/leaderboard">
                <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/10" aria-hidden="true" />
                <span className="pointer-events-none absolute right-8 top-8 h-16 w-16 rounded-full border border-white/10" aria-hidden="true" />
                <span className="relative grid h-full content-between gap-3 sm:gap-4">
                  <span className="grid gap-1">
                    <span className="inline-grid h-8 w-8 place-items-center rounded-[11px] bg-white/10 text-white sm:h-10 sm:w-10 sm:rounded-[14px]">
                      <Trophy className="h-4 w-4 sm:h-[19px] sm:w-[19px]" />
                    </span>
                    <span className="flex items-center gap-2">
                      <strong className="text-[15px] font-medium leading-tight tracking-[-0.1px] sm:text-[21px] sm:tracking-[-0.2px]">Leaderboard</strong>
                      <em className="hidden rounded-full bg-brand-primary px-2 py-0.5 text-[9px] font-medium not-italic uppercase tracking-[0.08em] text-white sm:inline">Live</em>
                    </span>
                    <em className="line-clamp-2 pr-9 text-[9px] not-italic leading-[1.25] text-white/72 sm:block sm:pr-0 sm:text-[13px] sm:leading-relaxed">See current team and player rankings.</em>
                  </span>
                  <span className="absolute bottom-0 right-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white sm:static sm:h-auto sm:w-max sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[13px] sm:font-medium">
                    <span className="hidden sm:inline">View leaderboard</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </Link>

              {/* People and social content is the sole light action-card category on the hub. */}
              <Link className="tournament-hub-card tournament-hub-card--people tap-card group relative grid min-h-[118px] overflow-hidden rounded-[18px] border-hairline border-line bg-white p-3 sm:min-h-[136px] sm:rounded-[22px] sm:p-4" href="/tournaments/teams">
                <span className="relative grid h-full content-between gap-3 sm:gap-4">
                  <span className="grid gap-1">
                    <span className="sm:hidden"><CaptainAvatarStack teams={publishedTeams} compact /></span>
                    <span className="hidden sm:block"><CaptainAvatarStack teams={publishedTeams} /></span>
                    <strong className="text-[15px] font-medium leading-tight tracking-[-0.1px] text-text-primary sm:text-[21px] sm:tracking-[-0.2px]">Team rosters</strong>
                    <em className="line-clamp-2 pr-9 text-[9px] not-italic leading-[1.25] text-text-secondary sm:block sm:pr-0 sm:text-[13px] sm:leading-relaxed">{publishedTeams.length ? `${publishedTeams.length} teams. See every player and matchup.` : "Teams appear here once rosters are ready."}</em>
                  </span>
                  <span className="absolute bottom-0 right-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white sm:static sm:h-auto sm:w-max sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[13px] sm:font-medium">
                    <span className="hidden sm:inline">View rosters</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </Link>
            </section>
          )}

          <section className="relative overflow-hidden rounded-[22px] border-hairline border-line bg-white p-4">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
              <span className="grid gap-2">
                <span className="inline-grid h-10 w-10 place-items-center rounded-[14px] bg-brand-deep text-[var(--blue-300)]">
                  <Dumbbell size={19} />
                </span>
                <span className="grid gap-1">
                  <strong className="text-[21px] font-medium leading-tight tracking-[-0.2px] text-text-primary">Tennis fitness program</strong>
                  <em className="text-[14px] not-italic leading-relaxed text-text-secondary">Start with the first week and check off each day as you train. Small wins, steady legs.</em>
                </span>
                <Link className="tap-card inline-flex min-h-10 w-max items-center justify-center gap-2 rounded-full bg-brand-primary px-4 text-[13px] font-medium text-white transition hover:bg-brand-mid" href="/fitness?from=tournament">
                  {completedFitnessDays.length ? "Continue program" : "Start program"}
                  <ArrowRight size={14} />
                </Link>
              </span>
              <div className="grid gap-2">
                <div className="grid gap-2 rounded-[18px] border-hairline border-line bg-white p-3">
                  <span className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <strong className="text-[14px] font-medium text-text-primary">{completedFitnessDays.length} of {tennisFitnessRegimen.length} days complete</strong>
                    <em className="text-[13px] not-italic text-brand">{fitnessProgressPercent}%</em>
                  </span>
                  <span className="h-2 overflow-hidden rounded-full bg-brand-light">
                    <span className="block h-full rounded-full bg-brand-primary" style={{ width: `${fitnessProgressPercent}%` }} />
                  </span>
                  <span className="grid grid-cols-7 gap-1.5">
                    {previewFitnessDays.map((day) => {
                      const done = completedFitnessDays.includes(day.day);
                      return (
                        <span className={done ? "grid aspect-square place-items-center rounded-[10px] bg-brand-primary text-white" : "grid aspect-square place-items-center rounded-[10px] bg-brand-light text-[12px] font-medium text-brand"} key={day.day}>
                          {done ? <CheckCircle2 size={14} /> : day.day}
                        </span>
                      );
                    })}
                  </span>
                  <em className="text-[13px] not-italic text-text-secondary">{completedPreviewDays} of the first 7 days checked off.</em>
                </div>
              </div>
            </div>
            </section>

          {appSession.isAdmin && (
            <Link className="tap-card group grid grid-cols-[42px_minmax(0,1fr)_36px] items-center gap-3 rounded-[18px] border-hairline border-line bg-white p-3.5 transition hover:border-brand/25" href="/tournaments/tv">
              <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-brand-deep text-[var(--accent)] shadow-[0_8px_18px_rgba(var(--brand-deep-rgb), 0.16)]">
                <MonitorUp size={19} />
              </span>
              <span className="grid min-w-0 gap-0.5">
                <em className="text-[9px] font-semibold not-italic uppercase tracking-[0.12em] text-text-muted">Admin display</em>
                <strong className="text-[16px] font-semibold leading-tight text-brand">TV Day View</strong>
                <span className="text-[11px] leading-snug text-text-secondary">Show the full day schedule and live results on a large screen.</span>
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand shadow-[0_6px_14px_rgba(var(--brand-deep-rgb), 0.09)] transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                <ArrowRight size={15} />
              </span>
            </Link>
          )}

          {!!tournament?.faqs.length && (
            <section className="overflow-hidden rounded-[18px] border-hairline border-line bg-card">
              <div className="border-b-hairline border-line px-4 py-3">
                <h2 className="text-[16px] font-medium text-text-primary">FAQs</h2>
              </div>
              <div className="divide-y divide-line">
                {tournament.faqs.map((faq, index) => {
                  const open = openFaqIndex === index;
                  return (
                    <article key={`${faq.question}-${index}`}>
                      <button className="tap-card grid min-h-12 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-left" type="button" onClick={() => setOpenFaqIndex(open ? null : index)} aria-expanded={open}>
                        <strong className="text-[15px] font-medium text-text-primary">{faq.question}</strong>
                        <ChevronDown size={16} className={`text-brand transition-transform ${open ? "rotate-180" : ""}`} />
                      </button>
                      {open && <p className="px-4 pb-4 text-[14px] leading-relaxed text-text-secondary">{faq.answer}</p>}
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          <section className="grid gap-3 rounded-[18px] border-hairline border-line bg-brand-light p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <h2 className="text-[15px] font-medium text-[var(--accent-ink)]">Have more questions? Contact organizer</h2>
            <a className="tap-card inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-brand-deep px-4 text-[13px] font-medium text-white" href="https://wa.me/13128749178?text=Hi%2C%20I%27m%20looking%20at%20the%20MRSA%20tournament%20and%20have%20a%20question." target="_blank" rel="noreferrer">
              <WhatsAppIcon size={16} />
              WhatsApp
            </a>
          </section>

          <section className="overflow-hidden rounded-[16px] border-hairline border-line bg-card">
            <button className="tap-card grid min-h-12 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3.5 text-left" type="button" onClick={() => setRegisteredPlayersOpen((current) => !current)} aria-expanded={registeredPlayersOpen} aria-controls="registered-players-panel">
              <span className="grid gap-0.5">
                <strong className="text-[15px] font-medium text-text-primary">Registered players</strong>
                <em className="text-[12px] not-italic text-text-secondary">{tournament?.maxPlayers ? `${registeredPlayers.length} of ${tournament.maxPlayers} spots filled` : formatPlayerCount(registeredPlayers.length)}</em>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-tint px-2.5 py-1 text-[12px] font-medium text-[var(--accent-ink)]">
                {registeredPlayers.length}
                <ChevronDown size={15} className={`transition-transform ${registeredPlayersOpen ? "rotate-180" : ""}`} />
              </span>
            </button>
            {registeredPlayersOpen && (
              <div className="grid gap-2 border-t-hairline border-line p-2.5 md:grid-cols-2" id="registered-players-panel">
                {registeredPlayers.slice(0, 10).map((player, index) => (
                  <article className="grid min-h-[50px] grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[12px] border-hairline border-line bg-white px-2.5 py-2" key={player.name}>
                    <span className={index % 5 === 0 ? "grid h-[30px] w-[30px] place-items-center rounded-full bg-[var(--avatar-peach)] text-[12px] font-medium text-[var(--avatar-peach-ink)]" : index % 5 === 1 ? "grid h-[30px] w-[30px] place-items-center rounded-full bg-[var(--brand-primary-tint)] text-[12px] font-medium text-[var(--brand-primary-text)]" : index % 5 === 2 ? "grid h-[30px] w-[30px] place-items-center rounded-full bg-[var(--brand-primary-tint)] text-[12px] font-medium text-[var(--accent-ink)]" : index % 5 === 3 ? "grid h-[30px] w-[30px] place-items-center rounded-full bg-[var(--avatar-pink)] text-[12px] font-medium text-[var(--avatar-pink-ink)]" : "grid h-[30px] w-[30px] place-items-center rounded-full bg-[var(--surface)] text-[12px] font-medium text-[var(--mist)]"}>{getInitials(player.name)}</span>
                    <div className="grid min-w-0 gap-0.5">
                      <Link className="tap-card truncate text-[14px] font-medium text-text-primary underline decoration-current/20 underline-offset-2 transition hover:decoration-current" href={`/tournaments/players/${player.id}?from=tournament`}>{player.name}</Link>
                      <em className="truncate text-[12px] not-italic text-text-secondary">{[player.city, player.age].filter(Boolean).join(" · ")}</em>
                      {player.tennisVideoUrl && (
                        <a className="inline-flex w-max items-center gap-1.5 text-[12px] font-medium text-[var(--brand-primary-text)]" href={player.tennisVideoUrl} target="_blank" rel="noreferrer" title="View playing video" aria-label={`${player.name} playing video`}>
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--brand-primary-tint)]">
                            <ExternalLink size={12} strokeWidth={2.2} aria-hidden="true" />
                          </span>
                          View video
                        </a>
                      )}
                    </div>
                    <span className="grid justify-items-end gap-0.5">
                      <strong className="text-[14px] font-medium leading-none text-brand">{player.rating}</strong>
                      <em className="text-[12px] not-italic leading-none text-text-secondary">rating</em>
                    </span>
                  </article>
                ))}
                {registeredPlayers.length > 10 && <Link className="tap-card inline-flex min-h-10 items-center justify-center rounded-[14px] bg-accent-tint px-4 text-[13px] font-medium text-[var(--accent-ink)] md:col-span-2" href="/tournaments/players">View all registered players →</Link>}
                {loading && !registeredPlayers.length && Array.from({ length: 4 }).map((_, index) => <SkeletonRow key={index} />)}
                {!loading && !registeredPlayers.length && <StatusMessage tone="info">No players registered yet.</StatusMessage>}
              </div>
            )}
          </section>
        </section>
        </main>
        {tournament && tournamentChampion && (
          <TournamentWinnerCelebration team={tournamentChampion} tournamentId={tournament.id} />
        )}
      </div>
    </AppFrame>
  );
}

type FitnessDay = {
  day: number;
  exercises: string[];
};
type CommunityFitnessPlayer = {
  playerId: string;
  name: string;
  city: string;
  profilePhotoUrl: string;
  completedDays: number;
};

const tennisFitnessRegimen: FitnessDay[] = [
  { day: 1, exercises: ["Push ups - 5", "Squats - 25", "Crunches - 10", "Lunges - 20"] },
  { day: 2, exercises: ["Push ups - 5", "Squats - 25", "Crunches - 15", "Lunges - 21"] },
  { day: 3, exercises: ["Push ups - 6", "Squats - 30", "Crunches - 20", "Lunges - 22"] },
  { day: 4, exercises: ["Jumping jacks - 15"] },
  { day: 5, exercises: ["Push ups - 7", "Squats - 35", "Crunches - 25", "Lunges - 23"] },
  { day: 6, exercises: ["Push ups - 8", "Squats - 40", "Crunches - 30", "Lunges - 24"] },
  { day: 7, exercises: ["Push ups - 9", "Squats - 45", "Crunches - 35", "Lunges - 25"] },
  { day: 8, exercises: ["Jumping jacks - 20"] },
  { day: 9, exercises: ["Push ups - 10", "Squats - 50", "Crunches - 40", "Lunges - 25"] },
  { day: 10, exercises: ["Push ups - 10", "Squats - 50", "Crunches - 45", "Lunges - 26"] },
  { day: 11, exercises: ["Push ups - 11", "Squats - 55", "Crunches - 50", "Lunges - 27"] },
  { day: 12, exercises: ["Jumping jacks - 25"] },
  { day: 13, exercises: ["Push ups - 12", "Squats - 60", "Crunches - 55", "Lunges - 28"] },
  { day: 14, exercises: ["Push ups - 13", "Squats - 65", "Crunches - 60", "Lunges - 29"] },
  { day: 15, exercises: ["Push ups - 14", "Squats - 70", "Crunches - 65", "Lunges - 30"] },
  { day: 16, exercises: ["Jumping jacks - 30"] },
  { day: 17, exercises: ["Push ups - 15", "Squats - 75", "Crunches - 70", "Lunges - 31"] },
  { day: 18, exercises: ["Push ups - 15", "Squats - 75", "Crunches - 75", "Lunges - 31"] },
  { day: 19, exercises: ["Push ups - 16", "Squats - 80", "Crunches - 80", "Lunges - 32"] },
  { day: 20, exercises: ["Jumping jacks - 35"] },
  { day: 21, exercises: ["Push ups - 17", "Squats - 85", "Crunches - 85", "Lunges - 33"] },
  { day: 22, exercises: ["Push ups - 18", "Squats - 90", "Crunches - 90", "Lunges - 34"] },
  { day: 23, exercises: ["Push ups - 19", "Squats - 95", "Crunches - 95", "Lunges - 35"] },
  { day: 24, exercises: ["Jumping jacks - 40"] },
  { day: 25, exercises: ["Push ups - 20", "Squats - 100", "Crunches - 100", "Lunges - 36"] },
  { day: 26, exercises: ["Push ups - 21", "Squats - 100", "Crunches - 100", "Lunges - 37"] },
  { day: 27, exercises: ["Push ups - 22", "Squats - 105", "Crunches - 110", "Lunges - 38"] },
  { day: 28, exercises: ["Jumping jacks - 45"] },
  { day: 29, exercises: ["Push ups - 25", "Squats - 110", "Crunches - 115", "Lunges - 39"] },
  { day: 30, exercises: ["Push ups - 30", "Squats - 115", "Crunches - 120", "Lunges - 40"] }
];

const tennisFitnessTips = [
  "Try to perform as many in a row for each exercise.",
  "If unable to complete, rest and then finish.",
  "If a day is skipped, resume from where you left off.",
  "Progress, not perfection."
];

function getFitnessProgramPhase(day: number) {
  if (day <= 10) return "Foundation";
  if (day <= 20) return "Build";
  return "Peak";
}

function getFitnessDaysUntilTournament(startsOn: string | null) {
  if (!startsOn) return null;
  const tournamentDate = new Date(`${startsOn}T00:00:00`);
  if (Number.isNaN(tournamentDate.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((tournamentDate.getTime() - today.getTime()) / 86_400_000));
}

function getFitnessPaceDay(daysUntilTournament: number | null) {
  if (daysUntilTournament == null) return 1;
  return Math.min(30, Math.max(1, 31 - daysUntilTournament));
}

function FitnessDayNavigatorButton({ day, done, selected, suggested, onSelect }: { day: number; done: boolean; selected: boolean; suggested: boolean; onSelect: (day: number) => void }) {
  return (
    <button
      className={done ? `${selected ? "ring-2 ring-brand-light" : ""} relative grid h-10 w-10 shrink-0 snap-center place-items-center rounded-[12px] bg-brand-primary text-[12px] font-medium text-white md:w-auto` : suggested ? "relative grid h-10 w-10 shrink-0 snap-center place-items-center rounded-[12px] bg-brand-primary text-[12px] font-medium text-white md:w-auto" : selected ? "relative grid h-10 w-10 shrink-0 snap-center place-items-center rounded-[12px] border-hairline border-brand bg-brand-light text-[12px] font-medium text-brand md:w-auto" : "relative grid h-10 w-10 shrink-0 snap-center place-items-center rounded-[12px] border-hairline border-transparent bg-brand-light text-[12px] font-medium text-brand md:w-auto"}
      type="button"
      onClick={() => onSelect(day)}
      data-fitness-day={day}
      aria-label={`View day ${day}${done ? ", completed" : ""}${suggested ? ", suggested" : ""}`}
      aria-current={selected ? "step" : undefined}
    >
      <span className={suggested ? "grid h-8 w-8 place-items-center rounded-full ring-4 ring-[var(--accent-tint)]" : "grid h-8 w-8 place-items-center rounded-full"}>
        {day}
      </span>
      {done && <CheckCircle2 className="absolute -right-1 -top-1 rounded-full bg-white text-brand" size={13} fill="white" />}
    </button>
  );
}

function parseFitnessExercise(exercise: string) {
  const separatorIndex = exercise.lastIndexOf(" - ");
  if (separatorIndex < 0) return { name: exercise, reps: "" };
  return {
    name: exercise.slice(0, separatorIndex),
    reps: exercise.slice(separatorIndex + 3)
  };
}

export function FitnessScreen() {
  const appSession = useProtectedRoute("/fitness", true);
  const searchParams = useSearchParams();
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [selectedFitnessDay, setSelectedFitnessDay] = useState(1);
  const [tournamentStartsOn, setTournamentStartsOn] = useState<string | null>(null);
  const [communityPlayers, setCommunityPlayers] = useState<CommunityFitnessPlayer[]>([]);
  const [communityMessage, setCommunityMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingDay, setSavingDay] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [canScrollFitnessDaysLeft, setCanScrollFitnessDaysLeft] = useState(false);
  const [canScrollFitnessDaysRight, setCanScrollFitnessDaysRight] = useState(true);
  const fitnessDayRailRef = useRef<HTMLDivElement>(null);

  const loadFitnessProgress = useCallback(async () => {
    if (!appSession.ready || !appSession.userId || !appSession.player?.id) return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      setLoading(false);
      return;
    }

    setCommunityMessage("");
    const today = new Date().toISOString().slice(0, 10);
    const [progressResult, tournamentResult] = await Promise.all([
      supabase
        .from("player_fitness_progress")
        .select("day_number")
        .eq("player_id", appSession.player.id)
        .order("day_number", { ascending: true }),
      supabase
        .from("tournaments")
        .select("id, starts_on")
        .gte("starts_on", today)
        .in("status", ["registration_open", "registration_closed", "live"])
        .order("starts_on", { ascending: true })
        .limit(1)
        .maybeSingle()
    ]);

    if (progressResult.error || tournamentResult.error) {
      setMessage(getFriendlyError(progressResult.error || tournamentResult.error));
      setLoading(false);
      return;
    }

    const completed = (progressResult.data || []).map((row) => Number(row.day_number)).filter(Boolean);
    const startsOn = tournamentResult.data?.starts_on || null;
    const tournamentId = tournamentResult.data?.id || "";

    if (tournamentId) {
      const registrationsResult = await supabase
        .from("tournament_registrations")
        .select("player_id, players(id, full_name, jamaat_city, profile_photo_url)")
        .eq("tournament_id", tournamentId)
        .neq("status", "cancelled")
        .in("payment_status", ["paid", "waived"])
        .order("registered_at", { ascending: true });

      if (registrationsResult.error) {
        setCommunityPlayers([]);
        setCommunityMessage("Community progress is temporarily unavailable.");
      } else {
        const registrations = registrationsResult.data || [];
        const registeredPlayerIds = [...new Set(registrations.map((row) => row.player_id).filter(Boolean))];
        const communityProgressResult = registeredPlayerIds.length
          ? await supabase
              .from("player_fitness_progress")
              .select("player_id, day_number")
              .in("player_id", registeredPlayerIds)
          : { data: [], error: null };

        if (communityProgressResult.error) {
          setCommunityPlayers([]);
          setCommunityMessage("Community progress is temporarily unavailable.");
        } else {
          const completedByPlayer = new Map<string, Set<number>>();
          (communityProgressResult.data || []).forEach((row) => {
            const playerId = row.player_id || "";
            const dayNumber = Number(row.day_number);
            if (!playerId || !dayNumber) return;
            const playerDays = completedByPlayer.get(playerId) || new Set<number>();
            playerDays.add(dayNumber);
            completedByPlayer.set(playerId, playerDays);
          });
          setCommunityPlayers(registrations
            .map((row) => {
              const player = Array.isArray(row.players) ? row.players[0] : row.players;
              const playerId = row.player_id || player?.id || "";
              return {
                playerId,
                name: player?.full_name || "Player",
                city: player?.jamaat_city || "MRSA",
                profilePhotoUrl: player?.profile_photo_url || "",
                completedDays: completedByPlayer.get(playerId)?.size || 0
              };
            })
            .filter((player) => player.playerId)
            .sort((a, b) => b.completedDays - a.completedDays || a.name.localeCompare(b.name)));
        }
      }
    } else {
      setCommunityPlayers([]);
    }

    const paceDay = getFitnessPaceDay(getFitnessDaysUntilTournament(startsOn));
    const highestCompletedDay = completed.length ? Math.max(...completed) : 0;
    const suggestedDay = Math.min(30, Math.max(paceDay, highestCompletedDay + 1));
    const nextWorkout = tennisFitnessRegimen.find((day) => day.day >= suggestedDay && !completed.includes(day.day))
      || tennisFitnessRegimen.find((day) => !completed.includes(day.day));
    setCompletedDays(completed);
    setTournamentStartsOn(startsOn);
    setSelectedFitnessDay(nextWorkout?.day || tennisFitnessRegimen[tennisFitnessRegimen.length - 1].day);
    setLoading(false);
  }, [appSession.player?.id, appSession.ready, appSession.userId]);

  useEffect(() => {
    loadFitnessProgress();
  }, [loadFitnessProgress]);

  useEffect(() => {
    if (loading) return;
    const frame = window.requestAnimationFrame(() => {
      const rail = fitnessDayRailRef.current;
      const selectedButton = rail?.querySelector<HTMLElement>(`[data-fitness-day="${selectedFitnessDay}"]`);
      if (!rail || !selectedButton || window.matchMedia("(min-width: 768px)").matches) return;
      rail.scrollTo({
        left: Math.max(0, selectedButton.offsetLeft - (rail.clientWidth - selectedButton.offsetWidth) / 2),
        behavior: "smooth"
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [loading, selectedFitnessDay]);

  const fitnessTournamentCountdown = useTournamentCountdown(tournamentStartsOn);

  if (!appSession.ready || !appSession.userId || !appSession.profileComplete) return null;
  const completedCount = completedDays.length;
  const progressPercent = Math.round((completedCount / tennisFitnessRegimen.length) * 100);
  const nextDay = tennisFitnessRegimen.find((day) => !completedDays.includes(day.day));
  const selectedDay = tennisFitnessRegimen.find((day) => day.day === selectedFitnessDay) || nextDay || tennisFitnessRegimen[0];
  const selectedDayComplete = completedDays.includes(selectedDay.day);
  const daysUntilTournament = getFitnessDaysUntilTournament(tournamentStartsOn);
  const paceDay = getFitnessPaceDay(daysUntilTournament);
  const highestCompletedDay = completedDays.length ? Math.max(...completedDays) : 0;
  const selectedDayPhase = getFitnessProgramPhase(selectedDay.day);
  const planStatus = completedCount === tennisFitnessRegimen.length
    ? "Program complete"
    : highestCompletedDay > paceDay
      ? `${highestCompletedDay - paceDay} ${highestCompletedDay - paceDay === 1 ? "day" : "days"} ahead`
      : highestCompletedDay === paceDay
        ? "On plan pace"
        : `Plan pace: Day ${paceDay}`;
  const recommendedDayNumber = Math.min(30, Math.max(paceDay, highestCompletedDay + 1));
  const recommendedOpenDay = tennisFitnessRegimen.find((day) => day.day >= recommendedDayNumber && !completedDays.includes(day.day)) || nextDay;
  const communityActivePlayers = communityPlayers.filter((player) => player.completedDays > 0).length;
  const communityCompletedWorkouts = communityPlayers.reduce((total, player) => total + player.completedDays, 0);
  const fitnessTournamentTime = fitnessTournamentCountdown.state === "countdown"
    ? `${fitnessTournamentCountdown.days}d ${formatCountdownValue(fitnessTournamentCountdown.hours)}h ${formatCountdownValue(fitnessTournamentCountdown.minutes)}m ${formatCountdownValue(fitnessTournamentCountdown.seconds)}s`
    : fitnessTournamentCountdown.label;
  const openedFromTournament = searchParams.get("from") === "tournament";
  const fitnessBackHref = openedFromTournament ? "/tournaments" : "/dashboard";
  const fitnessBackLabel = openedFromTournament ? "Back to tournament" : "Back to dashboard";

  const toggleFitnessDay = async (day: number) => {
    const supabase = getSupabaseClient();
    if (!supabase || !appSession.player?.id || savingDay) return;
    const currentlyDone = completedDays.includes(day);
    setSavingDay(day);
    setMessage("");

    const { error } = currentlyDone
      ? await supabase
          .from("player_fitness_progress")
          .delete()
          .eq("player_id", appSession.player.id)
          .eq("day_number", day)
      : await supabase
          .from("player_fitness_progress")
          .upsert({
            player_id: appSession.player.id,
            day_number: day,
            completed_at: new Date().toISOString()
          }, { onConflict: "player_id,day_number" });

    setSavingDay(null);
    if (error) {
      setMessage(getFriendlyError(error));
      return;
    }

    setCompletedDays((current) => currentlyDone ? current.filter((value) => value !== day) : [...new Set([...current, day])].sort((a, b) => a - b));
    setCommunityPlayers((current) => current
      .map((player) => player.playerId === appSession.player?.id
        ? { ...player, completedDays: Math.max(0, Math.min(30, player.completedDays + (currentlyDone ? -1 : 1))) }
        : player)
      .sort((a, b) => b.completedDays - a.completedDays || a.name.localeCompare(b.name)));
  };

  const selectPreviousFitnessDay = () => setSelectedFitnessDay((current) => Math.max(1, current - 1));
  const selectNextFitnessDay = () => setSelectedFitnessDay((current) => Math.min(30, current + 1));
  const updateFitnessDayRailControls = () => {
    const rail = fitnessDayRailRef.current;
    if (!rail) return;
    setCanScrollFitnessDaysLeft(rail.scrollLeft > 4);
    setCanScrollFitnessDaysRight(rail.scrollLeft < rail.scrollWidth - rail.clientWidth - 4);
  };
  const scrollFitnessDayRail = (direction: -1 | 1) => {
    const rail = fitnessDayRailRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.max(180, rail.clientWidth * 0.75), behavior: "smooth" });
  };

  return (
    <AppFrame active="home">
      <div className={memberPageClass}>
        <AppTopBar />
        <main className={memberMainClass}>
          <section className={`${memberHeroClass} gap-3 pt-14 md:pt-5`}>
            <TournamentHeroAmbience />
            <div className="pointer-events-none absolute inset-0 -right-16 -top-6 text-white opacity-[0.06]" aria-hidden="true">
              <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <Link className="absolute left-4 top-4 z-10 inline-grid h-8 max-h-8 min-h-8 w-8 min-w-8 max-w-8 place-items-center rounded-full border-hairline border-white/20 bg-white/12 p-0 text-white shadow-[0_8px_18px_rgba(var(--brand-deep-rgb),0.10)] backdrop-blur transition-transform active:scale-[0.98]" href={fitnessBackHref} aria-label={fitnessBackLabel}>
              <ArrowLeft size={17} />
            </Link>
            <div className="relative z-10 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <span className="grid gap-1.5 md:pl-12">
                <span className={memberHeroEyebrowClass}>Tennis fitness program</span>
                <h1 className="max-w-[680px] text-[26px] font-medium leading-[1.04] tracking-[-0.4px] text-white md:text-[34px]">30-day tournament prep</h1>
                <p className="max-w-[620px] text-[13px] leading-relaxed text-white/72">Choose your day, finish the workout, and track every session.</p>
              </span>
              <span className="grid grid-cols-2 gap-2 md:min-w-[270px]">
                <span className="grid gap-0.5 rounded-[14px] border-hairline border-white/12 bg-white/10 px-3 py-2 backdrop-blur">
                  <em className="inline-flex items-center gap-1.5 text-[10px] font-medium not-italic uppercase tracking-[0.06em] text-white/72"><Calendar size={12} /> Tournament</em>
                  <strong className="whitespace-nowrap text-[13px] font-medium leading-tight tabular-nums text-white sm:text-[14px]">{fitnessTournamentTime}</strong>
                </span>
                <span className="grid gap-0.5 rounded-[14px] border-hairline border-white/12 bg-white/10 px-3 py-2 backdrop-blur">
                  <em className="inline-flex items-center gap-1.5 text-[10px] font-medium not-italic uppercase tracking-[0.06em] text-white/72"><CheckCircle2 size={12} /> Progress</em>
                  <strong className="text-[17px] font-medium leading-tight text-white">{completedCount} / 30</strong>
                </span>
              </span>
            </div>
            <div className="relative z-10 grid gap-1.5">
              <span className="h-2 overflow-hidden rounded-full bg-white/14">
                <span className="block h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${progressPercent}%` }} />
              </span>
              <span className="flex items-center justify-between gap-3 text-[11px] text-white/72">
                <em className="not-italic">{progressPercent}% complete</em>
                <em className="not-italic">{planStatus}</em>
              </span>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <aside className="order-1 grid gap-3 rounded-[20px] border-hairline border-line bg-white/90 p-3 shadow-[0_12px_30px_rgba(var(--brand-deep-rgb), 0.06)] backdrop-blur lg:order-2 lg:sticky lg:top-[76px]">
              <span className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <span className="grid gap-0.5">
                  <strong className="text-[17px] font-medium text-text-primary">Jump to any day</strong>
                  <em className="text-[12px] not-italic text-text-secondary">Your plan, at your pace.</em>
                </span>
                <span className="rounded-full bg-accent-tint px-2.5 py-1 text-[11px] font-medium text-[var(--accent-ink)]">{planStatus}</span>
              </span>

              <div className="grid grid-cols-[42px_minmax(0,1fr)_42px] gap-2">
                <button className="tap-card grid h-11 place-items-center rounded-[13px] border-hairline border-line bg-white text-brand disabled:opacity-35" type="button" onClick={selectPreviousFitnessDay} disabled={selectedDay.day === 1} aria-label="Previous workout day">
                  <ArrowLeft size={16} />
                </button>
                <label className="relative grid">
                  <span className="sr-only">Choose workout day</span>
                  <select className="min-h-11 w-full appearance-none rounded-[13px] border-hairline border-line bg-surface/55 px-3 pr-9 text-[14px] font-medium text-brand outline-none focus:border-brand focus:ring-2 focus:ring-brand-light" value={selectedDay.day} onChange={(event) => setSelectedFitnessDay(Number(event.target.value))}>
                    {tennisFitnessRegimen.map((day) => (
                      <option value={day.day} key={day.day}>Day {day.day} · {getFitnessProgramPhase(day.day)}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand" size={15} />
                </label>
                <button className="tap-card grid h-11 place-items-center rounded-[13px] border-hairline border-line bg-white text-brand disabled:opacity-35" type="button" onClick={selectNextFitnessDay} disabled={selectedDay.day === 30} aria-label="Next workout day">
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="tap-card min-h-9 rounded-[12px] bg-accent-tint px-2 text-[12px] font-medium text-[var(--accent-ink)]" type="button" onClick={() => setSelectedFitnessDay(paceDay)}>
                  Plan pace · Day {paceDay}
                </button>
                <button className="tap-card min-h-9 rounded-[12px] bg-brand-primary px-2 text-[12px] font-medium text-white transition hover:bg-brand-mid disabled:opacity-45" type="button" onClick={() => recommendedOpenDay && setSelectedFitnessDay(recommendedOpenDay.day)} disabled={!recommendedOpenDay}>
                  {recommendedOpenDay ? `Suggested · Day ${recommendedOpenDay.day}` : "Program complete"}
                </button>
              </div>

              <span className="flex items-center justify-between gap-3 md:hidden">
                <strong className="text-[13px] font-medium text-text-primary">All 30 days</strong>
                <em className="inline-flex items-center gap-1 text-[11px] not-italic text-text-secondary">Swipe or use arrows <ArrowRight size={12} /></em>
              </span>
              <div className="grid grid-cols-[36px_minmax(0,1fr)_36px] items-center gap-1.5 md:block">
                <button className="tap-card grid h-10 place-items-center rounded-full bg-brand-light text-brand disabled:opacity-30 md:hidden" type="button" onClick={() => scrollFitnessDayRail(-1)} disabled={!canScrollFitnessDaysLeft} aria-label="Show earlier fitness days">
                  <ArrowLeft size={15} />
                </button>
                <div ref={fitnessDayRailRef} className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 py-1 md:grid md:grid-cols-10 md:overflow-visible md:p-0 lg:grid-cols-5 xl:grid-cols-6" onScroll={updateFitnessDayRailControls} aria-label="30-day program navigator">
                  {loading && Array.from({ length: 8 }).map((_, index) => (
                    <span className="h-10 w-10 shrink-0 animate-pulse rounded-[12px] bg-surface md:w-auto" key={index} />
                  ))}
                  {!loading && tennisFitnessRegimen.map((day) => {
                    const done = completedDays.includes(day.day);
                    const selected = selectedDay.day === day.day;
                    const suggested = recommendedOpenDay?.day === day.day;
                    return (
                      <FitnessDayNavigatorButton
                        day={day.day}
                        done={done}
                        key={day.day}
                        onSelect={setSelectedFitnessDay}
                        selected={selected}
                        suggested={suggested}
                      />
                    );
                  })}
                </div>
                <button className="tap-card grid h-10 place-items-center rounded-full bg-brand-primary text-white disabled:opacity-30 md:hidden" type="button" onClick={() => scrollFitnessDayRail(1)} disabled={!canScrollFitnessDaysRight} aria-label="Show later fitness days">
                  <ArrowRight size={15} />
                </button>
              </div>

              <span className="grid grid-cols-3 gap-1 text-center text-[10px] font-medium text-text-muted">
                <em className="rounded-full bg-surface px-2 py-1 not-italic">1–10 Foundation</em>
                <em className="rounded-full bg-surface px-2 py-1 not-italic">11–20 Build</em>
                <em className="rounded-full bg-surface px-2 py-1 not-italic">21–30 Peak</em>
              </span>
            </aside>

            <article className="order-2 grid content-start gap-4 rounded-[22px] border-hairline border-line bg-white p-4 sm:p-5 lg:order-1">
              <span className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <span className="grid gap-1">
                  <em className="text-[11px] font-medium not-italic uppercase tracking-[0.08em] text-text-muted">{selectedDayPhase} phase</em>
                  <strong className="text-[28px] font-medium leading-none tracking-[-0.5px] text-brand">Day {selectedDay.day}</strong>
                  <em className="text-[13px] not-italic text-text-secondary">{selectedDay.exercises.length} {selectedDay.exercises.length === 1 ? "movement" : "movements"}</em>
                </span>
                <span className={selectedDayComplete ? "inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-3 py-1.5 text-[12px] font-medium text-white" : "inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1.5 text-[12px] font-medium text-[var(--accent-on)]"}>
                  {selectedDayComplete ? <CheckCircle2 size={14} /> : <Dumbbell size={14} />}
                  {selectedDayComplete ? "Completed" : recommendedOpenDay?.day === selectedDay.day ? "Up next" : "Ready"}
                </span>
              </span>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {loading && Array.from({ length: 4 }).map((_, index) => (
                  <span className="min-h-[72px] animate-pulse rounded-[16px] bg-white/70" key={index} />
                ))}
                {!loading && selectedDay.exercises.map((exercise, index) => {
                  const exerciseDetail = parseFitnessExercise(exercise);
                  return (
                    <span className="grid min-h-[72px] grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-[16px] border-hairline border-white/85 bg-white/88 px-3 py-2.5 shadow-[0_8px_18px_rgba(var(--brand-deep-rgb), 0.04)]" key={exercise}>
                      <span className={selectedDayComplete ? "grid h-9 w-9 place-items-center rounded-full bg-brand-primary text-white" : "grid h-9 w-9 place-items-center rounded-full bg-accent-tint text-[13px] font-medium text-[var(--accent-ink)]"}>
                        {selectedDayComplete ? <CheckCircle2 size={16} /> : index + 1}
                      </span>
                      <strong className="text-[15px] font-medium leading-tight text-text-primary">{exerciseDetail.name}</strong>
                      {exerciseDetail.reps && (
                        <span className="grid min-w-10 justify-items-center rounded-[11px] bg-surface px-2 py-1.5">
                          <strong className="text-[17px] font-medium leading-none text-brand">{exerciseDetail.reps}</strong>
                          <em className="text-[9px] font-medium not-italic uppercase tracking-[0.06em] text-text-muted">reps</em>
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>

              {message && <StatusMessage tone="error">{message}</StatusMessage>}
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                <button
                  className={selectedDayComplete ? "tap-card inline-flex min-h-12 items-center justify-center gap-2 rounded-[15px] border-hairline border-line bg-white px-5 text-[14px] font-medium text-brand disabled:opacity-60" : "tap-card inline-flex min-h-12 items-center justify-center gap-2 rounded-[15px] bg-brand-primary px-5 text-[14px] font-medium text-white transition hover:bg-brand-mid disabled:opacity-60"}
                  type="button"
                  onClick={() => toggleFitnessDay(selectedDay.day)}
                  disabled={loading || savingDay === selectedDay.day}
                >
                  {savingDay === selectedDay.day ? "Saving..." : selectedDayComplete ? "Mark incomplete" : "Complete workout"}
                </button>
                <button className="tap-card inline-flex min-h-12 items-center justify-center gap-2 rounded-[15px] bg-accent-tint px-4 text-[14px] font-medium text-[var(--accent-ink)] disabled:opacity-40" type="button" onClick={selectNextFitnessDay} disabled={selectedDay.day === 30}>
                  Next day <ArrowRight size={15} />
                </button>
              </div>
            </article>
          </section>

          <section className="grid gap-3 rounded-[20px] border-hairline border-line bg-white p-4 shadow-[0_12px_30px_rgba(var(--brand-deep-rgb), 0.06)]" aria-labelledby="community-fitness-title">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <span className="grid gap-0.5">
                <em className="text-[10px] font-medium not-italic uppercase tracking-[0.1em] text-[var(--accent-ink)]">Training together</em>
                <h2 className="text-[19px] font-medium tracking-[-0.2px] text-text-primary" id="community-fitness-title">Fitness Leaderboard</h2>
                <p className="text-[12px] text-text-secondary">See every registered player’s progress and keep each other moving.</p>
              </span>
              <span className="grid grid-cols-2 gap-2 text-center">
                <span className="grid min-w-[86px] gap-0.5 rounded-[12px] bg-brand-light px-2.5 py-2">
                  <strong className="text-[16px] font-medium leading-none text-brand">{communityActivePlayers}/{communityPlayers.length}</strong>
                  <em className="text-[9px] font-medium not-italic uppercase tracking-[0.04em] text-[var(--accent-ink)]">Training</em>
                </span>
                <span className="grid min-w-[86px] gap-0.5 rounded-[12px] bg-surface px-2.5 py-2">
                  <strong className="text-[16px] font-medium leading-none text-brand">{communityCompletedWorkouts}</strong>
                  <em className="text-[9px] font-medium not-italic uppercase tracking-[0.04em] text-text-secondary">Workouts</em>
                </span>
              </span>
            </div>

            {communityMessage && <StatusMessage tone="info">{communityMessage}</StatusMessage>}
            {loading && (
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => <span className="h-[58px] animate-pulse rounded-[14px] bg-surface" key={index} />)}
              </div>
            )}
            {!loading && !communityPlayers.length && !communityMessage && (
              <p className="rounded-[14px] bg-surface/60 p-3 text-[12px] text-text-secondary">Registered-player progress will appear here once tournament registration is available.</p>
            )}
            {!loading && !!communityPlayers.length && (
              <div className="grid max-h-[330px] gap-2 overflow-y-auto pr-1 md:grid-cols-2 xl:grid-cols-3" aria-label="Registered player fitness progress">
                {communityPlayers.map((player, index) => {
                  const playerProgressPercent = Math.round((player.completedDays / tennisFitnessRegimen.length) * 100);
                  const isCurrentPlayer = player.playerId === appSession.player?.id;
                  return (
                    <article className={isCurrentPlayer ? "grid min-w-0 grid-cols-[24px_36px_minmax(0,1fr)_auto] items-center gap-2 rounded-[14px] border-hairline border-brand/25 bg-brand-light/55 p-2" : "grid min-w-0 grid-cols-[24px_36px_minmax(0,1fr)_auto] items-center gap-2 rounded-[14px] border-hairline border-line bg-surface/35 p-2"} key={player.playerId}>
                      <span className={index < 3 ? "grid h-6 w-6 place-items-center rounded-full bg-brand-deep text-[9px] font-medium text-white" : "grid h-6 w-6 place-items-center rounded-full bg-white text-[9px] font-medium text-text-secondary"}>#{index + 1}</span>
                      <Avatar className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border-2 border-white bg-accent-tint text-[10px] font-medium text-[var(--accent-ink)] shadow-[0_5px_12px_rgba(var(--brand-deep-rgb), 0.08)]" name={player.name} photoUrl={player.profilePhotoUrl} ariaLabel={`${player.name} profile photo`} sizes="36px" />
                      <span className="grid min-w-0 gap-1">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <Link className="tap-card truncate text-[12px] font-medium text-text-primary underline decoration-current/20 underline-offset-2 transition hover:decoration-current" href={`/tournaments/players/${player.playerId}?from=fitness`}>{player.name}</Link>
                          {isCurrentPlayer && <em className="shrink-0 rounded-full bg-white px-1.5 py-0.5 text-[8px] font-medium not-italic uppercase text-brand">You</em>}
                        </span>
                        <span className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                          <span className="h-1.5 overflow-hidden rounded-full bg-white">
                            <span className="block h-full rounded-full bg-brand-primary" style={{ width: `${playerProgressPercent}%` }} />
                          </span>
                          <em className="truncate text-[8px] not-italic text-text-muted">{player.city}</em>
                        </span>
                      </span>
                      <span className="grid min-w-[40px] justify-items-center rounded-[10px] bg-white px-1.5 py-1.5">
                        <strong className="text-[13px] font-medium leading-none text-brand">{player.completedDays}</strong>
                        <em className="text-[7px] font-medium not-italic uppercase text-text-muted">of 30</em>
                      </span>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <details className="group overflow-hidden rounded-[16px] border-hairline border-[var(--accent-line)] bg-brand-light">
            <summary className="tap-card flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-[14px] font-medium text-[var(--accent-ink)] [&::-webkit-details-marker]:hidden">
              Training guidance
              <ChevronDown className="transition-transform group-open:rotate-180" size={16} />
            </summary>
            <ul className="grid gap-2 border-t-hairline border-[var(--accent-line)] px-4 py-3 text-[13px] leading-relaxed text-[var(--accent-ink)] md:grid-cols-2">
              {tennisFitnessTips.map((tip) => (
                <li className="grid grid-cols-[18px_minmax(0,1fr)] gap-2" key={tip}>
                  <CheckCircle2 className="mt-0.5" size={15} />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </details>
        </main>
      </div>
    </AppFrame>
  );
}

export function TournamentScheduleScreen() {
  const appSession = useProtectedRoute("/tournaments/schedule", true);
  const router = useRouter();
  const [scheduleAccess, setScheduleAccess] = useState<"checking" | "allowed" | "denied">("checking");
  const usesMoizSchedulePreview = isMoizSchedulePreviewPlayer(appSession.player);

  useEffect(() => {
    if (!appSession.ready || !appSession.userId || !appSession.profileComplete || !appSession.player?.id) return;
    let cancelled = false;
    const playerId = appSession.player.id;

    if (usesMoizSchedulePreview) {
      setScheduleAccess("allowed");
      return;
    }

    const checkTournamentRegistration = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        if (!cancelled) setScheduleAccess("denied");
        return;
      }

      const { data: tournament } = await supabase
        .from("tournaments")
        .select("id")
        .in("status", ["registration_open", "registration_closed", "live"])
        .order("starts_on", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!tournament) {
        if (!cancelled) {
          setScheduleAccess("denied");
          router.replace("/tournaments");
        }
        return;
      }

      const { data: registration } = await supabase
        .from("tournament_registrations")
        .select("id")
        .eq("tournament_id", tournament.id)
        .eq("player_id", playerId)
        .neq("status", "cancelled")
        .in("payment_status", ["paid", "waived"])
        .maybeSingle();

      if (cancelled) return;
      if (registration) {
        setScheduleAccess("allowed");
      } else {
        setScheduleAccess("denied");
        router.replace("/tournaments");
      }
    };

    checkTournamentRegistration();
    return () => {
      cancelled = true;
    };
  }, [appSession.player?.id, appSession.profileComplete, appSession.ready, appSession.userId, router, usesMoizSchedulePreview]);

  if (!appSession.ready || !appSession.userId || !appSession.profileComplete || scheduleAccess !== "allowed") return null;
  return <TournamentScheduleExperience view="schedule" />;
}

export function TournamentLiveBracketScreen() {
  return <TournamentScheduleExperience view="bracket" />;
}

type TvScene = "live" | "team" | "player" | "sponsor";
type TvSponsorSpotlight = TeamSponsor & { id: string; teamName: string };
type TvTimelineNode = {
  id: string;
  kind: "event" | "matches";
  timeLabel: string;
  label: string;
  sortValue: number;
  event: ScheduleItem | null;
  matches: TeamCourtScheduleMatch[];
};

const tvScenes: Array<{ id: TvScene; label: string }> = [
  { id: "live", label: "Live view" },
  { id: "team", label: "Team leaderboard" },
  { id: "player", label: "Player leaderboard" },
  { id: "sponsor", label: "Sponsor spotlight" }
];

function getNextTvScene(scene: TvScene): TvScene {
  return scene === "sponsor" ? "live" : "sponsor";
}

function getTvSceneDuration(scene: TvScene) {
  if (scene === "live") return 60;
  if (scene === "sponsor") return 10;
  return 0;
}

function getTvTierLeaders(standings: PlayerStanding[]) {
  const seenTiers = new Set<number>();
  return standings
    .filter((standing) => standing.tierRank === 1)
    .sort((left, right) => left.tierNumber - right.tierNumber
      || right.matchWins - left.matchWins
      || left.matchLosses - right.matchLosses
      || right.setWinPercentage - left.setWinPercentage
      || right.gameWinPercentage - left.gameWinPercentage
      || left.player.name.localeCompare(right.player.name))
    .filter((standing) => {
      if (seenTiers.has(standing.tierNumber)) return false;
      seenTiers.add(standing.tierNumber);
      return true;
    })
    .slice(0, 4);
}

export function TournamentTvDayScreen() {
  const appSession = useProtectedRoute("/tournaments/tv", true);
  const router = useRouter();
  const initializedDayRef = useRef(false);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<PublishedTeam[]>([]);
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [matches, setMatches] = useState<TeamCourtScheduleMatch[]>([]);
  const [selectedDay, setSelectedDay] = useState<1 | 2>(1);
  const [now, setNow] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [tvScene, setTvScene] = useState<TvScene>("live");
  const [sceneSeconds, setSceneSeconds] = useState(60);
  const [rotationPaused, setRotationPaused] = useState(false);
  const [sponsorIndex, setSponsorIndex] = useState(0);
  const [manualTimelineNodeId, setManualTimelineNodeId] = useState<string | null>(null);
  const tvSponsors = getTvSponsorSpotlights(teams);

  useEffect(() => {
    if (appSession.ready && !appSession.isAdmin) router.replace("/tournaments");
  }, [appSession.isAdmin, appSession.ready, router]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setSceneSeconds(getTvSceneDuration(tvScene));
  }, [tvScene]);

  useEffect(() => {
    setManualTimelineNodeId(null);
  }, [selectedDay]);

  useEffect(() => {
    setSponsorIndex((current) => tvSponsors.length ? current % tvSponsors.length : 0);
  }, [tvSponsors.length]);

  useEffect(() => {
    if (rotationPaused || tvScene === "team" || tvScene === "player") return;
    const timer = window.setInterval(() => {
      setSceneSeconds((current) => {
        if (current > 1) return current - 1;
        if (tvScene === "live" && !tvSponsors.length) return getTvSceneDuration("live");
        const nextScene = getNextTvScene(tvScene);
        if (tvScene === "sponsor" && tvSponsors.length) setSponsorIndex((index) => (index + 1) % tvSponsors.length);
        setTvScene(nextScene);
        return getTvSceneDuration(nextScene);
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [rotationPaused, tvScene, tvSponsors.length]);

  const loadTvSchedule = useCallback(async () => {
    if (!appSession.ready || !appSession.isAdmin) return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      setLoading(false);
      return;
    }

    const { data: tournamentData, error: tournamentError } = await supabase
      .from("tournaments")
      .select("id, name, season_year, status, venue_name, venue_address, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents, max_players, notes, faqs")
      .in("status", ["registration_open", "registration_closed", "live", "completed"])
      .order("starts_on", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (tournamentError || !tournamentData) {
      setTournament(null);
      setTeams([]);
      setItems([]);
      setMatches([]);
      setMessage(tournamentError ? getFriendlyError(tournamentError) : "No live tournament found.");
      setLoading(false);
      return;
    }

    const mappedTournament = mapTournament(tournamentData);
    const [teamsResult, itemsResult, scheduleMatchesResult, schedulePlayersResult, scoresResult] = await Promise.all([
      supabase
        .from("tournament_teams")
        .select("id, name, sort_order, logo_url, jersey_color, sponsor_name, sponsor_logo_url, sponsors, tournament_team_members(id, is_captain, draft_order, tier_at_draft, players(id, full_name, jamaat_city, age, date_of_birth, rating, profile_photo_url))")
        .eq("tournament_id", mappedTournament.id)
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("draft_order", { referencedTable: "tournament_team_members", ascending: true })
        .limit(40),
      supabase
        .from("tournament_schedule_items")
        .select("id, item_type, day_number, day_label, time_label, pod_label, court_label, phase, match_label, team_a_sort_order, team_b_sort_order, team_a_label, team_b_label, detail, sort_order")
        .eq("tournament_id", mappedTournament.id)
        .eq("is_published", true)
        .order("day_number", { ascending: true })
        .order("sort_order", { ascending: true })
        .limit(200),
      supabase
        .from("tournament_schedule_matches")
        .select("id, tournament_id, day_number, day_label, time_label, court_label, pod_label, format, match_type, match_color, tier_rule, team_a_id, team_b_id, team_a_label, team_b_label, external_match_id, sort_order")
        .eq("tournament_id", mappedTournament.id)
        .eq("is_published", true)
        .order("day_number", { ascending: true })
        .order("sort_order", { ascending: true })
        .limit(300),
      supabase
        .from("tournament_schedule_match_players")
        .select("id, schedule_match_id, team_id, player_id, side, slot, source_player_name")
        .eq("tournament_id", mappedTournament.id)
        .limit(1200),
      supabase
        .from("tournament_match_scores")
        .select("id, schedule_match_id, side_a_set1, side_b_set1, side_a_set2, side_b_set2, side_a_set3, side_b_set3, winner_side, submitted_at")
        .eq("tournament_id", mappedTournament.id)
        .limit(400)
    ]);

    const scheduleSchemaMissing = isScheduleSchemaMissing(scheduleMatchesResult.error?.message || schedulePlayersResult.error?.message || "");
    const scoreSchemaMissing = isScoreSchemaMissing(scoresResult.error?.message || "");
    const loadError = teamsResult.error || itemsResult.error || (!scheduleSchemaMissing && (scheduleMatchesResult.error || schedulePlayersResult.error)) || (!scoreSchemaMissing && scoresResult.error);
    if (loadError) {
      setMessage(getFriendlyError(loadError));
      setLoading(false);
      return;
    }

    const mappedTeams = mapPublishedTeamsFromRows(teamsResult.data || []);
    const mappedItems = (itemsResult.data || []).map((item) => ({
      id: item.id,
      itemType: item.item_type === "event" ? "event" as const : "match" as const,
      dayNumber: item.day_number || 1,
      dayLabel: item.day_label || `Day ${item.day_number || 1}`,
      timeLabel: item.time_label || "",
      podLabel: item.pod_label || "",
      courtLabel: item.court_label || "",
      phase: item.phase || "",
      matchLabel: item.match_label || "",
      teamASortOrder: item.team_a_sort_order ?? null,
      teamBSortOrder: item.team_b_sort_order ?? null,
      teamALabel: item.team_a_label || "",
      teamBLabel: item.team_b_label || "",
      detail: item.detail || "",
      sortOrder: item.sort_order || 0
    }));
    const mappedScores = scoreSchemaMissing || scoresResult.error ? [] : mapMatchScores(scoresResult.data || []);
    const mappedMatches = scheduleSchemaMissing
      ? []
      : mapTeamCourtScheduleMatches(scheduleMatchesResult.data || [], schedulePlayersResult.data || [], mappedTeams, mappedScores);

    setTournament(mappedTournament);
    setTeams(mappedTeams);
    setItems(mappedItems);
    setMatches(mappedMatches);
    setMessage("");
    setLoading(false);

    if (!initializedDayRef.current) {
      const today = formatLocalDateKey(new Date());
      setSelectedDay(mappedTournament.endsOn === today && mappedTournament.startsOn !== today ? 2 : 1);
      initializedDayRef.current = true;
    }
  }, [appSession.isAdmin, appSession.ready]);

  useEffect(() => {
    loadTvSchedule();
  }, [loadTvSchedule]);

  useEffect(() => {
    if (!appSession.ready || !appSession.isAdmin) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const channel = supabase
      .channel("admin-tv-day-view")
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_schedule_items" }, loadTvSchedule)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_schedule_matches" }, loadTvSchedule)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_schedule_match_players" }, loadTvSchedule)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_match_scores" }, loadTvSchedule)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_teams" }, loadTvSchedule)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [appSession.isAdmin, appSession.ready, loadTvSchedule]);

  if (!appSession.ready || !appSession.isAdmin) return null;

  const selectedMatches = matches.filter((match) => match.dayNumber === selectedDay);
  const dayEvents = getTvDayScheduleEventItems(items, selectedDay);
  const matchesByTime = groupTeamMatchesByTime(selectedMatches);
  const timeLabels = Object.keys(matchesByTime).sort((left, right) => getScheduleTimeSortValue(left) - getScheduleTimeSortValue(right) || left.localeCompare(right));
  const selectedDateKey = getTournamentDayDateKey(tournament, selectedDay);
  const isToday = selectedDateKey === formatLocalDateKey(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const completedDayMatches = selectedMatches.filter((match) => match.score?.winnerSide).length;
  const dayComplete = Boolean(selectedMatches.length && completedDayMatches === selectedMatches.length);
  const timelineNodes = buildTvTimelineNodes(dayEvents, matchesByTime, timeLabels);
  const todayKey = formatLocalDateKey(now);
  const selectedDayIsPast = Boolean(selectedDateKey && selectedDateKey < todayKey);
  const clockTimelineActiveIndex = !timelineNodes.length
    ? -1
    : isToday
      ? timelineNodes.reduce((activeIndex, node, index) => node.sortValue <= currentMinutes ? index : activeIndex, 0)
      : selectedDayIsPast || dayComplete ? timelineNodes.length - 1 : 0;
  const clockTimelineNode = clockTimelineActiveIndex >= 0 ? timelineNodes[clockTimelineActiveIndex] : null;
  const scoreAdvancedTimelineIndex = clockTimelineNode?.kind === "matches"
    && clockTimelineNode.matches.length > 0
    && clockTimelineNode.matches.every((match) => match.score?.winnerSide)
    ? timelineNodes.findIndex((node, index) => index > clockTimelineActiveIndex && (node.kind === "event" || node.matches.some((match) => !match.score?.winnerSide)))
    : -1;
  const automaticTimelineActiveIndex = scoreAdvancedTimelineIndex >= 0 ? scoreAdvancedTimelineIndex : clockTimelineActiveIndex;
  const manualTimelineIndex = manualTimelineNodeId ? timelineNodes.findIndex((node) => node.id === manualTimelineNodeId) : -1;
  const timelineActiveIndex = manualTimelineIndex >= 0 ? manualTimelineIndex : automaticTimelineActiveIndex;
  const timelineIsManuallySelected = manualTimelineIndex >= 0;
  const currentTimelineNode = timelineActiveIndex >= 0 ? timelineNodes[timelineActiveIndex] : null;
  const nextMatchNode = timelineNodes
    .slice(Math.max(0, timelineActiveIndex + 1))
    .find((node) => node.kind === "matches" && node.matches.some((match) => !match.score?.winnerSide)) || null;
  const recentCompletedMatches = [...selectedMatches]
    .filter((match) => match.score?.winnerSide)
    .sort((left, right) => {
      const leftSubmitted = new Date(left.score?.submittedAt || "").getTime() || 0;
      const rightSubmitted = new Date(right.score?.submittedAt || "").getTime() || 0;
      return rightSubmitted - leftSubmitted || getScheduleTimeSortValue(right.timeLabel) - getScheduleTimeSortValue(left.timeLabel) || right.sortOrder - left.sortOrder;
    })
    .slice(0, 5);
  const dayTwoPreviewMatches = matches.filter((match) => match.dayNumber === 2);
  const dayTwoPreviewGroups = groupTeamMatchesByTime(dayTwoPreviewMatches);
  const dayTwoPreviewTimes = Object.keys(dayTwoPreviewGroups).sort((left, right) => getScheduleTimeSortValue(left) - getScheduleTimeSortValue(right) || left.localeCompare(right));
  const dayTwoPreviewNode = selectedDay === 1
    ? buildTvTimelineNodes(getTvDayScheduleEventItems(items, 2), dayTwoPreviewGroups, dayTwoPreviewTimes)
      .find((node) => node.kind === "matches" && node.matches.some((match) => !match.score?.winnerSide)) || null
    : null;
  const fallbackMatchNode = timelineNodes.find((node) => node.kind === "matches" && node.matches.some((match) => !match.score?.winnerSide))
    || [...timelineNodes].reverse().find((node) => node.kind === "matches")
    || null;
  const displayNode = currentTimelineNode || fallbackMatchNode;
  const teamStandings = getLiveTeamStandings(teams, selectedMatches);
  const tierRankedPlayerStandings = getLivePlayerStandings(teams, selectedMatches);
  const tierLeaders = getTvTierLeaders(tierRankedPlayerStandings);
  const playerStandings = [...tierRankedPlayerStandings]
    .sort((left, right) => right.matchWins - left.matchWins
      || left.matchLosses - right.matchLosses
      || right.setWinPercentage - left.setWinPercentage
      || right.gameWinPercentage - left.gameWinPercentage
      || left.player.name.localeCompare(right.player.name));
  const tournamentChampion = getTournamentChampion(teams, matches);
  const tournamentTierLeaders = getTvTierLeaders(getLivePlayerStandings(teams, matches));
  const automaticNextScene = tvScene === "team" || tvScene === "player" ? null : tvScene === "live" && !tvSponsors.length ? "live" : getNextTvScene(tvScene);
  const nextScene = automaticNextScene ? tvScenes.find((scene) => scene.id === automaticNextScene)?.label || "Live view" : "Manual view";
  const selectTvScene = (scene: TvScene) => {
    setTvScene(scene);
    setSceneSeconds(getTvSceneDuration(scene));
  };
  const selectTvSponsor = (index: number) => {
    if (!tvSponsors.length) return;
    setSponsorIndex(((index % tvSponsors.length) + tvSponsors.length) % tvSponsors.length);
    setSceneSeconds(getTvSceneDuration("sponsor"));
    setRotationPaused(true);
  };
  const toggleTvRotation = () => {
    if (tvScene === "team" || tvScene === "player") {
      setRotationPaused(false);
      selectTvScene("live");
      return;
    }
    setRotationPaused((current) => !current);
  };

  if (!loading && !message && tournament && tournamentChampion) {
    return <TvTournamentFinaleScene champion={tournamentChampion} sponsors={tvSponsors} tierLeaders={tournamentTierLeaders} tournament={tournament} />;
  }

  return (
    <div className="flex h-dvh min-h-[720px] flex-col overflow-hidden bg-[var(--surface)] font-sans text-[var(--brand-deep)]">
      <TvPersistentHeader
        nextScene={nextScene}
        now={now}
        onSelectDay={setSelectedDay}
        onSelectScene={selectTvScene}
        onTogglePause={toggleTvRotation}
        paused={rotationPaused}
        scene={tvScene}
        seconds={sceneSeconds}
        selectedDay={selectedDay}
        tournament={tournament}
      />
      <main className="min-h-0 flex-1 overflow-hidden px-[clamp(48px,4.5vw,220px)] py-[clamp(18px,2.5vh,46px)]">
        {loading && <div className="grid min-h-[55vh] place-items-center text-[18px] font-medium text-brand">Loading live day view…</div>}
        {!loading && message && <StatusMessage tone="warning">{message}</StatusMessage>}
        {!loading && !message && tvScene === "live" && (
          <TvLiveScene
            completedDayMatches={completedDayMatches}
            currentNode={displayNode}
            dayComplete={dayComplete}
            isToday={isToday}
            nextMatchNode={nextMatchNode}
            nextDayMatchNode={dayComplete ? dayTwoPreviewNode : null}
            nextDayMatches={dayTwoPreviewMatches}
            playerStandings={playerStandings}
            recentCompletedMatches={recentCompletedMatches}
            selectedDay={selectedDay}
            selectedMatches={selectedMatches}
            sponsors={tvSponsors}
            teamStandings={teamStandings}
            teams={teams}
            tierLeaders={tierLeaders}
            timelineActiveIndex={timelineActiveIndex}
            timelineIsManuallySelected={timelineIsManuallySelected}
            timelineNodes={timelineNodes}
            onSelectTimelineNode={(nodeId) => setManualTimelineNodeId(nodeId)}
            onUseAutomaticTimeline={() => setManualTimelineNodeId(null)}
          />
        )}
        {!loading && !message && tvScene === "team" && <TvTeamLeaderboardScene standings={teamStandings} />}
        {!loading && !message && tvScene === "player" && <TvPlayerLeaderboardScene standings={playerStandings} />}
        {!loading && !message && tvScene === "sponsor" && (
          <TvSponsorSpotlightScene
            activeIndex={sponsorIndex}
            sponsors={tvSponsors}
            onSelect={selectTvSponsor}
          />
        )}
      </main>
    </div>
  );
}

function getTvSponsorSpotlights(teams: PublishedTeam[]): TvSponsorSpotlight[] {
  const seen = new Set<string>();
  return teams.flatMap((team) => team.sponsors.map((sponsor, index) => ({
    ...sponsor,
    id: `${team.id}:${sponsor.websiteUrl || sponsor.logoUrl || sponsor.name || index}`,
    teamName: team.name
  }))).filter((sponsor) => {
    const key = `${normalizeName(sponsor.name)}:${sponsor.websiteUrl}:${normalizeName(sponsor.teamName)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return Boolean(sponsor.name || sponsor.logoUrl || sponsor.websiteUrl);
  });
}

function getTvTimelineBlockLabel(matches: TeamCourtScheduleMatch[], index: number) {
  const matchType = matches.find((match) => match.matchType)?.matchType || "";
  if (matchType) return getSchedulePhaseBadgeLabel(matchType);
  const podLabel = matches.find((match) => match.podLabel)?.podLabel || "";
  return podLabel || `Round ${index + 1}`;
}

function buildTvTimelineNodes(dayEvents: ScheduleItem[], matchesByTime: Record<string, TeamCourtScheduleMatch[]>, timeLabels: string[]): TvTimelineNode[] {
  const matchNodes = timeLabels.map((timeLabel, index) => {
    const matches = matchesByTime[timeLabel] || [];
    return {
      id: `matches:${timeLabel}`,
      kind: "matches" as const,
      timeLabel,
      label: getTvTimelineBlockLabel(matches, index),
      sortValue: getScheduleTimeSortValue(timeLabel),
      event: null,
      matches
    };
  });
  const eventNodes = dayEvents.map((event) => ({
    id: `event:${event.id}`,
    kind: "event" as const,
    timeLabel: event.timeLabel || event.dayLabel,
    label: getScheduleMilestoneLabel(event),
    sortValue: getScheduleTimeSortValue(event.timeLabel || event.dayLabel),
    event,
    matches: []
  }));
  return [...matchNodes, ...eventNodes].sort((left, right) => left.sortValue - right.sortValue || Number(left.kind === "matches") - Number(right.kind === "matches") || left.label.localeCompare(right.label));
}

function TvPersistentHeader({ tournament, now, selectedDay, scene, seconds, paused, nextScene, onSelectDay, onSelectScene, onTogglePause }: { tournament: Tournament | null; now: Date; selectedDay: 1 | 2; scene: TvScene; seconds: number; paused: boolean; nextScene: string; onSelectDay: (day: 1 | 2) => void; onSelectScene: (scene: TvScene) => void; onTogglePause: () => void }) {
  const manualScene = scene === "team" || scene === "player";
  return (
    <header className="relative shrink-0 overflow-hidden border-b border-white/10 bg-[var(--brand-deep)] px-[clamp(48px,4.5vw,220px)] pb-[clamp(14px,1.4vh,28px)] pt-[clamp(28px,4vh,80px)] text-white shadow-[0_14px_38px_rgba(var(--brand-deep-rgb), 0.22)]">
      <span className="pointer-events-none absolute inset-0 opacity-35 court-lines" aria-hidden="true" />
      <div className="relative grid grid-cols-[minmax(170px,0.8fr)_minmax(460px,2.8fr)_minmax(210px,0.9fr)] items-center gap-[clamp(16px,2vw,48px)]">
        <Link className="tap-card !w-max inline-flex min-h-[clamp(44px,3vw,60px)] items-center gap-3 rounded-full bg-white px-[clamp(18px,1.5vw,30px)] text-[clamp(15px,1vw,22px)] font-semibold text-brand shadow-[0_8px_20px_rgba(var(--brand-deep-rgb),0.16)]" href="/tournaments" aria-label="Back to tournament">
          <ArrowLeft className="h-[clamp(18px,1.2vw,26px)] w-[clamp(18px,1.2vw,26px)]" />
          Tournament
        </Link>
        <span className="grid min-w-0 justify-items-center gap-1 text-center">
          <span className="inline-flex items-center gap-2 text-[clamp(12px,0.8vw,18px)] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]"><span className="h-[clamp(8px,0.55vw,12px)] w-[clamp(8px,0.55vw,12px)] animate-pulse rounded-full bg-[var(--accent)]" />Live day display</span>
          <h1 className="max-w-full truncate text-[clamp(28px,2.15vw,54px)] font-semibold leading-tight tracking-[-0.03em]">{tournament?.name || "Tournament Day View"}</h1>
        </span>
        <span className="grid justify-items-end text-right">
          <strong className="font-mono text-[clamp(24px,1.75vw,42px)] font-semibold leading-none tabular-nums">{formatTvClock(now)}</strong>
          <em className="mt-1 text-[clamp(11px,0.7vw,17px)] font-semibold not-italic uppercase tracking-[0.08em] text-white/72">{now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/Chicago" })}</em>
        </span>
      </div>

      <div className="relative mt-[clamp(14px,1.4vh,26px)] grid grid-cols-[minmax(180px,0.8fr)_minmax(620px,3fr)_minmax(250px,1fr)] items-center gap-[clamp(16px,2vw,48px)] border-t border-white/10 pt-[clamp(12px,1.15vh,22px)]">
        <div className="grid w-max grid-cols-2 gap-1 rounded-full border border-white/10 bg-white/10 p-1" aria-label="TV tournament day">
          {([1, 2] as const).map((day) => (
            <button className={selectedDay === day ? "min-h-[clamp(40px,2.5vw,54px)] rounded-full bg-[var(--accent)] px-[clamp(20px,1.5vw,34px)] text-[clamp(14px,0.9vw,20px)] font-semibold text-[var(--accent-on)]" : "min-h-[clamp(40px,2.5vw,54px)] rounded-full px-[clamp(20px,1.5vw,34px)] text-[clamp(14px,0.9vw,20px)] font-semibold text-white/72 hover:bg-white/8"} type="button" onClick={() => onSelectDay(day)} aria-pressed={selectedDay === day} key={day}>Day {day}</button>
          ))}
        </div>
        <div className="mx-auto grid w-full max-w-[920px] grid-cols-4 gap-1 rounded-full border border-white/10 bg-white/10 p-1" aria-label="TV display scene">
          {tvScenes.map((candidate) => (
            <button className={scene === candidate.id ? "min-h-[clamp(40px,2.5vw,54px)] rounded-full bg-white px-3 text-[clamp(13px,0.85vw,19px)] font-semibold text-brand shadow-[0_6px_16px_rgba(var(--brand-deep-rgb),0.14)]" : "min-h-[clamp(40px,2.5vw,54px)] rounded-full px-3 text-[clamp(13px,0.85vw,19px)] font-semibold text-white/72 hover:bg-white/8"} type="button" onClick={() => onSelectScene(candidate.id)} aria-pressed={scene === candidate.id} key={candidate.id}>{candidate.label}</button>
          ))}
        </div>
        <span className="flex items-stretch justify-end gap-2">
          <span className="grid min-w-[clamp(140px,9vw,200px)] content-center justify-items-end rounded-[16px] border border-white/10 bg-white/10 px-4 text-right">
            <strong className="text-[clamp(16px,1.1vw,24px)] font-semibold tabular-nums text-[var(--accent)]">{manualScene ? "Manual" : paused ? "Paused" : `${seconds}s`}</strong>
            <em className="text-[clamp(9px,0.55vw,13px)] font-medium not-italic uppercase tracking-[0.06em] text-white/72">{manualScene ? "Stays on this view" : paused ? "Rotation paused" : `${nextScene} next`}</em>
          </span>
          <button className={paused || manualScene ? "min-w-[clamp(90px,6vw,132px)] rounded-[16px] bg-[var(--accent)] px-4 text-[clamp(13px,0.8vw,18px)] font-semibold text-[var(--accent-on)]" : "min-w-[clamp(90px,6vw,132px)] rounded-[16px] border border-white/15 bg-white/10 px-4 text-[clamp(13px,0.8vw,18px)] font-semibold text-white transition hover:bg-white/18"} type="button" onClick={onTogglePause} aria-pressed={paused}>{manualScene ? "Return live" : paused ? "Resume" : "Pause"}</button>
        </span>
      </div>
    </header>
  );
}

function TvLiveScene({ timelineNodes, timelineActiveIndex, timelineIsManuallySelected, onSelectTimelineNode, onUseAutomaticTimeline, currentNode, recentCompletedMatches, nextMatchNode, nextDayMatchNode, nextDayMatches, selectedDay, selectedMatches, completedDayMatches, dayComplete, isToday, teams, teamStandings, playerStandings, tierLeaders, sponsors }: { timelineNodes: TvTimelineNode[]; timelineActiveIndex: number; timelineIsManuallySelected: boolean; onSelectTimelineNode: (nodeId: string) => void; onUseAutomaticTimeline: () => void; currentNode: TvTimelineNode | null; recentCompletedMatches: TeamCourtScheduleMatch[]; nextMatchNode: TvTimelineNode | null; nextDayMatchNode: TvTimelineNode | null; nextDayMatches: TeamCourtScheduleMatch[]; selectedDay: 1 | 2; selectedMatches: TeamCourtScheduleMatch[]; completedDayMatches: number; dayComplete: boolean; isToday: boolean; teams: PublishedTeam[]; teamStandings: TeamStanding[]; playerStandings: PlayerStanding[]; tierLeaders: PlayerStanding[]; sponsors: TvSponsorSpotlight[] }) {
  const currentIsLive = Boolean(isToday && !dayComplete && currentNode && !timelineIsManuallySelected);
  const remainingMatches = selectedMatches.filter((match) => !match.score?.winnerSide);
  return (
    <section className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto_auto] gap-[clamp(8px,0.8vh,16px)]" aria-label={`Day ${selectedDay} at-a-glance live schedule`}>
      <div className={dayComplete ? "grid min-h-0 grid-cols-[minmax(250px,18fr)_minmax(700px,55fr)_minmax(340px,27fr)] gap-[clamp(12px,1vw,22px)]" : "grid min-h-0 grid-cols-[minmax(240px,18fr)_minmax(520px,38fr)_minmax(320px,24fr)_minmax(260px,20fr)] gap-[clamp(10px,0.8vw,18px)]"}>
        <TvRecentResultsPanel completedMatches={completedDayMatches} dayComplete={dayComplete} matches={recentCompletedMatches} selectedDay={selectedDay} totalMatches={selectedMatches.length} />
        <TvCurrentBlockPanel activeIndex={timelineActiveIndex} completedDayMatches={completedDayMatches} currentNode={currentNode} dayComplete={dayComplete} isLive={currentIsLive} isManualFocus={timelineIsManuallySelected} onSelectNode={onSelectTimelineNode} onUseAutomatic={onUseAutomaticTimeline} selectedDay={selectedDay} selectedMatches={selectedMatches} teamStandings={teamStandings} teams={teams} tierLeaders={tierLeaders} timelineNodes={timelineNodes} />
        {dayComplete ? <TvDayTwoGlancePanel matches={selectedDay === 1 ? nextDayMatches : []} node={selectedDay === 1 ? nextDayMatchNode : null} selectedDay={selectedDay} teams={teams} /> : <><TvNextBlockPanel node={nextMatchNode} selectedDay={selectedDay} teams={teams} /><TvDayRemainingPanel matches={remainingMatches} timelineNodes={timelineNodes} /></>}
      </div>
      <TvLeadersTicker playerStandings={playerStandings} teamStandings={teamStandings} />
      <TvSponsorStrip sponsors={sponsors} />
    </section>
  );
}

function TvPanelHeading({ eyebrow, time, tone = "neutral" }: { eyebrow: string; time: string; tone?: "neutral" | "live" | "upcoming" }) {
  return (
    <header className="flex items-center justify-between gap-3 px-[clamp(14px,1vw,22px)] pb-[clamp(9px,0.7vh,14px)]">
      <span className="inline-flex min-w-0 items-center gap-2">
        <span className={tone === "live" ? "h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--urgent)]" : tone === "upcoming" ? "h-2.5 w-2.5 rounded-full border-2 border-[var(--hairline-strong)]" : "h-2.5 w-2.5 rounded-full bg-[var(--mist)]"} />
        <strong className={tone === "live" ? "truncate text-[clamp(13px,0.8vw,18px)] font-semibold uppercase tracking-[0.08em] text-[var(--urgent)]" : "truncate text-[clamp(13px,0.8vw,18px)] font-semibold uppercase tracking-[0.08em] text-text-secondary"}>{eyebrow}</strong>
      </span>
      <time className="shrink-0 text-[clamp(18px,1.25vw,28px)] font-semibold tabular-nums text-brand">{time}</time>
    </header>
  );
}

function TvRecentResultsPanel({ matches, selectedDay, totalMatches, completedMatches, dayComplete }: { matches: TeamCourtScheduleMatch[]; selectedDay: 1 | 2; totalMatches: number; completedMatches: number; dayComplete: boolean }) {
  return (
    <section className="min-h-0 overflow-hidden rounded-[clamp(16px,1.25vw,24px)] border border-[var(--hairline-strong)] bg-[var(--surface)] py-[clamp(12px,1vh,20px)]">
      <header className="flex items-center justify-between gap-3 px-[clamp(14px,1vw,22px)] pb-[clamp(9px,0.7vh,14px)]"><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-[clamp(18px,1.2vw,26px)] w-[clamp(18px,1.2vw,26px)] text-brand" /><strong className="text-[clamp(14px,0.9vw,20px)] font-semibold uppercase tracking-[0.08em] text-brand">{dayComplete ? `Day ${selectedDay} completed` : "Completed"}</strong></span><span className="rounded-full bg-white px-3 py-1.5 text-[clamp(12px,0.75vw,17px)] font-semibold tabular-nums text-brand">{completedMatches}/{totalMatches}</span></header>
      <div className="grid max-h-full gap-[clamp(6px,0.55vh,10px)] overflow-hidden px-[clamp(10px,0.8vw,16px)]">
        {matches.map((match) => {
          const winnerNames = match.score?.winnerSide === "A" ? match.playersA : match.playersB;
          const fallback = match.score?.winnerSide === "A" ? match.teamAName : match.teamBName;
          const winningTeamId = match.score?.winnerSide === "A" ? match.teamAId : match.teamBId;
          return (
            <article className="grid min-h-[clamp(58px,5.2vh,82px)] grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-[12px] border border-[var(--hairline-strong)] bg-white px-3 py-2" key={match.id}>
              <strong className="rounded-[8px] bg-brand-deep px-2 py-1.5 text-[clamp(11px,0.68vw,15px)] font-semibold uppercase text-white">{formatCourtNumber(match.courtLabel) || "Court"}</strong>
              <span className="grid min-w-0 gap-0.5"><strong className="truncate text-[clamp(13px,0.84vw,18px)] font-semibold text-text-primary">{formatBracketPlayerNames(winnerNames, fallback)} won</strong><em className="truncate text-[clamp(11px,0.68vw,15px)] font-semibold not-italic text-text-secondary">{formatBracketMatchScore(match, winningTeamId)} · {getTvWinMargin(match)} games</em></span>
            </article>
          );
        })}
        {!matches.length && <p className="rounded-[14px] border border-dashed border-[var(--hairline-strong)] bg-white/65 p-4 text-[clamp(13px,0.85vw,18px)] leading-relaxed text-text-secondary">The latest submitted result will appear here automatically.</p>}
      </div>
    </section>
  );
}

function TvCurrentBlockPanel({ currentNode, dayComplete, selectedDay, selectedMatches, completedDayMatches, isLive, isManualFocus, teams, teamStandings, tierLeaders, timelineNodes, activeIndex, onSelectNode, onUseAutomatic }: { currentNode: TvTimelineNode | null; dayComplete: boolean; selectedDay: 1 | 2; selectedMatches: TeamCourtScheduleMatch[]; completedDayMatches: number; isLive: boolean; isManualFocus: boolean; teams: PublishedTeam[]; teamStandings: TeamStanding[]; tierLeaders: PlayerStanding[]; timelineNodes: TvTimelineNode[]; activeIndex: number; onSelectNode: (nodeId: string) => void; onUseAutomatic: () => void }) {
  if (dayComplete && selectedDay === 1) return <TvDayOneLeadersPanel teamStanding={teamStandings[0] || null} tierLeaders={tierLeaders} />;
  if (dayComplete) return <TvDayCompletePanel completedMatches={completedDayMatches} selectedDay={selectedDay} selectedMatches={selectedMatches} />;
  if (currentNode?.kind === "event") return <TvAmbientEventPanel activeIndex={activeIndex} event={currentNode.event} isLive={isLive} isManual={isManualFocus} nodes={timelineNodes} onSelectNode={onSelectNode} onUseAutomatic={onUseAutomatic} />;
  const matches = (currentNode?.matches || []).filter((match) => !match.score?.winnerSide);
  return (
    <section className="min-h-0 overflow-hidden rounded-[clamp(16px,1.25vw,24px)] border border-[var(--hairline-strong)] bg-white py-[clamp(12px,1vh,20px)] shadow-[0_16px_40px_rgba(var(--brand-deep-rgb), 0.08)]">
      <TvBlockNavigator activeIndex={activeIndex} isManual={isManualFocus} nodes={timelineNodes} onSelectNode={onSelectNode} onUseAutomatic={onUseAutomatic} />
      <TvPanelHeading eyebrow={isLive ? `Happening now · ${currentNode?.label || "Court block"}` : isManualFocus ? `Organizer selected · ${currentNode?.label || "Court block"}` : `Current focus · ${currentNode?.label || "Court block"}`} time={currentNode?.timeLabel || "TBD"} tone={isLive ? "live" : "neutral"} />
      <div className="grid min-h-0 grid-cols-2 gap-[clamp(8px,0.65vw,14px)] overflow-hidden px-[clamp(10px,0.8vw,16px)]">
        {matches.map((match) => <TvLiveMatchCard isLive={isLive && !match.score?.winnerSide} match={match} teams={teams} key={match.id} />)}
        {!matches.length && <p className="col-span-2 grid min-h-[220px] place-items-center rounded-[18px] border border-dashed border-[var(--hairline-strong)] bg-[var(--surface)] p-8 text-center text-[clamp(18px,1.2vw,28px)] font-semibold text-brand">This block is completed. Move to the next block or follow the live schedule.</p>}
      </div>
    </section>
  );
}

function TvBlockNavigator({ nodes, activeIndex, isManual, onSelectNode, onUseAutomatic }: { nodes: TvTimelineNode[]; activeIndex: number; isManual: boolean; onSelectNode: (nodeId: string) => void; onUseAutomatic: () => void }) {
  const previousNode = activeIndex > 0 ? nodes[activeIndex - 1] : null;
  const nextNode = activeIndex >= 0 && activeIndex < nodes.length - 1 ? nodes[activeIndex + 1] : null;
  return (
    <div className="mx-[clamp(10px,0.8vw,16px)] mb-[clamp(8px,0.7vh,12px)] grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-[12px] bg-[var(--surface)] p-1.5">
      <button className="inline-flex min-h-9 items-center gap-1 rounded-[9px] bg-white px-2.5 text-[clamp(11px,0.68vw,15px)] font-semibold text-brand disabled:opacity-30" type="button" disabled={!previousNode} onClick={() => previousNode && onSelectNode(previousNode.id)}><ArrowLeft className="h-4 w-4" /> Previous</button>
      {isManual ? <button className="min-h-9 truncate rounded-[9px] bg-brand-deep px-3 text-[clamp(11px,0.68vw,15px)] font-semibold text-white" type="button" onClick={onUseAutomatic}>Organizer view · Follow live schedule</button> : <strong className="truncate text-center text-[clamp(11px,0.68vw,15px)] font-semibold text-text-secondary">Live schedule position</strong>}
      <button className="inline-flex min-h-9 items-center gap-1 rounded-[9px] bg-white px-2.5 text-[clamp(11px,0.68vw,15px)] font-semibold text-brand disabled:opacity-30" type="button" disabled={!nextNode} onClick={() => nextNode && onSelectNode(nextNode.id)}>Next <ArrowRight className="h-4 w-4" /></button>
    </div>
  );
}

function TvAmbientEventPanel({ event, isLive, nodes, activeIndex, isManual, onSelectNode, onUseAutomatic }: { event: ScheduleItem | null; isLive: boolean; nodes: TvTimelineNode[]; activeIndex: number; isManual: boolean; onSelectNode: (nodeId: string) => void; onUseAutomatic: () => void }) {
  const firstMatchTime = nodes.find((node) => node.kind === "matches")?.sortValue ?? 10 * 60;
  const morningAgendaNodes = nodes.filter((node) => node.kind === "event" && node.event && node.sortValue < firstMatchTime && node.sortValue < 10 * 60);
  const activeNode = nodes[activeIndex] || null;
  const showMorningAgenda = Boolean(activeNode && morningAgendaNodes.some((node) => node.id === activeNode.id) && morningAgendaNodes.length > 1);
  const dayName = event?.dayNumber === 2 ? "Sunday" : "Saturday";

  if (showMorningAgenda) {
    return (
      <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-[clamp(16px,1.25vw,24px)] border border-[var(--hairline-strong)] bg-white p-[clamp(12px,1vw,20px)] shadow-[0_16px_40px_rgba(var(--brand-deep-rgb),0.08)]">
        <TvBlockNavigator activeIndex={activeIndex} isManual={isManual} nodes={nodes} onSelectNode={onSelectNode} onUseAutomatic={onUseAutomatic} />
        <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-[clamp(10px,1vh,18px)] overflow-hidden px-[clamp(6px,0.5vw,10px)] pb-[clamp(4px,0.4vh,8px)]">
          <header className="flex items-end justify-between gap-4 border-b border-[var(--hairline)] pb-[clamp(9px,0.8vh,14px)]">
            <span className="grid gap-0.5">
              <em className="text-[clamp(10px,0.64vw,14px)] font-semibold not-italic uppercase tracking-[0.12em] text-[var(--accent-ink)]">Before matches</em>
              <strong className="text-[clamp(23px,1.75vw,38px)] font-bold leading-none tracking-[-0.035em] text-brand">{dayName} schedule</strong>
            </span>
            <span className={isLive ? "inline-flex items-center gap-2 rounded-full bg-[var(--urgent-tint)] px-3 py-1.5 text-[clamp(10px,0.65vw,14px)] font-semibold uppercase tracking-[0.07em] text-[var(--urgent)]" : "rounded-full bg-[var(--surface)] px-3 py-1.5 text-[clamp(10px,0.65vw,14px)] font-semibold uppercase tracking-[0.07em] text-text-secondary"}>{isLive && <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--urgent)]" />}{isLive ? "Live agenda" : "Morning agenda"}</span>
          </header>
          <div className="grid min-h-0 grid-cols-2 content-center gap-[clamp(7px,0.65vw,12px)] overflow-hidden">
            {morningAgendaNodes.map((node) => {
              const active = node.id === activeNode?.id;
              const completed = node.sortValue < (activeNode?.sortValue ?? 0);
              return (
                <article
                  className={active
                    ? "grid min-h-[clamp(66px,7.2vh,104px)] grid-cols-[clamp(66px,5.2vw,104px)_minmax(0,1fr)] items-center overflow-hidden rounded-[clamp(12px,0.9vw,17px)] border-2 border-brand bg-[var(--accent-tint)] text-left shadow-[0_9px_20px_rgba(var(--brand-deep-rgb),0.10)]"
                    : "grid min-h-[clamp(66px,7.2vh,104px)] grid-cols-[clamp(66px,5.2vw,104px)_minmax(0,1fr)] items-center overflow-hidden rounded-[clamp(12px,0.9vw,17px)] border border-[var(--hairline-strong)] bg-[var(--surface)] text-left"}
                  key={node.id}
                >
                  <time className={active ? "grid h-full place-items-center bg-brand-deep px-2 text-center text-[clamp(15px,1.05vw,23px)] font-bold leading-tight tabular-nums text-white" : completed ? "grid h-full place-items-center bg-[var(--mist)] px-2 text-center text-[clamp(15px,1.05vw,23px)] font-bold leading-tight tabular-nums text-brand" : "grid h-full place-items-center bg-white px-2 text-center text-[clamp(15px,1.05vw,23px)] font-bold leading-tight tabular-nums text-brand"}>{node.timeLabel}</time>
                  <span className="grid min-w-0 gap-1 px-[clamp(10px,0.9vw,18px)] py-2">
                    <strong className="line-clamp-2 text-[clamp(14px,0.92vw,20px)] font-semibold leading-tight text-text-primary">{node.event ? getScheduleMilestoneLabel(node.event) : node.label}</strong>
                    {active && <em className="text-[clamp(9px,0.58vw,13px)] font-semibold not-italic uppercase tracking-[0.08em] text-[var(--accent-ink)]">{isLive ? "Happening now" : "Organizer selected"}</em>}
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-[clamp(16px,1.25vw,24px)] border border-line bg-white p-[clamp(12px,1vw,20px)] text-center">
      <TvBlockNavigator activeIndex={activeIndex} isManual={isManual} nodes={nodes} onSelectNode={onSelectNode} onUseAutomatic={onUseAutomatic} />
      <div className="grid min-h-0 place-items-center p-[clamp(16px,2vw,40px)]">
      <span className="grid max-w-[760px] justify-items-center gap-[clamp(10px,1vh,18px)]">
        <span className="grid h-[clamp(64px,5vw,104px)] w-[clamp(64px,5vw,104px)] place-items-center rounded-full bg-brand-deep text-[var(--accent)]"><Clock className="h-1/2 w-1/2" /></span>
        <em className={isLive ? "inline-flex items-center gap-2 text-[clamp(13px,0.85vw,19px)] font-semibold not-italic uppercase tracking-[0.12em] text-[var(--urgent)]" : "text-[clamp(13px,0.85vw,19px)] font-semibold not-italic uppercase tracking-[0.12em] text-text-secondary"}>{isLive && <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--urgent)]" />}{isLive ? "Happening now" : "Day milestone"}</em>
        <strong className="text-[clamp(34px,3vw,68px)] font-semibold leading-tight tracking-[-0.04em] text-brand">{event ? getScheduleMilestoneLabel(event) : "Tournament gathering"}</strong>
        <time className="text-[clamp(22px,1.6vw,36px)] font-semibold tabular-nums text-text-secondary">{event?.timeLabel || "Time to be announced"}</time>
        {event?.detail && <p className="text-[clamp(16px,1vw,24px)] leading-relaxed text-text-secondary">{event.detail}</p>}
      </span>
      </div>
    </section>
  );
}

function TvDayOneLeadersPanel({ teamStanding, tierLeaders }: { teamStanding: TeamStanding | null; tierLeaders: PlayerStanding[] }) {
  const teamPlayed = teamStanding ? teamStanding.matchWins + teamStanding.matchLosses : 0;
  const teamWinPercentage = teamStanding && teamPlayed ? (teamStanding.matchWins / teamPlayed) * 100 : 0;
  const teamTone = getTeamCardTone(teamStanding?.team.jerseyColor || DEFAULT_TEAM_COLOR);
  return (
    <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-[clamp(16px,1.25vw,24px)] border border-line bg-white p-[clamp(14px,1.2vw,24px)]">
      <header className="flex items-end justify-between gap-4 pb-[clamp(10px,1vh,18px)]">
        <span className="grid gap-0.5"><em className="text-[clamp(12px,0.75vw,17px)] font-semibold not-italic uppercase tracking-[0.12em] text-[var(--accent-ink)]">Day 1 complete</em><strong className="text-[clamp(24px,1.9vw,42px)] font-semibold leading-none text-brand">Day 1 leaders</strong></span>
        <span className="rounded-full bg-brand-deep px-4 py-2 text-[clamp(12px,0.75vw,17px)] font-semibold text-white">Final standings</span>
      </header>
      <div className="grid min-h-0 grid-cols-[minmax(240px,0.8fr)_minmax(420px,1.2fr)] gap-[clamp(10px,0.8vw,18px)]">
        {teamStanding ? (
          <article className="grid min-h-0 content-center justify-items-center gap-[clamp(8px,0.8vh,14px)] rounded-[18px] px-[clamp(18px,1.5vw,30px)] py-[clamp(14px,1.5vh,26px)] text-center shadow-[0_14px_30px_rgba(var(--brand-deep-rgb), 0.12)]" style={{ background: teamTone.background, color: teamTone.textColor }}>
            <em className="text-[clamp(11px,0.7vw,16px)] font-semibold not-italic uppercase tracking-[0.11em] opacity-75">Top team</em>
            <TvTeamMark large team={teamStanding.team} />
            <strong className="text-[clamp(22px,1.6vw,35px)] font-semibold leading-tight">{teamStanding.team.name}</strong>
            <span className="grid w-full grid-cols-2 gap-2"><span className="rounded-[12px] bg-white/85 px-3 py-2 text-brand"><strong className="block text-[clamp(20px,1.4vw,30px)]">{teamStanding.matchWins}–{teamStanding.matchLosses}</strong><em className="text-[clamp(9px,0.58vw,13px)] font-semibold not-italic uppercase tracking-[0.08em]">Win–loss</em></span><span className="rounded-[12px] bg-white/85 px-3 py-2 text-brand"><strong className="block text-[clamp(20px,1.4vw,30px)]">{formatBracketPercentage(teamWinPercentage)}%</strong><em className="text-[clamp(9px,0.58vw,13px)] font-semibold not-italic uppercase tracking-[0.08em]">Win rate</em></span></span>
          </article>
        ) : <div className="grid place-items-center rounded-[18px] border border-dashed border-[var(--hairline-strong)] bg-white/65 p-5 text-center text-[clamp(15px,0.95vw,21px)] font-semibold text-brand">Team standings are being finalized.</div>}
        <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] rounded-[18px] border border-[var(--hairline-strong)] bg-white p-[clamp(12px,1vw,20px)]">
          <strong className="pb-2 text-[clamp(15px,1vw,22px)] font-semibold text-brand">Top player from each tier</strong>
          <div className="grid min-h-0 grid-cols-2 content-center gap-[clamp(8px,0.65vw,13px)]">
            {tierLeaders.map((standing) => (
              <article className="grid min-h-[clamp(76px,7vh,108px)] grid-cols-[clamp(42px,3vw,58px)_minmax(0,1fr)] items-center gap-3 rounded-[14px] bg-[var(--surface)] px-3 py-2" key={`${standing.tierNumber}:${standing.player.playerId || standing.player.id}`}>
                <Avatar className="relative grid h-[clamp(42px,3vw,58px)] w-[clamp(42px,3vw,58px)] place-items-center overflow-hidden rounded-full bg-brand-deep text-[clamp(11px,0.75vw,16px)] font-semibold text-white" name={standing.player.name} photoUrl={standing.player.profilePhotoUrl || undefined} sizes="58px" />
                <span className="grid min-w-0 gap-0.5"><em className="text-[clamp(10px,0.62vw,14px)] font-semibold not-italic uppercase tracking-[0.08em] text-[var(--accent-ink)]">{standing.tier}</em><strong className="truncate text-[clamp(14px,0.92vw,20px)] font-semibold text-text-primary">{standing.player.name}</strong><span className="truncate text-[clamp(11px,0.68vw,15px)] text-text-secondary">{standing.matchWins}–{standing.matchLosses} · {standing.team.name}</span></span>
              </article>
            ))}
            {!tierLeaders.length && <p className="col-span-2 rounded-[14px] border border-dashed border-[var(--hairline-strong)] p-4 text-center text-[clamp(14px,0.9vw,20px)] text-text-secondary">Tier leaders will appear as final results are processed.</p>}
          </div>
        </section>
      </div>
    </section>
  );
}

function TvDayCompletePanel({ selectedDay, selectedMatches, completedMatches }: { selectedDay: 1 | 2; selectedMatches: TeamCourtScheduleMatch[]; completedMatches: number }) {
  const courts = new Set(selectedMatches.map((match) => match.courtLabel).filter(Boolean)).size;
  return (
    <section className="grid min-h-0 place-items-center overflow-hidden rounded-[clamp(16px,1.25vw,24px)] border border-line bg-white p-[clamp(24px,3vw,64px)] text-center">
      <span className="grid max-w-[820px] justify-items-center gap-[clamp(10px,1vh,18px)]">
        <span className="grid h-[clamp(68px,5vw,110px)] w-[clamp(68px,5vw,110px)] place-items-center rounded-full bg-brand-deep text-[var(--accent)]"><CheckCircle2 className="h-1/2 w-1/2" /></span>
        <em className="text-[clamp(13px,0.85vw,19px)] font-semibold not-italic uppercase tracking-[0.14em] text-[var(--accent-ink)]">Day {selectedDay} complete</em>
        <strong className="text-[clamp(38px,3.1vw,72px)] font-semibold leading-none tracking-[-0.04em] text-brand">Every result is in</strong>
        <span className="mt-2 grid grid-cols-3 gap-3">
          <TvSummaryStat label="Matches" value={completedMatches} />
          <TvSummaryStat label="Courts" value={courts} />
          <TvSummaryStat label="Results" value="100%" />
        </span>
      </span>
    </section>
  );
}

function TvSummaryStat({ label, value }: { label: string; value: string | number }) {
  return <span className="grid min-w-[clamp(110px,8vw,180px)] gap-1 rounded-[16px] border border-white bg-white/85 px-5 py-3 shadow-[0_8px_20px_rgba(var(--brand-deep-rgb), 0.06)]"><strong className="text-[clamp(24px,1.8vw,40px)] font-semibold leading-none text-brand">{value}</strong><em className="text-[clamp(10px,0.65vw,15px)] font-semibold not-italic uppercase tracking-[0.08em] text-text-secondary">{label}</em></span>;
}

function TvNextBlockPanel({ node, selectedDay, teams }: { node: TvTimelineNode | null; selectedDay: 1 | 2; teams: PublishedTeam[] }) {
  const upcomingMatches = (node?.matches || []).filter((match) => !match.score?.winnerSide);
  return (
    <section className="min-h-0 overflow-hidden rounded-[clamp(16px,1.25vw,24px)] border border-[var(--hairline-strong)] bg-white/58 py-[clamp(12px,1vh,20px)]">
      <TvPanelHeading eyebrow={node ? `Up next · ${node.label}` : selectedDay === 1 ? "Up next · Day 2" : "Tournament finish"} time={node?.timeLabel || "—"} tone="upcoming" />
      <div className="grid gap-[clamp(6px,0.55vh,10px)] overflow-hidden px-[clamp(10px,0.8vw,16px)]">
        {upcomingMatches.map((match) => <TvNextMatchRow match={match} teams={teams} key={match.id} />)}
        {!node && <div className="grid min-h-[180px] content-center gap-2 rounded-[16px] border-2 border-dashed border-[var(--hairline-strong)] bg-[var(--surface)] p-5 text-center"><strong className="text-[clamp(18px,1.2vw,28px)] font-semibold text-brand">{selectedDay === 1 ? "Day 2 bracket follows" : "Tournament schedule complete"}</strong><p className="text-[clamp(13px,0.85vw,18px)] leading-relaxed text-text-secondary">{selectedDay === 1 ? "Pairings publish automatically when Day 1 seeding is final." : "Final standings and the champion celebration remain available on screen."}</p></div>}
        {node && !upcomingMatches.length && <div className="rounded-[14px] border border-dashed border-[var(--hairline-strong)] bg-[var(--surface)] p-4 text-center text-[clamp(13px,0.82vw,18px)] text-text-secondary">This block is already completed. The following block will appear automatically.</div>}
      </div>
    </section>
  );
}

function TvDayRemainingPanel({ matches, timelineNodes }: { matches: TeamCourtScheduleMatch[]; timelineNodes: TvTimelineNode[] }) {
  const groups = Object.entries(groupTeamMatchesByTime(matches)).sort(([left], [right]) => getScheduleTimeSortValue(left) - getScheduleTimeSortValue(right));
  return (
    <section className="min-h-0 overflow-hidden rounded-[clamp(16px,1.25vw,24px)] border border-[var(--hairline-strong)] bg-[var(--surface)] py-[clamp(12px,1vh,20px)]">
      <header className="flex items-center justify-between gap-2 px-[clamp(12px,0.9vw,18px)] pb-[clamp(9px,0.7vh,14px)]"><span className="grid"><strong className="text-[clamp(13px,0.82vw,18px)] font-semibold uppercase tracking-[0.08em] text-brand">Full day remaining</strong><em className="text-[clamp(10px,0.62vw,14px)] not-italic text-text-secondary">Every later court block</em></span><span className="rounded-full bg-white px-3 py-1.5 text-[clamp(12px,0.75vw,17px)] font-semibold text-brand">{matches.length}</span></header>
      <div className="grid gap-[clamp(6px,0.55vh,10px)] overflow-hidden px-[clamp(10px,0.8vw,16px)]">
        {groups.map(([timeLabel, blockMatches]) => {
          const node = timelineNodes.find((candidate) => candidate.kind === "matches" && candidate.timeLabel === timeLabel);
          const courts = blockMatches.map((match) => formatCourtNumber(match.courtLabel)).filter(Boolean).join(", ");
          return <article className="grid gap-1 rounded-[12px] border border-[var(--hairline-strong)] bg-white px-3 py-2.5" key={timeLabel}><span className="flex items-center justify-between gap-2"><strong className="text-[clamp(15px,0.95vw,21px)] font-semibold tabular-nums text-brand">{timeLabel}</strong><span className="rounded-full bg-accent-tint px-2 py-1 text-[clamp(10px,0.62vw,14px)] font-semibold text-[var(--accent-ink)]">{blockMatches.length} matches</span></span><em className="truncate text-[clamp(11px,0.68vw,15px)] font-semibold not-italic text-text-secondary">{node?.label || "Court block"}</em><span className="truncate text-[clamp(10px,0.62vw,14px)] text-text-muted">Courts {courts || "TBD"}</span></article>;
        })}
        {!groups.length && <div className="grid min-h-[160px] place-items-center rounded-[14px] border border-dashed border-[var(--hairline-strong)] bg-white/65 p-4 text-center text-[clamp(14px,0.9vw,20px)] font-semibold text-brand">No matches remain today.</div>}
      </div>
    </section>
  );
}

function TvDayTwoGlancePanel({ matches, node, selectedDay, teams }: { matches: TeamCourtScheduleMatch[]; node: TvTimelineNode | null; selectedDay: 1 | 2; teams: PublishedTeam[] }) {
  const groups = Object.entries(groupTeamMatchesByTime(matches.filter((match) => !match.score?.winnerSide))).sort(([left], [right]) => getScheduleTimeSortValue(left) - getScheduleTimeSortValue(right));
  const firstMatches = node?.matches.filter((match) => !match.score?.winnerSide).slice(0, 3) || [];
  return (
    <section className="min-h-0 overflow-hidden rounded-[clamp(16px,1.25vw,24px)] border border-line bg-white py-[clamp(12px,1vh,20px)]">
      <header className="grid gap-1 px-[clamp(14px,1vw,22px)] pb-[clamp(10px,0.8vh,16px)]"><em className="text-[clamp(11px,0.68vw,15px)] font-semibold not-italic uppercase tracking-[0.1em] text-[var(--accent-ink)]">{selectedDay === 1 ? "Get ready" : "Tournament complete"}</em><strong className="text-[clamp(22px,1.5vw,34px)] font-semibold leading-tight text-brand">{selectedDay === 1 ? "Day 2 at a glance" : "All scheduled matches completed"}</strong>{selectedDay === 1 && <span className="text-[clamp(12px,0.75vw,17px)] text-text-secondary">{matches.length ? `${matches.length} matches across ${groups.length} court blocks` : "Pairings will publish when seeding is final."}</span>}</header>
      <div className="grid gap-[clamp(7px,0.6vh,11px)] overflow-hidden px-[clamp(10px,0.8vw,16px)]">
        {firstMatches.map((match) => <TvNextMatchRow match={match} teams={teams} key={match.id} />)}
        {groups.slice(firstMatches.length ? 1 : 0, firstMatches.length ? 4 : 5).map(([timeLabel, blockMatches]) => <article className="flex items-center justify-between gap-3 rounded-[12px] border border-[var(--hairline-strong)] bg-white px-3 py-2.5" key={timeLabel}><span className="grid"><strong className="text-[clamp(14px,0.9vw,20px)] font-semibold text-brand">{timeLabel}</strong><em className="text-[clamp(10px,0.62vw,14px)] not-italic text-text-secondary">Later Day 2 block</em></span><strong className="rounded-full bg-accent-tint px-2.5 py-1 text-[clamp(11px,0.68vw,15px)] text-[var(--accent-ink)]">{blockMatches.length} matches</strong></article>)}
        {selectedDay === 1 && !matches.length && <div className="grid min-h-[210px] place-items-center rounded-[16px] border-2 border-dashed border-[var(--hairline-strong)] bg-white/65 p-5 text-center text-[clamp(16px,1vw,23px)] font-semibold text-brand">Day 2 matchups will appear here automatically.</div>}
      </div>
    </section>
  );
}

function TvLiveMatchCard({ match, teams, isLive }: { match: TeamCourtScheduleMatch; teams: PublishedTeam[]; isLive: boolean }) {
  const score = match.score;
  const leftWon = score?.winnerSide === "A";
  const rightWon = score?.winnerSide === "B";
  const teamA = teams.find((team) => team.id === match.teamAId);
  const teamB = teams.find((team) => team.id === match.teamBId);
  return (
    <article className={isLive ? "overflow-hidden rounded-[14px] border-2 border-[var(--urgent)] bg-white shadow-[0_8px_20px_rgba(var(--urgent-rgb), 0.10)]" : "overflow-hidden rounded-[14px] border border-[var(--hairline-strong)] bg-white"}>
      <header className="flex items-center justify-between gap-3 border-b border-[var(--hairline-strong)] px-3 py-2">
        <span className="inline-flex min-w-0 items-center gap-2"><strong className="text-[clamp(14px,0.9vw,20px)] font-semibold text-brand">{match.courtLabel || "Court TBD"}</strong><em className="truncate text-[clamp(10px,0.62vw,14px)] font-semibold not-italic uppercase text-text-muted">{match.format}</em></span>
        <span className={score?.winnerSide ? "rounded-full bg-accent-tint px-2.5 py-1 text-[clamp(10px,0.62vw,14px)] font-semibold uppercase text-[var(--accent-ink)]" : isLive ? "inline-flex items-center gap-1.5 rounded-full bg-[var(--urgent-tint)] px-2.5 py-1 text-[clamp(10px,0.62vw,14px)] font-semibold uppercase text-[var(--urgent)]" : "rounded-full bg-[var(--surface)] px-2.5 py-1 text-[clamp(10px,0.62vw,14px)] font-semibold uppercase text-text-secondary"}>{isLive && <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--urgent)]" />}{score?.winnerSide ? "Completed" : isLive ? "Live" : "Upcoming"}</span>
      </header>
      <div className="grid gap-1.5 p-2.5">
        <TvLiveScoreRow fallback={match.teamAName} isWinner={leftWon} players={match.playersA} scores={[score?.sideASet1, score?.sideASet2, score?.sideASet3]} team={teamA} />
        <TvLiveScoreRow fallback={match.teamBName} isWinner={rightWon} players={match.playersB} scores={[score?.sideBSet1, score?.sideBSet2, score?.sideBSet3]} team={teamB} />
        {score?.winnerSide && <span className="justify-self-end rounded-full bg-[var(--accent-tint)] px-3 py-1 text-[clamp(11px,0.7vw,16px)] font-semibold tabular-nums text-brand">Win margin {getTvWinMargin(match)}</span>}
      </div>
    </article>
  );
}

function TvLiveScoreRow({ team, fallback, players, scores, isWinner }: { team?: PublishedTeam; fallback: string; players: string[]; scores: Array<number | null | undefined>; isWinner: boolean }) {
  return (
    <div className={isWinner ? "grid min-h-[clamp(44px,4vh,62px)] grid-cols-[minmax(0,1fr)_repeat(3,clamp(30px,2.1vw,44px))] items-center gap-1.5 rounded-[10px] bg-[var(--accent-tint)] px-2" : "grid min-h-[clamp(44px,4vh,62px)] grid-cols-[minmax(0,1fr)_repeat(3,clamp(30px,2.1vw,44px))] items-center gap-1.5 rounded-[10px] bg-[var(--surface)] px-2"}>
      <span className="grid min-w-0 grid-cols-[clamp(28px,2vw,40px)_minmax(0,1fr)] items-center gap-2">
        <span className="relative grid aspect-square place-items-center overflow-hidden rounded-[8px] bg-white text-[10px] font-semibold text-brand">{team?.logoUrl ? <NextImage src={team.logoUrl} alt="" fill sizes="40px" className="object-contain p-1" /> : getInitials(team?.name || fallback)}</span>
        <strong className="line-clamp-2 text-[clamp(12px,0.78vw,17px)] font-semibold leading-tight text-text-primary">{formatBracketPlayerNames(players, fallback)}</strong>
      </span>
      {scores.map((value, index) => <strong className="grid aspect-square place-items-center rounded-[8px] bg-white text-[clamp(15px,1vw,22px)] font-semibold tabular-nums text-brand shadow-[inset_0_0_0_1px_rgba(var(--brand-deep-rgb), 0.05)]" key={index}>{value ?? "–"}</strong>)}
    </div>
  );
}

function getTvWinMargin(match: TeamCourtScheduleMatch) {
  const score = match.score;
  if (!score?.winnerSide) return "—";
  const sideA = [score.sideASet1, score.sideASet2].reduce<number>((total, value) => total + (value || 0), score.sideASet3 != null && score.sideBSet3 != null && score.sideASet3 > score.sideBSet3 ? 1 : 0);
  const sideB = [score.sideBSet1, score.sideBSet2].reduce<number>((total, value) => total + (value || 0), score.sideASet3 != null && score.sideBSet3 != null && score.sideBSet3 > score.sideASet3 ? 1 : 0);
  return score.winnerSide === "A" ? `${sideA}–${sideB}` : `${sideB}–${sideA}`;
}

function TvLeadersTicker({ teamStandings, playerStandings }: { teamStandings: TeamStanding[]; playerStandings: PlayerStanding[] }) {
  return (
    <section className="grid min-h-[clamp(58px,5.7vh,86px)] grid-cols-2 overflow-hidden rounded-[clamp(14px,1vw,20px)] bg-brand-deep text-white shadow-[0_10px_24px_rgba(var(--brand-deep-rgb), 0.14)]">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-[clamp(12px,1vw,22px)] border-r border-white/12 px-[clamp(16px,1.4vw,28px)]"><strong className="text-[clamp(12px,0.75vw,17px)] uppercase tracking-[0.08em] text-[var(--accent)]">Team leaders</strong><span className="grid grid-cols-3 gap-2">{teamStandings.slice(0, 3).map((standing) => <TvTickerChip rank={standing.seed} title={standing.team.name} value={`${standing.matchWins}–${standing.matchLosses}`} key={standing.team.id} />)}</span></div>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-[clamp(12px,1vw,22px)] px-[clamp(16px,1.4vw,28px)]"><strong className="text-[clamp(12px,0.75vw,17px)] uppercase tracking-[0.08em] text-[var(--accent)]">Player leaders</strong><span className="grid grid-cols-3 gap-2">{playerStandings.slice(0, 3).map((standing, index) => <TvTickerChip rank={index + 1} title={standing.player.name} value={`${standing.matchWins}–${standing.matchLosses}`} key={`${standing.team.id}:${standing.player.playerId || standing.player.id}`} />)}</span></div>
    </section>
  );
}

function TvTickerChip({ rank, title, value }: { rank: number; title: string; value: string }) {
  return <span className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-full bg-white/10 px-2.5 py-1.5"><strong className="grid h-[clamp(24px,1.6vw,34px)] w-[clamp(24px,1.6vw,34px)] place-items-center rounded-full bg-[var(--accent)] text-[clamp(11px,0.7vw,16px)] text-[var(--accent-on)]">{rank}</strong><span className="truncate text-[clamp(12px,0.78vw,17px)] font-semibold">{title}</span><em className="text-[clamp(11px,0.7vw,16px)] font-semibold not-italic text-white/72">{value}</em></span>;
}

function TvSponsorStrip({ sponsors }: { sponsors: TvSponsorSpotlight[] }) {
  return (
    <section className="flex min-h-[clamp(58px,5.8vh,86px)] items-center gap-[clamp(18px,1.5vw,32px)] overflow-hidden rounded-[clamp(14px,1vw,20px)] border border-[var(--hairline-strong)] bg-white/72 px-[clamp(16px,1.3vw,28px)] text-text-secondary shadow-[0_8px_24px_rgba(var(--brand-deep-rgb), 0.05)]">
      <strong className="shrink-0 text-[clamp(12px,0.75vw,17px)] uppercase tracking-[0.1em] text-brand">Tournament partners</strong>
      <span className="flex min-w-0 flex-1 items-center justify-around gap-[clamp(20px,2.5vw,54px)] overflow-hidden">{sponsors.slice(0, 8).map((sponsor) => <span className="inline-flex min-w-0 items-center justify-center gap-2" key={sponsor.id}>{sponsor.logoUrl ? <img className="h-[clamp(42px,4.4vh,68px)] max-w-[clamp(110px,10vw,210px)] object-contain" src={sponsor.logoUrl} alt={`${sponsor.name} logo`} /> : <strong className="truncate text-[clamp(15px,0.95vw,21px)] font-semibold text-brand">{sponsor.name}</strong>}</span>)}</span>
      {!sponsors.length && <em className="text-[clamp(11px,0.7vw,16px)] not-italic">Partner logos appear here when published.</em>}
    </section>
  );
}

function TvSponsorSpotlightScene({ sponsors, activeIndex, onSelect }: { sponsors: TvSponsorSpotlight[]; activeIndex: number; onSelect: (index: number) => void }) {
  const sponsor = sponsors[activeIndex] || sponsors[0] || null;
  if (!sponsor) return <section className="grid h-full place-items-center rounded-[28px] border border-[var(--hairline-strong)] bg-white"><span className="grid justify-items-center gap-3 text-center"><Trophy className="h-16 w-16 text-brand" /><strong className="text-[clamp(34px,3vw,64px)] font-semibold text-brand">Tournament partners</strong><p className="text-[clamp(18px,1.2vw,28px)] text-text-secondary">Sponsor spotlights will appear as partner profiles are published.</p></span></section>;
  const qrUrl = sponsor.websiteUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=480x480&margin=12&data=${encodeURIComponent(sponsor.websiteUrl)}` : "";
  return (
    <section className="relative grid h-full place-items-center">
      <article className={qrUrl ? "grid w-[min(1200px,82vw)] grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)] items-center gap-[clamp(32px,4vw,76px)] rounded-[clamp(26px,2vw,42px)] border border-white bg-white px-[clamp(48px,5vw,96px)] py-[clamp(44px,5vh,88px)] shadow-[0_30px_80px_rgba(var(--brand-deep-rgb), 0.13)]" : "grid w-[min(920px,72vw)] place-items-center rounded-[clamp(26px,2vw,42px)] border border-white bg-white px-[clamp(58px,6vw,118px)] py-[clamp(56px,7vh,118px)] text-center shadow-[0_30px_80px_rgba(var(--brand-deep-rgb), 0.13)]"}>
        <span className={qrUrl ? "grid min-w-0 gap-[clamp(14px,1.6vh,28px)]" : "grid max-w-[760px] justify-items-center gap-[clamp(14px,1.6vh,28px)]"}>
          <em className="inline-flex items-center gap-2 text-[clamp(14px,0.9vw,21px)] font-semibold not-italic uppercase tracking-[0.12em] text-brand"><span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />Tournament partner</em>
          {sponsor.logoUrl && <img className={qrUrl ? "max-h-[clamp(90px,10vh,180px)] max-w-[80%] object-contain object-left" : "max-h-[clamp(130px,15vh,250px)] max-w-[85%] object-contain"} src={sponsor.logoUrl} alt={`${sponsor.name} logo`} />}
          <h2 className="break-words text-[clamp(42px,4vw,88px)] font-semibold leading-[0.98] tracking-[-0.05em] text-brand">{sponsor.name || "Tournament partner"}</h2>
          <p className="text-[clamp(19px,1.35vw,30px)] leading-relaxed text-text-secondary">Proud tournament partner — supporting players, community, and every match.</p>
          <strong className="w-max max-w-full rounded-full bg-[var(--accent-tint)] px-5 py-2.5 text-[clamp(15px,1vw,22px)] font-semibold text-[var(--accent-ink)]">Official sponsor of {sponsor.teamName}</strong>
          <span className="grid max-w-full justify-items-center gap-2.5 pt-2">
            <strong className="text-[clamp(12px,0.76vw,17px)] font-semibold uppercase tracking-[0.08em] text-text-secondary">Sponsor {Math.min(activeIndex + 1, sponsors.length)} of {sponsors.length}</strong>
            <span className="flex max-w-[min(760px,54vw)] flex-wrap justify-center gap-[clamp(7px,0.65vw,12px)]" aria-label={`Choose sponsor. Sponsor ${Math.min(activeIndex + 1, sponsors.length)} of ${sponsors.length} is selected`}>
              {sponsors.map((item, index) => (
                <button
                  className={index === activeIndex
                    ? "tap-card grid h-[clamp(44px,3.8vw,66px)] min-w-[clamp(58px,4.8vw,88px)] max-w-[clamp(92px,7vw,136px)] place-items-center overflow-hidden rounded-[clamp(10px,0.8vw,15px)] border-2 border-brand bg-white px-2 py-1.5 shadow-[0_10px_24px_rgba(var(--brand-deep-rgb),0.18)] transition active:scale-95"
                    : "tap-card grid h-[clamp(44px,3.8vw,66px)] min-w-[clamp(58px,4.8vw,88px)] max-w-[clamp(92px,7vw,136px)] place-items-center overflow-hidden rounded-[clamp(10px,0.8vw,15px)] border border-[var(--hairline-strong)] bg-[var(--surface)] px-2 py-1.5 opacity-68 transition hover:border-brand/35 hover:bg-white hover:opacity-100 active:scale-95"}
                  type="button"
                  onClick={() => onSelect(index)}
                  aria-label={`Show ${item.name || `sponsor ${index + 1}`}`}
                  aria-pressed={index === activeIndex}
                  title={item.name || `Sponsor ${index + 1}`}
                  key={item.id}
                >
                  {item.logoUrl
                    ? <img className="h-full max-h-[42px] w-full max-w-[108px] object-contain" src={item.logoUrl} alt="" />
                    : <strong className="max-w-full truncate text-[clamp(9px,0.62vw,13px)] font-semibold text-brand">{item.name || `Sponsor ${index + 1}`}</strong>}
                </button>
              ))}
            </span>
          </span>
        </span>
        {qrUrl && <span className="grid justify-items-center gap-3 text-center"><img className="aspect-square w-[min(26vw,330px)] rounded-[24px] border-4 border-brand bg-white p-3" src={qrUrl} alt={`QR code for ${sponsor.name} website`} /><strong className="text-[clamp(15px,1vw,22px)] font-semibold text-brand">Scan to visit {sponsor.name}</strong><em className="max-w-[360px] truncate text-[clamp(12px,0.72vw,17px)] not-italic text-text-secondary">{sponsor.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}</em></span>}
      </article>
    </section>
  );
}

function TvNextMatchRow({ match, teams }: { match: TeamCourtScheduleMatch; teams: PublishedTeam[] }) {
  const ballTeam = getBallTeamForMatchup(match.dayNumber, match.teamAId, match.teamBId, match.id, teams);
  return (
    <article className="grid gap-2 rounded-[12px] border-2 border-dashed border-[var(--hairline-strong)] bg-[var(--surface)] p-[clamp(9px,0.75vw,14px)]">
      <span className="flex items-center justify-between gap-2"><strong className="rounded-[8px] bg-brand-deep px-2.5 py-1.5 text-[clamp(11px,0.68vw,15px)] font-semibold text-white">{match.courtLabel || "Court TBD"}</strong><em className="text-[clamp(10px,0.62vw,14px)] font-semibold not-italic uppercase tracking-[0.07em] text-text-secondary">{match.format}</em></span>
      <span className="grid min-w-0 gap-1.5">
        <strong className="line-clamp-2 text-[clamp(13px,0.82vw,18px)] font-semibold leading-tight text-text-primary">{formatBracketPlayerNames(match.playersA, match.teamAName)}</strong>
        <span className="inline-flex min-w-0 items-center gap-2"><em className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[clamp(9px,0.56vw,13px)] font-semibold not-italic uppercase tracking-[0.08em] text-text-muted">vs</em><strong className="line-clamp-2 text-[clamp(13px,0.82vw,18px)] font-semibold leading-tight text-text-primary">{formatBracketPlayerNames(match.playersB, match.teamBName)}</strong></span>
      </span>
      {match.dayNumber === 2 && <span className="flex min-w-0 items-center gap-2 rounded-[9px] bg-[var(--surface)] px-2.5 py-1.5 text-[clamp(10px,0.64vw,14px)] font-semibold text-brand"><TennisBallIcon className="h-4 w-4 shrink-0" /><span className="truncate">Balls: {ballTeam?.name || "To be assigned"}</span></span>}
    </article>
  );
}

function TvTeamLeaderboardScene({ standings }: { standings: TeamStanding[] }) {
  const podium = [standings[1], standings[0], standings[2]].filter(Boolean);
  const visibleStandings = standings.slice(0, 8);
  return (
    <section className="grid h-full min-h-0 grid-rows-[minmax(230px,0.8fr)_minmax(0,1.2fr)] gap-[clamp(10px,1.3vh,22px)] overflow-hidden" aria-label="Team leaderboard">
      <div className="flex min-h-0 items-end justify-center gap-[clamp(18px,2vw,42px)] px-[clamp(50px,7vw,140px)]">
        {podium.map((standing) => <TvTeamPodiumCard standing={standing} key={standing.team.id} />)}
      </div>
      <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-[clamp(18px,1.4vw,28px)] border border-[var(--hairline-strong)] bg-white shadow-[0_14px_34px_rgba(var(--brand-deep-rgb), 0.07)]">
        <div className="grid h-[clamp(36px,4vh,52px)] grid-cols-[76px_minmax(330px,1.6fr)_repeat(4,minmax(110px,0.6fr))] items-center gap-3 border-b border-[var(--hairline-strong)] bg-[var(--surface)] px-[clamp(20px,1.8vw,38px)] text-[clamp(12px,0.72vw,16px)] font-semibold uppercase tracking-[0.08em] text-text-secondary">
          <span>Rank</span><span>Team</span><span className="text-center">Played</span><span className="text-center">Won</span><span className="text-center">Lost</span><span className="text-center">Win %</span>
        </div>
        <div className="grid min-h-0 grid-rows-[repeat(8,minmax(0,1fr))]">
          {visibleStandings.map((standing) => {
            const played = standing.matchWins + standing.matchLosses;
            const winPercentage = played ? (standing.matchWins / played) * 100 : 0;
            const captain = standing.team.members.find((member) => member.isCaptain)?.name || "Captain TBD";
            return (
              <article className={`${standing.seed === 1 ? "bg-[var(--accent-tint)]" : "bg-white"} grid min-h-0 grid-cols-[76px_minmax(330px,1.6fr)_repeat(4,minmax(110px,0.6fr))] items-center gap-3 border-b border-[var(--hairline-strong)] px-[clamp(20px,1.8vw,38px)] last:border-0`} key={standing.team.id}>
                <strong className="text-[clamp(18px,1.15vw,26px)] font-semibold text-text-secondary">{standing.seed}</strong>
                <span className="grid min-w-0 grid-cols-[clamp(42px,3vw,58px)_minmax(0,1fr)] items-center gap-[clamp(12px,1vw,20px)]">
                  <TvTeamMark compact team={standing.team} />
                  <span className="grid min-w-0"><strong className="truncate text-[clamp(17px,1vw,23px)] font-semibold text-text-primary">{standing.team.name}</strong><em className="truncate text-[clamp(12px,0.72vw,16px)] not-italic text-text-secondary">Captain: {captain}</em></span>
                </span>
                <TvLeaderboardValue value={String(played)} /><TvLeaderboardValue value={String(standing.matchWins)} /><TvLeaderboardValue value={String(standing.matchLosses)} /><TvLeaderboardValue value={`${formatBracketPercentage(winPercentage)}%`} />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TvTeamPodiumCard({ standing }: { standing: TeamStanding }) {
  const first = standing.seed === 1;
  const third = standing.seed === 3;
  const captain = standing.team.members.find((member) => member.isCaptain)?.name || "Captain TBD";
  const played = standing.matchWins + standing.matchLosses;
  const winPercentage = played ? (standing.matchWins / played) * 100 : 0;
  const teamAccent = getSourceTeamColor(standing.team.jerseyColor);
  const rankTone = first
    ? "border-[var(--medal-gold-line)] bg-[var(--accent-tint)] text-[var(--medal-gold-ink)]"
    : third
      ? "border-[var(--medal-bronze-line)] bg-[var(--avatar-peach)] text-[var(--medal-bronze-ink)]"
      : "border-[var(--hairline-strong)] bg-[var(--surface-subtle)] text-brand";
  return (
    <article className={`${first ? "h-full w-[clamp(300px,23vw,460px)] border-[var(--medal-gold-line)] shadow-[0_24px_55px_rgba(var(--brand-deep-rgb),0.16)]" : "h-[92%] w-[clamp(260px,19vw,390px)] border-[var(--hairline-strong)] shadow-[0_16px_38px_rgba(var(--brand-deep-rgb),0.10)]"} relative grid min-h-0 content-center justify-items-center gap-[clamp(5px,0.7vh,11px)] overflow-hidden rounded-[clamp(20px,1.5vw,28px)] border bg-white px-[clamp(16px,1.4vw,28px)] py-[clamp(12px,1.35vh,22px)] text-center text-text-primary`}>
      <span className="absolute inset-x-0 top-0 h-[clamp(5px,0.45vw,8px)]" style={{ background: teamAccent }} aria-hidden="true" />
      <span className="flex w-full items-center justify-between gap-3">
        <strong className={`${rankTone} grid h-[clamp(34px,2.3vw,46px)] w-[clamp(34px,2.3vw,46px)] place-items-center rounded-full border text-[clamp(16px,1.05vw,23px)] font-bold shadow-[0_6px_14px_rgba(var(--brand-deep-rgb),0.08)]`}>{standing.seed}</strong>
        <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-[clamp(10px,0.66vw,14px)] font-semibold uppercase tracking-[0.06em] text-text-secondary">{standing.matchWins}W · {standing.matchLosses}L</span>
      </span>
      <TvTeamMark large team={standing.team} />
      <span className="grid min-w-0 gap-0.5">
        <strong className="truncate text-[clamp(19px,1.3vw,28px)] font-bold text-text-primary">{standing.team.name}</strong>
        <em className="truncate text-[clamp(11px,0.7vw,15px)] not-italic text-text-secondary">Captain: {captain}</em>
      </span>
      <span className="grid w-full grid-cols-2 gap-2">
        <span className="rounded-[clamp(10px,0.8vw,14px)] border border-[var(--hairline)] bg-[var(--surface)] px-2 py-[clamp(6px,0.62vh,10px)] text-brand"><strong className="block text-[clamp(17px,1.15vw,25px)] leading-none">{played}</strong><em className="text-[clamp(8px,0.52vw,12px)] font-semibold not-italic uppercase tracking-[0.07em] text-text-secondary">Played</em></span>
        <span className="rounded-[clamp(10px,0.8vw,14px)] border border-[var(--hairline)] bg-[var(--surface)] px-2 py-[clamp(6px,0.62vh,10px)] text-brand"><strong className="block text-[clamp(17px,1.15vw,25px)] leading-none">{formatBracketPercentage(winPercentage)}%</strong><em className="text-[clamp(8px,0.52vw,12px)] font-semibold not-italic uppercase tracking-[0.07em] text-text-secondary">Win rate</em></span>
      </span>
    </article>
  );
}

function TvTeamMark({ team, large = false, compact = false }: { team: PublishedTeam; large?: boolean; compact?: boolean }) {
  const teamTone = getTeamBrandTone(team.jerseyColor);
  const sizeClass = large
    ? "h-[clamp(58px,4.2vw,82px)] w-[clamp(58px,4.2vw,82px)]"
    : compact
      ? "h-[clamp(30px,3.6vh,46px)] w-[clamp(30px,3.6vh,46px)]"
      : "h-[clamp(40px,2.8vw,54px)] w-[clamp(40px,2.8vw,54px)]";
  return (
    <span className={`${sizeClass} relative grid shrink-0 place-items-center overflow-hidden rounded-[28%] border shadow-[0_9px_24px_rgba(var(--brand-deep-rgb),0.12)]`} style={{ background: team.logoUrl ? "var(--card)" : teamTone.background, borderColor: teamTone.borderColor, color: teamTone.textColor }} role="img" aria-label={`${team.name} logo`}>
      {team.logoUrl
        ? <NextImage src={team.logoUrl} alt="" fill sizes={large ? "82px" : compact ? "46px" : "54px"} className="object-contain p-[10%]" />
        : <strong className={`${large ? "text-[clamp(16px,1.15vw,24px)]" : compact ? "text-[clamp(9px,0.65vw,13px)]" : "text-[clamp(11px,0.78vw,16px)]"} text-current`}>{getInitials(team.name)}</strong>}
    </span>
  );
}

function TvPlayerLeaderboardScene({ standings }: { standings: PlayerStanding[] }) {
  const topPlayers = standings.slice(0, 6);
  const podium = [topPlayers[1], topPlayers[0], topPlayers[2]].filter(Boolean);
  return (
    <section className="grid h-full min-h-0 grid-rows-[minmax(230px,0.8fr)_minmax(0,1.2fr)] gap-[clamp(10px,1.3vh,22px)] overflow-hidden" aria-label="Player leaderboard">
      <div className="flex min-h-0 items-end justify-center gap-[clamp(18px,2vw,42px)] px-[clamp(50px,7vw,140px)]">
        {podium.map((standing, index) => <TvPlayerPodiumCard rank={index === 0 ? 2 : index === 1 ? 1 : 3} standing={standing} key={`${standing.team.id}:${standing.player.playerId || standing.player.id}`} />)}
      </div>
      <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-[clamp(18px,1.4vw,28px)] border border-[var(--hairline-strong)] bg-white shadow-[0_14px_34px_rgba(var(--brand-deep-rgb), 0.07)]">
        <div className="grid h-[clamp(36px,4vh,52px)] grid-cols-[76px_minmax(380px,1.8fr)_repeat(3,minmax(110px,0.55fr))_minmax(160px,0.8fr)] items-center gap-3 border-b border-[var(--hairline-strong)] bg-[var(--surface)] px-[clamp(20px,1.8vw,38px)] text-[clamp(12px,0.72vw,16px)] font-semibold uppercase tracking-[0.08em] text-text-secondary">
          <span>Rank</span><span>Player</span><span className="text-center">Matches</span><span className="text-center">Record</span><span className="text-center">Win %</span><span className="text-center">Team</span>
        </div>
        <div className="grid min-h-0 grid-rows-6">
          {topPlayers.map((standing, index) => {
            const played = standing.matchWins + standing.matchLosses;
            const winPercentage = played ? (standing.matchWins / played) * 100 : 0;
            return (
              <article className={`${index === 0 ? "bg-[var(--accent-tint)]" : "bg-white"} grid min-h-0 grid-cols-[76px_minmax(380px,1.8fr)_repeat(3,minmax(110px,0.55fr))_minmax(160px,0.8fr)] items-center gap-3 border-b border-[var(--hairline-strong)] px-[clamp(20px,1.8vw,38px)] last:border-0`} key={`${standing.team.id}:${standing.player.playerId || standing.player.id}`}>
                <strong className="text-[clamp(18px,1.15vw,26px)] font-semibold text-text-secondary">{index + 1}</strong>
                <span className="grid min-w-0 grid-cols-[clamp(34px,3.8vh,50px)_minmax(0,1fr)] items-center gap-[clamp(12px,1vw,20px)]"><Avatar className="relative grid h-[clamp(34px,3.8vh,50px)] w-[clamp(34px,3.8vh,50px)] place-items-center overflow-hidden rounded-full border-2 border-white bg-brand-deep text-[clamp(11px,0.78vw,16px)] font-semibold text-white shadow-[0_7px_16px_rgba(var(--brand-deep-rgb),0.13)]" name={standing.player.name} photoUrl={standing.player.profilePhotoUrl || undefined} sizes="50px" /><span className="grid min-w-0"><strong className="truncate text-[clamp(17px,1vw,23px)] font-semibold text-text-primary">{standing.player.name}</strong><em className="truncate text-[clamp(12px,0.72vw,16px)] not-italic text-text-secondary">{standing.player.city || "City pending"}</em></span></span>
                <TvLeaderboardValue value={String(played)} /><TvLeaderboardValue value={`${standing.matchWins}–${standing.matchLosses}`} /><TvLeaderboardValue value={`${formatBracketPercentage(winPercentage)}%`} /><TvLeaderboardValue value={standing.team.name.replace(/^Team\s+/i, "")} />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TvPlayerPodiumCard({ standing, rank }: { standing: PlayerStanding; rank: number }) {
  const first = rank === 1;
  const third = rank === 3;
  const playerAccent = normalizeTeamColor(standing.team.jerseyColor);
  const rankTone = first
    ? "border-[var(--medal-gold-line)] bg-[var(--accent-tint)] text-[var(--medal-gold-ink)]"
    : third
      ? "border-[var(--medal-bronze-line)] bg-[var(--avatar-peach)] text-[var(--medal-bronze-ink)]"
      : "border-[var(--hairline-strong)] bg-[var(--surface-subtle)] text-brand";
  return (
    <article className={`${first ? "h-full w-[clamp(300px,23vw,460px)] border-[var(--medal-gold-line)] shadow-[0_24px_55px_rgba(var(--brand-deep-rgb),0.16)]" : "h-[92%] w-[clamp(260px,19vw,390px)] border-[var(--hairline-strong)] shadow-[0_16px_38px_rgba(var(--brand-deep-rgb),0.10)]"} relative grid min-h-0 content-center justify-items-center gap-[clamp(5px,0.7vh,11px)] overflow-hidden rounded-[clamp(20px,1.5vw,28px)] border bg-white px-[clamp(16px,1.4vw,28px)] py-[clamp(12px,1.35vh,22px)] text-center text-text-primary`}>
      <span className="absolute inset-x-0 top-0 h-[clamp(5px,0.45vw,8px)]" style={{ background: playerAccent }} aria-hidden="true" />
      <span className="flex w-full items-center justify-start">
        <strong className={`${rankTone} grid h-[clamp(34px,2.3vw,46px)] w-[clamp(34px,2.3vw,46px)] place-items-center rounded-full border text-[clamp(16px,1.05vw,23px)] font-bold shadow-[0_6px_14px_rgba(var(--brand-deep-rgb),0.08)]`}>{rank}</strong>
      </span>
      <Avatar className="relative grid h-[clamp(58px,4.2vw,82px)] w-[clamp(58px,4.2vw,82px)] shrink-0 place-items-center overflow-hidden rounded-full border-[3px] border-white bg-brand-deep text-[clamp(17px,1.2vw,25px)] font-semibold text-white shadow-[0_10px_24px_rgba(var(--brand-deep-rgb),0.16)]" name={standing.player.name} photoUrl={standing.player.profilePhotoUrl || undefined} sizes="82px" />
      <span className="grid min-h-0 min-w-0 content-center gap-0.5 overflow-hidden"><strong className="line-clamp-2 text-[clamp(19px,1.3vw,28px)] font-bold leading-tight text-text-primary">{standing.player.name}</strong><em className="line-clamp-2 text-[clamp(11px,0.7vw,15px)] leading-tight not-italic text-text-secondary">{standing.player.city || "City pending"} · {standing.team.name}</em></span>
      <span className="grid w-full grid-cols-2 gap-2">
        <span className="rounded-[clamp(10px,0.8vw,14px)] border border-[var(--hairline)] bg-[var(--surface)] px-2 py-[clamp(6px,0.62vh,10px)] text-brand"><strong className="block text-[clamp(17px,1.15vw,25px)] leading-none">{standing.matchWins}</strong><em className="text-[clamp(8px,0.52vw,12px)] font-semibold not-italic uppercase tracking-[0.07em] text-text-secondary">Wins</em></span>
        <span className="rounded-[clamp(10px,0.8vw,14px)] border border-[var(--hairline)] bg-[var(--surface)] px-2 py-[clamp(6px,0.62vh,10px)] text-brand"><strong className="block text-[clamp(17px,1.15vw,25px)] leading-none">{standing.matchLosses}</strong><em className="text-[clamp(8px,0.52vw,12px)] font-semibold not-italic uppercase tracking-[0.07em] text-text-secondary">Losses</em></span>
      </span>
    </article>
  );
}

function TvTournamentFinaleScene({ tournament, champion, tierLeaders, sponsors }: { tournament: Tournament; champion: PublishedTeam; tierLeaders: PlayerStanding[]; sponsors: TvSponsorSpotlight[] }) {
  const [confettiBurst, setConfettiBurst] = useState(1);
  const uniqueSponsors = Array.from(new Map(sponsors.map((sponsor) => [`${normalizeName(sponsor.name)}:${sponsor.logoUrl}`, sponsor])).values()).slice(0, 10);

  useEffect(() => {
    const timer = window.setInterval(() => setConfettiBurst((current) => current + 1), 15000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="relative grid h-dvh min-h-[720px] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-brand-deep px-[clamp(48px,5vw,112px)] py-[clamp(28px,3.4vh,62px)] font-sans text-white" aria-label={`${champion.name} tournament champions`}>
      <span className="pointer-events-none absolute inset-0 opacity-25 court-lines" aria-hidden="true" />
      <TvFinaleConfetti burstId={confettiBurst} team={champion} />
      <Link className="tap-card absolute left-[clamp(24px,2.5vw,52px)] top-[clamp(24px,3vh,52px)] z-30 inline-flex !w-max shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/22 bg-white/12 px-5 py-3 text-[clamp(13px,0.82vw,18px)] font-semibold text-white shadow-[0_14px_34px_rgba(var(--brand-deep-rgb),0.22)] backdrop-blur-xl transition hover:bg-white/20 active:scale-[0.98]" href="/tournaments">
        <ArrowLeft className="h-[1.05em] w-[1.05em]" />
        Tournament
      </Link>

      <header className="relative z-10 grid justify-items-center gap-1 text-center">
        <em className="inline-flex items-center gap-2 text-[clamp(14px,0.9vw,20px)] font-semibold not-italic uppercase tracking-[0.16em] text-[var(--accent)]"><Trophy className="h-[1.1em] w-[1.1em]" fill="currentColor" /> Tournament champions</em>
        <h1 className="text-[clamp(24px,2.2vw,46px)] font-semibold tracking-[-0.035em]">{tournament.name}</h1>
      </header>

      <section className="relative z-10 grid min-h-0 grid-cols-[minmax(480px,1.15fr)_minmax(520px,0.85fr)] items-center gap-[clamp(30px,4vw,78px)] py-[clamp(20px,3vh,54px)]">
        <article className="grid min-h-0 justify-items-center gap-[clamp(12px,1.5vh,24px)] text-center">
          <span className="relative grid h-[clamp(120px,11vw,210px)] w-[clamp(120px,11vw,210px)] place-items-center overflow-hidden rounded-[clamp(30px,2.5vw,48px)] border-4 border-white/65 bg-white p-4 text-[clamp(30px,2.6vw,54px)] font-semibold text-brand shadow-[0_30px_80px_rgba(var(--brand-deep-rgb),0.30)]">
            {champion.logoUrl ? <NextImage src={champion.logoUrl} alt={`${champion.name} logo`} fill sizes="210px" className="object-contain p-4" /> : <Shirt className="h-[62%] w-[62%]" style={{ fill: normalizeTeamColor(champion.jerseyColor), color: "var(--brand-deep)" }} />}
          </span>
          <span className="grid gap-2">
            <strong className="text-[clamp(58px,6vw,118px)] font-semibold leading-[0.9] tracking-[-0.065em] text-white">{champion.name}</strong>
            <em className="text-[clamp(17px,1.2vw,27px)] font-medium not-italic uppercase tracking-[0.14em] text-[var(--accent)]">{tournament.seasonYear || new Date().getFullYear()} tournament winners</em>
          </span>
          <div className="flex max-w-[920px] flex-wrap justify-center gap-2.5" aria-label={`${champion.name} winning roster`}>
            {champion.members.map((player) => <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 py-1.5 pl-1.5 pr-3 text-[clamp(12px,0.76vw,17px)] font-semibold backdrop-blur-xl" key={player.id}><Avatar className="relative grid h-[clamp(28px,2vw,40px)] w-[clamp(28px,2vw,40px)] place-items-center overflow-hidden rounded-full bg-white text-[10px] text-brand" name={player.name} photoUrl={player.profilePhotoUrl} sizes="40px" />{player.name}</span>)}
          </div>
        </article>

        <section className="grid min-h-0 content-center gap-[clamp(10px,1vh,16px)] overflow-hidden rounded-[clamp(24px,2vw,38px)] border border-white/18 bg-white/10 p-[clamp(20px,2vw,38px)] shadow-[0_28px_70px_rgba(var(--brand-deep-rgb),0.18)] backdrop-blur-xl" aria-labelledby="tv-tier-leaders-title">
          <span className="grid gap-1"><em className="text-[clamp(11px,0.68vw,15px)] font-semibold not-italic uppercase tracking-[0.14em] text-[var(--accent)]">Tournament honors</em><h2 className="text-[clamp(25px,2vw,42px)] font-semibold" id="tv-tier-leaders-title">Player leaders by tier</h2></span>
          <div className="grid grid-cols-2 gap-[clamp(9px,0.8vw,14px)]">
            {tierLeaders.map((standing) => <article className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-[clamp(14px,1vw,19px)] border border-white/15 bg-white/10 p-[clamp(10px,0.8vw,15px)]" key={`${standing.tier}:${standing.player.playerId || standing.player.id}`}><Avatar className="relative grid h-[clamp(44px,3.2vw,64px)] w-[clamp(44px,3.2vw,64px)] place-items-center overflow-hidden rounded-full bg-white text-[clamp(12px,0.8vw,18px)] font-semibold text-brand" name={standing.player.name} photoUrl={standing.player.profilePhotoUrl || undefined} sizes="64px" /><span className="grid min-w-0 gap-0.5"><em className="text-[clamp(10px,0.62vw,14px)] font-semibold not-italic uppercase tracking-[0.1em] text-[var(--accent)]">{standing.tier} leader</em><strong className="truncate text-[clamp(16px,1.05vw,23px)] font-semibold">{standing.player.name}</strong><span className="truncate text-[clamp(11px,0.7vw,16px)] text-white/72">{standing.team.name} · {standing.matchWins} wins · {standing.matchLosses} losses</span></span></article>)}
            {!tierLeaders.length && <p className="col-span-2 rounded-[18px] border border-dashed border-white/20 p-5 text-center text-white/72">Tier leaders will appear when player results are complete.</p>}
          </div>
        </section>
      </section>

      <footer className="relative z-10 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-[clamp(26px,2.5vw,54px)] rounded-[clamp(20px,1.5vw,30px)] border border-white/18 bg-white/95 px-[clamp(22px,2vw,42px)] py-[clamp(14px,1.7vh,26px)] text-brand shadow-[0_24px_60px_rgba(var(--brand-deep-rgb),0.22)]">
        <span className="grid"><em className="text-[clamp(10px,0.62vw,14px)] font-semibold not-italic uppercase tracking-[0.13em] text-[var(--accent-ink)]">With gratitude</em><strong className="text-[clamp(18px,1.4vw,30px)] font-semibold">Thank you to our sponsors</strong></span>
        <span className="flex min-w-0 items-center justify-around gap-[clamp(20px,2.2vw,48px)] overflow-hidden">{uniqueSponsors.map((sponsor) => <span className="grid min-w-0 justify-items-center gap-1" key={sponsor.id}>{sponsor.logoUrl ? <img className="h-[clamp(48px,6vh,88px)] max-w-[clamp(120px,11vw,230px)] object-contain" src={sponsor.logoUrl} alt={`${sponsor.name} logo`} /> : <strong className="truncate text-[clamp(15px,1vw,22px)]">{sponsor.name}</strong>}</span>)}{!uniqueSponsors.length && <em className="text-[clamp(14px,0.9vw,20px)] not-italic text-text-secondary">Thank you to every partner who made this tournament possible.</em>}</span>
      </footer>
      <span className="sr-only" role="status" aria-live="polite">Celebrating tournament champions {champion.name}</span>
    </main>
  );
}

function TvFinaleConfetti({ burstId, team }: { burstId: number; team: PublishedTeam }) {
  const winnerPillTone = getTeamBrandTone(team.jerseyColor);
  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" key={burstId} aria-hidden="true">
      {winnerConfettiPieces.map((piece, index) => <span className="winner-confetti-piece" key={index} style={{ "--confetti-delay": piece.delay, "--confetti-duration": piece.duration, "--confetti-x": piece.x, "--confetti-y": piece.y, "--confetti-end-y": piece.endY, "--confetti-drift": piece.drift, "--confetti-rotation": piece.rotation, backgroundColor: piece.color, borderRadius: piece.rounded, clipPath: piece.clipPath, height: piece.height, width: piece.width } as CSSProperties} />)}
      {winnerFireworkBursts.map((burst) => <span className="winner-firework" key={`${burst.x}:${burst.y}`} style={{ "--firework-x": burst.x, "--firework-y": burst.y, "--firework-delay": burst.delay, "--firework-color": burst.color, "--firework-size": burst.size } as CSSProperties}>{Array.from({ length: 16 }).map((_, sparkIndex) => <span className="winner-firework-spark" style={{ "--firework-angle": `${sparkIndex * 22.5}deg` } as CSSProperties} key={sparkIndex} />)}</span>)}
      {winnerPillPaths.map((path) => <span className="winner-team-pill" key={path.midX} style={{ "--winner-pill-delay": path.delay, "--winner-pill-mid-x": path.midX, "--winner-pill-mid-y": path.midY, "--winner-pill-end-x": path.endX, "--winner-pill-end-y": path.endY, "--winner-pill-rotation": path.rotation, "--winner-pill-bg": winnerPillTone.background, "--winner-pill-border": winnerPillTone.borderColor, "--winner-pill-color": winnerPillTone.textColor } as CSSProperties}><Trophy size={20} fill="currentColor" /><strong>{team.name}</strong></span>)}
    </div>
  );
}

function TvLeaderboardValue({ value }: { value: string }) {
  return <strong className="truncate text-center text-[clamp(16px,1vw,23px)] font-semibold tabular-nums text-brand">{value}</strong>;
}

function formatTvClock(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" });
}

function formatScoreUpdateTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function formatLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTournamentDayDateKey(tournament: Tournament | null, day: 1 | 2) {
  if (!tournament?.startsOn) return "";
  const date = new Date(`${tournament.startsOn}T12:00:00`);
  date.setDate(date.getDate() + day - 1);
  return formatLocalDateKey(date);
}

async function requestDayTwoSync(tournamentId: string, payload: { action?: "coin-toss"; nodeKey?: DayTwoCoinTossNodeKey; winningTeamId?: string; formatChoice?: DayTwoFormatChoice } = {}) {
  const supabase = getSupabaseClient();
  if (!supabase) return { ok: false, message: "Supabase env vars are missing." };
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) return { ok: false, message: "Please sign in to update Day 2." };
  const response = await fetch("/api/tournaments/day-two", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tournamentId, ...payload })
  });
  const result = await response.json().catch(() => ({})) as { error?: string; synced?: boolean; reason?: string };
  if (!response.ok) return { ok: false, message: result.error || "Day 2 could not be updated." };
  return { ok: true, message: result.reason || "Day 2 matchups updated." };
}

function TournamentScheduleExperience({ view }: { view: "schedule" | "bracket" }) {
  const appSession = useAppSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<PublishedTeam[]>([]);
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [playerMatches, setPlayerMatches] = useState<PlayerScheduleMatch[]>([]);
  const [teamCourtMatches, setTeamCourtMatches] = useState<TeamCourtScheduleMatch[]>([]);
  const [notes, setNotes] = useState<ScheduleNote[]>([]);
  const [coinTossDecisions, setCoinTossDecisions] = useState<DayTwoCoinTossDecision[]>([]);
  const [savingCoinTossNode, setSavingCoinTossNode] = useState("");
  const [scope, setScope] = useState<"my" | "team" | "bracket">(view === "bracket" ? "bracket" : "my");
  const [selectedDay, setSelectedDay] = useState<1 | 2>(1);
  const [openDayScheduleBlocks, setOpenDayScheduleBlocks] = useState<Record<string, boolean>>({});
  const [openingMatchId, setOpeningMatchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [scheduleNow, setScheduleNow] = useState(() => new Date());
  const dayTwoInitialSyncRef = useRef("");

  useEffect(() => {
    const interval = window.setInterval(() => setScheduleNow(new Date()), 30000);
    return () => window.clearInterval(interval);
  }, []);

  const loadSchedule = useCallback(async () => {
    if (!appSession.ready) return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      setLoading(false);
      return;
    }

    const { data: tournamentData, error } = await supabase
      .from("tournaments")
      .select("id, name, season_year, status, venue_name, venue_address, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents, max_players, notes, faqs")
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
      setTeams([]);
      setItems([]);
      setPlayerMatches([]);
      setTeamCourtMatches([]);
      setNotes([]);
      setCoinTossDecisions([]);
      setLoading(false);
      return;
    }

    const mappedTournament = mapTournament(tournamentData);
    setTournament(mappedTournament);

    const [teamsResult, itemsResult, notesResult, scheduleMatchesResult, schedulePlayersResult, scoresResult, coinTossResult] = await Promise.all([
      supabase
        .from("tournament_teams")
        .select("id, name, sort_order, logo_url, jersey_color, sponsor_name, sponsor_logo_url, sponsors, tournament_team_members(id, is_captain, draft_order, tier_at_draft, players(id, full_name, jamaat_city, age, date_of_birth, rating, profile_photo_url))")
        .eq("tournament_id", mappedTournament.id)
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("draft_order", { referencedTable: "tournament_team_members", ascending: true })
        .limit(40),
      supabase
        .from("tournament_schedule_items")
        .select("id, item_type, day_number, day_label, time_label, pod_label, court_label, phase, match_label, team_a_sort_order, team_b_sort_order, team_a_label, team_b_label, detail, sort_order")
        .eq("tournament_id", mappedTournament.id)
        .eq("is_published", true)
        .order("day_number", { ascending: true })
        .order("sort_order", { ascending: true })
        .limit(200),
      supabase
        .from("tournament_schedule_notes")
        .select("id, title, body, sort_order")
        .eq("tournament_id", mappedTournament.id)
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .limit(40),
      supabase
        .from("tournament_schedule_matches")
        .select("id, tournament_id, day_number, day_label, time_label, court_label, pod_label, format, match_type, match_color, tier_rule, team_a_id, team_b_id, team_a_label, team_b_label, external_match_id, sort_order")
        .eq("tournament_id", mappedTournament.id)
        .eq("is_published", true)
        .order("day_number", { ascending: true })
        .order("sort_order", { ascending: true })
        .limit(300),
      supabase
        .from("tournament_schedule_match_players")
        .select("id, schedule_match_id, team_id, player_id, side, slot, source_player_name")
        .eq("tournament_id", mappedTournament.id)
        .limit(1200),
      supabase
        .from("tournament_match_scores")
        .select("id, schedule_match_id, side_a_set1, side_b_set1, side_a_set2, side_b_set2, side_a_set3, side_b_set3, winner_side, submitted_at")
        .eq("tournament_id", mappedTournament.id)
        .limit(400),
      supabase
        .from("tournament_day2_coin_tosses")
        .select("bracket_node_key, winning_team_id, format_choice, decided_at")
        .eq("tournament_id", mappedTournament.id)
        .order("bracket_node_key")
    ]);

    const playerScheduleSchemaMissing = isScheduleSchemaMissing(scheduleMatchesResult.error?.message || schedulePlayersResult.error?.message || "");
    const scoreSchemaMissing = isScoreSchemaMissing(scoresResult.error?.message || "");
    const coinTossSchemaMissing = /tournament_day2_coin_tosses|schema cache|relation .* does not exist/i.test(coinTossResult.error?.message || "");
    if (teamsResult.error || itemsResult.error || notesResult.error || (!coinTossSchemaMissing && coinTossResult.error) || (!playerScheduleSchemaMissing && (scheduleMatchesResult.error || schedulePlayersResult.error)) || (!scoreSchemaMissing && scoresResult.error)) {
      setMessage(getFriendlyError(teamsResult.error || itemsResult.error || notesResult.error || (!coinTossSchemaMissing ? coinTossResult.error : null) || scheduleMatchesResult.error || schedulePlayersResult.error || scoresResult.error));
      setLoading(false);
      return;
    }

    const mappedTeams = (teamsResult.data || []).map((team) => {
      const members = Array.isArray(team.tournament_team_members) ? team.tournament_team_members : team.tournament_team_members ? [team.tournament_team_members] : [];
      return {
        id: team.id,
        name: team.name || "Team",
        sortOrder: team.sort_order || 0,
        logoUrl: team.logo_url || "",
        jerseyColor: getSourceTeamColor(team.jersey_color),
        sponsorName: team.sponsor_name || "",
        sponsorLogoUrl: team.sponsor_logo_url || "",
        sponsors: mapTeamSponsors(team.sponsors, team.sponsor_name || "", team.sponsor_logo_url || ""),
        members: members.map((member) => {
          const player = Array.isArray(member.players) ? member.players[0] : member.players;
          return {
            id: member.id,
            playerId: player?.id || "",
            name: player?.full_name || "Player",
            age: formatRegisteredPlayerAge(player?.date_of_birth, player?.age),
            city: player?.jamaat_city || "MRSA",
            tier: member.tier_at_draft ? `Tier ${member.tier_at_draft}` : "Tier TBD",
            rating: formatRegisteredPlayerRating(player?.rating),
            profilePhotoUrl: player?.profile_photo_url || "",
            isCaptain: Boolean(member.is_captain),
            draftOrder: member.draft_order ?? null
          };
        })
      };
    });
    setTeams(mappedTeams);

    setItems((itemsResult.data || []).map((item) => ({
      id: item.id,
      itemType: item.item_type === "event" ? "event" : "match",
      dayNumber: item.day_number || 1,
      dayLabel: item.day_label || `Day ${item.day_number || 1}`,
      timeLabel: item.time_label || "",
      podLabel: item.pod_label || "",
      courtLabel: item.court_label || "",
      phase: item.phase || "",
      matchLabel: item.match_label || "",
      teamASortOrder: item.team_a_sort_order ?? null,
      teamBSortOrder: item.team_b_sort_order ?? null,
      teamALabel: item.team_a_label || "",
      teamBLabel: item.team_b_label || "",
      detail: item.detail || "",
      sortOrder: item.sort_order || 0
    })));
    setNotes((notesResult.data || []).map((note) => ({
      id: note.id,
      title: note.title || "Note",
      body: note.body || "",
      sortOrder: note.sort_order || 0
    })));
    setCoinTossDecisions((coinTossSchemaMissing ? [] : coinTossResult.data || []).flatMap((decision) => {
      const nodeKey = decision.bracket_node_key;
      const formatChoice = decision.format_choice;
      if ((nodeKey !== "reentry1" && nodeKey !== "reentry2" && nodeKey !== "semifinal1" && nodeKey !== "semifinal2") || (formatChoice !== "tiers_1_2_singles" && formatChoice !== "tiers_3_4_singles")) return [];
      return [{ nodeKey, winningTeamId: decision.winning_team_id || "", formatChoice, decidedAt: decision.decided_at || "" }];
    }));
    if (playerScheduleSchemaMissing) {
      setPlayerMatches([]);
      setTeamCourtMatches([]);
    } else {
      const mappedScores = scoreSchemaMissing ? [] : mapMatchScores(scoresResult.data || []);
      setPlayerMatches(mapPlayerScheduleMatches(scheduleMatchesResult.data || [], schedulePlayersResult.data || [], mappedTeams, mappedScores, getSchedulePreviewPlayerId(mappedTeams, appSession.player)));
      setTeamCourtMatches(mapTeamCourtScheduleMatches(scheduleMatchesResult.data || [], schedulePlayersResult.data || [], mappedTeams, mappedScores));
    }
    setLoading(false);
  }, [appSession.player, appSession.ready]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  useEffect(() => {
    if (view !== "bracket" || !tournament?.id || !appSession.session?.access_token || loading) return;
    const dayOneMatches = teamCourtMatches.filter((match) => match.dayNumber === 1);
    const dayTwoMatches = teamCourtMatches.filter((match) => match.dayNumber === 2);
    if (!dayOneMatches.length || dayTwoMatches.length || !dayOneMatches.every((match) => Boolean(match.score?.winnerSide))) return;
    if (dayTwoInitialSyncRef.current === tournament.id) return;
    dayTwoInitialSyncRef.current = tournament.id;
    requestDayTwoSync(tournament.id).then((result) => {
      if (result.ok) loadSchedule();
    });
  }, [appSession.session?.access_token, loadSchedule, loading, teamCourtMatches, tournament?.id, view]);

  const saveCoinToss = useCallback(async (nodeKey: DayTwoCoinTossNodeKey, winningTeamId: string, formatChoice: DayTwoFormatChoice) => {
    if (!tournament?.id) return "Tournament not found.";
    setSavingCoinTossNode(nodeKey);
    const result = await requestDayTwoSync(tournament.id, { action: "coin-toss", nodeKey, winningTeamId, formatChoice });
    if (result.ok) await loadSchedule();
    setSavingCoinTossNode("");
    return result.ok ? "Coin toss saved. Matchups updated." : result.message;
  }, [loadSchedule, tournament?.id]);

  useEffect(() => {
    const nextScope = searchParams.get("scope");
    const nextDay = searchParams.get("day");
    if (view === "bracket") {
      setScope("bracket");
    } else if (nextScope === "my" || nextScope === "team") {
      setScope(nextScope);
    }
    if (nextDay === "2") setSelectedDay(2);
    if (nextDay === "1") setSelectedDay(1);
  }, [searchParams, view]);

  if (!appSession.ready) return null;

  const assignedTeam = getScheduleAssignedTeam(teams, appSession.player);
  const dayOneMatches = teamCourtMatches.filter((match) => match.dayNumber === 1);
  const dayTwoMatches = teamCourtMatches.filter((match) => match.dayNumber === 2);
  const completedDayOneMatches = dayOneMatches.filter((match) => Boolean(match.score?.winnerSide)).length;
  const dayOneStandings = getLiveTeamStandings(teams, dayOneMatches);
  const dayOneIsFinal = Boolean(dayOneMatches.length && completedDayOneMatches === dayOneMatches.length && !dayOneStandings.some((standing) => standing.requiresReview));
  const selectedPlayerMatches = playerMatches.filter((match) => match.dayNumber === selectedDay);
  const selectedTeamMatches = assignedTeam
    ? teamCourtMatches.filter((match) => match.dayNumber === selectedDay && (match.teamAId === assignedTeam.id || match.teamBId === assignedTeam.id))
    : [];
  const groupedPlayerMatches = groupPlayerMatchesByTime(selectedPlayerMatches);
  const playerScheduleTimeLabels = getSortedPlayerScheduleTimeLabels(groupedPlayerMatches);
  const groupedTeamMatches = groupTeamMatchesByTime(selectedTeamMatches);
  const teamScheduleTimeLabels = Object.keys(groupedTeamMatches).sort((a, b) => getScheduleTimeSortValue(a) - getScheduleTimeSortValue(b) || a.localeCompare(b));
  const dayTwoBracketStages = buildLiveTeamBracket(dayOneStandings, dayTwoMatches, dayOneIsFinal);
  const tournamentChampion = getTournamentChampionFromStages(dayTwoBracketStages);
  const fullBracketNodes = selectedDay === 1
    ? buildDayOneRoundNodes(teams, dayOneMatches)
    : dayTwoBracketStages.flatMap((stage) => stage.nodes);
  const selectedDayEvents = getDayScheduleEventItems(items, selectedDay);
  const playerScheduleTimeline = buildScheduleTimelineEntries(playerScheduleTimeLabels, selectedDayEvents);
  const teamScheduleTimeline = buildScheduleTimelineEntries(teamScheduleTimeLabels, selectedDayEvents);
  const activeScope = view === "bracket" ? "bracket" : scope;
  const selectedScheduleTimeline = activeScope === "team" ? teamScheduleTimeline : playerScheduleTimeline;
  const selectedDayDateKey = getTournamentDayDateKey(tournament, selectedDay);
  const scheduleTodayKey = getChicagoDateKey(scheduleNow);
  const scheduleCurrentMinutes = getChicagoMinutes(scheduleNow);
  const showScheduleNowMarker = view === "schedule" && selectedDayDateKey === scheduleTodayKey;
  const scheduleNowInsertIndex = showScheduleNowMarker
    ? selectedScheduleTimeline.findIndex((entry) => getScheduleTimeSortValue(entry.label) > scheduleCurrentMinutes)
    : -2;
  const selectedFallbackItems = items.filter((item) => item.dayNumber === selectedDay && !isLunchScheduleItem(item));
  const openMatchDetails = (match: TeamCourtScheduleMatch) => {
    if (openingMatchId) return;
    setOpeningMatchId(match.id);
    router.push(`/tournaments/schedule/matches/${match.id}`);
  };
  const openTeamDetails = (teamId: string) => router.push(`/tournaments/schedule/teams/${teamId}`);
  return (
    <AppFrame active="tournament" withNav={view === "schedule" || Boolean(appSession.userId)}>
      <div className={memberPageClass}>
        <AppTopBar publicNextPath={view === "bracket" ? "/tournaments/bracket" : undefined} />
        <main className={view === "schedule" ? "mx-auto grid w-full max-w-[1040px] gap-4 px-3 py-4 pb-32 min-[480px]:px-5 sm:gap-5 sm:py-5 lg:px-8 lg:py-7" : memberMainClass}>
          {view === "schedule" && (
            <SchedulePageHeader
              activeScope={activeScope === "team" ? "team" : "my"}
              notesCount={notes.length}
              now={scheduleNow}
              onSelectDay={setSelectedDay}
              onSelectScope={setScope}
              selectedDay={selectedDay}
              tournament={tournament}
            />
          )}
          {view === "bracket" && (
          <section className={`${tournamentLiveBannerClass} p-3 sm:p-4 lg:p-5`}>
            <TournamentHeroAmbience />
            <div className="relative grid gap-3">
              <div className="grid grid-cols-[34px_minmax(0,1fr)_34px] items-center gap-2">
                <Link className="tap-card grid h-8 w-8 place-items-center rounded-full border-hairline border-white/20 bg-white/10 text-white shadow-[0_8px_18px_rgba(var(--brand-deep-rgb),0.10)]" href={appSession.userId ? "/tournaments" : "/"} aria-label={appSession.userId ? "Back to tournament" : "Back to MRSA home"}>
                  <ArrowLeft size={15} />
                </Link>
                <div className="grid min-w-0 justify-items-center gap-1 text-center">
                  <h1 className="text-[24px] font-medium leading-tight tracking-[-0.3px] text-white sm:text-[28px]">Live Bracket</h1>
                </div>
                <span className="inline-flex h-8 items-center justify-center gap-1 rounded-full border-hairline border-white/20 bg-white/10 px-2 text-[8px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]" aria-label="Live scores">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
                  Live
                </span>
              </div>

              <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-2" aria-label="Schedule day">
                  {([1, 2] as const).map((day) => {
                    const dateKey = getTournamentDayDateKey(tournament, day);
                    const isActive = selectedDay === day;
                    const isToday = dateKey === scheduleTodayKey;
                    const dayStatus = isToday ? "In progress" : dateKey && dateKey < scheduleTodayKey ? "Completed" : "Upcoming";
                    return (
                      <button className={isActive ? "tap-card grid min-h-[68px] content-center gap-1 rounded-[15px] border border-brand-primary bg-brand-primary px-3 py-2 text-left text-white" : "tap-card grid min-h-[68px] content-center gap-1 rounded-[15px] border border-white/12 bg-white/[0.08] px-3 py-2 text-left text-white backdrop-blur transition hover:bg-white/15"} type="button" onClick={() => setSelectedDay(day)} aria-pressed={isActive} key={day}>
                        <span className="flex items-center justify-between gap-2">
                          <strong className="text-[14px] font-semibold leading-none sm:text-[15px]">Day {day}</strong>
                          <em className="text-[8px] font-semibold not-italic uppercase tracking-[0.06em] text-white/75">{dayStatus}</em>
                        </span>
                        <span className={isActive ? "text-[10px] font-medium text-white sm:text-[11px]" : "text-[10px] font-medium text-white/72 sm:text-[11px]"}>{formatScheduleDayDate(tournament, day)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-center text-[11px] font-medium">
                <Link className="tap-card inline-flex min-h-7 items-center justify-center gap-1 whitespace-nowrap rounded-full border-hairline border-[var(--accent)]/35 bg-[var(--accent)]/10 px-3 py-1 text-[var(--accent)] transition hover:bg-[var(--accent)]/18 hover:text-white" href="/tournaments/leaderboard">
                  Leaderboard
                  <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </section>
          )}

          {view === "bracket" && tournament && tournamentChampion && (
            <TournamentWinnerBanner source="bracket" team={tournamentChampion} tournament={tournament} />
          )}

          {message && <StatusMessage tone="error">{message}</StatusMessage>}
          {openingMatchId && <ScheduleLoadingNotice label="Opening match..." overlay />}

          {activeScope === "team" && !assignedTeam && (
            <StatusMessage tone="warning">No team assignment found yet. Your team schedule will appear here once rosters are published.</StatusMessage>
          )}

          <section className={openingMatchId ? "pointer-events-none grid gap-4 opacity-70" : "grid gap-4"} aria-label="Tournament schedule" aria-busy={Boolean(openingMatchId)}>
            {selectedDay === 2 && !dayOneIsFinal && (
              <div className="grid grid-cols-[28px_minmax(0,1fr)] items-center gap-2.5 rounded-[15px] border-hairline border-[var(--hairline-strong)] bg-[var(--surface)] px-3 py-2.5 text-brand">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white"><Info size={14} /></span>
                <p className="text-[13px] font-medium leading-relaxed">Day 2 pairings lock in once Day 1 seeding is final.</p>
              </div>
            )}
            {!loading && activeScope === "bracket" && <ScheduleDayEventRail day={selectedDay} items={selectedDayEvents} />}
            {activeScope === "my" && (
              <div className="relative grid gap-4">
                <span className="pointer-events-none absolute bottom-0 left-[20px] top-0 z-[3] w-px bg-[var(--text-muted-token)]" aria-hidden="true" />
                {playerScheduleTimeline.map((entry, timeIndex) => (
                  <Fragment key={entry.key}>
                    {scheduleNowInsertIndex === timeIndex && <ScheduleNowMarker now={scheduleNow} />}
                    <ScheduleTimelineSlot state={entry.kind === "event" ? "break" : getScheduleGroupState(groupedPlayerMatches[entry.label] || [], tournament, scheduleNow)}>
                      {entry.kind === "event"
                        ? <ScheduleTimelineEventCard item={entry.item} />
                        : (
                          <PlayerScheduleTimeCard
                            label={entry.label}
                            matches={groupedPlayerMatches[entry.label] || []}
                            tournament={tournament}
                            teams={teams}
                            onOpenMatch={(match) => {
                              const fullMatch = teamCourtMatches.find((teamMatch) => teamMatch.id === match.id);
                              if (fullMatch) openMatchDetails(fullMatch);
                            }}
                            isFeatured={timeIndex === 1}
                          />
                        )}
                    </ScheduleTimelineSlot>
                  </Fragment>
                ))}
                {scheduleNowInsertIndex === -1 && <ScheduleNowMarker now={scheduleNow} />}
              </div>
            )}
            {activeScope === "team" && assignedTeam && (
              <div className="relative grid gap-4">
                <span className="pointer-events-none absolute bottom-0 left-[20px] top-0 z-[3] w-px bg-[var(--text-muted-token)]" aria-hidden="true" />
                {teamScheduleTimeline.map((entry, timeIndex) => (
                  <Fragment key={entry.key}>
                    {scheduleNowInsertIndex === timeIndex && <ScheduleNowMarker now={scheduleNow} />}
                    <ScheduleTimelineSlot state={entry.kind === "event" ? "break" : getScheduleGroupState(groupedTeamMatches[entry.label] || [], tournament, scheduleNow)}>
                      {entry.kind === "event"
                        ? <ScheduleTimelineEventCard item={entry.item} />
                        : <TeamScheduleTimeCard label={entry.label} matches={groupedTeamMatches[entry.label] || []} team={assignedTeam} tournament={tournament} teams={teams} onOpenMatch={openMatchDetails} />}
                    </ScheduleTimelineSlot>
                  </Fragment>
                ))}
                {scheduleNowInsertIndex === -1 && <ScheduleNowMarker now={scheduleNow} />}
              </div>
            )}
            {activeScope === "bracket" && !!fullBracketNodes.length && (
              <ScheduleFullBracketBoard
                day={selectedDay}
                dayOneNodes={selectedDay === 1 ? fullBracketNodes : []}
                dayTwoStages={selectedDay === 2 ? dayTwoBracketStages : []}
                coinTossDecisions={coinTossDecisions}
                viewerTeamId={assignedTeam?.id || ""}
                viewerIsAdmin={appSession.isAdmin}
                viewerIsSignedIn={Boolean(appSession.userId)}
                savingCoinTossNode={savingCoinTossNode}
                openNodes={openDayScheduleBlocks}
                onToggleNode={(nodeId) => setOpenDayScheduleBlocks((current) => ({ ...current, [nodeId]: !current[nodeId] }))}
                onSaveCoinToss={saveCoinToss}
              />
            )}
            {activeScope === "bracket" && !loading && !fullBracketNodes.length && selectedDay === 1 && !!selectedFallbackItems.length && (
              <div className="grid gap-4 xl:grid-cols-3">
                {Object.entries(groupScheduleItemsByTime(selectedFallbackItems)).map(([timeLabel, dayItems]) => (
                  <DayScheduleTimeCard
                    blocks={[]}
                    eventItems={dayItems}
                    label={timeLabel}
                    openBlocks={openDayScheduleBlocks}
                    onToggleBlock={(blockId) => setOpenDayScheduleBlocks((current) => ({ ...current, [blockId]: !current[blockId] }))}
                    teams={teams}
                    onOpenMatch={openMatchDetails}
                    onOpenTeam={openTeamDetails}
                    key={timeLabel}
                  />
                ))}
              </div>
            )}
            {loading && Array.from({ length: 5 }).map((_, index) => <SkeletonRow key={index} />)}
            {!loading && activeScope === "my" && !selectedPlayerMatches.length && !(selectedDay === 2 && !dayOneIsFinal) && <StatusMessage tone="info">Your Day {selectedDay} matches will appear here once posted.</StatusMessage>}
            {!loading && activeScope === "team" && assignedTeam && !selectedTeamMatches.length && !(selectedDay === 2 && !dayOneIsFinal) && <StatusMessage tone="info">Your team’s Day {selectedDay} matches will appear here once posted.</StatusMessage>}
            {!loading && activeScope === "bracket" && !fullBracketNodes.length && !selectedFallbackItems.length && !(selectedDay === 2 && !dayOneIsFinal) && <StatusMessage tone="info">Day {selectedDay} matchups will appear here once posted.</StatusMessage>}
          </section>
        </main>
        {view === "bracket" && tournament && tournamentChampion && (
          <TournamentWinnerCelebration autoPlay team={tournamentChampion} tournamentId={tournament.id} />
        )}
      </div>
    </AppFrame>
  );
}

export function TournamentScheduleRulesScreen() {
  const appSession = useAppSession();
  const [notes, setNotes] = useState<ScheduleNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadRules = useCallback(async () => {
    if (!appSession.ready) return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      setLoading(false);
      return;
    }

    const { data: tournamentData, error } = await supabase
      .from("tournaments")
      .select("id")
      .in("status", ["draft", "registration_open", "registration_closed", "live"])
      .order("starts_on", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !tournamentData) {
      setMessage(error ? getFriendlyError(error) : "No active tournament found.");
      setLoading(false);
      return;
    }

    const { data, error: notesError } = await supabase
      .from("tournament_schedule_notes")
      .select("id, title, body, sort_order")
      .eq("tournament_id", tournamentData.id)
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .limit(80);

    if (notesError) {
      setMessage(getFriendlyError(notesError));
      setLoading(false);
      return;
    }

    setNotes((data || []).map((note) => ({
      id: note.id,
      title: note.title || "Note",
      body: note.body || "",
      sortOrder: note.sort_order || 0
    })));
    setLoading(false);
  }, [appSession.ready]);

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  if (!appSession.ready) return null;

  return (
    <AppFrame active="tournament" withNav={Boolean(appSession.userId)}>
      <div className={memberPageClass}>
        <AppTopBar publicNextPath="/tournaments/schedule/rules" />
        <main className={memberMainClass}>
          <section className="relative overflow-hidden rounded-[26px] border-hairline border-white/20 bg-brand-deep px-5 py-8 text-white shadow-[0_22px_52px_rgba(var(--brand-deep-rgb), 0.20)] sm:px-6 sm:py-10">
            <span className="pointer-events-none absolute inset-0 opacity-35 court-lines" aria-hidden="true" />
            <Link className="tap-card absolute left-4 top-4 z-10 inline-grid h-8 max-h-8 min-h-8 w-8 min-w-8 max-w-8 place-items-center rounded-full border-hairline border-white/20 bg-white/10 p-0 text-white shadow-[0_8px_18px_rgba(var(--brand-deep-rgb),0.10)]" href="/tournaments/schedule" aria-label="Back to schedule">
                <ArrowLeft size={15} />
            </Link>
            <div className="relative grid min-w-0 justify-items-center px-8 text-center">
              <h1 className="max-w-[520px] text-[27px] font-medium leading-[1.08] tracking-[-0.3px] text-white sm:text-[34px]">Tournament Rules &amp; Regulations</h1>
            </div>
          </section>

          {message && <StatusMessage tone="error">{message}</StatusMessage>}
          {loading && Array.from({ length: 4 }).map((_, index) => <SkeletonRow key={index} />)}
          {!loading && !notes.length && !message && <StatusMessage tone="info">Schedule considerations will appear here when posted.</StatusMessage>}
          {!!notes.length && (
            <section className="grid gap-3">
              {notes.map((note, index) => (
                <article className="grid gap-2 rounded-[18px] border-hairline border-line bg-white/90 p-4 shadow-[0_12px_28px_rgba(var(--brand-deep-rgb),0.05)] backdrop-blur sm:p-5" key={note.id}>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-tint text-[12px] font-medium text-[var(--accent-ink)]">{index + 1}</span>
                  <strong className="text-[17px] font-medium leading-snug text-text-primary">{note.title}</strong>
                  <p className="text-[14px] leading-relaxed text-text-secondary">{note.body}</p>
                </article>
              ))}
            </section>
          )}
        </main>
      </div>
    </AppFrame>
  );
}

export function TournamentScheduleMatchScreen({ matchId }: { matchId: string }) {
  const appSession = useAppSession();
  const searchParams = useSearchParams();
  const [match, setMatch] = useState<TeamCourtScheduleMatch | null>(null);
  const [teams, setTeams] = useState<PublishedTeam[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isOwnMatch, setIsOwnMatch] = useState(false);
  const [ownMatchSide, setOwnMatchSide] = useState<"A" | "B" | null>(null);
  const [draft, setDraft] = useState<ScoreDraft>(getEmptyScoreDraft());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadMatch = useCallback(async () => {
    if (!appSession.ready) return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      setLoading(false);
      return;
    }

    const { data: matchRow, error: matchError } = await supabase
      .from("tournament_schedule_matches")
      .select("id, tournament_id, day_number, day_label, time_label, court_label, pod_label, format, match_type, match_color, tier_rule, team_a_id, team_b_id, team_a_label, team_b_label, external_match_id, sort_order")
      .eq("id", matchId)
      .maybeSingle();

    if (matchError || !matchRow) {
      setMessage(matchError ? getFriendlyError(matchError) : "Match not found.");
      setLoading(false);
      return;
    }

    const [tournamentResult, teamsResult, participantsResult, scoresResult] = await Promise.all([
      supabase
        .from("tournaments")
        .select("id, name, season_year, status, venue_name, venue_address, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents, max_players, notes, faqs")
        .eq("id", matchRow.tournament_id)
        .maybeSingle(),
      supabase
        .from("tournament_teams")
        .select("id, name, sort_order, logo_url, jersey_color, sponsor_name, sponsor_logo_url, sponsors, tournament_team_members(id, is_captain, draft_order, tier_at_draft, players(id, full_name, jamaat_city, age, date_of_birth, rating, profile_photo_url))")
        .eq("tournament_id", matchRow.tournament_id)
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("draft_order", { referencedTable: "tournament_team_members", ascending: true })
        .limit(40),
      supabase
        .from("tournament_schedule_match_players")
        .select("id, schedule_match_id, team_id, player_id, side, slot, source_player_name")
        .eq("schedule_match_id", matchId)
        .limit(8),
      supabase
        .from("tournament_match_scores")
        .select("id, schedule_match_id, side_a_set1, side_b_set1, side_a_set2, side_b_set2, side_a_set3, side_b_set3, winner_side, submitted_by, submitted_at")
        .eq("schedule_match_id", matchId)
        .maybeSingle()
    ]);

    const scoreSchemaMissing = isScoreSchemaMissing(scoresResult.error?.message || "");
    if (tournamentResult.error || teamsResult.error || participantsResult.error || (!scoreSchemaMissing && scoresResult.error)) {
      setMessage(getFriendlyError(tournamentResult.error || teamsResult.error || participantsResult.error || scoresResult.error));
      setLoading(false);
      return;
    }

    const mappedTournament = tournamentResult.data ? mapTournament(tournamentResult.data) : null;
    const mappedTeams = mapPublishedTeamsFromRows(teamsResult.data || []);
    const mappedScores = scoreSchemaMissing || !scoresResult.data ? [] : mapMatchScores([scoresResult.data]);
    const mappedScore = mappedScores[0];
    if (mappedScore?.submittedById) {
      const rosterSubmitter = mappedTeams.flatMap((team) => team.members).find((member) => member.playerId === mappedScore.submittedById);
      let submitterName = rosterSubmitter?.name || "";
      if (!submitterName) {
        const { data: submitter } = await supabase.from("players").select("full_name").eq("id", mappedScore.submittedById).maybeSingle();
        submitterName = submitter?.full_name || "";
      }
      mappedScore.submittedByName = submitterName;
    }
    const mappedMatch = mapTeamCourtScheduleMatches([matchRow], participantsResult.data || [], mappedTeams, mappedScores)[0] || null;
    const previewPlayerId = getSchedulePreviewPlayerId(mappedTeams, appSession.player);
    const ownParticipant = (participantsResult.data || []).find((participant) => participant.player_id === previewPlayerId);
    setTournament(mappedTournament);
    setTeams(mappedTeams);
    setMatch(mappedMatch);
    setDraft(getScoreDraftFromScore(mappedMatch?.score));
    setIsOwnMatch(Boolean(ownParticipant));
    setOwnMatchSide(ownParticipant?.side === "B" ? "B" : ownParticipant?.side === "A" ? "A" : null);
    setLoading(false);
  }, [appSession.player, appSession.ready, matchId]);

  useEffect(() => {
    loadMatch();
  }, [loadMatch]);

  if (!appSession.ready) return null;

  const entryWindow = getScoreEntryWindow(tournament?.startsOn || null, tournament?.endsOn || null);
  const canAccessScoreEntry = Boolean(isOwnMatch || appSession.isAdmin);
  const canSubmitScore = Boolean(appSession.isAdmin || (isOwnMatch && entryWindow.canEdit));
  const openedFromBracket = searchParams.get("from") === "bracket" || searchParams.get("from") === "full-bracket";
  const openedFromDashboard = searchParams.get("from") === "dashboard";
  const openedFromPlayerProfile = searchParams.get("from") === "player-profile";
  const sourcePlayerId = searchParams.get("player") || "";
  const bracketDay = searchParams.get("day") === "2" ? 2 : match?.dayNumber || 1;
  const ballTeam = match ? getBallTeamForMatchup(match.dayNumber, match.teamAId, match.teamBId, match.id, teams) : null;
  const submitScore = async () => {
    if (!match || !appSession.userId || !canSubmitScore) return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      return;
    }
    const parsedScore = parseScoreDraft(draft);
    if (!parsedScore.ok) {
      setMessage(parsedScore.message);
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const { data, error } = await supabase
        .from("tournament_match_scores")
        .upsert({
          tournament_id: match.tournamentId,
          schedule_match_id: match.id,
          side_a_set1: parsedScore.values.sideASet1,
          side_b_set1: parsedScore.values.sideBSet1,
          side_a_set2: parsedScore.values.sideASet2,
          side_b_set2: parsedScore.values.sideBSet2,
          side_a_set3: parsedScore.values.sideASet3,
          side_b_set3: parsedScore.values.sideBSet3,
          winner_side: parsedScore.values.winnerSide || null,
          submitted_by: appSession.player?.id || null,
          submitted_at: new Date().toISOString()
        }, { onConflict: "schedule_match_id" })
        .select("id, schedule_match_id, side_a_set1, side_b_set1, side_a_set2, side_b_set2, side_a_set3, side_b_set3, winner_side, submitted_by, submitted_at")
        .maybeSingle();
      if (error) {
        setMessage(getFriendlyError(error));
        return;
      }
      const mappedNextScore = mapMatchScores(data ? [data] : [])[0] || null;
      const nextScore = mappedNextScore ? { ...mappedNextScore, submittedByName: appSession.player?.full_name || (appSession.isAdmin ? "Tournament admin" : "Player") } : null;
      setMatch((current) => current ? { ...current, score: nextScore } : current);
      const dayTwoResult = await requestDayTwoSync(match.tournamentId);
      setMessage(dayTwoResult.ok ? "Score saved." : `Score saved. Day 2 update pending: ${dayTwoResult.message}`);
    } catch (error) {
      setMessage(getFriendlyError(error instanceof Error ? { message: error.message } : null));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppFrame active="tournament" withNav={Boolean(appSession.userId)}>
      <div className={memberPageClass}>
        <AppTopBar publicNextPath={`/tournaments/schedule/matches/${matchId}`} />
        <main className={`${memberMainClass} match-detail-main`}>
          {loading && <ScheduleLoadingNotice label="Loading match..." />}
          {message && !match && <StatusMessage tone="error">{message}</StatusMessage>}
          {match && (
            <MatchDetailPageCard
              canSubmit={canSubmitScore}
              backHref={openedFromDashboard ? "/dashboard" : openedFromBracket ? `/tournaments/bracket?day=${bracketDay}` : openedFromPlayerProfile && sourcePlayerId ? `/tournaments/players/${sourcePlayerId}?from=match&match=${matchId}` : "/tournaments/schedule"}
              backLabel={openedFromDashboard ? "Back to home" : openedFromBracket ? "Back to live bracket" : openedFromPlayerProfile ? "Back to player profile" : "Back to schedule"}
              draft={draft}
              entryLabel={appSession.isAdmin ? "Admin scoring" : isOwnMatch ? entryWindow.label : "Read only"}
              canAccessScoreEntry={canAccessScoreEntry}
              match={match}
              ballTeamName={ballTeam?.name || ""}
              message={message}
              onChangeDraft={setDraft}
              onSubmit={submitScore}
              ownSide={ownMatchSide}
              saving={saving}
            />
          )}
        </main>
      </div>
    </AppFrame>
  );
}

export function TournamentScheduleTeamScreen({ teamId }: { teamId: string }) {
  const appSession = useAppSession();
  const searchParams = useSearchParams();
  const [team, setTeam] = useState<PublishedTeam | null>(null);
  const [matches, setMatches] = useState<TeamCourtScheduleMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadTeam = useCallback(async () => {
    if (!appSession.ready) return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      setLoading(false);
      return;
    }
    const { data: teamRow, error: teamError } = await supabase
      .from("tournament_teams")
      .select("id, tournament_id, name, sort_order, logo_url, jersey_color, sponsor_name, sponsor_logo_url, sponsors, tournament_team_members(id, is_captain, draft_order, tier_at_draft, players(id, full_name, jamaat_city, age, date_of_birth, rating, profile_photo_url))")
      .eq("id", teamId)
      .maybeSingle();
    if (teamError || !teamRow) {
      setMessage(teamError ? getFriendlyError(teamError) : "Team not found.");
      setLoading(false);
      return;
    }
    const [teamsResult, matchesResult, participantsResult, scoresResult] = await Promise.all([
      supabase
        .from("tournament_teams")
        .select("id, name, sort_order, logo_url, jersey_color, sponsor_name, sponsor_logo_url, sponsors, tournament_team_members(id, is_captain, draft_order, tier_at_draft, players(id, full_name, jamaat_city, age, date_of_birth, rating, profile_photo_url))")
        .eq("tournament_id", teamRow.tournament_id)
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("draft_order", { referencedTable: "tournament_team_members", ascending: true })
        .limit(40),
      supabase
        .from("tournament_schedule_matches")
        .select("id, tournament_id, day_number, day_label, time_label, court_label, pod_label, format, match_type, match_color, tier_rule, team_a_id, team_b_id, team_a_label, team_b_label, external_match_id, sort_order")
        .eq("tournament_id", teamRow.tournament_id)
        .eq("is_published", true)
        .order("day_number", { ascending: true })
        .order("sort_order", { ascending: true })
        .limit(300),
      supabase
        .from("tournament_schedule_match_players")
        .select("id, schedule_match_id, team_id, player_id, side, slot, source_player_name")
        .eq("tournament_id", teamRow.tournament_id)
        .limit(1200),
      supabase
        .from("tournament_match_scores")
        .select("id, schedule_match_id, side_a_set1, side_b_set1, side_a_set2, side_b_set2, side_a_set3, side_b_set3, winner_side, submitted_at")
        .eq("tournament_id", teamRow.tournament_id)
        .limit(400)
    ]);
    const scoreSchemaMissing = isScoreSchemaMissing(scoresResult.error?.message || "");
    if (teamsResult.error || matchesResult.error || participantsResult.error || (!scoreSchemaMissing && scoresResult.error)) {
      setMessage(getFriendlyError(teamsResult.error || matchesResult.error || participantsResult.error || scoresResult.error));
      setLoading(false);
      return;
    }
    const mappedTeams = mapPublishedTeamsFromRows(teamsResult.data || []);
    const mappedScores = scoreSchemaMissing ? [] : mapMatchScores(scoresResult.data || []);
    const mappedMatches = mapTeamCourtScheduleMatches(matchesResult.data || [], participantsResult.data || [], mappedTeams, mappedScores);
    setTeam(mappedTeams.find((mappedTeam) => mappedTeam.id === teamId) || null);
    setMatches(mappedMatches.filter((match) => match.teamAId === teamId || match.teamBId === teamId));
    setLoading(false);
  }, [appSession.ready, teamId]);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  if (!appSession.ready) return null;
  const openedFromRoster = searchParams.get("from") === "roster";
  const openedFromLeaderboard = searchParams.get("from") === "team-leaderboard";
  const backHref = openedFromRoster ? "/tournaments/teams" : openedFromLeaderboard ? "/tournaments/leaderboard?view=team" : "/tournaments/schedule";
  const backLabel = openedFromRoster ? "Back to team rosters" : openedFromLeaderboard ? "Back to team leaderboard" : "Back to schedule";

  return (
    <AppFrame active="tournament" withNav={Boolean(appSession.userId)}>
      <div className={memberPageClass}>
        <AppTopBar publicNextPath={`/tournaments/schedule/teams/${teamId}`} />
        <main className={memberMainClass}>
          {loading && <SkeletonRow />}
          {message && !team && <StatusMessage tone="error">{message}</StatusMessage>}
          {team && <TeamDetailPageCard backHref={backHref} backLabel={backLabel} matches={matches} team={team} />}
        </main>
      </div>
    </AppFrame>
  );
}

export function TournamentPlayerProfileScreen({ playerId }: { playerId: string }) {
  const appSession = useAppSession();
  const searchParams = useSearchParams();
  const [player, setPlayer] = useState<PublishedTeamMember | null>(null);
  const [team, setTeam] = useState<PublishedTeam | null>(null);
  const [matches, setMatches] = useState<TeamCourtScheduleMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadPlayerProfile = useCallback(async () => {
    if (!appSession.ready) return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    const [playerResult, tournamentResult] = await Promise.all([
      supabase
        .from("players")
        .select("id, full_name, jamaat_city, age, date_of_birth, rating, profile_photo_url")
        .eq("id", playerId)
        .maybeSingle(),
      supabase
        .from("tournaments")
        .select("id")
        .in("status", ["registration_open", "registration_closed", "live"])
        .order("starts_on", { ascending: false })
        .limit(1)
        .maybeSingle()
    ]);

    if (playerResult.error || tournamentResult.error) {
      setMessage(getFriendlyError(playerResult.error || tournamentResult.error));
      setLoading(false);
      return;
    }

    const playerRow = playerResult.data;
    if (!playerRow) {
      setPlayer(null);
      setTeam(null);
      setMatches([]);
      setMessage("Player profile not found.");
      setLoading(false);
      return;
    }

    const standalonePlayer: PublishedTeamMember = {
      id: `player:${playerRow.id}`,
      playerId: playerRow.id,
      name: playerRow.full_name || "Player",
      age: formatRegisteredPlayerAge(playerRow.date_of_birth, playerRow.age),
      city: playerRow.jamaat_city || "MRSA",
      tier: "Tier TBD",
      rating: formatRating(playerRow.rating),
      profilePhotoUrl: playerRow.profile_photo_url || "",
      isCaptain: false,
      draftOrder: null
    };
    const tournamentData = tournamentResult.data;
    if (!tournamentData) {
      setPlayer(standalonePlayer);
      setTeam(null);
      setMatches([]);
      setMessage("");
      setLoading(false);
      return;
    }

    const [teamsResult, matchesResult, participantsResult, scoresResult] = await Promise.all([
      supabase
        .from("tournament_teams")
        .select("id, name, sort_order, logo_url, jersey_color, sponsor_name, sponsor_logo_url, sponsors, tournament_team_members(id, is_captain, draft_order, tier_at_draft, players(id, full_name, jamaat_city, age, date_of_birth, rating, profile_photo_url))")
        .eq("tournament_id", tournamentData.id)
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("draft_order", { referencedTable: "tournament_team_members", ascending: true })
        .limit(40),
      supabase
        .from("tournament_schedule_matches")
        .select("id, tournament_id, day_number, day_label, time_label, court_label, pod_label, format, match_type, match_color, tier_rule, team_a_id, team_b_id, team_a_label, team_b_label, external_match_id, sort_order")
        .eq("tournament_id", tournamentData.id)
        .eq("is_published", true)
        .order("day_number", { ascending: true })
        .order("sort_order", { ascending: true })
        .limit(600),
      supabase
        .from("tournament_schedule_match_players")
        .select("id, schedule_match_id, team_id, player_id, side, slot, source_player_name")
        .eq("tournament_id", tournamentData.id)
        .limit(2400),
      supabase
        .from("tournament_match_scores")
        .select("id, schedule_match_id, side_a_set1, side_b_set1, side_a_set2, side_b_set2, side_a_set3, side_b_set3, winner_side, submitted_at")
        .eq("tournament_id", tournamentData.id)
        .limit(800)
    ]);

    const scheduleSchemaMissing = isScheduleSchemaMissing(matchesResult.error?.message || participantsResult.error?.message || "");
    const scoreSchemaMissing = isScoreSchemaMissing(scoresResult.error?.message || "");
    const loadError = teamsResult.error || (!scheduleSchemaMissing && (matchesResult.error || participantsResult.error)) || (!scoreSchemaMissing && scoresResult.error);
    if (loadError) {
      setMessage(getFriendlyError(loadError));
      setLoading(false);
      return;
    }

    const mappedTeams = mapPublishedTeamsFromRows(teamsResult.data || []);
    const playerTeam = mappedTeams.find((candidate) => candidate.members.some((member) => member.playerId === playerId)) || null;
    const mappedPlayer = playerTeam?.members.find((member) => member.playerId === playerId) || standalonePlayer;
    const mappedScores = scoreSchemaMissing ? [] : mapMatchScores(scoresResult.data || []);
    const mappedMatches = scheduleSchemaMissing ? [] : mapTeamCourtScheduleMatches(matchesResult.data || [], participantsResult.data || [], mappedTeams, mappedScores);
    const playerMatches = mappedMatches.filter((match) => [...match.playerProfilesA, ...match.playerProfilesB].some((profile) => profile.id === playerId));

    setPlayer(mappedPlayer);
    setTeam(playerTeam);
    setMatches(playerMatches);
    setMessage("");
    setLoading(false);
  }, [appSession.ready, playerId]);

  useEffect(() => {
    loadPlayerProfile();
  }, [loadPlayerProfile]);

  if (!appSession.ready) return null;

  const source = searchParams.get("from");
  const sourceTeamId = searchParams.get("team") || team?.id || "";
  const sourceMatchId = searchParams.get("match") || "";
  const sourcePlayerId = searchParams.get("player") || "";
  const backHref = source === "player-leaderboard"
    ? "/tournaments/leaderboard?view=player"
    : source === "registered-players"
      ? "/tournaments/players"
    : source === "directory"
      ? "/players"
    : source === "dashboard"
      ? "/dashboard"
    : source === "tournament"
      ? "/tournaments"
    : source === "fitness"
      ? "/fitness"
    : source === "player-profile" && sourcePlayerId
      ? `/tournaments/players/${sourcePlayerId}`
    : source === "bracket"
      ? `/tournaments/bracket?day=${searchParams.get("day") === "2" ? 2 : 1}`
    : source === "team-roster" && sourceTeamId
      ? `/tournaments/schedule/teams/${sourceTeamId}?from=roster`
      : source === "match" && sourceMatchId
        ? `/tournaments/schedule/matches/${sourceMatchId}`
        : source === "schedule"
          ? "/tournaments/schedule"
          : "/tournaments/players";
  const backLabel = source === "player-leaderboard" ? "Back to player leaderboard" : source === "registered-players" ? "Back to registered players" : source === "directory" ? "Back to player directory" : source === "dashboard" ? "Back to home" : source === "tournament" ? "Back to tournament" : source === "fitness" ? "Back to fitness" : source === "player-profile" ? "Back to player profile" : source === "bracket" ? "Back to live bracket" : source === "team-roster" ? "Back to team roster" : source === "match" ? "Back to match" : source === "schedule" ? "Back to schedule" : "Back to players";

  return (
    <AppFrame active="tournament" withNav={Boolean(appSession.userId)}>
      <div className={memberPageClass}>
        <AppTopBar publicNextPath={`/tournaments/players/${playerId}`} />
        <main className={memberMainClass}>
          {loading && <ScheduleLoadingNotice label="Loading player profile..." />}
          {message && !player && <StatusMessage tone="error">{message}</StatusMessage>}
          {player && <PlayerProfilePageCard backHref={backHref} backLabel={backLabel} matches={matches} player={player} team={team} />}
        </main>
      </div>
    </AppFrame>
  );
}

export function TournamentLeaderboardScreen() {
  const appSession = useAppSession();
  const searchParams = useSearchParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<PublishedTeam[]>([]);
  const [matches, setMatches] = useState<TeamCourtScheduleMatch[]>([]);
  const [activeView, setActiveView] = useState<"team" | "player">("team");
  const [rankingScope, setRankingScope] = useState<"day1" | "all">("day1");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadLeaderboard = useCallback(async () => {
    if (!appSession.ready) return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      setLoading(false);
      return;
    }

    const { data: tournamentData, error: tournamentError } = await supabase
      .from("tournaments")
      .select("id, name, season_year, status, venue_name, venue_address, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents, max_players, notes, faqs")
      .in("status", ["registration_open", "registration_closed", "live"])
      .order("starts_on", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (tournamentError || !tournamentData) {
      setTournament(null);
      setTeams([]);
      setMatches([]);
      setMessage(tournamentError ? getFriendlyError(tournamentError) : "No active tournament found.");
      setLoading(false);
      return;
    }

    const mappedTournament = mapTournament(tournamentData);
    const [teamsResult, matchesResult, participantsResult, scoresResult] = await Promise.all([
      supabase
        .from("tournament_teams")
        .select("id, name, sort_order, logo_url, jersey_color, sponsor_name, sponsor_logo_url, sponsors, tournament_team_members(id, is_captain, draft_order, tier_at_draft, players(id, full_name, jamaat_city, age, date_of_birth, rating, profile_photo_url))")
        .eq("tournament_id", mappedTournament.id)
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("draft_order", { referencedTable: "tournament_team_members", ascending: true })
        .limit(40),
      supabase
        .from("tournament_schedule_matches")
        .select("id, tournament_id, day_number, day_label, time_label, court_label, pod_label, format, match_type, match_color, tier_rule, team_a_id, team_b_id, team_a_label, team_b_label, external_match_id, sort_order")
        .eq("tournament_id", mappedTournament.id)
        .eq("is_published", true)
        .order("day_number", { ascending: true })
        .order("sort_order", { ascending: true })
        .limit(600),
      supabase
        .from("tournament_schedule_match_players")
        .select("id, schedule_match_id, team_id, player_id, side, slot, source_player_name")
        .eq("tournament_id", mappedTournament.id)
        .limit(2400),
      supabase
        .from("tournament_match_scores")
        .select("id, schedule_match_id, side_a_set1, side_b_set1, side_a_set2, side_b_set2, side_a_set3, side_b_set3, winner_side, submitted_at")
        .eq("tournament_id", mappedTournament.id)
        .limit(800)
    ]);

    const scheduleSchemaMissing = isScheduleSchemaMissing(matchesResult.error?.message || participantsResult.error?.message || "");
    const scoreSchemaMissing = isScoreSchemaMissing(scoresResult.error?.message || "");
    if (teamsResult.error || (!scheduleSchemaMissing && (matchesResult.error || participantsResult.error)) || (!scoreSchemaMissing && scoresResult.error)) {
      setMessage(getFriendlyError(teamsResult.error || matchesResult.error || participantsResult.error || scoresResult.error));
      setLoading(false);
      return;
    }

    const mappedTeams = mapPublishedTeamsFromRows(teamsResult.data || []);
    const mappedScores = scoreSchemaMissing ? [] : mapMatchScores(scoresResult.data || []);
    const mappedMatches = scheduleSchemaMissing ? [] : mapTeamCourtScheduleMatches(matchesResult.data || [], participantsResult.data || [], mappedTeams, mappedScores);
    setTournament(mappedTournament);
    setTeams(mappedTeams);
    setMatches(mappedMatches);
    setMessage(scoreSchemaMissing || scheduleSchemaMissing ? "Live standings will activate after the tournament score migrations are applied." : "");
    setLoading(false);
  }, [appSession.ready]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  useEffect(() => {
    const requestedView = searchParams.get("view");
    if (requestedView === "player" || requestedView === "player-leaderboard") setActiveView("player");
    if (requestedView === "team" || requestedView === "team-leaderboard") setActiveView("team");
    if (searchParams.get("scope") === "all") setRankingScope("all");
    if (searchParams.get("scope") === "day1") setRankingScope("day1");
  }, [searchParams]);

  useEffect(() => {
    if (!appSession.ready) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const channel = supabase
      .channel("live-tournament-leaderboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_match_scores" }, loadLeaderboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_schedule_matches" }, loadLeaderboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_schedule_match_players" }, loadLeaderboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_teams" }, loadLeaderboard)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [appSession.ready, loadLeaderboard]);

  if (!appSession.ready) return null;

  const scopedMatches = rankingScope === "day1" ? matches.filter((match) => match.dayNumber === 1) : matches;
  const standings = getLiveTeamStandings(teams, scopedMatches);
  const playerStandings = getLivePlayerStandings(teams, scopedMatches);
  const completedMatches = scopedMatches.filter((match) => Boolean(match.score?.winnerSide)).length;
  const standingsAreFinal = Boolean(scopedMatches.length && completedMatches === scopedMatches.length && !standings.some((standing) => standing.requiresReview));

  return (
    <AppFrame active="tournament" withNav={Boolean(appSession.userId)}>
      <div className={memberPageClass}>
        <AppTopBar publicNextPath="/tournaments/leaderboard" />
        <main className={memberMainClass}>
          <section className={`${tournamentLiveBannerClass} min-h-[150px] content-center p-4 pt-14 sm:min-h-[210px] sm:p-7 sm:pt-20`}>
            <TournamentHeroAmbience />
            <Link className="tap-card absolute left-3 top-3 z-20 inline-grid h-8 max-h-8 min-h-8 w-8 max-w-8 min-w-8 place-items-center rounded-full border-hairline border-white/25 bg-white/12 p-0 text-white shadow-[0_8px_18px_rgba(var(--brand-deep-rgb),0.10)] backdrop-blur transition-transform hover:-translate-x-0.5 active:scale-[0.98] sm:left-4 sm:top-4 sm:h-9 sm:max-h-9 sm:min-h-9 sm:w-9 sm:max-w-9 sm:min-w-9" href={appSession.userId ? "/tournaments" : "/"} aria-label={appSession.userId ? "Back to tournament" : "Back to MRSA home"}>
              <ArrowLeft size={15} />
            </Link>
            <span className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border-hairline border-white/20 bg-white/12 px-2 py-1 text-[8px] font-medium uppercase tracking-[0.08em] text-[var(--accent)] backdrop-blur sm:right-4 sm:top-4 sm:px-2.5 sm:py-1.5 sm:text-[10px]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
              Live results
            </span>
            <div className="relative z-10 mx-auto grid w-full justify-items-center gap-1.5 text-center sm:max-w-[720px] sm:gap-2">
              <h1 className="max-w-[330px] text-[28px] font-medium leading-[1.02] tracking-[-0.6px] text-white sm:max-w-none sm:text-[46px] sm:tracking-[-0.8px]">Leaderboard</h1>
              <p className="max-w-[620px] text-[13px] leading-relaxed text-white/72 sm:text-[15px]">Live team and player standings from this tournament’s submitted match results.</p>
            </div>
          </section>

          {message && <StatusMessage tone="warning">{message}</StatusMessage>}
          {loading && Array.from({ length: 3 }).map((_, index) => <SkeletonRow key={index} />)}

          {!loading && !teams.length && !message && <StatusMessage tone="info">Published teams will appear here once the rosters are ready.</StatusMessage>}

          {!loading && !!teams.length && (
            <>
              <section className="mx-auto grid w-full max-w-[720px] grid-cols-2 gap-1 rounded-[17px] border-hairline border-line bg-white p-1.5 shadow-[0_10px_26px_rgba(var(--brand-deep-rgb),0.05)]" aria-label="Leaderboard view">
                <button className={activeView === "team" ? "tap-card grid min-h-11 place-items-center rounded-[13px] bg-[var(--brand-deep)] px-2 text-center text-[11px] font-medium leading-tight text-white shadow-[0_8px_18px_rgba(var(--brand-deep-rgb), 0.14)] sm:text-[13px]" : "tap-card grid min-h-11 place-items-center rounded-[13px] bg-surface/45 px-2 text-center text-[11px] font-medium leading-tight text-text-secondary sm:text-[13px]"} type="button" onClick={() => setActiveView("team")} aria-pressed={activeView === "team"}>Team leaderboard</button>
                <button className={activeView === "player" ? "tap-card grid min-h-11 place-items-center rounded-[13px] bg-[var(--brand-deep)] px-2 text-center text-[11px] font-medium leading-tight text-white shadow-[0_8px_18px_rgba(var(--brand-deep-rgb), 0.14)] sm:text-[13px]" : "tap-card grid min-h-11 place-items-center rounded-[13px] bg-surface/45 px-2 text-center text-[11px] font-medium leading-tight text-text-secondary sm:text-[13px]"} type="button" onClick={() => setActiveView("player")} aria-pressed={activeView === "player"}>Player leaderboard</button>
              </section>
              <section className="mx-auto grid w-full max-w-[720px] grid-cols-2 gap-2 rounded-[17px] border-hairline border-line bg-white p-1.5 shadow-[0_10px_26px_rgba(var(--brand-deep-rgb),0.05)]" aria-label="Leaderboard result scope">
                <button className={rankingScope === "day1" ? "tap-card min-h-11 rounded-[13px] border border-brand-primary bg-brand-primary px-3 text-[11px] font-semibold text-white shadow-[0_8px_18px_rgba(var(--brand-deep-rgb),0.14)] sm:text-[13px]" : "tap-card min-h-11 rounded-[13px] border border-transparent bg-surface/45 px-3 text-[11px] font-medium text-text-secondary transition hover:border-brand/20 sm:text-[13px]"} type="button" onClick={() => setRankingScope("day1")} aria-pressed={rankingScope === "day1"}>Day 1 only</button>
                <button className={rankingScope === "all" ? "tap-card min-h-11 rounded-[13px] border border-brand-primary bg-brand-primary px-3 text-[11px] font-semibold text-white shadow-[0_8px_18px_rgba(var(--brand-deep-rgb),0.14)] sm:text-[13px]" : "tap-card min-h-11 rounded-[13px] border border-transparent bg-surface/45 px-3 text-[11px] font-medium text-text-secondary transition hover:border-brand/20 sm:text-[13px]"} type="button" onClick={() => setRankingScope("all")} aria-pressed={rankingScope === "all"}>All tournament</button>
              </section>
              {activeView === "team" && <LiveTeamLeaderboard completedMatches={completedMatches} matches={scopedMatches.length} seasonYear={tournament?.seasonYear} seedingIsFinal={standingsAreFinal} standings={standings} />}
              {activeView === "player" && <LivePlayerLeaderboard seasonYear={tournament?.seasonYear} standings={playerStandings} />}
            </>
          )}
        </main>
      </div>
    </AppFrame>
  );
}

export function TournamentBracketScreen() {
  return <TournamentLiveBracketScreen />;
}

export function TournamentTeamsScreen() {
  const appSession = useProtectedRoute("/tournaments/teams", true);
  const [teams, setTeams] = useState<PublishedTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadTeams = useCallback(async () => {
    if (!appSession.ready || !appSession.userId) return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      setLoading(false);
      return;
    }

    const { data: tournamentData, error } = await supabase
      .from("tournaments")
      .select("id, name, season_year, status, venue_name, venue_address, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents, max_players, notes, faqs")
      .in("status", ["registration_open", "registration_closed", "live"])
      .order("starts_on", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !tournamentData) {
      setMessage(error ? getFriendlyError(error) : "No active tournament found.");
      setTeams([]);
      setLoading(false);
      return;
    }

    const { data: teamsData, error: teamsError } = await supabase
      .from("tournament_teams")
      .select("id, name, sort_order, logo_url, jersey_color, sponsor_name, sponsor_logo_url, sponsors, tournament_team_members(id, is_captain, draft_order, tier_at_draft, players(id, full_name, jamaat_city, age, date_of_birth, rating, profile_photo_url))")
      .eq("tournament_id", tournamentData.id)
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("draft_order", { referencedTable: "tournament_team_members", ascending: true })
      .limit(40);

    if (teamsError) {
      setMessage(getFriendlyError(teamsError));
      setTeams([]);
      setLoading(false);
      return;
    }

    setTeams(mapPublishedTeamsFromRows(teamsData || []));
    setLoading(false);
  }, [appSession.ready, appSession.userId]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  if (!appSession.ready || !appSession.userId || !appSession.profileComplete) return null;

  return (
    <AppFrame active="tournament">
      <div className={memberPageClass}>
        <AppTopBar />
        <main className={memberMainClass}>
          <section className={`${memberHeroClass} min-h-[112px] content-center p-5`}>
            <TournamentHeroAmbience />
            <div className="pointer-events-none absolute inset-0 -right-16 -top-6 text-white opacity-[0.06]" aria-hidden="true">
              <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <Link className="absolute left-4 top-4 z-10 inline-grid h-8 max-h-8 min-h-8 w-8 min-w-8 max-w-8 place-items-center rounded-full border-hairline border-white/20 bg-white/12 p-0 text-white shadow-[0_8px_18px_rgba(var(--brand-deep-rgb),0.10)] backdrop-blur transition-transform active:scale-[0.98]" href="/tournaments" aria-label="Back to tournament">
              <ArrowLeft size={16} />
            </Link>
            <span className="relative z-10 grid justify-items-center px-10 text-center">
              <h1 className="text-[26px] font-medium leading-tight tracking-[-0.3px] text-white md:text-[34px]">Team rosters</h1>
            </span>
          </section>

          {message && <StatusMessage tone="error">{message}</StatusMessage>}
          {loading && Array.from({ length: 4 }).map((_, index) => <SkeletonRow key={index} />)}
          {!loading && !teams.length && !message && <StatusMessage tone="info">Team rosters will appear once they are published.</StatusMessage>}

          {!!teams.length && (
            <section className="grid gap-3 md:grid-cols-2" aria-label="Published team rosters">
              {teams.map((team) => {
                const teamTone = getTeamRosterCardTone(team.jerseyColor);
                const captain = team.members.find((member) => member.isCaptain);
                return (
                  <article className="tap-card group relative grid gap-3 overflow-hidden rounded-[18px] border-hairline p-3 shadow-[0_14px_34px_rgba(var(--brand-deep-rgb), 0.12)]" key={team.id} style={{ background: teamTone.background, borderColor: teamTone.borderColor, color: teamTone.textColor }}>
                    <Link className="absolute inset-0 z-0 rounded-[18px]" href={`/tournaments/schedule/teams/${team.id}?from=roster`} aria-label={`View ${team.name}`} />
                    <span className="pointer-events-none relative z-[1] grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3">
                      {team.logoUrl ? (
                        <img className="h-12 w-12 object-contain drop-shadow-[0_4px_10px_rgba(var(--brand-deep-rgb),0.16)]" src={team.logoUrl} alt={`${team.name} logo`} />
                      ) : (
                        <span className="grid h-12 w-12 place-items-center rounded-full bg-white/18 text-[13px] font-medium text-current shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]">{getInitials(team.name)}</span>
                      )}
                      <span className="grid min-w-0 gap-0.5">
                        <strong className="truncate text-[18px] font-medium text-current">{team.name}</strong>
                        <em className="truncate text-[12px] not-italic text-current opacity-80">{captain ? `Captain: ${captain.name}` : "Captain TBD"}</em>
                      </span>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-brand transition-transform group-hover:translate-x-0.5">
                        <ArrowRight size={15} />
                      </span>
                    </span>
                    <span className="pointer-events-none relative z-[1] grid gap-1.5 rounded-[14px] border-hairline border-white/35 bg-white/[0.86] p-2">
                      {team.members.map((member) => (
                        <span className="grid grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-2 text-text-primary" key={member.id}>
                          <Avatar className="relative grid h-[30px] w-[30px] place-items-center overflow-hidden rounded-full border-2 border-white bg-accent-tint text-[9px] font-medium text-[var(--accent-ink)] shadow-[0_4px_10px_rgba(var(--brand-deep-rgb), 0.10)]" name={member.name} photoUrl={member.profilePhotoUrl} ariaLabel={`${member.name} profile photo`} sizes="30px" />
                          <Link className="tap-card pointer-events-auto relative z-10 truncate text-[13px] font-medium underline decoration-current/20 underline-offset-2 transition hover:decoration-current" href={`/tournaments/players/${member.playerId}?from=team-roster&team=${team.id}`}>{member.name}</Link>
                          <em className="text-[11px] not-italic text-text-secondary">{member.rating}</em>
                        </span>
                      ))}
                    </span>
                    {!!team.sponsors.length && <TeamSponsorList sponsors={team.sponsors} tone="card" />}
                  </article>
                );
              })}
            </section>
          )}
        </main>
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
      .select("id, name, season_year, status, venue_name, venue_address, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents, max_players, notes, faqs")
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
      .select("player_id, players(id, full_name, jamaat_city, age, date_of_birth, rating, tennis_video_url)")
      .eq("tournament_id", mappedTournament.id)
      .neq("status", "cancelled")
      .in("payment_status", ["paid", "waived"])
      .order("registered_at");

    setRegisteredPlayers((registrations || []).map((row) => {
      const player = Array.isArray(row.players) ? row.players[0] : row.players;
      return {
        id: row.player_id,
        name: player?.full_name || "Player",
        age: formatRegisteredPlayerAge(player?.date_of_birth, player?.age),
        city: player?.jamaat_city || "MRSA",
        rating: formatRating(player?.rating),
        tennisVideoUrl: hasPlayerVideoLink(player?.tennis_video_url) ? player?.tennis_video_url || "" : ""
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
      <div className={memberPageClass}>
        <AppTopBar />

        <main className={memberMainClass}>
          <Link className="tap-card grid h-9 w-9 place-items-center rounded-full border-hairline border-line bg-white/80 text-brand shadow-[0_8px_22px_rgba(var(--brand-deep-rgb),0.06)] backdrop-blur" href="/tournaments" aria-label="Back to tournament">
            <ArrowLeft size={16} />
          </Link>
          <PageGreeting subtitle="Here's what's coming up" />
          <section className={memberHeroClass}>
            <div className="pointer-events-none absolute inset-0 -right-16 -top-6 text-white opacity-[0.06]" aria-hidden="true">
              <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="relative grid gap-3">
              <span className={memberHeroEyebrowClass}>Registered players</span>
              <h1 className={memberHeroTitleClass}>{tournament?.name || "Tournament"}</h1>
              <p className="text-xs text-white/72">{registeredPlayers.length} players registered</p>
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
                <article className="grid min-h-[56px] grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[12px] border-hairline border-line bg-card px-2.5 py-2.5" key={player.id}>
                  <span className={index % 5 === 0 ? "grid h-[34px] w-[34px] place-items-center rounded-full bg-[var(--avatar-peach)] text-[13px] font-medium text-[var(--avatar-peach-ink)]" : index % 5 === 1 ? "grid h-[34px] w-[34px] place-items-center rounded-full bg-[var(--brand-primary-tint)] text-[13px] font-medium text-[var(--brand-primary-text)]" : index % 5 === 2 ? "grid h-[34px] w-[34px] place-items-center rounded-full bg-[var(--brand-primary-tint)] text-[13px] font-medium text-[var(--accent-ink)]" : index % 5 === 3 ? "grid h-[34px] w-[34px] place-items-center rounded-full bg-[var(--avatar-pink)] text-[13px] font-medium text-[var(--avatar-pink-ink)]" : "grid h-[34px] w-[34px] place-items-center rounded-full bg-[var(--surface)] text-[13px] font-medium text-[var(--mist)]"}>{getInitials(player.name)}</span>
                  <div className="grid min-w-0 gap-1">
                    <Link className="tap-card truncate text-[15px] font-medium text-text-primary underline decoration-current/20 underline-offset-2 transition hover:decoration-current" href={`/tournaments/players/${player.id}?from=registered-players`}>{player.name}</Link>
                    {player.age && <em className="truncate text-[12px] not-italic text-text-secondary">{player.age}</em>}
                    <em className="truncate text-[13px] not-italic text-text-secondary">City: {player.city}</em>
                    {player.tennisVideoUrl && (
                      <a className="inline-flex w-max items-center gap-1.5 text-[12px] font-medium text-[var(--brand-primary-text)]" href={player.tennisVideoUrl} target="_blank" rel="noreferrer" title="View playing video" aria-label={`${player.name} playing video`}>
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--brand-primary-tint)]">
                          <ExternalLink size={12} strokeWidth={2.2} aria-hidden="true" />
                        </span>
                        View video
                      </a>
                    )}
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
      <div className={memberPageClass}>
        <AppTopBar />
        <main className={memberMainClass}>
          <Link className="tap-card grid h-9 w-9 place-items-center rounded-full border-hairline border-line bg-white/80 text-brand shadow-[0_8px_22px_rgba(var(--brand-deep-rgb),0.06)] backdrop-blur" href="/dashboard" aria-label="Back to dashboard">
            <ArrowLeft size={16} />
          </Link>
          <PageGreeting subtitle="The MRSA leaderboard" />
          <section className={memberHeroClass}>
            <div className="pointer-events-none absolute inset-0 -right-16 -top-6 text-white opacity-[0.06]" aria-hidden="true">
              <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="relative grid content-center gap-3">
              <span className={memberHeroEyebrowClass}>Players</span>
              <h1 className={memberHeroTitleClass}>All players</h1>
              <p className={memberHeroBodyClass}>Browse MRSA players by profile, rating, and Jamaat / city.</p>
            </div>
          </section>

          <section className="grid gap-3" aria-label="All players">
            <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <h2 className="text-[15px] font-medium text-text-primary">Player directory</h2>
              <span className="text-[13px] text-text-secondary">{players.length} players</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {players.map((player) => (
                <article className="grid min-h-[64px] grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[12px] border-hairline border-line bg-card p-2.5 shadow-[0_6px_18px_rgba(var(--brand-deep-rgb),0.035)]" key={player.id}>
                  <Avatar className="relative grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-accent-tint text-[12px] font-medium text-[var(--accent-ink)]" name={player.name} photoUrl={player.profilePhotoUrl} ariaLabel={`${player.name} profile photo`} />
                  <span className="grid min-w-0 gap-1">
                    <Link className="tap-card truncate text-[15px] font-medium text-text-primary underline decoration-current/20 underline-offset-2 transition hover:decoration-current" href={`/tournaments/players/${player.id}?from=directory`}>{player.name}</Link>
                    <em className="truncate text-[13px] not-italic text-text-secondary">{player.city}</em>
                  </span>
                  <strong className="rounded-full bg-brand-primary px-3 py-1 text-[13px] font-medium text-white">{player.rating}</strong>
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
      <div className={memberPageClass}>
        <header className="sticky top-0 z-30 border-b-hairline border-white/70 bg-white/75 px-4 py-2.5 shadow-[0_10px_30px_rgba(var(--brand-deep-rgb),0.04)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-shell items-center justify-between">
            <BrandMark />
            <Link className="grid h-9 w-9 place-items-center rounded-full border-hairline border-line bg-card text-brand" href={isAuthenticated ? "/dashboard" : "/"} aria-label={isAuthenticated ? "Back to dashboard" : "Back to sign in"}>
              <ArrowLeft size={16} />
            </Link>
          </div>
        </header>

        <main className={memberMainClass}>
          {isAuthenticated && <PageGreeting subtitle="Ready for the courts?" />}
          <section className={`${memberHeroClass} md:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] md:items-center md:gap-5`}>
            <div className="pointer-events-none absolute inset-0 -right-16 -top-6 text-white opacity-[0.06]" aria-hidden="true">
              <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="relative grid gap-3">
              <span className="inline-flex w-max items-center rounded-full bg-white/12 px-2.5 py-1 text-[12px] font-medium text-white/75">About MRSA</span>
              <h1 className={memberHeroTitleClass}>Mumineen Racquet Sports Association</h1>
              <p className={memberHeroBodyClass}>A North America-wide community bringing together women through a shared passion for racquet sports — tennis, TT, badminton, and pickleball.</p>
            </div>
            <div className="relative mt-3 grid gap-1.5 rounded-[14px] border-hairline border-white/10 bg-white/[0.08] p-3 md:mt-0">
              <span className={memberHeroEyebrowClass}>Events</span>
              <strong className="text-[18px] font-medium text-white">1</strong>
            </div>
          </section>
        </main>
      </div>
    </AppFrame>
  );
}

export function PlayerScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appSession = useProtectedRoute("/profile", true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFocusField, setEditFocusField] = useState<keyof ProfileData>("fullName");
  const [profile, setProfile] = useState(initialProfile);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [showPayments, setShowPayments] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [tournamentProfileSaved, setTournamentProfileSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const editableFieldRefs = useRef<Partial<Record<keyof ProfileData, HTMLElement>>>({});
  const tournamentProfileMode = searchParams.get("edit") === "tournamentProfile";
  const focusedTournamentId = searchParams.get("tournament") || "";
  const returnPath = normalizeNextPath(searchParams.get("next"));

  const signOut = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setSigningOut(true);
    await supabase.auth.signOut();
    router.replace("/");
  };

  const updateProfile = (field: keyof ProfileData, value: string) => {
    if (field === "jerseyName") setTournamentProfileSaved(false);
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
    if (appSession.player && !isEditing) {
      setProfile(mapProfile(appSession.player));
    }
  }, [appSession.player, isEditing]);

  useEffect(() => {
    if (!appSession.ready || !appSession.userId) return;

    const loadProfile = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data } = await supabase
        .from("players")
        .select("id, full_name, phone, age, date_of_birth, profile_photo_url, jamaat_city, self_assessment, dominant_hand, jersey_size, jersey_name, tennis_video_url, tennis_video_status, usta_number, usta_prompt_skipped_at, tier, rating, tournaments_played, matches_played")
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
      return false;
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
        jersey_name: profile.jerseyName.trim() || null,
        tennis_video_url: profile.tennisVideo,
        tennis_video_status: hasPlayerVideoLink(profile.tennisVideo) ? "pending" : null,
        usta_number: profile.ustaNumber.trim() || null,
        tennis_video_reviewed_at: null,
        tennis_video_reviewed_by: null,
        tennis_video_rejection_note: null
      })
      .eq("id", profile.id);

    if (error) {
      setSaving(false);
      setMessage(getFriendlyError(error));
      return false;
    }

    if (profile.jerseyName.trim() || focusedTournamentId) {
      const { data: session } = await supabase.auth.getSession();
      const syncResponse = await fetch("/api/profile/tournament-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.session?.access_token || ""}`
        },
        body: JSON.stringify({
          jerseyName: profile.jerseyName,
          tournamentId: focusedTournamentId || undefined
        })
      });
      const syncResult = await syncResponse.json().catch(() => ({}));
      if (!syncResponse.ok) {
        setSaving(false);
        setMessage(syncResult.error || "Profile saved, but the tournament shirt name could not sync.");
        return false;
      }
    }

    setIsEditing(false);
    await appSession.refresh();
    setSaving(false);
    setMessage("Profile saved.");
    return true;
  };

  const updateProfilePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const supabase = getSupabaseClient();
    if (!file || !supabase || !profile.id) return;

    const user = appSession.user;
    if (!user) return;

    setUploadingPhoto(true);
    setMessage("Compressing and uploading photo...");
    const photoUrl = await uploadCompressedProfilePhoto(user.id, file);
    if (!photoUrl) {
      setUploadingPhoto(false);
      setMessage("Could not upload photo.");
      return;
    }

    const { error } = await supabase.from("players").update({ profile_photo_url: photoUrl }).eq("id", profile.id);
    setUploadingPhoto(false);
    if (error) {
      setMessage(getFriendlyError(error));
      return;
    }

    setProfile((current) => ({ ...current, profilePhotoUrl: photoUrl }));
    setTournamentProfileSaved(false);
    await appSession.refresh();
    setMessage("Photo updated.");
  };

  const removeProfilePhoto = async () => {
    const supabase = getSupabaseClient();
    if (!supabase || !profile.id || removingPhoto) return;

    setRemovingPhoto(true);
    setMessage("");
    const { error } = await supabase.from("players").update({ profile_photo_url: null }).eq("id", profile.id);
    setRemovingPhoto(false);

    if (error) {
      setMessage(getFriendlyError(error));
      return;
    }

    setProfile((current) => ({ ...current, profilePhotoUrl: "" }));
    setTournamentProfileSaved(false);
    await appSession.refresh();
    setMessage("Photo removed.");
  };

  const saveTournamentProfile = async () => {
    if (!profile.profilePhotoUrl || !profile.jerseyName.trim() || !profile.jerseySize.trim()) {
      setTournamentProfileSaved(false);
      setMessage("Add your profile photo, jersey name, and jersey size before saving your tournament profile.");
      return;
    }
    const saved = await saveProfile();
    if (saved) setTournamentProfileSaved(true);
  };

  const tournamentProfileComplete = Boolean(profile.profilePhotoUrl && profile.jerseyName.trim() && profile.jerseySize.trim());
  const showTournamentProfileComplete = tournamentProfileMode && tournamentProfileComplete && tournamentProfileSaved;

  return (
    <AppFrame active="profile">
      <div className={memberPageClass}>
        <AppTopBar avatarName={profile.fullName} avatarPhotoUrl={profile.profilePhotoUrl} />

        <main className={memberMainClass}>
          <PageGreeting subtitle="Manage your player profile" />
          <section className={`${memberHeroClass} min-h-[150px] grid-cols-[minmax(0,1fr)_auto] items-start gap-3 pb-12 md:gap-5 md:pb-12`}>
          <div className="pointer-events-none absolute inset-0 -right-16 -top-6 text-white opacity-[0.06]" aria-hidden="true">
            <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
              <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
          <div className="relative grid gap-3">
            <span className={memberHeroEyebrowClass}>Player profile</span>
            <h1 className="max-w-[620px] text-[22px] font-medium leading-tight tracking-[-0.2px] text-white md:text-[26px]">{profile.fullName}</h1>
          </div>
          <div className="relative justify-self-end">
            <Avatar className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-full border-hairline border-white/35 bg-white/16 text-lg font-medium text-white shadow-[0_12px_28px_rgba(var(--brand-deep-rgb),0.14)] backdrop-blur md:h-20 md:w-20" name={profile.fullName} photoUrl={profile.profilePhotoUrl} ariaLabel={`${profile.fullName} profile photo`} />
            {!tournamentProfileMode && (
              <label className="absolute bottom-1 right-1 grid h-6 w-6 cursor-pointer place-items-center rounded-full border-hairline border-white/80 bg-white text-brand shadow-[0_8px_18px_rgba(var(--brand-deep-rgb),0.16)] transition active:scale-95" aria-label="Change profile photo" title="Change profile photo">
                <Pencil size={11} />
                <input className="sr-only" type="file" accept="image/*" onChange={updateProfilePhoto} />
              </label>
            )}
            {!tournamentProfileMode && profile.profilePhotoUrl && (
              <button className="absolute bottom-1 left-1 grid h-6 w-6 place-items-center rounded-full border-hairline border-white/80 bg-[var(--error-surface)] text-[var(--error)] shadow-[0_8px_18px_rgba(var(--brand-deep-rgb),0.16)] transition active:scale-95 disabled:opacity-60" type="button" onClick={removeProfilePhoto} disabled={removingPhoto} aria-label="Remove profile photo" title="Remove profile photo">
                <Trash2 size={11} />
              </button>
            )}
          </div>
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 md:bottom-5 md:left-5">
            <span className="rounded-full bg-white/12 px-3 py-1 text-[13px] text-white/85">Rating {profile.rating}</span>
            <span className="rounded-full bg-white/12 px-3 py-1 text-[13px] text-white/85">{profile.jamaatCity}</span>
          </div>
        </section>

        <section className="grid gap-4">
          {tournamentProfileMode && !showTournamentProfileComplete && (
            <section className="grid gap-3 rounded-[18px] border-hairline border-[var(--warning-line)] bg-[var(--warning-tint)] p-4">
              <span className="grid gap-1">
                <strong className="text-[16px] font-medium text-[var(--warning-ink)]">Finish your tournament profile</strong>
                <em className="text-[13px] not-italic leading-relaxed text-[var(--warning-ink)]/85">Add your profile photo, jersey name, and jersey size so your team card, shirt name, and roster details are ready before the tournament.</em>
              </span>
              <div className="grid gap-3 rounded-[14px] border-hairline border-[var(--warning-line)] bg-white p-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
                <Avatar className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-accent-tint text-[17px] font-medium text-[var(--accent-ink)]" name={profile.fullName} photoUrl={profile.profilePhotoUrl} ariaLabel={`${profile.fullName} profile photo`} />
                <span className="grid gap-2">
                  <strong className="text-[14px] font-medium text-text-primary">{profile.profilePhotoUrl ? "Profile photo added" : "Profile photo missing"}</strong>
                  <span className="flex flex-wrap gap-2">
                    <label className="tap-card inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-brand-primary px-3 text-[13px] font-medium text-white transition hover:bg-brand-mid">
                      <Pencil size={13} />
                      {uploadingPhoto ? "Uploading..." : profile.profilePhotoUrl ? "Replace photo" : "Upload photo"}
                      <input className="sr-only" type="file" accept="image/*" onChange={updateProfilePhoto} disabled={uploadingPhoto} />
                    </label>
                    {profile.profilePhotoUrl && (
                      <button className="tap-card inline-flex min-h-9 items-center justify-center gap-2 rounded-[12px] border-hairline border-[var(--error-line)] bg-[var(--error-surface)] px-3 text-[13px] font-medium text-[var(--error)] disabled:opacity-60" type="button" onClick={removeProfilePhoto} disabled={removingPhoto}>
                        <Trash2 size={13} />
                        {removingPhoto ? "Removing..." : "Remove"}
                      </button>
                    )}
                  </span>
                </span>
              </div>
              <label className="grid gap-2 text-[13px] text-[var(--warning-ink)]">
                Jersey name
                <input
                  className="min-h-10 rounded-[12px] border-hairline border-[var(--warning-line)] bg-white px-3 text-[15px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light"
                  value={profile.jerseyName}
                  onChange={(event) => updateProfile("jerseyName", event.target.value)}
                  placeholder="Name for shirt roster"
                />
              </label>
              <label className="grid gap-2 text-[13px] text-[var(--warning-ink)]">
                Jersey size
                <select
                  className="min-h-10 rounded-[12px] border-hairline border-[var(--warning-line)] bg-white px-3 text-[15px] text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-light"
                  value={profile.jerseySize}
                  onChange={(event) => updateProfile("jerseySize", event.target.value)}
                >
                  {["XS", "S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
                    <option value={size} key={size}>{size}</option>
                  ))}
                </select>
              </label>
              <div className="grid gap-2 sm:grid-cols-[auto_auto]">
                <button className="tap-card inline-flex min-h-10 items-center justify-center rounded-[12px] bg-brand-primary px-4 text-[13px] font-medium text-white transition hover:bg-brand-mid disabled:opacity-60" type="button" onClick={saveTournamentProfile} disabled={saving || uploadingPhoto || removingPhoto}>
                  {saving ? "Saving..." : "Save tournament profile"}
                </button>
                <Link className="tap-card inline-flex min-h-10 items-center justify-center rounded-[12px] border-hairline border-[var(--warning-line)] bg-white px-4 text-[13px] font-medium text-[var(--warning-ink)]" href={returnPath}>
                  Back to tournament
                </Link>
              </div>
            </section>
          )}
          {showTournamentProfileComplete && (
            <section className="grid gap-3 rounded-[18px] border-hairline border-[var(--accent-line)] bg-brand-light p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <span className="grid gap-1">
                <strong className="text-[16px] font-medium text-[var(--accent-ink)]">Tournament profile complete</strong>
                <em className="text-[13px] not-italic leading-relaxed text-[var(--accent-ink)]">Your profile photo, jersey name, and jersey size are saved for tournament roster details.</em>
              </span>
              <Link className="tap-card inline-flex min-h-10 items-center justify-center rounded-[12px] bg-brand-primary px-4 text-[13px] font-medium text-white transition hover:bg-brand-mid" href={returnPath}>
                Back to tournament
              </Link>
            </section>
          )}

	          <div className="flex flex-wrap gap-2" aria-label="Profile summary">
	            <span className="rounded-full bg-accent-tint px-3 py-1 text-[13px] text-[var(--accent-ink)]">{profile.selfEvaluation}</span>
	            <span className="rounded-full bg-[var(--brand-primary-tint)] px-3 py-1 text-[13px] text-[var(--brand-primary-text)]">{profile.jamaatCity}</span>
	            <span className="rounded-full bg-[var(--avatar-peach)] px-3 py-1 text-[13px] text-[var(--avatar-peach-ink)]">{profile.dominantHand} hand</span>
	          </div>

          <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 pt-2">
            <h2 className="text-[15px] font-medium text-text-primary">Profile details</h2>
            {isEditing ? (
              <span className="inline-flex min-h-9 items-center gap-2 justify-self-end whitespace-nowrap rounded-full bg-accent-tint px-3 text-[14px] font-medium text-[var(--accent-ink)]">
                <Pencil size={14} />
                Editing now
              </span>
            ) : (
              <button className="tap-card inline-flex min-h-9 items-center gap-2 justify-self-end whitespace-nowrap rounded-full bg-brand-primary px-3 text-[14px] font-medium text-white transition hover:bg-brand-mid" type="button" onClick={() => startProfileEdit("fullName")}>
                <Pencil size={14} />
                Edit profile
              </button>
            )}
          </div>

	          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Player performance stats">
	            <article className="grid gap-1.5 rounded-[12px] border-hairline border-line bg-card p-3"><span className="text-[12px] text-text-secondary">Rating</span><strong className="text-[17px] font-medium text-text-primary">{profile.rating}</strong></article>
	            <article className="grid gap-1.5 rounded-[12px] border-hairline border-line bg-card p-3"><span className="text-[12px] text-text-secondary">Tournaments</span><strong className="text-[17px] font-medium text-text-primary">{profile.tournamentsPlayed}</strong></article>
	            <article className="grid gap-1.5 rounded-[12px] border-hairline border-line bg-card p-3"><span className="text-[12px] text-text-secondary">Matches</span><strong className="text-[17px] font-medium text-text-primary">{profile.matchesPlayed}</strong></article>
	            <button className="grid gap-1.5 rounded-[12px] border-hairline border-white/20 bg-brand-deep p-3 text-left text-white transition active:scale-[0.99]" type="button" onClick={() => setShowPayments(true)} aria-haspopup="dialog">
	              <span className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-[13px] text-white/72">
	                Payments
	                <ArrowRight size={15} className="text-white" />
	              </span>
	              <strong className="text-[17px] font-medium text-white">{paymentHistory.length}</strong>
	            </button>
	          </div>

	          <div className={isEditing ? "grid gap-3 rounded-[20px] border-hairline border-[var(--accent-line)] bg-white p-3 ring-2 ring-brand-light md:p-4" : "grid gap-3"}>
            {isEditing && (
              <div className="grid gap-1 rounded-[16px] border-hairline border-[var(--accent-line)] bg-white p-4">
                <span className="inline-flex w-max items-center gap-2 rounded-full bg-accent-tint px-3 py-1 text-[13px] font-medium text-[var(--accent-ink)]">
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
              <article className={isEditing ? "grid gap-2 rounded-[14px] border-hairline border-[var(--accent-line)] bg-white p-4 shadow-[0_8px_20px_rgba(var(--brand-deep-rgb), 0.04)]" : "grid gap-2 rounded-[14px] border-hairline border-line bg-card p-4"}>
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
              <article className={isEditing ? "grid gap-2 rounded-[14px] border-hairline border-[var(--accent-line)] bg-white p-4" : "grid gap-2 rounded-[14px] border-hairline border-line bg-card p-4"}>
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
              {!tournamentProfileMode && (
                <ProfileField
                  label="Jersey Name"
                  value={profile.jerseyName}
                  displayValue={profile.jerseyName || "Not set"}
                  editing={isEditing}
                  onEdit={() => startProfileEdit("jerseyName")}
                  onChange={(value) => updateProfile("jerseyName", value)}
                  inputRef={(node) => { if (node) editableFieldRefs.current.jerseyName = node; }}
                  helper={<span>This is the name organizers use for shirt orders and tournament roster exports.</span>}
                />
              )}
              <ProfileField
                label="Tennis video Google Drive link recommended"
                value={profile.tennisVideo}
                editing={isEditing}
                onEdit={() => startProfileEdit("tennisVideo")}
                onChange={(value) => updateProfile("tennisVideo", value)}
                inputRef={(node) => { if (node) editableFieldRefs.current.tennisVideo = node; }}
                helper={<span>{videoDescription} Captains and organizers use this for tournament drafts.</span>}
              />
              <ProfileField
                label="USTA number"
                value={profile.ustaNumber}
                displayValue={profile.ustaNumber || "Not set"}
                editing={isEditing}
                onEdit={() => startProfileEdit("ustaNumber")}
                onChange={(value) => updateProfile("ustaNumber", value)}
                inputRef={(node) => { if (node) editableFieldRefs.current.ustaNumber = node; }}
                helper={<span>Optional. Add this so MRSA can connect eligible tournament scores to your USTA / WTN profile.</span>}
              />
            </div>

            {isEditing && (
              <div className="grid gap-2 sm:grid-cols-[auto_auto]">
                <button className="tap-card inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-brand-primary px-4 text-sm font-medium text-white transition hover:bg-brand-mid disabled:opacity-60" type="button" onClick={saveProfile} disabled={saving}>
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
          {message && !tournamentProfileSaved && <StatusMessage tone={message === "Profile saved." || message === "Photo updated." || message === "Photo removed." ? "success" : message.includes("upload") || message.includes("Compressing") ? "info" : "error"}>{message}</StatusMessage>}
          {tournamentProfileMode && message === "Profile saved." && (
            <Link className="tap-card inline-flex min-h-11 items-center justify-center rounded-[14px] bg-brand-primary px-4 text-sm font-medium text-white transition hover:bg-brand-mid" href={returnPath}>
              Back to tournament
            </Link>
          )}

          <div className="grid pt-6">
            <button
              className="tap-card inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] border-hairline border-[var(--error-line)] bg-[var(--error-surface)] px-4 text-sm font-medium text-[var(--error)] disabled:opacity-60"
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
	          <div className="fixed inset-0 z-50 grid place-items-end bg-[rgba(var(--brand-deep-rgb),0.35)] px-3 pb-6 pt-16 sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="profile-payments-title">
	            <section className="relative grid max-h-[78dvh] w-full max-w-[560px] grid-rows-[auto_minmax(0,1fr)] gap-4 rounded-[24px] border-hairline border-line bg-white p-5 shadow-[0_24px_80px_rgba(var(--brand-deep-rgb),0.22)]">
              <button className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border-hairline border-line bg-white text-text-secondary shadow-[0_8px_18px_rgba(var(--brand-deep-rgb),0.08)] transition active:scale-95" type="button" onClick={() => setShowPayments(false)} aria-label="Close payments">
                <X size={16} />
              </button>
              <div className="grid gap-1 pr-10">
                <span className="inline-flex w-max items-center gap-1.5 rounded-full bg-accent-tint px-3 py-1 text-[13px] font-medium text-[var(--accent-ink)]">
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
                    <b className={payment.status === "failed" ? "rounded-full bg-[var(--error-tint)] px-2.5 py-1 text-[12px] font-medium text-[var(--error)]" : payment.status === "pending" ? "rounded-full bg-[var(--warning-tint)] px-2.5 py-1 text-[12px] font-medium text-[var(--warning)]" : "rounded-full bg-accent-tint px-2.5 py-1 text-[12px] font-medium text-[var(--accent-ink)]"}>{formatPaymentStatus(payment.status)}</b>
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
    dominantHand: row.dominant_hand || "",
    selfEvaluation: normalizeSkillLevel(row.self_assessment) || "",
    jamaatCity: row.jamaat_city || "",
    tier: String(row.tier || 1),
    rating: formatRating(row.rating),
    tournamentsPlayed: String(row.tournaments_played || 0),
    matchesPlayed: String(row.matches_played || 0),
    jerseySize: row.jersey_size || "",
    jerseyName: row.jersey_name || "",
    tennisVideo: hasPlayerVideoLink(row.tennis_video_url) ? row.tennis_video_url || "" : "",
    ustaNumber: row.usta_number || ""
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
    maxPlayers: row.max_players,
    notes: row.notes ?? null,
    faqs: normalizeTournamentFaqs(row.faqs)
  };
}

function normalizeTournamentFaqs(value: unknown): TournamentFaq[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as { question?: unknown; answer?: unknown };
    const question = typeof record.question === "string" ? record.question.trim() : "";
    const answer = typeof record.answer === "string" ? record.answer.trim() : "";
    return question && answer ? [{ question, answer }] : [];
  });
}

function getTournamentLifecycleStatus(row: Pick<DbTournamentRow, "status" | "starts_on" | "ends_on" | "registration_closes_at">) {
  if (row.status === "cancelled") return "cancelled";
  if (row.status === "registration_closed") return "registration_closed";
  if (row.status === "registration_open") return "registration_open";
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

function formatRegisteredPlayerRating(value: unknown) {
  if (value === null || value === undefined || value === "") return "Pending";
  const rating = Number(value);
  if (!Number.isFinite(rating)) return String(value);
  return (Math.trunc(rating * 1000) / 1000).toFixed(3);
}

function formatRegisteredPlayerAge(dateOfBirth?: string | null, fallbackAge?: number | null) {
  const age = calculateAge(dateOfBirth) || (fallbackAge ? String(fallbackAge) : "");
  return age ? `Age ${age}` : "";
}

function formatPlayerCount(count: number) {
  return `${count} ${count === 1 ? "player" : "players"}`;
}

function getSourceTeamColor(value: unknown) {
  const text = typeof value === "string" ? value.trim() : "";
  return /^#[0-9a-f]{6}$/i.test(text) ? text.toLowerCase() : DEFAULT_TEAM_COLOR;
}

function getHexLuminance(value: string) {
  const hex = getSourceTeamColor(value).slice(1);
  const [red, green, blue] = [0, 2, 4].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
  const channels = [red, green, blue].map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function getLuminanceContrast(left: number, right: number) {
  return (Math.max(left, right) + 0.05) / (Math.min(left, right) + 0.05);
}

function getTeamBrandTone(color: string) {
  const background = getSourceTeamColor(color);
  const backgroundLuminance = getHexLuminance(background);
  const whiteContrast = getLuminanceContrast(backgroundLuminance, 1);
  const inkContrast = getLuminanceContrast(backgroundLuminance, getHexLuminance(MRSA_COLORS.ink));
  return {
    background,
    borderColor: backgroundLuminance > 0.9 ? MRSA_COLORS.green300 : background,
    textColor: whiteContrast >= inkContrast ? MRSA_COLORS.card : MRSA_COLORS.ink
  };
}

function getTeamRosterCardTone(color: string) {
  const teamTone = getTeamBrandTone(color);
  if (getHexLuminance(color) < 0.88) return teamTone;
  return {
    background: "linear-gradient(145deg, var(--card) 0%, var(--surface) 100%)",
    borderColor: "var(--hairline-strong)",
    textColor: "var(--ink)"
  };
}

function getTeamJerseyPresentation(color: string) {
  const jerseyColor = getSourceTeamColor(color);
  const isWhiteJersey = getHexLuminance(jerseyColor) >= 0.88;
  return {
    badgeBackground: isWhiteJersey ? "linear-gradient(145deg, var(--card) 0%, var(--surface) 100%)" : "var(--card)",
    badgeBorderColor: isWhiteJersey ? "var(--hairline-strong)" : jerseyColor,
    fillColor: jerseyColor,
    strokeColor: isWhiteJersey ? "var(--brand-deep)" : jerseyColor,
    isWhiteJersey
  };
}

function normalizeTeamColor(value: unknown) {
  return getHexLuminance(getSourceTeamColor(value)) >= 0.45 ? MRSA_COLORS.green300 : MRSA_COLORS.green500;
}

type TeamToneVariant = "outline" | "solid";

function getMatchTeamToneVariant(teamName: string, fallback: TeamToneVariant): TeamToneVariant {
  if (/federer/i.test(teamName)) return "outline";
  if (/alcaraz/i.test(teamName)) return "solid";
  return fallback;
}

function getTeamCardTone(color: string, variant?: TeamToneVariant) {
  const isOutlined = variant ? variant === "outline" : getHexLuminance(color) >= 0.45;
  return isOutlined
    ? { background: "var(--card)", textColor: "var(--ink)", borderColor: "var(--border)", isOutlined }
    : { background: "var(--brand-primary)", textColor: "var(--card)", borderColor: "var(--brand-primary)", isOutlined };
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

function useTournamentCountdown(startsOn: string | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [startsOn]);

  return getTournamentCountdown(startsOn, now);
}

function getTournamentCountdown(startsOn: string | null, nowMs: number): TournamentCountdown {
  if (!startsOn) {
    return createCountdownLabel("date_tbd", "Date TBD");
  }

  const start = new Date(`${startsOn}T00:00:00`);
  if (Number.isNaN(start.getTime())) {
    return createCountdownLabel("date_tbd", "Date TBD");
  }

  const now = new Date(nowMs);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  if (start.getTime() === today.getTime()) {
    return createCountdownLabel("today", "Starts today");
  }

  if (start.getTime() < today.getTime()) {
    return createCountdownLabel("started", "Tournament started");
  }

  const totalSeconds = Math.max(0, Math.floor((start.getTime() - nowMs) / 1000));
  if (totalSeconds === 0) {
    return createCountdownLabel("today", "Starts today");
  }

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    state: "countdown",
    days,
    hours,
    minutes,
    seconds,
    label: ""
  };
}

function createCountdownLabel(state: TournamentCountdown["state"], label: string): TournamentCountdown {
  return {
    state,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    label
  };
}

function formatCountdownValue(value: number) {
  return value < 10 ? `0${value}` : String(value);
}

function useHomeMatchTiming(match: PlayerScheduleMatch, tournament: Tournament) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    const interval = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(interval);
  }, [match.id, match.timeLabel, match.dayNumber]);

  if (!tournament.startsOn) return { dayLabel: match.dayLabel || `Day ${match.dayNumber}`, countdownLabel: "Scheduled" };
  const matchDate = new Date(`${tournament.startsOn}T12:00:00Z`);
  matchDate.setUTCDate(matchDate.getUTCDate() + Math.max(0, match.dayNumber - 1));
  const matchDateKey = matchDate.toISOString().slice(0, 10);
  const chicagoParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(new Date(now));
  const part = (type: Intl.DateTimeFormatPartTypes) => chicagoParts.find((item) => item.type === type)?.value || "0";
  const todayKey = `${part("year")}-${part("month")}-${part("day")}`;
  const dayDifference = Math.round((Date.parse(`${matchDateKey}T00:00:00Z`) - Date.parse(`${todayKey}T00:00:00Z`)) / 86400000);
  const matchMinutes = getScheduleTimeSortValue(match.timeLabel);
  const currentMinutes = Number(part("hour")) * 60 + Number(part("minute"));
  const minutesUntil = Number.isFinite(matchMinutes) && matchMinutes < 1440 ? dayDifference * 1440 + matchMinutes - currentMinutes : null;
  const dayLabel = dayDifference === 0 ? "Today" : dayDifference === 1 ? "Tomorrow" : formatHomeMatchDate(tournament, match.dayNumber, match.dayLabel);

  if (minutesUntil == null) return { dayLabel, countdownLabel: "Scheduled" };
  if (minutesUntil <= 0) return { dayLabel, countdownLabel: minutesUntil > -90 ? "In progress" : "Scheduled" };
  if (minutesUntil < 60) return { dayLabel, countdownLabel: `starts in ${minutesUntil}m` };
  if (minutesUntil < 1440) return { dayLabel, countdownLabel: `starts in ${Math.floor(minutesUntil / 60)}h ${minutesUntil % 60}m` };
  return { dayLabel, countdownLabel: `starts in ${Math.floor(minutesUntil / 1440)}d ${Math.floor((minutesUntil % 1440) / 60)}h` };
}

function HomePrimaryMatchCard({ match, tournament }: { match: PlayerScheduleMatch; tournament: Tournament }) {
  const opponentNames = match.opponentNames.length ? match.opponentNames : [match.opposingTeamName];
  const partnerProfiles = match.playerSideProfiles.filter((profile) => match.partnerNames.some((name) => normalizeName(name) === normalizeName(profile.name)));
  const matchDate = formatHomeMatchDate(tournament, match.dayNumber, match.dayLabel);
  const timing = useHomeMatchTiming(match, tournament);

  return (
    <article
      className="home-dashboard-match-card tap-card group relative grid overflow-hidden rounded-[28px] border border-white/10 bg-[var(--brand-deep)] p-[18px] text-white shadow-[0_18px_42px_rgba(var(--brand-deep-rgb),0.12)] transition hover:-translate-y-0.5 sm:p-6 lg:min-h-[286px] lg:p-6"
      style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
        backgroundSize: "42px 42px"
      }}
    >
      <Link className="absolute inset-0 z-0" href={`/tournaments/schedule/matches/${match.id}?from=dashboard`} aria-label={`View match against ${opponentNames.join(" and ")}`} />
      <div className="home-dashboard-match-body pointer-events-none relative z-10 grid h-full min-w-0 content-between gap-5">
        <div className="grid min-w-0 gap-4">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-white/10 px-4 text-[13px] font-bold text-[var(--blue-50)] backdrop-blur sm:text-[14px]">
              <span className="h-2 w-2 rounded-full bg-brand-primary" aria-hidden="true" />
              {timing.dayLabel}
            </span>
            <span className="ml-auto inline-flex min-w-0 items-center gap-2">
              <MatchIdPill inverse match={match} />
              <span className="text-right text-[12px] font-semibold text-white/72 sm:text-[14px]">{timing.countdownLabel}</span>
            </span>
          </div>

          <div className="grid min-w-0 gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <strong className="text-[clamp(30px,7vw,42px)] font-extrabold leading-none tracking-[-1.5px] tabular-nums text-white lg:text-[36px]">{match.timeLabel || "Time TBD"}</strong>
              <em className="text-[12px] font-medium not-italic text-white/72 sm:text-[15px]">{matchDate}</em>
              <span className="ml-auto rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-bold text-white/95 backdrop-blur sm:text-[14px]">{match.format}</span>
            </div>

            <div className="grid min-w-0 gap-1 text-[14px] leading-snug sm:text-[16px] lg:text-[15px]">
              {match.format === "Doubles" && match.partnerNames.length > 0 && (
                <p className="min-w-0 text-white/72">With {match.partnerNames.map((name, index) => {
                  const profile = partnerProfiles.find((candidate) => normalizeName(candidate.name) === normalizeName(name));
                  return <Fragment key={`${name}:${index}`}>{index > 0 && " & "}{profile ? <Link className="tap-card pointer-events-auto relative z-20 font-medium text-white underline decoration-white/35 underline-offset-2 hover:decoration-white" href={`/tournaments/players/${profile.id}?from=dashboard`}>{name}</Link> : <span className="font-medium text-white">{name}</span>}</Fragment>;
                })} <span aria-hidden="true">·</span> {match.teamName}</p>
              )}
              {match.format === "Singles" && <p className="text-white/72">Playing for <span className="font-medium text-white">{match.teamName}</span></p>}
              <p className="min-w-0 text-white/72">vs {opponentNames.map((name, index) => (
                <Fragment key={`${name}-${index}`}>{index > 0 && " & "}{match.opponentProfiles[index]?.id ? <Link className="tap-card pointer-events-auto relative z-20 font-semibold text-white underline decoration-white/35 underline-offset-2 hover:decoration-white" href={`/tournaments/players/${match.opponentProfiles[index].id}?from=dashboard`}>{name}</Link> : <strong className="font-semibold text-white">{name}</strong>}</Fragment>
              ))}</p>
            </div>
          </div>

          <div className="home-dashboard-court-row flex min-w-0 flex-wrap items-center gap-2">
            <span className="inline-flex min-h-10 min-w-0 items-center gap-2 rounded-full bg-white/10 px-4 text-[13px] font-bold text-white backdrop-blur sm:text-[15px] lg:text-[14px]">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--blue-300)]" aria-hidden="true" />
              <span className="truncate">{match.courtLabel || "Court TBD"}</span>
            </span>
            {match.dayNumber === 2 && (
              <span className="inline-flex min-h-10 min-w-0 items-center gap-2 rounded-full bg-white/10 px-4 text-[13px] font-bold text-white backdrop-blur sm:text-[15px] lg:text-[14px]">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--blue-300)]" aria-hidden="true" />
                <span className="truncate">Balls: {match.ballTeamName || "TBD"}</span>
              </span>
            )}
          </div>
        </div>

        <span className="home-dashboard-match-cta pointer-events-none inline-flex min-h-[56px] w-full items-center justify-center rounded-full bg-brand-primary px-5 text-[17px] font-extrabold text-white transition group-hover:bg-brand-mid sm:min-h-[64px] sm:text-[19px] lg:min-h-[58px] lg:text-[17px]">
          Get match details
        </span>
      </div>
    </article>
  );
}

function HomeTournamentOverviewSkeleton() {
  return (
    <section className="mx-auto grid min-h-[218px] w-full max-w-[600px] animate-pulse gap-2.5 rounded-[22px] border-hairline border-white/80 bg-white/70 p-3.5 shadow-[0_14px_36px_rgba(var(--brand-deep-rgb),0.05)] backdrop-blur-xl sm:min-h-[238px] sm:p-4 lg:max-w-none" role="status" aria-label="Loading your tournament registration">
      <span className="flex items-start justify-between gap-4">
        <span className="grid w-full max-w-[330px] gap-2">
          <span className="h-5 w-4/5 rounded-full bg-[var(--hairline-strong)]" />
          <span className="h-3 w-2/5 rounded-full bg-[var(--surface)]" />
        </span>
        <span className="h-7 w-20 rounded-full bg-[var(--hairline-strong)]" />
      </span>
      <span className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, index) => <span className="h-14 rounded-[13px] bg-[var(--surface)] sm:h-16" key={index} />)}
      </span>
      <span className="grid grid-cols-2 gap-2.5">
        <span className="h-16 rounded-[15px] bg-[var(--surface)] sm:h-[72px]" />
        <span className="h-16 rounded-[15px] bg-[var(--surface)] sm:h-[72px]" />
      </span>
      <span className="h-5 w-44 justify-self-center rounded-full bg-[var(--hairline-strong)]" />
      <span className="sr-only">Checking your tournament registration…</span>
    </section>
  );
}

function HomeTournamentOverviewCard({ tournament, countdown, registered }: { tournament: Tournament; countdown: TournamentCountdown; registered: boolean }) {
  const statusLabel = tournament.status === "registration_open" ? "Reg. open" : tournament.status === "registration_closed" ? "Reg. closed" : formatTournamentStatus(tournament.status);
  const venueText = `${tournament.venueName} ${tournament.venueAddress}`;
  const venueLabel = /chicago/i.test(venueText) ? "Chicago" : tournament.venueName || "Venue TBD";
  const mapsUrl = tournament.venueMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tournament.venueAddress || tournament.venueName || "")}`;

  if (!registered) {
    return <HomeTournamentDiscoveryCard countdown={countdown} mapsUrl={mapsUrl} statusLabel={statusLabel} tournament={tournament} venueLabel={venueLabel} />;
  }

  return (
    <section className="home-dashboard-tournament-card relative mx-auto grid w-full max-w-[600px] gap-5 overflow-hidden rounded-[28px] border border-line bg-card p-5 sm:p-7 lg:max-w-none" style={homeTournamentCardBackground} aria-labelledby="home-tournament-title">
      <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <span className="grid min-w-0">
          <h2 className="break-words text-[18px] font-extrabold leading-tight tracking-[-0.4px] text-text-primary sm:text-[22px] lg:text-[24px]" id="home-tournament-title">{tournament.name}</h2>
        </span>
        <span className="rounded-full border border-brand-primary bg-brand-primary px-3 py-2 text-[12px] font-bold text-white sm:px-4 sm:text-[14px]">Live</span>
      </div>

      <div className="home-dashboard-meta relative z-10 grid grid-cols-2 gap-2.5">
        <HomeTournamentMetaTile icon={<Calendar size={16} />} label="Dates">
          <strong className="text-[15px] font-semibold leading-tight text-text-primary sm:text-[16px]">{formatTournamentDates(tournament)}</strong>
        </HomeTournamentMetaTile>
        <HomeTournamentMetaTile href={mapsUrl} icon={<MapPin size={16} />} label="Venue">
          <strong className="truncate text-[15px] font-semibold leading-tight text-text-primary sm:text-[16px]">{venueLabel}</strong>
          <span className="home-dashboard-meta-action inline-flex min-h-6 w-max items-center gap-1 text-[11px] font-extrabold text-brand-deep">Open in maps ↗</span>
        </HomeTournamentMetaTile>
      </div>

      <a className="tap-card relative z-10 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-3 text-center text-[13px] font-medium leading-tight text-white transition hover:bg-brand-mid sm:text-[14px]" href="https://www.youtube.com/live/7JOkZ_ZFZQk" target="_blank" rel="noreferrer">
        <span className="relative grid h-4 w-[23px] shrink-0 place-items-center rounded-[5px] bg-[#FF0000]" aria-hidden="true">
          <span className="ml-0.5 h-0 w-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white" />
        </span>
        <span>Follow live feed</span>
      </a>
    </section>
  );
}

const homeTournamentCardBackground = {
  backgroundImage: "none"
} satisfies CSSProperties;

function HomeTournamentMetaTile({ children, href, icon, label }: { children: ReactNode; href?: string; icon: ReactNode; label: string }) {
  const content = (
    <>
      <span className="grid h-[30px] w-[30px] place-items-center rounded-[10px] border border-[var(--brand-primary-line)] bg-[var(--brand-primary-tint)] text-brand sm:h-[32px] sm:w-[32px]" aria-hidden="true">{icon}</span>
      <span className="grid min-w-0 gap-1">
        <em className="text-[11px] font-semibold not-italic uppercase tracking-[0.08em] text-text-secondary sm:text-[14px]">{label}</em>
        {children}
      </span>
    </>
  );

  if (href) {
    return <a className="home-dashboard-meta-tile home-dashboard-venue-button tap-card grid min-h-[82px] grid-cols-[30px_minmax(0,1fr)] items-center gap-2 rounded-[20px] border-0 bg-brand-light px-4 py-3 transition hover:bg-[var(--blue-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:min-h-[104px] sm:px-5" href={href} target="_blank" rel="noreferrer" aria-label={`Open ${label} in maps`}>{content}</a>;
  }

  return <span className="home-dashboard-meta-tile grid min-h-[82px] grid-cols-[30px_minmax(0,1fr)] items-center gap-2 rounded-[20px] border-0 bg-brand-light px-4 py-3 sm:min-h-[104px] sm:px-5">{content}</span>;
}

function HomeTournamentDiscoveryCard({ tournament, countdown, mapsUrl, statusLabel, venueLabel }: { tournament: Tournament; countdown: TournamentCountdown; mapsUrl: string; statusLabel: string; venueLabel: string }) {
  const registrationOpen = tournament.status === "registration_open";
  const tournamentLive = tournament.status === "live";
  const description = registrationOpen
    ? "You’re not on the player list yet. Join the tournament and get your personal match schedule right here."
    : tournamentLive
      ? "The tournament is underway. Follow every court, score and bracket update from one place."
      : "Registration is closed, but you can still follow the teams, schedule, bracket and live results.";
  const actionLabel = registrationOpen ? "Register for tournament" : tournamentLive ? "Follow live tournament" : "Explore tournament";

  return (
    <section
      className="relative mx-auto grid w-full max-w-[600px] gap-4 overflow-hidden rounded-[24px] border-hairline border-white/10 bg-brand-deep p-4 text-white sm:p-5 lg:max-w-none lg:gap-5 lg:p-6"
      style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "52px 52px"
      }}
      aria-labelledby="home-tournament-title"
    >
      <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:items-center">
        <div className="grid min-w-0 gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex min-h-8 items-center gap-2 rounded-full bg-[var(--accent)]/15 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
              Tournament central
            </span>
            <span className="rounded-full border-hairline border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur">{statusLabel}</span>
          </div>
          <span className="grid gap-2">
            <h2 className="max-w-[720px] break-words text-[23px] font-semibold leading-[1.08] tracking-[-0.45px] text-white sm:text-[28px] lg:text-[32px]" id="home-tournament-title">{tournament.name}</h2>
            <p className="max-w-[720px] text-[13px] leading-relaxed text-white/72 sm:text-[15px]">{description}</p>
          </span>
        </div>

        <div className="grid gap-2.5 rounded-[20px] border-hairline border-white/10 bg-white/10 p-3 backdrop-blur-sm sm:p-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/72">{countdown.state === "countdown" ? "Tournament starts in" : "Tournament status"}</span>
          {countdown.state === "countdown" ? (
            <div className="grid grid-cols-4 gap-2 text-center">
              <HomeDiscoveryCountdownUnit label="Days" value={countdown.days} />
              <HomeDiscoveryCountdownUnit label="Hrs" value={countdown.hours} />
              <HomeDiscoveryCountdownUnit label="Min" value={countdown.minutes} />
              <HomeDiscoveryCountdownUnit label="Sec" value={countdown.seconds} />
            </div>
          ) : (
            <strong className="text-[20px] font-semibold text-[var(--accent)]">{countdown.label}</strong>
          )}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-2.5 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,0.9fr)_minmax(260px,1.2fr)]">
        <span className="grid min-h-[76px] content-center gap-1 rounded-[18px] border-hairline border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
          <em className="text-[10px] font-semibold not-italic uppercase tracking-[0.1em] text-white/72">Dates</em>
          <strong className="text-[16px] font-semibold text-white">{formatTournamentDates(tournament)}</strong>
        </span>
        <span className="grid min-h-[76px] content-center gap-1 rounded-[18px] border-hairline border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
          <em className="text-[10px] font-semibold not-italic uppercase tracking-[0.1em] text-white/72">Venue</em>
          <strong className="truncate text-[16px] font-semibold text-white">{venueLabel}</strong>
          <a className="tap-card inline-flex min-h-6 w-max items-center text-[11px] font-semibold text-[var(--accent)]" href={mapsUrl} target="_blank" rel="noreferrer">Open in maps ↗</a>
        </span>
        <Link className="tap-card col-span-2 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-[15px] font-semibold text-[var(--accent-on)] transition hover:bg-brand-mid hover:text-white lg:col-span-1" href="/tournaments">
          {actionLabel} <ArrowRight size={16} />
        </Link>
      </div>

      <nav className="relative z-10 grid grid-cols-3 gap-2" aria-label="Tournament shortcuts">
        <Link className="tap-card inline-flex min-h-11 items-center justify-center rounded-full border-hairline border-white/10 bg-white/[0.07] px-2 text-[11px] font-semibold text-white/75 backdrop-blur transition hover:bg-white/12 hover:text-white sm:text-[12px]" href="/tournaments/schedule">Schedule</Link>
        <Link className="tap-card inline-flex min-h-11 items-center justify-center rounded-full border-hairline border-white/10 bg-white/[0.07] px-2 text-[11px] font-semibold text-white/75 backdrop-blur transition hover:bg-white/12 hover:text-white sm:text-[12px]" href="/tournaments/teams">Teams</Link>
        <Link className="tap-card inline-flex min-h-11 items-center justify-center rounded-full border-hairline border-white/10 bg-white/[0.07] px-2 text-[11px] font-semibold text-white/75 backdrop-blur transition hover:bg-white/12 hover:text-white sm:text-[12px]" href="/tournaments/bracket">Bracket</Link>
      </nav>
    </section>
  );
}

function HomeDiscoveryCountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <span className="grid min-w-0 gap-1 rounded-[14px] bg-white/10 px-1 py-3">
      <strong className="text-[19px] font-semibold leading-none tabular-nums text-white sm:text-[23px]">{formatCountdownValue(value)}</strong>
      <em className="text-[8px] font-semibold not-italic uppercase tracking-[0.08em] text-white/72 sm:text-[9px]">{label}</em>
    </span>
  );
}

function HomeQueuedMatchLine({ match }: { match: PlayerScheduleMatch }) {
  const opponentNames = match.opponentNames.length ? match.opponentNames : [match.opposingTeamName];
  const opponentLabel = opponentNames.join(" & ");
  return (
    <Link
      className="home-dashboard-queued tap-card grid min-h-10 w-full grid-cols-[auto_minmax(0,1fr)_auto_22px] items-center gap-2 overflow-hidden rounded-[13px] border-hairline border-line bg-white px-3 py-1.5 text-left transition hover:border-brand/25"
      href={`/tournaments/schedule/matches/${match.id}?from=dashboard`}
      aria-label={`View queued match at ${match.timeLabel || "time to be determined"} against ${opponentLabel} on ${match.courtLabel || "court to be determined"}`}
    >
      <strong className="shrink-0 text-[12px] font-semibold tabular-nums text-brand">{match.timeLabel || "TBD"}</strong>
      <span className="min-w-0 truncate text-[11px] font-medium text-text-primary">
        <em className="mr-1 not-italic text-text-muted">vs</em>{opponentLabel}
      </span>
      <span className="shrink-0 rounded-full bg-brand-light px-2 py-1 text-[9px] font-semibold text-brand">{match.courtLabel || "Court TBD"}</span>
      <ArrowRight className="justify-self-end text-brand-primary" size={14} aria-hidden="true" />
    </Link>
  );
}

function formatHomeMatchDate(tournament: Tournament, dayNumber: number, fallback: string) {
  if (!tournament.startsOn) return fallback || `Day ${dayNumber}`;
  const date = new Date(`${tournament.startsOn}T00:00:00`);
  date.setDate(date.getDate() + Math.max(0, dayNumber - 1));
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function CaptainAvatarStack({ teams, compact = false }: { teams: PublishedTeam[]; compact?: boolean }) {
  const captains = teams
    .map((team) => team.members.find((member) => member.isCaptain) || team.members[0])
    .filter(Boolean) as PublishedTeamMember[];
  const uploadedCaptains = captains.filter((captain) => captain.profilePhotoUrl);
  const preferredCaptains = uploadedCaptains.length ? uploadedCaptains : captains;
  const visibleCaptains = compact ? preferredCaptains.slice(0, 3) : uploadedCaptains.length ? uploadedCaptains : captains.slice(0, 4);
  const remainingCount = Math.max(0, captains.length - visibleCaptains.length);

  if (!captains.length) {
    return (
      <span className={`${compact ? "h-8 px-2" : "h-10 px-2.5"} inline-flex w-max items-center rounded-full bg-accent-tint text-[var(--accent-ink)]`}>
        <UsersRound size={compact ? 16 : 18} />
      </span>
    );
  }

  return (
    <span className={`${compact ? "h-8 pl-1 pr-1.5" : "h-10 pl-1.5 pr-2"} inline-flex w-max items-center`} aria-label="Team captains">
      {visibleCaptains.map((captain, index) => (
        <span
          aria-label={`${captain.name} captain photo`}
          className={`${compact ? "h-8 w-8 text-[9px]" : "h-9 w-9 text-[11px]"} relative grid place-items-center overflow-hidden rounded-full border-2 border-white bg-accent-tint font-medium text-[var(--accent-ink)] shadow-[0_8px_18px_rgba(var(--brand-deep-rgb), 0.12)]`}
          key={`${captain.playerId}-${index}`}
          style={{ marginLeft: index ? compact ? "-9px" : "-10px" : "0", zIndex: 10 + index }}
        >
          {captain.profilePhotoUrl ? (
            <NextImage src={captain.profilePhotoUrl} alt="" fill sizes={compact ? "32px" : "36px"} className="object-cover" />
          ) : (
            getInitials(captain.name)
          )}
        </span>
      ))}
      {remainingCount > 0 && (
        <span
          className={`${compact ? "h-8 w-8 text-[9px]" : "h-9 w-9 text-[12px]"} relative grid place-items-center rounded-full border-2 border-white bg-brand-deep font-medium text-white shadow-[0_8px_18px_rgba(var(--brand-deep-rgb), 0.12)]`}
          style={{ marginLeft: visibleCaptains.length ? compact ? "-9px" : "-10px" : "0", zIndex: 10 + visibleCaptains.length }}
          aria-label={`${remainingCount} more captains`}
        >
          +{remainingCount}
        </span>
      )}
    </span>
  );
}

function ScheduleItemCard({ item, teams, courtMatches = [], hideTime = false }: { item: ScheduleItem; teams: PublishedTeam[]; courtMatches?: TeamCourtScheduleMatch[]; hideTime?: boolean }) {
  const teamA = item.teamASortOrder ? teams.find((team) => team.sortOrder === item.teamASortOrder) : null;
  const teamB = item.teamBSortOrder ? teams.find((team) => team.sortOrder === item.teamBSortOrder) : null;
  const teamALabel = teamA?.name || item.teamALabel;
  const teamBLabel = teamB?.name || item.teamBLabel;
  const teamAColor = teamA?.jerseyColor || "var(--brand-primary-tint)";
  const teamBColor = teamB?.jerseyColor || "var(--brand-primary-tint)";
  const ballTeam = getBallTeamForMatchup(item.dayNumber, teamA?.id || "", teamB?.id || "", item.id, teams);
  const showTeamABall = item.dayNumber === 2 || ballTeam?.id === teamA?.id;
  const showTeamBBall = item.dayNumber === 2 ? false : ballTeam?.id === teamB?.id;

  if (item.itemType === "event") {
    return (
      <article className="grid gap-2 rounded-[16px] border-hairline border-[var(--warning-line)] bg-[var(--warning-tint)] p-3 sm:grid-cols-[92px_minmax(0,1fr)] sm:items-center">
        <span className="inline-flex w-max items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] font-medium text-[var(--warning-ink)]">
          <Clock size={13} />
          {item.timeLabel}
        </span>
        <span className="grid gap-1">
          <strong className="text-[15px] font-medium text-text-primary">{item.matchLabel}</strong>
          {item.detail && <em className="text-[13px] not-italic leading-relaxed text-text-secondary">{item.detail}</em>}
        </span>
      </article>
    );
  }

  return (
    <article className={hideTime ? "grid gap-3 rounded-[16px] border-hairline border-line bg-card p-3 shadow-[0_8px_20px_rgba(var(--brand-deep-rgb),0.04)]" : "grid gap-3 rounded-[16px] border-hairline border-line bg-card p-3 shadow-[0_8px_20px_rgba(var(--brand-deep-rgb),0.04)] lg:grid-cols-[100px_minmax(0,1fr)] lg:items-center"}>
      <span className="grid gap-1">
        {!hideTime && <strong className="text-[14px] font-medium text-brand">{item.timeLabel}</strong>}
        <em className="text-[12px] not-italic text-text-secondary">{[item.podLabel, item.courtLabel].filter(Boolean).join(" · ") || "Courts TBD"}</em>
      </span>
      <span className="grid gap-2">
        <span className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <ScheduleTeamPill label={teamALabel} color={teamAColor} logoUrl={teamA?.logoUrl || ""} isFinalized={Boolean(teamA)} showBallIcon={showTeamABall} />
          <em className="text-[12px] not-italic text-text-muted">vs</em>
          <ScheduleTeamPill label={teamBLabel} color={teamBColor} logoUrl={teamB?.logoUrl || ""} isFinalized={Boolean(teamB)} showBallIcon={showTeamBBall} />
        </span>
        {!!courtMatches.length && (
          <span className="grid gap-1">
            {courtMatches.map((match) => (
              <CompactScheduleMatchRow match={match} key={match.id} />
            ))}
          </span>
        )}
      </span>
    </article>
  );
}

function CompactScheduleMatchRow({ match }: { match: TeamCourtScheduleMatch }) {
  const courtNumber = formatCourtNumber(match.courtLabel || "");

  return (
    <span className="grid min-w-0 grid-cols-[42px_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 rounded-[10px] border-hairline border-line bg-white/80 px-2 py-1.5">
      <b className="rounded-[8px] bg-surface px-1.5 py-1 text-center text-[10px] font-medium leading-none text-brand">{courtNumber || "-"}</b>
      <CompactPlayerProfileNames fallback={match.teamAName} players={match.playerProfilesA} />
      <em className="text-[10px] not-italic text-text-muted">vs</em>
      <CompactPlayerProfileNames fallback={match.teamBName} players={match.playerProfilesB} />
    </span>
  );
}

function CompactPlayerProfileNames({ players, fallback }: { players: MatchPlayerProfile[]; fallback: string }) {
  if (!players.length) return <span className="min-w-0 whitespace-normal break-words text-[11px] font-medium leading-tight text-text-primary">{fallback}</span>;
  return (
    <span className="min-w-0 whitespace-normal break-words text-[11px] font-medium leading-tight text-text-primary">
      {players.map((player, index) => (
        <Fragment key={`${player.id}:${index}`}>
          {index > 0 && <em className="not-italic text-text-muted"> &amp; </em>}
          {isFallbackPlayerProfileId(player.id) ? player.name : <Link className="tap-card underline decoration-current/20 underline-offset-2 transition hover:decoration-current" href={`/tournaments/players/${player.id}?from=schedule`}>{player.name}</Link>}
        </Fragment>
      ))}
    </span>
  );
}

function ScheduleTimeHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="sticky top-[58px] z-10 flex items-center justify-between gap-3 rounded-[16px] border-hairline border-white/70 bg-white/86 px-3.5 py-2.5 shadow-[0_10px_24px_rgba(var(--brand-deep-rgb),0.06)] backdrop-blur-xl">
      <span className="flex items-center gap-2">
        <Clock size={15} className="text-brand" />
        <h2 className="text-[17px] font-medium leading-none text-brand">{label}</h2>
      </span>
      <span className="rounded-full bg-accent-tint px-2.5 py-1 text-[12px] font-medium text-[var(--accent-ink)]">{count} {count === 1 ? "match" : "matches"}</span>
    </div>
  );
}

function ScheduleLoadingNotice({ label, overlay = false }: { label: string; overlay?: boolean }) {
  if (overlay) {
    return (
      <div className="fixed inset-0 z-[70] grid place-items-center bg-white/45 backdrop-blur-[2px]" role="status" aria-live="polite">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-deep px-4 py-2 text-[14px] font-medium text-white shadow-[0_16px_38px_rgba(var(--brand-deep-rgb), 0.22)]">
          <RefreshCw className="animate-spin" size={16} />
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[16px] border-hairline border-line bg-white/90 px-4 text-[14px] font-medium text-brand shadow-[0_12px_28px_rgba(var(--brand-deep-rgb),0.06)] backdrop-blur" role="status" aria-live="polite">
      <RefreshCw className="animate-spin" size={16} />
      {label}
    </div>
  );
}

type ScheduleMatchState = "upcoming" | "ongoing" | "completed";

function SchedulePageHeader({ tournament, selectedDay, activeScope, notesCount, now, onSelectDay, onSelectScope }: { tournament: Tournament | null; selectedDay: 1 | 2; activeScope: "my" | "team"; notesCount: number; now: Date; onSelectDay: (day: 1 | 2) => void; onSelectScope: (scope: "my" | "team") => void }) {
  const todayKey = getChicagoDateKey(now);
  return (
    <section className="grid gap-3" aria-labelledby="schedule-page-title">
      <div className={`${tournamentLiveBannerClass} p-3.5 sm:p-5`}>
        <TournamentHeroAmbience />
        <div className="relative grid gap-4">
          <header className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3">
            <Link className="tap-card !h-11 !w-11 grid place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition hover:bg-white/18" href="/tournaments" aria-label="Back to tournament">
              <ArrowLeft size={18} />
            </Link>
            <span className="grid min-w-0 gap-0.5">
              <em className="text-[9px] font-semibold not-italic uppercase tracking-[0.14em] text-[var(--blue-300)]">Tournament</em>
              <h1 className="text-[26px] font-semibold leading-none tracking-[-0.45px] text-white sm:text-[31px]" id="schedule-page-title">Schedule</h1>
            </span>
            <span className="hidden rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white/72 sm:inline-flex">Live updates</span>
          </header>

          <div className="grid grid-cols-2 gap-2" aria-label="Schedule day">
            {([1, 2] as const).map((day) => {
              const dateKey = getTournamentDayDateKey(tournament, day);
              const isActive = selectedDay === day;
              const isToday = dateKey === todayKey;
              const dayStatus = isToday ? "In progress" : dateKey && dateKey < todayKey ? "Completed" : "Upcoming";
              return (
                <button className={isActive ? "tap-card grid min-h-[68px] content-center gap-1 rounded-[15px] border border-brand-primary bg-brand-primary px-3 py-2 text-left text-white" : "tap-card grid min-h-[68px] content-center gap-1 rounded-[15px] border border-white/12 bg-white/[0.08] px-3 py-2 text-left text-white backdrop-blur transition hover:bg-white/15"} type="button" onClick={() => onSelectDay(day)} aria-pressed={isActive} key={day}>
                  <span className="flex items-center justify-between gap-2">
                    <strong className="text-[14px] font-semibold leading-none sm:text-[15px]">Day {day}</strong>
                    <em className={isActive ? "text-[8px] font-semibold not-italic uppercase tracking-[0.06em] text-white/75" : "text-[8px] font-semibold not-italic uppercase tracking-[0.06em] text-white/72"}>{dayStatus}</em>
                  </span>
                  <span className={isActive ? "text-[10px] font-medium text-white sm:text-[11px]" : "text-[10px] font-medium text-white/72 sm:text-[11px]"}>{formatScheduleDayDate(tournament, day)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-2 rounded-[20px] border-hairline border-line bg-white p-2.5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.72fr)] lg:items-center">
        <div className="grid grid-cols-2 rounded-[14px] bg-[var(--surface)] p-1" aria-label="Schedule view">
          {([{"id":"my","label":"My schedule"},{"id":"team","label":"Team schedule"}] as const).map((tab) => (
            <button className={activeScope === tab.id ? "tap-card min-h-11 rounded-[11px] bg-white px-3 text-left text-[14px] font-semibold text-brand sm:text-[15px]" : "tap-card min-h-11 rounded-[11px] px-3 text-left text-[14px] font-semibold text-text-secondary sm:text-[15px]"} type="button" onClick={() => onSelectScope(tab.id)} aria-pressed={activeScope === tab.id} key={tab.id}>{tab.label}</button>
          ))}
        </div>

        <nav className="grid grid-cols-3 gap-1.5" aria-label="Tournament quick links">
          <Link className="tap-card inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-[12px] border-hairline border-line bg-white px-1.5 text-[10px] font-semibold text-brand transition hover:border-brand/20 sm:text-[12px]" href="/tournaments/schedule/rules" aria-label={`Rules, ${notesCount} sections`}><Info size={14} />Rules</Link>
          <Link className="tap-card inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-[12px] border-hairline border-line bg-white px-1.5 text-[10px] font-semibold text-brand transition hover:border-brand/20 sm:text-[12px]" href="/tournaments/leaderboard"><Trophy size={14} />Leaderboard</Link>
          <Link className="tap-card inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-[12px] border-hairline border-line bg-white px-1.5 text-[10px] font-semibold text-brand transition hover:border-brand/20 sm:text-[12px]" href="/tournaments/bracket"><MonitorUp size={14} />Bracket</Link>
        </nav>
      </div>
    </section>
  );
}

function ScheduleTimelineSlot({ state, children }: { state: ScheduleMatchState | "break"; children: ReactNode }) {
  const dotClass = state === "completed" ? "border-brand bg-brand-deep" : state === "ongoing" ? "border-brand-primary bg-brand-primary" : state === "break" ? "border-text-secondary bg-page" : "border-text-secondary bg-white";
  const dotPositionClass = state === "break" ? "top-[11px]" : "top-[18px]";
  return (
    <div className="relative min-w-0">
      <span className={`absolute left-3 z-[5] h-4 w-4 rounded-full border-[3px] shadow-[0_0_0_3px_rgba(var(--surface-rgb), 0.88)] ${dotPositionClass} ${dotClass}`} aria-hidden="true" />
      {children}
    </div>
  );
}

function ScheduleNowMarker({ now }: { now: Date }) {
  const time = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" }).format(now);
  return (
    <div className="relative flex min-h-8 items-center gap-3 pl-12" role="status" aria-label={`Current tournament time ${time}`}>
      <span className="absolute left-3 z-[5] h-4 w-4 rounded-full border-[3px] border-[var(--urgent)] bg-[var(--urgent)] shadow-[0_0_0_3px_rgba(var(--surface-rgb), 0.88)]" aria-hidden="true" />
      <strong className="shrink-0 rounded-full bg-[var(--urgent)] px-3 py-1 font-mono text-[11px] font-semibold uppercase text-white">Now · {time}</strong>
      <span className="h-px flex-1 bg-[var(--urgent)]" aria-hidden="true" />
    </div>
  );
}

function formatScheduleDayDate(tournament: Tournament | null, day: 1 | 2) {
  const dateKey = getTournamentDayDateKey(tournament, day);
  if (!dateKey) return "Date TBD";
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function getScheduleMatchState(match: { dayNumber: number; timeLabel: string; score: MatchScore | null }, tournament: Tournament | null, now = new Date()): ScheduleMatchState {
  if (match.score?.winnerSide) return "completed";
  const hasEnteredScore = Boolean(match.score && [match.score.sideASet1, match.score.sideBSet1, match.score.sideASet2, match.score.sideBSet2, match.score.sideASet3, match.score.sideBSet3].some((value) => value != null));
  if (hasEnteredScore) return "ongoing";
  const matchDateKey = getTournamentDayDateKey(tournament, match.dayNumber === 2 ? 2 : 1);
  const todayKey = getChicagoDateKey(now);
  if (matchDateKey < todayKey) return "ongoing";
  if (matchDateKey > todayKey) return "upcoming";
  return getScheduleTimeSortValue(match.timeLabel) <= getChicagoMinutes(now) ? "ongoing" : "upcoming";
}

function getScheduleGroupState(matches: Array<{ dayNumber: number; timeLabel: string; score: MatchScore | null }>, tournament: Tournament | null, now: Date): ScheduleMatchState {
  const states = matches.map((match) => getScheduleMatchState(match, tournament, now));
  if (states.some((state) => state === "ongoing")) return "ongoing";
  if (states.length && states.every((state) => state === "completed")) return "completed";
  return "upcoming";
}

function getSchedulePhaseBadgeLabel(matchType: string) {
  const phase = normalizeSchedulePhase(matchType).replaceAll("_", " ").replaceAll("-", " ");
  if (phase.includes("quarter")) return "QF";
  if (phase.includes("semi")) return "Semifinal";
  if (phase.includes("survival")) return "Survival";
  if (phase.includes("advantage")) return "Advantage";
  if (phase.includes("re entry") || phase.includes("reentry")) return "Re-entry";
  if (phase.includes("final")) return "Finals";
  return matchType.trim();
}

function ScheduleMatchStateBadge({ state, score = null, dayNumber = 1, matchType = "" }: { state: ScheduleMatchState; score?: MatchScore | null; dayNumber?: number; matchType?: string }) {
  const phaseLabel = dayNumber === 2 ? getSchedulePhaseBadgeLabel(matchType) : "";
  if (state === "ongoing") {
    const currentSet = score?.sideASet3 != null || score?.sideBSet3 != null ? 3 : score?.sideASet2 != null || score?.sideBSet2 != null ? 2 : 1;
    return <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full bg-[var(--urgent)] px-2.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-white"><span className="h-2 w-2 animate-pulse rounded-full bg-white" />{phaseLabel ? `Ongoing · ${phaseLabel}` : `Ongoing · Set ${currentSet}`}</span>;
  }
  if (state === "completed") return <span className="inline-flex min-h-7 items-center rounded-full bg-accent-tint px-2.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-[var(--accent-ink)]">{phaseLabel ? `Completed · ${phaseLabel}` : "Completed"}</span>;
  return <span className="inline-flex min-h-7 items-center rounded-full bg-surface px-2.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-text-secondary">{phaseLabel ? `Upcoming · ${phaseLabel}` : "Upcoming"}</span>;
}

function PlayerScheduleTimeCard({ label, matches, tournament, teams, onOpenMatch, isFeatured }: { label: string; matches: PlayerScheduleMatch[]; tournament: Tournament | null; teams: PublishedTeam[]; onOpenMatch: (match: PlayerScheduleMatch) => void; isFeatured: boolean }) {
  return (
    <section className="grid gap-3" aria-label={`${label} matches`}>
      {matches.map((match, index) => (
        <PlayerScheduleMatchCard match={match} tournament={tournament} teams={teams} isFeatured={isFeatured && index === 0} onOpenMatch={() => onOpenMatch(match)} key={match.id} />
      ))}
    </section>
  );
}

function MatchIdPill({ match, inverse = false, showLabel = false }: { match: Pick<PlayerScheduleMatch, "id" | "dayNumber" | "matchId">; inverse?: boolean; showLabel?: boolean }) {
  const publicMatchId = formatPublicMatchId(match);
  return (
    <span className={inverse
      ? "inline-flex min-h-6 shrink-0 items-center rounded-full border border-white/15 bg-white/10 px-2.5 text-[9px] font-semibold uppercase tracking-[0.055em] tabular-nums text-white/82 backdrop-blur sm:text-[10px]"
      : "inline-flex min-h-6 shrink-0 items-center rounded-full border border-[var(--brand-primary-line)] bg-[var(--brand-primary-tint)] px-2.5 text-[9px] font-semibold uppercase tracking-[0.055em] tabular-nums text-brand sm:text-[10px]"}
      title={`Match ID ${publicMatchId}`}
      aria-label={`Match ID ${publicMatchId}`}
    >
      {showLabel ? `Match ID · ${publicMatchId}` : publicMatchId}
    </span>
  );
}

function ScheduleTimeDisplay({ label }: { label: string }) {
  return (
    <span className="schedule-time-display inline-flex shrink-0 items-center gap-2">
      <span className="grid h-6 w-6 place-items-center rounded-full border-hairline border-[var(--brand-primary-line)] bg-white/80 text-brand shadow-[0_5px_12px_rgba(var(--brand-deep-rgb),0.07)]" aria-hidden="true"><Clock size={12} strokeWidth={2.3} /></span>
      <strong className="whitespace-nowrap text-[17px] font-semibold leading-none text-brand sm:text-[19px]">{label || "Time TBD"}</strong>
    </span>
  );
}

function TeamScheduleTimeCard({ label, matches, team, tournament, teams, onOpenMatch }: { label: string; matches: TeamCourtScheduleMatch[]; team: PublishedTeam; tournament: Tournament | null; teams: PublishedTeam[]; onOpenMatch: (match: TeamCourtScheduleMatch) => void }) {
  const firstMatch = matches[0];
  const opponentId = firstMatch?.teamAId === team.id ? firstMatch?.teamBId : firstMatch?.teamAId;
  const matchupKey = firstMatch ? `team-schedule:${label}:${[team.id, opponentId || ""].sort().join(":")}` : "";
  const ballTeam = firstMatch ? getBallTeamForMatchup(firstMatch.dayNumber, firstMatch.teamAId, firstMatch.teamBId, matchupKey, teams) : null;
  const allMatchesComplete = Boolean(matches.length && matches.every((match) => match.score?.winnerSide));
  const teamAWins = matches.filter((match) => match.score?.winnerSide === "A").length;
  const teamBWins = matches.filter((match) => match.score?.winnerSide === "B").length;
  const winnerName = teamAWins > teamBWins ? firstMatch?.teamAName : teamBWins > teamAWins ? firstMatch?.teamBName : "";
  const winnerScore = Math.max(teamAWins, teamBWins);
  const loserScore = Math.min(teamAWins, teamBWins);
  const resultLabel = allMatchesComplete
    ? winnerName ? `${getCompactTeamName(winnerName)} won ${winnerScore}–${loserScore}` : `Final ${teamAWins}–${teamBWins}`
    : "";

  return (
    <section className="schedule-player-match-card schedule-team-match-card relative grid gap-2.5 overflow-hidden rounded-[20px] border border-[var(--hairline-strong)] bg-white/94 py-3 pl-12 pr-3 shadow-[0_18px_42px_rgba(var(--brand-deep-rgb), 0.11)] backdrop-blur-xl sm:rounded-[22px] sm:py-4 sm:pl-12 sm:pr-4">
      <div className="relative z-[1] flex min-w-0 items-center justify-between gap-3">
        <ScheduleTimeDisplay label={label} />
        {resultLabel && <strong className="shrink-0 rounded-full bg-accent-tint px-3 py-1.5 text-[11px] font-semibold text-[var(--accent-ink)] sm:text-[12px]">{resultLabel}</strong>}
      </div>
      {firstMatch && (
        <div className="schedule-match-team-row relative z-[1] flex w-max max-w-full min-w-0 flex-nowrap items-center gap-1.5 overflow-hidden whitespace-nowrap text-[13px] font-medium leading-tight text-text-secondary sm:text-[14px]">
          <ScheduleHeaderTeamName name={firstMatch.teamAName || "Team A"} showBallIcon={ballTeam?.id === firstMatch.teamAId} />
          <em className="shrink-0 not-italic text-text-muted">vs</em>
          <ScheduleHeaderTeamName name={firstMatch.teamBName || "Team B"} showBallIcon={ballTeam?.id === firstMatch.teamBId} />
        </div>
      )}
      <div className="relative z-[1] grid gap-2">
        {matches.map((match) => <TeamCourtScheduleGame match={match} teamName={team.name} tournament={tournament} onOpenMatch={onOpenMatch} grouped key={match.id} />)}
      </div>
    </section>
  );
}

function getCompactTeamName(name: string) {
  return name.replace(/^team\s+/i, "").trim() || name;
}

function ScheduleFullBracketBoard({ day, dayOneNodes, dayTwoStages, coinTossDecisions, viewerTeamId, viewerIsAdmin, viewerIsSignedIn, savingCoinTossNode, openNodes, onToggleNode, onSaveCoinToss }: { day: 1 | 2; dayOneNodes: LiveBracketNode[]; dayTwoStages: LiveBracketStage[]; coinTossDecisions: DayTwoCoinTossDecision[]; viewerTeamId: string; viewerIsAdmin: boolean; viewerIsSignedIn: boolean; savingCoinTossNode: string; openNodes: Record<string, boolean>; onToggleNode: (nodeId: string) => void; onSaveCoinToss: (nodeKey: DayTwoCoinTossNodeKey, winningTeamId: string, formatChoice: DayTwoFormatChoice) => Promise<string> }) {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const bracketScrollerRef = useRef<HTMLDivElement | null>(null);
  const roundTabsRef = useRef<HTMLDivElement | null>(null);
  const [activeColumn, setActiveColumn] = useState(0);
  const columns = day === 1
    ? Object.entries(groupBracketNodesByTime(dayOneNodes))
        .sort(([left], [right]) => getScheduleTimeSortValue(left) - getScheduleTimeSortValue(right))
        .map(([label, nodes]) => ({ key: `time-${label}`, label, eyebrow: "", nodes }))
    : dayTwoStages.map((stage) => ({ key: stage.key, label: stage.label, eyebrow: "Championship round", nodes: stage.nodes }));
  const totalPlayerMatches = columns.flatMap((column) => column.nodes).flatMap((node) => node.result.matches);
  const completedPlayerMatches = totalPlayerMatches.filter((match) => Boolean(match.score?.winnerSide)).length;
  const centerRoundTab = (index: number) => {
    const tabRail = roundTabsRef.current;
    const tab = tabRail?.children[index] as HTMLElement | undefined;
    if (!tabRail || !tab) return;
    const railRect = tabRail.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    tabRail.scrollTo({
      left: index === 0 ? 0 : Math.max(0, tabRail.scrollLeft + tabRect.left - railRect.left - (tabRail.clientWidth - tabRect.width) / 2),
      behavior: "smooth"
    });
  };
  const scrollToColumn = (index: number) => {
    const scroller = bracketScrollerRef.current;
    const column = boardRef.current?.children[index] as HTMLElement | undefined;
    if (!scroller || !column) return;
    setActiveColumn(index);
    centerRoundTab(index);
    const scrollerRect = scroller.getBoundingClientRect();
    const columnRect = column.getBoundingClientRect();
    const targetLeft = index === 0 ? 0 : scroller.scrollLeft + columnRect.left - scrollerRect.left;
    scroller.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
  };

  useEffect(() => {
    setActiveColumn(0);
    bracketScrollerRef.current?.scrollTo({ left: 0, behavior: "auto" });
    roundTabsRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [day]);

  return (
    <section className="overflow-hidden rounded-[24px] border-hairline border-[var(--hairline-strong)] bg-white shadow-[0_20px_48px_rgba(var(--brand-deep-rgb), 0.11)]" aria-label={`Day ${day} full bracket`}>
      <div className="flex items-center justify-between gap-3 border-b-hairline border-line px-3 py-3 sm:px-4">
        <span className="grid min-w-0 gap-0.5">
          <em className="text-[9px] font-medium not-italic uppercase tracking-[0.12em] text-text-muted">Day {day} · Full bracket</em>
          <strong className="text-[17px] font-medium text-text-primary">{day === 1 ? "Round-robin matchups" : "Championship path"}</strong>
        </span>
        <span className="shrink-0 rounded-full bg-[var(--accent)] px-3 py-1.5 text-[10px] font-semibold text-[var(--accent-on)]">{completedPlayerMatches}/{totalPlayerMatches.length} results</span>
      </div>

      <div className="flex gap-1.5 overflow-x-auto overscroll-x-contain scroll-smooth bg-[var(--surface)] p-2 sm:p-3" aria-label="Bracket rounds" ref={roundTabsRef}>
        {columns.map((column, index) => (
          <button className={activeColumn === index ? "tap-card min-w-[126px] rounded-[10px] bg-[var(--brand-deep)] px-3 py-2 text-[11px] font-medium text-white shadow-[0_7px_16px_rgba(var(--brand-deep-rgb), 0.16)]" : "tap-card min-w-[126px] rounded-[10px] bg-[var(--surface-subtle)] px-3 py-2 text-[11px] font-medium text-[var(--mist)]"} type="button" onClick={() => scrollToColumn(index)} aria-pressed={activeColumn === index} key={column.key}>{column.label}</button>
        ))}
      </div>

      <div className="snap-x snap-proximity overflow-x-auto overscroll-x-contain scroll-smooth bg-[var(--brand-deep)]" ref={bracketScrollerRef} onScroll={(event) => {
          const scroller = event.currentTarget;
          const columnsInView = Array.from(boardRef.current?.children || []) as HTMLElement[];
          if (!columnsInView.length) return;
          const scrollerRect = scroller.getBoundingClientRect();
          const viewportCenter = scrollerRect.left + scroller.clientWidth / 2;
          const nextIndex = columnsInView.reduce((closest, column, index) => {
            const columnRect = column.getBoundingClientRect();
            const closestRect = columnsInView[closest].getBoundingClientRect();
            return Math.abs(columnRect.left + columnRect.width / 2 - viewportCenter) < Math.abs(closestRect.left + closestRect.width / 2 - viewportCenter) ? index : closest;
          }, 0);
          if (nextIndex !== activeColumn) {
            setActiveColumn(nextIndex);
            centerRoundTab(nextIndex);
          }
        }}>
        <div className="flex min-w-max items-stretch" ref={boardRef}>
          {columns.map((column, columnIndex) => (
            <section className={`relative grid w-[min(86vw,330px)] shrink-0 snap-start grid-rows-[auto_1fr] border-r border-white/8 px-3 py-4 sm:w-[340px] sm:px-4 ${columnIndex % 2 ? "bg-[var(--brand-deep)]" : "bg-[var(--brand-deep)]"}`} key={column.key}>
              {day === 2 && columnIndex > 0 && <span className="pointer-events-none absolute bottom-[14%] left-0 top-[22%] w-px bg-white/28" aria-hidden="true" />}
              {day === 2 && columnIndex < columns.length - 1 && <span className="pointer-events-none absolute bottom-[14%] right-0 top-[22%] w-px bg-white/28" aria-hidden="true" />}
              <span className="grid gap-0.5 border-b border-white/12 pb-3">
                <strong className="text-[18px] font-medium text-white">{column.label}</strong>
                {column.eyebrow && <em className="text-[9px] font-medium not-italic uppercase tracking-[0.08em] text-white/72">{column.eyebrow}</em>}
              </span>
              <div className="relative grid content-around gap-4 py-5 sm:min-h-[500px]">
                {column.nodes.map((node) => (
                  <ScheduleBracketNodeCard
                    coinTossDecision={coinTossDecisions.find((decision) => decision.nodeKey === node.id) || null}
                    hasConnector={day === 2 && columnIndex < columns.length - 1}
                    hasIncoming={day === 2 && columnIndex > 0}
                    isOpen={Boolean(openNodes[node.id])}
                    node={node}
                    onToggle={() => onToggleNode(node.id)}
                    onSaveCoinToss={onSaveCoinToss}
                    savingCoinToss={savingCoinTossNode === node.id}
                    viewerIsAdmin={viewerIsAdmin}
                    viewerIsSignedIn={viewerIsSignedIn}
                    viewerTeamId={viewerTeamId}
                    key={node.id}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      <p className="border-t-hairline border-line bg-white px-3 py-2 text-center text-[10px] text-text-muted sm:hidden">Swipe sideways to follow the bracket.</p>
    </section>
  );
}

function ScheduleBracketNodeCard({ node, isOpen, hasConnector, hasIncoming, coinTossDecision, viewerTeamId, viewerIsAdmin, viewerIsSignedIn, savingCoinToss, onToggle, onSaveCoinToss }: { node: LiveBracketNode; isOpen: boolean; hasConnector: boolean; hasIncoming: boolean; coinTossDecision: DayTwoCoinTossDecision | null; viewerTeamId: string; viewerIsAdmin: boolean; viewerIsSignedIn: boolean; savingCoinToss: boolean; onToggle: () => void; onSaveCoinToss: (nodeKey: DayTwoCoinTossNodeKey, winningTeamId: string, formatChoice: DayTwoFormatChoice) => Promise<string> }) {
  const hasWinner = Boolean(node.result.winnerTeamId);
  const sideAWon = hasWinner && node.sideA.team?.id === node.result.winnerTeamId;
  const sideBWon = hasWinner && node.sideB.team?.id === node.result.winnerTeamId;
  const hasBothTeams = Boolean(node.sideA.team && node.sideB.team);
  const status = node.result.decidedBy === "organizer review" ? "Needs review" : hasWinner ? "Completed" : node.result.completedMatches ? "Ongoing" : hasBothTeams ? "Not started" : "Awaiting teams";
  const statusClass = status === "Completed"
    ? "bg-[var(--brand-primary-tint)] text-[var(--brand-mid)]"
    : status === "Ongoing"
      ? "bg-[var(--accent)] text-[var(--accent-on)]"
      : status === "Needs review"
        ? "bg-[var(--warning-tint)] text-[var(--warning)]"
        : status === "Awaiting teams"
          ? "bg-[var(--brand-primary-tint)] text-[var(--mist)]"
          : "bg-surface text-text-muted";
  const coinTossNode = isDayTwoCoinTossNode(node.id);
  const knownTeamIds = [node.sideA.team?.id, node.sideB.team?.id].filter(Boolean) as string[];
  const validDecision = coinTossDecision && knownTeamIds.includes(coinTossDecision.winningTeamId) ? coinTossDecision : null;
  const formatChoice = getDayTwoNodeFormatChoice(node, validDecision);
  const canEnterCoinToss = coinTossNode && viewerIsSignedIn && (viewerIsAdmin || Boolean(viewerTeamId && knownTeamIds.includes(viewerTeamId)));
  return (
    <article className="relative z-10 rounded-[14px] bg-white shadow-[0_12px_28px_rgba(var(--brand-deep-rgb),0.20)]">
      {hasIncoming && <span className="pointer-events-none absolute right-full top-1/2 z-0 h-px w-4 bg-white/55" aria-hidden="true" />}
      {hasConnector && <span className="pointer-events-none absolute left-full top-1/2 z-0 h-px w-4 bg-white/55" aria-hidden="true" />}
      <button className="tap-card grid w-full text-left" type="button" onClick={onToggle} aria-expanded={isOpen}>
        <span className="flex items-center justify-between gap-2 border-b-hairline border-line px-3 py-2">
          <span className="min-w-0">
            <strong className="block truncate text-[9px] font-semibold uppercase tracking-[0.06em] text-brand">{node.label}</strong>
            <em className="block truncate text-[8px] not-italic text-text-muted">{node.timeLabel}</em>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <em className={`${statusClass} rounded-full px-2 py-1 text-[8px] font-semibold not-italic uppercase`}>{status}</em>
            <ChevronDown className={`text-brand transition-transform ${isOpen ? "rotate-180" : ""}`} size={14} />
          </span>
        </span>
        <ScheduleBracketTeamRow slot={node.sideA} score={node.result.matchWinsA} isWinner={sideAWon} />
        <ScheduleBracketTeamRow slot={node.sideB} score={node.result.matchWinsB} isWinner={sideBWon} />
      </button>
      {isOpen && (
        <div className="grid gap-1 border-t-hairline border-line bg-surface/55 p-1.5">
          {coinTossNode && (
            <DayTwoCoinTossPanel
              canEdit={canEnterCoinToss}
              decision={validDecision}
              node={node}
              onSave={onSaveCoinToss}
              saving={savingCoinToss}
            />
          )}
          {node.result.matches.length ? node.phase === "Final" ? (
            <DayTwoFinalMatchGroups matches={node.result.matches} node={node} />
          ) : node.result.matches.map((match) => (
            <ScheduleBracketMatchLink match={match} node={node} key={match.id} />
          )) : formatChoice || node.phase === "Final" ? (
            <DayTwoProjectedMatchups node={node} formatChoice={formatChoice} />
          ) : (
            <p className="rounded-[9px] bg-white px-2 py-2 text-[9px] text-text-secondary">{knownTeamIds.length ? "Enter the coin toss to set singles and doubles." : "Player matchups appear as teams advance."}</p>
          )}
        </div>
      )}
    </article>
  );
}

function ScheduleBracketMatchLink({ match }: { match: TeamCourtScheduleMatch; node?: LiveBracketNode }) {
  const score = match.score;
  const hasTieBreaker = hasMatchTieBreaker(match);
  const scoreRows = [
    {
      side: "A" as const,
      fallback: match.teamAName,
      fallbackPlayers: match.playersA,
      players: match.playerProfilesA,
      scores: [score?.sideASet1, score?.sideASet2, hasTieBreaker ? score?.sideASet3 : null],
      opponentScores: [score?.sideBSet1, score?.sideBSet2, hasTieBreaker ? score?.sideBSet3 : null]
    },
    {
      side: "B" as const,
      fallback: match.teamBName,
      fallbackPlayers: match.playersB,
      players: match.playerProfilesB,
      scores: [score?.sideBSet1, score?.sideBSet2, hasTieBreaker ? score?.sideBSet3 : null],
      opponentScores: [score?.sideASet1, score?.sideASet2, hasTieBreaker ? score?.sideASet3 : null]
    }
  ];
  return (
    <article className="overflow-hidden rounded-[9px] border-hairline border-line/90 bg-white shadow-[0_3px_9px_rgba(var(--brand-deep-rgb), 0.04)]">
      <header className="flex min-h-8 items-center justify-between gap-2 border-b-hairline border-line bg-[var(--surface)] px-2 py-1">
        <span className="flex min-w-0 items-center gap-1.5">
          <strong className="shrink-0 text-[9px] font-semibold text-brand">{match.courtLabel || "Court TBD"}</strong>
          <span className="h-1 w-1 shrink-0 rounded-full bg-line" aria-hidden="true" />
          <em className="truncate text-[7px] font-medium not-italic uppercase tracking-[0.04em] text-text-muted">{match.tierRule || match.format}</em>
        </span>
        <Link className={score?.winnerSide ? "tap-card !w-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-light px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.03em] text-brand" : "tap-card !w-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.03em] text-text-muted"} href={`/tournaments/schedule/matches/${match.id}?from=full-bracket&day=${match.dayNumber}`} aria-label="View match details">
          {score?.winnerSide ? "Completed" : "Details"}
          <ArrowRight size={9} />
        </Link>
      </header>
      <div className="grid gap-0.5 p-1">
        <div className="grid grid-cols-[minmax(0,1fr)_26px_26px_26px] items-center gap-1 px-1 text-center text-[6px] font-semibold uppercase tracking-[0.06em] text-text-muted">
          <span className="text-left">{match.format === "Doubles" ? "Pair" : "Player"}</span>
          <span>S1</span>
          <span>S2</span>
          <span>TB</span>
        </div>
        {scoreRows.map((row) => (
          <BracketMatchScoreRow
            fallback={row.fallback}
            fallbackPlayers={row.fallbackPlayers}
            isDoubles={match.format === "Doubles"}
            isWinner={score?.winnerSide === row.side}
            match={match}
            opponentScores={row.opponentScores}
            players={row.players}
            scores={row.scores}
            key={row.side}
          />
        ))}
      </div>
    </article>
  );
}

function BracketMatchScoreRow({ match, players, fallbackPlayers, fallback, scores, opponentScores, isDoubles, isWinner }: { match: TeamCourtScheduleMatch; players: MatchPlayerProfile[]; fallbackPlayers: string[]; fallback: string; scores: Array<number | null | undefined>; opponentScores: Array<number | null | undefined>; isDoubles: boolean; isWinner: boolean }) {
  const displayPlayers = players.length
    ? players.map((player) => ({ ...player, canLink: !isFallbackPlayerProfileId(player.id) }))
    : fallbackPlayers.map((name, index) => ({ id: `${match.id}:fallback:${index}`, name, profilePhotoUrl: "", canLink: false }));
  return (
    <div className={`${isWinner ? "bg-[var(--accent-tint)] ring-1 ring-inset ring-[var(--accent-line)]" : "bg-surface/70"} grid min-h-[42px] grid-cols-[minmax(0,1fr)_26px_26px_26px] items-center gap-1 rounded-[7px] px-1.5 py-1`}>
      <span className="grid min-w-0 gap-px pr-1">
        {displayPlayers.length ? displayPlayers.slice(0, isDoubles ? 2 : 1).map((player, index) => (
          <span className="grid min-w-0 grid-cols-[11px_minmax(0,1fr)] items-center gap-px" key={player.id}>
            <em className={index ? "grid h-3 w-3 place-items-center rounded-full bg-white text-[8px] font-semibold not-italic text-brand" : "text-center text-[7px] font-semibold not-italic text-text-muted"}>{index ? "+" : isWinner ? "W" : ""}</em>
            {player.canLink ? (
              <Link className="tap-card min-w-0 truncate text-[9px] font-semibold leading-tight text-text-primary underline decoration-current/20 underline-offset-2 hover:decoration-current" href={`/tournaments/players/${player.id}?from=bracket&day=${match.dayNumber}`}>{player.name}</Link>
            ) : (
              <strong className="min-w-0 truncate text-[9px] font-semibold leading-tight text-text-primary">{player.name}</strong>
            )}
          </span>
        )) : (
          <strong className="truncate text-[9px] font-semibold text-text-primary">{fallback}</strong>
        )}
        <em className="truncate pl-3 text-[6px] font-medium not-italic uppercase tracking-[0.03em] text-text-muted">{fallback}</em>
      </span>
      {scores.map((value, index) => {
        const wonSet = value != null && opponentScores[index] != null && getSetWinner(value, opponentScores[index]) === "A";
        return (
          <strong className={`${wonSet ? "bg-white text-brand ring-1 ring-inset ring-[var(--accent-line)]" : "bg-white/75 text-text-secondary"} grid h-7 place-items-center rounded-[6px] text-[12px] font-semibold tabular-nums`} key={index}>{value ?? "–"}</strong>
        );
      })}
    </div>
  );
}

function BracketPlayerProfileNames({ players, fallback, match }: { players: MatchPlayerProfile[]; fallback: string; match: TeamCourtScheduleMatch }) {
  if (!players.length) return <strong className="font-medium">{fallback}</strong>;
  return (
    <span className="inline-flex min-w-0 flex-wrap items-center gap-0.5">
      {players.map((player, index) => (
        <Fragment key={`${match.id}:${player.id}:${index}`}>
          {index > 0 && <em className="not-italic text-text-muted">/</em>}
          {isFallbackPlayerProfileId(player.id) ? <strong className="font-medium">{player.name}</strong> : <Link className="tap-card font-medium underline decoration-current/20 underline-offset-2 hover:decoration-current" href={`/tournaments/players/${player.id}?from=bracket&day=${match.dayNumber}`}>{player.name}</Link>}
        </Fragment>
      ))}
    </span>
  );
}

function DayTwoFinalMatchGroups({ matches, node }: { matches: TeamCourtScheduleMatch[]; node: LiveBracketNode }) {
  const doubles = matches.filter((match) => match.format === "Doubles");
  const singles = matches.filter((match) => match.format === "Singles");
  return (
    <div className="grid gap-2">
      {[
        { label: "4:00 PM", detail: "Doubles · Courts 6 & 7", matches: doubles },
        { label: "5:10 PM", detail: "Singles · Courts 6–9", matches: singles }
      ].map((group) => (
        <section className="grid gap-1 rounded-[10px] border-hairline border-line/80 bg-surface/65 p-1.5" key={group.label}>
          <span className="flex items-center justify-between gap-2 px-1 py-0.5">
            <strong className="text-[9px] font-semibold text-brand">{group.label}</strong>
            <em className="text-[7px] font-medium not-italic text-text-muted">{group.detail}</em>
          </span>
          {group.matches.map((match) => <ScheduleBracketMatchLink match={match} node={node} key={match.id} />)}
        </section>
      ))}
    </div>
  );
}

function isDayTwoCoinTossNode(nodeKey: string): nodeKey is DayTwoCoinTossNodeKey {
  return nodeKey === "reentry1" || nodeKey === "reentry2" || nodeKey === "semifinal1" || nodeKey === "semifinal2";
}

function getDayTwoNodeFormatChoice(node: LiveBracketNode, decision: DayTwoCoinTossDecision | null): DayTwoFormatChoice | null {
  if (node.phase === "Quarterfinal") return "tiers_1_2_singles";
  if (node.phase === "Advantage" || node.phase === "Survival") return "tiers_3_4_singles";
  if (node.phase === "Re-entry" || node.phase === "Semifinal") return decision?.formatChoice || null;
  return null;
}

function getEffectiveTeamTierMembers(team: PublishedTeam | null) {
  if (!team) return [];
  const mapped = team.members.map((member) => ({ member, tier: Number(member.tier.match(/\d+/)?.[0] || 99), draftOrder: member.draftOrder ?? 99 }));
  const tiers = new Set(mapped.map((row) => row.tier));
  if ([1, 2, 3, 4].every((tier) => tiers.has(tier))) return mapped.sort((left, right) => left.tier - right.tier || left.draftOrder - right.draftOrder);
  return mapped.sort((left, right) => left.draftOrder - right.draftOrder || left.member.name.localeCompare(right.member.name)).map((row, index) => ({ ...row, tier: index + 1 }));
}

function getProjectedTierDefinitions(node: LiveBracketNode, formatChoice: DayTwoFormatChoice | null) {
  if (node.phase === "Final") return [
    { label: "Doubles 1", tiers: [1, 2], format: "Doubles", court: "Court 6" },
    { label: "Doubles 2", tiers: [3, 4], format: "Doubles", court: "Court 7" },
    { label: "Tier 1", tiers: [1], format: "Singles", court: "Court 6" },
    { label: "Tier 2", tiers: [2], format: "Singles", court: "Court 7" },
    { label: "Tier 3", tiers: [3], format: "Singles", court: "Court 8" },
    { label: "Tier 4", tiers: [4], format: "Singles", court: "Court 9" }
  ];
  if (!formatChoice) return [];
  return formatChoice === "tiers_1_2_singles"
    ? [
        { label: "Tier 1", tiers: [1], format: "Singles" },
        { label: "Tier 2", tiers: [2], format: "Singles" },
        { label: "Tiers 3 & 4", tiers: [3, 4], format: "Doubles" }
      ]
    : [
        { label: "Tiers 1 & 2", tiers: [1, 2], format: "Doubles" },
        { label: "Tier 3", tiers: [3], format: "Singles" },
        { label: "Tier 4", tiers: [4], format: "Singles" }
      ];
}

function DayTwoProjectedMatchups({ node, formatChoice }: { node: LiveBracketNode; formatChoice: DayTwoFormatChoice | null }) {
  const teamAMembers = getEffectiveTeamTierMembers(node.sideA.team);
  const teamBMembers = getEffectiveTeamTierMembers(node.sideB.team);
  const definitions = getProjectedTierDefinitions(node, formatChoice);
  return (
    <div className="grid gap-1" aria-label={`${node.label} projected player matchups`}>
      {definitions.map((definition, index) => (
        <Fragment key={`${node.id}:${definition.label}`}>
          {node.phase === "Final" && (index === 0 || index === 2) && (
            <span className="mt-1 flex items-center justify-between gap-2 rounded-[8px] bg-[var(--surface)] px-2 py-1.5 first:mt-0">
              <strong className="text-[9px] font-semibold text-brand">{index === 0 ? "4:00 PM" : "5:10 PM"}</strong>
              <em className="text-[7px] font-medium not-italic text-text-muted">{index === 0 ? "Doubles · Courts 6 & 7" : "Singles · Courts 6–9"}</em>
            </span>
          )}
          <article className="grid gap-1 rounded-[9px] border-hairline border-line/70 bg-white px-2 py-2">
            <span className="flex items-center justify-between gap-2">
              <strong className="text-[8px] font-semibold uppercase tracking-[0.05em] text-brand">{definition.label} · {definition.format}</strong>
              <em className="text-[7px] not-italic text-text-muted">{node.phase === "Final" ? `${"court" in definition ? definition.court : ""}` : node.timeLabel}</em>
            </span>
            <span className="grid grid-cols-[minmax(0,1fr)_18px_minmax(0,1fr)] items-center gap-1.5 text-[9px] leading-tight">
              <span className="grid min-w-0 gap-0.5">
                <em className="not-italic text-text-muted">{node.sideA.seed ? `Seed ${node.sideA.seed}` : node.sideA.team?.name || node.sideA.fallbackLabel}</em>
                <ProjectedPlayerProfileNames members={teamAMembers} tiers={definition.tiers} />
              </span>
              <em className="text-center not-italic text-text-muted">vs</em>
              <span className="grid min-w-0 gap-0.5 text-right">
                <em className="not-italic text-text-muted">{node.sideB.seed ? `Seed ${node.sideB.seed}` : node.sideB.team?.name || node.sideB.fallbackLabel}</em>
                <ProjectedPlayerProfileNames members={teamBMembers} tiers={definition.tiers} />
              </span>
            </span>
          </article>
        </Fragment>
      ))}
    </div>
  );
}

function ProjectedPlayerProfileNames({ members, tiers }: { members: ReturnType<typeof getEffectiveTeamTierMembers>; tiers: number[] }) {
  return (
    <strong className="break-words font-medium text-text-primary">
      {tiers.map((tier, index) => {
        const player = members.find((row) => row.tier === tier)?.member;
        return (
          <Fragment key={tier}>
            {index > 0 && <span className="text-text-muted"> / </span>}
            {player ? <Link className="tap-card underline decoration-current/20 underline-offset-2 transition hover:decoration-current" href={`/tournaments/players/${player.playerId}?from=bracket&day=2`}>{player.name}</Link> : `Tier ${tier} TBD`}
          </Fragment>
        );
      })}
    </strong>
  );
}

function DayTwoCoinTossPanel({ node, decision, canEdit, saving, onSave }: { node: LiveBracketNode; decision: DayTwoCoinTossDecision | null; canEdit: boolean; saving: boolean; onSave: (nodeKey: DayTwoCoinTossNodeKey, winningTeamId: string, formatChoice: DayTwoFormatChoice) => Promise<string> }) {
  const knownTeams = [node.sideA.team, node.sideB.team].filter(Boolean) as PublishedTeam[];
  const defaultTeamId = node.sideA.team?.id || node.sideB.team?.id || "";
  const [winningTeamId, setWinningTeamId] = useState(decision?.winningTeamId || defaultTeamId);
  const [formatChoice, setFormatChoice] = useState<DayTwoFormatChoice>(decision?.formatChoice || "tiers_1_2_singles");
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    setWinningTeamId(decision?.winningTeamId || defaultTeamId);
    setFormatChoice(decision?.formatChoice || "tiers_1_2_singles");
  }, [decision?.formatChoice, decision?.winningTeamId, defaultTeamId]);
  const winningTeam = knownTeams.find((team) => team.id === decision?.winningTeamId);
  if (!knownTeams.length) return <p className="rounded-[9px] border-hairline border-[var(--hairline-strong)] bg-[var(--surface)] px-2 py-2 text-[9px] text-text-secondary">Coin toss entry opens when the first team reaches this round.</p>;
  if (!canEdit) {
    return decision ? (
      <p className="rounded-[9px] border-hairline border-[var(--hairline-strong)] bg-[var(--surface)] px-2 py-2 text-[9px] font-medium text-brand"><strong>{winningTeam?.name || "Advancing team"}</strong> won the toss · {formatDayTwoChoice(decision.formatChoice)}</p>
    ) : (
      <p className="rounded-[9px] border-hairline border-[var(--warning-line)] bg-[var(--warning-surface)] px-2 py-2 text-[9px] text-[var(--warning-ink-soft)]">Waiting for an advancing team to enter the coin toss.</p>
    );
  }
  return (
    <div className="grid gap-2 rounded-[10px] border-hairline border-[var(--brand-primary-tint)] bg-[var(--surface)] p-2">
      <span className="grid gap-0.5"><strong className="text-[10px] font-semibold text-brand">Coin toss &amp; format</strong><em className="text-[8px] not-italic text-text-secondary">Either advancing team may record the winner’s choice.</em></span>
      <label className="grid gap-1 text-[8px] font-medium uppercase tracking-[0.04em] text-text-muted">Coin toss winner
        <select className="min-h-9 rounded-[9px] border-hairline border-line bg-white px-2 text-[10px] font-medium normal-case tracking-normal text-text-primary outline-none focus:border-brand" value={winningTeamId} onChange={(event) => setWinningTeamId(event.target.value)} disabled={saving}>
          {knownTeams.map((team) => <option value={team.id} key={team.id}>{team.name}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-[8px] font-medium uppercase tracking-[0.04em] text-text-muted">Toss winner&apos;s choice
        <select className="min-h-9 rounded-[9px] border-hairline border-line bg-white px-2 text-[10px] font-medium normal-case tracking-normal text-text-primary outline-none focus:border-brand" value={formatChoice} onChange={(event) => setFormatChoice(event.target.value as DayTwoFormatChoice)} disabled={saving}>
          <option value="tiers_1_2_singles">Tiers 1 &amp; 2 play singles</option>
          <option value="tiers_3_4_singles">Tiers 3 &amp; 4 play singles</option>
        </select>
      </label>
      <button className="tap-card min-h-9 rounded-[9px] bg-brand-deep px-3 text-[10px] font-semibold text-white disabled:opacity-55" type="button" disabled={saving || !winningTeamId} onClick={async () => setFeedback(await onSave(node.id as DayTwoCoinTossNodeKey, winningTeamId, formatChoice))}>{saving ? "Updating matchups…" : decision ? "Update toss" : "Save toss & update matches"}</button>
      {feedback && <p className={feedback.startsWith("Coin toss saved") ? "text-[8px] font-medium text-[var(--accent-ink)]" : "text-[8px] font-medium text-[var(--error)]"}>{feedback}</p>}
    </div>
  );
}

function formatDayTwoChoice(choice: DayTwoFormatChoice) {
  return choice === "tiers_1_2_singles" ? "Tiers 1 & 2 singles · Tiers 3 & 4 doubles" : "Tiers 3 & 4 singles · Tiers 1 & 2 doubles";
}

function ScheduleBracketTeamRow({ slot, score, isWinner }: { slot: BracketSlot; score: number; isWinner: boolean }) {
  const team = slot.team;
  return (
    <span className={isWinner ? "grid min-h-11 grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-2 bg-[var(--brand-primary-tint)] px-3 py-2" : "grid min-h-11 grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2"}>
      {team?.logoUrl ? (
        <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-[8px] bg-white p-1 shadow-[inset_0_0_0_1px_rgba(var(--brand-deep-rgb),0.05)]"><img className="h-full w-full object-contain" src={team.logoUrl} alt="" aria-hidden="true" /></span>
      ) : (
        <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-surface text-[8px] font-semibold text-brand">{team ? getInitials(team.name) : "—"}</span>
      )}
      <span className="flex min-w-0 items-center gap-1.5">
        {slot.seed && <em className="shrink-0 text-[8px] font-semibold not-italic text-text-muted">{slot.seed}</em>}
        <strong className={team ? "truncate text-[11px] font-medium text-text-primary" : "truncate text-[10px] font-medium text-text-muted"}>{team?.name || slot.fallbackLabel}</strong>
        {isWinner && <CheckCircle2 className="shrink-0 text-brand" size={11} />}
      </span>
      <strong className={team ? "text-[15px] font-semibold text-brand" : "text-[13px] font-medium text-text-muted"}>{team ? score : "—"}</strong>
    </span>
  );
}

function ScheduleHeaderTeamName({ name, showBallIcon = false }: { name: string; showBallIcon?: boolean }) {
  return (
    <span className="inline-flex w-max min-w-0 max-w-full shrink items-center gap-1 align-middle">
      <strong className="min-w-0 truncate font-semibold text-text-primary">{name}</strong>
      {showBallIcon && <TennisBallIcon className="h-4 w-4" />}
    </span>
  );
}

function MatchDetailPageCard({ match, ballTeamName, draft, canSubmit, canAccessScoreEntry, ownSide, entryLabel, message, saving, backHref, backLabel, onChangeDraft, onSubmit }: { match: TeamCourtScheduleMatch; ballTeamName: string; draft: ScoreDraft; canSubmit: boolean; canAccessScoreEntry: boolean; ownSide: "A" | "B" | null; entryLabel: string; message: string; saving: boolean; backHref: string; backLabel: string; onChangeDraft: (draft: ScoreDraft) => void; onSubmit: () => void }) {
  const showSideBOnLeft = ownSide === "B";
  const fallbackProfilesA = match.playersA.length
    ? match.playersA.map((name, index) => ({ id: `a-${index}`, name, profilePhotoUrl: "" }))
    : [{ id: "team-a", name: match.teamAName, profilePhotoUrl: "" }];
  const fallbackProfilesB = match.playersB.length
    ? match.playersB.map((name, index) => ({ id: `b-${index}`, name, profilePhotoUrl: "" }))
    : [{ id: "team-b", name: match.teamBName, profilePhotoUrl: "" }];
  const profilesA = match.playerProfilesA.length ? match.playerProfilesA : fallbackProfilesA;
  const profilesB = match.playerProfilesB.length ? match.playerProfilesB : fallbackProfilesB;
  const leftProfiles = showSideBOnLeft ? profilesB : profilesA;
  const rightProfiles = showSideBOnLeft ? profilesA : profilesB;
  const leftTeam = showSideBOnLeft ? match.teamBName : match.teamAName;
  const rightTeam = showSideBOnLeft ? match.teamAName : match.teamBName;
  const leftColor = showSideBOnLeft ? match.teamBColor : match.teamAColor;
  const rightColor = showSideBOnLeft ? match.teamAColor : match.teamBColor;
  const leftSide: "A" | "B" = showSideBOnLeft ? "B" : "A";
  const rightSide: "A" | "B" = showSideBOnLeft ? "A" : "B";
  const leftToneVariant = getMatchTeamToneVariant(leftTeam, "outline");
  const rightToneVariant = getMatchTeamToneVariant(rightTeam, leftToneVariant === "outline" ? "solid" : "outline");
  const setOneWinner = getSetWinner(parseOptionalScore(draft.sideASet1), parseOptionalScore(draft.sideBSet1));
  const setTwoWinner = getSetWinner(parseOptionalScore(draft.sideASet2), parseOptionalScore(draft.sideBSet2));
  const straightSetsComplete = Boolean(setOneWinner && setOneWinner === setTwoWinner);
  const scoreSubmitterLabel = match.score?.submittedByName || (match.score?.submittedById ? "Tournament player" : "Tournament admin");
  const updateScoreDraft = (nextDraft: ScoreDraft) => {
    const nextSetOneWinner = getSetWinner(parseOptionalScore(nextDraft.sideASet1), parseOptionalScore(nextDraft.sideBSet1));
    const nextSetTwoWinner = getSetWinner(parseOptionalScore(nextDraft.sideASet2), parseOptionalScore(nextDraft.sideBSet2));
    onChangeDraft(nextSetOneWinner && nextSetOneWinner === nextSetTwoWinner ? { ...nextDraft, sideASet3: "", sideBSet3: "" } : nextDraft);
  };
  return (
    <section className="match-detail-page grid gap-3">
      <article className="match-detail-hero relative overflow-hidden rounded-[24px] border-hairline border-transparent bg-brand-deep p-3 pt-12 text-white sm:p-5 sm:pt-14">
        <Link className="tap-card absolute left-3 top-3 z-10 inline-grid h-8 max-h-8 min-h-8 w-8 min-w-8 max-w-8 place-items-center rounded-full border-hairline border-white/20 bg-white/10 p-0 text-white shadow-[0_8px_18px_rgba(var(--brand-deep-rgb),0.10)]" href={backHref} aria-label={backLabel}>
          <ArrowLeft size={15} />
        </Link>
        <div className="match-detail-content relative grid gap-4">
          <CourtBackdrop />
          <div className="relative grid gap-4">
            <div className="flex min-w-0 flex-wrap items-center justify-center gap-1.5 pl-10 text-[10px] font-medium uppercase tracking-[0.06em] text-white/72 sm:pl-0">
              <MatchIdPill inverse match={match} showLabel />
              <span className="rounded-full bg-white/10 px-2.5 py-1">{match.format}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1">{match.timeLabel || "Time TBD"}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1">{match.courtLabel || "Court TBD"}</span>
            </div>

            <div className="match-detail-players grid grid-cols-[minmax(0,1fr)_34px_minmax(0,1fr)] items-start gap-1 sm:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] sm:gap-3">
              <MatchPlayerSide color={leftColor} matchId={match.id} players={leftProfiles} teamName={leftTeam} />
              <span className="mt-9 grid h-8 w-8 place-items-center justify-self-center rounded-full border-hairline border-white/18 bg-white/10 text-[10px] font-medium text-white/72 sm:mt-12 sm:h-10 sm:w-10 sm:text-[11px]">VS</span>
              <MatchPlayerSide color={rightColor} matchId={match.id} players={rightProfiles} teamName={rightTeam} />
            </div>

            {match.dayNumber === 2 && <div className="flex justify-center"><BallTeamBadge teamName={ballTeamName} pending={!ballTeamName} /></div>}

            <MatchSetScoreboard leftColor={leftColor} leftSide={leftSide} leftTeam={leftTeam} leftToneVariant={leftToneVariant} rightColor={rightColor} rightSide={rightSide} rightTeam={rightTeam} rightToneVariant={rightToneVariant} score={match.score} />
          </div>
        </div>
      </article>

      <article className="match-detail-entry grid gap-3 rounded-[20px] border-hairline border-line bg-white p-3 sm:p-4">
        <div className="match-detail-entry-header grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <span className="grid gap-1">
            <strong className="text-[18px] font-medium text-text-primary">Score entry</strong>
            <em className="text-[13px] not-italic text-text-secondary">Sets 1–2 play to 4. Set 3 is a tie-breaker up to 10.</em>
          </span>
          <span className={canSubmit ? "w-fit rounded-full bg-accent-tint px-3 py-1.5 text-[12px] font-medium text-[var(--accent-ink)]" : "w-fit rounded-full bg-surface px-3 py-1.5 text-[12px] font-medium text-text-secondary"}>{entryLabel}</span>
        </div>

        {canAccessScoreEntry ? (
          <div className="match-detail-entry-form grid gap-2.5">
            <div className="grid grid-cols-[52px_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-2">
              <span aria-hidden="true" />
              <ScoreSideLabel playerNames={leftTeam} color={leftColor} />
              <span className="text-center text-[12px] font-medium text-text-muted">vs</span>
              <ScoreSideLabel playerNames={rightTeam} color={rightColor} />
            </div>
            <div className="grid gap-2">
              <ScoreSetInputs draft={draft} disabled={!canSubmit || saving} leftLabel={leftTeam} leftSide={leftSide} onChange={updateScoreDraft} rightLabel={rightTeam} rightSide={rightSide} setNumber={1} />
              <ScoreSetInputs draft={draft} disabled={!canSubmit || saving} leftLabel={leftTeam} leftSide={leftSide} onChange={updateScoreDraft} rightLabel={rightTeam} rightSide={rightSide} setNumber={2} />
              <ScoreSetInputs draft={draft} disabled={!canSubmit || saving || straightSetsComplete} leftLabel={leftTeam} leftSide={leftSide} onChange={updateScoreDraft} rightLabel={rightTeam} rightSide={rightSide} setNumber={3} optional />
            </div>
            {saving && (
              <p className="inline-flex items-center gap-2 rounded-[14px] border-hairline border-[var(--brand-primary-tint)] bg-[var(--accent-tint)] p-3 text-[13px] font-medium text-brand" role="status" aria-live="polite">
                <RefreshCw className="animate-spin" size={15} />
                Saving score and updating the live bracket…
              </p>
            )}
            {!saving && message && <p className={message.startsWith("Score saved.") ? "rounded-[14px] bg-accent-tint p-3 text-[13px] text-[var(--accent-ink)]" : "rounded-[14px] bg-[var(--warning-tint)] p-3 text-[13px] text-[var(--warning-ink)]"}>{message}</p>}
            <button className="tap-card inline-flex min-h-11 items-center justify-center gap-2 rounded-[15px] bg-brand-primary px-5 text-[14px] font-medium text-white transition hover:bg-brand-mid disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-muted" type="button" onClick={onSubmit} disabled={!canSubmit || saving} aria-busy={saving}>
              {saving && <RefreshCw className="animate-spin" size={16} />}
              {saving ? "Saving score…" : match.score?.winnerSide ? "Update score" : "Submit score"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[32px_minmax(0,1fr)] items-start gap-3 rounded-[16px] border-hairline border-line bg-surface/55 p-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-text-muted"><Info size={15} /></span>
            <span className="grid gap-1">
              <strong className="text-[14px] font-medium text-text-primary">Scores are read only</strong>
              <p className="text-[13px] leading-relaxed text-text-secondary">Only players assigned to this match or tournament admins can submit or edit the result.</p>
            </span>
          </div>
        )}
        {match.score?.submittedAt && (
          <p className="flex min-w-0 flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 border-t-hairline border-line pt-3 text-center text-[11px] text-text-muted">
            <CheckCircle2 className="shrink-0 text-brand" size={13} />
            <span>Score updated by <strong className="font-medium text-text-secondary">{scoreSubmitterLabel}</strong></span>
            <span aria-hidden="true">·</span>
            <time dateTime={match.score.submittedAt}>{formatScoreUpdateTimestamp(match.score.submittedAt)}</time>
          </p>
        )}
      </article>
      <Link className="match-detail-back-bottom tap-card inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[16px] border-hairline border-line bg-white px-5 text-[14px] font-medium text-brand shadow-[0_10px_24px_rgba(var(--brand-deep-rgb), 0.07)] transition hover:border-brand/25 hover:bg-brand-light/35 active:scale-[0.99]" href={backHref} aria-label={backLabel}>
        <ArrowLeft size={16} />
        <span>{backLabel}</span>
      </Link>
    </section>
  );
}

function MatchPlayerSide({ players, teamName, color, matchId }: { players: MatchPlayerProfile[]; teamName: string; color: string; matchId: string }) {
  const tone = getTeamBrandTone(color);
  const isDoubles = players.length > 1;
  return (
    <span className="match-detail-player-side grid min-w-0 justify-items-center gap-2 text-center">
      <span className={`flex items-center justify-center ${isDoubles ? "-space-x-3 sm:-space-x-2" : ""}`}>
        {players.slice(0, 2).map((player) => (
          <span className={isDoubles ? "relative h-14 w-14 overflow-hidden rounded-full border-2 border-[var(--blue-300)] bg-white/14 text-[12px] font-medium text-white sm:h-20 sm:w-20 sm:text-[16px]" : "relative h-[72px] w-[72px] overflow-hidden rounded-full border-2 border-[var(--blue-300)] bg-white/14 text-[15px] font-medium text-white sm:h-24 sm:w-24 sm:text-[18px]"} key={player.id}>
            <Avatar className="relative grid h-full w-full place-items-center overflow-hidden rounded-full bg-white/14 text-white" name={player.name} photoUrl={player.profilePhotoUrl} ariaLabel={`${player.name} profile photo`} sizes={isDoubles ? "(min-width: 640px) 80px, 56px" : "(min-width: 640px) 96px, 72px"} />
          </span>
        ))}
      </span>
      <span className="grid min-w-0 gap-0.5">
        {players.slice(0, 2).map((player) => isFallbackPlayerProfileId(player.id) ? (
          <strong className="break-words text-[12px] font-medium leading-tight text-white sm:text-[15px]" key={player.id}>{player.name}</strong>
        ) : (
          <Link className="tap-card break-words text-[12px] font-medium leading-tight text-white underline decoration-white/25 underline-offset-2 transition hover:decoration-white sm:text-[15px]" href={`/tournaments/players/${player.id}?from=match&match=${matchId}`} key={player.id}>{player.name}</Link>
        ))}
      </span>
      <span className="max-w-full truncate rounded-full border-hairline px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.06em] sm:text-[10px]" style={{ background: tone.background, color: tone.textColor, borderColor: tone.borderColor }}>
        {teamName}
      </span>
    </span>
  );
}

function isFallbackPlayerProfileId(playerId: string) {
  return !playerId || /^(a|b)-\d+$/.test(playerId) || playerId === "team-a" || playerId === "team-b";
}

function MatchSetScoreboard({ score, leftSide, rightSide, leftTeam, rightTeam, leftColor, rightColor, leftToneVariant, rightToneVariant }: { score: MatchScore | null; leftSide: "A" | "B"; rightSide: "A" | "B"; leftTeam: string; rightTeam: string; leftColor: string; rightColor: string; leftToneVariant: TeamToneVariant; rightToneVariant: TeamToneVariant }) {
  const scoresForSide = (side: "A" | "B") => side === "A"
    ? [score?.sideASet1, score?.sideASet2, score?.sideASet3]
    : [score?.sideBSet1, score?.sideBSet2, score?.sideBSet3];
  const leftScores = scoresForSide(leftSide);
  const rightScores = scoresForSide(rightSide);
  const renderScore = (value: number | null | undefined) => value == null ? "—" : value;
  return (
    <div className="match-detail-scoreboard mx-auto grid w-full max-w-[680px] gap-1 rounded-[16px] border-hairline border-white/18 bg-[var(--brand-deep)]/72 p-2 backdrop-blur-md">
      <div className="grid grid-cols-[minmax(0,1fr)_36px_36px_36px] items-center gap-1 px-2 text-center text-[9px] font-medium uppercase tracking-[0.08em] text-white/72 sm:grid-cols-[minmax(0,1fr)_44px_44px_44px]">
        <span className="text-left">Score</span>
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </div>
      {[
        { team: leftTeam, color: leftColor, side: leftSide, values: leftScores, toneVariant: leftToneVariant },
        { team: rightTeam, color: rightColor, side: rightSide, values: rightScores, toneVariant: rightToneVariant }
      ].map((row) => {
        const winner = score?.winnerSide === row.side;
        const tone = getTeamCardTone(row.color, row.toneVariant);
        return (
          <div className={winner ? "grid min-h-10 grid-cols-[minmax(0,1fr)_36px_36px_36px] items-center gap-1 rounded-[11px] bg-white/16 px-2 sm:grid-cols-[minmax(0,1fr)_44px_44px_44px]" : "grid min-h-10 grid-cols-[minmax(0,1fr)_36px_36px_36px] items-center gap-1 rounded-[11px] bg-white/[0.07] px-2 sm:grid-cols-[minmax(0,1fr)_44px_44px_44px]"} key={row.side}>
            <span className="flex min-w-0 items-center gap-2">
              <span className={tone.isOutlined ? "h-2 w-2 shrink-0 rounded-full bg-white" : "h-2 w-2 shrink-0 rounded-full bg-[var(--blue-300)]"} />
              <strong className="truncate text-[11px] font-medium text-white/82 sm:text-[12px]">{row.team}</strong>
              {winner && <Trophy className="shrink-0 text-[var(--accent)]" size={12} aria-label="Winner" />}
            </span>
            {row.values.map((value, index) => (
              <strong className={value == null ? "text-center text-[15px] font-medium text-white/72" : "text-center text-[17px] font-medium text-white"} key={index}>{renderScore(value)}</strong>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function ScoreSideLabel({ playerNames, color }: { playerNames: string; color: string }) {
  const tone = getTeamBrandTone(color);
  return (
    <span className="min-w-0 truncate rounded-[11px] border-hairline px-2 py-1.5 text-center text-[11px] font-medium" style={{ background: tone.background, color: tone.textColor, borderColor: tone.borderColor }}>
      {playerNames}
    </span>
  );
}

function LiveDayOneRound({ nodes }: { nodes: LiveBracketNode[] }) {
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const timeTabsRef = useRef<HTMLDivElement | null>(null);
  const timeCardsRef = useRef<HTMLDivElement | null>(null);
  const groups = nodes.reduce<Array<{ key: string; label: string; nodes: LiveBracketNode[] }>>((list, node) => {
    const key = String(node.timeMinutes[0] ?? node.timeLabel);
    const existing = list.find((group) => group.key === key);
    if (existing) existing.nodes.push(node);
    else list.push({ key, label: node.timeLabel, nodes: [node] });
    return list;
  }, []);
  const playerMatches = nodes.flatMap((node) => node.result.matches);
  const completedMatches = playerMatches.filter((match) => Boolean(match.score?.winnerSide)).length;
  const activeTimeIndex = Math.min(selectedTimeIndex, Math.max(0, groups.length - 1));
  const selectTime = (index: number) => {
    setSelectedTimeIndex(index);
    const card = timeCardsRef.current?.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  return (
    <section className="overflow-hidden rounded-[22px] border-hairline border-line bg-white shadow-[0_14px_34px_rgba(var(--brand-deep-rgb),0.06)]" aria-labelledby="day-one-round-title">
      <div className="grid gap-2.5 border-b-hairline border-line p-3.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
        <span className="grid gap-1">
          <em className="text-[10px] font-medium not-italic uppercase tracking-[0.13em] text-brand">Day 1 · Round 1</em>
          <h2 className="text-[22px] font-medium tracking-[-0.3px] text-text-primary" id="day-one-round-title">Every team and player matchup</h2>
          <p className="max-w-[760px] text-[12px] leading-relaxed text-text-secondary">Follow each time slot from left to right. Every submitted player result updates its team path and the live Day 1 seeding.</p>
        </span>
        <span className="inline-flex w-max items-center gap-2 rounded-full bg-accent-tint px-3 py-1.5 text-[12px] font-medium text-[var(--accent-ink)]">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-deep" />
          {completedMatches} of {playerMatches.length} player matches
        </span>
      </div>

      <div className="grid gap-3 bg-[var(--brand-deep)] p-3 lg:hidden">
        {!!groups.length && (
          <>
            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1" aria-label="Day 1 time slots" ref={timeTabsRef}>
              {groups.map((group, index) => {
                const groupMatches = group.nodes.flatMap((node) => node.result.matches);
                const groupCompleted = groupMatches.filter((match) => Boolean(match.score?.winnerSide)).length;
                return (
                  <button className={index === activeTimeIndex ? "tap-card grid min-w-[94px] snap-start gap-0.5 rounded-[12px] border-hairline border-[var(--accent)] bg-[var(--accent)] px-3 py-2 text-left text-[var(--accent-on)]" : "tap-card grid min-w-[94px] snap-start gap-0.5 rounded-[12px] border-hairline border-white/12 bg-white/[0.07] px-3 py-2 text-left text-white"} type="button" onClick={() => selectTime(index)} aria-pressed={index === activeTimeIndex} key={group.key}>
                    <strong className="text-[12px] font-medium leading-none">{group.label}</strong>
                    <em className={index === activeTimeIndex ? "text-[8px] font-medium not-italic text-white/75" : "text-[8px] font-medium not-italic text-white/72"}>{groupCompleted}/{groupMatches.length} results</em>
                  </button>
                );
              })}
            </div>
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto" ref={timeCardsRef} onScroll={(event) => {
              const scroller = event.currentTarget;
              const cards = Array.from(scroller.children) as HTMLElement[];
              if (!cards.length) return;
              const nextIndex = cards.reduce((closestIndex, card, index) => Math.abs(card.offsetLeft - scroller.scrollLeft) < Math.abs(cards[closestIndex].offsetLeft - scroller.scrollLeft) ? index : closestIndex, 0);
              if (nextIndex === activeTimeIndex) return;
              setSelectedTimeIndex(nextIndex);
              const timeTab = timeTabsRef.current?.children[nextIndex] as HTMLElement | undefined;
              timeTab?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }}>
              {groups.map((group) => (
                <section className="grid min-w-full snap-start content-start gap-2" key={group.key} aria-label={`${group.label} match cards`}>
                  {group.nodes.map((node) => <LiveBracketMatchCard node={node} key={node.id} />)}
                </section>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="hidden overflow-x-auto bg-[var(--brand-deep)] p-4 lg:block">
        <div className="grid w-max grid-flow-col auto-cols-[230px] items-start gap-3">
        {groups.map((group, index) => {
          const groupMatches = group.nodes.flatMap((node) => node.result.matches);
          const groupCompleted = groupMatches.filter((match) => Boolean(match.score?.winnerSide)).length;
          return (
            <section className="relative grid content-start gap-2" key={group.key} aria-label={`${group.label} matchups`}>
              {index > 0 && <span className="pointer-events-none absolute -left-3 top-5 h-px w-3 bg-white/30" aria-hidden="true" />}
              <span className="flex min-h-10 items-center justify-between gap-2 border-b-hairline border-white/12 px-1 pb-2">
                <span className="grid gap-0.5">
                  <strong className="text-[14px] font-medium text-white">{group.label}</strong>
                  <em className="text-[8px] font-medium not-italic uppercase tracking-[0.05em] text-white/72">Time slot {index + 1}</em>
                </span>
                <em className="rounded-full bg-white/10 px-2 py-1 text-[8px] font-medium not-italic uppercase tracking-[0.05em] text-white/72">{groupCompleted}/{groupMatches.length}</em>
              </span>
              <div className="grid gap-2">{group.nodes.map((node) => <LiveBracketMatchCard node={node} key={node.id} />)}</div>
            </section>
          );
        })}
        </div>
      </div>
    </section>
  );
}

function LiveTeamLeaderboard({ standings, completedMatches, matches, seedingIsFinal, seasonYear }: { standings: TeamStanding[]; completedMatches: number; matches: number; seedingIsFinal: boolean; seasonYear: number | null | undefined }) {
  return (
    <section className="overflow-hidden rounded-[22px] border-hairline border-line bg-white shadow-[0_14px_34px_rgba(var(--brand-deep-rgb),0.06)]" aria-labelledby="team-leaderboard-title">
      <div className="grid gap-3 border-b-hairline border-line p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
        <span className="grid gap-1">
          <em className="text-[10px] font-medium not-italic uppercase tracking-[0.13em] text-text-muted">{seasonYear || new Date().getFullYear()} tournament</em>
          <h2 className="text-[22px] font-medium tracking-[-0.3px] text-text-primary" id="team-leaderboard-title">Team leaderboard</h2>
          <p className="text-[12px] leading-relaxed text-text-secondary">Ranked by team-matchup wins, then set percentage, then game percentage.</p>
        </span>
        <span className={seedingIsFinal ? "inline-flex w-max items-center gap-2 rounded-full bg-accent-tint px-3 py-1.5 text-[12px] font-medium text-[var(--accent-ink)]" : "inline-flex w-max items-center gap-2 rounded-full bg-[var(--warning-tint)] px-3 py-1.5 text-[12px] font-medium text-[var(--warning)]"}>
          {seedingIsFinal ? <CheckCircle2 size={14} /> : <RefreshCw size={13} />}
          {seedingIsFinal ? "Final standings" : `${completedMatches} of ${matches} results`}
        </span>
      </div>
      <div className="grid gap-2 bg-[var(--surface)] p-2 sm:gap-1.5 sm:bg-white sm:p-3">
        <div className="hidden grid-cols-[38px_minmax(180px,1fr)_58px_58px_70px_70px] items-center gap-2 px-3 text-[9px] font-medium uppercase tracking-[0.08em] text-text-muted sm:grid">
          <span>Rank</span>
          <span>Team</span>
          <span className="text-center">Wins</span>
          <span className="text-center">Losses</span>
          <span className="text-center">Set %</span>
          <span className="text-center">Game %</span>
        </div>
        {standings.map((standing) => (
          <Link className="tap-card group grid grid-cols-[32px_minmax(0,1fr)] items-center gap-x-2 gap-y-2 rounded-[17px] border-hairline border-line bg-white p-2.5 shadow-[0_6px_18px_rgba(var(--brand-deep-rgb),0.045)] transition hover:bg-brand-light/45 hover:shadow-[0_8px_20px_rgba(var(--brand-deep-rgb), 0.07)] sm:grid-cols-[38px_minmax(180px,1fr)_58px_58px_70px_70px] sm:gap-2 sm:rounded-[15px] sm:bg-surface/38 sm:px-3 sm:shadow-none" style={{ borderLeftColor: getSourceTeamColor(standing.team.jerseyColor), borderLeftWidth: 4 }} href={`/tournaments/schedule/teams/${standing.team.id}?from=team-leaderboard`} aria-label={`View ${standing.team.name} team page`} key={standing.team.id}>
            <strong className="grid h-8 w-8 place-items-center rounded-full border-hairline text-[13px] font-semibold sm:shadow-[inset_0_0_0_1px_rgba(var(--brand-deep-rgb), 0.08)]" style={{ background: getSourceTeamColor(standing.team.jerseyColor), borderColor: getSourceTeamColor(standing.team.jerseyColor), color: getTeamBrandTone(standing.team.jerseyColor).textColor }}>{standing.seed}</strong>
            <span className="grid min-w-0 grid-cols-[40px_minmax(0,1fr)] items-center gap-2.5 sm:grid-cols-[34px_minmax(0,1fr)]">
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-[11px] border-hairline border-line bg-white p-1 shadow-[0_4px_12px_rgba(var(--brand-deep-rgb),0.05)] sm:h-[34px] sm:w-[34px] sm:rounded-[10px] sm:border-0 sm:shadow-[inset_0_0_0_1px_rgba(var(--brand-deep-rgb),0.05)]">
                {standing.team.logoUrl ? <img className="h-full w-full object-contain" src={standing.team.logoUrl} alt="" aria-hidden="true" /> : <span className="text-[10px] font-medium text-brand">{getInitials(standing.team.name)}</span>}
              </span>
              <span className="grid min-w-0 gap-0.5">
                <strong className="flex min-w-0 items-center gap-1.5 text-[14px] font-semibold text-text-primary sm:text-[14px] sm:font-medium"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: getSourceTeamColor(standing.team.jerseyColor) }} aria-hidden="true" /><span className="truncate">{standing.team.name}</span></strong>
                <em className="truncate text-[10px] not-italic text-text-secondary">{standing.completedMatches}/{standing.scheduledMatches} played{standing.tieBreakWins ? ` · ${standing.tieBreakWins} TB wins` : ""}</em>
                {standing.requiresReview && <em className="w-max rounded-full bg-[var(--warning-tint)] px-1.5 py-0.5 text-[8px] font-medium not-italic uppercase tracking-[0.05em] text-[var(--warning)]">Organizer review</em>}
              </span>
            </span>
            <span className="col-span-2 grid grid-cols-4 gap-1 rounded-[11px] border-hairline border-line/70 bg-[var(--surface)] p-1 text-center sm:col-span-1 sm:contents sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
              <LeaderboardMetric label="Wins" value={String(standing.matchWins)} />
              <LeaderboardMetric label="Losses" value={String(standing.matchLosses)} />
              <LeaderboardMetric label="Sets" value={`${formatBracketPercentage(standing.setWinPercentage)}%`} />
              <LeaderboardMetric label="Games" value={`${formatBracketPercentage(standing.gameWinPercentage)}%`} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function LivePlayerLeaderboard({ standings, seasonYear }: { standings: PlayerStanding[]; seasonYear: number | null | undefined }) {
  const tierGroups = Array.from(
    standings.reduce((groups, standing) => {
      const current = groups.get(standing.tierNumber) || [];
      current.push(standing);
      groups.set(standing.tierNumber, current);
      return groups;
    }, new Map<number, PlayerStanding[]>())
  ).sort(([leftTier], [rightTier]) => leftTier - rightTier);
  const submittedResults = standings.reduce((total, standing) => total + standing.completedMatches, 0);

  return (
    <section className="overflow-hidden rounded-[22px] border-hairline border-line bg-white shadow-[0_14px_34px_rgba(var(--brand-deep-rgb),0.06)]" aria-labelledby="player-leaderboard-title">
      <div className="grid gap-2.5 border-b-hairline border-line p-3.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
        <span className="grid gap-1">
          <em className="text-[10px] font-medium not-italic uppercase tracking-[0.13em] text-text-muted">{seasonYear || new Date().getFullYear()} tournament</em>
          <h2 className="text-[22px] font-medium tracking-[-0.3px] text-text-primary" id="player-leaderboard-title">Player leaderboard</h2>
          <p className="max-w-[720px] text-[12px] leading-relaxed text-text-secondary">Rankings restart within each tier: match wins, then set percentage, then game percentage. Singles and doubles results count.</p>
        </span>
        <span className="inline-flex w-max items-center gap-2 rounded-full bg-accent-tint px-3 py-1.5 text-[12px] font-medium text-[var(--accent-ink)]"><RefreshCw size={13} />{submittedResults} player results</span>
      </div>

      <div className="grid gap-2 bg-[var(--surface)] p-2 sm:gap-1.5 sm:bg-white sm:p-3">
        <div className="hidden grid-cols-[38px_minmax(220px,1fr)_58px_58px_70px_70px] items-center gap-2 px-3 text-[9px] font-medium uppercase tracking-[0.08em] text-text-muted sm:grid">
          <span>Rank</span><span>Player</span><span className="text-center">Wins</span><span className="text-center">Losses</span><span className="text-center">Set %</span><span className="text-center">Game %</span>
        </div>
        {tierGroups.map(([tierNumber, tierStandings]) => (
          <Fragment key={tierNumber}>
            <div className="mt-2 flex items-center gap-2 px-1 first:mt-0 sm:px-3">
              <strong className="rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-semibold text-[var(--accent-on)]">{tierNumber === 99 ? "Tier TBD" : `Tier ${tierNumber}`}</strong>
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
              <em className="text-[9px] font-medium not-italic uppercase tracking-[0.08em] text-text-muted">{tierStandings.length} players</em>
            </div>
            {tierStandings.map((standing) => (
              <Link className="tap-card grid grid-cols-[32px_40px_minmax(0,1fr)] items-center gap-x-2 gap-y-2 rounded-[17px] border-hairline border-line bg-white p-2.5 shadow-[0_6px_18px_rgba(var(--brand-deep-rgb),0.045)] transition hover:border-brand/25 hover:bg-brand-light/45 sm:grid-cols-[38px_38px_minmax(180px,1fr)_58px_58px_70px_70px] sm:gap-2 sm:rounded-[15px] sm:bg-surface/38 sm:px-3 sm:shadow-none" href={`/tournaments/players/${standing.player.playerId}?from=player-leaderboard`} aria-label={`View ${standing.player.name} player profile`} key={`${standing.team.id}:${standing.player.playerId || standing.player.id}`}>
                <strong className="grid h-8 w-8 place-items-center rounded-full border-hairline border-brand/12 bg-[var(--surface)] text-[13px] font-semibold text-brand sm:bg-white sm:shadow-[inset_0_0_0_1px_rgba(var(--brand-deep-rgb), 0.08)]">{standing.tierRank}</strong>
                <Avatar className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-brand-deep text-[9px] font-medium text-white ring-2 ring-white shadow-[0_4px_12px_rgba(var(--brand-deep-rgb),0.08)] sm:h-[38px] sm:w-[38px] sm:ring-0 sm:shadow-none" name={standing.player.name} photoUrl={standing.player.profilePhotoUrl || undefined} sizes="40px" />
                <span className="grid min-w-0 gap-0.5">
                  <strong className="truncate text-[14px] font-semibold text-text-primary sm:text-[14px] sm:font-medium">{standing.player.name}</strong>
                  <em className="truncate text-[10px] not-italic text-text-secondary">{standing.team.name} · {standing.completedMatches} played</em>
                </span>
                <span className="col-span-3 grid grid-cols-4 gap-1 rounded-[11px] border-hairline border-line/70 bg-[var(--surface)] p-1 text-center sm:col-span-1 sm:contents sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
                  <LeaderboardMetric label="Wins" value={String(standing.matchWins)} />
                  <LeaderboardMetric label="Losses" value={String(standing.matchLosses)} />
                  <LeaderboardMetric label="Sets" value={`${formatBracketPercentage(standing.setWinPercentage)}%`} />
                  <LeaderboardMetric label="Games" value={`${formatBracketPercentage(standing.gameWinPercentage)}%`} />
                </span>
              </Link>
            ))}
          </Fragment>
        ))}
      </div>
    </section>
  );
}

function LeaderboardMetric({ label, value }: { label: string; value: string }) {
  return (
    <span className="grid min-w-0 gap-1 rounded-[8px] bg-white/80 px-1 py-1.5 shadow-[inset_0_0_0_1px_rgba(var(--brand-deep-rgb), 0.035)] sm:bg-transparent sm:p-0 sm:shadow-none">
      <strong className="truncate text-[13px] font-semibold leading-none text-brand sm:text-[13px]">{value}</strong>
      <em className="text-[7px] font-semibold not-italic uppercase tracking-[0.055em] text-text-muted sm:hidden">{label}</em>
    </span>
  );
}

function LiveBracketBoard({ stages, selectedStage, seedingStatus, onSelectStage }: { stages: LiveBracketStage[]; selectedStage: BracketStageKey; seedingStatus: "waiting" | "projected" | "final"; onSelectStage: (stage: BracketStageKey) => void }) {
  const selectedIndex = Math.max(0, stages.findIndex((stage) => stage.key === selectedStage));
  const stageTabsRef = useRef<HTMLDivElement | null>(null);
  const stageCardsRef = useRef<HTMLDivElement | null>(null);
  const finalNode = stages.find((stage) => stage.key === "final")?.nodes[0];
  const championSlot = finalNode ? [finalNode.sideA, finalNode.sideB].find((slot) => slot.team?.id === finalNode.result.winnerTeamId) : null;
  const selectStage = (index: number) => {
    onSelectStage(stages[index].key);
    const card = stageCardsRef.current?.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  return (
    <section className="overflow-hidden rounded-[22px] border-hairline border-line bg-white text-text-primary shadow-[0_14px_34px_rgba(var(--brand-deep-rgb),0.06)]" aria-labelledby="live-bracket-title">
      <div className="grid gap-3 border-b-hairline border-line p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
        <span className="grid gap-1">
          <em className="text-[10px] font-medium not-italic uppercase tracking-[0.13em] text-brand">Day 2 · Championship path</em>
          <h2 className="text-[22px] font-medium tracking-[-0.3px] text-text-primary" id="live-bracket-title">Live team bracket</h2>
          <p className="max-w-[760px] text-[12px] leading-relaxed text-text-secondary">{seedingStatus === "waiting" ? "Quarterfinal slots stay as seed placeholders until the first Day 1 result is submitted." : seedingStatus === "projected" ? "Quarterfinal teams are projected from the live Day 1 leaderboard and will keep changing as scores arrive." : "Day 1 seeding is complete. Green rows show teams advancing through the final draw."}</p>
        </span>
        <span className="inline-flex w-max items-center gap-2 rounded-full bg-accent-tint px-3 py-1.5 text-[12px] font-medium text-[var(--accent-ink)]">
          {seedingStatus === "final" ? <CheckCircle2 size={14} /> : <RefreshCw size={13} />}
          {seedingStatus === "final" ? "Final seeds" : seedingStatus === "projected" ? "Live projection" : "Awaiting Day 1"}
        </span>
      </div>

      {championSlot?.team && (
        <div className="grid gap-3 border-b-hairline border-white/10 bg-[var(--brand-deep)] p-3 text-white sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5">
          <span className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-on)]"><Trophy size={20} /></span>
            <span className="grid min-w-0 gap-0.5">
              <em className="text-[9px] font-medium not-italic uppercase tracking-[0.1em] text-[var(--accent)]">Tournament champions</em>
              <strong className="truncate text-[18px] font-medium text-white">{championSlot.team.name}</strong>
            </span>
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/75">Won by {finalNode?.result.decidedBy}</span>
        </div>
      )}

      <div className="grid gap-3 bg-[var(--brand-deep)] p-3 lg:hidden">
        <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1" aria-label="Day 2 bracket stages" ref={stageTabsRef}>
          {stages.map((stage, index) => (
            <button className={index === selectedIndex ? "tap-card grid min-w-[118px] snap-start gap-0.5 rounded-[12px] border-hairline border-[var(--accent)] bg-[var(--accent)] px-3 py-2 text-left text-[var(--accent-on)]" : "tap-card grid min-w-[118px] snap-start gap-0.5 rounded-[12px] border-hairline border-white/12 bg-white/[0.07] px-3 py-2 text-left text-white"} type="button" onClick={() => selectStage(index)} aria-pressed={index === selectedIndex} key={stage.key}>
              <strong className="truncate text-[12px] font-medium leading-none">{stage.label}</strong>
              <em className={index === selectedIndex ? "text-[8px] font-medium not-italic text-white/75" : "text-[8px] font-medium not-italic text-white/72"}>{stage.nodes.length} {stage.nodes.length === 1 ? "matchup" : "matchups"}</em>
            </button>
          ))}
        </div>
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto" ref={stageCardsRef} onScroll={(event) => {
          const scroller = event.currentTarget;
          const cards = Array.from(scroller.children) as HTMLElement[];
          if (!cards.length) return;
          const nextIndex = cards.reduce((closestIndex, card, index) => Math.abs(card.offsetLeft - scroller.scrollLeft) < Math.abs(cards[closestIndex].offsetLeft - scroller.scrollLeft) ? index : closestIndex, 0);
          if (nextIndex === selectedIndex) return;
          onSelectStage(stages[nextIndex].key);
          const stageTab = stageTabsRef.current?.children[nextIndex] as HTMLElement | undefined;
          stageTab?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }}>
          {stages.map((stage) => <div className="min-w-full snap-start" key={stage.key}><BracketStageColumn hideHeading stage={stage} /></div>)}
        </div>
      </div>

      <div className="hidden overflow-x-auto bg-[var(--brand-deep)] p-4 lg:block">
        <div className="grid min-w-[1180px] grid-cols-5 gap-3">
          {stages.map((stage, index) => (
            <div className="relative grid content-center gap-3" key={stage.key}>
              {index > 0 && <span className="pointer-events-none absolute -left-3 top-1/2 h-px w-3 bg-white/30" aria-hidden="true" />}
              <BracketStageColumn stage={stage} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BracketStageColumn({ stage, hideHeading = false }: { stage: LiveBracketStage; hideHeading?: boolean }) {
  return (
    <section className="grid min-w-0 content-center gap-2.5" aria-label={stage.label}>
      {!hideHeading && <span className="grid gap-0.5 border-b-hairline border-white/12 px-1 pb-2">
        <strong className="text-[14px] font-medium text-white">{stage.label}</strong>
        <em className="text-[9px] not-italic text-white/72">{stage.helper}</em>
      </span>}
      <div className="grid gap-2.5">
        {stage.nodes.map((node) => <LiveBracketMatchCard node={node} key={node.id} />)}
      </div>
    </section>
  );
}

function LiveBracketMatchCard({ node }: { node: LiveBracketNode }) {
  const hasTeams = Boolean(node.sideA.team && node.sideB.team);
  const hasWinner = Boolean(node.result.winnerTeamId);
  const sideAWon = node.result.winnerTeamId === node.sideA.team?.id;
  const sideBWon = node.result.winnerTeamId === node.sideB.team?.id;
  const status = node.result.decidedBy === "organizer review" ? "Needs review" : hasWinner ? "Completed" : node.result.completedMatches ? "Ongoing" : hasTeams ? "Not started" : "Awaiting teams";
  const statusClass = status === "Completed"
    ? "bg-accent-tint text-[var(--accent-ink)]"
    : status === "Ongoing"
      ? "bg-[var(--accent)] text-[var(--accent-on)]"
      : status === "Needs review"
        ? "bg-[var(--warning-tint)] text-[var(--warning)]"
        : status === "Awaiting teams"
          ? "bg-[var(--brand-primary-tint)] text-[var(--mist)]"
          : "bg-white text-text-muted";
  return (
    <article className="relative overflow-hidden rounded-[16px] border-hairline border-white/16 bg-white/[0.96] text-text-primary shadow-[0_12px_28px_rgba(var(--brand-deep-rgb),0.16)]">
      <div className="flex items-center justify-between gap-2 border-b-hairline border-line bg-[var(--surface)] px-2.5 py-1.5">
        <span className="min-w-0">
          <strong className="block truncate text-[10px] font-semibold uppercase tracking-[0.06em] text-brand">{node.label}</strong>
          <em className="block truncate text-[9px] not-italic text-text-muted">{node.timeLabel}</em>
        </span>
        <span className={`${statusClass} shrink-0 rounded-full px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.05em]`}>{status}</span>
      </div>
      <div className="grid divide-y divide-line">
        <BracketTeamRow destination={getBracketTeamDestination(node, sideAWon)} isWinner={sideAWon} matchWins={node.result.matchWinsA} slot={node.sideA} />
        <BracketTeamRow destination={getBracketTeamDestination(node, sideBWon)} isWinner={sideBWon} matchWins={node.result.matchWinsB} slot={node.sideB} />
      </div>
      {!!node.result.matches.length && (
        <div className="grid gap-1 border-t-hairline border-line bg-surface/45 p-1.5">
          {node.result.matches.map((match) => {
            const pausedFinalMatch = node.phase === "Final" && hasWinner && !match.score?.winnerSide;
            return pausedFinalMatch ? (
              <span className="grid min-h-9 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-[8px] bg-white/60 px-2 py-1.5" key={match.id}>
                <span className="grid min-w-0 gap-0.5">
                  <span className="flex min-w-0 flex-wrap items-center gap-1 text-[9px] font-medium text-text-primary">
                    <BracketPlayerProfileNames fallback={match.teamAName} match={match} players={match.playerProfilesA} />
                    <em className="not-italic text-text-muted">vs</em>
                    <BracketPlayerProfileNames fallback={match.teamBName} match={match} players={match.playerProfilesB} />
                  </span>
                  <em className="truncate text-[8px] not-italic text-text-muted">{match.tierRule || match.format} · {match.courtLabel || "Court TBD"}</em>
                </span>
                <strong className="text-[9px] font-semibold uppercase tracking-[0.04em] text-text-muted">Paused</strong>
              </span>
            ) : (
              <ScheduleBracketMatchLink match={match} node={node} key={match.id} />
            );
          })}
        </div>
      )}
      {hasWinner && <span className="absolute bottom-0 left-0 top-[43px] w-0.5 bg-[var(--accent)]" aria-hidden="true" />}
    </article>
  );
}

function getBracketTeamDestination(node: LiveBracketNode, isWinner: boolean) {
  const isResolved = Boolean(node.result.winnerTeamId);
  if (node.phase === "Day 1") {
    if (!isResolved) return "Feeds live leaderboard";
    return isWinner ? "+1 win · leaderboard updated" : "Result · leaderboard updated";
  }
  const pendingPaths: Record<string, string> = {
    Quarterfinal: "Win → Advantage · Loss → Survival",
    Advantage: "Win → Semifinal · Loss → Re-entry",
    Survival: "Win → Re-entry · Loss → Eliminated",
    "Re-entry": "Win → Semifinal · Loss → Eliminated",
    Semifinal: "Win → Final · Loss → Eliminated",
    Final: "Win → Champion"
  };
  if (!isResolved) return pendingPaths[node.phase] || "Waiting for result";
  const resolvedPaths: Record<string, [string, string]> = {
    Quarterfinal: ["Advances to Advantage", "Moves to Survival"],
    Advantage: ["Advances to Semifinal", "Moves to Re-entry"],
    Survival: ["Advances to Re-entry", "Eliminated"],
    "Re-entry": ["Advances to Semifinal", "Eliminated"],
    Semifinal: ["Advances to Final", "Eliminated"],
    Final: ["Champion", "Runner-up"]
  };
  const destinations = resolvedPaths[node.phase];
  return destinations ? destinations[isWinner ? 0 : 1] : "Result recorded";
}

function BracketTeamRow({ slot, matchWins, isWinner, destination }: { slot: BracketSlot; matchWins: number; isWinner: boolean; destination: string }) {
  const team = slot.team;
  const isEliminated = destination === "Eliminated" || destination === "Runner-up";
  return (
    <span className={isWinner ? "grid min-h-12 grid-cols-[26px_minmax(0,1fr)_auto] items-center gap-2 bg-[var(--brand-primary-tint)] px-2.5 py-2" : "grid min-h-12 grid-cols-[26px_minmax(0,1fr)_auto] items-center gap-2 px-2.5 py-2"}>
      {team?.logoUrl ? (
        <span className="grid h-6 w-6 place-items-center overflow-hidden rounded-[7px] bg-white p-0.5 shadow-[inset_0_0_0_1px_rgba(var(--brand-deep-rgb),0.05)]"><img className="h-full w-full object-contain" src={team.logoUrl} alt="" aria-hidden="true" /></span>
      ) : (
        <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-surface text-[8px] font-semibold text-brand">{team ? getInitials(team.name) : "—"}</span>
      )}
      <span className="grid min-w-0 gap-0.5">
        <span className="flex min-w-0 items-center gap-1.5">
          {slot.seed && <em className="shrink-0 text-[8px] font-semibold not-italic text-text-muted">{slot.seed}</em>}
          <strong className={team ? "truncate text-[11px] font-medium text-text-primary" : "truncate text-[10px] font-medium text-text-muted"}>{team?.name || slot.fallbackLabel}</strong>
          {isWinner && <CheckCircle2 size={11} className="shrink-0 text-brand" />}
        </span>
        {team && (
          <em className={isEliminated ? "flex min-w-0 items-center gap-1 text-[7px] font-medium not-italic uppercase tracking-[0.035em] text-text-muted" : "flex min-w-0 items-center gap-1 text-[7px] font-medium not-italic uppercase tracking-[0.035em] text-[var(--accent-ink)]"}>
            <span className="h-px w-3 shrink-0 bg-current opacity-50" aria-hidden="true" />
            <span className="truncate">{destination}</span>
            {!isEliminated && <ArrowRight className="shrink-0" size={8} aria-hidden="true" />}
          </em>
        )}
      </span>
      <strong className={team ? "text-[16px] font-semibold leading-none text-brand" : "text-[14px] font-medium text-text-muted"}>{team && matchWins ? matchWins : team ? "0" : "—"}</strong>
    </span>
  );
}

function buildDayOneRoundNodes(teams: PublishedTeam[], matches: TeamCourtScheduleMatch[]): LiveBracketNode[] {
  const grouped = new Map<string, TeamCourtScheduleMatch[]>();
  matches.forEach((match) => {
    const pair = [match.teamAId || normalizeName(match.teamAName), match.teamBId || normalizeName(match.teamBName)].sort().join(":");
    const key = `${getScheduleTimeSortValue(match.timeLabel)}:${pair}`;
    grouped.set(key, [...(grouped.get(key) || []), match]);
  });
  return Array.from(grouped.entries()).map(([key, teamMatches]) => {
    const orderedMatches = teamMatches.slice().sort((left, right) => left.sortOrder - right.sortOrder || left.courtLabel.localeCompare(right.courtLabel));
    const firstMatch = orderedMatches[0];
    const teamA = teams.find((team) => team.id === firstMatch.teamAId) || null;
    const teamB = teams.find((team) => team.id === firstMatch.teamBId) || null;
    const sideA: BracketSlot = { team: teamA, seed: null, fallbackLabel: firstMatch.teamAName || "Team A" };
    const sideB: BracketSlot = { team: teamB, seed: null, fallbackLabel: firstMatch.teamBName || "Team B" };
    return {
      id: `day-one:${key}`,
      label: "Team matchup",
      phase: "Day 1",
      timeLabel: firstMatch.timeLabel,
      timeMinutes: [getScheduleTimeSortValue(firstMatch.timeLabel)],
      sideA,
      sideB,
      result: getTeamTieResult(sideA, sideB, orderedMatches)
    };
  }).sort((left, right) => left.timeMinutes[0] - right.timeMinutes[0] || left.label.localeCompare(right.label));
}

function getLiveTeamStandings(teams: PublishedTeam[], matches: TeamCourtScheduleMatch[]): TeamStanding[] {
  const teamMatchupResults = getTeamMatchupResults(teams, matches);
  const rawStandings = teams.map((team) => {
    const teamMatches = matches.filter((match) => match.teamAId === team.id || match.teamBId === team.id);
    const metrics = teamMatches.reduce((total, match) => addTeamScoreMetrics(total, getTeamScoreMetrics(match, team.id)), getEmptyTeamScoreMetrics());
    const matchupWins = teamMatchupResults.filter((result) => result.winnerTeamId === team.id).length;
    const matchupLosses = teamMatchupResults.filter((result) => result.loserTeamId === team.id).length;
    const setTotal = metrics.setsWon + metrics.setsLost;
    const gameTotal = metrics.gamesWon + metrics.gamesLost;
    return {
      team,
      seed: 0,
      completedMatches: metrics.completedMatches,
      scheduledMatches: teamMatches.length,
      matchWins: matchupWins,
      matchLosses: matchupLosses,
      setsWon: metrics.setsWon,
      setsLost: metrics.setsLost,
      gamesWon: metrics.gamesWon,
      gamesLost: metrics.gamesLost,
      tieBreakWins: metrics.tieBreakWins,
      setWinPercentage: setTotal ? (metrics.setsWon / setTotal) * 100 : 0,
      gameWinPercentage: gameTotal ? (metrics.gamesWon / gameTotal) * 100 : 0,
      requiresReview: false
    };
  }).sort(compareTeamStandings);
  const allResultsComplete = rawStandings.length > 0 && rawStandings.every((standing) => standing.scheduledMatches > 0 && standing.completedMatches === standing.scheduledMatches);
  return rawStandings.map((standing, index, sorted) => {
    const tiedWithNeighbor = allResultsComplete && [sorted[index - 1], sorted[index + 1]].filter(Boolean).some((neighbor) => standingsRankingIsEqual(standing, neighbor));
    return { ...standing, seed: index + 1, requiresReview: tiedWithNeighbor };
  });
}

function getTeamMatchupResults(teams: PublishedTeam[], matches: TeamCourtScheduleMatch[]) {
  const grouped = new Map<string, TeamCourtScheduleMatch[]>();
  matches.forEach((match) => {
    const pair = [match.teamAId || normalizeName(match.teamAName), match.teamBId || normalizeName(match.teamBName)].sort().join(":");
    const round = match.dayNumber === 2 ? normalizeName(match.matchType || "day-2") : String(getScheduleTimeSortValue(match.timeLabel));
    const key = `${match.dayNumber}:${round}:${pair}`;
    grouped.set(key, [...(grouped.get(key) || []), match]);
  });
  return Array.from(grouped.values()).map((teamMatches) => {
    const firstMatch = teamMatches[0];
    const teamA = teams.find((team) => team.id === firstMatch.teamAId) || null;
    const teamB = teams.find((team) => team.id === firstMatch.teamBId) || null;
    const sideA: BracketSlot = { team: teamA, seed: null, fallbackLabel: firstMatch.teamAName || "Team A" };
    const sideB: BracketSlot = { team: teamB, seed: null, fallbackLabel: firstMatch.teamBName || "Team B" };
    return getTeamTieResult(sideA, sideB, teamMatches, firstMatch.matchType === "Final" ? 6 : 3);
  });
}

function getLivePlayerStandings(teams: PublishedTeam[], matches: TeamCourtScheduleMatch[]): PlayerStanding[] {
  type PlayerStandingDraft = Omit<PlayerStanding, "tierRank" | "setWinPercentage" | "gameWinPercentage">;
  const drafts = new Map<string, PlayerStandingDraft>();
  const getPlayerKey = (team: PublishedTeam, member: PublishedTeamMember) => member.playerId || `${team.id}:${normalizeName(member.name)}`;

  teams.forEach((team) => {
    team.members.forEach((player) => {
      const tierNumber = Number(player.tier.match(/\d+/)?.[0] || 99);
      drafts.set(getPlayerKey(team, player), {
        player,
        team,
        tier: tierNumber === 99 ? "Tier TBD" : `Tier ${tierNumber}`,
        tierNumber,
        completedMatches: 0,
        matchWins: 0,
        matchLosses: 0,
        setsWon: 0,
        setsLost: 0,
        gamesWon: 0,
        gamesLost: 0,
        tieBreakWins: 0
      });
    });
  });

  matches.forEach((match) => {
    ([
      { teamId: match.teamAId, profiles: match.playerProfilesA, side: "A" as const },
      { teamId: match.teamBId, profiles: match.playerProfilesB, side: "B" as const }
    ]).forEach(({ teamId, profiles, side }) => {
      const team = teams.find((candidate) => candidate.id === teamId);
      if (!team) return;
      const result = getSideScoreMetrics(match, side);
      profiles.forEach((profile) => {
        const member = team.members.find((candidate) => candidate.playerId && candidate.playerId === profile.id)
          || team.members.find((candidate) => normalizeName(candidate.name) === normalizeName(profile.name));
        if (!member) return;
        const key = getPlayerKey(team, member);
        const current = drafts.get(key);
        if (!current) return;
        drafts.set(key, {
          ...current,
          completedMatches: current.completedMatches + result.completedMatches,
          matchWins: current.matchWins + result.matchWins,
          matchLosses: current.matchLosses + result.matchLosses,
          setsWon: current.setsWon + result.setsWon,
          setsLost: current.setsLost + result.setsLost,
          gamesWon: current.gamesWon + result.gamesWon,
          gamesLost: current.gamesLost + result.gamesLost,
          tieBreakWins: current.tieBreakWins + result.tieBreakWins
        });
      });
    });
  });

  const ranked = Array.from(drafts.values()).map((standing) => {
    const setTotal = standing.setsWon + standing.setsLost;
    const gameTotal = standing.gamesWon + standing.gamesLost;
    return {
      ...standing,
      tierRank: 0,
      setWinPercentage: setTotal ? (standing.setsWon / setTotal) * 100 : 0,
      gameWinPercentage: gameTotal ? (standing.gamesWon / gameTotal) * 100 : 0
    };
  }).sort((left, right) => left.tierNumber - right.tierNumber
    || right.matchWins - left.matchWins
    || right.setWinPercentage - left.setWinPercentage
    || right.gameWinPercentage - left.gameWinPercentage
    || right.completedMatches - left.completedMatches
    || left.player.name.localeCompare(right.player.name));

  const tierPositions = new Map<number, { position: number; rank: number; previous: PlayerStanding | null }>();
  return ranked.map((standing) => {
    const tierState = tierPositions.get(standing.tierNumber) || { position: 0, rank: 0, previous: null };
    const position = tierState.position + 1;
    const sharesPreviousRank = Boolean(tierState.previous
      && standing.matchWins === tierState.previous.matchWins
      && Math.abs(standing.setWinPercentage - tierState.previous.setWinPercentage) < 0.0001
      && Math.abs(standing.gameWinPercentage - tierState.previous.gameWinPercentage) < 0.0001
      && standing.completedMatches === tierState.previous.completedMatches);
    const tierRank = sharesPreviousRank ? tierState.rank : position;
    tierPositions.set(standing.tierNumber, { position, rank: tierRank, previous: standing });
    return { ...standing, tierRank };
  });
}

type TeamScoreMetrics = { completedMatches: number; matchWins: number; matchLosses: number; setsWon: number; setsLost: number; gamesWon: number; gamesLost: number; tieBreakWins: number };

function getEmptyTeamScoreMetrics(): TeamScoreMetrics {
  return { completedMatches: 0, matchWins: 0, matchLosses: 0, setsWon: 0, setsLost: 0, gamesWon: 0, gamesLost: 0, tieBreakWins: 0 };
}

function addTeamScoreMetrics(total: TeamScoreMetrics, next: TeamScoreMetrics): TeamScoreMetrics {
  return {
    completedMatches: total.completedMatches + next.completedMatches,
    matchWins: total.matchWins + next.matchWins,
    matchLosses: total.matchLosses + next.matchLosses,
    setsWon: total.setsWon + next.setsWon,
    setsLost: total.setsLost + next.setsLost,
    gamesWon: total.gamesWon + next.gamesWon,
    gamesLost: total.gamesLost + next.gamesLost,
    tieBreakWins: total.tieBreakWins + next.tieBreakWins
  };
}

function getTeamScoreMetrics(match: TeamCourtScheduleMatch, teamId: string): TeamScoreMetrics {
  const side = match.teamAId === teamId ? "A" : match.teamBId === teamId ? "B" : "";
  return side ? getSideScoreMetrics(match, side) : getEmptyTeamScoreMetrics();
}

function getSideScoreMetrics(match: TeamCourtScheduleMatch, side: "A" | "B"): TeamScoreMetrics {
  const metrics = getEmptyTeamScoreMetrics();
  const score = match.score;
  if (!score?.winnerSide) return metrics;
  metrics.completedMatches = 1;
  if (score.winnerSide === side) metrics.matchWins = 1;
  else metrics.matchLosses = 1;
  const ownScores = side === "A" ? [score.sideASet1, score.sideASet2, score.sideASet3] : [score.sideBSet1, score.sideBSet2, score.sideBSet3];
  const opponentScores = side === "A" ? [score.sideBSet1, score.sideBSet2, score.sideBSet3] : [score.sideASet1, score.sideASet2, score.sideASet3];
  const setOneWinner = getSetWinner(score.sideASet1, score.sideBSet1);
  const setTwoWinner = getSetWinner(score.sideASet2, score.sideBSet2);
  const thirdSetWasRequired = Boolean(setOneWinner && setTwoWinner && setOneWinner !== setTwoWinner);
  ownScores.forEach((ownScore, index) => {
    if (index === 2 && !thirdSetWasRequired) return;
    const opponentScore = opponentScores[index];
    if (ownScore == null || opponentScore == null || ownScore === opponentScore) return;
    const wonSet = ownScore > opponentScore;
    if (wonSet) metrics.setsWon += 1;
    else metrics.setsLost += 1;
    if (index < 2) {
      metrics.gamesWon += ownScore;
      metrics.gamesLost += opponentScore;
    } else {
      if (wonSet) {
        metrics.gamesWon += 1;
        metrics.tieBreakWins += 1;
      } else {
        metrics.gamesLost += 1;
      }
    }
  });
  return metrics;
}

function compareTeamStandings(left: Omit<TeamStanding, "seed">, right: Omit<TeamStanding, "seed">) {
  return right.matchWins - left.matchWins
    || right.setWinPercentage - left.setWinPercentage
    || right.gameWinPercentage - left.gameWinPercentage
    || left.team.sortOrder - right.team.sortOrder
    || left.team.name.localeCompare(right.team.name);
}

function standingsRankingIsEqual(left: Pick<TeamStanding, "matchWins" | "setWinPercentage" | "gameWinPercentage">, right: Pick<TeamStanding, "matchWins" | "setWinPercentage" | "gameWinPercentage">) {
  return left.matchWins === right.matchWins
    && Math.abs(left.setWinPercentage - right.setWinPercentage) < 0.0001
    && Math.abs(left.gameWinPercentage - right.gameWinPercentage) < 0.0001;
}

function getTournamentChampion(teams: PublishedTeam[], matches: TeamCourtScheduleMatch[]) {
  const dayOneMatches = matches.filter((match) => match.dayNumber === 1);
  const dayTwoMatches = matches.filter((match) => match.dayNumber === 2);
  const standings = getLiveTeamStandings(teams, dayOneMatches);
  const dayOneIsFinal = Boolean(dayOneMatches.length
    && dayOneMatches.every((match) => Boolean(match.score?.winnerSide))
    && !standings.some((standing) => standing.requiresReview));
  if (!dayOneIsFinal) return null;
  return getTournamentChampionFromStages(buildLiveTeamBracket(standings, dayTwoMatches, true));
}

function getTournamentChampionFromStages(stages: LiveBracketStage[]) {
  const finalNode = stages.find((stage) => stage.key === "final")?.nodes[0];
  if (!finalNode?.result.winnerTeamId) return null;
  return [finalNode.sideA.team, finalNode.sideB.team].find((team) => team?.id === finalNode.result.winnerTeamId) || null;
}

function buildLiveTeamBracket(standings: TeamStanding[], dayTwoMatches: TeamCourtScheduleMatch[], revealProjectedTeams: boolean): LiveBracketStage[] {
  const seedSlot = (seed: number): BracketSlot => {
    const standing = standings[seed - 1];
    return { team: revealProjectedTeams ? standing?.team || null : null, seed: standing?.seed || seed, fallbackLabel: `Seed ${seed}` };
  };
  const makeNode = (id: string, label: string, phase: string, timeLabel: string, timeMinutes: number[], sideA: BracketSlot, sideB: BracketSlot): LiveBracketNode => {
    const nodeMatches = findBracketNodeMatches(dayTwoMatches, sideA.team?.id || "", sideB.team?.id || "", timeMinutes);
    return { id, label, phase, timeLabel, timeMinutes, sideA, sideB, result: getTeamTieResult(sideA, sideB, nodeMatches, phase === "Final" ? 6 : 3) };
  };
  const outcomeSlot = (node: LiveBracketNode, outcome: "winner" | "loser", fallbackLabel: string): BracketSlot => {
    const teamId = outcome === "winner" ? node.result.winnerTeamId : node.result.loserTeamId;
    const source = [node.sideA, node.sideB].find((slot) => slot.team?.id === teamId);
    return source ? { ...source, fallbackLabel } : { team: null, seed: null, fallbackLabel };
  };

  const qf1 = makeNode("qf1", "Quarterfinal 1", "Quarterfinal", "9:00 AM", [540], seedSlot(1), seedSlot(8));
  const qf2 = makeNode("qf2", "Quarterfinal 2", "Quarterfinal", "9:00 AM", [540], seedSlot(4), seedSlot(5));
  const qf3 = makeNode("qf3", "Quarterfinal 3", "Quarterfinal", "10:10 AM", [610], seedSlot(3), seedSlot(6));
  const qf4 = makeNode("qf4", "Quarterfinal 4", "Quarterfinal", "10:10 AM", [610], seedSlot(2), seedSlot(7));
  const survival1 = makeNode("survival1", "Survival 1", "Survival", "11:20 AM", [680], outcomeSlot(qf1, "loser", "QF1 loser"), outcomeSlot(qf2, "loser", "QF2 loser"));
  const survival2 = makeNode("survival2", "Survival 2", "Survival", "11:20 AM", [680], outcomeSlot(qf3, "loser", "QF3 loser"), outcomeSlot(qf4, "loser", "QF4 loser"));
  const advantage1 = makeNode("advantage1", "Advantage 1", "Advantage", "12:30 PM", [750], outcomeSlot(qf1, "winner", "QF1 winner"), outcomeSlot(qf2, "winner", "QF2 winner"));
  const advantage2 = makeNode("advantage2", "Advantage 2", "Advantage", "12:30 PM", [750], outcomeSlot(qf3, "winner", "QF3 winner"), outcomeSlot(qf4, "winner", "QF4 winner"));
  const reentry1 = makeNode("reentry1", "Re-entry 1", "Re-entry", "1:40 PM", [820], outcomeSlot(survival1, "winner", "Survival 1 winner"), outcomeSlot(advantage2, "loser", "Advantage 2 loser"));
  const reentry2 = makeNode("reentry2", "Re-entry 2", "Re-entry", "1:40 PM", [820], outcomeSlot(survival2, "winner", "Survival 2 winner"), outcomeSlot(advantage1, "loser", "Advantage 1 loser"));
  const semifinal1 = makeNode("semifinal1", "Semifinal 1", "Semifinal", "2:50 PM", [890], outcomeSlot(advantage1, "winner", "Advantage 1 winner"), outcomeSlot(reentry2, "winner", "Re-entry 2 winner"));
  const semifinal2 = makeNode("semifinal2", "Semifinal 2", "Semifinal", "2:50 PM", [890], outcomeSlot(advantage2, "winner", "Advantage 2 winner"), outcomeSlot(reentry1, "winner", "Re-entry 1 winner"));
  const final = makeNode("final", "Championship final", "Final", "4:00 PM & 5:10 PM", [960, 1030], outcomeSlot(semifinal1, "winner", "Semifinal 1 winner"), outcomeSlot(semifinal2, "winner", "Semifinal 2 winner"));

  return [
    { key: "quarterfinals", label: "Quarterfinals", helper: "Seeds 1–8 enter the draw", nodes: [qf1, qf2, qf3, qf4] },
    { key: "second-chance", label: "Advantage + Survival", helper: "Winners and losers split paths", nodes: [advantage1, survival1, advantage2, survival2] },
    { key: "re-entry", label: "Re-entry", helper: "One more route to the semifinals", nodes: [reentry1, reentry2] },
    { key: "semifinals", label: "Semifinals", helper: "Four teams remain", nodes: [semifinal1, semifinal2] },
    { key: "final", label: "Final", helper: "The championship team matchup", nodes: [final] }
  ];
}

function findBracketNodeMatches(matches: TeamCourtScheduleMatch[], teamAId: string, teamBId: string, timeMinutes: number[]) {
  if (!teamAId || !teamBId) return [];
  return matches.filter((match) => {
    const samePair = (match.teamAId === teamAId && match.teamBId === teamBId) || (match.teamAId === teamBId && match.teamBId === teamAId);
    return samePair && timeMinutes.includes(getScheduleTimeSortValue(match.timeLabel));
  }).sort((left, right) => left.sortOrder - right.sortOrder || left.courtLabel.localeCompare(right.courtLabel));
}

function getTeamTieResult(sideA: BracketSlot, sideB: BracketSlot, matches: TeamCourtScheduleMatch[], expectedMatches = 3): TeamTieResult {
  const metricsA = matches.reduce((total, match) => addTeamScoreMetrics(total, sideA.team ? getTeamScoreMetrics(match, sideA.team.id) : getEmptyTeamScoreMetrics()), getEmptyTeamScoreMetrics());
  const metricsB = matches.reduce((total, match) => addTeamScoreMetrics(total, sideB.team ? getTeamScoreMetrics(match, sideB.team.id) : getEmptyTeamScoreMetrics()), getEmptyTeamScoreMetrics());
  const scheduledMatches = matches.length;
  const completedMatches = Math.min(metricsA.completedMatches, metricsB.completedMatches);
  const remainingMatches = Math.max(0, scheduledMatches - completedMatches);
  const hasMinimumTeamTie = scheduledMatches >= expectedMatches;
  const allScoresComplete = hasMinimumTeamTie && completedMatches === scheduledMatches;
  const matchLead = Math.abs(metricsA.matchWins - metricsB.matchWins);
  const clinchedByMatchWins = hasMinimumTeamTie && matchLead > remainingMatches;
  let winnerTeamId = "";
  let loserTeamId = "";
  let decidedBy: TeamTieResult["decidedBy"] = "pending";
  const chooseWinner = (aWins: boolean, decision: TeamTieResult["decidedBy"]) => {
    winnerTeamId = (aWins ? sideA.team : sideB.team)?.id || "";
    loserTeamId = (aWins ? sideB.team : sideA.team)?.id || "";
    decidedBy = decision;
  };

  if (clinchedByMatchWins || (allScoresComplete && metricsA.matchWins !== metricsB.matchWins)) {
    chooseWinner(metricsA.matchWins > metricsB.matchWins, "match wins");
  } else if (allScoresComplete) {
    const setsA = metricsA.setsWon + metricsA.setsLost;
    const setsB = metricsB.setsWon + metricsB.setsLost;
    const setPercentageA = setsA ? metricsA.setsWon / setsA : 0;
    const setPercentageB = setsB ? metricsB.setsWon / setsB : 0;
    if (Math.abs(setPercentageA - setPercentageB) > 0.0001) {
      chooseWinner(setPercentageA > setPercentageB, "set percentage");
    } else {
      const gamesA = metricsA.gamesWon + metricsA.gamesLost;
      const gamesB = metricsB.gamesWon + metricsB.gamesLost;
      const gamePercentageA = gamesA ? metricsA.gamesWon / gamesA : 0;
      const gamePercentageB = gamesB ? metricsB.gamesWon / gamesB : 0;
      if (Math.abs(gamePercentageA - gamePercentageB) > 0.0001) chooseWinner(gamePercentageA > gamePercentageB, "game percentage");
      else decidedBy = "organizer review";
    }
  }

  return {
    matches,
    scheduledMatches,
    completedMatches,
    matchWinsA: metricsA.matchWins,
    matchWinsB: metricsB.matchWins,
    setsWonA: metricsA.setsWon,
    setsWonB: metricsB.setsWon,
    gamesWonA: metricsA.gamesWon,
    gamesWonB: metricsB.gamesWon,
    winnerTeamId,
    loserTeamId,
    decidedBy,
    isClinched: Boolean(winnerTeamId),
    hasTieBreaker: matches.some(hasMatchTieBreaker)
  };
}

function hasMatchTieBreaker(match: TeamCourtScheduleMatch) {
  const score = match.score;
  if (!score || score.sideASet3 == null || score.sideBSet3 == null) return false;
  const setOneWinner = getSetWinner(score.sideASet1, score.sideBSet1);
  const setTwoWinner = getSetWinner(score.sideASet2, score.sideBSet2);
  return Boolean(setOneWinner && setTwoWinner && setOneWinner !== setTwoWinner);
}

function formatBracketPlayerNames(players: string[], fallback: string) {
  return players.length ? players.join(" / ") : fallback;
}

function formatBracketMatchScore(match: TeamCourtScheduleMatch, firstTeamId: string) {
  const score = match.score;
  if (!score) return "Pending";
  const firstIsA = match.teamAId === firstTeamId;
  const firstScores = firstIsA ? [score.sideASet1, score.sideASet2, score.sideASet3] : [score.sideBSet1, score.sideBSet2, score.sideBSet3];
  const secondScores = firstIsA ? [score.sideBSet1, score.sideBSet2, score.sideBSet3] : [score.sideASet1, score.sideASet2, score.sideASet3];
  return firstScores.flatMap((first, index) => first == null || secondScores[index] == null || (index === 2 && !hasMatchTieBreaker(match)) ? [] : [`${index === 2 ? "[" : ""}${first}–${secondScores[index]}${index === 2 ? "]" : ""}`]).join(" ") || "Pending";
}

function formatBracketPercentage(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function TeamSponsorList({ sponsors, tone }: { sponsors: TeamSponsor[]; tone: "card" | "hero" }) {
  if (!sponsors.length) return null;
  const isHero = tone === "hero";
  const sponsorNames = sponsors.map((sponsor) => sponsor.name).filter(Boolean).join(" · ");

  return (
    <span className={isHero
      ? "pointer-events-auto relative z-10 flex min-w-0 items-center gap-1.5 whitespace-nowrap"
      : "pointer-events-auto relative z-10 flex w-max max-w-full min-w-0 items-center gap-1.5 whitespace-nowrap rounded-full border-hairline border-white/55 bg-white/90 px-2.5 py-1.5 text-[var(--ink)] shadow-[0_5px_14px_rgba(var(--brand-deep-rgb),0.08)]"}>
        <em className={isHero ? "shrink-0 text-[8px] font-medium not-italic uppercase tracking-[0.07em] text-white/72" : "shrink-0 text-[8px] font-medium not-italic uppercase tracking-[0.07em] text-current opacity-60"}>Sponsored by</em>
        <span className={isHero ? "block min-w-0 overflow-hidden text-ellipsis text-[11px] font-medium text-white" : "block min-w-0 overflow-hidden text-ellipsis text-[11px] font-medium text-[var(--ink)]"} title={sponsorNames}>
          {sponsors.map((sponsor, index) => (
            <span key={`${sponsor.name}:${sponsor.logoUrl}:${index}`}>
              {index > 0 && <span className="px-1 opacity-45" aria-hidden="true">·</span>}
              {sponsor.websiteUrl ? (
                <a className="tap-card underline decoration-current/35 underline-offset-2 transition hover:decoration-current" href={sponsor.websiteUrl} target="_blank" rel="noreferrer" aria-label={`Visit ${sponsor.name || "sponsor"} website`}>{sponsor.name || `Sponsor ${index + 1}`}</a>
              ) : (
                <strong className="font-medium">{sponsor.name || `Sponsor ${index + 1}`}</strong>
              )}
            </span>
          ))}
        </span>
    </span>
  );
}

function TeamSponsorLogoStamps({ sponsors }: { sponsors: TeamSponsor[] }) {
  const logoSponsors = sponsors.filter((sponsor) => sponsor.logoUrl);
  if (!logoSponsors.length) return null;
  const visibleSponsors = logoSponsors.slice(0, 3);
  const remainingCount = logoSponsors.length - visibleSponsors.length;
  const rotations = ["-rotate-[6deg]", "rotate-[4deg]", "-rotate-[2deg]"];

  return (
    <span className="flex items-start -space-x-2" aria-label="Team sponsor logos">
      {visibleSponsors.map((sponsor, index) => (
        <span className={`relative grid h-12 w-12 place-items-center overflow-hidden rounded-[15px] border border-dashed border-[var(--blue-300)] bg-white p-1.5 sm:h-14 sm:w-14 sm:rounded-[17px] ${rotations[index]}`} style={{ zIndex: visibleSponsors.length - index }} key={`${sponsor.logoUrl}:${index}`}>
          <span className="absolute inset-1 rounded-[11px] border-hairline border-line" aria-hidden="true" />
          <img className="relative h-full w-full object-contain" src={sponsor.logoUrl} alt={`${sponsor.name || "Team sponsor"} logo`} />
        </span>
      ))}
      {remainingCount > 0 && <span className="relative z-10 grid h-7 min-w-7 place-items-center self-end rounded-full border-2 border-white bg-brand-deep px-1 text-[9px] font-semibold text-white shadow-[0_6px_14px_rgba(var(--brand-deep-rgb),0.16)]">+{remainingCount}</span>}
    </span>
  );
}

function PlayerProfilePageCard({ player, team, matches, backHref, backLabel }: { player: PublishedTeamMember; team: PublishedTeam | null; matches: TeamCourtScheduleMatch[]; backHref: string; backLabel: string }) {
  const performance = getPlayerPerformance(player, matches);
  const completedMatches = matches.filter((match) => Boolean(match.score?.winnerSide));
  const upcomingMatches = matches.filter((match) => !match.score?.winnerSide);
  const winPercentage = performance.played ? (performance.wins / performance.played) * 100 : 0;
  const lossPercentage = performance.played ? (performance.losses / performance.played) * 100 : 0;

  return (
    <section className="grid gap-4">
      <article className="relative overflow-hidden rounded-[26px] border-hairline border-white/25 bg-brand-deep text-white">
        <CourtBackdrop />
        <Link className="tap-card absolute left-4 top-4 z-20 inline-grid h-9 max-h-9 min-h-9 w-9 max-w-9 min-w-9 place-items-center rounded-full border-hairline border-white/60 bg-white/90 p-0 text-brand shadow-[0_8px_18px_rgba(var(--brand-deep-rgb),0.10)] backdrop-blur transition-transform hover:-translate-x-0.5 active:scale-[0.98]" href={backHref} aria-label={backLabel}>
          <ArrowLeft size={16} strokeWidth={2.2} />
        </Link>
        <div className="relative grid gap-5 p-5 pt-20 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-7 sm:pt-16">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border-[3px] border-white/85 bg-white/14 text-[18px] font-medium text-white shadow-[0_12px_28px_rgba(var(--brand-deep-rgb),0.18)] sm:h-24 sm:w-24 sm:text-[22px]" name={player.name} photoUrl={player.profilePhotoUrl} ariaLabel={`${player.name} profile photo`} sizes="(min-width: 640px) 96px, 80px" />
            <span className="grid min-w-0 gap-1.5">
              <em className="text-[11px] font-medium not-italic uppercase tracking-[0.14em] text-white/75">Tournament player</em>
              <h1 className="break-words text-[30px] font-medium leading-[1.04] tracking-[-0.7px] text-white sm:text-[42px]">{player.name}</h1>
              <p className="text-[13px] font-medium text-white/82 sm:text-[14px]">{player.city || "MRSA"}{player.tier !== "Tier TBD" ? ` · ${player.tier}` : ""} · Rating {player.rating || "N/A"}</p>
              {team && (
                <Link className="tap-card inline-flex w-max max-w-full items-center gap-2 rounded-full border-hairline border-white/25 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white transition hover:bg-white/18" href={`/tournaments/schedule/teams/${team.id}?from=roster`}>
                  {team.logoUrl && <span className="grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-white p-0.5"><img className="h-full w-full object-contain" src={team.logoUrl} alt="" aria-hidden="true" /></span>}
                  <span className="truncate">{team.name}</span>
                  <ArrowRight size={12} />
                </Link>
              )}
            </span>
          </div>
          <div className="grid gap-2 text-center">
            <div className="grid grid-cols-3 gap-2">
              <TeamHeroStat label="Completed" value={performance.played} />
              <TeamHeroStat label="Wins" value={performance.wins} />
              <TeamHeroStat label="Losses" value={performance.losses} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <TeamHeroStat label="Win %" value={`${formatBracketPercentage(winPercentage)}%`} />
              <TeamHeroStat label="Loss %" value={`${formatBracketPercentage(lossPercentage)}%`} />
            </div>
          </div>
        </div>
      </article>

      <article className="grid content-start gap-4 rounded-[24px] border-hairline border-line bg-white p-4 shadow-[0_14px_34px_rgba(var(--brand-deep-rgb),0.06)] sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <span className="grid gap-0.5">
            <em className="text-[10px] font-medium not-italic uppercase tracking-[0.13em] text-text-muted">Tournament results</em>
            <h2 className="text-[21px] font-medium tracking-[-0.25px] text-text-primary">Match history</h2>
          </span>
          <span className="rounded-full bg-accent-tint px-3 py-1 text-[11px] font-medium text-[var(--accent-ink)]">{performance.played} completed · {matches.length} total</span>
        </div>
        {!matches.length ? (
          <p className="rounded-[16px] bg-surface/60 p-4 text-[13px] text-text-secondary">No tournament matches are assigned to this player yet.</p>
        ) : (
          <div className="grid gap-4">
            <section className="grid gap-2.5" aria-labelledby="completed-player-matches">
              <div className="flex items-center justify-between gap-3 px-1">
                <h3 className="text-[14px] font-medium text-text-primary" id="completed-player-matches">Completed games</h3>
                <span className="text-[11px] text-text-secondary">{completedMatches.length}</span>
              </div>
              {completedMatches.length ? completedMatches.map((match) => <PlayerProfileMatchRow match={match} player={player} team={team} key={match.id} />) : <p className="rounded-[16px] bg-surface/60 p-4 text-[13px] text-text-secondary">No completed games yet.</p>}
            </section>
            {!!upcomingMatches.length && (
              <section className="grid gap-2.5" aria-labelledby="upcoming-player-matches">
                <div className="flex items-center justify-between gap-3 px-1">
                  <h3 className="text-[14px] font-medium text-text-primary" id="upcoming-player-matches">Upcoming games</h3>
                  <span className="text-[11px] text-text-secondary">{upcomingMatches.length}</span>
                </div>
                {upcomingMatches.map((match) => <PlayerProfileMatchRow match={match} player={player} team={team} key={match.id} />)}
              </section>
            )}
          </div>
        )}
      </article>
    </section>
  );
}

function PlayerProfileMatchRow({ player, team, match }: { player: PublishedTeamMember; team: PublishedTeam | null; match: TeamCourtScheduleMatch }) {
  const playerIsA = match.playerProfilesA.some((profile) => profile.id === player.playerId || normalizeName(profile.name) === normalizeName(player.name));
  const playerSide: "A" | "B" = playerIsA ? "A" : "B";
  const partnerProfiles = (playerIsA ? match.playerProfilesA : match.playerProfilesB).filter((profile) => profile.id !== player.playerId && normalizeName(profile.name) !== normalizeName(player.name));
  const opponentProfiles = playerIsA ? match.playerProfilesB : match.playerProfilesA;
  const opponentTeam = playerIsA ? match.teamBName : match.teamAName;
  const didWin = match.score?.winnerSide === playerSide;
  const didLose = Boolean(match.score?.winnerSide && match.score.winnerSide !== playerSide);
  const status = didWin ? "Won" : didLose ? "Lost" : "Upcoming";
  const score = formatBracketMatchScore(match, team?.id || (playerIsA ? match.teamAId : match.teamBId));

  return (
    <article className="grid gap-3 rounded-[17px] border-hairline border-line bg-surface/38 p-3 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
      <span className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 sm:grid-cols-1 sm:gap-0.5">
        <strong className="text-[14px] font-semibold text-brand">{match.timeLabel || "Time TBD"}</strong>
        <em className="truncate text-[10px] font-medium not-italic uppercase tracking-[0.06em] text-text-muted">{match.dayLabel || `Day ${match.dayNumber}`} · {match.courtLabel || "Court TBD"}</em>
      </span>
      <span className="grid min-w-0 gap-1">
        <span className="flex min-w-0 flex-wrap items-center gap-1.5 text-[11px] text-text-secondary">
          <strong className="font-medium text-text-primary">vs</strong>
          {opponentProfiles.length ? opponentProfiles.map((opponent, index) => (
            <Fragment key={`${match.id}:${opponent.id}:${index}`}>
              {index > 0 && <em className="not-italic text-text-muted">&amp;</em>}
              <PlayerProfileNameLink player={opponent} from="player-profile" sourcePlayerId={player.playerId} />
            </Fragment>
          )) : <strong className="font-medium text-text-primary">Opponent TBD</strong>}
        </span>
        <em className="flex min-w-0 flex-wrap items-center gap-1 text-[10px] not-italic text-text-secondary">
          <span>{opponentTeam} · {match.format}</span>
          {partnerProfiles.length > 0 && <span>with</span>}
          {partnerProfiles.map((partner, index) => (
            <Fragment key={`${partner.id}:${index}`}>
              {index > 0 && <span>&amp;</span>}
              {isFallbackPlayerProfileId(partner.id) ? <span>{partner.name}</span> : <PlayerProfileNameLink player={partner} from="player-profile" sourcePlayerId={player.playerId} />}
            </Fragment>
          ))}
        </em>
      </span>
      <span className="grid grid-cols-[auto_auto] items-center justify-between gap-3 sm:justify-end">
        <span className={didWin ? "grid min-w-[72px] gap-0.5 rounded-[11px] bg-accent-tint px-2.5 py-1.5 text-center text-[var(--accent-ink)]" : didLose ? "grid min-w-[72px] gap-0.5 rounded-[11px] bg-[var(--loss-tint)] px-2.5 py-1.5 text-center text-[var(--loss-ink)]" : "grid min-w-[72px] gap-0.5 rounded-[11px] bg-white px-2.5 py-1.5 text-center text-text-muted"}>
          <strong className="text-[11px] font-semibold">{status}</strong>
          <em className="text-[9px] not-italic">{score}</em>
        </span>
        <Link className="tap-card grid h-9 w-9 place-items-center rounded-full border-hairline border-line bg-white text-brand transition hover:border-brand/30 hover:bg-brand-light" href={`/tournaments/schedule/matches/${match.id}?from=player-profile&player=${player.playerId}`} aria-label={`View match against ${opponentProfiles.map((opponent) => opponent.name).join(" and ") || opponentTeam}`}>
          <ArrowRight size={16} />
        </Link>
      </span>
    </article>
  );
}

function PlayerProfileNameLink({ player, from, teamId = "", matchId = "", sourcePlayerId = "", className = "" }: { player: MatchPlayerProfile; from: "schedule" | "match" | "player-profile"; teamId?: string; matchId?: string; sourcePlayerId?: string; className?: string }) {
  const href = `/tournaments/players/${player.id}?from=${from}${teamId ? `&team=${teamId}` : ""}${matchId ? `&match=${matchId}` : ""}${sourcePlayerId ? `&player=${sourcePlayerId}` : ""}`;
  return (
    <Link className={`tap-card font-medium underline decoration-current/20 underline-offset-2 transition hover:decoration-current ${className}`} href={href} onClick={(event) => event.stopPropagation()}>
      {player.name}
    </Link>
  );
}

function TeamDetailPageCard({ team, matches, backHref, backLabel }: { team: PublishedTeam; matches: TeamCourtScheduleMatch[]; backHref: string; backLabel: string }) {
  const teamRecord = getTeamPerformanceSummary(team, matches);
  const jerseyPresentation = getTeamJerseyPresentation(team.jerseyColor);
  const completedMatches = teamRecord.wins + teamRecord.losses;

  return (
    <section className="grid gap-4">
      <article className="relative overflow-hidden rounded-[26px] border-hairline border-white/25 bg-brand-deep text-white">
        <CourtBackdrop />
        <Link className="tap-card absolute left-4 top-4 z-20 inline-grid h-9 max-h-9 min-h-9 w-9 max-w-9 min-w-9 place-items-center rounded-full border-hairline border-white/60 bg-white/90 p-0 text-brand shadow-[0_8px_18px_rgba(var(--brand-deep-rgb),0.10)] backdrop-blur transition-transform hover:-translate-x-0.5 active:scale-[0.98]" href={backHref} aria-label={backLabel}>
          <ArrowLeft size={16} strokeWidth={2.2} />
        </Link>
        <span className="pointer-events-none absolute right-4 top-4 z-20 flex items-start gap-2">
          <TeamSponsorLogoStamps sponsors={team.sponsors} />
          <span className="relative grid h-14 w-14 rotate-[6deg] place-items-center rounded-[17px] border border-dashed shadow-[0_8px_18px_rgba(var(--brand-deep-rgb),0.12)]" style={{ background: jerseyPresentation.badgeBackground, borderColor: jerseyPresentation.badgeBorderColor }} role="img" aria-label={`${team.name} jersey color`}>
            <span className="absolute inset-1 rounded-[13px] border-hairline border-line" aria-hidden="true" />
            <Shirt className={jerseyPresentation.isWhiteJersey ? "drop-shadow-[0_1px_1px_rgba(var(--brand-deep-rgb),0.22)]" : ""} size={28} strokeWidth={jerseyPresentation.isWhiteJersey ? 2.3 : 1.9} style={{ color: jerseyPresentation.strokeColor, fill: jerseyPresentation.fillColor }} />
          </span>
        </span>
        <div className="relative grid gap-5 p-5 pt-20 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-7 sm:pt-16">
          <div className="flex min-w-0 items-center gap-4">
            {team.logoUrl ? (
              <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-[16px] border-hairline border-white/70 bg-white p-1.5 shadow-[0_10px_24px_rgba(var(--brand-deep-rgb),0.16)] sm:h-20 sm:w-20 sm:rounded-[19px]">
                <img src={team.logoUrl} alt={`${team.name} logo`} className="h-full w-full object-contain" />
              </span>
            ) : (
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[16px] border-hairline border-white/70 bg-white text-[18px] font-medium text-brand shadow-[0_10px_24px_rgba(var(--brand-deep-rgb),0.16)] sm:h-20 sm:w-20 sm:rounded-[19px]">{getInitials(team.name)}</span>
            )}
            <span className="grid min-w-0 gap-1.5">
              <em className="text-[11px] font-medium not-italic uppercase tracking-[0.14em] text-white/85">Tournament team</em>
              <h1 className="break-words text-[30px] font-medium leading-[1.04] tracking-[-0.7px] text-white sm:text-[42px]">{team.name}</h1>
              <p className="text-[13px] font-medium text-white/85 sm:text-[14px]">{formatPlayerCount(team.members.length)} · {matches.length} scheduled matches</p>
              <TeamSponsorList sponsors={team.sponsors} tone="hero" />
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
              <TeamHeroStat label="Played" value={completedMatches} />
              <TeamHeroStat label="Wins" value={teamRecord.wins} />
              <TeamHeroStat label="Losses" value={teamRecord.losses} />
          </div>
        </div>
      </article>

      <article className="grid content-start gap-4 rounded-[24px] border-hairline border-line bg-white p-4 shadow-[0_14px_34px_rgba(var(--brand-deep-rgb),0.06)] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="grid gap-0.5">
              <em className="text-[10px] font-medium not-italic uppercase tracking-[0.13em] text-text-muted">The lineup</em>
              <h2 className="text-[21px] font-medium tracking-[-0.25px] text-text-primary">Team roster</h2>
            </span>
            <span className="rounded-full bg-accent-tint px-3 py-1 text-[12px] font-medium text-[var(--accent-ink)]">{formatPlayerCount(team.members.length)}</span>
          </div>
          {team.members.length ? (
            <div className="grid gap-2 md:grid-cols-2">
              {team.members.map((member) => <TeamRosterMemberCard key={member.id} matches={matches} member={member} team={team} />)}
            </div>
          ) : (
            <p className="rounded-[16px] bg-surface/60 p-4 text-[13px] text-text-secondary">Players will appear here once the roster is finalized.</p>
          )}
      </article>
    </section>
  );
}

function TeamHeroStat({ label, value }: { label: string; value: number | string }) {
  return (
    <span className="grid min-w-0 gap-1 rounded-[14px] border-hairline border-white bg-white px-2.5 py-2.5 shadow-[0_8px_20px_rgba(var(--brand-deep-rgb),0.10)] sm:min-w-[78px] sm:px-3">
      <strong className="text-[20px] font-semibold leading-none text-[var(--brand-deep)] sm:text-[22px]">{value}</strong>
      <em className="text-[10px] font-semibold not-italic uppercase tracking-[0.05em] text-[var(--mist)]">{label}</em>
    </span>
  );
}

function TeamRosterMemberCard({ member, team, matches }: { member: PublishedTeamMember; team: PublishedTeam; matches: TeamCourtScheduleMatch[] }) {
  const performance = getMemberPerformance(member, team, matches);
  return (
    <Link className="tap-card grid min-w-0 grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[16px] border-hairline border-line bg-surface/40 p-2.5 transition hover:border-brand/20 hover:bg-white hover:shadow-[0_10px_22px_rgba(var(--brand-deep-rgb), 0.07)]" href={`/tournaments/players/${member.playerId}?from=team-roster&team=${team.id}`} aria-label={`View ${member.name} player profile`}>
      <Avatar className="relative grid h-[42px] w-[42px] place-items-center overflow-hidden rounded-full border-2 border-white bg-accent-tint text-[12px] font-medium text-[var(--accent-ink)] shadow-[0_6px_14px_rgba(var(--brand-deep-rgb), 0.10)]" name={member.name} photoUrl={member.profilePhotoUrl} ariaLabel={`${member.name} profile photo`} sizes="42px" />
      <span className="grid min-w-0 gap-0.5">
        <span className="flex min-w-0 items-center gap-1.5">
          <strong className="truncate text-[14px] font-medium leading-tight text-text-primary">{member.name}</strong>
          {member.isCaptain && <em className="shrink-0 rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[8px] font-medium not-italic uppercase tracking-[0.06em] text-[var(--accent-on)]">Captain</em>}
        </span>
        <em className="truncate text-[10px] not-italic text-text-secondary">{member.city || "City TBD"} · {member.tier} · Rating {member.rating || "N/A"}</em>
      </span>
      <span className="grid grid-cols-3 gap-0.5 text-center">
        <TeamPerformancePill label="Played" value={performance.played} />
        <TeamPerformancePill label="Won" value={performance.wins} />
        <TeamPerformancePill label="Lost" value={performance.losses} />
      </span>
    </Link>
  );
}

function CourtBackdrop() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]" viewBox="0 0 720 260" aria-hidden="true" preserveAspectRatio="none">
      <rect x="40" y="28" width="640" height="204" rx="0" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M360 28v204M40 130h640M180 28v204M540 28v204" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ScoreSetInputs({ draft, setNumber, optional = false, disabled, onChange, leftSide, rightSide, leftLabel, rightLabel }: { draft: ScoreDraft; setNumber: 1 | 2 | 3; optional?: boolean; disabled: boolean; onChange: (draft: ScoreDraft) => void; leftSide: "A" | "B"; rightSide: "A" | "B"; leftLabel: string; rightLabel: string }) {
  const sideAKey = `sideASet${setNumber}` as keyof ScoreDraft;
  const sideBKey = `sideBSet${setNumber}` as keyof ScoreDraft;
  const leftKey = leftSide === "A" ? sideAKey : sideBKey;
  const rightKey = rightSide === "A" ? sideAKey : sideBKey;
  const maximumScore = setNumber === 3 ? 10 : 4;
  const normalizeScoreInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 2);
    if (!digits) return "";
    return String(Math.min(maximumScore, Number(digits)));
  };
  return (
    <label className={disabled ? "match-detail-score-set grid grid-cols-[52px_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-[13px] border-hairline border-line bg-[var(--surface-subtle)] px-2 py-1.5 text-[12px] text-text-muted opacity-70" : "match-detail-score-set grid grid-cols-[52px_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-[13px] border-hairline border-line bg-surface/55 px-2 py-1.5 text-[12px] text-text-secondary"}>
      <span className="font-medium text-text-primary">Set {setNumber}</span>
      <input className="min-h-9 rounded-[11px] border-hairline border-line bg-white px-2 text-center text-[15px] font-medium text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-light disabled:bg-surface disabled:text-text-muted" value={draft[leftKey]} onChange={(event) => onChange({ ...draft, [leftKey]: normalizeScoreInput(event.target.value) })} placeholder="0" aria-label={`Set ${setNumber} score for ${leftLabel}${optional ? " if needed" : ""}`} inputMode="numeric" min={0} max={maximumScore} disabled={disabled} />
      <span className="text-text-muted">-</span>
      <input className="min-h-9 rounded-[11px] border-hairline border-line bg-white px-2 text-center text-[15px] font-medium text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-light disabled:bg-surface disabled:text-text-muted" value={draft[rightKey]} onChange={(event) => onChange({ ...draft, [rightKey]: normalizeScoreInput(event.target.value) })} placeholder="0" aria-label={`Set ${setNumber} score for ${rightLabel}${optional ? " if needed" : ""}`} inputMode="numeric" min={0} max={maximumScore} disabled={disabled} />
    </label>
  );
}

function TeamPerformancePill({ label, value }: { label: string; value: number }) {
  return (
    <span className="grid min-w-[32px] gap-0.5 rounded-[9px] bg-white px-1 py-1.5">
      <strong className="text-[13px] font-medium leading-none text-brand">{value}</strong>
      <em className="text-[7px] font-medium not-italic uppercase tracking-[0.02em] text-text-muted">{label}</em>
    </span>
  );
}

function PlayerScheduleMatchCard({ match, tournament, teams, isFeatured, onOpenMatch }: { match: PlayerScheduleMatch; tournament: Tournament | null; teams: PublishedTeam[]; isFeatured: boolean; onOpenMatch: () => void }) {
  const playerSideNames = match.playerSideNames.length ? match.playerSideNames : ["You"];
  const opponentNames = match.opponentNames.length ? match.opponentNames : ["Opponent TBD"];
  const courtNumber = formatCourtNumber(match.courtLabel || "");
  const ballTeam = getBallTeamForMatchup(match.dayNumber, match.teamId, match.opposingTeamId, match.id, teams);
  const isSingles = playerSideNames.length === 1 && opponentNames.length === 1;
  const playerSideWon = Boolean(match.score?.winnerSide && match.score.winnerSide === match.teamSide);
  const opponentSideWon = Boolean(match.score?.winnerSide && match.score.winnerSide !== match.teamSide);
  const matchState = getScheduleMatchState(match, tournament);
  const playerIsSideA = match.teamSide === "A";
  const leftNames = playerIsSideA ? playerSideNames : opponentNames;
  const rightNames = playerIsSideA ? opponentNames : playerSideNames;
  const leftProfiles = playerIsSideA ? match.playerSideProfiles : match.opponentProfiles;
  const rightProfiles = playerIsSideA ? match.opponentProfiles : match.playerSideProfiles;
  const leftTeamName = playerIsSideA ? match.teamName : match.opposingTeamName;
  const rightTeamName = playerIsSideA ? match.opposingTeamName : match.teamName;
  const leftTeamId = playerIsSideA ? match.teamId : match.opposingTeamId;
  const rightTeamId = playerIsSideA ? match.opposingTeamId : match.teamId;
  const leftSideWon = playerIsSideA ? playerSideWon : opponentSideWon;
  const rightSideWon = playerIsSideA ? opponentSideWon : playerSideWon;

  return (
    <article className={`schedule-player-match-card relative grid gap-2.5 overflow-hidden rounded-[20px] border border-[var(--hairline-strong)] bg-white/94 py-3 pl-12 pr-3 backdrop-blur-xl sm:rounded-[22px] sm:py-4 sm:pl-12 sm:pr-4 ${isFeatured ? "shadow-[0_20px_48px_rgba(var(--brand-deep-rgb), 0.14)]" : "shadow-[0_14px_34px_rgba(var(--brand-deep-rgb), 0.09)]"}`}>
      <div className="relative z-[1] flex min-w-0 items-center justify-between gap-4">
        <ScheduleTimeDisplay label={match.timeLabel} />
        <span className="inline-flex min-w-0 items-center justify-end gap-1.5">
          <MatchIdPill match={match} />
          <ScheduleMatchStateBadge state={matchState} score={match.score} dayNumber={match.dayNumber} matchType={match.matchType} />
        </span>
      </div>

      <div className="schedule-match-team-row relative z-[1] flex w-max max-w-full min-w-0 flex-nowrap items-center gap-1.5 overflow-hidden whitespace-nowrap text-[13px] font-medium leading-tight text-text-secondary sm:text-[14px]">
        <ScheduleHeaderTeamName name={leftTeamName} showBallIcon={ballTeam?.id === leftTeamId} />
        <em className="shrink-0 not-italic text-text-muted">vs</em>
        <ScheduleHeaderTeamName name={rightTeamName} showBallIcon={ballTeam?.id === rightTeamId} />
      </div>

      <div className="tap-card group relative z-[1] grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_30px] items-center gap-2 rounded-[17px] text-left transition hover:bg-white/58 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30" role="button" tabIndex={0} onClick={onOpenMatch} onKeyDown={(event) => {
        if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) return;
        event.preventDefault();
        onOpenMatch();
      }} aria-label={`View match details: ${leftNames.join(" and ")} versus ${rightNames.join(" and ")}`}>
        <span className="grid gap-2">
          <span className="grid min-h-16 grid-cols-[minmax(0,1fr)_46px_minmax(0,1fr)] items-stretch gap-2 sm:grid-cols-[minmax(0,1fr)_50px_minmax(0,1fr)] sm:gap-2.5">
            <PlayerNameStack label="" names={leftNames} profiles={leftProfiles} tone="primary" centerOnWideScreens={isSingles} isWinner={leftSideWon} />
            <CourtLineDivider label={courtNumber} />
            <PlayerNameStack label="" names={rightNames} profiles={rightProfiles} tone="opponent" centerOnWideScreens={isSingles} isWinner={rightSideWon} />
          </span>
          {matchState === "completed" && match.score && <CompletedMatchScore score={match.score} />}
          {matchState === "ongoing" && match.score && <LiveMatchScore score={match.score} />}
        </span>
        <span className="justify-self-center">
          <MatchCardSideCue />
        </span>
      </div>
    </article>
  );
}

function LiveMatchScore({ score }: { score: MatchScore }) {
  const sets = [
    [score.sideASet1, score.sideBSet1],
    [score.sideASet2, score.sideBSet2],
    [score.sideASet3, score.sideBSet3]
  ].filter(([sideA, sideB]) => sideA != null && sideB != null).map(([sideA, sideB]) => `${sideA}–${sideB}`);
  if (!sets.length) return null;
  return (
    <span className="flex flex-wrap justify-end gap-1.5" aria-label={`Live score, ${sets.join(", ")}`}>
      {sets.map((set, index) => <strong className="rounded-[9px] border-hairline border-line bg-[var(--surface)] px-2.5 py-1 text-[12px] font-semibold tabular-nums text-text-primary" key={`${set}:${index}`}>{set}</strong>)}
    </span>
  );
}

function CompletedMatchScore({ score }: { score: MatchScore }) {
  const winnerIsA = score.winnerSide === "A";
  const sets = [
    [score.sideASet1, score.sideBSet1],
    [score.sideASet2, score.sideBSet2],
    [score.sideASet3, score.sideBSet3]
  ].filter(([sideA, sideB]) => sideA != null && sideB != null)
    .map(([sideA, sideB]) => winnerIsA ? `${sideA}–${sideB}` : `${sideB}–${sideA}`);
  if (!sets.length) return null;
  return (
    <span className="flex flex-wrap justify-end gap-1.5" aria-label={`Completed score, winner first, ${sets.join(", ")}`}>
      {sets.map((set, index) => <strong className="rounded-[9px] border-hairline border-line bg-[var(--surface)] px-2.5 py-1 text-[12px] font-semibold tabular-nums text-text-primary" key={`${set}:${index}`}>{set}</strong>)}
    </span>
  );
}

function MatchCardSideCue() {
  return (
    <span className="match-card-side-cue pointer-events-none grid h-7 w-7 place-items-center rounded-full border-hairline border-[var(--brand-primary-line)] bg-white/82 text-text-secondary shadow-[0_6px_14px_rgba(var(--brand-deep-rgb),0.08)] transition group-hover:border-brand/30 group-hover:bg-brand-light group-hover:text-brand" aria-hidden="true">
      <ChevronRight className="transition-transform group-hover:translate-x-0.5" size={18} strokeWidth={2.4} />
    </span>
  );
}

function PlayerNameStack({ label, names, profiles = [], tone, centerOnWideScreens = false, isWinner = false }: { label: string; names: string[]; profiles?: MatchPlayerProfile[]; tone: "primary" | "opponent"; centerOnWideScreens?: boolean; isWinner?: boolean }) {
  const isPrimary = tone === "primary";
  return (
    <span className={`schedule-player-stack schedule-player-stack--${tone} relative grid min-w-0 content-center gap-1.5 ${centerOnWideScreens ? "sm:content-center" : ""}`}>
      {isWinner && <span className="absolute -right-1 -top-1 z-10 grid h-6 w-6 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-on)]" title="Winner" aria-label="Winner"><Trophy size={12} strokeWidth={2.4} /></span>}
      {label && <em className="truncate px-1 text-[10px] font-medium not-italic text-text-muted">{label}</em>}
      {names.map((name, index) => {
        const profile = profiles[index] || profiles.find((candidate) => normalizeName(candidate.name) === normalizeName(name));
        const content = (
            <span className="block min-w-0 whitespace-normal break-words">{name}</span>
        );
        const chipClass = isWinner ? "grid min-h-12 min-w-0 place-items-center rounded-[12px] border-hairline border-[var(--accent-line)] bg-[var(--accent-tint)] px-2 py-1.5 text-center text-[12px] font-semibold leading-tight text-[var(--accent-ink)] sm:min-h-14 sm:px-2.5 sm:text-[13px]" : isPrimary ? "grid min-h-12 min-w-0 place-items-center rounded-[12px] border-hairline border-[var(--hairline-strong)] bg-[var(--surface)] px-2 py-1.5 text-center text-[12px] font-semibold leading-tight text-text-primary sm:min-h-14 sm:px-2.5 sm:text-[13px]" : "grid min-h-12 min-w-0 place-items-center rounded-[12px] border-hairline border-[var(--hairline-strong)] bg-[var(--surface)] px-2 py-1.5 text-center text-[12px] font-semibold leading-tight text-text-primary sm:min-h-14 sm:px-2.5 sm:text-[13px]";
        return (
        <Fragment key={`${name}-${index}`}>
          {profile?.id ? (
            <Link className={`${chipClass} tap-card transition hover:ring-2 hover:ring-brand/20`} href={`/tournaments/players/${profile.id}?from=schedule`} onClick={(event) => event.stopPropagation()} aria-label={`View ${name} player profile`}>{content}</Link>
          ) : (
            <strong className={chipClass}>{content}</strong>
          )}
          {index < names.length - 1 && (
            <em className="-my-1 justify-self-center text-[10px] font-semibold not-italic leading-none text-text-muted" aria-hidden="true">&amp;</em>
          )}
        </Fragment>
      );})}
    </span>
  );
}

function TennisBallIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span className={`relative inline-block shrink-0 drop-shadow-[0_1px_2px_rgba(var(--brand-deep-rgb), 0.24)] ${className}`} aria-hidden="true">
      <NextImage src="/images/tennis-countdown-ball.png" alt="" fill sizes="20px" className="object-contain" />
    </span>
  );
}

function CourtLineDivider({ label }: { label?: string }) {
  const courtNumber = label ? formatCourtNumber(label) : "";
  return (
    <span className="relative grid min-h-16 place-items-center self-stretch" aria-hidden={!label}>
      <span className="absolute inset-y-0 left-1/2 border-l-2 border-dashed border-[var(--hairline-strong)]" aria-hidden="true" />
      {courtNumber && (
        <span className="relative z-[1] grid min-h-12 min-w-11 place-items-center content-center rounded-[9px] bg-[var(--brand-deep)] px-1 py-1 text-white shadow-[0_8px_18px_rgba(var(--brand-deep-rgb), 0.16)] sm:min-h-14 sm:min-w-12">
          <small className="font-mono text-[8px] font-semibold uppercase leading-none tracking-[0.08em] text-[var(--accent)] sm:text-[9px]">court</small>
          <b className="font-mono text-[18px] font-semibold leading-none text-white sm:text-[20px]">{courtNumber}</b>
        </span>
      )}
    </span>
  );
}

function formatCourtNumber(label: string) {
  const match = label.match(/\d+(?:\s*[-–]\s*\d+)?/);
  return match ? match[0].replace(/\s+/g, "") : label.replace(/^court\s*/i, "").trim();
}

function getBallTeamForMatchup(dayNumber: number, teamAId: string, teamBId: string, matchupKey: string, teams: PublishedTeam[]) {
  if (dayNumber === 1) return null;
  const teamA = teams.find((team) => team.id === teamAId);
  const teamB = teams.find((team) => team.id === teamBId);
  if (!teamA || !teamB) return null;

  const stableKey = `${matchupKey}:${[teamA.id, teamB.id].sort().join(":")}`;
  let hash = 0;
  for (let index = 0; index < stableKey.length; index += 1) {
    hash = ((hash << 5) - hash + stableKey.charCodeAt(index)) | 0;
  }
  return Math.abs(hash) % 2 === 0 ? teamA : teamB;
}

function BallTeamBadge({ teamName, pending = false, compact = false }: { teamName: string; pending?: boolean; compact?: boolean }) {
  const displayName = pending ? "TBD" : teamName;
  const title = pending
    ? "The ball team will be assigned when both teams are confirmed."
    : `${teamName} opens the ball cans for this matchup.`;
  return (
      <span
      className={`${compact ? "min-h-6 gap-1 px-2 py-0.5 text-[9px]" : "min-h-8 gap-2 px-3 py-1.5 text-[11px]"} inline-flex min-w-0 max-w-full items-center rounded-full border-hairline ${pending ? "border-line bg-surface text-text-muted" : "border-[var(--hairline-strong)] bg-[var(--surface)] text-brand"} shadow-[0_6px_14px_rgba(var(--brand-deep-rgb), 0.05)]`}
      title={title}
      aria-label={title}
    >
      <TennisBallIcon className={compact ? "h-3.5 w-3.5" : "h-5 w-5"} />
      <em className="shrink-0 font-medium not-italic opacity-70">Balls:</em>
      <strong className="min-w-0 truncate font-medium text-current">{displayName}</strong>
    </span>
  );
}

function TeamCourtScheduleBlock({ block, teams, onOpenMatch, onOpenTeam }: { block: TeamCourtScheduleBlock; teams: PublishedTeam[]; isFeatured: boolean; onOpenMatch: (match: TeamCourtScheduleMatch) => void; onOpenTeam: (teamId: string) => void }) {
  const primaryTeam = teams.find((team) => team.id === block.primaryTeamId);
  const opponentTeam = teams.find((team) => team.id === block.opponentTeamId);
  const firstMatch = block.matches[0];
  const ballTeam = firstMatch ? getBallTeamForMatchup(firstMatch.dayNumber, firstMatch.teamAId, firstMatch.teamBId, block.id, teams) : null;
  const showPrimaryBall = firstMatch ? firstMatch.dayNumber === 2 || ballTeam?.id === primaryTeam?.id : false;
  const showOpponentBall = firstMatch ? firstMatch.dayNumber === 2 ? false : ballTeam?.id === opponentTeam?.id : false;

  return (
    <article className="relative overflow-hidden rounded-[20px] border-hairline border-line bg-white p-3.5 shadow-none">
      <div className="relative grid gap-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <ScheduleTeamPill label={block.primaryTeam} color={primaryTeam?.jerseyColor || "var(--brand-primary-tint)"} logoUrl={primaryTeam?.logoUrl || ""} isFinalized={Boolean(primaryTeam)} showBallIcon={showPrimaryBall} onClick={primaryTeam ? () => onOpenTeam(primaryTeam.id) : undefined} />
          <em className="text-[12px] not-italic text-text-muted">vs</em>
          <ScheduleTeamPill label={block.opponentTeam} color={opponentTeam?.jerseyColor || "var(--brand-primary-tint)"} logoUrl={opponentTeam?.logoUrl || ""} isFinalized={Boolean(opponentTeam)} showBallIcon={showOpponentBall} onClick={opponentTeam ? () => onOpenTeam(opponentTeam.id) : undefined} />
        </div>
        <div className="grid gap-2">
          {block.matches.map((match) => (
            <TeamCourtScheduleGame match={match} teamName={block.primaryTeam} onOpenMatch={onOpenMatch} key={match.id} />
          ))}
        </div>
      </div>
    </article>
  );
}

function DayTwoSchedulePhaseSections({ items, courtMatches, teams, openBlocks, onToggleBlock, onOpenMatch, onOpenTeam }: { items: ScheduleItem[]; courtMatches: TeamCourtScheduleMatch[]; teams: PublishedTeam[]; openBlocks: Record<string, boolean>; onToggleBlock: (blockId: string) => void; onOpenMatch: (match: TeamCourtScheduleMatch) => void; onOpenTeam: (teamId: string) => void }) {
  const sections = getDayTwoScheduleSections(items);

  return (
    <div className="grid gap-4">
      {sections.map((section) => (
        <section className="grid gap-3 rounded-[22px] border-hairline border-[var(--hairline-strong)] bg-white/72 p-3 shadow-[0_14px_34px_rgba(var(--brand-deep-rgb), 0.07)]" key={section.key}>
          <span className="grid gap-0.5 px-1">
            <strong className="text-[18px] font-medium leading-tight text-brand">{section.label}</strong>
            <em className="text-[11px] not-italic leading-relaxed text-text-secondary">{section.helper}</em>
            {section.formatNote && <span className="mt-1 inline-flex w-max max-w-full rounded-full border-hairline border-[var(--hairline-strong)] bg-[var(--surface)] px-2.5 py-1 text-[10px] font-medium text-brand">{section.formatNote}</span>}
          </span>
          <div className="grid gap-4 xl:grid-cols-3">
            {Object.entries(groupScheduleItemsByTime(section.items)).map(([timeLabel, sectionItems]) => (
              <DayScheduleTimeCard
                blocks={[]}
                courtMatches={courtMatches}
                eventItems={sectionItems}
                label={timeLabel}
                openBlocks={openBlocks}
                onToggleBlock={onToggleBlock}
                teams={teams}
                onOpenMatch={onOpenMatch}
                onOpenTeam={onOpenTeam}
                key={`${section.key}:${timeLabel}`}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function getDayTwoScheduleSections(items: ScheduleItem[]) {
  const matchItems = items.filter((item) => item.itemType === "match").sort((a, b) => a.sortOrder - b.sortOrder);
  const firstMatchOrder = matchItems[0]?.sortOrder ?? Number.POSITIVE_INFINITY;
  const lastMatchOrder = matchItems[matchItems.length - 1]?.sortOrder ?? Number.NEGATIVE_INFINITY;
  const morningEvents = items.filter((item) => item.itemType === "event" && item.sortOrder < firstMatchOrder).sort((a, b) => a.sortOrder - b.sortOrder);
  const closingEvents = items.filter((item) => item.itemType === "event" && item.sortOrder > lastMatchOrder).sort((a, b) => a.sortOrder - b.sortOrder);
  const byPhase = (phases: string[]) => matchItems.filter((item) => phases.includes(normalizeSchedulePhase(item.phase)));
  const sections = [
    { key: "morning", label: "Morning meetup", helper: "Breakfast, briefing, warmup, and team meetup.", items: morningEvents },
    { key: "quarterfinals", label: "Quarterfinals", helper: "Seed matchups that open the Day 2 draw.", formatNote: "QF: Tier 1-2 singles", items: byPhase(["quarterfinal"]) },
    { key: "advantage-survival", label: "Advantage + Survival", helper: "Quarterfinal winners and losers split into their next paths.", formatNote: "Advantage: Tier 3-4 singles · Survival: Tier 3-4 singles", items: byPhase(["survival", "advantage"]) },
    { key: "re-entry", label: "Re-entry", helper: "One more route into the semifinals.", formatNote: "Format decided by coin flip", items: byPhase(["re-entry"]) },
    { key: "semifinals", label: "Semifinals", helper: "The final four team matchups.", formatNote: "Format decided by coin flip", items: byPhase(["semifinal"]) },
    { key: "finals", label: "Finals", helper: "Championship doubles and singles.", formatNote: "Finals: singles and doubles", items: byPhase(["final"]) },
    { key: "closing", label: "Awards / wrapup", helper: "Final ceremony and tournament close.", items: closingEvents }
  ];

  return sections.filter((section) => section.items.length);
}

function normalizeSchedulePhase(value: string) {
  return value.trim().toLowerCase();
}

function DayScheduleTimeCard({ label, blocks, eventItems, teams, openBlocks, onToggleBlock, onOpenMatch, onOpenTeam, courtMatches = [], defaultOpen = false }: { label: string; blocks: TeamCourtScheduleBlock[]; eventItems: ScheduleItem[]; teams: PublishedTeam[]; openBlocks: Record<string, boolean>; onToggleBlock: (blockId: string) => void; onOpenMatch: (match: TeamCourtScheduleMatch) => void; onOpenTeam: (teamId: string) => void; courtMatches?: TeamCourtScheduleMatch[]; defaultOpen?: boolean }) {
  const matchCount = blocks.reduce((total, block) => total + block.matches.length, 0);
  const totalCount = matchCount + eventItems.length;
  const countLabel = eventItems.every((item) => item.itemType === "match") ? `${totalCount} ${totalCount === 1 ? "match" : "matches"}` : `${totalCount} ${totalCount === 1 ? "item" : "items"}`;

  return (
    <section className="overflow-hidden rounded-[24px] border-hairline border-[var(--hairline-strong)] bg-[var(--surface)] shadow-[0_20px_48px_rgba(var(--brand-deep-rgb), 0.11)]" key={label}>
      <div className="flex min-h-[66px] items-center justify-between gap-3 border-b-hairline border-[var(--hairline-strong)] bg-surface px-4 py-2.5 sm:min-h-[72px] sm:px-5">
        <span className="inline-flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/[0.08] text-brand sm:h-10 sm:w-10">
            <Clock size={18} strokeWidth={2.2} />
          </span>
          <h2 className="truncate text-[19px] font-medium leading-none text-brand sm:text-[21px]">{label}</h2>
        </span>
        <span className="shrink-0 rounded-full border-hairline border-[var(--hairline-strong)] bg-white/75 px-3 py-1.5 text-[11px] font-medium text-brand/75 sm:text-[12px]">{countLabel}</span>
      </div>
      <div className="grid gap-2.5 p-3 sm:p-4">
        {!!eventItems.length && (
          <div className="grid gap-2">
            {eventItems.map((item) => (
              item.itemType === "event"
                ? <ScheduleCompactEventRow item={item} key={item.id} />
                : <ScheduleItemCard item={item} teams={teams} courtMatches={getCourtMatchesForScheduleItem(item, courtMatches, teams)} hideTime key={item.id} />
            ))}
          </div>
        )}
        {!!blocks.length && <div className="grid gap-2.5">
        {blocks.map((block) => (
          <DayScheduleTeamBlock
            block={block}
            isOpen={openBlocks[block.id] ?? defaultOpen}
            onToggle={() => onToggleBlock(block.id)}
            teams={teams}
            showMatchCount={blocks.length > 1}
            onOpenMatch={onOpenMatch}
            onOpenTeam={onOpenTeam}
            key={block.id}
          />
        ))}
        </div>}
      </div>
    </section>
  );
}

function ScheduleCompactEventRow({ item }: { item: ScheduleItem }) {
  return (
    <article className="rounded-[16px] border-hairline border-line bg-brand-light px-4 py-3">
      <strong className="text-[16px] font-medium leading-snug text-text-primary">{item.matchLabel}</strong>
    </article>
  );
}

function ScheduleTimelineEventCard({ item }: { item: ScheduleItem }) {
  const isMeal = /breakfast|lunch|meal|snack/i.test(`${item.matchLabel} ${item.detail}`);
  return (
    <article className="grid min-h-[78px] grid-cols-[minmax(0,1fr)_32px] items-center gap-x-3 gap-y-1 rounded-[18px] border border-line bg-brand-light py-3 pl-12 pr-3.5 text-text-secondary">
      <span className="grid min-w-0 gap-1">
        <time className="whitespace-nowrap text-[12px] font-semibold leading-none text-[var(--mist)] sm:text-[13px]">{item.timeLabel}</time>
        <strong className="min-w-0 text-left text-[13px] font-semibold leading-snug text-[var(--ink)] sm:text-[14px]">{getScheduleMilestoneLabel(item)}</strong>
      </span>
      <span className="grid h-8 w-8 place-items-center rounded-full border border-line bg-white text-brand" aria-hidden="true">{isClosingScheduleItem(item) ? <CheckCircle2 size={15} /> : isMeal ? <Calendar size={15} /> : <Clock size={15} />}</span>
    </article>
  );
}

function ScheduleDayEventRail({ day, items }: { day: 1 | 2; items: ScheduleItem[] }) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-line bg-brand-light" aria-label={`Day ${day} timeline`}>
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto p-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
        {items.map((item) => (
          <article className="grid min-h-[62px] min-w-[220px] snap-start grid-cols-[32px_minmax(0,1fr)] items-center gap-2.5 rounded-[14px] border border-line bg-brand-light px-3 py-2 sm:min-w-0" key={item.id}>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-brand" aria-hidden="true">
              {isClosingScheduleItem(item) ? <CheckCircle2 size={15} /> : isLunchScheduleItem(item) ? <Calendar size={15} /> : <UsersRound size={15} />}
            </span>
            <span className="grid min-w-0 gap-0.5">
              <time className="text-[11px] font-medium leading-none text-text-muted">{item.timeLabel}</time>
              <strong className="truncate text-[13px] font-medium leading-snug text-brand">{getScheduleMilestoneLabel(item)}</strong>
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function DayScheduleEndCard() {
  return (
    <section className="rounded-[18px] border-hairline border-line bg-white px-4 py-3 text-center shadow-[0_10px_24px_rgba(var(--brand-deep-rgb),0.04)]">
      <strong className="text-[14px] font-medium text-brand">Day 1 ends</strong>
    </section>
  );
}

function DayScheduleTeamBlock({ block, teams, isOpen, showMatchCount, onToggle, onOpenMatch, onOpenTeam }: { block: TeamCourtScheduleBlock; teams: PublishedTeam[]; isOpen: boolean; showMatchCount: boolean; onToggle: () => void; onOpenMatch: (match: TeamCourtScheduleMatch) => void; onOpenTeam: (teamId: string) => void }) {
  const primaryTeam = teams.find((team) => team.id === block.primaryTeamId);
  const opponentTeam = teams.find((team) => team.id === block.opponentTeamId);
  const matchCount = block.matches.length;
  const firstMatch = block.matches[0];
  const ballTeam = firstMatch ? getBallTeamForMatchup(firstMatch.dayNumber, firstMatch.teamAId, firstMatch.teamBId, block.id, teams) : null;
  const showPrimaryBall = firstMatch ? firstMatch.dayNumber === 2 || ballTeam?.id === primaryTeam?.id : false;
  const showOpponentBall = firstMatch ? firstMatch.dayNumber === 2 ? false : ballTeam?.id === opponentTeam?.id : false;

  return (
    <article className="overflow-hidden rounded-[18px] border-hairline border-line bg-white shadow-[0_10px_24px_rgba(var(--brand-deep-rgb),0.05)]">
      <div
        className="group grid min-h-14 w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-3 text-left transition hover:bg-surface/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/30"
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          onToggle();
        }}
        aria-expanded={isOpen}
        aria-label={isOpen ? `Collapse ${block.primaryTeam} versus ${block.opponentTeam}` : `Expand ${block.primaryTeam} versus ${block.opponentTeam}`}
      >
        <span className="grid min-w-0 gap-2">
          <span className="flex min-w-0 items-center justify-between gap-4 rounded-[12px] border-hairline border-line bg-surface/65 px-2.5 py-1.5">
            {firstMatch?.podLabel && <em className="min-w-0 truncate text-[11px] font-medium not-italic text-brand">{firstMatch.podLabel}</em>}
            {showMatchCount && (
              <>
                <span className="h-1 w-1 shrink-0 rounded-full bg-text-muted/60" aria-hidden="true" />
                <em className="shrink-0 text-[11px] font-medium not-italic text-brand">{matchCount} {matchCount === 1 ? "match" : "matches"}</em>
              </>
            )}
          </span>
          <span className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
            <ScheduleTeamPill label={block.primaryTeam} color={primaryTeam?.jerseyColor || "var(--brand-primary-tint)"} logoUrl={primaryTeam?.logoUrl || ""} isFinalized={Boolean(primaryTeam)} showBallIcon={showPrimaryBall} compact onClick={primaryTeam ? () => onOpenTeam(primaryTeam.id) : undefined} />
            <em className="text-[10px] not-italic text-text-muted">vs</em>
            <ScheduleTeamPill label={block.opponentTeam} color={opponentTeam?.jerseyColor || "var(--brand-primary-tint)"} logoUrl={opponentTeam?.logoUrl || ""} isFinalized={Boolean(opponentTeam)} showBallIcon={showOpponentBall} compact onClick={opponentTeam ? () => onOpenTeam(opponentTeam.id) : undefined} />
          </span>
        </span>
        <span className="inline-grid h-9 w-9 place-items-center justify-self-center rounded-full bg-surface text-brand transition group-hover:bg-brand-light" aria-hidden="true">
          <ChevronDown size={19} strokeWidth={2.4} className={`transition-all duration-300 ease-out ${isOpen ? "rotate-180 translate-y-0 text-brand" : "translate-y-0.5 text-brand/85"}`} />
        </span>
      </div>
      {isOpen && (
        <div className="border-t-hairline border-line bg-surface/45 p-3">
          <div className="divide-y divide-line overflow-hidden rounded-[17px] border-hairline border-[var(--hairline-strong)] bg-white">
            {block.matches.map((match) => (
              <TeamCourtScheduleGame match={match} teamName={block.primaryTeam} onOpenMatch={onOpenMatch} grouped key={match.id} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function TeamCourtScheduleGame({ match, teamName, tournament, onOpenMatch, grouped = false }: { match: TeamCourtScheduleMatch; teamName: string; tournament?: Tournament | null; onOpenMatch: (match: TeamCourtScheduleMatch) => void; grouped?: boolean }) {
  const teamIsA = match.teamAName === teamName;
  const primaryPlayers = teamIsA ? match.playersA : match.playersB;
  const opponentPlayers = teamIsA ? match.playersB : match.playersA;
  const primaryProfiles = teamIsA ? match.playerProfilesA : match.playerProfilesB;
  const opponentProfiles = teamIsA ? match.playerProfilesB : match.playerProfilesA;
  const displayPrimaryPlayers = primaryPlayers.length ? primaryPlayers : [teamName];
  const displayOpponentPlayers = opponentPlayers.length ? opponentPlayers : ["Opponent TBD"];
  const courtNumber = formatCourtNumber(match.courtLabel || "");
  const isSingles = displayPrimaryPlayers.length === 1 && displayOpponentPlayers.length === 1;
  const primarySide: "A" | "B" = teamIsA ? "A" : "B";
  const primarySideWon = Boolean(match.score?.winnerSide && match.score.winnerSide === primarySide);
  const opponentSideWon = Boolean(match.score?.winnerSide && match.score.winnerSide !== primarySide);
  const matchState = getScheduleMatchState(match, tournament || null);

  if (tournament !== undefined) {
    const leftPlayers = match.playersA.length ? match.playersA : [match.teamAName || "Team A"];
    const rightPlayers = match.playersB.length ? match.playersB : [match.teamBName || "Team B"];
    const leftWon = match.score?.winnerSide === "A";
    const rightWon = match.score?.winnerSide === "B";
    return (
      <div className="tap-card group grid w-full cursor-pointer gap-2 rounded-[16px] border-hairline border-[var(--hairline-strong)] bg-[var(--surface)]/90 p-2.5 text-left transition hover:border-brand/25 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30" role="button" tabIndex={0} onClick={() => onOpenMatch(match)} onKeyDown={(event) => {
        if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) return;
        event.preventDefault();
        onOpenMatch(match);
      }} aria-label={`View ${match.format} match: ${leftPlayers.join(" and ")} versus ${rightPlayers.join(" and ")}`}>
        <span className="flex min-w-0 items-center justify-between gap-3">
          <span className="inline-flex min-w-0 items-center gap-1.5"><strong className="text-[12px] font-semibold text-text-secondary sm:text-[13px]">{match.format}</strong><MatchIdPill match={match} /></span>
          <ScheduleMatchStateBadge state={matchState} score={match.score} dayNumber={match.dayNumber} matchType={match.matchType} />
        </span>
        <span className="grid min-w-0 grid-cols-[minmax(0,1fr)_42px_minmax(0,1fr)_16px] items-center gap-1.5">
          <TeamSchedulePlayerStack names={leftPlayers} profiles={match.playerProfilesA} isWinner={leftWon} />
          <TeamScheduleCourtDivider courtNumber={courtNumber} />
          <TeamSchedulePlayerStack names={rightPlayers} profiles={match.playerProfilesB} isWinner={rightWon} />
          <span className="justify-self-end"><MatchCardSideCue /></span>
        </span>
        {matchState === "completed" && match.score && <CompletedMatchScore score={match.score} />}
        {matchState === "ongoing" && match.score && <LiveMatchScore score={match.score} />}
      </div>
    );
  }

  return (
    <div className={grouped ? "tap-card group relative grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_30px] items-center gap-2 bg-white p-2.5 text-left transition hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/30 sm:p-3" : "tap-card group relative grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_30px] items-center gap-2 rounded-[17px] border-hairline border-[var(--hairline-strong)] bg-white p-2.5 text-left transition hover:border-brand/30 hover:shadow-[0_12px_28px_rgba(var(--brand-deep-rgb), 0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 sm:p-3"} role="button" tabIndex={0} onClick={() => onOpenMatch(match)} onKeyDown={(event) => {
      if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      onOpenMatch(match);
    }} aria-label={`View match details: ${displayPrimaryPlayers.join(" and ")} versus ${displayOpponentPlayers.join(" and ")}`}>
      <span className="grid gap-2">
        {tournament !== undefined && <span className="flex justify-end"><ScheduleMatchStateBadge state={matchState} dayNumber={match.dayNumber} matchType={match.matchType} /></span>}
        <span className="grid min-h-[72px] grid-cols-[minmax(0,1fr)_46px_minmax(0,1fr)] items-stretch gap-2 sm:grid-cols-[minmax(0,1fr)_50px_minmax(0,1fr)] sm:gap-3">
          <PlayerNameStack label="" names={displayPrimaryPlayers} profiles={primaryProfiles} tone="primary" centerOnWideScreens={isSingles} isWinner={primarySideWon} />
          <CourtLineDivider label={courtNumber} />
          <PlayerNameStack label="" names={displayOpponentPlayers} profiles={opponentProfiles} tone="opponent" centerOnWideScreens={isSingles} isWinner={opponentSideWon} />
        </span>
        {tournament !== undefined && matchState === "completed" && match.score && <CompletedMatchScore score={match.score} />}
      </span>
      <span className="justify-self-center">
        <MatchCardSideCue />
      </span>
    </div>
  );
}

function TeamSchedulePlayerStack({ names, profiles, isWinner }: { names: string[]; profiles: MatchPlayerProfile[]; isWinner: boolean }) {
  return (
    <span className={isWinner ? "relative flex min-h-12 min-w-0 flex-wrap items-center justify-center gap-x-1 rounded-[11px] border-hairline border-[var(--accent)] bg-[var(--accent-tint)] px-2 py-1.5 text-center text-[12px] font-semibold leading-tight text-[var(--accent-ink)] sm:min-h-14 sm:text-[13px]" : "relative flex min-h-12 min-w-0 flex-wrap items-center justify-center gap-x-1 rounded-[11px] border-hairline border-[var(--hairline-strong)] bg-white px-2 py-1.5 text-center text-[12px] font-semibold leading-tight text-text-primary sm:min-h-14 sm:text-[13px]"}>
      {isWinner && <span className="absolute -right-1.5 -top-2 z-10 grid h-6 w-6 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-on)]" title="Winner" aria-label="Winner"><Trophy size={12} strokeWidth={2.4} /></span>}
      {names.map((name, index) => {
        const profile = profiles[index] || profiles.find((candidate) => normalizeName(candidate.name) === normalizeName(name));
        return (
          <Fragment key={`${name}:${index}`}>
            {index > 0 && <em className="not-italic text-text-muted">&amp;</em>}
            {profile?.id ? (
              <Link className="tap-card min-w-0 break-words underline decoration-current/20 underline-offset-2 hover:decoration-current" href={`/tournaments/players/${profile.id}?from=schedule`} onClick={(event) => event.stopPropagation()}>{name}</Link>
            ) : (
              <span className="min-w-0 break-words">{name}</span>
            )}
          </Fragment>
        );
      })}
    </span>
  );
}

function TeamScheduleCourtDivider({ courtNumber }: { courtNumber: string }) {
  return (
    <span className="grid min-w-0 content-center justify-items-center gap-1 text-center">
      <em className="text-[8px] font-semibold not-italic leading-none text-text-muted">vs</em>
      <strong className="grid min-h-10 min-w-9 place-items-center content-center rounded-[8px] bg-[var(--brand-deep)] px-1 py-1 text-white shadow-[0_6px_14px_rgba(var(--brand-deep-rgb), 0.14)]">
        <small className="font-mono text-[6px] font-semibold uppercase leading-none tracking-[0.07em] text-[var(--accent)]">court</small>
        <b className="font-mono text-[15px] font-semibold leading-none text-white">{courtNumber || "–"}</b>
      </strong>
    </span>
  );
}

function ScheduleTeamPill({ label, color, logoUrl, isFinalized, wrapName = false, compact = false, showBallIcon = false, onClick }: { label: string; color: string; logoUrl: string; isFinalized: boolean; wrapName?: boolean; compact?: boolean; showBallIcon?: boolean; onClick?: () => void }) {
  const teamTone = getTeamCardTone(color);
  const pillStyle = isFinalized
    ? { background: teamTone.background, color: teamTone.textColor, borderColor: teamTone.borderColor }
    : undefined;
  const Tag = onClick ? "button" : "span";
  const gridColumns = showBallIcon
    ? compact ? "grid-cols-[20px_minmax(0,1fr)_auto]" : "grid-cols-[28px_minmax(0,1fr)_auto]"
    : compact ? "grid-cols-[20px_minmax(0,1fr)]" : "grid-cols-[28px_minmax(0,1fr)]";
  return (
    <Tag className={isFinalized ? `${onClick ? "tap-card text-left" : ""} ${gridColumns} ${compact ? "gap-1 px-1" : "gap-2 px-2"} grid min-h-9 min-w-0 items-center rounded-full border-hairline py-1 shadow-[0_8px_18px_rgba(var(--brand-deep-rgb), 0.12)]` : `${onClick ? "tap-card text-left" : ""} ${gridColumns} ${compact ? "gap-1 px-1" : "gap-2 px-2"} grid min-h-9 min-w-0 items-center rounded-full border-hairline border-line bg-white py-1`} style={pillStyle} type={onClick ? "button" : undefined} onClick={(event) => {
      if (!onClick) return;
      event.stopPropagation();
      onClick();
    }}>
      {logoUrl ? (
        <span className={`${compact ? "h-5 w-5" : "h-7 w-7"} grid shrink-0 place-items-center overflow-hidden rounded-full bg-white/90 p-1 shadow-[inset_0_0_0_1px_rgba(var(--brand-deep-rgb),0.05)]`}>
          <img className="block h-full max-h-full w-full max-w-full object-contain" src={logoUrl} alt="" aria-hidden="true" />
        </span>
      ) : (
        <span className={`${compact ? "h-5 w-5 text-[8px]" : "h-7 w-7 text-[10px]"} grid place-items-center rounded-full font-medium text-white`} style={{ backgroundColor: normalizeTeamColor(color) }}>{getInitials(label || "Team")}</span>
      )}
      <strong className={isFinalized ? `${wrapName ? "whitespace-normal break-words leading-tight" : "truncate whitespace-nowrap"} ${compact ? "text-[10px] sm:text-[12px]" : "text-[13px]"} font-medium text-current` : `${wrapName ? "whitespace-normal break-words leading-tight" : "truncate whitespace-nowrap"} ${compact ? "text-[10px] sm:text-[12px]" : "text-[13px]"} font-medium text-text-primary`}>{label || "TBD"}</strong>
      {showBallIcon && <TennisBallIcon className={compact ? "h-4 w-4" : "h-5 w-5"} />}
    </Tag>
  );
}

function mapPublishedTeamsFromRows(rows: PublishedTeamRow[]): PublishedTeam[] {
  return rows.map((team) => {
    const members = Array.isArray(team.tournament_team_members) ? team.tournament_team_members : team.tournament_team_members ? [team.tournament_team_members] : [];
    return {
      id: team.id || "",
      name: team.name || "Team",
      sortOrder: team.sort_order || 0,
      logoUrl: team.logo_url || "",
      jerseyColor: getSourceTeamColor(team.jersey_color),
      sponsorName: team.sponsor_name || "",
      sponsorLogoUrl: team.sponsor_logo_url || "",
      sponsors: mapTeamSponsors(team.sponsors, team.sponsor_name || "", team.sponsor_logo_url || ""),
      members: members.map((member) => {
        const player = Array.isArray(member.players) ? member.players[0] : member.players;
        return {
          id: member.id || "",
          playerId: player?.id || "",
          name: player?.full_name || "Player",
          age: formatRegisteredPlayerAge(player?.date_of_birth, player?.age),
          city: player?.jamaat_city || "MRSA",
          tier: member.tier_at_draft ? `Tier ${member.tier_at_draft}` : "Tier TBD",
          rating: formatRegisteredPlayerRating(player?.rating),
          profilePhotoUrl: player?.profile_photo_url || "",
          isCaptain: Boolean(member.is_captain),
          draftOrder: member.draft_order ?? null
        };
      })
    };
  });
}

function mapTeamSponsors(value: unknown, legacyName = "", legacyLogoUrl = ""): TeamSponsor[] {
  const sponsors = Array.isArray(value) ? value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as { name?: unknown; logoUrl?: unknown; logo_url?: unknown; websiteUrl?: unknown; website_url?: unknown };
    const name = typeof row.name === "string" ? row.name.trim() : "";
    const logoUrl = typeof row.logoUrl === "string"
      ? row.logoUrl.trim()
      : typeof row.logo_url === "string"
        ? row.logo_url.trim()
        : "";
    const websiteUrl = normalizeSponsorWebsiteUrl(typeof row.websiteUrl === "string" ? row.websiteUrl : typeof row.website_url === "string" ? row.website_url : "");
    return name || logoUrl || websiteUrl ? [{ name, logoUrl, websiteUrl }] : [];
  }) : [];
  if (sponsors.length) return sponsors.slice(0, 12);

  const name = legacyName.trim();
  const logoUrl = legacyLogoUrl.trim();
  return name || logoUrl ? [{ name, logoUrl, websiteUrl: "" }] : [];
}

function normalizeSponsorWebsiteUrl(value: unknown) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return "";
  const candidate = /^https?:\/\//i.test(text) ? text : `https://${text}`;
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : "";
  } catch {
    return "";
  }
}

function groupScheduleItemsByTime(items: ScheduleItem[]) {
  return items.reduce<Record<string, ScheduleItem[]>>((groups, item) => {
    const label = item.timeLabel || item.dayLabel;
    groups[label] = groups[label] || [];
    groups[label].push(item);
    return groups;
  }, {});
}

function getDayScheduleEventItems(items: ScheduleItem[], dayNumber: number) {
  const eventItems = items.filter((item) => item.itemType === "event" && item.dayNumber === dayNumber);
  if (dayNumber === 2) return normalizeDayTwoScheduleEvents(eventItems);
  if (dayNumber !== 1) return eventItems;
  const withBreakfast = hasScheduleEventNear(eventItems, 8 * 60)
    ? eventItems
    : [createScheduleEventItem(1, "8:00-9:30 AM", "Breakfast / briefing / warmup / team setup", "Check in, eat, warm up, and settle into teams before matches begin.", -20), ...eventItems];
  const withLunch = hasScheduleEventNear(withBreakfast, 12 * 60 + 50)
    ? withBreakfast
    : [...withBreakfast, createScheduleEventItem(1, "12:50-1:30 PM", "Lunch", "Lunch break before afternoon matches resume.", 1250)];
  const withClosing = withLunch.some(isClosingScheduleItem)
    ? withLunch
    : [...withLunch, createScheduleEventItem(1, "6:00 PM", "Day 1 ends", "Day 1 concludes after the final scheduled match.", 1800)];
  return withClosing.sort((a, b) => getScheduleTimeSortValue(a.timeLabel || a.dayLabel) - getScheduleTimeSortValue(b.timeLabel || b.dayLabel));
}

function getTvDayScheduleEventItems(items: ScheduleItem[], dayNumber: 1 | 2) {
  const scheduleEvents = getDayScheduleEventItems(items, dayNumber);
  const morningAgenda = dayNumber === 1
    ? [
      createScheduleEventItem(1, "8:00 AM", "Facility opens", "Doors open for player arrival and check-in.", -60),
      createScheduleEventItem(1, "8:10 AM", "Breakfast", "Breakfast service begins.", -50),
      createScheduleEventItem(1, "8:20 AM", "Tilawat & Briefing", "Tilawat followed by the tournament briefing.", -40),
      createScheduleEventItem(1, "8:40 AM", "Team Huddles", "Teams meet before warm-up.", -30),
      createScheduleEventItem(1, "8:50 AM", "Stretching", "Pre-match stretching begins.", -20),
      createScheduleEventItem(1, "9:00 AM", "Practice", "Courts open for practice.", -10)
    ]
    : [
      createScheduleEventItem(2, "8:00 AM", "Facility opens", "Doors open for player arrival and check-in.", -50),
      createScheduleEventItem(2, "8:10 AM", "Breakfast & Briefing", "Breakfast service and the morning briefing begin.", -40),
      createScheduleEventItem(2, "8:20 AM", "Team Huddle", "Teams meet before warm-up.", -30),
      createScheduleEventItem(2, "8:30 AM", "Stretching", "Pre-match stretching begins.", -20),
      createScheduleEventItem(2, "8:40 AM", "Practice", "Courts open for practice.", -10)
    ];
  const withoutGenericMorningBlock = scheduleEvents.filter((item) => !isGenericPrematchScheduleItem(item));
  const existingLabels = new Set(withoutGenericMorningBlock.map((item) => normalizeName(item.matchLabel)));
  const detailedMorningAgenda = morningAgenda.filter((item) => !existingLabels.has(normalizeName(item.matchLabel)));
  return [...withoutGenericMorningBlock, ...detailedMorningAgenda]
    .sort((left, right) => getScheduleTimeSortValue(left.timeLabel || left.dayLabel) - getScheduleTimeSortValue(right.timeLabel || right.dayLabel));
}

function isGenericPrematchScheduleItem(item: ScheduleItem) {
  const label = normalizeName([item.matchLabel, item.detail].filter(Boolean).join(" "));
  return label.includes("breakfast")
    && label.includes("briefing")
    && (label.includes("warmup") || label.includes("warm up"))
    && (label.includes("team meetup") || label.includes("team setup"));
}

function normalizeDayTwoScheduleEvents(eventItems: ScheduleItem[]) {
  const normalized = new Map<string, ScheduleItem>();
  eventItems.filter((item) => !isLunchScheduleItem(item)).forEach((item) => {
    const key = normalizeName(item.matchLabel || item.phase || item.detail);
    if (!key) return;
    const existing = normalized.get(key);
    if (!existing || getScheduleTimeSortValue(item.timeLabel || item.dayLabel) < getScheduleTimeSortValue(existing.timeLabel || existing.dayLabel)) {
      normalized.set(key, item.matchLabel.toLowerCase() === "lunch" ? { ...item, timeLabel: "11:20-1:30" } : item);
    }
  });
  const values = Array.from(normalized.values());
  const withBreakfast = hasScheduleEventNear(values, 8 * 60)
    ? values
    : [createScheduleEventItem(2, "8:00-9:00 AM", "Breakfast / briefing / warmup / team setup", "Check in, eat, warm up, and settle into teams before matches begin.", -20), ...values];
  const withLunch = [
    ...withBreakfast,
    createScheduleEventItem(2, "11:30 AM onward", "Lunch available", "There is no dedicated lunch break. Please eat when your match schedule allows.", 1130)
  ];
  const withClosing = withLunch.some(isClosingScheduleItem)
    ? withLunch
    : [...withLunch, createScheduleEventItem(2, "6:15-7:00 PM", "Awards / wrapup", "Awards and tournament wrapup.", 1900)];
  return withClosing.sort((a, b) => getScheduleTimeSortValue(a.timeLabel || a.dayLabel) - getScheduleTimeSortValue(b.timeLabel || b.dayLabel));
}

function isLunchScheduleItem(item: ScheduleItem) {
  return normalizeName([item.matchLabel, item.phase, item.detail].filter(Boolean).join(" ")).includes("lunch");
}

function isClosingScheduleItem(item: ScheduleItem) {
  const label = normalizeName([item.matchLabel, item.phase, item.detail].filter(Boolean).join(" "));
  return label.includes("award") || label.includes("wrapup") || label.includes("wrap up") || label.includes("day 1 ends") || label.includes("day 2 ends");
}

function getScheduleMilestoneLabel(item: ScheduleItem) {
  if (isClosingScheduleItem(item)) return item.dayNumber === 1 ? "Day 1 ends" : "Awards & wrapup";
  if (isLunchScheduleItem(item)) return item.dayNumber === 2 ? "Lunch available" : "Lunch";
  return item.matchLabel?.trim() || "Tournament gathering";
}

function hasScheduleEventNear(items: ScheduleItem[], targetMinutes: number) {
  return items.some((item) => Math.abs(getScheduleTimeSortValue(item.timeLabel || item.dayLabel) - targetMinutes) <= 10);
}

function createScheduleEventItem(dayNumber: number, timeLabel: string, matchLabel: string, detail: string, sortOrder: number): ScheduleItem {
  return {
    id: `day-${dayNumber}-${normalizeScheduleTime(timeLabel)}-${normalizeName(matchLabel)}`,
    itemType: "event",
    dayNumber,
    dayLabel: `Day ${dayNumber}`,
    timeLabel,
    podLabel: "",
    courtLabel: "",
    phase: "",
    matchLabel,
    teamASortOrder: null,
    teamBSortOrder: null,
    teamALabel: "",
    teamBLabel: "",
    detail,
    sortOrder
  };
}

function getSortedScheduleTimeLabels(blockGroups: Record<string, TeamCourtScheduleBlock[]>, eventItems: ScheduleItem[]) {
  const labels = new Map<string, string>();
  Object.keys(blockGroups).forEach((label) => {
    labels.set(normalizeScheduleTime(label), label);
  });
  eventItems.forEach((item) => {
    const label = item.timeLabel || item.dayLabel;
    labels.set(normalizeScheduleTime(label), label);
  });
  return Array.from(labels.values()).sort((a, b) => getScheduleTimeSortValue(a) - getScheduleTimeSortValue(b) || a.localeCompare(b));
}

function buildScheduleTimelineEntries(matchLabels: string[], eventItems: ScheduleItem[]): ScheduleTimelineEntry[] {
  return [
    ...matchLabels.map((label): ScheduleTimelineEntry => ({
      kind: "matches",
      key: `matches-${normalizeScheduleTime(label)}`,
      label
    })),
    ...eventItems.map((item): ScheduleTimelineEntry => ({
      kind: "event",
      key: `event-${item.id}`,
      label: item.timeLabel || item.dayLabel,
      item
    }))
  ].sort((a, b) => getScheduleTimeSortValue(a.label) - getScheduleTimeSortValue(b.label) || a.label.localeCompare(b.label));
}

function groupPlayerMatchesByTime(matches: PlayerScheduleMatch[]) {
  return matches.reduce<Record<string, PlayerScheduleMatch[]>>((groups, match) => {
    const label = match.timeLabel || match.dayLabel;
    groups[label] = groups[label] || [];
    groups[label].push(match);
    return groups;
  }, {});
}

function groupTeamMatchesByTime(matches: TeamCourtScheduleMatch[]) {
  return matches.reduce<Record<string, TeamCourtScheduleMatch[]>>((groups, match) => {
    const label = match.timeLabel || match.dayLabel;
    groups[label] = groups[label] || [];
    groups[label].push(match);
    return groups;
  }, {});
}

function groupBracketNodesByTime(nodes: LiveBracketNode[]) {
  return nodes.reduce<Record<string, LiveBracketNode[]>>((groups, node) => {
    const label = node.timeLabel || "Time TBD";
    groups[label] = groups[label] || [];
    groups[label].push(node);
    return groups;
  }, {});
}

function getSortedPlayerScheduleTimeLabels(groups: Record<string, PlayerScheduleMatch[]>) {
  return Object.keys(groups).sort((a, b) => getScheduleTimeSortValue(a) - getScheduleTimeSortValue(b) || a.localeCompare(b));
}

function getScheduleItemsForTime(items: ScheduleItem[], timeLabel: string) {
  const normalizedTime = normalizeScheduleTime(timeLabel);
  return items.filter((item) => normalizeScheduleTime(item.timeLabel || item.dayLabel) === normalizedTime);
}

function getScheduleBlocksForTime(blockGroups: Record<string, TeamCourtScheduleBlock[]>, timeLabel: string) {
  const normalizedTime = normalizeScheduleTime(timeLabel);
  const matchingEntry = Object.entries(blockGroups).find(([label]) => normalizeScheduleTime(label) === normalizedTime);
  return matchingEntry?.[1] || [];
}

function getScheduleTimeSortValue(label: string) {
  const normalized = label.trim().toLowerCase();
  const match = normalized.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  let hours = Number(match[1]);
  const minutes = Number(match[2] || 0);
  const meridiem = match[3];
  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;
  if (!meridiem && hours >= 1 && hours <= 7) hours += 12;
  return hours * 60 + minutes;
}

function groupTeamCourtMatchesByTimeAndPair(matches: TeamCourtScheduleMatch[], teamId: string) {
  return matches.reduce<Record<string, TeamCourtScheduleBlock[]>>((groups, match) => {
    const label = match.timeLabel || match.dayLabel;
    groups[label] = groups[label] || [];
    const teamIsA = match.teamAId === teamId;
    const primaryTeamId = teamIsA ? match.teamAId : match.teamBId;
    const opponentTeamId = teamIsA ? match.teamBId : match.teamAId;
    const primaryTeam = teamIsA ? match.teamAName : match.teamBName;
    const opponentTeam = teamIsA ? match.teamBName : match.teamAName;
    const blockId = `${label}-${primaryTeam}-${opponentTeam}`;
    const existingBlock = groups[label].find((block) => block.id === blockId);
    if (existingBlock) {
      existingBlock.matches.push(match);
    } else {
      groups[label].push({
        id: blockId,
        primaryTeamId,
        opponentTeamId,
        primaryTeam,
        opponentTeam,
        matches: [match]
      });
    }
    return groups;
  }, {});
}

function groupAllTeamCourtMatchesByTimeAndPair(matches: TeamCourtScheduleMatch[]) {
  return matches.reduce<Record<string, TeamCourtScheduleBlock[]>>((groups, match) => {
    const label = match.timeLabel || match.dayLabel;
    groups[label] = groups[label] || [];
    const blockId = `${label}-${match.teamAId || match.teamAName}-${match.teamBId || match.teamBName}`;
    const existingBlock = groups[label].find((block) => block.id === blockId);
    if (existingBlock) {
      existingBlock.matches.push(match);
    } else {
      groups[label].push({
        id: blockId,
        primaryTeamId: match.teamAId,
        opponentTeamId: match.teamBId,
        primaryTeam: match.teamAName,
        opponentTeam: match.teamBName,
        matches: [match]
      });
    }
    return groups;
  }, {});
}

function mapMatchScores(rows: MatchScoreRow[]): MatchScore[] {
  return rows.map((row) => ({
    id: row.id,
    scheduleMatchId: row.schedule_match_id,
    sideASet1: row.side_a_set1,
    sideBSet1: row.side_b_set1,
    sideASet2: row.side_a_set2,
    sideBSet2: row.side_b_set2,
    sideASet3: row.side_a_set3,
    sideBSet3: row.side_b_set3,
    winnerSide: row.winner_side === "A" || row.winner_side === "B" ? row.winner_side : "",
    submittedById: row.submitted_by || "",
    submittedByName: "",
    submittedAt: row.submitted_at || ""
  }));
}

function getScoresByMatch(scores: MatchScore[]) {
  return scores.reduce<Record<string, MatchScore>>((map, score) => {
    map[score.scheduleMatchId] = score;
    return map;
  }, {});
}

function getEmptyScoreDraft(): ScoreDraft {
  return { sideASet1: "", sideBSet1: "", sideASet2: "", sideBSet2: "", sideASet3: "", sideBSet3: "" };
}

function getScoreDraftFromScore(score: MatchScore | null | undefined): ScoreDraft {
  if (!score) return getEmptyScoreDraft();
  return {
    sideASet1: score.sideASet1 == null ? "" : String(score.sideASet1),
    sideBSet1: score.sideBSet1 == null ? "" : String(score.sideBSet1),
    sideASet2: score.sideASet2 == null ? "" : String(score.sideASet2),
    sideBSet2: score.sideBSet2 == null ? "" : String(score.sideBSet2),
    sideASet3: score.sideASet3 == null ? "" : String(score.sideASet3),
    sideBSet3: score.sideBSet3 == null ? "" : String(score.sideBSet3)
  };
}

function parseScoreDraft(draft: ScoreDraft): { ok: true; values: { sideASet1: number | null; sideBSet1: number | null; sideASet2: number | null; sideBSet2: number | null; sideASet3: number | null; sideBSet3: number | null; winnerSide: "A" | "B" | "" } } | { ok: false; message: string } {
  const sideASet1 = parseOptionalScore(draft.sideASet1);
  const sideBSet1 = parseOptionalScore(draft.sideBSet1);
  const sideASet2 = parseOptionalScore(draft.sideASet2);
  const sideBSet2 = parseOptionalScore(draft.sideBSet2);
  const sideASet3 = parseOptionalScore(draft.sideASet3);
  const sideBSet3 = parseOptionalScore(draft.sideBSet3);
  if ([sideASet1, sideBSet1, sideASet2, sideBSet2].some((value) => value != null && value > 4)) return { ok: false, message: "Set 1 and Set 2 scores cannot be higher than 4." };
  if ([sideASet3, sideBSet3].some((value) => value != null && value > 10)) return { ok: false, message: "The Set 3 tie-break score cannot be higher than 10." };
  if ([sideASet1, sideBSet1, sideASet2, sideBSet2].some((value) => value == null)) return { ok: false, message: "Please enter scores for set 1 and set 2." };

  const set1Winner = getSetWinner(sideASet1, sideBSet1);
  const set2Winner = getSetWinner(sideASet2, sideBSet2);
  if (!set1Winner || !set2Winner) return { ok: false, message: "Each completed set needs a winner." };

  let winnerSide: "A" | "B" | "" = "";
  if (set1Winner === set2Winner) {
    winnerSide = set1Winner;
    return { ok: true, values: { sideASet1, sideBSet1, sideASet2, sideBSet2, sideASet3: null, sideBSet3: null, winnerSide } };
  } else {
    if (sideASet3 == null || sideBSet3 == null) return { ok: false, message: "Please enter set 3 because the teams split the first two sets." };
    const set3Winner = getSetWinner(sideASet3, sideBSet3);
    if (!set3Winner) return { ok: false, message: "Set 3 needs a winner." };
    winnerSide = set3Winner;
  }
  return { ok: true, values: { sideASet1, sideBSet1, sideASet2, sideBSet2, sideASet3, sideBSet3, winnerSide } };
}

function parseOptionalScore(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function getSetWinner(sideA: number | null, sideB: number | null): "A" | "B" | "" {
  if (sideA == null || sideB == null || sideA === sideB) return "";
  return sideA > sideB ? "A" : "B";
}

function getScoreEntryWindow(startsOn: string | null, endsOn: string | null): ScoreEntryWindow {
  if (!startsOn) return { canEdit: false, label: "Score entry opens on match day." };
  const startDate = new Date(`${startsOn}T00:00:00-05:00`);
  const endDate = new Date(`${endsOn || startsOn}T00:00:00-05:00`);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return { canEdit: false, label: "Score entry opens on match day." };
  const windowStart = new Date(startDate);
  windowStart.setDate(windowStart.getDate() - 1);
  windowStart.setHours(22, 0, 0, 0);
  const windowEnd = new Date(endDate);
  windowEnd.setDate(windowEnd.getDate() + 1);
  windowEnd.setHours(10, 0, 0, 0);
  const now = new Date();
  if (now < windowStart) return { canEdit: false, label: "Score entry opens Aug 7 at 10 PM CT." };
  if (now > windowEnd) return { canEdit: false, label: "Score entry is closed." };
  return { canEdit: true, label: "Score entry open" };
}

function getTeamPerformanceSummary(team: PublishedTeam, matches: TeamCourtScheduleMatch[]) {
  return matches.reduce((summary, match) => {
    if (!match.score?.winnerSide) return summary;
    const teamSide = match.teamAId === team.id ? "A" : match.teamBId === team.id ? "B" : "";
    if (!teamSide) return summary;
    if (match.score.winnerSide === teamSide) summary.wins += 1;
    else summary.losses += 1;
    return summary;
  }, { wins: 0, losses: 0 });
}

function getMemberPerformance(member: PublishedTeamMember, team: PublishedTeam, matches: TeamCourtScheduleMatch[]) {
  return matches.reduce((summary, match) => {
    const teamSide = match.teamAId === team.id ? "A" : match.teamBId === team.id ? "B" : "";
    if (!teamSide) return summary;
    const playerNames = teamSide === "A" ? match.playersA : match.playersB;
    if (!playerNames.some((name) => normalizeName(name) === normalizeName(member.name))) return summary;
    if (!match.score?.winnerSide) return summary;
    summary.played += 1;
    if (match.score.winnerSide === teamSide) summary.wins += 1;
    else summary.losses += 1;
    return summary;
  }, { played: 0, wins: 0, losses: 0 });
}

function getPlayerPerformance(player: PublishedTeamMember, matches: TeamCourtScheduleMatch[]) {
  return matches.reduce((summary, match) => {
    const playerIsA = match.playerProfilesA.some((profile) => profile.id === player.playerId || normalizeName(profile.name) === normalizeName(player.name));
    const playerIsB = match.playerProfilesB.some((profile) => profile.id === player.playerId || normalizeName(profile.name) === normalizeName(player.name));
    const playerSide = playerIsA ? "A" : playerIsB ? "B" : "";
    if (!playerSide || !match.score?.winnerSide) return summary;
    summary.played += 1;
    if (match.score.winnerSide === playerSide) summary.wins += 1;
    else summary.losses += 1;
    return summary;
  }, { played: 0, wins: 0, losses: 0 });
}

function getCourtMatchesForScheduleItem(item: ScheduleItem, matches: TeamCourtScheduleMatch[], teams: PublishedTeam[]) {
  if (item.itemType !== "match") return [];
  const teamA = item.teamASortOrder ? teams.find((team) => team.sortOrder === item.teamASortOrder) : null;
  const teamB = item.teamBSortOrder ? teams.find((team) => team.sortOrder === item.teamBSortOrder) : null;
  const itemTeamAName = normalizeName(teamA?.name || item.teamALabel);
  const itemTeamBName = normalizeName(teamB?.name || item.teamBLabel);
  const itemTime = normalizeScheduleTime(item.timeLabel);

  return matches.filter((match) => {
    if (match.dayNumber !== item.dayNumber || normalizeScheduleTime(match.timeLabel) !== itemTime) return false;
    const teamAId = teamA?.id || "";
    const teamBId = teamB?.id || "";
    const sameIds = Boolean(teamAId && teamBId)
      && ((match.teamAId === teamAId && match.teamBId === teamBId) || (match.teamAId === teamBId && match.teamBId === teamAId));
    if (sameIds) return true;
    const matchTeamAName = normalizeName(match.teamAName);
    const matchTeamBName = normalizeName(match.teamBName);
    const sameNames = (matchTeamAName === itemTeamAName && matchTeamBName === itemTeamBName) || (matchTeamAName === itemTeamBName && matchTeamBName === itemTeamAName);
    if (sameNames) return true;
    return Boolean(itemTeamAName && itemTeamBName)
      && ((matchTeamAName.includes(itemTeamAName) && matchTeamBName.includes(itemTeamBName)) || (matchTeamAName.includes(itemTeamBName) && matchTeamBName.includes(itemTeamAName)));
  });
}

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

function normalizeScheduleTime(value: string) {
  return value.replace(/[–—]/g, "-").replace(/\s+/g, "").trim().toLowerCase();
}

function formatPublicMatchId(match: Pick<PlayerScheduleMatch, "id" | "dayNumber" | "matchId">) {
  const externalId = match.matchId.trim();
  if (/^\d+$/.test(externalId)) return `D${match.dayNumber}-${externalId.padStart(3, "0")}`;

  const dayTwoMatch = externalId.match(/^day2:([a-z0-9]+):(\d+)$/i);
  if (dayTwoMatch) {
    const phaseCodes: Record<string, string> = {
      qualifier1: "Q1",
      qualifier2: "Q2",
      reentry1: "R1",
      reentry2: "R2",
      semifinal1: "SF1",
      semifinal2: "SF2",
      final: "F"
    };
    const phaseCode = phaseCodes[dayTwoMatch[1].toLowerCase()] || dayTwoMatch[1].slice(0, 4).toUpperCase();
    return `D2-${phaseCode}-${dayTwoMatch[2].padStart(2, "0")}`;
  }

  const externalCode = externalId.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 12);
  const stableCode = externalCode || match.id.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase() || "MATCH";
  return `D${match.dayNumber}-${stableCode}`;
}

function isScheduleItemForTeam(item: ScheduleItem, team: PublishedTeam) {
  return item.teamASortOrder === team.sortOrder || item.teamBSortOrder === team.sortOrder;
}

function mapPlayerScheduleMatches(matchRows: PlayerScheduleMatchRow[], playerRows: PlayerScheduleParticipantRow[], teams: PublishedTeam[], scores: MatchScore[], playerId: string): PlayerScheduleMatch[] {
  const playersByMatch = new Map<string, PlayerScheduleParticipantRow[]>();
  const scoresByMatch = getScoresByMatch(scores);
  playerRows.forEach((row) => {
    if (!row.schedule_match_id) return;
    playersByMatch.set(row.schedule_match_id, [...(playersByMatch.get(row.schedule_match_id) || []), row]);
  });

  return matchRows.flatMap((match) => {
    const participants = (playersByMatch.get(match.id) || []).sort((a, b) => String(a.side).localeCompare(String(b.side)) || Number(a.slot || 0) - Number(b.slot || 0));
    const current = participants.find((participant) => participant.player_id === playerId);
    if (!current) return [];
    const currentSide = current.side;
    const teamSide: "A" | "B" = currentSide === "B" ? "B" : "A";
    const playerSideNames = participants
      .filter((participant) => participant.side === currentSide)
      .map((participant) => participant.source_player_name || "Player");
    const mapParticipantProfile = (participant: PlayerScheduleParticipantRow): MatchPlayerProfile => {
      const participantTeam = teams.find((team) => team.id === participant.team_id);
      const member = participantTeam?.members.find((candidate) => candidate.playerId === participant.player_id)
        || participantTeam?.members.find((candidate) => normalizeName(candidate.name) === normalizeName(participant.source_player_name || ""));
      return {
        id: participant.player_id || member?.playerId || "",
        name: participant.source_player_name || member?.name || "Player",
        profilePhotoUrl: member?.profilePhotoUrl || ""
      };
    };
    const playerSideProfiles = participants.filter((participant) => participant.side === currentSide).map(mapParticipantProfile);
    const partnerNames = participants
      .filter((participant) => participant.side === currentSide && participant.player_id !== playerId)
      .map((participant) => participant.source_player_name || "Partner");
    const opponentNames = participants
      .filter((participant) => participant.side !== currentSide)
      .map((participant) => participant.source_player_name || "Opponent");
    const opponentProfiles = participants.filter((participant) => participant.side !== currentSide).map(mapParticipantProfile);
    const currentTeam = teams.find((team) => team.id === current.team_id);
    const opposingParticipant = participants.find((participant) => participant.side !== currentSide);
    const opposingTeam = teams.find((team) => team.id === opposingParticipant?.team_id);
    const fallbackTeamName = currentSide === "A" ? match.team_a_label : match.team_b_label;
    const fallbackOpposingTeamName = currentSide === "A" ? match.team_b_label : match.team_a_label;
    const format: "Singles" | "Doubles" = match.format === "Doubles" ? "Doubles" : "Singles";
    const matchColor: "Green" | "Red" | "" = match.match_color === "Green" || match.match_color === "Red" ? match.match_color : "";
    const ballTeam = getBallTeamForMatchup(
      match.day_number || 1,
      currentTeam?.id || current.team_id || "",
      opposingTeam?.id || opposingParticipant?.team_id || "",
      match.id,
      teams
    );

    return [{
      id: match.id,
      tournamentId: match.tournament_id || "",
      dayNumber: match.day_number || 1,
      dayLabel: match.day_label || `Day ${match.day_number || 1}`,
      timeLabel: match.time_label || "",
      courtLabel: match.court_label || "",
      podLabel: match.pod_label || "",
      format,
      matchType: match.match_type || "",
      matchColor,
      tierRule: match.tier_rule || "",
      teamSide,
      teamId: currentTeam?.id || current.team_id || "",
      opposingTeamId: opposingTeam?.id || opposingParticipant?.team_id || "",
      teamName: currentTeam?.name || fallbackTeamName || "Your team",
      opposingTeamName: opposingTeam?.name || fallbackOpposingTeamName || "Opposing team",
      teamColor: currentTeam?.jerseyColor || "var(--brand-primary-tint)",
      opposingTeamColor: opposingTeam?.jerseyColor || "var(--brand-primary-tint)",
      teamLogoUrl: currentTeam?.logoUrl || "",
      opposingTeamLogoUrl: opposingTeam?.logoUrl || "",
      ballTeamName: ballTeam?.name || "",
      playerSideNames,
      playerSideProfiles,
      partnerNames,
      opponentNames,
      opponentProfiles,
      score: scoresByMatch[match.id] || null,
      matchId: match.external_match_id || "",
      sortOrder: match.sort_order || 0
    }];
  }).sort((a, b) => a.dayNumber - b.dayNumber || a.sortOrder - b.sortOrder || a.courtLabel.localeCompare(b.courtLabel));
}

function mapTeamCourtScheduleMatches(matchRows: PlayerScheduleMatchRow[], playerRows: PlayerScheduleParticipantRow[], teams: PublishedTeam[], scores: MatchScore[]): TeamCourtScheduleMatch[] {
  const playersByMatch = new Map<string, PlayerScheduleParticipantRow[]>();
  const scoresByMatch = getScoresByMatch(scores);
  playerRows.forEach((row) => {
    if (!row.schedule_match_id) return;
    playersByMatch.set(row.schedule_match_id, [...(playersByMatch.get(row.schedule_match_id) || []), row]);
  });

  return matchRows.map((match) => {
    const participants = (playersByMatch.get(match.id) || []).sort((a, b) => String(a.side).localeCompare(String(b.side)) || Number(a.slot || 0) - Number(b.slot || 0));
    const teamA = teams.find((team) => team.id === match.team_a_id) || teams.find((team) => team.id === participants.find((participant) => participant.side === "A")?.team_id);
    const teamB = teams.find((team) => team.id === match.team_b_id) || teams.find((team) => team.id === participants.find((participant) => participant.side === "B")?.team_id);
    const mapParticipantProfile = (participant: PlayerScheduleParticipantRow, team: PublishedTeam | undefined): MatchPlayerProfile => {
      const member = team?.members.find((candidate) => candidate.playerId === participant.player_id)
        || team?.members.find((candidate) => normalizeName(candidate.name) === normalizeName(participant.source_player_name || ""));
      return {
        id: participant.player_id || member?.playerId || "",
        name: participant.source_player_name || member?.name || "Player",
        profilePhotoUrl: member?.profilePhotoUrl || ""
      };
    };
    const playerProfilesA = participants.filter((participant) => participant.side === "A").map((participant) => mapParticipantProfile(participant, teamA));
    const playerProfilesB = participants.filter((participant) => participant.side === "B").map((participant) => mapParticipantProfile(participant, teamB));
    const playersA = playerProfilesA.map((player) => player.name);
    const playersB = playerProfilesB.map((player) => player.name);
    const format: TeamCourtScheduleMatch["format"] = match.format === "Doubles" ? "Doubles" : "Singles";

    return {
      id: match.id,
      matchId: match.external_match_id || "",
      tournamentId: match.tournament_id || "",
      dayNumber: match.day_number || 1,
      dayLabel: match.day_label || `Day ${match.day_number || 1}`,
      timeLabel: match.time_label || "",
      courtLabel: match.court_label || "",
      podLabel: match.pod_label || "",
      teamAId: teamA?.id || "",
      teamBId: teamB?.id || "",
      teamAName: teamA?.name || match.team_a_label || "Team A",
      teamBName: teamB?.name || match.team_b_label || "Team B",
      teamAColor: teamA?.jerseyColor || "var(--brand-primary-tint)",
      teamBColor: teamB?.jerseyColor || "var(--brand-primary-tint)",
      format,
      matchType: match.match_type || "",
      tierRule: match.tier_rule || "",
      playersA,
      playersB,
      playerProfilesA,
      playerProfilesB,
      score: scoresByMatch[match.id] || null,
      sortOrder: match.sort_order || 0
    };
  }).sort((a, b) => a.dayNumber - b.dayNumber || a.sortOrder - b.sortOrder || a.courtLabel.localeCompare(b.courtLabel));
}

function getScheduleAssignedTeam(teams: PublishedTeam[], player: DbProfileRow | null) {
  const directTeam = teams.find((team) => team.members.some((member) => member.playerId && member.playerId === player?.id));
  if (directTeam) return directTeam;
  if (!isMoizSchedulePreviewPlayer(player)) return null;
  return teams.find((team) => team.members.some((member) => member.name.trim().toLowerCase() === "moiz broachwala")) || null;
}

function getSchedulePreviewPlayerId(teams: PublishedTeam[], player: DbProfileRow | null) {
  if (!player?.id) return "";
  if (isMoizSchedulePreviewPlayer(player)) {
    const moiz = teams.flatMap((team) => team.members).find((member) => member.name.trim().toLowerCase() === "moiz broachwala");
    return moiz?.playerId || player.id;
  }
  return player.id;
}

function isMoizSchedulePreviewPlayer(player: Pick<DbProfileRow, "full_name"> | null | undefined) {
  return player?.full_name?.trim().toLowerCase() === "mohammed segval";
}

function isScheduleSchemaMissing(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("tournament_schedule_matches")
    || normalized.includes("tournament_schedule_match_players")
    || normalized.includes("could not find the table")
    || normalized.includes("schema cache");
}

function isScoreSchemaMissing(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("tournament_match_scores")
    || normalized.includes("could not find the table")
    || normalized.includes("schema cache");
}

function formatTournamentStatus(status: string) {
  if (status === "registration_open") return "Registration is live";
  if (status === "registration_closed") return "Registration closed";
  if (status === "live") return "Tournament live";
  if (status === "completed") return "Tournament completed";
  if (status === "cancelled") return "Tournament cancelled";
  if (status === "draft") return "Draft tournament";
  return "Tournament status";
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
    <article className={editing ? "grid gap-2 rounded-[12px] border-hairline border-[var(--accent-line)] bg-white p-3 shadow-[0_6px_18px_rgba(var(--brand-deep-rgb), 0.035)]" : "grid gap-2 rounded-[12px] border-hairline border-line bg-card p-3"}>
      <span className="text-[13px] text-text-secondary">{label}</span>
      {editing ? (
        <input ref={inputRef} className="min-h-10 rounded-[10px] border-hairline border-brand bg-white px-3 text-[15px] text-text-primary outline-none transition ring-2 ring-brand-light placeholder:text-text-muted focus:border-brand focus:ring-4 focus:ring-brand-light" value={value} onChange={(event) => onChange?.(event.target.value)} aria-label={label} type={inputType} max={max} />
      ) : (
        <button className="tap-card grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-left" type="button" onClick={onEdit}>
          <strong className="break-words text-[15px] font-medium text-text-primary">{displayValue || value || "Not set"}</strong>
          <Pencil className="text-text-muted" size={14} aria-hidden="true" />
        </button>
      )}
      {helper && <em className="text-[13px] not-italic text-brand">{helper}</em>}
    </article>
  );
}

function BottomNav({ active, showAdmin }: { active: Tab; showAdmin: boolean }) {
  const tabs = [
    { id: "home" as const, href: "/dashboard", label: "Home", icon: House },
    { id: "tournament" as const, href: "/tournaments", label: "Tournament", icon: Trophy },
    { id: "profile" as const, href: "/profile", label: "Profile", icon: UsersRound },
    ...(showAdmin ? [{ id: "admin" as const, href: "/admin", label: "Admin", icon: Shield }] : [])
  ];

  return (
    <nav
      className="mrsa-bottom-nav fixed inset-x-0 bottom-0 z-50 grid border-t-hairline border-line bg-card px-4 py-3 md:inset-x-6 md:bottom-4 md:mx-auto md:max-w-shell md:rounded-[26px] md:border-hairline md:shadow-[0_16px_42px_rgba(var(--brand-deep-rgb),0.10)] lg:left-1/2 lg:right-auto lg:w-[min(760px,calc(100vw-64px))] lg:-translate-x-1/2"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`, paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
      aria-label="Primary mobile navigation"
    >
      {tabs.map(({ id, href, label, icon: Icon }) => (
        <Link className={active === id ? "grid min-h-12 place-items-center content-center gap-1 rounded-[16px] text-brand-primary" : "grid min-h-12 place-items-center content-center gap-1 rounded-[16px] text-text-secondary"} href={href} key={id}>
          <Icon size={22} strokeWidth={active === id ? 2.3 : 1.8} />
          <span className={active === id ? "text-[12px] font-bold leading-none" : "text-[12px] font-semibold leading-none"}>{label}</span>
          <span className={active === id ? "h-1 w-1 rounded-full bg-brand-primary" : "h-1 w-1 rounded-full bg-transparent"} />
        </Link>
      ))}
    </nav>
  );
}
