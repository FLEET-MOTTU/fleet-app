import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import Svg, { Polygon } from "react-native-svg";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import HeaderMenu from "../../../components/common/HeaderMenu";
import {
  getPateoDetalhes,
  PateoDetailResponse,
  ZonaResponse,
} from "./services/pateoService";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import AppHeader from "../../../components/AppHeader";
import { getAdminFromToken } from "../../../services/auth/session";

const screenWidth = Dimensions.get("window").width;
const CANVAS_MARGIN = 32;

export default function MapaPateo() {
  const { colorScheme } = useColorScheme();
  const [pateo, setPateo] = useState<PateoDetailResponse | null>(null);
  const [zonas, setZonas] = useState<ZonaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const viewWidth = useMemo(() => screenWidth - CANVAS_MARGIN, []);
  const viewHeight = useMemo(() => {
    if (!pateo) return 300;
    const ratio = pateo.plantaAltura / pateo.plantaLargura;
    return Math.round(viewWidth * ratio);
  }, [pateo, viewWidth]);

  async function carregar() {
    try {
      setLoading(true);

      const admin = await getAdminFromToken();

      if (!admin?.pateoId) {
        console.warn("⚠️ Nenhum pateoId encontrado no token do admin");
        setLoading(false);
        return;
      }

      const data = await getPateoDetalhes(admin.pateoId);
      setPateo(data);
      setZonas(data.zonas || []);
    } catch (err) {
      console.error("Erro ao carregar pátio:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <SafeAreaWrapper>
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <AppHeader title="Mapa do Pátio" showBack={true} />

        {/* Campo de busca */}
        <View
          className={`flex-row items-center rounded-xl mb-4 px-4 py-8 ${
            colorScheme === "dark" ? "bg-[#130F26]" : "bg-gray-100"
          }`}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={colorScheme === "dark" ? "#fff" : "#555"}
          />
          <TextInput
            placeholder="Buscar Moto"
            placeholderTextColor={colorScheme === "dark" ? "#ccc" : "#888"}
            value={search}
            onChangeText={setSearch}
            className={`flex-1 py-3 ml-2 ${
              colorScheme === "dark" ? "text-white" : "text-black"
            }`}
          />
        </View>

        {/* Mapa */}
        <View className="items-center mb-6">
          {loading ? (
            <View className="h-72 justify-center items-center">
              <ActivityIndicator size="large" color="#130F26" />
              <Text className="text-gray-500 dark:text-gray-300 mt-3">
                Carregando pátio...
              </Text>
            </View>
          ) : (
            <ImageBackground
              source={{ uri: pateo?.plantaBaixaUrl }}
              style={{ width: viewWidth, height: viewHeight }}
              resizeMode="contain"
              className={`rounded-2xl p-2 ${
                colorScheme === "dark" ? "bg-[#0D0D0D]" : "bg-white"
              } shadow-md`}
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
                        "rgba(255,0,0,0.2)",
                        "rgba(255,200,0,0.2)",
                        "rgba(0,0,255,0.2)",
                        "rgba(0,255,0,0.2)",
                      ][i % 4]
                    }
                    stroke={["#FF0000", "#FFD700", "#0066FF", "#00FF00"][i % 4]}
                    strokeWidth={2}
                  />
                ))}
              </Svg>
            </ImageBackground>
          )}
        </View>

        {/* Legenda */}
        <View className="rounded-2xl mb-4 p-4 shadow-sm dark:bg-[#130F26] bg-white">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-semibold dark:text-white">
              Zonas do Pátio
            </Text>
            <Text className="text-xs text-gray-400 dark:text-gray-300">
              Ocultar
            </Text>
          </View>

          <View className="flex-row justify-around">
            <LegendaItem cor="#FF0000" texto="Manutenção" />
            <LegendaItem cor="#FFD700" texto="Aguardando" />
            <LegendaItem cor="#0066FF" texto="Inspeção" />
            <LegendaItem cor="#00FF00" texto="Finalizada" />
          </View>
        </View>

        {/* Estatísticas */}
        <View
          className={`rounded-2xl p-5 mb-4 ${
            colorScheme === "dark" ? "bg-[#1E1E1E]" : "bg-white"
          }`}
        >
          <Text className="text-base font-semibold text-[#F97316] dark:text-[#F97316] mb-3">
            📊 Estatísticas do Pátio
          </Text>
          <View className="flex-row justify-around">
            <StatItem cor="#F97316" titulo="Total de Motos" valor="12" />
            <StatItem cor="#22C55E" titulo="Finalizadas" valor="4" />
            <StatItem cor="#EF4444" titulo="Em Manutenção" valor="3" />
            <StatItem cor="#EAB308" titulo="Aguardando" valor="2" />
          </View>
        </View>

        {/* Atividades recentes */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold dark:text-white">
              Atividades Recentes
            </Text>
            <Text className="text-sm text-blue-600 dark:text-blue-400">
              Ver todas
            </Text>
          </View>

          <ActivityItem
            icon="add-circle-outline"
            plate="ABC-1234"
            desc="Cadastrada • Motor defeituoso"
            time="2min"
            color="#22C55E"
          />
          <ActivityItem
            icon="arrow-forward-outline"
            plate="XYZ-5678"
            desc="Movida • Zona Manutenção"
            time="8min"
            color="#3B82F6"
          />
          <ActivityItem
            icon="checkmark-circle-outline"
            plate="DEF-9012"
            desc="Finalizada • Pronta para rua"
            time="15min"
            color="#22C55E"
          />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

function LegendaItem({ cor, texto }: any) {
  return (
    <View className="flex-row items-center gap-2">
      <View style={{ backgroundColor: cor }} className="w-3 h-3 rounded-full" />
      <Text className="text-xs text-black dark:text-white">{texto}</Text>
    </View>
  );
}

function StatItem({ cor, titulo, valor }: any) {
  return (
    <View className="items-center">
      <Text style={{ color: cor }} className="text-xl font-bold">
        {valor}
      </Text>
      <Text className="text-xs text-gray-500 dark:text-gray-300">{titulo}</Text>
    </View>
  );
}

const ActivityItem = ({ icon, plate, desc, time, color }: any) => (
  <View className="flex-row justify-between items-center bg-white dark:bg-lightBlack rounded-xl p-4 mb-3 shadow-sm">
    <View className="flex-row items-center gap-3">
      <Ionicons name={icon} size={22} color={color} />
      <View>
        <Text className="text-sm font-semibold dark:text-white">{plate}</Text>
        <Text className="text-xs text-gray-500 dark:text-lightText">
          {desc}
        </Text>
      </View>
    </View>
    <Text className="text-xs text-gray-400 dark:text-lightText">{time}</Text>
  </View>
);
