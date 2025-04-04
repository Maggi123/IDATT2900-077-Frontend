import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";

import AddPrescriptions from "../app/(tabs)/(addPrescriptions)/index"; // Adjust the path if needed

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("AddPrescriptions Component", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test("renders all buttons correctly", async () => {
    render(<AddPrescriptions />);
    await waitFor(() => {
      expect(screen.getByText("Scan QR code")).toBeTruthy();
      expect(screen.getByText("Input URL")).toBeTruthy();
      expect(screen.getByText("Upload document")).toBeTruthy();
    });
  });

  test("navigates to the correct screen when buttons are pressed", async () => {
    render(<AddPrescriptions />);

    const scanQRCodeButton = screen.getByText("Scan QR code");
    fireEvent.press(scanQRCodeButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/QRCodeScreen");
    });

    const inputURLButton = screen.getByText("Input URL");
    fireEvent.press(inputURLButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/URLScreen");
    });

    const uploadDocumentButton = screen.getByText("Upload document");
    fireEvent.press(uploadDocumentButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/UploadScreen");
    });
  });
});
