import { useAgent } from "@credo-ts/react-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";

import {
  resolveAndGetCredentialsWithAgent,
  storeIssuerNameFromOfferWithAgent,
} from "@/agent/Vc";
import LoadingComponent from "@/components/LoadingComponent";
import { Colors } from "@/constants/Colors";
import { useCredentialResponsesStore } from "@/state/CredentialResponsesStore";
import { useIssuerInfoStore } from "@/state/IssuerInfoStore";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

export default function URLScreen() {
  const [url, setUrl] = useState("");
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
      <View style={defaultStyles.overlay}>
        <Text style={defaultStyles.overlayText}>Write URL here</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com"
          value={url}
          onChangeText={setUrl}
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>
      <Pressable style={defaultStyles.uploadButton} onPress={handleUpload}>
        <Text style={defaultStyles.uploadButtonText}>Upload</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    backgroundColor: Colors.lightgray,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
