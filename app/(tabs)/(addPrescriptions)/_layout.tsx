import { Stack, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AddPrescriptionsLayout() {
  const router = useRouter(); // Access the router

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
      {/* Specify options for the 'index' screen */}
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
                router.push("/home");
              }}
            />
          ),
        }}
      />
    </Stack>
  );
}
