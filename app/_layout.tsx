import { Stack } from "expo-router";
import { Auth0Provider } from "react-native-auth0";

import { Auth0Config } from "@/constants/Auth0Config";

export default function RootLayout() {
  return (
    <Auth0Provider domain={Auth0Config.domain} clientId={Auth0Config.clientId}>
      <Stack screenOptions={{ headerShown: false }} />
    </Auth0Provider>
  );
}
