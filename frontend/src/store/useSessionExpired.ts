
import { create } from "zustand";


interface ModalState {
  isSessionExpired: boolean;
  showSessionExpiredModal: () => void;
  hideSessionExpiredModal: () => void;
}

export const useSessionExpired = create<ModalState>((set) => ({
  isSessionExpired: false,
  showSessionExpiredModal: () => set({ isSessionExpired: true }),
  hideSessionExpiredModal: () => set({ isSessionExpired: false }),
}));
