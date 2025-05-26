// 📄 app/pages/admin/DelimitacaoZonasScreen.js
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
import Svg, { Polygon } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;
const screenHeight = 400; // altura fixa da imagem

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
            {zonas.map((zona) => (
              <Polygon
                key={zona.id}
                points={zona.pontos}
                fill="rgba(30, 144, 255, 0.4)"
                stroke="blue"
                strokeWidth="2"
              />
            ))}
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
          key={zona.id}
          className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
        >
          <Text className="font-semibold">{zona.nome}</Text>
          <Text className="text-gray-600">Tipo: {zona.tipo}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
