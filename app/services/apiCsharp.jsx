import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CS_URL, USE_FUNC_TOKEN, FUNC_TOKEN } from "@env";

const apiCS = axios.create({
  baseURL: API_CS_URL,
});

// injeta Bearer no header (evita /auth caso exista no C# no futuro)
apiCS.interceptors.request.use(async (config) => {
  let token = await AsyncStorage.getItem("token"); // mesmo nome usado no fluxo do funcionário

  if (USE_FUNC_TOKEN === "true" && FUNC_TOKEN) {
    token = FUNC_TOKEN;
  }

  if (token && token !== "null" && token !== "undefined") {
    if (!config.url?.includes("/auth/login")) {
      config.headers = {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${token}`,
      };
    }
  }

  return config;
});

export default apiCS;
