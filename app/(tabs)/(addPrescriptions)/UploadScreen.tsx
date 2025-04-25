import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

/**
 * Screen for uploading a document.
 *
 * - Allows the user to select a document using the device's document picker.
 * - Displays the selected document's name once picked.
 * - Provides a button to upload the selected document.
 *
 * @returns The UploadScreen component.
 */
export default function UploadScreen() {
  const [selectedDocument, setSelectedDocument] = useState<
    DocumentPicker.DocumentPickerAsset[]
  >([]);

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

  const handleUpload = () => {
    console.log("Uploading file:", selectedDocument[0].name);
  };

  return (
    <View style={defaultStyles.container}>
      <View style={defaultStyles.overlay}>
        <Text style={defaultStyles.overlayText}>Select file here</Text>

        <View style={styles.fileContainer}>
          {selectedDocument.length > 0 ? (
            <View>
              <Text>{selectedDocument[0].name}</Text>
              {/* <Text>{selectedDocument[0].uri}</Text> */}
            </View>
          ) : (
            <Text>No file selected</Text>
          )}
          <Pressable style={styles.filePicker} onPress={pickDocument}>
            <Text style={styles.filePickerText}>Select</Text>
          </Pressable>
        </View>
      </View>
      <Pressable style={defaultStyles.uploadButton} onPress={handleUpload}>
        <Text style={defaultStyles.uploadButtonText}>Upload</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    backgroundColor: Colors.lightgray,
  },
  filePicker: {
    padding: 10,
    backgroundColor: Colors.button,
    alignItems: "center",
    justifyContent: "center",
  },
  filePickerText: {
    color: Colors.lightpink,
  },
});
