import { AskarModule } from "@credo-ts/askar";
import { Agent, DidsModule, ConsoleLogger, LogLevel } from "@credo-ts/core";
import {
  IndyVdrModule,
  IndyVdrIndyDidResolver,
  IndyVdrSovDidResolver,
} from "@credo-ts/indy-vdr";
import { OpenId4VcHolderModule } from "@credo-ts/openid4vc";
import { agentDependencies } from "@credo-ts/react-native";
import { ariesAskar } from "@hyperledger/aries-askar-react-native";
import { indyVdr } from "@hyperledger/indy-vdr-react-native";

import transactions from "@/assets/genesis.json";
import { getGenesisTransactionsFromRemote } from "@/util/DidUtil";
import { getIndyIp } from "@/util/NetworkUtil";

/**
 * Initializes the agent with the given user ID and string key.
 *
 * @param {string} userId - The user ID for the agent.
 * @param {string} stringKey - The string key for the agent's wallet.
 * @returns {Promise<Agent>} - A promise that resolves to the initialized agent.
 */
export async function initializeAgent(
  userId: string,
  stringKey: string,
): Promise<Agent> {
  const genesisTransactionsPath = getIndyIp() + ":9000/genesis";
  const remoteGenesisTx = await getGenesisTransactionsFromRemote(
    genesisTransactionsPath,
  );
  const genesisTx = remoteGenesisTx ?? transactions.genesisTransactions;

  const agent = new Agent({
    config: {
      label: userId + "wallet",
      walletConfig: {
        id: userId,
        key: stringKey,
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
            genesisTransactions: genesisTx,
            connectOnStartup: true,
          },
        ],
      }),
      askar: new AskarModule({
        ariesAskar,
      }),
      dids: new DidsModule({
        resolvers: [new IndyVdrIndyDidResolver(), new IndyVdrSovDidResolver()],
      }),
      openId4VcHolderModule: new OpenId4VcHolderModule(),
    },
  });

  await agent.initialize();

  return agent;
}
