import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/types";
import { MOCK_USERS } from "@/lib/mock-data";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, _password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        const found = MOCK_USERS.find((u) => u.email === email);
        if (found) {
          set({ user: found, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      switchRole: (role: UserRole) =>
        set((state) => {
          if (!state.user) return state;
          return { user: { ...state.user, role } };
        }),
    }),
    { name: "auth-store" }
  )
);
