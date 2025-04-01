import {
  Agent,
  W3cJwtVerifiableCredential,
  W3cJsonLdVerifiableCredential,
} from "@credo-ts/core";
import {
  OpenId4VciCredentialBindingOptions,
  OpenId4VciCredentialResponse,
  OpenId4VciResolvedCredentialOffer,
} from "@credo-ts/openid4vc";

export interface PrescriptionClaims {
  name: string;
  authoredOn: string;
  activeIngredient?: string;
}

// Based on code found in: https://credo.js.org/guides/tutorials/openid4vc/receiving-and-proving-credentials-using-openid4vc-holder-module
export async function resolveCredentialOfferWithAgent(
  agent: Agent,
  credentialOffer: string,
): Promise<OpenId4VciResolvedCredentialOffer> {
  const resolvedCredentialOffer =
    await agent.modules.openId4VcHolderModule.resolveCredentialOffer(
      credentialOffer,
    );
  console.info(
    `Resolved credential offer ${JSON.stringify(resolvedCredentialOffer.credentialOfferPayload, null, 2)}`,
  );

  return resolvedCredentialOffer;
}

export async function getCredentialsWithAgent(
  agent: Agent,
  resolvedCredentialOffer: OpenId4VciResolvedCredentialOffer | null,
): Promise<OpenId4VciCredentialResponse[]> {
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

  return credentials;
}

export async function resolveAndGetCredentialsWithAgent(
  agent: Agent,
  credentialOffer: string,
): Promise<
  [OpenId4VciResolvedCredentialOffer, OpenId4VciCredentialResponse[]]
> {
  const resolvedCredentialOffer = await resolveCredentialOfferWithAgent(
    agent,
    credentialOffer,
  );
  return [
    resolvedCredentialOffer,
    await getCredentialsWithAgent(agent, resolvedCredentialOffer),
  ];
}

export async function storeCredentialsWithAgent(
  agent: Agent,
  credentials: OpenId4VciCredentialResponse[],
) {
  // Store the received credentials
  for (const credential of credentials) {
    const vc = credential.credential;
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

export async function storeIssuerNameFromOfferWithAgent(
  agent: Agent,
  resolvedOffer: OpenId4VciResolvedCredentialOffer,
  issuerDid: string,
) {
  const issuerName = resolvedOffer.metadata.credentialIssuerMetadata.display
    ? (resolvedOffer.metadata.credentialIssuerMetadata.display[0].name ?? "N/A")
    : "N/A";

  try {
    await agent.genericRecords.save({
      id: issuerDid,
      content: {
        name: issuerName,
      },
    });
  } catch (e) {
    agent.config.logger.debug(
      `Unable to save generic record containing issuer name. Error ${e}`,
    );
  }

  return issuerName;
}
