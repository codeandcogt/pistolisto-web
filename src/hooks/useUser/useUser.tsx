"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, remove } from "@/services";
import { User } from "@/types";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

type CreateUserData = Omit<User, 'id_administrativo' | 'primer_login' | 'estado' | 'fecha_creacion' | 'fecha_modificacion'>;

type UpdateUserData = Partial<Omit<User, 'primer_login' | 'estado' | 'fecha_creacion' | 'fecha_modificacion'>> & { 
  id_administrativo: number 
};

export const useUser = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const getUsers = useQuery({
    queryKey: ["users", token],
    queryFn: async (): Promise<User[]> => {
      const response = await get<User[]>("admin/all", token ?? undefined);

      if (!response.data) {
        throw new Error(response.message || "No se recibieron datos");
      }

      return response.data;
    },
    enabled: !!token,
  });

  const createUser = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      console.log(JSON.stringify(userData))
      const response = await post<User>(
        "admin",
        userData,
        token ?? undefined
      );
      if (!response.data) {
        throw new Error(response.message || "Error al crear usuario");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear usuario");
    },
  });

  const updateUser = useMutation({
    mutationFn: async (userData: UpdateUserData) => {
      const response = await put<User>(
        `admin/${userData.id_administrativo}`,
        userData,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al actualizar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar usuario");
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: number | undefined) => {
      const response = await remove<User>(
        `admin/${userId}`,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al eliminar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar usuario");
    },
  });

  return {
    users: getUsers.data ?? [],
    isLoading: getUsers.isLoading,
    isError: getUsers.isError,
    error: getUsers.error,

    createUser: createUser.mutate,
    createUserAsync: createUser.mutateAsync,
    isCreating: createUser.isPending,

    updateUser: updateUser.mutate,
    updateUserAsync: updateUser.mutateAsync,
    isUpdating: updateUser.isPending,

    deleteUser: deleteUser.mutate,
    deleteUserAsync: deleteUser.mutateAsync,
    isDeleting: deleteUser.isPending,
  };
};