import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: localStorage.getItem("access_token") || null,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        localStorage.setItem("access_token", token);
        set({ token });
      },

      clearToken: () => {
        localStorage.removeItem("access_token");
        set({ token: null });
      },
      fetchUser: async () => {
        try {
          const res = await axios.get("/me");
          set({ user: res.data });
        } catch (err) {
          console.error("Failed to fetch user", err);
        }
      },

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage", // nama key di localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;
