import { render, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";

import QRCodeScannerComponent from "../QRCodeScannerComponent";

jest.mock("expo-camera/next", () => {
  const mockOnBarcodeScannedFunction = jest.fn();

  return {
    CameraView: jest.fn((props) => {
      mockOnBarcodeScannedFunction.mockImplementation(props.onBarcodeScanned);
      return null;
    }),
    useCameraPermissions: jest.fn(),
    __mockScanBarcode: (data: any) => {
      mockOnBarcodeScannedFunction({ data });
    },
  };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cameraMock = require("expo-camera/next");

describe("QRCodeScannerComponent", () => {
  const mockRequestPermission = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    cameraMock.useCameraPermissions.mockReturnValue([
      { granted: true },
      mockRequestPermission,
    ]);
  });

  it("should render loading state when permission is undefined", () => {
    cameraMock.useCameraPermissions.mockReturnValue([
      undefined,
      mockRequestPermission,
    ]);

    const { getByText } = render(<QRCodeScannerComponent onScan={jest.fn()} />);

    expect(getByText("Requesting camera permission...")).toBeTruthy();
  });

  it("should render permission request button when permission is not granted", () => {
    cameraMock.useCameraPermissions.mockReturnValue([
      { granted: false },
      mockRequestPermission,
    ]);

    const { getByText } = render(<QRCodeScannerComponent onScan={jest.fn()} />);

    const permissionButton = getByText("Grant Camera Permission");
    expect(permissionButton).toBeTruthy();

    fireEvent.press(permissionButton);
    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
  });

  it("should call onScan when QR code is scanned", async () => {
    const mockOnScan = jest.fn();

    await waitFor(() => {
      render(<QRCodeScannerComponent onScan={mockOnScan} />);

      cameraMock.__mockScanBarcode("test-qr-data");

      expect(mockOnScan).toHaveBeenCalledWith("test-qr-data");
    });
  });
});
