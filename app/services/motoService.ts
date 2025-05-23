import apiCSharp from "./apiCSharp";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export async function cadastrarMoto({ placa, modelo, statusMoto }) {
  return apiCSharp.post("/motos", {
    placa: statusMoto === "Sem Placa" ? null : placa,
    modelo,
    statusMoto,
    codigoUnicoTagParaNovaTag: uuidv4(),
  });
}

export async function listarMotos() {
  return apiCSharp.get("/motos");
}
