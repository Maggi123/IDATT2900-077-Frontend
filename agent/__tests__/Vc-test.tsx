import {
  Agent,
  W3cJwtVerifiableCredential,
  W3cJsonLdVerifiableCredential,
  DidRecord,
} from "@credo-ts/core";
import {
  OpenId4VciCredentialResponse,
  OpenId4VciResolvedCredentialOffer,
} from "@credo-ts/openid4vc";

import {
  resolveCredentialOfferWithAgent,
  getCredentialsWithAgent,
  resolveAndGetCredentialsWithAgent,
  storeCredentialsWithAgent,
  storeIssuerNameFromOfferWithAgent,
} from "@/agent/Vc";

jest.mock("@credo-ts/core");
jest.mock("@credo-ts/openid4vc");

describe("OpenID4VC Credential Functions", () => {
  let agent: jest.Mocked<Agent>;
  let mockCredentialOffer: string;
  let mockResolvedOffer: OpenId4VciResolvedCredentialOffer;
  let mockCredentialResponse: OpenId4VciCredentialResponse[];
  let mockDid: DidRecord;

  beforeEach(() => {
    jest.clearAllMocks();

    agent = {
      modules: {
        openId4VcHolderModule: {
          resolveCredentialOffer: jest.fn(),
          requestToken: jest.fn(),
          requestCredentials: jest.fn(),
        },
      },
      dids: {
        getCreatedDids: jest.fn(),
      },
      w3cCredentials: {
        storeCredential: jest.fn(),
      },
      genericRecords: {
        save: jest.fn(),
      },
      config: {
        logger: {
          debug: jest.fn(),
        },
      },
    } as unknown as jest.Mocked<Agent>;

    // Setup mock data
    mockCredentialOffer = "credential-offer-uri:sample";
    mockDid = { did: "did:indy:123456789abcdef" } as DidRecord;

    mockResolvedOffer = {
      credentialOfferPayload: {
        credential_issuer: "https://issuer.example.com",
        credentials: ["VerifiablePrescription"],
      },
      metadata: {
        credentialIssuerMetadata: {
          display: [
            {
              name: "Test Issuer",
            },
          ],
        },
      },
    } as unknown as OpenId4VciResolvedCredentialOffer;

    const mockJwtCredential = {
      type: "JWT",
    } as unknown as W3cJwtVerifiableCredential;

    mockCredentialResponse = [
      {
        credential: mockJwtCredential,
        format: "jwt_vc",
      },
    ] as unknown as OpenId4VciCredentialResponse[];

    agent.modules.openId4VcHolderModule.resolveCredentialOffer.mockResolvedValue(
      mockResolvedOffer,
    );
    agent.modules.openId4VcHolderModule.requestToken.mockResolvedValue({
      accessToken: "mock-access-token",
      cNonce: "mock-cnonce",
      dpop: "mock-dpop",
    });
    agent.modules.openId4VcHolderModule.requestCredentials.mockResolvedValue(
      mockCredentialResponse,
    );
    agent.dids.getCreatedDids.mockResolvedValue([mockDid]);
  });

  describe("resolveCredentialOfferWithAgent", () => {
    it("should resolve a credential offer successfully", async () => {
      const result = await resolveCredentialOfferWithAgent(
        agent,
        mockCredentialOffer,
      );

      expect(
        agent.modules.openId4VcHolderModule.resolveCredentialOffer,
      ).toHaveBeenCalledWith(mockCredentialOffer);
      expect(result).toEqual(mockResolvedOffer);
    });

    it("should log resolved credential offer payload", async () => {
      const consoleSpy = jest.spyOn(console, "info").mockImplementation();

      await resolveCredentialOfferWithAgent(agent, mockCredentialOffer);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Resolved credential offer"),
      );

      consoleSpy.mockRestore();
    });
  });

  describe("getCredentialsWithAgent", () => {
    it("should request credentials with the correct parameters", async () => {
      const result = await getCredentialsWithAgent(agent, mockResolvedOffer);

      expect(
        agent.modules.openId4VcHolderModule.requestToken,
      ).toHaveBeenCalledWith({
        resolvedCredentialOffer: mockResolvedOffer,
      });

      expect(agent.dids.getCreatedDids).toHaveBeenCalledWith({
        method: "indy",
      });

      expect(
        agent.modules.openId4VcHolderModule.requestCredentials,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          resolvedCredentialOffer: mockResolvedOffer,
          accessToken: "mock-access-token",
          cNonce: "mock-cnonce",
          dpop: "mock-dpop",
        }),
      );

      expect(result).toEqual(mockCredentialResponse);
    });

    it("should handle credential binding for Indy DIDs", async () => {
      await getCredentialsWithAgent(agent, mockResolvedOffer);

      // Extract the credential binding resolver function
      const requestCredentialsCall =
        agent.modules.openId4VcHolderModule.requestCredentials.mock.calls[0][0];
      const credentialBindingResolver =
        requestCredentialsCall.credentialBindingResolver;

      // Test with supported did:indy method
      const bindingResult = credentialBindingResolver({
        supportedDidMethods: ["did:indy"],
        supportsAllDidMethods: false,
      });

      expect(bindingResult).toEqual({
        method: "did",
        didUrl: `${mockDid.did}#verkey`,
      });
    });

    it("should throw error when did:indy is not supported", async () => {
      await getCredentialsWithAgent(agent, mockResolvedOffer);

      const requestCredentialsCall =
        agent.modules.openId4VcHolderModule.requestCredentials.mock.calls[0][0];
      const credentialBindingResolver =
        requestCredentialsCall.credentialBindingResolver;

      expect(() =>
        credentialBindingResolver({
          supportedDidMethods: ["did:key"],
          supportsAllDidMethods: false,
        }),
      ).toThrow("Credential offer does not support binding DIDs.");
    });

    it("should log received credentials", async () => {
      const consoleSpy = jest.spyOn(console, "info").mockImplementation();

      await getCredentialsWithAgent(agent, mockResolvedOffer);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Received credentials"),
      );

      consoleSpy.mockRestore();
    });
  });

  describe("resolveAndGetCredentialsWithAgent", () => {
    it("should combine resolve and get credentials operations", async () => {
      const result = await resolveAndGetCredentialsWithAgent(
        agent,
        mockCredentialOffer,
      );

      expect(
        agent.modules.openId4VcHolderModule.resolveCredentialOffer,
      ).toHaveBeenCalledWith(mockCredentialOffer);
      expect(
        agent.modules.openId4VcHolderModule.requestToken,
      ).toHaveBeenCalled();
      expect(
        agent.modules.openId4VcHolderModule.requestCredentials,
      ).toHaveBeenCalled();

      expect(result).toEqual([mockResolvedOffer, mockCredentialResponse]);
    });
  });

  describe("storeCredentialsWithAgent", () => {
    it("should store JWT credentials correctly", async () => {
      const jwtCredential = {
        credential: new W3cJwtVerifiableCredential({} as any),
      } as OpenId4VciCredentialResponse;

      await storeCredentialsWithAgent(agent, [jwtCredential]);

      expect(agent.w3cCredentials.storeCredential).toHaveBeenCalledWith({
        credential: jwtCredential.credential,
      });
    });

    it("should store JSON-LD credentials correctly", async () => {
      const jsonLdCredential = {
        credential: new W3cJsonLdVerifiableCredential({} as any),
      } as OpenId4VciCredentialResponse;

      await storeCredentialsWithAgent(agent, [jsonLdCredential]);

      expect(agent.w3cCredentials.storeCredential).toHaveBeenCalledWith({
        credential: jsonLdCredential.credential,
      });
    });

    it("should throw error for invalid credential types", async () => {
      const invalidCredential = {
        credential: { type: "invalid" },
      } as unknown as OpenId4VciCredentialResponse;

      await expect(
        storeCredentialsWithAgent(agent, [invalidCredential]),
      ).rejects.toThrow("Invalid credential type.");
    });
  });

  describe("storeIssuerNameFromOfferWithAgent", () => {
    it("should extract and store issuer name from offer metadata", async () => {
      const issuerDid = "did:indy:issuer123";
      const result = await storeIssuerNameFromOfferWithAgent(
        agent,
        mockResolvedOffer,
        issuerDid,
      );

      expect(agent.genericRecords.save).toHaveBeenCalledWith({
        id: issuerDid,
        content: {
          name: "Test Issuer",
        },
      });

      expect(result).toBe("Test Issuer");
    });

    it("should handle missing display information", async () => {
      const issuerDid = "did:indy:issuer123";
      const offerWithoutDisplay = {
        ...mockResolvedOffer,
        metadata: {
          credentialIssuerMetadata: {},
        },
      } as unknown as OpenId4VciResolvedCredentialOffer;

      const result = await storeIssuerNameFromOfferWithAgent(
        agent,
        offerWithoutDisplay,
        issuerDid,
      );

      expect(agent.genericRecords.save).toHaveBeenCalledWith({
        id: issuerDid,
        content: {
          name: "N/A",
        },
      });

      expect(result).toBe("N/A");
    });

    it("should log errors when saving generic record fails", async () => {
      const issuerDid = "did:indy:issuer123";
      const error = new Error("Failed to save");

      agent.genericRecords.save.mockRejectedValueOnce(error);

      const result = await storeIssuerNameFromOfferWithAgent(
        agent,
        mockResolvedOffer,
        issuerDid,
      );

      expect(agent.config.logger.debug).toHaveBeenCalledWith(
        expect.stringContaining("Unable to save generic record"),
      );

      expect(result).toBe("Test Issuer");
    });
  });
});
