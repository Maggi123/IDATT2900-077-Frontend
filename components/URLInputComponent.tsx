import { View, Text, StyleSheet, TextInput } from "react-native";

import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

/**
 * Props for the URLInputComponent.
 */
interface URLInputComponentProps {
  /** The current URL value. */
  url: string;
  /** Function to call when the URL changes. */
  onUrlChange: (url: string) => void;
}

/**
 * URLInputComponent is a React component that provides a text input field for entering a URL.
 * It displays a placeholder and handles changes to the URL value.
 *
 * @param {URLInputComponentProps} props - The props for the component.
 * @returns The URLInputComponent.
 */
const URLInputComponent = ({ url, onUrlChange }: URLInputComponentProps) => {
  return (
    <View style={defaultStyles.overlay}>
      <Text style={defaultStyles.overlayText}>Write URL here</Text>
      <TextInput
        style={styles.input}
        placeholder="https://example.com"
        value={url}
        onChangeText={onUrlChange}
        keyboardType="url"
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    backgroundColor: Colors.lightgray,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default URLInputComponent;
