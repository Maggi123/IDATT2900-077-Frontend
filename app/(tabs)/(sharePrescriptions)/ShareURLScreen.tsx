import { useState } from "react";
import { View, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";

import URLInputComponent from "@/components/URLInputComponent";
import LoadingComponent from "@/components/LoadingComponent";
import { defaultStyles } from "@/stylesheets/DefaultStyles";

export default function ShareURLScreen() {
  const [url, setUrl] = useState<string>("");
  const [sharingState, setSharingState] = useState(false);
  const router = useRouter();

  const handleShare = async () => {
    console.log("Pretending to share to:", url);
    setSharingState(true);
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
