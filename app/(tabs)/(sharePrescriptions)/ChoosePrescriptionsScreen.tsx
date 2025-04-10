import {
  ClaimFormat,
  DifPexInputDescriptorToCredentials,
  W3cCredentialRecord,
} from "@credo-ts/core";
import { useAgent } from "@credo-ts/react-hooks";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";

import LoadingComponent from "@/components/LoadingComponent";
import PrescriptionList from "@/components/PrescriptionList";
import { useResolvedAuthorizationRequestStore } from "@/state/ResolvedAuthorizationRequestStore";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

export default function ChoosePrescriptionsScreen() {
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<number[]>(
    [],
  );
  const agentContext = useAgent();
  const router = useRouter();

  const resolvedAuthorizationRequest = useResolvedAuthorizationRequestStore(
    ({ resolvedAuthorizationRequest }) => resolvedAuthorizationRequest,
  );
  const clearResolvedAuthorizationRequest =
    useResolvedAuthorizationRequestStore(({ clear }) => clear);

  const issuerNames = useQuery({
    queryKey: ["issuerNames"],
    queryFn: () =>
      agentContext.agent.genericRecords.getAll().then((records) => {
        const issuerNames: Record<string, unknown> = {};
        for (const record of records) {
          issuerNames[record.id] = record.content.name;
        }
        return issuerNames;
      }),
  });

  const toggleSelection = (id: number) => {
    setSelectedPrescriptions((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id],
    );
  };

  const handleCancel = () => {
    clearResolvedAuthorizationRequest();
    router.push("/(tabs)/(sharePrescriptions)");
  };

  if (issuerNames.isPending) return <LoadingComponent />;

  if (
    !resolvedAuthorizationRequest?.presentationExchange?.credentialsForRequest
      .areRequirementsSatisfied ||
    !issuerNames.isSuccess
  )
    return <Redirect href="/(tabs)/(sharePrescriptions)" />;

  if (
    resolvedAuthorizationRequest?.presentationExchange?.credentialsForRequest
      .requirements.length > 1
  )
    return <Redirect href="/(tabs)/(sharePrescriptions)" />;

  if (
    resolvedAuthorizationRequest?.presentationExchange?.credentialsForRequest
      .requirements[0].submissionEntry.length > 1
  )
    return <Redirect href="/(tabs)/(sharePrescriptions)" />;

  if (
    resolvedAuthorizationRequest?.presentationExchange?.credentialsForRequest
      .requirements[0].rule === "all"
  ) {
    console.log("All prescription credentials are to be submitted");
  }

  if (
    resolvedAuthorizationRequest?.presentationExchange?.credentialsForRequest
      .requirements[0].submissionEntry[0].inputDescriptorId !==
    "PrescriptionDescriptor"
  )
    return <Redirect href="/(tabs)/(sharePrescriptions)" />;

  const subMissionEntryCredentials =
    resolvedAuthorizationRequest?.presentationExchange?.credentialsForRequest
      .requirements[0].submissionEntry[0].verifiableCredentials;

  const w3cCredentialRecords = subMissionEntryCredentials
    .filter(
      (credential) =>
        credential.type === ClaimFormat.JwtVc ||
        credential.type === ClaimFormat.LdpVc,
    )
    .map((credential) => credential.credentialRecord);

  const handleShare = async () => {
    if (selectedPrescriptions?.length < 1) {
      console.error("No prescription selected");
      router.push("/(tabs)/(sharePrescriptions)");
    }

    const chosenPrescriptions = w3cCredentialRecords.filter((item) => {
      return selectedPrescriptions.includes(w3cCredentialRecords.indexOf(item));
    });

    const credentials: DifPexInputDescriptorToCredentials = {};
    credentials[
      resolvedAuthorizationRequest?.presentationExchange?.credentialsForRequest.requirements[0].submissionEntry[0].inputDescriptorId
    ] = chosenPrescriptions;

    try {
      await agentContext.agent.modules.openId4VcHolderModule.acceptSiopAuthorizationRequest(
        {
          presentationExchange: {
            credentials,
          },
          authorizationRequest:
            resolvedAuthorizationRequest?.authorizationRequest,
        },
      );
    } catch (error) {
      console.error(error);
    }

    clearResolvedAuthorizationRequest();
    router.push("/(tabs)/(sharePrescriptions)");
  };

  return (
    <View style={defaultStyles.container}>
      <View style={defaultStyles.overlay}>
        <Text style={defaultStyles.overlayText}>
          {
            resolvedAuthorizationRequest?.presentationExchange
              ?.credentialsForRequest.name
          }
        </Text>
        <Text style={defaultStyles.overlayText}>
          {
            resolvedAuthorizationRequest?.presentationExchange
              ?.credentialsForRequest.purpose
          }
        </Text>
      </View>
      <PrescriptionList
        prescriptions={w3cCredentialRecords as W3cCredentialRecord[]}
        issuerNames={issuerNames.data}
        selectedPrescriptions={selectedPrescriptions}
        onToggleSelection={toggleSelection}
      />
      <View style={defaultStyles.buttonContent}>
        <Pressable style={styles.button} onPress={handleCancel}>
          <View style={defaultStyles.buttonContent}>
            <Text style={defaultStyles.buttonText}>Cancel</Text>
          </View>
        </Pressable>
        <Pressable style={styles.button} onPress={handleShare}>
          <View style={defaultStyles.buttonContent}>
            <MaterialCommunityIcons
              name="share-variant"
              size={20}
              color="white"
            />
            <Text style={defaultStyles.buttonText}>Share</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    ...defaultStyles.button,
    flex: 1,
  },
});
