import { useAgent } from "@credo-ts/react-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";

import {
  resolveAndGetCredentialsWithAgent,
  storeIssuerNameFromOfferWithAgent,
} from "@/agent/Vc";
import LoadingComponent from "@/components/LoadingComponent";
import URLInputComponent from "@/components/URLInputComponent";
import { useCredentialResponsesStore } from "@/state/CredentialResponsesStore";
import { useIssuerInfoStore } from "@/state/IssuerInfoStore";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

/**
 * Screen for handling URL input and receiving digital credentials.
 *
 * - Allows the user to input a URL.
 * - Resolves and retrieves credentials using the input URL and the agent.
 * - Stores the issuer name and credential responses in state management stores.
 * - Navigates to the DeclineAcceptScreen if the credential is successfully retrieved,
 *   or to NotReceived if an error occurs or the credential is invalid.
 *
 * @returns The URLScreen component.
 */
export default function URLScreen() {
  const [url, setUrl] = useState<string>("");
  const [receivingState, setReceivingState] = useState(false);
  const agentContext = useAgent();
  const router = useRouter();
  const queryClient = useQueryClient();

  const setCredentialResponses = useCredentialResponsesStore(({ set }) => set);
  const setIssuerInfo = useIssuerInfoStore(({ set }) => set);

  const handleUpload = async () => {
    console.log("Uploading URLScreen:", url);
    try {
      setReceivingState(true);
      const [resolvedOffer, credentialResponses] =
        await resolveAndGetCredentialsWithAgent(agentContext.agent, url);
      if (credentialResponses.length < 1)
        throw new Error("No credentials were received.");

      if (credentialResponses.length > 1)
        throw new Error("Handling of multiple credentials is not implemented");

      const issuerName = await storeIssuerNameFromOfferWithAgent(
        agentContext.agent,
        resolvedOffer,
        credentialResponses[0].credential.credential.issuerId,
      );

      await queryClient.invalidateQueries({
        queryKey: ["issuerNames"],
      });
      setCredentialResponses(credentialResponses);
      if (issuerName) setIssuerInfo(issuerName);
      setUrl("");
      setReceivingState(false);
      router.push("/DeclineAcceptScreen");
    } catch (e) {
      setReceivingState(false);
      setUrl("");
      console.error(e);
      router.push("/NotReceived");
    }
  };

  if (receivingState) return <LoadingComponent />;

  return (
    <View style={defaultStyles.container}>
      <URLInputComponent url={url} onUrlChange={setUrl} />
      <Pressable style={defaultStyles.uploadButton} onPress={handleUpload}>
        <Text style={defaultStyles.uploadButtonText}>Upload</Text>
      </Pressable>
    </View>
  );
}
