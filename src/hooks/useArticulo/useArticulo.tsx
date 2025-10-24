"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, remove } from "@/services";
import { Articulo } from "@/types";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

type CreateArticuloData = Omit<Articulo, 'idArticulo' | 'estado' | 'fecha_creacion' | 'fecha_modificacion'>;

type UpdateArticuloData = Partial<Omit<Articulo,  'estado' | 'fecha_creacion' | 'fecha_modificacion'>> & { 
  idArticulo: number 
};

export const useArticulo = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const getArticulo = useQuery({
    queryKey: ["articulo", token],
    queryFn: async (): Promise<Articulo[]> => {
      const response = await get<Articulo[]>("articulos/all", token ?? undefined);

      if (!response.data) {
        throw new Error(response.message || "No se recibieron datos");
      }

      return response.data;
    },
    enabled: !!token,
  });

  const createArticulo = useMutation({
    mutationFn: async (data: CreateArticuloData) => {
      const response = await post<Articulo>(
        "articulos",
        data,
        token ?? undefined
      );
      if (!response.data) {
        throw new Error(response.message || "Error al crear ");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articulo"] });
      toast.success("Creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear ");
    },
  });

  const updateArticulo = useMutation({
    mutationFn: async (data: UpdateArticuloData) => {
      const response = await put<Articulo>(
        `articulos/${data.idArticulo}`,
        data,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al actualizar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articulo"] });
      toast.success(" actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar ");
    },
  });

  const deleteArticulo = useMutation({
    mutationFn: async (roleId: number | undefined) => {
      const response = await remove<Articulo>(
        `articulos/${roleId}`,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al eliminar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articulo"] });
      toast.success(" eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar ");
    },
  });

  return {
    articulos: getArticulo.data ?? [],
    isLoading: getArticulo.isLoading,
    isError: getArticulo.isError,
    error: getArticulo.error,

    createArticulo: createArticulo.mutate,
    createArticuloAsync: createArticulo.mutateAsync,
    isCreating: createArticulo.isPending,

    updateArticulo: updateArticulo.mutate,
    updateArticuloAsync: updateArticulo.mutateAsync,
    isUpdating: updateArticulo.isPending,

    deleteArticulo: deleteArticulo.mutate,
    deleteArticuloAsync: deleteArticulo.mutateAsync,
    isDeleting: deleteArticulo.isPending,
  };
};