import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

import { defaultStyles } from "@/stylesheets/DefaultStyles";

/**
 * Index component that serves as the entry point of the application.
 *
 * - Displays a button to register or login based on the user's registration status.
 * - Uses SecureStore to check if the user is registered.
 * - Navigates to the appropriate screen when the button is pressed.
 *
 * @returns The Index component.
 */
export default function Index() {
  const [registered, setRegistered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setRegistered(!!SecureStore.getItem("registered"));
  }, []);

  return (
    <View style={styles.container}>
      {!registered && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push("/RegisterScreen");
          }}
        >
          <Text style={defaultStyles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}
      {registered && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push("/LoginScreen");
          }}
        >
          <Text style={defaultStyles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...defaultStyles.container,
    justifyContent: "center",
    gap: 10,
  },
  button: {
    ...defaultStyles.button,
    alignItems: "center",
  },
});
