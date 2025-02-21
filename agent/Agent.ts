import {
    Agent,
    DidsModule
} from '@credo-ts/core'
import { agentDependencies } from '@credo-ts/react-native'
import { AskarModule } from '@credo-ts/askar'
import { ariesAskar } from '@hyperledger/aries-askar-react-native'

import {
    IndyVdrModule,
    IndyVdrIndyDidRegistrar,
    IndyVdrIndyDidResolver
} from '@credo-ts/indy-vdr'
import { indyVdr } from '@hyperledger/indy-vdr-react-native'
import { GenesisTransactions } from "@/constants/GenesisTransactions";

export async function initializeAgent(userId: string) {
    const agent = new Agent({
        walletConfig: {
            id: userId,
            key: userId
        },
        dependencies: agentDependencies,
        modules: {
            indyVdr: new IndyVdrModule({
                indyVdr,
                networks: [
                    {
                        isProduction: false,
                        indyNamespace: 'localhost',
                        genesisTransactions: GenesisTransactions,
                        connectOnStartup: true,
                    }
                ]
            }),
            askar: new AskarModule({
                ariesAskar,
            }),
            dids: new DidsModule({
                registrars: [new IndyVdrIndyDidRegistrar()],
                resolvers: [new IndyVdrIndyDidResolver()],
            })
        },
    })

    await agent.initialize();

    return agent;
}

async function fetchGenesisTransaction() {

}