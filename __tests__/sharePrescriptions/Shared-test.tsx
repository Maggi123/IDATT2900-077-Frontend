import { render, fireEvent, screen } from "@testing-library/react-native";
import Shared from "@/app/(tabs)/(sharePrescriptions)/Shared";
import { useRouter } from "expo-router";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("Shared", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("should display the success message", () => {
    render(<Shared />);

    expect(screen.getByText("Document(s) shared")).toBeTruthy();
    expect(screen.getByText("You successfully shared the document(s)")).toBeTruthy();
  });

  it("should navigate to the sharePrescriptions screen when 'Ok' is pressed", () => {
    render(<Shared />);

    const okButton = screen.getByText("Ok");
    fireEvent.press(okButton);

    expect(mockPush).toHaveBeenCalledWith("/(tabs)/(sharePrescriptions)");
  });
});
