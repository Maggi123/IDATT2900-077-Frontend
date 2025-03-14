import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Colors } from "@/constants/Colors";

export default function Upload() {
  // Keeping the state as an array to allow adding documents, but limiting to one document
  const [selectedDocument, setSelectedDocument] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
      });

      if (!result.canceled) {
        setSelectedDocument([result.assets[0]]);
      } else {
        console.log("Document selection cancelled.");
      }
    } catch (error) {
      console.log("Error picking documents:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Upload document here</Text>

        <View style={styles.fileContainer}>
          {selectedDocument.length > 0 ? (
            <View>
              <Text>{selectedDocument[0].name}</Text>
              {/* <Text>{selectedDocument[0].uri}</Text> */}
            </View>
          ) : (
            <Text>No file selected</Text>
          )}
          <Pressable style={styles.uploadButton} onPress={pickDocument}>
            <Text style={styles.uploadButtonText}>Select File</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    backgroundColor: Colors.lightgray,
  },
  uploadButton: {
    padding: 10,
    backgroundColor: Colors.button,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButtonText: {
    color: Colors.lightpink,
  },
  overlay: {
    margin: 20,
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 8,
    justifyContent: "center",
    width: "90%",
  },
  overlayText: {
    fontSize: 16,
    color: Colors.text,
  },
});
