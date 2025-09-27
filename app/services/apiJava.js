import { API_JAVA_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const apiJava = axios.create({
  baseURL: API_JAVA_URL,
});

apiJava.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token && token !== "null" && token !== "undefined") {
    // só manda o Bearer se não for login
    if (!config.url?.includes("/auth/login")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default apiJava;
