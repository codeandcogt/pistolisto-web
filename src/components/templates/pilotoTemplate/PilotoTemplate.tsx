"use client";

import { DataTable } from "@/components/organism/dataTable/DataTable";
import { useRouter } from "next/navigation";
import { createColumns } from "./Columns";
import { Modal } from "@/components/molecules";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SkeletonDataTable } from "@/components/organism";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { usePiloto } from "@/hooks/usePiloto/usePiloto";
import { usePilotoStore } from "@/store/piloto";
import { getModalTexts } from "./const";
import { PilotForm } from "./PilotoForm";

export function PilotoTemplate() {
  const { pilotos, isLoading, isError, deletePilotosAsync } = usePiloto();
  const {
    modal,
    openModalWithPiloto,
    openCreateModal,
    toggleModal,
    modalMode,
    selectedPiloto,
  } = usePilotoStore();
  const router = useRouter();

  const columns = useMemo(
    () =>
      createColumns(
        (pilot) => openModalWithPiloto(pilot, "edit"),
        (pilot) => {
          openModalWithPiloto(pilot, "delete");
        }
      ),
    [openModalWithPiloto]
  );

  if (isLoading) return <SkeletonDataTable />;
  if (isError) router.push("/unauthorized");

  const handleAddPilot = () => {
    openCreateModal();
  };

  const handlerDelete = () => {
    if (selectedPiloto?.idPiloto) {
      deletePilotosAsync(selectedPiloto.idPiloto);
      toggleModal();
    }
  };

  const modalTexts = getModalTexts(modalMode);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pilotos</h1>
        <p className="text-muted-foreground">
          Gestiona los pilotos del sistema
        </p>
      </div>

      <DataTable
        columns={columns}
        data={pilotos}
        searchKey="nombres"
        searchPlaceholder="Buscar por nombre..."
        onAdd={handleAddPilot}
        addButtonLabel="Agregar Piloto"
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
                Piloto:{" "}
                <span className="font-semibold">
                  {selectedPiloto?.nombres} {selectedPiloto?.apellidos}
                </span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Email:{" "}
                <span className="font-semibold">{selectedPiloto?.email}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Licencia:{" "}
                <span className="font-semibold">
                  {selectedPiloto?.numeroLicencia} ({selectedPiloto?.tipoLicencia})
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Vencimiento:{" "}
                <span className="font-semibold">
                  {selectedPiloto?.fechaVencimientoLicencia &&
                    format(
                      new Date(selectedPiloto.fechaVencimientoLicencia),
                      "dd/MM/yyyy",
                      { locale: es }
                    )}
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
          <PilotForm
            mode={modalMode as "create" | "edit"}
            pilot={selectedPiloto || undefined}
          />
        )}
      </Modal>
    </div>
  );
}