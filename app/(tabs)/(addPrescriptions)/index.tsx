import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

import { Colors } from "@/constants/Colors";

export default function AddPrescriptions() {
  const router = useRouter();

  const handleButtonPress = (button: string) => {
    if (button === "Button 1") {
      router.push("/QRCodeScreen");
    } else if (button === "Button 2") {
      router.push("/URLScreen");
    } else if (button === "Button 3") {
      router.push("/UploadScreen");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleButtonPress("Button 1");
        }}
      >
        <View style={styles.buttonContent}>
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={24}
            color={Colors.lightpurple}
          />
          <Text style={styles.buttonText}>Scan QR code</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleButtonPress("Button 2");
        }}
      >
        <View style={styles.buttonContent}>
          <MaterialCommunityIcons
            name="pencil-outline"
            size={24}
            color={Colors.lightpurple}
          />
          <Text style={styles.buttonText}>Input URL</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleButtonPress("Button 3");
        }}
      >
        <View style={styles.buttonContent}>
          <MaterialCommunityIcons
            name="upload-outline"
            size={24}
            color={Colors.lightpurple}
          />
          <Text style={styles.buttonText}>Upload document</Text>
        </View>
      </TouchableOpacity>
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
  button: {
    width: "90%",
    backgroundColor: Colors.lightpink,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    color: Colors.lightpurple,
    fontSize: 20,
  },
});
