"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, remove } from "@/services";
import { Piloto } from "@/types";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

type CreatePilotosData = Omit<Piloto, 'idPiloto' | 'estado' | 'fechaCreacion' | 'fechaModificacion'>;

type UpdatePilotosData = Partial<Omit<Piloto,  'estado' | 'fechaCreacion' | 'fechaModificacion'>> & { 
  idPiloto: number 
};

export const usePiloto = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const getPilotos = useQuery({
    queryKey: ["Pilotos", token],
    queryFn: async (): Promise<Piloto[]> => {
      const response = await get<Piloto[]>("pilotos", token ?? undefined);

      if (!response.data) {
        throw new Error(response.message || "No se recibieron datos");
      }

      return response.data;
    },
    enabled: !!token,
  });

  const createPilotos = useMutation({
    mutationFn: async (data: CreatePilotosData) => {
      const response = await post<Piloto>(
        "pilotos",
        data,
        token ?? undefined
      );
      if (!response.data) {
        throw new Error(response.message || "Error al crear ");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Pilotos"] });
      toast.success("Creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear ");
    },
  });

  const updatePilotos = useMutation({
    mutationFn: async (data: UpdatePilotosData) => {
      const response = await put<Piloto>(
        `pilotos/${data.idPiloto}`,
        data,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al actualizar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Pilotos"] });
      toast.success(" actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar ");
    },
  });

  const deletePilotos = useMutation({
    mutationFn: async (roleId: number | undefined) => {
      const response = await remove<Piloto>(
        `pilotos/${roleId}`,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al eliminar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Pilotos"] });
      toast.success(" eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar ");
    },
  });

  return {
    pilotos: getPilotos.data ?? [],
    isLoading: getPilotos.isLoading,
    isError: getPilotos.isError,
    error: getPilotos.error,

    createPilotos: createPilotos.mutate,
    createPilotosAsync: createPilotos.mutateAsync,
    isCreating: createPilotos.isPending,

    updatePilotos: updatePilotos.mutate,
    updatePilotosAsync: updatePilotos.mutateAsync,
    isUpdating: updatePilotos.isPending,

    deletePilotos: deletePilotos.mutate,
    deletePilotosAsync: deletePilotos.mutateAsync,
    isDeleting: deletePilotos.isPending,
  };
};