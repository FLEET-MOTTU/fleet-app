import apiJava from "../../../../services/apiJava";

const PATEO_ID = "ef0cddcb-7d83-4dd4-bf3d-b73d68af2b37";

export type ZonaRequest = { nome: string; coordenadasWKT: string };
export type ZonaResponse = { id: string; nome: string; coordenadasWKT: string };
export type PateoDetailResponse = {
  id: string;
  nome: string;
  plantaBaixaUrl: string;
  plantaLargura: number;
  plantaAltura: number;
  zonas: ZonaResponse[];
};

export function buildAssetUrl(path: string) {
  let base = apiJava.defaults.baseURL || "";

  // remove barra no final
  base = base.replace(/\/$/, "");
  // remove "/api" se existir
  base = base.replace(/\/api$/, "");

  return `${base}${path}`;
}

export async function getPateoDetalhes(): Promise<PateoDetailResponse> {
  const { data } = await apiJava.get(`/pateos/${PATEO_ID}`);
  return data;
}

export async function criarZona(payload: ZonaRequest): Promise<ZonaResponse> {
  const { data } = await apiJava.post(`/pateos/${PATEO_ID}/zonas`, payload);
  return data;
}

export async function deletarZona(zonaId: string): Promise<void> {
  await apiJava.delete(`/pateos/${PATEO_ID}/zonas/${zonaId}`);
}
