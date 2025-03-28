import { Stack } from "expo-router";

import { Colors } from "@/constants/Colors";

export default function ViewPrescriptionsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.bar,
        },
        headerTintColor: Colors.lightpink,
        headerTitleAlign: "center",
      }}
    />
  );
}
