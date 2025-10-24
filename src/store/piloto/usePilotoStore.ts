import { ModalMode, Piloto } from '@/types';
import { create } from 'zustand';

interface PilotoStore {
  modal: boolean;
  selectedPiloto: Piloto | null;
  modalMode: ModalMode;
  toggleModal: () => void;
  setselectPiloto: (Piloto: Piloto | null) => void;
  openModalWithPiloto: (Piloto: Piloto, mode: ModalMode) => void;
  openCreateModal: () => void;
  closeModal: () => void;
}

export const usePilotoStore = create<PilotoStore>((set) => ({
  modal: false,
  selectedPiloto: null,
  modalMode: 'create',
  
  toggleModal: () => set((state) => ({ 
    modal: !state.modal,
    selectedPiloto: state.modal ? null : state.selectedPiloto 
  })),
  
  setselectPiloto: (Piloto) => set({ selectedPiloto: Piloto }),
  
  openModalWithPiloto: (Piloto, mode) => set({ 
    modal: true, 
    selectedPiloto: Piloto,
    modalMode: mode 
  }),
  
  openCreateModal: () => set({ 
    modal: true, 
    selectedPiloto: null,
    modalMode: 'create' 
  }),
  
  closeModal: () => set({ 
    modal: false, 
    selectedPiloto: null 
  }),
}));