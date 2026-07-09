import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../../lib/supabase-server";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

async function markCheckoutPaid(
  admin: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  session: Stripe.Checkout.Session
) {
  const playerId = session.metadata?.player_id;
  const tournamentId = session.metadata?.tournament_id;

  if (!playerId || !tournamentId) return;

  const { data: player } = await admin
    .from("players")
    .select("full_name, jersey_name")
    .eq("id", playerId)
    .maybeSingle();

  const { data: registration } = await admin.from("tournament_registrations").upsert({
    tournament_id: tournamentId,
    player_id: playerId,
    status: "registered",
    payment_status: "paid",
    shirt_name: player?.jersey_name || null
  }, { onConflict: "tournament_id,player_id" }).select("id").single();

  await admin
    .from("payment_ledger")
    .update({
      status: "paid",
      registration_id: registration?.id,
      stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
      stripe_failure_code: null,
      stripe_failure_message: null,
      occurred_at: new Date().toISOString()
    })
    .eq("stripe_checkout_session_id", session.id);
}

async function markCheckoutFailed(
  admin: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  session: Stripe.Checkout.Session,
  fallbackMessage: string
) {
  const paymentIntent = typeof session.payment_intent === "string" ? null : session.payment_intent;

  await admin
    .from("payment_ledger")
    .update({
      status: "failed",
      stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
      stripe_failure_code: paymentIntent?.last_payment_error?.code || session.status || null,
      stripe_failure_message: paymentIntent?.last_payment_error?.message || fallbackMessage,
      occurred_at: new Date().toISOString()
    })
    .eq("stripe_checkout_session_id", session.id);
}

export async function POST(request: NextRequest) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid webhook signature." }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Supabase service role key is missing." }, { status: 500 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await markCheckoutPaid(admin, session);
  }

  if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await markCheckoutFailed(admin, session, "Payment was not completed.");
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const playerId = paymentIntent.metadata?.player_id;
    const tournamentId = paymentIntent.metadata?.tournament_id;

    if (playerId && tournamentId) {
      await admin
        .from("payment_ledger")
        .update({
          status: "failed",
          stripe_payment_intent_id: paymentIntent.id,
          stripe_failure_code: paymentIntent.last_payment_error?.code || null,
          stripe_failure_message: paymentIntent.last_payment_error?.message || "Payment failed.",
          occurred_at: new Date().toISOString()
        })
        .eq("player_id", playerId)
        .eq("tournament_id", tournamentId)
        .eq("status", "pending");
    }
  }

  return NextResponse.json({ received: true });
}
