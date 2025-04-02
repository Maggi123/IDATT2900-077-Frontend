import { create } from "zustand";

interface IssuerInfoStore {
  name: string;
  set(name: string): void;
  clear(): void;
}

export const useIssuerInfoStore = create<IssuerInfoStore>((set) => ({
  name: "",
  set: (name: string) => {
    set((_) => ({ name }));
  },
  clear: () => {
    set((_) => ({ name: "" }));
  },
}));
