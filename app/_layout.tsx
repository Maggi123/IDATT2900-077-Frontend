import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Auth0Provider } from "react-native-auth0";

import { Auth0Config } from "@/constants/Auth0Config";

const queryClient = new QueryClient();

export default function RootLayout() {
  useReactQueryDevTools(queryClient);

  return (
    <Auth0Provider domain={Auth0Config.domain} clientId={Auth0Config.clientId}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </Auth0Provider>
  );
}
