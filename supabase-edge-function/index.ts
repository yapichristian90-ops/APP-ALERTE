// ============================================================================
// ALERTE CI — Fonction Edge Supabase : push FCM aux contacts d'urgence
// ----------------------------------------------------------------------------
// Déclenchée par un Database Webhook sur INSERT dans la table `diffusions`.
// Envoie un message FCM DATA-ONLY haute priorité : le code natif de l'app
// (AlerteFirebaseService) démarre alors la sirène EN BOUCLE, même app fermée.
//
// Déploiement :
//   supabase functions deploy push-alerte --no-verify-jwt
// Secrets : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, FCM_SERVICE_ACCOUNT
// ============================================================================

const dl = (e: unknown) => String(e ?? "").replace(/\D/g, "").slice(-10);

async function getAccessToken(sa: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const b64url = (obj: any) =>
    btoa(JSON.stringify(obj)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${b64url(header)}.${b64url(claim)}`;
  const pem = sa.private_key.replace(/-----[^-]+-----/g, "").replace(/\s/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = new Uint8Array(
    await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned)),
  );
  const sigB64 = btoa(String.fromCharCode(...sig))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const jwt = `${unsigned}.${sigB64}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const json = await res.json();
  if (!json.access_token) throw new Error("FCM token error: " + JSON.stringify(json));
  return json.access_token;
}

async function pushVers(projectId: string, accessToken: string, tokens: string[],
                        titre: string, corps: string, extra: Record<string, string>) {
  const uniq = [...new Set(tokens.filter(Boolean))];
  const envois = uniq.map(async (token) => {
    const message = {
      message: {
        token,
        data: { title: titre, body: corps, ...extra },
        android: { priority: "high" },
      },
    };
    const res = await fetch(
      `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(message),
      },
    );
    return { token: token.slice(0, 10) + "…", status: res.status };
  });
  return await Promise.all(envois);
}

async function tokensPourTelephones(SB_URL: string, SB_KEY: string, phones: string[]) {
  const cibles = phones.map(dl).filter(Boolean);
  if (!cibles.length) return [];
  const res = await fetch(`${SB_URL}/rest/v1/device_tokens?select=token,telephone`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
  });
  const rows = await res.json();
  return (Array.isArray(rows) ? rows : [])
    .filter((r) => cibles.includes(dl(r.telephone)))
    .map((r) => r.token);
}

async function tousLesTokens(SB_URL: string, SB_KEY: string) {
  const res = await fetch(`${SB_URL}/rest/v1/device_tokens?select=token`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
  });
  const rows = await res.json();
  return (Array.isArray(rows) ? rows : []).map((r) => r.token);
}

// Téléphones des institutions correspondant à un type de service / nom
async function telephonesInstitutions(SB_URL: string, SB_KEY: string, service: string) {
  const h = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` };
  const out: string[] = [];
  try {
    const r1 = await fetch(
      `${SB_URL}/rest/v1/institutions?select=telephone,statut,types_service!inner(nom)&types_service.nom=eq.${encodeURIComponent(service)}`,
      { headers: h },
    );
    const j1 = await r1.json();
    if (Array.isArray(j1)) {
      for (const r of j1) if (r.statut === "valide" && r.telephone) out.push(r.telephone);
    }
  } catch (_) { /* ignore */ }
  if (!out.length) {
    try {
      const r2 = await fetch(
        `${SB_URL}/rest/v1/institutions?select=telephone,statut&nom=eq.${encodeURIComponent(service)}`,
        { headers: h },
      );
      const j2 = await r2.json();
      if (Array.isArray(j2)) {
        for (const r of j2) if (r.statut === "valide" && r.telephone) out.push(r.telephone);
      }
    } catch (_) { /* ignore */ }
  }
  return out;
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const payload = body?.record?.payload ?? body?.payload ?? body;
    if (!payload) return new Response("ignore", { status: 200 });

    const SB_URL = Deno.env.get("SUPABASE_URL")!;
    const SB_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sa = JSON.parse(Deno.env.get("FCM_SERVICE_ACCOUNT")!);

    // ─── CAS 1 : alerte d'urgence (violence) vers les contacts de confiance ───
    if (payload.urgence === true && !payload.fin && payload.tracking !== true) {
      const cibles: string[] = Array.isArray(payload.cibles) ? payload.cibles : [];
      if (!cibles.length) return new Response("no targets", { status: 200 });
      const tokens = await tokensPourTelephones(SB_URL, SB_KEY, cibles);
      if (!tokens.length) return new Response("no tokens", { status: 200 });

      const victime = payload?.victime?.nm || "Un contact";
      const estGps = payload?.type === "gps";
      const titre = estGps ? "\uD83C\uDD98 ALERTE ENLÈVEMENT" : "\uD83D\uDEA8 ALERTE VIOLENCE";
      const corps = estGps
        ? `${victime} a besoin d'aide — disparition présumée.`
        : `${victime} est en DANGER ! Ouvrez l'app immédiatement.`;

      const accessToken = await getAccessToken(sa);
      const r = await pushVers(sa.project_id, accessToken, tokens, titre, corps, {
        type: "urgence",
        urgence: "true",
        alerteId: String(payload.alerteId ?? ""),
      });
      return new Response(JSON.stringify({ cas: "urgence", sent: r.length }), {
        status: 200, headers: { "Content-Type": "application/json" },
      });
    }

    // Le partage de position permanent ne notifie personne.
    if (payload.tracking === true) return new Response("tracking", { status: 200 });

    // ─── CAS 2 : signalement d'un citoyen vers un service public ───
    if (payload.citoyen === true && payload.id) {
      const service = payload.service || "";
      if (!service) return new Response("no service", { status: 200 });
      const phones = await telephonesInstitutions(SB_URL, SB_KEY, service);
      if (!phones.length) return new Response("no institution", { status: 200 });
      const tokens = await tokensPourTelephones(SB_URL, SB_KEY, phones);
      if (!tokens.length) return new Response("no tokens", { status: 200 });

      const accessToken = await getAccessToken(sa);
      const r = await pushVers(sa.project_id, accessToken, tokens,
        "\uD83D\uDCE5 Nouveau signalement citoyen",
        String(payload.apercu || payload.titre || "Un citoyen vous a transmis une information."),
        { type: "signalement", service: String(service), infoId: String(payload.id) });
      return new Response(JSON.stringify({ cas: "signalement", sent: r.length }), {
        status: 200, headers: { "Content-Type": "application/json" },
      });
    }

    // ─── CAS 3 : diffusion d'un service public vers les citoyens ───
    if (payload.id && payload.institution && !payload.citoyen) {
      const niveau = Number(payload.niveau ?? (payload.urgent ? 3 : 1));
      // Niveaux 1 et 2 : visibles dans Alerte Info, sans notification sonore.
      if (niveau < 3) return new Response("niveau bas", { status: 200 });

      const tokens = await tousLesTokens(SB_URL, SB_KEY);
      if (!tokens.length) return new Response("no tokens", { status: 200 });

      const lb = niveau >= 4 ? "\uD83D\uDD34 URGENCE" : "\uD83D\uDFE0 ALERTE";
      const accessToken = await getAccessToken(sa);
      const r = await pushVers(sa.project_id, accessToken, tokens,
        `${lb} · ${payload.institution}`,
        String(payload.apercu || payload.titre || ""),
        {
          type: "info_publique",
          niveau: String(niveau),
          infoId: String(payload.id),
          service: String(payload.service || ""),
        });
      return new Response(JSON.stringify({ cas: "diffusion", niveau, sent: r.length }), {
        status: 200, headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("ignore", { status: 200 });
  } catch (e) {
    return new Response("error: " + (e as Error).message, { status: 500 });
  }
});
