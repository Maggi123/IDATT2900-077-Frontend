import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

import { addPrescriptionStyles } from "@/stylesheets/AddPrescriptionStyles";

/**
 * Screen displayed after successfully receiving a document.
 *
 * - Shows a confirmation message indicating the document has been added.
 * - Includes a button to navigate to the screen where the user can view their prescriptions.
 *
 * @returns The Received component.
 */
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
