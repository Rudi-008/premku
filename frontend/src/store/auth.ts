import { create } from "zustand";
import { me } from "@/services/auth";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthState {
  user: User | null;
  loading: boolean;

  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  initAuth: () => Promise<void>;

  isAdmin: () => boolean;
  logout: () => void;

  _initialized: boolean;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  _initialized: false,

  setUser: (user) => set({ user }),

  // =========================
  // FETCH USER (SAFE)
  // =========================
  fetchUser: async () => {
    try {
      const res = await me();

      set({
        user: res.user,
        loading: false,
      });
    } catch (err) {
      set({
        user: null,
        loading: false,
      });
    }
  },

  // =========================
  // INIT AUTH (ANTI DOUBLE CALL)
  // =========================
  initAuth: async () => {
    const state = get();

    // prevent duplicate calls (IMPORTANT FIX)
    if (state._initialized) return;

    set({ loading: true, _initialized: true });

    try {
      const res = await me();

      set({
        user: res.user,
        loading: false,
      });
    } catch (err) {
      set({
        user: null,
        loading: false,
      });
    }
  },

  // =========================
  // ROLE CHECK
  // =========================
  isAdmin: () => get().user?.role === "admin",

  // =========================
  // LOGOUT (HARD RESET)
  // =========================
  logout: () => {
    // 1. clear cookie (strong delete)
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 2. reset state completely
    set({
      user: null,
      loading: false,
      _initialized: false,
    });

    // 3. clear browser storage (future-proof)
    localStorage.removeItem("auth-storage");
    sessionStorage.clear();
  },
}));