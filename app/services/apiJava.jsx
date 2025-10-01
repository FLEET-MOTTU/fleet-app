import { API_JAVA_URL, USE_ADMIN_TOKEN, ADMIN_TOKEN } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const apiJava = axios.create({
  baseURL: API_JAVA_URL,
});

apiJava.interceptors.request.use(async (config) => {
  let token = await AsyncStorage.getItem("token");

  // se ativar o modo admin no .env, usa o token fixo
  if (USE_ADMIN_TOKEN === "true" && ADMIN_TOKEN) {
    token = ADMIN_TOKEN;
  }

  if (token && token !== "null" && token !== "undefined") {
    if (!config.url?.includes("/auth/login")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default apiJava;
