import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import AppHeader from "../../../components/AppHeader";
import {
  setMockFuncionario,
  getMockFuncionario,
  clearMockFuncionario,
} from "../../../services/loginMock";

export default function DevLoginMock() {
  const [id, setId] = useState("FUNC-001");
  const [nome, setNome] = useState("Udyr");

  async function salvar() {
    await setMockFuncionario(id.trim(), nome.trim());
    const who = await getMockFuncionario();
    Alert.alert("OK", `Funcionário mock:\n${who.nome} (${who.id})`);
  }

  async function limpar() {
    await clearMockFuncionario();
    Alert.alert("OK", "Funcionário mock limpo.");
  }

  return (
    <SafeAreaWrapper>
      <AppHeader title="Login Mock" showBack />
      <View className="p-4 gap-3">
        <Text className="text-lg font-semibold">
          Preencha o funcionário (mock):
        </Text>
        <TextInput
          value={id}
          onChangeText={setId}
          placeholder="ID do funcionário"
          className="border rounded-xl px-4 py-3"
          keyboardType="default"
        />
        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Nome do funcionário"
          className="border rounded-xl px-4 py-3"
          keyboardType="default"
        />
        <TouchableOpacity
          onPress={salvar}
          className="bg-[#130F26] rounded-xl py-4"
        >
          <Text className="text-white text-center font-semibold">
            Salvar login mock
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={limpar}
          className="bg-gray-600 rounded-xl py-3"
        >
          <Text className="text-white text-center">Limpar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
}
