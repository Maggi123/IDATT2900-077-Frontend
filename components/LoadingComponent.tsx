import { ActivityIndicator, StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

export default function LoadingComponent() {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        testID="loading-indicator"
        size="large"
        color={Colors.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...defaultStyles.container,
    justifyContent: "center",
    gap: 20,
  },
});
