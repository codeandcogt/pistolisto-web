"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, remove } from "@/services";
import { RolPermiso } from "@/types";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

type CreateRoleData = Omit<RolPermiso, 'id_rol_permiso' | 'estado' | 'fecha_creacion' | 'fecha_modificacion'>;

type UpdateroleData = Partial<Omit<RolPermiso,  'estado' | 'fecha_creacion' | 'fecha_modificacion'>> & { 
  id_rol_permiso: number 
};

export const useRolePermission = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const getRolePermission = useQuery({
    queryKey: ["rolePermission", token],
    queryFn: async (): Promise<RolPermiso[]> => {
      const response = await get<RolPermiso[]>("rolPermiso/all", token ?? undefined);

      if (!response.data) {
        throw new Error(response.message || "No se recibieron datos");
      }

      return response.data;
    },
    enabled: !!token,
  });

  const createRolePermission = useMutation({
    mutationFn: async (roleDataPermission: CreateRoleData) => {
      const response = await post<RolPermiso>(
        "rolPermiso",
        roleDataPermission,
        token ?? undefined
      );
      if (!response.data) {
        throw new Error(response.message || "Error al crear ");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rolePermission"] });
      toast.success("Creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear ");
    },
  });

  const updateRolePermission = useMutation({
    mutationFn: async (roleDataPermission: UpdateroleData) => {
      const response = await put<RolPermiso>(
        `rolPermiso/${roleDataPermission.id_rol}`,
        roleDataPermission,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al actualizar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rolePermission"] });
      toast.success(" actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar ");
    },
  });

  const deleteRolePermission = useMutation({
    mutationFn: async (Id: number | undefined) => {
      const response = await remove<RolPermiso>(
        `rolPermiso/${Id}`,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al eliminar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rolePermission"] });
      toast.success(" eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar ");
    },
  });

  return {
    rolesPermissions: getRolePermission.data ?? [],
    isLoading: getRolePermission.isLoading,
    isError: getRolePermission.isError,
    error: getRolePermission.error,

    createRolePermission: createRolePermission.mutate,
    createRolePermissionAsync: createRolePermission.mutateAsync,
    isCreating: createRolePermission.isPending,

    updateRolePermission: updateRolePermission.mutate,
    updateRolePermissionAsync: updateRolePermission.mutateAsync,
    isUpdating: updateRolePermission.isPending,

    deleteRolePermission: deleteRolePermission.mutate,
    deleteRolePermissionAsync: deleteRolePermission.mutateAsync,
    isDeleting: deleteRolePermission.isPending,
  };
};