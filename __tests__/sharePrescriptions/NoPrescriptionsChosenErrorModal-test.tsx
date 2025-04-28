import { render, fireEvent, screen, waitFor } from "@testing-library/react-native";
import NoPrescriptionsChosenErrorModal from "@/app/(tabs)/(sharePrescriptions)/NoPrescriptionsChosenErrorModal";
describe("NoPrescriptionsChosenErrorModal", () => {
  it("should display the correct error message", () => {
    render(<NoPrescriptionsChosenErrorModal />);

    expect(screen.getByText("No prescriptions were chosen.")).toBeTruthy();
  });

  it("should show confirm button", async () => {
    render(<NoPrescriptionsChosenErrorModal />);

    screen.getByRole("link", { name: /confirm/i });
  });
});
