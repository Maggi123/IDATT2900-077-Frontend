import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import LoadingComponent from "@/components/LoadingComponent";
import QRCodeScannerComponent from "@/components/QRCodeScannerComponent";

export default function ShareQRScreen() {
  const [scannedData, setScannedData] = useState<string>("");
  const [sharingState, setSharingState] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleShare = async () => {
      console.log("Pretending to share from QR data:", scannedData);
      setSharingState(true);
    };

    if (scannedData !== "") handleShare().catch(console.error);
  }, [scannedData]);

  if (sharingState) return <LoadingComponent />;

  return <QRCodeScannerComponent onScan={setScannedData} />;
}
