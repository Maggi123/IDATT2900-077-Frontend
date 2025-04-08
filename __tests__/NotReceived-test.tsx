import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";

import NotReceived from "@/app/(tabs)/(addPrescriptions)/NotReceived";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("Not Received", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  test("should render the error message and button", () => {
    const { getByText } = render(<NotReceived />);

    expect(
      getByText("An error occurred while receiving document(s)"),
    ).toBeTruthy();
    expect(getByText("Ok")).toBeTruthy();
  });

  test("should navigate to the addPrescriptions screen when the 'Ok' button is pressed", async () => {
    const { getByText } = render(<NotReceived />);

    fireEvent.press(getByText("Ok"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/(tabs)/(addPrescriptions)");
    });
  });
});
