import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

const MOCK_FUNCIONARIOS = [
  {
    id: "1",
    nome: "João Silva",
    telefone: "11999999999",
    cargo: "Reboque",
    codigo: "FUNC-001",
    status: "Ativo",
    dataAdmissao: "2024-01-10T00:00:00Z",
  },
  {
    id: "2",
    nome: "Maria Souza",
    telefone: "11988888888",
    cargo: "Administrativo",
    codigo: "FUNC-002",
    status: "Ativo",
    dataAdmissao: "2024-02-15T00:00:00Z",
  },
  {
    id: "3",
    nome: "Carlos Lima",
    telefone: "11977777777",
    cargo: "Temporário",
    codigo: "FUNC-003",
    status: "Inativo",
    dataAdmissao: "2024-03-20T00:00:00Z",
  },
];

export default function ListagemFuncionariosScreen() {
  const funcionarios = MOCK_FUNCIONARIOS;

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
            <Text className="text-gray-700">Código: {item.codigo}</Text>
            <Text className="text-gray-700">
              Status: {item.status ?? "Ativo"}
            </Text>
            {item.dataAdmissao && (
              <Text className="text-gray-500 text-sm">
                Admissão:{" "}
                {new Date(item.dataAdmissao).toLocaleDateString("pt-BR")}
              </Text>
            )}

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Funcionalidade pendente",
                  "O link ainda será implementado."
                )
              }
              className="mt-3 bg-blue-600 px-4 py-2 rounded-lg"
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
