import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

import { addPrescriptionStyles } from "@/stylesheets/AddPrescriptionStyles";

export default function Received() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/(tabs)/(viewPrescriptions)");
  };

  return (
    <View style={addPrescriptionStyles.container}>
      <View style={addPrescriptionStyles.overlay}>
        <Text style={addPrescriptionStyles.headerText}>Document added</Text>
        <Text style={addPrescriptionStyles.overlayText}>
          You successfully received the document(s)
        </Text>
        <Pressable
          style={addPrescriptionStyles.button}
          onPress={handleNavigate}
        >
          <Text style={addPrescriptionStyles.buttonText}>View</Text>
        </Pressable>
      </View>
    </View>
  );
}
