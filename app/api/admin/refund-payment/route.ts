import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient, getSupabaseServerClient } from "../../../lib/supabase-server";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

type RefundRequestBody = {
  paymentId?: string;
  removeRegistration?: boolean;
};

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured. Add STRIPE_SECRET_KEY." }, { status: 500 });
  }

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "Missing authorization token." }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  const admin = getSupabaseAdminClient();
  if (!supabase || !admin) {
    return NextResponse.json({ error: "Supabase server configuration is missing." }, { status: 500 });
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Invalid session." }, { status: 401 });
  }

  const [{ data: adminRole }, { data: adminPlayer }] = await Promise.all([
    admin
      .from("member_roles")
      .select("auth_user_id")
      .eq("auth_user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle(),
    admin
      .from("players")
      .select("id, is_admin")
      .eq("auth_user_id", userData.user.id)
      .maybeSingle()
  ]);

  if (!adminRole && !adminPlayer?.is_admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = await request.json().catch(() => ({} as RefundRequestBody));
  const paymentId = typeof body.paymentId === "string" ? body.paymentId : "";
  const removeRegistration = Boolean(body.removeRegistration);
  if (!paymentId) {
    return NextResponse.json({ error: "Payment id is required." }, { status: 400 });
  }

  const { data: payment, error: paymentError } = await admin
    .from("payment_ledger")
    .select("id, player_id, tournament_id, registration_id, status, amount_cents, currency, notes, stripe_payment_intent_id, stripe_checkout_session_id")
    .eq("id", paymentId)
    .maybeSingle();

  if (paymentError) {
    return NextResponse.json({ error: paymentError.message }, { status: 500 });
  }
  if (!payment) {
    return NextResponse.json({ error: "Payment was not found." }, { status: 404 });
  }

  if (payment.status === "refunded") {
    if (removeRegistration && payment.registration_id) {
      await admin
        .from("tournament_registrations")
        .update({ status: "cancelled", payment_status: "refunded", cancelled_at: new Date().toISOString() })
        .eq("id", payment.registration_id);
    }
    return NextResponse.json({ refunded: true, alreadyRefunded: true, removed: removeRegistration });
  }

  if (payment.status !== "paid") {
    return NextResponse.json({ error: "Only paid Stripe payments can be refunded." }, { status: 400 });
  }

  if (!payment.amount_cents || payment.amount_cents <= 0) {
    return NextResponse.json({ error: "This payment does not have a refundable amount." }, { status: 400 });
  }

  let paymentIntentId = payment.stripe_payment_intent_id || "";
  if (!paymentIntentId && payment.stripe_checkout_session_id) {
    const session = await stripe.checkout.sessions.retrieve(payment.stripe_checkout_session_id);
    paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || "";
    if (paymentIntentId) {
      await admin.from("payment_ledger").update({ stripe_payment_intent_id: paymentIntentId }).eq("id", payment.id);
    }
  }

  if (!paymentIntentId) {
    return NextResponse.json({ error: "This payment does not have a Stripe payment intent to refund." }, { status: 400 });
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: payment.amount_cents,
      metadata: {
        payment_ledger_id: payment.id,
        registration_id: payment.registration_id || "",
        player_id: payment.player_id,
        tournament_id: payment.tournament_id || ""
      }
    }, {
      idempotencyKey: `mrsa-refund-${payment.id}`
    });

    const now = new Date().toISOString();
    const nextNotes = `${payment.notes ? `${payment.notes}\n` : ""}Stripe refund ${refund.id} created.`;
    const { error: ledgerError } = await admin
      .from("payment_ledger")
      .update({
        status: "refunded",
        notes: nextNotes,
        occurred_at: now
      })
      .eq("id", payment.id);

    if (ledgerError) {
      return NextResponse.json({ error: `Stripe refund was created, but MRSA could not update the ledger: ${ledgerError.message}` }, { status: 500 });
    }

    if (payment.registration_id) {
      const registrationUpdate = removeRegistration
        ? { status: "cancelled", payment_status: "refunded", cancelled_at: now }
        : { payment_status: "refunded" };
      const { error: registrationError } = await admin
        .from("tournament_registrations")
        .update(registrationUpdate)
        .eq("id", payment.registration_id);

      if (registrationError) {
        return NextResponse.json({ error: `Stripe refund was created, but registration update failed: ${registrationError.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ refunded: true, removed: removeRegistration, refundId: refund.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe could not create the refund.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
