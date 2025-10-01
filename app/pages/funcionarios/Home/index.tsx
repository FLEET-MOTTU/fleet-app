import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useMemo } from "react";
import { Dimensions, ImageBackground, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Polygon } from "react-native-svg";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import planta from "../../admin/Zonas/assets/mapa.jpeg";
import {
  getPateoDetalhes,
  ZonaResponse,
} from "../../admin/Zonas/services/zonaService";
import HeaderMenu from "../../../components/common/HeaderMenu";

const screenWidth = Dimensions.get("window").width;
const CANVAS_MARGIN = 20;

export default function HomeFuncionarioScreen() {
  const [nomeFuncionario, setNomeFuncionario] = useState("Funcionário");
  const [zonas, setZonas] = useState<ZonaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [plantaWidth, setPlantaWidth] = useState(800);
  const [plantaHeight, setPlantaHeight] = useState(600);

  const viewWidth = useMemo(() => screenWidth - CANVAS_MARGIN, []);

  const viewHeight = useMemo(() => {
    const ratio = plantaHeight / plantaWidth;
    return Math.round(viewWidth * ratio);
  }, [viewWidth, plantaHeight, plantaWidth]);

  useEffect(() => {
    const buscarNome = async () => {
      const nome = await AsyncStorage.getItem("nomeFuncionario");
      setNomeFuncionario(nome || "Funcionário");
    };
    buscarNome();
  }, []);

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await getPateoDetalhes();
        setZonas(data.zonas || []);
        if (data.plantaLargura && data.plantaAltura) {
          setPlantaWidth(data.plantaLargura);
          setPlantaHeight(data.plantaAltura);
        }
      } catch (err) {
        console.error("Erro ao carregar zonas:", err);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  return (
    <SafeAreaWrapper>
      <View className="flex-row justify-end mb-4">
        <HeaderMenu />
      </View>

      <Text className="text-3xl font-bold text-darkBlue dark:text-white mb-6">
        Olá, {nomeFuncionario}
      </Text>

      <View className="mb-8">
        <Text className="text-xl font-semibold text-darkBlue dark:text-white mb-3">
          Zonas do Pátio
        </Text>
        <ImageBackground
          source={planta}
          style={{
            width: viewWidth,
            height: viewHeight,
            overflow: "hidden",
            alignSelf: "center",
          }}
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
                fill="rgba(30,144,255,0.35)"
                stroke="rgba(30,144,255,1)"
                strokeWidth="2"
              />
            ))}
          </Svg>
        </ImageBackground>
      </View>
    </SafeAreaWrapper>
  );
}
