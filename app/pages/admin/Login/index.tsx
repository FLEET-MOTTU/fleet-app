import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import LoginService from "./services/loginService";
import AppButton from "../../../components/Button";
import Button from "../../../components/Button";
type RootStackParamList = {
  AdminTabs: undefined;
  FuncionarioTabs: undefined;
};

export default function LoginAdmScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginAdm = async () => {
    try {
      setLoading(true);
      setError("");

      //garante que não vai mandar token expirado no login
      await AsyncStorage.removeItem("token");

      // chamada de login na API
      const data = await LoginService.loginAdm({
        email: login.trim(),
        senha: senha.trim(),
      });

      if (data?.token) {
        // salva o novo token e o papel do usuário
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("userRole", "admin");

        // navega para as tabs do administrador
        navigation.navigate("AdminTabs");
      } else {
        throw new Error("Resposta inválida do servidor.");
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Credenciais inválidas. Verifique seu email e senha.");
      } else {
        setError("Erro ao autenticar administrador.");
      }
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const entrarComoFuncionario = async () => {
    await AsyncStorage.setItem("userRole", "funcionario");
    navigation.navigate("FuncionarioTabs");
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex h-56 bg-darkBlue overflow-hidden">
        <SafeAreaView className="flex-1">
          <View className="flex-1 justify-center items-center px-6">
            <Text className="text-white text-4xl font-bold text-center relative z-10">
              Bem-vindo de volta!
            </Text>
          </View>
        </SafeAreaView>
      </View>

      {/* Formulário */}
      <View className="flex-1 px-6">
        <View className="px-6 py-8 shadow-2xl elevation-8">
          {/* Email */}
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

          {/* Senha */}
          <View className="mb-8">
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4">
              <TextInput
                placeholder="Senha"
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
                  <Eye size={20} color="#2D2D2D" />
                ) : (
                  <EyeOff size={20} color="#2D2D2D" />
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
          <Button
            label="Login"
            onPress={handleLoginAdm}
            disabled={loading}
            loading={loading}
          />

          {/* Botão Funcionário */}
          <Button
            label="Entrar como Funcionário"
            onPress={entrarComoFuncionario}
          />
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
