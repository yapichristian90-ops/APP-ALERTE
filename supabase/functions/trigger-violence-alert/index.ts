// Déclenche une Alerte Violence : crée l'alerte, puis notifie en push tous
// les contacts d'urgence de l'utilisateur qui sont eux-mêmes inscrits sur
// l'application (leur numéro correspond à un profil existant).
import { callerFromRequest, corsHeaders, json, serviceClient } from "../_shared/client.ts";
import { sendExpoPush } from "../_shared/expoPush.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const caller = await callerFromRequest(req);
  if (!caller) return json({ error: "Non authentifié." }, 401);

  const { triggeredBy, latitude, longitude } = await req.json();
  if (!["cri", "manuel"].includes(triggeredBy)) {
    return json({ error: "triggeredBy invalide." }, 400);
  }

  const db = serviceClient();

  const { data: profile, error: profileError } = await db
    .from("profiles")
    .select("id, first_name, last_name, phone")
    .eq("id", caller.id)
    .single();
  if (profileError || !profile) return json({ error: "Profil introuvable." }, 404);

  const { data: contacts } = await db
    .from("emergency_contacts")
    .select("phone")
    .eq("user_id", caller.id);

  if (!contacts || contacts.length === 0) {
    return json({ error: "Ajoutez au moins un contact d'urgence avant de déclencher une alerte." }, 400);
  }

  const { data: alert, error: alertError } = await db
    .from("violence_alerts")
    .insert({
      victim_id: caller.id,
      victim_name: `${profile.first_name} ${profile.last_name}`.trim(),
      victim_phone: profile.phone,
      triggered_by: triggeredBy,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    })
    .select()
    .single();
  if (alertError || !alert) return json({ error: "Impossible de créer l'alerte." }, 500);

  const contactPhones = contacts.map((c) => c.phone);
  const { data: recipientProfiles } = await db
    .from("profiles")
    .select("id")
    .in("phone", contactPhones);

  if (recipientProfiles && recipientProfiles.length > 0) {
    const recipientIds = recipientProfiles.map((p) => p.id);
    const { data: tokens } = await db
      .from("push_tokens")
      .select("expo_push_token")
      .in("user_id", recipientIds);

    if (tokens && tokens.length > 0) {
      await sendExpoPush(
        tokens.map((t) => ({
          to: t.expo_push_token,
          title: "🚨 ALERTE VIOLENCE",
          body: `${alert.victim_name} est en danger ! Ouvrez l'application immédiatement.`,
          data: { type: "violence_alert", alertId: alert.id },
        })),
      );
    }
  }

  return json({ alert });
});
