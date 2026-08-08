// Coupe la sirène d'une alerte : appelable par la victime (lève l'alerte) ou
// par un contact d'urgence désigné (arrête uniquement sa propre sirène — les
// autres contacts continuent d'être alertés, comme demandé dans le cahier
// des charges).
import { callerFromRequest, corsHeaders, json, serviceClient } from "../_shared/client.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const caller = await callerFromRequest(req);
  if (!caller) return json({ error: "Non authentifié." }, 401);

  const { alertId } = await req.json();
  if (!alertId) return json({ error: "alertId requis." }, 400);

  const db = serviceClient();

  const { data: alert } = await db.from("violence_alerts").select("*").eq("id", alertId).single();
  if (!alert) return json({ error: "Alerte introuvable." }, 404);

  if (alert.victim_id === caller.id) {
    await db.from("violence_alerts").update({ status: "resolved", updated_at: new Date().toISOString() }).eq("id", alertId);
    return json({ ok: true, status: "resolved" });
  }

  // Sinon, c'est un contact d'urgence qui coupe sa propre sirène.
  await db.from("violence_alert_stops").upsert({ alert_id: alertId, contact_id: caller.id });

  const { data: contacts } = await db.from("emergency_contacts").select("id").eq("user_id", alert.victim_id);
  const { data: stops } = await db.from("violence_alert_stops").select("contact_id").eq("alert_id", alertId);

  if (contacts && stops && stops.length >= contacts.length) {
    await db.from("violence_alerts").update({ status: "stopped", updated_at: new Date().toISOString() }).eq("id", alertId);
  }

  return json({ ok: true, status: "stopped_locally" });
});
