import { CameraView, useCameraPermissions } from "expo-camera/next";
import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/stylesheets/defaultStyles";

export default function QRCode() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);

  const isPermissionGranted = Boolean(permission?.granted);

  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }

  return (
    <View style={defaultStyles.container}>
      <View style={defaultStyles.overlay}>
        <Text style={defaultStyles.overlayText}>
          Scan QR code {"\n"}Place the QR code in the camera's field of view
        </Text>
      </View>

      {!isPermissionGranted ? (
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Camera Permission</Text>
        </Pressable>
      ) : (
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={({ data }) => {
            setScannedData(data);
            console.log("Scanned Data:", data);
          }}
        />
      )}
      {scannedData && (
        <Text style={styles.result}>Scanned url: {scannedData}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    width: "100%",
    height: "70%",
  },
  button: {
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  result: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});
