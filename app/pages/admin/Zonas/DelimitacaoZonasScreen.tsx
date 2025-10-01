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
} from "react-native";
import Svg, { Circle, Polygon } from "react-native-svg";
import {
  getPateoDetalhes,
  criarZona,
  deletarZona,
  buildAssetUrl,
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

export default function DelimitacaoZonasScreen() {
  const [nomeZona, setNomeZona] = useState("");
  const [pateo, setPateo] = useState<PateoDetailResponse | null>(null);
  const [zonas, setZonas] = useState<ZonaResponse[]>([]);
  const [pontos, setPontos] = useState<{ x: number; y: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const viewWidth = useMemo(() => screenWidth - CANVAS_MARGIN, []);
  const viewHeight = useMemo(() => {
    if (!pateo) return 300;
    const ratio = pateo.plantaAltura / pateo.plantaLargura;
    return Math.round(viewWidth * ratio);
  }, [pateo, viewWidth]);

  const plantaUrl = useMemo(() => {
    if (!pateo) return "";
    const url = buildAssetUrl(pateo.plantaBaixaUrl);
    console.log("URL final da planta:", url);
    return url;
  }, [pateo]);

  async function carregar() {
    try {
      setLoading(true);
      const data = await getPateoDetalhes();

      console.log("=== Dados do Pátio ===");
      console.log("ID:", data.id);
      console.log("Nome:", data.nome);
      console.log("plantaBaixaUrl (raw):", data.plantaBaixaUrl);
      console.log(
        "plantaLargura:",
        data.plantaLargura,
        "plantaAltura:",
        data.plantaAltura
      );
      console.log("Zonas:", data.zonas?.length);

      setPateo(data);
      setZonas(data.zonas || []);
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
      setZonas((z) => [...z, nova]);
      setNomeZona("");
      setPontos([]);
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

  return (
    <SafeAreaWrapper>
      <ScrollView className="flex-1 px-6 pt-10">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
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
          plantaUrl && (
            <Pressable onPress={onPressImage}>
              <ImageBackground
                source={planta}
                style={{ width: viewWidth, height: viewHeight }}
                resizeMode="contain"
              >
                <Svg height={viewHeight} width={viewWidth}>
                  {/* Zonas vindas do backend */}
                  {zonas.map((zona: ZonaResponse) => (
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
                      fill="rgba(30,144,255,0.35)"
                      stroke="rgba(30,144,255,1)"
                      strokeWidth="2"
                    />
                  ))}

                  {/* Zona em desenho */}
                  {pontos.length > 0 && (
                    <>
                      <Polygon
                        points={pontos.map((p) => `${p.x},${p.y}`).join(" ")}
                        fill="rgba(16,185,129,0.25)"
                        stroke="rgba(16,185,129,1)"
                        strokeWidth="2"
                      />
                      {pontos.map((p, i) => (
                        <Circle
                          key={i}
                          cx={p.x}
                          cy={p.y}
                          r="4"
                          fill="#10B981"
                        />
                      ))}
                    </>
                  )}
                </Svg>
              </ImageBackground>
            </Pressable>
          )
        )}

        <TextInput
          placeholder="Nome da Zona"
          value={nomeZona}
          onChangeText={setNomeZona}
          className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 mt-6 mb-4 text-black dark:text-white bg-white dark:bg-[#1E1E1E]"
        />

        <TouchableOpacity
          onPress={salvar}
          className="bg-darkBlue py-3 rounded-xl mb-6"
        >
          <Text className="text-white text-center font-semibold text-base">
            Salvar Zona
          </Text>
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          Zonas Cadastradas
        </Text>
        {zonas.map((z) => (
          <View
            key={z.id}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 mb-3 bg-white dark:bg-[#1E1E1E]"
          >
            <Text className="font-semibold text-gray-900 dark:text-white">
              {z.nome}
            </Text>
            <TouchableOpacity
              onPress={() => excluir(z.id)}
              className="mt-2 bg-red-500 py-2 px-4 rounded-xl"
            >
              <Text className="text-white text-center font-medium">
                Excluir
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaWrapper>
  );
}
