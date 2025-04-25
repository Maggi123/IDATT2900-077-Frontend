import { OpenId4VcSiopResolvedAuthorizationRequest } from "@credo-ts/openid4vc";
import { create } from "zustand";

/**
 * State store to manage resolved authorization requests.
 *
 * This store holds the resolved authorization request and provides functions to set
 * and clear it.
 */
interface ResolvedAuthorizationRequestStore {
  resolvedAuthorizationRequest:
    | OpenId4VcSiopResolvedAuthorizationRequest
    | undefined;
  set(
    resolvedAuthorizationRequest: OpenId4VcSiopResolvedAuthorizationRequest,
  ): void;
  clear(): void;
}

/**
 * Create a Zustand store for managing resolved authorization requests.
 *
 * @returns The Zustand store for resolved authorization requests.
 */
export const useResolvedAuthorizationRequestStore =
  create<ResolvedAuthorizationRequestStore>((set) => ({
    resolvedAuthorizationRequest: undefined,
    set: (
      resolvedAuthorizationRequest: OpenId4VcSiopResolvedAuthorizationRequest,
    ) => {
      set((_) => ({
        resolvedAuthorizationRequest,
      }));
    },
    clear: () => {
      set((_) => ({ resolvedAuthorizationRequest: undefined }));
    },
  }));
