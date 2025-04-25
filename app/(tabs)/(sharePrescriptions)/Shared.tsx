import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

import { addPrescriptionStyles } from "@/stylesheets/AddPrescriptionStyles";

/**
 * Screen displayed when documents are successfully shared.
 *
 * Informs the user that the document(s) have been successfully shared and provides a button to navigate back to the share prescriptions screen.
 *
 * @returns The Shared component.
 */
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
