"use client";

import { DataTable } from "@/components/organism/dataTable/DataTable";
import { useRouter } from "next/navigation";
import { createColumns } from "./Columns";
import { Modal } from "@/components/molecules";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SkeletonDataTable } from "@/components/organism";
import { useVehiculo } from "@/hooks/useVehiculo/useVehiculo";
import { useVehiculoStore } from "@/store/vehiculo";
import { getModalTexts } from "./const";
import { VehicleForm } from "./VehiculoForm";

export function VehicleTemplate() {
  const { vehiculos, isLoading, isError, deleteVehiculoAsync } = useVehiculo();
  const {
    modal,
    openModalWithVehiculo,
    openCreateModal,
    toggleModal,
    modalMode,
    selectedVehiculo,
  } = useVehiculoStore();
  const router = useRouter();

  const columns = useMemo(
    () =>
      createColumns(
        (vehicle) => openModalWithVehiculo(vehicle, "edit"),
        (vehicle) => {
          openModalWithVehiculo(vehicle, "delete");
        }
      ),
    [openModalWithVehiculo]
  );

  if (isLoading) return <SkeletonDataTable />;
  if (isError) router.push("/unauthorized");

  const handleAddVehicle = () => {
    openCreateModal();
  };

  const handlerDelete = () => {
    if (selectedVehiculo?.idVehiculo) {
      deleteVehiculoAsync(selectedVehiculo.idVehiculo);
      toggleModal();
    }
  };

  const modalTexts = getModalTexts(modalMode);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Vehículos</h1>
        <p className="text-muted-foreground">
          Gestiona la flota de vehículos del sistema
        </p>
      </div>

      <DataTable
        columns={columns}
        data={vehiculos}
        searchKey="placa"
        searchPlaceholder="Buscar por placa, marca o modelo..."
        onAdd={handleAddVehicle}
        addButtonLabel="Agregar Vehículo"
      />

      <Modal
        title={modalTexts.title}
        subtitle={modalTexts.subtitle}
        open={modal}
        toggle={toggleModal}
      >
        {modalMode === "delete" ? (
          <div className="space-y-4">
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-2">
                Vehículo:{" "}
                <span className="font-semibold">
                  {selectedVehiculo?.marca} {selectedVehiculo?.modelo}
                </span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Placa:{" "}
                <span className="font-semibold">{selectedVehiculo?.placa}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Tipo:{" "}
                <span className="font-semibold">{selectedVehiculo?.tipo}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Kilometraje:{" "}
                <span className="font-semibold">{selectedVehiculo?.kilometraje} km</span>
              </p>
            </div>
            <div className="sticky bottom-0 bg-background pt-4 border-t flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={toggleModal}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                type="button"
                onClick={handlerDelete}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ) : (
          <VehicleForm
            mode={modalMode as "create" | "edit"}
            vehicle={selectedVehiculo || undefined}
          />
        )}
      </Modal>
    </div>
  );
}