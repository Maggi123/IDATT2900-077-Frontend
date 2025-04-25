import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

import { defaultStyles } from "@/stylesheets/DefaultStyles";

/**
 * Modal displayed when no prescriptions are selected.
 *
 * Informs the user that no prescriptions were chosen and provides a button to confirm the error.
 * Navigates back to the previous screen when the button is pressed.
 *
 * @returns The NoPrescriptionsChosenErrorModal component.
 */
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
