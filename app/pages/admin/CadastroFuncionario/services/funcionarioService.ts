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
  // React Native NÃO envia Blob corretamente para multipart (diferente do browser)
  form.append("dados", JSON.stringify(payload) as any);
}

/** POST multipart/form-data com 'dados' e 'foto' */
export async function cadastrarFuncionario(
  payload: FuncionarioPayload,
  foto?: { uri: string; type?: string; fileName?: string }
): Promise<FuncionarioResponse> {
  const form = new FormData();

  // 👇 envia o JSON puro, sem Blob, sem base64
  form.append("dados", JSON.stringify(payload) as any);

  if (foto) {
    form.append("foto", {
      uri: foto.uri,
      type: foto.type || "image/jpeg",
      name: foto.fileName || "foto.jpg",
    } as any);
  } else {
    // o backend espera sempre o campo `foto`
    form.append("foto", "" as any);
  }

  try {
    const { data } = await apiJava.post("/funcionarios", form, {
      headers: { "Content-Type": "multipart/form-data" },
      transformRequest: (data) => data, // evita transformações do axios
    });
    return data;
  } catch (error: any) {
    console.log(
      "❌ Erro no cadastro:",
      error.response?.status,
      error.response?.data
    );
    throw error;
  }
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
