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
import {
  getPateoDetalhes,
  PateoDetailResponse,
  ZonaResponse,
} from "./services/pateoService";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import AppHeader from "../../../components/AppHeader";
import { getAdminFromToken } from "../../../services/auth/session";
import ActivityItem from "../../../components/ActiveItem";
import { useTranslation } from "react-i18next";

const screenWidth = Dimensions.get("window").width;
const CANVAS_MARGIN = 32;

export default function MapaPateo() {
  const { t } = useTranslation("pateo");

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

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
        console.warn("Nenhum pateoId encontrado no token do admin");
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
        <AppHeader title={t("title")} showBack />

        <View></View>

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
                isDark ? "bg-[#0D0D0D]" : "bg-white"
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
        <View className="rounded-2xl mb-8 p-4 shadow-sm bg-darkBlue">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-semibold text-white">
              Zonas do Pátio
            </Text>
            <Text className="text-xs text-white">Ocultar</Text>
          </View>

          <View className="flex-row justify-around">
            <LegendaItem cor="#FF0000" texto="Manutenção" />
            <LegendaItem cor="#FFD700" texto="Aguardando" />
            <LegendaItem cor="#0066FF" texto="Inspeção" />
            <LegendaItem cor="#00FF00" texto="Finalizada" />
          </View>
        </View>

        {/* Estatísticas */}
        <View>
          <Text
            className={`text-lg font-bold mb-3 ${
              isDark ? "text-white" : "text-[#130F26]"
            }`}
          >
            {t("statistics")}
          </Text>
        </View>
        <View className="flex-row justify-between mb-8">
          <MetricCard
            icon="bicycle"
            title="Total de Motos"
            value="24"
            color="#10B981"
          />
          <MetricCard
            icon="build-outline"
            title="Em Manutenção"
            value="12"
            color="#3B82F6"
          />
          <MetricCard
            icon="checkmark-circle-outline"
            title="Aguardando"
            value="8"
            color="#22C55E"
          />
          <MetricCard
            icon="time-outline"
            title="Em Inspeção"
            value="4"
            color="#F59E0B"
          />
        </View>

        {/* Atividades recentes */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-2">
            <Text
              className={`text-lg font-bold ${
                isDark ? "text-white" : "text-[#130F26]"
              }`}
            >
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

/* ——— Subcomponentes ——— */

function LegendaItem({ cor, texto }: any) {
  return (
    <View className="flex-row items-center gap-2">
      <View style={{ backgroundColor: cor }} className="w-3 h-3 rounded-full" />
      <Text className="text-xs text-white">{texto}</Text>
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

const MetricCard = ({ icon, title, value, color }: any) => (
  <View className="bg-white dark:bg-lightBlack rounded-2xl flex-1 items-center justify-center py-3 mx-1 shadow-md">
    <Ionicons name={icon} size={24} color={color} />
    <Text className="text-lg font-bold mt-2 dark:text-white">{value}</Text>
    <Text className="text-xs text-gray-500 dark:text-white">{title}</Text>
  </View>
);
