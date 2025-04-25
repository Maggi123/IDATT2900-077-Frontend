import { useAgent } from "@credo-ts/react-hooks";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Pressable, Text } from "react-native";

import LoadingComponent from "@/components/LoadingComponent";
import URLInputComponent from "@/components/URLInputComponent";
import { useResolvedAuthorizationRequestStore } from "@/state/ResolvedAuthorizationRequestStore";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

/**
 * Screen for inputting a URL and sharing data by resolving an authorization request.
 *
 * - Uses the URLInputComponent to input the URL for sharing.
 * - Attempts to resolve an authorization request based on the provided URL.
 * - If successful, the resolved authorization request is stored, and the user is redirected to the ChoosePrescriptionsScreen.
 * - Displays a loading screen while the sharing process is ongoing.
 *
 * @returns The ShareURLScreen component.
 */
export default function ShareURLScreen() {
  const [url, setUrl] = useState<string>("");
  const [sharingState, setSharingState] = useState(false);
  const router = useRouter();
  const agentContext = useAgent();
  const setResolvedAuthorizationRequest = useResolvedAuthorizationRequestStore(
    ({ set }) => set,
  );

  const clearState = () => {
    setUrl("");
    setSharingState(false);
  };

  const handleShare = async () => {
    console.log("Pretending to share to:", url);
    setSharingState(true);

    try {
      const resolvedAuthorizationRequest =
        await agentContext.agent.modules.openId4VcHolderModule.resolveSiopAuthorizationRequest(
          url,
        );
      setResolvedAuthorizationRequest(resolvedAuthorizationRequest);
      router.push("/ChoosePrescriptionsScreen");
    } catch (e) {
      console.error(e);
    }

    clearState();
  };

  if (sharingState) return <LoadingComponent />;

  return (
    <View style={defaultStyles.container}>
      <URLInputComponent url={url} onUrlChange={setUrl} />
      <Pressable style={defaultStyles.uploadButton} onPress={handleShare}>
        <Text style={defaultStyles.uploadButtonText}>Share</Text>
      </Pressable>
    </View>
  );
}
