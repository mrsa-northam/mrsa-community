"use client";

import { CheckCircle2, Dices, Gift, LoaderCircle, Sparkles, Trophy, X } from "lucide-react";
import Image from "next/image";
import { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdminFrame } from "../admin-app";
import { getSupabaseClient } from "../../lib/supabase";

type RaffleParticipant = {
  entryId: string;
  name: string;
  photoUrl: string;
  kind: "drafted_player" | "volunteer";
  playerId: string | null;
};

type RaffleResult = {
  id: string;
  tournamentId: string;
  winnerEntryId: string;
  winnerName: string;
  winnerPhotoUrl: string;
  winnerKind: "drafted_player" | "volunteer";
  winnerPlayerId: string | null;
  participantCount: number;
  drawnAt: string;
  winnerIndex: number;
};

type RafflePayload = {
  tournament: { id: string; name: string; season_year: number | null; status: string; starts_on: string | null } | null;
  participants: RaffleParticipant[];
  counts: { drafted: number; volunteers: number; total: number };
  ready: boolean;
  result: RaffleResult | null;
  alreadyDrawn?: boolean;
  error?: string;
};

const wheelColors = ["#0A2540", "#116466", "#E85D3F", "#2E6F95", "#D6A84B", "#6B4E8A", "#16817A", "#C94C73", "#375A7F"];
const revealConfetti = Array.from({ length: 108 }, (_, index) => ({
  color: wheelColors[index % wheelColors.length],
  delay: `${(index % 18) * 28}ms`,
  x: `${((index * 47) % 100) - 50}vw`,
  drift: `${((index * 71) % 120) - 60}vw`,
  rotation: `${360 + ((index * 83) % 720)}deg`,
  duration: `${2500 + ((index * 53) % 1500)}ms`,
  size: `${6 + (index % 5)}px`
}));

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "MR";
}

function RaffleAvatar({ name, photoUrl, className, sizes = "80px" }: { name: string; photoUrl: string; className: string; sizes?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [photoUrl]);
  return (
    <span className={className}>
      {photoUrl && !failed ? <Image src={photoUrl} alt="" fill sizes={sizes} className="object-cover" onError={() => setFailed(true)} /> : initials(name)}
    </span>
  );
}

function getAlignedWheelRotation(currentRotation: number, winnerIndex: number, participantCount: number, fullTurns: number) {
  if (winnerIndex < 0 || participantCount <= 0) return currentRotation;
  const segmentAngle = 360 / participantCount;
  const desiredPosition = ((-(winnerIndex + 0.5) * segmentAngle) % 360 + 360) % 360;
  const currentPosition = ((currentRotation % 360) + 360) % 360;
  const alignmentDelta = (desiredPosition - currentPosition + 360) % 360;
  return currentRotation + fullTurns * 360 + alignmentDelta;
}

export function AdminRaffleScreen() {
  const [payload, setPayload] = useState<RafflePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [pendingResult, setPendingResult] = useState<RaffleResult | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [message, setMessage] = useState("");
  const revealTimerRef = useRef<number | null>(null);

  const requestRaffle = useCallback(async (method: "GET" | "POST") => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) throw new Error("Please sign in again.");
    const response = await fetch("/api/admin/raffle", { method, headers: { Authorization: `Bearer ${token}` } });
    const nextPayload = await response.json() as RafflePayload;
    if (!response.ok) throw new Error(nextPayload.error || "Unable to load the raffle.");
    return nextPayload;
  }, []);

  const loadRaffle = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const nextPayload = await requestRaffle("GET");
      setPayload(nextPayload);
      if (nextPayload.result?.winnerIndex != null && nextPayload.result.winnerIndex >= 0) {
        setRotation((current) => getAlignedWheelRotation(current, nextPayload.result?.winnerIndex ?? -1, nextPayload.participants.length, 0));
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load the raffle.");
    } finally {
      setLoading(false);
    }
  }, [requestRaffle]);

  useEffect(() => {
    void loadRaffle();
    return () => {
      if (revealTimerRef.current) window.clearTimeout(revealTimerRef.current);
    };
  }, [loadRaffle]);

  const finishSpin = useCallback(() => {
    if (!spinning || !pendingResult) return;
    if (revealTimerRef.current) window.clearTimeout(revealTimerRef.current);
    revealTimerRef.current = null;
    setSpinning(false);
    setPendingResult(null);
    setPayload((current) => current ? { ...current, result: pendingResult } : current);
    setShowReveal(true);
  }, [pendingResult, spinning]);

  const spin = async () => {
    if (!payload?.ready || payload.result || spinning) return;
    setMessage("");
    setShowReveal(false);
    setSpinning(true);
    try {
      const nextPayload = await requestRaffle("POST");
      if (!nextPayload.result || nextPayload.result.winnerIndex < 0) throw new Error("The saved winner could not be placed on the wheel.");
      setPayload({ ...nextPayload, result: null });
      setPendingResult(nextPayload.result);
      setRotation((current) => getAlignedWheelRotation(current, nextPayload.result?.winnerIndex ?? -1, nextPayload.participants.length, 9));
    } catch (error) {
      setSpinning(false);
      setPendingResult(null);
      setMessage(error instanceof Error ? error.message : "Unable to draw the raffle winner.");
    }
  };

  useEffect(() => {
    if (!spinning || !pendingResult) return;
    if (revealTimerRef.current) window.clearTimeout(revealTimerRef.current);
    revealTimerRef.current = window.setTimeout(finishSpin, 9200);
    return () => {
      if (revealTimerRef.current) window.clearTimeout(revealTimerRef.current);
    };
  }, [finishSpin, pendingResult, spinning]);

  const participants = useMemo(() => payload?.participants || [], [payload?.participants]);
  const wheelGradient = useMemo(() => {
    if (!participants.length) return "conic-gradient(#d9e2e8 0deg 360deg)";
    const segmentAngle = 360 / participants.length;
    return `conic-gradient(from -90deg, ${participants.map((_, index) => `${wheelColors[index % wheelColors.length]} ${(index * segmentAngle).toFixed(3)}deg ${((index + 1) * segmentAngle).toFixed(3)}deg`).join(", ")})`;
  }, [participants]);

  return (
    <AdminFrame active="raffle">
      <section className="relative grid overflow-hidden rounded-[24px] bg-brand-deep p-5 text-white md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-8 md:p-7">
        <span className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[var(--accent)]/15 blur-3xl" aria-hidden="true" />
        <span className="relative grid gap-3">
          <em className="inline-flex w-max items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold not-italic uppercase tracking-[0.12em] text-[var(--accent)]"><Dices size={14} /> Organizer raffle</em>
          <h1 className="text-[34px] font-semibold leading-none tracking-[-0.045em] text-white sm:text-[46px]">Spin for the raffle winner</h1>
          <p className="max-w-[700px] text-[14px] leading-relaxed text-white/72 sm:text-[15px]">One secure random draw from 32 drafted players and four tournament volunteers. The first result is saved and published to everyone.</p>
        </span>
        <span className="relative mt-5 grid grid-cols-3 gap-2 md:mt-0">
          <RaffleCount label="Drafted" value={payload?.counts.drafted ?? 0} />
          <RaffleCount label="Volunteers" value={payload?.counts.volunteers ?? 0} />
          <RaffleCount label="Total" value={payload?.counts.total ?? 0} highlighted />
        </span>
      </section>

      {message && <section className="rounded-[16px] border border-[var(--error-line)] bg-[var(--error-surface)] p-4 text-[14px] text-[var(--error)]">{message}</section>}

      {loading ? (
        <section className="grid min-h-[520px] place-items-center rounded-[24px] border-hairline border-line bg-white"><span className="inline-flex items-center gap-2 text-[14px] font-semibold text-brand"><LoaderCircle className="animate-spin" size={18} /> Loading the 36-name wheel…</span></section>
      ) : !payload?.tournament ? (
        <section className="rounded-[24px] border-hairline border-line bg-white p-6 text-[15px] text-text-secondary">No current tournament was found for this raffle.</section>
      ) : (
        <section className="grid gap-5 rounded-[24px] border-hairline border-line bg-white p-4 shadow-[0_18px_48px_rgba(var(--brand-deep-rgb),0.08)] sm:p-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-center">
          <div className="grid justify-items-center gap-5">
            <div className="raffle-wheel-stage relative aspect-square w-full max-w-[720px]">
              <span className="raffle-wheel-pointer absolute left-1/2 top-[-4px] z-20 -translate-x-1/2" aria-hidden="true" />
              <div
                className={`${spinning ? "raffle-wheel-is-spinning" : ""} raffle-wheel relative h-full w-full overflow-hidden rounded-full border-[10px] border-white shadow-[0_24px_70px_rgba(var(--brand-deep-rgb),0.22),inset_0_0_0_2px_rgba(255,255,255,0.28)]`}
                style={{ background: wheelGradient, transform: `rotate(${rotation}deg)` }}
                onTransitionEnd={(event) => {
                  if (event.propertyName === "transform") finishSpin();
                }}
              >
                <span className="pointer-events-none absolute inset-[18%] rounded-full border border-white/20 bg-brand-deep/18 shadow-[inset_0_0_45px_rgba(0,0,0,0.15)]" aria-hidden="true" />
                {participants.map((participant, index) => {
                  const segmentAngle = 360 / participants.length;
                  const labelAngle = -90 + (index + 0.5) * segmentAngle;
                  return (
                    <span className="raffle-wheel-label" style={{ "--raffle-label-angle": `${labelAngle}deg` } as CSSProperties} key={participant.entryId}>
                      <strong title={participant.name}>{participant.name}</strong>
                    </span>
                  );
                })}
                <span className="absolute left-1/2 top-1/2 grid h-[20%] w-[20%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[7px] border-white bg-brand-deep text-white shadow-[0_10px_28px_rgba(0,0,0,0.26)]"><Dices className="h-[42%] w-[42%]" /></span>
              </div>
            </div>

            <button className="tap-card inline-flex min-h-14 w-full max-w-[430px] items-center justify-center gap-2 rounded-full bg-brand-primary px-7 text-[17px] font-bold text-white shadow-[0_16px_34px_rgba(var(--brand-primary-rgb),0.25)] transition hover:bg-brand-mid disabled:cursor-not-allowed disabled:opacity-55" type="button" onClick={spin} disabled={!payload.ready || Boolean(payload.result) || spinning}>
              {spinning ? <><LoaderCircle className="animate-spin" size={20} /> Drawing the winner…</> : payload.result ? <><CheckCircle2 size={20} /> Winner selected</> : <><Sparkles size={20} /> Spin the wheel</>}
            </button>
          </div>

          <aside className="grid content-start gap-4">
            <section className="grid gap-3 rounded-[20px] border-hairline border-line bg-[var(--surface)] p-4">
              <span className="grid gap-1"><em className="text-[10px] font-semibold not-italic uppercase tracking-[0.1em] text-text-muted">Current tournament</em><strong className="text-[20px] font-semibold leading-tight text-text-primary">{payload.tournament.name}</strong></span>
              <span className={`${payload.ready ? "border-[var(--accent-line)] bg-accent-tint text-[var(--accent-ink)]" : "border-[var(--error-line)] bg-[var(--error-surface)] text-[var(--error)]"} rounded-[14px] border p-3 text-[13px] font-medium leading-relaxed`}>{payload.ready ? "All 36 names are loaded. The wheel is ready for its one saved draw." : `Not ready: ${payload.counts.drafted}/32 drafted players and ${payload.counts.volunteers}/4 volunteers found.`}</span>
            </section>
            {payload.result ? <RaffleSavedWinner result={payload.result} onCelebrate={() => setShowReveal(true)} /> : (
              <section className="grid gap-2 rounded-[20px] border border-dashed border-[var(--hairline-strong)] p-4 text-center"><Gift className="mx-auto text-brand" size={28} /><strong className="text-[17px] font-semibold text-text-primary">Waiting for the draw</strong><p className="text-[13px] leading-relaxed text-text-secondary">After the wheel stops, the winner will appear here and on the public home page.</p></section>
            )}
          </aside>
        </section>
      )}

      {showReveal && payload?.result && <RaffleWinnerReveal result={payload.result} onClose={() => setShowReveal(false)} />}
    </AdminFrame>
  );
}

function RaffleCount({ label, value, highlighted = false }: { label: string; value: number; highlighted?: boolean }) {
  return <span className={`${highlighted ? "bg-[var(--accent)] text-brand-deep" : "bg-white/10 text-white"} grid min-w-[82px] justify-items-center rounded-[14px] px-3 py-2.5`}><strong className="text-[22px] font-bold leading-none tabular-nums">{value}</strong><em className={`${highlighted ? "text-brand-deep/70" : "text-white/60"} mt-1 text-[8px] font-semibold not-italic uppercase tracking-[0.09em]`}>{label}</em></span>;
}

function RaffleSavedWinner({ result, onCelebrate }: { result: RaffleResult; onCelebrate: () => void }) {
  return (
    <section className="grid justify-items-center gap-3 rounded-[20px] border border-[var(--accent-line)] bg-accent-tint p-5 text-center">
      <RaffleAvatar className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-full border-4 border-white bg-brand-deep text-[20px] font-bold text-white shadow-[0_12px_26px_rgba(var(--brand-deep-rgb),0.18)]" name={result.winnerName} photoUrl={result.winnerPhotoUrl} />
      <span className="grid gap-1"><em className="text-[10px] font-semibold not-italic uppercase tracking-[0.11em] text-[var(--accent-ink)]">Raffle winner</em><strong className="text-[24px] font-bold leading-tight tracking-[-0.03em] text-text-primary">{result.winnerName}</strong><span className="text-[11px] text-text-secondary">{result.winnerKind === "volunteer" ? "Tournament volunteer" : "Drafted player"}</span></span>
      <button className="tap-card inline-flex min-h-10 items-center gap-2 rounded-full bg-brand-deep px-4 text-[12px] font-semibold text-white" type="button" onClick={onCelebrate}><Sparkles size={14} /> Celebrate again</button>
    </section>
  );
}

function RaffleWinnerReveal({ result, onClose }: { result: RaffleResult; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-brand-deep/94 p-5 backdrop-blur-xl" role="dialog" aria-modal="true" aria-labelledby="raffle-winner-name">
      {revealConfetti.map((piece, index) => <span className="raffle-reveal-confetti" style={{ "--raffle-confetti-color": piece.color, "--raffle-confetti-delay": piece.delay, "--raffle-confetti-x": piece.x, "--raffle-confetti-drift": piece.drift, "--raffle-confetti-rotation": piece.rotation, "--raffle-confetti-duration": piece.duration, "--raffle-confetti-size": piece.size } as CSSProperties} key={index} />)}
      <button className="tap-card absolute right-5 top-5 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white" type="button" onClick={onClose} aria-label="Close raffle winner celebration"><X size={20} /></button>
      <section className="relative z-10 grid max-w-[900px] justify-items-center gap-5 text-center text-white">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/35 bg-[var(--accent)]/12 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--accent)]"><Trophy size={17} fill="currentColor" /> Raffle winner</span>
        <RaffleAvatar className="relative grid h-[clamp(120px,18vw,220px)] w-[clamp(120px,18vw,220px)] place-items-center overflow-hidden rounded-full border-[8px] border-white bg-white text-[clamp(30px,5vw,60px)] font-bold text-brand shadow-[0_30px_80px_rgba(0,0,0,0.35)]" name={result.winnerName} photoUrl={result.winnerPhotoUrl} sizes="220px" />
        <span className="grid gap-2"><em className="text-[clamp(14px,1.7vw,24px)] font-semibold not-italic uppercase tracking-[0.16em] text-white/70">Congratulations</em><h2 className="text-[clamp(46px,8vw,118px)] font-bold leading-[0.9] tracking-[-0.065em] text-white" id="raffle-winner-name">{result.winnerName}</h2><p className="text-[clamp(15px,1.5vw,22px)] text-[var(--accent)]">You are the tournament raffle winner!</p></span>
      </section>
    </div>
  );
}
