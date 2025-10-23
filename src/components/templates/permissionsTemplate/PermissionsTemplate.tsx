"use client";

import { DataTable } from "@/components/organism/dataTable/DataTable";
import { usePermission } from "@/hooks/usePermission/usePermission";
import { useRouter } from "next/navigation";
import { createColumns } from "./Columns";
import { Modal } from "@/components/molecules";
import { useMemo } from "react";
import { getModalTexts } from "./const";
import { PermissionForm } from "./Form";
import { Button } from "@/components/ui/button";
import { SkeletonDataTable } from "@/components/organism";
import { usePermissionStore } from "@/store";

export function PermissionTemplate() {
  const { permissions, isLoading, isError, deletePermissionAsync } = usePermission();
  const {
    modal,
    openModalWithPermission,
    openCreateModal,
    toggleModal,
    modalMode,
    selectPermissions,
  } = usePermissionStore();
  const router = useRouter();

  const columns = useMemo(
    () =>
      createColumns(
        (permission) => openModalWithPermission(permission, "edit"),
        (permission) => {
          openModalWithPermission(permission, "delete");
        }
      ),
    [openModalWithPermission]
  );

  if (isLoading) return <SkeletonDataTable />;
  if (isError) router.push("/unauthorized");

  const handleAddPermission = () => {
    openCreateModal();
  };

  const handlerDelete = () => {
    if (selectPermissions?.id_permiso) {
      deletePermissionAsync(selectPermissions.id_permiso);
      toggleModal();
    }
  };

  const modalTexts = getModalTexts(modalMode);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Permisos</h1>
        <p className="text-muted-foreground">
          Gestiona los permisos del sistema
        </p>
      </div>

      <DataTable
        columns={columns}
        data={permissions}
        searchKey="nombre"
        searchPlaceholder="Buscar por nombre..."
        onAdd={handleAddPermission}
        addButtonLabel="Agregar Permiso"
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
                Permiso:{" "}
                <span className="font-semibold">{selectPermissions?.nombre}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Acción:{" "}
                <span className="font-semibold">{selectPermissions?.accion}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Descripción:{" "}
                <span className="font-semibold">
                  {selectPermissions?.descripcion}
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
          <PermissionForm
            mode={modalMode as "create" | "edit"}
            permission={selectPermissions || undefined}
          />
        )}
      </Modal>
    </div>
  );
}