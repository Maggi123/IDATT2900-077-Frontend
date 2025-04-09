import { useQuery } from "@tanstack/react-query";
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native";
import React from "react";

import ViewPrescriptions from "../app/(tabs)/(viewPrescriptions)/index";

jest.mock("@credo-ts/react-hooks", () => ({
  useAgent: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: jest.fn(),
  };
});

const mockPrescriptions = [
  {
    id: "cred-1",
    credential: {
      credentialSubject: {
        claims: {
          name: "Paracetamol",
          activeIngredient: "Paracetamol",
          authoredOn: "2024-03-20T00:00:00Z",
        },
      },
      issuerId: "issuer-1",
    },
    createdAt: new Date("2024-03-21"),
  },
];

const mockIssuerNames = {
  "issuer-1": "Trusted Health Org",
};

describe("ViewPrescriptions Screen", () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "prescription") {
        return { data: mockPrescriptions, isSuccess: true, isPending: false };
      } else if (queryKey[0] === "issuerNames") {
        return { data: mockIssuerNames, isSuccess: true, isPending: false };
      }
    });
  });

  test("should render prescription name, issuer, and dates correctly", async () => {
    const { getByText, getAllByText } = render(<ViewPrescriptions />);

    const nameMatches = getAllByText("Paracetamol");
    await waitFor(() => {
      expect(nameMatches).toHaveLength(2);
      expect(getByText("Trusted Health Org")).toBeTruthy();
      expect(getByText("3/20/2024")).toBeTruthy();
      expect(getByText("3/21/2024")).toBeTruthy();
    });
  });

  test("should disable the download and share buttons when no prescription is selected", async () => {
    const { getByRole } = render(<ViewPrescriptions />);

    const downloadBtn = getByRole("button", { name: "Download" });
    const shareBtn = getByRole("button", { name: "Share" });

    await waitFor(() => {
      expect(downloadBtn?.props.accessibilityState?.disabled).toBe(true);
      expect(shareBtn?.props.accessibilityState?.disabled).toBe(true);
    });
  });

  test("should enable the download and share buttons when prescriptions are selected", async () => {
    const { getAllByRole, getByRole } = render(<ViewPrescriptions />);

    const checkboxes = getAllByRole("checkbox");
    fireEvent.press(checkboxes[0]);

    const downloadBtn = getByRole("button", { name: "Download" });
    const shareBtn = getByRole("button", { name: "Share" });

    expect(downloadBtn?.props.accessibilityState?.disabled).toBe(false);
    expect(shareBtn?.props.accessibilityState?.disabled).toBe(false);
  });
});

describe("ViewPrescriptions error handling", () => {
  test("should display loading indicator when prescriptions data is loading", async () => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "prescription") {
        return { data: null, isSuccess: false, isPending: true }; // Simulate loading state
      } else if (queryKey[0] === "issuerNames") {
        return { data: mockIssuerNames, isSuccess: true, isPending: false };
      }
    });

    render(<ViewPrescriptions />);

    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
  });

  test("should display error message when prescriptions data fetch fails", async () => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "prescription") {
        return { data: null, isSuccess: false, isPending: false }; // Simulate error state
      } else if (queryKey[0] === "issuerNames") {
        return { data: mockIssuerNames, isSuccess: true, isPending: false };
      }
    });

    const { getByText } = render(<ViewPrescriptions />);

    expect(getByText("Something went wrong fetching data.")).toBeTruthy();
  });
});
