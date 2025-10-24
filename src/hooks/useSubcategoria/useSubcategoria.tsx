"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, remove } from "@/services";
import { SubCategoria } from "@/types";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

type CreateSubCategoriaData = Omit<SubCategoria, 'idSubCategoria' | 'estado' | 'fecha_creacion' | 'fecha_modificacion'>;

type UpdateSubCategoriaData = Partial<Omit<SubCategoria,  'estado' | 'fecha_creacion' | 'fecha_modificacion'>> & { 
  idSubCategoria: number 
};

export const useSubCategoria = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const getSubCategoria = useQuery({
    queryKey: ["SubCategoria", token],
    queryFn: async (): Promise<SubCategoria[]> => {
      const response = await get<SubCategoria[]>("subcategories/all", token ?? undefined);

      if (!response.data) {
        throw new Error(response.message || "No se recibieron datos");
      }

      return response.data;
    },
    enabled: !!token,
  });

  const createSubCategoria = useMutation({
    mutationFn: async (data: CreateSubCategoriaData) => {
      const response = await post<SubCategoria>(
        "subcategories",
        data,
        token ?? undefined
      );
      if (!response.data) {
        throw new Error(response.message || "Error al crear ");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SubCategoria"] });
      toast.success("Creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear ");
    },
  });

  const updateSubCategoria = useMutation({
    mutationFn: async (data: UpdateSubCategoriaData) => {
      const response = await put<SubCategoria>(
        `subcategories/${data.idSubCategoria}`,
        data,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al actualizar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SubCategoria"] });
      toast.success(" actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar ");
    },
  });

  const deleteSubCategoria = useMutation({
    mutationFn: async (roleId: number | undefined) => {
      const response = await remove<SubCategoria>(
        `subcategories/${roleId}`,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al eliminar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SubCategoria"] });
      toast.success(" eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar ");
    },
  });

  return {
    subcategories: getSubCategoria.data ?? [],
    isLoading: getSubCategoria.isLoading,
    isError: getSubCategoria.isError,
    error: getSubCategoria.error,

    createSubCategoria: createSubCategoria.mutate,
    createSubCategoriaAsync: createSubCategoria.mutateAsync,
    isCreating: createSubCategoria.isPending,

    updateSubCategoria: updateSubCategoria.mutate,
    updateSubCategoriaAsync: updateSubCategoria.mutateAsync,
    isUpdating: updateSubCategoria.isPending,

    deleteSubCategoria: deleteSubCategoria.mutate,
    deleteSubCategoriaAsync: deleteSubCategoria.mutateAsync,
    isDeleting: deleteSubCategoria.isPending,
  };
};