import { Admin, DataSesion } from "@/types";
import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthStore {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;

  setAuth: (data: DataSesion) => void;
  updateAdminAdmin: (adminAdmin: Partial<Admin>) => void;
  logout: () => void;
}

const parseCookie = <T,>(value: string | undefined, defaultValue: T): T => {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value);
  } catch {
    return defaultValue;
  }
};

export const useAuthStore = create<AuthStore>()((set, get) => ({
  admin: parseCookie<Admin | null>(Cookies.get("auth-admin"), null),
  token: Cookies.get("auth-token") || null,
  isAuthenticated: !!Cookies.get("auth-token"),

  setAuth: (data) => {
    Cookies.set("auth-token", data.token, { expires: 1 });
    Cookies.set("auth-admin", JSON.stringify(data.admin), { expires: 1 });
    Cookies.set("auth-isAuthenticated", "true", { expires: 1 });

    set({
      admin: data.admin,
      token: data.token,
      isAuthenticated: true,
    });
  },

  updateAdminAdmin: (adminAdminData) => {
    const currentAdmin = get().admin;
    const updatedAdmin = currentAdmin 
      ? { ...currentAdmin, ...adminAdminData } 
      : null;

    if (updatedAdmin) {
      Cookies.set("auth-admin", JSON.stringify(updatedAdmin), { expires: 7 });
    }

    set({ admin: updatedAdmin });
  },

  logout: () => {
    Cookies.remove("auth-token");
    Cookies.remove("auth-admin");
    Cookies.remove("auth-isAuthenticated");

    set({
      admin: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));