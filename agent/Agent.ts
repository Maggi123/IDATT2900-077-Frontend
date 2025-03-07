import { AskarModule } from "@credo-ts/askar";
import { Agent, DidsModule, ConsoleLogger, LogLevel } from "@credo-ts/core";
import {
  IndyVdrModule,
  IndyVdrIndyDidRegistrar,
  IndyVdrIndyDidResolver,
} from "@credo-ts/indy-vdr";
import { agentDependencies } from "@credo-ts/react-native";
import { ariesAskar } from "@hyperledger/aries-askar-react-native";
import { indyVdr } from "@hyperledger/indy-vdr-react-native";

import { GenesisTransactions } from "@/constants/GenesisTransactions";

export async function initializeAgent(userId: string) {
  const agent = new Agent({
    config: {
      label: userId + "-wallet",
      walletConfig: {
        id: userId,
        key: userId,
      },
      logger: new ConsoleLogger(LogLevel.info),
    },
    dependencies: agentDependencies,
    modules: {
      indyVdr: new IndyVdrModule({
        indyVdr,
        networks: [
          {
            isProduction: false,
            indyNamespace: "localhost",
            genesisTransactions: GenesisTransactions,
            connectOnStartup: true,
          },
        ],
      }),
      askar: new AskarModule({
        ariesAskar,
      }),
      dids: new DidsModule({
        registrars: [new IndyVdrIndyDidRegistrar()],
        resolvers: [new IndyVdrIndyDidResolver()],
      }),
    },
  });

  await agent.initialize();

  return agent;
}
