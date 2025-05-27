import AsyncStorage from "@react-native-async-storage/async-storage";
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

const screenWidth = Dimensions.get("window").width;
const screenHeight = 400;

export default function DelimitacaoZonasScreen() {
  const [nomeZona, setNomeZona] = useState("");
  const [tipoZona, setTipoZona] = useState("");
  const [zonas, setZonas] = useState([]);
  const [pontosZonaAtual, setPontosZonaAtual] = useState([]);

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
    if (!nomeZona || !tipoZona || pontosZonaAtual.length < 3) {
      Alert.alert("Erro", "Preencha todos os campos e desenhe a zona.");
      return;
    }

    const novaZona = {
      id: Date.now().toString(),
      nome: nomeZona,
      tipo: tipoZona,
      pontos: pontosZonaAtual.map((p) => `${p.x},${p.y}`).join(" "),
    };

    const novaLista = [...zonas, novaZona];
    setZonas(novaLista);
    await salvarZonas(novaLista);

    setNomeZona("");
    setTipoZona("");
    setPontosZonaAtual([]);
    Alert.alert("Sucesso", "Zona delimitada com sucesso.");
  };

  const excluirZona = async (id) => {
    const novaLista = zonas.filter((zona) => zona.id !== id);
    setZonas(novaLista);
    await salvarZonas(novaLista);
  };

  const handlePressImage = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const novoPonto = { x: locationX, y: locationY };
    setPontosZonaAtual((prev) => [...prev, novoPonto]);
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-10">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        Delimitação de Zona
      </Text>

      <Pressable onPress={handlePressImage}>
        <ImageBackground
          source={require("../../../assets/MAP.jpg")}
          style={{ width: screenWidth - 48, height: screenHeight }}
        >
          <Svg height={screenHeight} width={screenWidth - 48}>
            {/* Zonas salvas */}
            {zonas.map((zona) => (
              <Polygon
                key={zona.id}
                points={zona.pontos}
                fill="rgba(30, 144, 255, 0.4)"
                stroke="blue"
                strokeWidth="2"
              />
            ))}
            {/* Ponto desenhado pelo usuário */}
            {pontosZonaAtual.length > 0 && (
              <>
                <Polygon
                  points={pontosZonaAtual.map((p) => `${p.x},${p.y}`).join(" ")}
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
      </Pressable>

      <TextInput
        placeholder="Nome da Zona"
        value={nomeZona}
        onChangeText={setNomeZona}
        className="border border-gray-300 rounded-xl px-4 py-3 mt-6 mb-4"
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
          key={zona.id}
          className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
        >
          <Text className="font-semibold">{zona.nome}</Text>
          <Text className="text-gray-600">Tipo: {zona.tipo}</Text>

          <TouchableOpacity
            onPress={() =>
              Alert.alert("Excluir", "Deseja remover essa zona?", [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Excluir",
                  style: "destructive",
                  onPress: () => excluirZona(zona.id),
                },
              ])
            }
            className="mt-2 bg-red-500 py-2 px-4 rounded-xl"
          >
            <Text className="text-white text-center font-medium">Excluir</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
