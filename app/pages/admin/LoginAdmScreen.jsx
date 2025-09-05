import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginAdmScreen() {
  const navigation = useNavigation();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleLoginAdm = async () => {
    if (login === "admin@fleet.com" && senha === "Admin123") {
      await AsyncStorage.setItem("userRole", "admin");
      navigation.navigate("AdminTabs");
    } else {
      setError("Login inválido. Verifique suas credenciais.");
    }f
  };

  const entrarComoFuncionario = async () => {
    await AsyncStorage.setItem("userRole", "funcionario");
    navigation.navigate("FuncionarioTabs");
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 px-6">
      <View className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
        <Text className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login ADM
        </Text>

        <TextInput
          placeholder="Login"
          value={login}
          onChangeText={setLogin}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400"
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400"
          placeholderTextColor="#9CA3AF"
        />

        {error !== "" && (
          <Text className="text-red-500 text-sm mb-4">{error}</Text>
        )}

        <TouchableOpacity
          onPress={handleLoginAdm}
          className="bg-blue-600 rounded-xl py-3 mb-3 active:opacity-80"
        >
          <Text className="text-white text-center font-semibold text-base">
            Entrar como ADM
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={entrarComoFuncionario}
          className="bg-green-600 rounded-xl py-3 mb-3 active:opacity-80"
        >
          <Text className="text-white text-center font-semibold text-base">
            Entrar como Funcionário
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text className="text-blue-600 text-sm text-center underline">
            Esqueci minha senha
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
