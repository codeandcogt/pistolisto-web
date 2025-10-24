"use client";

import { DataTable } from "@/components/organism/dataTable/DataTable";
import { useRouter } from "next/navigation";
import { createColumns } from "./Columns";
import { Modal } from "@/components/molecules";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SkeletonDataTable } from "@/components/organism";
import { useArticulo } from "@/hooks/useArticulo/useArticulo";
import { useArticuloStore } from "@/store/articulo";
import { getModalTexts } from "./conts";
import { ArticleForm } from "./ArticuloForm";

export function ArticleTemplate() {
  const { articulos, isLoading, isError, deleteArticuloAsync } = useArticulo();
  const {
    modal,
    openModalWithArticulo,
    openCreateModal,
    toggleModal,
    modalMode,
    selectedArticulo,
  } = useArticuloStore();
  const router = useRouter();

  const columns = useMemo(
    () =>
      createColumns(
        (article) => openModalWithArticulo(article, "edit"),
        (article) => {
          openModalWithArticulo(article, "delete");
        }
      ),
    [openModalWithArticulo]
  );

  if (isLoading) return <SkeletonDataTable />;
  if (isError) router.push("/unauthorized");

  const handleAddArticle = () => {
    openCreateModal();
  };

  const handlerDelete = () => {
    if (selectedArticulo?.idArticulo) {
      deleteArticuloAsync(selectedArticulo.idArticulo);
      toggleModal();
    }
  };

  const modalTexts = getModalTexts(modalMode);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Artículos</h1>
        <p className="text-muted-foreground">
          Gestiona el inventario de artículos del sistema
        </p>
      </div>

      <DataTable
        columns={columns}
        data={articulos}
        searchKey="nombre"
        searchPlaceholder="Buscar por nombre o color..."
        onAdd={handleAddArticle}
        addButtonLabel="Agregar Artículo"
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
                Artículo:{" "}
                <span className="font-semibold">{selectedArticulo?.nombre}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Color:{" "}
                <span className="font-semibold">{selectedArticulo?.color}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Peso:{" "}
                <span className="font-semibold">{selectedArticulo?.peso} kg</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Dimensiones:{" "}
                <span className="font-semibold">{selectedArticulo?.dimension}</span>
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
          <ArticleForm
            mode={modalMode as "create" | "edit"}
            article={selectedArticulo || undefined}
          />
        )}
      </Modal>
    </div>
  );
}