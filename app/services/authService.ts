import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

interface LoginData {
  login: string;
  senha: string;
}

export const loginAdm = async ({ login, senha }: LoginData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login-adm`, {
    login,
    senha,
  });
  return response.data;
};
