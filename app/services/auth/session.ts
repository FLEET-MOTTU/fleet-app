import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export type AdminTokenPayload = {
  sub: string;
  email?: string;
  nome?: string;
  pateoId?: string;
  idUsuario?: string;
  roles?: string[];
  exp: number;
};

export async function getAccessToken(): Promise<string | null> {
  const token = await AsyncStorage.getItem("token");
  return token && token !== "null" && token !== "undefined" ? token : null;
}

export async function getAdminFromToken() {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const payload = jwtDecode<AdminTokenPayload>(token);

    const email = payload.email ?? payload.sub ?? "";
    const nome = payload.nome ?? "";

    return {
      nome,
      email,
      pateoId: payload.pateoId ?? null,
      id: payload.idUsuario ?? null,
      roles: payload.roles ?? [],
      exp: payload.exp,
    };
  } catch (e) {
    return null;
  }
}
