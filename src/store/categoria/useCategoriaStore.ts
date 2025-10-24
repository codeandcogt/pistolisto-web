import { Categoria } from "@/types";
import { create } from "zustand";

export type ModalMode = "create" | "edit" | "delete";

interface CategoryStore {
  modal: boolean;
  selectedCategory: Categoria | null;
  modalMode: ModalMode;
  toggleModal: () => void;
  setSelectedCategory: (category: Categoria | null) => void;
  openModalWithCategory: (category: Categoria, mode: ModalMode) => void;
  openCreateModal: () => void;
  closeModal: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  modal: false,
  selectedCategory: null,
  modalMode: "create",

  toggleModal: () =>
    set((state) => ({
      modal: !state.modal,
      selectedCategory: state.modal ? null : state.selectedCategory,
    })),

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  openModalWithCategory: (category, mode) =>
    set({
      modal: true,
      selectedCategory: category,
      modalMode: mode,
    }),

  openCreateModal: () =>
    set({
      modal: true,
      selectedCategory: null,
      modalMode: "create",
    }),

  closeModal: () =>
    set({
      modal: false,
      selectedCategory: null,
    }),
}));