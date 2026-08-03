// ============================================================================
// ALERTE CI — Fonction Edge Supabase : API administrateur sécurisée
// ----------------------------------------------------------------------------
// Toutes les opérations sensibles (lister/bloquer des utilisateurs, modifier
// les forfaits, offrir des bonus) passent PAR ICI plutôt que par des appels
// REST directs avec la clé publique (anon). Seule cette fonction détient la
// clé de service (SUPABASE_SERVICE_ROLE_KEY) : elle n'est jamais envoyée au
// téléphone des utilisateurs.
//
// Le numéro + code administrateur sont revérifiés à CHAQUE appel (pas de
// session stockée côté serveur). Le code est haché (SHA-256 + sel) : la
// première connexion réussie migre automatiquement un code encore en clair
// (ancienne table admins.sql) vers sa version hachée.
//
// Déploiement (tableau de bord Supabase → Edge Functions → Create a
// function → nom "admin-api" → coller ce fichier → Deploy) :
//   Secrets nécessaires : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//   (les deux sont fournis automatiquement par Supabase).
// ============================================================================

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const dl = (e: unknown) => String(e ?? "").replace(/\D/g, "").slice(-10);

async function sha256Hex(texte: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texte));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function sbHeaders(SB_KEY: string) {
  return { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" };
}

// ── Rate limiting : max 20 requêtes / 60 secondes par numéro appelant ──────
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
      if (existant.compte >= 20) return true;
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
    return false; // en cas d'erreur réseau, on ne bloque pas l'admin légitime
  }
}

async function verifierAdmin(SB_URL: string, SB_KEY: string, telephone: string, code: string) {
  const r = await fetch(
    `${SB_URL}/rest/v1/admins?telephone=eq.${encodeURIComponent(telephone)}&actif=eq.true&select=*`,
    { headers: sbHeaders(SB_KEY) },
  );
  const rows = await r.json();
  const admin = Array.isArray(rows) ? rows[0] : null;
  if (!admin) return null;

  if (admin.code_hash && admin.salt) {
    const essai = await sha256Hex(admin.salt + code);
    return essai === admin.code_hash ? admin : null;
  }
  // Migration automatique depuis un code encore en clair (admins.sql v17).
  if (admin.code && admin.code === code) {
    const salt = crypto.randomUUID();
    const hash = await sha256Hex(salt + code);
    await fetch(`${SB_URL}/rest/v1/admins?telephone=eq.${encodeURIComponent(telephone)}`, {
      method: "PATCH", headers: sbHeaders(SB_KEY),
      body: JSON.stringify({ salt, code_hash: hash, code: null }),
    });
    return admin;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const SB_URL = Deno.env.get("SUPABASE_URL")!;
  const SB_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const jsonRes = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { ...CORS, "Content-Type": "application/json" } });

  try {
    const body = await req.json();
    const telephone = dl(body.telephone);
    const code = String(body.code ?? "").replace(/\D/g, "").slice(0, 6);
    const action = String(body.action ?? "");
    const payload = body.payload || {};

    if (telephone.length !== 10 || code.length !== 6) return jsonRes({ error: "CODE_INVALIDE" }, 400);

    if (await limiteAtteinte(SB_URL, SB_KEY, `admin:${telephone}`)) {
      return jsonRes({ error: "TROP_DE_TENTATIVES" }, 429);
    }

    const admin = await verifierAdmin(SB_URL, SB_KEY, telephone, code);
    if (!admin) return jsonRes({ error: "CODE_INVALIDE" }, 401);

    if (action === "login") return jsonRes({ ok: true, role: admin.role });

    if (action === "list_users") {
      const r = await fetch(
        `${SB_URL}/rest/v1/profiles?select=telephone,nom,forfait,essai_fin,premium_expire,bloque,derniere_connexion&order=derniere_connexion.desc.nullslast`,
        { headers: sbHeaders(SB_KEY) },
      );
      const rows = await r.json();
      const utilisateurs = (Array.isArray(rows) ? rows : []).map((p: any) => ({
        telephone: p.telephone, nom: p.nom, forfait: p.forfait,
        essaiFin: p.essai_fin, premiumExpire: p.premium_expire,
        bloque: !!p.bloque, derniereConnexion: p.derniere_connexion,
      }));
      return jsonRes({ utilisateurs });
    }

    if (action === "toggle_block") {
      const tel = dl(payload.telephone);
      if (tel.length !== 10) return jsonRes({ error: "NUMERO_INVALIDE" }, 400);
      await fetch(`${SB_URL}/rest/v1/profiles?telephone=eq.${tel}`, {
        method: "PATCH", headers: sbHeaders(SB_KEY),
        body: JSON.stringify({ bloque: !!payload.bloque, session_id: null }),
      });
      return jsonRes({ ok: true });
    }

    if (action === "list_forfaits") {
      const r = await fetch(`${SB_URL}/rest/v1/forfaits?select=*&order=prix.asc`, { headers: sbHeaders(SB_KEY) });
      const forfaits = await r.json();
      return jsonRes({ forfaits: Array.isArray(forfaits) ? forfaits : [] });
    }

    if (action === "update_forfait") {
      const prix = Number(payload.prix);
      if (!payload.slug || !Number.isFinite(prix) || prix < 0) return jsonRes({ error: "DONNEES_INVALIDES" }, 400);
      await fetch(`${SB_URL}/rest/v1/forfaits?slug=eq.${encodeURIComponent(payload.slug)}`, {
        method: "PATCH", headers: sbHeaders(SB_KEY), body: JSON.stringify({ prix }),
      });
      return jsonRes({ ok: true });
    }

    if (action === "grant_bonus") {
      const tel = dl(payload.telephone);
      const jours = Math.round(Number(payload.jours));
      if (tel.length !== 10 || !Number.isFinite(jours) || jours <= 0 || jours > 3650) {
        return jsonRes({ error: "DONNEES_INVALIDES" }, 400);
      }
      const rProf = await fetch(`${SB_URL}/rest/v1/profiles?telephone=eq.${tel}&select=premium_expire`, { headers: sbHeaders(SB_KEY) });
      const rows = await rProf.json();
      const actuel = Array.isArray(rows) && rows[0] && rows[0].premium_expire ? new Date(rows[0].premium_expire) : new Date();
      const base = actuel.getTime() > Date.now() ? actuel : new Date();
      const nouvelleDate = new Date(base.getTime() + jours * 24 * 60 * 60 * 1000).toISOString();
      await fetch(`${SB_URL}/rest/v1/profiles?telephone=eq.${tel}`, {
        method: "PATCH", headers: sbHeaders(SB_KEY),
        body: JSON.stringify({ premium_expire: nouvelleDate }),
      });
      await fetch(`${SB_URL}/rest/v1/bonus_premium`, {
        method: "POST", headers: sbHeaders(SB_KEY),
        body: JSON.stringify({
          telephone: tel, jours_offerts: jours,
          motif: String(payload.motif ?? "").slice(0, 200),
          offert_par: telephone,
        }),
      });
      return jsonRes({ ok: true, premiumExpire: nouvelleDate });
    }

    return jsonRes({ error: "ACTION_INCONNUE" }, 400);
  } catch (e) {
    return jsonRes({ error: "Erreur serveur : " + (e as Error).message }, 500);
  }
});
