import { useAgent } from "@credo-ts/react-hooks";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

import LoadingComponent from "@/components/LoadingComponent";
import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

/**
 * HomeScreen component displaying the user's DID and navigation buttons for prescription management.
 *
 * - Retrieves the agent's DID using the Credo agent and React Query.
 * - Displays a loading screen while fetching the DID.
 * - Shows the DID once loaded.
 * - Provides three buttons that navigate to:
 *   - Add prescriptions screen
 *   - View prescriptions screen
 *   - Share prescriptions screen
 *
 * Uses expo-router for navigation and MaterialCommunityIcons for button icons.
 *
 * @returns The HomeScreen component.
 */

export default function HomeScreen() {
  const router = useRouter();
  const agent = useAgent();

  const did = useQuery({
    queryKey: ["did"],
    queryFn: () =>
      agent.agent.dids.getCreatedDids({ method: "indy" }).then((dids) => {
        return dids[0].did;
      }),
  });

  const handleButtonPress = (button: string) => {
    if (button === "Button 1") {
      router.push("/(tabs)/(addPrescriptions)");
    } else if (button === "Button 2") {
      router.push("/(tabs)/(viewPrescriptions)");
    } else if (button === "Button 3") {
      router.push("/(tabs)/(sharePrescriptions)");
    }
  };

  if (did.isPending) return <LoadingComponent />;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{did.data}</Text>
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleButtonPress("Button 3");
        }}
      >
        <View style={styles.buttonContent}>
          <MaterialCommunityIcons
            name="share-variant-outline"
            size={40}
            color={Colors.lightpink}
          />
          <Text style={styles.buttonText}>Share prescriptions</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...defaultStyles.container,
    justifyContent: "center",
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
