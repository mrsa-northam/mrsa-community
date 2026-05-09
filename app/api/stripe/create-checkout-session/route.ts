import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient, getSupabaseServerClient } from "../../../lib/supabase-server";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured. Add STRIPE_SECRET_KEY." }, { status: 500 });
  }

  const supabase = getSupabaseServerClient();
  const admin = getSupabaseAdminClient();
  if (!supabase || !admin) {
    return NextResponse.json({ error: "Supabase server keys are not configured." }, { status: 500 });
  }

  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Please sign in before registering." }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Your session expired. Please sign in again." }, { status: 401 });
  }

  const { tournamentId } = await request.json();
  if (!tournamentId) {
    return NextResponse.json({ error: "Tournament id is required." }, { status: 400 });
  }

  const [{ data: player }, { data: tournament }] = await Promise.all([
    admin
      .from("players")
      .select("id, full_name, phone, email")
      .eq("auth_user_id", userData.user.id)
      .maybeSingle(),
    admin
      .from("tournaments")
      .select("id, name, registration_fee_cents, currency, status, starts_on, ends_on, registration_closes_at")
      .eq("id", tournamentId)
      .maybeSingle()
  ]);

  if (!player) {
    return NextResponse.json({ error: "Complete or claim your player profile before registering." }, { status: 400 });
  }

  const tournamentStatus = tournament ? getTournamentLifecycleStatus(tournament) : null;
  if (!tournament || tournamentStatus !== "registration_open") {
    return NextResponse.json({ error: "This tournament is not open for registration." }, { status: 400 });
  }
  if (tournament.status !== tournamentStatus) {
    await admin.from("tournaments").update({ status: tournamentStatus }).eq("id", tournament.id);
  }

  if (userData.user.email && !player.email) {
    await admin.from("players").update({ email: userData.user.email }).eq("id", player.id);
  }

  const { data: existingRegistration } = await admin
    .from("tournament_registrations")
    .select("id, payment_status")
    .eq("tournament_id", tournament.id)
    .eq("player_id", player.id)
    .maybeSingle();

  if (existingRegistration && ["paid", "waived"].includes(existingRegistration.payment_status)) {
    return NextResponse.json({ registered: true });
  }

  const amountCents = tournament.registration_fee_cents || 0;
  if (amountCents <= 0) {
    await admin.from("tournament_registrations").upsert({
      tournament_id: tournament.id,
      player_id: player.id,
      status: "registered",
      payment_status: "waived"
    }, { onConflict: "tournament_id,player_id" });
    return NextResponse.json({ registered: true });
  }

  const origin = request.headers.get("origin") || new URL(request.url).origin;
  const metadata = {
    tournament_id: tournament.id,
    player_id: player.id
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: userData.user.email || undefined,
    success_url: `${origin}/tournaments?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/tournaments?payment=retry&session_id={CHECKOUT_SESSION_ID}`,
    line_items: [
      {
        price_data: {
          currency: (tournament.currency || "USD").toLowerCase(),
          product_data: {
            name: `${tournament.name} registration`
          },
          unit_amount: amountCents
        },
        quantity: 1
      }
    ],
    metadata,
    payment_intent_data: {
      metadata
    }
  });

  const { error: ledgerError } = await admin.from("payment_ledger").insert({
    player_id: player.id,
    tournament_id: tournament.id,
    entry_type: "charge",
    status: "pending",
    amount_cents: amountCents,
    currency: tournament.currency || "USD",
    reference: session.id,
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
    stripe_failure_code: null,
    stripe_failure_message: null,
    checkout_email: userData.user.email || player.email || null,
    checkout_phone: player.phone || null,
    notes: `${tournament.name} registration checkout.`
  });

  if (ledgerError) {
    return NextResponse.json({ error: `Checkout was created, but MRSA could not record the registration interest: ${ledgerError.message}` }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}

function getTournamentLifecycleStatus(tournament: {
  status: string;
  starts_on: string | null;
  ends_on: string | null;
  registration_closes_at: string | null;
}) {
  if (tournament.status === "cancelled") return "cancelled";
  const now = new Date();
  const registrationClose = tournament.registration_closes_at ? new Date(tournament.registration_closes_at) : null;
  const start = tournament.starts_on ? new Date(`${tournament.starts_on}T00:00:00`) : null;
  const end = tournament.ends_on ? new Date(`${tournament.ends_on}T23:59:59.999`) : null;

  if (end && now > end) return "completed";
  if (start && now >= start) return "live";
  if (registrationClose && now > registrationClose) return "registration_closed";
  return "registration_open";
}
