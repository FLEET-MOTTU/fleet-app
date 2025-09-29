import apiJava from "../../../../services/apiJava";

export type FuncionarioPayload = {
  nome: string;
  telefone: string;
  cargo: "OPERACIONAL" | "ADMINISTRATIVO" | "TEMPORARIO";
  status?: "ATIVO" | "SUSPENSO" | "REMOVIDO";
};

export type FuncionarioResponse = {
  id: string;
  nome: string;
  telefone: string;
  magicLinkUrl?: string; // só vem no POST
  cargo: "OPERACIONAL" | "ADMINISTRATIVO" | "TEMPORARIO";
  status?: "ATIVO" | "SUSPENSO" | "REMOVIDO"; // só vem no GET
};

export async function listarFuncionarios(): Promise<FuncionarioResponse[]> {
  const { data } = await apiJava.get("/funcionarios");
  return data;
}

export async function cadastrarFuncionario(payload: FuncionarioPayload) {
  const { data } = await apiJava.post("/funcionarios", payload);
  return data;
}

export async function atualizarFuncionario(
  id: string,
  payload: FuncionarioPayload
) {
  const { data } = await apiJava.put(`/funcionarios/${id}`, payload);
  return data;
}

export async function deletarFuncionario(id: string) {
  await apiJava.delete(`/funcionarios/${id}`);
}
