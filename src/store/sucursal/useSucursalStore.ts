import { ModalMode, Sucursal } from '@/types';
import { create } from 'zustand';

interface SucursalStore {
  modal: boolean;
  selectSucursal: Sucursal | null;
  modalMode: ModalMode;
  toggleModal: () => void;
  setselectSucursal: (Sucursal: Sucursal | null) => void;
  openModalWithSucursal: (Sucursal: Sucursal, mode: ModalMode) => void;
  openCreateModal: () => void;
  closeModal: () => void;
}

export const useSucursalStore = create<SucursalStore>((set) => ({
  modal: false,
  selectSucursal: null,
  modalMode: 'create',
  
  toggleModal: () => set((state) => ({ 
    modal: !state.modal,
    selectSucursal: state.modal ? null : state.selectSucursal 
  })),
  
  setselectSucursal: (Sucursal) => set({ selectSucursal: Sucursal }),
  
  openModalWithSucursal: (Sucursal, mode) => set({ 
    modal: true, 
    selectSucursal: Sucursal,
    modalMode: mode 
  }),
  
  openCreateModal: () => set({ 
    modal: true, 
    selectSucursal: null,
    modalMode: 'create' 
  }),
  
  closeModal: () => set({ 
    modal: false, 
    selectSucursal: null 
  }),
}));