"use client";

import { Home, LogOut, Trophy, UsersRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react";
import { getSupabaseClient } from "./lib/supabase";

type Tab = "home" | "tournament" | "profile" | "logout";
type ProfileData = {
  id?: string;
  profilePhotoUrl?: string;
  fullName: string;
  age: string;
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

type TopPlayer = { rank: string; name: string; rating: string; form: string };
type ProfileBadge = { name: string; initials: string; photoUrl?: string };
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
const videoDescription = "Capture a video of yourself playing tennis covering all the different shots (serve, forehand, backhand, volleys) and upload it on your Google Drive and share the link here. Even if you participated last year, we'd like to see how much you've improved. If you don't have the video while signing up, you can come back and upload it here, however, it is a mandatory requirement to be eligible for the draft.";
type DbProfileRow = {
  id?: string;
  full_name?: string | null;
  phone?: string | null;
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
  age: "28",
  dominantHand: "Right",
  selfEvaluation: "Advanced",
  jamaatCity: "Chicago",
  tier: "1",
  rating: "4.432",
  tournamentsPlayed: "2",
  matchesPlayed: "11",
  jerseySize: "M",
  tennisVideo: "Google Drive Link"
};

export function AppFrame({
  active,
  children,
  withNav = true
}: {
  active?: Tab;
  children: React.ReactNode;
  withNav?: boolean;
}) {
  return (
    <main className="app-stage">
      <section className="phone-frame" aria-label="MRSA tennis tournament app">
        <div className="screen-stack">{children}</div>
        {withNav && active && <BottomNav active={active} />}
      </section>
    </main>
  );
}

export function LoginScreen() {
  const router = useRouter();
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

    router.push(`/otp?email=${encodeURIComponent(email)}`);
  };

  return (
    <AppFrame withNav={false}>
      <div className="screen auth-screen">
        <header className="hero-header auth-hero">
          <div className="brand-row">
            <span className="brand">MRSA</span>
            <span className="profile-pill auth-pill">MR</span>
          </div>
          <p className="season">MRSA Access</p>
          <h1>Mumineen Racquet Sports Association</h1>
          <p className="auth-copy">Use your email to get a one-time code and open your tournament dashboard.</p>
        </header>
        <section className="content-panel auth-panel">
          <form className="auth-form" onSubmit={sendOtp}>
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" placeholder="player@mrsa.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <button className="primary-action tap-card" type="submit" disabled={loading}>{loading ? "Sending..." : "Send Code"}</button>
            {message && <p className="form-status">{message}</p>}
          </form>
        </section>
      </div>
    </AppFrame>
  );
}

export function OtpScreen({ email = "player@mrsa.com" }: { email?: string }) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      return;
    }

    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email"
    });

    if (error) {
      setLoading(false);
      setMessage(getFriendlyError(error));
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

    setLoading(false);
    router.push(linkedPlayer ? "/dashboard" : "/player-check");
  };

  return (
    <AppFrame withNav={false}>
      <div className="screen auth-screen">
        <header className="hero-header auth-hero">
          <div className="brand-row">
            <span className="brand">MRSA</span>
            <span className="profile-pill auth-pill">OTP</span>
          </div>
          <p className="season">Verification</p>
          <h1>Check your<br />inbox.</h1>
          <p className="auth-copy">Enter the one-time code sent to {email}.</p>
        </header>
        <section className="content-panel auth-panel">
          <form className="auth-form" onSubmit={verifyOtp}>
            <input type="hidden" name="email" value={email} />
            <label htmlFor="otp">One-time code</label>
            <input id="otp" name="otp" className="otp-input" inputMode="numeric" maxLength={10} placeholder="12345678" value={otp} onChange={(event) => setOtp(event.target.value)} required />
            <button className="primary-action tap-card" type="submit" disabled={loading}>{loading ? "Confirming..." : "Confirm OTP"}</button>
            <Link className="secondary-action tap-card" href="/">Change email</Link>
            {message && <p className="form-status">{message}</p>}
          </form>
        </section>
      </div>
    </AppFrame>
  );
}

export function PlayerCheckScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState<ReturningPlayer[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<ReturningPlayer | null>(null);
  const [message, setMessage] = useState("");
  const filteredPlayers = query.trim()
    ? players.filter((player) => player.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
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
  }, []);

  const claimProfile = async (playerId: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/");
      return;
    }

    const { error: playerError } = await supabase
      .from("players")
      .update({
        claim_status: "pending",
        claim_requested_by: user.id
      })
      .eq("id", playerId)
      .eq("claim_status", "unclaimed");

    if (playerError) {
      setMessage(playerError.message);
      return;
    }

    const { error } = await supabase.from("player_claims").insert({
      player_id: playerId,
      requested_by: user.id,
      requester_note: "Player requested this profile from onboarding."
    });

    if (error) {
      setMessage(getFriendlyError(error));
      return;
    }

    setMessage("Profile reserved. Complete your details before continuing.");
    router.push(`/profile/new?claim=${playerId}`);
  };

  return (
    <AppFrame withNav={false}>
      <div className="screen auth-screen onboarding-screen">
        <header className="hero-header auth-hero">
          <div className="brand-row">
            <span className="brand">MRSA</span>
            <span className="profile-pill auth-pill">ID</span>
          </div>
          <p className="season">Player Setup</p>
          <h1>Returning<br />player?</h1>
          <p className="auth-copy">If you played in past MRSA tournaments, search your name and continue with your existing profile.</p>
        </header>
        <section className="content-panel auth-panel onboarding-panel">
          <div className="auth-form">
            <label htmlFor="player-search">Search past player profiles</label>
            <input
              id="player-search"
              name="player"
              type="search"
              placeholder="Type a player name"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedPlayer(null);
              }}
            />
            <p className="form-status">If you have played a previous MRSA tournament, type your name and select the appropriate profile to claim.</p>
          </div>

          <div className="returning-list">
            {filteredPlayers.map((player) => (
              <button className={selectedPlayer?.id === player.id ? "returning-card selected tap-card" : "returning-card tap-card"} type="button" onClick={() => setSelectedPlayer(player)} key={player.id}>
                <span>{player.name}</span>
                <strong>{selectedPlayer?.id === player.id ? "Selected Profile" : `Rating ${player.rating}`}</strong>
                <em>{player.city} · Tier {player.tier} · Select to claim</em>
              </button>
            ))}
            {query.trim() && !filteredPlayers.length && <div className="empty-card">No unclaimed player profiles found.</div>}
          </div>

          {selectedPlayer && (
            <div className="claim-confirm-card">
              <span>Confirm claim</span>
              <strong>Are you claiming {selectedPlayer.name} profile?</strong>
              <em>Please only continue if this is you.</em>
              <div>
                <button className="primary-action tap-card" type="button" onClick={() => claimProfile(selectedPlayer.id)}>Yes, this is me</button>
                <button className="secondary-action tap-card" type="button" onClick={() => setSelectedPlayer(null)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="new-player-actions">
            <p className="form-status">New or first time players, click First Time Player.</p>
            <Link className="primary-action tap-card" href="/profile/new">First time player</Link>
          </div>
          {message && <p className="form-status">{message}</p>}
        </section>
      </div>
    </AppFrame>
  );
}

export function NewPlayerScreen({ claimPlayerId }: { claimPlayerId?: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [claimedProfile, setClaimedProfile] = useState<DbProfileRow | null>(null);
  const [shirtSize, setShirtSize] = useState("M");
  const [selfAssessment, setSelfAssessment] = useState(skillLevels[2].value);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    const loadClaimedProfile = async () => {
      if (!claimPlayerId) return;
      const supabase = getSupabaseClient();
      if (!supabase) return;
      const { data } = await supabase
        .from("players")
        .select("id, full_name, phone, profile_photo_url, jamaat_city, self_assessment, jersey_size, tennis_video_url")
        .eq("id", claimPlayerId)
        .maybeSingle();
      if (data) {
        setClaimedProfile(data);
        setShirtSize(data.jersey_size || "M");
        setSelfAssessment(normalizeSkillLevel(data.self_assessment) || skillLevels[2].value);
      }
    };

    loadClaimedProfile();
  }, [claimPlayerId]);

  const createPlayer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Supabase env vars are missing.");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/");
      return;
    }

    setLoading(true);
    setMessage("");
    const file = form.get("profilePhoto") instanceof File ? form.get("profilePhoto") as File : null;
    const photoUrl = file && file.size > 0 ? await uploadCompressedProfilePhoto(user.id, file) : null;
    const profilePayload = {
      full_name: String(form.get("fullName") || ""),
      phone: String(form.get("phone") || ""),
      jamaat_city: String(form.get("jamaatCity") || ""),
      self_assessment: String(form.get("selfAssessment") || skillLevels[2].value),
      jersey_size: String(form.get("jerseySize") || "M"),
      tennis_video_url: String(form.get("tennisVideo") || ""),
      ...(photoUrl ? { profile_photo_url: photoUrl } : {})
    };

    const error = claimPlayerId
      ? (await supabase
          .from("players")
          .update({
            ...profilePayload,
            auth_user_id: user.id,
            claim_status: "pending",
            claim_requested_by: user.id
          })
          .eq("id", claimPlayerId)).error
      : await createNewPlayerProfile(supabase, user.id, profilePayload);

    setLoading(false);

    if (error) {
      setMessage(getFriendlyError(error));
      return;
    }

    router.push("/dashboard");
  };

  const completionTitle = claimPlayerId ? "Complete<br />profile." : "New MRSA<br />player.";

  return (
    <AppFrame withNav={false}>
      <div className="screen auth-screen onboarding-screen">
        <header className="hero-header auth-hero">
          <div className="brand-row">
            <span className="brand">MRSA</span>
            <span className="profile-pill auth-pill">{claimPlayerId ? "CLM" : "NEW"}</span>
          </div>
          <p className="season">{claimPlayerId ? "Claim Profile" : "Create Profile"}</p>
          <h1 dangerouslySetInnerHTML={{ __html: completionTitle }} />
          <p className="auth-copy">{claimPlayerId ? "Complete your profile details before moving forward. Admin can still review and handle false claims." : "Create your profile once. New players start at Tier 4 with a 1.5 rating."}</p>
        </header>
        <section className="content-panel auth-panel onboarding-panel">
          <form className="profile-create-form" onSubmit={createPlayer}>
            <label>
              <span>Full Name</span>
              <input name="fullName" type="text" placeholder="Full Name" defaultValue={claimedProfile?.full_name || ""} required />
            </label>
            <label>
              <span>Jamaat / City</span>
              <input name="jamaatCity" type="text" placeholder="Chicago" defaultValue={claimedProfile?.jamaat_city || ""} required />
            </label>
            <label>
              <span>Self Evaluation</span>
              <select name="selfAssessment" value={selfAssessment} onChange={(event) => setSelfAssessment(event.target.value)}>
                {skillLevels.map((level) => (
                  <option value={level.value} key={level.value}>{level.value}</option>
                ))}
              </select>
              <em className="field-help">{getSkillLevelLabel(selfAssessment)}</em>
            </label>
            <label>
              <span>Shirt Size <button className="inline-guide-button" type="button" onClick={() => setSizeGuideOpen(true)}>Size guide</button></span>
              <select name="jerseySize" value={shirtSize} onChange={(event) => setShirtSize(event.target.value)}>
                {["YXS", "YS", "YM", "YL", "YXL", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"].map((size) => (
                  <option key={size}>{size}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Phone Number</span>
              <input name="phone" type="tel" placeholder="9999999999" defaultValue={claimedProfile?.phone || ""} required />
            </label>
            <label>
              <span>Profile Pic Optional</span>
              <input name="profilePhoto" type="file" accept="image/*" />
            </label>
            <label>
              <span>Google Drive Playing Video Optional</span>
              <em className="field-help">{videoDescription}</em>
              <input name="tennisVideo" type="url" placeholder="https://drive.google.com/..." defaultValue={claimedProfile?.tennis_video_url || ""} />
            </label>

            <div className="assignment-card">
              <span>{claimPlayerId ? "Claimed profile" : "Assigned after signup"}</span>
              <strong>{claimPlayerId ? "Existing tier and rating kept" : "Tier 4 · Rating 1.5"}</strong>
              <em>{claimPlayerId ? "Admin can approve or reject this claim." : "0 tournaments played · 0 matches played"}</em>
            </div>

            <button className="primary-action tap-card" type="submit" disabled={loading}>{loading ? "Saving..." : "Continue"}</button>
            {message && <p className="form-status">{message}</p>}
          </form>
        </section>
        {sizeGuideOpen && <SizeGuideModal selectedSize={shirtSize} onSelect={setShirtSize} onClose={() => setSizeGuideOpen(false)} />}
      </div>
    </AppFrame>
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
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Shirt size guide" onClick={onClose}>
      <div className="size-guide-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="eyebrow">Size Guide</span>
            <strong>Select shirt size</strong>
          </div>
          <button type="button" onClick={onClose} aria-label="Close size guide">×</button>
        </div>

        <div className="size-guide-image" role="img" aria-label="MRSA shirt and short size chart" />

        <div className="size-picker" aria-label="Select shirt size">
          {sizes.map((size) => (
            <button className={selectedSize === size ? "active" : ""} type="button" key={size} onClick={() => onSelect(size)}>
              {size}
            </button>
          ))}
        </div>

        <button className="primary-action tap-card" type="button" onClick={onClose}>Use {selectedSize}</button>
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
    jamaat_city: string;
    self_assessment: string;
    jersey_size: string;
    tennis_video_url: string;
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
    tier: 4,
    rating: 1.5,
    tournaments_played: 0,
    matches_played: 0,
    claim_status: "claimed",
    claimed_at: new Date().toISOString()
  });

  return error;
}

export function HomeScreen() {
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);
  const [upcomingTournament, setUpcomingTournament] = useState<Tournament | null>(null);
  const [profileBadge, setProfileBadge] = useState<ProfileBadge>({ name: "Profile", initials: "P" });
  const [hasRegisteredTournament, setHasRegisteredTournament] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const loadDashboard = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data: { user } } = await supabase.auth.getUser();
      const [{ data: rankingData }, { data: tournamentData }, { data: profileData }] = await Promise.all([
        supabase
          .from("rankings")
          .select("rank, mrsa_rating, players(full_name, jamaat_city)")
          .eq("ranking_scope", "overall")
          .order("rank")
          .limit(5),
        supabase
          .from("tournaments")
          .select("id, name, season_year, status, venue_name, venue_address, venue_maps_url, starts_on, ends_on, registration_closes_at, registration_fee_cents, max_players")
          .gte("starts_on", today)
          .in("status", ["registration_open", "live"])
          .order("starts_on")
          .limit(1)
          .maybeSingle(),
        user
          ? supabase
              .from("players")
              .select("id, full_name, profile_photo_url")
              .eq("auth_user_id", user.id)
              .maybeSingle()
          : Promise.resolve({ data: null })
      ]);

      setTopPlayers((rankingData || []).map((row) => {
        const player = Array.isArray(row.players) ? row.players[0] : row.players;
        return {
          rank: String(row.rank).padStart(2, "0"),
          name: getCardName(player?.full_name || "Player"),
          rating: formatRating(row.mrsa_rating),
          form: player?.jamaat_city || "City not added"
        };
      }));
      setUpcomingTournament(tournamentData ? mapTournament(tournamentData) : null);
      setHasRegisteredTournament(false);
      if (profileData) {
        setProfileBadge({
          name: profileData.full_name || "Profile",
          initials: getInitials(profileData.full_name || "Profile"),
          photoUrl: profileData.profile_photo_url || undefined
        });
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
      }
      setLoading(false);
    };

    loadDashboard();

    const channel = supabase
      .channel("dashboard-live-data")
      .on("postgres_changes", { event: "*", schema: "public", table: "rankings" }, loadDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournaments" }, loadDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournament_registrations" }, loadDashboard)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AppFrame active="home">
      <div className="screen home-screen">
        <header className="hero-header">
          <div className="brand-row">
            <span className="brand">MRSA</span>
            <Link
              className="profile-pill home-profile-pill tap-card"
              href="/profile"
              aria-label={`${profileBadge.name} profile`}
              style={profileBadge.photoUrl ? { backgroundImage: `url(${profileBadge.photoUrl})` } : undefined}
            >
              {!profileBadge.photoUrl && profileBadge.initials}
            </Link>
          </div>
          <p className="season">2026 Season</p>
          <h1>MRSA</h1>
          <Link className="live-pill tap-card" href="/tournaments">
            <span className="blink-dot" />
            {upcomingTournament ? hasRegisteredTournament ? "you are registered" : "register now" : "no upcoming tournament"}
          </Link>
        </header>

        <section className="content-panel">
          <div className="section-title">
            <h2>Upcoming Tournament</h2>
            <Link href="/tournaments">View tournaments →</Link>
          </div>

          {upcomingTournament ? (
            <>
              <Link className="tournament-card featured-tournament tap-card" href="/tournaments">
                <span>{formatTournamentDates(upcomingTournament)} · {upcomingTournament.venueName || "Venue TBD"}</span>
                <strong>{upcomingTournament.name}</strong>
                <em>Registration fee {formatCurrency(upcomingTournament.registrationFeeCents)} · closes {formatRegistrationClose(upcomingTournament.registrationClosesAt)}.</em>
                <b>{hasRegisteredTournament ? "You're Registered" : "Register Now"}</b>
              </Link>
              <RegistrationCountdown closesAt={upcomingTournament.registrationClosesAt} />
            </>
          ) : (
            <div className="empty-card">{loading ? "Loading tournaments..." : "No upcoming tournament right now."}</div>
          )}

        <div className="section-title compact">
          <h2>Top Performers</h2>
          <Link href="/players">All players →</Link>
        </div>
        <div className="rating-list" aria-label="Top player ratings leaderboard">
          {topPlayers.map((player) => (
            <Link className="rating-card tap-card" href="/profile" key={player.name}>
              <span className="rating-rank">{player.rank}</span>
              <span className="rating-name">{player.name}</span>
              <strong>{player.rating}</strong>
              <em>{player.form}</em>
            </Link>
          ))}
          {!topPlayers.length && <div className="empty-card">{loading ? "Loading top performers..." : "No rankings found."}</div>}
        </div>
        <div className="section-title compact about-title">
          <h2>What is MRSA?</h2>
          <Link href="/about">About us →</Link>
        </div>
      </section>
      </div>
    </AppFrame>
  );
}

export function DrawScreen() {
  const router = useRouter();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registeredPlayers, setRegisteredPlayers] = useState<RegisteredPlayer[]>([]);
  const [pastTournaments, setPastTournaments] = useState<PastTournamentSummary[]>([]);
  const [registered, setRegistered] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTournament = async () => {
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
      .in("status", ["registration_open", "live"])
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

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: myPlayer } = await supabase
        .from("players")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();
      const paidRegistration = Boolean(myPlayer && registrations?.some((row) => row.player_id === myPlayer.id));
      setRegistered(paidRegistration);
      setPaymentState(paidRegistration ? "paid" : "idle");

      if (myPlayer && !paidRegistration) {
        const { data: latestPayment } = await supabase
          .from("payment_ledger")
          .select("status")
          .eq("tournament_id", mappedTournament.id)
          .eq("player_id", myPlayer.id)
          .eq("entry_type", "charge")
          .order("occurred_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestPayment?.status === "pending" || latestPayment?.status === "failed") {
          setPaymentState(latestPayment.status);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const supabase = getSupabaseClient();
    const paymentResult = new URLSearchParams(window.location.search).get("payment");
    if (paymentResult === "success") {
      setMessage("Payment received. Registration will appear once Stripe confirms it.");
    }
    if (paymentResult === "retry") {
      setPaymentState("pending");
      setMessage("Payment was not completed. You can retry registration.");
    }
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
  }, []);

  const registerForTournament = async () => {
    const supabase = getSupabaseClient();
    if (!supabase || !tournament) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/");
      return;
    }

    const { data: player } = await supabase
      .from("players")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (!player) {
      router.push("/profile/new");
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

  return (
    <AppFrame active="tournament">
      <div className="screen tournament-screen">
        <header className="page-head tournament-hero">
          <span className="eyebrow">Live Tournament</span>
          <h1 className="tournament-title">{tournament ? tournament.name : "No Live"}<br />Tournament</h1>
          <p>{tournament ? `${formatTournamentDates(tournament)} at ${tournament.venueName || "venue TBD"}.` : "No live tournament is open right now."}</p>
          {tournament && <button className={registered ? "primary-action confirmed tournament-register tap-card" : "primary-action tournament-register tap-card"} type="button" onClick={registerForTournament} disabled={paying || registered}>
            {getRegistrationButtonLabel({ registered, paying, paymentState })}
          </button>}
          {tournament && <div className="live-pill draw-cta">
            <span className="blink-dot" />
            registration live
          </div>}
        </header>

        <section className="light-section tournament-section">
          {tournament ? (
            <>
              <div className="tournament-detail-card">
                <span>Venue</span>
                <strong>{tournament.venueName || "Venue TBD"}</strong>
                <a href={tournament.venueMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tournament.venueAddress || tournament.venueName || "")}`} target="_blank" rel="noreferrer">Open venue address in Maps →</a>
              </div>

              <div className="profile-metrics tournament-metrics">
                <article><span>Tournament Days</span><strong>{formatTournamentDates(tournament)}</strong></article>
                <article><span>Registration Ends</span><strong>{formatRegistrationClose(tournament.registrationClosesAt)}</strong></article>
                <article><span>Registration Fee</span><strong>{formatCurrency(tournament.registrationFeeCents)}</strong></article>
                <article><span>Spots Left</span><strong>{tournament.maxPlayers ? Math.max(tournament.maxPlayers - registeredPlayers.length, 0) : "Open"}</strong></article>
                <article><span>Players</span><strong>{registeredPlayers.length}</strong></article>
              </div>
              <RegistrationCountdown closesAt={tournament.registrationClosesAt} />
            </>
          ) : (
            <div className="empty-card">{loading ? "Loading tournament..." : "No live tournament found."}</div>
          )}

          <div className="section-title compact">
            <h2>Registered Players</h2>
            <span>{registeredPlayers.length} players</span>
          </div>
          <div className="registered-list">
            {registeredPlayers.map((player) => (
              <article className="registered-player" key={player.name}>
                <span>{getInitials(player.name)}</span>
                <div>
                  <strong>{player.name}</strong>
                  <em>{player.city} · Rating {player.rating}</em>
                </div>
              </article>
            ))}
            {!registeredPlayers.length && <div className="empty-card">No players registered yet.</div>}
          </div>

          <div className="section-title compact">
            <h2>Past Tournaments</h2>
            <span>{pastTournaments.length} seasons</span>
          </div>
          <div className="past-tournament-list">
            {pastTournaments.map((pastTournament) => (
              <article className="past-tournament-card" key={pastTournament.seasonYear}>
                <span>{pastTournament.seasonYear} Season</span>
                <strong>MRSA {pastTournament.seasonYear}</strong>
                <em>{pastTournament.matches} matches · {pastTournament.singles} singles · {pastTournament.doubles} doubles</em>
              </article>
            ))}
            {!pastTournaments.length && <div className="empty-card">{loading ? "Loading past tournaments..." : "No historical tournament data found."}</div>}
          </div>

          {message && <p className="form-status">{message}</p>}
        </section>
      </div>
    </AppFrame>
  );
}

export function PlayersScreen() {
  const [players, setPlayers] = useState<TopPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlayers = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("rankings")
        .select("rank, mrsa_rating, players(full_name, jamaat_city)")
        .eq("ranking_scope", "overall")
        .order("rank")
        .limit(50);

      setPlayers((data || []).map((row) => {
        const player = Array.isArray(row.players) ? row.players[0] : row.players;
        return {
          rank: String(row.rank).padStart(2, "0"),
          name: player?.full_name || "Player",
          rating: formatRating(row.mrsa_rating),
          form: player?.jamaat_city || "City not added"
        };
      }));
      setLoading(false);
    };

    loadPlayers();
  }, []);

  return (
    <AppFrame active="profile">
      <div className="screen">
        <header className="page-head">
          <span className="eyebrow">Players</span>
          <h1>All<br />Players</h1>
          <p>MRSA rankings with player city and rating.</p>
        </header>
        <section className="light-section">
          <div className="rating-list" aria-label="All ranked players">
            {players.map((player) => (
              <Link className="rating-card tap-card" href="/profile" key={`${player.rank}-${player.name}`}>
                <span className="rating-rank">{player.rank}</span>
                <span className="rating-name">{player.name}</span>
                <strong>{player.rating}</strong>
                <em>{player.form}</em>
              </Link>
            ))}
            {!players.length && <div className="empty-card">{loading ? "Loading players..." : "No ranked players found."}</div>}
          </div>
        </section>
      </div>
    </AppFrame>
  );
}

export function AboutScreen() {
  return (
    <AppFrame active="home">
      <div className="screen">
        <header className="page-head">
          <span className="eyebrow">About MRSA</span>
          <h1>What is<br />MRSA?</h1>
          <p>Mumineen Racquet Sports Association brings players together through organized matches, rankings, and tournaments.</p>
        </header>
        <section className="light-section about-section">
          <article className="tournament-card">
            <span>Purpose</span>
            <strong>Build a competitive but welcoming tennis community.</strong>
            <em>MRSA helps players find events, track rankings, register for tournaments, and grow through match play.</em>
          </article>
        </section>
      </div>
    </AppFrame>
  );
}

export function PlayerScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const updateProfile = (field: keyof ProfileData, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("players")
        .select("id, full_name, phone, profile_photo_url, jamaat_city, self_assessment, dominant_hand, jersey_size, tennis_video_url, tier, rating, tournaments_played, matches_played")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (data) {
        setProfile(mapProfile(data));
      }
    };

    loadProfile();
  }, []);

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
        dominant_hand: profile.dominantHand,
        self_assessment: profile.selfEvaluation,
        jamaat_city: profile.jamaatCity,
        jersey_size: profile.jerseySize,
        tennis_video_url: profile.tennisVideo
      })
      .eq("id", profile.id);
    setSaving(false);

    if (error) {
      setMessage(getFriendlyError(error));
      return;
    }

    setIsEditing(false);
    setMessage("Profile saved.");
  };

  const updateProfilePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const supabase = getSupabaseClient();
    if (!file || !supabase || !profile.id) return;

    const { data: { user } } = await supabase.auth.getUser();
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
    setMessage("Photo updated.");
  };

  return (
    <AppFrame active="profile">
      <div className="screen profile-screen">
        <header className="hero-header profile-hero">
          <div className="brand-row">
            <span className="brand">MRSA</span>
            <div className="profile-photo" style={profile.profilePhotoUrl ? { backgroundImage: `url(${profile.profilePhotoUrl})` } : undefined}>
              {!profile.profilePhotoUrl && getInitials(profile.fullName)}
            </div>
          </div>
          <p className="season">Player Profile</p>
          <h1 className="profile-name">{getCardName(profile.fullName)}</h1>
          <div className="profile-hero-pills">
            <span>Tier {profile.tier}</span>
            <span>Rating {profile.rating}</span>
          </div>
        </header>

        <section className="content-panel profile-section">
          <div className="chip-row profile-chip-row" aria-label="Profile summary">
            <span className="chip active">{profile.selfEvaluation}</span>
            <span className="chip">{profile.jamaatCity}</span>
            <span className="chip">{profile.dominantHand} Hand</span>
          </div>

          <div className="section-title">
            <h2>Profile Details</h2>
            <button className="section-link-button" type="button" onClick={() => setIsEditing(true)}>
              Edit →
            </button>
          </div>

          <div className="profile-metrics" aria-label="Player performance stats">
            <article><span>Tier</span><strong>{profile.tier}</strong></article>
            <article><span>Rating</span><strong>{profile.rating}</strong></article>
            <article><span>Tournaments Played</span><strong>{profile.tournamentsPlayed}</strong></article>
            <article><span>Matches Played</span><strong>{profile.matchesPlayed}</strong></article>
          </div>

          <div className="profile-info-list">
            <article className="profile-field">
              <span>Profile Photo</span>
              <input className="profile-input file-profile-input" type="file" accept="image/*" onChange={updateProfilePhoto} />
              <em>Large photos are compressed before upload.</em>
            </article>
            <ProfileField label="Full Name" value={profile.fullName} editing={isEditing} onChange={(value) => updateProfile("fullName", value)} />
            <ProfileField label="Age" value={profile.age} editing={isEditing} onChange={(value) => updateProfile("age", value)} />
            <ProfileField label="Dominant Hand" value={profile.dominantHand} editing={isEditing} onChange={(value) => updateProfile("dominantHand", value)} />
            <ProfileField label="Self Evaluation" value={profile.selfEvaluation} editing={isEditing} onChange={(value) => updateProfile("selfEvaluation", value)} />
            <ProfileField label="Jamaat / City" value={profile.jamaatCity} editing={isEditing} onChange={(value) => updateProfile("jamaatCity", value)} />
            <ProfileField
              label="Jersey Size"
              value={profile.jerseySize}
              editing={isEditing}
              onChange={(value) => updateProfile("jerseySize", value)}
              helper={<a href="https://www.nike.com/size-fit/mens-tops-alpha" target="_blank" rel="noreferrer">Size guide</a>}
            />
            <ProfileField
              label="Tennis Playing Video"
              value={profile.tennisVideo}
              editing={isEditing}
              onChange={(value) => updateProfile("tennisVideo", value)}
              helper={<a href="https://drive.google.com/" target="_blank" rel="noreferrer">Open video</a>}
            />
          </div>

          {isEditing && (
            <button className="primary-action profile-save tap-card" type="button" onClick={saveProfile} disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
          )}
          {message && <p className="form-status">{message}</p>}
        </section>
      </div>
    </AppFrame>
  );
}

function mapProfile(row: DbProfileRow): ProfileData {
  return {
    id: row.id,
    profilePhotoUrl: row.profile_photo_url || "",
    fullName: row.full_name || "Player",
    age: initialProfile.age,
    dominantHand: row.dominant_hand || initialProfile.dominantHand,
    selfEvaluation: normalizeSkillLevel(row.self_assessment) || initialProfile.selfEvaluation,
    jamaatCity: row.jamaat_city || initialProfile.jamaatCity,
    tier: String(row.tier || 1),
    rating: formatRating(row.rating),
    tournamentsPlayed: String(row.tournaments_played || 0),
    matchesPlayed: String(row.matches_played || 0),
    jerseySize: row.jersey_size || initialProfile.jerseySize,
    tennisVideo: row.tennis_video_url || initialProfile.tennisVideo
  };
}

function mapTournament(row: DbTournamentRow): Tournament {
  return {
    id: row.id,
    name: row.name,
    seasonYear: row.season_year,
    status: row.status,
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

function formatRating(value: unknown) {
  if (value === null || value === undefined || value === "") return "Pending";
  const rating = Number(value);
  return Number.isFinite(rating) ? rating.toFixed(3) : String(value);
}

function normalizeSkillLevel(value?: string | null) {
  if (!value) return "";
  const skillLevel = skillLevels.find((level) => value === level.value || value === level.label || value.startsWith(level.value));
  return skillLevel?.value || value;
}

function getSkillLevelLabel(value?: string | null) {
  const normalizedValue = normalizeSkillLevel(value);
  return skillLevels.find((level) => level.value === normalizedValue)?.label || "";
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
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
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function getRegistrationButtonLabel({
  registered,
  paying,
  paymentState
}: {
  registered: boolean;
  paying: boolean;
  paymentState: PaymentState;
}) {
  if (registered || paymentState === "paid") return "Registered";
  if (paying) return "Opening payment...";
  if (paymentState === "failed") return "Retry Payment";
  if (paymentState === "pending") return "Retry Payment";
  return "Register Now";
}

function RegistrationCountdown({ closesAt }: { closesAt: string | null }) {
  const [remaining, setRemaining] = useState(() => getTimeRemaining(closesAt));

  useEffect(() => {
    setRemaining(getTimeRemaining(closesAt));
    const timer = window.setInterval(() => {
      setRemaining(getTimeRemaining(closesAt));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [closesAt]);

  if (!closesAt) return null;

  const units = [
    { label: "days", value: remaining.days },
    { label: "hours", value: remaining.hours },
    { label: "mins", value: remaining.minutes },
    { label: "secs", value: remaining.seconds }
  ];

  return (
    <article className="countdown-card" aria-label="Registration countdown">
      <span>{remaining.expired ? "Registration closed" : "Registration closes in"}</span>
      <div className="flip-clock">
        {units.map((unit) => (
          <strong key={unit.label} className="flip-unit">
            <b>{String(unit.value).padStart(2, "0")}</b>
            <em>{unit.label}</em>
          </strong>
        ))}
      </div>
    </article>
  );
}

function getTimeRemaining(value: string | null) {
  const targetTime = value ? new Date(value).getTime() : Date.now();
  const distance = Math.max(0, targetTime - Date.now());

  return {
    expired: Boolean(value) && distance <= 0,
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
    seconds: Math.floor((distance % 60000) / 1000)
  };
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

function getCardName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) {
    return parts[0] || "Player";
  }

  return `${parts[0][0]}.${parts[parts.length - 1]}`;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "P") + (parts[parts.length - 1]?.[0] || "");
}

function ProfileField({
  label,
  value,
  helper,
  editing = false,
  onChange
}: {
  label: string;
  value: string;
  helper?: ReactNode;
  editing?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <article className="profile-field">
      <span>{label}</span>
      {editing ? (
        <input className="profile-input" value={value} onChange={(event) => onChange?.(event.target.value)} aria-label={label} />
      ) : (
        <strong>{value}</strong>
      )}
      {helper && <em>{helper}</em>}
    </article>
  );
}

export function SavedScreen() {
  return (
    <AppFrame active="logout">
      <div className="screen">
        <header className="page-head">
          <span className="eyebrow">Saved</span>
          <h1>Tracked matches</h1>
          <p>Your saved courts, players, and match reminders.</p>
        </header>
        <section className="light-section saved-list">
          <Link className="saved-card tap-card" href="/tournaments">
            <LogOut size={18} />
            <span>
              <strong>Alcaraz vs Zverev</strong>
              <em>Court Philippe-Chatrier · Live now</em>
            </span>
          </Link>
          <Link className="saved-card tap-card" href="/tournaments">
            <Trophy size={18} />
            <span>
              <strong>Final bracket</strong>
              <em>Men&apos;s Singles · Updated today</em>
            </span>
          </Link>
        </section>
      </div>
    </AppFrame>
  );
}

function BottomNav({ active }: { active: Tab }) {
  const tabs = [
    { id: "home" as const, href: "/dashboard", label: "Home", icon: Home },
    { id: "tournament" as const, href: "/tournaments", label: "Tournament", icon: Trophy },
    { id: "profile" as const, href: "/profile", label: "Profile", icon: UsersRound },
    { id: "logout" as const, href: "/", label: "Logout", icon: LogOut }
  ];

  return (
    <nav className="bottom-nav" aria-label="Primary mobile navigation">
      {tabs.map(({ id, href, label, icon: Icon }) => (
        <Link className={active === id ? "nav-tab active" : "nav-tab"} href={href} key={id}>
          <Icon size={20} strokeWidth={active === id ? 2.4 : 1.7} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
