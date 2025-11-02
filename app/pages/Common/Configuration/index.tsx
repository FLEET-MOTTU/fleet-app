import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useColorScheme } from "nativewind";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../../components/Button";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import AppHeader from "../../../components/AppHeader";
import InputField from "../../../components/Input";

export default function Configuracoes() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [idioma, setIdioma] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const { colorScheme, setColorScheme } = useColorScheme();
  const [modoEscuro, setModoEscuro] = useState(colorScheme === "dark");
  const navigation = useNavigation<any>();

  useEffect(() => {
    const loadUser = async () => {
      const nomeSalvo = await AsyncStorage.getItem("userNome");
      const emailSalvo = await AsyncStorage.getItem("userEmail");
      if (nomeSalvo) setNome(nomeSalvo);
      if (emailSalvo) setEmail(emailSalvo);
    };
    loadUser();
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
    Alert.alert("Sucesso", "Alterações salvas com sucesso!");
  };

  const toggleModoEscuro = async () => {
    const novoTema = modoEscuro ? "light" : "dark";
    setColorScheme(novoTema);
    setModoEscuro(!modoEscuro);
    await AsyncStorage.setItem("appTheme", novoTema);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userRole");
    navigation.reset({ index: 0, routes: [{ name: "LoginAdm" }] });
  };

  return (
    <SafeAreaWrapper>
      <AppHeader title="Configurações" showBack={true} />

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
            Toque para alterar foto
          </Text>
        </View>

        <InputField
          label="Nome completo"
          placeholder="Seu nome completo"
          value={nome}
          onChangeText={setNome}
          icon="person"
        />

        <InputField
          label="Email"
          placeholder="exemplo@email.com"
          value={email}
          onChangeText={setEmail}
          icon="mail"
        />

        <InputField
          label="Senha"
          placeholder="********"
          value={senha}
          onChangeText={setSenha}
          icon="eye"
        />
        <TouchableOpacity>
          <Text className="text-[#2563EB] font-medium mb-5">Alterar senha</Text>
        </TouchableOpacity>

        <InputField
          label="Idioma"
          placeholder="Português"
          value={idioma}
          onChangeText={setIdioma}
          icon="chevron-down-outline"
        />

        <Text className="text-lg font-semibold text-black dark:text-white mb-3">
          Preferências
        </Text>

        <View className="bg-white dark:bg-black rounded-2xl shadow-md mb-8 p-3 gap-4">
          <TouchableOpacity
            className="flex-row justify-between items-center bg-white dark:bg-darkBlue border border-zinc-200 dark:border-zinc-900 rounded-xl px-4"
            onPress={() => navigation.navigate("SobreApp")}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3 ">
              <Ionicons name="moon" size={22} color="#4B5563" />
              <Text className="text-black dark:text-white text-[15px] font-medium">
                Modo escuro
              </Text>
            </View>
            <Switch value={modoEscuro} onValueChange={toggleModoEscuro} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center bg-white dark:bg-darkBlue  border border-zinc-300 dark:border-zinc-900  rounded-xl px-4 py-3"
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
                Sobre o App
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
          <Text className="text-white font-semibold">Sair da conta</Text>
        </TouchableOpacity>

        {/* Botões */}
        <View className="mt-10 flex-row justify-between pb-10">
          <Button
            label="Cancelar"
            onPress={() => navigation.goBack()}
            bgColor="bg-[#F3F4F6]"
            textColor="text-gray-800"
            className="w-[45%]"
          />
          <Button
            label="Salvar alterações"
            onPress={handleSalvar}
            textColor="text-white"
            className="w-[45%]"
          />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
