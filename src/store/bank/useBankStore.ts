import { ModalMode, Bank } from '@/types';
import { create } from 'zustand';

interface BankStore {
  modal: boolean;
  selectBank: Bank | null;
  modalMode: ModalMode;
  toggleModal: () => void;
  setselectBank: (Bank: Bank | null) => void;
  openModalWithBank: (Bank: Bank, mode: ModalMode) => void;
  openCreateModal: () => void;
  closeModal: () => void;
}

export const useBankStore = create<BankStore>((set) => ({
  modal: false,
  selectBank: null,
  modalMode: 'create',
  
  toggleModal: () => set((state) => ({ 
    modal: !state.modal,
    selectBank: state.modal ? null : state.selectBank 
  })),
  
  setselectBank: (Bank) => set({ selectBank: Bank }),
  
  openModalWithBank: (Bank, mode) => set({ 
    modal: true, 
    selectBank: Bank,
    modalMode: mode 
  }),
  
  openCreateModal: () => set({ 
    modal: true, 
    selectBank: null,
    modalMode: 'create' 
  }),
  
  closeModal: () => set({ 
    modal: false, 
    selectBank: null 
  }),
}));