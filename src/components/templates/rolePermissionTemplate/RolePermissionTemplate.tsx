"use client";

import { DataTable } from "@/components/organism/dataTable/DataTable";
import { useRolePermission } from "@/hooks/useRolePermission/useRolePermission";
import { useRouter } from "next/navigation";
import { createColumns } from "./Columns";
import { Modal } from "@/components/molecules";
import { useMemo } from "react";
import { getModalTexts } from "./const";
import { Button } from "@/components/ui/button";
import { SkeletonDataTable } from "@/components/organism";
import { useRolePermisoStore } from "@/store";
import { RolePermissionForm } from "./RolePermissionForm";

export function RolePermissionTemplate() {
  const { rolesPermissions, isLoading, isError, deleteRolePermissionAsync } =
    useRolePermission();
  const {
    modal,
    openModalWithRolePermission,
    openCreateModal,
    toggleModal,
    modalMode,
    selectRolePermission,
  } = useRolePermisoStore();
  const router = useRouter();

  const columns = useMemo(
    () =>
      createColumns(
        (rolePermission) => openModalWithRolePermission(rolePermission, "edit"),
        (rolePermission) => {
          openModalWithRolePermission(rolePermission, "delete");
        }
      ),
    [openModalWithRolePermission]
  );

  if (isLoading) return <SkeletonDataTable />;
  if (isError) router.push("/unauthorized");

  const handleAddRolePermission = () => {
    openCreateModal();
  };

  const handlerDelete = () => {
    if (selectRolePermission?.id_rol_permiso) {
      deleteRolePermissionAsync(selectRolePermission.id_rol_permiso);
      toggleModal();
    }
  };

  const modalTexts = getModalTexts(modalMode);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Asignación de Permisos</h1>
        <p className="text-muted-foreground">
          Gestiona los permisos asignados a cada rol
        </p>
      </div>

      <DataTable
        columns={columns}
        data={rolesPermissions}
        searchKey="id_rol"
        searchPlaceholder="Buscar por rol..."
        onAdd={handleAddRolePermission}
        addButtonLabel="Asignar Permiso"
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
                ¿Estás seguro de que deseas eliminar esta asignación de permiso?
              </p>
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="text-sm font-medium">Detalles de la asignación:</p>
                <p className="text-sm text-muted-foreground mt-2">
                  ID Rol: <span className="font-semibold">{selectRolePermission?.id_rol}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  ID Permiso:{" "}
                  <span className="font-semibold">{selectRolePermission?.id_permiso}</span>
                </p>
              </div>
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
                Eliminar Asignación
              </Button>
            </div>
          </div>
        ) : (
          <RolePermissionForm
            mode={modalMode as "create" | "edit"}
            rolePermission={selectRolePermission || undefined}
          />
        )}
      </Modal>
    </div>
  );
}