import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";

import NavigationOptionButton from "@/components/buttons/NavigationOptionButton";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

/**
 * Screen for choosing how to share prescriptions.
 *
 * Provides options to share prescriptions either by QR code or URL input.
 * Navigates to the corresponding screens when an option is selected.
 *
 * @returns The rendered `SharePrescriptions` component.
 */
export default function SharePrescriptions() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <NavigationOptionButton
        icon="qrcode"
        text="By QR code"
        onPress={() => {
          router.push("/ShareQRScreen");
        }}
      />
      <NavigationOptionButton
        icon="link-variant"
        text="By URL input"
        onPress={() => {
          router.push("/ShareURLScreen");
        }}
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
