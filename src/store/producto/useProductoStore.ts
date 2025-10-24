import { ModalMode, Producto } from '@/types';
import { create } from 'zustand';

interface ProductoStore {
  modal: boolean;
  selectedProducto: Producto | null;
  modalMode: ModalMode;
  toggleModal: () => void;
  setselectProducto: (Producto: Producto | null) => void;
  openModalWithProducto: (Producto: Producto, mode: ModalMode) => void;
  openCreateModal: () => void;
  closeModal: () => void;
}

export const useProductoStore = create<ProductoStore>((set) => ({
  modal: false,
  selectedProducto: null,
  modalMode: 'create',
  
  toggleModal: () => set((state) => ({ 
    modal: !state.modal,
    selectedProducto: state.modal ? null : state.selectedProducto 
  })),
  
  setselectProducto: (Producto) => set({ selectedProducto: Producto }),
  
  openModalWithProducto: (Producto, mode) => set({ 
    modal: true, 
    selectedProducto: Producto,
    modalMode: mode 
  }),
  
  openCreateModal: () => set({ 
    modal: true, 
    selectedProducto: null,
    modalMode: 'create' 
  }),
  
  closeModal: () => set({ 
    modal: false, 
    selectedProducto: null 
  }),
}));