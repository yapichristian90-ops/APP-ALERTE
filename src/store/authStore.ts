import { create } from "zustand";
import type { UserProfile } from "@/types";
import { fetchMyProfile, logoutUser } from "@/services/auth";
import { supabase } from "@/services/supabase";

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  profile: UserProfile | null;
  hydrate: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoading: true,
  isAuthenticated: false,
  profile: null,

  hydrate: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const profile = await fetchMyProfile();
      set({ isAuthenticated: Boolean(profile), profile, isLoading: false });
    } else {
      set({ isAuthenticated: false, profile: null, isLoading: false });
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        set({ isAuthenticated: false, profile: null });
        return;
      }
      const profile = await fetchMyProfile();
      set({ isAuthenticated: Boolean(profile), profile });
    });
  },

  refreshProfile: async () => {
    const profile = await fetchMyProfile();
    set({ profile, isAuthenticated: Boolean(profile) });
  },

  signOut: async () => {
    await logoutUser();
    set({ isAuthenticated: false, profile: null });
  },
}));

/** L'essai Akwaba de 30 jours donne un accès Premium temporaire. */
export function computeEffectivePlan(profile: UserProfile | null): "akwaba" | "premium" {
  if (!profile) return "akwaba";
  if (profile.plan === "premium") return "premium";
  const trialActive = new Date(profile.trialEndsAt).getTime() > Date.now();
  return trialActive ? "premium" : "akwaba";
}

export function trialDaysRemaining(profile: UserProfile | null): number {
  if (!profile) return 0;
  const ms = new Date(profile.trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}
