import { OpenId4VcSiopResolvedAuthorizationRequest } from "@credo-ts/openid4vc";
import { create } from "zustand";

interface ResolvedAuthorizationRequestStore {
  resolvedAuthorizationRequest:
    | OpenId4VcSiopResolvedAuthorizationRequest
    | undefined;
  set(
    resolvedAuthorizationRequest: OpenId4VcSiopResolvedAuthorizationRequest,
  ): void;
  clear(): void;
}

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
