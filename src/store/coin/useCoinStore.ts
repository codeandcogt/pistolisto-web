import { ModalMode, Coin } from '@/types';
import { create } from 'zustand';

interface CoinStore {
  modal: boolean;
  selectCoin: Coin | null;
  modalMode: ModalMode;
  toggleModal: () => void;
  setselectBank: (Coin: Coin | null) => void;
  openModalWithCoin: (Coin: Coin, mode: ModalMode) => void;
  openCreateModal: () => void;
  closeModal: () => void;
}

export const useCoinStore = create<CoinStore>((set) => ({
  modal: false,
  selectCoin: null,
  modalMode: 'create',
  
  toggleModal: () => set((state) => ({ 
    modal: !state.modal,
    selectCoin: state.modal ? null : state.selectCoin 
  })),
  
  setselectBank: (Coin) => set({ selectCoin: Coin }),
  
  openModalWithCoin: (Coin, mode) => set({ 
    modal: true, 
    selectCoin: Coin,
    modalMode: mode 
  }),
  
  openCreateModal: () => set({ 
    modal: true, 
    selectCoin: null,
    modalMode: 'create' 
  }),
  
  closeModal: () => set({ 
    modal: false, 
    selectCoin: null 
  }),
}));