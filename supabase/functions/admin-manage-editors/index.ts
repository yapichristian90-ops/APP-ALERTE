// Gestion des éditeurs par l'administrateur principal : invitation, mise à
// jour des rôles/permissions, validation ou suspension. Toute écriture sur
// admin_roles passe obligatoirement par cette fonction (clé de service),
// pour ne jamais laisser un éditeur s'auto-attribuer des droits via RLS.
import { callerFromRequest, corsHeaders, json, serviceClient } from "../_shared/client.ts";

type Action = "invite" | "update_permissions" | "set_status";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const caller = await callerFromRequest(req);
  if (!caller) return json({ error: "Non authentifié." }, 401);

  const db = serviceClient();
  const { data: callerRole } = await db.from("admin_roles").select("*").eq("id", caller.id).single();
  if (!callerRole || callerRole.role !== "admin_principal" || callerRole.status !== "actif") {
    return json({ error: "Réservé à l'administrateur principal." }, 403);
  }

  const body = await req.json();
  const action: Action = body.action;

  if (action === "invite") {
    const { userId, fullName, phone, permissions } = body;
    const { data, error } = await db
      .from("admin_roles")
      .insert({
        id: userId,
        full_name: fullName,
        phone,
        role: "editeur",
        permissions: permissions ?? [],
        status: "en_attente",
        invited_by: caller.id,
      })
      .select()
      .single();
    if (error) return json({ error: "Invitation impossible : " + error.message }, 400);
    return json({ editor: data });
  }

  if (action === "update_permissions") {
    const { editorId, permissions } = body;
    const { data, error } = await db
      .from("admin_roles")
      .update({ permissions })
      .eq("id", editorId)
      .eq("role", "editeur")
      .select()
      .single();
    if (error) return json({ error: "Mise à jour impossible." }, 400);
    return json({ editor: data });
  }

  if (action === "set_status") {
    const { editorId, status } = body;
    if (!["actif", "en_attente", "suspendu"].includes(status)) {
      return json({ error: "Statut invalide." }, 400);
    }
    const { data, error } = await db
      .from("admin_roles")
      .update({ status })
      .eq("id", editorId)
      .eq("role", "editeur")
      .select()
      .single();
    if (error) return json({ error: "Mise à jour impossible." }, 400);
    return json({ editor: data });
  }

  return json({ error: "Action inconnue." }, 400);
});
