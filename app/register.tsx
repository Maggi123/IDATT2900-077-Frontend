import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useAuth0 } from "react-native-auth0";

import { defaultStyles } from "@/stylesheets/defaultStyles";
import { secureStoreKeyFromUserSub } from "@/util/KeyUtil";

export default function Register() {
  const router = useRouter();
  const { authorize, user, error } = useAuth0();

  const onRegisterPress = async () => {
    await authorize();
  };

  useEffect(() => {
    const routeOnRegister = async () => {
      if (user) {
        if (error)
          throw new Error(
            `User did not authenticate successfully during registering. Error: ${error}`,
          );
        await SecureStore.setItemAsync("registered", "1");
        const key = await Crypto.getRandomBytesAsync(1024);
        if (user.sub)
          await SecureStore.setItemAsync(
            secureStoreKeyFromUserSub(user.sub),
            key.toString(),
          );
        else
          throw new Error(
            "User did not authenticate with OpenID account during registering.",
          );
        router.push("/home");
      }
    };

    routeOnRegister().catch(console.error);
  }, [user]);

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.title}>Register</Text>
      <TouchableOpacity
        style={defaultStyles.button}
        onPress={() => onRegisterPress().catch(console.error)}
      >
        <View style={defaultStyles.buttonContent}>
          <Text style={defaultStyles.buttonText}>
            Register with External Account
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
