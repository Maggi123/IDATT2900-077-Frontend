import { OpenId4VciCredentialResponse } from "@credo-ts/openid4vc";
import { create } from "zustand";

interface CredentialResponsesStore {
  credentialResponses: OpenId4VciCredentialResponse[] | [];
  set(credentialOffer: OpenId4VciCredentialResponse[]): void;
  clear(): void;
}

export const useCredentialResponsesStore = create<CredentialResponsesStore>(
  (set) => ({
    credentialResponses: [],
    set: (credentialResponses: OpenId4VciCredentialResponse[]) => {
      set((_) => ({ credentialResponses }));
    },
    clear: () => {
      set((_) => ({ credentialResponses: [] }));
    },
  }),
);
