// app/services/apiCSharpMock.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

// ===== Tipos utilitários iguais aos do axios-like =====
type AxiosLike = {
  get<T = any>(url: string, config?: any): Promise<{ data: T }>;
  post<T = any>(url: string, body?: any, config?: any): Promise<{ data: T }>;
};

// ===== Modelos próximos do OpenAPI =====
type Moto = {
  id: string;
  placa?: string | null;
  modelo?: string | null;
  statusMoto?: string | null;
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
  links?: Array<any> | null;
};

type Zona = { id: string; nome: string };
type Patio = { id: string; nome: string; zonas: Zona[] };

const DB_KEY = "@mock-cs-db";

// “Banco” em memória
let db: {
  motos: Moto[];
  pateo: Patio;
} = {
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

async function load() {
  try {
    const raw = await AsyncStorage.getItem(DB_KEY);
    if (raw) db = JSON.parse(raw);
  } catch {}
}
async function save() {
  try {
    await AsyncStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {}
}
load();

// ✅ corrige a assinatura do setTimeout para evitar TS2345
const delay = (ms = 250) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

const uuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

// Roteador simples
function match(url: string) {
  const path = url.split("?")[0];

  if (path === "/motos") return { key: "motos" };
  if (path === "/pateo/meu-pateo") return { key: "meu-pateo" };

  const patios = path.match(/^\/patios\/([^/]+)\/classificar-motos$/);
  if (patios) return { key: "classificar", pateoId: patios[1] };

  return { key: "404" };
}

// (opcional) exigir token para simular 401
function ensureAuth(config?: any) {
  const auth = config?.headers?.Authorization ?? "";
  if (!auth) {
    const err: any = new Error("Unauthorized");
    err.response = { status: 401, data: { title: "Unauthorized (mock)" } };
    throw err;
  }
}

const apiCSharpMock: AxiosLike = {
  async get<T = any>(url: string, config?: any): Promise<{ data: T }> {
    await delay();
    // ensureAuth(config); // habilite se quiser exigir auth no mock
    const m = match(url);

    let payload: any;

    if (m.key === "motos") {
      payload = {
        totalItems: db.motos.length,
        pageSize: db.motos.length,
        pageNumber: 1,
        items: db.motos,
        hasPreviousPage: false,
        hasNextPage: false,
      };
      return { data: payload as T };
    }

    if (m.key === "meu-pateo") {
      payload = {
        id: db.pateo.id,
        nome: db.pateo.nome,
        plantaBaixaUrl: null,
        plantaLargura: null,
        plantaAltura: null,
        zonas: db.pateo.zonas.map((z) => ({
          id: z.id,
          nome: z.nome,
          coordenadasWKT: null,
        })),
      };
      return { data: payload as T };
    }

    payload = { title: "Not Found (mock)" };
    return { data: payload as T };
  },

  async post<T = any>(
    url: string,
    body?: any,
    config?: any
  ): Promise<{ data: T }> {
    await delay();
    // ensureAuth(config); // habilite se quiser exigir auth no mock
    const m = match(url);

    let payload: any;

    if (m.key === "motos") {
      const now = new Date().toISOString();
      const moto: Moto = {
        id: uuid(),
        placa: body?.placa ?? null,
        modelo: body?.modelo ?? "ModeloUrbana125",
        statusMoto: body?.statusMoto ?? "PendenteColeta",
        dataCriacaoRegistro: now,
        dataRecolhimento: body?.dataRecolhimento ?? now,
        funcionarioRecolhimentoId: null,
        dataEntradaPatio: null,
        ultimoBeaconConhecidoId: null,
        ultimaVezVistoEmPatio: null,
        tag: {
          id: uuid(),
          codigoUnicoTag: body?.codigoUnicoTagParaNovaTag ?? null,
          nivelBateria: 87,
        },
        links: [],
      };

      db.motos.unshift(moto);
      await save();

      payload = moto;
      return { data: payload as T };
    }

    if (m.key === "classificar") {
      const map: Record<string, string> = {
        EmReparosSimples: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        EmReparosComplexos: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        ProntaParaAluguel: "dddddddd-dddd-dddd-dddd-dddddddddddd",
      };

      const itens = Array.isArray(body?.itens) ? body.itens : [];
      const sugestoes = itens.map((it: any) => {
        const zonaId =
          map[it?.statusMoto] ?? "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
        const zona = db.pateo.zonas.find((z) => z.id === zonaId);
        return {
          placa: it?.placa ?? null,
          tagCodigo: it?.tagCodigo ?? null,
          statusMoto: it?.statusMoto ?? null,
          zonaIdSugerida: zona?.id ?? null,
          zonaNomeSugerida: zona?.nome ?? null,
          justificativa: "Regra mockada",
          links: [],
        };
      });

      payload = { pateoId: m.pateoId, sugestoes };
      return { data: payload as T };
    }

    payload = { title: "Not Found (mock)" };
    return { data: payload as T };
  },
};

export default apiCSharpMock;
