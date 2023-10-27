import { create } from "zustand";

interface AdminState {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

const adminModeStore = create<AdminState>((set) => ({
  isAdmin: false, // Initialize to false by default
  setIsAdmin: (val) => {
    set({ isAdmin: val });
  },
}));

export default adminModeStore;
