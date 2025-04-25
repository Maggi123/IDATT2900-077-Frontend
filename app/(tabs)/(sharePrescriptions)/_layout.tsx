import { Stack } from "expo-router";

import { headerStyles } from "@/stylesheets/HeaderStyles";

/**
 * The layout component for the "Share Prescriptions" route group.
 *
 * @returns A Stack Navigator for the share prescriptions flow.
 */
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
