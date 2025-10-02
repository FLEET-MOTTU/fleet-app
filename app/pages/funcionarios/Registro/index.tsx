import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import AppHeader from "../../../components/AppHeader";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";

const estados = [
  { label: "Pendência", value: "pendencia", color: "yellow" },
  { label: "Reparos simples", value: "reparos", color: "blue" },
  { label: "Danos graves", value: "danos", color: "red" },
  { label: "Motor defeituoso", value: "motor", color: "darkred" },
  { label: "Agendada manutenção", value: "manutencao", color: "gray" },
  { label: "Pronta p/ aluguel", value: "aluguel", color: "green" },
  { label: "Sem placa", value: "semplaca", color: "purple" },
];

export default function RegistroMoto({ navigation }: any) {
  const [placa, setPlaca] = useState("");
  const [estado, setEstado] = useState(null);
  const [open, setOpen] = useState(false);

  const salvarMoto = async () => {
    const novaMoto = { id: Date.now().toString(), placa, estado };

    const motosExistentes = JSON.parse(
      (await AsyncStorage.getItem("motosFuncionario")) || "[]"
    );

    await AsyncStorage.setItem(
      "motosFuncionario",
      JSON.stringify([...motosExistentes, novaMoto])
    );

    setPlaca("");
    setEstado(null);
    navigation.navigate("ResumoCadastro");
  };

  return (
    <SafeAreaWrapper>
      <AppHeader title="Registro" />

      <View className="flex-1 mt-2">
        <Text className="text-darkBlue dark:text-white mb-4">
          Agora registre a placa e o estado do veículo
        </Text>

        <TextInput
          placeholder="Placa"
          placeholderTextColor="#9CA3AF"
          value={placa}
          onChangeText={setPlaca}
          className="border rounded-xl px-4 py-3 mb-4 text-black dark:text-white dark:bg-gray-800"
        />

        <DropDownPicker
          open={open}
          value={estado}
          items={estados}
          setOpen={setOpen}
          setValue={setEstado}
          placeholder="Estado da moto"
          style={{ borderRadius: 12 }}
          placeholderStyle={{ color: "#9CA3AF" }}
          textStyle={{ color: "#111827" }}
        />

        <TouchableOpacity
          onPress={salvarMoto}
          className="bg-darkBlue py-4 rounded-xl mt-6"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Salvar Moto
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
}
