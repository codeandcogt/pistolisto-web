"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, remove } from "@/services";
import { Bank } from "@/types";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

type CreateBankData = Omit<Bank, 'idBanco' | 'estado' | 'fecha_creacion' | 'fecha_modificacion'>;

type UpdaterBankData = Partial<Omit<Bank,  'estado' | 'fecha_creacion' | 'fecha_modificacion'>> & { 
  idBanco: number 
};

export const useBank = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const getBank = useQuery({
    queryKey: ["bank", token],
    queryFn: async (): Promise<Bank[]> => {
      const response = await get<Bank[]>("bancos", token ?? undefined);

      if (!response.data) {
        throw new Error(response.message || "No se recibieron datos");
      }

      return response.data;
    },
    enabled: !!token,
  });

  const createBank = useMutation({
    mutationFn: async (bankData: CreateBankData) => {
      const response = await post<Bank>(
        "bancos",
        bankData,
        token ?? undefined
      );
      if (!response.data) {
        throw new Error(response.message || "Error al crear ");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank"] });
      toast.success("Creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear ");
    },
  });

  const updateBank = useMutation({
    mutationFn: async (bankData: UpdaterBankData) => {
      const response = await put<Bank>(
        `bancos/${bankData.idBanco}`,
        bankData,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al actualizar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank"] });
      toast.success(" actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar ");
    },
  });

  const deleteBank = useMutation({
    mutationFn: async (bankId: number | undefined) => {
      const response = await remove<Bank>(
        `bancos/${bankId}`,
        token ?? undefined
      );
      
      if (!response.data) {
         throw new Error(response.message || "Error al eliminar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank"] });
      toast.success(" eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar ");
    },
  });

  return {
    banks: getBank.data ?? [],
    isLoading: getBank.isLoading,
    isError: getBank.isError,
    error: getBank.error,

    createBank: createBank.mutate,
    createBankAsync: createBank.mutateAsync,
    isCreating: createBank.isPending,

    updateBank: updateBank.mutate,
    updateBankAsync: updateBank.mutateAsync,
    isUpdating: updateBank.isPending,

    deleteBank: deleteBank.mutate,
    deleteBankAsync: deleteBank.mutateAsync,
    isDeleting: deleteBank.isPending,
  };
};