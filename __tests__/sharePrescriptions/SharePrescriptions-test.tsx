import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";

import SharePrescriptions from "@/app/(tabs)/(sharePrescriptions)";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("AddPrescriptions Screen", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test("should display all action buttons", async () => {
    render(<SharePrescriptions />);
    await waitFor(() => {
      expect(screen.getByText("By QR code")).toBeTruthy();
      expect(screen.getByText("By URL input")).toBeTruthy();
    });
  });

  test("should navigate to the QR code screen when the 'By QR code' button is pressed", async () => {
    render(<SharePrescriptions />);

    const scanQRCodeButton = screen.getByText("By QR code");
    fireEvent.press(scanQRCodeButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/ShareQRScreen");
    });
  });

  test("should navigate to the URL input screen when the 'By URL input' button is pressed", async () => {
    render(<SharePrescriptions />);

    const inputURLButton = screen.getByText("By URL input");
    fireEvent.press(inputURLButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/ShareURLScreen");
    });
  });
});
