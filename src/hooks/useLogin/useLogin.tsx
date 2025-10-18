import { post } from "@/services";
import { useAuthStore } from "@/store";
import { DataSesion } from "@/types";
import { useMutation } from "@tanstack/react-query";

interface LoginInterface {
  email: string;
  contrasena: string;
}

export const useLogin = () => {
  const { setAuth } = useAuthStore();

  const loginFn = async ({ email, contrasena }: LoginInterface): Promise<string> => {
    const response = await post<DataSesion>("auth/admin", {
      email,
      contrasena,
    });
    
    if (!response.data) {
      throw new Error(response.message || "No se recibieron datos");
    }
    setAuth(response.data)
    return response.message;
  };

  return useMutation<string, Error, LoginInterface>({
    mutationFn: loginFn,
  });
};