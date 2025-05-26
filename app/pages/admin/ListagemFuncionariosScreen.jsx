import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  atualizarFuncionario,
  deletarFuncionario,
  listarFuncionarios,
} from "../../services/funcionarioService";

export default function ListagemFuncionariosScreen() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

  const carregarFuncionarios = async () => {
    try {
      const response = await listarFuncionarios();
      setFuncionarios(response.data);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      Alert.alert("Erro", "Não foi possível carregar os funcionários.");
    }
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const abrirModalEdicao = (func) => {
    setFuncionarioSelecionado({ ...func });
    setModalVisible(true);
  };

  const salvarEdicao = async () => {
    try {
      await atualizarFuncionario(
        funcionarioSelecionado.id,
        funcionarioSelecionado
      );
      Alert.alert("Sucesso", "Funcionário atualizado com sucesso!");
      setModalVisible(false);
      carregarFuncionarios();
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
      Alert.alert("Erro", "Não foi possível atualizar o funcionário.");
    }
  };

  const excluirFuncionario = async (id, nome) => {
    Alert.alert("Confirmar exclusão", `Deseja excluir ${nome}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deletarFuncionario(id);
            Alert.alert("Excluído", "Funcionário removido com sucesso.");
            carregarFuncionarios();
          } catch (error) {
            console.error("Erro ao excluir funcionário:", error);
            Alert.alert("Erro", "Não foi possível excluir o funcionário.");
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white px-6 pt-10">
      <Text className="text-2xl font-bold mb-6 text-gray-800">
        Funcionários Cadastrados
      </Text>

      <FlatList
        data={funcionarios}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text className="text-gray-500">Nenhum funcionário cadastrado.</Text>
        }
        renderItem={({ item }) => (
          <View className="mb-4 p-4 bg-gray-100 rounded-xl shadow-sm">
            <Text className="font-bold text-lg text-gray-800">{item.nome}</Text>
            <Text className="text-gray-700">Telefone: {item.telefone}</Text>
            <Text className="text-gray-700">Cargo: {item.cargo}</Text>
            <Text className="text-gray-700">
              Status: {item.status ?? "Ativo"}
            </Text>
            {item.ultimoLogin && (
              <Text className="text-gray-500 text-sm">
                Último login:{" "}
                {new Date(item.ultimoLogin).toLocaleDateString("pt-BR")}
              </Text>
            )}

            <View className="flex-row gap-2 mt-2">
              <TouchableOpacity
                className="bg-yellow-500 px-4 py-2 rounded"
                onPress={() => abrirModalEdicao(item)}
              >
                <Text className="text-white">Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-red-500 px-4 py-2 rounded"
                onPress={() => excluirFuncionario(item.id, item.nome)}
              >
                <Text className="text-white">Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal de edição */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/40 px-4">
          <View className="bg-white rounded-xl p-6 w-full">
            <Text className="text-xl font-bold mb-4">Editar Funcionário</Text>

            <TextInput
              placeholder="Nome"
              value={funcionarioSelecionado?.nome}
              onChangeText={(text) =>
                setFuncionarioSelecionado((prev) => ({ ...prev, nome: text }))
              }
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
            />
            <TextInput
              placeholder="Telefone"
              value={funcionarioSelecionado?.telefone}
              onChangeText={(text) =>
                setFuncionarioSelecionado((prev) => ({
                  ...prev,
                  telefone: text,
                }))
              }
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
              keyboardType="phone-pad"
            />

            <Text className="mb-2 font-semibold">Função</Text>
            <View className="border border-gray-300 rounded-xl mb-4 overflow-hidden">
              <Picker
                selectedValue={funcionarioSelecionado?.cargo}
                onValueChange={(val) =>
                  setFuncionarioSelecionado((prev) => ({ ...prev, cargo: val }))
                }
              >
                <Picker.Item label="Operacional" value="Operacional" />
                <Picker.Item label="Administrativo" value="Administrativo" />
                <Picker.Item label="Temporário" value="Temporário" />
              </Picker>
            </View>

            <TouchableOpacity
              onPress={salvarEdicao}
              className="bg-green-600 py-3 rounded-xl mb-2"
            >
              <Text className="text-white text-center font-semibold text-base">
                Salvar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text className="text-center text-gray-500 text-sm">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
