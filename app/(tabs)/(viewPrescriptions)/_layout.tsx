import { Stack } from "expo-router";

import { headerStyles } from "@/stylesheets/HeaderStyles";

export default function ViewPrescriptionsLayout() {
  return <Stack screenOptions={headerStyles} />;
}
