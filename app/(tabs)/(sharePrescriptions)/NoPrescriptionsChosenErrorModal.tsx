import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

import { defaultStyles } from "@/stylesheets/DefaultStyles";

export default function NoPrescriptionsChosenErrorModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No prescriptions were chosen.</Text>
      <Link href=".." style={styles.link} accessibilityRole="button">
        Confirm
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...defaultStyles.container,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    ...defaultStyles.overlayText,
    fontSize: 24,
    padding: 10,
    margin: 10,
  },
  link: {
    ...defaultStyles.button,
    ...defaultStyles.buttonText,
    textAlign: "center",
    width: "80%",
  },
});
