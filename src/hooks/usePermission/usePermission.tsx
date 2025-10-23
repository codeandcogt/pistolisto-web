"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, remove } from "@/services";
import { Permissions } from "@/types";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

type CreatepermissionData = Omit<Permissions, 'id_permiso' | 'estado' | 'fecha_creacion' | 'fecha_modificacion'>;

type UpdatepermissionData = Partial<Omit<Permissions,  'estado' | 'fecha_creacion' | 'fecha_modificacion'>> & { 
  id_permiso: number 
};

export const usePermission = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const getPermission = useQuery({
    queryKey: ["permission", token],
    queryFn: async (): Promise<Permissions[]> => {
      const response = await get<Permissions[]>("permiso/all", token ?? undefined);

      if (!response.data) {
        throw new Error(response.message || "No se recibieron datos");
      }

      return response.data;
    },
    enabled: !!token,
  });

  const createPermission = useMutation({
    mutationFn: async (PermissionData: CreatepermissionData) => {
      const response = await post<Permissions>(
        "permiso",
        PermissionData,
        token ?? undefined
      );
      if (!response.data) {
        throw new Error(response.message || "Error al crear ");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permission"] });
      toast.success("Creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear ");
    },
  });

  const updatePermission = useMutation({
    mutationFn: async (PermissionData: UpdatepermissionData) => {
      const response = await put<Permissions>(
        `permiso/${PermissionData.id_permiso}`,
        PermissionData,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al actualizar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permission"] });
      toast.success(" actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar ");
    },
  });

  const deletePermission = useMutation({
    mutationFn: async (permissionId: number | undefined) => {
      const response = await remove<Permissions>(
        `permiso/${permissionId}`,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al eliminar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permission"] });
      toast.success(" eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar ");
    },
  });

  return {
    permissions: getPermission.data ?? [],
    isLoading: getPermission.isLoading,
    isError: getPermission.isError,
    error: getPermission.error,

    createPermission: createPermission.mutate,
    createPermissionAsync: createPermission.mutateAsync,
    isCreating: createPermission.isPending,

    updatePermission: updatePermission.mutate,
    updatePermissionAsync: updatePermission.mutateAsync,
    isUpdating: updatePermission.isPending,

    deletePermission: deletePermission.mutate,
    deletePermissionAsync: deletePermission.mutateAsync,
    isDeleting: deletePermission.isPending,
  };
};