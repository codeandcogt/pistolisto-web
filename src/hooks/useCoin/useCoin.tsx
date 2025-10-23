"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, remove } from "@/services";
import { Coin } from "@/types";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

type CreateCoinData = Omit<Coin, 'idMoneda' | 'estado' | 'fecha_creacion' | 'fecha_modificacion'>;

type UpdaterCoinData = Partial<Omit<Coin,  'estado' | 'fecha_creacion' | 'fecha_modificacion'>> & { 
  idMoneda: number 
};

export const useCoin = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const getCoin = useQuery({
    queryKey: ["Coin", token],
    queryFn: async (): Promise<Coin[]> => {
      const response = await get<Coin[]>("monedas", token ?? undefined);

      if (!response.data) {
        throw new Error(response.message || "No se recibieron datos");
      }

      return response.data;
    },
    enabled: !!token,
  });

  const createCoin = useMutation({
    mutationFn: async (bankData: CreateCoinData) => {
      const response = await post<Coin>(
        "monedas",
        bankData,
        token ?? undefined
      );
      if (!response.data) {
        throw new Error(response.message || "Error al crear ");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Coin"] });
      toast.success("Creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear ");
    },
  });

  const updateCoin = useMutation({
    mutationFn: async (CoinData: UpdaterCoinData) => {
      const response = await put<Coin>(
        `monedas/${CoinData.idMoneda}`,
        CoinData,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al actualizar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Coin"] });
      toast.success(" actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar ");
    },
  });

  const deleteCoin = useMutation({
    mutationFn: async (bankId: number | undefined) => {
      const response = await remove<Coin>(
        `monedas/${bankId}`,
        token ?? undefined
      );
      
      if (!response.data) {
         throw new Error(response.message || "Error al eliminar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Coin"] });
      toast.success(" eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar ");
    },
  });

  return {
    coins: getCoin.data ?? [],
    isLoading: getCoin.isLoading,
    isError: getCoin.isError,
    error: getCoin.error,

    createCoin: createCoin.mutate,
    createCoinAsync: createCoin.mutateAsync,
    isCreating: createCoin.isPending,

    updateCoin: updateCoin.mutate,
    updateCoinAsync: updateCoin.mutateAsync,
    isUpdating: updateCoin.isPending,

    deleteCoin: deleteCoin.mutate,
    deleteCoinAsync: deleteCoin.mutateAsync,
    isDeleting: deleteCoin.isPending,
  };
};