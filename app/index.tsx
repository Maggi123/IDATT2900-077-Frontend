import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View>
      <View>
        <Button
          title="Login"
          onPress={() => {
            router.push("/login");
          }}
        />
      </View>

      <View>
        <Button
          title="Register"
          onPress={() => {
            router.push("/register");
          }}
        />
      </View>
    </View>
  );
}
