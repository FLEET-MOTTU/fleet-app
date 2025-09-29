import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  listarFuncionarios,
  deletarFuncionario,
  FuncionarioResponse,
} from "../../services/funcionarioService";
import FuncionarioForm from "../../components/FuncionarioFrom";
import SafeAreaWrapper from "../../../../../utils/safeAreaWrapper";
import { useNavigation } from "@react-navigation/native";
import AppHeader from "../../../../../components/AppHeader";

export default function ListagemFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<FuncionarioResponse[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] =
    useState<FuncionarioResponse | null>(null);

  const navigation = useNavigation();

  async function carregarFuncionarios() {
    try {
      const data = await listarFuncionarios();
      setFuncionarios(data);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os funcionários.");
    }
  }

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  async function handleDelete(id: string) {
    Alert.alert("Confirmação", "Deseja excluir este funcionário?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deletarFuncionario(id);
          carregarFuncionarios();
        },
      },
    ]);
  }

  function renderFuncionario({ item }: { item: FuncionarioResponse }) {
    return (
      <View className="flex-row justify-between items-center px-6 py-16 border-b border-gray-200 dark:border-gray-700">
        <View>
          <Text className="text-base font-semibold dark:text-white">
            {item.nome}
          </Text>
          <Text className="text-gray-500 dark:text-gray-300">
            {item.telefone}
          </Text>
        </View>
        <View className="flex-row space-x-5">
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedFuncionario(item);
              setModalVisible(true);
            }}
          >
            <Ionicons name="pencil-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaWrapper>
      {/* Header */}

      <AppHeader title="Operadores" showBack />

      {funcionarios.length === 0 ? (
        // Tela vazia
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-xl font-bold mb-2 dark:text-white">Vazio</Text>
          <Text className="text-gray-500 text-center mb-6 dark:text-gray-300">
            Você ainda não adicionou nenhum operador no pátio.
          </Text>
          <TouchableOpacity
            className="bg-darkBlue px-6 py-3 rounded-xl"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-white font-semibold">+ Adicionar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Lista de funcionários
        <>
          <FlatList
            data={funcionarios}
            keyExtractor={(item) => item.id}
            renderItem={renderFuncionario}
          />
          <TouchableOpacity
            className="absolute bottom-8 right-8 bg-darkBlue w-14 h-14 rounded-full justify-center items-center"
            onPress={() => {
              setSelectedFuncionario(null);
              setModalVisible(true);
            }}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </>
      )}

      {/* Modal Form */}
      <Modal visible={modalVisible} animationType="slide">
        <FuncionarioForm
          funcionario={selectedFuncionario}
          onClose={() => {
            setModalVisible(false);
            carregarFuncionarios();
          }}
        />
      </Modal>
    </SafeAreaWrapper>
  );
}
