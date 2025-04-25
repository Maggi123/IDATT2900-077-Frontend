import { useAgent } from "@credo-ts/react-hooks";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import LoadingComponent from "@/components/LoadingComponent";
import QRCodeScannerComponent from "@/components/QRCodeScannerComponent";
import { useResolvedAuthorizationRequestStore } from "@/state/ResolvedAuthorizationRequestStore";

/**
 * Screen for scanning a QR code to share data and resolve an authorization request.
 *
 * - Uses the QRCodeScannerComponent to scan a QR code.
 * - Processes the scanned data and attempts to resolve an authorization request.
 * - If the QR code is valid, the resolved authorization request is stored, and the user is redirected to the ChoosePrescriptionsScreen.
 * - Displays a loading screen while the sharing process is ongoing.
 *
 * @returns The ShareQRScreen component.
 */
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
