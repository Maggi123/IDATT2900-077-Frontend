import * as Device from "expo-device";
import { Platform } from "react-native";

export function getBackendIp() {
  if (Platform.OS === "android" && !Device.isDevice) return "10.0.2.2";
  return process.env.EXPO_PUBLIC_BACKEND_IP ?? "localhost";
}

export function getIndyIp() {
  return process.env.EXPO_PUBLIC_INDY_IP ?? getBackendIp();
}
