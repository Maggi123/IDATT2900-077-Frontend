import { CameraView, useCameraPermissions } from "expo-camera/next";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

interface QRCodeScannerProps {
  onScan: (data: string) => void;
}

const QRCodeScannerComponent: React.FC<QRCodeScannerProps> = ({ onScan }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);

  const isPermissionGranted = Boolean(permission?.granted);

  useEffect(() => {
    if (scannedData) {
      onScan(scannedData);
    }
  }, [scannedData]);

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
        <Pressable style={defaultStyles.uploadButton} onPress={requestPermission}>
          <Text style={defaultStyles.uploadButtonText}>Grant Camera Permission</Text>
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
        <Text>Scanned: {scannedData}</Text>
      )}
    </View>
  );
};

export default QRCodeScannerComponent;

const styles = StyleSheet.create({
  camera: {
    width: "100%",
    height: "70%",
  },
  successText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
    color: "green",
  },
});
