"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, remove } from "@/services";
import { Role } from "@/types";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

type CreateRoleData = Omit<Role, 'id_rol' | 'estado' | 'fecha_creacion' | 'fecha_modificacion'>;

type UpdateroleData = Partial<Omit<Role,  'estado' | 'fecha_creacion' | 'fecha_modificacion'>> & { 
  id_rol: number 
};

export const useRole = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const getRole = useQuery({
    queryKey: ["role", token],
    queryFn: async (): Promise<Role[]> => {
      const response = await get<Role[]>("rol/all", token ?? undefined);

      if (!response.data) {
        throw new Error(response.message || "No se recibieron datos");
      }

      return response.data;
    },
    enabled: !!token,
  });

  const createRole = useMutation({
    mutationFn: async (roleData: CreateRoleData) => {
      const response = await post<Role>(
        "rol",
        roleData,
        token ?? undefined
      );
      if (!response.data) {
        throw new Error(response.message || "Error al crear ");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role"] });
      toast.success("Creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear ");
    },
  });

  const updateRole = useMutation({
    mutationFn: async (roleData: UpdateroleData) => {
      const response = await put<Role>(
        `rol/${roleData.id_rol}`,
        roleData,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al actualizar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role"] });
      toast.success(" actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar ");
    },
  });

  const deleteRole = useMutation({
    mutationFn: async (roleId: number | undefined) => {
      const response = await remove<Role>(
        `rol/${roleId}`,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al eliminar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role"] });
      toast.success(" eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar ");
    },
  });

  return {
    roles: getRole.data ?? [],
    isLoading: getRole.isLoading,
    isError: getRole.isError,
    error: getRole.error,

    createRole: createRole.mutate,
    createRoleAsync: createRole.mutateAsync,
    isCreating: createRole.isPending,

    updateRole: updateRole.mutate,
    updateRoleAsync: updateRole.mutateAsync,
    isUpdating: updateRole.isPending,

    deleteRole: deleteRole.mutate,
    deleteRoleAsync: deleteRole.mutateAsync,
    isDeleting: deleteRole.isPending,
  };
};