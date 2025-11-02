import Constants from "expo-constants";
import { DEEPLINK_BASE_URL_DEV, DEEPLINK_BASE_URL_PROD } from "@env";

export function getDeepLinkBaseUrl() {
  const isDev =
    Constants.executionEnvironment === "storeClient" || // Expo Go
    Constants.executionEnvironment === "bare"; // app em dev local

  const base = isDev ? DEEPLINK_BASE_URL_DEV : DEEPLINK_BASE_URL_PROD;

  console.log("🌍 Deep Link Base:", base);
  return base;
}
