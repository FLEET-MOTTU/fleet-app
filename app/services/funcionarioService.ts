import apiJava from "./apiJava";

export async function cadastrarFuncionario(data) {
  return apiJava.post("/funcionarios", data);
}

export async function listarFuncionarios() {
  return apiJava.get("/funcionarios");
}
