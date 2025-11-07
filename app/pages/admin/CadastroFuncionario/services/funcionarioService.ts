import apiJava from "../../../../services/apiJava";

export type CargoFuncionario = "OPERACIONAL" | "ADMINISTRATIVO" | "TEMPORARIO";
export type StatusFuncionario = "ATIVO" | "SUSPENSO" | "REMOVIDO";

export interface FuncionarioPayload {
  nome: string;
  telefone: string;
  cargo: CargoFuncionario;
  status?: StatusFuncionario;
  email?: string;
  fotoUrl?: string; // ignorado se enviar 'foto' no multipart
}

export interface FuncionarioResponse {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  cargo: CargoFuncionario;
  status?: StatusFuncionario; // pode vir omitido no GET
  fotoUrl?: string;
  magicLinkUrl?: string;
}

/** GET com filtros opcionais (server-side) */
export async function listarFuncionarios(
  status?: StatusFuncionario,
  cargo?: CargoFuncionario
): Promise<FuncionarioResponse[]> {
  const params: any = {};
  if (status) params.status = status;
  if (cargo) params.cargo = cargo;

  const { data } = await apiJava.get("/funcionarios", { params });
  return data || [];
}

/** Helper: adiciona @RequestPart("dados") como JSON real; fallback para string se necessário */
function appendDados(form: FormData, payload: FuncionarioPayload) {
  try {
    // @ts-ignore Blob existe no RN/Expo moderno
    const blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });
    (form as any).append("dados", blob, "dados.json");
  } catch {
    // Fallback se Blob não existir nesse runtime
    // @ts-ignore RN aceita string como 'any'
    form.append("dados", JSON.stringify(payload));
  }
}

/** POST multipart/form-data com 'dados' e 'foto' */
export async function cadastrarFuncionario(
  payload: FuncionarioPayload,
  foto?: { uri: string; type?: string; fileName?: string }
): Promise<FuncionarioResponse> {
  const form = new FormData();
  appendDados(form, payload);

  if (foto) {
    form.append("foto", {
      uri: foto.uri,
      type: foto.type || "image/jpeg",
      name: foto.fileName || "foto.jpg",
    } as any);
  }

  const { data } = await apiJava.post("/funcionarios", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/** PUT: não force fallback de status pra não sobrescrever sem querer */
export async function atualizarFuncionario(
  id: string,
  payload: Partial<FuncionarioPayload>
): Promise<FuncionarioResponse> {
  const { data } = await apiJava.put(`/funcionarios/${id}`, payload);
  return data;
}

export async function deletarFuncionario(id: string): Promise<void> {
  await apiJava.delete(`/funcionarios/${id}`);
}

export async function reativarFuncionario(id: string): Promise<void> {
  await apiJava.post(`/funcionarios/${id}/reativar`);
}

export async function regenerarMagicLink(
  id: string
): Promise<{ magicLinkUrl: string }> {
  const { data } = await apiJava.post(`/funcionarios/${id}/regenerar-link`);
  return data;
}

/** Upload/atualização da foto após criar/editar */
export async function atualizarFotoFuncionario(
  id: string,
  foto: { uri: string; type?: string; fileName?: string }
): Promise<FuncionarioResponse> {
  const formData = new FormData();
  formData.append("foto", {
    uri: foto.uri,
    type: foto.type || "image/jpeg",
    name: foto.fileName || "foto.jpg",
  } as any);

  const { data } = await apiJava.post(`/funcionarios/${id}/photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
