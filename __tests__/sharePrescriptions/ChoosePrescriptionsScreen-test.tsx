import { render, screen, fireEvent, waitFor, act } from "@testing-library/react-native";
import ChoosePrescriptionsScreen from "@/app/(tabs)/(sharePrescriptions)/ChoosePrescriptionsScreen";
import { useQuery } from "@tanstack/react-query";
import { Redirect, useRouter } from "expo-router";
import { useAgent } from "@credo-ts/react-hooks";
import { useResolvedAuthorizationRequestStore } from "@/state/ResolvedAuthorizationRequestStore";
import { ClaimFormat } from "@credo-ts/core";

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Redirect: jest.fn(({ href }) => `Redirected to ${href}`),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('@credo-ts/react-hooks', () => ({
  useAgent: jest.fn(),
}));

jest.mock('@/state/ResolvedAuthorizationRequestStore', () => ({
  useResolvedAuthorizationRequestStore: jest.fn(),
}));

jest.mock('@/components/PrescriptionList', () => 'PrescriptionList');

describe('ChoosePrescriptionsScreen', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockClear = jest.fn();

  const mockAgent = {
    agent: {
      genericRecords: {
        getAll: jest.fn(),
      },
      modules: {
        openId4VcHolderModule: {
          acceptSiopAuthorizationRequest: jest.fn(),
        },
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAgent as jest.Mock).mockReturnValue(mockAgent);

    (useQuery as jest.Mock).mockReturnValue({
      isPending: false,
      isSuccess: true,
      data: { 'issuer-1': 'Issuer 1', 'issuer-2': 'Issuer 2' },
    });

    (useResolvedAuthorizationRequestStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = {
        resolvedAuthorizationRequest: {
          authorizationRequest: { id: 'auth-request-1' },
          presentationExchange: {
            credentialsForRequest: {
              areRequirementsSatisfied: true,
              name: 'Test Authorization',
              purpose: 'Test Purpose',
              requirements: [
                {
                  submissionEntry: [
                    {
                      inputDescriptorId: 'PrescriptionDescriptor',
                      verifiableCredentials: [
                        {
                          type: ClaimFormat.JwtVc,
                          credentialRecord: { id: 'credential-1', metadata: { issuer: 'issuer-1' } }
                        },
                        {
                          type: ClaimFormat.LdpVc,
                          credentialRecord: { id: 'credential-2', metadata: { issuer: 'issuer-2' } }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        },
        clear: mockClear
      };
      return selector(store);
    });

    mockAgent.agent.genericRecords.getAll.mockResolvedValue([
      { id: 'issuer-1', content: { name: 'Issuer 1' } },
      { id: 'issuer-2', content: { name: 'Issuer 2' } }
    ]);
  });

  it("should display the prescription list when data is successfully fetched", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isPending: false,
      isSuccess: true,
      data: { 'issuer-1': 'Issuer 1', 'issuer-2': 'Issuer 2' },
    });

    render(<ChoosePrescriptionsScreen />);

    await screen.findByText("Test Authorization");

    expect(screen.getByText("Test Authorization")).toBeTruthy();
    expect(screen.getByText("Test Purpose")).toBeTruthy();
  });

  it("should handle error when fetching issuer names fails", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (useQuery as jest.Mock).mockReturnValue({
      isError: true
    });

    render(<ChoosePrescriptionsScreen />);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Could not get issuer names.");
    consoleErrorSpy.mockRestore();

    expect(Redirect).toHaveBeenCalledWith({ href: "/NotShared" }, {});
  });

  it("should show error modal when share button is pressed without selecting prescriptions", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<ChoosePrescriptionsScreen />);

    const shareButton = screen.getByText("Share");
    fireEvent.press(shareButton);

    // Check if the router push was called with the expected path
    expect(mockRouter.push).toHaveBeenCalledWith(
      "/(tabs)/(sharePrescriptions)/NoPrescriptionsChosenErrorModal"
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith("No prescription selected");

    consoleErrorSpy.mockRestore();
  });

  it("should redirect to Shared page when share button is pressed with prescriptions selected", async () => {
    mockAgent.agent.modules.openId4VcHolderModule.acceptSiopAuthorizationRequest.mockResolvedValueOnce({});

    const { UNSAFE_getAllByType, getByText } = render(<ChoosePrescriptionsScreen />);

    // @ts-ignore
    const prescriptionList = UNSAFE_getAllByType('PrescriptionList')[0];

    await act(async () => {
      prescriptionList.props.onToggleSelection(0);
    });

    await act(async () => {
      fireEvent.press(getByText("Share"));
    });

    await waitFor(() => {
      expect(mockAgent.agent.modules.openId4VcHolderModule.acceptSiopAuthorizationRequest).toHaveBeenCalled();
      expect(mockClear).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith("/Shared");
    });
  });

  it("should display loading component when sharing is in progress", async () => {
    // Set up a delayed resolution to simulate loading state
    mockAgent.agent.modules.openId4VcHolderModule.acceptSiopAuthorizationRequest.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({}), 100))
    );

    const { UNSAFE_getAllByType, getByText, queryByText } = render(<ChoosePrescriptionsScreen />);

    // @ts-ignore
    const prescriptionList = UNSAFE_getAllByType('PrescriptionList')[0];
    await act(async () => {
      prescriptionList.props.onToggleSelection(0);
    });

    await act(async () => {
      fireEvent.press(getByText("Share"));
    });

    expect(screen.getByTestId('loading-indicator')).toBeTruthy();

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/Shared");
    });
  });

  it("should handle cancel button press correctly", async () => {
    const { getByText } = render(<ChoosePrescriptionsScreen />);

    await act(async () => {
      fireEvent.press(getByText("Cancel"));
    });

    expect(mockClear).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith("/NotShared");
  });

  it("should redirect to NotShared when resolvedAuthorizationRequest is undefined", async () => {
    // Mock return value for useResolvedAuthorizationRequestStore
    (useResolvedAuthorizationRequestStore as unknown as jest.Mock).mockImplementationOnce((selector) => {
      const store = {
        resolvedAuthorizationRequest: undefined,
        clear: mockClear
      };
      return selector(store);
    });

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<ChoosePrescriptionsScreen />);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Resolved authorization request is undefined.");
    expect(Redirect).toHaveBeenCalledWith({ href: "/NotShared" }, {});

    consoleErrorSpy.mockRestore();
  });

  it("should redirect to NotShared when presentationExchange is missing", async () => {
    // Mock return value for useResolvedAuthorizationRequestStore
    (useResolvedAuthorizationRequestStore as unknown as jest.Mock).mockImplementationOnce((selector) => {
      const store = {
        resolvedAuthorizationRequest: {
          authorizationRequest: { id: 'auth-request-1' },
          presentationExchange: undefined
        },
        clear: mockClear
      };
      return selector(store);
    });

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<ChoosePrescriptionsScreen />);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Resolved authorization request has no presentation exchange.");
    expect(Redirect).toHaveBeenCalledWith({ href: "/NotShared" }, {});

    consoleErrorSpy.mockRestore();
  });

  it("should redirect when requirements are not satisfied", async () => {
    // Mock return value for useResolvedAuthorizationRequestStore
    (useResolvedAuthorizationRequestStore as unknown as jest.Mock).mockImplementationOnce((selector) => {
      const store = {
        resolvedAuthorizationRequest: {
          authorizationRequest: { id: 'auth-request-1' },
          presentationExchange: {
            credentialsForRequest: {
              areRequirementsSatisfied: false,
              requirements: []
            }
          }
        },
        clear: mockClear
      };
      return selector(store);
    });

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<ChoosePrescriptionsScreen />);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Wallets credentials do not satisfy verification requirements.");
    expect(Redirect).toHaveBeenCalledWith({ href: "/NotShared" }, {});

    consoleErrorSpy.mockRestore();
  });

  it("should correctly toggle prescription selection", async () => {
    const { UNSAFE_getAllByType } = render(<ChoosePrescriptionsScreen />);

    // @ts-ignore
    const prescriptionList = UNSAFE_getAllByType('PrescriptionList')[0];

    expect(prescriptionList.props.selectedPrescriptions).toEqual([]);

    await act(async () => {
      prescriptionList.props.onToggleSelection(0);
    });

    expect(prescriptionList.props.selectedPrescriptions).toContain(0);

    await act(async () => {
      prescriptionList.props.onToggleSelection(0);
    });

    expect(prescriptionList.props.selectedPrescriptions).toEqual([]);
  });

  it("should handle share failure and redirect to NotShared", async () => {
    mockAgent.agent.modules.openId4VcHolderModule.acceptSiopAuthorizationRequest
      .mockRejectedValueOnce(new Error("Sharing failed"));

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { UNSAFE_getAllByType, getByText } = render(<ChoosePrescriptionsScreen />);

    // @ts-ignore
    const prescriptionList = UNSAFE_getAllByType('PrescriptionList')[0];
    await act(async () => {
      prescriptionList.props.onToggleSelection(0);
    });

    // Press share button
    await act(async () => {
      fireEvent.press(getByText("Share"));
    });

    await waitFor(() => {
      expect(mockAgent.agent.modules.openId4VcHolderModule.acceptSiopAuthorizationRequest).toHaveBeenCalled();
      expect(mockClear).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith("/NotShared");
    });

    consoleErrorSpy.mockRestore();
  });

  it("should display loading component when issuerNames query is pending", async () => {
    (useQuery as jest.Mock).mockReturnValueOnce({
      isPending: true,
      isSuccess: false,
      data: null,
    });

    render(<ChoosePrescriptionsScreen />);
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it("should pass the correct props to PrescriptionList component", async () => {
    const { UNSAFE_getAllByType } = render(<ChoosePrescriptionsScreen />);

    // @ts-ignore
    const prescriptionList = UNSAFE_getAllByType('PrescriptionList')[0];

    expect(prescriptionList.props.prescriptions).toHaveLength(2);
    expect(prescriptionList.props.prescriptions[0].id).toBe('credential-1');
    expect(prescriptionList.props.prescriptions[1].id).toBe('credential-2');

    expect(prescriptionList.props.issuerNames).toEqual({
      'issuer-1': 'Issuer 1',
      'issuer-2': 'Issuer 2'
    });

    expect(prescriptionList.props.selectedPrescriptions).toEqual([]);

    expect(typeof prescriptionList.props.onToggleSelection).toBe('function');
  });
});