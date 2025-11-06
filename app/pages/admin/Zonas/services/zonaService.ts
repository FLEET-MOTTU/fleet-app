import apiJava from "../../../../services/apiJava";

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

export async function getPateoDetalhes(pateoId: string) {
  const { data } = await apiJava.get(`/pateos/${pateoId}`);
  return data;
}

export async function criarZona(pateoId: string, payload: ZonaRequest) {
  const { data } = await apiJava.post(`/pateos/${pateoId}/zonas`, payload);
  return data;
}

export async function atualizarZona(
  pateoId: string,
  zonaId: string,
  payload: ZonaRequest
) {
  const { data } = await apiJava.put(
    `/pateos/${pateoId}/zonas/${zonaId}`,
    payload
  );
  return data;
}

export async function deletarZona(pateoId: string, zonaId: string) {
  await apiJava.delete(`/pateos/${pateoId}/zonas/${zonaId}`);
}
