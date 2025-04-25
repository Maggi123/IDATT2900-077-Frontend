import { create } from "zustand";

/**
 * State store to manage issuer information.
 *
 * This store holds the issuer name and provides functions to set and clear it.
 */
interface IssuerInfoStore {
  /** The name of the issuer. */
  name: string;
  /**
   * Set the issuer name.
   * @param name - The name of the issuer.
   */
  set(name: string): void;
  /** Clear the issuer name. */
  clear(): void;
}

/**
 * Create a Zustand store for managing issuer information.
 *
 * @returns The Zustand store for issuer information.
 */
export const useIssuerInfoStore = create<IssuerInfoStore>((set) => ({
  name: "",
  set: (name: string) => {
    set((_) => ({ name }));
  },
  clear: () => {
    set((_) => ({ name: "" }));
  },
}));
