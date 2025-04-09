import { Stack } from "expo-router";

import { headerStyles } from "@/stylesheets/HeaderStyles";

export default function SharePrescriptionsLayout() {
  return <Stack screenOptions={headerStyles} />;
}
