import { OpenId4VciCredentialResponse } from "@credo-ts/openid4vc";
import { create } from "zustand";

/**
 * State store to manage credential responses.
 *
 * This store holds the credential responses and provides functions to set
 * and clear them.
 */
interface CredentialResponsesStore {
  /** Array of credential responses. */
  credentialResponses: OpenId4VciCredentialResponse[] | [];
  /**
   * Set the credential responses.
   * @param credentialOffer - The credential responses to set.
   */
  set(credentialOffer: OpenId4VciCredentialResponse[]): void;
  /** Clear the credential responses. */
  clear(): void;
}

/**
 * Create a Zustand store for managing credential responses.
 *
 * @returns The Zustand store for credential responses.
 */
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
