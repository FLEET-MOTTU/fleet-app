import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeFuncionarioScreen() {
  const navigation = useNavigation();
  const [nomeFuncionario, setNomeFuncionario] = useState("Funcionário");

  useEffect(() => {
    const buscarNome = async () => {
      const nome = await AsyncStorage.getItem("nomeFuncionario");
      console.log("Nome salvo:", nome);
      setNomeFuncionario(nome || "Funcionário");
    };
    buscarNome();
  }, []);

  return (
    <View className="flex-1 bg-white px-6 pt-14">
      <Text className="text-3xl font-bold text-gray-800 mb-8">
        Olá, {nomeFuncionario}
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("VisualizacaoMapa")}
        className="flex-row items-center bg-blue-600 px-4 py-5 rounded-2xl mb-4 shadow-md"
      >
        <Ionicons name="map-outline" size={24} color="white" />
        <Text className="text-white font-semibold text-base ml-3">
          Visualizar Mapa
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("ListagemMotos")}
        className="flex-row items-center bg-green-600 px-4 py-5 rounded-2xl mb-4 shadow-md"
      >
        <Ionicons name="list-outline" size={24} color="white" />
        <Text className="text-white font-semibold text-base ml-3">
          Listar Motos
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("CadastroMoto")}
        className="flex-row items-center bg-yellow-500 px-4 py-5 rounded-2xl shadow-md"
      >
        <Ionicons name="bicycle-outline" size={24} color="white" />
        <Text className="text-white font-semibold text-base ml-3">
          Cadastrar Moto
        </Text>
      </TouchableOpacity>
    </View>
  );
}
