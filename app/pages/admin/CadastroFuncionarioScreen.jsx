import { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import API from "../../services/api";

const MOCK_FUNCIONARIOS = [
  { id: "1", nome: "João Silva", telefone: "11999999999", cargo: "Reboque" },
  {
    id: "2",
    nome: "Maria Souza",
    telefone: "11988888888",
    cargo: "Operacional",
  },
  { id: "3", nome: "Carlos Lima", telefone: "11977777777", cargo: "Motorista" },
];

export default function CadastroFuncionarioScreen() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cargo, setCargo] = useState("");
  const [funcionarios, setFuncionarios] = useState(MOCK_FUNCIONARIOS);

  const handleCadastrar = async () => {
    if (!nome || !telefone || !cargo) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      // Simula cadastro mockado
      const novoFuncionario = {
        id: (funcionarios.length + 1).toString(),
        nome,
        telefone,
        cargo,
      };
      setFuncionarios([...funcionarios, novoFuncionario]);
      Alert.alert("Sucesso", "Funcionário cadastrado com sucesso!");
      setNome("");
      setTelefone("");
      setCargo("");
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error);
      Alert.alert("Erro", "Não foi possível cadastrar.");
    }
  };

  return (
    <View className="flex-1 px-6 pt-10 bg-white">
      <Text className="text-2xl font-bold text-gray-800 mb-6">
        Cadastrar Funcionário
      </Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />
      <TextInput
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Cargo (ex: Reboque, Operacional...)"
        value={cargo}
        onChangeText={setCargo}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-6"
      />

      <TouchableOpacity
        onPress={handleCadastrar}
        className="bg-blue-600 py-3 rounded-xl mb-8"
      >
        <Text className="text-white text-center font-semibold text-base">
          Cadastrar
        </Text>
      </TouchableOpacity>

      <Text className="text-xl font-bold text-gray-800 mb-2">Funcionários</Text>
      <FlatList
        data={funcionarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="border-b border-gray-200 py-3">
            <Text className="font-semibold">{item.nome}</Text>
            <Text className="text-gray-600">{item.telefone}</Text>
            <Text className="text-gray-600">{item.cargo}</Text>
          </View>
        )}
      />
    </View>
  );
}
