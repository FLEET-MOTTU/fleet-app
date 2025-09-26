import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (login === "admin@fleet.com" && senha === "Admin123") {
      await AsyncStorage.setItem("userRole", "admin");
      navigation.navigate("AdminTabs");
    } else {
      setError("Login inválido. Verifique suas credenciais.");
    }
  };

  const entrarComoFuncionario = async () => {
    await AsyncStorage.setItem("userRole", "funcionario");
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header com padrão curvo */}
      <View className="flex h-56 bg-darkBlue overflow-hidden">
        <SafeAreaView className="flex-1">
          <View className="flex-1 justify-center items-center px-6">
            {/* Padrão de linhas curvadas simulado */}

            <Text className="text-white text-4xl font-bold text-center relative z-10">
              Bem-vindo de volta!
            </Text>
          </View>
        </SafeAreaView>
      </View>

      {/* Formulário */}
      <View className="flex-1 px-6">
        <View className=" px-6 py-8 shadow-2xl elevation-8">
          {/* Campo Email */}
          <View className="mb-6">
            <TextInput
              placeholder="Email"
              value={login}
              onChangeText={setLogin}
              className="w-full px-4 py-5 rounded-2xl bg-gray-50 text-gray-900 text-lg"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Campo Password */}
          <View className="mb-8">
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4">
              <TextInput
                placeholder="Password"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
                className="flex-1 px-4 py-5 rounded-2xl bg-gray-50 text-gray-900 text-lg"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="p-2"
              >
                {showPassword ? (
                  <Eye size={20} color="#9CA3AF" />
                ) : (
                  <EyeOff size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot password */}
          <View className="flex-row justify-center items-center mb-12">
            <Text className="text-gray-500 text-lg">Esqueceu a senha? </Text>
            <TouchableOpacity>
              <Text className="text-red-500 font-semibold text-base">
                Recuperar
              </Text>
            </TouchableOpacity>
          </View>

          {error !== "" && (
            <Text className="text-red-500 text-sm mb-4 text-center">
              {error}
            </Text>
          )}

          {/* Botão Login */}
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-darkBlue rounded-2xl py-5 mb-8 shadow-lg active:opacity-90"
          >
            <Text className="text-white text-center font-semibold text-xl">
              Login
            </Text>
          </TouchableOpacity>

          {/* Botão Entrar como Funcionário (mantido conforme solicitado) */}
          <TouchableOpacity
            onPress={entrarComoFuncionario}
            className="bg-darkBlue rounded-2xl py-4 mb-6 shadow-lg active:opacity-90"
          >
            <Text className="text-white text-center font-semibold text-xl">
              Entrar como Funcionário
            </Text>
          </TouchableOpacity>

          {/* Don't have an account */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-500 text-lg">Não tem uma conta? </Text>
            <TouchableOpacity>
              <Text className="text-red-500 font-semibold text-base">
                Contate o suporte
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
