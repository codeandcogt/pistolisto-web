"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, remove } from "@/services";
import { Municipio } from "@/types";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

type CreateMunicipalidadData = Omit<Municipio, 'idMunicipio' | 'estado' | 'fecha_creacion' | 'fecha_modificacion'>;

type UpdaterMunicipioData = Partial<Omit<Municipio,  'estado' | 'fecha_creacion' | 'fecha_modificacion'>> & { 
  idMunicipio: number 
};

export const useMunicipalidad = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const getMunicipio = useQuery({
    queryKey: ["Municipio", token],
    queryFn: async (): Promise<Municipio[]> => {
      const response = await get<Municipio[]>("municipalities/all", token ?? undefined);

      if (!response.data) {
        throw new Error(response.message || "No se recibieron datos");
      }

      return response.data;
    },
    enabled: !!token,
  });

  const createMunicipio = useMutation({
    mutationFn: async (bankData: CreateMunicipalidadData) => {
      const response = await post<Municipio>(
        "municipalities",
        bankData,
        token ?? undefined
      );
      if (!response.data) {
        throw new Error(response.message || "Error al crear ");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Municipio"] });
      toast.success("Creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear ");
    },
  });

  const updatMunicipio = useMutation({
    mutationFn: async (municipioData: UpdaterMunicipioData) => {
      const response = await put<Municipio>(
        `municipalities/${municipioData.idMunicipio}`,
        municipioData,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al actualizar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Municipio"] });
      toast.success(" actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar ");
    },
  });

  const deleteMunicipio = useMutation({
    mutationFn: async (id: number | undefined) => {
      const response = await remove<Municipio>(
        `municipalities/${id}`,
        token ?? undefined
      );
      
      if (!response.data) {
         throw new Error(response.message || "Error al eliminar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Municipio"] });
      toast.success(" eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar ");
    },
  });

  return {
    municipios: getMunicipio.data ?? [],
    isLoading: getMunicipio.isLoading,
    isError: getMunicipio.isError,
    error: getMunicipio.error,

    createMunicipio: createMunicipio.mutate,
    createMunicipioAsync: createMunicipio.mutateAsync,
    isCreating: createMunicipio.isPending,

    updatMunicipio: updatMunicipio.mutate,
    updateMunicipioAsync: updatMunicipio.mutateAsync,
    isUpdating: updatMunicipio.isPending,

    deleteMunicipio: deleteMunicipio.mutate,
    deleteMunicipioAsync: deleteMunicipio.mutateAsync,
    isDeleting: deleteMunicipio.isPending,
  };
};