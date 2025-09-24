import apiJava from "../../../../services/apiJava";

export type FuncionarioPayload = {
  nome: string;
  telefone: string;
  cargo: "OPERACIONAL" | "ADMINISTRATIVO" | "TEMPORARIO";
};

export type FuncionarioResponse = {
  id: string;
  nome: string;
  telefone: string;
  magicLinkUrl?: string; // só vem no POST
  cargo: "OPERACIONAL" | "ADMINISTRATIVO" | "TEMPORARIO";
  status?: "ATIVO" | "SUSPENSO" | "REMOVIDO"; // só vem no GET
};

export async function cadastrarFuncionario(
  data: FuncionarioPayload
): Promise<FuncionarioResponse> {
  const res = await apiJava.post<FuncionarioResponse>("/funcionarios", data);
  return res.data;
}

export async function listarFuncionarios(): Promise<FuncionarioResponse[]> {
  const res = await apiJava.get<FuncionarioResponse[]>("/funcionarios");
  return res.data;
}
