import { useRouter } from "expo-router"; // Make sure Colors are defined
import { Text, View, TouchableOpacity } from "react-native";
import { useAuth0 } from "react-native-auth0";

import { defaultStyles } from "@/stylesheets/defaultStyles";

export default function Login() {
  const { authorize } = useAuth0();
  const router = useRouter();

  const onLoginPress = async () => {
    try {
      await authorize();
      router.push("/home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.title}>Login</Text>
      <TouchableOpacity
        style={defaultStyles.button}
        onPress={() => onLoginPress()}
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
