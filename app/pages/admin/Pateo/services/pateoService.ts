import apiJava from "../../../../services/apiJava";

export interface ZonaResponse {
  id: string;
  nome: string;
  coordenadasWKT: string;
}

export interface PateoDetailResponse {
  id: string;
  nome: string;
  plantaBaixaUrl: string;
  plantaLargura: number;
  plantaAltura: number;
  zonas: ZonaResponse[];
}

export const getPateoDetalhes = async (
  pateoId: string
): Promise<PateoDetailResponse> => {
  const { data } = await apiJava.get(`/pateos/${pateoId}`);
  return data;
};
