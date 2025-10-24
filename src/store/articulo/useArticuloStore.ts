import { ModalMode, Articulo } from '@/types';
import { create } from 'zustand';

interface ArticuloStore {
  modal: boolean;
  selectedArticulo: Articulo | null;
  modalMode: ModalMode;
  toggleModal: () => void;
  setselectArticulo: (Articulo: Articulo | null) => void;
  openModalWithArticulo: (Articulo: Articulo, mode: ModalMode) => void;
  openCreateModal: () => void;
  closeModal: () => void;
}

export const useArticuloStore = create<ArticuloStore>((set) => ({
  modal: false,
  selectedArticulo: null,
  modalMode: 'create',
  
  toggleModal: () => set((state) => ({ 
    modal: !state.modal,
    selectedArticulo: state.modal ? null : state.selectedArticulo 
  })),
  
  setselectArticulo: (Articulo) => set({ selectedArticulo: Articulo }),
  
  openModalWithArticulo: (Articulo, mode) => set({ 
    modal: true, 
    selectedArticulo: Articulo,
    modalMode: mode 
  }),
  
  openCreateModal: () => set({ 
    modal: true, 
    selectedArticulo: null,
    modalMode: 'create' 
  }),
  
  closeModal: () => set({ 
    modal: false, 
    selectedArticulo: null 
  }),
}));