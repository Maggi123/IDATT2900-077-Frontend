import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

import { receivedNotReceivedStyles } from "@/stylesheets/ReceivedNotReceivedStyles";

export default function Received() {
  const router = useRouter();

  const handleNavigate = () => {
    router.back();
  };

  return (
    <View style={receivedNotReceivedStyles.container}>
      <View style={receivedNotReceivedStyles.overlay}>
        <Text style={receivedNotReceivedStyles.overlayText}>
          An error occurred while receiving document(s)
        </Text>
        <Pressable
          style={receivedNotReceivedStyles.button}
          onPress={handleNavigate}
        >
          <Text style={receivedNotReceivedStyles.buttonText}>Go back</Text>
        </Pressable>
      </View>
    </View>
  );
}
