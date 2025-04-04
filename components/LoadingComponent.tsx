import { ActivityIndicator, StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";

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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    gap: 20,
  },
});
