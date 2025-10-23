"use client";

import { DataTable } from "@/components/organism/dataTable/DataTable";
import { useBank } from "@/hooks/useBank/useBank";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/molecules";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SkeletonDataTable } from "@/components/organism";
import { useBankStore } from "@/store";
import { createColumns } from "./Columns";
import { getModalTexts } from "./const";
import { BankForm } from "./BankForm";

export function BankTemplate() {
  const { banks, isLoading, isError, deleteBankAsync } = useBank();
  const {
    modal,
    openModalWithBank,
    openCreateModal,
    toggleModal,
    modalMode,
    selectBank,
  } = useBankStore();
  const router = useRouter();

  const columns = useMemo(
    () =>
      createColumns(
        (bank) => openModalWithBank(bank, "edit"),
        (bank) => {
          openModalWithBank(bank, "delete");
        }
      ),
    [openModalWithBank]
  );

  if (isLoading) return <SkeletonDataTable />;
  if (isError) router.push("/unauthorized");

  const handleAddBank = () => {
    openCreateModal();
  };

  const handlerDelete = () => {
    if (selectBank?.idBanco) {
      deleteBankAsync(selectBank.idBanco);
      toggleModal();
    }
  };

  const modalTexts = getModalTexts(modalMode);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bancos</h1>
        <p className="text-muted-foreground">
          Gestiona los bancos del sistema
        </p>
      </div>

      <DataTable
        columns={columns}
        data={banks}
        searchKey="nombre"
        searchPlaceholder="Buscar por nombre..."
        onAdd={handleAddBank}
        addButtonLabel="Agregar Banco"
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
                Banco:{" "}
                <span className="font-semibold">{selectBank?.nombre}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Email:{" "}
                <span className="font-semibold">{selectBank?.email}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Teléfono:{" "}
                <span className="font-semibold">{selectBank?.telefono}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Dirección:{" "}
                <span className="font-semibold">{selectBank?.direccion}</span>
              </p>
            </div>
            <div className="sticky bottom-0 bg-background pt-4 border-t flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={toggleModal}>
                Cancelar
              </Button>
              <Button variant="destructive" type="button" onClick={handlerDelete}>
                Eliminar
              </Button>
            </div>
          </div>
        ) : (
          <BankForm
            mode={modalMode as "create" | "edit"}
            bank={selectBank || undefined}
          />
        )}
      </Modal>
    </div>
  );
}