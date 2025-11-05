import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LoginService from "./services/loginService";
import Button from "../../../components/Button";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import InputField from "../../../components/Input";
import { useTranslation } from "react-i18next";
import Wave from "../../../../assets/iconWave.svg";
import Logo from "../../../../assets/LogoFleet.svg";
import LogoWhite from "../../../../assets/LogoWhite.svg";
import { useTheme } from "../../../contexts/ThemeContext";
import { useColorScheme } from "nativewind";

type RootStackParamList = {
  AdminTabs: undefined;
  FuncionarioTabs: undefined;
};

export default function LoginAdmScreen() {
  const { t } = useTranslation("login");

  const navigation = useNavigation<any>();

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const handleLoginAdm = async () => {
    try {
      setLoading(true);
      setError("");

      await AsyncStorage.removeItem("token");

      const data = await LoginService.loginAdm({
        email: login.trim(),
        senha: senha.trim(),
      });

      if (data?.token) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("userRole", "admin");

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
    <SafeAreaWrapper>
      <View className="flex-1">
        <View className="flex-1">
          <View className="px-6 py-8 shadow-2xl elevation-8">
            <View className="flex items-center mb-14">
              {isDarkMode ? <LogoWhite /> : <Logo />}
            </View>
            <View className="flex-row items-center mb-11">
              <Text className="text-4xl text-darkBlue dark:text-white text-extrabold">
                {t("welcome")}
              </Text>
              <Wave style={{ marginLeft: 24 }} />
            </View>
            <View className="mb-2 ">
              <InputField
                label={t("email")}
                placeholder={t("email_placeholder")}
                value={login}
                onChangeText={setLogin}
              />
            </View>

            <View className="flex-row items-center rounded-2xl">
              <InputField
                label={t("password")}
                placeholder={t("password_placeholder")}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
                rightIcon={showPassword ? "eye-outline" : "eye-off-outline"}
                onIconPress={() => setShowPassword(!showPassword)}
              />
            </View>

            <View className="flex-row justify-end items-center gap-12 mb-12 text-black ">
              {/* <Text className="text-lg dark:text-white">
                {t("remember_me")}
              </Text> */}
              <TouchableOpacity onPress={() => navigation.navigate("Warning")}>
                <Text className="text-lg dark:text-white">
                  {t("forgot_password")}
                </Text>
              </TouchableOpacity>
            </View>

            {error !== "" && (
              <Text className="text-red-500 text-sm mb-4 text-center">
                {error}
              </Text>
            )}

            <View className="flex gap-2">
              <Button
                label={t("login_button")}
                onPress={handleLoginAdm}
                disabled={loading}
                loading={loading}
                size={"lg"}
              />

              <Button
                label="Entrar como Funcionário"
                onPress={entrarComoFuncionario}
              />
            </View>

            <View className="flex-row flex-wrap justify-center items-center mt-20 gap-1">
              <Text className="text-black50 text-lg dark:text-white">
                {t("no_account")}
              </Text>
              <TouchableOpacity>
                <Text className="text-black font-semibold text-lg dark:text-white">
                  {t("contact_support")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
