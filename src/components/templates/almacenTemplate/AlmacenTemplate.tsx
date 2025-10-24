"use client";

import { DataTable } from "@/components/organism/dataTable/DataTable";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/molecules";
import { useMemo } from "react";
import { getModalTexts } from "./const";
import { Button } from "@/components/ui/button";
import { SkeletonDataTable } from "@/components/organism";
import { useAlmacen } from "@/hooks/useAlmacen/useAlmacen";
import { useWarehouseStore } from "@/store/almacen/useAlmacenStore";
import { WarehouseForm } from "./AlmacenForm";
import { createColumns } from "./Columns";

export function WarehouseTemplate() {
  const { almacenes, isLoading, isError, deleteAlmacenAsync } = useAlmacen();
  const {
    modal,
    openModalWithWarehouse,
    openCreateModal,
    toggleModal,
    modalMode,
    selectedWarehouse,
  } = useWarehouseStore();
  const router = useRouter();

  const columns = useMemo(
    () =>
      createColumns(
        (warehouse) => openModalWithWarehouse(warehouse, "edit"),
        (warehouse) => {
          openModalWithWarehouse(warehouse, "delete");
        }
      ),
    [openModalWithWarehouse]
  );

  if (isLoading) return <SkeletonDataTable />;
  if (isError) router.push("/unauthorized");

  const handleAddWarehouse = () => {
    openCreateModal();
  };

  const handlerDelete = () => {
    if (selectedWarehouse?.id_almacen) {
      deleteAlmacenAsync(selectedWarehouse.id_almacen);
      toggleModal();
    }
  };

  const modalTexts = getModalTexts(modalMode);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Almacenes</h1>
        <p className="text-muted-foreground">
          Gestiona los almacenes del sistema
        </p>
      </div>

      <DataTable
        columns={columns}
        data={almacenes}
        searchKey="nombre"
        searchPlaceholder="Buscar por nombre o código..."
        onAdd={handleAddWarehouse}
        addButtonLabel="Agregar Almacén"
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
                Almacén:{" "}
                <span className="font-semibold">{selectedWarehouse?.nombre}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Código:{" "}
                <span className="font-semibold">{selectedWarehouse?.codigo}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Tipo:{" "}
                <span className="font-semibold">{selectedWarehouse?.tipo_almacen}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Capacidad Máxima:{" "}
                <span className="font-semibold">
                  {selectedWarehouse?.capacidad_maxima} unidades
                </span>
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
          <WarehouseForm
            mode={modalMode as "create" | "edit"}
            warehouse={selectedWarehouse || undefined}
          />
        )}
      </Modal>
    </div>
  );
}