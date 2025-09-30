import apiJava from "../../../../services/apiJava";

// Buscar detalhes do pátio (já retorna planta baixa + zonas)
export async function buscarPateoDetalhes(pateoId: string) {
  const res = await apiJava.get(`/pateos/${pateoId}`);
  return res.data;
}

// Criar nova zona
export async function criarZona(pateoId: string, payload: any) {
  const res = await apiJava.post(`/pateos/${pateoId}/zonas`, payload);
  return res.data;
}

// Atualizar zona existente
export async function atualizarZona(
  pateoId: string,
  zonaId: string,
  payload: any
) {
  const res = await apiJava.put(`/pateos/${pateoId}/zonas/${zonaId}`, payload);
  return res.data;
}

// Deletar zona
export async function deletarZona(pateoId: string, zonaId: string) {
  await apiJava.delete(`/pateos/${pateoId}/zonas/${zonaId}`);
}
