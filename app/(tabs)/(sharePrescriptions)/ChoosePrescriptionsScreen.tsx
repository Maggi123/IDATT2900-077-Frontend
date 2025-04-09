import { ClaimFormat, W3cCredentialRecord } from "@credo-ts/core";
import { useAgent } from "@credo-ts/react-hooks";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import LoadingComponent from "@/components/LoadingComponent";
import PrescriptionList from "@/components/PrescriptionList";
import { useResolvedAuthorizationRequestStore } from "@/state/ResolvedAuthorizationRequestStore";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

export default function ChoosePrescriptionsScreen() {
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<number[]>(
    [],
  );
  const agentContext = useAgent();

  const resolvedAuthorizationRequest = useResolvedAuthorizationRequestStore(
    ({ resolvedAuthorizationRequest }) => resolvedAuthorizationRequest,
  );

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

  console.log(
    resolvedAuthorizationRequest?.presentationExchange?.credentialsForRequest
      .requirements[0].submissionEntry[0].inputDescriptorId,
  );

  if (
    resolvedAuthorizationRequest?.presentationExchange?.credentialsForRequest
      .requirements[0].submissionEntry[0].inputDescriptorId !==
    "PrescriptionDescriptor"
  )
    return <Redirect href="/(tabs)/(sharePrescriptions)" />;

  const credentials =
    resolvedAuthorizationRequest?.presentationExchange?.credentialsForRequest
      .requirements[0].submissionEntry[0].verifiableCredentials;

  const prescriptions = credentials
    .filter(
      (credential) =>
        credential.type === ClaimFormat.JwtVc ||
        credential.type === ClaimFormat.LdpVc,
    )
    .map((credential) => credential.credentialRecord);

  return (
    <View style={defaultStyles.container}>
      <View style={defaultStyles.overlay}>
        <Text style={defaultStyles.overlayText}>Purpose:</Text>
        <Text style={defaultStyles.overlayText}>
          {
            resolvedAuthorizationRequest?.presentationExchange
              ?.credentialsForRequest.purpose
          }
        </Text>
      </View>
      <PrescriptionList
        prescriptions={prescriptions as W3cCredentialRecord[]}
        issuerNames={issuerNames.data}
        selectedPrescriptions={selectedPrescriptions}
        onToggleSelection={toggleSelection}
      />
    </View>
  );
}
