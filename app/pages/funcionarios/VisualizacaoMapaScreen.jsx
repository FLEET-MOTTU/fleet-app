import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  Text,
  View,
} from "react-native";
import Svg, { Polygon } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;
const screenHeight = 400;

export default function VisualizacaoMapaScreen() {
  const [zonas, setZonas] = useState([]);

  const carregarZonas = async () => {
    try {
      const dados = await AsyncStorage.getItem("zonas");
      if (dados) setZonas(JSON.parse(dados));
    } catch (error) {
      console.error("Erro ao carregar zonas:", error);
    }
  };

  useEffect(() => {
    carregarZonas();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-10">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        Visualização de Zonas
      </Text>

      <ImageBackground
        source={require("../../../assets/MAP.jpg")}
        style={{
          width: screenWidth - 48,
          height: screenHeight,
          borderRadius: 12,
          overflow: "hidden",
        }}
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

      <Text className="text-xl font-bold text-gray-800 mt-6 mb-2">
        Zonas Delimitadas
      </Text>
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
