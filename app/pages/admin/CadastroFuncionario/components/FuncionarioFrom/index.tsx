import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  cadastrarFuncionario,
  atualizarFuncionario,
  FuncionarioPayload,
  FuncionarioResponse,
} from "../../services/funcionarioService";

export default function FuncionarioForm({
  funcionario,
  onClose,
}: {
  funcionario: FuncionarioResponse | null;
  onClose: () => void;
}) {
  const [nome, setNome] = useState(funcionario?.nome || "");
  const [telefone, setTelefone] = useState(funcionario?.telefone || "");
  const [funcao, setFuncao] = useState<
    "OPERACIONAL" | "ADMINISTRATIVO" | "TEMPORARIO"
  >((funcionario?.cargo as any) || "OPERACIONAL");

  async function handleSave() {
    if (!nome || !telefone) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    const payload: FuncionarioPayload = {
      nome,
      telefone,
      cargo: funcao,
      status: "ATIVO",
    };

    try {
      if (funcionario) {
        await atualizarFuncionario(funcionario.id, payload);
        Alert.alert("Sucesso", "Funcionário atualizado.");
      } else {
        await cadastrarFuncionario(payload);
        Alert.alert("Sucesso", "Funcionário cadastrado.");
      }
      onClose();
    } catch {
      Alert.alert("Erro", "Falha ao salvar funcionário.");
    }
  }

  return (
    <View className="flex-1 bg-white dark:bg-darkBlue p-6">
      <Text className="text-2xl font-bold mb-6 dark:text-white">
        {funcionario ? "Editar Funcionário" : "Novo Funcionário"}
      </Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4 dark:bg-gray-800 dark:text-white"
      />
      <TextInput
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4 dark:bg-gray-800 dark:text-white"
      />

      <Text className="mb-2 font-semibold dark:text-white">Função</Text>
      <View className="border border-gray-300 rounded-xl mb-6 dark:border-gray-600">
        <Picker
          selectedValue={funcao}
          onValueChange={(itemValue) => setFuncao(itemValue)}
        >
          <Picker.Item label="Operacional" value="OPERACIONAL" />
          <Picker.Item label="Administrativo" value="ADMINISTRATIVO" />
          <Picker.Item label="Temporário" value="TEMPORARIO" />
        </Picker>
      </View>

      <TouchableOpacity
        onPress={handleSave}
        className="bg-darkBlue py-3 rounded-xl"
      >
        <Text className="text-white text-center font-semibold text-base">
          {funcionario ? "Salvar Alterações" : "Cadastrar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose} className="mt-4">
        <Text className="text-center text-gray-500 dark:text-gray-300">
          Cancelar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
