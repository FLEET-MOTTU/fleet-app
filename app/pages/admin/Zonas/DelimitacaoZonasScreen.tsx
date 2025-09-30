import { useEffect, useState } from "react";
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
} from "react-native";
import Svg, { Circle, Polygon } from "react-native-svg";
import {
  buscarPateoDetalhes,
  criarZona,
  deletarZona,
} from "./services/zonaService";

const screenWidth = Dimensions.get("window").width;
const screenHeight = 400;

const PATEO_ID = "ef0cddcb-7d83-4dd4-bf3d-b73d68af2b37";

export default function DelimitacaoZonasScreen() {
  const [nomeZona, setNomeZona] = useState("");
  const [tipoZona, setTipoZona] = useState("");
  const [zonas, setZonas] = useState<any[]>([]);
  const [pontosZonaAtual, setPontosZonaAtual] = useState<
    { x: number; y: number }[]
  >([]);
  const [plantaUrl, setPlantaUrl] = useState<string | null>(null);

  async function carregarZonas() {
    try {
      const data = await buscarPateoDetalhes(PATEO_ID);
      setZonas(data.zonas || []);
      setPlantaUrl(data.plantaBaixaUrl); // vem do backend
    } catch (error) {
      console.error("Erro ao carregar zonas:", error);
      Alert.alert("Erro", "Não foi possível carregar as zonas.");
    }
  }

  useEffect(() => {
    carregarZonas();
  }, []);

  async function handleSalvar() {
    if (!nomeZona || pontosZonaAtual.length < 3) {
      Alert.alert("Erro", "Preencha todos os campos e desenhe a zona.");
      return;
    }

    // 🔥 converter pontos clicados em POLYGON WKT
    const coords = pontosZonaAtual.map((p) => `${p.x} ${p.y}`).join(", ");
    const wkt = `POLYGON ((${coords}, ${pontosZonaAtual[0].x} ${pontosZonaAtual[0].y}))`;

    try {
      await criarZona(PATEO_ID, {
        nome: nomeZona,
        coordenadasWKT: wkt,
      });
      Alert.alert("Sucesso", "Zona criada com sucesso!");
      setNomeZona("");
      setTipoZona("");
      setPontosZonaAtual([]);
      carregarZonas();
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Falha ao salvar zona."
      );
    }
  }

  async function handleExcluir(zonaId: string) {
    Alert.alert("Excluir", "Deseja remover essa zona?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deletarZona(PATEO_ID, zonaId);
            Alert.alert("Sucesso", "Zona excluída.");
            carregarZonas();
          } catch (error: any) {
            console.error(error);
            Alert.alert("Erro", "Falha ao excluir zona.");
          }
        },
      },
    ]);
  }

  function handlePressImage(event: any) {
    const { locationX, locationY } = event.nativeEvent;
    setPontosZonaAtual((prev) => [...prev, { x: locationX, y: locationY }]);
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-10">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        Delimitação de Zona
      </Text>

      <Pressable onPress={handlePressImage}>
        {plantaUrl && (
          <ImageBackground
            source={{ uri: plantaUrl }}
            style={{ width: screenWidth - 48, height: screenHeight }}
          >
            <Svg height={screenHeight} width={screenWidth - 48}>
              {/* Zonas já salvas */}
              {zonas.map((zona) => (
                <Polygon
                  key={zona.id}
                  points={zona.coordenadasWKT
                    .replace("POLYGON ((", "")
                    .replace("))", "")
                    .split(", ")
                    .map((pair: any) => {
                      const [x, y] = pair.split(" ");
                      return `${x},${y}`;
                    })
                    .join(" ")}
                  fill="rgba(30, 144, 255, 0.4)"
                  stroke="blue"
                  strokeWidth="2"
                />
              ))}

              {/* Zona em desenho */}
              {pontosZonaAtual.length > 0 && (
                <>
                  <Polygon
                    points={pontosZonaAtual
                      .map((p) => `${p.x},${p.y}`)
                      .join(" ")}
                    fill="rgba(0,255,0,0.3)"
                    stroke="green"
                    strokeWidth="2"
                  />
                  {pontosZonaAtual.map((p, i) => (
                    <Circle key={i} cx={p.x} cy={p.y} r="4" fill="green" />
                  ))}
                </>
              )}
            </Svg>
          </ImageBackground>
        )}
      </Pressable>

      <TextInput
        placeholder="Nome da Zona"
        value={nomeZona}
        onChangeText={setNomeZona}
        className="border border-gray-300 rounded-xl px-4 py-3 mt-6 mb-4"
      />

      <TouchableOpacity
        onPress={handleSalvar}
        className="bg-blue-600 py-3 rounded-xl mb-6"
      >
        <Text className="text-white text-center font-semibold text-base">
          Salvar Zona
        </Text>
      </TouchableOpacity>

      <Text className="text-xl font-bold text-gray-800 mb-2">
        Zonas Criadas
      </Text>
      {zonas.map((zona) => (
        <View
          key={zona.id}
          className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
        >
          <Text className="font-semibold">{zona.nome}</Text>
          <Text className="text-gray-600">
            Coordenadas: {zona.coordenadasWKT}
          </Text>

          <TouchableOpacity
            onPress={() => handleExcluir(zona.id)}
            className="mt-2 bg-red-500 py-2 px-4 rounded-xl"
          >
            <Text className="text-white text-center font-medium">Excluir</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
