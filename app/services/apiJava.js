import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Configure o axios com a base da sua API
const API = axios.create({
  baseURL: "http://localhost:8080",
});

// Interceptor para incluir o token no header Authorization
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
