"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, remove } from "@/services";
import { Departamento } from "@/types";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

type CreateDepartamentoData = Omit<Departamento, 'id_departamento' | 'estado' | 'fecha_creacion' | 'fecha_modificacion'>;

type UpdaterDepartamentoData = Partial<Omit<Departamento,  'estado' | 'fecha_creacion' | 'fecha_modificacion'>> & { 
  id_departamento: number 
};

export const useDepartamento = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const getDepartamento = useQuery({
    queryKey: ["Departamento", token],
    queryFn: async (): Promise<Departamento[]> => {
      const response = await get<Departamento[]>("departamento", token ?? undefined);

      if (!response.data) {
        throw new Error(response.message || "No se recibieron datos");
      }

      return response.data;
    },
    enabled: !!token,
  });

  const createDepartamento = useMutation({
    mutationFn: async (bankData: CreateDepartamentoData) => {
      const response = await post<Departamento>(
        "departamento",
        bankData,
        token ?? undefined
      );
      if (!response.data) {
        throw new Error(response.message || "Error al crear ");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Departamento"] });
      toast.success("Creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear ");
    },
  });

  const updateDepartamento = useMutation({
    mutationFn: async (DepartamentoData: UpdaterDepartamentoData) => {
      const response = await put<Departamento>(
        `departamento/${DepartamentoData.id_departamento}`,
        DepartamentoData,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al actualizar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Departamento"] });
      toast.success(" actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar ");
    },
  });

  const deleteDepartamento = useMutation({
    mutationFn: async (Id: number | undefined) => {
      const response = await remove<Departamento>(
        `departamento/${Id}`,
        token ?? undefined
      );
      
      if (!response.data) {
         throw new Error(response.message || "Error al eliminar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Departamento"] });
      toast.success(" eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar ");
    },
  });

  return {
    departamentos: getDepartamento.data ?? [],
    isLoading: getDepartamento.isLoading,
    isError: getDepartamento.isError,
    error: getDepartamento.error,

    createDepartamento: createDepartamento.mutate,
    createDepartamentoAsync: createDepartamento.mutateAsync,
    isCreating: createDepartamento.isPending,

    updateDepartamento: updateDepartamento.mutate,
    updateDepartamentoAsync: updateDepartamento.mutateAsync,
    isUpdating: updateDepartamento.isPending,

    deleteDepartamento: deleteDepartamento.mutate,
    deleteDepartamentoAsync: deleteDepartamento.mutateAsync,
    isDeleting: deleteDepartamento.isPending,
  };
};