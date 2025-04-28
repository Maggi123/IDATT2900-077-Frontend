import { useQueryClient } from "@tanstack/react-query";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Redirect, useRouter } from "expo-router";

import { storeCredentialsWithAgent } from "@/agent/Vc";
import DeclineAcceptScreen from "@/app/(tabs)/(addPrescriptions)/DeclineAcceptScreen";
import { useCredentialResponsesStore } from "@/state/CredentialResponsesStore";
import { useIssuerInfoStore } from "@/state/IssuerInfoStore";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  Redirect: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: jest.fn(),
}));

jest.mock("@/state/CredentialResponsesStore", () => ({
  useCredentialResponsesStore: jest.fn(),
}));

jest.mock("@/state/IssuerInfoStore", () => ({
  useIssuerInfoStore: jest.fn(),
}));

jest.mock("@/agent/Vc", () => ({
  storeCredentialsWithAgent: jest.fn(),
}));

jest.mock("@credo-ts/react-hooks", () => ({
  useAgent: jest.fn().mockReturnValue({
    agent: {},
  }),
}));

jest.mock(
  "@/components/declineAcceptComponents/PrescriptionDeclineAcceptComponent",
  () => "PrescriptionDeclineAcceptComponent",
);

describe("DeclineAcceptScreen", () => {
  let mockRouter: { back: any; push: any };
  let mockQueryClient: { invalidateQueries: any };
  let mockClearCredentialResponses: jest.Mock;
  let mockClearIssuerInfo: jest.Mock;

  beforeEach(() => {
    mockRouter = { push: jest.fn(), back: jest.fn() };
    mockQueryClient = { invalidateQueries: jest.fn() };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (Redirect as jest.Mock).mockImplementation(({ href }) => {
      return <></>;
    });
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);

    mockClearCredentialResponses = jest.fn();
    mockClearIssuerInfo = jest.fn();

    const credentialResponses = [
      {
        credential: {
          credential: {
            credentialSubject: [{ claims: "Prescription Details" }],
          },
        },
      },
    ];

    (useCredentialResponsesStore as unknown as jest.Mock).mockImplementation(
      (selector) => {
        if (selector({ credentialResponses }) === credentialResponses) {
          return credentialResponses;
        }
        if (
          selector({ clear: mockClearCredentialResponses }) ===
          mockClearCredentialResponses
        ) {
          return mockClearCredentialResponses;
        }
      },
    );

    const name = "Mock Issuer";

    (useIssuerInfoStore as unknown as jest.Mock).mockImplementation(
      (selector) => {
        if (selector({ name }) === name) {
          return name;
        }
        if (selector({ clear: mockClearIssuerInfo }) === mockClearIssuerInfo) {
          return mockClearIssuerInfo;
        }
      },
    );

    (storeCredentialsWithAgent as jest.Mock).mockResolvedValue(true);
  });

  test("should render the screen correctly with issuer", async () => {
    const { getByText } = render(<DeclineAcceptScreen />);

    await waitFor(() => {
      expect(getByText("Issuer:")).toBeTruthy();
      expect(getByText("Mock Issuer")).toBeTruthy();
    });
  });

  test("should navigate back when the Decline button is pressed", () => {
    const { getByText } = render(<DeclineAcceptScreen />);
    fireEvent.press(getByText("Decline"));
    expect(mockRouter.back).toHaveBeenCalled();
  });

  test("should store credentials and navigate when the Accept button is pressed", async () => {
    const { getByText } = render(<DeclineAcceptScreen />);
    fireEvent.press(getByText("Accept"));

    await waitFor(() => {
      expect(storeCredentialsWithAgent).toHaveBeenCalled();
    });

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["prescription"],
    });
    expect(mockRouter.push).toHaveBeenCalledWith("/Received");
  });

  test("should show loading screen when there are no credential responses", () => {
    (useCredentialResponsesStore as unknown as jest.Mock).mockReturnValueOnce(
      [],
    );

    const { getByTestId } = render(<DeclineAcceptScreen />);
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  test("should redirect to NotReceived if credential has no subject information", () => {
    (useCredentialResponsesStore as unknown as jest.Mock).mockReturnValueOnce([
      {
        credential: {
          credential: {
            credentialSubject: [],
          },
        },
      },
    ]);

    render(<DeclineAcceptScreen />);
    expect(Redirect).toHaveBeenCalledWith({ href: "/NotReceived" }, {});
  });

  test("should call clearCredentialResponses and clearIssuerInfo when the Decline button is pressed", () => {
    const { getByText } = render(<DeclineAcceptScreen />);

    fireEvent.press(getByText("Decline"));

    expect(mockClearCredentialResponses).toHaveBeenCalledTimes(1);
    expect(mockClearIssuerInfo).toHaveBeenCalledTimes(1);
  });
});
