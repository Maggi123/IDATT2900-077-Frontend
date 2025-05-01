import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";

import NavigationOptionButton from "@/components/buttons/NavigationOptionButton";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

/**
 * Screen that provides options to add prescriptions.
 * Users can choose to scan a QR code, input a URL, or upload a document.
 * Each option navigates to a different screen for the respective action.
 * @returns The AddPrescriptions component with navigation options.
 */
export default function AddPrescriptions() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <NavigationOptionButton
        icon="qrcode-scan"
        text="Scan QR code"
        onPress={() => {
          router.push("/QRCodeScreen");
        }}
      />
      <NavigationOptionButton
        icon="pencil-outline"
        text="Input URL"
        onPress={() => {
          router.push("/URLScreen");
        }}
      />
      <NavigationOptionButton
        icon="upload-outline"
        text="Upload document"
        onPress={() => {
          router.push("/UploadScreen");
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
