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

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

describe("HomeScreen", () => {
  test("renders the LoadingComponent while waiting for did", async () => {
    (useQuery as jest.Mock).mockReturnValue({ isPending: true });

    render(<HomeScreen />);

    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
  });

  test("renders the DID and buttons after data loads", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isPending: false,
      data: "did:indy:123",
    });

    render(<HomeScreen />);

    expect(await screen.findByText("did:indy:123")).toBeTruthy();
    expect(screen.getByText("Add prescriptions")).toBeTruthy();
    expect(screen.getByText("View prescriptions")).toBeTruthy();
  });

  test("navigates to addPrescriptions when 'Add prescriptions' is pressed", async () => {
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

  test("navigates to viewPrescriptions when 'View prescriptions' is pressed", async () => {
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

  test("handles empty dids array", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isError: true,
      isPending: false,
      data: null,
    });

    render(<HomeScreen />);

    expect(await screen.findByText("󰐙")).toBeTruthy();
  });
});
