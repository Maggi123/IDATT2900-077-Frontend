import { asArray } from "@credo-ts/core";
import { useAgent } from "@credo-ts/react-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Redirect, useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";

import { storeCredentialsWithAgent } from "@/agent/Vc";
import LoadingComponent from "@/components/LoadingComponent";
import PrescriptionDeclineAcceptComponent from "@/components/declineAcceptComponents/PrescriptionDeclineAcceptComponent";
import { Colors } from "@/constants/Colors";
import { useCredentialResponsesStore } from "@/state/CredentialResponsesStore";
import { useIssuerInfoStore } from "@/state/IssuerInfoStore";
import { addPrescriptionStyles } from "@/stylesheets/AddPrescriptionStyles";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

export default function DeclineAcceptScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const agentContext = useAgent();

  const credentialResponses = useCredentialResponsesStore(
    ({ credentialResponses }) => credentialResponses,
  );
  const clearCredentialResponses = useCredentialResponsesStore(
    ({ clear }) => clear,
  );

  const issuerInfoName = useIssuerInfoStore(({ name }) => name);
  const clearIssuerInfo = useIssuerInfoStore(({ clear }) => clear);

  if (!credentialResponses || credentialResponses.length < 1)
    return <LoadingComponent />;

  // Assumes only one credential has been issued
  const newPrescriptionCredentialSubjects = asArray(
    credentialResponses[0].credential.credential.credentialSubject,
  );

  // Credential received has no information
  if (newPrescriptionCredentialSubjects.length < 1)
    return <Redirect href="/NotReceived" />;

  const newPrescriptionDescription =
    newPrescriptionCredentialSubjects[0].claims;

  const clearStores = () => {
    clearCredentialResponses();
    clearIssuerInfo();
  };

  const handleAccept = async () => {
    try {
      await storeCredentialsWithAgent(agentContext.agent, credentialResponses);
      await queryClient.invalidateQueries({
        queryKey: ["prescription"],
      });
      router.push("/Received");
      clearStores();
    } catch (error) {
      console.error(error);
      router.push("/NotReceived");
      clearStores();
    }
  };

  const handleDecline = () => {
    clearStores();
    router.back();
  };

  return (
    <View style={addPrescriptionStyles.container}>
      <Text style={styles.containerText}>Issuer:</Text>
      <View style={addPrescriptionStyles.overlay}>
        {issuerInfoName.length > 0 ? (
          <Text style={addPrescriptionStyles.overlayText}>
            {issuerInfoName}
          </Text>
        ) : (
          <Text style={addPrescriptionStyles.overlayText}>
            No issuer information
          </Text>
        )}
      </View>
      <Text style={styles.containerText}>Document:</Text>
      <PrescriptionDeclineAcceptComponent
        newPrescriptionDescription={newPrescriptionDescription}
      />
      <View style={styles.buttonContainer}>
        <Pressable style={buttonStyles.declineButton} onPress={handleDecline}>
          <Text style={styles.buttonText}>Decline</Text>
        </Pressable>
        <Pressable style={buttonStyles.acceptButton} onPress={handleAccept}>
          <Text style={styles.buttonText}>Accept document</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerText: {
    ...defaultStyles.overlayText,
    color: "black",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    padding: 10,
    justifyContent: "space-evenly",
  },
  button: {
    ...defaultStyles.button,
    alignItems: "center",
    width: "45%",
    margin: 10,
    padding: 10,
    height: "70%",
  },
  buttonText: {
    ...addPrescriptionStyles.buttonText,
    color: Colors.text,
  },
});

const buttonStyles = StyleSheet.create({
  acceptButton: {
    ...styles.button,
    backgroundColor: Colors.acceptgray,
  },
  declineButton: {
    ...styles.button,
    backgroundColor: Colors.declinered,
  },
});
