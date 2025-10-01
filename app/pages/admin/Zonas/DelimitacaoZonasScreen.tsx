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
import planta from "./assets/mapa.jpeg";

const screenWidth = Dimensions.get("window").width;
const CANVAS_MARGIN = 48; // padding lateral (px-6)

function gerarWKTNormalizado(
  pontos: { x: number; y: number }[],
  plantaW: number,
  plantaH: number
) {
  if (pontos.length < 3) throw new Error("Pelo menos 3 pontos.");
  const coords = pontos.map((p) => {
    const nx = (p.x / plantaW).toFixed(6);
    const ny = (p.y / plantaH).toFixed(6);
    return `${nx} ${ny}`;
  });
  if (coords[0] !== coords[coords.length - 1]) coords.push(coords[0]);
  return `POLYGON ((${coords.join(", ")}))`;
}

const CORES = [
  { label: "Azul", value: "#1E90FF" },
  { label: "Verde", value: "#10B981" },
  { label: "Vermelho", value: "#EF4444" },
  { label: "Amarelo", value: "#F59E0B" },
  { label: "Roxo", value: "#8B5CF6" },
];

export default function DelimitacaoZonasScreen() {
  const [nomeZona, setNomeZona] = useState("");
  const [corZona, setCorZona] = useState("#1E90FF");
  const [pateo, setPateo] = useState<PateoDetailResponse | null>(null);
  const [zonas, setZonas] = useState<(ZonaResponse & { cor?: string })[]>([]);
  const [pontos, setPontos] = useState<{ x: number; y: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const [editandoZona, setEditandoZona] = useState<
    (ZonaResponse & { cor?: string }) | null
  >(null);
  const [novaCor, setNovaCor] = useState("#1E90FF");
  const [novoNome, setNovoNome] = useState("");

  const viewWidth = useMemo(() => screenWidth - CANVAS_MARGIN, []);
  const viewHeight = useMemo(() => {
    if (!pateo) return 300;
    const ratio = pateo.plantaAltura / pateo.plantaLargura;
    return Math.round(viewWidth * ratio);
  }, [pateo, viewWidth]);

  async function carregar() {
    try {
      setLoading(true);
      const data = await getPateoDetalhes();
      setPateo(data);
      setZonas(data.zonas.map((z) => ({ ...z, cor: "#1E90FF" })));
    } catch (err) {
      console.error("Erro carregando pátio:", err);
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
    if (!pateo) return;
    if (!nomeZona || pontos.length < 3) {
      Alert.alert("Erro", "Informe o nome e desenhe a zona.");
      return;
    }
    try {
      const wkt = gerarWKTNormalizado(pontos, viewWidth, viewHeight);
      const nova = await criarZona({ nome: nomeZona, coordenadasWKT: wkt });
      setZonas((z) => [...z, { ...nova, cor: corZona }]);
      setNomeZona("");
      setPontos([]);
      setCorZona("#1E90FF");
      Alert.alert("Sucesso", "Zona criada.");
    } catch (err: any) {
      Alert.alert("Erro", err?.response?.data?.message || "Falha ao salvar.");
    }
  }

  function excluir(id: string) {
    Alert.alert("Excluir", "Remover esta zona?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deletarZona(id);
          setZonas((z) => z.filter((i) => i.id !== id));
        },
      },
    ]);
  }

  function abrirEdicao(zona: ZonaResponse & { cor?: string }) {
    setEditandoZona(zona);
    setNovoNome(zona.nome);
    setNovaCor(zona.cor || "#1E90FF");
  }

  async function salvarEdicao() {
    if (!editandoZona || !pateo) return;
    try {
      const atualizada = await atualizarZona(editandoZona.id, {
        nome: novoNome,
        coordenadasWKT: editandoZona.coordenadasWKT,
      });
      setZonas((z) =>
        z.map((i) =>
          i.id === editandoZona.id ? { ...atualizada, cor: novaCor } : i
        )
      );
      setEditandoZona(null);
      Alert.alert("Sucesso", "Zona atualizada.");
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err?.response?.data?.message || "Falha ao atualizar."
      );
    }
  }

  return (
    <SafeAreaWrapper>
      <ScrollView className="flex-1 px-6 pt-10">
        <Text className="text-3xl font-bold text-gray dark:text-white mb-4">
          Delimitação de Zona
        </Text>

        {loading ? (
          <View className="h-72 justify-center items-center">
            <ActivityIndicator size="large" color="#130F26" />
            <Text className="text-gray-500 dark:text-gray-300 mt-3">
              Carregando planta do pátio...
            </Text>
          </View>
        ) : (
          <Pressable onPress={onPressImage}>
            <ImageBackground
              source={planta}
              style={{ width: viewWidth, height: viewHeight }}
              resizeMode="contain"
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
                        const [nx, ny]: number[] = pair.split(" ").map(Number);
                        return `${nx * viewWidth},${ny * viewHeight}`;
                      })
                      .join(" ")}
                    fill={(zona.cor || "#1E90FF") + "55"}
                    stroke={zona.cor || "#1E90FF"}
                    strokeWidth="2"
                  />
                ))}

                {pontos.length > 0 && (
                  <>
                    <Polygon
                      points={pontos.map((p) => `${p.x},${p.y}`).join(" ")}
                      fill={corZona + "55"}
                      stroke={corZona}
                      strokeWidth="2"
                    />
                    {pontos.map((p, i) => (
                      <Circle key={i} cx={p.x} cy={p.y} r="4" fill={corZona} />
                    ))}
                  </>
                )}
              </Svg>
            </ImageBackground>
          </Pressable>
        )}

        <TextInput
          placeholder="Nome da Zona"
          placeholderTextColor="#9CA3AF"
          value={nomeZona}
          onChangeText={setNomeZona}
          className="border border-gray-300 rounded-xl px-4 py-3 mt-6 mb-2 bg-white dark:bg-[#1E1E1E] text-gray-900"
        />

        <Text className="mb-2 font-semibold text-gray-700 dark:text-white">
          Cor da Zona
        </Text>
        <View className="flex-row flex-wrap mb-6">
          {CORES.map((c) => (
            <TouchableOpacity
              key={c.value}
              onPress={() => setCorZona(c.value)}
              className={`w-10 h-10 rounded-full mr-3 mb-3 border-2 ${
                corZona === c.value ? "border-black" : "border-transparent"
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={salvar}
          className="bg-darkBlue py-3 rounded-xl mb-6"
        >
          <Text className="text-white text-center font-semibold text-base">
            Salvar Zona
          </Text>
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-800 dark:text-white mb-2 ">
          Zonas Cadastradas
        </Text>
        {zonas.map((z) => (
          <View
            key={z.id}
            className="border border-gray-300 rounded-lg px-4 py-3 mb-3 bg-white dark:bg-[#1E1E1E]"
          >
            <Text className="font-semibold dark:text-white">{z.nome}</Text>
            <View className="flex-row mt-2 ">
              <TouchableOpacity
                onPress={() => abrirEdicao(z)}
                className="bg-yellow-500 py-2 px-4 rounded-xl mr-2"
              >
                <Text className="text-white text-center">Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => excluir(z.id)}
                className="bg-red-500 py-2 px-4 rounded-xl"
              >
                <Text className="text-white text-center">Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal edição */}
      <Modal visible={!!editandoZona} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white rounded-2xl p-6 w-11/12">
            <Text className="text-lg font-bold mb-4">Editar Zona</Text>
            <TextInput
              value={novoNome}
              onChangeText={setNovoNome}
              placeholder="Nome da Zona"
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4 bg-white"
            />
            <Text className="mb-2 font-semibold">Cor da Zona</Text>
            <View className="flex-row flex-wrap mb-6">
              {CORES.map((c) => (
                <TouchableOpacity
                  key={c.value}
                  onPress={() => setNovaCor(c.value)}
                  className={`w-10 h-10 rounded-full mr-3 mb-3 border-2 ${
                    novaCor === c.value ? "border-black" : "border-transparent"
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
                <Text className="text-gray-600">Cancelar</Text>
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
