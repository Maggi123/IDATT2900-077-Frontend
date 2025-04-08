import { Platform } from "react-native";

import { getBackendIp, getIndyIp } from "@/util/NetworkUtil";

const originalEnv = process.env;

describe("IP Helper Functions", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.EXPO_PUBLIC_BACKEND_IP;
    delete process.env.EXPO_PUBLIC_INDY_IP;

    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("getBackendIp - isDevice: true, Platform.OS: ios", () => {
    beforeEach(() => {
      jest.mock("expo-device", () => ({
        isDevice: true,
      }));
      Platform.OS = "ios";
    });

    test("returns localhost by default", () => {
      expect(getBackendIp()).toBe("localhost");
    });
  });

  describe("getBackendIp - isDevice: false", () => {
    beforeEach(() => {
      jest.mock("expo-device", () => ({
        isDevice: false,
      }));
      Platform.OS = "android";
    });

    test("returns 10.0.2.2 for Android emulator", () => {
      expect(getBackendIp()).toBe("10.0.2.2");
    });
  });

  describe("getIndyIp", () => {
    beforeEach(() => {
      jest.mock("expo-device", () => ({
        isDevice: false,
      }));
      Platform.OS = "android";
    });
    test("returns backend IP when env var not set", () => {
      expect(getIndyIp()).toBe("10.0.2.2");
    });
  });
});
