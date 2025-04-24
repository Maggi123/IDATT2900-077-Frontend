import { StyleSheet } from "react-native";

import { Colors } from "@/constants/Colors";

export const defaultStyles = StyleSheet.create({
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
  button: {
    width: "90%",
    backgroundColor: Colors.button,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
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
  overlay: {
    margin: 20,
    padding: 12,
    width: "90%",
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  overlayText: {
    fontSize: 16,
    color: Colors.text,
  },
  uploadButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: Colors.button,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
  },
  uploadButtonText: {
    color: Colors.lightpink,
    fontWeight: "bold",
  },
  optionButton: {
    width: "90%",
    backgroundColor: Colors.lightpink,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  optionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  optionButtonText: {
    color: Colors.lightpurple,
    fontSize: 20,
  },
});
