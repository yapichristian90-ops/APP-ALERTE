import { normalizeIvorianPhone } from "@/constants/phone";
import { supabase } from "./supabase";
import type { EmergencyContact, TrustedNumber } from "@/types";

async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const uid = data.session?.user.id;
  if (!uid) throw new Error("Non connecté.");
  return uid;
}

export async function saveEmergencyContact(slot: 1 | 2 | 3, fullName: string, phone: string, label = "") {
  const userId = await currentUserId();
  const { error } = await supabase
    .from("emergency_contacts")
    .upsert({ user_id: userId, slot, full_name: fullName.trim(), phone: normalizeIvorianPhone(phone), label }, { onConflict: "user_id,slot" });
  if (error) throw new Error(error.message);
}

export async function removeEmergencyContact(slot: 1 | 2 | 3) {
  const userId = await currentUserId();
  const { error } = await supabase.from("emergency_contacts").delete().eq("user_id", userId).eq("slot", slot);
  if (error) throw new Error(error.message);
}

export async function listEmergencyContacts(): Promise<EmergencyContact[]> {
  const userId = await currentUserId();
  const { data, error } = await supabase.from("emergency_contacts").select("*").eq("user_id", userId).order("slot");
  if (error) throw new Error(error.message);
  return (data ?? []).map((c) => ({ id: c.id, label: c.label, fullName: c.full_name, phone: c.phone }));
}

export async function saveTrustedNumber(slot: 1 | 2 | 3, fullName: string, phone: string, label = "") {
  const userId = await currentUserId();
  const { error } = await supabase
    .from("trusted_numbers")
    .upsert({ user_id: userId, slot, full_name: fullName.trim(), phone: normalizeIvorianPhone(phone), label }, { onConflict: "user_id,slot" });
  if (error) throw new Error(error.message);
}

export async function removeTrustedNumber(slot: 1 | 2 | 3) {
  const userId = await currentUserId();
  const { error } = await supabase.from("trusted_numbers").delete().eq("user_id", userId).eq("slot", slot);
  if (error) throw new Error(error.message);
}

export async function listTrustedNumbers(): Promise<TrustedNumber[]> {
  const userId = await currentUserId();
  const { data, error } = await supabase.from("trusted_numbers").select("*").eq("user_id", userId).order("slot");
  if (error) throw new Error(error.message);
  return (data ?? []).map((t) => ({ id: t.id, label: t.label, fullName: t.full_name, phone: t.phone }));
}
