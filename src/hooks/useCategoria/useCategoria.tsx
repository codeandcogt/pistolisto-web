"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, remove } from "@/services";
import { Categoria } from "@/types";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

type CreateCategoriaData = Omit<Categoria, 'id_categoria' | 'estado' | 'fecha_creacion' | 'fecha_modificacion'>;

type UpdateCategoriaData = Partial<Omit<Categoria,  'estado' | 'fecha_creacion' | 'fecha_modificacion'>> & { 
  id_categoria: number 
};

export const useCategoria = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const getCategoria = useQuery({
    queryKey: ["Categoria", token],
    queryFn: async (): Promise<Categoria[]> => {
      const response = await get<Categoria[]>("categoria/all", token ?? undefined);

      if (!response.data) {
        throw new Error(response.message || "No se recibieron datos");
      }

      return response.data;
    },
    enabled: !!token,
  });

  const createCategoria = useMutation({
    mutationFn: async (data: CreateCategoriaData) => {
      const response = await post<Categoria>(
        "categoria",
        data,
        token ?? undefined
      );
      if (!response.data) {
        throw new Error(response.message || "Error al crear ");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Categoria"] });
      toast.success("Creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear ");
    },
  });

  const updateCategoria = useMutation({
    mutationFn: async (data: UpdateCategoriaData) => {
      const response = await put<Categoria>(
        `categoria/${data.id_categoria}`,
        data,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al actualizar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Categoria"] });
      toast.success(" actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar ");
    },
  });

  const deleteCategoria = useMutation({
    mutationFn: async (roleId: number | undefined) => {
      const response = await remove<Categoria>(
        `categoria/${roleId}`,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al eliminar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Categoria"] });
      toast.success(" eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar ");
    },
  });

  return {
    categoria: getCategoria.data ?? [],
    isLoading: getCategoria.isLoading,
    isError: getCategoria.isError,
    error: getCategoria.error,

    createCategoria: createCategoria.mutate,
    createCategoriaAsync: createCategoria.mutateAsync,
    isCreating: createCategoria.isPending,

    updateCategoria: updateCategoria.mutate,
    updateCategoriaAsync: updateCategoria.mutateAsync,
    isUpdating: updateCategoria.isPending,

    deleteCategoria: deleteCategoria.mutate,
    deleteCategoriaAsync: deleteCategoria.mutateAsync,
    isDeleting: deleteCategoria.isPending,
  };
};