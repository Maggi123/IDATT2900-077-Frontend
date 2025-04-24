import { Stack } from "expo-router";

import { headerStyles } from "@/stylesheets/HeaderStyles";

export default function SharePrescriptionsLayout() {
  return (
    <Stack
      screenOptions={{
        ...headerStyles,
        headerTitle: "Share prescriptions",
      }}
    >
      <Stack.Screen
        name="NoPrescriptionsChosenErrorModal"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
