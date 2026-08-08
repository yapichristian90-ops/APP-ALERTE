// Met à jour la dernière position connue de l'utilisateur, envoyée en continu
// par l'app quand la rubrique Alerte Enlèvement est active, pour permettre un
// suivi en temps réel en cas de déplacement.
import { callerFromRequest, corsHeaders, json, serviceClient } from "../_shared/client.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const caller = await callerFromRequest(req);
  if (!caller) return json({ error: "Non authentifié." }, 401);

  const { latitude, longitude, trackingEnabled } = await req.json();

  const db = serviceClient();
  const { error } = await db
    .from("profiles")
    .update({
      last_latitude: latitude ?? null,
      last_longitude: longitude ?? null,
      last_location_at: new Date().toISOString(),
      kidnap_tracking_enabled: trackingEnabled ?? true,
    })
    .eq("id", caller.id);

  if (error) return json({ error: "Mise à jour impossible." }, 500);
  return json({ ok: true });
});
