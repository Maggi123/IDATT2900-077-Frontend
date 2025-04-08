import { useIssuerInfoStore } from "@/state/IssuerInfoStore";

describe("IssuerInfoStore", () => {
  it("should initialize with an empty name", () => {
    const { name } = useIssuerInfoStore.getState();

    expect(name).toBe("");
  });

  it("should set the name correctly", () => {
    const mockName = "Test Issuer";

    useIssuerInfoStore.getState().set(mockName);

    const { name } = useIssuerInfoStore.getState();
    expect(name).toBe(mockName);
  });

  it("should clear the name correctly", () => {
    const mockName = "Test Issuer";
    useIssuerInfoStore.getState().set(mockName);

    useIssuerInfoStore.getState().clear();

    const { name } = useIssuerInfoStore.getState();
    expect(name).toBe("");
  });
});
