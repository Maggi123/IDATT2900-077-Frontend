import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";

import Received from "@/app/(tabs)/(addPrescriptions)/Received";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("Received", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  test("renders the message and button", () => {
    const { getByText } = render(<Received />);

    expect(getByText("Document added")).toBeTruthy();
    expect(getByText("You successfully received the document(s)")).toBeTruthy();
  });

  test("navigates to the viewPrescriptions screen when the 'When' button is pressed", async () => {
    const { getByText } = render(<Received />);

    fireEvent.press(getByText("View"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/(tabs)/(viewPrescriptions)");
    });
  });
});
