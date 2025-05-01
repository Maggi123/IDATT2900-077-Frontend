import { useAgent } from "@credo-ts/react-hooks";
import { useQuery } from "@tanstack/react-query";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import { useRouter } from "expo-router";

import HomeScreen from "@/app/(tabs)/HomeScreen";

jest.mock("expo-router", () => ({ useRouter: jest.fn() }));
jest.mock("@tanstack/react-query", () => ({ useQuery: jest.fn() }));

jest.mock("@credo-ts/react-hooks", () => ({
  useAgent: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => ({
  MaterialCommunityIcons: () => "Icon",
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

const mockAgent = {
  agent: {
    dids: {
      getCreatedDids: jest.fn().mockResolvedValue([{ did: "did:indy:123" }]),
    },
  },
};
(useAgent as jest.Mock).mockReturnValue(mockAgent);

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render the LoadingComponent while waiting for DID", async () => {
    (useQuery as jest.Mock).mockReturnValue({ isPending: true });

    render(<HomeScreen />);

    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
  });

  test("should render the DID and buttons after data is loaded", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isPending: false,
      data: "did:indy:123",
    });

    render(<HomeScreen />);

    expect(await screen.findByText("did:indy:123")).toBeTruthy();
    expect(screen.getByText("Add prescriptions")).toBeTruthy();
    expect(screen.getByText("View prescriptions")).toBeTruthy();
  });

  test("should navigate to addPrescriptions screen when 'Add prescriptions' button is pressed", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isPending: false,
      data: "did:indy:123",
    });

    render(<HomeScreen />);

    const button = screen.getByText("Add prescriptions");
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/(tabs)/(addPrescriptions)");
    });
  });

  test("should navigate to viewPrescriptions screen when 'View prescriptions' button is pressed", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isPending: false,
      data: "did:indy:123",
    });

    render(<HomeScreen />);

    const button = screen.getByText("View prescriptions");
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/(tabs)/(viewPrescriptions)");
    });
  });

  test("should navigate to sharePrescriptions screen when 'Share prescriptions' button is pressed", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isPending: false,
      data: "did:indy:123",
    });

    render(<HomeScreen />);

    const button = screen.getByText("Share prescriptions");
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/(tabs)/(sharePrescriptions)");
    });
  });

  test("should call getCreatedDids with correct parameters", async () => {
    // Capture the queryFn passed to useQuery
    let capturedQueryFn: any;
    (useQuery as jest.Mock).mockImplementation(({ queryFn }) => {
      capturedQueryFn = queryFn;
      return {
        isPending: false,
        data: "did:indy:123",
      };
    });

    render(<HomeScreen />);

    await capturedQueryFn();

    expect(mockAgent.agent.dids.getCreatedDids).toHaveBeenCalledWith({
      method: "indy",
    });
  });

  test("should extract the first DID from the returned array", async () => {
    mockAgent.agent.dids.getCreatedDids.mockResolvedValueOnce([
      { did: "did:indy:first" },
      { did: "did:indy:second" },
    ]);

    let capturedQueryFn: any;
    (useQuery as jest.Mock).mockImplementation(({ queryFn }) => {
      capturedQueryFn = queryFn;
      return {
        isPending: false,
        data: "did:indy:first",
      };
    });

    render(<HomeScreen />);

    const result = await capturedQueryFn();
    expect(result).toBe("did:indy:first");
  });

  test("should handle empty DID response gracefully", async () => {
    mockAgent.agent.dids.getCreatedDids.mockResolvedValueOnce([]);

    let capturedQueryFn: any;
    (useQuery as jest.Mock).mockImplementation(({ queryFn }) => {
      capturedQueryFn = queryFn;
      return {
        isPending: false,
        isError: true,
        error: new Error("No DIDs found"),
      };
    });

    render(<HomeScreen />);

    await expect(capturedQueryFn()).rejects.toThrow();
  });
});
