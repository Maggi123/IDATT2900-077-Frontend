import { useRouter } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";
import { useAuth0 } from "react-native-auth0";

import { defaultStyles } from "@/stylesheets/DefaultStyles";

/**
 * Screen for logging the user out.
 *
 * - Calls Auth0's `clearSession` to log out the user.
 * - Redirects to the home screen after logout.
 * - Displays a button to initiate the logout process.
 * @returns The Logout component.
 */
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
        <Text style={defaultStyles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}
