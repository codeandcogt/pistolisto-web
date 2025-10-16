import { post } from "@/types/Methods/Methods";
import { useQuery } from "@tanstack/react-query";

export interface Cliente {
  idCliente: number;
  nombre: string;
  apellido: string;
  cui: string | null;
  nit: string | null;
  email: string;
  telefono: string | null;
  nombreUsuario: string;
  contrasena: string;
  fecha_nacimiento: string | null;
  genero: string | null;
  tipo_cliente: string | null;
  primer_login: boolean;
  estado: boolean;
  fecha_modificacion: string;
  fecha_creacion: string;
}

export const useLogin = () => {
  const fetch = async (): Promise<Cliente> => {
    const response = await post<Cliente>("auth/client", {
      email: "smejia@example.com",
      contrasena: "654321",
    });

    if (!response.Data) {
      throw new Error(response.Message || "No se recibieron datos");
    }

    return response.Data;
  };

  const { data, isLoading, error, refetch, isError } = useQuery<Cliente, Error>(
    {
      queryKey: ["area-api"],
      queryFn: fetch,
      staleTime: 500,
    }
  );

  return { data, isLoading, error, refetch, isError };
};
