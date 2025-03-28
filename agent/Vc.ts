import {
  Agent,
  W3cJwtVerifiableCredential,
  W3cJsonLdVerifiableCredential,
} from "@credo-ts/core";
import { OpenId4VciCredentialBindingOptions } from "@credo-ts/openid4vc";

// Based on code found in: https://credo.js.org/guides/tutorials/openid4vc/receiving-and-proving-credentials-using-openid4vc-holder-module
export async function receiveAllOfferedOpenId4VcCredentialWithAgent(
  agent: Agent,
  credentialOffer: string,
) {
  const resolvedCredentialOffer =
    await agent.modules.openId4VcHolderModule.resolveCredentialOffer(
      credentialOffer,
    );
  console.info(
    `Resolved credential offer ${JSON.stringify(resolvedCredentialOffer.credentialOfferPayload, null, 2)}`,
  );

  const accessTokenResponse =
    await agent.modules.openId4VcHolderModule.requestToken({
      resolvedCredentialOffer,
    });
  const accessToken = accessTokenResponse.accessToken;
  const cNonce = accessTokenResponse.cNonce;
  const dpop = accessTokenResponse.dpop;

  const did = (
    await agent.dids.getCreatedDids({
      method: "indy",
    })
  )[0];

  const credentials =
    await agent.modules.openId4VcHolderModule.requestCredentials({
      resolvedCredentialOffer,
      accessToken,
      cNonce,
      dpop,
      credentialBindingResolver: ({
        supportedDidMethods,
        supportsAllDidMethods,
      }: OpenId4VciCredentialBindingOptions) => {
        if (
          supportsAllDidMethods ||
          supportedDidMethods?.includes("did:indy")
        ) {
          return {
            method: "did",
            didUrl: `${did.did}#verkey`,
          };
        } else
          throw new Error("Credential offer does not support binding DIDs.");
      },
    });

  console.info(`Received credentials ${JSON.stringify(credentials, null, 2)}`);

  // Store the received credentials
  for (const credential of credentials) {
    const vc = credential.credential;
    console.log(typeof vc);
    if (
      vc instanceof W3cJwtVerifiableCredential ||
      vc instanceof W3cJsonLdVerifiableCredential
    ) {
      await agent.w3cCredentials.storeCredential({
        credential: vc,
      });
    } else throw new Error("Invalid credential type.");
  }
}
