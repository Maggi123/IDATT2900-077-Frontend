import {
  ClaimFormat,
  DifPexInputDescriptorToCredentials,
  W3cCredentialRecord,
} from "@credo-ts/core";
import { useAgent } from "@credo-ts/react-hooks";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";

import { storeVerifierNameVcIsSharedWith } from "@/agent/Vc";
import LoadingComponent from "@/components/LoadingComponent";
import PrescriptionList from "@/components/PrescriptionList";
import { useResolvedAuthorizationRequestStore } from "@/state/ResolvedAuthorizationRequestStore";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

/**
 * Screen for choosing and sharing prescriptions based on the resolved authorization request.
 *
 * - Displays a list of prescriptions retrieved from the wallet, with each prescription being selectable.
 * - Allows the user to select one or more prescriptions and share them in response to an authorization request.
 * - Handles various states such as loading, sharing, and validation of required credentials.
 * - Redirects the user to different screens based on whether the prescriptions are shared successfully or not.
 *
 * @returns The ChoosePrescriptionsScreen component.
 */
export default function ChoosePrescriptionsScreen() {
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<number[]>(
    [],
  );
  const [sharingState, setSharingState] = useState<boolean>(false);
  const agentContext = useAgent();
  const router = useRouter();
  const queryClient = useQueryClient();

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
    router.push("/NotShared");
  };

  if (issuerNames.isPending || sharingState) return <LoadingComponent />;

  if (!issuerNames.isSuccess) {
    console.error("Could not get issuer names.");
    return <Redirect href="/NotShared" />;
  }

  if (!resolvedAuthorizationRequest) {
    console.error("Resolved authorization request is undefined.");
    return <Redirect href="/NotShared" />;
  }

  if (!resolvedAuthorizationRequest.presentationExchange) {
    console.error(
      "Resolved authorization request has no presentation exchange.",
    );
    return <Redirect href="/NotShared" />;
  }

  if (
    !resolvedAuthorizationRequest.presentationExchange.credentialsForRequest
      .areRequirementsSatisfied
  ) {
    console.error(
      "Wallets credentials do not satisfy verification requirements.",
    );
    return <Redirect href="/NotShared" />;
  }

  if (
    resolvedAuthorizationRequest.presentationExchange.credentialsForRequest
      .requirements.length > 1
  ) {
    console.error(
      "Wallet implementation does not handle multiple requirements.",
    );
    return <Redirect href="/NotShared" />;
  }

  if (
    resolvedAuthorizationRequest.presentationExchange.credentialsForRequest
      .requirements[0].submissionEntry.length > 1
  ) {
    console.error(
      "Wallet implementation does not handle multiple input descriptors.",
    );
    return <Redirect href="/NotShared" />;
  }

  if (
    resolvedAuthorizationRequest.presentationExchange.credentialsForRequest
      .requirements[0].submissionEntry[0].inputDescriptorId !==
    "PrescriptionDescriptor"
  ) {
    console.error(
      "Wallet implementation does not handle input descriptors with ids other than 'PrescriptionDescriptor'.",
    );
    return <Redirect href="/NotShared" />;
  }

  const subMissionEntryCredentials =
    resolvedAuthorizationRequest.presentationExchange.credentialsForRequest
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
      router.push(
        "/(tabs)/(sharePrescriptions)/NoPrescriptionsChosenErrorModal",
      );
      return;
    }

    const chosenPrescriptions = w3cCredentialRecords.filter((item) => {
      return selectedPrescriptions.includes(w3cCredentialRecords.indexOf(item));
    });

    const credentials: DifPexInputDescriptorToCredentials = {};
    credentials[
      resolvedAuthorizationRequest.presentationExchange.credentialsForRequest.requirements[0].submissionEntry[0].inputDescriptorId
    ] = chosenPrescriptions;

    setSharingState(true);

    try {
      await agentContext.agent.modules.openId4VcHolderModule.acceptSiopAuthorizationRequest(
        {
          presentationExchange: {
            credentials,
          },
          authorizationRequest:
            resolvedAuthorizationRequest.authorizationRequest,
        },
      );
      for (const credential of chosenPrescriptions) {
        await storeVerifierNameVcIsSharedWith(
          agentContext.agent,
          credential as W3cCredentialRecord,
          resolvedAuthorizationRequest.authorizationRequest
            .registrationMetadataPayload.client_name,
        );
      }
      await queryClient.invalidateQueries({
        queryKey: ["verifierNames"],
      });
      setSharingState(false);
      clearResolvedAuthorizationRequest();
      router.push("/Shared");
    } catch (error) {
      setSharingState(false);
      clearResolvedAuthorizationRequest();
      console.error(error);
      router.push("/NotShared");
    }
  };

  return (
    <View style={defaultStyles.container}>
      <View style={defaultStyles.overlay}>
        <Text style={defaultStyles.overlayText}>
          {
            resolvedAuthorizationRequest.presentationExchange
              .credentialsForRequest.name
          }
        </Text>
        <Text style={defaultStyles.overlayText}>
          {
            resolvedAuthorizationRequest.presentationExchange
              .credentialsForRequest.purpose
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
        <Pressable
          style={styles.button}
          onPress={handleCancel}
          accessibilityRole="button"
        >
          <View style={defaultStyles.buttonContent}>
            <Text style={defaultStyles.buttonText}>Cancel</Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={handleShare}
          accessibilityRole="button"
        >
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
