import { useAgent } from "@credo-ts/react-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";

import {
  resolveAndGetCredentialsWithAgent,
  storeIssuerNameFromOfferWithAgent,
} from "@/agent/Vc";
import QRCodeScreen from "@/app/(tabs)/(addPrescriptions)/QRCodeScreen";
import { useCredentialResponsesStore } from "@/state/CredentialResponsesStore";
import { useIssuerInfoStore } from "@/state/IssuerInfoStore";

jest.mock("@credo-ts/react-hooks", () => ({
  useAgent: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/agent/Vc", () => ({
  resolveAndGetCredentialsWithAgent: jest.fn(),
  storeIssuerNameFromOfferWithAgent: jest.fn(),
}));

jest.mock("@/state/CredentialResponsesStore", () => ({
  useCredentialResponsesStore: jest.fn(),
}));

jest.mock("@/state/IssuerInfoStore", () => ({
  useIssuerInfoStore: jest.fn(),
}));

jest.mock("@/components/QRCodeScannerComponent", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require("react");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { TouchableOpacity, Text } = require("react-native");

  return function MockQRCodeScanner({ onScan }) {
    return React.createElement(
      TouchableOpacity,
      {
        testID: "qr-scanner",
        onPress: () => onScan("mock-qr-data"),
      },
      React.createElement(Text, null, "Scan QR Code"),
    );
  };
});

jest.mock("@/components/LoadingComponent", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require("react");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Text } = require("react-native");

  return function MockLoadingComponent() {
    return React.createElement(
      Text,
      { testID: "loading-component" },
      "Loading...",
    );
  };
});

describe("QRCodeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockRouter = {
      push: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);

    const mockAgent = {
      agent: {},
    };
    useAgent.mockReturnValue(mockAgent);

    const mockQueryClient = {
      invalidateQueries: jest.fn().mockResolvedValue(null),
    };
    useQueryClient.mockReturnValue(mockQueryClient);

    const mockSetCredentialResponses = jest.fn();
    const mockSetIssuerInfo = jest.fn();
    useCredentialResponsesStore.mockReturnValue(mockSetCredentialResponses);
    useIssuerInfoStore.mockReturnValue(mockSetIssuerInfo);
  });

  test("should render QRCodeScannerComponent when not in receiving state", () => {
    const { getByTestId } = render(<QRCodeScreen />);
    expect(getByTestId("qr-scanner")).toBeTruthy();
  });

  test("should render LoadingComponent when in receiving state", async () => {
    let resolvePromise: (arg0: {}[]) => void;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    resolveAndGetCredentialsWithAgent.mockReturnValue(delayedPromise);

    const { getByTestId, findByTestId } = render(<QRCodeScreen />);

    fireEvent.press(getByTestId("qr-scanner"));

    await findByTestId("loading-component");

    await act(async () => {
      resolvePromise([
        {},
        [{ credential: { credential: { issuerId: "test" } } }],
      ]);
    });
  });

  test("should handle QR code scan success and navigates to DeclineAcceptScreen", async () => {
    const mockCredentialResponses = [
      {
        credential: {
          credential: {
            issuerId: "issuer-123",
          },
        },
      },
    ];
    const mockResolvedOffer = {
      /* mock offer data */
    };
    const mockIssuerName = "Test Issuer";

    resolveAndGetCredentialsWithAgent.mockResolvedValue([
      mockResolvedOffer,
      mockCredentialResponses,
    ]);
    storeIssuerNameFromOfferWithAgent.mockResolvedValue(mockIssuerName);

    const { getByTestId } = render(<QRCodeScreen />);

    fireEvent.press(getByTestId("qr-scanner"));

    await waitFor(() => {
      expect(resolveAndGetCredentialsWithAgent).toHaveBeenCalledWith(
        expect.anything(),
        "mock-qr-data",
      );
      expect(storeIssuerNameFromOfferWithAgent).toHaveBeenCalled();
      expect(useRouter().push).toHaveBeenCalledWith("/DeclineAcceptScreen");
    });

    expect(useCredentialResponsesStore()).toHaveBeenCalledWith(
      mockCredentialResponses,
    );
    expect(useIssuerInfoStore()).toHaveBeenCalledWith(mockIssuerName);
  });

  test("should handle case when no credentials are received", async () => {
    resolveAndGetCredentialsWithAgent.mockResolvedValue([{}, []]);
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    const { getByTestId } = render(<QRCodeScreen />);

    fireEvent.press(getByTestId("qr-scanner"));

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/NotReceived");
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      new Error("No credentials were received."),
    );
  });

  test("should handle case when multiple credentials are received", async () => {
    const multipleCredentials = [
      { credential: { credential: { issuerId: "issuer-1" } } },
      { credential: { credential: { issuerId: "issuer-2" } } },
    ];

    resolveAndGetCredentialsWithAgent.mockResolvedValue([
      {},
      multipleCredentials,
    ]);

    const { getByTestId } = render(<QRCodeScreen />);

    fireEvent.press(getByTestId("qr-scanner"));

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/NotReceived");
    });
  });
});
