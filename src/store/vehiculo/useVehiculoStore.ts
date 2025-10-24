import { ModalMode, Vehiculo } from '@/types';
import { create } from 'zustand';

interface VehiculoStore {
  modal: boolean;
  selectedVehiculo: Vehiculo | null;
  modalMode: ModalMode;
  toggleModal: () => void;
  setselectVehiculo: (Vehiculo: Vehiculo | null) => void;
  openModalWithVehiculo: (Vehiculo: Vehiculo, mode: ModalMode) => void;
  openCreateModal: () => void;
  closeModal: () => void;
}

export const useVehiculoStore = create<VehiculoStore>((set) => ({
  modal: false,
  selectedVehiculo: null,
  modalMode: 'create',
  
  toggleModal: () => set((state) => ({ 
    modal: !state.modal,
    selectedVehiculo: state.modal ? null : state.selectedVehiculo 
  })),
  
  setselectVehiculo: (Vehiculo) => set({ selectedVehiculo: Vehiculo }),
  
  openModalWithVehiculo: (Vehiculo, mode) => set({ 
    modal: true, 
    selectedVehiculo: Vehiculo,
    modalMode: mode 
  }),
  
  openCreateModal: () => set({ 
    modal: true, 
    selectedVehiculo: null,
    modalMode: 'create' 
  }),
  
  closeModal: () => set({ 
    modal: false, 
    selectedVehiculo: null 
  }),
}));