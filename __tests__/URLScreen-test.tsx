import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";

import {
  resolveAndGetCredentialsWithAgent,
  storeIssuerNameFromOfferWithAgent,
} from "@/agent/Vc";
import URLScreen from "@/app/(tabs)/(addPrescriptions)/URLScreen";

jest.mock("@credo-ts/react-hooks", () => ({
  useAgent: () => ({ agent: "mock-agent" }),
}));

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/agent/Vc", () => ({
  resolveAndGetCredentialsWithAgent: jest.fn(),
  storeIssuerNameFromOfferWithAgent: jest.fn(),
}));

const testNavigationAndErrorHandling = async (
  expectedErrorMessage: string,
  mockPush: jest.Mock,
) => {
  const invalidUrl = "https://invalid-url.com"; // The common invalid URL

  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

  const { getByText, getByPlaceholderText } = render(<URLScreen />);
  fireEvent.changeText(getByPlaceholderText("https://example.com"), invalidUrl);
  fireEvent.press(getByText("Upload"));

  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith("/NotReceived");
  });

  expect(consoleErrorSpy).toHaveBeenCalledWith(new Error(expectedErrorMessage));

  consoleErrorSpy.mockRestore();
};

describe("URLScreen", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  test("renders input and upload button", () => {
    const { getByPlaceholderText, getByText } = render(<URLScreen />);
    expect(getByPlaceholderText("https://example.com")).toBeTruthy();
    expect(getByText("Upload")).toBeTruthy();
  });

  it("updates input text correctly", () => {
    const { getByPlaceholderText } = render(<URLScreen />);
    const input = getByPlaceholderText("https://example.com");
    fireEvent.changeText(input, "https://my-link.com");
    expect(input.props.value).toBe("https://my-link.com");
  });

  test("navigates to DeclineAcceptScreen when upload succeeds", async () => {
    (resolveAndGetCredentialsWithAgent as jest.Mock).mockResolvedValue([
      { resolved: true },
      [
        {
          credential: {
            credential: { issuerId: "issuer-123" },
          },
        },
      ],
    ]);

    (storeIssuerNameFromOfferWithAgent as jest.Mock).mockResolvedValue(
      "MockIssuer",
    );

    const { getByText, getByPlaceholderText } = render(<URLScreen />);
    fireEvent.changeText(
      getByPlaceholderText("https://example.com"),
      "https://valid-url.com",
    );
    fireEvent.press(getByText("Upload"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/DeclineAcceptScreen");
    });
  });

  test("navigates to NotReceived when no credentials were received", async () => {
    (resolveAndGetCredentialsWithAgent as jest.Mock).mockResolvedValue([
      { resolved: true },
      [],
    ]);

    await testNavigationAndErrorHandling(
      "No credentials were received.",
      mockPush,
    );
  });

  test("shows loading state while uploading", () => {
    (resolveAndGetCredentialsWithAgent as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );

    const { getByText, getByPlaceholderText, queryByTestId } = render(
      <URLScreen />,
    );

    fireEvent.changeText(
      getByPlaceholderText("https://example.com"),
      "https://waiting.com",
    );
    fireEvent.press(getByText("Upload"));

    expect(queryByTestId("loading-indicator")).toBeTruthy();
  });

  test("navigates to NotReceived when multiple credentials are received", async () => {
    (resolveAndGetCredentialsWithAgent as jest.Mock).mockResolvedValue([
      { resolved: true },
      [
        { credential: { credential: { issuerId: "issuer-1" } } },
        { credential: { credential: { issuerId: "issuer-2" } } },
      ],
    ]);

    await testNavigationAndErrorHandling(
      "Handling of multiple credentials is not implemented",
      mockPush,
    );
  });
});
