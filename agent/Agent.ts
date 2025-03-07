import { AskarModule } from "@credo-ts/askar";
import { Agent, DidsModule, ConsoleLogger, LogLevel } from "@credo-ts/core";
import { IndyVdrModule, IndyVdrIndyDidResolver } from "@credo-ts/indy-vdr";
import { agentDependencies } from "@credo-ts/react-native";
import { ariesAskar } from "@hyperledger/aries-askar-react-native";
import { indyVdr } from "@hyperledger/indy-vdr-react-native";

import transactions from "@/assets/genesis.json";

export async function initializeAgent(userId: string) {
  const agent = new Agent({
    config: {
      label: userId + "wallet",
      walletConfig: {
        id: userId,
        key: userId,
      },
      logger: new ConsoleLogger(LogLevel.test),
    },
    dependencies: agentDependencies,
    modules: {
      indyVdr: new IndyVdrModule({
        indyVdr,
        networks: [
          {
            isProduction: false,
            indyNamespace: "local",
            genesisTransactions: transactions.genesisTransactions,
            connectOnStartup: true,
          },
        ],
      }),
      askar: new AskarModule({
        ariesAskar,
      }),
      dids: new DidsModule({
        resolvers: [new IndyVdrIndyDidResolver()],
      }),
    },
  });

  await agent.initialize();

  return agent;
}
