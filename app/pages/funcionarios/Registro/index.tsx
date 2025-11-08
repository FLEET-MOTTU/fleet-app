// app/Funcionario/RegistroMoto/index.tsx
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AppHeader from "../../../components/AppHeader";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";

// mock services e tipos
import { criarMoto } from "../../../services/motoMockService";
import type { TipoModeloMoto, TipoStatusMoto } from "../../../services/mockDb";

import dayjs from "dayjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";

// -------------------- UI helpers --------------------
const estadosUI: { label: string; value: TipoStatusMoto }[] = [
  { label: "Pendência", value: "PendenteColeta" },
  { label: "Reparos simples", value: "EmReparosSimples" },
  { label: "Danos graves", value: "EmReparosComplexos" },
  { label: "Motor defeituoso", value: "ManutencaoInternaEmAndamento" },
  { label: "Agendada manutenção", value: "AgendadaParaManutencaoExterna" },
  { label: "Pronta p/ aluguel", value: "ProntaParaAluguel" },
  { label: "Sem placa", value: "SemPlacaEmColeta" },
];

const modelosUI: { label: string; value: TipoModeloMoto }[] = [
  { label: "Mottu sport", value: "ModeloSport100" },
  { label: "Mottu-e", value: "ModeloUrbana125" },
  { label: "Trilha 150", value: "ModeloTrilha150" },
];

// Zonas mock (ids fixos do mockDb)
const ZONAS = {
  A: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", // Vistoria
  B: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", // Reparos Simples
  C: "cccccccc-cccc-cccc-cccc-cccccccccccc", // Complexos
  D: "dddddddd-dddd-dddd-dddd-dddddddddddd", // Prontas
} as const;

function sugerirZonaPorStatus(status: TipoStatusMoto) {
  switch (status) {
    case "EmReparosSimples":
      return { id: ZONAS.B, nome: "ZONA B — Reparos Simples" };
    case "EmReparosComplexos":
      return { id: ZONAS.C, nome: "ZONA C — Complexos" };
    case "ProntaParaAluguel":
      return { id: ZONAS.D, nome: "ZONA D — Prontas" };
    default:
      return { id: ZONAS.A, nome: "ZONA A — Vistoria" };
  }
}

function genTagFallback() {
  // fallback simples para quando não vier tag por rota
  const rnd = Math.random().toString(16).slice(2, 8).toUpperCase();
  return `TAG_MOTTU_${rnd}`;
}

function normalizarPlaca(p: string) {
  // mantém só letras/números e limita em 8 chars
  return p
    .replace(/[^A-Za-z0-9-]/g, "")
    .toUpperCase()
    .slice(0, 8);
}

// -------------------- Componente --------------------
export default function RegistroMoto() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const tagCodigoParam: string | undefined = route.params?.tagCodigo;

  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState<TipoModeloMoto>("ModeloUrbana125");
  const [status, setStatus] = useState<TipoStatusMoto>("PendenteColeta");
  const [openEstado, setOpenEstado] = useState(false);
  const [openModelo, setOpenModelo] = useState(false);
  const [saving, setSaving] = useState(false);

  async function salvarMoto() {
    try {
      if (saving) return;
      const placaNorm = normalizarPlaca(placa);

      if (!placaNorm && status !== "SemPlacaEmColeta") {
        Alert.alert("Placa", "Informe a placa (ou selecione 'Sem placa').");
        return;
      }

      setSaving(true);

      // id do funcionário salvo no “login mock”
      const funcionarioId =
        (await AsyncStorage.getItem("@mock.funcionario.id")) ?? null;

      // tag: usa a recebida via deep link/scan ou gera uma de fallback
      const tagCodigo = tagCodigoParam || genTagFallback();

      // cria no mock
      const motoCriada = await criarMoto({
        placa: status === "SemPlacaEmColeta" ? "" : placa.trim().toUpperCase(),
        modelo,
        statusMoto: status,
        codigoUnicoTagParaNovaTag: tagCodigo, // <- ok, isso é do INPUT
        dataRecolhimento: dayjs().toISOString(),
        funcionarioRecolhimentoId: funcionarioId,
      });

      // sugestão local de zona (mock)
      const z = sugerirZonaPorStatus(status);

      // navega para “Zona destinada”
      navigation.replace("ZonaDestinada", {
        zonaId: z.id,
        zonaNome: z.nome,
        placa: motoCriada.placa,
        modeloLabel:
          modelosUI.find((m) => m.value === modelo)?.label ??
          (modelo as string),
      });
    } catch (e: any) {
      console.log("[REGISTRO][ERRO]", e?.message);
      Alert.alert("Erro", e?.message ?? "Falha ao registrar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaWrapper>
      <AppHeader title="Registro" showBack />
      <View className="flex-1 mt-2 px-4">
        <Text className="text-darkBlue dark:text-white mb-2">
          Tag detectada:{" "}
          <Text className="font-bold">
            {tagCodigoParam ?? "(será gerada automaticamente)"}
          </Text>
        </Text>

        <TextInput
          placeholder="Placa"
          placeholderTextColor="#9CA3AF"
          value={placa}
          onChangeText={(t) => setPlaca(normalizarPlaca(t))}
          autoCapitalize="characters"
          maxLength={8}
          keyboardType="default"
          className="border rounded-xl px-4 py-3 mb-4 text-black dark:text-white dark:bg-gray-800"
        />

        {/* Modelo */}
        <View style={{ zIndex: 20 }}>
          <DropDownPicker
            open={openModelo}
            value={modelo}
            items={modelosUI}
            setOpen={setOpenModelo}
            // Tipagem correta: DropDownPicker usa callback que recebe o valor atual (any)
            setValue={(cb) =>
              setModelo((old) => cb(old as unknown as string) as TipoModeloMoto)
            }
            placeholder="Modelo"
            style={{ borderRadius: 12, marginBottom: 12 }}
            placeholderStyle={{ color: "#9CA3AF" }}
            textStyle={{ color: "#111827" }}
            listMode="SCROLLVIEW"
          />
        </View>

        {/* Estado */}
        <View style={{ zIndex: 10 }}>
          <DropDownPicker
            open={openEstado}
            value={status}
            items={estadosUI}
            setOpen={setOpenEstado}
            setValue={(cb) =>
              setStatus((old) => cb(old as unknown as string) as TipoStatusMoto)
            }
            placeholder="Estado da moto"
            style={{ borderRadius: 12 }}
            placeholderStyle={{ color: "#9CA3AF" }}
            textStyle={{ color: "#111827" }}
            listMode="SCROLLVIEW"
          />
        </View>

        <TouchableOpacity
          onPress={salvarMoto}
          disabled={saving}
          className={`bg-[#130F26] py-4 rounded-xl mt-6 ${
            saving ? "opacity-60" : ""
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {saving ? "Salvando..." : "Salvar e sugerir zona"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
}
