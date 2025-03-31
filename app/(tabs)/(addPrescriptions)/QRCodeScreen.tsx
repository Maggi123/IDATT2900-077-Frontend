import { useAgent } from "@credo-ts/react-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { CameraView, useCameraPermissions } from "expo-camera/next";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import { receiveAllOfferedOpenId4VcCredentialWithAgent } from "@/agent/Vc";
import LoadingComponent from "@/component/LoadingComponent";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

export default function QRCodeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string>("");
  const [receivingState, setReceivingState] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const agentContext = useAgent();

  const isPermissionGranted = Boolean(permission?.granted);

  useEffect(() => {
    const handleUpload = async () => {
      console.log("Uploading QRCodeScreen:", scannedData);
      try {
        setReceivingState(true);
        await receiveAllOfferedOpenId4VcCredentialWithAgent(
          agentContext.agent,
          scannedData,
        );
        await queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "prescription" ||
            query.queryKey[0] === "issuerNames",
        });
        setReceivingState(false);
        setScannedData("");
        router.push("/Received");
      } catch (e) {
        setReceivingState(false);
        setScannedData("");
        console.error(e);
        router.push("/NotReceived");
      }
    };

    if (scannedData !== "") handleUpload().catch(console.error);
  }, [scannedData]);

  if (receivingState) return <LoadingComponent />;

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
