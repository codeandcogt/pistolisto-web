"use client";

import { DataTable } from "@/components/organism/dataTable/DataTable";
import { useRouter } from "next/navigation";
import { createColumns } from "./Columns";
import { Modal } from "@/components/molecules";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SkeletonDataTable } from "@/components/organism";
import { useProducto } from "@/hooks/useProducto/useProducto";
import { useProductoStore } from "@/store/producto";
import { getModalTexts } from "./const";
import { ProductForm } from "./ProductoForm";

export function ProductTemplate() {
  const { productos, isLoading, isError, deleteProductoAsync } = useProducto();
  const {
    modal,
    openModalWithProducto,
    openCreateModal,
    toggleModal,
    modalMode,
    selectedProducto,
  } = useProductoStore();
  const router = useRouter();

  const columns = useMemo(
    () =>
      createColumns(
        (product) => openModalWithProducto(product, "edit"),
        (product) => {
          openModalWithProducto(product, "delete");
        }
      ),
    [openModalWithProducto]
  );

  if (isLoading) return <SkeletonDataTable />;
  if (isError) router.push("/unauthorized");

  const handleAddProduct = () => {
    openCreateModal();
  };

  const handlerDelete = () => {
    if (selectedProducto?.id_producto) {
      deleteProductoAsync(selectedProducto.id_producto);
      toggleModal();
    }
  };

  const modalTexts = getModalTexts(modalMode);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Productos</h1>
        <p className="text-muted-foreground">
          Gestiona el catálogo de productos del sistema
        </p>
      </div>

      <DataTable
        columns={columns}
        data={productos}
        searchKey="sku"
        searchPlaceholder="Buscar por SKU..."
        onAdd={handleAddProduct}
        addButtonLabel="Agregar Producto"
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
                SKU:{" "}
                <span className="font-semibold">{selectedProducto?.sku}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Costo:{" "}
                <span className="font-semibold">Q{selectedProducto?.costo.toFixed(2)}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Precio:{" "}
                <span className="font-semibold">Q{selectedProducto?.precio.toFixed(2)}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Unidad:{" "}
                <span className="font-semibold">{selectedProducto?.unidad_medida}</span>
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
          <ProductForm
            mode={modalMode as "create" | "edit"}
            product={selectedProducto || undefined}
          />
        )}
      </Modal>
    </div>
  );
}