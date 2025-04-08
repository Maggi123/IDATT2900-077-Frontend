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

  test("should display an error when the DID array is empty", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isError: true,
      isPending: false,
      data: null,
    });

    render(<HomeScreen />);

    expect(await screen.findByText("󰐙")).toBeTruthy();
  });
});
