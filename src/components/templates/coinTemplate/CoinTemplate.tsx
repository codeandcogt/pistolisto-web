"use client";

import { DataTable } from "@/components/organism/dataTable/DataTable";
import { useCoin } from "@/hooks/useCoin/useCoin";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/molecules";
import { useMemo } from "react";
import { getModalTexts } from "./const";
import { Button } from "@/components/ui/button";
import { SkeletonDataTable } from "@/components/organism";
import { useCoinStore } from "@/store";
import { createColumns } from "./Columns";
import { CoinForm } from "./CoinForm";

export function CoinTemplate() {
  const { coins, isLoading, isError, deleteCoinAsync } = useCoin();
  const {
    modal,
    openModalWithCoin,
    openCreateModal,
    toggleModal,
    modalMode,
    selectCoin,
  } = useCoinStore();
  const router = useRouter();

  const columns = useMemo(
    () =>
      createColumns(
        (coin) => openModalWithCoin(coin, "edit"),
        (coin) => {
          openModalWithCoin(coin, "delete");
        }
      ),
    [openModalWithCoin]
  );

  if (isLoading) return <SkeletonDataTable />;
  if (isError) router.push("/unauthorized");

  const handleAddCoin = () => {
    openCreateModal();
  };

  const handlerDelete = () => {
    if (selectCoin?.idMoneda) {
      deleteCoinAsync(selectCoin.idMoneda);
      toggleModal();
    }
  };

  const modalTexts = getModalTexts(modalMode);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Monedas</h1>
        <p className="text-muted-foreground">
          Gestiona las monedas del sistema
        </p>
      </div>

      <DataTable
        columns={columns}
        data={coins}
        searchKey="nombre"
        searchPlaceholder="Buscar por nombre o código..."
        onAdd={handleAddCoin}
        addButtonLabel="Agregar Moneda"
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
                Moneda:{" "}
                <span className="font-semibold">{selectCoin?.nombre}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Código:{" "}
                <span className="font-semibold">{selectCoin?.codigo}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Símbolo:{" "}
                <span className="font-semibold">{selectCoin?.simbolo}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Tasa de Cambio:{" "}
                <span className="font-semibold">{selectCoin?.tasaCambio}</span>
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
          <CoinForm
            mode={modalMode as "create" | "edit"}
            coin={selectCoin || undefined}
          />
        )}
      </Modal>
    </div>
  );
}