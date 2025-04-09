import { useCredentialResponsesStore } from "@/state/CredentialResponsesStore";
import { OpenId4VciCredentialResponse } from "@credo-ts/openid4vc";

describe("CredentialResponsesStore", () => {
  it("should initialize with an empty credentialResponses array", () => {
    const { credentialResponses } = useCredentialResponsesStore.getState();

    expect(credentialResponses).toEqual([]);
  });

  it("should set the credentialResponses correctly", () => {
    const mockCredentials: OpenId4VciCredentialResponse[] = [
      { credential: {} },
      { credential: {} },
    ];

    useCredentialResponsesStore.getState().set(mockCredentials);

    const { credentialResponses } = useCredentialResponsesStore.getState();
    expect(credentialResponses).toEqual(mockCredentials);
  });

  it("should clear the credentialResponses array", () => {
    const mockCredentials: OpenId4VciCredentialResponse[] = [
      { credential: {} },
    ];

    useCredentialResponsesStore.getState().set(mockCredentials);

    useCredentialResponsesStore.getState().clear();

    const { credentialResponses } = useCredentialResponsesStore.getState();
    expect(credentialResponses).toEqual([]);
  });
});
