import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import {
  cadastrarFuncionario,
  listarFuncionarios,
  FuncionarioPayload,
  FuncionarioResponse,
} from "./services/funcionarioService";
import { loginAdmin } from "../../../services/loginAdmin";

export default function CadastroFuncionarioScreen() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [funcao, setFuncao] = useState<
    "OPERACIONAL" | "ADMINISTRATIVO" | "TEMPORARIO"
  >("OPERACIONAL");
  const [codigo, setCodigo] = useState(
    "FUNC-00" + Math.floor(Math.random() * 100)
  );
  const [dataAdmissao, setDataAdmissao] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [funcionarios, setFuncionarios] = useState<FuncionarioResponse[]>([]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dataAdmissao;
    setMostrarDatePicker(Platform.OS === "ios");
    setDataAdmissao(currentDate);
  };

  async function carregarFuncionarios() {
    try {
      const data = await listarFuncionarios();
      setFuncionarios(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os funcionários.");
    }
  }

  useEffect(() => {
    async function init() {
      try {
        // Login do admin (credenciais de teste do Swagger)
        await loginAdmin("pateo.admin@mottu.com", "mottu123");
        await carregarFuncionarios();
      } catch (err) {
        console.error(err);
        Alert.alert("Erro", "Falha ao autenticar administrador.");
      }
    }
    init();
  }, []);

  async function handleCadastrar() {
    if (!nome || !telefone || !funcao) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const payload: FuncionarioPayload = {
        nome,
        telefone,
        cargo: funcao,
      };

      const novoFuncionario = await cadastrarFuncionario(payload);

      const appMagicLink = novoFuncionario.magicLinkUrl
        ? novoFuncionario.magicLinkUrl.replace(
            "http://localhost:8080/auth/validar-token?valor=",
            "fleetapp://login-success?token="
          )
        : null;

      Alert.alert(
        "Funcionário cadastrado!",
        appMagicLink
          ? `Magic Link:\n${appMagicLink}`
          : "Não foi possível gerar o Magic Link"
      );

      setNome("");
      setTelefone("");
      setFuncao("OPERACIONAL");
      setCodigo("FUNC-00" + Math.floor(Math.random() * 100));
      setDataAdmissao(new Date());

      carregarFuncionarios();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.message || "Não foi possível cadastrar.");
    }
  }

  const renderFuncionario = ({ item }: { item: FuncionarioResponse }) => (
    <View className="border-b border-gray-200 py-3 px-6">
      <Text className="font-semibold">{item.nome}</Text>
      <Text className="text-gray-600">{item.telefone}</Text>
      <Text className="text-gray-600">{item.cargo}</Text>
      <Text className="text-gray-600">Status: {item.status || "ATIVO"}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={funcionarios}
        keyExtractor={(item) => item.id}
        renderItem={renderFuncionario}
        ListHeaderComponent={
          <View className="px-6 pt-10">
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
              keyboardType="phone-pad"
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
            />

            <Text className="mb-2 font-semibold">Função</Text>
            <View className="border border-gray-300 rounded-xl mb-4 overflow-hidden">
              <Picker
                selectedValue={funcao}
                onValueChange={(itemValue) => setFuncao(itemValue)}
              >
                <Picker.Item label="Operacional" value="OPERACIONAL" />
                <Picker.Item label="Administrativo" value="ADMINISTRATIVO" />
                <Picker.Item label="Temporário" value="TEMPORARIO" />
              </Picker>
            </View>

            <Text className="mb-2 font-semibold">Data de Admissão</Text>
            <TouchableOpacity
              onPress={() => setMostrarDatePicker(true)}
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4 bg-gray-50"
            >
              <Text className="text-gray-700">
                {dataAdmissao.toLocaleDateString("pt-BR")}
              </Text>
            </TouchableOpacity>
            {mostrarDatePicker && (
              <DateTimePicker
                value={dataAdmissao}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}

            <Text className="mb-2 font-semibold">Código do Funcionário</Text>
            <View className="border border-gray-300 rounded-xl px-4 py-3 mb-6 bg-gray-100">
              <Text className="text-gray-600">{codigo}</Text>
            </View>

            <TouchableOpacity
              onPress={handleCadastrar}
              className="bg-blue-600 py-3 rounded-xl mb-8"
            >
              <Text className="text-white text-center font-semibold text-base">
                Cadastrar
              </Text>
            </TouchableOpacity>

            <Text className="text-xl font-bold text-gray-800 mb-4">
              Funcionários Cadastrados
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}
