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

/** Chips de filtro: ATIVO | SUSPENSO | REMOVIDO */
type Filtro = "TODOS" | "ATIVO" | "SUSPENSO" | "REMOVIDO";

const chips: { k: Filtro; label: string }[] = [
  { k: "TODOS", label: "Todos" },
  { k: "ATIVO", label: "Ativos" },
  { k: "SUSPENSO", label: "Suspensos" },
  { k: "REMOVIDO", label: "Removidos" },
];

function statusVisual(st: StatusFuncionario) {
  switch (st) {
    case "ATIVO":
      return {
        bg: "bg-green-100 dark:bg-green-800/40",
        text: "text-green-700 dark:text-green-400",
        label: "Ativo",
      };
    case "SUSPENSO":
      return {
        bg: "bg-amber-100 dark:bg-amber-800/40",
        text: "text-amber-700 dark:text-amber-300",
        label: "Suspenso",
      };
    case "REMOVIDO":
      return {
        bg: "bg-red-100 dark:bg-red-800/40",
        text: "text-red-700 dark:text-red-400",
        label: "Removido",
      };
  }
}

export default function ListagemFuncionarios() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

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
      Alert.alert("Erro", "Não foi possível carregar os funcionários.");
    }
  }, [filtro]);

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
      Alert.alert("Confirmação", "Deseja remover este funcionário?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await deletarFuncionario(id); // soft delete -> vira REMOVIDO
              carregarFuncionarios();
            } catch {
              Alert.alert("Erro", "Não foi possível remover.");
            }
          },
        },
      ]);
    },
    [carregarFuncionarios]
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

      // dentro do renderFuncionario
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
              />
            ) : (
              <View className="w-12 h-12 rounded-3xl bg-darkBlue/30 dark:bg-zinc-700" />
            )}

            <View className="flex-1">
              <Text className="text-base font-semibold dark:text-white">
                {item.nome}
              </Text>
              <Text className="text-[11px] text-gray-400 dark:text-gray-500">
                ID: {item.id?.slice(0, 6)}
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
    [handleDelete, isDark]
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
          placeholder="Buscar funcionários..."
          placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
          value={search}
          onChangeText={setSearch}
          className={`flex-1 ${isDark ? "text-white" : "text-gray-800"}`}
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
            >
              <Text
                className={`text-xs font-semibold ${
                  active
                    ? "text-white"
                    : isDark
                    ? "text-gray-200"
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
      <AppHeader title="Funcionários" />
      <View className="items-center mt-6">
        <Operadores width={180} height={180} />
        <Text className="text-lg font-bold mt-4 dark:text-white">
          Nenhum funcionário
        </Text>
        <Text className="text-gray-500 text-center mb-6 dark:text-gray-300">
          Você ainda não adicionou nenhum funcionário neste pátio.
        </Text>
        <TouchableOpacity
          className="bg-[#130F26] px-6 py-3 rounded-xl"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white font-semibold">+ Adicionar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  /** Mensagem quando o filtro não tem resultados (mantém a tela) */
  const ListEmptyComponent = (
    <View className="items-center py-10">
      <Text className="text-sm text-gray-500 dark:text-gray-300">
        Nenhum funcionário para o filtro selecionado.
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
          <AppHeader title="Funcionários" showBack />
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
