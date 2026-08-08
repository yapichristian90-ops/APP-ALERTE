// Statistiques du tableau de bord administrateur : inscriptions, répartition
// des forfaits, totaux des paiements par jour / mois / année.
import { callerFromRequest, corsHeaders, json, serviceClient } from "../_shared/client.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const caller = await callerFromRequest(req);
  if (!caller) return json({ error: "Non authentifié." }, 401);

  const db = serviceClient();
  const { data: role } = await db.from("admin_roles").select("*").eq("id", caller.id).eq("status", "actif").single();
  if (!role) return json({ error: "Accès administrateur requis." }, 403);

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();

  const [{ count: totalUsers }, { count: premiumUsers }, { count: akwabaUsers }] = await Promise.all([
    db.from("profiles").select("*", { count: "exact", head: true }),
    db.from("profiles").select("*", { count: "exact", head: true }).eq("plan", "premium"),
    db.from("profiles").select("*", { count: "exact", head: true }).eq("plan", "akwaba"),
  ]);

  async function sumSince(since: string) {
    const { data } = await db.from("payments").select("amount").eq("status", "reussi").gte("confirmed_at", since);
    return (data ?? []).reduce((total, p) => total + p.amount, 0);
  }

  const [totalToday, totalMonth, totalYear] = await Promise.all([
    sumSince(startOfDay),
    sumSince(startOfMonth),
    sumSince(startOfYear),
  ]);

  return json({
    totalUsers: totalUsers ?? 0,
    premiumUsers: premiumUsers ?? 0,
    akwabaUsers: akwabaUsers ?? 0,
    revenue: { today: totalToday, month: totalMonth, year: totalYear, currency: "XOF" },
  });
});
