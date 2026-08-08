import { supabase } from "./supabase";
import type { AdminUser, EditorPermission, PaymentRecord } from "@/types";
import { normalizeIvorianPhone } from "@/constants/phone";

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Non connecté.");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function loginAdmin(phone: string, accessCode: string) {
  // Les comptes admin utilisent le même mécanisme d'authentification que les
  // utilisateurs (Supabase Auth), mais doivent exister dans admin_roles pour
  // accéder au tableau de bord — vérifié juste après connexion.
  const normalized = normalizeIvorianPhone(phone);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${normalized.replace("+", "")}@compte.alerte-ci.app`,
    password: accessCode,
  });
  if (error) throw new Error("Identifiants administrateur incorrects.");

  const { data: role, error: roleError } = await supabase
    .from("admin_roles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (roleError || !role) {
    await supabase.auth.signOut();
    throw new Error("Ce compte n'a pas accès au tableau de bord administrateur.");
  }
  if (role.status !== "actif") {
    await supabase.auth.signOut();
    throw new Error("Ce compte administrateur est en attente de validation ou suspendu.");
  }
  return mapAdminRow(role);
}

function mapAdminRow(row: any): AdminUser {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    role: row.role,
    permissions: row.permissions ?? [],
    status: row.status,
  };
}

export interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  akwabaUsers: number;
  revenue: { today: number; month: number; year: number; currency: string };
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const { data, error } = await supabase.functions.invoke("admin-stats", { headers: await authHeaders() });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data as AdminStats;
}

export async function findUserByPhone(phone: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, phone")
    .eq("phone", normalizeIvorianPhone(phone))
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchAllUsers() {
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchAllPayments(): Promise<PaymentRecord[]> {
  const { data, error } = await supabase
    .from("payments")
    .select("*, profiles!inner(first_name,last_name,phone)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((p: any) => ({
    id: p.id,
    userPhone: p.profiles?.phone ?? "",
    userName: `${p.profiles?.first_name ?? ""} ${p.profiles?.last_name ?? ""}`.trim(),
    amount: p.amount,
    provider: p.provider,
    plan: p.plan,
    status: p.status,
    createdAt: p.created_at,
  }));
}

export async function fetchEditors(): Promise<AdminUser[]> {
  const { data, error } = await supabase.from("admin_roles").select("*").eq("role", "editeur").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapAdminRow);
}

export async function inviteEditor(userId: string, fullName: string, phone: string, permissions: EditorPermission[]) {
  const { data, error } = await supabase.functions.invoke("admin-manage-editors", {
    body: { action: "invite", userId, fullName, phone, permissions },
    headers: await authHeaders(),
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return mapAdminRow(data.editor);
}

export async function updateEditorPermissions(editorId: string, permissions: EditorPermission[]) {
  const { data, error } = await supabase.functions.invoke("admin-manage-editors", {
    body: { action: "update_permissions", editorId, permissions },
    headers: await authHeaders(),
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return mapAdminRow(data.editor);
}

export async function setEditorStatus(editorId: string, status: "actif" | "en_attente" | "suspendu") {
  const { data, error } = await supabase.functions.invoke("admin-manage-editors", {
    body: { action: "set_status", editorId, status },
    headers: await authHeaders(),
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return mapAdminRow(data.editor);
}
