import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Text,
  View,
} from "react-native";
import Svg, { Polygon } from "react-native-svg";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import HeaderMenu from "../../../components/common/HeaderMenu";
import {
  getPateoDetalhes,
  PateoDetailResponse,
  ZonaResponse,
} from "../Zonas/services/zonaService";

import planta from "../Zonas/assets/mapa.jpeg";

const screenWidth = Dimensions.get("window").width;
const CANVAS_MARGIN = 48;

export default function HomeAdmScreen() {
  const [pateo, setPateo] = useState<PateoDetailResponse | null>(null);
  const [zonas, setZonas] = useState<ZonaResponse[]>([]);
  const [loading, setLoading] = useState(true);

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
      setZonas(data.zonas || []);
    } catch (err) {
      console.error("Erro carregando pátio:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <SafeAreaWrapper>
      <View className="flex-row justify-between items-center px-4 py-3">
        <View className="space-y-1 gap-4">
          <Text className="text-3xl font-bold text-darkBlue dark:text-white">
            FLEET
          </Text>
          <Text className="text-lg font-semibold dark:text-white">
            Gerencie o pateo
          </Text>
        </View>

        <HeaderMenu />
      </View>

      <View className="flex-1 items-center">
        {loading ? (
          <View className="h-72 justify-center items-center">
            <ActivityIndicator size="large" color="#130F26" />
            <Text className="text-gray-500 dark:text-gray-300 mt-3">
              Carregando pátio...
            </Text>
          </View>
        ) : (
          <ImageBackground
            source={planta}
            style={{ width: viewWidth, height: viewHeight }}
            resizeMode="contain"
            className="rounded-xl overflow-hidden"
          >
            <Svg height={viewHeight} width={viewWidth}>
              {zonas.map((zona, i) => (
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
                  fill={
                    [
                      "rgba(255,0,0,0.4)",
                      "rgba(0,0,255,0.4)",
                      "rgba(0,255,0,0.4)",
                    ][i % 3]
                  }
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </Svg>
          </ImageBackground>
        )}

        <View className="mt-6 w-full bg-black/10 dark:bg-white/10 rounded-xl p-4">
          <Text className="text-base font-semibold dark:text-white">
            Motos em movimento
          </Text>
          <Text className="text-sm text-gray-600 dark:text-lightGray">
            Última atualização há 5 minutos
          </Text>
        </View>

        <View className="mt-3 w-full bg-green-500/20 dark:bg-green-700/40 rounded-xl p-4">
          <Text className="text-base font-semibold text-green-700 dark:text-green-200">
            Total de motos: 90
          </Text>
        </View>
        <View className="mt-3 w-full bg-yellow-500/20 dark:bg-yellow-700/40 rounded-xl p-4">
          <Text className="text-base font-semibold text-yellow-700 dark:text-yellow-200">
            Motos paradas: 30
          </Text>
        </View>
        <View className="mt-3 w-full bg-red-500/20 dark:bg-red-700/40 rounded-xl p-4">
          <Text className="text-base font-semibold text-red-700 dark:text-red-200">
            Motos com problema: 5
          </Text>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
