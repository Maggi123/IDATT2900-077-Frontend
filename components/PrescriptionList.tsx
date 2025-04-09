import {
  W3cCredentialSubject,
  W3cCredentialRecord,
  asArray,
} from "@credo-ts/core";
import { Text, View, StyleSheet, SectionList, Pressable } from "react-native";

import { Colors } from "@/constants/Colors";

type PrescriptionListProps = {
  prescriptions: W3cCredentialRecord[];
  issuerNames: Record<string, unknown>;
  selectedPrescriptions: number[];
  onToggleSelection: (id: number) => void;
};

const PrescriptionList = ({
  prescriptions,
  issuerNames,
  selectedPrescriptions,
  onToggleSelection,
}: PrescriptionListProps) => {
  return (
    <SectionList
      style={styles.list}
      sections={prescriptions.map((credential, index) => {
        const data: W3cCredentialSubject[] = asArray(
          credential.credential.credentialSubject,
        );
        return {
          title: index,
          data,
        };
      })}
      keyExtractor={(_, key) => `${key}`}
      renderItem={({ section, item }) => (
        <View style={styles.prescriptionBox}>
          <View style={styles.topRow}>
            <Text style={styles.issuer}>
              {(issuerNames[
                prescriptions[section.title].credential.issuerId
              ] as string) ?? prescriptions[section.title].credential.issuerId}
            </Text>
            <Pressable
              onPress={() => {
                onToggleSelection(section.title);
              }}
              style={[
                styles.checkbox,
                selectedPrescriptions.includes(section.title) && styles.checked,
              ]}
              accessibilityRole="checkbox"
            />
          </View>
          <Text style={styles.name}>
            {item.claims ? (item.claims.name as string) : "N/A"}
          </Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Active ingredient: </Text>
            <Text style={styles.detail}>
              {item.claims
                ? ((item.claims.activeIngredient as string) ?? "N/A")
                : "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Authored: </Text>
            <Text style={styles.detail}>
              {item.claims
                ? new Date(
                    item.claims.authoredOn as string,
                  ).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Added: </Text>
            <Text style={styles.detail}>
              {prescriptions[section.title].createdAt.toLocaleDateString()}
            </Text>
          </View>
        </View>
      )}
    />
  );
};

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
    marginBottom: 10,
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
});

export default PrescriptionList;
