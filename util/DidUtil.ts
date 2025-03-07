import { Agent, KeyType, JsonEncoder } from "@credo-ts/core";

import { getBackendIp, getIndyIp } from "@/util/NetworkUtil";

export async function getDidForAgent(agent: Agent) {
  if ((await agent.dids.getCreatedDids()).length > 0) return;

  const didResponse = await fetch("http://" + getBackendIp() + ":3000/did");
  let didMetadata;

  if (!didResponse.ok) {
    throw new Error("Unable to generate DID for wallet.");
  } else {
    didMetadata = await didResponse.json();
  }

  await agent.wallet.createKey({
    keyType: KeyType.Ed25519,
    seed: JsonEncoder.toBuffer(didMetadata.didState.secret.seed),
  });

  await agent.dids.import({
    did: didMetadata.didState.did,
  });
}

export async function getGenesisTransactionsFromRemote(
  genesisTransactionsPath: string,
) {
  const response = await fetch("http://" + genesisTransactionsPath);
  let genesisTx;

  if (!response.ok) {
    return null;
  } else {
    genesisTx = await response.text();

    /* Replace the IPs in the Indy networks genesis transactions.
     * If a VON network is started without specifying an IP,
     * the genesis transactions specifies "host.internal.docker",
     * which can not be resolved from the Android Emulator. */
    genesisTx = genesisTx.replaceAll(
      /"node_ip":"([^"]*)"/g,
      '"node_ip":"' + getIndyIp() + '"',
    );
    genesisTx = genesisTx.replaceAll(
      /"client_ip":"([^"]*)"/g,
      '"client_ip":"' + getIndyIp() + '"',
    );
  }

  return genesisTx;
}
