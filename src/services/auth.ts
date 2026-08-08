import { normalizeIvorianPhone } from "@/constants/phone";
import { supabase } from "./supabase";
import type { UserProfile } from "@/types";

// Le numéro de téléphone est l'identifiant vu par l'utilisateur ; en
// interne, Supabase Auth a besoin d'un email. On dérive un email synthétique
// stable et non devinable trivialement, jamais affiché dans l'app.
function emailForPhone(phone: string): string {
  const normalized = normalizeIvorianPhone(phone).replace("+", "");
  return `${normalized}@compte.alerte-ci.app`;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  phone: string;
  commune: string;
  accessCode: string;
}

export async function registerUser(input: RegisterInput) {
  const phone = normalizeIvorianPhone(input.phone);
  const { data, error } = await supabase.auth.signUp({
    email: emailForPhone(phone),
    password: input.accessCode,
    options: {
      data: {
        first_name: input.firstName.trim(),
        last_name: input.lastName.trim(),
        phone,
        commune: input.commune,
      },
    },
  });
  if (error) throw new Error(translateAuthError(error.message));
  return data;
}

export async function loginUser(phone: string, accessCode: string) {
  const normalized = normalizeIvorianPhone(phone);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailForPhone(normalized),
    password: accessCode,
  });
  if (error) throw new Error(translateAuthError(error.message));
  return data;
}

export async function logoutUser() {
  await supabase.auth.signOut();
}

export async function fetchMyProfile(): Promise<UserProfile | null> {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user.id;
  if (!uid) return null;

  const [{ data: profile }, { data: contacts }, { data: trusted }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", uid).single(),
    supabase.from("emergency_contacts").select("*").eq("user_id", uid).order("slot"),
    supabase.from("trusted_numbers").select("*").eq("user_id", uid).order("slot"),
  ]);
  if (!profile) return null;

  return {
    id: profile.id,
    firstName: profile.first_name,
    lastName: profile.last_name,
    phone: profile.phone,
    commune: profile.commune,
    createdAt: profile.created_at,
    plan: profile.plan,
    trialEndsAt: profile.trial_ends_at,
    subscriptionActiveUntil: profile.subscription_active_until,
    acceptedTermsAt: profile.accepted_terms_at,
    emergencyContacts: (contacts ?? []).map((c) => ({ id: c.id, label: c.label, fullName: c.full_name, phone: c.phone })),
    trustedNumbers: (trusted ?? []).map((t) => ({ id: t.id, label: t.label, fullName: t.full_name, phone: t.phone })),
  };
}

export async function updateMyProfile(input: { firstName: string; lastName: string; commune: string }) {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user.id;
  if (!uid) throw new Error("Non connecté.");
  const { error } = await supabase
    .from("profiles")
    .update({ first_name: input.firstName.trim(), last_name: input.lastName.trim(), commune: input.commune })
    .eq("id", uid);
  if (error) throw new Error(error.message);
}

export async function acceptLegalTerms(version: string) {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user.id;
  if (!uid) throw new Error("Non connecté.");
  const { error } = await supabase
    .from("profiles")
    .update({ accepted_terms_at: new Date().toISOString(), accepted_terms_version: version })
    .eq("id", uid);
  if (error) throw new Error(error.message);
}

function translateAuthError(message: string): string {
  if (message.includes("already registered") || message.includes("already exists")) {
    return "Un compte existe déjà avec ce numéro de téléphone. Connectez-vous plutôt.";
  }
  if (message.includes("Invalid login credentials")) {
    return "Numéro de téléphone ou code secret incorrect.";
  }
  if (message.includes("Password should be at least")) {
    return "Le code secret doit contenir au moins 6 caractères.";
  }
  return message;
}
