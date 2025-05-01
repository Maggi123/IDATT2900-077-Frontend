import { render, fireEvent, screen } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import NotShared from "@/app/(tabs)/(sharePrescriptions)/NotShared";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("NotShared", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("should display the error message", () => {
    render(<NotShared />);

    expect(
      screen.getByText("An error occurred while sharing document(s)"),
    ).toBeTruthy();
  });

  it("should navigate to the sharePrescriptions screen when 'Ok' is pressed", () => {
    render(<NotShared />);

    const okButton = screen.getByText("Ok");
    fireEvent.press(okButton);

    expect(mockPush).toHaveBeenCalledWith("/(tabs)/(sharePrescriptions)");
  });
});
