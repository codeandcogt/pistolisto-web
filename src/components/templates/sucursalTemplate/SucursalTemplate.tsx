"use client";

import { DataTable } from "@/components/organism/dataTable/DataTable";
import { useRouter } from "next/navigation";
import { createColumns } from "./Columns";
import { Modal } from "@/components/molecules";
import { useMemo } from "react";
import { getModalTexts } from "./const";
import { Button } from "@/components/ui/button";
import { SkeletonDataTable } from "@/components/organism";
import { useSucursal } from "@/hooks/useSucursal/useSucursal";
import { useSucursalStore } from "@/store";
import { BranchForm } from "./SucursalForm";

export function BranchTemplate() {
  const { sucursales, isLoading, isError, deleteSucursalAsync } = useSucursal();
  const {
    modal,
    openModalWithSucursal,
    openCreateModal,
    toggleModal,
    modalMode,
    selectSucursal,
  } = useSucursalStore();
  const router = useRouter();

  const columns = useMemo(
    () =>
      createColumns(
        (branch) => openModalWithSucursal(branch, "edit"),
        (branch) => {
          openModalWithSucursal(branch, "delete");
        }
      ),
    [openModalWithSucursal]
  );

  if (isLoading) return <SkeletonDataTable />;
  if (isError) router.push("/unauthorized");

  const handleAddBranch = () => {
    openCreateModal();
  };

  const handlerDelete = () => {
    if (selectSucursal?.idSucursal) {
      deleteSucursalAsync(selectSucursal.idSucursal);
      toggleModal();
    }
  };

  const modalTexts = getModalTexts(modalMode);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Sucursales</h1>
        <p className="text-muted-foreground">
          Gestiona las sucursales del sistema
        </p>
      </div>

      <DataTable
        columns={columns}
        data={sucursales}
        searchKey="nombre"
        searchPlaceholder="Buscar por nombre o código..."
        onAdd={handleAddBranch}
        addButtonLabel="Agregar Sucursal"
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
                Sucursal:{" "}
                <span className="font-semibold">{selectSucursal?.nombre}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Código:{" "}
                <span className="font-semibold">{selectSucursal?.codigo}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Dirección:{" "}
                <span className="font-semibold">{selectSucursal?.direccion}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Horario:{" "}
                <span className="font-semibold">
                  {selectSucursal?.hora_apertura} - {selectSucursal?.hora_cierre}
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
          <BranchForm
            mode={modalMode as "create" | "edit"}
            branch={selectSucursal || undefined}
          />
        )}
      </Modal>
    </div>
  );
}