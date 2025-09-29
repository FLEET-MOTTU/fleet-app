import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import BackButton from "../BackButton";

export default function AppHeader({
  title,
  showBack = false,
}: {
  title: string;
  showBack?: boolean;
}) {
  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <View className="flex-row justify-between items-center px-4 py-3 gap-24">
      {showBack ? <BackButton /> : <View style={{ width: 44 }} />}
      <Text className="text-xl font-bold dark:text-white">{title}</Text>
      <View className="ml-auto">
        <TouchableOpacity
          onPress={() =>
            setColorScheme(colorScheme === "dark" ? "light" : "dark")
          }
        >
          <Ionicons
            name={colorScheme === "dark" ? "sunny-outline" : "moon-outline"}
            size={22}
            color={colorScheme === "dark" ? "#FFD700" : "#000"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
