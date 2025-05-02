import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

import { addPrescriptionStyles } from "@/stylesheets/AddPrescriptionStyles";

/**
 * Screen displayed when there is an error while sharing documents.
 *
 * Informs the user of an error and provides a button to navigate back to the share prescriptions screen.
 *
 * @returns The NotShared component.
 */
export default function NotShared() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/(tabs)/(sharePrescriptions)");
  };

  return (
    <View style={addPrescriptionStyles.container}>
      <View style={addPrescriptionStyles.overlay}>
        <Text style={addPrescriptionStyles.overlayText}>
          An error occurred while sharing document(s)
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
