import { SubCategoria } from "@/types";
import { create } from "zustand";

export type ModalMode = "create" | "edit" | "delete";


interface SubCategoryStore {
  modal: boolean;
  selectedSubCategory: SubCategoria | null;
  modalMode: ModalMode;
  toggleModal: () => void;
  setSelectedSubCategory: (subCategory: SubCategoria | null) => void;
  openModalWithSubCategory: (subCategory: SubCategoria, mode: ModalMode) => void;
  openCreateModal: () => void;
  closeModal: () => void;
}

export const useSubCategoryStore = create<SubCategoryStore>((set) => ({
  modal: false,
  selectedSubCategory: null,
  modalMode: "create",

  toggleModal: () =>
    set((state) => ({
      modal: !state.modal,
      selectedSubCategory: state.modal ? null : state.selectedSubCategory,
    })),

  setSelectedSubCategory: (subCategory) =>
    set({ selectedSubCategory: subCategory }),

  openModalWithSubCategory: (subCategory, mode) =>
    set({
      modal: true,
      selectedSubCategory: subCategory,
      modalMode: mode,
    }),

  openCreateModal: () =>
    set({
      modal: true,
      selectedSubCategory: null,
      modalMode: "create",
    }),

  closeModal: () =>
    set({
      modal: false,
      selectedSubCategory: null,
    }),
}));