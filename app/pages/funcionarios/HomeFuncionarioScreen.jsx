import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeFuncionarioScreen() {
  const navigation = useNavigation();
  const nomeFuncionario = "Fulano";

  return (
    <View className="flex-1 bg-white px-6 pt-10">
      <Text className="text-2xl font-bold text-gray-800 mb-6">
        Olá, {nomeFuncionario}
      </Text>

      <View className="items-center mb-10">
        <Text className="text-sm text-gray-500 mb-2">
          QR Code Entrada/Saída
        </Text>
        <View className="w-40 h-40 bg-gray-200 rounded items-center justify-center">
          <Text className="text-gray-400">[QR CODE AQUI]</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("VisualizacaoMapa")}
        className="bg-blue-600 py-4 rounded-xl mb-4 items-center"
      >
        <Text className="text-white font-semibold">Visualizar Mapa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("ListagemMotos")}
        className="bg-green-600 py-4 rounded-xl mb-4 items-center"
      >
        <Text className="text-white font-semibold">Listar Motos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("CadastroMoto")}
        className="bg-yellow-500 py-4 rounded-xl items-center"
      >
        <Text className="text-white font-semibold">Cadastrar Motos</Text>
      </TouchableOpacity>
    </View>
  );
}
