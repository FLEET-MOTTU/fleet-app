import apiJava from "../../../../services/apiJava";

const PATEO_ID = "ef0cddcb-7d83-4dd4-bf3d-b73d68af2b37";

export type ZonaRequest = { nome: string; coordenadasWKT: string };
export type ZonaResponse = { id: string; nome: string; coordenadasWKT: string };
export type PateoDetailResponse = {
  id: string;
  nome: string;
  plantaBaixaUrl: string; // ex: "/images/plantas/planta-pateo-teste.png"
  plantaLargura: number; // em px da imagem original no backend
  plantaAltura: number; // em px da imagem original no backend
  zonas: ZonaResponse[];
};

/** Monta URL absoluta removendo "/api" do baseURL (asset estático não pede auth) */
export function buildAssetUrl(path: string) {
  let base = apiJava.defaults.baseURL || "";
  base = base.replace(/\/$/, "").replace(/\/api$/, "");
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

export async function atualizarZona(
  zonaId: string,
  payload: ZonaRequest
): Promise<ZonaResponse> {
  const { data } = await apiJava.put(
    `/pateos/${PATEO_ID}/zonas/${zonaId}`,
    payload
  );
  return data;
}

export async function deletarZona(zonaId: string): Promise<void> {
  await apiJava.delete(`/pateos/${PATEO_ID}/zonas/${zonaId}`);
}
