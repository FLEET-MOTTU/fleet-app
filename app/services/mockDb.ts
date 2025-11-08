// app/services/mockDb.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export type Moto = {
  id: string;
  placa?: string | null;
  modelo?: TipoModeloMoto | null;
  statusMoto?: TipoStatusMoto | null;
  dataCriacaoRegistro: string;
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
  links?: any[] | null;
};

export type Zona = { id: string; nome: string };
export type Patio = { id: string; nome: string; zonas: Zona[] };

type DB = {
  motos: Moto[];
  pateo: Patio;
};

const DB_KEY = "@fleet-mock-db";

const defaultDB: DB = {
  motos: [],
  pateo: {
    id: "11111111-1111-1111-1111-111111111111",
    nome: "Pátio Mock",
    zonas: [
      { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", nome: "ZONA A — Vistoria" },
      {
        id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        nome: "ZONA B — Reparos Simples",
      },
      {
        id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        nome: "ZONA C — Complexos",
      },
      { id: "dddddddd-dddd-dddd-dddd-dddddddddddd", nome: "ZONA D — Prontas" },
    ],
  },
};

export async function getDB(): Promise<DB> {
  const raw = await AsyncStorage.getItem(DB_KEY);
  if (!raw) return defaultDB;
  try {
    return JSON.parse(raw) as DB;
  } catch {
    return defaultDB;
  }
}

export async function setDB(db: DB): Promise<void> {
  await AsyncStorage.setItem(DB_KEY, JSON.stringify(db));
}

// helpers
export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
