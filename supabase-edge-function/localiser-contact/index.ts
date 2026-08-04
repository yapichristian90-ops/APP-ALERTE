// ============================================================================
// ALERTE CI — Fonction Edge Supabase : localiser un contact de confiance
// ----------------------------------------------------------------------------
// Un contact de confiance (rubrique Enlèvement) recherche un numéro pour
// obtenir sa position en direct. La position n'est JAMAIS accessible
// directement (aucune politique de lecture sur positions_live) : cette
// fonction vérifie d'abord, avec la clé de service, que le numéro demandeur
// figure bien dans la liste des contacts de confiance du numéro recherché,
// avant de renvoyer quoi que ce soit.
//
// Déploiement (tableau de bord Supabase → Edge Functions → Create a
// function → nom "localiser-contact" → coller ce fichier → Deploy) :
//   Secrets nécessaires : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// ============================================================================

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const dl = (e: unknown) => String(e ?? "").replace(/\D/g, "").slice(-10);

function sbHeaders(SB_KEY: string) {
  return { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" };
}

// ── Rate limiting : max 30 recherches / 60 secondes par numéro demandeur ───
async function limiteAtteinte(SB_URL: string, SB_KEY: string, cle: string): Promise<boolean> {
  try {
    const fenetre = new Date(Date.now() - 60_000).toISOString();
    const r = await fetch(
      `${SB_URL}/rest/v1/rate_limits?cle=eq.${encodeURIComponent(cle)}&fenetre_debut=gte.${encodeURIComponent(fenetre)}&select=compte`,
      { headers: sbHeaders(SB_KEY) },
    );
    const rows = await r.json();
    const existant = Array.isArray(rows) ? rows[0] : null;
    if (existant) {
      if (existant.compte >= 30) return true;
      await fetch(`${SB_URL}/rest/v1/rate_limits?cle=eq.${encodeURIComponent(cle)}`, {
        method: "PATCH", headers: sbHeaders(SB_KEY),
        body: JSON.stringify({ compte: existant.compte + 1 }),
      });
    } else {
      await fetch(`${SB_URL}/rest/v1/rate_limits`, {
        method: "POST", headers: { ...sbHeaders(SB_KEY), Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify({ cle, compte: 1, fenetre_debut: new Date().toISOString() }),
      });
    }
    return false;
  } catch (_) {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const SB_URL = Deno.env.get("SUPABASE_URL")!;
  const SB_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const jsonRes = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { ...CORS, "Content-Type": "application/json" } });

  try {
    const body = await req.json();
    const demandeur = dl(body.demandeur);
    const cible = dl(body.cible);

    if (demandeur.length !== 10 || cible.length !== 10) return jsonRes({ error: "NUMERO_INVALIDE" }, 400);
    if (demandeur === cible) return jsonRes({ error: "NUMERO_INVALIDE" }, 400);

    if (await limiteAtteinte(SB_URL, SB_KEY, `loc:${demandeur}`)) {
      return jsonRes({ error: "TROP_DE_TENTATIVES" }, 429);
    }

    // ── Vérification d'autorisation : demandeur doit être dans la liste des
    //    contacts de confiance ("enlevement") du numéro recherché. ──
    const rCt = await fetch(
      `${SB_URL}/rest/v1/contacts_confiance?telephone=eq.${cible}&select=enlevement`,
      { headers: sbHeaders(SB_KEY) },
    );
    const ctRows = await rCt.json();
    const ligne = Array.isArray(ctRows) ? ctRows[0] : null;
    const liste: any[] = (ligne && Array.isArray(ligne.enlevement)) ? ligne.enlevement : [];
    const autorise = liste.some((c: any) => dl(c && c.ph) === demandeur);

    if (!autorise) return jsonRes({ error: "NON_AUTORISE" }, 403);

    const rPos = await fetch(
      `${SB_URL}/rest/v1/positions_live?telephone=eq.${cible}&select=lat,lng,precision,updated_at`,
      { headers: sbHeaders(SB_KEY) },
    );
    const posRows = await rPos.json();
    const pos = Array.isArray(posRows) ? posRows[0] : null;
    if (!pos) return jsonRes({ error: "POSITION_INDISPONIBLE" }, 404);

    return jsonRes({ lat: pos.lat, lng: pos.lng, precision: pos.precision, updatedAt: pos.updated_at });
  } catch (e) {
    return jsonRes({ error: "Erreur serveur : " + (e as Error).message }, 500);
  }
});
