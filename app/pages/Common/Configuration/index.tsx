import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useColorScheme } from "nativewind";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import "../../../locales/i18n";
import Button from "../../../components/Button";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import AppHeader from "../../../components/AppHeader";
import InputField from "../../../components/Input";
import { getAdminFromToken } from "../../../services/auth/session";

export default function Configuracoes() {
  const { t, i18n } = useTranslation("config");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [idioma, setIdioma] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const { colorScheme, setColorScheme } = useColorScheme();
  const [modoEscuro, setModoEscuro] = useState(colorScheme === "dark");
  const [showLangModal, setShowLangModal] = useState(false);

  const navigation = useNavigation<any>();

  useEffect(() => {
    (async () => {
      const admin = await getAdminFromToken();
      if (admin) {
        setNome(admin.nome ?? "");
        setEmail(admin.email ?? "");
      }
    })();
  }, []);

  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) setFoto(result.assets[0].uri);
  };

  const handleSalvar = async () => {
    await AsyncStorage.setItem("userNome", nome);
    await AsyncStorage.setItem("userEmail", email);
  };

  const toggleModoEscuro = async () => {
    const novoTema = modoEscuro ? "light" : "dark";
    setColorScheme(novoTema);
    setModoEscuro(!modoEscuro);
    await AsyncStorage.setItem("appTheme", novoTema);
  };

  const toggleIdioma = async (lang?: "pt" | "es") => {
    const novo = lang
      ? lang === "es"
        ? "Español"
        : "Português"
      : idioma === "Português"
      ? "Español"
      : "Português";
    setIdioma(novo);
    const code = novo === "Español" ? "es" : "pt";
    i18n.changeLanguage(code);
    await AsyncStorage.setItem("appLanguage", code);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userRole");
    navigation.reset({ index: 0, routes: [{ name: "LoginAdm" }] });
  };

  return (
    <SafeAreaWrapper>
      <AppHeader title={t("title")} showBack={true} />

      <ScrollView className="px-4">
        <View className="items-center mt-6 mb-8">
          <TouchableOpacity onPress={escolherFoto}>
            {foto ? (
              <Image
                source={{ uri: foto }}
                className="w-24 h-24 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center border border-black dark:border-white">
                <Ionicons name="camera-outline" size={28} color="#3b82f6" />
              </View>
            )}
          </TouchableOpacity>
          <Text className="mt-2 text-sm text-black dark:text-white ">
            {t("photo")}
          </Text>
        </View>

        <InputField
          label={t("name")}
          placeholder={t("name_placeholder")}
          value={nome}
          onChangeText={setNome}
          icon="person"
          editable={false}
        />

        <InputField
          label={t("email")}
          placeholder={t("email_placeholder")}
          value={email}
          onChangeText={setEmail}
          icon="mail"
          editable={false}
        />

        <InputField
          label={t("password")}
          placeholder={t("password_placeholder")}
          value={senha}
          onChangeText={setSenha}
          icon="lock-closed-outline"
          editable={false}
        />
        <TouchableOpacity onPress={() => navigation.navigate("ChangePassword")}>
          <Text className="text-[#2563EB] font-medium mb-5">
            {t("change_password")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowLangModal(true)}>
          <InputField
            label={t("language")}
            placeholder={t("language_placeholder")}
            value={idioma}
            editable={false}
            icon="chevron-down-outline"
          />
          <Modal
            visible={showLangModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowLangModal(false)}
          >
            <View className="flex-1 bg-black/40 justify-center items-center">
              <View className="bg-white dark:bg-darkBlue w-72 rounded-2xl shadow-lg p-5">
                <Text className="text-lg font-semibold text-center mb-4 text-black dark:text-white">
                  {t("language")}
                </Text>

                <TouchableOpacity
                  onPress={() => toggleIdioma("pt")}
                  className="border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-3 mb-3"
                >
                  <Text className="text-center text-black dark:text-white ">
                    🇧🇷 Português
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => toggleIdioma("es")}
                  className="border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-3 mb-3"
                >
                  <Text className="text-center text-black dark:text-white">
                    🇪🇸 Español
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowLangModal(false)}
                  className="mt-2"
                >
                  <Text className="text-center text-[#2563EB] font-medium">
                    {t("cancel")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-black dark:text-white mb-3">
          {t("preferences")}
        </Text>

        <View className="bg-white dark:bg-black rounded-2xl shadow-md mb-8 p-3 gap-4">
          <TouchableOpacity
            className="flex-row justify-between items-center bg-white dark:bg-darkBlue border border-zinc-200 dark:border-zinc-900 rounded-xl px-4"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <Ionicons name="moon" size={22} color="#4B5563" />
              <Text className="text-black dark:text-white text-[15px] font-medium">
                {t("dark_mode")}
              </Text>
            </View>
            <Switch value={modoEscuro} onValueChange={toggleModoEscuro} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center bg-white dark:bg-darkBlue border border-zinc-300 dark:border-zinc-900 rounded-xl px-4 py-3"
            onPress={() => navigation.navigate("SobreApp")}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <Ionicons
                name="information-circle-outline"
                size={22}
                color="#4B5563"
              />
              <Text className="text-black dark:text-white text-[15px] font-medium">
                {t("about_app")}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={18}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="mt-2 border border-gray-300 bg-darkBlue h-[48px] rounded-lg flex-row justify-center items-center gap-2"
        >
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text className="text-white font-semibold">{t("logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
