import { ReactNode } from "react";
import { create } from "zustand";

interface DialogState {
  dialogIsOpen: boolean;
  dialogContent: ReactNode;
  dialogTitle: string | null;
  closeDialog: () => void;
  openDialog: ({
    title,
    content,
  }: {
    title: string;
    content: ReactNode;
  }) => void;
  setDialogContent: (dialogContent: ReactNode) => void;
  setDialogTitle: (title: string | null) => void;
}

const useDialog = create<DialogState>((set) => ({
  dialogIsOpen: false,
  dialogContent: null,
  dialogTitle: null,
  closeDialog: () =>
    set({ dialogIsOpen: false, dialogContent: null, dialogTitle: null }),
  openDialog: ({ title, content }) =>
    set({ dialogIsOpen: true, dialogTitle: title, dialogContent: content }),
  setDialogContent: (content) => set({ dialogContent: content }),
  setDialogTitle: (title) => set({ dialogTitle: title }),
}));

export default useDialog;
