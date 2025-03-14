import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { useState } from "react";

export default function URL() {
  const [url, setUrl] = useState("");

  const handleUpload = () => {
    console.log("Uploading URL:", url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Write URL here</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com"
          value={url}
          onChangeText={setUrl}
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>
      <Pressable style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.uploadButtonText}>Upload</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background,
    paddingVertical: 40,
  },
  overlay: {
    padding: 12,
    width: "90%",
    backgroundColor: Colors.white,
    borderRadius: 8,
    justifyContent: "center",
    gap: 15,
  },
  overlayText: {
    fontSize: 16,
    color: Colors.text,
  },
  input: {
    height: 40,
    backgroundColor: Colors.lightgray,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  uploadButton: {
    paddingVertical: 12,
    backgroundColor: Colors.button,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
  },
  uploadButtonText: {
    color: Colors.lightpink,
    fontWeight: "bold",
  },
});
