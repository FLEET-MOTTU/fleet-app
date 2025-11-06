import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import Svg, { Circle, Polygon } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import AppHeader from "../../../components/AppHeader";
import {
  getPateoDetalhes,
  criarZona,
  deletarZona,
  atualizarZona,
  PateoDetailResponse,
  ZonaResponse,
} from "./services/zonaService";
import { getAdminFromToken } from "../../../services/auth/session";
import InputField from "../../../components/Input";
import ActivityItem from "../../../components/ActiveItem";
import Button from "../../../components/Button";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const screenWidth = Dimensions.get("window").width;
const H_PADDING = 16; // padding horizontal do layout
const CANVAS_MARGIN = 12; // respiro do card
const CARD_W = Math.round(screenWidth - H_PADDING * 2);

const PALETTE = [
  { name: "Azul", value: "#3B82F6" },
  { name: "Verde", value: "#22C55E" },
  { name: "Amarelo", value: "#FACC15" },
  { name: "Vermelho", value: "#EF4444" },
  { name: "Roxo", value: "#A855F7" },
];

type ZonaUI = ZonaResponse & { cor?: string };

function polygonToPoints(wkt: string, w: number, h: number): string {
  return wkt
    .replace("POLYGON ((", "")
    .replace("))", "")
    .split(", ")
    .map((pair: string) => {
      const [nx, ny]: number[] = pair.split(" ").map(Number);
      return `${nx * w},${ny * h}`;
    })
    .join(" ");
}

function pointsToWKT(pts: { x: number; y: number }[], w: number, h: number) {
  if (pts.length < 3) throw new Error("Desenhe pelo menos 3 pontos.");
  const coords = pts.map((p) => {
    const nx = (p.x / w).toFixed(6);
    const ny = (p.y / h).toFixed(6);
    return `${nx} ${ny}`;
  });
  if (coords[0] !== coords[coords.length - 1]) coords.push(coords[0]);
  return `POLYGON ((${coords.join(", ")}))`;
}

export default function DelimitacaoZonasProScreen() {
  const { t } = useTranslation("zonas");

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // data
  const [pateoId, setPateoId] = useState<string | null>(null);
  const [pateo, setPateo] = useState<PateoDetailResponse | null>(null);
  const [zonas, setZonas] = useState<ZonaUI[]>([]);

  // draw/form
  const [mode, setMode] = useState<"idle" | "draw">("idle");
  const [pontos, setPontos] = useState<{ x: number; y: number }[]>([]);
  const [nomeZona, setNomeZona] = useState("");
  const [corZona, setCorZona] = useState(PALETTE[0].value);

  // ui
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState<ZonaUI | null>(null);
  const [novoNome, setNovoNome] = useState("");
  const [novaCor, setNovaCor] = useState(PALETTE[0].value);

  // sizes
  const viewWidth = useMemo(() => CARD_W - CANVAS_MARGIN * 2, []);
  const viewHeight = useMemo(() => {
    if (!pateo) return 260;
    const ratio = pateo.plantaAltura / pateo.plantaLargura;
    return Math.round(viewWidth * ratio);
  }, [pateo, viewWidth]);

  async function carregar() {
    try {
      setLoading(true);
      const admin = await getAdminFromToken();
      if (!admin?.pateoId) {
        Alert.alert(t("attencion"), t("no_patio"));
        return;
      }
      setPateoId(admin.pateoId);

      const data = await getPateoDetalhes(admin.pateoId);
      setPateo(data);
      setZonas(
        (data.zonas || []).map((z: any, i: any) => ({
          ...z,
          cor: PALETTE[i % PALETTE.length].value,
        }))
      );
    } catch (e) {
      Alert.alert(t("error"), t("not_possible"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function handleCanvasPress(e: any) {
    if (mode !== "draw") return;
    const { locationX, locationY } = e.nativeEvent;
    setPontos((prev) => [...prev, { x: locationX, y: locationY }]);
  }

  function clearDraft() {
    setPontos([]);
  }

  async function salvarZona() {
    if (!pateoId) return;
    if (!nomeZona.trim() || pontos.length < 3) {
      Alert.alert(t("fill_all_fields"), t("draw_zone"));
      return;
    }

    try {
      setSaving(true);
      const wkt = pointsToWKT(pontos, viewWidth, viewHeight);

      await criarZona(pateoId, {
        nome: nomeZona.trim(),
        coordenadasWKT: wkt,
      });

      await carregar();

      // limpa o estado
      setNomeZona("");
      setPontos([]);
      setMode("idle");
      Alert.alert(t("success"), t("zone_created"));
    } catch (err: any) {
      Alert.alert(t("error"), err?.response?.data?.message || t("failed"));
    } finally {
      setSaving(false);
    }
  }

  function abrirEdicao(z: ZonaUI) {
    setEditModal(z);
    setNovoNome(z.nome);
    setNovaCor(z.cor || PALETTE[0].value);
  }

  async function salvarEdicao() {
    if (!pateoId || !editModal) return;
    try {
      const atualizado = await atualizarZona(pateoId, editModal.id, {
        nome: novoNome.trim() || editModal.nome,
        coordenadasWKT: editModal.coordenadasWKT,
      });
      setZonas((list) =>
        list.map((i) =>
          i.id === editModal.id ? { ...atualizado, cor: novaCor } : i
        )
      );
      setEditModal(null);
    } catch {
      Alert.alert(t("error"), t("failed_update"));
    }
  }

  function excluirZona(id: string) {
    Alert.alert(t("delete"), t("delete_confirmation"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete_general"),
        style: "destructive",
        onPress: async () => {
          if (!pateoId) return;
          await deletarZona(pateoId, id);
          setZonas((z) => z.filter((i) => i.id !== id));
        },
      },
    ]);
  }

  const zonasFiltradas = zonas.filter((z) =>
    z.nome.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <SafeAreaWrapper>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <AppHeader title={t("title")} showBack />

        {/* MAPA + TOOLBAR */}
        <View className="px-4 py-12">
          <View className="rounded-3xl dark:border-zinc-800 bg-white dark:bg-[#151515] shadow-lg overflow-hidden">
            {/* Header do card */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
              <View>
                <Text className="text-[#130F26] text-xl dark:text-white font-semibold">
                  {t("map")}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-lightGray">
                  {t("description")}
                </Text>
              </View>

              {/* Chips de status */}
              <View className="flex-row gap-2">
                <Chip icon="map" label={`${zonas.length} ${t("zone")}`} />
              </View>
            </View>

            {/* Campo de busca */}
            <View className="px-4 pt-3">
              <View
                className={`flex-row items-center rounded-2xl px-3 ${
                  isDark ? "bg-[#0F0F0F]" : "bg-gray-100"
                }`}
              >
                <Ionicons
                  name="search-outline"
                  size={18}
                  color={isDark ? "#B3B3B3" : "#555"}
                />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder={t("search")}
                  placeholderTextColor={isDark ? "#999" : "#888"}
                  className={`flex-1 px-2 py-2 ${
                    isDark ? "text-white" : "text-black"
                  }`}
                />
              </View>
            </View>

            {/* Canvas */}
            <View className="px-3 py-3">
              {loading || !pateo ? (
                <View className="h-64 items-center justify-center">
                  <ActivityIndicator size="large" color="#130F26" />
                  <Text className="text-gray-500 dark:text-gray-300 mt-2">
                    {t("loading")}
                  </Text>
                </View>
              ) : (
                <Pressable
                  onPress={handleCanvasPress}
                  disabled={mode !== "draw"}
                  className={`rounded-2xl ${
                    isDark ? "bg-[#0B0B0B]" : "bg-white"
                  }`}
                  style={{ overflow: "hidden", padding: CANVAS_MARGIN }}
                >
                  <ImageBackground
                    source={{ uri: pateo?.plantaBaixaUrl }}
                    style={{ width: viewWidth, height: viewHeight }}
                    resizeMode="contain"
                  >
                    <Svg height={viewHeight} width={viewWidth}>
                      {zonasFiltradas.map((z) => (
                        <Polygon
                          key={z.id}
                          points={polygonToPoints(
                            z.coordenadasWKT,
                            viewWidth,
                            viewHeight
                          )}
                          fill={`${z.cor || "#3B82F6"}33`}
                          stroke={z.cor || "#3B82F6"}
                          strokeWidth={2}
                        />
                      ))}

                      {pontos.length > 0 && (
                        <>
                          <Polygon
                            points={pontos
                              .map((p) => `${p.x},${p.y}`)
                              .join(" ")}
                            fill={`${corZona}33`}
                            stroke={corZona}
                            strokeWidth={2}
                          />
                          {pontos.map((p, i) => (
                            <Circle
                              key={i}
                              cx={p.x}
                              cy={p.y}
                              r="4"
                              fill={corZona}
                            />
                          ))}
                        </>
                      )}
                    </Svg>
                  </ImageBackground>

                  {/* Toolbar flutuante */}
                  <View className="absolute right-3 top-6 gap-2">
                    <ToolbarBtn
                      active={mode === "draw"}
                      icon="pencil"
                      label={t("draw")}
                      onPress={() =>
                        setMode((m) => (m === "draw" ? "idle" : "draw"))
                      }
                    />
                    <ToolbarBtn
                      icon="trash-outline"
                      label={t("clear")}
                      onPress={clearDraft}
                      disabled={pontos.length === 0}
                      tone="danger"
                    />
                  </View>

                  {/* Legenda */}
                  <View className="absolute left-3 bottom-3 rounded-xl px-3 py-2 bg-black/40">
                    <Text className="text-white text-[11px]">
                      {mode === "draw" ? t("add_vertex") : t("start_drawing")}
                    </Text>
                  </View>
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {/* FORM */}
        <View className="px-4 mt-4">
          <View className="rounded-3xl  dark:border-zinc-800 bg-white dark:bg-[#151515] shadow-md p-4">
            <InputField
              label={t("new_zone")}
              value={nomeZona}
              onChangeText={setNomeZona}
              placeholder={t("example")}
            />

            <Text className="text-lg text-gray-500 dark:text-white mb-2">
              {t("color")}
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {PALETTE.map((c) => (
                <TouchableOpacity
                  key={c.value}
                  onPress={() => setCorZona(c.value)}
                  className="w-9 h-9 rounded-full border-[3px]"
                  style={{
                    backgroundColor: c.value,
                    borderColor:
                      corZona === c.value
                        ? isDark
                          ? "#FFFFFF"
                          : "#130F26"
                        : "transparent",
                  }}
                  activeOpacity={0.85}
                />
              ))}
            </View>

            <Button
              label={t("save")}
              onPress={salvarZona}
              disabled={saving}
              className={`flex-row items-center justify-center gap-2 rounded-2xl py-3 ${
                saving ? "opacity-70" : ""
              } bg-[#130F26]`}
            />
          </View>
        </View>

        {/* LISTA */}
        <View className="px-4 mt-5 mb-10">
          <Text
            className={`text-lg font-bold mb-3 ${
              isDark ? "text-white" : "text-[#130F26]"
            }`}
          >
            {t("zones_created")}
          </Text>

          {zonasFiltradas.length === 0 ? (
            <EmptyState />
          ) : (
            zonasFiltradas.map((z) => (
              <ActivityItem
                key={z.id}
                plate={z.nome}
                desc={`ID: ${z.id}`}
                icon="map-outline"
                color={z.cor || "#3B82F6"}
                actions={[
                  {
                    icon: "create-outline",
                    onPress: () => abrirEdicao(z),
                    backgroundColor: "#130F26",
                  },
                  {
                    icon: "trash-outline",
                    onPress: () => excluirZona(z.id),
                    backgroundColor: "#c92b2b",
                  },
                ]}
              />
            ))
          )}
        </View>

        {/* MODAL EDIÇÃO */}
        <Modal visible={!!editModal} animationType="fade" transparent>
          <View className="flex-1 bg-black/40 justify-center items-center">
            <View
              className={`w-11/12 rounded-3xl p-6 ${
                isDark ? "bg-[#121212]" : "bg-white"
              }`}
            >
              <Text
                className={`text-lg font-bold mb-4 ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                {t("edit_zone")}
              </Text>

              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {t("name")}
              </Text>
              <TextInput
                value={novoNome}
                onChangeText={setNovoNome}
                placeholder={t("name")}
                placeholderTextColor={isDark ? "#A1A1AA" : "#9CA3AF"}
                className={`rounded-2xl px-4 py-3 mb-4 border ${
                  isDark
                    ? "bg-[#0F0F0F] border-zinc-800 text-white"
                    : "bg-white border-gray-200 text-black"
                }`}
              />

              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {t("color")}
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-5">
                {PALETTE.map((c) => (
                  <TouchableOpacity
                    key={c.value}
                    onPress={() => setNovaCor(c.value)}
                    className="w-9 h-9 rounded-full border-[3px]"
                    style={{
                      backgroundColor: c.value,
                      borderColor:
                        novaCor === c.value
                          ? isDark
                            ? "#FFFFFF"
                            : "#130F26"
                          : "transparent",
                    }}
                  />
                ))}
              </View>

              <View className="flex-row justify-end gap-2">
                <TouchableOpacity
                  onPress={() => setEditModal(null)}
                  className="px-4 py-2 rounded-2xl border border-gray-300 dark:border-zinc-700"
                >
                  <Text className="text-[#130F26] dark:text-white font-semibold">
                    {t("cancel")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={salvarEdicao}
                  className="px-4 py-2 rounded-2xl bg-[#130F26]"
                >
                  <Text className="text-white font-semibold">{t("save")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

function Chip({
  icon,
  label,
  tone = "default",
}: {
  icon: any;
  label: string;
  tone?: "default" | "blue";
}) {
  const bg =
    tone === "blue"
      ? "bg-blue-50 dark:bg-[#0F172A]"
      : "bg-gray-100 dark:bg-[#0F0F0F]";
  const fg =
    tone === "blue"
      ? "text-blue-700 dark:text-blue-200"
      : "text-gray-700 dark:text-white";
  const ic = tone === "blue" ? "#2563EB" : "#9CA3AF";
  return (
    <View
      className={`px-2.5 py-1 rounded-xl flex-row items-center gap-1.5 ${bg}`}
    >
      <Ionicons name={icon} size={18} color={ic} />
      <Text className={`text-[16px] ${fg}`}>{label}</Text>
    </View>
  );
}

function ToolbarBtn({
  icon,
  label,
  onPress,
  disabled,
  active,
  tone = "default",
}: {
  icon: any;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  active?: boolean;
  tone?: "default" | "danger";
}) {
  const bg = active
    ? "bg-[#130F26]"
    : tone === "danger"
    ? "bg-red-500"
    : "bg-black/60";
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`rounded-2xl px-3 py-2 items-center shadow-lg ${bg} ${
        disabled ? "opacity-40" : ""
      }`}
      activeOpacity={0.85}
    >
      <View className="flex-row items-center gap-2">
        <Ionicons name={icon} size={14} color="#fff" />
        <Text className="text-white text-xs font-semibold">{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View className="items-center justify-center py-10 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-[#111111]">
      <Ionicons name="layers-outline" size={28} color="#94A3B8" />
      <Text className="mt-2 text-gray-500 dark:text-white text-sm">
        {t("none_found")}
      </Text>
      <Text className="text-gray-400 dark:text-white text-xs">
        {t("first_zone")}
      </Text>
    </View>
  );
}
