import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import { useRouter } from "expo-router";
import { useAuth0 } from "react-native-auth0";

import Logout from "@/app/(tabs)/Logout";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-native-auth0", () => ({
  useAuth0: jest.fn(),
}));

describe("Logout", () => {
  const mockPush = jest.fn();
  const mockClearSession = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuth0 as jest.Mock).mockReturnValue({ clearSession: mockClearSession });
  });

  test("calls clearSession and navigates to home when log out button is pressed", async () => {
    render(<Logout />);

    const button = screen.getByText("Log out");
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockClearSession).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
