"use client";

import { DataTable } from "@/components/organism/dataTable/DataTable";
import { useUser } from "@/hooks/useUser/useUser";
import { useRouter } from "next/navigation";
import { createColumns } from "./Columns";
import { Modal } from "@/components/molecules";
import { useUserStore } from "@/store/users/Users";
import { useMemo } from "react";
import { getModalTexts } from "./const";
import { UserForm } from "./Form";
import { Button } from "@/components/ui/button";

export function UserTemplate() {
  const { users, isLoading, isError, deleteUserAsync } = useUser();
  const {
    modal,
    openModalWithUser,
    openCreateModal,
    toggleModal,
    modalMode,
    selectedUser,
  } = useUserStore();
  const router = useRouter();

  const columns = useMemo(
    () =>
      createColumns(
        (user) => openModalWithUser(user, "edit"),
        (user) => {
          openModalWithUser(user, "delete");
        }
      ),
    [openModalWithUser]
  );

  if (isLoading) return <div>Cargando...</div>;
  if (isError) router.push("/unauthorized");

  const handleAddUser = () => {
    openCreateModal();
  };

  const handlerDelete = ()=>{
    deleteUserAsync(selectedUser?.id_administrativo)
    toggleModal()
  }

  const modalTexts = getModalTexts(modalMode);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground">
          Gestiona los usuarios administrativos
        </p>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchKey="nombre"
        searchPlaceholder="Buscar por nombre..."
        onAdd={handleAddUser}
        addButtonLabel="Agregar Usuario"
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
                Usuario:{" "}
                <span className="font-semibold">
                  {selectedUser?.nombre} {selectedUser?.apellido}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Email:{" "}
                <span className="font-semibold">{selectedUser?.email}</span>
              </p>
            </div>
            <div className="sticky bottom-0 bg-background pt-4 border-t flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={toggleModal}>
                Cancelar
              </Button>
              <Button type="submit" onClick={handlerDelete}>
                Eliminar
              </Button>
            </div>
          </div>
        ) : (
          <UserForm
            mode={modalMode as "create" | "edit"}
            user={selectedUser || undefined}
          />
        )}
      </Modal>
    </div>
  );
}
