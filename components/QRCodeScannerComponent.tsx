import { CameraView, useCameraPermissions } from "expo-camera/next";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import { defaultStyles } from "@/stylesheets/DefaultStyles";

/**
 * Props for the QRCodeScannerComponent.
 */
interface QRCodeScannerProps {
  /** Function to call when a QR code is scanned. */
  onScan: (data: string) => void;
}

/**
 * QRCodeScannerComponent is a React component that provides a camera view for scanning QR codes.
 * It requests camera permissions and handles the scanned data.
 *
 * @param {QRCodeScannerProps} props - The props for the component.
 * @returns The QRCodeScannerComponent.
 */
const QRCodeScannerComponent = ({ onScan }: QRCodeScannerProps) => {
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
        <Pressable
          style={defaultStyles.uploadButton}
          onPress={requestPermission}
        >
          <Text style={defaultStyles.uploadButtonText}>
            Grant Camera Permission
          </Text>
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
      {scannedData && <Text>Scanned: {scannedData}</Text>}
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
