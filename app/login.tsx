import { useRouter } from "expo-router"; // Make sure Colors are defined
import * as SecureStore from "expo-secure-store";
import { Text, View, TouchableOpacity } from "react-native";
import { useAuth0 } from "react-native-auth0";

import { defaultStyles } from "@/stylesheets/defaultStyles";
import { secureStoreKeyFromUserSub } from "@/util/KeyUtil";

export default function Login() {
  const { authorize, user, error, clearSession } = useAuth0();
  const router = useRouter();

  const onLoginPress = async () => {
    await authorize();
    if (user) {
      if (user.sub) {
        const key = await SecureStore.getItemAsync(
          secureStoreKeyFromUserSub(user.sub),
        );
        if (!key) {
          await clearSession();
          throw new Error("Authenticated account has not been registered.");
        }
      } else
        throw new Error(
          "User did not authenticate with OpenID account during login.",
        );
      router.push("/home");
    } else
      throw new Error(
        `User did not authenticate during login. Error: ${error}`,
      );
  };

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.title}>Login</Text>
      <TouchableOpacity
        style={defaultStyles.button}
        onPress={() => onLoginPress().catch(console.error)}
      >
        <View style={defaultStyles.buttonContent}>
          <Text style={defaultStyles.buttonText}>
            Login with External Account
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={defaultStyles.button}
        onPress={() => {
          router.push("/home");
        }}
      >
        <View style={defaultStyles.buttonContent}>
          <Text style={defaultStyles.buttonText}>Go to Home</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
