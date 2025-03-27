import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

import { defaultStyles } from "@/stylesheets/defaultStyles";

export default function Received() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/(tabs)/(viewPrescriptions)");
  };

  return (
    <View style={defaultStyles.container}>
      <View style={defaultStyles.overlay}>
        <Text style={defaultStyles.overlayText}>
          Prescription received successfully.
        </Text>
      </View>
      <Pressable style={defaultStyles.uploadButton} onPress={handleNavigate}>
        <Text style={defaultStyles.uploadButtonText}>Go to Prescriptions</Text>
      </Pressable>
    </View>
  );
}
