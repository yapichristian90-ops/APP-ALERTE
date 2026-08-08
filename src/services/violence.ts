import { supabase } from "./supabase";
import type { ViolenceAlert } from "@/types";

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Non connecté.");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

async function callFunction<T>(name: string, body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body, headers: await authHeaders() });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data as T;
}

export async function triggerViolenceAlert(
  triggeredBy: "cri" | "manuel",
  location: { latitude: number; longitude: number } | null,
) {
  return callFunction<{ alert: ViolenceAlert }>("trigger-violence-alert", {
    triggeredBy,
    latitude: location?.latitude ?? null,
    longitude: location?.longitude ?? null,
  });
}

/** Appelé par la victime elle-même pour lever complètement son alerte. */
export async function resolveMyAlert(alertId: string) {
  return callFunction("stop-violence-alert", { alertId });
}

/** Appelé par un contact d'urgence pour couper la sirène sur SON téléphone. */
export async function stopSirenAsContact(alertId: string) {
  return callFunction("stop-violence-alert", { alertId });
}

function mapAlert(row: any): ViolenceAlert {
  return {
    id: row.id,
    victimPhone: row.victim_phone,
    victimName: row.victim_name,
    triggeredBy: row.triggered_by,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    location: row.latitude && row.longitude ? { latitude: row.latitude, longitude: row.longitude } : null,
    stoppedBy: [],
  };
}

/**
 * Écoute en temps réel les alertes qui concernent l'utilisateur connecté :
 * soit comme contact d'urgence désigné (RLS n'expose que celles-là côté
 * "select"), soit ses propres alertes si victime.
 */
export function subscribeToRelevantAlerts(onAlert: (alert: ViolenceAlert) => void) {
  const channel = supabase
    .channel("violence-alerts-watch")
    .on("postgres_changes", { event: "*", schema: "public", table: "violence_alerts" }, (payload) => {
      const row = payload.new ?? payload.old;
      if (row) onAlert(mapAlert(row));
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
