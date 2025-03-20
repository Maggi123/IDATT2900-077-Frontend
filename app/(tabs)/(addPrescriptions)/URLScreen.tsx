import { useAgent } from "@credo-ts/react-hooks";
import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";

import { receiveOpenId4VcCredentialWithAgent } from "@/agent/Vc";
import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/stylesheets/defaultStyles";

export default function URLScreen() {
  const [url, setUrl] = useState("");
  const agent = useAgent();

  const handleUpload = async () => {
    console.log("Uploading URLScreen:", url);
    try {
      await receiveOpenId4VcCredentialWithAgent(agent.agent, url);
    } catch (e) {
      console.error(e);
    }
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
