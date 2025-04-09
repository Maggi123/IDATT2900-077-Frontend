import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";

import AddPrescriptions from "../app/(tabs)/(addPrescriptions)/index";

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
    render(<AddPrescriptions />);
    await waitFor(() => {
      expect(screen.getByText("Scan QR code")).toBeTruthy();
      expect(screen.getByText("Input URL")).toBeTruthy();
      expect(screen.getByText("Upload document")).toBeTruthy();
    });
  });

  test("should navigate to the QR code screen when the 'Scan QR code' button is pressed", async () => {
    render(<AddPrescriptions />);

    const scanQRCodeButton = screen.getByText("Scan QR code");
    fireEvent.press(scanQRCodeButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/QRCodeScreen");
    });
  });

  test("should navigate to the URL input screen when the 'Input URL' button is pressed", async () => {
    render(<AddPrescriptions />);

    const inputURLButton = screen.getByText("Input URL");
    fireEvent.press(inputURLButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/URLScreen");
    });
  });

  test("should navigate to the document upload screen when the 'Upload document' button is pressed", async () => {
    render(<AddPrescriptions />);

    const uploadDocumentButton = screen.getByText("Upload document");
    fireEvent.press(uploadDocumentButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/UploadScreen");
    });
  });
});
