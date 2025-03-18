import { Agent } from "@credo-ts/core";

// Based on code found in: https://credo.js.org/guides/tutorials/openid4vc/receiving-and-proving-credentials-using-openid4vc-holder-module
export async function receiveOpenId4VcCredentialWithAgent(
  agent: Agent,
  credentialOffer: string,
) {
  const resolvedCredentialOffer =
    await agent.modules.openId4VcHolderModule.resolveCredentialOffer(
      credentialOffer,
    );
  console.log(
    "Resolved credential offer",
    JSON.stringify(resolvedCredentialOffer.credentialOfferPayload, null, 2),
  );

  const accessTokenResponse =
    await agent.modules.openId4VcHolderModule.requestToken({
      resolvedCredentialOffer,
    });
  const accessToken = accessTokenResponse.accessToken;

  const did = (
    await agent.dids.getCreatedDids({
      method: "indy",
    })
  )[0];

  const credentials =
    await agent.modules.openId4VcHolderModule.requestCredentials({
      resolvedCredentialOffer,
      accessToken,
      credentialBindingResolver: () => {
        return {
          method: "did",
          didUrl: `${did.did}#verkey`,
        };
      },
    });

  console.log("Received credentials", JSON.stringify(credentials, null, 2));

  // Store the received credentials
  for (const credential of credentials) {
    if ("compact" in credential) {
      await agent.sdJwtVc.store(credential.compact);
    } else {
      await agent.w3cCredentials.storeCredential({
        credential,
      });
    }
  }
}
