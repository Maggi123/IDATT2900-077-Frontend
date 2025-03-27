import { useAgent } from "@credo-ts/react-hooks";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

import { Colors } from "@/constants/Colors";

export default function HomeScreen() {
  const router = useRouter();
  const agent = useAgent();
  const [did, setDid] = useState("");

  useEffect(() => {
    const getDid = async () => {
      const did = (await agent.agent.dids.getCreatedDids({ method: "indy" }))[0]
        .did;
      setDid(did);
    };

    getDid().catch(console.error);
  }, [did, agent]);

  const handleButtonPress = (button: string) => {
    if (button === "Button 1") {
      router.push("/(tabs)/(addPrescriptions)");
    } else if (button === "Button 2") {
      router.push("/(tabs)/(viewPrescriptions)");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{did}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleButtonPress("Button 1");
        }}
      >
        <View style={styles.buttonContent}>
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={40}
            color={Colors.lightpink}
          />
          <Text style={styles.buttonText}>Add prescriptions</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleButtonPress("Button 2");
        }}
      >
        <View style={styles.buttonContent}>
          <MaterialCommunityIcons
            name="folder-outline"
            size={40}
            color={Colors.lightpink}
          />
          <Text style={styles.buttonText}>View prescriptions</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    gap: 20,
  },
  button: {
    width: "90%",
    backgroundColor: Colors.button,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    paddingHorizontal: 15,
    gap: 10,
  },
  buttonText: {
    color: Colors.lightpink,
    fontSize: 30,
  },
  text: {
    fontSize: 18,
  },
});
