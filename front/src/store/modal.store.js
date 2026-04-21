import { create } from "zustand";

export const useModalStore = create((set) => ({
  confirm: null, // { title, description, onConfirm }

  openConfirm: (config) =>
    set({ confirm: config }),

  closeConfirm: () =>
    set({ confirm: null }),
}));