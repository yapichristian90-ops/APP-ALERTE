import { create } from "zustand";
import type { AdminUser } from "@/types";
import { loginAdmin } from "@/services/admin";
import { supabase } from "@/services/supabase";

interface AdminState {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (phone: string, accessCode: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  admin: null,
  isLoading: false,

  login: async (phone, accessCode) => {
    set({ isLoading: true });
    try {
      const role = await loginAdmin(phone, accessCode);
      set({ admin: role, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ admin: null });
  },
}));
