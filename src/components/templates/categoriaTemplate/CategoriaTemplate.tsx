"use client";

import { DataTable } from "@/components/organism/dataTable/DataTable";
import { useRouter } from "next/navigation";
import { createColumns } from "./Columns";
import { Modal } from "@/components/molecules";
import { useMemo } from "react";
import { getModalTexts } from "./const";
import { Button } from "@/components/ui/button";
import { SkeletonDataTable } from "@/components/organism";
import { useCategoria } from "@/hooks/useCategoria/useCategoria";
import { useCategoryStore } from "@/store/categoria";
import { CategoryForm } from "./CategoriaForm";

export function CategoryTemplate() {
  const { categoria, isLoading, isError, deleteCategoriaAsync } = useCategoria();
  const {
    modal,
    openModalWithCategory,
    openCreateModal,
    toggleModal,
    modalMode,
    selectedCategory,
  } = useCategoryStore();
  const router = useRouter();

  const columns = useMemo(
    () =>
      createColumns(
        (category) => openModalWithCategory(category, "edit"),
        (category) => {
          openModalWithCategory(category, "delete");
        }
      ),
    [openModalWithCategory]
  );

  if (isLoading) return <SkeletonDataTable />;
  if (isError) router.push("/unauthorized");

  const handleAddCategory = () => {
    openCreateModal();
  };

  const handlerDelete = () => {
    if (selectedCategory?.id_categoria) {
      deleteCategoriaAsync(selectedCategory.id_categoria);
      toggleModal();
    }
  };

  const modalTexts = getModalTexts(modalMode);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Categorías</h1>
        <p className="text-muted-foreground">
          Gestiona las categorías de productos del sistema
        </p>
      </div>

      <DataTable
        columns={columns}
        data={categoria}
        searchKey="nombre"
        searchPlaceholder="Buscar por nombre..."
        onAdd={handleAddCategory}
        addButtonLabel="Agregar Categoría"
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
                Categoría:{" "}
                <span className="font-semibold">{selectedCategory?.nombre}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Descripción:{" "}
                <span className="font-semibold">
                  {selectedCategory?.descripcion}
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
          <CategoryForm
            mode={modalMode as "create" | "edit"}
            category={selectedCategory || undefined}
          />
        )}
      </Modal>
    </div>
  );
}