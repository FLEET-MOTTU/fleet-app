import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_CSHARP_URL } from "@env";

// const apiCSharp = axios.create({
//   baseURL: "http://10.0.2.2:8080/api",
// });

// apiCSharp.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default apiCSharp;

const apiCSharp = axios.create({
  baseURL: API_CSHARP_URL,
});

apiCSharp.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiCSharp;
