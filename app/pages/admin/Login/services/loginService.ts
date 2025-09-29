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

    return response.data;
  },
};
export default LoginService;
