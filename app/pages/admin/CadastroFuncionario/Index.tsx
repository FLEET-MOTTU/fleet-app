// ListagemFuncionarios.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  TextInput,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  listarFuncionarios,
  deletarFuncionario,
  FuncionarioResponse,
  StatusFuncionario,
} from "./services/funcionarioService";
import FuncionarioForm from "./components/FuncionarioFrom";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import { useColorScheme } from "nativewind";
import Operadores from "../assets/img_operadores.svg";
import AppHeader from "../../../components/AppHeader";
import { useTranslation } from "react-i18next";

/** Chips de filtro: ATIVO | SUSPENSO | REMOVIDO */
type Filtro = "TODOS" | "ATIVO" | "SUSPENSO" | "REMOVIDO";

export default function ListagemFuncionarios() {
  const { t } = useTranslation("operadores");
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const chips: { k: Filtro; label: string }[] = [
    { k: "TODOS", label: t("chips_all") },
    { k: "ATIVO", label: t("chips_active") },
    { k: "SUSPENSO", label: t("chips_suspended") },
    { k: "REMOVIDO", label: t("chips_removed") },
  ];

  function statusVisual(st: StatusFuncionario) {
    switch (st) {
      case "ATIVO":
        return {
          bg: "bg-green-100 dark:bg-green-800/40",
          text: "text-green-700 dark:text-green-400",
          label: t("status_active"),
        };
      case "SUSPENSO":
        return {
          bg: "bg-amber-100 dark:bg-amber-800/40",
          text: "text-amber-700 dark:text-amber-300",
          label: t("status_suspended"),
        };
      case "REMOVIDO":
        return {
          bg: "bg-red-100 dark:bg-red-800/40",
          text: "text-red-700 dark:text-red-400",
          label: t("status_removed"),
        };
    }
  }

  const [funcionarios, setFuncionarios] = useState<FuncionarioResponse[]>([]);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("TODOS");
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] =
    useState<FuncionarioResponse | null>(null);

  const carregarFuncionarios = useCallback(async () => {
    try {
      const statusParam: StatusFuncionario | undefined =
        filtro === "ATIVO" || filtro === "SUSPENSO" || filtro === "REMOVIDO"
          ? filtro
          : undefined;

      const data = await listarFuncionarios(statusParam);

      const normalizados = (data || []).map((f) => ({
        ...f,
        status: (f.status as StatusFuncionario) ?? statusParam ?? "ATIVO",
      }));

      setFuncionarios(normalizados);
    } catch {
      Alert.alert(t("error_title"), t("error_load"));
    }
  }, [filtro, t]);

  useEffect(() => {
    carregarFuncionarios();
  }, [carregarFuncionarios]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarFuncionarios();
    setRefreshing(false);
  }, [carregarFuncionarios]);

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(t("confirm_remove_title"), t("confirm_remove_message"), [
        { text: t("actions_cancel"), style: "cancel" },
        {
          text: t("actions_remove"),
          style: "destructive",
          onPress: async () => {
            try {
              await deletarFuncionario(id); // soft delete -> vira REMOVIDO
              carregarFuncionarios();
            } catch {
              Alert.alert(t("error_title"), t("error_remove"));
            }
          },
        },
      ]);
    },
    [carregarFuncionarios, t]
  );

  /** Busca (client-side) */
  const funcionariosFiltrados = useMemo(() => {
    const bySearch = (f: FuncionarioResponse) =>
      f.nome?.toLowerCase().includes(search.toLowerCase().trim());

    return (funcionarios || []).filter(bySearch);
  }, [funcionarios, search]);

  /** ITEM */
  const renderFuncionario = useCallback(
    ({ item }: { item: FuncionarioResponse }) => {
      const st = (item.status as StatusFuncionario) ?? "ATIVO";
      const vis = statusVisual(st);

      const isRemovido = st === "REMOVIDO" || filtro === "REMOVIDO";

      return (
        <View
          className={`flex-row justify-between items-center rounded-xl p-4 mb-3 shadow-sm ${
            isDark ? "bg-[#111111]" : "bg-white border-gray-100"
          }`}
        >
          <View className="flex-row items-center gap-3 flex-1">
            {item.fotoUrl ? (
              <Image
                source={{ uri: item.fotoUrl }}
                className="w-12 h-12 rounded-full"
                accessibilityLabel={t("a11y_employee_photo")}
              />
            ) : (
              <View
                className="w-12 h-12 rounded-3xl bg-darkBlue/30 dark:bg-zinc-700"
                accessibilityLabel={t("a11y_employee_photo_placeholder")}
              />
            )}

            <View className="flex-1">
              <Text className="text-base font-semibold dark:text-white">
                {item.nome}
              </Text>
              <Text className="text-[11px] text-gray-400 dark:text-lightGray">
                {t("id_label")} {item.id?.slice(0, 6)}
              </Text>
            </View>

            <View className={`px-3 py-1 rounded-full mr-2 ${vis.bg}`}>
              <Text className={`text-xs font-semibold ${vis.text}`}>
                {vis.label}
              </Text>
            </View>

            <View className="flex-row items-center">
              {!isRemovido && (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedFuncionario(item);
                      setModalVisible(true);
                    }}
                    className="p-2"
                    accessibilityLabel={t("a11y_edit_employee")}
                  >
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={isDark ? "#A78BFA" : "#6D28D9"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    className="p-2"
                    accessibilityLabel={t("a11y_delete_employee")}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={isDark ? "#F87171" : "#DC2626"}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      );
    },
    [handleDelete, isDark, filtro, t]
  );

  /** HEADER: busca + chips */
  const ListHeader = (
    <>
      <View
        className={[
          "flex-row items-center rounded-2xl mt-3 mb-4 px-4 py-1 gap-2",
          isDark ? "bg-[#0D0D0D]" : "bg-white",
          isDark ? "border border-[#2A2A2A]" : "border border-[#E5E7EB]",
          !isDark ? "shadow-sm" : "",
        ].join(" ")}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={isDark ? "#A1A1AA" : "#6B7280"}
        />

        <TextInput
          placeholder={t("search_placeholder")}
          placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
          value={search}
          onChangeText={setSearch}
          className={`flex-1 ${isDark ? "text-white" : "text-gray-800"}`}
          accessibilityLabel={t("a11y_search_input")}
        />
      </View>

      <View className="flex-row gap-2 mb-4">
        {chips.map((c) => {
          const active = filtro === c.k;
          return (
            <TouchableOpacity
              key={c.k}
              onPress={() => setFiltro(c.k)}
              className={`px-4 py-2 rounded-2xl border ${
                active
                  ? "bg-[#130F26] border-[#130F26]"
                  : isDark
                  ? "bg-[#0F0F0F] border-zinc-800"
                  : "bg-white border-gray-200"
              }`}
              accessibilityLabel={t("a11y_filter_chip", { label: c.label })}
            >
              <Text
                className={`text-xs font-semibold ${
                  active
                    ? "text-white"
                    : isDark
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                {c.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );

  /** Empty global (realmente sem ninguém na base) */
  const EmptyState = (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <AppHeader title={t("title")} />
      <View className="items-center mt-6">
        <Operadores width={180} height={180} />
        <Text className="text-lg font-bold mt-4 dark:text-white">
          {t("empty_global_title")}
        </Text>
        <Text className="text-gray-500 text-center mb-6 dark:text-gray-300">
          {t("empty_global_subtitle")}
        </Text>
        <TouchableOpacity
          className="bg-[#130F26] px-6 py-3 rounded-xl"
          onPress={() => setModalVisible(true)}
          accessibilityLabel={t("a11y_add_employee")}
        >
          <Text className="text-white font-semibold">{t("actions_add")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  /** Mensagem quando o filtro não tem resultados (mantém a tela) */
  const ListEmptyComponent = (
    <View className="items-center py-10">
      <Text className="text-sm text-gray-500 dark:text-white">
        {t("empty_filter")}
      </Text>
    </View>
  );

  const showGlobalEmpty =
    funcionarios.length === 0 && !search && filtro === "TODOS";

  return (
    <SafeAreaWrapper>
      {showGlobalEmpty ? (
        EmptyState
      ) : (
        <>
          <AppHeader title={t("title")} showBack />
          <FlatList
            data={funcionariosFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={renderFuncionario}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={ListEmptyComponent}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 96,
              flexGrow: 1,
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />
          {/* FAB */}
          <TouchableOpacity
            className="absolute bottom-8 right-8 bg-[#130F26] w-14 h-14 rounded-full justify-center items-center shadow-lg"
            onPress={() => {
              setSelectedFuncionario(null);
              setModalVisible(true);
            }}
            accessibilityLabel={t("a11y_fab_add")}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </>
      )}

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <FuncionarioForm
          funcionario={selectedFuncionario}
          funcionariosExistentes={funcionarios}
          onClose={() => {
            setModalVisible(false);
            carregarFuncionarios();
          }}
        />
      </Modal>
    </SafeAreaWrapper>
  );
}
