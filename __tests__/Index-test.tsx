import { fireEvent, render, screen } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

import Index from "@/app/index";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("Given the registered state in Secure storage", () => {
  test("should show Register when no item is stored", () => {
    jest.spyOn(SecureStore, "getItem").mockReturnValue(null);
    render(<Index />);
    expect(screen.getByText("Register")).toBeOnTheScreen();
  });

  test("should show Login when item is stored", () => {
    jest.spyOn(SecureStore, "getItem").mockReturnValue("1");
    render(<Index />);
    expect(screen.getByText("Login")).toBeOnTheScreen();
  });
});

describe("Given that a navigation button is clicked", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test("should route to Register screen when register button is clicked", async () => {
    jest.spyOn(SecureStore, "getItem").mockReturnValue(null);
    render(<Index />);

    const element = screen.getByText("Register");
    fireEvent.press(element);

    expect(mockPush).toHaveBeenCalledWith("/RegisterScreen");
  });

  test("should route to Login screen when login button is clicked", async () => {
    jest.spyOn(SecureStore, "getItem").mockReturnValue("1");
    render(<Index />);

    const element = screen.getByText("Login");
    fireEvent.press(element);

    expect(mockPush).toHaveBeenCalledWith("/LoginScreen");
  });
});
