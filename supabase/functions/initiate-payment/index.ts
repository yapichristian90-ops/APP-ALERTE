// Initie un paiement mobile money pour le forfait Premium (3 000 F CFA/an).
//
// ⚠️ Intégration réelle à brancher : ce projet ne contient aucun identifiant
// marchand (impossible à fournir sans compte réel). En production, remplacez
// `createCheckoutSession` par un appel à votre agrégateur de paiement
// ivoirien (ex. CinetPay ou PayDunya, qui couvrent tous deux Orange Money,
// MTN Money, Moov Money et Wave avec un seul contrat marchand), ou par les
// API directes de chaque opérateur si vous avez un accès marchand dédié.
// Le paiement est créé ici en statut "en_attente" ; c'est le webhook
// `payment-webhook` (appelé par le prestataire) qui le fait passer à
// "reussi" et active l'abonnement.
import { callerFromRequest, corsHeaders, json, serviceClient } from "../_shared/client.ts";

const PREMIUM_AMOUNT_XOF = 3000;

async function createCheckoutSession(opts: { provider: string; phone: string; amount: number; paymentId: string }) {
  // TODO(production): remplacer par l'appel réel à l'agrégateur de paiement.
  // Exemple (CinetPay) :
  // const res = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     apikey: Deno.env.get("CINETPAY_API_KEY"),
  //     site_id: Deno.env.get("CINETPAY_SITE_ID"),
  //     transaction_id: opts.paymentId,
  //     amount: opts.amount,
  //     currency: "XOF",
  //     channels: opts.provider === "wave" ? "WAVE" : "MOBILE_MONEY",
  //     customer_phone_number: opts.phone,
  //     notify_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/payment-webhook`,
  //   }),
  // });
  // const data = await res.json();
  // return { checkoutUrl: data.data.payment_url, externalReference: data.data.payment_token };
  return {
    checkoutUrl: null as string | null,
    externalReference: `SIMULATION-${opts.paymentId}`,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const caller = await callerFromRequest(req);
  if (!caller) return json({ error: "Non authentifié." }, 401);

  const { provider } = await req.json();
  if (!["orange", "mtn", "moov", "wave"].includes(provider)) {
    return json({ error: "Moyen de paiement invalide." }, 400);
  }

  const db = serviceClient();
  const { data: profile } = await db.from("profiles").select("phone").eq("id", caller.id).single();
  if (!profile) return json({ error: "Profil introuvable." }, 404);

  const { data: payment, error } = await db
    .from("payments")
    .insert({ user_id: caller.id, plan: "premium", amount: PREMIUM_AMOUNT_XOF, provider, status: "en_attente" })
    .select()
    .single();
  if (error || !payment) return json({ error: "Impossible de créer le paiement." }, 500);

  const session = await createCheckoutSession({
    provider,
    phone: profile.phone,
    amount: PREMIUM_AMOUNT_XOF,
    paymentId: payment.id,
  });

  await db.from("payments").update({ external_reference: session.externalReference }).eq("id", payment.id);

  return json({ paymentId: payment.id, checkoutUrl: session.checkoutUrl, provider, amount: PREMIUM_AMOUNT_XOF });
});
