"use client";

import { DataTable } from "@/components/organism/dataTable/DataTable";
import { useRole } from "@/hooks/useRole/useRole";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/molecules";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SkeletonDataTable } from "@/components/organism";
import { useRoleStore } from "@/store";
import { createColumns } from "./Columns";
import { getModalTexts } from "./const";
import { RoleForm } from "./Form";

export function RoleTemplate() {
  const { roles, isLoading, isError, deleteRoleAsync } = useRole();
  const {
    modal,
    openModalWithRole,
    openCreateModal,
    toggleModal,
    modalMode,
    selectRole,
  } = useRoleStore();
  const router = useRouter();

  const columns = useMemo(
    () =>
      createColumns(
        (role) => openModalWithRole(role, "edit"),
        (role) => {
          openModalWithRole(role, "delete");
        }
      ),
    [openModalWithRole]
  );

  if (isLoading) return <SkeletonDataTable />;
  if (isError) router.push("/unauthorized");

  const handleAddRole = () => {
    openCreateModal();
  };

  const handlerDelete = () => {
    if (selectRole?.id_rol) {
      deleteRoleAsync(selectRole.id_rol);
      toggleModal();
    }
  };

  const modalTexts = getModalTexts(modalMode);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Roles</h1>
        <p className="text-muted-foreground">
          Gestiona los roles del sistema
        </p>
      </div>

      <DataTable
        columns={columns}
        data={roles}
        searchKey="nombre"
        searchPlaceholder="Buscar por nombre..."
        onAdd={handleAddRole}
        addButtonLabel="Agregar Rol"
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
                Rol:{" "}
                <span className="font-semibold">{selectRole?.nombre}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Descripción:{" "}
                <span className="font-semibold">
                  {selectRole?.descripcion}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Nivel: <span className="font-semibold">{selectRole?.nivel}</span>
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
          <RoleForm
            mode={modalMode as "create" | "edit"}
            role={selectRole || undefined}
          />
        )}
      </Modal>
    </div>
  );
}