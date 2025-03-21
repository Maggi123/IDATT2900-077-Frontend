import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View, StyleSheet, FlatList, Pressable } from "react-native";

import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/stylesheets/defaultStyles";

// Mock data simulating prescriptions from a backend
const mockPrescriptions = [
  {
    id: "1",
    issuer: "St. Olavs Hospital",
    name: "Ibuprofen",
    message: "Take max 1 every 6th hour",
    activeIngredient: "Ibuprofen",
    added: "23.01.2025",
    expires: "20.01.2026",
  },
  {
    id: "2",
    issuer: "Helse Stavanger HF",
    name: "Paracetamol",
    message: "Take max 1 every 6th hour",
    activeIngredient: "Paracetamol",
    added: "23.01.2025",
    expires: "20.01.2026",
  },
  {
    id: "3",
    issuer: "St. Olavs Hospital",
    name: "Amoxicillin",
    message: "Take as prescribed by your doctor",
    activeIngredient: "Amoxicillin",
    added: "15.02.2025",
    expires: "14.02.2026",
  },
];

export default function ViewPrescriptions() {
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

  const handleDownload = () => {
    console.log("Downloading:", selectedPrescriptions);
    // Implement actual download logic here
  };

  const handleShare = () => {
    console.log("Sharing:", selectedPrescriptions);
    // Implement actual share logic here
  };

  return (
    <View style={defaultStyles.container}>
      <FlatList
        style={styles.list}
        data={mockPrescriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.prescriptionBox}>
            <View style={styles.topRow}>
              <Text style={styles.issuer}>{item.issuer}</Text>
              <Pressable
                onPress={() => {
                  toggleSelection(item.id);
                }}
                style={[
                  styles.checkbox,
                  selectedPrescriptions.includes(item.id) && styles.checked,
                ]}
              />
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>Message: </Text>
              <Text style={styles.detail}>{item.message}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>Active ingredient: </Text>
              <Text style={styles.detail}>{item.activeIngredient}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>Added: </Text>
              <Text style={styles.detail}>{item.added}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>Expires: </Text>
              <Text style={styles.detail}>{item.expires}</Text>
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
