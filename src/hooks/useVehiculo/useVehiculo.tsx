"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, remove } from "@/services";
import { Vehiculo } from "@/types";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

type CreateVehiculoData = Omit<Vehiculo, 'idVehiculo' | 'estado' | 'fechaCreacion' | 'fechaModificacion'>;

type UpdateVehiculoData = Partial<Omit<Vehiculo,  'estado' | 'fechaCreacion' | 'fechaModificacion'>> & { 
  idVehiculo: number 
};

export const useVehiculo = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const getVehiculo = useQuery({
    queryKey: ["Vehiculo", token],
    queryFn: async (): Promise<Vehiculo[]> => {
      const response = await get<Vehiculo[]>("vehiculos", token ?? undefined);

      if (!response.data) {
        throw new Error(response.message || "No se recibieron datos");
      }

      return response.data;
    },
    enabled: !!token,
  });

  const createVehiculo = useMutation({
    mutationFn: async (data: CreateVehiculoData) => {
      const response = await post<Vehiculo>(
        "vehiculos",
        data,
        token ?? undefined
      );
      if (!response.data) {
        throw new Error(response.message || "Error al crear ");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Vehiculo"] });
      toast.success("Creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear ");
    },
  });

  const updateVehiculo = useMutation({
    mutationFn: async (data: UpdateVehiculoData) => {
      const response = await put<Vehiculo>(
        `vehiculos/${data.idVehiculo}`,
        data,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al actualizar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Vehiculo"] });
      toast.success(" actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar ");
    },
  });

  const deleteVehiculo = useMutation({
    mutationFn: async (roleId: number | undefined) => {
      const response = await remove<Vehiculo>(
        `vehiculos/${roleId}`,
        token ?? undefined
      );

      if (!response.data) {
        throw new Error(response.message || "Error al eliminar");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Vehiculo"] });
      toast.success(" eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar ");
    },
  });

  return {
    vehiculos: getVehiculo.data ?? [],
    isLoading: getVehiculo.isLoading,
    isError: getVehiculo.isError,
    error: getVehiculo.error,

    createVehiculo: createVehiculo.mutate,
    createVehiculoAsync: createVehiculo.mutateAsync,
    isCreating: createVehiculo.isPending,

    updateVehiculo: updateVehiculo.mutate,
    updateVehiculoAsync: updateVehiculo.mutateAsync,
    isUpdating: updateVehiculo.isPending,

    deleteVehiculo: deleteVehiculo.mutate,
    deleteVehiculoAsync: deleteVehiculo.mutateAsync,
    isDeleting: deleteVehiculo.isPending,
  };
};