import { Almacen } from "@/types";
import { create } from "zustand";

export type ModalMode = "create" | "edit" | "delete";

interface WarehouseStore {
  modal: boolean;
  selectedWarehouse: Almacen | null;
  modalMode: ModalMode;
  toggleModal: () => void;
  setSelectedWarehouse: (warehouse: Almacen | null) => void;
  openModalWithWarehouse: (warehouse: Almacen, mode: ModalMode) => void;
  openCreateModal: () => void;
  closeModal: () => void;
}

export const useWarehouseStore = create<WarehouseStore>((set) => ({
  modal: false,
  selectedWarehouse: null,
  modalMode: "create",

  toggleModal: () =>
    set((state) => ({
      modal: !state.modal,
      selectedWarehouse: state.modal ? null : state.selectedWarehouse,
    })),

  setSelectedWarehouse: (warehouse) => set({ selectedWarehouse: warehouse }),

  openModalWithWarehouse: (warehouse, mode) =>
    set({
      modal: true,
      selectedWarehouse: warehouse,
      modalMode: mode,
    }),

  openCreateModal: () =>
    set({
      modal: true,
      selectedWarehouse: null,
      modalMode: "create",
    }),

  closeModal: () =>
    set({
      modal: false,
      selectedWarehouse: null,
    }),
}));