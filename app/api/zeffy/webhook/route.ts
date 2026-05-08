import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "../../../lib/supabase-server";

export const runtime = "nodejs";

const webhookSecret = process.env.ZEFFY_WEBHOOK_SECRET;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type PaymentLedgerRow = {
  id: string;
  player_id: string;
  tournament_id: string | null;
  registration_id: string | null;
  status: string;
  amount_cents: number;
  currency: string;
  notes: string | null;
};

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    return NextResponse.json({ error: "Zeffy webhook is not configured." }, { status: 500 });
  }

  const providedSecret = request.nextUrl.searchParams.get("secret") || request.headers.get("x-mrsa-webhook-secret");
  if (providedSecret !== webhookSecret) {
    return NextResponse.json({ error: "Invalid webhook secret." }, { status: 401 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Supabase service role key is missing." }, { status: 500 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const paymentStatus = extractStatus(payload);
  if (!isPaidStatus(paymentStatus)) {
    return NextResponse.json({ received: true, ignored: true, status: paymentStatus || "unknown" });
  }

  const zeffyPaymentId = extractString(payload, ["payment_id", "paymentid", "transaction_id", "transactionid", "donation_id", "donationid", "id"]);
  const mrsaPaymentId = extractString(payload, ["mrsa_payment_id", "mrsapaymentid", "payment_reference", "paymentreference", "reference", "client_reference_id", "clientreferenceid"]);
  const payerEmail = extractEmail(payload);
  const amountCents = extractAmountCents(payload);

  const payment = await findPayment(admin, { mrsaPaymentId, payerEmail, amountCents });
  if (!payment) {
    return NextResponse.json({ error: "No matching pending MRSA payment found." }, { status: 404 });
  }

  if (!payment.tournament_id) {
    return NextResponse.json({ error: "Matched payment does not have a tournament." }, { status: 400 });
  }

  const { data: registration, error: registrationError } = await admin.from("tournament_registrations").upsert({
    tournament_id: payment.tournament_id,
    player_id: payment.player_id,
    status: "registered",
    payment_status: "paid"
  }, { onConflict: "tournament_id,player_id" }).select("id").single();

  if (registrationError) {
    return NextResponse.json({ error: registrationError.message }, { status: 500 });
  }

  const noteSuffix = zeffyPaymentId ? ` Zeffy payment id: ${zeffyPaymentId}.` : " Zeffy payment received.";
  const { error: ledgerError } = await admin
    .from("payment_ledger")
    .update({
      status: "paid",
      registration_id: registration?.id || payment.registration_id,
      method: "zeffy",
      reference: zeffyPaymentId || payment.reference || payment.id,
      notes: payment.notes?.includes(noteSuffix.trim()) ? payment.notes : `${payment.notes || "Zeffy registration checkout."}${noteSuffix}`,
      occurred_at: new Date().toISOString()
    })
    .eq("id", payment.id);

  if (ledgerError) {
    return NextResponse.json({ error: ledgerError.message }, { status: 500 });
  }

  return NextResponse.json({ received: true, registered: true, payment_id: payment.id });
}

async function findPayment(
  admin: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  {
    mrsaPaymentId,
    payerEmail,
    amountCents
  }: {
    mrsaPaymentId: string;
    payerEmail: string;
    amountCents: number | null;
  }
) {
  if (uuidPattern.test(mrsaPaymentId)) {
    const { data } = await admin
      .from("payment_ledger")
      .select("id, player_id, tournament_id, registration_id, status, amount_cents, currency, notes, reference")
      .eq("id", mrsaPaymentId)
      .maybeSingle();
    if (data) return data as PaymentLedgerRow & { reference: string | null };
  }

  if (mrsaPaymentId) {
    const { data } = await admin
      .from("payment_ledger")
      .select("id, player_id, tournament_id, registration_id, status, amount_cents, currency, notes, reference")
      .eq("reference", mrsaPaymentId)
      .maybeSingle();
    if (data) return data as PaymentLedgerRow & { reference: string | null };
  }

  if (payerEmail && amountCents !== null) {
    const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString();
    const { data } = await admin
      .from("payment_ledger")
      .select("id, player_id, tournament_id, registration_id, status, amount_cents, currency, notes, reference")
      .eq("method", "zeffy")
      .eq("entry_type", "charge")
      .eq("status", "pending")
      .eq("checkout_email", payerEmail)
      .eq("amount_cents", amountCents)
      .gte("occurred_at", since)
      .order("occurred_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) return data as PaymentLedgerRow & { reference: string | null };
  }

  return null;
}

function extractStatus(payload: unknown) {
  return extractString(payload, ["status", "payment_status", "paymentstatus", "state"]);
}

function isPaidStatus(status: string) {
  return /paid|complete|completed|success|succeeded|approved/i.test(status);
}

function extractEmail(payload: unknown) {
  return extractString(payload, ["email", "payer_email", "payeremail", "donor_email", "donoremail", "registrant_email", "registrantemail"]).toLowerCase();
}

function extractAmountCents(payload: unknown) {
  const rawAmount = extractString(payload, ["amount_cents", "amountcents", "total_cents", "totalcents"]);
  if (rawAmount && /^\d+$/.test(rawAmount)) return Number(rawAmount);

  const amount = extractString(payload, ["amount", "total", "payment_amount", "paymentamount", "donation_amount", "donationamount"]);
  if (!amount) return null;

  const normalized = amount.replace(/[^0-9.]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : null;
}

function extractString(payload: unknown, candidateKeys: string[]) {
  const normalizedCandidates = new Set(candidateKeys.map(normalizeKey));
  const direct = findByKey(payload, normalizedCandidates);
  if (direct !== null && direct !== undefined) return String(direct).trim();
  return "";
}

function findByKey(value: unknown, keys: Set<string>): unknown {
  if (!value || typeof value !== "object") return null;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findByKey(item, keys);
      if (found !== null && found !== undefined && found !== "") return found;
    }
    return null;
  }

  for (const [key, item] of Object.entries(value)) {
    if (keys.has(normalizeKey(key))) return item;
  }

  for (const item of Object.values(value)) {
    const found = findByKey(item, keys);
    if (found !== null && found !== undefined && found !== "") return found;
  }

  return null;
}

function normalizeKey(key: string) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}
