import * as Device from "expo-device";
import { Platform } from "react-native";

/**
 * Returns the backend IP address based on the platform and device.
 * Uses a specific IP for Android Emulator and defaults to localhost for other cases.
 */
export function getBackendIp() {
  if (Platform.OS === "android" && !Device.isDevice) return "10.0.2.2";
  return process.env.EXPO_PUBLIC_BACKEND_IP ?? "localhost";
}

/**
 * Returns the Indy IP address, falling back to the backend IP.
 */
export function getIndyIp() {
  return process.env.EXPO_PUBLIC_INDY_IP ?? getBackendIp();
}
