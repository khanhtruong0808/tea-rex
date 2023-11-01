import { ReactNode } from "react";
import { create } from "zustand";

interface DialogState {
  dialogIsOpen: boolean;
  dialogContent: ReactNode;
  dialogTitle: string | null;
  variant: "menu" | "cart";
  closeDialog: () => void;
  openDialog: ({
    title,
    content,
    variant = "menu",
  }: {
    title: string;
    content: ReactNode;
    variant?: "menu" | "cart";
  }) => void;
  setDialogContent: (dialogContent: ReactNode) => void;
  setDialogTitle: (title: string | null) => void;
}

const useDialog = create<DialogState>((set) => ({
  dialogIsOpen: false,
  dialogContent: null,
  dialogTitle: null,
  variant: "menu",
  closeDialog: () =>
    set({
      dialogIsOpen: false,
      dialogContent: null,
      dialogTitle: null,
      variant: "menu",
    }),
  openDialog: ({ title, content, variant = "menu" }) =>
    set({
      dialogIsOpen: true,
      dialogTitle: title,
      dialogContent: content,
      variant: variant,
    }),
  setDialogContent: (content) => set({ dialogContent: content }),
  setDialogTitle: (title) => set({ dialogTitle: title }),
}));

export default useDialog;
