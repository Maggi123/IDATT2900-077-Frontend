import { View, Text, StyleSheet, TextInput } from "react-native";

import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

interface URLInputComponentProps {
  url: string;
  onUrlChange: (url: string) => void;
}

const URLInputComponent: React.FC<URLInputComponentProps> = ({
  url,
  onUrlChange,
}) => {
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
