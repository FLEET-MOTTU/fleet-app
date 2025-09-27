import apiJava from "../../../../services/apiJava";

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

const LoginService = {
  loginAdm: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await apiJava.post<LoginResponse>("/auth/login", payload);
    console.log("Tentando login em:", apiJava.defaults.baseURL + "/auth/login");
    console.log("Payload:", payload);
    return response.data;
  },
};
export default LoginService;
