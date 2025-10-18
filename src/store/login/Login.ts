import { Admin, DataSesion } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from 'js-cookie';

interface AuthStore {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;

  // Acciones
  setAuth: (data: DataSesion) => void;
  updateAdminAdmin: (adminAdmin: Partial<Admin>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,

      setAuth: (data) => {
        Cookies.set('auth-token', data.token, { expires: 7 });
        
        set({
          admin: data.admin,
          token: data.token,
          isAuthenticated: true,
        });
      },

      updateAdminAdmin: (adminAdminData) =>
        set((state) => ({
          admin: state.admin ? { ...state.admin, ...adminAdminData } : null,
        })),

      logout: () => {
        Cookies.remove('auth-token');
        
        set({
          admin: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);