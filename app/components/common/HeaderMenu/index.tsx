// components/common/HeaderMenu.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HeaderMenu() {
  const [visible, setVisible] = useState(false);
  const { colorScheme, setColorScheme } = useColorScheme();

  async function toggleTheme() {
    const newTheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newTheme);
    await AsyncStorage.setItem("appTheme", newTheme);
    setVisible(false);
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
          className="flex-1 bg-black/30"
          onPress={() => setVisible(false)}
        >
          <View className="absolute top-14 right-4 bg-white dark:bg-darkBlue rounded-xl shadow-lg p-4 w-48">
            <TouchableOpacity onPress={toggleTheme} className="py-2">
              <Text className="text-base dark:text-white">
                Modo {colorScheme === "dark" ? "Claro" : "Escuro"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
              }}
              className="py-2"
            >
              <Text className="text-base dark:text-white">Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
