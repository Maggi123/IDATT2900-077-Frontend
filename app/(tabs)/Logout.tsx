import { useRouter } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";
import { useAuth0 } from "react-native-auth0";

import { defaultStyles } from "@/stylesheets/defaultStyles";

export default function Logout() {
  const router = useRouter();
  const { clearSession } = useAuth0();

  const onLogoutPress = async () => {
    await clearSession();
    router.push("/");
  };

  return (
    <View style={defaultStyles.container}>
      <TouchableOpacity onPress={onLogoutPress} style={defaultStyles.button}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
