import { Stack } from "expo-router";

import { headerStyles } from "@/stylesheets/HeaderStyles";

/**
 * The layout component for the "View Prescriptions" route group.
 *
 * @returns A Stack Navigator for the view prescriptions flow.
 */
export default function ViewPrescriptionsLayout() {
  return (
    <Stack
      screenOptions={{
        ...headerStyles,
        headerTitle: "Prescriptions",
      }}
    />
  );
}
