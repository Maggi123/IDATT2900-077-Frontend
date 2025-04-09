import { useAgent } from "@credo-ts/react-hooks";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Pressable, Text } from "react-native";

import LoadingComponent from "@/components/LoadingComponent";
import URLInputComponent from "@/components/URLInputComponent";
import { useResolvedAuthorizationRequestStore } from "@/state/ResolvedAuthorizationRequestStore";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

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
