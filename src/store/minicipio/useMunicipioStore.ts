import { ModalMode, Municipio } from "@/types";
import { create } from "zustand";

interface MunicipioStore {
  modal: boolean;
  selectMunicipio: Municipio | null;
  modalMode: ModalMode;
  toggleModal: () => void;
  setselectMunicipio: (Municipio: Municipio | null) => void;
  openModalWithMunicipio: (Municipio: Municipio, mode: ModalMode) => void;
  openCreateModal: () => void;
  closeModal: () => void;
}

export const useMunicipioStore = create<MunicipioStore>((set) => ({
  modal: false,
  selectMunicipio: null,
  modalMode: "create",

  toggleModal: () =>
    set((state) => ({
      modal: !state.modal,
      selectMunicipio: state.modal ? null : state.selectMunicipio,
    })),

  setselectMunicipio: (Municipio) => set({ selectMunicipio: Municipio }),

  openModalWithMunicipio: (Municipio, mode) =>
    set({
      modal: true,
      selectMunicipio: Municipio,
      modalMode: mode,
    }),

  openCreateModal: () =>
    set({
      modal: true,
      selectMunicipio: null,
      modalMode: "create",
    }),

  closeModal: () =>
    set({
      modal: false,
      selectMunicipio: null,
    }),
}));
