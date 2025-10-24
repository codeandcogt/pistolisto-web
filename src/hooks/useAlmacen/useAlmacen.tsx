"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, remove } from "@/services";
import { Almacen } from "@/types";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

type CreateAlmacenData = Omit<Almacen, 'id_almacen' | 'estado' | 'fecha_creacion' | 'fecha_modificacion'>;

type UpdaterAlmacenData = Partial<Omit<Almacen,  'estado' | 'fecha_creacion' | 'fecha_modificacion'>> & { 
  id_almacen: number 
};

export const useAlmacen = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const getAlmacen = useQuery({
    queryKey: ["Almacen", token],
    queryFn: async (): Promise<Almacen[]> => {
      const response = await get<Almacen[]>("almacen/all", token ?? undefined);

      if (!response.data) {
        throw new Error(response.message || "No se recibieron datos");
      }

      return response.data;
    },
    enabled: !!token,
  });

  const createAlmacen = useMutation({
    mutationFn: async (bankData: CreateAlmacenData) => {
      const response = await post<Almacen>(
        "almacen",
        bankData,
        token ?? undefined
      );
      if (!response.data) {
        throw new Error(response.message || "Error al crear ");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Almacen"] });
      toast.success("Creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear ");
    },
  });

  const updateAlmacen = useMutation({
    mutationFn: async (data: UpdaterAlmacenData) => {
      const response = await put<Almacen>(
        `almacen/${data.id_almacen}`,
        data,
        token ?? undefined
      );
      console.log(JSON.stringify(data))
      console.log(response)
      if (!response.data) {
        throw new Error(response.message || "Error al actualizar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Almacen"] });
      toast.success(" actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar ");
    },
  });

  const deleteAlmacen = useMutation({
    mutationFn: async (id: number | undefined) => {
      const response = await remove<Almacen>(
        `almacen/${id}`,
        token ?? undefined
      );
      
      if (!response.data) {
         throw new Error(response.message || "Error al eliminar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Almacen"] });
      toast.success(" eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar ");
    },
  });

  return {
    almacenes: getAlmacen.data ?? [],
    isLoading: getAlmacen.isLoading,
    isError: getAlmacen.isError,
    error: getAlmacen.error,

    createAlmacen: createAlmacen.mutate,
    createAlmacenAsync: createAlmacen.mutateAsync,
    isCreating: createAlmacen.isPending,

    updateAlmacen: updateAlmacen.mutate,
    updateAlmacenAsync: updateAlmacen.mutateAsync,
    isUpdating: updateAlmacen.isPending,

    deleteAlmacen: deleteAlmacen.mutate,
    deleteAlmacenAsync: deleteAlmacen.mutateAsync,
    isDeleting: deleteAlmacen.isPending,
  };
};