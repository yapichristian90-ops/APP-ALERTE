// Recherche la position d'une personne par son numéro de téléphone. Refuse
// et journalise toute tentative venant d'un numéro qui n'est pas déclaré
// comme "numéro de confiance" par la personne recherchée — c'est la seule
// porte d'entrée pour consulter une position dans Alerte Enlèvement.
import { callerFromRequest, corsHeaders, json, serviceClient } from "../_shared/client.ts";
import { normalizeIvorianPhone } from "../_shared/phone.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const caller = await callerFromRequest(req);
  if (!caller) return json({ error: "Non authentifié." }, 401);

  const { targetPhone } = await req.json();
  if (!targetPhone) return json({ error: "targetPhone requis." }, 400);

  const db = serviceClient();
  const normalizedTarget = normalizeIvorianPhone(targetPhone);

  const { data: requesterProfile } = await db.from("profiles").select("phone").eq("id", caller.id).single();

  const { data: target } = await db
    .from("profiles")
    .select("id, first_name, last_name, phone, kidnap_tracking_enabled, last_latitude, last_longitude, last_location_at")
    .eq("phone", normalizedTarget)
    .maybeSingle();

  if (!target) {
    await db.from("kidnap_search_logs").insert({
      requester_id: caller.id,
      requester_phone: requesterProfile?.phone ?? "",
      target_phone: normalizedTarget,
      authorized: false,
    });
    return json({ error: "Aucun compte associé à ce numéro." }, 404);
  }

  const { data: trusted } = await db
    .from("trusted_numbers")
    .select("id")
    .eq("user_id", target.id)
    .eq("phone", requesterProfile?.phone ?? "__none__")
    .maybeSingle();

  const authorized = Boolean(trusted);

  await db.from("kidnap_search_logs").insert({
    requester_id: caller.id,
    requester_phone: requesterProfile?.phone ?? "",
    target_phone: normalizedTarget,
    authorized,
  });

  if (!authorized) {
    return json({ error: "Vous n'êtes pas enregistré comme numéro de confiance pour cette personne." }, 403);
  }

  if (!target.kidnap_tracking_enabled || !target.last_latitude || !target.last_longitude) {
    return json({ error: "Cette personne n'a pas de position disponible actuellement." }, 404);
  }

  return json({
    fullName: `${target.first_name} ${target.last_name}`.trim(),
    latitude: target.last_latitude,
    longitude: target.last_longitude,
    updatedAt: target.last_location_at,
  });
});
