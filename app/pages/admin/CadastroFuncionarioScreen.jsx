import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CadastroFuncionarioScreen() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [funcao, setFuncao] = useState("Operacional");
  const [codigo, setCodigo] = useState(
    "FUNC-00" + Math.floor(Math.random() * 100)
  );
  const [dataAdmissao, setDataAdmissao] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dataAdmissao;
    setMostrarDatePicker(Platform.OS === "ios");
    setDataAdmissao(currentDate);
  };

  const salvarFuncionarios = async (lista) => {
    try {
      await AsyncStorage.setItem("funcionarios", JSON.stringify(lista));
    } catch (error) {
      console.error("Erro ao salvar no AsyncStorage:", error);
    }
  };

  const carregarFuncionarios = async () => {
    try {
      const dados = await AsyncStorage.getItem("funcionarios");
      if (dados) setFuncionarios(JSON.parse(dados));
    } catch (error) {
      console.error("Erro ao carregar do AsyncStorage:", error);
    }
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const handleCadastrar = async () => {
    if (!nome || !telefone || !funcao) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const novoFuncionario = {
      id: (funcionarios.length + 1).toString(),
      nome,
      telefone,
      cargo: funcao,
      codigo,
      status: "Ativo",
      dataAdmissao: dataAdmissao.toISOString(),
    };

    const novaLista = [...funcionarios, novoFuncionario];
    setFuncionarios(novaLista);
    await salvarFuncionarios(novaLista);
    Alert.alert("Sucesso", "Funcionário cadastrado com sucesso!");
    setNome("");
    setTelefone("");
    setFuncao("Operacional");
    setCodigo("FUNC-00" + Math.floor(Math.random() * 100));
    setDataAdmissao(new Date());
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
        keyboardType="phone-pad"
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />

      <Text className="mb-2 font-semibold">Função</Text>
      <View className="border border-gray-300 rounded-xl mb-4 overflow-hidden">
        <Picker selectedValue={funcao} onValueChange={setFuncao}>
          <Picker.Item label="Operacional" value="Operacional" />
          <Picker.Item label="Administrativo" value="Administrativo" />
          <Picker.Item label="Temporário" value="Temporário" />
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

      <FlatList
        data={funcionarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="border-b border-gray-200 py-3">
            <Text className="font-semibold">{item.nome}</Text>
            <Text className="text-gray-600">{item.telefone}</Text>
            <Text className="text-gray-600">{item.cargo}</Text>
            <Text className="text-gray-600">Status: {item.status}</Text>
            <Text className="text-gray-500 text-sm">
              Admissão:{" "}
              {new Date(item.dataAdmissao).toLocaleDateString("pt-BR")}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
