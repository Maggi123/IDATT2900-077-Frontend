import { useAgent } from "@credo-ts/react-hooks";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import LoadingComponent from "@/components/LoadingComponent";
import QRCodeScannerComponent from "@/components/QRCodeScannerComponent";
import { useResolvedAuthorizationRequestStore } from "@/state/ResolvedAuthorizationRequestStore";

export default function ShareQRScreen() {
  const [scannedData, setScannedData] = useState<string>("");
  const [sharingState, setSharingState] = useState(false);
  const router = useRouter();
  const agentContext = useAgent();
  const setResolvedAuthorizationRequest = useResolvedAuthorizationRequestStore(
    ({ set }) => set,
  );

  const clearState = () => {
    setScannedData("");
    setSharingState(false);
  };

  useEffect(() => {
    const handleShare = async () => {
      console.log("Pretending to share from QR data:", scannedData);
      setSharingState(true);

      try {
        const resolvedAuthorizationRequest =
          await agentContext.agent.modules.openId4VcHolderModule.resolveSiopAuthorizationRequest(
            scannedData,
          );
        setResolvedAuthorizationRequest(resolvedAuthorizationRequest);
        router.push("/ChoosePrescriptionsScreen");
      } catch (e) {
        console.error(e);
      }

      clearState();
    };

    if (scannedData !== "") handleShare().catch(console.error);
  }, [scannedData]);

  if (sharingState) return <LoadingComponent />;

  return <QRCodeScannerComponent onScan={setScannedData} />;
}
