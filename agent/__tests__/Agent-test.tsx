import { Agent } from "@credo-ts/core";

import { initializeAgent } from "@/agent/Agent";
import transactions from "@/assets/genesis.json";
import { getGenesisTransactionsFromRemote } from "@/util/DidUtil";
import { getIndyIp } from "@/util/NetworkUtil";

jest.mock("@/util/DidUtil", () => ({
  getGenesisTransactionsFromRemote: jest.fn(),
}));

jest.mock("@/util/NetworkUtil", () => ({
  getIndyIp: jest.fn(),
}));

jest.mock("@credo-ts/react-native", () => ({
  agentDependencies: {},
}));

jest.mock("@hyperledger/aries-askar-react-native", () => ({
  ariesAskar: {},
}));

jest.mock("@hyperledger/indy-vdr-react-native", () => ({
  indyVdr: {},
}));

jest.mock("@credo-ts/core", () => {
  const actual = jest.requireActual("@credo-ts/core");
  return {
    ...actual,
    Agent: jest.fn().mockImplementation(() => ({
      initialize: jest.fn(),
    })),
    ConsoleLogger: jest.fn(),
    LogLevel: actual.LogLevel,
  };
});

describe("initializeAgent", () => {
  const mockUserId = "test-user";
  const mockKey = "test-key";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize agent with remote genesis transactions", async () => {
    (getIndyIp as jest.Mock).mockReturnValue("http://mock-ip");
    (getGenesisTransactionsFromRemote as jest.Mock).mockResolvedValue(
      "remote-genesis",
    );

    const agent = await initializeAgent(mockUserId, mockKey);

    expect(getIndyIp).toHaveBeenCalled();
    expect(getGenesisTransactionsFromRemote).toHaveBeenCalledWith(
      "http://mock-ip:9000/genesis",
    );

    expect(Agent).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          label: expect.stringContaining(mockUserId),
          walletConfig: {
            id: mockUserId,
            key: mockKey,
          },
        }),
        dependencies: {},
        modules: expect.objectContaining({
          indyVdr: expect.objectContaining({
            config: expect.objectContaining({
              networks: expect.arrayContaining([
                expect.objectContaining({
                  genesisTransactions: "remote-genesis",
                }),
              ]),
            }),
          }),
        }),
      }),
    );

    expect(agent.initialize).toHaveBeenCalled();
  });

  it("should fall back to local genesis file if remote returns null", async () => {
    (getIndyIp as jest.Mock).mockReturnValue("http://mock-ip");
    (getGenesisTransactionsFromRemote as jest.Mock).mockResolvedValue(null);

    const agent = await initializeAgent(mockUserId, mockKey);

    expect(getGenesisTransactionsFromRemote).toHaveBeenCalled();
    expect(agent.initialize).toHaveBeenCalled();

    expect(Agent).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          label: expect.stringContaining(mockUserId),
          walletConfig: {
            id: mockUserId,
            key: mockKey,
          },
        }),
        dependencies: {},
        modules: expect.objectContaining({
          indyVdr: expect.objectContaining({
            config: expect.objectContaining({
              networks: expect.arrayContaining([
                expect.objectContaining({
                  genesisTransactions: transactions.genesisTransactions,
                }),
              ]),
            }),
          }),
        }),
      }),
    );
  });
});
