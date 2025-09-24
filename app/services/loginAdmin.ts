import apiJava from "./apiJava";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function loginAdmin(email: string, senha: string) {
  const res = await apiJava.post("/auth/login", { email, senha });
  const token = res.data.token;
  await AsyncStorage.setItem("token", token);
  return token;
}
