import {
  render,
  screen,
  userEvent,
  waitFor,
  act,
} from "@testing-library/react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuth0 } from "react-native-auth0";

import LoginScreen from "@/app/LoginScreen";

jest.mock("react-native-auth0");
jest.mock("expo-router");
jest.mock("expo-secure-store");

const mockAuthorize = jest
  .fn()
  .mockResolvedValue({ access_token: "mock-token" });

const mockPush = jest.fn();
const mockClearSession = jest.fn();

describe("LoginScreen", () => {
  describe("Given the user is not authenticated yet", () => {
    beforeEach(() => {
      (useAuth0 as jest.Mock).mockReturnValue({
        authorize: mockAuthorize,
        user: null, // user is null
        error: null,
        clearSession: mockClearSession,
      });
    });

    test("should render the login button", () => {
      render(<LoginScreen />);
      expect(screen.getByText("Login with External Account")).toBeTruthy();
    });

    test("should call authorize when the login button is pressed", async () => {
      render(<LoginScreen />);

      const user = userEvent.setup();
      const element = screen.getByText("Login with External Account");

      await user.press(element);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      });

      expect(mockAuthorize).toHaveBeenCalledTimes(1);
    });
  });

  describe("Given the user is authenticated", () => {
    beforeEach(() => {
      (useAuth0 as jest.Mock).mockReturnValue({
        authorize: mockAuthorize,
        user: { sub: "12345" }, // Authenticated user
        error: null,
        clearSession: mockClearSession,
      });
    });

    test("should navigate to HomeScreen when the user is authenticated and a key is found in SecureStore", async () => {
      jest.spyOn(SecureStore, "getItemAsync").mockResolvedValue("some-key");

      (useRouter as jest.Mock).mockReturnValue({
        replace: mockPush,
      });
      render(<LoginScreen />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/HomeScreen");
      });
    });

    test("should clear session and throw an error when no key is found in SecureStore for authenticated user", async () => {
      jest.spyOn(SecureStore, "getItemAsync").mockResolvedValue(null);
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<LoginScreen />);

      await waitFor(() => {
        expect(mockClearSession).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          Error("Authenticated account has not been registered."),
        );
      });
    });
  });

  test("should throw an error if user does not authenticate with OpenID account", async () => {
    (useAuth0 as jest.Mock).mockReturnValueOnce({
      authorize: mockAuthorize,
      user: { sub: undefined },
      error: null,
      clearSession: mockClearSession,
    });

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<LoginScreen />);

    const user = userEvent.setup();
    const button = screen.getByText("Login with External Account");

    await user.press(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        Error("User did not authenticate with OpenID account during login."),
      );
    });
  });
});
