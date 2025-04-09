import { render } from "@testing-library/react-native";
import React from "react";

import PrescriptionDeclineAcceptComponent from "@/components/declineAcceptComponents/PrescriptionDeclineAcceptComponent";

const mockPrescription = {
  name: "Ibuprofen",
  activeIngredient: "Ibuprofen",
  authoredOn: "2024-03-15T00:00:00Z",
};

describe("PrescriptionDeclineAcceptComponent", () => {
  test("should render prescription data correctly", () => {
    const { getByText, getAllByText } = render(
      <PrescriptionDeclineAcceptComponent
        newPrescriptionDescription={mockPrescription}
      />,
    );

    expect(getByText("New prescription")).toBeTruthy();
    expect(
      getByText(
        "Check if prescription information is correct, and decline or accept the prescription",
      ),
    ).toBeTruthy();

    expect(getByText("Name:")).toBeTruthy();
    expect(getAllByText("Ibuprofen")).toBeTruthy();

    expect(getByText("Active ingredient:")).toBeTruthy();
    expect(getAllByText("Ibuprofen")).toBeTruthy();

    expect(getByText("Authored:")).toBeTruthy();
    expect(getByText("3/15/2024")).toBeTruthy();
  });

  test("should render N/A for undefined name", () => {
    const { getByText } = render(
      <PrescriptionDeclineAcceptComponent
        newPrescriptionDescription={{
          name: undefined,
          activeIngredient: "Ibuprofen",
          authoredOn: "3/15/2024",
        }}
      />,
    );

    expect(getByText("N/A")).toBeTruthy();
  });

  test("should render N/A for missing active ingredients", () => {
    const { getByText } = render(
      <PrescriptionDeclineAcceptComponent
        newPrescriptionDescription={{
          name: "Ibuprofen",
          activeIngredient: undefined,
          authoredOn: "3/15/2024",
        }}
      />,
    );

    expect(getByText("N/A")).toBeTruthy();
  });

  test("should render Invalid Date for missing authored date", () => {
    const { getByText } = render(
      <PrescriptionDeclineAcceptComponent
        newPrescriptionDescription={{
          name: "Ibuprofen",
          activeIngredient: "Ibuprofen",
          authoredOn: undefined,
        }}
      />,
    );

    expect(getByText("Invalid Date")).toBeTruthy();
  });
  test("should render N/A when newPrescriptionDescription is undefined", () => {
    const { getAllByText } = render(
      <PrescriptionDeclineAcceptComponent
        newPrescriptionDescription={undefined}
      />,
    );

    const naElements = getAllByText("N/A");
    expect(naElements.length).toBeGreaterThanOrEqual(2);
  });
});
