import { jwtDecode } from "jwt-decode";

type FuncionarioTokenPayload = {
  idFuncionario: string;
  nome: string;
  pateoId: string;
  exp: number;
};

export function decodeFuncionarioToken(token: string) {
  try {
    const payload = jwtDecode<FuncionarioTokenPayload>(token);
    return payload;
  } catch (err) {
    console.error("Erro ao decodificar token:", err);
    return null;
  }
}
