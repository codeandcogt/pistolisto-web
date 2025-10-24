"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, remove } from "@/services";
import { Producto } from "@/types";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

type CreateProductoData = Omit<Producto, 'id_producto' | 'estado' | 'fecha_creacion' | 'fecha_modificacion'>;

type UpdateProductoData = Partial<Omit<Producto,  'estado' | 'fecha_creacion' | 'fecha_modificacion'>> & { 
  id_producto: number 
};

export const useProducto = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const getProducto = useQuery({
    queryKey: ["Producto", token],
    queryFn: async (): Promise<Producto[]> => {
      const response = await get<Producto[]>("productos/all", token ?? undefined);

      if (!response.data) {
        throw new Error(response.message || "No se recibieron datos");
      }

      return response.data;
    },
    enabled: !!token,
  });

  const createProducto = useMutation({
    mutationFn: async (data: CreateProductoData) => {
      const response = await post<Producto>(
        "productos",
        data,
        token ?? undefined
      );
      if (!response.data) {
        throw new Error(response.message || "Error al crear ");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Producto"] });
      toast.success("Creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear ");
    },
  });

  const updateProducto = useMutation({
    mutationFn: async (data: UpdateProductoData) => {
      const response = await put<Producto>(
        `productos/${data.id_producto}`,
        data,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al actualizar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Producto"] });
      toast.success(" actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar ");
    },
  });

  const deleteProducto = useMutation({
    mutationFn: async (roleId: number | undefined) => {
      const response = await remove<Producto>(
        `productos/${roleId}`,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al eliminar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Producto"] });
      toast.success(" eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar ");
    },
  });

  return {
    productos: getProducto.data ?? [],
    isLoading: getProducto.isLoading,
    isError: getProducto.isError,
    error: getProducto.error,

    createProducto: createProducto.mutate,
    createProductoAsync: createProducto.mutateAsync,
    isCreating: createProducto.isPending,

    updateProducto: updateProducto.mutate,
    updateProductoAsync: updateProducto.mutateAsync,
    isUpdating: updateProducto.isPending,

    deleteProducto: deleteProducto.mutate,
    deleteProductoAsync: deleteProducto.mutateAsync,
    isDeleting: deleteProducto.isPending,
  };
};