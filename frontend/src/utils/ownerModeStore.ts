import { create } from "zustand";

interface OwnerState {
  isOwner: boolean;
  setIsOwner: (val: boolean) => void;
}

const ownerModeStore = create<OwnerState>((set) => ({
  isOwner: false, // Initialize to false by default
  setIsOwner: (val) => {
    set({ isOwner: val });
  },
}));

export default ownerModeStore;