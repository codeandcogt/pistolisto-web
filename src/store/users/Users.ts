import { create } from 'zustand';
import { User } from '@/types';

export type ModalMode = 'create' | 'edit' | 'delete';

interface UserStore {
  modal: boolean;
  selectedUser: User | null;
  modalMode: ModalMode;
  toggleModal: () => void;
  setSelectedUser: (user: User | null) => void;
  openModalWithUser: (user: User, mode: ModalMode) => void;
  openCreateModal: () => void;
  closeModal: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  modal: false,
  selectedUser: null,
  modalMode: 'create',
  
  toggleModal: () => set((state) => ({ 
    modal: !state.modal,
    selectedUser: state.modal ? null : state.selectedUser 
  })),
  
  setSelectedUser: (user) => set({ selectedUser: user }),
  
  openModalWithUser: (user, mode) => set({ 
    modal: true, 
    selectedUser: user,
    modalMode: mode 
  }),
  
  openCreateModal: () => set({ 
    modal: true, 
    selectedUser: null,
    modalMode: 'create' 
  }),
  
  closeModal: () => set({ 
    modal: false, 
    selectedUser: null 
  }),
}));