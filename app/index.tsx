import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

import { defaultStyles } from "@/stylesheets/DefaultStyles";

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
          style={defaultStyles.button}
          onPress={() => {
            router.push("/RegisterScreen");
          }}
        >
          <Text style={defaultStyles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}
      {registered && (
        <TouchableOpacity
          style={defaultStyles.button}
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
});
