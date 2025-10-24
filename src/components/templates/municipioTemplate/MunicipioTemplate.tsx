"use client";

import { DataTable } from "@/components/organism/dataTable/DataTable";
import { useRouter } from "next/navigation";
import { createColumns } from "./Columns";
import { Modal } from "@/components/molecules";
import { useMemo } from "react";
import { getModalTexts } from "./const";
import { Button } from "@/components/ui/button";
import { SkeletonDataTable } from "@/components/organism";
import { useMunicipalidad } from "@/hooks/useMunicipio/useMunicipio";
import { useMunicipioStore } from "@/store";
import { MunicipalityForm } from "./MunicipioForm";

export function MunicipalityTemplate() {
  const { municipios, isLoading, isError, deleteMunicipioAsync } = useMunicipalidad();
  const {
    modal,
    openModalWithMunicipio,
    openCreateModal,
    toggleModal,
    modalMode,
    selectMunicipio,
  } = useMunicipioStore();
  const router = useRouter();

  const columns = useMemo(
    () =>
      createColumns(
        (municipality) => openModalWithMunicipio(municipality, "edit"),
        (municipality) => {
          openModalWithMunicipio(municipality, "delete");
        }
      ),
    [openModalWithMunicipio]
  );

  if (isLoading) return <SkeletonDataTable />;
  if (isError) router.push("/unauthorized");

  const handleAddMunicipality = () => {
    openCreateModal();
  };

  const handlerDelete = () => {
    if (selectMunicipio?.idMunicipio) {
      deleteMunicipioAsync(selectMunicipio.idMunicipio);
      toggleModal();
    }
  };

  const modalTexts = getModalTexts(modalMode);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Municipios</h1>
        <p className="text-muted-foreground">
          Gestiona los municipios del sistema
        </p>
      </div>

      <DataTable
        columns={columns}
        data={municipios}
        searchKey="nombre"
        searchPlaceholder="Buscar por nombre o código..."
        onAdd={handleAddMunicipality}
        addButtonLabel="Agregar Municipio"
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
                Municipio:{" "}
                <span className="font-semibold">
                  {selectMunicipio?.nombre}
                </span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Código:{" "}
                <span className="font-semibold">
                  {selectMunicipio?.codigo}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Descripción:{" "}
                <span className="font-semibold">
                  {selectMunicipio?.descripcion}
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
          <MunicipalityForm
            mode={modalMode as "create" | "edit"}
            municipality={selectMunicipio || undefined}
          />
        )}
      </Modal>
    </div>
  );
}