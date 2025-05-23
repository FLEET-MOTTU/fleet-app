import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { cadastrarMoto } from "../../services/motoService";

export default function CadastroMotoScreen() {
  const navigation = useNavigation();
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("ModeloSport100");
  const [estado, setEstado] = useState("PendenteColeta");

  const modelosMoto = [
    { label: "Mottu Sport", value: "ModeloSport100" },
    { label: "Mottu Pop", value: "ModeloUrbana125" },
    { label: "Mottu E", value: "ModeloTrilha150" },
  ];

  const estadosMoto = [
    { label: "Pendência", value: "PendenteColeta" },
    { label: "Reparos Simples", value: "EmReparosSimples" },
    { label: "Danos Estruturais Graves", value: "EmReparosComplexos" },
    { label: "Motor Defeituoso", value: "ManutencaoInternaEmAndamento" },
    {
      label: "Agendada para Manutenção",
      value: "AgendadaParaManutencaoExterna",
    },
    { label: "Pronta para Aluguel", value: "ProntaParaAluguel" },
    { label: "Sem Placa", value: "SemPlacaEmColeta" },
    { label: "Minha Mottu", value: "MinhaMottuEmColeta" },
  ];

  const handleConcluir = async () => {
    if (!placa && estado !== "SemPlacaEmColeta") {
      Alert.alert("Erro", "A placa é obrigatória (exceto se for 'Sem Placa')");
      return;
    }

    try {
      await cadastrarMoto({
        placa,
        modelo,
        statusMoto: estado,
      });

      Alert.alert(
        "Sucesso",
        "Cadastro concluído. Escaneie o QR Code no posto."
      );
      setPlaca("");
      setModelo("ModeloSport100");
      setEstado("PendenteColeta");
      navigation.navigate("HomeFuncionario");
    } catch (error) {
      console.error("Erro ao cadastrar moto:", error);
      Alert.alert("Erro", "Não foi possível cadastrar a moto.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-10">
      <Text className="text-2xl font-bold text-gray-800 mb-6">
        Cadastro de Moto
      </Text>

      <TextInput
        placeholder="Placa"
        value={placa}
        onChangeText={setPlaca}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />

      <Text className="mb-2 font-semibold">Modelo</Text>
      <View className="border border-gray-300 rounded-xl mb-4 overflow-hidden">
        <Picker selectedValue={modelo} onValueChange={(val) => setModelo(val)}>
          {modelosMoto.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>

      <Text className="mb-2 font-semibold">Estado da moto</Text>
      <View className="border border-gray-300 rounded-xl mb-6 overflow-hidden">
        <Picker selectedValue={estado} onValueChange={(val) => setEstado(val)}>
          {estadosMoto.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        onPress={handleConcluir}
        className="bg-green-600 py-3 rounded-xl mb-6"
      >
        <Text className="text-white text-center font-semibold text-base">
          Concluir Cadastro
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
