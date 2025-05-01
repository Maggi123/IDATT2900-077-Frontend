import { useAgent } from "@credo-ts/react-hooks";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

import LoadingComponent from "@/components/LoadingComponent";
import HomeScreenButton from "@/components/buttons/HomeScreenButton";
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
      <View style={defaultStyles.overlay}>
        <Text style={defaultStyles.undertitle}>Your DID</Text>
        <Text style={defaultStyles.overlayText}>{did.data}</Text>
      </View>
      <HomeScreenButton
        icon="plus-circle-outline"
        text="Add prescriptions"
        onPress={() => {
          handleButtonPress("Button 1");
        }}
      />
      <HomeScreenButton
        icon="folder-outline"
        text="View prescriptions"
        onPress={() => {
          handleButtonPress("Button 2");
        }}
      />
      <HomeScreenButton
        icon="share-variant-outline"
        text="Share prescriptions"
        onPress={() => {
          handleButtonPress("Button 3");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...defaultStyles.container,
    justifyContent: "center",
    gap: 20,
  },
});
