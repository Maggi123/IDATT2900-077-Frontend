import { Text, View, StyleSheet } from "react-native";

import { Colors } from "@/constants/Colors"; // Make sure Colors are defined

export default function Register() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 40,
    paddingTop: 30,
    color: Colors.text,
    fontWeight: "bold",
  },
});
