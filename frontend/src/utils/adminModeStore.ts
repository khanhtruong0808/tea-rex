import create from "zustand";

interface AdminState {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

const adminModeStore = create<AdminState>((set) => ({
  isAdmin: localStorage.getItem("isAdmin") === "true" ? true : false, 
  setIsAdmin: (val) => {
    set({ isAdmin: val });
    localStorage.setItem("isAdmin", val.toString()); 
  },
}));

export default adminModeStore;