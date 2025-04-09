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

export default function ViewPrescriptions() {
  const agentContext = useAgent();
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<string[]>(
    [],
  );

  const toggleSelection = (id: string) => {
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
          <p><strong>Added:</strong> ${new Date(item.added).toLocaleDateString()}</p>
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
      const selectedData = prescriptions.data.flatMap((credential) => {
        const subject = credential.credential.credentialSubject;
        console.log(subject);
        const data = Array.isArray(subject) ? subject : [subject];
        return data
          .filter((item) => {
            const itemId = JSON.stringify(item);
            return selectedPrescriptions.includes(itemId);
          })
          .map((item) => ({
            issuer:
              issuerNames.data[credential.credential.issuerId] ??
              credential.credential.issuerId,
            name: item.claims?.name ?? "N/A",
            activeIngredient: item.claims?.activeIngredient ?? "N/A",
            authoredOn: item.claims?.authoredOn ?? "N/A",
            added: credential.createdAt,
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

  const handleShare = () => {
    console.log("Sharing:", selectedPrescriptions);
    // Implement actual share logic here
  };

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
          issuerNames[record.id] = record.content.name;
        }
        return issuerNames;
      }),
  });

  if (prescriptions.isPending || issuerNames.isPending)
    return <LoadingComponent />;

  if (
    !prescriptions.isSuccess ||
    !issuerNames.isSuccess ||
    prescriptions.error ||
    issuerNames.error
  )
    return (
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.title}>
          Something went wrong fetching data.
        </Text>
      </View>
    );

  return (
    <View style={defaultStyles.container}>
      <PrescriptionList
        prescriptions={prescriptions.data}
        issuerNames={issuerNames.data}
        selectedPrescriptions={selectedPrescriptions}
        onToggleSelection={toggleSelection}
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

        <Pressable
          style={[styles.button]}
          onPress={handleShare}
          disabled={selectedPrescriptions.length === 0}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="share-variant"
            size={20}
            color="white"
          />
          <Text style={styles.buttonText}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    width: "90%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.button,
    padding: 12,
    borderRadius: 8,
    width: "48%",
    gap: 8,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
