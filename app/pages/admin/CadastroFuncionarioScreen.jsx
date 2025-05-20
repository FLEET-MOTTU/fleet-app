import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import API from "../../services/api";

export default function CadastroFuncionarioScreen() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cargo, setCargo] = useState("");

  const handleCadastrar = async () => {
    if (!nome || !telefone || !cargo) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      await API.post("/funcionarios", {
        nome,
        telefone,
        cargo,
      });
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
        className="bg-blue-600 py-3 rounded-xl"
      >
        <Text className="text-white text-center font-semibold text-base">
          Cadastrar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
