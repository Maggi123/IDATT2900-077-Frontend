import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

import { Colors } from "@/constants/Colors";
import { headerStyles } from "@/stylesheets/HeaderStyles";

/**
 * The layout component for the "Add Prescriptions" route group.
 *
 * @returns A Stack Navigator for the add prescriptions flow.
 */
export default function AddPrescriptionsLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        ...headerStyles,
        headerTitle: "Add digital document",
        headerLeft: () => (
          <Pressable
            onPress={() => {
              router.back();
            }}
            style={{ marginLeft: 10 }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={Colors.lightpink}
            />
          </Pressable>
        ),
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
