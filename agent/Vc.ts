import {
  Agent,
  W3cJwtVerifiableCredential,
  W3cJsonLdVerifiableCredential,
  W3cCredentialRecord,
} from "@credo-ts/core";
import {
  OpenId4VciCredentialBindingOptions,
  OpenId4VciCredentialResponse,
  OpenId4VciResolvedCredentialOffer,
} from "@credo-ts/openid4vc";

/**
 * Interface representing the structure of a prescription claim.
 */
export interface PrescriptionClaims {
  /** The name of the prescription */
  name: string;
  /** The date the prescription was authored */
  authoredOn: string;
  /** The active ingredient of the prescription (optional) */
  activeIngredient?: string;
}

/**
 * Resolves a credential offer using the agent.
 * This process involves parsing the offer and resolving it to get necessary credential details.
 *
 * @param {Agent} agent - The agent instance responsible for handling the OpenID4VC operations.
 * @param {string} credentialOffer - The credential offer in string format.
 * @returns {Promise<OpenId4VciResolvedCredentialOffer>} A promise that resolves with the resolved credential offer.
 */
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

/**
 * Requests credentials using the agent and the resolved credential offer.
 * This process involves sending a request to the OpenID4VC issuer to obtain the credentials.
 *
 * @param {Agent} agent - The agent instance responsible for handling the OpenID4VC operations.
 * @param {OpenId4VciResolvedCredentialOffer | null} resolvedCredentialOffer - The resolved credential offer.
 * @returns {Promise<OpenId4VciCredentialResponse[]>} A promise that resolves with an array of credential responses.
 */
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

/**
 * Resolves a credential offer and requests the credentials using the agent.
 *
 * @param {Agent} agent - The agent instance responsible for handling the OpenID4VC operations.
 * @param {string} credentialOffer - The credential offer in string format.
 * @returns {Promise<[OpenId4VciResolvedCredentialOffer, OpenId4VciCredentialResponse[]]>} A promise that resolves with a tuple containing the resolved credential offer and an array of credential responses.
 */
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

/**
 * Stores the received credentials into the agent's credential store.
 * It verifies that the credential is either a JWT or JSON-LD verifiable credential before storing.
 *
 * @param {Agent} agent - The agent instance where the credentials will be stored.
 * @param {OpenId4VciCredentialResponse[]} credentials - The list of credential responses to be stored.
 * @throws {Error} Throws an error if the credential type is invalid.
 */
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

/**
 * Stores the issuer name from the credential offer in the agent's generic records.
 *
 * @param {Agent} agent - The agent instance where the issuer name will be stored.
 * @param {OpenId4VciResolvedCredentialOffer} resolvedOffer - The resolved credential offer containing the metadata.
 * @param {string} issuerDid - The DID of the issuer whose name is to be stored.
 * @returns {Promise<string>} The name of the issuer.
 */
export async function storeIssuerNameFromOfferWithAgent(
  agent: Agent,
  resolvedOffer: OpenId4VciResolvedCredentialOffer,
  issuerDid: string,
): Promise<string> {
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

export async function storeVerifierNameVcIsSharedWith(
  agent: Agent,
  vc: W3cCredentialRecord,
  name: string,
) {
  let vcNameRecord;
  try {
    vcNameRecord = await agent.genericRecords.findById(vc.id);
  } catch (error) {
    agent.config.logger.info(
      `Verifiable credential with id ${vc.id} has names stored. Adding new name to record...`,
    );
    if (error instanceof Error) agent.config.logger.debug("Cause:", error);
  }

  if (vcNameRecord) {
    try {
      if (!(vcNameRecord.content.names as string[]).includes(name)) {
        (vcNameRecord.content.names as string[]).push(name);
        await agent.genericRecords.update(vcNameRecord);
        agent.config.logger.info(
          `Added name ${name} to existing record for verifiable credential with id ${vc.id}.`,
        );
      }
    } catch (error) {
      if (error instanceof Error)
        agent.config.logger.error(
          `Unable to store verifier name ${name} for verifiable credential with id ${vc.id}. Cause:`,
          error,
        );
    }
    return;
  }

  try {
    await agent.genericRecords.save({
      id: vc.id,
      content: {
        names: [name],
      },
    });
  } catch (error) {
    if (error instanceof Error)
      agent.config.logger.error(
        `Unable to store verifier name ${name} for verifiable credential with id ${vc.id}. Cause:`,
        error,
      );
  }
}
