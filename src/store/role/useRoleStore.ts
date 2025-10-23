import { ModalMode, Role } from '@/types';
import { create } from 'zustand';

interface RoleStore {
  modal: boolean;
  selectRole: Role | null;
  modalMode: ModalMode;
  toggleModal: () => void;
  setselectRole: (Role: Role | null) => void;
  openModalWithRole: (Role: Role, mode: ModalMode) => void;
  openCreateModal: () => void;
  closeModal: () => void;
}

export const useRoleStore = create<RoleStore>((set) => ({
  modal: false,
  selectRole: null,
  modalMode: 'create',
  
  toggleModal: () => set((state) => ({ 
    modal: !state.modal,
    selectRole: state.modal ? null : state.selectRole 
  })),
  
  setselectRole: (Role) => set({ selectRole: Role }),
  
  openModalWithRole: (Role, mode) => set({ 
    modal: true, 
    selectRole: Role,
    modalMode: mode 
  }),
  
  openCreateModal: () => set({ 
    modal: true, 
    selectRole: null,
    modalMode: 'create' 
  }),
  
  closeModal: () => set({ 
    modal: false, 
    selectRole: null 
  }),
}));