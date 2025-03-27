import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";

export default function AddPrescriptionsLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.bar,
        },
        headerTintColor: Colors.lightpink,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => (
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={Colors.lightpink}
              style={{ marginLeft: 10 }}
              onPress={() => {
                router.push("/HomeScreen");
              }}
            />
          ),
        }}
      />
    </Stack>
  );
}
