// components/common/HeaderMenu.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function HeaderMenu() {
  const [visible, setVisible] = useState(false);
  const { colorScheme, setColorScheme } = useColorScheme();
  const navigation = useNavigation<any>();

  async function toggleTheme() {
    const newTheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newTheme);
    await AsyncStorage.setItem("appTheme", newTheme);
    setVisible(false);
  }

  async function handleLogout() {
    try {
      // limpa dados do usuário
      await AsyncStorage.removeItem("userRole");
      await AsyncStorage.removeItem("token");

      setVisible(false);

      // volta para tela de login
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginAdm" }], // ajuste o nome da rota da sua tela de login
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
    }
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Ionicons
          name="ellipsis-vertical"
          size={24}
          color={colorScheme === "dark" ? "#fff" : "#000"}
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View className="absolute top-14 right-4 bg-background dark:bg-darkBlue rounded-xl shadow-lg p-4 w-48">
            <TouchableOpacity onPress={toggleTheme} className="py-2">
              <Text className="text-base dark:text-white">
                Modo {colorScheme === "dark" ? "Claro" : "Escuro"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} className="py-2">
              <Text className="text-base dark:text-white">Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
