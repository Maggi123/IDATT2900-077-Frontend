import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuth0 } from "react-native-auth0";

import RegisterScreen from "@/app/RegisterScreen";

jest.mock("react-native-auth0");
jest.mock("expo-router");
jest.mock("expo-secure-store");
jest.mock("expo-crypto");

const mockReplace = jest.fn();
const mockAuthorize = jest.fn().mockResolvedValue({
  access_token: "mock-token",
});
const mockSetItemAsync = jest.fn();
const mockGetRandomBytesAsync = jest
  .fn()
  .mockResolvedValue(new Uint8Array(1024));

(useAuth0 as jest.Mock).mockReturnValue({
  authorize: mockAuthorize,
  user: { sub: "12345" },
  error: null,
});

(useRouter as jest.Mock).mockReturnValue({
  replace: mockReplace,
});

(SecureStore.setItemAsync as jest.Mock).mockImplementation(mockSetItemAsync);
(Crypto.getRandomBytesAsync as jest.Mock).mockImplementation(
  mockGetRandomBytesAsync,
);

const setupAndPressRegister = async (user: any, error: any = null) => {
  (useAuth0 as jest.Mock).mockReturnValueOnce({
    authorize: mockAuthorize,
    user,
    error,
  });

  const consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

  render(<RegisterScreen />);

  const button = screen.getByText("Register with External Account");

  fireEvent.press(button);

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  return { consoleErrorSpy };
};

describe("RegisterScreen", () => {
  test("should call authorize and navigate when user presses register", async () => {
    await setupAndPressRegister({ sub: "12345" });

    await waitFor(() => {
      expect(mockAuthorize).toHaveBeenCalledTimes(1);
      expect(mockReplace).toHaveBeenCalledWith("/HomeScreen");
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith("registered", "1");
    });
  });

  test("should throw an error when user has no sub", async () => {
    const { consoleErrorSpy } = await setupAndPressRegister({ sub: undefined });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        Error(
          "User did not authenticate with OpenID account during registering.",
        ),
      );
    });
  });

  test("should log error if authorization fails", async () => {
    const mockError = new Error("Authorization failed");
    const { consoleErrorSpy } = await setupAndPressRegister(
      { sub: "12345" },
      mockError,
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  test("should throw an error if an error is present during registration", async () => {
    const mockAuthError = new Error("Authentication failed");
    const { consoleErrorSpy } = await setupAndPressRegister(
      { sub: "12345" },
      mockAuthError,
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
