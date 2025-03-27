import { W3cCredentialRecord, W3cCredentialSubject } from "@credo-ts/core";
import { useAgent } from "@credo-ts/react-hooks";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, SectionList, Pressable } from "react-native";

import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/stylesheets/defaultStyles";

export default function ViewPrescriptions() {
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<string[]>(
    [],
  );
  const agentContext = useAgent();

  const [prescriptions, setPrescriptions] = useState<W3cCredentialRecord[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedPrescriptions((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id],
    );
  };

  const handleDownload = () => {
    console.log("Downloading:", selectedPrescriptions);
    // Implement actual download logic here
  };

  const handleShare = () => {
    console.log("Sharing:", selectedPrescriptions);
    // Implement actual share logic here
  };

  useEffect(() => {
    agentContext.agent.w3cCredentials
      .getAllCredentialRecords()
      .then((prescriptions) => {
        setPrescriptions(prescriptions);
      })
      .catch(console.error);
  });

  return (
    <View style={defaultStyles.container}>
      <SectionList
        style={styles.list}
        sections={prescriptions.map((credential) => {
          const data: W3cCredentialSubject[] = [];
          if (credential.credential.credentialSubject instanceof Array) {
            data.concat(credential.credential.credentialSubject);
          } else {
            data.push(credential.credential.credentialSubject);
          }
          return {
            title: credential,
            data,
          };
        })}
        keyExtractor={(_, key) => `${key}`}
        renderItem={({ section, item }) => (
          <View style={styles.prescriptionBox}>
            <View style={styles.topRow}>
              <Text style={styles.issuer}>
                {section.title.credential.issuerId}
              </Text>
              <Pressable
                onPress={() => {
                  toggleSelection(
                    JSON.stringify(section) + JSON.stringify(item),
                  );
                }}
                style={[
                  styles.checkbox,
                  selectedPrescriptions.includes(
                    JSON.stringify(section) + JSON.stringify(item),
                  ) && styles.checked,
                ]}
              />
            </View>
            <Text style={styles.name}>
              {(item.claims as any).medicationCodeableConcept.text}
            </Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>Added: </Text>
              <Text style={styles.detail}>
                {new Date(
                  section.title.credential.issuanceDate,
                ).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button]}
          onPress={handleDownload}
          disabled={selectedPrescriptions.length === 0}
        >
          <MaterialCommunityIcons name="download" size={20} color="white" />
          <Text style={styles.buttonText}>Download</Text>
        </Pressable>

        <Pressable
          style={[styles.button]}
          onPress={handleShare}
          disabled={selectedPrescriptions.length === 0}
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
  list: {
    marginTop: 20,
    width: "90%",
    color: Colors.text,
  },
  prescriptionBox: {
    backgroundColor: Colors.white,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.lightgray,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  issuer: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.darkpurple,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  detail: {
    fontSize: 14,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.text,
  },
  checked: {
    backgroundColor: Colors.text,
  },
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
