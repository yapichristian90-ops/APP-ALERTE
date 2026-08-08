// Webhook appelé par le prestataire de paiement (CinetPay/PayDunya/etc.) pour
// confirmer un paiement mobile money. Active le forfait Premium pour 1 an à
// réception d'une confirmation réussie.
//
// ⚠️ Sécurité production : vérifiez la signature/le secret fourni par votre
// prestataire avant de faire confiance à ce payload (chaque agrégateur a son
// propre mécanisme — HMAC de la charge utile, jeton dans l'en-tête, etc.).
import { corsHeaders, json, serviceClient } from "../_shared/client.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const { paymentId, status, externalReference } = await req.json();
  if (!paymentId || !["reussi", "echoue"].includes(status)) {
    return json({ error: "Payload invalide." }, 400);
  }

  const db = serviceClient();
  const { data: payment } = await db.from("payments").select("*").eq("id", paymentId).single();
  if (!payment) return json({ error: "Paiement introuvable." }, 404);

  await db
    .from("payments")
    .update({
      status,
      external_reference: externalReference ?? payment.external_reference,
      confirmed_at: new Date().toISOString(),
    })
    .eq("id", paymentId);

  if (status === "reussi") {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    await db
      .from("profiles")
      .update({ plan: "premium", subscription_active_until: oneYearFromNow.toISOString() })
      .eq("id", payment.user_id);
  }

  return json({ ok: true });
});
