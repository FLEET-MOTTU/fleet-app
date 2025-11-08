// app/services/motoMockService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Moto, TipoModeloMoto, TipoStatusMoto } from "./mockDb";

export type { Moto } from "./mockDb";

const DB_KEY = "@mock-db-motos";

export type CreateMotoInput = {
  placa?: string;
  modelo: TipoModeloMoto;
  statusMoto: TipoStatusMoto;
  codigoUnicoTagParaNovaTag: string; // <- só no INPUT
  funcionarioRecolhimentoId?: string | null;
  dataRecolhimento?: string | null;
};

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function load(): Promise<Moto[]> {
  const raw = await AsyncStorage.getItem(DB_KEY);
  return raw ? (JSON.parse(raw) as Moto[]) : [];
}

async function save(motos: Moto[]) {
  await AsyncStorage.setItem(DB_KEY, JSON.stringify(motos));
}

export async function criarMoto(input: CreateMotoInput): Promise<Moto> {
  const motos = await load();
  const now = new Date().toISOString();

  const nova: Moto = {
    id: uuid(),
    placa: input.placa && input.placa.trim() !== "" ? input.placa : null,
    modelo: input.modelo,
    statusMoto: input.statusMoto,
    dataCriacaoRegistro: now,
    dataRecolhimento: input.dataRecolhimento ?? now,
    funcionarioRecolhimentoId: input.funcionarioRecolhimentoId ?? null,
    dataEntradaPatio: null,
    ultimoBeaconConhecidoId: null,
    ultimaVezVistoEmPatio: null,
    tag: {
      id: uuid(),
      codigoUnicoTag: input.codigoUnicoTagParaNovaTag, // <- mapeia aqui
      nivelBateria: 85,
    },
    links: [],
  };

  motos.unshift(nova);
  await save(motos);
  return nova;
}

export async function listarMotos(): Promise<Moto[]> {
  return load();
}

export async function listarMotosPorFuncionario(
  funcionarioId: string
): Promise<Moto[]> {
  const motos = await load();
  return motos.filter((m) => m.funcionarioRecolhimentoId === funcionarioId);
}
