import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
];

export default function CadastroFuncionarioScreen() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [funcao, setFuncao] = useState("Operacional");
  const [codigo, setCodigo] = useState(
    "FUNC-00" + Math.floor(Math.random() * 100)
  );
  const [dataAdmissao, setDataAdmissao] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [funcionarios, setFuncionarios] = useState(MOCK_FUNCIONARIOS);

  const [modalVisible, setModalVisible] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dataAdmissao;
    setMostrarDatePicker(Platform.OS === "ios");
    setDataAdmissao(currentDate);
  };

  const handleCadastrar = () => {
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

    setFuncionarios([...funcionarios, novoFuncionario]);
    Alert.alert("Sucesso", "Funcionário cadastrado com sucesso!");
    setNome("");
    setTelefone("");
    setFuncao("Operacional");
    setCodigo("FUNC-00" + Math.floor(Math.random() * 100));
    setDataAdmissao(new Date());
  };

  const abrirModalEdicao = (func) => {
    setFuncionarioSelecionado({ ...func });
    setModalVisible(true);
  };

  const salvarEdicao = () => {
    setFuncionarios((prev) =>
      prev.map((f) =>
        f.id === funcionarioSelecionado.id ? funcionarioSelecionado : f
      )
    );
    setModalVisible(false);
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

      <Text className="text-xl font-bold text-gray-800 mb-2">Funcionários</Text>
      <FlatList
        data={funcionarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="border-b border-gray-200 py-3 flex-row justify-between items-center">
            <View>
              <Text className="font-semibold">{item.nome}</Text>
              <Text className="text-gray-600">{item.telefone}</Text>
              <Text className="text-gray-600">{item.cargo}</Text>
              <Text className="text-gray-600">
                Status: {item.status ?? "Ativo"}
              </Text>
              <Text className="text-gray-500 text-sm">
                Admissão:{" "}
                {new Date(item.dataAdmissao).toLocaleDateString("pt-BR")}
              </Text>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                className="bg-yellow-400 px-3 py-1 rounded"
                onPress={() => abrirModalEdicao(item)}
              >
                <Text className="text-white font-bold">Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-red-500 px-3 py-1 rounded"
                onPress={() => {
                  Alert.alert("Confirmar exclusão", `Excluir ${item.nome}?`, [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Excluir",
                      style: "destructive",
                      onPress: () =>
                        setFuncionarios((prev) =>
                          prev.filter((f) => f.id !== item.id)
                        ),
                    },
                  ]);
                }}
              >
                <Text className="text-white font-bold">Excluir</Text>
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
                  setFuncionarioSelecionado((prev) => ({
                    ...prev,
                    cargo: val,
                  }))
                }
              >
                <Picker.Item label="Operacional" value="Operacional" />
                <Picker.Item label="Administrativo" value="Administrativo" />
                <Picker.Item label="Temporário" value="Temporário" />
              </Picker>
            </View>

            <Text className="mb-2 font-semibold">Código</Text>
            <View className="bg-gray-100 rounded-xl px-4 py-3 mb-4">
              <Text className="text-gray-500">
                {funcionarioSelecionado?.codigo}
              </Text>
            </View>

            <Text className="mb-2 font-semibold">Status</Text>
            <View className="border border-gray-300 rounded-xl mb-6 overflow-hidden">
              <Picker
                selectedValue={funcionarioSelecionado?.status}
                onValueChange={(val) =>
                  setFuncionarioSelecionado((prev) => ({
                    ...prev,
                    status: val,
                  }))
                }
              >
                <Picker.Item label="Ativo" value="Ativo" />
                <Picker.Item label="Inativo" value="Inativo" />
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
