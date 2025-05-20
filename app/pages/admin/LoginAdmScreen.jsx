import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginAdm } from "../../services/authService";

export default function LoginAdmScreen() {
  const navigation = useNavigation();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await loginAdm({ login, senha });
      navigation.navigate("HomeAdm");
    } catch (err) {
      setError("Login inválido. Verifique suas credenciais.");
    }
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
          onPress={handleLogin}
          className="bg-blue-600 rounded-xl py-3 mb-3 active:opacity-80"
        >
          <Text className="text-white text-center font-semibold text-base">
            Entrar
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
