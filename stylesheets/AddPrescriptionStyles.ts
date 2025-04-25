import { StyleSheet } from "react-native";

import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

/**
 * Styles for the AddPrescription component.
 * This includes styles for the container, overlay, text, and buttons.
 */
export const addPrescriptionStyles = StyleSheet.create({
  container: {
    ...defaultStyles.container,
    justifyContent: "center",
  },
  overlay: {
    ...defaultStyles.overlay,
    width: "80%",
    margin: 20,
    padding: 20,
  },
  headerText: {
    ...defaultStyles.overlayText,
    fontSize: 24,
  },
  overlayText: {
    ...defaultStyles.overlayText,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "white",
    width: "100%",
    margin: 0,
    padding: 10,
  },
  buttonText: {
    ...defaultStyles.buttonText,
    fontSize: 18,
    color: Colors.darkpurple,
    textAlign: "right",
  },
});
