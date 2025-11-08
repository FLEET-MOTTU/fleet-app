// app/services/apiCsharp.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CS_URL, USE_CS_MOCK, FUNC_TOKEN } from "@env";

let client: any;

if (USE_CS_MOCK === "true") {
  // usa o mock (atenção ao nome do arquivo com C maiúsculo!)
  client = require("./apiCSharpMock").default;
  console.log("[CS] ▶️ usando MOCK client");
} else {
  // usa o axios real
  const base = (API_CS_URL || "").replace(/\/+$/, ""); // sem barra final
  client = axios.create({
    baseURL: base, // ex.: http://.../api/v1
    timeout: 15000,
  });

  console.log("[CS] ▶️ usando REAL client", base);

  // injeta Authorization
  client.interceptors.request.use(async (config: any) => {
    let token = await AsyncStorage.getItem("token");

    if (FUNC_TOKEN) {
      console.warn("[CS] usando FUNC_TOKEN do .env");
      token = FUNC_TOKEN;
    }

    if (token && token !== "null" && token !== "undefined") {
      config.headers = {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${token}`,
      };
    }

    const full = `${config.baseURL ?? ""}${config.url ?? ""}`;
    console.log(
      "[CS][REQ]",
      full,
      config.headers?.Authorization ? "AUTH:Bearer" : "AUTH:absent"
    );
    return config;
  });

  client.interceptors.response.use(
    (r: any) => r,
    (e: any) => {
      const url = `${e?.config?.baseURL ?? ""}${e?.config?.url ?? ""}`;
      console.log(
        "[CS][ERR]",
        e?.response?.status ?? "no-status",
        url,
        e?.message
      );
      return Promise.reject(e);
    }
  );
}

export default client;
