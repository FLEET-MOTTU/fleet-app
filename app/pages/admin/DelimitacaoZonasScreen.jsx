import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Polygon, Text as SvgText } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;
const screenHeight = 400;

export default function DelimitacaoZonasScreen() {
  const [nomeZona, setNomeZona] = useState("");
  const [tipoZona, setTipoZona] = useState("");
  const [zonas, setZonas] = useState([]);

  const carregarZonas = async () => {
    try {
      const dados = await AsyncStorage.getItem("zonas");
      if (dados) setZonas(JSON.parse(dados));
    } catch (error) {
      console.error("Erro ao carregar zonas:", error);
    }
  };

  const salvarZonas = async (lista) => {
    try {
      await AsyncStorage.setItem("zonas", JSON.stringify(lista));
    } catch (error) {
      console.error("Erro ao salvar zonas:", error);
    }
  };

  useEffect(() => {
    carregarZonas();
  }, []);

  const handleSalvar = async () => {
    if (!nomeZona || !tipoZona) {
      Alert.alert("Erro", "Preencha o nome e tipo da zona.");
      return;
    }

    const novaZona = {
      id: Date.now().toString(),
      nome: nomeZona,
      tipo: tipoZona,
      pontos: "50,60 100,40 120,140 80,160", // coordenadas mock
    };

    const novaLista = [...zonas, novaZona];
    setZonas(novaLista);
    await salvarZonas(novaLista);

    setNomeZona("");
    setTipoZona("");
    Alert.alert("Sucesso", "Zona delimitada com sucesso.");
  };

  const handleExcluirZona = async (id) => {
    const novaLista = zonas.filter((z) => z.id !== id);
    setZonas(novaLista);
    await salvarZonas(novaLista);
  };

  const calcularCentro = (pontos) => {
    const coords = pontos.split(" ").map((pt) => pt.split(",").map(Number));
    const xs = coords.map(([x]) => x);
    const ys = coords.map(([, y]) => y);
    const cx = xs.reduce((a, b) => a + b) / xs.length;
    const cy = ys.reduce((a, b) => a + b) / ys.length;
    return { cx, cy };
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-10">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        Delimitação de Zona
      </Text>

      <View className="mb-6">
        <ImageBackground
          source={require("../../../assets/MAP.jpg")}
          style={{ width: screenWidth - 48, height: screenHeight }}
        >
          <Svg height={screenHeight} width={screenWidth - 48}>
            {zonas.map((zona) => {
              const { cx, cy } = calcularCentro(zona.pontos);
              return (
                <View key={zona.id}>
                  <Polygon
                    points={zona.pontos}
                    fill="rgba(30, 144, 255, 0.4)"
                    stroke="blue"
                    strokeWidth="2"
                  />
                  <SvgText
                    x={cx}
                    y={cy}
                    fill="black"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {zona.nome}
                  </SvgText>
                </View>
              );
            })}
          </Svg>
        </ImageBackground>
      </View>

      <TextInput
        placeholder="Nome da Zona"
        value={nomeZona}
        onChangeText={setNomeZona}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />

      <TextInput
        placeholder="Tipo da Zona (APTAS, RISCO, etc.)"
        value={tipoZona}
        onChangeText={setTipoZona}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-6"
      />

      <TouchableOpacity
        onPress={handleSalvar}
        className="bg-blue-600 py-3 rounded-xl mb-6"
      >
        <Text className="text-white text-center font-semibold text-base">
          Salvar Zona
        </Text>
      </TouchableOpacity>

      <Text className="text-xl font-bold text-gray-800 mb-2">Zonas Salvas</Text>
      {zonas.map((zona) => (
        <View
          key={`item-${zona.id}`}
          className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
        >
          <Text className="font-semibold">{zona.nome}</Text>
          <Text className="text-gray-600">Tipo: {zona.tipo}</Text>

          <TouchableOpacity
            onPress={() => handleExcluirZona(zona.id)}
            className="mt-2 bg-red-500 px-4 py-2 rounded"
          >
            <Text className="text-white text-sm text-center font-semibold">
              Excluir Zona
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
