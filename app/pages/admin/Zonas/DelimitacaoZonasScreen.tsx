import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
} from "react-native";
import Svg, { Circle, Polygon } from "react-native-svg";
import {
  getPateoDetalhes,
  criarZona,
  deletarZona,
  atualizarZona,
  PateoDetailResponse,
  ZonaResponse,
} from "./services/zonaService";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import { getAdminFromToken } from "../../../services/auth/session";
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../../components/AppHeader";

const screenWidth = Dimensions.get("window").width;
const CANVAS_MARGIN = 40;

const CORES = [
  { label: "Azul", value: "#3B82F6" },
  { label: "Verde", value: "#22C55E" },
  { label: "Vermelho", value: "#EF4444" },
  { label: "Amarelo", value: "#FACC15" },
  { label: "Roxo", value: "#A855F7" },
];

function gerarWKTNormalizado(
  pontos: { x: number; y: number }[],
  plantaW: number,
  plantaH: number
) {
  if (pontos.length < 3) throw new Error("Pelo menos 3 pontos necessários.");
  const coords = pontos.map((p) => {
    const nx = (p.x / plantaW).toFixed(6);
    const ny = (p.y / plantaH).toFixed(6);
    return `${nx} ${ny}`;
  });
  if (coords[0] !== coords[coords.length - 1]) coords.push(coords[0]);
  return `POLYGON ((${coords.join(", ")}))`;
}

export default function DelimitacaoZonasScreen() {
  const { colorScheme } = useColorScheme();
  const [pateoId, setPateoId] = useState<string | null>(null);
  const [pateo, setPateo] = useState<PateoDetailResponse | null>(null);
  const [zonas, setZonas] = useState<(ZonaResponse & { cor?: string })[]>([]);
  const [pontos, setPontos] = useState<{ x: number; y: number }[]>([]);
  const [nomeZona, setNomeZona] = useState("");
  const [corZona, setCorZona] = useState("#3B82F6");
  const [loading, setLoading] = useState(true);
  const [editandoZona, setEditandoZona] = useState<
    (ZonaResponse & { cor?: string }) | null
  >(null);
  const [novoNome, setNovoNome] = useState("");
  const [novaCor, setNovaCor] = useState("#3B82F6");

  const viewWidth = useMemo(() => screenWidth - CANVAS_MARGIN, []);
  const viewHeight = useMemo(() => {
    if (!pateo) return 300;
    const ratio = pateo.plantaAltura / pateo.plantaLargura;
    return Math.round(viewWidth * ratio);
  }, [pateo, viewWidth]);

  async function carregar() {
    try {
      setLoading(true);
      const admin = await getAdminFromToken();

      if (!admin?.pateoId) {
        Alert.alert(
          "Atenção",
          "Administrador sem pátio vinculado. Contate o suporte."
        );
        return;
      }

      setPateoId(admin.pateoId);
      const data = await getPateoDetalhes(admin.pateoId);
      setPateo(data);
      setZonas(
        data.zonas.map((z: any, i: any) => ({
          ...z,
          cor: CORES[i % CORES.length].value,
        }))
      );
    } catch (err) {
      console.error("Erro ao carregar pátio:", err);
      Alert.alert("Erro", "Não foi possível carregar o pátio.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function onPressImage(e: any) {
    const { locationX, locationY } = e.nativeEvent;
    setPontos((prev) => [...prev, { x: locationX, y: locationY }]);
  }

  async function salvar() {
    if (!pateoId) return;
    if (!nomeZona || pontos.length < 3) {
      Alert.alert("Erro", "Informe o nome e desenhe a zona no mapa.");
      return;
    }

    try {
      const wkt = gerarWKTNormalizado(pontos, viewWidth, viewHeight);
      const nova = await criarZona(pateoId, {
        nome: nomeZona,
        coordenadasWKT: wkt,
      });
      setZonas((prev) => [...prev, { ...nova, cor: corZona }]);
      setNomeZona("");
      setPontos([]);
      Alert.alert("Sucesso", "Zona criada com sucesso!");
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err?.response?.data?.message || "Falha ao salvar zona."
      );
    }
  }

  function excluir(id: string) {
    Alert.alert("Excluir", "Deseja remover esta zona?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deletarZona(pateoId!, id);
          setZonas((z) => z.filter((i) => i.id !== id));
        },
      },
    ]);
  }

  function abrirEdicao(z: ZonaResponse & { cor?: string }) {
    setEditandoZona(z);
    setNovoNome(z.nome);
    setNovaCor(z.cor || "#3B82F6");
  }

  async function salvarEdicao() {
    if (!pateoId || !editandoZona) return;
    try {
      const atualizada = await atualizarZona(pateoId, editandoZona.id, {
        nome: novoNome,
        coordenadasWKT: editandoZona.coordenadasWKT,
      });
      setZonas((z) =>
        z.map((i) =>
          i.id === editandoZona.id ? { ...atualizada, cor: novaCor } : i
        )
      );
      setEditandoZona(null);
      Alert.alert("Sucesso", "Zona atualizada!");
    } catch {
      Alert.alert("Erro", "Falha ao atualizar zona.");
    }
  }

  return (
    <SafeAreaWrapper>
      <ScrollView className="flex-1 " showsVerticalScrollIndicator={false}>
        {/* Header */}
        <AppHeader title="Criação de Zonas" showBack={true} />

        {/* Mapa */}
        {loading ? (
          <View className="h-72 justify-center items-center">
            <ActivityIndicator size="large" color="#130F26" />
            <Text className="text-gray-500 dark:text-gray-300 mt-3">
              Carregando planta...
            </Text>
          </View>
        ) : (
          <Pressable onPress={onPressImage}>
            <View
              className={`rounded-2xl mb-6 p-1 shadow-lg ${
                colorScheme === "dark" ? "bg-[#1E1E1E]" : "bg-white"
              }`}
            >
              <ImageBackground
                source={{ uri: pateo?.plantaBaixaUrl }}
                style={{ width: viewWidth, height: viewHeight }}
                resizeMode="contain"
                className="rounded-xl overflow-hidden"
              >
                <Svg height={viewHeight} width={viewWidth}>
                  {zonas.map((zona) => (
                    <Polygon
                      key={zona.id}
                      points={zona.coordenadasWKT
                        .replace("POLYGON ((", "")
                        .replace("))", "")
                        .split(", ")
                        .map((pair: string) => {
                          const [nx, ny]: number[] = pair
                            .split(" ")
                            .map(Number);
                          return `${nx * viewWidth},${ny * viewHeight}`;
                        })
                        .join(" ")}
                      fill={(zona.cor || "#3B82F6") + "33"}
                      stroke={zona.cor || "#3B82F6"}
                      strokeWidth="2"
                    />
                  ))}

                  {pontos.length > 0 && (
                    <>
                      <Polygon
                        points={pontos.map((p) => `${p.x},${p.y}`).join(" ")}
                        fill={corZona + "44"}
                        stroke={corZona}
                        strokeWidth="2"
                      />
                      {pontos.map((p, i) => (
                        <Circle
                          key={i}
                          cx={p.x}
                          cy={p.y}
                          r="4"
                          fill={corZona}
                        />
                      ))}
                    </>
                  )}
                </Svg>
              </ImageBackground>
            </View>
          </Pressable>
        )}

        {/* Formulário */}
        <View
          className={`rounded-2xl p-4 mb-8 ${
            colorScheme === "dark" ? "bg-[#121212]" : "bg-gray-50"
          }`}
        >
          <Text className="text-lg font-bold text-darkBlue dark:text-white mb-3">
            Nova Zona
          </Text>

          <TextInput
            placeholder="Nome da Zona"
            placeholderTextColor="#9CA3AF"
            value={nomeZona}
            onChangeText={setNomeZona}
            className="border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 mb-4 bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-white"
          />

          <Text className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Cor da Zona
          </Text>
          <View className="flex-row flex-wrap mb-4">
            {CORES.map((c) => (
              <TouchableOpacity
                key={c.value}
                onPress={() => setCorZona(c.value)}
                className={`w-10 h-10 rounded-full mr-3 mb-3 border-[3px] ${
                  corZona === c.value
                    ? "border-darkBlue dark:border-white"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={salvar}
            className="bg-darkBlue dark:bg-white py-3 rounded-xl mt-2"
          >
            <Text className="text-white dark:text-darkBlue text-center font-semibold text-base">
              Salvar Zona
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Zonas */}
        <Text className="text-xl font-bold text-darkBlue dark:text-white mb-4">
          Zonas Cadastradas
        </Text>
        {zonas.length === 0 && (
          <Text className="text-gray-500 dark:text-gray-400 text-center mb-8">
            Nenhuma zona cadastrada ainda.
          </Text>
        )}

        {zonas.map((z) => (
          <View
            key={z.id}
            className={`rounded-2xl px-5 py-4 mb-3 border ${
              colorScheme === "dark"
                ? "border-zinc-700 bg-[#1E1E1E]"
                : "border-gray-200 bg-white"
            } shadow-sm`}
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-3">
                <View
                  style={{ backgroundColor: z.cor }}
                  className="w-4 h-4 rounded-full"
                />
                <Text className="font-semibold text-gray-800 dark:text-white text-base">
                  {z.nome}
                </Text>
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => abrirEdicao(z)}
                  className="bg-yellow-400 p-2 rounded-full"
                >
                  <Ionicons name="create-outline" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => excluir(z.id)}
                  className="bg-red-500 p-2 rounded-full"
                >
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal visible={!!editandoZona} animationType="fade" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 w-11/12">
            <Text className="text-lg font-bold mb-4 dark:text-white">
              Editar Zona
            </Text>
            <TextInput
              value={novoNome}
              onChangeText={setNovoNome}
              placeholder="Nome da Zona"
              placeholderTextColor="#9CA3AF"
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4 bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-white"
            />
            <Text className="mb-2 font-semibold dark:text-white">
              Cor da Zona
            </Text>
            <View className="flex-row flex-wrap mb-6">
              {CORES.map((c) => (
                <TouchableOpacity
                  key={c.value}
                  onPress={() => setNovaCor(c.value)}
                  className={`w-10 h-10 rounded-full mr-3 mb-3 border-[3px] ${
                    novaCor === c.value
                      ? "border-darkBlue dark:border-white"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </View>

            <View className="flex-row justify-end">
              <TouchableOpacity
                onPress={() => setEditandoZona(null)}
                className="mr-3 px-4 py-2"
              >
                <Text className="text-gray-600 dark:text-gray-300">
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={salvarEdicao}
                className="bg-darkBlue px-4 py-2 rounded-lg"
              >
                <Text className="text-white">Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaWrapper>
  );
}
