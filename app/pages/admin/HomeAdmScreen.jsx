import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import BotaoLogout from "../../components/BotaoLogout";

export default function HomeAdmScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold text-gray-800 mb-8">
        Painel do Administrador
      </Text>

      <View className="w-full max-w-sm space-y-4 gap-4">
        <TouchableOpacity
          onPress={() => navigation.navigate("CadastroFuncionario")}
          className="bg-blue-600 py-4 rounded-xl shadow-md"
        >
          <Text className="text-white text-center font-semibold text-base">
            Cadastro de Funcionário
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ListagemFuncionarios")}
          className="bg-green-600 py-4 rounded-xl shadow-md"
        >
          <Text className="text-white text-center font-semibold text-base">
            Listagem de Funcionários
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("DelimitacaoZonas")}
          className="bg-purple-600 py-4 rounded-xl shadow-md"
        >
          <Text className="text-white text-center font-semibold text-base">
            Delimitação de Zona
          </Text>
        </TouchableOpacity>

        <View className="w-full max-w-sm mb-6">
          <BotaoLogout />
        </View>
      </View>
    </View>
  );
}
