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
} from "./services/funcionarioService";
import FuncionarioForm from "./components/FuncionarioFrom";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import { useNavigation } from "@react-navigation/native";
import AppHeader from "../../../components/AppHeader";
import Operadores from "../assets/img_operadores.svg";

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
      <View className="flex-row justify-between items-center px-6 py-10 ">
        <View>
          <Text className="text-xl font-bold text-gray dark:text-lightGray">
            {item.nome}
          </Text>
          <Text className="text-lg text-gray-500 dark:text-lightGray">
            {item.telefone}
          </Text>
        </View>
        <View className="flex-row space-x-5">
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text className="text-black dark:text-white">
              <Ionicons name="trash-outline" size={22} />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedFuncionario(item);
              setModalVisible(true);
            }}
          >
            <Text className="text-black dark:text-white">
              <Ionicons name="pencil-outline" size={22} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaWrapper>
      <AppHeader title="Operadores" showBack />

      {funcionarios.length === 0 ? (
        <View className="flex-1 justify-center items-center p-6">
          <Operadores />
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
