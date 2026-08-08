import { supabase } from "./supabase";

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Non connecté.");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export interface KidnapSearchResult {
  fullName: string;
  latitude: number;
  longitude: number;
  updatedAt: string;
}

export async function searchPersonLocation(targetPhone: string): Promise<KidnapSearchResult> {
  const { data, error } = await supabase.functions.invoke("search-kidnap-location", {
    body: { targetPhone },
    headers: await authHeaders(),
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data as KidnapSearchResult;
}

export async function pushMyLocation(latitude: number | null, longitude: number | null, trackingEnabled: boolean) {
  const { data, error } = await supabase.functions.invoke("update-kidnap-location", {
    body: { latitude, longitude, trackingEnabled },
    headers: await authHeaders(),
  });
  if (error) throw new Error(error.message);
  return data;
}

/** Désactive le suivi sans envoyer de fausses coordonnées (0,0). */
export async function disableTracking() {
  return pushMyLocation(null, null, false);
}
