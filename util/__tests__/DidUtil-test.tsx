import { Agent, KeyType, Key, TypedArrayEncoder } from "@credo-ts/core";

import {
  getDidForAgent,
  getGenesisTransactionsFromRemote,
} from "@/util/DidUtil";
import { getBackendIp, getIndyIp } from "@/util/NetworkUtil";

jest.mock("@/util/NetworkUtil", () => ({
  getBackendIp: jest.fn().mockReturnValue("192.168.1.100"),
  getIndyIp: jest.fn().mockReturnValue("192.168.1.100"),
}));

describe("Agent Utility Functions", () => {
  let mockAgent: jest.Mocked<Agent>;
  let mockResponse: any;
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAgent = {
      dids: {
        getCreatedDids: jest.fn(),
        resolve: jest.fn(),
        import: jest.fn(),
      },
      wallet: {
        createKey: jest.fn(),
      },
      context: {
        wallet: {
          sign: jest.fn(),
        },
      },
    } as unknown as jest.Mocked<Agent>;

    mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        seed: "testSeed12345678901234567890123",
        didUrl: "did:indy:testnet:ABC123456789",
      }),
      text: jest.fn().mockResolvedValue("Test error message"),
    };

    global.fetch = jest.fn().mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("getDidForAgent", () => {
    test("should not create a new DID if one already exists", async () => {
      mockAgent.dids.getCreatedDids.mockResolvedValue([
        { did: "did:indy:testnet:existing" },
      ] as any);

      await getDidForAgent(mockAgent);

      expect(mockAgent.dids.getCreatedDids).toHaveBeenCalledWith({
        method: "indy",
      });
      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockAgent.wallet.createKey).not.toHaveBeenCalled();
      expect(mockAgent.dids.import).not.toHaveBeenCalled();
    });

    test("should throw an error if backend response is not OK", async () => {
      mockAgent.dids.getCreatedDids.mockResolvedValue([]);

      mockResponse.ok = false;

      await expect(getDidForAgent(mockAgent)).rejects.toThrow(
        "Unable to generate DID for wallet. Reason: Test error message",
      );

      // Verify backend was called
      expect(global.fetch).toHaveBeenCalledWith(
        `http://${getBackendIp()}:3000/did`,
      );
    });

    test("should create key, verify signing ability, and import DID on success", async () => {
      // Mock no existing DIDs
      mockAgent.dids.getCreatedDids.mockResolvedValue([]);

      // Mock successful DID resolution
      const mockDidDocument = {
        didDocument: {
          dereferenceVerificationMethod: jest.fn().mockReturnValue({
            publicKeyBase58: "testPublicKey123",
          }),
        },
      };
      mockAgent.dids.resolve.mockResolvedValue(mockDidDocument as any);

      // Mock Key.fromPublicKeyBase58
      const mockKeyObject = { id: "testKeyId" };
      jest
        .spyOn(Key, "fromPublicKeyBase58")
        .mockReturnValue(mockKeyObject as any);

      await getDidForAgent(mockAgent);

      expect(mockAgent.wallet.createKey).toHaveBeenCalledWith({
        keyType: KeyType.Ed25519,
        seed: TypedArrayEncoder.fromString("testSeed12345678901234567890123"),
      });

      expect(mockAgent.dids.resolve).toHaveBeenCalledWith(
        "did:indy:testnet:ABC123456789",
      );

      expect(Key.fromPublicKeyBase58).toHaveBeenCalledWith(
        "testPublicKey123",
        KeyType.Ed25519,
      );

      expect(mockAgent.context.wallet.sign).toHaveBeenCalledWith({
        data: TypedArrayEncoder.fromString("test"),
        key: mockKeyObject,
      });

      expect(mockAgent.dids.import).toHaveBeenCalledWith({
        did: "did:indy:testnet:ABC123456789",
      });
    });

    test("should throw an error if signing fails", async () => {
      // Mock no existing DIDs
      mockAgent.dids.getCreatedDids.mockResolvedValue([]);

      // Mock successful DID resolution
      const mockDidDocument = {
        didDocument: {
          dereferenceVerificationMethod: jest.fn().mockReturnValue({
            publicKeyBase58: "testPublicKey123",
          }),
        },
      };
      mockAgent.dids.resolve.mockResolvedValue(mockDidDocument as any);

      const mockKeyObject = { id: "testKeyId" };
      jest
        .spyOn(Key, "fromPublicKeyBase58")
        .mockReturnValue(mockKeyObject as any);

      const signingError = new Error("Signing failed");
      mockAgent.context.wallet.sign.mockRejectedValue(signingError);

      await expect(getDidForAgent(mockAgent)).rejects.toThrow(
        `Unable to use DID for singing. Error: ${signingError}`,
      );

      expect(mockAgent.dids.import).not.toHaveBeenCalled();
    });
  });

  describe("getGenesisTransactionsFromRemote", () => {
    beforeEach(() => {
      mockResponse.text = jest
        .fn()
        .mockResolvedValue(
          'Genesis tx with "node_ip":"host.docker.internal" and "client_ip":"127.0.0.1"',
        );
    });

    test("should return null if response is not OK", async () => {
      mockResponse.ok = false;

      const result =
        await getGenesisTransactionsFromRemote("test.path/genesis");

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalledWith("http://test.path/genesis");
    });

    test("should replace IP addresses in genesis transactions", async () => {
      const result =
        await getGenesisTransactionsFromRemote("test.path/genesis");

      expect(result).toBe(
        'Genesis tx with "node_ip":"192.168.1.100" and "client_ip":"192.168.1.100"',
      );
      expect(global.fetch).toHaveBeenCalledWith("http://test.path/genesis");
      expect(getIndyIp).toHaveBeenCalledTimes(2);
    });
  });
});
