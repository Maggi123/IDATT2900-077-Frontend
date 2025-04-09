import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { defaultStyles } from "@/stylesheets/DefaultStyles";
import NavigationOptionButton from "@/components/NavigationOptionButton";

export default function AddPrescriptions() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <NavigationOptionButton
        icon="qrcode-scan"
        text="Scan QR code"
        onPress={() => router.push("/QRCodeScreen")}
      />
      <NavigationOptionButton
        icon="pencil-outline"
        text="Input URL"
        onPress={() => router.push("/URLScreen")}
      />
      <NavigationOptionButton
        icon="upload-outline"
        text="Upload document"
        onPress={() => router.push("/UploadScreen")}
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
