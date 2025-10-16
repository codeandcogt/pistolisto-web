// import { post } from "@/types/Methods/Methods";
// import { useQuery } from "@tanstack/react-query";

export interface Cliente {
  idCliente: number;
  nombre: string;
  apellido: string;
  cui: any;
  nit: any;
  email: string;
  telefono: any;
  nombreUsuario: string;
  contrasena: string;
  fecha_nacimiento: any;
  genero: any;
  tipo_cliente: any;
  primer_login: boolean;
  estado: boolean;
  fecha_modificacion: string;
  fecha_creacion: string;
}

export const useLogin = () => {
  // const fetch = async (): Promise<Cliente> => {
    // const response = await post<Cliente>("auth/client", {
    //   email: "smejia@example.com",
    //   contrasena: "654321",
    // });

    // if (!response.Data) {
    //   throw new Error(response.Message || "No se recibieron datos");
    // }

    // return response.Data;
  // };

  const { data, isLoading, error } = {data: "", isLoading: false, error:false,}
  //  = useQuery<Cliente, Error>(
  //   {
  //     queryKey: ["area-api"],
  //     queryFn: fetch,
  //     staleTime: 500,
  //   }
  // );

  return { data, isLoading, error };
};
