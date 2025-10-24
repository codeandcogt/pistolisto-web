"use client";

import { DataTable } from "@/components/organism/dataTable/DataTable";
import { useRouter } from "next/navigation";
import { createColumns } from "./Columns";
import { Modal } from "@/components/molecules";
import { useMemo } from "react";
import { getModalTexts } from "./const";
import { Button } from "@/components/ui/button";
import { SkeletonDataTable } from "@/components/organism";
import { useSubCategoria } from "@/hooks/useSubcategoria/useSubcategoria";
import { useSubCategoryStore } from "@/store/subcategoria";
import { SubCategoryForm } from "./SubcategoriaForm";

export function SubCategoryTemplate() {
  const { subcategories, isLoading, isError, deleteSubCategoriaAsync } =
    useSubCategoria();
  const {
    modal,
    openModalWithSubCategory,
    openCreateModal,
    toggleModal,
    modalMode,
    selectedSubCategory,
  } = useSubCategoryStore();
  const router = useRouter();

  const columns = useMemo(
    () =>
      createColumns(
        (subCategory) => openModalWithSubCategory(subCategory, "edit"),
        (subCategory) => {
          openModalWithSubCategory(subCategory, "delete");
        }
      ),
    [openModalWithSubCategory]
  );

  if (isLoading) return <SkeletonDataTable />;
  if (isError) router.push("/unauthorized");

  const handleAddSubCategory = () => {
    openCreateModal();
  };

  const handlerDelete = () => {
    if (selectedSubCategory?.idSubCategoria) {
      deleteSubCategoriaAsync(selectedSubCategory.idSubCategoria);
      toggleModal();
    }
  };

  const modalTexts = getModalTexts(modalMode);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Subcategorías</h1>
        <p className="text-muted-foreground">
          Gestiona las subcategorías de productos del sistema
        </p>
      </div>

      <DataTable
        columns={columns}
        data={subcategories}
        searchKey="nombre"
        searchPlaceholder="Buscar por nombre..."
        onAdd={handleAddSubCategory}
        addButtonLabel="Agregar Subcategoría"
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
                Subcategoría:{" "}
                <span className="font-semibold">{selectedSubCategory?.nombre}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Descripción:{" "}
                <span className="font-semibold">
                  {selectedSubCategory?.descripcion}
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
          <SubCategoryForm
            mode={modalMode as "create" | "edit"}
            subCategory={selectedSubCategory || undefined}
          />
        )}
      </Modal>
    </div>
  );
}