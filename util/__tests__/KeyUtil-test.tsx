import { secureStoreKeyFromUserSub } from "@/util/KeyUtil";

describe("secureStoreKeyFromUserSub", () => {
  it("should replace all '|' characters with '-' in the sub string", () => {
    const inputSub = "user|sub|example";
    const expectedOutput = "user-sub-example";

    const result = secureStoreKeyFromUserSub(inputSub);

    expect(result).toBe(expectedOutput);
  });

  it("should not modify the string if there are no '|' characters", () => {
    const inputSub = "user-sub-example";
    const expectedOutput = "user-sub-example";

    const result = secureStoreKeyFromUserSub(inputSub);

    expect(result).toBe(expectedOutput);
  });

  it("should handle empty strings correctly", () => {
    const inputSub = "";
    const expectedOutput = "";

    const result = secureStoreKeyFromUserSub(inputSub);

    expect(result).toBe(expectedOutput);
  });

  it("should handle strings with only '|' characters", () => {
    const inputSub = "|";
    const expectedOutput = "-";

    const result = secureStoreKeyFromUserSub(inputSub);

    expect(result).toBe(expectedOutput);
  });

  it("should handle strings with multiple '|' characters", () => {
    const inputSub = "|user|sub|example|";
    const expectedOutput = "-user-sub-example-";

    const result = secureStoreKeyFromUserSub(inputSub);

    expect(result).toBe(expectedOutput);
  });
});
