import { Agent, KeyType, Key, TypedArrayEncoder } from "@credo-ts/core";

import { getBackendIp, getIndyIp } from "@/util/NetworkUtil";

/**
 * Fetches the DID for the agent.
 * If the agent does not have a DID, it generates one using the backend service.
 * It also verifies that the DID can be used for signing.
 *
 * @param agent The agent for which the DID is being retrieved.
 * @throws Error If the DID cannot be generated or used for signing.
 */
export async function getDidForAgent(agent: Agent) {
  const dids = await agent.dids.getCreatedDids({
    method: "indy",
  });

  // Assume that any imported Indy DID has been imported correctly
  if (dids.length > 0) return;

  const backendResponse = await fetch("http://" + getBackendIp() + ":3000/did");
  let responseJson;

  if (!backendResponse.ok) {
    throw new Error(
      `Unable to generate DID for wallet. Reason: ${await backendResponse.text()}`,
    );
  } else {
    responseJson = await backendResponse.json();
  }

  await agent.wallet.createKey({
    keyType: KeyType.Ed25519,
    seed: TypedArrayEncoder.fromString(responseJson.seed),
  });

  // Try to sign some random data with the DIDs private key
  // This is to check that we have been able to store the DIDs private key
  const didDocument = await agent.dids.resolve(responseJson.didUrl);
  const pubKey =
    didDocument.didDocument?.dereferenceVerificationMethod(
      "verkey",
    )?.publicKeyBase58;
  const keyObject = Key.fromPublicKeyBase58(pubKey!, KeyType.Ed25519);

  try {
    await agent.context.wallet.sign({
      data: TypedArrayEncoder.fromString("test"),
      key: keyObject,
    });
  } catch (e) {
    // If an error is caught, the DID can not be used for storing VCs.
    throw new Error(`Unable to use DID for singing. Error: ${e}`);
  }

  await agent.dids.import({
    did: responseJson.didUrl,
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
