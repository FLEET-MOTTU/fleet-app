// app/Funcionario/RegistroMoto/services/motoService.ts
import apiCs from "../../../../services/apiCsharp"; // pode ser real ou mock baseado no .env

// ===== Tipos vindos do OpenAPI (recorte do que você usa) =====
export type TipoModeloMoto =
  | "ModeloSport100"
  | "ModeloUrbana125"
  | "ModeloTrilha150";

export type TipoStatusMoto =
  | "PendenteColeta"
  | "SemPlacaEmColeta"
  | "MinhaMottuEmColeta"
  | "EmTransitoComFuncionario"
  | "AguardandoVistoria"
  | "EmReparosSimples"
  | "EmReparosComplexos"
  | "AgendadaParaManutencaoExterna"
  | "ManutencaoInternaEmAndamento"
  | "ManutencaoConcluida"
  | "ProntaParaAluguel"
  | "Alugada"
  | "Baixada";

// ===== Modelos mínimos usados nas telas =====
export type MotoViewDto = {
  id: string;
  placa?: string | null;
  modelo?: string | null;
  statusMoto?: string | null;
  dataCriacaoRegistro?: string;
  dataRecolhimento?: string | null;
  funcionarioRecolhimentoId?: string | null;
  dataEntradaPatio?: string | null;
  ultimoBeaconConhecidoId?: string | null;
  ultimaVezVistoEmPatio?: string | null;
  tag?: {
    id: string;
    codigoUnicoTag?: string | null;
    nivelBateria: number;
  } | null;
  links?: Array<any> | null;
};

export type PateoDetailDto = {
  id: string;
  nome?: string | null;
  plantaBaixaUrl?: string | null;
  plantaLargura?: number | null;
  plantaAltura?: number | null;
  zonas?: Array<{
    id: string;
    nome?: string | null;
    coordenadasWKT?: string | null;
  }> | null;
};

export type LoteClassificacaoRespostaDto = {
  pateoId: string;
  sugestoes: Array<{
    placa?: string | null;
    tagCodigo?: string | null;
    statusMoto?: string | null;
    zonaIdSugerida?: string | null;
    zonaNomeSugerida?: string | null;
    justificativa?: string | null;
    links?: Array<any> | null;
  }>;
};

// ===== Tipos de requisição =====
type CriarMotoReq = {
  placa?: string;
  modelo: TipoModeloMoto;
  statusMoto: TipoStatusMoto;
  codigoUnicoTagParaNovaTag: string;
  funcionarioRecolhimentoId?: string | null;
  dataRecolhimento?: string | null;
};

type ClassificarItem = {
  placa?: string | null;
  tagCodigo?: string | null;
  statusMoto: TipoStatusMoto; // << importante: enum, não string
};

// ===== “Axios-like” para funcionar com mock e axios real =====
type AxiosLike = {
  get<T = any>(url: string, config?: any): Promise<{ data: T }>;
  post<T = any>(url: string, body?: any, config?: any): Promise<{ data: T }>;
};

// Cast seguro do client injetado
const http = apiCs as unknown as AxiosLike;

// ================== Funções ==================

export async function criarMoto(body: CriarMotoReq): Promise<MotoViewDto> {
  console.log("[API C#] POST /motos", body);
  const { data } = await http.post<MotoViewDto>("/motos", body);
  console.log("[API C#] ✅ OK /motos ->", data?.id);
  return data;
}

export async function meuPateo(): Promise<PateoDetailDto> {
  console.log("[API C#] GET /pateo/meu-pateo");
  const { data } = await http.get<PateoDetailDto>("/pateo/meu-pateo");
  console.log("[API C#] ✅ OK /pateo/meu-pateo ->", data?.id);
  return data;
}

export async function classificarLote(
  pateoId: string,
  itens: ClassificarItem[]
): Promise<LoteClassificacaoRespostaDto> {
  console.log("[API C#] POST /patios/{id}/classificar-motos", pateoId, itens);
  const { data } = await http.post<LoteClassificacaoRespostaDto>(
    `/patios/${pateoId}/classificar-motos`,
    { pateoId, itens }
  );
  console.log("[API C#] ✅ OK classificar ->", data?.sugestoes?.length);
  return data;
}
