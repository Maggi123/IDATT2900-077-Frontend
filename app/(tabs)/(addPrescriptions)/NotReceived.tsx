import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

import { addPrescriptionStyles } from "@/stylesheets/AddPrescriptionStyles";

/**
 * Screen displayed when there is an error receiving a digital document.
 *
 * This component informs the user that something went wrong and provides
 * an option to navigate back to the "Add Prescriptions" screen.
 *
 * @returns The NotReceived component with error message and navigation button.
 */
export default function NotReceived() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/(tabs)/(addPrescriptions)");
  };

  return (
    <View style={addPrescriptionStyles.container}>
      <View style={addPrescriptionStyles.overlay}>
        <Text style={addPrescriptionStyles.overlayText}>
          An error occurred while receiving document(s)
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
