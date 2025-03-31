import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

import { receivedNotReceivedStyles } from "@/stylesheets/ReceivedNotReceivedStyles";

export default function Received() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/(tabs)/(viewPrescriptions)");
  };

  return (
    <View style={receivedNotReceivedStyles.container}>
      <View style={receivedNotReceivedStyles.overlay}>
        <Text style={receivedNotReceivedStyles.headerText}>Document added</Text>
        <Text style={receivedNotReceivedStyles.overlayText}>
          You successfully received the document(s)
        </Text>
        <Pressable
          style={receivedNotReceivedStyles.button}
          onPress={handleNavigate}
        >
          <Text style={receivedNotReceivedStyles.buttonText}>View</Text>
        </Pressable>
      </View>
    </View>
  );
}
