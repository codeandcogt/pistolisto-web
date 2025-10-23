import { ModalMode, RolPermiso } from '@/types';
import { create } from 'zustand';

interface RoleStore {
  modal: boolean;
  selectRolePermission: RolPermiso | null;
  modalMode: ModalMode;
  toggleModal: () => void;
  setselectRolePermission: (RolPermiso: RolPermiso | null) => void;
  openModalWithRolePermission: (RolPermiso: RolPermiso, mode: ModalMode) => void;
  openCreateModal: () => void;
  closeModal: () => void;
}

export const useRolePermisoStore = create<RoleStore>((set) => ({
  modal: false,
  selectRolePermission: null,
  modalMode: 'create',
  
  toggleModal: () => set((state) => ({ 
    modal: !state.modal,
    selectRolePermission: state.modal ? null : state.selectRolePermission 
  })),
  
  setselectRolePermission: (RolPermiso) => set({ selectRolePermission: RolPermiso }),
  
  openModalWithRolePermission: (RolPermiso, mode) => set({ 
    modal: true, 
    selectRolePermission: RolPermiso,
    modalMode: mode 
  }),
  
  openCreateModal: () => set({ 
    modal: true, 
    selectRolePermission: null,
    modalMode: 'create' 
  }),
  
  closeModal: () => set({ 
    modal: false, 
    selectRolePermission: null 
  }),
}));