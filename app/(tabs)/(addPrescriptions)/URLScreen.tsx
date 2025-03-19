import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";

import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/stylesheets/defaultStyles";

export default function URLScreen() {
  const [url, setUrl] = useState("");

  const handleUpload = () => {
    console.log("Uploading URLScreen:", url);
  };

  return (
    <View style={defaultStyles.container}>
      <View style={defaultStyles.overlay}>
        <Text style={defaultStyles.overlayText}>Write URL here</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com"
          value={url}
          onChangeText={setUrl}
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>
      <Pressable style={defaultStyles.uploadButton} onPress={handleUpload}>
        <Text style={defaultStyles.uploadButtonText}>Upload</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    backgroundColor: Colors.lightgray,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
