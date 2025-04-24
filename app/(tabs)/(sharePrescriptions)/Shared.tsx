import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

import { addPrescriptionStyles } from "@/stylesheets/AddPrescriptionStyles";

export default function Shared() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/(tabs)/(sharePrescriptions)");
  };

  return (
    <View style={addPrescriptionStyles.container}>
      <View style={addPrescriptionStyles.overlay}>
        <Text style={addPrescriptionStyles.headerText}>Document(s) shared</Text>
        <Text style={addPrescriptionStyles.overlayText}>
          You successfully shared the document(s)
        </Text>
        <Pressable
          style={addPrescriptionStyles.button}
          onPress={handleNavigate}
        >
          <Text style={addPrescriptionStyles.buttonText}>Ok</Text>
        </Pressable>
      </View>
    </View>
  );
}
