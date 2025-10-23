"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, remove } from "@/services";
import { Sucursal } from "@/types";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

type CreateSucursalData = Omit<Sucursal, 'idSucursal' | 'estado' | 'fecha_creacion' | 'fecha_modificacion'>;

type UpdaterSucursalData = Partial<Omit<Sucursal,  'estado' | 'fecha_creacion' | 'fecha_modificacion'>> & { 
  idSucursal: number 
};

export const useSucursal = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const getSucursal = useQuery({
    queryKey: ["Sucursal", token],
    queryFn: async (): Promise<Sucursal[]> => {
      const response = await get<Sucursal[]>("subsidiaries/all", token ?? undefined);

      if (!response.data) {
        throw new Error(response.message || "No se recibieron datos");
      }

      return response.data;
    },
    enabled: !!token,
  });

  const createSucursal = useMutation({
    mutationFn: async (bankData: CreateSucursalData) => {
      const response = await post<Sucursal>(
        "subsidiaries",
        bankData,
        token ?? undefined
      );
      if (!response.data) {
        throw new Error(response.message || "Error al crear ");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Sucursal"] });
      toast.success("Creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear ");
    },
  });

  const updateSucursal = useMutation({
    mutationFn: async (data: UpdaterSucursalData) => {
      const response = await put<Sucursal>(
        `subsidiaries/${data.idSucursal}`,
        data,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al actualizar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Sucursal"] });
      toast.success(" actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar ");
    },
  });

  const deleteSucursal = useMutation({
    mutationFn: async (id: number | undefined) => {
      const response = await remove<Sucursal>(
        `subsidiaries/${id}`,
        token ?? undefined
      );
      
      if (!response.data) {
         throw new Error(response.message || "Error al eliminar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Sucursal"] });
      toast.success(" eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar ");
    },
  });

  return {
    sucursales: getSucursal.data ?? [],
    isLoading: getSucursal.isLoading,
    isError: getSucursal.isError,
    error: getSucursal.error,

    createSucursal: createSucursal.mutate,
    createSucursalAsync: createSucursal.mutateAsync,
    isCreating: createSucursal.isPending,

    updateSucursal: updateSucursal.mutate,
    updateSucursalAsync: updateSucursal.mutateAsync,
    isUpdating: updateSucursal.isPending,

    deleteSucursal: deleteSucursal.mutate,
    deleteSucursalAsync: deleteSucursal.mutateAsync,
    isDeleting: deleteSucursal.isPending,
  };
};