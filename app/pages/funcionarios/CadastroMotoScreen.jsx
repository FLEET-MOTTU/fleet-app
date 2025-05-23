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

export default function CadastroMotoScreen() {
  const navigation = useNavigation();
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("Mottu E");
  const [estado, setEstado] = useState("Pendência");

  const estadosMoto = [
    "Pendência",
    "Reparos Simples",
    "Danos Estruturais Graves",
    "Motor Defeituoso",
    "Agendada para Manutenção",
    "Pronta para Aluguel",
    "Sem Placa",
    "Minha Mottu",
  ];

  const modelosMoto = ["Mottu E", "Mottu Sport", "Mottu Pop"];

  const handleConcluir = () => {
    if (!placa && estado !== "Sem Placa") {
      Alert.alert("Erro", "A placa é obrigatória (exceto se for 'Sem Placa')");
      return;
    }

    Alert.alert("Sucesso", "Cadastro concluído. Escaneie o QR Code no posto.");
    setPlaca("");
    setModelo("Mottu E");
    setEstado("Pendência");
    navigation.navigate("HomeFuncionario");
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
            <Picker.Item key={index} label={item} value={item} />
          ))}
        </Picker>
      </View>

      <Text className="mb-2 font-semibold">Estado da moto</Text>
      <View className="border border-gray-300 rounded-xl mb-6 overflow-hidden">
        <Picker selectedValue={estado} onValueChange={(val) => setEstado(val)}>
          {estadosMoto.map((item, index) => (
            <Picker.Item key={index} label={item} value={item} />
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
