import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient, getSupabaseServerClient } from "../../../lib/supabase-server";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function GET(request: NextRequest) {
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
    return NextResponse.json({ error: "Please sign in before checking payment status." }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Your session expired. Please sign in again." }, { status: 401 });
  }

  const sessionId = request.nextUrl.searchParams.get("session_id");
  const outcome = request.nextUrl.searchParams.get("payment");
  if (!sessionId) {
    return NextResponse.json({ error: "Checkout session id is required." }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent"]
  });
  const playerId = session.metadata?.player_id;
  const tournamentId = session.metadata?.tournament_id;

  if (!playerId || !tournamentId) {
    return NextResponse.json({ error: "Checkout session metadata is missing." }, { status: 400 });
  }

  const { data: player } = await admin
    .from("players")
    .select("id, auth_user_id")
    .eq("id", playerId)
    .maybeSingle();

  if (!player || player.auth_user_id !== userData.user.id) {
    return NextResponse.json({ error: "This checkout session does not belong to your account." }, { status: 403 });
  }

  const paymentIntent = typeof session.payment_intent === "string" ? null : session.payment_intent;
  const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

  if (session.payment_status === "paid") {
    const { data: registration } = await admin.from("tournament_registrations").upsert({
      tournament_id: tournamentId,
      player_id: playerId,
      status: "registered",
      payment_status: "paid"
    }, { onConflict: "tournament_id,player_id" }).select("id").single();

    await admin
      .from("payment_ledger")
      .update({
        status: "paid",
        registration_id: registration?.id,
        stripe_payment_intent_id: paymentIntentId,
        stripe_failure_code: null,
        stripe_failure_message: null,
        occurred_at: new Date().toISOString()
      })
      .eq("stripe_checkout_session_id", session.id);

    return NextResponse.json({ status: "paid", registered: true });
  }

  if (outcome === "retry" || session.status === "expired" || session.status === "complete") {
    await admin
      .from("payment_ledger")
      .update({
        status: "failed",
        stripe_payment_intent_id: paymentIntentId,
        stripe_failure_code: paymentIntent?.last_payment_error?.code || session.status || "checkout_canceled",
        stripe_failure_message: paymentIntent?.last_payment_error?.message || "Checkout was canceled before payment was completed.",
        occurred_at: new Date().toISOString()
      })
      .eq("stripe_checkout_session_id", session.id);

    return NextResponse.json({
      status: "failed",
      registered: false,
      error: paymentIntent?.last_payment_error?.message || "Checkout was canceled before payment was completed. You can retry registration."
    });
  }

  await admin
    .from("payment_ledger")
    .update({
      status: "pending",
      stripe_payment_intent_id: paymentIntentId,
      stripe_failure_code: paymentIntent?.last_payment_error?.code || null,
      stripe_failure_message: paymentIntent?.last_payment_error?.message || null
    })
    .eq("stripe_checkout_session_id", session.id);

  return NextResponse.json({
    status: "pending",
    registered: false,
    error: paymentIntent?.last_payment_error?.message || null
  });
}
