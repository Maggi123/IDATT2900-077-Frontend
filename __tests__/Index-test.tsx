import { fireEvent, render, screen } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

import Index from "@/app/index";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("Index Screen", () => {
  describe("Given no item is stored in Secure storage", () => {
    test("should show 'Register' button", () => {
      jest.spyOn(SecureStore, "getItem").mockReturnValue(null);
      render(<Index />);
      expect(screen.getByText("Register")).toBeTruthy();
    });
  });

  describe("Given an item is stored in Secure storage", () => {
    test("should show 'Login' button", () => {
      jest.spyOn(SecureStore, "getItem").mockReturnValue("1");
      render(<Index />);
      expect(screen.getByText("Login")).toBeTruthy();
    });
  });

  describe("Given a navigation button is pressed", () => {
    let mockPush: jest.Mock;

    beforeEach(() => {
      mockPush = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    });

    test("should navigate to the Register screen when the 'Register' button is pressed", async () => {
      jest.spyOn(SecureStore, "getItem").mockReturnValue(null);
      render(<Index />);

      const registerButton = screen.getByText("Register");
      fireEvent.press(registerButton);

      expect(mockPush).toHaveBeenCalledWith("/RegisterScreen");
    });

    test("should navigate to the Login screen when the 'Login' button is pressed", async () => {
      jest.spyOn(SecureStore, "getItem").mockReturnValue("1");
      render(<Index />);

      const loginButton = screen.getByText("Login");
      fireEvent.press(loginButton);

      expect(mockPush).toHaveBeenCalledWith("/LoginScreen");
    });
  });
});
