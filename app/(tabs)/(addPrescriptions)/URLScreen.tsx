import { useAgent } from "@credo-ts/react-hooks";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";

import { receiveAllOfferedOpenId4VcCredentialWithAgent } from "@/agent/Vc";
import LoadingComponent from "@/component/LoadingComponent";
import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/stylesheets/defaultStyles";

export default function URLScreen() {
  const [url, setUrl] = useState("");
  const [receivingState, setReceivingState] = useState(false);
  const agent = useAgent();
  const router = useRouter();

  const handleUpload = async () => {
    console.log("Uploading URLScreen:", url);
    try {
      setReceivingState(true);
      await receiveAllOfferedOpenId4VcCredentialWithAgent(agent.agent, url);
      setUrl("");
      setReceivingState(false);
      router.push("/Received");
    } catch (e) {
      setReceivingState(false);
      setUrl("");
      console.error(e);
      router.push("/NotReceived");
    }
  };

  if (receivingState) return <LoadingComponent />;

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
