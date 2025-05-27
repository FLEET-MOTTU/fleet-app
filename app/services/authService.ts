import API from "./apiJava";

export const loginAdm = async ({ login, senha }) => {
  const response = await API.post("/auth/login-adm", {
    login,
    senha,
  });

  return response.data;
};
