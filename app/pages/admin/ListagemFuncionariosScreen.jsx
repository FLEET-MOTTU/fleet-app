import { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import API from "../../services/api";

export default function ListagemFuncionariosScreen() {
  const [funcionarios, setFuncionarios] = useState([]);

  const buscarFuncionarios = async () => {
    try {
      const response = await API.get("/usuarios");
      setFuncionarios(response.data);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    }
  };

  useEffect(() => {
    buscarFuncionarios();
  }, []);

  return (
    <View className="flex-1 bg-white px-6 pt-10">
      <Text className="text-2xl font-bold mb-6 text-gray-800">
        Funcionários Cadastrados
      </Text>

      <FlatList
        data={funcionarios}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text className="text-gray-500">Nenhum funcionário cadastrado.</Text>
        }
        renderItem={({ item }) => (
          <View className="mb-4 p-4 bg-gray-100 rounded-xl">
            <Text className="font-bold text-base">{item.nome}</Text>
            <Text className="text-gray-600">Telefone: {item.telefone}</Text>
            <Text className="text-gray-600">Cargo: {item.cargo}</Text>
            <TouchableOpacity
              onPress={() => Alert.alert("Link ainda não implementado")}
              className="mt-3 bg-blue-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white text-sm font-medium text-center">
                Gerar link
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
