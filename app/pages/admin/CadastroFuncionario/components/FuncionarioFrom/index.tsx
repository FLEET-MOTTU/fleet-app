import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  cadastrarFuncionario,
  atualizarFuncionario,
  FuncionarioPayload,
  FuncionarioResponse,
} from "../../services/funcionarioService";
import SafeAreaWrapper from "../../../../../utils/safeAreaWrapper";
import { useColorScheme } from "react-native";

export default function FuncionarioForm({
  funcionario,
  onClose,
  funcionariosExistentes = [],
}: {
  funcionario: FuncionarioResponse | null;
  onClose: () => void;
  funcionariosExistentes?: FuncionarioResponse[];
}) {
  const colorScheme = useColorScheme();
  const [nome, setNome] = useState(funcionario?.nome || "");
  const [telefone, setTelefone] = useState(funcionario?.telefone || "");
  const [funcao, setFuncao] = useState<
    "OPERACIONAL" | "ADMINISTRATIVO" | "TEMPORARIO"
  >((funcionario?.cargo as any) || "OPERACIONAL");

  function formatarTelefone(text: string) {
    const numeros = text.replace(/\D/g, "");
    let formatado = numeros.replace(
      /(\d{0,2})(\d{0,5})(\d{0,4})/,
      (_, ddd, parte1, parte2) => {
        let result = "";
        if (ddd) result += `(${ddd}`;
        if (ddd && ddd.length === 2) result += ") ";
        if (parte1) result += parte1;
        if (parte2) result += `-${parte2}`;
        return result;
      }
    );
    setTelefone(formatado);
  }

  async function handleSave() {
    if (!nome || !telefone) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    const telefoneNormalizado = telefone.replace(/\D/g, "");
    if (telefoneNormalizado.length !== 11) {
      Alert.alert("Erro", "O celular deve ter 11 dígitos com DDD.");
      return;
    }

    const jaExiste =
      !funcionario &&
      funcionariosExistentes.some((f) => f.telefone === telefoneNormalizado);

    if (jaExiste) {
      Alert.alert("Erro", "Já existe um funcionário com esse telefone.");
      return;
    }

    const payload: FuncionarioPayload = {
      nome,
      telefone: telefoneNormalizado,
      cargo: funcao,
      status: funcionario?.status || "ATIVO",
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
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Falha ao salvar funcionário."
      );
    }
  }

  return (
    <SafeAreaWrapper>
      <View className="flex-1 p-6">
        {/* Título */}
        <Text className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {funcionario ? "Editar Funcionário" : "Novo Funcionário"}
        </Text>

        {/* Campo Nome */}
        <TextInput
          placeholder="Nome"
          placeholderTextColor="#9CA3AF"
          value={nome}
          onChangeText={setNome}
          className="border border-gray-300 dark:border-[#333] rounded-xl px-4 py-3 mb-4 bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-white"
        />

        {/* Campo Celular */}
        <TextInput
          placeholder="Celular"
          placeholderTextColor="#9CA3AF"
          value={telefone}
          onChangeText={formatarTelefone}
          keyboardType="phone-pad"
          maxLength={15}
          className="border border-gray-300 dark:border-[#333] rounded-xl px-4 py-3 mb-4 bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-white"
        />

        {/* Função */}
        <Text className="mb-2 font-semibold text-gray-700 dark:text-white">
          Função
        </Text>
        <View className="border border-gray-300 dark:border-[#333] rounded-xl mb-6 bg-white dark:bg-[#1E1E1E]">
          <Picker
            selectedValue={funcao}
            dropdownIconColor={colorScheme === "dark" ? "#9CA3AF" : "#374151"}
            onValueChange={(itemValue) => setFuncao(itemValue)}
            style={{
              color: colorScheme === "dark" ? "#F9FAFB" : "#111827",
              backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
            }}
          >
            <Picker.Item label="Operacional" value="OPERACIONAL" />
            <Picker.Item label="Administrativo" value="ADMINISTRATIVO" />
            <Picker.Item label="Temporário" value="TEMPORARIO" />
          </Picker>
        </View>

        {/* Botão principal */}
        <TouchableOpacity
          onPress={handleSave}
          className="py-3 rounded-xl bg-darkBlue active:opacity-90"
        >
          <Text className="text-white text-center font-semibold text-base">
            {funcionario ? "Salvar Alterações" : "Cadastrar"}
          </Text>
        </TouchableOpacity>

        {/* Cancelar */}
        <TouchableOpacity onPress={onClose} className="mt-4">
          <Text className="text-center text-gray-500 dark:text-red-400">
            Cancelar
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
}
