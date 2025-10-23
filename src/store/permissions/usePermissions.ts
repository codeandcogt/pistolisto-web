import { ModalMode, Permissions } from '@/types';
import { create } from 'zustand';

interface PermissionStore {
  modal: boolean;
  selectPermissions: Permissions | null;
  modalMode: ModalMode;
  toggleModal: () => void;
  setselectPermissions: (Permissions: Permissions | null) => void;
  openModalWithPermission: (Permissions: Permissions, mode: ModalMode) => void;
  openCreateModal: () => void;
  closeModal: () => void;
}

export const usePermissionStore = create<PermissionStore>((set) => ({
  modal: false,
  selectPermissions: null,
  modalMode: 'create',
  
  toggleModal: () => set((state) => ({ 
    modal: !state.modal,
    selectPermissions: state.modal ? null : state.selectPermissions 
  })),
  
  setselectPermissions: (Permissions) => set({ selectPermissions: Permissions }),
  
  openModalWithPermission: (Permissions, mode) => set({ 
    modal: true, 
    selectPermissions: Permissions,
    modalMode: mode 
  }),
  
  openCreateModal: () => set({ 
    modal: true, 
    selectPermissions: null,
    modalMode: 'create' 
  }),
  
  closeModal: () => set({ 
    modal: false, 
    selectPermissions: null 
  }),
}));