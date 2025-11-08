// app/services/motoService.ts
import apiCSharp from "./apiCsharp";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export type CadastrarMotoParams = {
  placa: string | null;
  modelo: "ModeloSport100" | "ModeloUrbana125" | "ModeloTrilha150";
  statusMoto:
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
};

export async function cadastrarMoto({
  placa,
  modelo,
  statusMoto,
}: CadastrarMotoParams) {
  return apiCSharp.post("/motos", {
    placa,
    modelo,
    statusMoto,
    codigoUnicoTagParaNovaTag: uuidv4(),
  });
}

export async function listarMotos() {
  return apiCSharp.get("/motos");
}
