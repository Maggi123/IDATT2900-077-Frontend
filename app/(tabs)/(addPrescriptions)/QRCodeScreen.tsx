import { useAgent } from "@credo-ts/react-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
  resolveAndGetCredentialsWithAgent,
  storeIssuerNameFromOfferWithAgent,
} from "@/agent/Vc";
import LoadingComponent from "@/components/LoadingComponent";
import QRCodeScannerComponent from "@/components/QRCodeScannerComponent";
import { useCredentialResponsesStore } from "@/state/CredentialResponsesStore";
import { useIssuerInfoStore } from "@/state/IssuerInfoStore";

/**
 * Screen for scanning a QR code to receive a digital credential.
 *
 * - Uses the QRCodeScannerComponent to scan data.
 * - Resolves and retrieves credentials using the scanned data and the agent.
 * - Stores the issuer name and credential responses in state management stores.
 * - Displays a loading indicator while processing the QR code data.
 * - Navigates to the DeclineAcceptScreen if the credential is successfully retrieved,
 *   or to NotReceived if an error occurs or the credential is invalid.
 *
 * @returns The QRCodeScreen component.
 */
export default function QRCodeScreen() {
  const [scannedData, setScannedData] = useState<string>("");
  const [receivingState, setReceivingState] = useState(false);
  const router = useRouter();
  const agentContext = useAgent();
  const queryClient = useQueryClient();

  const setCredentialResponses = useCredentialResponsesStore(({ set }) => set);
  const setIssuerInfo = useIssuerInfoStore(({ set }) => set);

  useEffect(() => {
    const handleUpload = async () => {
      console.log("Uploading QRCodeScreen:", scannedData);
      try {
        setReceivingState(true);
        const [resolvedOffer, credentialResponses] =
          await resolveAndGetCredentialsWithAgent(
            agentContext.agent,
            scannedData,
          );
        if (credentialResponses.length < 1)
          throw new Error("No credentials were received.");

        if (credentialResponses.length > 1)
          throw new Error(
            "Handling of multiple credentials is not implemented",
          );

        const issuerName = await storeIssuerNameFromOfferWithAgent(
          agentContext.agent,
          resolvedOffer,
          credentialResponses[0].credential.credential.issuerId,
        );

        await queryClient.invalidateQueries({
          queryKey: ["issuerNames"],
        });
        setCredentialResponses(credentialResponses);
        if (issuerName) setIssuerInfo(issuerName);
        setReceivingState(false);
        setScannedData("");
        router.push("/DeclineAcceptScreen");
      } catch (e) {
        setReceivingState(false);
        setScannedData("");
        console.error(e);
        router.push("/NotReceived");
      }
    };

    if (scannedData !== "") handleUpload().catch(console.error);
  }, [scannedData]);

  if (receivingState) return <LoadingComponent />;

  return <QRCodeScannerComponent onScan={setScannedData} />;
}
