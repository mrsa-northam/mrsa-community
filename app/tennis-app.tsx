"use client";

import { AlertCircle, ArrowLeft, ArrowRight, BadgeDollarSign, Calendar, CheckCircle2, ChevronDown, Clock, DollarSign, Dumbbell, ExternalLink, House, Info, LogIn, LogOut, Mail, MapPin, Pencil, RefreshCw, Search, Shield, Shirt, Trash2, Trophy, UsersRound, X } from "lucide-react";
import dynamic from "next/dynamic";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, createContext, FormEvent, Fragment, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseClient } from "./lib/supabase";

const TournamentHeroAmbience = dynamic(() => import("./tournament-hero-ambience").then((mod) => mod.TournamentHeroAmbience), { ssr: false });

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
  jerseyName: string;
  tennisVideo: string;
  ustaNumber: string;
};

type TopPlayer = { id: string; name: string; rating: string; city: string; profilePhotoUrl: string };
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
  teamId: string;
  opposingTeamId: string;
  teamName: string;
  opposingTeamName: string;
  teamColor: string;
  opposingTeamColor: string;
  teamLogoUrl: string;
  opposingTeamLogoUrl: string;
  playerSideNames: string[];
  partnerNames: string[];
  opponentNames: string[];
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
  submittedAt: string;
};
type MatchPlayerProfile = {
  id: string;
  name: string;
  profilePhotoUrl: string;
};
type TeamCourtScheduleMatch = {
  id: string;
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
const DEFAULT_TEAM_COLOR = "#1a6e3c";
const videoDescription = "Recommended for draft placement: add a Google Drive link to a short video of you playing. Please set sharing to anyone with the link can view. Include your serve, forehand, backhand, volleys, and a few rally points so captains and organizers can evaluate your level for drafts.";
const memberPageClass = "min-h-dvh bg-[radial-gradient(circle_at_18%_0%,rgba(234,243,222,0.95)_0,transparent_32%),radial-gradient(circle_at_88%_14%,rgba(230,241,251,0.9)_0,transparent_30%),linear-gradient(180deg,#ffffff_0%,#fbfbf8_46%,#f7fbf1_100%)] pb-28 font-sans text-text-primary";
const memberMainClass = "mx-auto grid w-full max-w-shell gap-4 px-4 py-5 pb-32 md:px-6 lg:px-8";
const memberHeroClass = "relative grid overflow-hidden rounded-[18px] border-hairline border-white/20 bg-[linear-gradient(135deg,#103f24_0%,#174d2c_54%,#0f3a22_100%)] p-4 text-white shadow-[0_18px_46px_rgba(12,59,32,0.16)] md:p-5";
const memberHeroEyebrowClass = "text-[12px] font-medium text-white/58";
const memberHeroTitleClass = "max-w-[680px] text-[20px] font-medium leading-[1.12] tracking-[-0.2px] text-white md:text-[24px]";
const memberHeroBodyClass = "max-w-[620px] text-[13px] not-italic leading-relaxed text-white/68 md:text-[14px]";
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
const homeFunFacts = [
  "A tennis ball can spin more than 4,000 times per minute on a heavy topspin shot.",
  "The fastest recorded tennis serve is over 160 mph.",
  "A tennis court is 78 feet long from baseline to baseline.",
  "The longest professional tennis match lasted over 11 hours.",
  "Racquet strings can lose tension even when the racquet is not being used.",
  "Most tennis points are decided in four shots or fewer.",
  "The word tennis comes from the French word tenez, meaning take or receive.",
  "Wimbledon first started in 1877.",
  "Tennis balls were originally white before yellow became standard for TV visibility.",
  "The center service line divides the service boxes into deuce and ad sides.",
  "A let serve is replayed when the ball clips the net and still lands in."
];
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
    <span className="inline-flex items-center gap-2.5" aria-label="MRSA">
      <span className="relative h-14 w-14 shrink-0 overflow-hidden md:h-16 md:w-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/mrsa-logo.svg" alt="" aria-hidden="true" className="h-full w-full object-contain" />
      </span>
      <strong className="text-[22px] font-medium leading-none tracking-[-0.4px] text-brand md:text-[24px]">MRSA</strong>
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
    <header className="sticky top-0 z-30 border-b-hairline border-white/70 bg-white/70 px-4 py-2.5 shadow-[0_10px_30px_rgba(24,24,26,0.04)] backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-shell grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] items-center">
        <Link className="tap-card inline-flex min-w-0 justify-self-start" href="/dashboard" aria-label="MRSA home">
          <BrandMark />
        </Link>
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <Link className="tap-card inline-flex justify-self-end" href="/profile" aria-label={`${name} profile`}>
          <Avatar className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-brand text-[14px] font-medium text-white shadow-[0_8px_22px_rgba(24,24,26,0.08)]" name={name} photoUrl={photoUrl} />
        </Link>
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

function TournamentDetailRow({ icon, label, value, action, className = "", compact = false }: { icon: ReactNode; label: string; value: string; action?: ReactNode; className?: string; compact?: boolean }) {
  return (
    <div className={`grid ${compact ? "grid-cols-[28px_minmax(0,1fr)] gap-1.5 px-2 py-2" : "grid-cols-[52px_minmax(0,1fr)] gap-3 px-4 py-3.5"} border-t-hairline border-white/10 first:border-t-0 ${className}`}>
      <span className={`grid place-items-center self-center bg-[#34704a] text-[#83f0ad] ${compact ? "h-7 w-7 rounded-[10px]" : "h-10 w-10 rounded-[14px]"}`}>
        {icon}
      </span>
      <span className={`grid min-w-0 ${compact ? "gap-0.5" : "gap-1"}`}>
        <span className={`${compact ? "text-[10px]" : "text-[12px]"} font-medium uppercase tracking-[0.08em] text-white/50`}>{label}</span>
        <strong className={`break-words font-medium leading-tight text-white ${compact ? "text-[12px]" : "text-[16px]"}`}>{value}</strong>
        {action}
      </span>
    </div>
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
  if (nextPath.startsWith("/dashboard")) return "/dashboard";
  if (nextPath.startsWith("/tournaments")) return "/tournaments";
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
          <section className="overflow-hidden rounded-[18px] border-hairline border-line bg-white shadow-[0_18px_46px_rgba(12,59,32,0.10)]">
            <div className="relative overflow-hidden bg-[linear-gradient(135deg,#103f24_0%,#174d2c_54%,#0f3a22_100%)] px-5 pb-5 pt-5 text-white">
              <div className="pointer-events-none absolute inset-0 text-white opacity-[0.07]" aria-hidden="true">
                <svg className="h-full w-full scale-125" viewBox="0 0 340 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="22" y="18" width="296" height="184" stroke="currentColor" strokeWidth="1.1" />
                  <path d="M22 110H318M170 18V202M88 18V202M252 18V202M88 65H252M88 155H252" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              </div>
              <div className="relative z-10 grid justify-items-center gap-4 text-center">
                <span className="grid h-24 w-24 place-items-center rounded-full bg-white shadow-[0_12px_30px_rgba(0,0,0,0.14)] ring-1 ring-white/75 md:h-28 md:w-28">
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
      <div className={memberPageClass}>
        <main className="mx-auto grid min-h-dvh w-full max-w-[420px] content-center px-4 py-6 md:max-w-[440px]">
          <section className="overflow-hidden rounded-[18px] border-hairline border-line bg-white shadow-[0_18px_46px_rgba(12,59,32,0.10)]">
            <div className="relative overflow-hidden bg-[linear-gradient(135deg,#103f24_0%,#174d2c_54%,#0f3a22_100%)] px-5 pb-5 pt-5 text-white">
              <div className="pointer-events-none absolute inset-0 text-white opacity-[0.07]" aria-hidden="true">
                <svg className="h-full w-full scale-125" viewBox="0 0 340 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="22" y="18" width="296" height="184" stroke="currentColor" strokeWidth="1.1" />
                  <path d="M22 110H318M170 18V202M88 18V202M252 18V202M88 65H252M88 155H252" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              </div>
              <div className="relative z-10 grid justify-items-center gap-4 text-center">
                <span className="grid h-24 w-24 place-items-center rounded-full bg-white shadow-[0_12px_30px_rgba(0,0,0,0.14)] ring-1 ring-white/75 md:h-28 md:w-28">
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
        <header className="sticky top-0 z-30 border-b-hairline border-white/70 bg-white/75 px-4 py-2.5 shadow-[0_10px_30px_rgba(24,24,26,0.04)] backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-shell items-center justify-center">
            <Link className="inline-flex" href="/" aria-label="MRSA home">
              <BrandMark />
            </Link>
          </div>
        </header>

        <main className="mx-auto grid w-full max-w-[980px] gap-4 px-4 py-5 pb-24 md:px-6 md:py-6">
          <section className="grid min-w-0 overflow-hidden rounded-[18px] border-hairline border-line bg-card shadow-[0_18px_46px_rgba(12,59,32,0.10)] md:grid-cols-[0.85fr_1.15fr]">
            <div className="relative min-h-[210px] min-w-0 overflow-hidden bg-[linear-gradient(135deg,#103f24_0%,#174d2c_54%,#0f3a22_100%)] p-4 text-white md:min-h-0 md:p-6">
              <div className="pointer-events-none absolute inset-0 text-white opacity-[0.08]" aria-hidden="true">
                <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(circle_at_66%_58%,rgba(214,242,65,0.46)_0,rgba(214,242,65,0.46)_28px,transparent_29px),radial-gradient(ellipse_at_55%_70%,rgba(255,255,255,0.18)_0,rgba(255,255,255,0.10)_34%,transparent_58%)] opacity-80" aria-hidden="true" />
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

              <div className="grid gap-3 rounded-[14px] border-hairline border-line bg-card p-3">
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
        <header className="sticky top-0 z-30 border-b-hairline border-white/70 bg-white/75 px-4 py-2.5 shadow-[0_10px_30px_rgba(24,24,26,0.04)] backdrop-blur-xl">
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
              <em className="text-[13px] not-italic text-white/60">{isCompletingExistingProfile ? "Your profile is saved after these are added." : claimPlayerId ? "Admin can approve or reject this claim." : "0 tournaments played · 0 matches played"}</em>
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
                Jersey name optional
                <input className="min-h-11 rounded-[14px] border-hairline border-line bg-white px-3 text-[16px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light" name="jerseyName" type="text" placeholder="Name for shirt roster" defaultValue={claimedProfile?.jersey_name || ""} />
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
  const [homeFunFact] = useState(() => homeFunFacts[Math.floor(Math.random() * homeFunFacts.length)]);
  const [upcomingTournament, setUpcomingTournament] = useState<Tournament | null>(null);
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);
  const [dashboardUstaNumber, setDashboardUstaNumber] = useState("");
  const [dashboardUstaMessage, setDashboardUstaMessage] = useState("");
  const [savingDashboardUsta, setSavingDashboardUsta] = useState(false);
  const [showDashboardUstaPrompt, setShowDashboardUstaPrompt] = useState(false);
  const [dashboardUstaDismissed, setDashboardUstaDismissed] = useState(false);
  const [homeRegisteredCount, setHomeRegisteredCount] = useState(0);
  const [homePublishedTeamCount, setHomePublishedTeamCount] = useState(0);
  const [homeRegistered, setHomeRegistered] = useState(false);

  useEffect(() => {
    if (!appSession.ready || !appSession.userId) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const loadDashboard = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [{ data: tournamentData }, { data: profileData }, { data: playersData }] = await Promise.all([
        supabase
          .from("tournaments")
          .select("id, name, season_year, status, venue_name, venue_address, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents, max_players, notes, faqs")
          .gte("starts_on", today)
	          .in("status", ["registration_open", "registration_closed", "live"])
          .order("starts_on")
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
      if (tournamentData) {
        const [{ count: registeredCount }, { count: teamCount }] = await Promise.all([
          supabase
            .from("tournament_registrations")
            .select("id", { count: "exact", head: true })
            .eq("tournament_id", tournamentData.id)
            .neq("status", "cancelled")
            .in("payment_status", ["paid", "waived"]),
          supabase
            .from("tournament_teams")
            .select("id", { count: "exact", head: true })
            .eq("tournament_id", tournamentData.id)
            .eq("is_published", true)
        ]);
        setHomeRegisteredCount(registeredCount || 0);
        setHomePublishedTeamCount(teamCount || 0);
      } else {
        setHomeRegisteredCount(0);
        setHomePublishedTeamCount(0);
      }
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
      if (profileData) {
        setHomeRegistered(false);
        setDashboardUstaNumber(profileData.usta_number || "");
        setShowDashboardUstaPrompt(Boolean(!profileData.usta_number?.trim() && !dashboardUstaDismissed));
      }
      if (profileData && tournamentData) {
        const { data: registration } = await supabase
          .from("tournament_registrations")
          .select("id, status, payment_status, waitlist_status")
          .eq("tournament_id", tournamentData.id)
          .eq("player_id", profileData.id)
          .maybeSingle();

        const paidRegistration = Boolean(registration && ["paid", "waived"].includes(registration.payment_status));
        setHomeRegistered(paidRegistration);
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

  if (!appSession.ready || !appSession.userId || !appSession.profileComplete) return null;
  const homeRegistrationClosed = upcomingTournament?.status === "registration_closed";
  const homeRegisteredPlayerCountLabel = `${homeRegisteredCount} ${homeRegisteredCount === 1 ? "player" : "players"}`;

  return (
    <AppFrame active="home">
      <div className={memberPageClass}>
        <AppTopBar />

        <main className={memberMainClass}>
          <PageGreeting subtitle={`Did you know? ${homeFunFact}`} />
          {upcomingTournament ? (
            <section className={`relative grid overflow-hidden border-hairline border-white/20 bg-[linear-gradient(135deg,#103f24_0%,#174d2c_54%,#0f3a22_100%)] text-white shadow-[0_18px_46px_rgba(12,59,32,0.16)] ${homeRegistrationClosed ? "rounded-[18px] p-2.5" : "rounded-[22px] p-4"}`}>
              <TournamentHeroAmbience />
              <div className="pointer-events-none absolute inset-0 -right-16 -top-6 z-0 text-white opacity-[0.06]" aria-hidden="true">
                <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>
              <div className={`relative z-10 grid ${homeRegistrationClosed ? "gap-2" : "gap-3"}`}>
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <span className={`grid min-w-0 ${homeRegistrationClosed ? "gap-1" : "gap-2"}`}>
                    <span className={homeRegistrationClosed ? "inline-flex w-max items-center gap-1.5 text-[12px] font-normal text-white/60" : "inline-flex w-max items-center gap-2 rounded-full bg-white/[0.13] px-2.5 py-1 text-[12px] font-medium text-[#83f0ad]"}>
                      {upcomingTournament.status === "registration_open" && <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-accent-green" />}
                      {formatTournamentStatus(upcomingTournament.status)}
                    </span>
                    <h1 className={homeRegistrationClosed ? "min-w-0 max-w-full truncate whitespace-nowrap text-[16px] font-medium leading-tight text-white md:text-[19px]" : "max-w-[760px] text-[24px] font-medium leading-[1.1] tracking-[-0.3px] text-white md:text-[30px]"}>{upcomingTournament.name}</h1>
                  </span>
                  {homeRegistrationClosed && (
                    <span className="grid w-full gap-1.5 rounded-[13px] border-hairline border-white/10 bg-white/[0.08] px-2.5 py-1.5 text-left sm:w-auto sm:grid-cols-[max-content_auto] sm:items-center">
                      <em className="block whitespace-nowrap text-[11px] not-italic leading-tight text-white/60">Tournament starts in</em>
                      <TournamentStartCountdown countdown={homeTournamentCountdown} />
                    </span>
                  )}
                </div>

                <div className={homeRegistrationClosed ? "grid grid-cols-2 overflow-hidden rounded-[13px] border-hairline border-white/14 bg-white/[0.08]" : "grid overflow-hidden rounded-[20px] border-hairline border-white/14 bg-white/[0.10] md:grid-cols-2"}>
                  <TournamentDetailRow compact={homeRegistrationClosed} className={homeRegistrationClosed ? "!border-t-0" : "md:border-t-0"} icon={<Calendar size={homeRegistrationClosed ? 14 : 18} />} label="Dates" value={formatTournamentDates(upcomingTournament)} />
                  {!homeRegistrationClosed && <TournamentDetailRow className="md:border-l-hairline md:border-l-white/10 md:border-t-0" icon={<DollarSign size={20} />} label="Entry fee" value={formatCurrency(upcomingTournament.registrationFeeCents, "USD")} />}
                  <TournamentDetailRow
                    compact={homeRegistrationClosed}
                    className={homeRegistrationClosed ? "!border-t-0 border-l-hairline border-l-white/10" : "md:col-span-2"}
                    icon={<MapPin size={homeRegistrationClosed ? 14 : 20} />}
                    label="Venue"
                    value={upcomingTournament.venueName || "Venue TBD"}
                    action={(
                      <a className={`tap-card inline-flex w-max items-center gap-1 font-medium text-[#83f0ad] ${homeRegistrationClosed ? "text-[11px]" : "text-[14px]"}`} href={upcomingTournament.venueMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(upcomingTournament.venueName || "")}`} target="_blank" rel="noreferrer">
                        <ExternalLink size={homeRegistrationClosed ? 12 : 14} />
                        Open in maps
                      </a>
                    )}
                  />
                </div>

                {homeRegistrationClosed && (
                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                    <span className="rounded-[12px] bg-white/[0.08] px-2.5 py-1.5">
                      <em className="block text-[11px] not-italic text-white/60">Registered</em>
                      <strong className="block text-[13px] font-medium text-white">{homeRegisteredPlayerCountLabel}</strong>
                    </span>
                    <span className="rounded-[12px] bg-white/[0.08] px-2.5 py-1.5">
                      <em className="block text-[11px] not-italic text-white/60">Published teams</em>
                      <strong className="block text-[13px] font-medium text-white">{homePublishedTeamCount}</strong>
                    </span>
                    {homeRegistered && (
                      <span className="rounded-[12px] bg-white/[0.08] px-2.5 py-1.5 sm:col-span-1">
                        <em className="block text-[11px] not-italic text-white/60">Your status</em>
                        <strong className="block text-[13px] font-medium text-[#C9E84A]">Registered</strong>
                      </span>
                    )}
                  </div>
                )}
                <Link className="tap-card inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-[#B8FF35] px-4 text-[14px] font-medium text-[#153419] shadow-[0_18px_38px_rgba(184,255,53,0.16)] sm:w-max sm:justify-self-end xl:justify-self-center" href="/tournaments">
                  View tournament details
                  <ArrowRight size={15} />
                </Link>
              </div>
            </section>
          ) : (
            <StatusMessage tone="info">No live tournament found.</StatusMessage>
          )}

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
                <article className="grid min-h-[58px] grid-cols-[24px_36px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[12px] border-hairline border-line bg-white/84 p-2.5 shadow-[0_6px_18px_rgba(24,24,26,0.04)] backdrop-blur" key={player.id}>
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
            <div className="mt-2 grid gap-3 md:grid-cols-2">
              <Link className="tap-card grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-[18px] border-hairline border-line bg-card p-4 transition hover:border-line-strong md:items-center md:p-5" href="/about">
                <span className="grid gap-2">
                  <span className="text-[13px] text-text-secondary">What is MRSA?</span>
                  <strong className="text-lg font-medium leading-tight text-brand">Mumineen Racquet Sports Association</strong>
                  <em className="text-[15px] not-italic leading-relaxed text-text-secondary">A North America-wide community bringing together women through a shared passion for racquet sports — tennis, TT, badminton, and pickleball.</em>
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-full bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] text-white shadow-[0_12px_24px_rgba(12,59,32,0.18)]" aria-hidden="true">
                  <ArrowRight size={18} />
                </span>
              </Link>
              <Link className="tap-card grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-[18px] border-hairline border-line bg-card p-4 transition hover:border-line-strong md:items-center md:p-5" href="/fitness?from=dashboard">
                <span className="grid gap-2">
                  <span className="text-[13px] text-text-secondary">Fitness</span>
                  <strong className="text-lg font-medium leading-tight text-brand">Tennis fitness regimen</strong>
                  <em className="text-[15px] not-italic leading-relaxed text-text-secondary">Follow the 30-day tournament prep plan shared with players.</em>
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-full bg-[#e5f1ff] text-[#185fa5] shadow-[0_12px_24px_rgba(24,95,165,0.12)]" aria-hidden="true">
                  <Dumbbell size={18} />
                </span>
              </Link>
            </div>
          </section>
        </main>
        {showDashboardUstaPrompt && (
          <div className="fixed inset-0 z-50 grid place-items-end overflow-y-auto bg-black/35 px-3 pb-[112px] pt-16 backdrop-blur-sm sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="usta-profile-title">
            <section className="relative grid max-h-[calc(100dvh-150px)] w-full max-w-[520px] gap-4 overflow-y-auto rounded-[24px] border-hairline border-white/80 bg-white p-5 shadow-[0_24px_80px_rgba(24,24,26,0.22)] sm:max-h-[calc(100dvh-48px)]">
              <button className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border-hairline border-line bg-white text-text-secondary shadow-[0_8px_18px_rgba(24,24,26,0.08)] transition active:scale-95 disabled:opacity-60" type="button" onClick={skipDashboardUstaPrompt} disabled={savingDashboardUsta} aria-label="Skip USTA number for now">
                <X size={16} />
              </button>
              <div className="grid gap-2 pr-9">
                <span className="inline-flex w-max items-center rounded-full bg-brand-light px-3 py-1 text-[13px] font-medium text-[#3b6d11]">USTA affiliation</span>
                <h2 className="text-2xl font-medium leading-tight tracking-[-0.4px] text-text-primary" id="usta-profile-title">Add your USTA number</h2>
                <p className="text-[15px] leading-relaxed text-text-secondary">
                  MRSA is now affiliated with USTA. Scores from the upcoming MRSA tournament may count toward your ITF / WTN ranking.
                </p>
                <p className="rounded-[14px] border-hairline border-[#dbe8cd] bg-brand-light p-3 text-[14px] leading-relaxed text-[#3b6d11]">
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
                  <button className="tap-card inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] px-4 text-sm font-medium text-white shadow-[0_12px_26px_rgba(12,59,32,0.14)] disabled:opacity-60" type="submit" disabled={savingDashboardUsta}>
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
      </div>
    </AppFrame>
  );
}

export function DrawScreen() {
  const appSession = useProtectedRoute("/tournaments", true);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registeredPlayers, setRegisteredPlayers] = useState<RegisteredPlayer[]>([]);
  const [publishedTeams, setPublishedTeams] = useState<PublishedTeam[]>([]);
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
      setRegistrationShirtName("");
      setLoading(false);
      return;
    }

    const mappedTournament = mapTournament(tournamentData);
    setTournament(mappedTournament);

    const [registrationsResult, myRegistrationResult, latestPaymentResult, teamsResult, fitnessProgressResult] = await Promise.all([
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
    setPublishedTeams((teamsResult.data || []).map((team) => {
      const members = Array.isArray(team.tournament_team_members) ? team.tournament_team_members : team.tournament_team_members ? [team.tournament_team_members] : [];
      return {
        id: team.id,
        name: team.name || "Team",
        sortOrder: team.sort_order || 0,
        logoUrl: team.logo_url || "",
        jerseyColor: normalizeTeamColor(team.jersey_color),
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
    }));
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
      <div className="min-h-dvh bg-[radial-gradient(circle_at_18%_0%,rgba(234,243,222,0.95)_0,transparent_32%),radial-gradient(circle_at_88%_14%,rgba(230,241,251,0.9)_0,transparent_30%),linear-gradient(180deg,#ffffff_0%,#fbfbf8_46%,#f7fbf1_100%)] pb-28 font-sans text-text-primary">
        <AppTopBar />
        <main className="mx-auto grid w-full max-w-shell gap-4 px-4 py-5 pb-32 md:px-6 lg:px-8">
          {message && (
            <StatusMessage tone={paymentState === "failed" ? "error" : paymentState === "pending" ? "warning" : "success"}>
              {message}
            </StatusMessage>
          )}

          {tournament && tournamentProfileReminder && (
            <section className="grid gap-3 rounded-[16px] border-hairline border-[#f2dccb] bg-[#fff8f1] p-3.5 shadow-[0_10px_24px_rgba(138,74,34,0.06)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <span className="grid min-w-0 gap-1">
                <strong className="text-[15px] font-medium text-[#8a4a22]">Your tournament profile is incomplete</strong>
                <em className="text-[13px] not-italic leading-relaxed text-[#8a4a22]/85">
                  {tournamentProfileReminder.missingPhoto && tournamentProfileReminder.missingJerseyName
                    ? "Add your profile photo, jersey name, and jersey size now so your team card, shirt name, and roster details are ready before the tournament."
                    : tournamentProfileReminder.missingPhoto
                      ? "Add your profile photo now so your team card and roster details are ready before the tournament."
                      : tournamentProfileReminder.missingJerseyName
                        ? "Add your jersey name now so your shirt name and roster details are ready before the tournament."
                        : "Add your jersey size now so your shirt order and roster details are ready before the tournament."}
                </em>
              </span>
              <Link className="tap-card inline-flex min-h-10 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] px-4 text-[13px] font-medium text-white shadow-[0_12px_26px_rgba(12,59,32,0.14)]" href={buildTournamentProfileEditPath(tournament.id)}>
                Update now
              </Link>
            </section>
          )}

        <section className="grid gap-4">
          {!tournament && (
            <StatusMessage tone="info">No live tournament found.</StatusMessage>
          )}

          {tournament && (
            <section className="grid gap-3 md:grid-cols-3">
              <Link className="tap-card group relative grid min-h-[136px] overflow-hidden rounded-[22px] border-hairline border-white/40 bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] p-4 text-white shadow-[0_18px_42px_rgba(12,59,32,0.16)]" href="/tournaments/schedule">
                <span className="pointer-events-none absolute inset-0 opacity-25 court-lines" aria-hidden="true" />
                <span className="relative grid h-full content-between gap-4">
                  <span className="grid gap-1">
                    <span className="inline-grid h-10 w-10 place-items-center rounded-[14px] bg-white/14 text-[#83f0ad]">
                      <Calendar size={19} />
                    </span>
                    <strong className="text-[21px] font-medium leading-tight tracking-[-0.2px]">Schedule</strong>
                    <em className="text-[13px] not-italic leading-relaxed text-white/65">See your matches, team schedule, courts, and daily slate.</em>
                  </span>
                  <span className="inline-flex w-max items-center gap-2 rounded-full bg-[#b7ff2f] px-3 py-1.5 text-[13px] font-medium text-[#14340f]">
                    View schedule
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </Link>

              <Link className="tap-card group relative grid min-h-[136px] overflow-hidden rounded-[22px] border-hairline border-white/30 bg-[linear-gradient(145deg,#082d19,#104d2c_62%,#176638)] p-4 text-white shadow-[0_18px_42px_rgba(12,59,32,0.16)]" href="/tournaments/bracket">
                <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/10" aria-hidden="true" />
                <span className="pointer-events-none absolute right-8 top-8 h-16 w-16 rounded-full border border-white/10" aria-hidden="true" />
                <span className="relative grid h-full content-between gap-4">
                  <span className="grid gap-1">
                    <span className="inline-grid h-10 w-10 place-items-center rounded-[14px] bg-[#b7ff2f] text-[#14340f] shadow-[0_8px_18px_rgba(0,0,0,0.14)]">
                      <Trophy size={19} />
                    </span>
                    <span className="flex items-center gap-2">
                      <strong className="text-[21px] font-medium leading-tight tracking-[-0.2px]">Live bracket &amp; leaderboard</strong>
                      <em className="rounded-full bg-white/12 px-2 py-0.5 text-[9px] font-medium not-italic uppercase tracking-[0.08em] text-[#b7ff2f]">Live</em>
                    </span>
                    <em className="text-[13px] not-italic leading-relaxed text-white/65">Follow team seeds, advancement, scores, and the championship path.</em>
                  </span>
                  <span className="inline-flex w-max items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-brand">
                    Open bracket
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </Link>

              <Link className="tap-card group relative grid min-h-[136px] overflow-hidden rounded-[22px] border-hairline border-line bg-white/90 p-4 shadow-[0_18px_42px_rgba(12,59,32,0.08)] backdrop-blur" href="/tournaments/teams">
                <span className="grid h-full content-between gap-4">
                  <span className="grid gap-1">
                    <CaptainAvatarStack teams={publishedTeams} />
                    <strong className="text-[21px] font-medium leading-tight tracking-[-0.2px] text-text-primary">Team rosters</strong>
                    <em className="text-[13px] not-italic leading-relaxed text-text-secondary">{publishedTeams.length ? `${publishedTeams.length} published teams. Open a team to see players and matches.` : "Published teams will appear here once rosters are ready."}</em>
                  </span>
                  <span className="inline-flex w-max items-center gap-2 rounded-full bg-brand px-3 py-1.5 text-[13px] font-medium text-white">
                    View rosters
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </Link>
            </section>
          )}

          <section className="relative overflow-hidden rounded-[22px] border-hairline border-[#dbe8cd] bg-[linear-gradient(135deg,#ffffff_0%,#f7fbf1_55%,#eaf3de_100%)] p-4 shadow-[0_18px_42px_rgba(12,59,32,0.08)]">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
              <span className="grid gap-2">
                <span className="inline-grid h-10 w-10 place-items-center rounded-[14px] bg-brand text-[#b7ff2f]">
                  <Dumbbell size={19} />
                </span>
                <span className="grid gap-1">
                  <strong className="text-[21px] font-medium leading-tight tracking-[-0.2px] text-brand">Tennis fitness program</strong>
                  <em className="text-[14px] not-italic leading-relaxed text-text-secondary">Start with the first week and check off each day as you train. Small wins, steady legs.</em>
                </span>
                <Link className="tap-card inline-flex min-h-10 w-max items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] px-4 text-[13px] font-medium text-white shadow-[0_12px_26px_rgba(12,59,32,0.16)]" href="/fitness?from=tournament">
                  {completedFitnessDays.length ? "Continue program" : "Start program"}
                  <ArrowRight size={14} />
                </Link>
              </span>
              <div className="grid gap-2">
                <div className="grid gap-2 rounded-[18px] border-hairline border-white/80 bg-white/70 p-3">
                  <span className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <strong className="text-[14px] font-medium text-text-primary">{completedFitnessDays.length} of {tennisFitnessRegimen.length} days complete</strong>
                    <em className="text-[13px] not-italic text-[#3b6d11]">{fitnessProgressPercent}%</em>
                  </span>
                  <span className="h-2 overflow-hidden rounded-full bg-white">
                    <span className="block h-full rounded-full bg-[linear-gradient(90deg,#0c3b20,#4cde8c)]" style={{ width: `${fitnessProgressPercent}%` }} />
                  </span>
                  <span className="grid grid-cols-7 gap-1.5">
                    {previewFitnessDays.map((day) => {
                      const done = completedFitnessDays.includes(day.day);
                      return (
                        <span className={done ? "grid aspect-square place-items-center rounded-[10px] bg-brand text-white" : "grid aspect-square place-items-center rounded-[10px] bg-brand-light text-[12px] font-medium text-[#3b6d11]"} key={day.day}>
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
            <h2 className="text-[15px] font-medium text-[#27500a]">Have more questions? Contact organizer</h2>
            <a className="tap-card inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-brand px-4 text-[13px] font-medium text-white" href="https://wa.me/13128749178?text=Hi%2C%20I%27m%20looking%20at%20the%20MRSA%20tournament%20and%20have%20a%20question." target="_blank" rel="noreferrer">
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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-2.5 py-1 text-[12px] font-medium text-[#3b6d11]">
                {registeredPlayers.length}
                <ChevronDown size={15} className={`transition-transform ${registeredPlayersOpen ? "rotate-180" : ""}`} />
              </span>
            </button>
            {registeredPlayersOpen && (
              <div className="grid gap-2 border-t-hairline border-line p-2.5 md:grid-cols-2" id="registered-players-panel">
                {registeredPlayers.slice(0, 10).map((player, index) => (
                  <article className="grid min-h-[50px] grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[12px] border-hairline border-line bg-white px-2.5 py-2" key={player.name}>
                    <span className={index % 5 === 0 ? "grid h-[30px] w-[30px] place-items-center rounded-full bg-[#fde9dc] text-[12px] font-medium text-[#a94d24]" : index % 5 === 1 ? "grid h-[30px] w-[30px] place-items-center rounded-full bg-[#e5f1ff] text-[12px] font-medium text-[#185fa5]" : index % 5 === 2 ? "grid h-[30px] w-[30px] place-items-center rounded-full bg-[#eaf3de] text-[12px] font-medium text-[#3b6d11]" : index % 5 === 3 ? "grid h-[30px] w-[30px] place-items-center rounded-full bg-[#fbe7ef] text-[12px] font-medium text-[#aa3f6b]" : "grid h-[30px] w-[30px] place-items-center rounded-full bg-[#f1efe8] text-[12px] font-medium text-[#5f5e5a]"}>{getInitials(player.name)}</span>
                    <div className="grid min-w-0 gap-0.5">
                      <strong className="truncate text-[14px] font-medium text-text-primary">{player.name}</strong>
                      <em className="truncate text-[12px] not-italic text-text-secondary">{[player.city, player.age].filter(Boolean).join(" · ")}</em>
                      {player.tennisVideoUrl && (
                        <a className="inline-flex w-max items-center gap-1.5 text-[12px] font-medium text-[#185fa5]" href={player.tennisVideoUrl} target="_blank" rel="noreferrer" title="View playing video" aria-label={`${player.name} playing video`}>
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#e5f1ff]">
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
                {registeredPlayers.length > 10 && <Link className="tap-card inline-flex min-h-10 items-center justify-center rounded-[14px] bg-brand-light px-4 text-[13px] font-medium text-[#3b6d11] md:col-span-2" href="/tournaments/players">View all registered players →</Link>}
                {loading && !registeredPlayers.length && Array.from({ length: 4 }).map((_, index) => <SkeletonRow key={index} />)}
                {!loading && !registeredPlayers.length && <StatusMessage tone="info">No players registered yet.</StatusMessage>}
              </div>
            )}
          </section>
        </section>
        </main>
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
            <Link className="absolute left-4 top-4 z-10 inline-grid h-8 max-h-8 min-h-8 w-8 min-w-8 max-w-8 place-items-center rounded-full border-hairline border-white/20 bg-white/12 p-0 text-white shadow-[0_8px_18px_rgba(0,0,0,0.10)] backdrop-blur transition-transform active:scale-[0.98]" href={fitnessBackHref} aria-label={fitnessBackLabel}>
              <ArrowLeft size={17} />
            </Link>
            <div className="relative z-10 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <span className="grid gap-1.5 md:pl-12">
                <span className={memberHeroEyebrowClass}>Tennis fitness program</span>
                <h1 className="max-w-[680px] text-[26px] font-medium leading-[1.04] tracking-[-0.4px] text-white md:text-[34px]">30-day tournament prep</h1>
                <p className="max-w-[620px] text-[13px] leading-relaxed text-white/68">Choose your day, finish the workout, and track every session.</p>
              </span>
              <span className="grid grid-cols-2 gap-2 md:min-w-[270px]">
                <span className="grid gap-0.5 rounded-[14px] border-hairline border-white/12 bg-white/10 px-3 py-2 backdrop-blur">
                  <em className="inline-flex items-center gap-1.5 text-[10px] font-medium not-italic uppercase tracking-[0.06em] text-white/52"><Calendar size={12} /> Tournament</em>
                  <strong className="whitespace-nowrap text-[13px] font-medium leading-tight tabular-nums text-white sm:text-[14px]">{fitnessTournamentTime}</strong>
                </span>
                <span className="grid gap-0.5 rounded-[14px] border-hairline border-white/12 bg-white/10 px-3 py-2 backdrop-blur">
                  <em className="inline-flex items-center gap-1.5 text-[10px] font-medium not-italic uppercase tracking-[0.06em] text-white/52"><CheckCircle2 size={12} /> Progress</em>
                  <strong className="text-[17px] font-medium leading-tight text-white">{completedCount} / 30</strong>
                </span>
              </span>
            </div>
            <div className="relative z-10 grid gap-1.5">
              <span className="h-2 overflow-hidden rounded-full bg-white/14">
                <span className="block h-full rounded-full bg-[linear-gradient(90deg,#b7ff2f,#4cde8c)] transition-[width] duration-500" style={{ width: `${progressPercent}%` }} />
              </span>
              <span className="flex items-center justify-between gap-3 text-[11px] text-white/58">
                <em className="not-italic">{progressPercent}% complete</em>
                <em className="not-italic">{planStatus}</em>
              </span>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <aside className="order-1 grid gap-3 rounded-[20px] border-hairline border-line bg-white/90 p-3 shadow-[0_12px_30px_rgba(12,59,32,0.06)] backdrop-blur lg:order-2 lg:sticky lg:top-[76px]">
              <span className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <span className="grid gap-0.5">
                  <strong className="text-[17px] font-medium text-text-primary">Jump to any day</strong>
                  <em className="text-[12px] not-italic text-text-secondary">Your plan, at your pace.</em>
                </span>
                <span className="rounded-full bg-brand-light px-2.5 py-1 text-[11px] font-medium text-[#3b6d11]">{planStatus}</span>
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
                <button className="tap-card min-h-9 rounded-[12px] bg-brand-light px-2 text-[12px] font-medium text-[#3b6d11]" type="button" onClick={() => setSelectedFitnessDay(paceDay)}>
                  Plan pace · Day {paceDay}
                </button>
                <button className="tap-card min-h-9 rounded-[12px] bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] px-2 text-[12px] font-medium text-white disabled:opacity-45" type="button" onClick={() => recommendedOpenDay && setSelectedFitnessDay(recommendedOpenDay.day)} disabled={!recommendedOpenDay}>
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
                    return (
                      <button
                        className={done ? `${selected ? "ring-2 ring-brand-light" : ""} relative grid h-10 w-10 shrink-0 snap-center place-items-center rounded-[12px] bg-brand text-[12px] font-medium text-white shadow-[0_7px_16px_rgba(12,59,32,0.12)] md:w-auto` : selected ? "relative grid h-10 w-10 shrink-0 snap-center place-items-center rounded-[12px] border-hairline border-brand bg-white text-[12px] font-medium text-brand shadow-[0_7px_16px_rgba(12,59,32,0.08)] md:w-auto" : "relative grid h-10 w-10 shrink-0 snap-center place-items-center rounded-[12px] border-hairline border-line bg-white text-[12px] font-medium text-text-secondary md:w-auto"}
                        type="button"
                        onClick={() => setSelectedFitnessDay(day.day)}
                        key={day.day}
                        data-fitness-day={day.day}
                        aria-label={`View day ${day.day}${done ? ", completed" : ""}`}
                        aria-current={selected ? "step" : undefined}
                      >
                        {day.day}
                        {done && <CheckCircle2 className="absolute -right-1 -top-1 rounded-full bg-white text-brand" size={13} fill="white" />}
                      </button>
                    );
                  })}
                </div>
                <button className="tap-card grid h-10 place-items-center rounded-full bg-brand text-white shadow-[0_7px_16px_rgba(12,59,32,0.14)] disabled:opacity-30 md:hidden" type="button" onClick={() => scrollFitnessDayRail(1)} disabled={!canScrollFitnessDaysRight} aria-label="Show later fitness days">
                  <ArrowRight size={15} />
                </button>
              </div>

              <span className="grid grid-cols-3 gap-1 text-center text-[10px] font-medium text-text-muted">
                <em className="rounded-full bg-surface px-2 py-1 not-italic">1–10 Foundation</em>
                <em className="rounded-full bg-surface px-2 py-1 not-italic">11–20 Build</em>
                <em className="rounded-full bg-surface px-2 py-1 not-italic">21–30 Peak</em>
              </span>
            </aside>

            <article className="order-2 grid content-start gap-4 rounded-[22px] border-hairline border-[#dbe8cd] bg-[linear-gradient(135deg,#ffffff_0%,#f7fbf1_55%,#eaf3de_100%)] p-4 shadow-[0_18px_42px_rgba(12,59,32,0.08)] sm:p-5 lg:order-1">
              <span className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <span className="grid gap-1">
                  <em className="text-[11px] font-medium not-italic uppercase tracking-[0.08em] text-text-muted">{selectedDayPhase} phase</em>
                  <strong className="text-[28px] font-medium leading-none tracking-[-0.5px] text-brand">Day {selectedDay.day}</strong>
                  <em className="text-[13px] not-italic text-text-secondary">{selectedDay.exercises.length} {selectedDay.exercises.length === 1 ? "movement" : "movements"}</em>
                </span>
                <span className={selectedDayComplete ? "inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-[12px] font-medium text-white" : "inline-flex items-center gap-1.5 rounded-full bg-[#b7ff2f] px-3 py-1.5 text-[12px] font-medium text-[#14340f]"}>
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
                    <span className="grid min-h-[72px] grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-[16px] border-hairline border-white/85 bg-white/88 px-3 py-2.5 shadow-[0_8px_18px_rgba(12,59,32,0.04)]" key={exercise}>
                      <span className={selectedDayComplete ? "grid h-9 w-9 place-items-center rounded-full bg-brand text-white" : "grid h-9 w-9 place-items-center rounded-full bg-brand-light text-[13px] font-medium text-[#3b6d11]"}>
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
                  className={selectedDayComplete ? "tap-card inline-flex min-h-12 items-center justify-center gap-2 rounded-[15px] border-hairline border-line bg-white px-5 text-[14px] font-medium text-brand shadow-[0_10px_22px_rgba(12,59,32,0.06)] disabled:opacity-60" : "tap-card inline-flex min-h-12 items-center justify-center gap-2 rounded-[15px] bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] px-5 text-[14px] font-medium text-white shadow-[0_14px_30px_rgba(12,59,32,0.18)] disabled:opacity-60"}
                  type="button"
                  onClick={() => toggleFitnessDay(selectedDay.day)}
                  disabled={loading || savingDay === selectedDay.day}
                >
                  {savingDay === selectedDay.day ? "Saving..." : selectedDayComplete ? "Mark incomplete" : "Complete workout"}
                </button>
                <button className="tap-card inline-flex min-h-12 items-center justify-center gap-2 rounded-[15px] bg-brand-light px-4 text-[14px] font-medium text-[#3b6d11] disabled:opacity-40" type="button" onClick={selectNextFitnessDay} disabled={selectedDay.day === 30}>
                  Next day <ArrowRight size={15} />
                </button>
              </div>
            </article>
          </section>

          <section className="grid gap-3 rounded-[20px] border-hairline border-line bg-white p-4 shadow-[0_12px_30px_rgba(12,59,32,0.06)]" aria-labelledby="community-fitness-title">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <span className="grid gap-0.5">
                <em className="text-[10px] font-medium not-italic uppercase tracking-[0.1em] text-[#3b6d11]">Training together</em>
                <h2 className="text-[19px] font-medium tracking-[-0.2px] text-text-primary" id="community-fitness-title">Fitness Leaderboard</h2>
                <p className="text-[12px] text-text-secondary">See every registered player’s progress and keep each other moving.</p>
              </span>
              <span className="grid grid-cols-2 gap-2 text-center">
                <span className="grid min-w-[86px] gap-0.5 rounded-[12px] bg-brand-light px-2.5 py-2">
                  <strong className="text-[16px] font-medium leading-none text-brand">{communityActivePlayers}/{communityPlayers.length}</strong>
                  <em className="text-[9px] font-medium not-italic uppercase tracking-[0.04em] text-[#3b6d11]">Training</em>
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
                      <span className={index < 3 ? "grid h-6 w-6 place-items-center rounded-full bg-brand text-[9px] font-medium text-white" : "grid h-6 w-6 place-items-center rounded-full bg-white text-[9px] font-medium text-text-secondary"}>#{index + 1}</span>
                      <Avatar className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border-2 border-white bg-brand-light text-[10px] font-medium text-[#3b6d11] shadow-[0_5px_12px_rgba(12,59,32,0.08)]" name={player.name} photoUrl={player.profilePhotoUrl} ariaLabel={`${player.name} profile photo`} sizes="36px" />
                      <span className="grid min-w-0 gap-1">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <strong className="truncate text-[12px] font-medium text-text-primary">{player.name}</strong>
                          {isCurrentPlayer && <em className="shrink-0 rounded-full bg-white px-1.5 py-0.5 text-[8px] font-medium not-italic uppercase text-brand">You</em>}
                        </span>
                        <span className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                          <span className="h-1.5 overflow-hidden rounded-full bg-white">
                            <span className="block h-full rounded-full bg-[linear-gradient(90deg,#0c3b20,#4cde8c)]" style={{ width: `${playerProgressPercent}%` }} />
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

          <details className="group overflow-hidden rounded-[16px] border-hairline border-[#dbe8cd] bg-brand-light">
            <summary className="tap-card flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-[14px] font-medium text-[#27500a] [&::-webkit-details-marker]:hidden">
              Training guidance
              <ChevronDown className="transition-transform group-open:rotate-180" size={16} />
            </summary>
            <ul className="grid gap-2 border-t-hairline border-[#dbe8cd] px-4 py-3 text-[13px] leading-relaxed text-[#3b6d11] md:grid-cols-2">
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
  const searchParams = useSearchParams();
  const [teams, setTeams] = useState<PublishedTeam[]>([]);
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [playerMatches, setPlayerMatches] = useState<PlayerScheduleMatch[]>([]);
  const [teamCourtMatches, setTeamCourtMatches] = useState<TeamCourtScheduleMatch[]>([]);
  const [notes, setNotes] = useState<ScheduleNote[]>([]);
  const [filter, setFilter] = useState<"matches" | "team" | "day1" | "day2">("matches");
  const [openDayScheduleBlocks, setOpenDayScheduleBlocks] = useState<Record<string, boolean>>({});
  const [openingMatchId, setOpeningMatchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadSchedule = useCallback(async () => {
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
      .in("status", ["draft", "registration_open", "registration_closed", "live"])
      .order("starts_on", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      setMessage(getFriendlyError(error));
      setLoading(false);
      return;
    }
    if (!tournamentData) {
      setTeams([]);
      setItems([]);
      setPlayerMatches([]);
      setTeamCourtMatches([]);
      setNotes([]);
      setLoading(false);
      return;
    }

    const mappedTournament = mapTournament(tournamentData);

    const [teamsResult, itemsResult, notesResult, scheduleMatchesResult, schedulePlayersResult, scoresResult] = await Promise.all([
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
        .limit(400)
    ]);

    const playerScheduleSchemaMissing = isScheduleSchemaMissing(scheduleMatchesResult.error?.message || schedulePlayersResult.error?.message || "");
    const scoreSchemaMissing = isScoreSchemaMissing(scoresResult.error?.message || "");
    if (teamsResult.error || itemsResult.error || notesResult.error || (!playerScheduleSchemaMissing && (scheduleMatchesResult.error || schedulePlayersResult.error)) || (!scoreSchemaMissing && scoresResult.error)) {
      setMessage(getFriendlyError(teamsResult.error || itemsResult.error || notesResult.error || scheduleMatchesResult.error || schedulePlayersResult.error || scoresResult.error));
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
        jerseyColor: normalizeTeamColor(team.jersey_color),
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
    if (playerScheduleSchemaMissing) {
      setPlayerMatches([]);
      setTeamCourtMatches([]);
    } else {
      const mappedScores = scoreSchemaMissing ? [] : mapMatchScores(scoresResult.data || []);
      setPlayerMatches(mapPlayerScheduleMatches(scheduleMatchesResult.data || [], schedulePlayersResult.data || [], mappedTeams, mappedScores, getSchedulePreviewPlayerId(mappedTeams, appSession.player)));
      setTeamCourtMatches(mapTeamCourtScheduleMatches(scheduleMatchesResult.data || [], schedulePlayersResult.data || [], mappedTeams, mappedScores));
    }
    setLoading(false);
  }, [appSession.player, appSession.ready, appSession.userId]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  useEffect(() => {
    const nextFilter = searchParams.get("filter");
    if (nextFilter === "my") setFilter("team");
  }, [searchParams]);

  if (!appSession.ready || !appSession.userId || !appSession.profileComplete) return null;

  const assignedTeam = getScheduleAssignedTeam(teams, appSession.player);
  const visibleItems = items.filter((item) => {
    if (filter === "day1") return item.dayNumber === 1;
    if (filter === "day2") return item.dayNumber === 2 && !isLunchScheduleItem(item);
    if (filter === "team") return assignedTeam ? isScheduleItemForTeam(item, assignedTeam) : false;
    return true;
  });
  const visibleTeamCourtMatches = assignedTeam ? teamCourtMatches.filter((match) => match.teamAId === assignedTeam.id || match.teamBId === assignedTeam.id) : [];
  const groupedTeamCourtMatchBlocks = groupTeamCourtMatchesByTimeAndPair(visibleTeamCourtMatches, assignedTeam?.id || "");
  const visibleDayCourtMatches = filter === "day1" || filter === "day2" ? teamCourtMatches.filter((match) => match.dayNumber === (filter === "day1" ? 1 : 2)) : [];
  const groupedDayCourtMatchBlocks = groupAllTeamCourtMatchesByTimeAndPair(visibleDayCourtMatches);
  const dayEventItems = filter === "day1" || filter === "day2" ? getDayScheduleEventItems(items, filter === "day1" ? 1 : 2) : [];
  const groupedPlayerMatches = groupPlayerMatchesByTime(playerMatches);
  const playerScheduleTimeLabels = getSortedPlayerScheduleTimeLabels(groupedPlayerMatches);
  const teamScheduleTimeLabels = getSortedScheduleTimeLabels(groupedTeamCourtMatchBlocks, []);
  const dayScheduleTimeLabels = getSortedScheduleTimeLabels(groupedDayCourtMatchBlocks, dayEventItems);
  const openMatchDetails = (match: TeamCourtScheduleMatch) => {
    if (openingMatchId) return;
    setOpeningMatchId(match.id);
    router.push(`/tournaments/schedule/matches/${match.id}`);
  };
  const openTeamDetails = (teamId: string) => router.push(`/tournaments/schedule/teams/${teamId}`);
  const filterTabs = [
    { id: "matches" as const, label: "My schedule", helper: "Your courts" },
    { id: "team" as const, label: "Team schedule", helper: assignedTeam?.name || "Your team" },
    { id: "day1" as const, label: "Day 1", helper: "Full slate" },
    { id: "day2" as const, label: "Day 2", helper: "Bracket day" }
  ];
  return (
    <AppFrame active="tournament">
      <div className={memberPageClass}>
        <AppTopBar />
        <main className={memberMainClass}>
          <section className="relative overflow-hidden rounded-[26px] border-hairline border-white/20 bg-brand p-4 text-white shadow-[0_22px_52px_rgba(12,59,32,0.20)] sm:p-5 lg:p-6">
            <span className="pointer-events-none absolute inset-0 opacity-35 court-lines" aria-hidden="true" />
            <div className="relative grid gap-4">
              <div className="grid grid-cols-[34px_minmax(0,1fr)_34px] items-center gap-2">
                <Link className="tap-card grid h-8 w-8 place-items-center rounded-full border-hairline border-white/20 bg-white/10 text-white shadow-[0_8px_18px_rgba(0,0,0,0.10)]" href="/tournaments" aria-label="Back to tournament">
                  <ArrowLeft size={15} />
                </Link>
                <div className="grid min-w-0 justify-items-center gap-1 text-center">
                  <h1 className="text-[24px] font-medium leading-tight tracking-[-0.3px] text-white sm:text-[28px]">Schedule</h1>
                </div>
                <span aria-hidden="true" />
              </div>

              <div className="grid gap-2 rounded-[18px] border-hairline border-white/15 bg-white/10 p-1.5 backdrop-blur">
                <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
                  {filterTabs.map((tab) => (
                    <button className={filter === tab.id ? "tap-card grid min-h-10 min-w-0 place-items-center justify-items-center rounded-[13px] bg-white px-1.5 text-center text-brand shadow-[0_10px_22px_rgba(0,0,0,0.14)] sm:min-h-12 sm:gap-0.5 sm:px-2" : "tap-card grid min-h-10 min-w-0 place-items-center justify-items-center rounded-[13px] px-1.5 text-center text-white/68 hover:bg-white/10 sm:min-h-12 sm:gap-0.5 sm:px-2"} type="button" onClick={() => setFilter(tab.id)} key={tab.id}>
                      <strong className="block max-w-full text-center text-[11px] font-medium leading-tight sm:text-[13px]">{tab.label}</strong>
                      <em className={filter === tab.id ? "hidden max-w-full truncate text-[10px] not-italic leading-none text-brand/60 sm:block" : "hidden max-w-full truncate text-[10px] not-italic leading-none text-white/45 sm:block"}>{tab.helper}</em>
                    </button>
                  ))}
                </div>
              </div>

              <Link className="tap-card inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[14px] border-hairline border-white/20 bg-white/10 px-4 text-[13px] font-medium text-white backdrop-blur sm:justify-self-center md:w-max" href="/tournaments/schedule/rules">
                Tournament Rules &amp; Regulations
                <ArrowRight size={14} />
                <span className="rounded-full bg-white/14 px-2 py-0.5 text-[11px] text-white/72">{notes.length}</span>
              </Link>
            </div>
          </section>

          {message && <StatusMessage tone="error">{message}</StatusMessage>}
          {openingMatchId && <ScheduleLoadingNotice label="Opening match..." overlay />}

          {filter === "team" && !assignedTeam && (
            <StatusMessage tone="warning">No team assignment found yet. Your team schedule will appear here once rosters are published.</StatusMessage>
          )}

          <section className={openingMatchId ? "pointer-events-none grid gap-4 opacity-70" : "grid gap-4"} aria-label="Tournament schedule" aria-busy={Boolean(openingMatchId)}>
            {filter === "day2" && (
              <div className="grid grid-cols-[28px_minmax(0,1fr)] items-center gap-2.5 rounded-[15px] border-hairline border-[#f2dccb] bg-[#fff8f1] px-3 py-2.5 text-[#8a4a22]">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white"><Info size={14} /></span>
                <p className="text-[13px] leading-relaxed">No dedicated lunch break on Day 2. Lunch will be available from 11:30 AM onward—please eat when your match schedule allows.</p>
              </div>
            )}
            {filter === "matches" && (
              <div className="grid gap-4 xl:grid-cols-3">
                {playerScheduleTimeLabels.map((timeLabel, timeIndex) => (
                  <PlayerScheduleTimeCard
                    label={timeLabel}
                    matches={groupedPlayerMatches[timeLabel] || []}
                    teams={teams}
                    onOpenMatch={(match) => {
                      const fullMatch = teamCourtMatches.find((teamMatch) => teamMatch.id === match.id);
                      if (fullMatch) openMatchDetails(fullMatch);
                    }}
                    isFeatured={timeIndex === 0}
                    key={timeLabel}
                  />
                ))}
              </div>
            )}
            {filter === "team" && !!teamScheduleTimeLabels.length && (
              <div className="grid gap-4 xl:grid-cols-3">
                {teamScheduleTimeLabels.map((timeLabel) => {
                  const blocks = getScheduleBlocksForTime(groupedTeamCourtMatchBlocks, timeLabel);
                  return (
                    <DayScheduleTimeCard
                      blocks={blocks}
                      eventItems={[]}
                      label={timeLabel}
                      openBlocks={openDayScheduleBlocks}
                      onToggleBlock={(blockId) => setOpenDayScheduleBlocks((current) => ({ ...current, [blockId]: !(current[blockId] ?? false) }))}
                      teams={teams}
                      onOpenMatch={openMatchDetails}
                      onOpenTeam={openTeamDetails}
                      key={timeLabel}
                    />
                  );
                })}
              </div>
            )}
            {filter === "team" && !loading && !visibleTeamCourtMatches.length && !!visibleItems.length && (
              <div className="grid gap-4 xl:grid-cols-3">
                {Object.entries(groupScheduleItemsByTime(visibleItems)).map(([timeLabel, dayItems]) => (
                  <section className="grid gap-2.5" key={timeLabel}>
                    <ScheduleTimeHeader label={timeLabel} count={dayItems.length} />
                    <div className="grid gap-2.5">
                      {dayItems.map((item) => (
                        <ScheduleItemCard item={item} teams={teams} courtMatches={getCourtMatchesForScheduleItem(item, teamCourtMatches, teams)} key={item.id} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
            {(filter === "day1" || filter === "day2") && !!visibleDayCourtMatches.length && (
              <>
                <div className="grid gap-4 xl:grid-cols-3">
                  {dayScheduleTimeLabels.map((timeLabel) => (
                    <DayScheduleTimeCard
                      blocks={getScheduleBlocksForTime(groupedDayCourtMatchBlocks, timeLabel)}
                      eventItems={getScheduleItemsForTime(dayEventItems, timeLabel)}
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
                {filter === "day1" && <DayScheduleEndCard />}
              </>
            )}
            {(filter === "day1" || filter === "day2") && !visibleDayCourtMatches.length && !!visibleItems.length && (
              <div className="grid gap-4 xl:grid-cols-3">
                {Object.entries(groupScheduleItemsByTime(visibleItems)).map(([timeLabel, dayItems]) => (
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
            {!loading && filter === "matches" && !playerMatches.length && <StatusMessage tone="info">Your individual match assignments will appear here once posted.</StatusMessage>}
            {!loading && filter === "team" && !visibleTeamCourtMatches.length && !visibleItems.length && <StatusMessage tone="info">No team schedule items match this view.</StatusMessage>}
            {!loading && filter !== "matches" && filter !== "team" && !visibleItems.length && !visibleDayCourtMatches.length && <StatusMessage tone="info">No schedule items match this view.</StatusMessage>}
          </section>
        </main>
      </div>
    </AppFrame>
  );
}

export function TournamentScheduleRulesScreen() {
  const appSession = useProtectedRoute("/tournaments/schedule/rules", true);
  const [notes, setNotes] = useState<ScheduleNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadRules = useCallback(async () => {
    if (!appSession.ready || !appSession.userId) return;
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
  }, [appSession.ready, appSession.userId]);

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  if (!appSession.ready || !appSession.userId || !appSession.profileComplete) return null;

  return (
    <AppFrame active="tournament">
      <div className={memberPageClass}>
        <AppTopBar />
        <main className={memberMainClass}>
          <section className="relative overflow-hidden rounded-[26px] border-hairline border-white/20 bg-brand px-5 py-8 text-white shadow-[0_22px_52px_rgba(12,59,32,0.20)] sm:px-6 sm:py-10">
            <span className="pointer-events-none absolute inset-0 opacity-35 court-lines" aria-hidden="true" />
            <Link className="tap-card absolute left-4 top-4 z-10 inline-grid h-8 max-h-8 min-h-8 w-8 min-w-8 max-w-8 place-items-center rounded-full border-hairline border-white/20 bg-white/10 p-0 text-white shadow-[0_8px_18px_rgba(0,0,0,0.10)]" href="/tournaments/schedule" aria-label="Back to schedule">
                <ArrowLeft size={15} />
            </Link>
            <div className="relative grid min-w-0 justify-items-center px-8 text-center">
              <h1 className="max-w-[520px] text-[27px] font-medium leading-[1.08] tracking-[-0.3px] text-white sm:text-[34px]">Considerations and match rules</h1>
            </div>
          </section>

          {message && <StatusMessage tone="error">{message}</StatusMessage>}
          {loading && Array.from({ length: 4 }).map((_, index) => <SkeletonRow key={index} />)}
          {!loading && !notes.length && !message && <StatusMessage tone="info">Schedule considerations will appear here when posted.</StatusMessage>}
          {!!notes.length && (
            <section className="grid gap-3">
              {notes.map((note, index) => (
                <article className="grid gap-2 rounded-[18px] border-hairline border-line bg-white/90 p-4 shadow-[0_12px_28px_rgba(24,24,26,0.05)] backdrop-blur sm:p-5" key={note.id}>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-light text-[12px] font-medium text-[#3b6d11]">{index + 1}</span>
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
  const appSession = useProtectedRoute(`/tournaments/schedule/matches/${matchId}`, true);
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
    if (!appSession.ready || !appSession.userId) return;
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
        .select("id, schedule_match_id, side_a_set1, side_b_set1, side_a_set2, side_b_set2, side_a_set3, side_b_set3, winner_side, submitted_at")
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
  }, [appSession.player, appSession.ready, appSession.userId, matchId]);

  useEffect(() => {
    loadMatch();
  }, [loadMatch]);

  if (!appSession.ready || !appSession.userId || !appSession.profileComplete) return null;

  const entryWindow = getScoreEntryWindow(tournament?.startsOn || null, tournament?.endsOn || null);
  const canSubmitScore = Boolean(isOwnMatch && entryWindow.canEdit);
  const openedFromBracket = searchParams.get("from") === "bracket";
  const ballTeam = match ? getBallTeamForMatchup(match.dayNumber, match.teamAId, match.teamBId, match.id, teams) : null;
  const submitScore = async () => {
    if (!match || !appSession.player?.id || !canSubmitScore) return;
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
        submitted_by: appSession.player.id,
        submitted_at: new Date().toISOString()
      }, { onConflict: "schedule_match_id" })
      .select("id, schedule_match_id, side_a_set1, side_b_set1, side_a_set2, side_b_set2, side_a_set3, side_b_set3, winner_side, submitted_at")
      .maybeSingle();
    setSaving(false);
    if (error) {
      setMessage(getFriendlyError(error));
      return;
    }
    const nextScore = mapMatchScores(data ? [data] : [])[0] || null;
    setMatch((current) => current ? { ...current, score: nextScore } : current);
    setMessage("Score saved.");
  };

  return (
    <AppFrame active="tournament">
      <div className={memberPageClass}>
        <AppTopBar />
        <main className={memberMainClass}>
          {loading && <ScheduleLoadingNotice label="Loading match..." />}
          {message && !match && <StatusMessage tone="error">{message}</StatusMessage>}
          {match && (
            <MatchDetailPageCard
              canSubmit={canSubmitScore}
              backHref={openedFromBracket ? "/tournaments/bracket" : "/tournaments/schedule"}
              backLabel={openedFromBracket ? "Back to live bracket" : "Back to schedule"}
              draft={draft}
              entryLabel={isOwnMatch ? entryWindow.label : "Read only"}
              isOwnMatch={isOwnMatch}
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
  const appSession = useProtectedRoute(`/tournaments/schedule/teams/${teamId}`, true);
  const searchParams = useSearchParams();
  const [team, setTeam] = useState<PublishedTeam | null>(null);
  const [matches, setMatches] = useState<TeamCourtScheduleMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadTeam = useCallback(async () => {
    if (!appSession.ready || !appSession.userId) return;
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
  }, [appSession.ready, appSession.userId, teamId]);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  if (!appSession.ready || !appSession.userId || !appSession.profileComplete) return null;
  const openedFromRoster = searchParams.get("from") === "roster";
  const openedFromLeaderboard = searchParams.get("from") === "team-leaderboard";
  const backHref = openedFromRoster ? "/tournaments/teams" : openedFromLeaderboard ? "/tournaments/bracket?view=team-leaderboard" : "/tournaments/schedule";
  const backLabel = openedFromRoster ? "Back to team rosters" : openedFromLeaderboard ? "Back to team leaderboard" : "Back to schedule";

  return (
    <AppFrame active="tournament">
      <div className={memberPageClass}>
        <AppTopBar />
        <main className={memberMainClass}>
          {loading && <SkeletonRow />}
          {message && !team && <StatusMessage tone="error">{message}</StatusMessage>}
          {team && <TeamDetailPageCard backHref={backHref} backLabel={backLabel} matches={matches} team={team} />}
        </main>
      </div>
    </AppFrame>
  );
}

export function TournamentBracketScreen() {
  const appSession = useProtectedRoute("/tournaments/bracket", true);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<PublishedTeam[]>([]);
  const [matches, setMatches] = useState<TeamCourtScheduleMatch[]>([]);
  const [activeView, setActiveView] = useState<"bracket" | "team-leaderboard" | "player-leaderboard">("bracket");
  const [selectedBracketDay, setSelectedBracketDay] = useState<1 | 2>(1);
  const [selectedStage, setSelectedStage] = useState<BracketStageKey>("quarterfinals");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadBracket = useCallback(async () => {
    if (!appSession.ready || !appSession.userId) return;
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
    setMessage(scoreSchemaMissing || scheduleSchemaMissing ? "The live bracket will activate after the tournament score migrations are applied." : "");
    setLoading(false);
  }, [appSession.ready, appSession.userId]);

  useEffect(() => {
    loadBracket();
  }, [loadBracket]);

  useEffect(() => {
    const requestedView = new URLSearchParams(window.location.search).get("view");
    if (requestedView === "team-leaderboard" || requestedView === "player-leaderboard" || requestedView === "bracket") setActiveView(requestedView);
  }, []);

  useEffect(() => {
    if (!appSession.ready || !appSession.userId) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const channel = supabase
      .channel("live-team-bracket")
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_match_scores" }, loadBracket)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_schedule_matches" }, loadBracket)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_schedule_match_players" }, loadBracket)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_teams" }, loadBracket)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [appSession.ready, appSession.userId, loadBracket]);

  if (!appSession.ready || !appSession.userId || !appSession.profileComplete) return null;

  const dayOneMatches = matches.filter((match) => match.dayNumber === 1);
  const dayTwoMatches = matches.filter((match) => match.dayNumber === 2);
  const dayOneRoundNodes = buildDayOneRoundNodes(teams, dayOneMatches);
  const standings = getLiveTeamStandings(teams, dayOneMatches);
  const playerStandings = getLivePlayerStandings(teams, matches);
  const completedDayOneMatches = dayOneMatches.filter((match) => Boolean(match.score?.winnerSide)).length;
  const seedingIsFinal = Boolean(dayOneMatches.length && completedDayOneMatches === dayOneMatches.length && !standings.some((standing) => standing.requiresReview));
  const seedingStatus: "waiting" | "projected" | "final" = seedingIsFinal ? "final" : completedDayOneMatches ? "projected" : "waiting";
  const bracketStages = buildLiveTeamBracket(standings, dayTwoMatches, seedingStatus !== "waiting");

  return (
    <AppFrame active="tournament">
      <div className={memberPageClass}>
        <AppTopBar />
        <main className={memberMainClass}>
          <section className={`${memberHeroClass} min-h-[150px] content-center p-4 pt-14 sm:min-h-[220px] sm:p-7 sm:pt-20`}>
            <TournamentHeroAmbience />
            <Link className="tap-card absolute left-3 top-3 z-20 inline-grid h-8 max-h-8 min-h-8 w-8 max-w-8 min-w-8 place-items-center rounded-full border-hairline border-white/25 bg-white/12 p-0 text-white shadow-[0_8px_18px_rgba(0,0,0,0.10)] backdrop-blur transition-transform hover:-translate-x-0.5 active:scale-[0.98] sm:left-4 sm:top-4 sm:h-9 sm:max-h-9 sm:min-h-9 sm:w-9 sm:max-w-9 sm:min-w-9" href="/tournaments" aria-label="Back to tournament">
              <ArrowLeft size={15} />
            </Link>
            <span className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border-hairline border-white/20 bg-white/12 px-2 py-1 text-[8px] font-medium uppercase tracking-[0.08em] text-[#b7ff2f] backdrop-blur sm:right-4 sm:top-4 sm:px-2.5 sm:py-1.5 sm:text-[10px]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#b7ff2f]" />
              Live results
            </span>
            <div className="relative z-10 mx-auto grid w-full justify-items-center gap-1.5 text-center sm:max-w-[720px] sm:gap-2">
              <h1 className="max-w-[330px] text-[26px] font-medium leading-[1.02] tracking-[-0.6px] text-white sm:max-w-none sm:text-[48px] sm:tracking-[-0.8px]">Live bracket &amp; leaderboard</h1>
              <p className="hidden max-w-[660px] text-[15px] leading-relaxed text-white/70 sm:block">Day 1 sets the seeds. Every submitted score then updates the team path through Advantage, Survival, Re-entry, Semifinals, and the Final.</p>
            </div>
          </section>

          {message && <StatusMessage tone="warning">{message}</StatusMessage>}
          {loading && Array.from({ length: 3 }).map((_, index) => <SkeletonRow key={index} />)}

          {!loading && !teams.length && !message && <StatusMessage tone="info">Published teams will appear here once the rosters are ready.</StatusMessage>}

          {!loading && !!teams.length && (
            <>
              <section className="grid grid-cols-3 gap-1 rounded-[17px] border-hairline border-line bg-white p-1.5 shadow-[0_10px_26px_rgba(24,24,26,0.05)]" aria-label="Bracket page view">
                <button className={activeView === "bracket" ? "tap-card grid min-h-11 place-items-center rounded-[13px] bg-brand px-1.5 !text-center text-[11px] font-medium leading-tight text-white shadow-[0_8px_18px_rgba(12,59,32,0.14)] sm:px-3 sm:text-[13px]" : "tap-card grid min-h-11 place-items-center rounded-[13px] bg-surface/45 px-1.5 !text-center text-[11px] font-medium leading-tight text-text-secondary sm:px-3 sm:text-[13px]"} type="button" onClick={() => setActiveView("bracket")} aria-pressed={activeView === "bracket"}>Bracket</button>
                <button className={activeView === "team-leaderboard" ? "tap-card grid min-h-11 place-items-center rounded-[13px] bg-brand px-1.5 !text-center text-[10px] font-medium leading-tight text-white shadow-[0_8px_18px_rgba(12,59,32,0.14)] sm:px-3 sm:text-[13px]" : "tap-card grid min-h-11 place-items-center rounded-[13px] bg-surface/45 px-1.5 !text-center text-[10px] font-medium leading-tight text-text-secondary sm:px-3 sm:text-[13px]"} type="button" onClick={() => setActiveView("team-leaderboard")} aria-pressed={activeView === "team-leaderboard"}>Team leaderboard</button>
                <button className={activeView === "player-leaderboard" ? "tap-card grid min-h-11 place-items-center rounded-[13px] bg-brand px-1.5 !text-center text-[10px] font-medium leading-tight text-white shadow-[0_8px_18px_rgba(12,59,32,0.14)] sm:px-3 sm:text-[13px]" : "tap-card grid min-h-11 place-items-center rounded-[13px] bg-surface/45 px-1.5 !text-center text-[10px] font-medium leading-tight text-text-secondary sm:px-3 sm:text-[13px]"} type="button" onClick={() => setActiveView("player-leaderboard")} aria-pressed={activeView === "player-leaderboard"}>Player leaderboard</button>
              </section>

              {activeView === "team-leaderboard" && <LiveTeamLeaderboard completedMatches={completedDayOneMatches} matches={dayOneMatches.length} seasonYear={tournament?.seasonYear} seedingIsFinal={seedingIsFinal} standings={standings} />}
              {activeView === "player-leaderboard" && <LivePlayerLeaderboard seasonYear={tournament?.seasonYear} standings={playerStandings} />}

              {activeView === "bracket" && (
                <>
                  <section className="grid grid-cols-2 gap-1.5 rounded-[17px] border-hairline border-[#dbe8cd] bg-brand-light/65 p-1.5" aria-label="Bracket day filter">
                    <button className={selectedBracketDay === 1 ? "tap-card flex min-h-11 items-center justify-center gap-2 rounded-[13px] bg-white px-2 text-brand shadow-[0_7px_16px_rgba(12,59,32,0.10)]" : "tap-card flex min-h-11 items-center justify-center gap-2 rounded-[13px] px-2 text-[#4f775b]"} type="button" onClick={() => setSelectedBracketDay(1)} aria-pressed={selectedBracketDay === 1}><strong className="text-[13px] font-medium">Day</strong><span className={selectedBracketDay === 1 ? "grid h-7 w-7 place-items-center rounded-full bg-brand text-[11px] font-semibold text-white" : "grid h-7 w-7 place-items-center rounded-full bg-white/75 text-[11px] font-semibold"}>1</span></button>
                    <button className={selectedBracketDay === 2 ? "tap-card flex min-h-11 items-center justify-center gap-2 rounded-[13px] bg-white px-2 text-brand shadow-[0_7px_16px_rgba(12,59,32,0.10)]" : "tap-card flex min-h-11 items-center justify-center gap-2 rounded-[13px] px-2 text-[#4f775b]"} type="button" onClick={() => setSelectedBracketDay(2)} aria-pressed={selectedBracketDay === 2}><strong className="text-[13px] font-medium">Day</strong><span className={selectedBracketDay === 2 ? "grid h-7 w-7 place-items-center rounded-full bg-brand text-[11px] font-semibold text-white" : "grid h-7 w-7 place-items-center rounded-full bg-white/75 text-[11px] font-semibold"}>2</span></button>
                  </section>
                  {selectedBracketDay === 1
                    ? <LiveDayOneRound nodes={dayOneRoundNodes} />
                    : <LiveBracketBoard seedingStatus={seedingStatus} selectedStage={selectedStage} stages={bracketStages} onSelectStage={setSelectedStage} />}
                </>
              )}
            </>
          )}
        </main>
      </div>
    </AppFrame>
  );
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
            <Link className="absolute left-4 top-4 z-10 inline-grid h-8 max-h-8 min-h-8 w-8 min-w-8 max-w-8 place-items-center rounded-full border-hairline border-white/20 bg-white/12 p-0 text-white shadow-[0_8px_18px_rgba(0,0,0,0.10)] backdrop-blur transition-transform active:scale-[0.98]" href="/tournaments" aria-label="Back to tournament">
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
                const teamTone = getTeamCardTone(team.jerseyColor);
                const captain = team.members.find((member) => member.isCaptain);
                return (
                  <article className="tap-card group relative grid gap-3 overflow-hidden rounded-[18px] border-hairline border-white/25 p-3 shadow-[0_14px_34px_rgba(12,59,32,0.12)]" key={team.id} style={{ background: teamTone.background, color: teamTone.textColor }}>
                    <Link className="absolute inset-0 z-0 rounded-[18px]" href={`/tournaments/schedule/teams/${team.id}?from=roster`} aria-label={`View ${team.name}`} />
                    <span className="pointer-events-none relative z-[1] grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3">
                      {team.logoUrl ? (
                        <img className="h-12 w-12 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.16)]" src={team.logoUrl} alt={`${team.name} logo`} />
                      ) : (
                        <span className="grid h-12 w-12 place-items-center rounded-full bg-white/18 text-[13px] font-medium text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]">{getInitials(team.name)}</span>
                      )}
                      <span className="grid min-w-0 gap-0.5">
                        <strong className="truncate text-[18px] font-medium text-current">{team.name}</strong>
                        <em className="truncate text-[12px] not-italic text-current opacity-70">{captain ? `Captain: ${captain.name}` : "Captain TBD"}</em>
                      </span>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-brand transition-transform group-hover:translate-x-0.5">
                        <ArrowRight size={15} />
                      </span>
                    </span>
                    <span className="pointer-events-none relative z-[1] grid gap-1.5 rounded-[14px] border-hairline border-white/35 bg-white/[0.86] p-2">
                      {team.members.map((member) => (
                        <span className="grid grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-2 text-text-primary" key={member.id}>
                          <Avatar className="relative grid h-[30px] w-[30px] place-items-center overflow-hidden rounded-full border-2 border-white bg-brand-light text-[9px] font-medium text-[#3b6d11] shadow-[0_4px_10px_rgba(12,59,32,0.10)]" name={member.name} photoUrl={member.profilePhotoUrl} ariaLabel={`${member.name} profile photo`} sizes="30px" />
                          <strong className="truncate text-[13px] font-medium">{member.name}</strong>
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
          <Link className="tap-card grid h-9 w-9 place-items-center rounded-full border-hairline border-line bg-white/80 text-brand shadow-[0_8px_22px_rgba(24,24,26,0.06)] backdrop-blur" href="/tournaments" aria-label="Back to tournament">
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
                <article className="grid min-h-[56px] grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[12px] border-hairline border-line bg-card px-2.5 py-2.5" key={player.id}>
                  <span className={index % 5 === 0 ? "grid h-[34px] w-[34px] place-items-center rounded-full bg-[#fde9dc] text-[13px] font-medium text-[#a94d24]" : index % 5 === 1 ? "grid h-[34px] w-[34px] place-items-center rounded-full bg-[#e5f1ff] text-[13px] font-medium text-[#185fa5]" : index % 5 === 2 ? "grid h-[34px] w-[34px] place-items-center rounded-full bg-[#eaf3de] text-[13px] font-medium text-[#3b6d11]" : index % 5 === 3 ? "grid h-[34px] w-[34px] place-items-center rounded-full bg-[#fbe7ef] text-[13px] font-medium text-[#aa3f6b]" : "grid h-[34px] w-[34px] place-items-center rounded-full bg-[#f1efe8] text-[13px] font-medium text-[#5f5e5a]"}>{getInitials(player.name)}</span>
                  <div className="grid min-w-0 gap-1">
                    <strong className="truncate text-[15px] font-medium text-text-primary">{player.name}</strong>
                    {player.age && <em className="truncate text-[12px] not-italic text-text-secondary">{player.age}</em>}
                    <em className="truncate text-[13px] not-italic text-text-secondary">City: {player.city}</em>
                    {player.tennisVideoUrl && (
                      <a className="inline-flex w-max items-center gap-1.5 text-[12px] font-medium text-[#185fa5]" href={player.tennisVideoUrl} target="_blank" rel="noreferrer" title="View playing video" aria-label={`${player.name} playing video`}>
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#e5f1ff]">
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
          <Link className="tap-card grid h-9 w-9 place-items-center rounded-full border-hairline border-line bg-white/80 text-brand shadow-[0_8px_22px_rgba(24,24,26,0.06)] backdrop-blur" href="/dashboard" aria-label="Back to dashboard">
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
                <article className="grid min-h-[64px] grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[12px] border-hairline border-line bg-card p-2.5 shadow-[0_6px_18px_rgba(24,24,26,0.035)]" key={player.id}>
                  <Avatar className="relative grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-brand-light text-[12px] font-medium text-[#3b6d11]" name={player.name} photoUrl={player.profilePhotoUrl} ariaLabel={`${player.name} profile photo`} />
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
      <div className={memberPageClass}>
        <header className="sticky top-0 z-30 border-b-hairline border-white/70 bg-white/75 px-4 py-2.5 shadow-[0_10px_30px_rgba(24,24,26,0.04)] backdrop-blur-xl">
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
            <Avatar className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-full border-hairline border-white/35 bg-white/16 text-lg font-medium text-white shadow-[0_12px_28px_rgba(0,0,0,0.14)] backdrop-blur md:h-20 md:w-20" name={profile.fullName} photoUrl={profile.profilePhotoUrl} ariaLabel={`${profile.fullName} profile photo`} />
            {!tournamentProfileMode && (
              <label className="absolute bottom-1 right-1 grid h-6 w-6 cursor-pointer place-items-center rounded-full border-hairline border-white/80 bg-white text-brand shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition active:scale-95" aria-label="Change profile photo" title="Change profile photo">
                <Pencil size={11} />
                <input className="sr-only" type="file" accept="image/*" onChange={updateProfilePhoto} />
              </label>
            )}
            {!tournamentProfileMode && profile.profilePhotoUrl && (
              <button className="absolute bottom-1 left-1 grid h-6 w-6 place-items-center rounded-full border-hairline border-white/80 bg-[#fff5f5] text-[#a32d2d] shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition active:scale-95 disabled:opacity-60" type="button" onClick={removeProfilePhoto} disabled={removingPhoto} aria-label="Remove profile photo" title="Remove profile photo">
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
            <section className="grid gap-3 rounded-[18px] border-hairline border-[#f2dccb] bg-[#fff8f1] p-4">
              <span className="grid gap-1">
                <strong className="text-[16px] font-medium text-[#8a4a22]">Finish your tournament profile</strong>
                <em className="text-[13px] not-italic leading-relaxed text-[#8a4a22]/85">Add your profile photo, jersey name, and jersey size so your team card, shirt name, and roster details are ready before the tournament.</em>
              </span>
              <div className="grid gap-3 rounded-[14px] border-hairline border-[#f2dccb] bg-white p-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
                <Avatar className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-brand-light text-[17px] font-medium text-[#3b6d11]" name={profile.fullName} photoUrl={profile.profilePhotoUrl} ariaLabel={`${profile.fullName} profile photo`} />
                <span className="grid gap-2">
                  <strong className="text-[14px] font-medium text-text-primary">{profile.profilePhotoUrl ? "Profile photo added" : "Profile photo missing"}</strong>
                  <span className="flex flex-wrap gap-2">
                    <label className="tap-card inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] px-3 text-[13px] font-medium text-white shadow-[0_10px_22px_rgba(12,59,32,0.12)]">
                      <Pencil size={13} />
                      {uploadingPhoto ? "Uploading..." : profile.profilePhotoUrl ? "Replace photo" : "Upload photo"}
                      <input className="sr-only" type="file" accept="image/*" onChange={updateProfilePhoto} disabled={uploadingPhoto} />
                    </label>
                    {profile.profilePhotoUrl && (
                      <button className="tap-card inline-flex min-h-9 items-center justify-center gap-2 rounded-[12px] border-hairline border-[#f2c8c8] bg-[#fff5f5] px-3 text-[13px] font-medium text-[#a32d2d] disabled:opacity-60" type="button" onClick={removeProfilePhoto} disabled={removingPhoto}>
                        <Trash2 size={13} />
                        {removingPhoto ? "Removing..." : "Remove"}
                      </button>
                    )}
                  </span>
                </span>
              </div>
              <label className="grid gap-2 text-[13px] text-[#8a4a22]">
                Jersey name
                <input
                  className="min-h-10 rounded-[12px] border-hairline border-[#f2dccb] bg-white px-3 text-[15px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand-light"
                  value={profile.jerseyName}
                  onChange={(event) => updateProfile("jerseyName", event.target.value)}
                  placeholder="Name for shirt roster"
                />
              </label>
              <label className="grid gap-2 text-[13px] text-[#8a4a22]">
                Jersey size
                <select
                  className="min-h-10 rounded-[12px] border-hairline border-[#f2dccb] bg-white px-3 text-[15px] text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-light"
                  value={profile.jerseySize}
                  onChange={(event) => updateProfile("jerseySize", event.target.value)}
                >
                  {["XS", "S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
                    <option value={size} key={size}>{size}</option>
                  ))}
                </select>
              </label>
              <div className="grid gap-2 sm:grid-cols-[auto_auto]">
                <button className="tap-card inline-flex min-h-10 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] px-4 text-[13px] font-medium text-white shadow-[0_10px_22px_rgba(12,59,32,0.12)] disabled:opacity-60" type="button" onClick={saveTournamentProfile} disabled={saving || uploadingPhoto || removingPhoto}>
                  {saving ? "Saving..." : "Save tournament profile"}
                </button>
                <Link className="tap-card inline-flex min-h-10 items-center justify-center rounded-[12px] border-hairline border-[#f2dccb] bg-white px-4 text-[13px] font-medium text-[#8a4a22]" href={returnPath}>
                  Back to tournament
                </Link>
              </div>
            </section>
          )}
          {showTournamentProfileComplete && (
            <section className="grid gap-3 rounded-[18px] border-hairline border-[#dbe8cd] bg-brand-light p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <span className="grid gap-1">
                <strong className="text-[16px] font-medium text-[#27500a]">Tournament profile complete</strong>
                <em className="text-[13px] not-italic leading-relaxed text-[#3b6d11]">Your profile photo, jersey name, and jersey size are saved for tournament roster details.</em>
              </span>
              <Link className="tap-card inline-flex min-h-10 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] px-4 text-[13px] font-medium text-white shadow-[0_10px_22px_rgba(12,59,32,0.12)]" href={returnPath}>
                Back to tournament
              </Link>
            </section>
          )}

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
	            <article className="grid gap-1.5 rounded-[12px] border-hairline border-line bg-card p-3"><span className="text-[12px] text-text-secondary">Rating</span><strong className="text-[17px] font-medium text-text-primary">{profile.rating}</strong></article>
	            <article className="grid gap-1.5 rounded-[12px] border-hairline border-line bg-card p-3"><span className="text-[12px] text-text-secondary">Tournaments</span><strong className="text-[17px] font-medium text-text-primary">{profile.tournamentsPlayed}</strong></article>
	            <article className="grid gap-1.5 rounded-[12px] border-hairline border-line bg-card p-3"><span className="text-[12px] text-text-secondary">Matches</span><strong className="text-[17px] font-medium text-text-primary">{profile.matchesPlayed}</strong></article>
	            <button className="grid gap-1.5 rounded-[12px] border-hairline border-white/20 bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] p-3 text-left text-white shadow-[0_10px_24px_rgba(12,59,32,0.14)] transition active:scale-[0.99]" type="button" onClick={() => setShowPayments(true)} aria-haspopup="dialog">
	              <span className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-[13px] text-white/72">
	                Payments
	                <ArrowRight size={15} className="text-white" />
	              </span>
	              <strong className="text-[17px] font-medium text-white">{paymentHistory.length}</strong>
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
          {message && !tournamentProfileSaved && <StatusMessage tone={message === "Profile saved." || message === "Photo updated." || message === "Photo removed." ? "success" : message.includes("upload") || message.includes("Compressing") ? "info" : "error"}>{message}</StatusMessage>}
          {tournamentProfileMode && message === "Profile saved." && (
            <Link className="tap-card inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] px-4 text-sm font-medium text-white shadow-[0_12px_26px_rgba(12,59,32,0.18)]" href={returnPath}>
              Back to tournament
            </Link>
          )}

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

function normalizeTeamColor(value: unknown) {
  const text = typeof value === "string" ? value.trim() : "";
  return /^#[0-9a-f]{6}$/i.test(text) ? text.toLowerCase() : DEFAULT_TEAM_COLOR;
}

function adjustHexColor(value: string, amount: number) {
  const hex = normalizeTeamColor(value).slice(1);
  const next = [0, 2, 4].map((index) => {
    const channel = parseInt(hex.slice(index, index + 2), 16);
    return Math.max(0, Math.min(255, channel + amount)).toString(16).padStart(2, "0");
  });
  return `#${next.join("")}`;
}

function getHexLuminance(value: string) {
  const hex = normalizeTeamColor(value).slice(1);
  const [red, green, blue] = [0, 2, 4].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
  const channels = [red, green, blue].map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function getTeamCardTone(color: string) {
  const primary = normalizeTeamColor(color);
  const isDark = getHexLuminance(primary) < 0.42;
  const secondary = adjustHexColor(primary, isDark ? 56 : -44);
  return {
    background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
    textColor: isDark ? "#ffffff" : "#16331e"
  };
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

function TournamentStartCountdown({ countdown }: { countdown: TournamentCountdown }) {
  if (countdown.state !== "countdown") {
    return <strong className="block text-[15px] font-medium text-white">{countdown.label}</strong>;
  }

  return (
    <span className="grid gap-1">
      <span className="grid grid-cols-4 gap-1.5 text-center">
        <CountdownUnit value={countdown.days} label={countdown.days === 1 ? "day" : "days"} />
        <CountdownUnit value={countdown.hours} label={countdown.hours === 1 ? "hour" : "hours"} />
        <CountdownUnit value={countdown.minutes} label="min" />
        <span className="relative grid min-w-[42px] gap-0.5 rounded-[12px] bg-white/12 px-2 py-1.5">
          <span className="tennis-countdown-ball" key={countdown.seconds} aria-hidden="true" />
          <strong className="text-[15px] font-medium leading-none text-white">{formatCountdownValue(countdown.seconds)}</strong>
          <em className="text-[10px] not-italic leading-none text-white/60">sec</em>
        </span>
      </span>
    </span>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <span className="grid min-w-[42px] gap-0.5 rounded-[12px] bg-white/12 px-2 py-1.5">
      <strong className="text-[15px] font-medium leading-none text-white">{formatCountdownValue(value)}</strong>
      <em className="text-[10px] not-italic leading-none text-white/60">{label}</em>
    </span>
  );
}

function CaptainAvatarStack({ teams }: { teams: PublishedTeam[] }) {
  const captains = teams
    .map((team) => team.members.find((member) => member.isCaptain) || team.members[0])
    .filter(Boolean) as PublishedTeamMember[];
  const uploadedCaptains = captains.filter((captain) => captain.profilePhotoUrl);
  const visibleCaptains = uploadedCaptains.length ? uploadedCaptains : captains.slice(0, 4);
  const remainingCount = uploadedCaptains.length ? captains.length - uploadedCaptains.length : Math.max(0, captains.length - visibleCaptains.length);

  if (!captains.length) {
    return (
      <span className="inline-flex h-10 w-max items-center rounded-full bg-brand-light px-2.5 text-[#3b6d11]">
        <UsersRound size={18} />
      </span>
    );
  }

  return (
    <span className="inline-flex h-10 w-max items-center pl-1.5 pr-2" aria-label="Team captains">
      {visibleCaptains.map((captain, index) => (
        <span
          aria-label={`${captain.name} captain photo`}
          className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border-2 border-white bg-brand-light text-[11px] font-medium text-[#3b6d11] shadow-[0_8px_18px_rgba(12,59,32,0.12)]"
          key={`${captain.playerId}-${index}`}
          style={{ marginLeft: index ? "-10px" : "0", zIndex: 10 + index }}
        >
          {captain.profilePhotoUrl ? (
            <NextImage src={captain.profilePhotoUrl} alt="" fill sizes="36px" className="object-cover" />
          ) : (
            getInitials(captain.name)
          )}
        </span>
      ))}
      {remainingCount > 0 && (
        <span
          className="relative grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-brand text-[12px] font-medium text-white shadow-[0_8px_18px_rgba(12,59,32,0.12)]"
          style={{ marginLeft: visibleCaptains.length ? "-10px" : "0", zIndex: 10 + visibleCaptains.length }}
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
  const teamAColor = teamA?.jerseyColor || "#eaf3de";
  const teamBColor = teamB?.jerseyColor || "#e5f1ff";
  const ballTeam = getBallTeamForMatchup(item.dayNumber, teamA?.id || "", teamB?.id || "", item.id, teams);
  const showTeamABall = item.dayNumber === 2 || ballTeam?.id === teamA?.id;
  const showTeamBBall = item.dayNumber === 2 ? false : ballTeam?.id === teamB?.id;

  if (item.itemType === "event") {
    return (
      <article className="grid gap-2 rounded-[16px] border-hairline border-[#f2dccb] bg-[#fff8f1] p-3 sm:grid-cols-[92px_minmax(0,1fr)] sm:items-center">
        <span className="inline-flex w-max items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] font-medium text-[#8a4a22]">
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
    <article className={hideTime ? "grid gap-3 rounded-[16px] border-hairline border-line bg-card p-3 shadow-[0_8px_20px_rgba(24,24,26,0.04)]" : "grid gap-3 rounded-[16px] border-hairline border-line bg-card p-3 shadow-[0_8px_20px_rgba(24,24,26,0.04)] lg:grid-cols-[100px_minmax(0,1fr)] lg:items-center"}>
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
  const playersA = match.playersA.join(" & ") || match.teamAName;
  const playersB = match.playersB.join(" & ") || match.teamBName;

  return (
    <span className="grid min-w-0 grid-cols-[42px_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 rounded-[10px] border-hairline border-line bg-white/80 px-2 py-1.5">
      <b className="rounded-[8px] bg-surface px-1.5 py-1 text-center text-[10px] font-medium leading-none text-brand">{courtNumber || "-"}</b>
      <span className="min-w-0 whitespace-normal break-words text-[11px] font-medium leading-tight text-text-primary">{playersA}</span>
      <em className="text-[10px] not-italic text-text-muted">vs</em>
      <span className="min-w-0 whitespace-normal break-words text-[11px] font-medium leading-tight text-text-primary">{playersB}</span>
    </span>
  );
}

function ScheduleTimeHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="sticky top-[58px] z-10 flex items-center justify-between gap-3 rounded-[16px] border-hairline border-white/70 bg-white/86 px-3.5 py-2.5 shadow-[0_10px_24px_rgba(24,24,26,0.06)] backdrop-blur-xl">
      <span className="flex items-center gap-2">
        <Clock size={15} className="text-brand" />
        <h2 className="text-[17px] font-medium leading-none text-brand">{label}</h2>
      </span>
      <span className="rounded-full bg-brand-light px-2.5 py-1 text-[12px] font-medium text-[#3b6d11]">{count} {count === 1 ? "match" : "matches"}</span>
    </div>
  );
}

function ScheduleLoadingNotice({ label, overlay = false }: { label: string; overlay?: boolean }) {
  if (overlay) {
    return (
      <div className="fixed inset-0 z-[70] grid place-items-center bg-white/45 backdrop-blur-[2px]" role="status" aria-live="polite">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-[14px] font-medium text-white shadow-[0_16px_38px_rgba(12,59,32,0.22)]">
          <RefreshCw className="animate-spin" size={16} />
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[16px] border-hairline border-line bg-white/90 px-4 text-[14px] font-medium text-brand shadow-[0_12px_28px_rgba(24,24,26,0.06)] backdrop-blur" role="status" aria-live="polite">
      <RefreshCw className="animate-spin" size={16} />
      {label}
    </div>
  );
}

function PlayerScheduleTimeCard({ label, matches, teams, onOpenMatch, isFeatured }: { label: string; matches: PlayerScheduleMatch[]; teams: PublishedTeam[]; onOpenMatch: (match: PlayerScheduleMatch) => void; isFeatured: boolean }) {
  const featuredMatch = matches.length === 1 ? matches[0] : null;
  const featuredBallTeam = featuredMatch ? getBallTeamForMatchup(featuredMatch.dayNumber, featuredMatch.teamId, featuredMatch.opposingTeamId, featuredMatch.id, teams) : null;
  const showFeaturedTeamBall = featuredMatch ? featuredMatch.dayNumber === 2 || featuredBallTeam?.id === featuredMatch.teamId : false;
  const showFeaturedOpponentBall = featuredMatch ? featuredMatch.dayNumber === 2 ? false : featuredBallTeam?.id === featuredMatch.opposingTeamId : false;
  return (
    <section className={`overflow-hidden rounded-[24px] border-hairline border-[#d8e1d9] bg-[#fbfcf8] shadow-[0_20px_48px_rgba(12,59,32,0.11)] ${isFeatured ? "shadow-[0_24px_56px_rgba(12,59,32,0.15)]" : ""}`}>
      <div className="grid min-h-[66px] grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b-hairline border-[#dce4dc] bg-[linear-gradient(135deg,#eef4e7,#fbfcf8)] px-4 py-2.5 sm:min-h-[72px] sm:px-5">
        <span className="inline-flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/[0.08] text-brand sm:h-10 sm:w-10">
            <Clock size={18} strokeWidth={2.2} />
          </span>
          <h2 className="whitespace-nowrap text-[19px] font-medium leading-none text-brand sm:text-[21px]">{label}</h2>
        </span>
        {featuredMatch ? (
          <span className="min-w-0 justify-self-end text-right text-[11px] font-medium leading-tight sm:text-[13px]">
            <ScheduleHeaderTeamName name={featuredMatch.teamName} showBallIcon={showFeaturedTeamBall} />
            <em className="mx-1 not-italic text-text-muted">vs</em>
            <ScheduleHeaderTeamName name={featuredMatch.opposingTeamName} showBallIcon={showFeaturedOpponentBall} />
          </span>
        ) : (
          <span className="justify-self-end rounded-full border-hairline border-[#d3dfc5] bg-white/75 px-3 py-1.5 text-[11px] font-medium text-brand/75 sm:text-[12px]">{matches.length} matches</span>
        )}
      </div>
      <div className="grid gap-3 p-3 sm:p-4">
        {matches.map((match) => (
          <PlayerScheduleMatchCard match={match} teams={teams} isFeatured={false} onOpenMatch={() => onOpenMatch(match)} hideTime key={match.id} />
        ))}
      </div>
    </section>
  );
}

function ScheduleHeaderTeamName({ name, showBallIcon = false }: { name: string; showBallIcon?: boolean }) {
  const parts = name.trim().split(/\s+/);
  const prefix = parts.length > 1 ? `${parts.shift()} ` : "";
  return (
    <span className="inline-flex min-w-0 items-center gap-1 align-middle">
      {prefix && <span className="text-text-secondary">{prefix}</span>}
      <strong className="font-semibold text-brand">{parts.join(" ") || name}</strong>
      {showBallIcon && <TennisBallIcon className="h-4 w-4" />}
    </span>
  );
}

function MatchDetailPageCard({ match, ballTeamName, draft, canSubmit, isOwnMatch, ownSide, entryLabel, message, saving, backHref, backLabel, onChangeDraft, onSubmit }: { match: TeamCourtScheduleMatch; ballTeamName: string; draft: ScoreDraft; canSubmit: boolean; isOwnMatch: boolean; ownSide: "A" | "B" | null; entryLabel: string; message: string; saving: boolean; backHref: string; backLabel: string; onChangeDraft: (draft: ScoreDraft) => void; onSubmit: () => void }) {
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
  return (
    <section className="grid gap-3">
      <article className="relative overflow-hidden rounded-[24px] border-hairline border-white/80 bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] p-3 pt-12 text-white shadow-[0_18px_44px_rgba(12,59,32,0.10)] sm:p-5 sm:pt-14">
        <Link className="tap-card absolute left-3 top-3 z-10 inline-grid h-8 max-h-8 min-h-8 w-8 min-w-8 max-w-8 place-items-center rounded-full border-hairline border-white/20 bg-white/10 p-0 text-white shadow-[0_8px_18px_rgba(0,0,0,0.10)]" href={backHref} aria-label={backLabel}>
          <ArrowLeft size={15} />
        </Link>
        <div className="relative grid gap-4">
          <CourtBackdrop />
          <div className="relative grid gap-4">
            <div className="flex min-w-0 flex-wrap items-center justify-center gap-1.5 pl-10 text-[10px] font-medium uppercase tracking-[0.06em] text-white/68 sm:pl-0">
              <span className="rounded-full bg-white/10 px-2.5 py-1">{match.format}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1">{match.timeLabel || "Time TBD"}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1">{match.courtLabel || "Court TBD"}</span>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_34px_minmax(0,1fr)] items-start gap-1 sm:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] sm:gap-3">
              <MatchPlayerSide color={leftColor} players={leftProfiles} teamName={leftTeam} />
              <span className="mt-9 grid h-8 w-8 place-items-center justify-self-center rounded-full border-hairline border-white/18 bg-white/10 text-[10px] font-medium text-white/65 sm:mt-12 sm:h-10 sm:w-10 sm:text-[11px]">VS</span>
              <MatchPlayerSide color={rightColor} players={rightProfiles} teamName={rightTeam} />
            </div>

            <div className="flex justify-center">
              <BallTeamBadge teamName={ballTeamName} pending={!ballTeamName} />
            </div>

            <MatchSetScoreboard leftColor={leftColor} leftSide={leftSide} leftTeam={leftTeam} rightColor={rightColor} rightSide={rightSide} rightTeam={rightTeam} score={match.score} />
          </div>
        </div>
      </article>

      <article className="grid gap-3 rounded-[20px] border-hairline border-line bg-white p-3 shadow-[0_12px_28px_rgba(24,24,26,0.06)] sm:p-4">
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <span className="grid gap-1">
            <strong className="text-[18px] font-medium text-text-primary">Score entry</strong>
            <em className="text-[13px] not-italic text-text-secondary">Best of three sets. Set 3 would be a tie-breaker.</em>
          </span>
          <span className={canSubmit ? "w-fit rounded-full bg-brand-light px-3 py-1.5 text-[12px] font-medium text-[#3b6d11]" : "w-fit rounded-full bg-surface px-3 py-1.5 text-[12px] font-medium text-text-secondary"}>{entryLabel}</span>
        </div>

        {isOwnMatch ? (
          <div className="grid gap-2.5">
            <div className="grid grid-cols-[52px_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-2">
              <span aria-hidden="true" />
              <ScoreSideLabel playerNames={leftTeam} color={leftColor} />
              <span className="text-center text-[12px] font-medium text-text-muted">vs</span>
              <ScoreSideLabel playerNames={rightTeam} color={rightColor} />
            </div>
            <div className="grid gap-2">
              <ScoreSetInputs draft={draft} disabled={!canSubmit || saving} leftLabel={leftTeam} leftSide={leftSide} onChange={onChangeDraft} rightLabel={rightTeam} rightSide={rightSide} setNumber={1} />
              <ScoreSetInputs draft={draft} disabled={!canSubmit || saving} leftLabel={leftTeam} leftSide={leftSide} onChange={onChangeDraft} rightLabel={rightTeam} rightSide={rightSide} setNumber={2} />
              <ScoreSetInputs draft={draft} disabled={!canSubmit || saving} leftLabel={leftTeam} leftSide={leftSide} onChange={onChangeDraft} rightLabel={rightTeam} rightSide={rightSide} setNumber={3} optional />
            </div>
            {message && <p className={message === "Score saved." ? "rounded-[14px] bg-brand-light p-3 text-[13px] text-[#3b6d11]" : "rounded-[14px] bg-[#fff8f1] p-3 text-[13px] text-[#8a4a22]"}>{message}</p>}
            <button className="tap-card inline-flex min-h-11 items-center justify-center rounded-[15px] bg-[linear-gradient(135deg,#0c3b20,#1a6e3c)] px-5 text-[14px] font-medium text-white shadow-[0_12px_26px_rgba(12,59,32,0.16)] disabled:cursor-not-allowed disabled:bg-none disabled:bg-surface disabled:text-text-muted disabled:shadow-none" type="button" onClick={onSubmit} disabled={!canSubmit || saving}>
              {saving ? "Saving score..." : "Input scores"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[32px_minmax(0,1fr)] items-start gap-3 rounded-[16px] border-hairline border-line bg-surface/55 p-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-text-muted"><Info size={15} /></span>
            <span className="grid gap-1">
              <strong className="text-[14px] font-medium text-text-primary">Scores are read only</strong>
              <p className="text-[13px] leading-relaxed text-text-secondary">Only players assigned to this match can submit or edit the result.</p>
            </span>
          </div>
        )}
      </article>
    </section>
  );
}

function MatchPlayerSide({ players, teamName, color }: { players: MatchPlayerProfile[]; teamName: string; color: string }) {
  const tone = getTeamCardTone(color);
  const isDoubles = players.length > 1;
  return (
    <span className="grid min-w-0 justify-items-center gap-2 text-center">
      <span className={`flex items-center justify-center ${isDoubles ? "-space-x-3 sm:-space-x-2" : ""}`}>
        {players.slice(0, 2).map((player) => (
          <span className={isDoubles ? "relative h-14 w-14 overflow-hidden rounded-full border-2 border-white/80 bg-white/14 text-[12px] font-medium text-white shadow-[0_12px_28px_rgba(0,0,0,0.18)] sm:h-20 sm:w-20 sm:text-[16px]" : "relative h-[72px] w-[72px] overflow-hidden rounded-full border-2 border-white/80 bg-white/14 text-[15px] font-medium text-white shadow-[0_12px_28px_rgba(0,0,0,0.18)] sm:h-24 sm:w-24 sm:text-[18px]"} key={player.id}>
            <Avatar className="relative grid h-full w-full place-items-center overflow-hidden rounded-full bg-white/14 text-white" name={player.name} photoUrl={player.profilePhotoUrl} ariaLabel={`${player.name} profile photo`} sizes={isDoubles ? "(min-width: 640px) 80px, 56px" : "(min-width: 640px) 96px, 72px"} />
          </span>
        ))}
      </span>
      <span className="grid min-w-0 gap-0.5">
        {players.slice(0, 2).map((player) => (
          <strong className="break-words text-[12px] font-medium leading-tight text-white sm:text-[15px]" key={player.id}>{player.name}</strong>
        ))}
      </span>
      <span className="max-w-full truncate rounded-full border-hairline border-white/25 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.06em] shadow-[0_8px_18px_rgba(0,0,0,0.10)] sm:text-[10px]" style={{ background: tone.background, color: tone.textColor }}>
        {teamName}
      </span>
    </span>
  );
}

function MatchSetScoreboard({ score, leftSide, rightSide, leftTeam, rightTeam, leftColor, rightColor }: { score: MatchScore | null; leftSide: "A" | "B"; rightSide: "A" | "B"; leftTeam: string; rightTeam: string; leftColor: string; rightColor: string }) {
  const scoresForSide = (side: "A" | "B") => side === "A"
    ? [score?.sideASet1, score?.sideASet2, score?.sideASet3]
    : [score?.sideBSet1, score?.sideBSet2, score?.sideBSet3];
  const leftScores = scoresForSide(leftSide);
  const rightScores = scoresForSide(rightSide);
  const renderScore = (value: number | null | undefined) => value == null ? "—" : value;
  return (
    <div className="mx-auto grid w-full max-w-[680px] gap-1 rounded-[16px] border-hairline border-white/18 bg-[#082d19]/72 p-2 backdrop-blur-md">
      <div className="grid grid-cols-[minmax(0,1fr)_36px_36px_36px] items-center gap-1 px-2 text-center text-[9px] font-medium uppercase tracking-[0.08em] text-white/42 sm:grid-cols-[minmax(0,1fr)_44px_44px_44px]">
        <span className="text-left">Score</span>
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </div>
      {[
        { team: leftTeam, color: leftColor, side: leftSide, values: leftScores },
        { team: rightTeam, color: rightColor, side: rightSide, values: rightScores }
      ].map((row) => {
        const winner = score?.winnerSide === row.side;
        return (
          <div className={winner ? "grid min-h-10 grid-cols-[minmax(0,1fr)_36px_36px_36px] items-center gap-1 rounded-[11px] bg-white/16 px-2 sm:grid-cols-[minmax(0,1fr)_44px_44px_44px]" : "grid min-h-10 grid-cols-[minmax(0,1fr)_36px_36px_36px] items-center gap-1 rounded-[11px] bg-white/[0.07] px-2 sm:grid-cols-[minmax(0,1fr)_44px_44px_44px]"} key={row.side}>
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: normalizeTeamColor(row.color) }} />
              <strong className="truncate text-[11px] font-medium text-white/82 sm:text-[12px]">{row.team}</strong>
              {winner && <Trophy className="shrink-0 text-[#b7ff2f]" size={12} aria-label="Winner" />}
            </span>
            {row.values.map((value, index) => (
              <strong className={value == null ? "text-center text-[15px] font-medium text-white/28" : "text-center text-[17px] font-medium text-white"} key={index}>{renderScore(value)}</strong>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function ScoreSideLabel({ playerNames, color }: { playerNames: string; color: string }) {
  const tone = getTeamCardTone(color);
  return (
    <span className="min-w-0 truncate rounded-[11px] border-hairline px-2 py-1.5 text-center text-[11px] font-medium" style={{ background: tone.background, color: tone.textColor, borderColor: "rgba(12,59,32,0.08)" }}>
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
    <section className="overflow-hidden rounded-[22px] border-hairline border-line bg-white shadow-[0_14px_34px_rgba(24,24,26,0.06)]" aria-labelledby="day-one-round-title">
      <div className="grid gap-3 border-b-hairline border-line p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
        <span className="grid gap-1">
          <em className="text-[10px] font-medium not-italic uppercase tracking-[0.13em] text-brand">Day 1 · Round 1</em>
          <h2 className="text-[22px] font-medium tracking-[-0.3px] text-text-primary" id="day-one-round-title">Every team and player matchup</h2>
          <p className="max-w-[760px] text-[12px] leading-relaxed text-text-secondary">Follow each time slot from left to right. Every submitted player result updates its team path and the live Day 1 seeding.</p>
        </span>
        <span className="inline-flex w-max items-center gap-2 rounded-full bg-brand-light px-3 py-1.5 text-[12px] font-medium text-[#3b6d11]">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          {completedMatches} of {playerMatches.length} player matches
        </span>
      </div>

      <div className="grid gap-3 bg-[#062b18] p-3 lg:hidden">
        {!!groups.length && (
          <>
            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1" aria-label="Day 1 time slots" ref={timeTabsRef}>
              {groups.map((group, index) => {
                const groupMatches = group.nodes.flatMap((node) => node.result.matches);
                const groupCompleted = groupMatches.filter((match) => Boolean(match.score?.winnerSide)).length;
                return (
                  <button className={index === activeTimeIndex ? "tap-card grid min-w-[94px] snap-start gap-0.5 rounded-[12px] border-hairline border-[#b7ff2f]/50 bg-[#b7ff2f] px-3 py-2 text-left text-[#14340f] shadow-[0_8px_18px_rgba(0,0,0,0.16)]" : "tap-card grid min-w-[94px] snap-start gap-0.5 rounded-[12px] border-hairline border-white/12 bg-white/[0.07] px-3 py-2 text-left text-white"} type="button" onClick={() => selectTime(index)} aria-pressed={index === activeTimeIndex} key={group.key}>
                    <strong className="text-[12px] font-medium leading-none">{group.label}</strong>
                    <em className={index === activeTimeIndex ? "text-[8px] font-medium not-italic text-[#315114]" : "text-[8px] font-medium not-italic text-white/45"}>{groupCompleted}/{groupMatches.length} results</em>
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

      <div className="hidden overflow-x-auto bg-[#062b18] p-4 lg:block">
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
                  <em className="text-[8px] font-medium not-italic uppercase tracking-[0.05em] text-white/45">Time slot {index + 1}</em>
                </span>
                <em className="rounded-full bg-white/10 px-2 py-1 text-[8px] font-medium not-italic uppercase tracking-[0.05em] text-white/60">{groupCompleted}/{groupMatches.length}</em>
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
    <section className="overflow-hidden rounded-[22px] border-hairline border-line bg-white shadow-[0_14px_34px_rgba(24,24,26,0.06)]" aria-labelledby="team-leaderboard-title">
      <div className="grid gap-3 border-b-hairline border-line p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
        <span className="grid gap-1">
          <em className="text-[10px] font-medium not-italic uppercase tracking-[0.13em] text-text-muted">Day 1 seeding</em>
          <h2 className="text-[22px] font-medium tracking-[-0.3px] text-text-primary" id="team-leaderboard-title">Team leaderboard</h2>
          <p className="text-[12px] leading-relaxed text-text-secondary">{seasonYear || new Date().getFullYear()} tournament results only: match wins, then set percentage, then game percentage.</p>
        </span>
        <span className={seedingIsFinal ? "inline-flex w-max items-center gap-2 rounded-full bg-brand-light px-3 py-1.5 text-[12px] font-medium text-[#3b6d11]" : "inline-flex w-max items-center gap-2 rounded-full bg-[#fff4d8] px-3 py-1.5 text-[12px] font-medium text-[#8a5a00]"}>
          {seedingIsFinal ? <CheckCircle2 size={14} /> : <RefreshCw size={13} />}
          {seedingIsFinal ? "Final seeds" : `${completedMatches} of ${matches} results`}
        </span>
      </div>
      <div className="grid gap-1.5 p-2.5 sm:p-3">
        <div className="hidden grid-cols-[38px_minmax(180px,1fr)_72px_72px_72px] items-center gap-2 px-3 text-[9px] font-medium uppercase tracking-[0.08em] text-text-muted sm:grid">
          <span>Seed</span>
          <span>Team</span>
          <span className="text-center">Wins</span>
          <span className="text-center">Set %</span>
          <span className="text-center">Game %</span>
        </div>
        {standings.map((standing) => (
          <Link className="tap-card group grid grid-cols-[34px_minmax(0,1fr)_132px] items-center gap-2 rounded-[15px] border-hairline border-line bg-surface/38 p-2.5 transition hover:border-brand/25 hover:bg-brand-light/45 hover:shadow-[0_8px_20px_rgba(12,59,32,0.07)] sm:grid-cols-[38px_minmax(180px,1fr)_72px_72px_72px] sm:px-3" href={`/tournaments/schedule/teams/${standing.team.id}?from=team-leaderboard`} aria-label={`View ${standing.team.name} team page`} key={standing.team.id}>
            <strong className="grid h-8 w-8 place-items-center rounded-full bg-white text-[13px] font-semibold text-brand shadow-[inset_0_0_0_1px_rgba(12,59,32,0.08)]">{standing.seed}</strong>
            <span className="grid min-w-0 grid-cols-[34px_minmax(0,1fr)] items-center gap-2.5">
              <span className="grid h-[34px] w-[34px] place-items-center overflow-hidden rounded-[10px] bg-white p-1 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
                {standing.team.logoUrl ? <img className="h-full w-full object-contain" src={standing.team.logoUrl} alt="" aria-hidden="true" /> : <span className="text-[10px] font-medium text-brand">{getInitials(standing.team.name)}</span>}
              </span>
              <span className="grid min-w-0 gap-0.5">
                <strong className="truncate text-[13px] font-medium text-text-primary sm:text-[14px]">{standing.team.name}</strong>
                <em className="truncate text-[9px] not-italic text-text-secondary sm:text-[10px]">{standing.completedMatches}/{standing.scheduledMatches} played · {standing.matchLosses} losses{standing.tieBreakWins ? ` · ${standing.tieBreakWins} TB wins` : ""}</em>
                {standing.requiresReview && <em className="w-max rounded-full bg-[#fff4d8] px-1.5 py-0.5 text-[8px] font-medium not-italic uppercase tracking-[0.05em] text-[#8a5a00]">Organizer review</em>}
              </span>
            </span>
            <span className="grid grid-cols-3 gap-1 text-center sm:contents">
              <LeaderboardMetric label="Wins" value={String(standing.matchWins)} />
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
  const tierGroups = standings.reduce<Array<{ tier: string; standings: PlayerStanding[] }>>((groups, standing) => {
    const existing = groups.find((group) => group.tier === standing.tier);
    if (existing) existing.standings.push(standing);
    else groups.push({ tier: standing.tier, standings: [standing] });
    return groups;
  }, []);
  const submittedResults = standings.reduce((total, standing) => total + standing.completedMatches, 0);

  return (
    <section className="overflow-hidden rounded-[22px] border-hairline border-line bg-white shadow-[0_14px_34px_rgba(24,24,26,0.06)]" aria-labelledby="player-leaderboard-title">
      <div className="grid gap-3 border-b-hairline border-line p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
        <span className="grid gap-1">
          <em className="text-[10px] font-medium not-italic uppercase tracking-[0.13em] text-text-muted">Tier performance · {seasonYear || new Date().getFullYear()}</em>
          <h2 className="text-[22px] font-medium tracking-[-0.3px] text-text-primary" id="player-leaderboard-title">Player leaderboard</h2>
          <p className="max-w-[720px] text-[12px] leading-relaxed text-text-secondary">Players are ranked inside their drafted tier by tournament wins, then set percentage, then game percentage. Singles and doubles results count.</p>
        </span>
        <span className="inline-flex w-max items-center gap-2 rounded-full bg-brand-light px-3 py-1.5 text-[12px] font-medium text-[#3b6d11]"><RefreshCw size={13} />{submittedResults} player results</span>
      </div>

      <div className="grid gap-3 p-2.5 sm:p-3 lg:grid-cols-2">
        {tierGroups.map((group) => (
          <section className="overflow-hidden rounded-[18px] border-hairline border-line bg-surface/30" key={group.tier} aria-label={`${group.tier} player standings`}>
            <div className="flex items-center justify-between gap-2 border-b-hairline border-line bg-[#f4f8f2] px-3 py-2.5">
              <span className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-[11px] font-semibold text-white">{group.tier.replace(/\D/g, "") || "—"}</span>
                <strong className="text-[14px] font-medium text-text-primary">{group.tier}</strong>
              </span>
              <em className="text-[9px] font-medium not-italic uppercase tracking-[0.06em] text-text-muted">Tier topper first</em>
            </div>
            <div className="grid gap-1.5 p-2">
              {group.standings.map((standing) => (
                <article className={standing.tierRank === 1 && standing.completedMatches > 0 ? "grid grid-cols-[30px_34px_minmax(0,1fr)_116px] items-center gap-2 rounded-[13px] border-hairline border-[#dbe8cd] bg-[#f7fbf3] p-2" : "grid grid-cols-[30px_34px_minmax(0,1fr)_116px] items-center gap-2 rounded-[13px] border-hairline border-line bg-white p-2"} key={`${standing.team.id}:${standing.player.playerId || standing.player.id}`}>
                  <strong className={standing.tierRank === 1 && standing.completedMatches > 0 ? "grid h-7 w-7 place-items-center rounded-full bg-[#b7ff2f] text-[12px] font-semibold text-[#14340f]" : "grid h-7 w-7 place-items-center rounded-full bg-surface text-[11px] font-semibold text-brand"}>{standing.completedMatches ? standing.tierRank : "—"}</strong>
                  <Avatar className="relative grid h-[34px] w-[34px] place-items-center overflow-hidden rounded-full bg-brand text-[9px] font-medium text-white" name={standing.player.name} photoUrl={standing.player.profilePhotoUrl || undefined} sizes="34px" />
                  <span className="grid min-w-0 gap-0.5">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <strong className="truncate text-[12px] font-medium text-text-primary">{standing.player.name}</strong>
                      {standing.tierRank === 1 && standing.completedMatches > 0 && <Trophy className="shrink-0 text-[#6d8f13]" size={11} aria-label={`${group.tier} topper`} />}
                    </span>
                    <em className="truncate text-[8px] not-italic text-text-secondary">{standing.team.name} · {standing.completedMatches} played{standing.tieBreakWins ? ` · ${standing.tieBreakWins} TB wins` : ""}</em>
                  </span>
                  <span className="grid grid-cols-3 gap-1 text-center">
                    <PlayerLeaderboardMetric label="W–L" value={`${standing.matchWins}–${standing.matchLosses}`} />
                    <PlayerLeaderboardMetric label="Sets" value={`${formatBracketPercentage(standing.setWinPercentage)}%`} />
                    <PlayerLeaderboardMetric label="Games" value={`${formatBracketPercentage(standing.gameWinPercentage)}%`} />
                  </span>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function LeaderboardMetric({ label, value }: { label: string; value: string }) {
  return (
    <span className="grid min-w-0 gap-0.5 rounded-[9px] bg-white px-1 py-1.5 sm:bg-transparent sm:p-0">
      <strong className="truncate text-[12px] font-semibold leading-none text-brand sm:text-[13px]">{value}</strong>
      <em className="text-[8px] font-medium not-italic uppercase tracking-[0.04em] text-text-muted sm:hidden">{label}</em>
    </span>
  );
}

function PlayerLeaderboardMetric({ label, value }: { label: string; value: string }) {
  return (
    <span className="grid min-w-0 gap-0.5 rounded-[8px] bg-surface/75 px-1 py-1.5">
      <strong className="truncate text-[10px] font-semibold leading-none text-brand">{value}</strong>
      <em className="text-[7px] font-medium not-italic uppercase tracking-[0.03em] text-text-muted">{label}</em>
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
    <section className="overflow-hidden rounded-[22px] border-hairline border-line bg-white text-text-primary shadow-[0_14px_34px_rgba(24,24,26,0.06)]" aria-labelledby="live-bracket-title">
      <div className="grid gap-3 border-b-hairline border-line p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
        <span className="grid gap-1">
          <em className="text-[10px] font-medium not-italic uppercase tracking-[0.13em] text-brand">Day 2 · Championship path</em>
          <h2 className="text-[22px] font-medium tracking-[-0.3px] text-text-primary" id="live-bracket-title">Live team bracket</h2>
          <p className="max-w-[760px] text-[12px] leading-relaxed text-text-secondary">{seedingStatus === "waiting" ? "Quarterfinal slots stay as seed placeholders until the first Day 1 result is submitted." : seedingStatus === "projected" ? "Quarterfinal teams are projected from the live Day 1 leaderboard and will keep changing as scores arrive." : "Day 1 seeding is complete. Green rows show teams advancing through the final draw."}</p>
        </span>
        <span className="inline-flex w-max items-center gap-2 rounded-full bg-brand-light px-3 py-1.5 text-[12px] font-medium text-[#3b6d11]">
          {seedingStatus === "final" ? <CheckCircle2 size={14} /> : <RefreshCw size={13} />}
          {seedingStatus === "final" ? "Final seeds" : seedingStatus === "projected" ? "Live projection" : "Awaiting Day 1"}
        </span>
      </div>

      {championSlot?.team && (
        <div className="grid gap-3 border-b-hairline border-white/10 bg-[#0b3a22] p-3 text-white sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5">
          <span className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#b7ff2f] text-[#14340f] shadow-[0_8px_20px_rgba(0,0,0,0.18)]"><Trophy size={20} /></span>
            <span className="grid min-w-0 gap-0.5">
              <em className="text-[9px] font-medium not-italic uppercase tracking-[0.1em] text-[#b7ff2f]">Tournament champions</em>
              <strong className="truncate text-[18px] font-medium text-white">{championSlot.team.name}</strong>
            </span>
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/75">Won by {finalNode?.result.decidedBy}</span>
        </div>
      )}

      <div className="grid gap-3 bg-[#062b18] p-3 lg:hidden">
        <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1" aria-label="Day 2 bracket stages" ref={stageTabsRef}>
          {stages.map((stage, index) => (
            <button className={index === selectedIndex ? "tap-card grid min-w-[118px] snap-start gap-0.5 rounded-[12px] border-hairline border-[#b7ff2f]/50 bg-[#b7ff2f] px-3 py-2 text-left text-[#14340f] shadow-[0_8px_18px_rgba(0,0,0,0.16)]" : "tap-card grid min-w-[118px] snap-start gap-0.5 rounded-[12px] border-hairline border-white/12 bg-white/[0.07] px-3 py-2 text-left text-white"} type="button" onClick={() => selectStage(index)} aria-pressed={index === selectedIndex} key={stage.key}>
              <strong className="truncate text-[12px] font-medium leading-none">{stage.label}</strong>
              <em className={index === selectedIndex ? "text-[8px] font-medium not-italic text-[#315114]" : "text-[8px] font-medium not-italic text-white/45"}>{stage.nodes.length} {stage.nodes.length === 1 ? "matchup" : "matchups"}</em>
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

      <div className="hidden overflow-x-auto bg-[#062b18] p-4 lg:block">
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
        <em className="text-[9px] not-italic text-white/45">{stage.helper}</em>
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
  const status = node.result.decidedBy === "organizer review"
    ? "Organizer review"
    : hasWinner
      ? node.result.isClinched && node.result.completedMatches < node.result.scheduledMatches ? "Clinched" : "Final"
      : node.result.scheduledMatches
        ? `${node.result.completedMatches}/${node.result.scheduledMatches} results`
        : hasTeams ? "Awaiting match setup" : "Waiting on prior round";
  return (
    <article className="relative overflow-hidden rounded-[16px] border-hairline border-white/16 bg-white/[0.96] text-text-primary shadow-[0_12px_28px_rgba(0,0,0,0.16)]">
      <div className="flex items-center justify-between gap-2 border-b-hairline border-line bg-[#f4f8f2] px-2.5 py-1.5">
        <span className="min-w-0">
          <strong className="block truncate text-[10px] font-semibold uppercase tracking-[0.06em] text-brand">{node.label}</strong>
          <em className="block truncate text-[9px] not-italic text-text-muted">{node.timeLabel}</em>
        </span>
        <span className={hasWinner ? "shrink-0 rounded-full bg-brand-light px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.05em] text-[#3b6d11]" : node.result.decidedBy === "organizer review" ? "shrink-0 rounded-full bg-[#fff4d8] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.05em] text-[#8a5a00]" : "shrink-0 rounded-full bg-white px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.05em] text-text-muted"}>{status}</span>
      </div>
      <div className="grid divide-y divide-line">
        <BracketTeamRow destination={getBracketTeamDestination(node, sideAWon)} isWinner={sideAWon} matchWins={node.result.matchWinsA} slot={node.sideA} />
        <BracketTeamRow destination={getBracketTeamDestination(node, sideBWon)} isWinner={sideBWon} matchWins={node.result.matchWinsB} slot={node.sideB} />
      </div>
      {!!node.result.matches.length && (
        <div className="grid gap-1 border-t-hairline border-line bg-surface/45 p-1.5">
          {node.result.matches.map((match) => {
            const firstTeamIsA = match.teamAId === node.sideA.team?.id;
            const firstPlayers = firstTeamIsA ? match.playersA : match.playersB;
            const secondPlayers = firstTeamIsA ? match.playersB : match.playersA;
            const playerLabel = `${formatBracketPlayerNames(firstPlayers, node.sideA.team?.name || match.teamAName)} vs ${formatBracketPlayerNames(secondPlayers, node.sideB.team?.name || match.teamBName)}`;
            const pausedFinalMatch = node.phase === "Final" && hasWinner && !match.score?.winnerSide;
            const content = (
              <>
                <span className="grid min-w-0 gap-0.5">
                  <strong className="truncate text-[9px] font-medium text-text-primary">{playerLabel}</strong>
                  <em className="truncate text-[8px] not-italic text-text-muted">{match.tierRule || match.format} · {match.courtLabel || "Court TBD"}</em>
                </span>
                <span className="inline-flex items-center gap-1">
                  <strong className={pausedFinalMatch ? "text-[9px] font-semibold uppercase tracking-[0.04em] text-text-muted" : "text-[10px] font-semibold text-text-primary"}>{pausedFinalMatch ? "Paused" : formatBracketMatchScore(match, node.sideA.team?.id || "")}</strong>
                  {hasMatchTieBreaker(match) && <em className="rounded bg-[#fff4d8] px-1 py-0.5 text-[7px] font-semibold not-italic uppercase tracking-[0.04em] text-[#8a5a00]">TB</em>}
                  {!pausedFinalMatch && <ArrowRight size={9} className="text-brand" />}
                </span>
              </>
            );
            return pausedFinalMatch ? (
              <span className="grid min-h-9 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-[8px] bg-white/60 px-2 py-1.5" key={match.id}>{content}</span>
            ) : (
              <Link className="tap-card grid min-h-9 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-[8px] bg-white px-2 py-1.5 text-left transition hover:bg-brand-light" href={`/tournaments/schedule/matches/${match.id}?from=bracket`} key={match.id}>{content}</Link>
            );
          })}
        </div>
      )}
      {hasWinner && <span className="absolute bottom-0 left-0 top-[43px] w-0.5 bg-[#b7ff2f]" aria-hidden="true" />}
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
    <span className={isWinner ? "grid min-h-12 grid-cols-[26px_minmax(0,1fr)_auto] items-center gap-2 bg-[#e4f6eb] px-2.5 py-2" : "grid min-h-12 grid-cols-[26px_minmax(0,1fr)_auto] items-center gap-2 px-2.5 py-2"}>
      {team?.logoUrl ? (
        <span className="grid h-6 w-6 place-items-center overflow-hidden rounded-[7px] bg-white p-0.5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]"><img className="h-full w-full object-contain" src={team.logoUrl} alt="" aria-hidden="true" /></span>
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
          <em className={isEliminated ? "flex min-w-0 items-center gap-1 text-[7px] font-medium not-italic uppercase tracking-[0.035em] text-text-muted" : "flex min-w-0 items-center gap-1 text-[7px] font-medium not-italic uppercase tracking-[0.035em] text-[#3b6d11]"}>
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
  const rawStandings = teams.map((team) => {
    const teamMatches = matches.filter((match) => match.teamAId === team.id || match.teamBId === team.id);
    const metrics = teamMatches.reduce((total, match) => addTeamScoreMetrics(total, getTeamScoreMetrics(match, team.id)), getEmptyTeamScoreMetrics());
    const setTotal = metrics.setsWon + metrics.setsLost;
    const gameTotal = metrics.gamesWon + metrics.gamesLost;
    return {
      team,
      seed: 0,
      completedMatches: metrics.completedMatches,
      scheduledMatches: teamMatches.length,
      matchWins: metrics.matchWins,
      matchLosses: metrics.matchLosses,
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
  const final = makeNode("final", "Championship final", "Final", "4:00 PM onward", [960, 1030], outcomeSlot(semifinal1, "winner", "Semifinal 1 winner"), outcomeSlot(semifinal2, "winner", "Semifinal 2 winner"));

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
      : "pointer-events-auto relative z-10 flex w-max max-w-full min-w-0 items-center gap-1.5 whitespace-nowrap rounded-full border-hairline border-white/55 bg-white/90 px-2.5 py-1.5 text-[#24412c] shadow-[0_5px_14px_rgba(0,0,0,0.08)]"}>
        <em className={isHero ? "shrink-0 text-[8px] font-medium not-italic uppercase tracking-[0.07em] text-white/65" : "shrink-0 text-[8px] font-medium not-italic uppercase tracking-[0.07em] text-current opacity-60"}>Sponsored by</em>
        <span className={isHero ? "block min-w-0 overflow-hidden text-ellipsis text-[11px] font-medium text-white" : "block min-w-0 overflow-hidden text-ellipsis text-[11px] font-medium text-[#24412c]"} title={sponsorNames}>
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
        <span className={`relative grid h-12 w-12 place-items-center overflow-hidden rounded-[15px] border border-dashed border-black/35 bg-white p-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.18)] sm:h-14 sm:w-14 sm:rounded-[17px] ${rotations[index]}`} style={{ zIndex: visibleSponsors.length - index }} key={`${sponsor.logoUrl}:${index}`}>
          <span className="absolute inset-1 rounded-[11px] border-hairline border-black/10" aria-hidden="true" />
          <img className="relative h-full w-full object-contain" src={sponsor.logoUrl} alt={`${sponsor.name || "Team sponsor"} logo`} />
        </span>
      ))}
      {remainingCount > 0 && <span className="relative z-10 grid h-7 min-w-7 place-items-center self-end rounded-full border-2 border-white bg-brand px-1 text-[9px] font-semibold text-white shadow-[0_6px_14px_rgba(0,0,0,0.16)]">+{remainingCount}</span>}
    </span>
  );
}

function TeamDetailPageCard({ team, matches, backHref, backLabel }: { team: PublishedTeam; matches: TeamCourtScheduleMatch[]; backHref: string; backLabel: string }) {
  const teamRecord = getTeamPerformanceSummary(team, matches);
  const teamColor = normalizeTeamColor(team.jerseyColor);
  const completedMatches = teamRecord.wins + teamRecord.losses;

  return (
    <section className="grid gap-4">
      <article className="relative overflow-hidden rounded-[26px] border-hairline border-white/25 bg-[linear-gradient(135deg,#0c3b20,#155c34)] text-white shadow-[0_20px_55px_rgba(12,59,32,0.16)]">
        <CourtBackdrop />
        <Link className="tap-card absolute left-4 top-4 z-20 inline-grid h-9 max-h-9 min-h-9 w-9 max-w-9 min-w-9 place-items-center rounded-full border-hairline border-white/60 bg-white/90 p-0 text-brand shadow-[0_8px_18px_rgba(0,0,0,0.10)] backdrop-blur transition-transform hover:-translate-x-0.5 active:scale-[0.98]" href={backHref} aria-label={backLabel}>
          <ArrowLeft size={16} strokeWidth={2.2} />
        </Link>
        <span className="pointer-events-none absolute right-4 top-4 z-20 flex items-start gap-2">
          <TeamSponsorLogoStamps sponsors={team.sponsors} />
          <span className="relative grid h-14 w-14 rotate-[6deg] place-items-center rounded-[17px] border border-dashed border-black/35 bg-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]" role="img" aria-label="Team jersey color">
            <span className="absolute inset-1 rounded-[13px] border-hairline border-black/10" aria-hidden="true" />
            <Shirt size={28} strokeWidth={1.9} style={{ color: "#18181b", fill: teamColor }} />
          </span>
        </span>
        <div className="relative grid gap-5 p-5 pt-20 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-7 sm:pt-16">
          <div className="flex min-w-0 items-center gap-4">
            {team.logoUrl ? (
              <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-[16px] border-hairline border-white/70 bg-white p-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.16)] sm:h-20 sm:w-20 sm:rounded-[19px]">
                <img src={team.logoUrl} alt={`${team.name} logo`} className="h-full w-full object-contain" />
              </span>
            ) : (
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[16px] border-hairline border-white/70 bg-white text-[18px] font-medium text-brand shadow-[0_10px_24px_rgba(0,0,0,0.16)] sm:h-20 sm:w-20 sm:rounded-[19px]">{getInitials(team.name)}</span>
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

      <article className="grid content-start gap-4 rounded-[24px] border-hairline border-line bg-white p-4 shadow-[0_14px_34px_rgba(24,24,26,0.06)] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="grid gap-0.5">
              <em className="text-[10px] font-medium not-italic uppercase tracking-[0.13em] text-text-muted">The lineup</em>
              <h2 className="text-[21px] font-medium tracking-[-0.25px] text-text-primary">Team roster</h2>
            </span>
            <span className="rounded-full bg-brand-light px-3 py-1 text-[12px] font-medium text-[#3b6d11]">{formatPlayerCount(team.members.length)}</span>
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

function TeamHeroStat({ label, value }: { label: string; value: number }) {
  return (
    <span className="grid min-w-0 gap-1 rounded-[14px] border-hairline border-white bg-white px-2.5 py-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.10)] sm:min-w-[78px] sm:px-3">
      <strong className="text-[20px] font-semibold leading-none text-[#0c3b20] sm:text-[22px]">{value}</strong>
      <em className="text-[10px] font-semibold not-italic uppercase tracking-[0.05em] text-[#5f5e5a]">{label}</em>
    </span>
  );
}

function TeamRosterMemberCard({ member, team, matches }: { member: PublishedTeamMember; team: PublishedTeam; matches: TeamCourtScheduleMatch[] }) {
  const performance = getMemberPerformance(member, team, matches);
  return (
    <article className="grid min-w-0 grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[16px] border-hairline border-line bg-surface/40 p-2.5 transition hover:border-brand/20 hover:bg-white hover:shadow-[0_10px_22px_rgba(12,59,32,0.07)]">
      <Avatar className="relative grid h-[42px] w-[42px] place-items-center overflow-hidden rounded-full border-2 border-white bg-brand-light text-[12px] font-medium text-[#3b6d11] shadow-[0_6px_14px_rgba(12,59,32,0.10)]" name={member.name} photoUrl={member.profilePhotoUrl} ariaLabel={`${member.name} profile photo`} sizes="42px" />
      <span className="grid min-w-0 gap-0.5">
        <span className="flex min-w-0 items-center gap-1.5">
          <strong className="truncate text-[14px] font-medium leading-tight text-text-primary">{member.name}</strong>
          {member.isCaptain && <em className="shrink-0 rounded-full bg-[#b8ff2c] px-1.5 py-0.5 text-[8px] font-medium not-italic uppercase tracking-[0.06em] text-[#16331e]">Captain</em>}
        </span>
        <em className="truncate text-[10px] not-italic text-text-secondary">{member.city || "City TBD"} · {member.tier} · Rating {member.rating || "N/A"}</em>
      </span>
      <span className="grid grid-cols-3 gap-0.5 text-center">
        <TeamPerformancePill label="Played" value={performance.played} />
        <TeamPerformancePill label="Won" value={performance.wins} />
        <TeamPerformancePill label="Lost" value={performance.losses} />
      </span>
    </article>
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
  return (
    <label className="grid grid-cols-[52px_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-[13px] border-hairline border-line bg-surface/55 px-2 py-1.5 text-[12px] text-text-secondary">
      <span className="font-medium text-text-primary">Set {setNumber}</span>
      <input className="min-h-9 rounded-[11px] border-hairline border-line bg-white px-2 text-center text-[15px] font-medium text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-light disabled:bg-surface disabled:text-text-muted" value={draft[leftKey]} onChange={(event) => onChange({ ...draft, [leftKey]: event.target.value.replace(/\D/g, "").slice(0, 2) })} placeholder="0" aria-label={`Set ${setNumber} score for ${leftLabel}${optional ? " if needed" : ""}`} inputMode="numeric" disabled={disabled} />
      <span className="text-text-muted">-</span>
      <input className="min-h-9 rounded-[11px] border-hairline border-line bg-white px-2 text-center text-[15px] font-medium text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand-light disabled:bg-surface disabled:text-text-muted" value={draft[rightKey]} onChange={(event) => onChange({ ...draft, [rightKey]: event.target.value.replace(/\D/g, "").slice(0, 2) })} placeholder="0" aria-label={`Set ${setNumber} score for ${rightLabel}${optional ? " if needed" : ""}`} inputMode="numeric" disabled={disabled} />
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

function PlayerScheduleMatchCard({ match, teams, isFeatured, onOpenMatch, hideTime = false }: { match: PlayerScheduleMatch; teams: PublishedTeam[]; isFeatured: boolean; onOpenMatch: () => void; hideTime?: boolean }) {
  const playerSideNames = match.playerSideNames.length ? match.playerSideNames : ["You"];
  const opponentNames = match.opponentNames.length ? match.opponentNames : ["Opponent TBD"];
  const courtNumber = formatCourtNumber(match.courtLabel || "");
  const isSingles = playerSideNames.length === 1 && opponentNames.length === 1;
  const ballTeam = getBallTeamForMatchup(match.dayNumber, match.teamId, match.opposingTeamId, match.id, teams);
  const showTeamBall = match.dayNumber === 2 || ballTeam?.id === match.teamId;
  const showOpponentBall = match.dayNumber === 2 ? false : ballTeam?.id === match.opposingTeamId;

  return (
    <article className={`relative overflow-hidden rounded-[20px] bg-[#fbfcf8] ${isFeatured ? "shadow-[0_14px_34px_rgba(12,59,32,0.08)]" : ""}`}>
      <div className="relative grid gap-3">
        {!hideTime && (
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1.5 text-white shadow-[0_10px_22px_rgba(12,59,32,0.16)] sm:gap-2 sm:px-3 sm:py-2">
              <Clock size={13} />
              <strong className="text-[13px] font-medium leading-none sm:text-[14px]">{match.timeLabel || "Time TBD"}</strong>
            </span>
            <span className="min-w-0 justify-self-end text-right text-[12px] font-medium text-text-secondary sm:text-[13px]">
              <ScheduleHeaderTeamName name={match.teamName} showBallIcon={showTeamBall} />
              <em className="mx-1 not-italic text-text-muted">vs</em>
              <ScheduleHeaderTeamName name={match.opposingTeamName} showBallIcon={showOpponentBall} />
            </span>
          </div>
        )}
        <button className="tap-card group grid w-full grid-cols-[minmax(0,1fr)_30px] items-center gap-2 text-left" type="button" onClick={onOpenMatch} aria-label={`View match details: ${playerSideNames.join(" and ")} versus ${opponentNames.join(" and ")}`}>
          <span className="grid min-h-[88px] rounded-[18px] border-hairline border-[#dce4dc] bg-white p-2 transition group-hover:border-brand/30 group-hover:shadow-[0_12px_28px_rgba(12,59,32,0.07)] sm:min-h-[102px] sm:p-2.5">
            <span className="grid grid-cols-[minmax(0,1fr)_46px_minmax(0,1fr)] items-stretch gap-2 sm:grid-cols-[minmax(0,1fr)_58px_minmax(0,1fr)] sm:gap-3">
              <PlayerNameStack label="" names={playerSideNames} tone="primary" color={match.teamColor} centerOnWideScreens={isSingles} />
              <CourtLineDivider label={courtNumber} />
              <PlayerNameStack label="" names={opponentNames} tone="opponent" color={match.opposingTeamColor} centerOnWideScreens={isSingles} />
            </span>
          </span>
          <span className="justify-self-center">
            <MatchCardSideCue />
          </span>
        </button>
      </div>
    </article>
  );
}

function MatchCardSideCue() {
  return (
    <span className="pointer-events-none grid h-7 w-7 place-items-center rounded-full bg-[#f1f4ee] text-brand transition group-hover:bg-brand group-hover:text-white" aria-hidden="true">
      <ArrowRight className="transition-transform group-hover:translate-x-0.5" size={17} strokeWidth={2.3} />
    </span>
  );
}

function PlayerNameStack({ label, names, tone, color, centerOnWideScreens = false }: { label: string; names: string[]; tone: "primary" | "opponent"; color?: string; centerOnWideScreens?: boolean }) {
  const isPrimary = tone === "primary";
  const teamTone = color ? getTeamCardTone(color) : null;
  const chipStyle = teamTone
    ? { background: teamTone.background, color: teamTone.textColor, borderColor: "rgba(255,255,255,0.28)" }
    : undefined;
  return (
    <span className={`grid min-w-0 content-center gap-1.5 ${centerOnWideScreens ? "sm:content-center" : ""}`}>
      {label && <em className="truncate px-1 text-[10px] font-medium not-italic text-text-muted">{label}</em>}
      {names.map((name, index) => (
        <Fragment key={`${name}-${index}`}>
          <strong
            className={isPrimary ? "grid min-h-9 min-w-0 place-items-center rounded-[12px] border-hairline border-[#e3e8e1] bg-[#f3f5f1] px-2 py-1.5 text-center text-[11px] font-semibold leading-tight text-text-primary sm:min-h-11 sm:px-3 sm:py-2 sm:text-[14px]" : "grid min-h-9 min-w-0 place-items-center rounded-[12px] border-hairline border-white/25 bg-surface/70 px-2 py-1.5 text-center text-[11px] font-semibold leading-tight text-text-primary sm:min-h-11 sm:px-3 sm:py-2 sm:text-[14px]"}
            style={chipStyle}
          >
            <span className="block min-w-0 whitespace-normal break-words">{name}</span>
          </strong>
          {index < names.length - 1 && (
            <em className="-my-1 justify-self-center text-[10px] font-semibold not-italic leading-none text-text-muted" aria-hidden="true">&amp;</em>
          )}
        </Fragment>
      ))}
    </span>
  );
}

function TennisBallIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span className={`relative inline-block shrink-0 drop-shadow-[0_1px_2px_rgba(12,59,32,0.24)] ${className}`} aria-hidden="true">
      <NextImage src="/images/tennis-countdown-ball.png" alt="" fill sizes="20px" className="object-contain" />
    </span>
  );
}

function CourtLineDivider({ label }: { label?: string }) {
  const courtNumber = label ? formatCourtNumber(label) : "";
  return (
    <span className="relative grid min-h-[72px] place-items-center self-stretch" aria-hidden={!label}>
      <span className="absolute inset-y-0 left-1/2 border-l-2 border-dashed border-[#cfd9cf]" aria-hidden="true" />
      {courtNumber && (
        <span className="relative z-[1] grid min-h-[44px] min-w-[40px] place-items-center content-center rounded-[9px] bg-[#123f34] px-1.5 py-1 text-white shadow-[0_8px_18px_rgba(12,59,32,0.16)] sm:min-h-[48px] sm:min-w-[44px]">
          <small className="font-mono text-[8px] font-medium uppercase leading-none tracking-[0.08em] text-white/75 sm:text-[9px]">court</small>
          <b className="font-mono text-[20px] font-semibold leading-none text-[#dfff4f] sm:text-[23px]">{courtNumber}</b>
        </span>
      )}
    </span>
  );
}

function formatCourtNumber(label: string) {
  const match = label.match(/\d+(?:\s*[-–]\s*\d+)?/);
  return match ? match[0].replace(/\s+/g, "") : label.replace(/^court\s*/i, "").trim();
}

const DAY_ONE_BALL_TEAM_BY_PAIR: Record<string, number> = {
  "4-7": 4,
  "1-2": 2,
  "3-6": 3,
  "1-4": 1,
  "2-5": 2,
  "7-8": 8,
  "1-6": 6,
  "4-5": 4,
  "3-8": 8,
  "6-7": 7,
  "2-3": 2,
  "5-8": 5,
  "1-7": 1,
  "4-6": 4,
  "3-5": 5,
  "1-3": 3,
  "2-4": 4,
  "6-8": 6,
  "2-8": 2,
  "5-7": 7
};

function getBallTeamForMatchup(dayNumber: number, teamAId: string, teamBId: string, matchupKey: string, teams: PublishedTeam[]) {
  const teamA = teams.find((team) => team.id === teamAId);
  const teamB = teams.find((team) => team.id === teamBId);
  if (!teamA || !teamB) return null;

  if (dayNumber === 1) {
    const pairKey = [teamA.sortOrder, teamB.sortOrder].sort((a, b) => a - b).join("-");
    const ballTeamSortOrder = DAY_ONE_BALL_TEAM_BY_PAIR[pairKey];
    if (!ballTeamSortOrder) return null;
    return teamA.sortOrder === ballTeamSortOrder ? teamA : teamB.sortOrder === ballTeamSortOrder ? teamB : null;
  }

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
      className={`${compact ? "min-h-7 gap-1.5 px-2.5 py-1 text-[10px]" : "min-h-8 gap-2 px-3 py-1.5 text-[11px]"} inline-flex min-w-0 max-w-full items-center rounded-full border-hairline ${pending ? "border-line bg-surface text-text-muted" : "border-[#d3dfc5] bg-[#f6f9ef] text-brand"} shadow-[0_6px_14px_rgba(12,59,32,0.05)]`}
      title={title}
      aria-label={title}
    >
      <TennisBallIcon className={compact ? "h-4 w-4" : "h-5 w-5"} />
      <em className="shrink-0 font-medium not-italic opacity-70">Balls:</em>
      <strong className="min-w-0 truncate font-medium text-current">{displayName}</strong>
    </span>
  );
}

function TeamCourtScheduleBlock({ block, teams, isFeatured, onOpenMatch, onOpenTeam }: { block: TeamCourtScheduleBlock; teams: PublishedTeam[]; isFeatured: boolean; onOpenMatch: (match: TeamCourtScheduleMatch) => void; onOpenTeam: (teamId: string) => void }) {
  const primaryTeam = teams.find((team) => team.id === block.primaryTeamId);
  const opponentTeam = teams.find((team) => team.id === block.opponentTeamId);
  const firstMatch = block.matches[0];
  const ballTeam = firstMatch ? getBallTeamForMatchup(firstMatch.dayNumber, firstMatch.teamAId, firstMatch.teamBId, block.id, teams) : null;
  const showPrimaryBall = firstMatch ? firstMatch.dayNumber === 2 || ballTeam?.id === primaryTeam?.id : false;
  const showOpponentBall = firstMatch ? firstMatch.dayNumber === 2 ? false : ballTeam?.id === opponentTeam?.id : false;

  return (
    <article className={`relative overflow-hidden rounded-[20px] border-hairline border-white/70 bg-white/88 p-3.5 shadow-[0_18px_44px_rgba(12,59,32,0.10)] ring-1 ring-line/70 backdrop-blur-xl ${isFeatured ? "shadow-[0_20px_48px_rgba(12,59,32,0.13)]" : ""}`}>
      <span className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(24,95,165,0.12),transparent_58%)]" aria-hidden="true" />
      <div className="relative grid gap-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <ScheduleTeamPill label={block.primaryTeam} color={primaryTeam?.jerseyColor || "#eaf3de"} logoUrl={primaryTeam?.logoUrl || ""} isFinalized={Boolean(primaryTeam)} showBallIcon={showPrimaryBall} onClick={primaryTeam ? () => onOpenTeam(primaryTeam.id) : undefined} />
          <em className="text-[12px] not-italic text-text-muted">vs</em>
          <ScheduleTeamPill label={block.opponentTeam} color={opponentTeam?.jerseyColor || "#e5f1ff"} logoUrl={opponentTeam?.logoUrl || ""} isFinalized={Boolean(opponentTeam)} showBallIcon={showOpponentBall} onClick={opponentTeam ? () => onOpenTeam(opponentTeam.id) : undefined} />
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

function DayScheduleTimeCard({ label, blocks, eventItems, teams, openBlocks, onToggleBlock, onOpenMatch, onOpenTeam, defaultOpen = false }: { label: string; blocks: TeamCourtScheduleBlock[]; eventItems: ScheduleItem[]; teams: PublishedTeam[]; openBlocks: Record<string, boolean>; onToggleBlock: (blockId: string) => void; onOpenMatch: (match: TeamCourtScheduleMatch) => void; onOpenTeam: (teamId: string) => void; defaultOpen?: boolean }) {
  const matchCount = blocks.reduce((total, block) => total + block.matches.length, 0);
  const totalCount = matchCount + eventItems.length;
  const countLabel = eventItems.every((item) => item.itemType === "match") ? `${totalCount} ${totalCount === 1 ? "match" : "matches"}` : `${totalCount} ${totalCount === 1 ? "item" : "items"}`;

  return (
    <section className="overflow-hidden rounded-[24px] border-hairline border-[#d8e1d9] bg-[#fbfcf8] shadow-[0_20px_48px_rgba(12,59,32,0.11)]" key={label}>
      <div className="flex min-h-[66px] items-center justify-between gap-3 border-b-hairline border-[#dce4dc] bg-[linear-gradient(135deg,#eef4e7,#fbfcf8)] px-4 py-2.5 sm:min-h-[72px] sm:px-5">
        <span className="inline-flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/[0.08] text-brand sm:h-10 sm:w-10">
            <Clock size={18} strokeWidth={2.2} />
          </span>
          <h2 className="truncate text-[19px] font-medium leading-none text-brand sm:text-[21px]">{label}</h2>
        </span>
        <span className="shrink-0 rounded-full border-hairline border-[#d3dfc5] bg-white/75 px-3 py-1.5 text-[11px] font-medium text-brand/75 sm:text-[12px]">{countLabel}</span>
      </div>
      <div className="grid gap-2.5 p-3 sm:p-4">
        {!!eventItems.length && (
          <div className="grid gap-2">
            {eventItems.map((item) => (
              item.itemType === "event"
                ? <ScheduleCompactEventRow item={item} key={item.id} />
                : <ScheduleItemCard item={item} teams={teams} hideTime key={item.id} />
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
    <article className="rounded-[16px] border-hairline border-[#f2dccb] bg-[#fff8f1] px-4 py-3">
      <strong className="text-[16px] font-medium leading-snug text-text-primary">{item.matchLabel}</strong>
    </article>
  );
}

function DayScheduleEndCard() {
  return (
    <section className="rounded-[18px] border-hairline border-line bg-white px-4 py-3 text-center shadow-[0_10px_24px_rgba(24,24,26,0.04)]">
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
    <article className="overflow-hidden rounded-[18px] border-hairline border-line bg-white shadow-[0_10px_24px_rgba(24,24,26,0.05)]">
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
            <ScheduleTeamPill label={block.primaryTeam} color={primaryTeam?.jerseyColor || "#eaf3de"} logoUrl={primaryTeam?.logoUrl || ""} isFinalized={Boolean(primaryTeam)} showBallIcon={showPrimaryBall} compact onClick={primaryTeam ? () => onOpenTeam(primaryTeam.id) : undefined} />
            <em className="text-[10px] not-italic text-text-muted">vs</em>
            <ScheduleTeamPill label={block.opponentTeam} color={opponentTeam?.jerseyColor || "#e5f1ff"} logoUrl={opponentTeam?.logoUrl || ""} isFinalized={Boolean(opponentTeam)} showBallIcon={showOpponentBall} compact onClick={opponentTeam ? () => onOpenTeam(opponentTeam.id) : undefined} />
          </span>
        </span>
        <span className="inline-grid h-9 w-9 place-items-center justify-self-center rounded-full bg-surface text-brand transition group-hover:bg-brand-light" aria-hidden="true">
          <ChevronDown size={19} strokeWidth={2.4} className={`transition-all duration-300 ease-out ${isOpen ? "rotate-180 translate-y-0 text-brand" : "translate-y-0.5 text-brand/85"}`} />
        </span>
      </div>
      {isOpen && (
        <div className="border-t-hairline border-line bg-surface/45 p-3">
          <div className="divide-y divide-line overflow-hidden rounded-[17px] border-hairline border-[#dce4dc] bg-white">
            {block.matches.map((match) => (
              <TeamCourtScheduleGame match={match} teamName={block.primaryTeam} onOpenMatch={onOpenMatch} grouped key={match.id} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function TeamCourtScheduleGame({ match, teamName, onOpenMatch, grouped = false }: { match: TeamCourtScheduleMatch; teamName: string; onOpenMatch: (match: TeamCourtScheduleMatch) => void; grouped?: boolean }) {
  const teamIsA = match.teamAName === teamName;
  const primaryPlayers = teamIsA ? match.playersA : match.playersB;
  const opponentPlayers = teamIsA ? match.playersB : match.playersA;
  const displayPrimaryPlayers = primaryPlayers.length ? primaryPlayers : [teamName];
  const displayOpponentPlayers = opponentPlayers.length ? opponentPlayers : ["Opponent TBD"];
  const courtNumber = formatCourtNumber(match.courtLabel || "");
  const isSingles = displayPrimaryPlayers.length === 1 && displayOpponentPlayers.length === 1;
  const opponentColor = teamIsA ? match.teamBColor : match.teamAColor;

  return (
    <button className={grouped ? "tap-card group relative grid w-full grid-cols-[minmax(0,1fr)_30px] items-center gap-2 bg-white p-2.5 text-left transition hover:bg-[#fbfcf8] sm:p-3" : "tap-card group relative grid w-full grid-cols-[minmax(0,1fr)_30px] items-center gap-2 rounded-[17px] border-hairline border-[#dce4dc] bg-white p-2.5 text-left transition hover:border-brand/30 hover:shadow-[0_12px_28px_rgba(12,59,32,0.07)] sm:p-3"} type="button" onClick={() => onOpenMatch(match)} aria-label={`View match details: ${displayPrimaryPlayers.join(" and ")} versus ${displayOpponentPlayers.join(" and ")}`}>
      <span className="grid min-h-[72px] grid-cols-[minmax(0,1fr)_46px_minmax(0,1fr)] items-stretch gap-2 sm:grid-cols-[minmax(0,1fr)_50px_minmax(0,1fr)] sm:gap-3">
        <PlayerNameStack label="" names={displayPrimaryPlayers} tone="primary" centerOnWideScreens={isSingles} />
        <CourtLineDivider label={courtNumber} />
        <PlayerNameStack label="" names={displayOpponentPlayers} tone="opponent" color={opponentColor} centerOnWideScreens={isSingles} />
      </span>
      <span className="justify-self-center">
        <MatchCardSideCue />
      </span>
    </button>
  );
}

function ScheduleTeamPill({ label, color, logoUrl, isFinalized, wrapName = false, compact = false, showBallIcon = false, onClick }: { label: string; color: string; logoUrl: string; isFinalized: boolean; wrapName?: boolean; compact?: boolean; showBallIcon?: boolean; onClick?: () => void }) {
  const teamTone = getTeamCardTone(color);
  const pillStyle = isFinalized
    ? { background: teamTone.background, color: teamTone.textColor, borderColor: "rgba(255,255,255,0.28)" }
    : undefined;
  const Tag = onClick ? "button" : "span";
  const gridColumns = showBallIcon
    ? compact ? "grid-cols-[20px_minmax(0,1fr)_auto]" : "grid-cols-[28px_minmax(0,1fr)_auto]"
    : compact ? "grid-cols-[20px_minmax(0,1fr)]" : "grid-cols-[28px_minmax(0,1fr)]";
  return (
    <Tag className={isFinalized ? `${onClick ? "tap-card text-left" : ""} ${gridColumns} ${compact ? "gap-1 px-1" : "gap-2 px-2"} grid min-h-9 min-w-0 items-center rounded-full border-hairline py-1 shadow-[0_8px_18px_rgba(12,59,32,0.12)]` : `${onClick ? "tap-card text-left" : ""} ${gridColumns} ${compact ? "gap-1 px-1" : "gap-2 px-2"} grid min-h-9 min-w-0 items-center rounded-full border-hairline border-line bg-white py-1`} style={pillStyle} type={onClick ? "button" : undefined} onClick={(event) => {
      if (!onClick) return;
      event.stopPropagation();
      onClick();
    }}>
      {logoUrl ? (
        <span className={`${compact ? "h-5 w-5" : "h-7 w-7"} grid shrink-0 place-items-center overflow-hidden rounded-full bg-white/90 p-1 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]`}>
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
      jerseyColor: normalizeTeamColor(team.jersey_color),
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
  return hasScheduleEventNear(withBreakfast, 12 * 60 + 50)
    ? withBreakfast
    : [...withBreakfast, createScheduleEventItem(1, "12:50-1:30 PM", "Lunch", "Lunch break before afternoon matches resume.", 1250)];
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
  return hasScheduleEventNear(values, 8 * 60)
    ? values
    : [createScheduleEventItem(2, "8:00-9:00 AM", "Breakfast / briefing / warmup / team setup", "Check in, eat, warm up, and settle into teams before matches begin.", -20), ...values];
}

function isLunchScheduleItem(item: ScheduleItem) {
  return normalizeName([item.matchLabel, item.phase, item.detail].filter(Boolean).join(" ")).includes("lunch");
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

function groupPlayerMatchesByTime(matches: PlayerScheduleMatch[]) {
  return matches.reduce<Record<string, PlayerScheduleMatch[]>>((groups, match) => {
    const label = match.timeLabel || match.dayLabel;
    groups[label] = groups[label] || [];
    groups[label].push(match);
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
  if ([sideASet1, sideBSet1, sideASet2, sideBSet2].some((value) => value == null)) return { ok: false, message: "Please enter scores for set 1 and set 2." };

  const set1Winner = getSetWinner(sideASet1, sideBSet1);
  const set2Winner = getSetWinner(sideASet2, sideBSet2);
  if (!set1Winner || !set2Winner) return { ok: false, message: "Each completed set needs a winner." };

  let winnerSide: "A" | "B" | "" = "";
  if (set1Winner === set2Winner) {
    winnerSide = set1Winner;
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
    const playerSideNames = participants
      .filter((participant) => participant.side === currentSide)
      .map((participant) => participant.source_player_name || "Player");
    const partnerNames = participants
      .filter((participant) => participant.side === currentSide && participant.player_id !== playerId)
      .map((participant) => participant.source_player_name || "Partner");
    const opponentNames = participants
      .filter((participant) => participant.side !== currentSide)
      .map((participant) => participant.source_player_name || "Opponent");
    const currentTeam = teams.find((team) => team.id === current.team_id);
    const opposingParticipant = participants.find((participant) => participant.side !== currentSide);
    const opposingTeam = teams.find((team) => team.id === opposingParticipant?.team_id);
    const fallbackTeamName = currentSide === "A" ? match.team_a_label : match.team_b_label;
    const fallbackOpposingTeamName = currentSide === "A" ? match.team_b_label : match.team_a_label;
    const format: "Singles" | "Doubles" = match.format === "Doubles" ? "Doubles" : "Singles";
    const matchColor: "Green" | "Red" | "" = match.match_color === "Green" || match.match_color === "Red" ? match.match_color : "";

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
      teamId: currentTeam?.id || current.team_id || "",
      opposingTeamId: opposingTeam?.id || opposingParticipant?.team_id || "",
      teamName: currentTeam?.name || fallbackTeamName || "Your team",
      opposingTeamName: opposingTeam?.name || fallbackOpposingTeamName || "Opposing team",
      teamColor: currentTeam?.jerseyColor || "#eaf3de",
      opposingTeamColor: opposingTeam?.jerseyColor || "#e5f1ff",
      teamLogoUrl: currentTeam?.logoUrl || "",
      opposingTeamLogoUrl: opposingTeam?.logoUrl || "",
      playerSideNames,
      partnerNames,
      opponentNames,
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
        id: participant.player_id || participant.id,
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
      teamAColor: teamA?.jerseyColor || "#eaf3de",
      teamBColor: teamB?.jerseyColor || "#e5f1ff",
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
  const canUseMoizPreview = player?.full_name?.trim().toLowerCase() === "mohammed segval";
  if (!canUseMoizPreview) return null;
  return teams.find((team) => team.members.some((member) => member.name.trim().toLowerCase() === "moiz broachwala")) || null;
}

function getSchedulePreviewPlayerId(teams: PublishedTeam[], player: DbProfileRow | null) {
  if (!player?.id) return "";
  const canUseMoizPreview = player.full_name?.trim().toLowerCase() === "mohammed segval";
  if (canUseMoizPreview) {
    const moiz = teams.flatMap((team) => team.members).find((member) => member.name.trim().toLowerCase() === "moiz broachwala");
    return moiz?.playerId || player.id;
  }
  return player.id;
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
    <article className={editing ? "grid gap-2 rounded-[12px] border-hairline border-[#bdd7aa] bg-white p-3 shadow-[0_6px_18px_rgba(12,59,32,0.035)]" : "grid gap-2 rounded-[12px] border-hairline border-line bg-card p-3"}>
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
      className="fixed inset-x-0 bottom-0 z-50 grid border-t-hairline border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0.72))] px-4 py-3 shadow-[0_-18px_44px_rgba(24,24,26,0.08)] backdrop-blur-2xl md:inset-x-6 md:bottom-4 md:mx-auto md:max-w-shell md:rounded-[24px] md:border-hairline md:shadow-[0_18px_50px_rgba(24,24,26,0.12)] lg:left-1/2 lg:right-auto lg:w-[min(760px,calc(100vw-64px))] lg:-translate-x-1/2"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`, paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
      aria-label="Primary mobile navigation"
    >
      {tabs.map(({ id, href, label, icon: Icon }) => (
        <Link className={active === id ? "grid min-h-12 place-items-center content-center gap-1 rounded-[16px] bg-[#E6F3EA] text-[#1d6e3a]" : "grid min-h-12 place-items-center content-center gap-1 rounded-[16px] text-[#b6b1a8]"} href={href} key={id}>
          <Icon size={20} strokeWidth={active === id ? 2.2 : 1.7} />
          <span className={active === id ? "text-[12px] font-medium leading-none" : "text-[12px] font-normal leading-none"}>{label}</span>
          <span className={active === id ? "h-1 w-1 rounded-full bg-[#1d6e3a]" : "h-1 w-1 rounded-full bg-transparent"} />
        </Link>
      ))}
    </nav>
  );
}
