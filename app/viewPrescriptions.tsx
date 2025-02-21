import { Text, View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default function ViewPrescriptions() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>View Prescriptions Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: 24,
    color: Colors.text,
  },
});
