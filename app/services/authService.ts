import API from "./apiJava";

// Faz login do administrador
export const loginAdm = async ({ login, senha }) => {
  const response = await API.post("/auth/login-adm", {
    login,
    senha,
  });

  // Espera receber um objeto com { token: "..." }
  return response.data;
};
