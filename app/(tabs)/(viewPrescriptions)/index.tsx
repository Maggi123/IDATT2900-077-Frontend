import { asArray } from "@credo-ts/core";
import { useAgent } from "@credo-ts/react-hooks";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { printToFileAsync } from "expo-print";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

import LoadingComponent from "@/components/LoadingComponent";
import PrescriptionList from "@/components/PrescriptionList";
import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

/**
 * Screen for viewing and exporting prescriptions.
 *
 * - Fetches all credential records representing prescriptions from the agent.
 * - Retrieves issuer names from generic records.
 * - Displays prescriptions in a selectable list.
 * - Allows users to generate a PDF from selected prescriptions.
 * - Uses Expo's print and sharing APIs to export the PDF.
 *
 * @returns The ViewPrescriptions screen component.
 */
export default function ViewPrescriptions() {
  const agentContext = useAgent();
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<number[]>(
    [],
  );

  const prescriptions = useQuery({
    queryKey: ["prescription"],
    queryFn: () =>
      agentContext.agent.w3cCredentials
        .getAllCredentialRecords()
        .then((prescriptions) => {
          return prescriptions;
        }),
  });

  const issuerNames = useQuery({
    queryKey: ["issuerNames"],
    queryFn: () =>
      agentContext.agent.genericRecords.getAll().then((records) => {
        const issuerNames: Record<string, unknown> = {};
        for (const record of records) {
          if (record.content.name) issuerNames[record.id] = record.content.name;
        }
        return issuerNames;
      }),
  });

  const verifierNames = useQuery({
    queryKey: ["verifierNames"],
    queryFn: () =>
      agentContext.agent.genericRecords.getAll().then((records) => {
        const verifierNames: Record<string, string[]> = {};
        for (const record of records) {
          if (record.content.names)
            verifierNames[record.id] = record.content.names as string[];
        }
        return verifierNames;
      }),
  });

  if (
    prescriptions.isPending ||
    issuerNames.isPending ||
    verifierNames.isPending
  )
    return <LoadingComponent />;

  if (
    !prescriptions.isSuccess ||
    !issuerNames.isSuccess ||
    !verifierNames.isSuccess ||
    prescriptions.isError ||
    issuerNames.isError ||
    verifierNames.isError
  )
    return (
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.title}>
          Something went wrong fetching data.
        </Text>
      </View>
    );

  const toggleSelection = (id: number) => {
    setSelectedPrescriptions((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id],
    );
  };

  const generateHtmlFromPrescriptions = (prescriptionsData: any[]) => {
    return `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Prescription Report</title>
    <style>
      body { font-family: sans-serif; padding: 20px; }
      h1 { color: #4B0082; }
      .prescription {
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 6px;
      }
    </style>
  </head>
  <body>
    <h1>Prescriptions</h1>
    ${prescriptionsData
      .map(
        (item) => `
        <div class="prescription">
          <p><strong>Issuer:</strong> ${item.issuer}</p>
          <p><strong>Name:</strong> ${item.name}</p>
          <p><strong>Active Ingredient:</strong> ${item.activeIngredient}</p>
          <p><strong>Authored On:</strong> ${new Date(item.authoredOn).toLocaleDateString()}</p>
          <p><strong>Expires:</strong> ${new Date(item.expires).toLocaleDateString()}</p>
          <p><strong>Added:</strong> ${new Date(item.added).toLocaleDateString()}</p>
          <p><strong>Shared with:</strong><br> ${item.sharedWith.length > 0 ? item.sharedWith.join("<br>") : "N/A"}</p>
        </div>
      `,
      )
      .join("")}
  </body>
</html>
  `;
  };

  const handleDownloadPdf = async () => {
    try {
      const selectedData = prescriptions.data.flatMap((credential, index) => {
        const subject = credential.credential.credentialSubject;
        console.log(subject);
        const data = asArray(subject);
        return data
          .filter((_) => {
            return selectedPrescriptions.includes(index);
          })
          .map((item) => ({
            issuer:
              issuerNames.data[credential.credential.issuerId] ??
              credential.credential.issuerId,
            name: item.claims?.name ?? "N/A",
            activeIngredient: item.claims?.activeIngredient ?? "N/A",
            authoredOn: item.claims?.authoredOn ?? "N/A",
            expires: credential.credential.expirationDate ?? "N/A",
            added: credential.createdAt,
            sharedWith: verifierNames.data[credential.id] ?? [],
          }));
      });

      const html = generateHtmlFromPrescriptions(selectedData);
      const { uri } = await printToFileAsync({ html });

      console.log("PDF saved to:", uri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        alert("PDF saved at: " + uri);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Something went wrong while creating the PDF.");
    }
  };

  return (
    <View style={defaultStyles.container}>
      <PrescriptionList
        prescriptions={prescriptions.data}
        issuerNames={issuerNames.data}
        selectedPrescriptions={selectedPrescriptions}
        onToggleSelection={toggleSelection}
        verifierNames={verifierNames.data}
      />

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button]}
          onPress={handleDownloadPdf}
          disabled={selectedPrescriptions.length === 0}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="download" size={20} color="white" />
          <Text style={styles.buttonText}>Download</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    width: "100%",
  },
  button: {
    flexDirection: "row",
    ...defaultStyles.button,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
