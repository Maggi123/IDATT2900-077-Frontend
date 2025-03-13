import "react-native-get-random-values";
import { Agent } from "@credo-ts/core";
import AgentProvider from "@credo-ts/react-hooks";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router"; // Import for navigation
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { useAuth0 } from "react-native-auth0";

import { initializeAgent } from "@/agent/Agent";
import LoadingComponent from "@/component/LoadingComponent";
import { Colors } from "@/constants/Colors";
import { getDidForAgent } from "@/util/DidUtil";
import { secureStoreKeyFromUserSub } from "@/util/KeyUtil";

export default function TabLayout() {
  const [agent, setAgent] = useState<Agent>();
  const { user } = useAuth0();

  useEffect(() => {
    const setupAgent = async () => {
      const key = await SecureStore.getItemAsync(
        secureStoreKeyFromUserSub(user!.sub!),
      );
      const agent: Agent = await initializeAgent(user!.sub!, key!);
      setAgent(agent);

      await getDidForAgent(agent);
      console.info("Agent has DID.");
    };

    setupAgent().catch(console.error);
  }, []);

  if (!agent) return <LoadingComponent />;

  return (
    <AgentProvider agent={agent}>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.bar,
          },
          headerTintColor: Colors.lightpink,
          headerTitleAlign: "center",
          tabBarStyle: {
            backgroundColor: Colors.bar,
            height: 70,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity {...props} style={styles.tabBarContainer}>
                <View style={styles.circle}>
                  <MaterialCommunityIcons
                    name="home"
                    size={35}
                    color={Colors.bar}
                  />
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="(addPrescriptions)"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(viewPrescriptions)"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
    </AgentProvider>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  circle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: Colors.lightpink,
    justifyContent: "center",
    alignItems: "center",
  },
});
