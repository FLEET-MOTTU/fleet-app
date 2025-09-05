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

// Tamanho do mapa
const screenWidth = Dimensions.get("window").width;
const screenHeight = 400;

// Mesmo mapa de cores usado no cadastro
const coresZona = {
  pendencia: { fill: "rgba(255, 193, 7, 0.3)", stroke: "#FFC107" },
  reparos_simples: { fill: "rgba(33, 150, 243, 0.3)", stroke: "#2196F3" },
  danos_graves: { fill: "rgba(244, 67, 54, 0.3)", stroke: "#F44336" },
  motor_defeituoso: { fill: "rgba(255, 87, 34, 0.3)", stroke: "#FF5722" },
  agendada_manutencao: { fill: "rgba(156, 39, 176, 0.3)", stroke: "#9C27B0" },
  pronta_aluguel: { fill: "rgba(76, 175, 80, 0.3)", stroke: "#4CAF50" },
  sem_placa: { fill: "rgba(158, 158, 158, 0.3)", stroke: "#9E9E9E" },
  minha_mottu: { fill: "rgba(0, 188, 212, 0.3)", stroke: "#00BCD4" },
};

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
          {zonas.map((zona) => {
            const cores =
              coresZona[zona.tipo] || {
                fill: "rgba(99, 102, 241, 0.3)",
                stroke: "#6366f1",
              };
            return (
              <Polygon
                key={zona.id}
                points={zona.pontos}
                fill={cores.fill}
                stroke={cores.stroke}
                strokeWidth="2"
              />
            );
          })}
        </Svg>
      </ImageBackground>

      <Text className="text-xl font-bold text-gray-800 mt-6 mb-2">
        Zonas Delimitadas
      </Text>
      {zonas.map((zona) => {
        const cores = coresZona[zona.tipo] || { stroke: "#6366f1" };
        return (
          <View
            key={zona.id}
            className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
          >
            <Text className="font-semibold">{zona.nome}</Text>
            <View
              className="px-2 py-1 rounded self-start my-1"
              style={{ backgroundColor: cores.stroke + "20" }}
            >
              <Text style={{ color: cores.stroke, fontWeight: "600" }}>
                {zona.tipoLabel || zona.tipo}
              </Text>
            </View>
            <Text className="text-gray-600">Tipo: {zona.tipo}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
