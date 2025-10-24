// DepartmentTemplate.tsx
"use client";

import { DataTable } from "@/components/organism/dataTable/DataTable";
import { useRouter } from "next/navigation";
import { createColumns } from "./Columns";
import { Modal } from "@/components/molecules";
import { useMemo } from "react";
import { getModalTexts } from "./const";
import { Button } from "@/components/ui/button";
import { SkeletonDataTable } from "@/components/organism";
import { useDepartamento } from "@/hooks/useDepartamento/useDepartamento";
import { useDepartamentoStore } from "@/store";
import { DepartmentForm } from "./DepartamentoForm";

export function DepartmentTemplate() {
  const { departamentos, isLoading, isError, deleteDepartamentoAsync } = useDepartamento();
  const {
    modal,
    openModalWithDepartamento,
    openCreateModal,
    toggleModal,
    modalMode,
    selectDepartamento,
  } = useDepartamentoStore();
  const router = useRouter();

  const columns = useMemo(
    () =>
      createColumns(
        (department) => openModalWithDepartamento(department, "edit"),
        (department) => {
          openModalWithDepartamento(department, "delete");
        }
      ),
    [openModalWithDepartamento]
  );

  if (isLoading) return <SkeletonDataTable />;
  if (isError) router.push("/unauthorized");

  const handleAddDepartment = () => {
    openCreateModal();
  };

  const handlerDelete = () => {
    if (selectDepartamento?.id_departamento) {
      deleteDepartamentoAsync(selectDepartamento.id_departamento);
      toggleModal();
    }
  };

  const modalTexts = getModalTexts(modalMode);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Departamentos</h1>
        <p className="text-muted-foreground">
          Gestiona los departamentos del sistema
        </p>
      </div>

      <DataTable
        columns={columns}
        data={departamentos}
        searchKey="nombre"
        searchPlaceholder="Buscar por nombre o código..."
        onAdd={handleAddDepartment}
        addButtonLabel="Agregar Departamento"
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
                Departamento:{" "}
                <span className="font-semibold">{selectDepartamento?.nombre}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Código:{" "}
                <span className="font-semibold">{selectDepartamento?.codigo}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Descripción:{" "}
                <span className="font-semibold">
                  {selectDepartamento?.descripcion}
                </span>
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
          <DepartmentForm
            mode={modalMode as "create" | "edit"}
            department={selectDepartamento || undefined}
          />
        )}
      </Modal>
    </div>
  );
}