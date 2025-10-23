import { ModalMode, Departamento } from '@/types';
import { create } from 'zustand';

interface DepartamentoStore {
  modal: boolean;
  selectDepartamento: Departamento | null;
  modalMode: ModalMode;
  toggleModal: () => void;
  setselectDepartamento: (Departamento: Departamento | null) => void;
  openModalWithDepartamento: (Departamento: Departamento, mode: ModalMode) => void;
  openCreateModal: () => void;
  closeModal: () => void;
}

export const useDepartamentoStore = create<DepartamentoStore>((set) => ({
  modal: false,
  selectDepartamento: null,
  modalMode: 'create',
  
  toggleModal: () => set((state) => ({ 
    modal: !state.modal,
    selectDepartamento: state.modal ? null : state.selectDepartamento 
  })),
  
  setselectDepartamento: (Departamento) => set({ selectDepartamento: Departamento }),
  
  openModalWithDepartamento: (Departamento, mode) => set({ 
    modal: true, 
    selectDepartamento: Departamento,
    modalMode: mode 
  }),
  
  openCreateModal: () => set({ 
    modal: true, 
    selectDepartamento: null,
    modalMode: 'create' 
  }),
  
  closeModal: () => set({ 
    modal: false, 
    selectDepartamento: null 
  }),
}));